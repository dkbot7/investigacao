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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Relatorio {
  id: string;
  titulo: string;
  investigado: string;
  tipo: "pessoa_fisica" | "pessoa_juridica" | "grupo";
  status: "em_analise" | "concluido" | "pendente";
  data_criacao: string;
  data_conclusao?: string;
  analista?: string;
}

// Mock - por enquanto vazio para mostrar estado vazio
const mockRelatorios: Relatorio[] = [];

export default function RelatoriosPage() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setRelatorios(mockRelatorios);
      setLoading(false);
    }, 500);
  }, []);

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
      <div className="p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <FileText className="w-7 h-7 text-blue-400" />
              Relatórios
            </h1>
            <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              Acompanhe os relatórios das suas investigações
            </p>
          </div>

          {/* Empty State com Instruções */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-2xl text-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-slate-900 dark:text-white/30" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Nenhum relatório ainda
              </h2>

              <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mb-8 text-lg">
                Você ainda não possui relatórios de investigação. Para receber um relatório,
                primeiro é necessário solicitar uma investigação.
              </p>

              {/* Instruções */}
              <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-6 text-left mb-8">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">
                  Como iniciar uma investigação
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium">Acesse "Investigações"</p>
                      <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm">
                        No menu lateral, clique em "Investigações" para acessar a lista de investigações.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium">Clique em "Adicionar"</p>
                      <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm">
                        Escolha entre cadastrar uma Pessoa Física, Pessoa Jurídica ou enviar um arquivo
                        com múltiplos CPFs/CNPJs para análise em lote.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium">Preencha as informações</p>
                      <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm">
                        Informe os dados da pessoa ou empresa a ser investigada, o motivo da investigação
                        e o nível de urgência.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium">Aguarde o relatório</p>
                      <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm">
                        Nosso time de analistas irá processar sua solicitação. Quando concluído,
                        o relatório aparecerá aqui para você visualizar e baixar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link href="/dashboard/investigacoes?novo=true">
                <Button className="bg-blue-500 hover:bg-blue-600 text-navy-950 font-semibold px-8 py-6 text-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Iniciar Nova Investigação
                  <ArrowRight className="w-5 h-5 ml-2" />
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <FileText className="w-7 h-7 text-blue-400" />
              Relatórios
            </h1>
            <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              {relatorios.length} relatório{relatorios.length !== 1 ? 's' : ''} de investigação
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900 dark:text-white/40" />
            <input
              type="text"
              placeholder="Buscar relatórios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Lista de Relatórios */}
        <div className="space-y-4">
          {filteredRelatorios.map((relatorio) => (
            <motion.div
              key={relatorio.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 hover:border-blue-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    relatorio.tipo === 'grupo'
                      ? 'bg-blue-500/20'
                      : relatorio.tipo === 'pessoa_juridica'
                      ? 'bg-purple-500/20'
                      : 'bg-blue-500/20'
                  }`}>
                    {relatorio.tipo === 'grupo' ? (
                      <FolderOpen className="w-6 h-6 text-blue-400" />
                    ) : relatorio.tipo === 'pessoa_juridica' ? (
                      <Users className="w-6 h-6 text-purple-400" />
                    ) : (
                      <FileText className="w-6 h-6 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-medium">{relatorio.titulo}</h3>
                    <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm">{relatorio.investigado}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    relatorio.status === 'concluido'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : relatorio.status === 'em_analise'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {relatorio.status === 'concluido' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : relatorio.status === 'em_analise' ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {relatorio.status === 'concluido' ? 'Concluído' :
                     relatorio.status === 'em_analise' ? 'Em Análise' : 'Pendente'}
                  </div>

                  {/* Data */}
                  <div className="text-sm text-slate-900 dark:text-slate-500 dark:text-white/50 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {relatorio.data_criacao}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {relatorio.status === 'concluido' && (
                      <Button variant="ghost" size="sm" className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white">
                        <Download className="w-4 h-4" />
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
