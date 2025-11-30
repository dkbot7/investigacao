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

  // 🔥 Headlines rotativas focadas nos públicos-alvo
  const headlines = useMemo(() => [
    {
      main: "INVESTIGAÇÃO COM IA EM ESCALA",
      sub: "+100 mil registros processados com GPT-5, Claude e Gemini"
    },
    {
      main: "PARTIDO POLÍTICO?",
      sub: "Verificamos todos os candidatos e filiados em 48h"
    },
    {
      main: "PROTEÇÃO PATRIMONIAL EM DIVÓRCIO",
      sub: "70% dos divórcios têm ocultação de bens. Não seja a vítima."
    },
    {
      main: "VAI INVESTIR NUMA STARTUP?",
      sub: "Investigue o founder antes de investir"
    },
    {
      main: "AUDITORIA DE SERVIDORES PÚBLICOS",
      sub: "Folha de pagamento x Óbitos x Acúmulos ilegais"
    },
    {
      main: "PROTEÇÃO COMPLETA DA FAMÍLIA",
      sub: "Funcionários domésticos, segurança digital dos filhos"
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-[72px]"
      aria-label="Hero section - Due Diligence Empresarial"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(199,167,107,0.08),transparent_50%)]"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(199,167,107,0.05),transparent_50%)]"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* 🔥 OTIMIZAÇÃO: Floating particles - memorizado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-gold-500 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: parseFloat(particle.duration),
              repeat: Infinity,
              delay: parseFloat(particle.delay),
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        className="container relative z-10 px-4 py-16 sm:py-20 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Selo de Autoridade - Área de Segurança Privada */}
        <motion.div
          className="flex justify-center mb-4 sm:mb-6"
          variants={badgeVariants}
        >
          <Badge
            variant="outline"
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gold-500/10 border-gold-500/40 backdrop-blur-sm text-gold-400 text-[10px] sm:text-xs font-medium"
          >
            🔒 Segurança Privada | Metodologia validada por Perito Criminal Oficial
          </Badge>
        </motion.div>

        {/* Main Headline - Rotativo com as dores do Roberto */}
        <motion.div
          className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8 min-h-[140px] sm:min-h-[160px] md:min-h-[180px] flex flex-col justify-center"
          variants={itemVariants}
        >
          <motion.h1
            key={`headline-${headlineIndex}`}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {headlines[headlineIndex].main}
          </motion.h1>
          <motion.h2
            key={`subheadline-${headlineIndex}`}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.1]"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #9FB3C8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {headlines[headlineIndex].sub}
          </motion.h2>
        </motion.div>

        {/* Subheadline - 5 Áreas de Proteção */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          variants={itemVariants}
        >
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-medium px-4 max-w-4xl mx-auto">
            Protegemos <span className="text-gold-400">famílias</span>, <span className="text-gold-400">empresas</span>, <span className="text-gold-400">investidores</span>, <span className="text-gold-400">partidos políticos</span> e <span className="text-gold-400">mulheres em divórcio</span>.
          </p>
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
              className="group gradient-premium text-navy-950 px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 text-sm sm:text-base md:text-lg font-bold rounded-full shadow-2xl hover:shadow-gold-500/20 transition-all duration-300"
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

        {/* Diferenciais - DEPOIS DO BOTÃO */}
        <motion.div
          className="text-center mb-3 sm:mb-4"
          variants={itemVariants}
        >
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5 md:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-gold-400 text-base sm:text-lg md:text-xl font-bold">100%</span>
              <span className="text-white/70 text-xs sm:text-sm">LGPD compliant</span>
            </div>
            <div className="hidden sm:block text-white/30">•</div>
            <div className="flex items-center gap-1.5">
              <span className="text-gold-400 text-base sm:text-lg md:text-xl font-bold">48h</span>
              <span className="text-white/70 text-xs sm:text-sm">entrega Express</span>
            </div>
            <div className="hidden sm:block text-white/30">•</div>
            <div className="flex items-center gap-1.5">
              <span className="text-gold-400 text-base sm:text-lg md:text-xl font-bold">Sigilo</span>
              <span className="text-white/70 text-xs sm:text-sm">garantido</span>
            </div>
          </div>
        </motion.div>

        {/* Badge de Credibilidade */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4"
          variants={itemVariants}
        >
          <Badge
            variant="secondary"
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white/5 border border-gold-500/30 backdrop-blur-sm"
          >
            <span className="relative flex h-2.5 w-2.5 mr-1.5 sm:mr-2" aria-hidden="true">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="text-white/80 text-xs sm:text-sm">
              Arquiteta de IA com 16+ certificações
            </span>
          </Badge>
          <Badge
            variant="secondary"
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white/5 border border-gold-500/30 backdrop-blur-sm"
          >
            <span className="relative flex h-2.5 w-2.5 mr-1.5 sm:mr-2" aria-hidden="true">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-400"></span>
            </span>
            <span className="text-white/80 text-xs sm:text-sm">
              Perito Criminal Oficial no Advisory Board
            </span>
          </Badge>
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
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gold-500/50 rounded-full flex items-start justify-center p-1.5 sm:p-2">
          <motion.div
            className="w-1 h-2 sm:h-3 bg-gold-500 rounded-full"
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
