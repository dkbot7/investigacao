"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Search,
  X,
  Download,
  Filter,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FichaFuncionario } from "@/components/dashboard/FichaFuncionario";
import {
  CLIENTE_01_BENEFICIOS,
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
  qual_beneficio?: string;
  socio_empresa?: number;
  doador_campanha?: number;
  valor_doacoes?: number;
  candidato?: number;
  sancionado_ceis?: number;
}

export default function BeneficiosPage() {
  const [search, setSearch] = useState("");
  const [selectedFuncionario, setSelectedFuncionario] = useState<FuncionarioSelecionado | null>(null);
  const [tipoFilter, setTipoFilter] = useState<string>("todos");

  // Tipos unicos
  const tipos = [...new Set(CLIENTE_01_BENEFICIOS.map(b => b.tipo))].sort();

  // Filtrar por busca e tipo
  const filteredBeneficios = CLIENTE_01_BENEFICIOS.filter(b => {
    const matchSearch = search === "" ||
      b.nome.toLowerCase().includes(search.toLowerCase()) ||
      b.cpf.includes(search);
    const matchTipo = tipoFilter === "todos" || b.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  // Stats
  const totalValor = CLIENTE_01_BENEFICIOS.reduce((sum, b) => sum + b.valor, 0);
  const beneficiariosUnicos = new Set(CLIENTE_01_BENEFICIOS.map(b => b.cpf)).size;

  // Formatar tipo de beneficio
  const formatTipo = (tipo: string): string => {
    const tipos: Record<string, string> = {
      'AUXILIO_EMERGENCIAL': 'Auxilio Emergencial',
      'BOLSA_FAMILIA': 'Bolsa Familia',
      'BPC': 'BPC',
      'SEGURO_DEFESO': 'Seguro Defeso',
    };
    return tipos[tipo] || tipo;
  };

  // Exportar CSV
  const exportCSV = () => {
    const headers = ['nome', 'cpf', 'tipo', 'valor', 'ano', 'grupo'];
    const bom = '\uFEFF';
    const rows = CLIENTE_01_BENEFICIOS.map(b =>
      headers.map(h => {
        const val = b[h as keyof typeof b];
        return typeof val === 'number' ? val.toString() : val;
      }).join(';')
    );
    const csv = bom + [headers.join(';'), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `beneficiarios_CLIENTE_01_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSelectBeneficio = (beneficio: typeof CLIENTE_01_BENEFICIOS[0]) => {
    const funcionario = CLIENTE_01_FUNCIONARIOS.find(f => f.cpf === beneficio.cpf) || {
      id: beneficio.id,
      nome: beneficio.nome,
      cpf: beneficio.cpf,
      grupo: beneficio.grupo,
      esta_vivo: "SIM",
      esta_morto: "NAO",
      recebe_beneficio: 1,
      qual_beneficio: beneficio.tipo,
      socio_empresa: 0,
      doador_campanha: 0,
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-blue-400" />
              Beneficiarios de Programas Sociais
            </h1>
            <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              {CLIENTE_01_STATS?.totais?.beneficiarios || 0} funcionarios beneficiarios identificados
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
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm"
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
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
          <DollarSign className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-blue-400 font-semibold">Recebimento de Beneficios Sociais</h3>
            <p className="text-slate-900 dark:text-slate-700 dark:text-white/70 text-sm mt-1">
              Foram identificados <strong className="text-slate-900 dark:text-white">{CLIENTE_01_STATS?.totais?.beneficiarios || 0} funcionarios</strong> que
              receberam beneficios de programas sociais como Auxilio Emergencial, Bolsa Familia, BPC, entre outros.
              Esta verificacao e importante para analise de compatibilidade com o vinculo empregaticio.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{beneficiariosUnicos}</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Beneficiarios</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  R$ {totalValor.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Total Recebido</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  R$ {(totalValor / beneficiariosUnicos).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Media por Pessoa</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">2020</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Ano Principal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtro por Tipo */}
        <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-900 dark:text-slate-500 dark:text-white/50" />
            <span className="text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-white/70">Filtrar por Tipo de Beneficio</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTipoFilter("todos")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tipoFilter === "todos"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
              }`}
            >
              Todos ({CLIENTE_01_BENEFICIOS.length})
            </button>
            {tipos.map(tipo => (
              <button
                key={tipo}
                onClick={() => setTipoFilter(tipo)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  tipoFilter === tipo
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
                }`}
              >
                {formatTipo(tipo)} ({CLIENTE_01_BENEFICIOS.filter(b => b.tipo === tipo).length})
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Tipo de Beneficio</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Valor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Ano</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {filteredBeneficios.map((beneficio) => (
                  <tr
                    key={beneficio.id}
                    className="border-b border-slate-300 dark:border-navy-800 hover:bg-slate-100 dark:bg-navy-800/50 transition-colors cursor-pointer"
                    onClick={() => handleSelectBeneficio(beneficio)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-slate-900 dark:text-white font-medium hover:text-blue-400 transition-colors">
                        {beneficio.nome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-700 dark:text-white/70 font-mono text-sm">
                      {beneficio.cpf}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                        {formatTipo(beneficio.tipo)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-blue-400 font-bold">
                        R$ {beneficio.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-700 dark:text-white/70 text-sm">
                      {beneficio.ano}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-700 text-slate-900 dark:text-slate-700 dark:text-white/70">
                        {beneficio.grupo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBeneficios.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-slate-900 dark:text-white/20 mx-auto mb-3" />
              <p className="text-slate-900 dark:text-slate-500 dark:text-white/50">Nenhum registro encontrado</p>
            </div>
          )}
        </div>

        {/* Info adicional */}
        <div className="bg-white dark:bg-navy-900/50 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Sobre os Beneficios Identificados</h4>
              <ul className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 space-y-1">
                <li>• <strong>Auxilio Emergencial</strong> - Beneficio concedido durante a pandemia COVID-19 (2020-2021)</li>
                <li>• <strong>Bolsa Familia</strong> - Programa de transferencia de renda para familias em situacao de pobreza</li>
                <li>• <strong>BPC</strong> - Beneficio de Prestacao Continuada para idosos e deficientes</li>
                <li>• Dados provenientes do Portal da Transparencia do Governo Federal</li>
              </ul>
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
