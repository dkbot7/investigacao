"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  X,
  Download,
  Shield,
  Calendar,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FichaFuncionario } from "@/components/dashboard/FichaFuncionario";
import {
  CLIENTE_01_SANCIONADOS,
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

export default function SancionadosPage() {
  const [search, setSearch] = useState("");
  const [selectedFuncionario, setSelectedFuncionario] = useState<FuncionarioSelecionado | null>(null);

  // Filtrar por busca
  const filteredSancionados = CLIENTE_01_SANCIONADOS.filter(s =>
    search === "" ||
    s.nome.toLowerCase().includes(search.toLowerCase()) ||
    s.cpf.includes(search)
  );

  // Exportar CSV
  const exportCSV = () => {
    const headers = ['nome', 'cpf', 'tipo', 'orgao', 'motivo', 'dataInicio', 'dataFim', 'grupo'];
    const bom = '\uFEFF';
    const rows = CLIENTE_01_SANCIONADOS.map(s =>
      headers.map(h => {
        const val = s[h as keyof typeof s];
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
    link.download = `sancionados_CLIENTE_01_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSelectSancionado = (sancionado: typeof CLIENTE_01_SANCIONADOS[0]) => {
    const funcionario = CLIENTE_01_FUNCIONARIOS.find(f => f.cpf === sancionado.cpf) || {
      id: sancionado.id,
      nome: sancionado.nome,
      cpf: sancionado.cpf,
      grupo: sancionado.grupo,
      esta_vivo: "SIM",
      esta_morto: "NAO",
      recebe_beneficio: 0,
      socio_empresa: 0,
      doador_campanha: 0,
      candidato: 0,
      sancionado_ceis: 1,
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
              <AlertTriangle className="w-7 h-7 text-red-400" />
              Sancionados (CEIS/CNEP)
            </h1>
            <p className="text-white/60 mt-1">
              {CLIENTE_01_STATS?.totais?.sancionados || 0} funcionario(s) com sancoes identificadas
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
            <h3 className="text-red-400 font-semibold">Alerta de Integridade</h3>
            <p className="text-white/70 text-sm mt-1">
              Foram identificados <strong className="text-white">{CLIENTE_01_STATS?.totais?.sancionados || 0} funcionario(s)</strong> com
              sancoes ativas no CEIS (Cadastro de Empresas Inidoineas e Suspensas) ou CNEP (Cadastro Nacional de Empresas Punidas).
              Recomenda-se verificacao imediata da compatibilidade com os cargos ocupados.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{CLIENTE_01_STATS?.totais?.sancionados || 0}</p>
                <p className="text-xs text-white/50">Total Sancionados</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {CLIENTE_01_SANCIONADOS.filter(s => s.tipo === "CEIS").length}
                </p>
                <p className="text-xs text-white/50">CEIS</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {CLIENTE_01_SANCIONADOS.filter(s => s.tipo === "CNEP").length}
                </p>
                <p className="text-xs text-white/50">CNEP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy-800/50 border-b border-navy-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Nome</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">CPF</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Orgao</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Motivo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Vigencia</th>
                </tr>
              </thead>
              <tbody>
                {filteredSancionados.map((sancionado) => (
                  <tr
                    key={sancionado.id}
                    className="border-b border-navy-800 hover:bg-navy-800/50 transition-colors cursor-pointer"
                    onClick={() => handleSelectSancionado(sancionado)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-white font-medium hover:text-red-400 transition-colors">
                        {sancionado.nome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70 font-mono text-sm">
                      {sancionado.cpf}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        sancionado.tipo === "CEIS"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}>
                        {sancionado.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70 text-sm">
                      {sancionado.orgao}
                    </td>
                    <td className="py-3 px-4 text-white/70 text-sm max-w-[300px]">
                      {sancionado.motivo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-white/70">{sancionado.dataInicio}</span>
                        <span className="text-white/40">a</span>
                        <span className="text-red-400 font-medium">{sancionado.dataFim}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSancionados.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-emerald-400/30 mx-auto mb-3" />
              <p className="text-white/50">Nenhum sancionado encontrado</p>
            </div>
          )}
        </div>

        {/* Info adicional */}
        <div className="bg-navy-900/50 border border-navy-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Sobre o CEIS e CNEP</h4>
              <ul className="text-sm text-white/60 space-y-1">
                <li>• <strong>CEIS</strong> - Cadastro de Empresas Inidoineas e Suspensas: empresas e pessoas sancionadas</li>
                <li>• <strong>CNEP</strong> - Cadastro Nacional de Empresas Punidas: punicoes da Lei Anticorrupcao</li>
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
