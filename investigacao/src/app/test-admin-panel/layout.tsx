"use client";

import { MockAuthProvider } from '@/contexts/MockAuthContext';

/**
 * Layout para test-admin-panel
 * Usa MockAuthProvider para simular autenticação
 */
export default function TestAdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MockAuthProvider>
      {children}
    </MockAuthProvider>
  );
}
