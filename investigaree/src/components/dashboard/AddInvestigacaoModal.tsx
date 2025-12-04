"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Loader2, Building2, User, Phone, MapPin, Search, DollarSign, Clock, Upload, FileSpreadsheet, ArrowLeft } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { createInvestigation, importInvestigations } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type ModalMode = "select" | "pessoa_fisica" | "pessoa_juridica" | "arquivo";

interface AddInvestigacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddInvestigacaoModal({ isOpen, onClose, onSuccess }: AddInvestigacaoModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ModalMode>("select");
  const [tipoPessoa, setTipoPessoa] = useState<"fisica" | "juridica">("fisica");

  // Estados para upload de arquivo
  const [file, setFile] = useState<File | null>(null);
  const [columnName, setColumnName] = useState("");
  const [grupoName, setGrupoName] = useState("");
  const [rowCount, setRowCount] = useState<number | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    // Dados básicos
    nome: "",
    cpf_cnpj: "",
    rg: "",
    data_nascimento: "",
    estado_civil: "",
    profissao: "",

    // Categorias (múltiplas)
    categorias: {
      familia: false,
      clientes: false,
      funcionarios: false,
      relacionamentos: false,
      empresas: false,
    },

    // Contato
    telefones: [""],
    email: "",
    endereco: "",
    redes_sociais: {
      instagram: "",
      facebook: "",
      linkedin: "",
    },

    // Investigação
    motivo_investigacao: "",
    nivel_urgencia: "media" as "baixa" | "media" | "alta" | "urgente",
    escopo_investigacao: {
      antecedentes_criminais: false,
      processos_judiciais: false,
      situacao_fiscal: false,
      vinculos_empresariais: false,
      comportamento_rotina: false,
      verificacao_informacoes: false,
    },
    prazo_desejado: "",
    orcamento_maximo: "",
    observacoes: "",

    // Campos opcionais adicionais
    placa_veiculo: "",
    local_trabalho: "",
    grupo: "", // Mantido para compatibilidade
  });

  const handleAddTelefone = () => {
    setFormData(prev => ({
      ...prev,
      telefones: [...prev.telefones, ""]
    }));
  };

  const handleRemoveTelefone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      telefones: prev.telefones.filter((_, i) => i !== index)
    }));
  };

  // Máscara de telefone: (00) 00000-0000
  const formatTelefone = (value: string): string => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  };

  // Máscara de CPF: 000.000.000-00
  const formatCPF = (value: string): string => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
    return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
  };

  // Máscara de CNPJ: 00.000.000/0000-00
  const formatCNPJ = (value: string): string => {
    const nums = value.replace(/\D/g, "").slice(0, 14);
    if (nums.length <= 2) return nums;
    if (nums.length <= 5) return `${nums.slice(0, 2)}.${nums.slice(2)}`;
    if (nums.length <= 8) return `${nums.slice(0, 2)}.${nums.slice(2, 5)}.${nums.slice(5)}`;
    if (nums.length <= 12) return `${nums.slice(0, 2)}.${nums.slice(2, 5)}.${nums.slice(5, 8)}/${nums.slice(8)}`;
    return `${nums.slice(0, 2)}.${nums.slice(2, 5)}.${nums.slice(5, 8)}/${nums.slice(8, 12)}-${nums.slice(12)}`;
  };

  // Formatar documento baseado no tipo
  const formatDocumento = (value: string): string => {
    return tipoPessoa === "fisica" ? formatCPF(value) : formatCNPJ(value);
  };

  const handleTelefoneChange = (index: number, value: string) => {
    const newTelefones = [...formData.telefones];
    newTelefones[index] = formatTelefone(value);
    setFormData(prev => ({ ...prev, telefones: newTelefones }));
  };

  // Funções para upload de arquivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

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
    setError(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
        setError("Arquivo vazio ou sem dados válidos");
        setFile(null);
        return;
      }

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

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !columnName.trim() || !grupoName.trim() || parsedData.length === 0) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const documentos: string[] = [];

      for (const row of parsedData) {
        const valor = row[columnName];
        if (valor && typeof valor === "string" && valor.trim()) {
          const docLimpo = valor.replace(/[.\-\/\s]/g, "").trim();
          if (docLimpo.match(/^\d{11}$/) || docLimpo.match(/^\d{14}$/)) {
            documentos.push(docLimpo);
          }
        } else if (valor && typeof valor === "number") {
          const docStr = valor.toString().replace(/[.\-\/\s]/g, "").trim();
          if (docStr.match(/^\d{11}$/) || docStr.match(/^\d{14}$/)) {
            documentos.push(docStr);
          }
        }
      }

      if (documentos.length === 0) {
        setError("Nenhum CPF/CNPJ válido encontrado na coluna selecionada");
        setLoading(false);
        return;
      }

      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const token = await user.getIdToken();

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

      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Erro ao processar arquivo:", err);
      setError(err instanceof Error ? err.message : "Erro ao processar arquivo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validação mínima - precisa ter pelo menos nome OU documento
      if (!formData.nome.trim() && !formData.cpf_cnpj.trim()) {
        setError("Preencha pelo menos o Nome ou o Documento");
        setLoading(false);
        return;
      }

      // Formatar CPF/CNPJ (remover pontos e traços)
      const docFormatted = formData.cpf_cnpj.replace(/\D/g, "");

      // Preparar categorias como array
      const categoriasArray = Object.entries(formData.categorias)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);

      // Preparar escopo de investigação
      const escopoInvestigacao = Object.entries(formData.escopo_investigacao)
        .filter(([_, value]) => value)
        .reduce((acc, [key, _]) => ({ ...acc, [key]: true }), {});

      // Preparar categoria principal (primeira selecionada)
      const categoriaPrincipal = categoriasArray.length > 0 ? categoriasArray[0] : "funcionarios";

      // Preparar dados para API de investigações
      const data = {
        nome: formData.nome.trim(),
        documento: docFormatted,
        tipo_pessoa: tipoPessoa,
        categoria: categoriaPrincipal,
        nivel_urgencia: formData.nivel_urgencia,

        // Dados pessoais
        rg: formData.rg || undefined,
        data_nascimento: formData.data_nascimento || undefined,
        estado_civil: formData.estado_civil || undefined,
        profissao: formData.profissao || undefined,

        // Contato
        telefones: JSON.stringify(formData.telefones.filter(t => t.trim())),
        email: formData.email || undefined,
        endereco: formData.endereco || undefined,
        redes_sociais: JSON.stringify(formData.redes_sociais),

        // Investigação
        motivo_investigacao: formData.motivo_investigacao,
        escopo_investigacao: JSON.stringify(escopoInvestigacao),
        prazo_desejado: formData.prazo_desejado || undefined,
        observacoes: formData.observacoes || undefined,

        // Opcionais
        placa_veiculo: formData.placa_veiculo || undefined,
      };

      await createInvestigation(data);

      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error("Erro ao solicitar investigação:", err);

      if (err.message?.includes("fetch")) {
        setError("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else if (err.status === 401) {
        setError("Sessão expirada. Recarregue a página ou faça login novamente.");
      } else if (err.status === 409) {
        setError(`${tipoPessoa === "fisica" ? "CPF" : "CNPJ"} já cadastrado no sistema.`);
      } else {
        setError(err.message || "Erro ao solicitar investigação. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMode("select");
    setError(null);
    setFile(null);
    setColumnName("");
    setGrupoName("");
    setRowCount(null);
    setParsedData([]);
    setAvailableColumns([]);
    setFormData({
      nome: "",
      cpf_cnpj: "",
      rg: "",
      data_nascimento: "",
      estado_civil: "",
      profissao: "",
      categorias: {
        familia: false,
        clientes: false,
        funcionarios: false,
        relacionamentos: false,
        empresas: false,
      },
      telefones: [""],
      email: "",
      endereco: "",
      redes_sociais: {
        instagram: "",
        facebook: "",
        linkedin: "",
      },
      motivo_investigacao: "",
      nivel_urgencia: "media",
      escopo_investigacao: {
        antecedentes_criminais: false,
        processos_judiciais: false,
        situacao_fiscal: false,
        vinculos_empresariais: false,
        comportamento_rotina: false,
        verificacao_informacoes: false,
      },
      prazo_desejado: "",
      orcamento_maximo: "",
      observacoes: "",
      placa_veiculo: "",
      local_trabalho: "",
      grupo: "",
    });
    onClose();
  };

  const handleBack = () => {
    setMode("select");
    setError(null);
  };

  if (!isOpen) return null;

  // Tela de seleção inicial
  if (mode === "select") {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-navy-800 border border-navy-700 rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gold-500/20">
                  <UserPlus className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Adicionar</h2>
                  <p className="text-sm text-white/60">Escolha o tipo de cadastro</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-navy-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Options */}
            <div className="p-6 space-y-4">
              {/* Pessoa Física */}
              <button
                onClick={() => { setMode("pessoa_fisica"); setTipoPessoa("fisica"); }}
                className="w-full p-4 rounded-xl border border-navy-600 hover:border-gold-500/50 bg-navy-700/50 hover:bg-navy-700 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">Pessoa Física</h3>
                    <p className="text-sm text-white/60">Cadastrar uma pessoa individual (CPF)</p>
                  </div>
                </div>
              </button>

              {/* Pessoa Jurídica */}
              <button
                onClick={() => { setMode("pessoa_juridica"); setTipoPessoa("juridica"); }}
                className="w-full p-4 rounded-xl border border-navy-600 hover:border-gold-500/50 bg-navy-700/50 hover:bg-navy-700 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                    <Building2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">Pessoa Jurídica</h3>
                    <p className="text-sm text-white/60">Cadastrar uma empresa (CNPJ)</p>
                  </div>
                </div>
              </button>

              {/* Enviar Arquivo */}
              <button
                onClick={() => setMode("arquivo")}
                className="w-full p-4 rounded-xl border border-navy-600 hover:border-gold-500/50 bg-navy-700/50 hover:bg-navy-700 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gold-500/20 group-hover:bg-gold-500/30 transition-colors">
                    <Upload className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">Enviar Arquivo</h3>
                    <p className="text-sm text-white/60">Importar lista de CPFs/CNPJs via Excel ou CSV</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // Tela de upload de arquivo
  if (mode === "arquivo") {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-navy-800 border border-navy-700 rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-700">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-navy-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="p-2 rounded-lg bg-gold-500/20">
                  <Upload className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Enviar Arquivo</h2>
                  <p className="text-sm text-white/60">Importe uma lista de CPFs/CNPJs</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-navy-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFileSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Arquivo Excel ou CSV *
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="file-upload"
                  className={`flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
                    file ? "border-gold-500/50 bg-gold-500/10" : "border-navy-600 hover:border-navy-500 bg-navy-700/50"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {file ? (
                    <>
                      <FileSpreadsheet className="w-8 h-8 text-gold-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-white/50 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-white/40" />
                      <div className="text-center">
                        <p className="text-white/90">Clique para selecionar um arquivo</p>
                        <p className="text-white/50 text-sm">Excel (.xlsx, .xls) ou CSV</p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {/* Group Name */}
              <div>
                <label htmlFor="grupoName" className="block text-sm font-medium text-white/90 mb-2">
                  Nome do Grupo *
                </label>
                <input
                  type="text"
                  id="grupoName"
                  value={grupoName}
                  onChange={(e) => setGrupoName(e.target.value)}
                  placeholder="Ex: Fornecedores 2024, Funcionários RH..."
                  className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  disabled={loading}
                  required
                />
              </div>

              {/* Column Selection */}
              {availableColumns.length > 0 ? (
                <div>
                  <label htmlFor="columnName" className="block text-sm font-medium text-white/90 mb-2">
                    Coluna com CPF/CNPJ *
                  </label>
                  <select
                    id="columnName"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    disabled={loading}
                    required
                  >
                    <option value="">Selecione a coluna...</option>
                    {availableColumns.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Coluna com CPF/CNPJ *
                  </label>
                  <input
                    type="text"
                    placeholder="Primeiro faça upload do arquivo..."
                    className="w-full px-4 py-2.5 bg-navy-700 border border-navy-600 rounded-lg text-white/40"
                    disabled
                  />
                </div>
              )}

              {/* Row Count */}
              {rowCount !== null && (
                <div className="bg-navy-700 border border-navy-600 rounded-lg p-4">
                  <p className="text-white/90">
                    <span className="font-semibold text-gold-400">{rowCount}</span> registro(s) detectado(s)
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={loading}
                  className="flex-1 bg-navy-700 hover:bg-navy-600 text-white"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={!file || !columnName.trim() || !grupoName.trim() || loading}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // Formulário de Pessoa Física/Jurídica
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-navy-800 border border-navy-700 rounded-xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-navy-700 bg-navy-800/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-navy-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="p-2 rounded-lg bg-gold-500/20">
                {tipoPessoa === "fisica" ? <User className="w-5 h-5 text-gold-400" /> : <Building2 className="w-5 h-5 text-gold-400" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{tipoPessoa === "fisica" ? "Pessoa Física" : "Pessoa Jurídica"}</h2>
                <p className="text-sm text-white/60">Cadastre pessoa ou empresa para investigação</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white/60 hover:text-white"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 text-sm text-red-400 rounded-lg bg-red-500/10 border border-red-500/30"
              >
                {error}
              </motion.div>
            )}

            {/* Tipo de Pessoa */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Tipo de Pessoa</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTipoPessoa("fisica")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                    tipoPessoa === "fisica"
                      ? "bg-gold-500/20 border-gold-500/50 text-gold-400"
                      : "bg-navy-700 border-navy-600 text-white/60 hover:border-navy-500"
                  }`}
                >
                  <User className="w-5 h-5" />
                  Pessoa Física
                </button>
                <button
                  type="button"
                  onClick={() => setTipoPessoa("juridica")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                    tipoPessoa === "juridica"
                      ? "bg-gold-500/20 border-gold-500/50 text-gold-400"
                      : "bg-navy-700 border-navy-600 text-white/60 hover:border-navy-500"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  Pessoa Jurídica
                </button>
              </div>
            </div>

            {/* Categorias */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Categorias</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries({
                  familia: "Família",
                  clientes: "Clientes",
                  funcionarios: tipoPessoa === "fisica" ? "Funcionários" : "Empresas",
                  relacionamentos: "Relacionamentos",
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 hover:border-navy-500 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={(formData.categorias as any)[key]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        categorias: { ...prev.categorias, [key]: e.target.checked }
                      }))}
                      className="w-4 h-4 text-gold-500 bg-navy-600 border-navy-500 rounded focus:ring-gold-500"
                    />
                    <span className="text-sm text-white">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dados Básicos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-navy-700 pb-2">Dados Básicos</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    placeholder={tipoPessoa === "fisica" ? "João da Silva" : "Empresa LTDA"}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">{tipoPessoa === "fisica" ? "CPF" : "CNPJ"}</label>
                  <input
                    type="text"
                    value={formData.cpf_cnpj}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf_cnpj: formatDocumento(e.target.value) }))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 font-mono"
                    placeholder={tipoPessoa === "fisica" ? "000.000.000-00" : "00.000.000/0000-00"}
                  />
                </div>
              </div>

              {tipoPessoa === "fisica" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">RG</label>
                    <input
                      type="text"
                      value={formData.rg}
                      onChange={(e) => setFormData(prev => ({ ...prev, rg: e.target.value }))}
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                      placeholder="00.000.000-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">Data de Nascimento</label>
                    <input
                      type="date"
                      value={formData.data_nascimento}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    />
                  </div>
                </div>
              )}

              {tipoPessoa === "fisica" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">Estado Civil</label>
                    <select
                      value={formData.estado_civil}
                      onChange={(e) => setFormData(prev => ({ ...prev, estado_civil: e.target.value }))}
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="solteiro">Solteiro(a)</option>
                      <option value="casado">Casado(a)</option>
                      <option value="divorciado">Divorciado(a)</option>
                      <option value="viuvo">Viúvo(a)</option>
                      <option value="uniao_estavel">União Estável</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">Profissão</label>
                    <input
                      type="text"
                      value={formData.profissao}
                      onChange={(e) => setFormData(prev => ({ ...prev, profissao: e.target.value }))}
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                      placeholder="Ex: Engenheiro, Médico..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-navy-700 pb-2">Contato</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-white">Telefones</label>
                  <button
                    type="button"
                    onClick={handleAddTelefone}
                    className="text-xs text-gold-400 hover:text-gold-300"
                  >
                    + Adicionar telefone
                  </button>
                </div>
                {formData.telefones.map((tel, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="tel"
                      value={tel}
                      onChange={(e) => handleTelefoneChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                      placeholder="(00) 00000-0000"
                    />
                    {formData.telefones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTelefone(index)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Endereço</label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    placeholder="Rua, número, bairro, cidade - UF"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Instagram</label>
                  <input
                    type="text"
                    value={formData.redes_sociais.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, redes_sociais: { ...prev.redes_sociais, instagram: e.target.value }}))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    placeholder="@usuario"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Facebook</label>
                  <input
                    type="text"
                    value={formData.redes_sociais.facebook}
                    onChange={(e) => setFormData(prev => ({ ...prev, redes_sociais: { ...prev.redes_sociais, facebook: e.target.value }}))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    placeholder="facebook.com/usuario"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">LinkedIn</label>
                  <input
                    type="text"
                    value={formData.redes_sociais.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, redes_sociais: { ...prev.redes_sociais, linkedin: e.target.value }}))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    placeholder="linkedin.com/in/usuario"
                  />
                </div>
              </div>
            </div>

            {/* Investigação */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-navy-700 pb-2">Detalhes da Investigação</h3>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Motivo da Investigação</label>
                <textarea
                  value={formData.motivo_investigacao}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivo_investigacao: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  placeholder="Descreva o motivo e contexto da investigação..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Nível de Urgência</label>
                <select
                  value={formData.nivel_urgencia}
                  onChange={(e) => setFormData(prev => ({ ...prev, nivel_urgencia: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Escopo da Investigação</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries({
                    antecedentes_criminais: "Antecedentes Criminais",
                    processos_judiciais: "Processos Judiciais",
                    situacao_fiscal: "Situação Fiscal",
                    vinculos_empresariais: "Vínculos Empresariais",
                    comportamento_rotina: "Comportamento/Rotina",
                    verificacao_informacoes: "Verificação de Informações",
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 hover:border-navy-500 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={(formData.escopo_investigacao as any)[key]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          escopo_investigacao: { ...prev.escopo_investigacao, [key]: e.target.checked }
                        }))}
                        className="w-4 h-4 text-gold-500 bg-navy-600 border-navy-500 rounded focus:ring-gold-500"
                      />
                      <span className="text-sm text-white">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Prazo Desejado</label>
                  <input
                    type="date"
                    value={formData.prazo_desejado}
                    onChange={(e) => setFormData(prev => ({ ...prev, prazo_desejado: e.target.value }))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Orçamento Máximo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.orcamento_maximo}
                    onChange={(e) => setFormData(prev => ({ ...prev, orcamento_maximo: e.target.value }))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Observações Adicionais</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  placeholder="Informações adicionais relevantes..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Placa de Veículo</label>
                  <input
                    type="text"
                    value={formData.placa_veiculo}
                    onChange={(e) => setFormData(prev => ({ ...prev, placa_veiculo: e.target.value }))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    placeholder="ABC-1234"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">Local de Trabalho</label>
                  <input
                    type="text"
                    value={formData.local_trabalho}
                    onChange={(e) => setFormData(prev => ({ ...prev, local_trabalho: e.target.value }))}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    placeholder="Empresa onde trabalha..."
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-col gap-3 pt-6 border-t border-navy-700 bg-navy-800">
              <p className="text-xs text-white/50">
                <strong>Atenção:</strong> Após o cadastro, o admin será notificado para iniciar a investigação.
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={loading}
                  className="text-white/60 hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Solicitar Investigação
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
