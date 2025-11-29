"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  AlertTriangle,
  HeartPulse,
  Vote,
  Heart,
  Briefcase,
  Globe,
  DollarSign,
  Calendar,
  Building2,
  Download,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CLIENTE_01_STATS,
  CLIENTE_01_OBITOS,
  CLIENTE_01_CANDIDATOS,
  CLIENTE_01_DOADORES,
  CLIENTE_01_SANCIONADOS,
  CLIENTE_01_BENEFICIOS,
  CLIENTE_01_VINCULOS,
  CLIENTE_01_OFAC,
} from "../_data/mock-data";

export default function AnaliticoPage() {
  // Calculos para os graficos
  const totalFuncionarios = CLIENTE_01_STATS.totalFuncionarios;
  const grupoComurg = CLIENTE_01_STATS.grupos.find(g => g.nome === "Comurg");
  const grupoDisposicao = CLIENTE_01_STATS.grupos.find(g => g.nome === "Disposicao");

  // Dados por ano de obito
  const obitosPorAno = CLIENTE_01_OBITOS.reduce((acc, o) => {
    acc[o.ano_obito] = (acc[o.ano_obito] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Dados por partido (candidatos)
  const candidatosPorPartido = CLIENTE_01_CANDIDATOS.reduce((acc, c) => {
    acc[c.partido] = (acc[c.partido] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Dados por ano (doacoes)
  const doacoesPorAno = CLIENTE_01_DOADORES.reduce((acc, d) => {
    acc[d.ano] = (acc[d.ano] || 0) + d.valor;
    return acc;
  }, {} as Record<number, number>);

  // Situacao cadastral (vinculos)
  const vinculosPorSituacao = CLIENTE_01_VINCULOS.reduce((acc, v) => {
    acc[v.situacao_cadastral] = (acc[v.situacao_cadastral] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Percentuais
  const calcPercent = (value: number) => ((value / totalFuncionarios) * 100).toFixed(2);

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
              <BarChart3 className="w-7 h-7 text-cyan-400" />
              Visao Analitica
            </h1>
            <p className="text-white/60 mt-1">
              Analise consolidada de {totalFuncionarios.toLocaleString()} funcionarios
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/60 bg-navy-800/50 px-4 py-2 rounded-lg">
            <Calendar className="w-4 h-4" />
            Atualizado em {CLIENTE_01_STATS.dataAtualizacao}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Analisados"
            value={totalFuncionarios.toLocaleString()}
            icon={Users}
            color="blue"
          />
          <SummaryCard
            title="Alertas Criticos"
            value={(CLIENTE_01_STATS.totais.obitos + CLIENTE_01_STATS.totais.sancionados).toString()}
            icon={AlertTriangle}
            color="red"
            subtitle="obitos + sancionados"
          />
          <SummaryCard
            title="Vinculos Politicos"
            value={(CLIENTE_01_STATS.totais.candidatos + CLIENTE_01_STATS.totais.doadores).toString()}
            icon={Vote}
            color="purple"
            subtitle="candidatos + doadores"
          />
          <SummaryCard
            title="Vinculos Empresariais"
            value={CLIENTE_01_STATS.totais.socios.toString()}
            icon={Briefcase}
            color="amber"
            subtitle={`${CLIENTE_01_STATS.totais.cnpjs} CNPJs`}
          />
        </div>

        {/* Distribution by Group */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-navy-900 border border-navy-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-gold-400" />
              Distribuicao por Grupo
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Comurg</span>
                  <span className="text-white font-medium">{grupoComurg?.registros.toLocaleString()} ({((grupoComurg?.registros || 0) / totalFuncionarios * 100).toFixed(1)}%)</span>
                </div>
                <div className="h-4 bg-navy-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((grupoComurg?.registros || 0) / totalFuncionarios * 100)}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Disposicao</span>
                  <span className="text-white font-medium">{grupoDisposicao?.registros.toLocaleString()} ({((grupoDisposicao?.registros || 0) / totalFuncionarios * 100).toFixed(1)}%)</span>
                </div>
                <div className="h-4 bg-navy-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((grupoDisposicao?.registros || 0) / totalFuncionarios * 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full bg-purple-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Comparacao detalhada */}
            <div className="mt-6 pt-6 border-t border-navy-700">
              <h4 className="text-sm font-medium text-white/70 mb-3">Comparativo de Apontamentos</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-white/50 mb-2">Comurg</p>
                  <div className="space-y-1 text-xs">
                    <p><span className="text-red-400">{grupoComurg?.obitos || 0}</span> obitos</p>
                    <p><span className="text-purple-400">{grupoComurg?.candidatos || 0}</span> candidatos</p>
                    <p><span className="text-emerald-400">{grupoComurg?.doadores || 0}</span> doadores</p>
                    <p><span className="text-amber-400">{grupoComurg?.socios || 0}</span> socios</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/50 mb-2">Disposicao</p>
                  <div className="space-y-1 text-xs">
                    <p><span className="text-red-400">{grupoDisposicao?.obitos || 0}</span> obitos</p>
                    <p><span className="text-purple-400">{grupoDisposicao?.candidatos || 0}</span> candidatos</p>
                    <p><span className="text-emerald-400">{grupoDisposicao?.doadores || 0}</span> doadores</p>
                    <p><span className="text-amber-400">{grupoDisposicao?.socios || 0}</span> socios</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Alertas por Categoria */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-navy-900 border border-navy-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Apontamentos por Categoria
            </h3>
            <div className="space-y-3">
              <CategoryBar
                icon={HeartPulse}
                label="Obitos"
                value={CLIENTE_01_STATS.totais.obitos}
                percent={calcPercent(CLIENTE_01_STATS.totais.obitos)}
                color="red"
              />
              <CategoryBar
                icon={AlertTriangle}
                label="Sancionados"
                value={CLIENTE_01_STATS.totais.sancionados}
                percent={calcPercent(CLIENTE_01_STATS.totais.sancionados)}
                color="red"
              />
              <CategoryBar
                icon={Vote}
                label="Candidatos"
                value={CLIENTE_01_STATS.totais.candidatos}
                percent={calcPercent(CLIENTE_01_STATS.totais.candidatos)}
                color="purple"
              />
              <CategoryBar
                icon={Heart}
                label="Doadores"
                value={CLIENTE_01_STATS.totais.doadores}
                percent={calcPercent(CLIENTE_01_STATS.totais.doadores)}
                color="emerald"
              />
              <CategoryBar
                icon={Briefcase}
                label="Socios de Empresa"
                value={CLIENTE_01_STATS.totais.socios}
                percent={calcPercent(CLIENTE_01_STATS.totais.socios)}
                color="amber"
              />
              <CategoryBar
                icon={DollarSign}
                label="Beneficiarios"
                value={CLIENTE_01_STATS.totais.beneficiarios}
                percent={calcPercent(CLIENTE_01_STATS.totais.beneficiarios)}
                color="cyan"
              />
              <CategoryBar
                icon={Globe}
                label="Matches OFAC"
                value={CLIENTE_01_STATS.totais.ofacMatches}
                percent={calcPercent(CLIENTE_01_STATS.totais.ofacMatches)}
                color="orange"
              />
            </div>
          </motion.div>
        </div>

        {/* Obitos por Ano */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-navy-900 border border-navy-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-400" />
            Obitos por Ano
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(obitosPorAno)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([ano, count]) => (
                <div
                  key={ano}
                  className={`px-4 py-2 rounded-lg border ${
                    Number(ano) >= 2024
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : Number(ano) >= 2020
                      ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                      : "bg-navy-800 border-navy-600 text-white/70"
                  }`}
                >
                  <span className="font-bold text-lg">{ano}</span>
                  <span className="ml-2 text-sm opacity-70">({count})</span>
                </div>
              ))}
          </div>
          <p className="text-xs text-white/50 mt-4">
            Total: {CLIENTE_01_STATS.totais.obitos} funcionarios falecidos identificados ainda constando em registros
          </p>
        </motion.div>

        {/* Doacoes e Candidatos */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Doacoes por Ano */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-navy-900 border border-navy-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-400" />
              Doacoes por Ano Eleitoral
            </h3>
            <div className="space-y-3">
              {Object.entries(doacoesPorAno)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([ano, valor]) => (
                  <div key={ano} className="bg-navy-800/50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">{ano}</span>
                      <span className="text-emerald-400 font-bold">
                        R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="h-2 bg-navy-700 rounded-full overflow-hidden mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(valor / CLIENTE_01_STATS.valorTotalDoacoes * 100)}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-navy-700">
              <p className="text-sm text-white/50">
                Total doado: <span className="text-emerald-400 font-bold">R$ {CLIENTE_01_STATS.valorTotalDoacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
            </div>
          </motion.div>

          {/* Candidatos por Partido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-navy-900 border border-navy-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Vote className="w-5 h-5 text-purple-400" />
              Candidatos por Partido
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(candidatosPorPartido)
                .sort(([, a], [, b]) => b - a)
                .map(([partido, count]) => (
                  <div
                    key={partido}
                    className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-2"
                  >
                    <span className="text-purple-400 font-medium">{partido}</span>
                    <span className="ml-2 text-white/70 text-sm">({count})</span>
                  </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-navy-700">
              <p className="text-sm text-white/50">
                Total: {CLIENTE_01_STATS.totais.candidatos} funcionarios candidatos em eleicoes
              </p>
            </div>
          </motion.div>
        </div>

        {/* Vinculos Empresariais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-navy-900 border border-navy-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            Vinculos Empresariais - Situacao Cadastral
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(vinculosPorSituacao).map(([situacao, count]) => (
              <div
                key={situacao}
                className={`rounded-xl p-4 text-center ${
                  situacao === "ATIVA"
                    ? "bg-emerald-500/10 border border-emerald-500/30"
                    : situacao === "SUSPENSA"
                    ? "bg-amber-500/10 border border-amber-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                }`}
              >
                <p className={`text-3xl font-bold ${
                  situacao === "ATIVA" ? "text-emerald-400" :
                  situacao === "SUSPENSA" ? "text-amber-400" : "text-red-400"
                }`}>
                  {count}
                </p>
                <p className="text-xs text-white/60 mt-1">{situacao}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-navy-700">
            <p className="text-sm text-white/50">
              Total: {CLIENTE_01_STATS.totais.socios} funcionarios com vinculos em {CLIENTE_01_STATS.totais.cnpjs} empresas
            </p>
          </div>
        </motion.div>

        {/* Resumo Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-gradient-to-r from-gold-500/10 to-gold-600/5 border border-gold-500/30 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gold-400 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resumo Executivo
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">Alertas Criticos</h4>
              <ul className="text-sm text-white/60 space-y-1">
                <li>• {CLIENTE_01_STATS.totais.obitos} funcionarios falecidos</li>
                <li>• {CLIENTE_01_STATS.totais.sancionados} sancionado(s) CEIS/CNEP</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">Vinculos Politicos</h4>
              <ul className="text-sm text-white/60 space-y-1">
                <li>• {CLIENTE_01_STATS.totais.candidatos} candidatos em eleicoes</li>
                <li>• {CLIENTE_01_STATS.totais.doadores} doadores de campanha</li>
                <li>• R$ {CLIENTE_01_STATS.valorTotalDoacoes.toLocaleString('pt-BR')} doados</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">Outros Apontamentos</h4>
              <ul className="text-sm text-white/60 space-y-1">
                <li>• {CLIENTE_01_STATS.totais.socios} socios de empresas</li>
                <li>• {CLIENTE_01_STATS.totais.beneficiarios} beneficiarios sociais</li>
                <li>• {CLIENTE_01_STATS.totais.ofacMatches} matches OFAC</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: "blue" | "red" | "purple" | "amber" | "emerald" | "cyan" | "orange";
  subtitle?: string;
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    red: "bg-red-500/10 text-red-400",
    purple: "bg-purple-500/10 text-purple-400",
    amber: "bg-amber-500/10 text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    orange: "bg-orange-500/10 text-orange-400",
  };

  return (
    <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/50">{title}</p>
          {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function CategoryBar({
  icon: Icon,
  label,
  value,
  percent,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  percent: string;
  color: "red" | "purple" | "emerald" | "amber" | "cyan" | "orange";
}) {
  const colorClasses = {
    red: "bg-red-500",
    purple: "bg-purple-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    cyan: "bg-cyan-500",
    orange: "bg-orange-500",
  };

  const textColorClasses = {
    red: "text-red-400",
    purple: "text-purple-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    cyan: "text-cyan-400",
    orange: "text-orange-400",
  };

  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-white/70 flex items-center gap-2">
          <Icon className={`w-4 h-4 ${textColorClasses[color]}`} />
          {label}
        </span>
        <span className="text-white font-medium">{value} <span className="text-white/50">({percent}%)</span></span>
      </div>
      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Number(percent) * 10, 100)}%` }}
          transition={{ duration: 0.8 }}
          className={`h-full ${colorClasses[color]} rounded-full`}
        />
      </div>
    </div>
  );
}
