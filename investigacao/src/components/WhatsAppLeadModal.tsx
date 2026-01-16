"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WHATSAPP_NUMBER = "5547992602673";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://investigaree-api.kalfrido.workers.dev";

interface WhatsAppContextType {
  openWhatsAppModal: (message?: string, source?: string) => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | null>(null);

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error("useWhatsApp must be used within WhatsAppProvider");
  }
  return context;
}

interface WhatsAppProviderProps {
  children: ReactNode;
}

export function WhatsAppProvider({ children }: WhatsAppProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Olá! Gostaria de saber mais sobre os serviços de investigação da investigaree.");
  const [source, setSource] = useState("widget");
  const [formData, setFormData] = useState({ nome: "", contato: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const openWhatsAppModal = (customMessage?: string, pageSource?: string) => {
    if (customMessage) setMessage(customMessage);
    if (pageSource) setSource(pageSource);
    setIsOpen(true);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      setError("Por favor, informe seu nome");
      return;
    }

    if (!formData.contato.trim()) {
      setError("Por favor, informe seu email ou telefone");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Salvar lead no banco
      const response = await fetch(`${API_URL}/api/leads/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          contato: formData.contato.trim(),
          mensagem: message,
          origem: source,
          pagina: typeof window !== "undefined" ? window.location.pathname : "/"
        })
      });

      if (!response.ok) {
        console.error("Erro ao salvar lead:", await response.text());
      }
    } catch (err) {
      console.error("Erro ao salvar lead:", err);
    }

    // Redirecionar para WhatsApp mesmo se der erro no salvamento
    const whatsappMessage = encodeURIComponent(
      `Olá! Meu nome é ${formData.nome}.\n\n${message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, "_blank");

    setIsSubmitting(false);
    setIsOpen(false);
    setFormData({ nome: "", contato: "" });
  };

  const handleSkip = () => {
    // Redirecionar direto sem salvar
    const whatsappMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, "_blank");
    setIsOpen(false);
  };

  return (
    <WhatsAppContext.Provider value={{ openWhatsAppModal }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-green-500 p-6 relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-slate-900 dark:text-slate-800 dark:text-white/80 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-500" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">investigaree</h3>
                    <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 text-sm">Normalmente responde em minutos</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Para um atendimento mais personalizado, deixe seus dados:
                </p>

                <div className="space-y-3">
                  <Input
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                  />
                  <Input
                    name="contato"
                    value={formData.contato}
                    onChange={handleChange}
                    placeholder="Email ou telefone"
                    className="bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 hover:bg-green-600 text-slate-900 dark:text-white font-semibold py-6"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Abrindo WhatsApp...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Iniciar conversa
                    </span>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full text-center text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition"
                >
                  Continuar sem informar dados
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </WhatsAppContext.Provider>
  );
}
