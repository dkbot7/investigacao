"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  FileSpreadsheet,
  FileCheck,
  Mail,
  CheckCircle,
  Loader2,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type ResourceType = "checklist" | "template" | "whitepaper" | "guide" | "toolkit";

interface LeadCaptureCardProps {
  title: string;
  description: string;
  resourceType: ResourceType;
  downloadUrl: string;
  previewImage?: string;
  benefits?: string[];
  fileSize?: string;
  pages?: number;
}

const resourceConfig: Record<ResourceType, { icon: typeof FileText; label: string; color: string }> = {
  checklist: { icon: FileCheck, label: "Checklist", color: "#27C685" },
  template: { icon: FileSpreadsheet, label: "Template", color: "#3498DB" },
  whitepaper: { icon: FileText, label: "White Paper", color: "#D4AF37" },
  guide: { icon: FileText, label: "Guia", color: "#9B59B6" },
  toolkit: { icon: FileSpreadsheet, label: "Toolkit", color: "#E67E22" },
};

export default function LeadCaptureCard({
  title,
  description,
  resourceType,
  downloadUrl,
  previewImage,
  benefits = [],
  fileSize,
  pages,
}: LeadCaptureCardProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = resourceConfig[resourceType] || resourceConfig.guide;
  const Icon = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Por favor, insira um email válido");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Integrate with email service (Mailchimp, ConvertKit, etc.)
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store lead in localStorage for demo purposes
      const leads = JSON.parse(localStorage.getItem("investigaree_leads") || "[]");
      leads.push({
        email,
        name,
        resource: title,
        resourceType,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("investigaree_leads", JSON.stringify(leads));

      setIsSuccess(true);
    } catch {
      setError("Erro ao processar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-gold-500/20 bg-gradient-to-br from-navy-900 to-navy-950">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Left side - Resource info */}
        <div className="p-6 md:p-8">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            <Sparkles className="w-3 h-3" />
            Conteúdo Premium Gratuito
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{title}</h3>

          {/* Description */}
          <p className="text-navy-300 mb-4">{description}</p>

          {/* Benefits list */}
          {benefits.length > 0 && (
            <ul className="space-y-2 mb-6">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-navy-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Resource meta */}
          <div className="flex items-center gap-4 text-xs text-navy-500">
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded"
              style={{ backgroundColor: `${config.color}10` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
              <span style={{ color: config.color }}>{config.label}</span>
            </div>
            {fileSize && <span>{fileSize}</span>}
            {pages && <span>{pages} páginas</span>}
          </div>
        </div>

        {/* Right side - Form or Success */}
        <div className="p-6 md:p-8 bg-navy-900/50 flex items-center">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="w-full space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-4 h-4 text-gold-500" />
                  <span className="text-sm text-navy-300">
                    Deixe seu contato para receber o material
                  </span>
                </div>

                {/* Name field */}
                <div>
                  <label className="block text-xs text-navy-400 mb-1.5">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-2.5 bg-navy-800 border border-gold-500/10 rounded-lg text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/30 transition-colors"
                  />
                </div>

                {/* Email field */}
                <div>
                  <label className="block text-xs text-navy-400 mb-1.5">
                    Email profissional *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-navy-800 border border-gold-500/10 rounded-lg text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-navy-950 font-semibold rounded-lg transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Quero Receber
                    </>
                  )}
                </button>

                <p className="text-xs text-navy-500 text-center">
                  Entraremos em contato para enviar o material e conhecer sua necessidade.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Recebemos seu contato!
                </h4>
                <p className="text-navy-300 text-sm mb-4">
                  Nossa equipe entrará em contato em breve pelo email {email}.
                </p>
                <Link
                  href="/servicos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold rounded-lg transition-colors"
                >
                  Conhecer Nossos Serviços
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
