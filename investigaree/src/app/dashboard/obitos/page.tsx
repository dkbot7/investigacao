"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HeartPulse,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Download,
  Search,
  X,
  User,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FichaFuncionario } from "@/components/dashboard/FichaFuncionario";
import {
  CLIENTE_01_OBITOS,
  CLIENTE_01_STATS,
  CLIENTE_01_FUNCIONARIOS,
  getCandidaturasByCPF,
  getDoacoesByCPF,
  getVinculosByCPF,
  getSancoesByCPF,
  getBeneficiosByCPF,
} from "../_data/mock-data";

// Tipo para funcionário selecionado
interface FuncionarioSelecionado {
  id: string;
  cadastro?: string;
  nome: string;
  cpf: string;
  grupo: string;
  esta_morto?: string;
  ano_obito?: number;
  esta_vivo?: string;
  recebe_beneficio?: number;
  socio_empresa?: number;
  doador_campanha?: number;
  candidato?: number;
  sancionado_ceis?: number;
}

export default function ObitosPage() {
  const [search, setSearch] = useState("");
  const [selectedFuncionario, setSelectedFuncionario] = useState<FuncionarioSelecionado | null>(null);

  // Filtrar por busca
  const filteredObitos = CLIENTE_01_OBITOS.filter(o =>
    search === "" ||
    o.nome.toLowerCase().includes(search.toLowerCase()) ||
    o.cpf.includes(search)
  );

  // Estatísticas por ano
  const obitosPorAno = CLIENTE_01_OBITOS.reduce((acc, o) => {
    acc[o.ano_obito] = (acc[o.ano_obito] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const anosOrdenados = Object.keys(obitosPorAno).map(Number).sort((a, b) => b - a);

  // Exportar CSV
  const exportCSV = () => {
    const headers = ['cadastro', 'nome', 'cpf', 'grupo', 'ano_obito'];
    const bom = '\uFEFF';
    const rows = CLIENTE_01_OBITOS.map(o =>
      headers.map(h => o[h as keyof typeof o]).join(';')
    );
    const csv = bom + [headers.join(';'), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `obitos_CLIENTE_01_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

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
              <HeartPulse className="w-7 h-7 text-red-400" />
              Obitos Identificados
            </h1>
            <p className="text-white/60 mt-1">
              {CLIENTE_01_OBITOS.length} funcionarios falecidos detectados
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-sm"
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

            <Button
              onClick={exportCSV}
              variant="ghost"
              className="text-white/60 hover:text-white border border-navy-700 hover:bg-navy-800"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-semibold">Alerta Critico de Integridade</h3>
            <p className="text-white/70 text-sm mt-1">
              Foram identificados <strong className="text-white">{CLIENTE_01_OBITOS.length} funcionarios falecidos</strong> ainda
              constando em registros da COMURG. Recomenda-se verificacao imediata junto ao setor de RH
              para regularizacao cadastral e possivel identificacao de pagamentos indevidos.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <HeartPulse className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{CLIENTE_01_OBITOS.length}</p>
                <p className="text-xs text-white/50">Obitos Totais</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{obitosPorAno[2025] || 0}</p>
                <p className="text-xs text-white/50">Em 2025</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{obitosPorAno[2024] || 0}</p>
                <p className="text-xs text-white/50">Em 2024</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {CLIENTE_01_OBITOS.filter(o => o.ano_obito <= 2020).length}
                </p>
                <p className="text-xs text-white/50">Antes de 2020</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline por ano */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
          <h3 className="text-sm font-medium text-white/70 mb-4">Distribuicao por Ano de Obito</h3>
          <div className="flex flex-wrap gap-2">
            {anosOrdenados.map(ano => (
              <div
                key={ano}
                className={`px-3 py-2 rounded-lg border ${
                  ano >= 2024
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : ano >= 2020
                    ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                    : "bg-navy-800 border-navy-600 text-white/70"
                }`}
              >
                <span className="font-bold">{ano}</span>
                <span className="ml-2 text-sm opacity-70">({obitosPorAno[ano]})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy-800/50 border-b border-navy-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Cadastro</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Nome</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">CPF</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Grupo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Ano Obito</th>
                </tr>
              </thead>
              <tbody>
                {filteredObitos.map((obito, index) => {
                  // Buscar funcionario completo ou criar um a partir do obito
                  const funcionario = CLIENTE_01_FUNCIONARIOS.find(f => f.cpf === obito.cpf) || {
                    id: obito.id,
                    cadastro: obito.cadastro,
                    nome: obito.nome,
                    cpf: obito.cpf,
                    grupo: obito.grupo,
                    esta_morto: `SIM - Ano: ${obito.ano_obito}`,
                    ano_obito: obito.ano_obito,
                    esta_vivo: "NAO",
                    recebe_beneficio: 0,
                    socio_empresa: 0,
                    doador_campanha: 0,
                    candidato: 0,
                    sancionado_ceis: 0,
                  };

                  return (
                  <tr
                    key={obito.id}
                    className="border-b border-navy-800 hover:bg-navy-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedFuncionario(funcionario)}
                  >
                    <td className="py-3 px-4 text-white/50 font-mono text-sm">
                      {obito.cadastro}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-medium hover:text-red-400 transition-colors">
                        {obito.nome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70 font-mono text-sm">
                      {obito.cpf}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-700 text-white/70">
                        {obito.grupo}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        obito.ano_obito >= 2024
                          ? "bg-red-500/20 text-red-400"
                          : obito.ano_obito >= 2020
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-navy-700 text-white/70"
                      }`}>
                        {obito.ano_obito}
                      </span>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredObitos.length === 0 && (
            <div className="text-center py-12">
              <HeartPulse className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50">Nenhum registro encontrado</p>
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
