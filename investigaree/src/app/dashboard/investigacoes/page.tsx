"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTenant } from "@/hooks/useTenant";
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  AlertTriangle,
  HeartPulse,
  Vote,
  Heart,
  Briefcase,
  Shield,
  X,
  UserCheck,
  UserX,
  UserPlus,
  DollarSign,
  Globe,
  LayoutList,
  LayoutGrid,
  FolderOpen,
  Database,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { FichaFuncionario } from "@/components/dashboard/FichaFuncionario";
import { AddInvestigacaoModal } from "@/components/dashboard/AddInvestigacaoModal";
import { KanbanView } from "@/components/dashboard/KanbanView";
import { UploadCsvButton } from "@/components/dashboard/UploadCsvButton";
import { JobMonitor } from "@/components/dashboard/JobMonitor";

// BACKEND INTEGRATION (Agent 3 - TAREFA 3.5)
import { getInvestigations, getInvestigationsStats } from "@/lib/api";
import type { Funcionario as FuncionarioBackend, CacheStats } from "@/lib/types/dados.types";

// Mock data imports mantidos apenas para funcionalidades complementares
// (candidaturas, doações, vínculos, sanções, benefícios ainda não estão no backend)
import {
  getCandidaturasByCPF,
  getDoacoesByCPF,
  getVinculosByCPF,
  getSancoesByCPF,
  getBeneficiosByCPF,
} from "../_data/mock-data";

type AlertaType = "todos" | "obito" | "beneficio" | "sancionado" | "doador" | "candidato" | "socio" | "grupos";

// Compatibilidade entre backend e UI (conversão de tipos)
interface Funcionario {
  id: string;
  cadastro?: string;
  nome: string;
  cpf: string;
  grupo: string;
  cargo?: string;
  salario?: number;
  esta_vivo?: string;
  esta_morto?: string;
  ano_obito?: number;
  recebe_beneficio?: number;
  qual_beneficio?: string;
  socio_empresa?: number;
  qtd_empresas?: number;
  doador_campanha?: number;
  valor_doacoes?: number;
  candidato?: number;
  sancionado_ceis?: number;
  sancionado_ofac?: number;
  is_grupo?: number;
  grupo_total_documentos?: number;
}

