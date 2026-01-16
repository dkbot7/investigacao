"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Users,
  FolderOpen,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getInvestigations } from "@/lib/api";
import { getAdminInvestigacoes } from "@/lib/admin-api";

// Admin emails
const ADMIN_EMAILS = ['dkbotdani@gmail.com'];

interface Relatorio {
  id: string;
  titulo: string;
  investigado: string;
  tipo: "pessoa_fisica" | "pessoa_juridica" | "grupo";
  status: "em_analise" | "concluido" | "pendente";
  data_criacao: string;
  data_conclusao?: string;
  analista?: string;
  relatorio_url?: string;
  user_email?: string; // Para admin ver de quem é o relatório
}

export default function RelatoriosPage() {
  const { user } = useAuth();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Detectar se é admin
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    const loadRelatorios = async () => {
      try {
        setLoading(true);

        // Admin vê TODOS os relatórios, usuário normal vê apenas os seus
        const response = isAdmin
          ? await getAdminInvestigacoes({ limit: 1000 }) as any
          : await getInvestigations() as any;

        const investigations = response.data || response.investigacoes || [];

        // Filtrar apenas investigações com relatório
        const relatoriosData = investigations
          .filter((inv: any) => inv.relatorio_url || inv.status === 'relatorio')
          .map((inv: any) => ({
            id: inv.id,
            titulo: `Relatório - ${inv.nome}`,
            investigado: inv.nome,
            tipo: inv.tipo_pessoa === 'juridica' ? 'pessoa_juridica' : inv.is_grupo ? 'grupo' : 'pessoa_fisica',
            status: inv.relatorio_url ? 'concluido' : 'em_analise',
            data_criacao: inv.created_at,
            data_conclusao: inv.relatorio_gerado_em,
            relatorio_url: inv.relatorio_url,
            user_email: inv.user_email, // Para admin
          }));

        setRelatorios(relatoriosData);

        console.log(`[Relatórios] ✅ Dados carregados (${isAdmin ? 'ADMIN - GLOBAL' : 'USER'}):`, {
          total: relatoriosData.length,
          isAdmin
        });
      } catch (err: any) {
        console.error('[Relatórios] ❌ Erro ao carregar:', err);
        setRelatorios([]);
      } finally {
        setLoading(false);
      }
    };

    loadRelatorios();
  }, [isAdmin]);

  const filteredRelatorios = relatorios.filter(r =>
    r.titulo.toLowerCase().includes(search.toLowerCase()) ||
    r.investigado.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Estado vazio - mostrar instruções
  if (relatorios.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 sm:gap-3">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                Relatórios
              </h1>
              {isAdmin && (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-[10px] sm:text-xs font-semibold text-blue-400 flex items-center gap-1 sm:gap-1.5">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Visão Global (Admin)</span>
                  <span className="sm:hidden">Admin</span>
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              {isAdmin
                ? "Visualizando todos os relatórios de todos os usuários"
                : "Acompanhe os relatórios das suas investigações"
              }
            </p>
          </div>

          {/* Empty State com Instruções */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-2xl text-center px-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-100 dark:bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-slate-900 dark:text-white/30" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
                Nenhum relatório ainda
              </h2>

              <p className="text-sm sm:text-lg text-slate-900 dark:text-slate-600 dark:text-white/60 mb-6 sm:mb-8">
                Você ainda não possui relatórios de investigação. Para receber um relatório,
                primeiro é necessário solicitar uma investigação.
              </p>

              {/* Instruções */}
              <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 sm:p-6 text-left mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-3 sm:mb-4">
                  Como iniciar uma investigação
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-xs sm:text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-slate-900 dark:text-white font-medium">Acesse "Investigações"</p>
                      <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
                        No menu lateral, clique em "Investigações" para acessar a lista de investigações.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-xs sm:text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-slate-900 dark:text-white font-medium">Clique em "Adicionar"</p>
                      <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
                        Escolha entre cadastrar uma Pessoa Física, Pessoa Jurídica ou enviar um arquivo
                        com múltiplos CPFs/CNPJs para análise em lote.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-xs sm:text-sm">3</span>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-slate-900 dark:text-white font-medium">Preencha as informações</p>
                      <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
                        Informe os dados da pessoa ou empresa a ser investigada, o motivo da investigação
                        e o nível de urgência.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-xs sm:text-sm">4</span>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-slate-900 dark:text-white font-medium">Aguarde o relatório</p>
                      <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
                        Nosso time de analistas irá processar sua solicitação. Quando concluído,
                        o relatório aparecerá aqui para você visualizar e baixar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link href="/dashboard/investigacoes?novo=true">
                <Button className="bg-blue-500 hover:bg-blue-600 text-navy-950 font-semibold px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Iniciar Nova Investigação
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Lista de relatórios
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
              Relatórios
            </h1>
            <p className="text-sm sm:text-base text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              {relatorios.length} relatório{relatorios.length !== 1 ? 's' : ''} de investigação
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-900 dark:text-white/40" />
            <input
              type="text"
              placeholder="Buscar relatórios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Lista de Relatórios */}
        <div className="space-y-3 sm:space-y-4">
          {filteredRelatorios.map((relatorio) => (
            <motion.div
              key={relatorio.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-3 sm:p-4 hover:border-blue-500/50 transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                    relatorio.tipo === 'grupo'
                      ? 'bg-blue-500/20'
                      : relatorio.tipo === 'pessoa_juridica'
                      ? 'bg-purple-500/20'
                      : 'bg-blue-500/20'
                  }`}>
                    {relatorio.tipo === 'grupo' ? (
                      <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    ) : relatorio.tipo === 'pessoa_juridica' ? (
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    ) : (
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base text-slate-900 dark:text-white font-medium truncate">{relatorio.titulo}</h3>
                    <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 truncate">{relatorio.investigado}</p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4">
                  {/* Status */}
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1 ${
                    relatorio.status === 'concluido'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : relatorio.status === 'em_analise'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {relatorio.status === 'concluido' ? (
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    ) : relatorio.status === 'em_analise' ? (
                      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    ) : (
                      <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    )}
                    <span className="hidden sm:inline">
                      {relatorio.status === 'concluido' ? 'Concluído' :
                       relatorio.status === 'em_analise' ? 'Em Análise' : 'Pendente'}
                    </span>
                    <span className="sm:hidden">
                      {relatorio.status === 'concluido' ? 'OK' :
                       relatorio.status === 'em_analise' ? 'Análise' : 'Pend'}
                    </span>
                  </div>

                  {/* Data */}
                  <div className="text-xs sm:text-sm text-slate-900 dark:text-slate-500 dark:text-white/50 flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{relatorio.data_criacao}</span>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-1 sm:gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white p-1.5 sm:p-2">
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                    {relatorio.status === 'concluido' && (
                      <Button variant="ghost" size="sm" className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white p-1.5 sm:p-2">
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
