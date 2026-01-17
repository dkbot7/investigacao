"use client";

import { motion } from "framer-motion";
import { Lightbulb, CheckCircle, ArrowRight } from "lucide-react";

interface TakeawayBoxProps {
  title?: string;
  points: string[];
  cta?: {
    text: string;
    href: string;
  };
  variant?: "default" | "compact";
  className?: string;
}

/**
 * Componente TakeawayBox - Seção de resumo/conclusões
 * Inspirado no padrão "Takeaway" da Binalyze
 *
 * Exemplo de uso:
 * <TakeawayBox
 *   title="Principais conclusões"
 *   points={[
 *     "Senhas armazenadas no navegador são um risco de segurança",
 *     "Gerenciadores de senhas oferecem proteção superior",
 *     "A detecção proativa reduz tempo de resposta a incidentes"
 *   ]}
 *   cta={{ text: "Saiba mais sobre proteção de senhas", href: "/blog/seguranca-senhas" }}
 * />
 */
export default function TakeawayBox({
  title = "Principais conclusões",
  points,
  cta,
  variant = "default",
  className = ""
}: TakeawayBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/20 ${className}`}
    >
      {/* Decoração de fundo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />

      <div className={variant === "compact" ? "p-4 sm:p-5" : "p-6 sm:p-8"}>
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-500/20">
            <Lightbulb className="w-5 h-5 text-green-500" />
          </div>
          <h3 className={`font-bold text-white ${variant === "compact" ? "text-lg" : "text-xl"}`}>
            {title}
          </h3>
        </div>

        {/* Lista de pontos */}
        <ul className="space-y-3">
          {points.map((point, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className={`text-slate-700 dark:text-navy-200 ${variant === "compact" ? "text-sm" : "text-base"}`}>
                {point}
              </span>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        {cta && (
          <motion.a
            href={cta.href}
            whileHover={{ x: 4 }}
            className="inline-flex items-center gap-2 mt-6 text-green-400 hover:text-green-300 font-medium transition-colors"
          >
            {cta.text}
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

