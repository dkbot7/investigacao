"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Brain, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogHero() {
  const pillars = [
    { icon: Zap, label: "Automação", description: "Eficiência investigativa" },
    { icon: Shield, label: "DFIR", description: "Resposta a incidentes" },
    { icon: Brain, label: "Inovação", description: "Tecnologia de ponta" },
    { icon: Target, label: "Prática", description: "Casos reais" }
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-navy-700/20 rounded-full blur-3xl" />
        <motion.div
          className="absolute top-40 right-10 w-2 h-2 bg-gold-500 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-gold-400 rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge de posicionamento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
              <Zap className="w-4 h-4 text-gold-500" />
              <span className="text-sm text-gold-400 font-semibold tracking-wide uppercase">
                DFIR na Prática
              </span>
            </span>
          </motion.div>

          {/* Título principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 text-center"
          >
            Inovação em{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Forense Digital
            </span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-navy-300">
              e Resposta a Incidentes
            </span>
          </motion.h1>

          {/* Proposta de valor / Posicionamento */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg sm:text-xl text-navy-300 mb-8 max-w-3xl mx-auto text-center leading-relaxed"
          >
            Explore nossas inovações em investigação digital, automação forense e
            resposta a incidentes. Conteúdo técnico de ponta para{" "}
            <span className="text-gold-400 font-medium">peritos</span>,{" "}
            <span className="text-gold-400 font-medium">advogados</span>,{" "}
            <span className="text-gold-400 font-medium">gestores de compliance</span> e{" "}
            <span className="text-gold-400 font-medium">profissionais de segurança</span>.
          </motion.p>

          {/* Pilares do blog */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto"
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                className="text-center p-4 rounded-xl bg-navy-900/50 border border-gold-500/10 hover:border-gold-500/30 transition-all group"
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                  <pillar.icon className="w-5 h-5 text-gold-500" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-0.5">{pillar.label}</h3>
                <p className="text-xs text-navy-400">{pillar.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold px-6"
            >
              <Link href="#artigos">
                Explorar Artigos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold-500/30 text-navy-200 hover:bg-gold-500/10 hover:text-gold-400"
            >
              <Link href="/contato">
                Fale com Especialistas
              </Link>
            </Button>
          </motion.div>

          {/* Diferencial / Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 pt-8 border-t border-gold-500/10"
          >
            <p className="text-center text-sm text-navy-500 mb-4">
              Referência brasileira em inteligência investigativa
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-navy-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs">Conteúdo atualizado semanalmente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold-500" />
                <span className="text-xs">Escrito por especialistas DFIR</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs">Foco em legislação brasileira</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-navy-950 to-transparent" />
    </section>
  );
}
