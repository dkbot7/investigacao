"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Search, AlertCircle, Users, TrendingUp, ChevronLeft, ChevronRight,
  Settings2, X, ChevronUp, ChevronDown, ArrowUpDown
} from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";
import { useComurgData } from "@/contexts/ComurgDataContext";
import { FichaFuncionarioModal } from "@/components/FichaFuncionarioModal";

// Usar a interface do contexto (CSV data)
type FuncionarioCSV = ReturnType<typeof useComurgData>['funcionarios'][0];

// Interface do modal (formato Excel)
interface FuncionarioModal {
  Cadastro: number;
  Nome: string;
  CPF: string;
  Nascimento: number;
  "Admissão": number;
  Sexo: string;
  "Vínculo": string;
  "Situação": string;
  Cargo: string;
  "Salário": number;
  Diretoria: string;
  Local: string;
  Posto: string;
  "CPF Válido?": string;
  "Está Vivo?": string;
  "Está Morto?": string;
  Telefones: string;
  Emails: string;
  "Recebe Benefício (BPC)?": string;
  "Qual Benefício?": string;
  "É Sócio de Empresa?": string;
  "Qtd Empresas": number;
  "Empresas Ativas": number;
  "Vínculos Empresariais (CNPJ)": string;
  "Foi Candidato?": string;
  "Foi Doador Eleitoral?": string;
  "Possui Sanção CGU?": string;
  "Alerta OFAC?": string;
  "Classificacao Risco": string;
  "Achados Contabeis": string;
  grupo: string;
}
type FiltroGrupo = "todos" | "COMURG" | "CEDIDO";
type SortDirection = "asc" | "desc" | null;

// Definição de todas as 95 colunas disponíveis
interface ColumnDef {
  key: keyof FuncionarioCSV;
  label: string;
  defaultVisible: boolean;
  sortable: boolean;
  width?: string;
}

