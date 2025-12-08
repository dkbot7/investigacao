"use client";

import { TrendingUp, TrendingDown, AlertTriangle, Info, CheckCircle } from "lucide-react";

type StatType = "info" | "warning" | "success" | "trend-up" | "trend-down";

interface KeyStatProps {
  value: string;
  label: string;
  source?: string;
  type?: StatType;
  description?: string;
}

const statConfig = {
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-navy-800",
    borderColor: "border-blue-200 dark:border-blue-500/20",
    valueColor: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-500/20",
    valueColor: "text-amber-600 dark:text-amber-400",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-500/20",
    valueColor: "text-green-600 dark:text-green-400",
  },
  "trend-up": {
    icon: TrendingUp,
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-500/20",
    valueColor: "text-red-600 dark:text-red-400",
  },
  "trend-down": {
    icon: TrendingDown,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-500/20",
    valueColor: "text-green-600 dark:text-green-400",
  },
};

export default function KeyStat({
  value,
  label,
  source,
  type = "info",
  description,
}: KeyStatProps) {
  const config = statConfig[type] || statConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6 my-6`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-white dark:bg-navy-900">
          <Icon className={`w-6 h-6 ${config.valueColor}`} />
        </div>
        <div className="flex-1">
          <div className={`text-4xl font-bold ${config.valueColor} mb-1`}>
            {value}
          </div>
          <div className="text-slate-900 dark:text-white font-medium mb-1">{label}</div>
          {description && (
            <p className="text-slate-500 dark:text-navy-400 text-sm mb-2">{description}</p>
          )}
          {source && (
            <p className="text-slate-900 dark:text-navy-500 text-xs">Fonte: {source}</p>
          )}
        </div>
      </div>
    </div>
  );
}
