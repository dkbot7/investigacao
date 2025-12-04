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
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    valueColor: "text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    valueColor: "text-amber-400",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    valueColor: "text-green-400",
  },
  "trend-up": {
    icon: TrendingUp,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    valueColor: "text-red-400",
  },
  "trend-down": {
    icon: TrendingDown,
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    valueColor: "text-green-400",
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
        <div className="p-2 rounded-lg bg-navy-900/50">
          <Icon className={`w-6 h-6 ${config.valueColor}`} />
        </div>
        <div className="flex-1">
          <div className={`text-4xl font-bold ${config.valueColor} mb-1`}>
            {value}
          </div>
          <div className="text-white font-medium mb-1">{label}</div>
          {description && (
            <p className="text-navy-400 text-sm mb-2">{description}</p>
          )}
          {source && (
            <p className="text-navy-500 text-xs">Fonte: {source}</p>
          )}
        </div>
      </div>
    </div>
  );
}
