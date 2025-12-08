"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Vote,
  Search,
  X,
  Download,
  Filter,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FichaFuncionario } from "@/components/dashboard/FichaFuncionario";
import {
  CLIENTE_01_CANDIDATOS,
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

export default function CandidatosPage() {
  const [search, setSearch] = useState("");
  const [selectedFuncionario, setSelectedFuncionario] = useState<FuncionarioSelecionado | null>(null);
  const [partidoFilter, setPartidoFilter] = useState<string>("todos");

  // Partidos unicos
  const partidos = [...new Set(CLIENTE_01_CANDIDATOS.map(c => c.partido))].sort();

  // Filtrar por busca e partido
  const filteredCandidatos = CLIENTE_01_CANDIDATOS.filter(c => {
    const matchSearch = search === "" ||
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.cpf.includes(search);
    const matchPartido = partidoFilter === "todos" || c.partido === partidoFilter;
    return matchSearch && matchPartido;
  });

  // Stats por situacao
  const eleitos = CLIENTE_01_CANDIDATOS.filter(c => c.situacao === "Eleito").length;
  const suplentes = CLIENTE_01_CANDIDATOS.filter(c => c.situacao === "Suplente").length;
  const naoEleitos = CLIENTE_01_CANDIDATOS.filter(c => c.situacao === "Nao Eleito").length;

  // Exportar CSV
  const exportCSV = () => {
    const headers = ['nome', 'cpf', 'cargo', 'partido', 'uf', 'ano', 'situacao', 'grupo'];
    const bom = '\uFEFF';
    const rows = CLIENTE_01_CANDIDATOS.map(c =>
      headers.map(h => c[h as keyof typeof c]).join(';')
    );
    const csv = bom + [headers.join(';'), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `candidatos_CLIENTE_01_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSelectCandidato = (candidato: typeof CLIENTE_01_CANDIDATOS[0]) => {
    const funcionario = CLIENTE_01_FUNCIONARIOS.find(f => f.cpf === candidato.cpf) || {
      id: candidato.id,
      nome: candidato.nome,
      cpf: candidato.cpf,
      grupo: candidato.grupo,
      cargo: candidato.cargo,
      esta_vivo: "SIM",
      esta_morto: "NAO",
      recebe_beneficio: 0,
      socio_empresa: 0,
      doador_campanha: candidato.nome === "EDUARDO PEREIRA DE SOUSA" ? 1 : 0,
      valor_doacoes: candidato.nome === "EDUARDO PEREIRA DE SOUSA" ? 4000 : 0,
      candidato: 1,
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Vote className="w-7 h-7 text-purple-400" />
              Candidatos em Eleicoes
            </h1>
            <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              {CLIENTE_01_CANDIDATOS.length} funcionarios candidatos identificados
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-white/40" />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm"
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

            <Button
              onClick={exportCSV}
              variant="ghost"
              className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700 hover:bg-slate-100 dark:bg-navy-800"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-start gap-3">
          <Vote className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-purple-400 font-semibold">Participacao Eleitoral</h3>
            <p className="text-slate-900 dark:text-slate-700 dark:text-navy-300 text-sm mt-1">
              Foram identificados <strong className="text-slate-900 dark:text-white">{CLIENTE_01_CANDIDATOS.length} funcionarios</strong> que
              participaram como candidatos em eleicoes. Esta informacao e publica e proveniente do TSE.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Vote className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{CLIENTE_01_CANDIDATOS.length}</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Total Candidatos</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{eleitos}</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Eleitos</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{suplentes}</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Suplentes</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Users className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{naoEleitos}</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Nao Eleitos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtro por Partido */}
        <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-900 dark:text-slate-500 dark:text-white/50" />
            <span className="text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-navy-300">Filtrar por Partido</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPartidoFilter("todos")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                partidoFilter === "todos"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
              }`}
            >
              Todos ({CLIENTE_01_CANDIDATOS.length})
            </button>
            {partidos.map(partido => (
              <button
                key={partido}
                onClick={() => setPartidoFilter(partido)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  partidoFilter === partido
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
                }`}
              >
                {partido} ({CLIENTE_01_CANDIDATOS.filter(c => c.partido === partido).length})
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-navy-800/50 border-b border-slate-400 dark:border-navy-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Nome</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">CPF</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Cargo Pleiteado</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Partido</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">UF</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Ano</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Situacao</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidatos.map((candidato) => (
                  <tr
                    key={candidato.id}
                    className="border-b border-slate-300 dark:border-navy-800 hover:bg-slate-100 dark:bg-navy-800/50 transition-colors cursor-pointer"
                    onClick={() => handleSelectCandidato(candidato)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-slate-900 dark:text-white font-medium hover:text-purple-400 transition-colors">
                        {candidato.nome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-700 dark:text-navy-300 font-mono text-sm">
                      {candidato.cpf}
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-700 dark:text-navy-300 text-sm">
                      {candidato.cargo}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                        {candidato.partido}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-700 dark:text-navy-300 text-sm">
                      {candidato.uf}
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-700 dark:text-navy-300 text-sm">
                      {candidato.ano}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        candidato.situacao === "Eleito"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : candidato.situacao === "Suplente"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {candidato.situacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCandidatos.length === 0 && (
            <div className="text-center py-12">
              <Vote className="w-12 h-12 text-slate-900 dark:text-white/20 mx-auto mb-3" />
              <p className="text-slate-900 dark:text-slate-500 dark:text-white/50">Nenhum registro encontrado</p>
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
