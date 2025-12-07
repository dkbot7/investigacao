"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addFuncionario } from "@/lib/api";

interface AddFuncionarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddFuncionarioModal({ isOpen, onClose, onSuccess }: AddFuncionarioModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    grupo: "",
    cargo: "",
    salario: "",
    cadastro: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validação básica
      if (!formData.nome || !formData.cpf || !formData.grupo) {
        setError("Preencha os campos obrigatórios: Nome, CPF e Grupo");
        setLoading(false);
        return;
      }

      // Formatar CPF (remover pontos e traços)
      const cpfFormatted = formData.cpf.replace(/\D/g, "");

      if (cpfFormatted.length !== 11) {
        setError("CPF deve ter 11 dígitos");
        setLoading(false);
        return;
      }

      // Preparar dados
      const data: any = {
        nome: formData.nome.trim(),
        cpf: cpfFormatted,
        grupo: formData.grupo.trim(),
      };

      if (formData.cargo) data.cargo = formData.cargo.trim();
      if (formData.salario) data.salario = parseFloat(formData.salario);
      if (formData.cadastro) data.cadastro = formData.cadastro.trim();

      await addFuncionario(data);

      // Resetar formulário
      setFormData({
        nome: "",
        cpf: "",
        grupo: "",
        cargo: "",
        salario: "",
        cadastro: "",
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erro ao adicionar funcionário:", err);

      // Mensagens de erro mais específicas
      if (err.message?.includes("fetch")) {
        setError("Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.");
      } else if (err.status === 401) {
        setError("Sessão expirada. Recarregue a página ou faça login novamente.");
      } else if (err.status === 403) {
        setError("Você não tem permissão para adicionar funcionários.");
      } else if (err.status === 404) {
        setError("Endpoint não encontrado. O backend precisa implementar POST /api/tenant/funcionarios");
      } else if (err.status === 409) {
        setError("CPF já cadastrado no sistema.");
      } else {
        setError(err.message || "Erro ao adicionar funcionário. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formatted });
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-400 dark:border-navy-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Adicionar Funcionário</h2>
                    <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Cadastre um novo funcionário para investigação</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-navy-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-900 dark:text-slate-600 dark:text-white/60" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-white/70 mb-2">
                      Nome Completo <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Ex: João Silva Santos"
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* CPF */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-white/70 mb-2">
                      CPF <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={handleCPFChange}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-mono"
                      required
                    />
                  </div>

                  {/* Cadastro/Matrícula */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-white/70 mb-2">
                      Matrícula/Cadastro
                    </label>
                    <input
                      type="text"
                      value={formData.cadastro}
                      onChange={(e) => setFormData({ ...formData, cadastro: e.target.value })}
                      placeholder="Ex: 12345"
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    />
                  </div>

                  {/* Grupo */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-white/70 mb-2">
                      Grupo/Departamento <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.grupo}
                      onChange={(e) => setFormData({ ...formData, grupo: e.target.value })}
                      placeholder="Ex: Administrativo, Operacional"
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-white/70 mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      placeholder="Ex: Analista, Gerente"
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    />
                  </div>

                  {/* Salário */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-white/70 mb-2">
                      Salário
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white/40">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.salario}
                        onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                        placeholder="0,00"
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-400">
                    <strong>Atenção:</strong> Após o cadastro, o funcionário será enviado para investigação automática em todas as bases de dados disponíveis.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={loading}
                    className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-navy-950 font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Cadastrar Funcionário
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
