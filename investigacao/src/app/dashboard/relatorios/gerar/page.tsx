"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Download,
  Eye,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  Building2,
  Calendar,
  FileSignature,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reportService, type ReportData } from "@/lib/services/report.service";
import { toast } from "sonner";

export default function GerarRelatorioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ReportData>>({
    investigacao: {
      id: "",
      tipo: "due_diligence",
      dataInicio: new Date().toISOString().split("T")[0],
      responsavel: "",
      status: "em_andamento",
    },
    pessoa: {
      nome: "",
      cpf: "",
    },
    conclusoes: [],
  });

  const handleGeneratePreview = async () => {
    if (!validateForm()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const reportData = buildReportData();
      const preview = await reportService.previewReport(reportData);
      setPreviewUrl(preview);
      toast.success("Preview gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar preview:", error);
      toast.error("Erro ao gerar preview do relatório");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!validateForm()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const reportData = buildReportData();
      const filename = `relatorio-${formData.pessoa?.cpf?.replace(/\D/g, "")}-${Date.now()}.pdf`;
      await reportService.downloadReport(reportData, filename);
      toast.success("Relatório baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      toast.error("Erro ao baixar relatório");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.investigacao?.id) return false;
    if (!formData.investigacao?.responsavel) return false;
    if (!formData.pessoa?.nome) return false;
    if (!formData.pessoa?.cpf && !formData.pessoa?.cnpj) return false;
    return true;
  };

  const buildReportData = (): ReportData => {
    return {
      investigacao: {
        id: formData.investigacao!.id!,
        tipo: formData.investigacao!.tipo!,
        dataInicio: formData.investigacao!.dataInicio!,
        responsavel: formData.investigacao!.responsavel!,
        status: formData.investigacao!.status!,
      },
      pessoa: {
        nome: formData.pessoa!.nome!,
        cpf: formData.pessoa?.cpf,
        cnpj: formData.pessoa?.cnpj,
        nascimento: formData.pessoa?.nascimento,
        rg: formData.pessoa?.rg,
        nomeMae: formData.pessoa?.nomeMae,
        situacaoCpf: formData.pessoa?.situacaoCpf,
        email: formData.pessoa?.email,
        telefone: formData.pessoa?.telefone,
        endereco: formData.pessoa?.endereco,
      },
      empresas: formData.empresas || [],
      dividas: formData.dividas || [],
      processos: formData.processos || [],
      candidaturas: formData.candidaturas || [],
      beneficios: formData.beneficios || [],
      alertas: formData.alertas || [],
      conclusoes: formData.conclusoes || [
        "Análise realizada com base em dados públicos oficiais",
        "Recomenda-se verificação adicional de informações críticas",
      ],
      recomendacoes: formData.recomendacoes,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900">
      {/* Header */}
      <header className="border-b border-slate-300 dark:border-navy-800 bg-white dark:bg-navy-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/dashboard/relatorios">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 dark:text-white/60 hover:text-white hover:bg-navy-800"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold gradient-text">Gerar Relatório</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Informações da Investigação */}
            <div className="bg-white dark:bg-navy-900 border border-navy-700 rounded-xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileSignature className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                Informações da Investigação
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    ID da Investigação *
                  </label>
                  <Input
                    type="text"
                    placeholder="INV-2025-001"
                    value={formData.investigacao?.id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        investigacao: { ...formData.investigacao!, id: e.target.value },
                      })
                    }
                    className="bg-navy-800 border-navy-700 text-white text-sm sm:text-base pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Tipo de Investigação *
                  </label>
                  <select
                    value={formData.investigacao?.tipo || "due_diligence"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        investigacao: {
                          ...formData.investigacao!,
                          tipo: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-3 sm:px-3 py-2 sm:py-2 bg-navy-800 border border-navy-700 rounded-lg text-sm sm:text-base text-white"
                  >
                    <option value="pessoa_fisica">Pessoa Física</option>
                    <option value="pessoa_juridica">Pessoa Jurídica</option>
                    <option value="due_diligence">Due Diligence Completa</option>
                    <option value="background_check">Background Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Responsável *
                  </label>
                  <Input
                    type="text"
                    placeholder="Nome do responsável"
                    value={formData.investigacao?.responsavel || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        investigacao: {
                          ...formData.investigacao!,
                          responsavel: e.target.value,
                        },
                      })
                    }
                    className="bg-navy-800 border-navy-700 text-white text-sm sm:text-base pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Data de Início *
                  </label>
                  <Input
                    type="date"
                    value={formData.investigacao?.dataInicio || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        investigacao: {
                          ...formData.investigacao!,
                          dataInicio: e.target.value,
                        },
                      })
                    }
                    className="bg-navy-800 border-navy-700 text-white text-sm sm:text-base pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Dados da Pessoa */}
            <div className="bg-white dark:bg-navy-900 border border-navy-700 rounded-xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                Dados da Pessoa
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    type="text"
                    placeholder="Nome completo da pessoa"
                    value={formData.pessoa?.nome || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pessoa: { ...formData.pessoa!, nome: e.target.value },
                      })
                    }
                    className="bg-navy-800 border-navy-700 text-white text-sm sm:text-base pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2.5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      CPF
                    </label>
                    <Input
                      type="text"
                      placeholder="000.000.000-00"
                      value={formData.pessoa?.cpf || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pessoa: { ...formData.pessoa!, cpf: e.target.value },
                        })
                      }
                      className="bg-navy-800 border-navy-700 text-white text-sm sm:text-base pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      CNPJ
                    </label>
                    <Input
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={formData.pessoa?.cnpj || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pessoa: { ...formData.pessoa!, cnpj: e.target.value },
                        })
                      }
                      className="bg-navy-800 border-navy-700 text-white text-sm sm:text-base pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      Data de Nascimento
                    </label>
                    <Input
                      type="date"
                      value={formData.pessoa?.nascimento || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pessoa: { ...formData.pessoa!, nascimento: e.target.value },
                        })
                      }
                      className="bg-navy-800 border-navy-700 text-white text-sm sm:text-base pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">
                      RG
                    </label>
                    <Input
                      type="text"
                      placeholder="00.000.000-0"
                      value={formData.pessoa?.rg || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pessoa: { ...formData.pessoa!, rg: e.target.value },
                        })
                      }
                      className="bg-navy-800 border-navy-700 text-white text-sm sm:text-base pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    E-mail
                  </label>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.pessoa?.email || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pessoa: { ...formData.pessoa!, email: e.target.value },
                      })
                    }
                    className="bg-navy-800 border-navy-700 text-white text-sm sm:text-base pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={handleGeneratePreview}
                disabled={loading || !validateForm()}
                className="flex-1 bg-navy-800 hover:bg-navy-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Gerar Preview
                  </>
                )}
              </Button>

              <Button
                onClick={handleDownload}
                disabled={loading || !validateForm()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-navy-950"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Baixando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Baixar PDF
                  </>
                )}
              </Button>
            </div>

            {/* Informações */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-white/70">
                  <p className="font-medium text-blue-400 mb-1">Campos obrigatórios</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>ID da Investigação</li>
                    <li>Responsável</li>
                    <li>Nome da Pessoa</li>
                    <li>CPF ou CNPJ</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-white dark:bg-navy-900 border border-navy-700 rounded-xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                Preview do Relatório
              </h2>

              {previewUrl ? (
                <div className="space-y-4">
                  <iframe
                    src={previewUrl}
                    className="w-full h-[600px] border border-navy-700 rounded-lg"
                    title="Preview do Relatório"
                  />
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    Preview gerado com sucesso
                  </div>
                </div>
              ) : (
                <div className="h-[600px] border border-navy-700 rounded-lg flex items-center justify-center text-white/40">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Preencha o formulário e clique em "Gerar Preview"</p>
                    <p className="text-sm mt-2">para visualizar o relatório</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
