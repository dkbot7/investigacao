"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Papa from "papaparse";

interface FuncionarioCompleto {
  // Identificação
  cadastro: string;
  nome: string;
  cpf: string;
  nascimento: string;
  admissao: string;
  sexo: string;
  grupo: string;

  // Vínculo Funcional
  vinculo: string;
  situacao: string;
  cargo: string;
  salario: number;
  diretoria: string;
  local: string;
  posto: string;

  // Validações Básicas
  cpf_valido: string;
  esta_vivo: string;
  esta_morto: string;

  // Contatos
  telefones: string;
  emails: string;

  // Endereço
  endereco_logradouro: string;
  endereco_numero: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_uf: string;
  endereco_divergente: string;

  // Benefícios Sociais
  recebe_beneficio: string;
  qual_beneficio: string;
  beneficio_ativo: string;
  data_inicio_beneficio: string;
  fonte_beneficio: string;
  renda_declarada_gov: string;
  beneficio_possivelmente_indevido: string;

  // Vínculos Empresariais
  e_socio_empresa: string;
  qtd_empresas: number;
  empresas_ativas: number;
  vinculos_empresariais: string;
  tipo_participacao_empresa: string;
  capital_social_vinculado: string;
  faturamento_estimado: string;
  cnae_principal: string;
  conflito_empresarial_basico: string;
  servidor_com_empresa_ativa: string;

  // Segundo Vínculo
  possui_vinculo_empregaticio: string;
  detalhes_vinculo: string;
  tipo_segundo_vinculo: string;
  empregador_secundario: string;
  cnpj_empregador_secundario: string;
  renda_segundo_vinculo: string;
  data_inicio_segundo_vinculo: string;
  segundo_vinculo_ativo: string;
  indicio_duplo_vinculo: string;
  risco_impedimento_legal: string;

  // Atividade Política
  foi_candidato: string;
  detalhes_candidatura: string;
  ano_candidatura: string;
  cargo_disputado: string;
  partido: string;
  situacao_candidatura: string;
  patrimonio_2022: string;
  patrimonio_2024: string;
  variacao_patrimonial: string;
  perfil_politico_ativo: string;
  exposicao_politica_basica: string;

  // Doações
  foi_doador_eleitoral: string;
  total_doacoes: string;
  detalhes_doacoes: string;
  ano_doacao: string;
  beneficiario_doacao: string;
  partido_beneficiario: string;
  tipo_beneficiario: string;
  doacao_incompativel_renda: string;

  // Sanções
  possui_sancao_cgu: string;
  detalhes_sancoes: string;
  alerta_ofac: string;
  detalhes_ofac: string;
  e_pep_nacional: string;
  tipo_pep: string;
  data_inclusao_lista: string;

  // Processos
  tem_processo_criminal: string;
  tipo_processo: string;
  numero_processo: string;
  tribunal: string;
  status_processo: string;
  natureza_crime: string;
  mandado_prisao_aberto: string;
  condenacao_transitada: string;

  // Risco
  nivel_risco_contabil: string;
  classificacao_risco: string;
  pontuacao_contabil: string;
  tipo_irregularidade: string;
  valor_dano_erario: string;
  achados_contabeis: string;
  necessita_acao_corretiva: string;
  necessita_comunicacao_ci: string;
  necessita_comunicacao_tcm: string;
}

interface ComurgDataContextType {
  funcionarios: FuncionarioCompleto[];
  loading: boolean;
  error: string | null;
  getFuncionarioByCpf: (cpf: string) => FuncionarioCompleto | undefined;
}

const ComurgDataContext = createContext<ComurgDataContextType | undefined>(undefined);

export function ComurgDataProvider({ children }: { children: React.ReactNode }) {
  const [funcionarios, setFuncionarios] = useState<FuncionarioCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/comurg/dados_consolidados.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false, // Keep everything as strings
          complete: (results) => {
            const data = results.data as FuncionarioCompleto[];
            console.log("Dados COMURG carregados:", data.length, "funcionários");
            console.log("Primeiro funcionário:", data[0]);
            setFuncionarios(data);
            setLoading(false);
          },
          error: (err: Error) => {
            console.error("Erro ao parsear CSV COMURG:", err);
            setError(err.message);
            setLoading(false);
          },
        });
      })
      .catch((err: Error) => {
        console.error("Erro ao carregar CSV COMURG:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getFuncionarioByCpf = (cpf: string) => {
    return funcionarios.find((f) => f.cpf === cpf);
  };

  return (
    <ComurgDataContext.Provider value={{ funcionarios, loading, error, getFuncionarioByCpf }}>
      {children}
    </ComurgDataContext.Provider>
  );
}

export function useComurgData() {
  const context = useContext(ComurgDataContext);
  if (context === undefined) {
    throw new Error("useComurgData must be used within a ComurgDataProvider");
  }
  return context;
}
