"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap, CheckCircle } from "lucide-react";

type CTAType = "trial" | "demo" | "contact" | "pricing" | "newsletter";

interface CTABannerProps {
  type?: CTAType;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  features?: string[];
  variant?: "default" | "minimal" | "highlight";
}

const ctaDefaults: Record<CTAType, { title: string; description: string; buttonText: string; buttonUrl: string; icon: typeof Sparkles }> = {
  trial: {
    title: "Precisa de uma Investigação Profissional?",
    description: "Nossa equipe de especialistas pode ajudar com due diligence, background check e investigação digital.",
    buttonText: "Falar com Nosso Time",
    buttonUrl: "/contato",
    icon: Zap,
  },
  demo: {
    title: "Conheça Nossos Serviços de Investigação",
    description: "Descubra como podemos ajudar a proteger seu patrimônio e tomar decisões mais seguras.",
    buttonText: "Ver Nossos Serviços",
    buttonUrl: "/servicos",
    icon: Sparkles,
  },
  contact: {
    title: "Precisa de uma Solução Personalizada?",
    description: "Nossa equipe está pronta para ajudar com sua demanda específica de investigação.",
    buttonText: "Falar com Especialista",
    buttonUrl: "/contato",
    icon: Shield,
  },
  pricing: {
    title: "Pronto para Proteger seu Patrimônio?",
    description: "Conheça nossos serviços de due diligence e investigação digital.",
    buttonText: "Conhecer Serviços",
    buttonUrl: "/servicos",
    icon: CheckCircle,
  },
  newsletter: {
    title: "Quer Saber Mais Sobre Nossos Serviços?",
    description: "Entre em contato para conhecer nossas soluções de investigação e proteção patrimonial.",
    buttonText: "Entrar em Contato",
    buttonUrl: "/contato",
    icon: Sparkles,
  },
};

export default function CTABanner({
  type = "trial",
  title,
  description,
  buttonText,
  buttonUrl,
  features,
  variant = "default",
}: CTABannerProps) {
  const defaults = ctaDefaults[type] || ctaDefaults.trial;
  const Icon = defaults.icon;

  const finalTitle = title || defaults.title;
  const finalDescription = description || defaults.description;
  const finalButtonText = buttonText || defaults.buttonText;
  const finalButtonUrl = buttonUrl || defaults.buttonUrl;

  if (variant === "minimal") {
    return (
      <div className="my-6 p-4 rounded-xl bg-gold-500/5 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gold-500/10">
            <Icon className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <p className="font-medium text-white">{finalTitle}</p>
            <p className="text-sm text-navy-400">{finalDescription}</p>
          </div>
        </div>
        <Link
          href={finalButtonUrl}
          className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-medium rounded-lg transition-colors text-sm"
        >
          {finalButtonText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (variant === "highlight") {
    return (
      <div className="my-8 relative overflow-hidden rounded-2xl">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400" />

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative p-8 md:p-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-950/20 text-navy-950 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Oferta Especial
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-navy-950 mb-3">
            {finalTitle}
          </h3>

          <p className="text-navy-900/80 max-w-2xl mx-auto mb-6">
            {finalDescription}
          </p>

          {features && features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-navy-950">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          )}

          <Link
            href={finalButtonUrl}
            className="inline-flex items-center gap-2 px-8 py-4 bg-navy-950 hover:bg-navy-900 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            {finalButtonText}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-gold-500/20 bg-gradient-to-br from-navy-900 via-navy-900 to-gold-500/5">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <Icon className="w-7 h-7 text-gold-500" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{finalTitle}</h3>
            <p className="text-navy-300">{finalDescription}</p>

            {features && features.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 text-sm text-navy-400"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Button */}
          <div className="flex-shrink-0">
            <Link
              href={finalButtonUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              {finalButtonText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
