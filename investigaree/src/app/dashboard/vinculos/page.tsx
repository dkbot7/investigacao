"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Search,
  X,
  Download,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FichaFuncionario } from "@/components/dashboard/FichaFuncionario";
import {
  CLIENTE_01_VINCULOS,
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
  qtd_empresas?: number;
  doador_campanha?: number;
  valor_doacoes?: number;
  candidato?: number;
  sancionado_ceis?: number;
}

export default function VinculosPage() {
  const [search, setSearch] = useState("");
  const [selectedFuncionario, setSelectedFuncionario] = useState<FuncionarioSelecionado | null>(null);
  const [situacaoFilter, setSituacaoFilter] = useState<string>("todos");

  // Situacoes unicas
  const situacoes = [...new Set(CLIENTE_01_VINCULOS.map(v => v.situacao_cadastral))].sort();

  // Filtrar por busca e situacao
  const filteredVinculos = CLIENTE_01_VINCULOS.filter(v => {
    const matchSearch = search === "" ||
      v.nome.toLowerCase().includes(search.toLowerCase()) ||
      v.cpf.includes(search) ||
      v.razao_social.toLowerCase().includes(search.toLowerCase()) ||
      v.cnpj.includes(search);
    const matchSituacao = situacaoFilter === "todos" || v.situacao_cadastral === situacaoFilter;
    return matchSearch && matchSituacao;
  });

  // Stats
  const empresasAtivas = CLIENTE_01_VINCULOS.filter(v => v.situacao_cadastral === "ATIVA").length;
  const empresasBaixadas = CLIENTE_01_VINCULOS.filter(v => v.situacao_cadastral === "BAIXADA").length;
  const funcionariosUnicos = new Set(CLIENTE_01_VINCULOS.map(v => v.cpf)).size;

  // Exportar CSV
  const exportCSV = () => {
    const headers = ['nome', 'cpf', 'cnpj', 'razao_social', 'situacao_cadastral', 'qualificacao', 'grupo'];
    const bom = '\uFEFF';
    const rows = CLIENTE_01_VINCULOS.map(v =>
      headers.map(h => {
        const val = v[h as keyof typeof v];
        if (typeof val === 'string' && (val.includes(';') || val.includes('"'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(';')
    );
    const csv = bom + [headers.join(';'), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vinculos_CLIENTE_01_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSelectVinculo = (vinculo: typeof CLIENTE_01_VINCULOS[0]) => {
    const funcionario = CLIENTE_01_FUNCIONARIOS.find(f => f.cpf === vinculo.cpf) || {
      id: vinculo.cpf,
      nome: vinculo.nome,
      cpf: vinculo.cpf,
      grupo: vinculo.grupo,
      esta_vivo: "SIM",
      esta_morto: "NAO",
      recebe_beneficio: 0,
      socio_empresa: 1,
      qtd_empresas: CLIENTE_01_VINCULOS.filter(v => v.cpf === vinculo.cpf).length,
      doador_campanha: 0,
      candidato: 0,
      sancionado_ceis: 0,
    };
    setSelectedFuncionario(funcionario);
  };

  // Formatar CNPJ
  const formatCNPJ = (cnpj: string): string => {
    const nums = cnpj.replace(/\D/g, '');
    if (nums.length !== 14) return cnpj;
    return `${nums.slice(0,2)}.${nums.slice(2,5)}.${nums.slice(5,8)}/${nums.slice(8,12)}-${nums.slice(12)}`;
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
              <Briefcase className="w-7 h-7 text-amber-400" />
              Vinculos Empresariais
            </h1>
            <p className="text-white/60 mt-1">
              {CLIENTE_01_STATS?.totais?.socios || 0} funcionarios socios de empresas ({CLIENTE_01_STATS?.totais?.cnpjs || 0} CNPJs)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Buscar nome, CPF, CNPJ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm"
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
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <Briefcase className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-400 font-semibold">Participacoes Societarias</h3>
            <p className="text-white/70 text-sm mt-1">
              Foram identificados <strong className="text-white">{CLIENTE_01_STATS?.totais?.socios || 0} funcionarios</strong> com
              vinculos societarios em <strong className="text-white">{CLIENTE_01_STATS?.totais?.cnpjs || 0} empresas</strong>.
              Dados provenientes da Receita Federal (QSA - Quadro de Socios e Administradores).
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{funcionariosUnicos}</p>
                <p className="text-xs text-white/50">Funcionarios Socios</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{CLIENTE_01_VINCULOS.length}</p>
                <p className="text-xs text-white/50">Vinculos Totais</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{empresasAtivas}</p>
                <p className="text-xs text-white/50">Empresas Ativas</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{empresasBaixadas}</p>
                <p className="text-xs text-white/50">Empresas Baixadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtro por Situacao */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-white/50" />
            <span className="text-sm font-medium text-white/70">Filtrar por Situacao Cadastral</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSituacaoFilter("todos")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                situacaoFilter === "todos"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
              }`}
            >
              Todos ({CLIENTE_01_VINCULOS.length})
            </button>
            {situacoes.map(situacao => (
              <button
                key={situacao}
                onClick={() => setSituacaoFilter(situacao)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  situacaoFilter === situacao
                    ? situacao === "ATIVA"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
                }`}
              >
                {situacao} ({CLIENTE_01_VINCULOS.filter(v => v.situacao_cadastral === situacao).length})
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Funcionario</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">CPF</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">CNPJ</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Razao Social</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Qualificacao</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Situacao</th>
                </tr>
              </thead>
              <tbody>
                {filteredVinculos.map((vinculo, index) => (
                  <tr
                    key={`${vinculo.cpf}-${vinculo.cnpj}-${index}`}
                    className="border-b border-navy-800 hover:bg-navy-800/50 transition-colors cursor-pointer"
                    onClick={() => handleSelectVinculo(vinculo)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-white font-medium hover:text-amber-400 transition-colors">
                        {vinculo.nome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70 font-mono text-sm">
                      {vinculo.cpf}
                    </td>
                    <td className="py-3 px-4 text-white/70 font-mono text-sm">
                      {formatCNPJ(vinculo.cnpj)}
                    </td>
                    <td className="py-3 px-4 text-white/70 text-sm max-w-[250px] truncate">
                      {vinculo.razao_social}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-700 text-white/70">
                        {vinculo.qualificacao}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        vinculo.situacao_cadastral === "ATIVA"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : vinculo.situacao_cadastral === "SUSPENSA"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {vinculo.situacao_cadastral}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVinculos.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50">Nenhum vinculo encontrado</p>
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
