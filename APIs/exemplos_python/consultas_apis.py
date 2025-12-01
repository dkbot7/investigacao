#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Exemplos de consulta às APIs de investigação em Python
investigaree - Due Diligence Digital

Requisitos:
    pip install requests python-dotenv pandas

Uso:
    python consultas_apis.py
"""

import os
import json
import requests
from datetime import datetime
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()


# =============================================================================
# CONFIGURAÇÃO
# =============================================================================

class Config:
    """Configurações das APIs"""

    # Infosimples
    INFOSIMPLES_TOKEN = os.getenv('INFOSIMPLES_API_TOKEN', '')
    INFOSIMPLES_BASE_URL = 'https://api.infosimples.com/api/v2/consultas'

    # Portal da Transparência
    PORTAL_TRANSPARENCIA_KEY = os.getenv('PORTAL_TRANSPARENCIA_API_KEY', '')
    PORTAL_TRANSPARENCIA_URL = 'https://api.portaldatransparencia.gov.br/api-de-dados'

    # BigDataCorp
    BIGDATACORP_TOKEN = os.getenv('BIGDATACORP_TOKEN', '')
    BIGDATACORP_URL = 'https://api.bigdatacorp.com.br'

    # Escavador
    ESCAVADOR_TOKEN = os.getenv('ESCAVADOR_BEARER_TOKEN', '')
    ESCAVADOR_URL = 'https://api.escavador.com/v2'

    # investigaree API (backend)
    INVESTIGAREE_URL = os.getenv('INVESTIGAREE_API_URL', 'https://api.investigaree.com.br')
    INVESTIGAREE_TOKEN = os.getenv('INVESTIGAREE_TOKEN', '')


# =============================================================================
# UTILITÁRIOS
# =============================================================================

def formatar_cpf(cpf: str) -> str:
    """Remove formatação do CPF"""
    return ''.join(filter(str.isdigit, cpf))


def formatar_cnpj(cnpj: str) -> str:
    """Remove formatação do CNPJ"""
    return ''.join(filter(str.isdigit, cnpj))


def formatar_data(data: str) -> str:
    """Converte data para formato ddmmaaaa"""
    # Aceita formatos: dd/mm/aaaa, aaaa-mm-dd
    if '/' in data:
        partes = data.split('/')
        return f"{partes[0]}{partes[1]}{partes[2]}"
    elif '-' in data:
        partes = data.split('-')
        return f"{partes[2]}{partes[1]}{partes[0]}"
    return data


# =============================================================================
# INFOSIMPLES - Consultas CPF/CNPJ
# =============================================================================

class Infosimples:
    """Cliente para API Infosimples"""

    def __init__(self, token: str = None):
        self.token = token or Config.INFOSIMPLES_TOKEN
        self.base_url = Config.INFOSIMPLES_BASE_URL

    def consultar_cpf(self, cpf: str, data_nascimento: str) -> Dict[str, Any]:
        """
        Consulta CPF na Receita Federal via Infosimples

        Args:
            cpf: CPF (com ou sem formatação)
            data_nascimento: Data de nascimento (dd/mm/aaaa ou ddmmaaaa)

        Returns:
            Dados do CPF incluindo situação e indicador de óbito

        Exemplo:
            >>> info = Infosimples()
            >>> resultado = info.consultar_cpf('123.456.789-00', '01/01/1990')
            >>> print(resultado['nome'])
        """
        cpf_limpo = formatar_cpf(cpf)
        data_formatada = formatar_data(data_nascimento)

        url = f"{self.base_url}/receita-federal/cpf"
        params = {
            'token': self.token,
            'cpf': cpf_limpo,
            'birthdate': data_formatada
        }

        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()

        data = response.json()

        if data.get('code') != 200:
            raise Exception(f"Erro na consulta: {data.get('message', 'Erro desconhecido')}")

        return data.get('data', [{}])[0] if data.get('data') else {}

    def verificar_obito(self, cpf: str, data_nascimento: str) -> Dict[str, Any]:
        """
        Verifica se CPF está marcado como "Titular Falecido"

        Returns:
            {
                'cpf': str,
                'nome': str,
                'situacao': str,
                'esta_morto': bool,
                'ano_obito': int or None
            }
        """
        resultado = self.consultar_cpf(cpf, data_nascimento)

        situacao = resultado.get('situacao_cadastral', '').upper()
        esta_morto = 'FALECIDO' in situacao or 'ÓBITO' in situacao

        # Tentar extrair ano do óbito se disponível
        ano_obito = None
        if esta_morto and resultado.get('ano_obito'):
            ano_obito = int(resultado.get('ano_obito'))

        return {
            'cpf': formatar_cpf(cpf),
            'nome': resultado.get('nome', ''),
            'situacao': situacao,
            'esta_morto': esta_morto,
            'ano_obito': ano_obito
        }

    def consultar_cnpj(self, cnpj: str) -> Dict[str, Any]:
        """
        Consulta CNPJ na Receita Federal

        Args:
            cnpj: CNPJ (com ou sem formatação)

        Returns:
            Dados completos da empresa incluindo QSA (sócios)
        """
        cnpj_limpo = formatar_cnpj(cnpj)

        url = f"{self.base_url}/receita-federal/cnpj"
        params = {
            'token': self.token,
            'cnpj': cnpj_limpo
        }

        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()

        data = response.json()

        if data.get('code') != 200:
            raise Exception(f"Erro na consulta: {data.get('message', 'Erro desconhecido')}")

        return data.get('data', [{}])[0] if data.get('data') else {}


# =============================================================================
# PORTAL DA TRANSPARÊNCIA - Benefícios e Sanções
# =============================================================================

class PortalTransparencia:
    """Cliente para API do Portal da Transparência (CGU)"""

    def __init__(self, api_key: str = None):
        self.api_key = api_key or Config.PORTAL_TRANSPARENCIA_KEY
        self.base_url = Config.PORTAL_TRANSPARENCIA_URL
        self.headers = {
            'chave-api-dados': self.api_key,
            'Accept': 'application/json'
        }

    def consultar_auxilio_emergencial(self, cpf: str) -> List[Dict[str, Any]]:
        """
        Consulta recebimento de Auxílio Emergencial (2020-2021)

        Args:
            cpf: CPF do beneficiário

        Returns:
            Lista de parcelas recebidas
        """
        cpf_limpo = formatar_cpf(cpf)

        url = f"{self.base_url}/auxilio-emergencial-por-cpf-ou-nis"
        params = {
            'codigoBeneficiario': cpf_limpo,
            'pagina': 1
        }

        response = requests.get(url, headers=self.headers, params=params, timeout=30)
        response.raise_for_status()

        return response.json()

    def consultar_bolsa_familia(self, nis: str) -> List[Dict[str, Any]]:
        """
        Consulta recebimento de Bolsa Família / Auxílio Brasil

        Args:
            nis: NIS do beneficiário

        Returns:
            Lista de parcelas recebidas
        """
        url = f"{self.base_url}/novo-bolsa-familia-sacado-por-nis"
        params = {
            'nis': nis,
            'pagina': 1
        }

        response = requests.get(url, headers=self.headers, params=params, timeout=30)
        response.raise_for_status()

        return response.json()

    def consultar_bpc(self, nis: str) -> List[Dict[str, Any]]:
        """
        Consulta BPC (Benefício de Prestação Continuada)

        Args:
            nis: NIS do beneficiário

        Returns:
            Lista de parcelas recebidas
        """
        url = f"{self.base_url}/bpc-por-nis"
        params = {
            'nis': nis,
            'pagina': 1
        }

        response = requests.get(url, headers=self.headers, params=params, timeout=30)
        response.raise_for_status()

        return response.json()

    def consultar_ceis(self, cpf_cnpj: str) -> List[Dict[str, Any]]:
        """
        Consulta CEIS (Cadastro de Empresas Inidôneas e Suspensas)

        Args:
            cpf_cnpj: CPF ou CNPJ

        Returns:
            Lista de sanções encontradas
        """
        documento = formatar_cpf(cpf_cnpj) if len(cpf_cnpj.replace('.', '').replace('-', '').replace('/', '')) <= 11 else formatar_cnpj(cpf_cnpj)

        url = f"{self.base_url}/ceis"
        params = {
            'cnpjSancionado': documento,
            'pagina': 1
        }

        response = requests.get(url, headers=self.headers, params=params, timeout=30)
        response.raise_for_status()

        return response.json()

    def consultar_cnep(self, cpf_cnpj: str) -> List[Dict[str, Any]]:
        """
        Consulta CNEP (Cadastro Nacional de Empresas Punidas)

        Args:
            cpf_cnpj: CPF ou CNPJ

        Returns:
            Lista de sanções encontradas
        """
        documento = formatar_cpf(cpf_cnpj) if len(cpf_cnpj.replace('.', '').replace('-', '').replace('/', '')) <= 11 else formatar_cnpj(cpf_cnpj)

        url = f"{self.base_url}/cnep"
        params = {
            'cnpjSancionado': documento,
            'pagina': 1
        }

        response = requests.get(url, headers=self.headers, params=params, timeout=30)
        response.raise_for_status()

        return response.json()


# =============================================================================
# BIGDATACORP - Processos e Enriquecimento
# =============================================================================

class BigDataCorp:
    """Cliente para API BigDataCorp"""

    def __init__(self, token: str = None):
        self.token = token or Config.BIGDATACORP_TOKEN
        self.base_url = Config.BIGDATACORP_URL
        self.headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }

    def consultar_processos_cpf(self, cpf: str) -> Dict[str, Any]:
        """
        Consulta processos judiciais por CPF

        Args:
            cpf: CPF da pessoa

        Returns:
            Lista de processos encontrados
        """
        cpf_limpo = formatar_cpf(cpf)

        url = f"{self.base_url}/v1/processos/pessoa"
        payload = {
            'cpf': cpf_limpo
        }

        response = requests.post(url, headers=self.headers, json=payload, timeout=60)
        response.raise_for_status()

        return response.json()

    def consultar_dados_completos(self, cpf: str) -> Dict[str, Any]:
        """
        Consulta dados completos de uma pessoa

        Inclui: dados cadastrais, endereços, telefones, emails,
        processos, vínculos empresariais, etc.
        """
        cpf_limpo = formatar_cpf(cpf)

        url = f"{self.base_url}/v1/pessoa/completo"
        payload = {
            'cpf': cpf_limpo
        }

        response = requests.post(url, headers=self.headers, json=payload, timeout=60)
        response.raise_for_status()

        return response.json()


# =============================================================================
# ESCAVADOR - Processos Judiciais
# =============================================================================

class Escavador:
    """Cliente para API Escavador"""

    def __init__(self, token: str = None):
        self.token = token or Config.ESCAVADOR_TOKEN
        self.base_url = Config.ESCAVADOR_URL
        self.headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }

    def buscar_processos_cpf(self, cpf: str) -> Dict[str, Any]:
        """
        Busca processos judiciais por CPF

        Args:
            cpf: CPF da pessoa

        Returns:
            Lista de processos com metadados
        """
        cpf_limpo = formatar_cpf(cpf)

        url = f"{self.base_url}/processos/busca"
        payload = {
            'cpf': cpf_limpo
        }

        response = requests.post(url, headers=self.headers, json=payload, timeout=60)
        response.raise_for_status()

        return response.json()

    def obter_capa_processo(self, numero_processo: str) -> Dict[str, Any]:
        """
        Obtém a capa (informações básicas) de um processo

        Args:
            numero_processo: Número CNJ do processo

        Returns:
            Dados da capa do processo
        """
        url = f"{self.base_url}/processos/{numero_processo}/capa"

        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()

        return response.json()

    def obter_movimentacoes(self, numero_processo: str) -> Dict[str, Any]:
        """
        Obtém movimentações de um processo

        Args:
            numero_processo: Número CNJ do processo

        Returns:
            Lista de movimentações
        """
        url = f"{self.base_url}/processos/{numero_processo}/movimentacoes"

        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()

        return response.json()


# =============================================================================
# INVESTIGAREE API - Backend Interno
# =============================================================================

class InvestigareeAPI:
    """Cliente para API do investigaree (backend)"""

    def __init__(self, token: str = None, base_url: str = None):
        self.token = token or Config.INVESTIGAREE_TOKEN
        self.base_url = base_url or Config.INVESTIGAREE_URL
        self.headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }

    def health_check(self) -> Dict[str, Any]:
        """Verifica status da API"""
        url = f"{self.base_url}/health"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()

    def obter_tenant_info(self) -> Dict[str, Any]:
        """Obtém informações do tenant do usuário autenticado"""
        url = f"{self.base_url}/api/tenant/info"
        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def obter_dashboard(self) -> Dict[str, Any]:
        """Obtém dados consolidados do dashboard"""
        url = f"{self.base_url}/api/tenant/dashboard"
        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def listar_funcionarios(
        self,
        grupo: str = None,
        alerta: str = None,
        busca: str = None,
        page: int = 1,
        limit: int = 50
    ) -> Dict[str, Any]:
        """
        Lista funcionários com filtros

        Args:
            grupo: Filtrar por grupo (ex: "Comurg", "Disposicao")
            alerta: Filtrar por tipo de alerta (obito, beneficio, sancionado, doador, candidato, socio)
            busca: Busca por nome ou CPF
            page: Página
            limit: Itens por página

        Returns:
            Lista paginada de funcionários
        """
        url = f"{self.base_url}/api/tenant/funcionarios"
        params = {
            'page': page,
            'limit': limit
        }

        if grupo:
            params['grupo'] = grupo
        if alerta:
            params['alerta'] = alerta
        if busca:
            params['busca'] = busca

        response = requests.get(url, headers=self.headers, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    def listar_obitos(self) -> Dict[str, Any]:
        """Lista funcionários falecidos"""
        url = f"{self.base_url}/api/tenant/obitos"
        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def listar_candidatos(self) -> Dict[str, Any]:
        """Lista funcionários que foram candidatos"""
        url = f"{self.base_url}/api/tenant/candidatos"
        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def listar_doadores(self) -> Dict[str, Any]:
        """Lista funcionários que doaram para campanhas"""
        url = f"{self.base_url}/api/tenant/doadores"
        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def listar_sancionados(self) -> Dict[str, Any]:
        """Lista funcionários com sanções"""
        url = f"{self.base_url}/api/tenant/sancionados"
        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def listar_vinculos(self) -> Dict[str, Any]:
        """Lista vínculos empresariais"""
        url = f"{self.base_url}/api/tenant/vinculos"
        response = requests.get(url, headers=self.headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def exportar_dados(self, tipo: str, grupo: str = None, alerta: str = None) -> bytes:
        """
        Exporta dados em CSV

        Args:
            tipo: Tipo de dados (funcionarios, obitos, candidatos, doadores, vinculos)
            grupo: Filtrar por grupo
            alerta: Filtrar por alerta

        Returns:
            Conteúdo CSV em bytes
        """
        url = f"{self.base_url}/api/tenant/export/{tipo}"
        params = {}

        if grupo:
            params['grupo'] = grupo
        if alerta:
            params['alerta'] = alerta

        response = requests.get(url, headers=self.headers, params=params, timeout=60)
        response.raise_for_status()
        return response.content


# =============================================================================
# EXEMPLO DE USO
# =============================================================================

def exemplo_consulta_cpf():
    """Exemplo de consulta de CPF com verificação de óbito"""
    print("\n=== Exemplo: Consulta CPF ===\n")

    info = Infosimples()

    # CPF de exemplo (usar CPF real em produção)
    cpf = "123.456.789-00"
    data_nascimento = "01/01/1990"

    try:
        resultado = info.verificar_obito(cpf, data_nascimento)

        print(f"CPF: {resultado['cpf']}")
        print(f"Nome: {resultado['nome']}")
        print(f"Situação: {resultado['situacao']}")
        print(f"Está morto: {'SIM' if resultado['esta_morto'] else 'NÃO'}")

        if resultado['ano_obito']:
            print(f"Ano do óbito: {resultado['ano_obito']}")

    except Exception as e:
        print(f"Erro: {e}")


def exemplo_consulta_beneficios():
    """Exemplo de consulta de benefícios sociais"""
    print("\n=== Exemplo: Consulta Benefícios ===\n")

    portal = PortalTransparencia()

    cpf = "12345678900"

    try:
        # Auxílio Emergencial
        auxilios = portal.consultar_auxilio_emergencial(cpf)

        if auxilios:
            print(f"Auxílio Emergencial: {len(auxilios)} parcelas encontradas")
            total = sum(float(a.get('valor', 0)) for a in auxilios)
            print(f"Total recebido: R$ {total:,.2f}")
        else:
            print("Nenhum Auxílio Emergencial encontrado")

        # CEIS
        sancoes = portal.consultar_ceis(cpf)

        if sancoes:
            print(f"\nSanções CEIS: {len(sancoes)} encontradas")
            for s in sancoes:
                print(f"  - {s.get('nomeSancionado')}: {s.get('tipoSancao')}")
        else:
            print("\nNenhuma sanção CEIS encontrada")

    except Exception as e:
        print(f"Erro: {e}")


def exemplo_api_investigaree():
    """Exemplo de uso da API do investigaree"""
    print("\n=== Exemplo: API investigaree ===\n")

    api = InvestigareeAPI()

    try:
        # Health check
        status = api.health_check()
        print(f"Status: {status.get('status')}")
        print(f"Versão: {status.get('version')}")

        # Dashboard (requer autenticação)
        if api.token:
            dashboard = api.obter_dashboard()
            stats = dashboard.get('stats', {})

            print(f"\nEstatísticas:")
            print(f"  Total funcionários: {stats.get('total_funcionarios', 0)}")
            print(f"  Óbitos: {stats.get('total_obitos', 0)}")
            print(f"  Candidatos: {stats.get('total_candidatos', 0)}")
            print(f"  Doadores: {stats.get('total_doadores', 0)}")
            print(f"  Sancionados: {stats.get('total_sancionados', 0)}")

    except Exception as e:
        print(f"Erro: {e}")


if __name__ == '__main__':
    print("=" * 60)
    print("  investigaree - Exemplos de Consulta em Python")
    print("=" * 60)

    # Executar exemplos
    exemplo_consulta_cpf()
    exemplo_consulta_beneficios()
    exemplo_api_investigaree()

    print("\n" + "=" * 60)
    print("  Fim dos exemplos")
    print("=" * 60)
