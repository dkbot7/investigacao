"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  HeartPulse,
  Vote,
  Heart,
  Briefcase,
  UserCheck,
  UserX,
  Shield,
  Clock,
  FolderOpen,
  DollarSign,
} from "lucide-react";

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
  // Kanban integration fields
  tipo?: string;
  custo?: number;
  consultado_em?: string;
  metadata?: string | Record<string, any>;
}

interface KanbanViewProps {
  funcionarios: Funcionario[];
  onSelectFuncionario: (func: Funcionario) => void;
}

type InvestigationStatus = "investigar" | "investigando" | "relatorio" | "monitoramento" | "aprovado" | "bloqueado";

interface KanbanColumn {
  id: InvestigationStatus;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}

const columns: KanbanColumn[] = [
  {
    id: "investigar",
    title: "Investigar",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: Clock,
  },
  {
    id: "investigando",
    title: "Investigando",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: Shield,
  },
  {
    id: "relatorio",
    title: "Relatório",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    icon: UserCheck,
  },
  {
    id: "monitoramento",
    title: "Monitoramento",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    icon: Shield,
  },
  {
    id: "aprovado",
    title: "Aprovado",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: UserCheck,
  },
  {
    id: "bloqueado",
    title: "Bloqueado",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: AlertTriangle,
  },
];

export function KanbanView({ funcionarios, onSelectFuncionario }: KanbanViewProps) {
  // Get investigation status from database field (or default to 'investigar')
  const getInvestigationStatus = (func: Funcionario): InvestigationStatus => {
    // Use status_investigacao field from database
    // Default to "investigar" if not set
    const status = (func as any).status_investigacao || "investigar";

    // Validate status is one of the allowed values
    const validStatuses: InvestigationStatus[] = [
      "investigar",
      "investigando",
      "relatorio",
      "monitoramento",
      "aprovado",
      "bloqueado"
    ];

    return validStatuses.includes(status as InvestigationStatus)
      ? (status as InvestigationStatus)
      : "investigar";
  };

  // Group funcionarios by status
  const groupedByStatus = funcionarios.reduce((acc, func) => {
    const status = getInvestigationStatus(func);
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(func);
    return acc;
  }, {} as Record<InvestigationStatus, Funcionario[]>);

  const maskCPF = (cpf: string) => {
    if (cpf.length === 11) {
      return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
    }
    return cpf;
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnFuncionarios = groupedByStatus[column.id] || [];
        const Icon = column.icon;

        // Calculate total cost for this column
        const totalCost = columnFuncionarios.reduce((sum, func) => {
          return sum + (func.custo || 0);
        }, 0);

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl overflow-hidden"
          >
            {/* Column Header */}
            <div className={`p-4 border-b border-slate-400 dark:border-navy-700 ${column.bgColor} ${column.borderColor} border-t-2`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${column.color}`} />
                  <h3 className={`font-semibold ${column.color}`}>{column.title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${column.bgColor} ${column.color}`}>
                  {columnFuncionarios.length}
                </span>
              </div>

              {/* Total Cost Badge */}
              {totalCost > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-900 dark:text-white/60">
                  <DollarSign className="w-3 h-3" />
                  <span className="font-mono">
                    R$ {totalCost.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Column Cards */}
            <div className="p-3 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {columnFuncionarios.length === 0 ? (
                <p className="text-center text-slate-900 dark:text-white/40 text-sm py-8">Nenhum funcionário</p>
              ) : (
                columnFuncionarios.map((func, index) => (
                  <motion.div
                    key={func.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelectFuncionario(func)}
                    className="bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg p-3 hover:border-blue-500/50 transition-all cursor-pointer group"
                  >
                    {/* If it's a group */}
                    {func.is_grupo === 1 ? (
                      <>
                        {/* Group Icon and Name */}
                        <div className="flex items-center gap-2 mb-2">
                          <FolderOpen className="w-5 h-5 text-blue-400" />
                          <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors truncate">
                            {func.nome}
                          </h4>
                        </div>

                        {/* Document Count */}
                        <p className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70 mb-3">
                          {func.grupo_total_documentos} documento{func.grupo_total_documentos !== 1 ? 's' : ''}
                        </p>

                        {/* Group Badge */}
                        <div className="mb-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            <FolderOpen className="w-3 h-3" />
                            Análise em Lote
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Name */}
                        <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors mb-2 truncate">
                          {func.nome}
                        </h4>

                        {/* CPF */}
                        <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 font-mono mb-2">{maskCPF(func.cpf)}</p>

                        {/* Grupo and Cargo */}
                        <div className="space-y-1 mb-3">
                          <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-700 text-slate-900 dark:text-slate-700 dark:text-white/70">
                            {func.grupo}
                          </div>
                          {func.cargo && (
                            <p className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">{func.cargo}</p>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="mb-3">
                          {func.esta_morto?.includes("SIM") ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">
                              <UserX className="w-3 h-3" />
                              Óbito {func.ano_obito}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                              <UserCheck className="w-3 h-3" />
                              Vivo
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    {/* Alert Badges (only for individual people, not groups) */}
                    {func.is_grupo !== 1 && (
                      <>
                        <div className="flex flex-wrap gap-1">
                          {func.sancionado_ceis === 1 && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400"
                              title="Sancionado CEIS"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span className="hidden sm:inline">Sancionado</span>
                            </span>
                          )}
                          {func.candidato === 1 && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400"
                              title="Candidato Político"
                            >
                              <Vote className="w-3 h-3" />
                              <span className="hidden sm:inline">Candidato</span>
                            </span>
                          )}
                          {func.doador_campanha === 1 && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400"
                              title="Doador de Campanha"
                            >
                              <Heart className="w-3 h-3" />
                              <span className="hidden sm:inline">Doador</span>
                            </span>
                          )}
                          {func.socio_empresa === 1 && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400"
                              title="Sócio de Empresa"
                            >
                              <Briefcase className="w-3 h-3" />
                              <span className="hidden sm:inline">Sócio ({func.qtd_empresas})</span>
                            </span>
                          )}
                        </div>

                        {/* Salary (if exists) */}
                        {func.salario && (
                          <p className="text-xs text-slate-900 dark:text-white/40 mt-2">
                            Salário: R$ {func.salario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        )}

                        {/* Cost Badge (if exists) */}
                        {func.custo && func.custo > 0 && (
                          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-400 dark:border-navy-700">
                            <DollarSign className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs text-slate-900 dark:text-white/60 font-mono">
                              R$ {func.custo.toFixed(2)}
                            </span>
                            {func.tipo && (
                              <span className="text-xs text-slate-900 dark:text-white/40 ml-1">
                                • {func.tipo.replace('consulta_', '').toUpperCase()}
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
