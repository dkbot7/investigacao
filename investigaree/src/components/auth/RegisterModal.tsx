"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [step, setStep] = useState<"contact" | "password">("contact");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Contact info
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  // Step 2: Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signup } = useAuth();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validação básica
    if (!name || !whatsapp || !email) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um email válido");
      return;
    }

    // Ir para próximo passo
    setStep("password");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validação de senha
      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem");
        setLoading(false);
        return;
      }

      // Criar conta no Firebase
      await signup(email, password, { name, whatsapp });

      // Enviar email de notificação para os administradores
      await fetch("/api/notify-new-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          whatsapp,
          timestamp: new Date().toISOString()
        })
      });

      // Fechar modal e redirecionar para dashboard
      onClose();
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Erro ao criar conta:", err);
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatWhatsapp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Formata: (11) 99999-9999
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return whatsapp;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md bg-navy-900 rounded-2xl shadow-2xl border border-navy-700"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-navy-700">
            <h2 className="text-2xl font-bold text-white">
              {step === "contact" ? "Solicitar Investigação" : "Criar sua senha"}
            </h2>
            <p className="text-sm text-white/60 mt-1">
              {step === "contact"
                ? "Preencha seus dados de contato"
                : "Defina uma senha para acessar sua área privada"}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {step === "contact" ? (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Roberto Andrade"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 bg-navy-800 border-navy-600 text-white placeholder:text-white/40"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="roberto@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 bg-navy-800 border-navy-600 text-white placeholder:text-white/40"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="text-white">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                    className="mt-1 bg-navy-800 border-navy-600 text-white placeholder:text-white/40"
                    maxLength={15}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-premium text-navy-950 font-bold"
                  size="lg"
                >
                  Continuar
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-white">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 bg-navy-800 border-navy-600 text-white placeholder:text-white/40"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-white">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 bg-navy-800 border-navy-600 text-white placeholder:text-white/40"
                    required
                    minLength={6}
                  />
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
                      Criando conta...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("contact")}
                  className="w-full text-sm text-white/60 hover:text-white transition-colors"
                >
                  ← Voltar
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
