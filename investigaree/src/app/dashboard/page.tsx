"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  HeartPulse,
  Vote,
  Heart,
  AlertTriangle,
  Briefcase,
  DollarSign,
  Globe,
  BarChart3,
  Download,
  ChevronRight,
  TrendingUp,
  Calendar,
  FileText,
  Shield,
  Building2,
  AlertCircle,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardData";

export default function DashboardPage() {
  const {
    stats,
    tenant,
    obitos,
    candidatos,
    doadores,
    sancionados,
    loading,
    error,
    isUsingMockData,
  } = useDashboardStats();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar dados</h2>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!stats || !tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center">
        <p className="text-white/60">Nenhum dado disponivel</p>
      </div>
    );
  }

  // Alertas recentes
  const alertasRecentes = [
    ...obitos.slice(0, 3).map((o: any) => ({
      tipo: "obito",
      nome: o.nome,
      detalhe: `Falecido em ${o.ano_obito}`,
      cor: "red",
      link: "/dashboard/obitos",
    })),
    ...sancionados.map((s: any) => ({
      tipo: "sancionado",
      nome: s.nome,
      detalhe: `${s.tipo_sancao || s.tipo} - ${s.orgao_sancionador || s.orgao}`,
      cor: "red",
      link: "/dashboard/sancionados",
    })),
  ];

  // Maiores doadores
  const maioresDoadores = doadores.slice(0, 3);

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
              <Shield className="w-7 h-7 text-gold-400" />
              Dashboard - {tenant.code}
            </h1>
            <p className="text-white/60 mt-1 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {tenant.name}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60 bg-navy-800/50 px-4 py-2 rounded-lg">
            <Calendar className="w-4 h-4" />
            Atualizado em {stats.dataAtualizacao}
            {isUsingMockData && (
              <span className="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">
                Mock
              </span>
            )}
          </div>
        </div>

        {/* KPI Cards - Principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Analisados"
            value={stats.totalFuncionarios.toLocaleString()}
            icon={Users}
            color="blue"
            href="/dashboard/funcionarios"
          />
          <KPICard
            title="Obitos"
            value={stats.totais.obitos}
            icon={HeartPulse}
            color="red"
            href="/dashboard/obitos"
            alert
          />
          <KPICard
            title="Sancionados"
            value={stats.totais.sancionados}
            icon={AlertTriangle}
            color="red"
            href="/dashboard/sancionados"
            alert={stats.totais.sancionados > 0}
          />
          <KPICard
            title="OFAC Matches"
            value={stats.totais.ofacMatches}
            icon={Globe}
            color="orange"
            href="/dashboard/ofac"
          />
        </div>

        {/* KPI Cards - Secundarios */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            title="Candidatos"
            value={stats.totais.candidatos}
            icon={Vote}
            color="purple"
            href="/dashboard/candidatos"
            small
          />
          <KPICard
            title="Doadores"
            value={stats.totais.doadores}
            icon={Heart}
            color="emerald"
            href="/dashboard/doadores"
            small
          />
          <KPICard
            title="Socios"
            value={stats.totais.socios}
            icon={Briefcase}
            color="amber"
            href="/dashboard/vinculos"
            small
          />
          <KPICard
            title="Beneficiarios"
            value={stats.totais.beneficiarios}
            icon={DollarSign}
            color="cyan"
            href="/dashboard/beneficios"
            small
          />
          <KPICard
            title="CNPJs"
            value={stats.totais.cnpjs}
            icon={Building2}
            color="blue"
            href="/dashboard/vinculos"
            small
          />
        </div>

        {/* Grid Principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Alertas Criticos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 bg-red-500/5 border border-red-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alertas Criticos
              </h3>
              <span className="text-xs text-red-400/70 bg-red-500/10 px-2 py-1 rounded">
                {alertasRecentes.length} alertas
              </span>
            </div>
            <div className="space-y-3">
              {alertasRecentes.map((alerta, i) => (
                <Link
                  key={i}
                  href={alerta.link}
                  className="block bg-navy-900/50 border border-red-500/20 rounded-lg p-3 hover:border-red-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium group-hover:text-red-400 transition-colors">
                        {alerta.nome}
                      </p>
                      <p className="text-sm text-white/60">{alerta.detalhe}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-red-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/dashboard/obitos"
              className="mt-4 flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Ver todos os alertas
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Distribuicao por Grupo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-navy-900 border border-navy-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gold-400" />
              Distribuicao por Grupo
            </h3>
            <div className="space-y-4">
              {stats.grupos.map((grupo, i) => (
                <div key={grupo.nome}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{grupo.nome}</span>
                    <span className="text-white font-medium">{grupo.registros.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(grupo.registros / stats.totalFuncionarios * 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                      className={`h-full rounded-full ${i === 0 ? "bg-blue-500" : "bg-purple-500"}`}
                    />
                  </div>
                  <div className="flex gap-2 mt-2 text-xs text-white/50">
                    <span>{grupo.obitos} obitos</span>
                    <span>•</span>
                    <span>{grupo.candidatos} candidatos</span>
                    <span>•</span>
                    <span>{grupo.doadores} doadores</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Segunda Linha */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Maiores Doadores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-navy-900 border border-navy-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-400" />
                Maiores Doadores
              </h3>
              <Link href="/dashboard/doadores" className="text-xs text-emerald-400 hover:text-emerald-300">
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              {maioresDoadores.map((d: any, i: number) => (
                <Link
                  key={d.id || d.cpf || i}
                  href="/dashboard/doadores"
                  className="flex items-center justify-between p-3 bg-navy-800/50 rounded-lg hover:bg-navy-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-emerald-400 transition-colors">
                        {(d.nome || d.nome_doador || "").length > 30 ? (d.nome || d.nome_doador || "").slice(0, 30) + "..." : (d.nome || d.nome_doador || "")}
                      </p>
                      <p className="text-xs text-white/50">{d.partido} - {d.ano}</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold">
                    R$ {(d.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-navy-700 flex justify-between items-center">
              <span className="text-sm text-white/50">Total doado:</span>
              <span className="text-lg font-bold text-emerald-400">
                R$ {stats.valorTotalDoacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </motion.div>

          {/* Acoes Rapidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-navy-900 border border-navy-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-400" />
              Acesso Rapido
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                icon={BarChart3}
                label="Visao Analitica"
                href="/dashboard/analitico"
                color="cyan"
              />
              <QuickAction
                icon={FileText}
                label="Relatorios PDF"
                href="/dashboard/relatorios"
                color="gold"
              />
              <QuickAction
                icon={Download}
                label="Exportar Dados"
                href="/dashboard/exportar"
                color="blue"
              />
              <QuickAction
                icon={Users}
                label="Lista Completa"
                href="/dashboard/funcionarios"
                color="purple"
              />
            </div>

            {/* Info */}
            <div className="mt-4 pt-4 border-t border-navy-700">
              <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-gold-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gold-400 font-medium">Dados Protegidos</p>
                    <p className="text-xs text-white/60 mt-1">
                      Todas as informacoes sao confidenciais e de acesso exclusivo ao cliente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Candidatos Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-navy-900 border border-navy-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Vote className="w-5 h-5 text-purple-400" />
              Candidatos Identificados ({candidatos.length})
            </h3>
            <Link
              href="/dashboard/candidatos"
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700">
                  <th className="text-left py-2 px-3 text-sm font-medium text-white/60">Nome</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-white/60">Cargo</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-white/60">Partido</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-white/60">Situacao</th>
                </tr>
              </thead>
              <tbody>
                {candidatos.slice(0, 4).map((c: any) => (
                  <tr key={c.id || c.cpf} className="border-b border-navy-800">
                    <td className="py-2 px-3 text-white text-sm">{c.nome}</td>
                    <td className="py-2 px-3 text-white/70 text-sm">{c.cargo}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                        {c.partido}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        c.situacao === "Eleito"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : c.situacao === "Suplente"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {c.situacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function KPICard({
  title,
  value,
  icon: Icon,
  color,
  href,
  alert = false,
  small = false,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: "blue" | "red" | "purple" | "emerald" | "amber" | "cyan" | "orange" | "gold";
  href: string;
  alert?: boolean;
  small?: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:border-blue-500/60",
    red: "bg-red-500/10 text-red-400 border-red-500/30 hover:border-red-500/60",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:border-purple-500/60",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-500/60",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:border-cyan-500/60",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:border-orange-500/60",
    gold: "bg-gold-500/10 text-gold-400 border-gold-500/30 hover:border-gold-500/60",
  };

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        className={`${colorClasses[color]} border rounded-xl ${small ? "p-3" : "p-4"} transition-all cursor-pointer relative overflow-hidden group`}
      >
        {alert && (
          <div className="absolute top-2 right-2">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Icon className={`${small ? "w-5 h-5" : "w-6 h-6"}`} />
          <div>
            <p className={`font-bold ${small ? "text-xl" : "text-2xl"}`}>{value}</p>
            <p className={`${small ? "text-xs" : "text-sm"} opacity-70`}>{title}</p>
          </div>
        </div>
        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
      </motion.div>
    </Link>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
  color,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  color: "cyan" | "gold" | "blue" | "purple";
}) {
  const colorClasses = {
    cyan: "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20",
    gold: "bg-gold-500/10 text-gold-400 hover:bg-gold-500/20",
    blue: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20",
  };

  return (
    <Link
      href={href}
      className={`${colorClasses[color]} rounded-lg p-4 flex flex-col items-center gap-2 transition-all group`}
    >
      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium text-center">{label}</span>
    </Link>
  );
}
