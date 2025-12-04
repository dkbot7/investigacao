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
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
    titleColor: "text-blue-400",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    titleColor: "text-amber-400",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400",
    titleColor: "text-green-400",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    iconColor: "text-red-400",
    titleColor: "text-red-400",
  },
  tip: {
    icon: Lightbulb,
    bgColor: "bg-gold-500/10",
    borderColor: "border-gold-500/30",
    iconColor: "text-gold-400",
    titleColor: "text-gold-400",
  },
  legal: {
    icon: Scale,
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
    titleColor: "text-purple-400",
  },
  security: {
    icon: Shield,
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    titleColor: "text-cyan-400",
  },
  evidence: {
    icon: FileWarning,
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-400",
    titleColor: "text-orange-400",
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
          <div className="text-navy-300 text-sm [&>p]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
