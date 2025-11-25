"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-32 gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.1),transparent_50%)]" />

      <div className="container max-w-5xl px-4 relative z-10 text-center">
        {/* Urgency Badge */}
        <Badge
          variant="outline"
          className="mb-8 bg-gold-500/20 border-gold-500/50 text-gold-400 px-6 py-2 text-sm font-semibold animate-pulse"
        >
          <Clock className="w-4 h-4 mr-2 inline" />
          Capacidade limitada - Análises forenses em 48h
        </Badge>

        {/* Main Headline */}
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Due Diligence que protege seu patrimônio
        </h2>

        <p className="text-xl md:text-2xl text-navy-100 mb-12 max-w-3xl mx-auto">
          Não espere descobrir uma fraude depois de assinar o contrato.
          <br />
          <strong className="text-gold-400">Validação forense por Perito Criminal Oficial.</strong>
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            size="lg"
            className="group gradient-premium hover:opacity-90 text-navy-950 px-12 py-8 text-xl font-bold rounded-full shadow-2xl hover:shadow-gold-500/50 transition-all duration-300 hover:scale-105"
          >
            AGENDAR ANÁLISE FORENSE
            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-gold-500/50 bg-white/5 hover:bg-white/10 text-white px-8 py-8 text-lg font-semibold rounded-full backdrop-blur-sm"
          >
            Falar com Especialista
          </Button>
        </div>

        <p className="text-navy-200 text-base mb-8">
          Investimento <span className="text-gold-400 font-bold text-xl">sob consulta</span>
          {" "}— Fale conosco para um orçamento personalizado
        </p>

        {/* Trust Elements */}
        <div className="flex flex-wrap justify-center gap-8 text-white text-sm">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold-500" />
            Metodologia ANPAJ
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-success" />
            Entrega 48h
          </span>
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" />
            LGPD Compliant
          </span>
        </div>

        {/* Social Proof */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 text-warning fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <p className="text-navy-100 text-lg">
            Validado por <strong className="text-gold-400">Ibsen Maciel</strong> - Perito Criminal Oficial
          </p>
        </div>
      </div>
    </section>
  );
}
