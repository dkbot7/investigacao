#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Processamento em Lote - Verificação de CPFs
investigaree - Due Diligence Digital

Este script demonstra como processar uma lista de CPFs
verificando óbitos, benefícios e sanções.

Requisitos:
    pip install -r requirements.txt

Uso:
    python processamento_lote.py --input funcionarios.xlsx --output resultado.xlsx
"""

import os
import sys
import time
import argparse
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

import pandas as pd
from dotenv import load_dotenv

# Importar clientes das APIs
from consultas_apis import (
    Infosimples,
    PortalTransparencia,
    formatar_cpf,
    Config
)

# Carregar variáveis de ambiente
load_dotenv()

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('processamento.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)


# =============================================================================
# CONFIGURAÇÕES
# =============================================================================

class ProcessamentoConfig:
    """Configurações do processamento"""

    # Número máximo de threads para consultas paralelas
    MAX_WORKERS = 5

    # Delay entre requisições (segundos) para evitar rate limiting
    DELAY_ENTRE_REQUISICOES = 0.5

    # Timeout para cada requisição (segundos)
    TIMEOUT = 30

    # Retry em caso de falha
    MAX_RETRIES = 3


# =============================================================================
# VERIFICADORES
# =============================================================================

class VerificadorCPF:
    """Classe para verificação completa de CPF"""

    def __init__(self):
        self.infosimples = Infosimples()
        self.portal = PortalTransparencia()
        self.resultados_cache = {}

    def verificar_completo(
        self,
        cpf: str,
        data_nascimento: str = None,
        nome: str = None
    ) -> Dict[str, Any]:
        """
        Realiza verificação completa de um CPF

        Args:
            cpf: CPF a verificar
            data_nascimento: Data de nascimento (opcional, necessária para Infosimples)
            nome: Nome da pessoa (para log)

        Returns:
            Dicionário com todos os resultados
        """
        cpf_limpo = formatar_cpf(cpf)

        resultado = {
            'cpf': cpf_limpo,
            'nome_original': nome or '',
            'data_verificacao': datetime.now().isoformat(),

            # Óbito
            'esta_morto': False,
            'ano_obito': None,
            'situacao_cpf': '',

            # Benefícios
            'recebe_auxilio': False,
            'valor_auxilio': 0.0,
            'qtd_parcelas_auxilio': 0,

            # Sanções
            'sancionado_ceis': False,
            'sancionado_cnep': False,
            'detalhes_sancao': '',

            # Status
            'sucesso': True,
            'erro': ''
        }

        # 1. Verificar óbito via Infosimples (se tiver data de nascimento)
        if data_nascimento and Config.INFOSIMPLES_TOKEN:
            try:
                obito = self.infosimples.verificar_obito(cpf_limpo, data_nascimento)
                resultado['esta_morto'] = obito.get('esta_morto', False)
                resultado['ano_obito'] = obito.get('ano_obito')
                resultado['situacao_cpf'] = obito.get('situacao', '')
                logger.debug(f"CPF {cpf_limpo}: Óbito verificado")
            except Exception as e:
                logger.warning(f"CPF {cpf_limpo}: Erro ao verificar óbito: {e}")

        # 2. Verificar Auxílio Emergencial
        if Config.PORTAL_TRANSPARENCIA_KEY:
            try:
                auxilios = self.portal.consultar_auxilio_emergencial(cpf_limpo)
                if auxilios:
                    resultado['recebe_auxilio'] = True
                    resultado['valor_auxilio'] = sum(float(a.get('valor', 0)) for a in auxilios)
                    resultado['qtd_parcelas_auxilio'] = len(auxilios)
                logger.debug(f"CPF {cpf_limpo}: Auxílio verificado")
            except Exception as e:
                logger.warning(f"CPF {cpf_limpo}: Erro ao verificar auxílio: {e}")

        # 3. Verificar CEIS
        if Config.PORTAL_TRANSPARENCIA_KEY:
            try:
                ceis = self.portal.consultar_ceis(cpf_limpo)
                if ceis:
                    resultado['sancionado_ceis'] = True
                    resultado['detalhes_sancao'] = '; '.join([
                        f"{s.get('tipoSancao', '')} - {s.get('orgaoSancionador', '')}"
                        for s in ceis[:3]  # Limitar a 3 sanções
                    ])
                logger.debug(f"CPF {cpf_limpo}: CEIS verificado")
            except Exception as e:
                logger.warning(f"CPF {cpf_limpo}: Erro ao verificar CEIS: {e}")

        # 4. Verificar CNEP
        if Config.PORTAL_TRANSPARENCIA_KEY:
            try:
                cnep = self.portal.consultar_cnep(cpf_limpo)
                if cnep:
                    resultado['sancionado_cnep'] = True
                    if not resultado['detalhes_sancao']:
                        resultado['detalhes_sancao'] = '; '.join([
                            f"{s.get('tipoSancao', '')} - {s.get('orgaoSancionador', '')}"
                            for s in cnep[:3]
                        ])
                logger.debug(f"CPF {cpf_limpo}: CNEP verificado")
            except Exception as e:
                logger.warning(f"CPF {cpf_limpo}: Erro ao verificar CNEP: {e}")

        return resultado


# =============================================================================
# PROCESSADOR EM LOTE
# =============================================================================

class ProcessadorLote:
    """Processa lista de CPFs em lote"""

    def __init__(self, config: ProcessamentoConfig = None):
        self.config = config or ProcessamentoConfig()
        self.verificador = VerificadorCPF()

    def processar_arquivo(
        self,
        arquivo_entrada: str,
        arquivo_saida: str,
        coluna_cpf: str = 'cpf',
        coluna_data_nasc: str = 'data_nascimento',
        coluna_nome: str = 'nome'
    ) -> pd.DataFrame:
        """
        Processa arquivo Excel/CSV com lista de CPFs

        Args:
            arquivo_entrada: Caminho do arquivo de entrada
            arquivo_saida: Caminho do arquivo de saída
            coluna_cpf: Nome da coluna com CPF
            coluna_data_nasc: Nome da coluna com data de nascimento
            coluna_nome: Nome da coluna com nome

        Returns:
            DataFrame com resultados
        """
        logger.info(f"Lendo arquivo: {arquivo_entrada}")

        # Ler arquivo
        if arquivo_entrada.endswith('.xlsx') or arquivo_entrada.endswith('.xls'):
            df = pd.read_excel(arquivo_entrada)
        elif arquivo_entrada.endswith('.csv'):
            df = pd.read_csv(arquivo_entrada, encoding='utf-8')
        else:
            raise ValueError("Formato de arquivo não suportado. Use .xlsx, .xls ou .csv")

        logger.info(f"Total de registros: {len(df)}")

        # Verificar colunas
        if coluna_cpf not in df.columns:
            raise ValueError(f"Coluna '{coluna_cpf}' não encontrada no arquivo")

        # Processar cada CPF
        resultados = []
        total = len(df)

        for idx, row in df.iterrows():
            cpf = str(row.get(coluna_cpf, ''))

            if not cpf or cpf == 'nan':
                continue

            data_nasc = str(row.get(coluna_data_nasc, '')) if coluna_data_nasc in df.columns else None
            nome = str(row.get(coluna_nome, '')) if coluna_nome in df.columns else None

            logger.info(f"Processando {idx + 1}/{total}: {cpf[:3]}...{cpf[-2:]}")

            try:
                resultado = self.verificador.verificar_completo(cpf, data_nasc, nome)
                resultados.append(resultado)
            except Exception as e:
                logger.error(f"Erro ao processar CPF {cpf}: {e}")
                resultados.append({
                    'cpf': formatar_cpf(cpf),
                    'nome_original': nome or '',
                    'sucesso': False,
                    'erro': str(e)
                })

            # Delay entre requisições
            time.sleep(self.config.DELAY_ENTRE_REQUISICOES)

        # Criar DataFrame de resultados
        df_resultados = pd.DataFrame(resultados)

        # Mesclar com dados originais
        df_original = df.copy()
        df_original['cpf_limpo'] = df_original[coluna_cpf].apply(lambda x: formatar_cpf(str(x)))
        df_final = df_original.merge(
            df_resultados,
            left_on='cpf_limpo',
            right_on='cpf',
            how='left'
        )

        # Salvar resultado
        logger.info(f"Salvando resultado em: {arquivo_saida}")

        if arquivo_saida.endswith('.xlsx'):
            df_final.to_excel(arquivo_saida, index=False)
        else:
            df_final.to_csv(arquivo_saida, index=False, encoding='utf-8')

        # Estatísticas
        self._imprimir_estatisticas(df_final)

        return df_final

    def _imprimir_estatisticas(self, df: pd.DataFrame):
        """Imprime estatísticas do processamento"""
        print("\n" + "=" * 60)
        print("  ESTATÍSTICAS DO PROCESSAMENTO")
        print("=" * 60)

        total = len(df)
        print(f"\nTotal de registros: {total}")

        if 'esta_morto' in df.columns:
            obitos = df['esta_morto'].sum()
            print(f"Óbitos encontrados: {obitos} ({obitos/total*100:.1f}%)")

        if 'recebe_auxilio' in df.columns:
            auxilios = df['recebe_auxilio'].sum()
            print(f"Recebem auxílio: {auxilios} ({auxilios/total*100:.1f}%)")

        if 'sancionado_ceis' in df.columns:
            ceis = df['sancionado_ceis'].sum()
            print(f"Sancionados CEIS: {ceis} ({ceis/total*100:.1f}%)")

        if 'sancionado_cnep' in df.columns:
            cnep = df['sancionado_cnep'].sum()
            print(f"Sancionados CNEP: {cnep} ({cnep/total*100:.1f}%)")

        if 'sucesso' in df.columns:
            erros = (~df['sucesso']).sum()
            print(f"Erros: {erros} ({erros/total*100:.1f}%)")

        print("=" * 60 + "\n")


# =============================================================================
# CLI
# =============================================================================

def main():
    """Função principal"""
    parser = argparse.ArgumentParser(
        description='Processamento em lote de CPFs - investigaree'
    )

    parser.add_argument(
        '--input', '-i',
        required=True,
        help='Arquivo de entrada (Excel ou CSV)'
    )

    parser.add_argument(
        '--output', '-o',
        required=True,
        help='Arquivo de saída (Excel ou CSV)'
    )

    parser.add_argument(
        '--coluna-cpf',
        default='cpf',
        help='Nome da coluna com CPF (default: cpf)'
    )

    parser.add_argument(
        '--coluna-data',
        default='data_nascimento',
        help='Nome da coluna com data de nascimento (default: data_nascimento)'
    )

    parser.add_argument(
        '--coluna-nome',
        default='nome',
        help='Nome da coluna com nome (default: nome)'
    )

    parser.add_argument(
        '--delay',
        type=float,
        default=0.5,
        help='Delay entre requisições em segundos (default: 0.5)'
    )

    args = parser.parse_args()

    # Configurar
    config = ProcessamentoConfig()
    config.DELAY_ENTRE_REQUISICOES = args.delay

    # Processar
    processador = ProcessadorLote(config)

    try:
        processador.processar_arquivo(
            arquivo_entrada=args.input,
            arquivo_saida=args.output,
            coluna_cpf=args.coluna_cpf,
            coluna_data_nasc=args.coluna_data,
            coluna_nome=args.coluna_nome
        )
        logger.info("Processamento concluído com sucesso!")

    except Exception as e:
        logger.error(f"Erro no processamento: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
