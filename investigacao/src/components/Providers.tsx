"use client";

import { ReactNode } from "react";
import { WhatsAppProvider } from "@/components/WhatsAppLeadModal";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <WhatsAppProvider>
      {children}
    </WhatsAppProvider>
  );
}
