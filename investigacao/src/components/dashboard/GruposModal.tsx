"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import {
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface GruposModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GruposModal({ isOpen, onClose, onSuccess }: GruposModalProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [columnName, setColumnName] = useState("");
  const [grupoName, setGrupoName] = useState("");
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError("Formato de arquivo inválido. Use .xlsx, .xls ou .csv");
      return;
    }

    setFile(selectedFile);
    setError("");

    try {
      // Read file as array buffer
      const arrayBuffer = await selectedFile.arrayBuffer();

      // Parse with xlsx
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert to JSON (array of objects)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
        setError("Arquivo vazio ou sem dados válidos");
        setFile(null);
        return;
      }

      // Get column names from first row
      const columns = Object.keys(jsonData[0] as object);

      setParsedData(jsonData);
      setAvailableColumns(columns);
      setRowCount(jsonData.length);

    } catch (err) {
      console.error("Erro ao fazer parsing do arquivo:", err);
      setError("Erro ao ler arquivo. Verifique se está no formato correto.");
      setFile(null);
      setRowCount(null);
      setParsedData([]);
      setAvailableColumns([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Selecione um arquivo");
      return;
    }

    if (!columnName.trim()) {
      setError("Informe o nome da coluna com CPFs/CNPJs");
      return;
    }

    if (!grupoName.trim()) {
      setError("Informe o nome do grupo");
      return;
    }

    if (parsedData.length === 0) {
      setError("Nenhum dado foi processado. Tente novamente.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Extract CPFs/CNPJs from selected column
      const documentos: string[] = [];

      for (const row of parsedData) {
        const valor = row[columnName];

        if (valor && typeof valor === "string" && valor.trim()) {
          // Clean document (remove dots, slashes, dashes)
          const docLimpo = valor.replace(/[.\-\/\s]/g, "").trim();

          // Validate if it's CPF (11 digits) or CNPJ (14 digits)
          if (docLimpo.match(/^\d{11}$/) || docLimpo.match(/^\d{14}$/)) {
            documentos.push(docLimpo);
          }
        } else if (valor && typeof valor === "number") {
          // If it's a number, convert to string
          const docStr = valor.toString().replace(/[.\-\/\s]/g, "").trim();
          if (docStr.match(/^\d{11}$/) || docStr.match(/^\d{14}$/)) {
            documentos.push(docStr);
          }
        }
      }

      if (documentos.length === 0) {
        setError("Nenhum CPF/CNPJ válido encontrado na coluna selecionada");
        setIsProcessing(false);
        return;
      }

      // Get auth token
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const token = await user.getIdToken();

      // Send to backend
      const response = await fetch("/api/grupos/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          grupoName: grupoName.trim(),
          documentos: documentos,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao processar análise em lote");
      }

      setSuccess(true);

      // Call success callback after short delay
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1500);

    } catch (err) {
      console.error("Erro ao processar arquivo:", err);
      setError(err instanceof Error ? err.message : "Erro ao processar arquivo. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setColumnName("");
    setGrupoName("");
    setRowCount(null);
    setParsedData([]);
    setAvailableColumns([]);
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-navy-900 border-b border-slate-400 dark:border-navy-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Análise em Lote - Grupos</h2>
                    <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
                      Importe um arquivo Excel ou CSV com CPFs/CNPJs
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-slate-900 dark:text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-emerald-400 font-medium">Arquivo processado com sucesso!</p>
                      <p className="text-emerald-400/70 text-sm">As análises foram iniciadas em segundo plano.</p>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-900 dark:text-white/90 mb-2">
                    Arquivo Excel ou CSV
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      disabled={isProcessing || success}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
                        file
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-navy-600 hover:border-navy-500 bg-slate-100 dark:bg-navy-800/50"
                      } ${isProcessing || success ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {file ? (
                        <>
                          <FileSpreadsheet className="w-8 h-8 text-green-400" />
                          <div className="text-left">
                            <p className="text-slate-900 dark:text-white font-medium">{file.name}</p>
                            <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-900 dark:text-white/40" />
                          <div className="text-center">
                            <p className="text-slate-900 dark:text-slate-900 dark:text-white/90">Clique para selecionar um arquivo</p>
                            <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm">Excel (.xlsx, .xls) ou CSV</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Group Name */}
                <div>
                  <label htmlFor="grupoName" className="block text-sm font-medium text-slate-900 dark:text-slate-900 dark:text-white/90 mb-2">
                    Nome do Grupo *
                  </label>
                  <input
                    type="text"
                    id="grupoName"
                    value={grupoName}
                    onChange={(e) => setGrupoName(e.target.value)}
                    placeholder="Ex: Funcionários RH, Fornecedores 2024..."
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                    disabled={isProcessing || success}
                    required
                  />
                  <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 mt-1">
                    Este nome será usado para agrupar todas as pessoas deste arquivo
                  </p>
                </div>

                {/* Column Name */}
                {availableColumns.length > 0 ? (
                  <div>
                    <label htmlFor="columnName" className="block text-sm font-medium text-slate-900 dark:text-slate-900 dark:text-white/90 mb-2">
                      Coluna com CPF/CNPJ *
                    </label>
                    <select
                      id="columnName"
                      value={columnName}
                      onChange={(e) => setColumnName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                      disabled={isProcessing || success}
                      required
                    >
                      <option value="">Selecione a coluna...</option>
                      {availableColumns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 mt-1">
                      Selecione a coluna que contém os CPFs ou CNPJs
                    </p>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="columnName" className="block text-sm font-medium text-slate-900 dark:text-slate-900 dark:text-white/90 mb-2">
                      Nome da Coluna com CPF/CNPJ *
                    </label>
                    <input
                      type="text"
                      id="columnName"
                      value={columnName}
                      onChange={(e) => setColumnName(e.target.value)}
                      placeholder="Primeiro faça upload do arquivo..."
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                      disabled={true}
                      required
                    />
                    <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 mt-1">
                      As colunas aparecerão após o upload do arquivo
                    </p>
                  </div>
                )}

                {/* Row Count Preview */}
                {rowCount !== null && (
                  <div className="bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg p-4">
                    <p className="text-slate-900 dark:text-slate-900 dark:text-white/90">
                      <span className="font-semibold text-green-400">{rowCount}</span> registro(s) detectado(s)
                    </p>
                    <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm mt-1">
                      (Excluindo linha de cabeçalho)
                    </p>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 text-sm">
                    <strong>Como funciona:</strong> O sistema lerá o arquivo, extrairá os CPFs/CNPJs da coluna
                    especificada e executará uma análise completa de cada documento em segundo plano.
                    Você receberá notificações conforme as análises forem concluídas.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="flex-1 bg-slate-100 dark:bg-navy-800 hover:bg-navy-700 text-slate-900 dark:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!file || !columnName.trim() || !grupoName.trim() || isProcessing || success}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-navy-950 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Iniciar Análise
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