const ALL_COLUMNS: ColumnDef[] = [
  // Identificação Básica (8 visíveis por padrão)
  { key: "cadastro", label: "Cadastro", defaultVisible: true, sortable: true },
  { key: "nome", label: "Nome Completo", defaultVisible: true, sortable: true, width: "min-w-[250px]" },
  { key: "cpf", label: "CPF", defaultVisible: true, sortable: true },
  { key: "grupo", label: "Grupo", defaultVisible: true, sortable: true },
  { key: "cargo", label: "Cargo", defaultVisible: true, sortable: true, width: "min-w-[200px]" },
  { key: "salario", label: "Salário", defaultVisible: true, sortable: true },
  { key: "local", label: "Local", defaultVisible: true, sortable: true, width: "min-w-[300px]" },
  { key: "classificacao_risco", label: "Risco", defaultVisible: true, sortable: true },

  // Dados Pessoais
  { key: "nascimento", label: "Nascimento", defaultVisible: false, sortable: true },
  { key: "admissao", label: "Data Admissão", defaultVisible: false, sortable: true },
  { key: "sexo", label: "Sexo", defaultVisible: false, sortable: true },

  // Vínculo Funcional
  { key: "vinculo", label: "Vínculo", defaultVisible: false, sortable: true },
  { key: "situacao", label: "Situação", defaultVisible: false, sortable: true },
  { key: "diretoria", label: "Diretoria", defaultVisible: false, sortable: true, width: "min-w-[300px]" },
  { key: "posto", label: "Posto", defaultVisible: false, sortable: true },

  // Validações Básicas
  { key: "cpf_valido", label: "CPF Válido?", defaultVisible: false, sortable: true },
  { key: "esta_vivo", label: "Está Vivo?", defaultVisible: false, sortable: true },
  { key: "esta_morto", label: "Está Morto?", defaultVisible: false, sortable: true },

  // Contatos
  { key: "telefones", label: "Telefones", defaultVisible: false, sortable: false, width: "min-w-[200px]" },
  { key: "emails", label: "Emails", defaultVisible: false, sortable: false, width: "min-w-[200px]" },

  // Endereço
  { key: "endereco_logradouro", label: "Logradouro", defaultVisible: false, sortable: true, width: "min-w-[250px]" },
  { key: "endereco_numero", label: "Número", defaultVisible: false, sortable: true },
  { key: "endereco_bairro", label: "Bairro", defaultVisible: false, sortable: true },
  { key: "endereco_cidade", label: "Cidade", defaultVisible: false, sortable: true },
  { key: "endereco_uf", label: "UF", defaultVisible: false, sortable: true },
  { key: "endereco_divergente", label: "Endereço Divergente?", defaultVisible: false, sortable: true },

  // Benefícios Sociais
  { key: "recebe_beneficio", label: "Recebe Benefício?", defaultVisible: false, sortable: true },
  { key: "qual_beneficio", label: "Qual Benefício?", defaultVisible: false, sortable: false, width: "min-w-[200px]" },
  { key: "beneficio_ativo", label: "Benefício Ativo?", defaultVisible: false, sortable: true },
  { key: "data_inicio_beneficio", label: "Data Início Benefício", defaultVisible: false, sortable: true },
  { key: "fonte_beneficio", label: "Fonte Benefício", defaultVisible: false, sortable: true },
  { key: "renda_declarada_gov", label: "Renda Declarada Gov", defaultVisible: false, sortable: true },
  { key: "beneficio_possivelmente_indevido", label: "Benefício Indevido?", defaultVisible: false, sortable: true },

  // Vínculos Empresariais
  { key: "e_socio_empresa", label: "É Sócio?", defaultVisible: false, sortable: true },
  { key: "qtd_empresas", label: "Qtd Empresas", defaultVisible: false, sortable: true },
  { key: "empresas_ativas", label: "Empresas Ativas", defaultVisible: false, sortable: true },
  { key: "vinculos_empresariais", label: "Vínculos Empresariais", defaultVisible: false, sortable: false, width: "min-w-[300px]" },
  { key: "tipo_participacao_empresa", label: "Tipo Participação", defaultVisible: false, sortable: true },
  { key: "capital_social_vinculado", label: "Capital Social", defaultVisible: false, sortable: true },
  { key: "faturamento_estimado", label: "Faturamento Estimado", defaultVisible: false, sortable: true },
  { key: "cnae_principal", label: "CNAE Principal", defaultVisible: false, sortable: true },
  { key: "conflito_empresarial_basico", label: "Conflito Empresarial?", defaultVisible: false, sortable: true },
  { key: "servidor_com_empresa_ativa", label: "Servidor c/ Empresa?", defaultVisible: false, sortable: true },

  // Segundo Vínculo
  { key: "possui_vinculo_empregaticio", label: "Possui Vínculo Empregatício?", defaultVisible: false, sortable: true },
  { key: "detalhes_vinculo", label: "Detalhes Vínculo", defaultVisible: false, sortable: false, width: "min-w-[200px]" },
  { key: "tipo_segundo_vinculo", label: "Tipo Segundo Vínculo", defaultVisible: false, sortable: true },
  { key: "empregador_secundario", label: "Empregador Secundário", defaultVisible: false, sortable: true, width: "min-w-[200px]" },
  { key: "cnpj_empregador_secundario", label: "CNPJ Empregador Sec.", defaultVisible: false, sortable: true },
  { key: "renda_segundo_vinculo", label: "Renda 2º Vínculo", defaultVisible: false, sortable: true },
  { key: "data_inicio_segundo_vinculo", label: "Início 2º Vínculo", defaultVisible: false, sortable: true },
  { key: "segundo_vinculo_ativo", label: "2º Vínculo Ativo?", defaultVisible: false, sortable: true },
  { key: "indicio_duplo_vinculo", label: "Indício Duplo Vínculo?", defaultVisible: false, sortable: true },
  { key: "risco_impedimento_legal", label: "Risco Impedimento?", defaultVisible: false, sortable: true },

  // Atividade Política
  { key: "foi_candidato", label: "Foi Candidato?", defaultVisible: false, sortable: true },
  { key: "detalhes_candidatura", label: "Detalhes Candidatura", defaultVisible: false, sortable: false, width: "min-w-[200px]" },
  { key: "ano_candidatura", label: "Ano Candidatura", defaultVisible: false, sortable: true },
  { key: "cargo_disputado", label: "Cargo Disputado", defaultVisible: false, sortable: true },
  { key: "partido", label: "Partido", defaultVisible: false, sortable: true },
  { key: "situacao_candidatura", label: "Situação Candidatura", defaultVisible: false, sortable: true },
  { key: "patrimonio_2022", label: "Patrimônio 2022", defaultVisible: false, sortable: true },
  { key: "patrimonio_2024", label: "Patrimônio 2024", defaultVisible: false, sortable: true },
  { key: "variacao_patrimonial", label: "Variação Patrimonial", defaultVisible: false, sortable: true },
  { key: "perfil_politico_ativo", label: "Perfil Político Ativo?", defaultVisible: false, sortable: true },
  { key: "exposicao_politica_basica", label: "Exposição Política?", defaultVisible: false, sortable: true },

  // Doações
  { key: "foi_doador_eleitoral", label: "Doador Eleitoral?", defaultVisible: false, sortable: true },
  { key: "total_doacoes", label: "Total Doações", defaultVisible: false, sortable: true },
  { key: "detalhes_doacoes", label: "Detalhes Doações", defaultVisible: false, sortable: false, width: "min-w-[200px]" },
  { key: "ano_doacao", label: "Ano Doação", defaultVisible: false, sortable: true },
  { key: "beneficiario_doacao", label: "Beneficiário Doação", defaultVisible: false, sortable: true },
  { key: "partido_beneficiario", label: "Partido Beneficiário", defaultVisible: false, sortable: true },
  { key: "tipo_beneficiario", label: "Tipo Beneficiário", defaultVisible: false, sortable: true },
  { key: "doacao_incompativel_renda", label: "Doação Incompatível?", defaultVisible: false, sortable: true },

  // Sanções
  { key: "possui_sancao_cgu", label: "Sanção CGU?", defaultVisible: false, sortable: true },
  { key: "detalhes_sancoes", label: "Detalhes Sanções", defaultVisible: false, sortable: false, width: "min-w-[200px]" },
  { key: "alerta_ofac", label: "Alerta OFAC?", defaultVisible: false, sortable: true },
  { key: "detalhes_ofac", label: "Detalhes OFAC", defaultVisible: false, sortable: false, width: "min-w-[200px]" },
  { key: "e_pep_nacional", label: "É PEP Nacional?", defaultVisible: false, sortable: true },
  { key: "tipo_pep", label: "Tipo PEP", defaultVisible: false, sortable: true },
  { key: "data_inclusao_lista", label: "Data Inclusão Lista", defaultVisible: false, sortable: true },

  // Processos Criminais
  { key: "tem_processo_criminal", label: "Processo Criminal?", defaultVisible: false, sortable: true },
  { key: "tipo_processo", label: "Tipo Processo", defaultVisible: false, sortable: true },
  { key: "numero_processo", label: "Número Processo", defaultVisible: false, sortable: true },
  { key: "tribunal", label: "Tribunal", defaultVisible: false, sortable: true },
  { key: "status_processo", label: "Status Processo", defaultVisible: false, sortable: true },
  { key: "natureza_crime", label: "Natureza Crime", defaultVisible: false, sortable: true },
  { key: "mandado_prisao_aberto", label: "Mandado Prisão?", defaultVisible: false, sortable: true },
  { key: "condenacao_transitada", label: "Condenação Transitada?", defaultVisible: false, sortable: true },

  // Risco Contábil
  { key: "nivel_risco_contabil", label: "Nível Risco Contábil", defaultVisible: false, sortable: true },
  { key: "pontuacao_contabil", label: "Pontuação Contábil", defaultVisible: false, sortable: true },
  { key: "tipo_irregularidade", label: "Tipo Irregularidade", defaultVisible: false, sortable: true, width: "min-w-[200px]" },
  { key: "valor_dano_erario", label: "Valor Dano Erário", defaultVisible: false, sortable: true },
  { key: "achados_contabeis", label: "Achados Contábeis", defaultVisible: false, sortable: false, width: "min-w-[300px]" },
  { key: "necessita_acao_corretiva", label: "Necessita Ação Corretiva?", defaultVisible: false, sortable: true },
  { key: "necessita_comunicacao_ci", label: "Comunic. Controle Interno?", defaultVisible: false, sortable: true },
  { key: "necessita_comunicacao_tcm", label: "Comunic. TCM/MP?", defaultVisible: false, sortable: true },
];

