"use client";

import { ReactNode } from "react";
import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Lightbulb,
  Scale,
  Shield,
  FileWarning
} from "lucide-react";

type CalloutType = "info" | "warning" | "success" | "error" | "tip" | "legal" | "security" | "evidence";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutConfig = {
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-navy-800",
    borderColor: "border-blue-200 dark:border-blue-500/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-700 dark:text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-500/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-amber-700 dark:text-amber-400",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-500/30",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-700 dark:text-green-400",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-500/30",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-700 dark:text-red-400",
  },
  tip: {
    icon: Lightbulb,
    bgColor: "bg-blue-50 dark:bg-navy-800",
    borderColor: "border-blue-200 dark:border-blue-500/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-700 dark:text-blue-400",
  },
  legal: {
    icon: Scale,
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-500/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    titleColor: "text-purple-700 dark:text-purple-400",
  },
  security: {
    icon: Shield,
    bgColor: "bg-blue-50 dark:bg-navy-800",
    borderColor: "border-blue-200 dark:border-blue-500/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-700 dark:text-blue-400",
  },
  evidence: {
    icon: FileWarning,
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-500/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    titleColor: "text-orange-700 dark:text-orange-400",
  },
};

const defaultTitles: Record<CalloutType, string> = {
  info: "Informação",
  warning: "Atenção",
  success: "Sucesso",
  error: "Erro",
  tip: "Dica",
  legal: "Aspecto Legal",
  security: "Segurança",
  evidence: "Valor Probatório",
};

export default function Callout({ type = "info", title, children }: CalloutProps) {
  const config = calloutConfig[type] || calloutConfig.info;
  const Icon = config.icon;
  const displayTitle = title || defaultTitles[type];

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 my-6`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${config.titleColor} mb-1`}>
            {displayTitle}
          </h4>
          <div className="text-slate-600 dark:text-navy-300 text-sm [&>p]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
