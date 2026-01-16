"use client";

import { useWhatsApp } from "@/components/WhatsAppLeadModal";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  message?: string;
  source?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "icon";
}

export default function WhatsAppButton({
  message = "Olá! Gostaria de saber mais sobre os serviços de investigação da investigaree.",
  source = "button",
  children,
  className,
  variant = "default"
}: WhatsAppButtonProps) {
  const { openWhatsAppModal } = useWhatsApp();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openWhatsAppModal(message, source);
  };

  const baseStyles = "inline-flex items-center gap-2 font-semibold transition-all cursor-pointer";

  const variantStyles = {
    default: "px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full",
    outline: "hover:text-green-400",
    icon: ""
  };

  return (
    <button
      onClick={handleClick}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </button>
  );
}
