"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Search,
  X,
  Download,
  Filter,
  AlertTriangle,
  Flag,
  Users,
  Shield,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FichaFuncionario } from "@/components/dashboard/FichaFuncionario";
import {
  CLIENTE_01_OFAC,
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
  candidato?: number;
  sancionado_ceis?: number;
  sancionado_ofac?: number;
}

export default function OFACPage() {
  const [search, setSearch] = useState("");
  const [selectedFuncionario, setSelectedFuncionario] = useState<FuncionarioSelecionado | null>(null);
  const [programaFilter, setProgramaFilter] = useState<string>("todos");

  // Programas unicos
  const programas = [...new Set(CLIENTE_01_OFAC.map(o => o.programa))].sort();

  // Filtrar por busca e programa
  const filteredOFAC = CLIENTE_01_OFAC.filter(o => {
    const matchSearch = search === "" ||
      o.nome.toLowerCase().includes(search.toLowerCase()) ||
      o.cpf.includes(search) ||
      o.matchOFAC.toLowerCase().includes(search.toLowerCase());
    const matchPrograma = programaFilter === "todos" || o.programa === programaFilter;
    return matchSearch && matchPrograma;
  });

  // Stats
  const totalMatches = CLIENTE_01_STATS?.totais?.ofacMatches || 0;
  const mediasSimilaridade = CLIENTE_01_OFAC.reduce((sum, o) => sum + o.similaridade, 0) / CLIENTE_01_OFAC.length;

  // Exportar CSV
  const exportCSV = () => {
    const headers = ['nome', 'cpf', 'grupo', 'matchOFAC', 'programa', 'similaridade'];
    const bom = '\uFEFF';
    const rows = CLIENTE_01_OFAC.map(o =>
      headers.map(h => {
        const val = o[h as keyof typeof o];
        return val?.toString() || '';
      }).join(';')
    );
    const csv = bom + [headers.join(';'), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ofac_matches_CLIENTE_01_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSelectOFAC = (ofac: typeof CLIENTE_01_OFAC[0]) => {
    const funcionario = CLIENTE_01_FUNCIONARIOS.find(f => f.cpf === ofac.cpf) || {
      id: ofac.id,
      nome: ofac.nome,
      cpf: ofac.cpf,
      grupo: ofac.grupo,
      esta_vivo: "SIM",
      esta_morto: "NAO",
      recebe_beneficio: 0,
      socio_empresa: 0,
      doador_campanha: 0,
      candidato: 0,
      sancionado_ceis: 0,
      sancionado_ofac: 1,
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
              <Globe className="w-7 h-7 text-orange-400" />
              OFAC/PEP - Sancoes Internacionais
            </h1>
            <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              {totalMatches} matches identificados na lista SDN do Tesouro dos EUA
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-white/40" />
              <input
                type="text"
                placeholder="Buscar nome ou match..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm"
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

        {/* Warning Banner */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-start gap-3">
          <Flag className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-orange-400 font-semibold">Importante - Leia com Atencao</h3>
            <p className="text-slate-900 dark:text-slate-700 dark:text-navy-300 text-sm mt-1">
              A lista OFAC SDN (Specially Designated Nationals) do Tesouro dos EUA contem nomes de pessoas e entidades sancionadas.
              Os matches abaixo sao baseados em <strong className="text-slate-900 dark:text-white">similaridade de nome (50%+)</strong> e{" "}
              <strong className="text-orange-300">NAO indicam necessariamente</strong> que a pessoa seja a mesma da lista.
              <strong className="text-slate-900 dark:text-white"> Recomenda-se verificacao manual adicional antes de qualquer acao.</strong>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalMatches}</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Matches Totais</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{mediasSimilaridade.toFixed(0)}%</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Similaridade Media</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Globe className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">18.411</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Registros na Lista SDN</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{programas.length}</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Programas de Sancao</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtro por Programa */}
        <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-900 dark:text-slate-500 dark:text-white/50" />
            <span className="text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-navy-300">Filtrar por Programa de Sancao</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setProgramaFilter("todos")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                programaFilter === "todos"
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
              }`}
            >
              Todos ({CLIENTE_01_OFAC.length})
            </button>
            {programas.map(programa => (
              <button
                key={programa}
                onClick={() => setProgramaFilter(programa)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  programaFilter === programa
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
                }`}
              >
                {programa} ({CLIENTE_01_OFAC.filter(o => o.programa === programa).length})
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Funcionario</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">CPF</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Match na Lista OFAC</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Programa</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Similaridade</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {filteredOFAC.map((ofac) => (
                  <tr
                    key={ofac.id}
                    className="border-b border-slate-300 dark:border-navy-800 hover:bg-slate-100 dark:bg-navy-800/50 transition-colors cursor-pointer"
                    onClick={() => handleSelectOFAC(ofac)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-slate-900 dark:text-white font-medium hover:text-orange-400 transition-colors">
                        {ofac.nome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-700 dark:text-navy-300 font-mono text-sm">
                      {ofac.cpf}
                    </td>
                    <td className="py-3 px-4">
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded px-2 py-1">
                        <span className="text-orange-300 text-sm">
                          {ofac.matchOFAC}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-700 text-slate-900 dark:text-slate-700 dark:text-navy-300">
                        {ofac.programa}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        ofac.similaridade >= 55
                          ? "bg-red-500/20 text-red-400"
                          : ofac.similaridade >= 52
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}>
                        {ofac.similaridade}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-700 text-slate-900 dark:text-slate-700 dark:text-navy-300">
                        {ofac.grupo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOFAC.length === 0 && (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-slate-900 dark:text-white/20 mx-auto mb-3" />
              <p className="text-slate-900 dark:text-slate-500 dark:text-white/50">Nenhum registro encontrado</p>
            </div>
          )}

          {/* Nota de paginacao */}
          <div className="p-4 border-t border-slate-400 dark:border-navy-700 bg-slate-100 dark:bg-navy-800/30">
            <p className="text-center text-sm text-slate-900 dark:text-slate-500 dark:text-white/50">
              Mostrando {filteredOFAC.length} de {totalMatches} matches totais.
              Para a lista completa, exporte o CSV ou consulte o relatorio em PDF.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-navy-900/50 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">O que e a Lista OFAC SDN?</h4>
                <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
                  A lista SDN (Specially Designated Nationals) e mantida pelo Escritorio de Controle de Ativos Estrangeiros (OFAC)
                  do Departamento do Tesouro dos EUA. Contem nomes de pessoas, empresas e organizacoes sujeitas a sancoes economicas.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900/50 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Programas de Sancao</h4>
                <ul className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 space-y-1">
                  <li>• <strong>SDNT</strong> - Narcoticos / Trafico de Drogas</li>
                  <li>• <strong>SDNTK</strong> - Narcoticos Internacionais</li>
                  <li>• <strong>SDN</strong> - Nacionais Especialmente Designados</li>
                </ul>
              </div>
            </div>
          </div>
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

