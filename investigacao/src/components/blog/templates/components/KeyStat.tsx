"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

type StatType = "info" | "warning" | "success" | "trend";

interface KeyStatProps {
  value: string;
  label: string;
  source?: string;
  type?: StatType;
  className?: string;
}

const typeConfig: Record<StatType, { icon: typeof Info; color: string; bgColor: string }> = {
  info: {
    icon: Info,
    color: "text-green-400",
    bgColor: "bg-green-500/10 border-green-500/30"
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/30"
  },
  success: {
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/10 border-green-500/30"
  },
  trend: {
    icon: TrendingUp,
    color: "text-green-400",
    bgColor: "bg-green-500/10 border-green-500/30"
  }
};

/**
 * Componente KeyStat - Bloco de estatística destacada
 * Inspirado no padrão da Binalyze para destacar dados importantes
 *
 * Exemplo de uso:
 * <KeyStat
 *   value="70%"
 *   label="dos divórcios envolvem ocultação patrimonial"
 *   source="IBDFAM, 2023"
 *   type="warning"
 * />
 */
export default function KeyStat({
  value,
  label,
  source,
  type = "info",
  className = ""
}: KeyStatProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative p-6 rounded-xl border ${config.bgColor} ${className}`}
    >
      {/* Ícone decorativo */}
      <div className={`absolute top-4 right-4 ${config.color}`}>
        <Icon className="w-6 h-6 opacity-50" />
      </div>

      {/* Label superior */}
      <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-navy-400 mb-2 font-medium">
        Estatística-chave
      </p>

      {/* Valor principal */}
      <p className={`text-4xl sm:text-5xl font-bold ${config.color} mb-2`}>
        {value}
      </p>

      {/* Descrição */}
      <p className="text-base sm:text-lg text-slate-900 dark:text-white font-medium leading-snug">
        {label}
      </p>

      {/* Fonte */}
      {source && (
        <p className="mt-3 text-xs text-slate-900 dark:text-navy-500 italic">
          Fonte: {source}
        </p>
      )}
    </motion.div>
  );
}

