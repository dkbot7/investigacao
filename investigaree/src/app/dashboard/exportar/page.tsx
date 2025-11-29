"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Users,
  HeartPulse,
  Vote,
  Heart,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CLIENTE_01_FUNCIONARIOS,
  CLIENTE_01_OBITOS,
  CLIENTE_01_CANDIDATOS,
  CLIENTE_01_DOADORES,
  CLIENTE_01_SANCIONADOS,
  CLIENTE_01_BENEFICIOS,
  CLIENTE_01_STATS,
} from "../_data/mock-data";

type ExportType = "funcionarios" | "obitos" | "candidatos" | "doadores" | "sancionados" | "beneficios" | "vinculos";

interface ExportOption {
  id: ExportType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  count: number;
}

export default function ExportarPage() {
  const [exporting, setExporting] = useState<ExportType | null>(null);
  const [exportSuccess, setExportSuccess] = useState<ExportType | null>(null);
  const [grupoFilter, setGrupoFilter] = useState<string>("todos");

  const exportOptions: ExportOption[] = [
    {
      id: "funcionarios",
      label: "Todos Funcionarios",
      description: "Lista completa com todas as verificacoes",
      icon: Users,
      color: "text-blue-400",
      count: CLIENTE_01_STATS.totalFuncionarios,
    },
    {
      id: "obitos",
      label: "Obitos",
      description: "Funcionarios falecidos identificados",
      icon: HeartPulse,
      color: "text-red-400",
      count: CLIENTE_01_STATS.totais.obitos,
    },
    {
      id: "candidatos",
      label: "Candidatos",
      description: "Funcionarios que foram candidatos em eleicoes",
      icon: Vote,
      color: "text-purple-400",
      count: CLIENTE_01_STATS.totais.candidatos,
    },
    {
      id: "doadores",
      label: "Doadores de Campanha",
      description: "Funcionarios que doaram para campanhas eleitorais",
      icon: Heart,
      color: "text-emerald-400",
      count: CLIENTE_01_STATS.totais.doadores,
    },
    {
      id: "sancionados",
      label: "Sancionados",
      description: "Funcionarios com sancoes CEIS/CNEP",
      icon: AlertTriangle,
      color: "text-red-400",
      count: CLIENTE_01_STATS.totais.sancionados,
    },
    {
      id: "vinculos",
      label: "Vinculos Empresariais",
      description: "Funcionarios socios de empresas",
      icon: Briefcase,
      color: "text-amber-400",
      count: CLIENTE_01_STATS.totais.socios,
    },
    {
      id: "beneficios",
      label: "Beneficiarios",
      description: "Funcionarios que receberam beneficios sociais",
      icon: FileText,
      color: "text-cyan-400",
      count: CLIENTE_01_STATS.totais.beneficiarios,
    },
  ];

  const convertToCSV = (data: any[], headers: string[]): string => {
    const bom = '\uFEFF'; // UTF-8 BOM for Excel
    const headerRow = headers.join(';');
    const rows = data.map(item =>
      headers.map(h => {
        const val = item[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'string' && (val.includes(';') || val.includes('"'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return String(val);
      }).join(';')
    );
    return bom + [headerRow, ...rows].join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExport = async (type: ExportType) => {
    setExporting(type);
    setExportSuccess(null);

    // Simular delay para UX
    await new Promise(resolve => setTimeout(resolve, 800));

    let data: any[] = [];
    let headers: string[] = [];
    let filename = '';

    switch (type) {
      case "funcionarios":
        data = CLIENTE_01_FUNCIONARIOS;
        if (grupoFilter !== "todos") {
          data = data.filter(f => f.grupo === grupoFilter);
        }
        headers = ['nome', 'cpf', 'grupo', 'cargo', 'esta_vivo', 'esta_morto', 'ano_obito', 'recebe_beneficio', 'doador_campanha', 'candidato', 'sancionado_ceis', 'socio_empresa'];
        filename = `funcionarios_${grupoFilter}_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case "obitos":
        data = CLIENTE_01_OBITOS;
        headers = ['cadastro', 'nome', 'cpf', 'grupo', 'ano_obito'];
        filename = `obitos_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case "candidatos":
        data = CLIENTE_01_CANDIDATOS;
        headers = ['nome', 'cpf', 'cargo', 'partido', 'uf', 'ano', 'situacao', 'grupo'];
        filename = `candidatos_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case "doadores":
        data = CLIENTE_01_DOADORES;
        headers = ['nome', 'cpf', 'valor', 'candidato', 'partido', 'ano', 'grupo'];
        filename = `doadores_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case "sancionados":
        data = CLIENTE_01_SANCIONADOS;
        headers = ['nome', 'cpf', 'tipo', 'orgao', 'motivo', 'dataInicio', 'dataFim', 'grupo'];
        filename = `sancionados_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case "beneficios":
        data = CLIENTE_01_BENEFICIOS;
        headers = ['nome', 'cpf', 'tipo', 'valor', 'ano', 'grupo'];
        filename = `beneficiarios_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case "vinculos":
        // Por enquanto usa dados agregados
        data = CLIENTE_01_FUNCIONARIOS.filter(f => f.socio_empresa === 1);
        headers = ['nome', 'cpf', 'grupo', 'qtd_empresas'];
        filename = `vinculos_${new Date().toISOString().split('T')[0]}.csv`;
        break;
    }

    const csv = convertToCSV(data, headers);
    downloadCSV(csv, filename);

    setExporting(null);
    setExportSuccess(type);

    // Limpar sucesso após 3 segundos
    setTimeout(() => setExportSuccess(null), 3000);
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
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Download className="w-7 h-7 text-gold-400" />
            Exportar Dados
          </h1>
          <p className="text-white/60 mt-1">
            Exporte os dados em formato CSV para analise externa
          </p>
        </div>

        {/* Filtro de Grupo */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-white/50" />
            <span className="text-sm font-medium text-white/70">Filtrar por Grupo (aplicavel a Funcionarios)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setGrupoFilter("todos")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                grupoFilter === "todos"
                  ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                  : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
              }`}
            >
              Todos os Grupos
            </button>
            {CLIENTE_01_STATS.grupos.map(g => (
              <button
                key={g.nome}
                onClick={() => setGrupoFilter(g.nome)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  grupoFilter === g.nome
                    ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                    : "bg-navy-800 text-white/60 hover:text-white border border-navy-700"
                }`}
              >
                {g.nome} ({g.registros.toLocaleString()})
              </button>
            ))}
          </div>
        </div>

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isExporting = exporting === option.id;
            const isSuccess = exportSuccess === option.id;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: exportOptions.indexOf(option) * 0.05 }}
                className={`bg-navy-900 border rounded-xl p-5 transition-all ${
                  isSuccess
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-navy-700 hover:border-navy-600"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg bg-navy-800`}>
                    <Icon className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <span className="text-sm font-medium text-white/50">
                    {option.count.toLocaleString()} registros
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">
                  {option.label}
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  {option.description}
                </p>

                <Button
                  onClick={() => handleExport(option.id)}
                  disabled={isExporting || option.count === 0}
                  className={`w-full ${
                    isSuccess
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-gold-500/20 hover:bg-gold-500/30 text-gold-400"
                  }`}
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exportando...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Exportado!
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Exportar CSV
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Info */}
        <div className="bg-navy-900/50 border border-navy-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Sobre os arquivos exportados</h4>
              <ul className="text-sm text-white/60 space-y-1">
                <li>• Formato: CSV (separado por ponto e virgula) compativel com Excel</li>
                <li>• Codificacao: UTF-8 com BOM para acentuacao correta</li>
                <li>• Os dados sao os mesmos exibidos no dashboard</li>
                <li>• Arquivos nao contem dados sensiveis de terceiros alem do publico</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