export default function ComurgCedidosPage() {
  const { userInfo, loading: authLoading } = useUserAccess();
  const { funcionarios, loading: dataLoading, error } = useComurgData();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState<FiltroGrupo>("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<FuncionarioModal | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [columnSelectorOpen, setColumnSelectorOpen] = useState(false);

  // Estado de colunas visíveis
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('comurg-visible-columns');
      if (saved) return JSON.parse(saved);
    }
    return ALL_COLUMNS.reduce((acc, col) => ({
      ...acc,
      [col.key]: col.defaultVisible
    }), {});
  });

  // Estado de ordenação
  const [sortConfig, setSortConfig] = useState<{ key: keyof FuncionarioCSV | null; direction: SortDirection }>({
    key: null,
    direction: null
  });

  const ITENS_POR_PAGINA = 50;

  // Salvar preferências de colunas
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('comurg-visible-columns', JSON.stringify(visibleColumns));
    }
  }, [visibleColumns]);

  // Proteção: apenas usuários do tenant COMURG podem acessar
  useEffect(() => {
    if (!authLoading && userInfo?.tenant?.code !== 'COMURG') {
      router.push('/dashboard');
    }
  }, [userInfo, authLoading, router]);

  // Filtrar e ordenar funcionários
  const funcionariosProcessados = useMemo(() => {
    // Filtrar
    let filtered = funcionarios.filter(f => {
      const matchSearch = !searchTerm ||
        f.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.cpf?.includes(searchTerm) ||
        f.cadastro?.toString().includes(searchTerm);
      const matchGrupo = filtroGrupo === "todos" || f.grupo?.toUpperCase() === filtroGrupo;
      return matchSearch && matchGrupo;
    });

    // Ordenar
    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Handle null/undefined
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Compare based on type
        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue), 'pt-BR');
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [funcionarios, searchTerm, filtroGrupo, sortConfig]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const total = funcionariosProcessados.length;
    const comRisco = funcionariosProcessados.filter(f =>
      f.classificacao_risco && f.classificacao_risco !== 'Regular'
    ).length;
    const comEmpresa = funcionariosProcessados.filter(f =>
      f.empresas_ativas && Number(f.empresas_ativas) > 0
    ).length;
    const obitos = funcionariosProcessados.filter(f =>
      f.esta_morto?.toUpperCase().includes("SIM")
    ).length;

    return { total, comRisco, comEmpresa, obitos };
  }, [funcionariosProcessados]);

  // Paginação
  const totalPaginas = Math.ceil(funcionariosProcessados.length / ITENS_POR_PAGINA);
  const indiceInicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const indiceFim = indiceInicio + ITENS_POR_PAGINA;
  const funcionariosPaginados = funcionariosProcessados.slice(indiceInicio, indiceFim);

  // Resetar página quando filtro mudar
  useEffect(() => {
    setPaginaAtual(1);
  }, [searchTerm, filtroGrupo, sortConfig]);

  // Handler para abrir modal
  const abrirModal = (funcionario: FuncionarioCSV) => {
    // Converter para formato do modal
    const funcFormatado = {
      Cadastro: Number(funcionario.cadastro),
      Nome: funcionario.nome,
      CPF: funcionario.cpf,
      Nascimento: Number(funcionario.nascimento),
      "Admissão": Number(funcionario.admissao),
      Sexo: funcionario.sexo,
      "Vínculo": funcionario.vinculo,
      "Situação": funcionario.situacao,
      Cargo: funcionario.cargo,
      "Salário": Number(funcionario.salario),
      Diretoria: funcionario.diretoria,
      Local: funcionario.local,
      Posto: funcionario.posto,
      "CPF Válido?": funcionario.cpf_valido,
      "Está Vivo?": funcionario.esta_vivo,
      "Está Morto?": funcionario.esta_morto,
      Telefones: funcionario.telefones,
      Emails: funcionario.emails,
      "Recebe Benefício (BPC)?": funcionario.recebe_beneficio,
      "Qual Benefício?": funcionario.qual_beneficio,
      "É Sócio de Empresa?": funcionario.e_socio_empresa,
      "Qtd Empresas": Number(funcionario.qtd_empresas),
      "Empresas Ativas": Number(funcionario.empresas_ativas),
      "Vínculos Empresariais (CNPJ)": funcionario.vinculos_empresariais,
      "Foi Candidato?": funcionario.foi_candidato,
      "Foi Doador Eleitoral?": funcionario.foi_doador_eleitoral,
      "Possui Sanção CGU?": funcionario.possui_sancao_cgu,
      "Alerta OFAC?": funcionario.alerta_ofac,
      "Classificacao Risco": funcionario.classificacao_risco,
      "Achados Contabeis": funcionario.achados_contabeis,
      grupo: funcionario.grupo
    };
    setFuncionarioSelecionado(funcFormatado);
    setModalAberto(true);
  };

  // Handler para ordenação
  const handleSort = (key: keyof FuncionarioCSV) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        // Cycle through: asc -> desc -> null
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: null, direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  // Toggle visibilidade de coluna
  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle todas as colunas
  const toggleAllColumns = (visible: boolean) => {
    setVisibleColumns(ALL_COLUMNS.reduce((acc, col) => ({
      ...acc,
      [col.key]: visible
    }), {}));
  };

  // Colunas visíveis
  const columnsToShow = ALL_COLUMNS.filter(col => visibleColumns[col.key]);
  const visibleCount = Object.values(visibleColumns).filter(Boolean).length;

  // Format cell value
  const formatCellValue = (key: keyof FuncionarioCSV, value: any) => {
    if (value === null || value === undefined || value === '') return 'N/A';

    if (key === 'salario') {
      return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    return String(value);
  };

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px] bg-white dark:bg-navy-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-white/60">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Bloquear renderização se não for COMURG
  if (userInfo?.tenant?.code !== 'COMURG') {
    return null;
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 lg:p-8 bg-white dark:bg-navy-950">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 text-center">
            Erro ao carregar dados
          </h3>
          <p className="text-red-700 dark:text-red-300 text-center mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 bg-white dark:bg-navy-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-400" />
              Gestão de Funcionários COMURG
            </h1>
            <p className="text-slate-600 dark:text-white/60 mt-2">
              {stats.total.toLocaleString('pt-BR')} funcionários cadastrados
            </p>
          </div>
          <button
            onClick={() => setColumnSelectorOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <Settings2 className="w-5 h-5" />
            Selecionar Colunas ({visibleCount}/{ALL_COLUMNS.length})
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={Users} label="Total" value={stats.total.toLocaleString('pt-BR')} color="blue" />
          <StatsCard icon={AlertCircle} label="Com Risco" value={stats.comRisco.toLocaleString('pt-BR')} color="orange" />
          <StatsCard icon={Building2} label="Com Empresa" value={stats.comEmpresa.toLocaleString('pt-BR')} color="purple" />
          <StatsCard icon={TrendingUp} label="Óbitos" value={stats.obitos.toLocaleString('pt-BR')} color="red" />
        </div>

        {/* Abas e Filtros */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
          <div className="flex gap-2 mb-4 border-b border-navy-700 pb-2">
            <TabButton active={filtroGrupo === "todos"} onClick={() => setFiltroGrupo("todos")} label="Todos" count={funcionarios.length} />
            <TabButton active={filtroGrupo === "COMURG"} onClick={() => setFiltroGrupo("COMURG")} label="COMURG" count={funcionarios.filter(f => f.grupo?.toUpperCase() === "COMURG").length} />
            <TabButton active={filtroGrupo === "CEDIDO"} onClick={() => setFiltroGrupo("CEDIDO")} label="Cedidos" count={funcionarios.filter(f => f.grupo?.toUpperCase() === "CEDIDO").length} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou cadastro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-navy-600 rounded-lg bg-navy-800 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Tabela Excel-Style com 95 Colunas */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-navy-800 border-b-2 border-navy-600">
                <tr>
                  {columnsToShow.map((col, idx) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`px-3 py-2 text-left text-xs font-bold text-white uppercase border-r border-navy-700 ${
                        col.width || ''
                      } ${col.sortable ? 'cursor-pointer hover:bg-navy-700 select-none' : ''} ${
                        idx === 0 ? 'sticky left-0 bg-navy-800 z-10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{col.label}</span>
                        {col.sortable && (
                          <div className="flex flex-col">
                            {sortConfig.key === col.key ? (
                              sortConfig.direction === 'asc' ? (
                                <ChevronUp className="w-4 h-4 text-blue-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-blue-400" />
                              )
                            ) : (
                              <ArrowUpDown className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {funcionariosPaginados.map((func, idx) => (
                  <tr
                    key={idx}
                    onClick={() => abrirModal(func)}
                    className="hover:bg-navy-800/70 cursor-pointer transition-colors"
                  >
                    {columnsToShow.map((col, colIdx) => (
                      <td
                        key={col.key}
                        className={`px-3 py-2 text-sm text-slate-300 border-r border-navy-700/50 ${
                          colIdx === 0 ? 'sticky left-0 bg-navy-900 hover:bg-navy-800/70 font-mono text-white' : ''
                        } ${col.key === 'nome' ? 'font-medium text-white' : ''}`}
                      >
                        {col.key === 'grupo' ? (
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            func.grupo?.toUpperCase() === 'COMURG' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {func.grupo?.toUpperCase()}
                          </span>
                        ) : col.key === 'classificacao_risco' ? (
                          <RiscoBadge risco={func[col.key]} />
                        ) : (
                          formatCellValue(col.key, func[col.key])
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="px-4 py-3 bg-navy-800 border-t border-navy-700">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="px-3 py-1 bg-navy-700 hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                <span className="text-sm text-slate-300 px-3">
                  Página {paginaAtual} de {totalPaginas}
                </span>
                <button
                  onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="px-3 py-1 bg-navy-700 hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors flex items-center gap-1"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-slate-400">
                Mostrando {indiceInicio + 1} a {Math.min(indiceFim, funcionariosProcessados.length)} de {funcionariosProcessados.length.toLocaleString('pt-BR')} resultados
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de Seleção de Colunas */}
      <AnimatePresence>
        {columnSelectorOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setColumnSelectorOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-4xl bg-white dark:bg-navy-900 rounded-2xl shadow-2xl"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-navy-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Escolha as colunas para exibir: (95 disponíveis)</h2>
                    <button
                      onClick={() => setColumnSelectorOpen(false)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                  <div className="px-6 py-3 border-b border-slate-200 dark:border-navy-700 flex gap-2">
                    <button
                      onClick={() => toggleAllColumns(true)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => toggleAllColumns(false)}
                      className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded transition-colors"
                    >
                      Nenhuma
                    </button>
                  </div>
                  <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-3">
                      {ALL_COLUMNS.map((col) => (
                        <label
                          key={col.key}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-navy-800 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns[col.key] || false}
                            onChange={() => toggleColumn(col.key)}
                            className="w-5 h-5 text-blue-600 rounded border-slate-300 dark:border-navy-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-slate-200 dark:border-navy-700">
                    <button
                      onClick={() => setColumnSelectorOpen(false)}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      OK
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de Ficha Completa */}
      <FichaFuncionarioModal
        funcionario={funcionarioSelecionado}
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
      />
    </div>
  );
}

// Componentes auxiliares
interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

function StatsCard({ icon: Icon, label, value, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    orange: 'bg-orange-500/10 text-orange-500',
    red: 'bg-red-500/10 text-red-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active ? 'bg-blue-600 text-white' : 'bg-navy-800 text-slate-400 hover:bg-navy-700 hover:text-white'
      }`}
    >
      {label} <span className="ml-1 text-xs opacity-75">({count.toLocaleString('pt-BR')})</span>
    </button>
  );
}

function RiscoBadge({ risco }: { risco?: string }) {
  if (!risco || risco === 'Regular' || risco === 'Baixo') {
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400">Regular</span>;
  }
  if (risco === 'Critico' || risco === 'Crítico') {
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400">Crítico</span>;
  }
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-400">{risco}</span>;
}
