"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Emails de administradores autorizados
const ADMIN_EMAILS = [
  "dkbotdani@gmail.com",
  "ibsenmaciel@gmail.com",
  "contato@investigaree.com.br"
];

export default function LoginAdminPage() {
  const router = useRouter();
  const { user, login, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirecionar se ja estiver logado como admin
  useEffect(() => {
    if (user && !authLoading) {
      if (ADMIN_EMAILS.includes(user.email || "")) {
        router.push("/dashboard/admin");
      } else {
        setError("Este email nao tem permissao de administrador.");
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Verificar se o email e de admin antes de tentar login
    if (!ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      setError("Este email nao tem permissao de administrador.");
      return;
    }

    setLoading(true);

    try {
      await login(email.toLowerCase().trim(), password);
      // O useEffect vai redirecionar apos login bem-sucedido
    } catch (err: any) {
      console.error("Erro no login:", err);

      // Traduzir erros do Firebase
      if (err.message?.includes("user-not-found") || err.message?.includes("wrong-password") || err.message?.includes("invalid-credential")) {
        setError("Email ou senha incorretos.");
      } else if (err.message?.includes("too-many-requests")) {
        setError("Muitas tentativas. Tente novamente em alguns minutos.");
      } else if (err.message?.includes("invalid-email")) {
        setError("Email invalido.");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading inicial
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-navy-900/80 backdrop-blur-xl border border-navy-700/50 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 mb-4">
              <Shield className="w-8 h-8 text-navy-950" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Admin Login
            </h1>
            <p className="text-white/60 text-sm">
              Acesso restrito a administradores
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@investigaree.com.br"
                  className="pl-10 bg-navy-800/50 border-navy-700 text-white placeholder:text-white/30 focus:border-gold-500 focus:ring-gold-500/20"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="pl-10 pr-10 bg-navy-800/50 border-navy-700 text-white placeholder:text-white/30 focus:border-gold-500 focus:ring-gold-500/20"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-gold-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Entrar como Admin
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-navy-700/50 text-center">
            <Link
              href="/"
              className="text-white/50 hover:text-white/70 text-sm transition-colors"
            >
              Voltar para o site
            </Link>
          </div>
        </div>

        {/* Security note */}
        <p className="mt-6 text-center text-white/30 text-xs">
          Acesso monitorado e registrado por seguranca
        </p>
      </motion.div>
    </div>
  );
}
