"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Search,
  X,
  Download,
  Filter,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FichaFuncionario } from "@/components/dashboard/FichaFuncionario";
import {
  CLIENTE_01_DOADORES,
  CLIENTE_01_FUNCIONARIOS,
  CLIENTE_01_STATS,
  getCandidaturasByCPF,
  getDoacoesByCPF,
  getVinculosByCPF,
  getSancoesByCPF,
  getBeneficiosByCPF,
} from "../_data/mock-data";

interface FuncionarioSelecionado {
  id: string;
  cadastro?: string;
  nome: string;
  cpf: string;
  grupo: string;
  cargo?: string;
  esta_morto?: string;
  ano_obito?: number;
  esta_vivo?: string;
  recebe_beneficio?: number;
  socio_empresa?: number;
  doador_campanha?: number;
  valor_doacoes?: number;
  candidato?: number;
  sancionado_ceis?: number;
}

export default function DoadoresPage() {
  const [search, setSearch] = useState("");
  const [selectedFuncionario, setSelectedFuncionario] = useState<FuncionarioSelecionado | null>(null);
  const [anoFilter, setAnoFilter] = useState<string>("todos");

  // Anos unicos
  const anos = [...new Set(CLIENTE_01_DOADORES.map(d => d.ano))].sort((a, b) => b - a);

  // Filtrar por busca e ano
  const filteredDoadores = CLIENTE_01_DOADORES.filter(d => {
    const matchSearch = search === "" ||
      d.nome.toLowerCase().includes(search.toLowerCase()) ||
      d.cpf.includes(search) ||
      d.candidato.toLowerCase().includes(search.toLowerCase());
    const matchAno = anoFilter === "todos" || d.ano.toString() === anoFilter;
    return matchSearch && matchAno;
  });

  // Stats
  const totalValor = CLIENTE_01_DOADORES.reduce((sum, d) => sum + d.valor, 0);
  const mediaDoacao = totalValor / CLIENTE_01_DOADORES.length;
  const maiorDoacao = Math.max(...CLIENTE_01_DOADORES.map(d => d.valor));

  // Exportar CSV
  const exportCSV = () => {
    const headers = ['nome', 'cpf', 'valor', 'candidato', 'partido', 'ano', 'grupo'];
    const bom = '\uFEFF';
    const rows = CLIENTE_01_DOADORES.map(d =>
      headers.map(h => {
        const val = d[h as keyof typeof d];
        return typeof val === 'number' ? val.toFixed(2) : val;
      }).join(';')
    );
    const csv = bom + [headers.join(';'), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `doadores_CLIENTE_01_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSelectDoador = (doador: typeof CLIENTE_01_DOADORES[0]) => {
    const funcionario = CLIENTE_01_FUNCIONARIOS.find(f => f.cpf === doador.cpf) || {
      id: doador.id,
      nome: doador.nome,
      cpf: doador.cpf,
      grupo: doador.grupo,
      esta_vivo: "SIM",
      esta_morto: "NAO",
      recebe_beneficio: 0,
      socio_empresa: 0,
      doador_campanha: 1,
      valor_doacoes: doador.valor,
      candidato: 0,
      sancionado_ceis: 0,
    };
    setSelectedFuncionario(funcionario);
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
              <Heart className="w-7 h-7 text-emerald-400" />
              Doadores de Campanha
            </h1>
            <p className="text-white/60 mt-1">
              {CLIENTE_01_STATS.totais.doadores} funcionarios doadores identificados
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
                className="w-full pl-9 pr-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-sm"
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

        {/* Info Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
          <Heart className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-emerald-400 font-semibold">Doacoes Eleitorais</h3>
            <p className="text-white/70 text-sm mt-1">
              Foram identificados <strong className="text-white">{CLIENTE_01_STATS.totais.doadores} funcionarios</strong> que
              realizaram doacoes para campanhas eleitorais, totalizando{" "}
              <strong className="text-white">R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.
              Dados provenientes do TSE.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{CLIENTE_01_STATS.totais.doadores}</p>
                <p className="text-xs text-white/50">Total Doadores</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  R$ {(totalValor / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-white/50">Total Doado</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  R$ {mediaDoacao.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-white/50">Media por Doacao</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Heart className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  R$ {(maiorDoacao / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-white/50">Maior Doacao</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtro por Ano */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-white/50" />
            <span className="text-sm font-medium text-white/70">Filtrar por Ano Eleitoral</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAnoFilter("todos")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                anoFilter === "todos"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
              }`}
            >
              Todos ({CLIENTE_01_DOADORES.length})
            </button>
            {anos.map(ano => (
              <button
                key={ano}
                onClick={() => setAnoFilter(ano.toString())}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  anoFilter === ano.toString()
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
                }`}
              >
                {ano} ({CLIENTE_01_DOADORES.filter(d => d.ano === ano).length})
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy-800/50 border-b border-navy-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Doador</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">CPF</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-white/60">Valor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Candidato Beneficiado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Partido</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Ano</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoadores.map((doador) => (
                  <tr
                    key={doador.id}
                    className="border-b border-navy-800 hover:bg-navy-800/50 transition-colors cursor-pointer"
                    onClick={() => handleSelectDoador(doador)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-white font-medium hover:text-emerald-400 transition-colors">
                        {doador.nome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70 font-mono text-sm">
                      {doador.cpf}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold ${
                        doador.valor >= 10000
                          ? "text-amber-400"
                          : doador.valor >= 5000
                          ? "text-emerald-400"
                          : "text-white"
                      }`}>
                        R$ {doador.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70 text-sm max-w-[200px] truncate">
                      {doador.candidato}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                        {doador.partido}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70 text-sm">
                      {doador.ano}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-700 text-white/70">
                        {doador.grupo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDoadores.length === 0 && (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-white/20 mx-auto mb-3" />
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
