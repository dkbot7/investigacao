import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: "blue" | "emerald" | "amber" | "red" | "purple" | "gold" | "yellow";
  href?: string;
  onClick?: () => void;
  pulse?: boolean;
  badge?: string;
  subtitle?: string;
}

const colorClasses = {
  blue: "text-blue-400",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
  purple: "text-purple-400",
  gold: "text-yellow-400",
  yellow: "text-yellow-400",
};

const hoverBorderColors = {
  blue: "hover:border-blue-500/50",
  emerald: "hover:border-emerald-500/50",
  amber: "hover:border-amber-500/50",
  red: "hover:border-red-500/50",
  purple: "hover:border-purple-500/50",
  gold: "hover:border-yellow-500/50",
  yellow: "hover:border-yellow-500/50",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  href,
  onClick,
  pulse = false,
  badge,
  subtitle,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <Icon className={`w-8 h-8 ${colorClasses[color]} ${pulse ? 'animate-pulse' : ''}`} />
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">{title}</p>
          {subtitle && (
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/40 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {badge && (
        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 rounded">
          {badge}
        </span>
      )}
    </>
  );

  const baseClasses = `relative bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 transition-all ${hoverBorderColors[color]}`;

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.02, y: -2 }}
        className={`${baseClasses} cursor-pointer block`}
      >
        {content}
      </motion.a>
    );
  }

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -2 }}
        className={`${baseClasses} cursor-pointer w-full text-left`}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={baseClasses}
    >
      {content}
    </motion.div>
  );
}
