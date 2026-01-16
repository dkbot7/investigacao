"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import RegisterModal from "@/components/auth/RegisterModal";

export default function Hero() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Headlines rotativas - Posicionamento: Autoridade Forense + Proteção Patrimonial
  const headlines = useMemo(() => [
    {
      main: "INVESTIGAÇÃO DIGITAL",
      sub: "Metodologia forense validada por Perito Criminal Oficial",
      highlight: "FORENSE"
    },
    {
      main: "PROTEÇÃO PATRIMONIAL",
      sub: "70% dos divórcios têm ocultação de bens. Descubra a verdade.",
      highlight: "EM DIVÓRCIO"
    },
    {
      main: "DUE DILIGENCE",
      sub: "Background check completo antes de investir ou contratar",
      highlight: "EMPRESARIAL"
    },
    {
      main: "AUDITORIA DIGITAL",
      sub: "Folha de pagamento x Óbitos x Acúmulos ilegais",
      highlight: "DE FUNCIONÁRIOS"
    },
    {
      main: "PROTEÇÃO FAMILIAR",
      sub: "Funcionários domésticos, segurança digital dos filhos",
      highlight: "COMPLETA"
    },
    {
      main: "ANÁLISE DE STARTUPS",
      sub: "Investigue founders e sócios antes de aportar capital",
      highlight: "PARA INVESTIDORES"
    }
  ], []);

  // 🔥 OTIMIZAÇÃO: Memoriza partículas para evitar recálculo em cada render
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${3 + Math.random() * 2}s`
    })),
  []);

  // 🔥 Rotação automática das headlines
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [headlines.length]);

  // 🎬 ANIMATION VARIANTS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as any // Custom easing (smooth)
      }
    }
  };

  const badgeVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1] as any
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20 md:pt-[72px]"
      aria-label="Hero section - Due Diligence Empresarial"
    >
      {/* Animated background gradient - responsivo ao tema */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.12),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.08),transparent_50%)]" />

      <motion.div
        className="container relative z-10 px-4 py-10 sm:py-12 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Selo de Autoridade - Perito Criminal Oficial */}
        <motion.div
          className="flex justify-center mb-4 sm:mb-6"
          variants={badgeVariants}
        >
          <Badge
            variant="outline"
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-white/80 dark:bg-navy-900/80 border-blue-500/40 backdrop-blur-sm text-[10px] sm:text-xs font-medium flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-blue-400">Plataforma de Investigação Digital</span>
            <span className="text-slate-500 dark:text-navy-400">|</span>
            <span className="text-slate-900 dark:text-white">Validada por Perito Criminal Oficial</span>
          </Badge>
        </motion.div>

        {/* Main Headline - Rotativo com destaque */}
        <motion.div
          className="text-center space-y-2 sm:space-y-3 mb-6 sm:mb-8 min-h-[160px] sm:min-h-[180px] md:min-h-[200px] flex flex-col justify-center"
          variants={itemVariants}
        >
          <motion.h1
            key={`headline-${headlineIndex}`}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-slate-900 dark:text-white">{headlines[headlineIndex].main}</span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #2563EB 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text"
              }}
            >
              {headlines[headlineIndex].highlight}
            </span>
          </motion.h1>
          <motion.p
            key={`subheadline-${headlineIndex}`}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-navy-300 font-medium max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {headlines[headlineIndex].sub}
          </motion.p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 px-4"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-navy-400">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-500 text-[10px]">1</span>
            </div>
            <span>Famílias</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-navy-400">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-500 text-[10px]">2</span>
            </div>
            <span>Empresas</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-navy-400">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-500 text-[10px]">3</span>
            </div>
            <span>Investidores</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-navy-400">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-500 text-[10px]">4</span>
            </div>
            <span>Patrimônios</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-navy-400">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-500 text-[10px]">5</span>
            </div>
            <span>Divórcio</span>
          </div>
        </motion.div>

        {/* 🔥 ACESSIBILIDADE: CTA Principal com ARIA labels + Animações */}
        <motion.div
          className="flex flex-col items-center gap-3 sm:gap-4"
          variants={itemVariants}
        >
          <motion.div
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="group gradient-premium text-navy-950 px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 text-sm sm:text-base md:text-lg font-bold rounded-full shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              aria-label="Solicitar investigação particular - Proteger patrimônio"
            >
              Solicitar Investigação Particular
              <motion.div
                className="inline-block ml-2"
                animate={{
                  x: [0, 4, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  aria-hidden="true"
                />
              </motion.div>
            </Button>
          </motion.div>

        </motion.div>
      </motion.div>

      {/* Scroll indicator - Sutil com animação */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 opacity-40"
        aria-hidden="true"
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-blue-500/50 rounded-full flex items-start justify-center p-1.5 sm:p-2">
          <motion.div
            className="w-1 h-2 sm:h-3 bg-blue-500 rounded-full"
            animate={{
              y: [0, 6, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      {/* Modal de Cadastro */}
      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
