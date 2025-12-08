"use client";

import { useState, useRef } from "react";
import { Upload, Download, FileText, AlertTriangle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  parseCSV,
  generateCSVTemplate,
  validateFileSize,
  validateFileType,
  formatParseStats,
  type ParseResult,
} from "@/lib/utils/csv-parser";
import { importarFuncionarios } from "@/lib/services/dados.service";

interface UploadCsvButtonProps {
  tenantCode: string;
  onSuccess?: (jobId: number, count: number) => void;
  onError?: (error: string) => void;
}

export function UploadCsvButton({
  tenantCode,
  onSuccess,
  onError,
}: UploadCsvButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Download template
  const handleDownloadTemplate = () => {
    const blob = generateCSVTemplate();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-funcionarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!validateFileType(selectedFile)) {
      onError?.("Tipo de arquivo inválido. Use apenas arquivos CSV.");
      return;
    }

    // Validate file size (10MB max)
    if (!validateFileSize(selectedFile, 10)) {
      onError?.("Arquivo muito grande. Tamanho máximo: 10MB.");
      return;
    }

    setFile(selectedFile);

    // Parse CSV
    try {
      const result = await parseCSV(selectedFile, {
        skipHeader: true,
        validateCPF: true,
      });

      setParseResult(result);

      if (!result.success) {
        onError?.(
          `Erro ao processar CSV: ${result.errors.length} erros encontrados`
        );
      }
    } catch (error: any) {
      onError?.(`Erro ao ler arquivo: ${error.message}`);
      setFile(null);
      setParseResult(null);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!parseResult || !parseResult.success || parseResult.data.length === 0) {
      onError?.("Nenhum dado válido para importar");
      return;
    }

    try {
      setUploading(true);

      const response = await importarFuncionarios(
        tenantCode,
        parseResult.data
      );

      if (response.success) {
        onSuccess?.(response.job_id || 0, response.funcionarios_imported);

        // Reset state
        setFile(null);
        setParseResult(null);
        setIsOpen(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        onError?.("Erro ao importar funcionários");
      }
    } catch (error: any) {
      onError?.(error.message || "Erro ao fazer upload");
    } finally {
      setUploading(false);
    }
  };

  // Reset
  const handleReset = () => {
    setFile(null);
    setParseResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
      >
        <Upload className="w-4 h-4 mr-2" />
        Importar CSV
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-navy-700">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Importar Funcionários (CSV)
                </h2>
                <p className="text-sm text-slate-600 dark:text-white/60 mt-1">
                  Faça upload de um arquivo CSV com os dados dos funcionários
                </p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleReset();
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Download Template */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-400 mb-1">
                      Template CSV
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-white/60 mb-3">
                      Baixe o template CSV para garantir que seu arquivo está no
                      formato correto.
                    </p>
                    <Button
                      onClick={handleDownloadTemplate}
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Template
                    </Button>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Selecionar Arquivo CSV
                </label>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileSelect}
                    className="flex-1 text-sm text-slate-600 dark:text-white/60
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-500 file:text-white
                      hover:file:bg-blue-600
                      cursor-pointer"
                  />
                  {file && (
                    <Button
                      onClick={handleReset}
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Parse Result */}
              {parseResult && (
                <div className="space-y-3">
                  {/* Stats */}
                  <div className="flex items-center gap-2">
                    {parseResult.success ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {formatParseStats(parseResult.stats)}
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {parseResult.errors.length} erros
                      </Badge>
                    )}
                  </div>

                  {/* Preview Data */}
                  {parseResult.data.length > 0 && (
                    <div className="bg-slate-100 dark:bg-navy-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        Prévia ({parseResult.data.length} registros)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-300 dark:border-navy-700">
                              <th className="text-left py-2 px-2 text-slate-600 dark:text-white/60">
                                CPF
                              </th>
                              <th className="text-left py-2 px-2 text-slate-600 dark:text-white/60">
                                Nome
                              </th>
                              <th className="text-left py-2 px-2 text-slate-600 dark:text-white/60">
                                Grupo
                              </th>
                              <th className="text-left py-2 px-2 text-slate-600 dark:text-white/60">
                                Cargo
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {parseResult.data.slice(0, 5).map((func, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-slate-200 dark:border-navy-800"
                              >
                                <td className="py-2 px-2 font-mono text-slate-900 dark:text-white">
                                  {func.cpf}
                                </td>
                                <td className="py-2 px-2 text-slate-900 dark:text-white">
                                  {func.nome || "-"}
                                </td>
                                <td className="py-2 px-2 text-slate-900 dark:text-white">
                                  {func.grupo || "-"}
                                </td>
                                <td className="py-2 px-2 text-slate-900 dark:text-white">
                                  {func.cargo || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {parseResult.data.length > 5 && (
                          <p className="text-xs text-slate-500 dark:text-white/50 mt-2">
                            + {parseResult.data.length - 5} registros
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {parseResult.errors.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Erros Encontrados ({parseResult.errors.length})
                      </h4>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {parseResult.errors.slice(0, 10).map((error, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-red-400 font-mono"
                          >
                            Linha {error.line}: {error.error}
                          </div>
                        ))}
                        {parseResult.errors.length > 10 && (
                          <p className="text-xs text-red-400/60 mt-2">
                            + {parseResult.errors.length - 10} erros
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Warning */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-400 mb-1">
                      Processamento em Background
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-white/60">
                      Os CPFs serão consultados no SERPRO em background (1
                      req/s). Você pode acompanhar o progresso na lista de jobs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-navy-700">
              <Button
                onClick={() => {
                  setIsOpen(false);
                  handleReset();
                }}
                variant="ghost"
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                disabled={
                  !parseResult ||
                  !parseResult.success ||
                  parseResult.data.length === 0 ||
                  uploading
                }
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar {parseResult?.data.length || 0} Registros
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
