"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FichaFuncionario } from "@/components/dashboard/FichaFuncionario";

// Dados mock até a API estar pronta
import {
  CLIENTE_01_FUNCIONARIOS,
  getCandidaturasByCPF,
  getDoacoesByCPF,
  getVinculosByCPF,
  getSancoesByCPF,
  getBeneficiosByCPF,
} from "../_data/mock-data";

type AlertaType = "todos" | "obito" | "beneficio" | "sancionado" | "doador" | "candidato" | "socio";

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
}

export default function FuncionariosPage() {
  const { user } = useAuth();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [grupoFilter, setGrupoFilter] = useState<string>("todos");
  const [alertaFilter, setAlertaFilter] = useState<AlertaType>("todos");
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [page, setPage] = useState(1);
  const limit = 50;

  // Carregar dados
  useEffect(() => {
    // Por enquanto usa dados mock
    setFuncionarios(CLIENTE_01_FUNCIONARIOS);
    setLoading(false);
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...funcionarios];

    // Filtro por grupo
    if (grupoFilter !== "todos") {
      filtered = filtered.filter(f => f.grupo === grupoFilter);
    }

    // Filtro por alerta
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
  }, [funcionarios, grupoFilter, alertaFilter, search]);

  // Paginação
  const paginatedFuncionarios = filteredFuncionarios.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filteredFuncionarios.length / limit);

  // Grupos únicos
  const grupos = [...new Set(funcionarios.map(f => f.grupo))];

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
      default:
        return funcionarios.length;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="w-7 h-7 text-gold-400" />
              Funcionarios
            </h1>
            <p className="text-white/60 mt-1">
              {filteredFuncionarios.length.toLocaleString()} de {funcionarios.length.toLocaleString()} registros
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-white/50" />
            <span className="text-sm font-medium text-white/70">Filtros</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Grupo Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setGrupoFilter("todos")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  grupoFilter === "todos"
                    ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                    : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
                }`}
              >
                Todos os Grupos
              </button>
              {grupos.map(grupo => (
                <button
                  key={grupo}
                  onClick={() => setGrupoFilter(grupo)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    grupoFilter === grupo
                      ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                      : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
                  }`}
                >
                  {grupo}
                </button>
              ))}
            </div>
          </div>

          {/* Alerta Filter */}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-navy-700">
            <button
              onClick={() => setAlertaFilter("todos")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                alertaFilter === "todos"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
              }`}
            >
              <Users className="w-4 h-4" />
              Todos ({getAlertasCount("todos")})
            </button>
            <button
              onClick={() => setAlertaFilter("obito")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                alertaFilter === "obito"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              Obitos ({getAlertasCount("obito")})
            </button>
            <button
              onClick={() => setAlertaFilter("sancionado")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                alertaFilter === "sancionado"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Sancionados ({getAlertasCount("sancionado")})
            </button>
            <button
              onClick={() => setAlertaFilter("candidato")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                alertaFilter === "candidato"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
              }`}
            >
              <Vote className="w-4 h-4" />
              Candidatos ({getAlertasCount("candidato")})
            </button>
            <button
              onClick={() => setAlertaFilter("doador")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                alertaFilter === "doador"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
              }`}
            >
              <Heart className="w-4 h-4" />
              Doadores ({getAlertasCount("doador")})
            </button>
            <button
              onClick={() => setAlertaFilter("socio")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                alertaFilter === "socio"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Socios ({getAlertasCount("socio")})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy-800/50 border-b border-navy-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Nome</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">CPF</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Grupo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Cargo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Alertas</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-white/60"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedFuncionarios.map((func, index) => (
                  <tr
                    key={func.id || index}
                    className="border-b border-navy-800 hover:bg-navy-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedFuncionario(func)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-white font-medium hover:text-gold-400 transition-colors">
                        {func.nome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70 font-mono text-sm">{func.cpf}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-700 text-white/70">
                        {func.grupo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70 text-sm">{func.cargo || "-"}</td>
                    <td className="py-3 px-4">
                      {func.esta_morto?.includes("SIM") ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">
                          <UserX className="w-3 h-3" />
                          Obito {func.ano_obito}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                          <UserCheck className="w-3 h-3" />
                          Vivo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {func.sancionado_ceis === 1 && (
                          <span className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center" title="Sancionado">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                          </span>
                        )}
                        {func.candidato === 1 && (
                          <span className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center" title="Candidato">
                            <Vote className="w-3 h-3 text-purple-400" />
                          </span>
                        )}
                        {func.doador_campanha === 1 && (
                          <span className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center" title="Doador">
                            <Heart className="w-3 h-3 text-emerald-400" />
                          </span>
                        )}
                        {func.socio_empresa === 1 && (
                          <span className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center" title="Socio de Empresa">
                            <Briefcase className="w-3 h-3 text-amber-400" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <ChevronRight className="w-4 h-4 text-white/30" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-navy-700">
              <p className="text-sm text-white/50">
                Mostrando {((page - 1) * limit) + 1} - {Math.min(page * limit, filteredFuncionarios.length)} de {filteredFuncionarios.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-white/60 hover:text-white disabled:opacity-30"
                >
                  Anterior
                </Button>
                <span className="px-3 py-1 text-sm text-white/60">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-white/60 hover:text-white disabled:opacity-30"
                >
                  Proximo
                </Button>
              </div>
            </div>
          )}
        </div>
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
    </div>
  );
}