export default function FuncionariosPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [usingBackend, setUsingBackend] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban"); // SEMPRE INICIA EM KANBAN
  const [alertaFilter, setAlertaFilter] = useState<AlertaType>("todos");
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showJobMonitor, setShowJobMonitor] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 50;

  // Buscar tenant do usuário autenticado
  const { tenantCode, loading: tenantLoading } = useTenant();

  // Verificar se deve abrir o modal automaticamente
  useEffect(() => {
    if (searchParams.get("novo") === "true") {
      setIsAddModalOpen(true);
      // Limpar o parâmetro da URL
      router.replace("/dashboard/investigacoes", { scroll: false });
    }
  }, [searchParams, router]);

  // Converter funcionario do backend para formato UI
  const convertBackendToUI = (backendFunc: FuncionarioBackend): Funcionario => {
    return {
      id: backendFunc.id.toString(),
      nome: backendFunc.nome,
      cpf: backendFunc.cpf,
      grupo: backendFunc.grupo,
      cargo: backendFunc.cargo,
      salario: backendFunc.salario,
      esta_morto: backendFunc.esta_morto === 1 ? "SIM" : "NÃO",
      recebe_beneficio: backendFunc.recebe_beneficio,
      socio_empresa: backendFunc.socio_empresa,
    };
  };

  // Carregar dados do backend
  const loadFuncionarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar apenas investigações do próprio usuário
      const response = await getInvestigations() as any;

      // Convert to funcionarios format for now
      // TODO: Refactor page to use investigation format directly

      // Converter dados do backend para formato UI
      const investigations = response.data || response.investigacoes || [];
      const convertedFuncionarios = investigations.map((inv: any) => ({
        id: inv.id,
        nome: inv.nome,
        cpf: inv.documento,
        grupo: inv.grupo || inv.categoria || 'N/A',
        cargo: inv.tipo_pessoa === 'juridica' ? 'Empresa' : 'Pessoa Física',
        salario: 0,
        esta_morto: 'NÃO',
        recebe_beneficio: 0,
        socio_empresa: inv.tipo_pessoa === 'juridica' ? 1 : 0,
      }));

      setFuncionarios(convertedFuncionarios);
      setCacheStats(null);
      setUsingBackend(true);

      console.log('[Funcionarios] ✅ Dados carregados do backend (USER):', {
        total: response.total || investigations.length,
        cache_stats: response.cache_stats,
      });
    } catch (err: any) {
      console.error('[Funcionarios] ❌ Erro ao carregar do backend:', err);

      // Erro real - sem fallback para mock
      setFuncionarios([]);
      setCacheStats(null);
      setUsingBackend(false);
      setError(
        err.message ||
        'Erro ao conectar com o backend. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }, [tenantCode]);

  useEffect(() => {
    loadFuncionarios();
  }, [loadFuncionarios]);

  const handleAddSuccess = () => {
    loadFuncionarios(); // Recarregar lista após adicionar
  };

  // Handle CSV upload success
  const handleUploadSuccess = (jobId: number, count: number) => {
    setSuccessMessage(`${count} funcionários importados! Job #${jobId} criado.`);
    setShowJobMonitor(true);

    // Auto-hide success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000);

    // Reload data after 3 seconds to show new funcionarios
    setTimeout(() => loadFuncionarios(), 3000);
  };

  // Handle upload error
  const handleUploadError = (errorMsg: string) => {
    setError(errorMsg);
    setTimeout(() => setError(null), 5000);
  };

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...funcionarios];

    // Filtro por categoria
    if (alertaFilter !== "todos") {
      switch (alertaFilter) {
        case "obito":
          filtered = filtered.filter(f => f.esta_morto?.includes("SIM"));
          break;
        case "beneficio":
          filtered = filtered.filter(f => f.recebe_beneficio === 1);
          break;
        case "sancionado":
          filtered = filtered.filter(f => f.sancionado_ceis === 1);
          break;
        case "doador":
          filtered = filtered.filter(f => f.doador_campanha === 1);
          break;
        case "candidato":
          filtered = filtered.filter(f => f.candidato === 1);
          break;
        case "socio":
          filtered = filtered.filter(f => f.socio_empresa === 1);
          break;
        case "grupos":
          filtered = filtered.filter(f => f.is_grupo === 1);
          break;
      }
    }

    // Filtro por busca
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(f =>
        f.nome.toLowerCase().includes(searchLower) ||
        f.cpf.includes(search)
      );
    }

    setFilteredFuncionarios(filtered);
    setPage(1); // Reset page on filter change
  }, [funcionarios, alertaFilter, search]);

  // Paginação
  const paginatedFuncionarios = filteredFuncionarios.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filteredFuncionarios.length / limit);

  const getAlertasCount = (tipo: AlertaType) => {
    switch (tipo) {
      case "obito":
        return funcionarios.filter(f => f.esta_morto?.includes("SIM")).length;
      case "beneficio":
        return funcionarios.filter(f => f.recebe_beneficio === 1).length;
      case "sancionado":
        return funcionarios.filter(f => f.sancionado_ceis === 1).length;
      case "doador":
        return funcionarios.filter(f => f.doador_campanha === 1).length;
      case "candidato":
        return funcionarios.filter(f => f.candidato === 1).length;
      case "socio":
        return funcionarios.filter(f => f.socio_empresa === 1).length;
      case "grupos":
        return funcionarios.filter(f => f.is_grupo === 1).length;
      default:
        return funcionarios.length;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          {/* Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 sm:gap-3">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                Investigações
              </h1>

              {/* Backend Status Badge */}
              {usingBackend ? (
                <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  <Database className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Backend Conectado</span>
                  <span className="sm:hidden">Backend</span>
                </Badge>
              ) : (
                <Badge variant="destructive" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Modo Demo</span>
                  <span className="sm:hidden">Demo</span>
                </Badge>
              )}

              {/* Cache Stats Badge */}
              {cacheStats && (
                <Badge
                  variant={cacheStats.percentage >= 80 ? "default" : "secondary"}
                  className={`text-xs ${
                    cacheStats.percentage >= 80
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }`}
                  title={`${cacheStats.cached} cached, ${cacheStats.pending} pending, ${cacheStats.expired} expired`}
                >
                  <Database className="w-3 h-3 mr-1" />
                  Cache: {cacheStats.percentage}%
                </Badge>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              {filteredFuncionarios.length.toLocaleString()} {filteredFuncionarios.length === 1 ? 'registro' : 'registros'} de {funcionarios.length.toLocaleString()} total
            </p>

            {/* Error Message */}
            {error && (
              <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400">{error}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={loadFuncionarios}
                  className="ml-auto text-amber-400 hover:text-amber-300"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Tentar novamente
                </Button>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mt-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400">{successMessage}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSuccessMessage(null)}
                  className="ml-auto text-emerald-400 hover:text-emerald-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Actions Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900 dark:text-white/40" />
              <input
                type="text"
                placeholder="Buscar por nome ou CPF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm sm:text-base"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Toggle View Mode */}
              <div className="flex flex-1 sm:flex-none gap-1 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 sm:flex-none px-3 py-2 rounded transition-all ${
                    viewMode === "list"
                      ? "bg-blue-500 text-navy-950"
                      : "text-slate-600 dark:text-white/60 hover:text-white"
                  }`}
                  title="Visualização em Lista"
                >
                  <LayoutList className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`flex-1 sm:flex-none px-3 py-2 rounded transition-all ${
                    viewMode === "kanban"
                      ? "bg-blue-500 text-navy-950"
                      : "text-slate-600 dark:text-white/60 hover:text-white"
                  }`}
                  title="Visualização Kanban"
                >
                  <LayoutGrid className="w-4 h-4 mx-auto" />
                </button>
              </div>

              {/* Botão Adicionar */}
              <Button
                onClick={() => setIsAddModalOpen(true)}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-navy-950 font-semibold whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Adicionar</span>
              </Button>

              {/* Botão Upload CSV (TAREFA 3.12) */}
              <UploadCsvButton
                tenantCode={tenantCode}
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
              />
            </div>
          </div>
        </div>

        {/* Job Monitor (TAREFA 3.12) */}
        {showJobMonitor && (
          <JobMonitor
            autoRefresh={true}
            refreshInterval={3000}
            showCompleted={false}
            onJobComplete={(job) => {
              console.log('[FuncionariosPage] Job completed:', job);
              loadFuncionarios(); // Reload data when job completes
            }}
          />
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 dark:text-slate-500 dark:text-white/50" />
            <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-navy-300">Filtros</span>
          </div>

          {/* Categoria Filter */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setAlertaFilter("todos")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                alertaFilter === "todos"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
              }`}
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              Todos
            </button>
            <button
              onClick={() => setAlertaFilter("obito")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                alertaFilter === "obito"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
              }`}
            >
              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              Familiares
            </button>
            <button
              onClick={() => setAlertaFilter("sancionado")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                alertaFilter === "sancionado"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
              }`}
            >
              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              Clientes
            </button>
            <button
              onClick={() => setAlertaFilter("candidato")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                alertaFilter === "candidato"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
              }`}
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              Colaboradores
            </button>
            <button
              onClick={() => setAlertaFilter("doador")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                alertaFilter === "doador"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
              }`}
            >
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              Relacionamentos
            </button>
            <button
              onClick={() => setAlertaFilter("socio")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                alertaFilter === "socio"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
              }`}
            >
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
              Empresas
            </button>
            <button
              onClick={() => setAlertaFilter("grupos")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                alertaFilter === "grupos"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
              }`}
            >
              <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              Grupos
            </button>
          </div>
        </div>

        {/* View Mode: Table or Kanban */}
        {viewMode === "list" ? (
          // Table View
          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 dark:bg-navy-800/50 border-b border-slate-400 dark:border-navy-700">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Nome</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">CPF</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Grupo</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Cargo</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Status</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Alertas</th>
                    <th className="text-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFuncionarios.map((func, index) => (
                    <tr
                      key={func.id || index}
                      className="border-b border-slate-300 dark:border-navy-800 hover:bg-slate-100 dark:bg-navy-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedFuncionario(func)}
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <span className="text-slate-900 dark:text-white font-medium hover:text-blue-400 transition-colors text-xs sm:text-sm">
                          {func.nome}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-900 dark:text-slate-700 dark:text-navy-300 font-mono text-[10px] sm:text-sm">{func.cpf}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-navy-700 text-slate-900 dark:text-slate-700 dark:text-navy-300">
                          {func.grupo}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-slate-900 dark:text-slate-700 dark:text-navy-300 text-xs sm:text-sm">{func.cargo || "-"}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        {func.esta_morto?.includes("SIM") ? (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-red-500/20 text-red-400">
                            <UserX className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span className="hidden sm:inline">Obito {func.ano_obito}</span>
                            <span className="sm:hidden">Óbito</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-emerald-500/20 text-emerald-400">
                            <UserCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            Vivo
                          </span>
                        )}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex gap-0.5 sm:gap-1">
                          {func.sancionado_ceis === 1 && (
                            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-red-500/20 flex items-center justify-center" title="Sancionado">
                              <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400" />
                            </span>
                          )}
                          {func.candidato === 1 && (
                            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-purple-500/20 flex items-center justify-center" title="Candidato">
                              <Vote className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
                            </span>
                          )}
                          {func.doador_campanha === 1 && (
                            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-emerald-500/20 flex items-center justify-center" title="Doador">
                              <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                            </span>
                          )}
                          {func.socio_empresa === 1 && (
                            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-amber-500/20 flex items-center justify-center" title="Socio de Empresa">
                              <Briefcase className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-900 dark:text-white/30" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 px-3 sm:px-4 py-2 sm:py-3 border-t border-slate-400 dark:border-navy-700">
                <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-500 dark:text-white/50">
                  Mostrando {((page - 1) * limit) + 1} - {Math.min(page * limit, filteredFuncionarios.length)} de {filteredFuncionarios.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white disabled:opacity-30 text-xs sm:text-sm"
                  >
                    Anterior
                  </Button>
                  <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white disabled:opacity-30 text-xs sm:text-sm"
                  >
                    Proximo
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Kanban View
          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-3 sm:p-4 lg:p-6">
            <KanbanView
              funcionarios={filteredFuncionarios}
              onSelectFuncionario={setSelectedFuncionario}
            />
          </div>
        )}
      </motion.div>

      {/* Modal de Detalhes Completos */}
      {selectedFuncionario && (
        <FichaFuncionario
          funcionario={selectedFuncionario}
          candidaturas={getCandidaturasByCPF(selectedFuncionario.cpf)}
          doacoes={getDoacoesByCPF(selectedFuncionario.cpf)}
          vinculos={getVinculosByCPF(selectedFuncionario.cpf)}
          sancoes={getSancoesByCPF(selectedFuncionario.cpf)}
          beneficios={getBeneficiosByCPF(selectedFuncionario.cpf)}
          onClose={() => setSelectedFuncionario(null)}
        />
      )}

      {/* Modal de Adicionar Investigação */}
      <AddInvestigacaoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
