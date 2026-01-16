"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login, resetPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Por favor, preencha todos os campos");
        setLoading(false);
        return;
      }

      await login(email, password);
      onClose();
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);

      let errorMessage = "Erro ao fazer login. Tente novamente.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errorMessage = "Email ou senha incorretos.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Email invalido.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas. Aguarde alguns minutos.";
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Erro de conexao. Verifique sua internet.";
      } else if (err.code === "auth/invalid-credential") {
        errorMessage = "Email ou senha incorretos.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email) {
        setError("Por favor, insira seu email");
        setLoading(false);
        return;
      }

      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      console.error("Erro ao enviar email:", err);

      let errorMessage = "Erro ao enviar email. Tente novamente.";
      if (err.code === "auth/user-not-found") {
        errorMessage = "Email nao encontrado.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Email invalido.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    setResetSent(false);
    setShowForgotPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="relative w-full max-w-md bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-400 dark:border-navy-700"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="login-modal-title"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-slate-400 dark:border-navy-700">
            <h2 id="login-modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">
              {showForgotPassword ? "Recuperar Senha" : "Entrar"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-white/60 mt-1">
              {showForgotPassword
                ? "Enviaremos um link para redefinir sua senha"
                : "Acesse sua area privada"}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {resetSent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Email Enviado!</h3>
                <p className="text-slate-600 dark:text-white/60 text-sm mb-4">
                  Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.
                </p>
                <Button
                  onClick={() => {
                    setResetSent(false);
                    setShowForgotPassword(false);
                  }}
                  variant="outline"
                  className="border-blue-500/50 text-slate-900 dark:text-white hover:bg-blue-500/10"
                >
                  Voltar ao login
                </Button>
              </div>
            ) : showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email" className="text-slate-900 dark:text-white">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-100 dark:bg-navy-800 border-navy-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-premium text-navy-950 font-bold"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar link de recuperacao"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-sm text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Voltar ao login
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-slate-900 dark:text-white">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-100 dark:bg-navy-800 border-navy-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-slate-900 dark:text-white">Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-100 dark:bg-navy-800 border-navy-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-premium text-navy-950 font-bold"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-400 dark:border-navy-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-navy-900 text-slate-400 dark:text-white/40">ou</span>
                  </div>
                </div>

                <p className="text-center text-sm text-slate-600 dark:text-white/60">
                  Nao tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onSwitchToRegister();
                    }}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Criar conta
                  </button>
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
