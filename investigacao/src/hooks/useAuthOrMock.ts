"use client";

import { useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook unificado que usa AuthContext ou MockAuthContext
 * Detecta automaticamente qual contexto está disponível
 *
 * Em produção: usa AuthContext (Firebase real)
 * Em testes (/test-admin-panel): usa MockAuthContext
 */
export function useAuthOrMock() {
  // Tentar usar AuthContext primeiro (produção)
  try {
    const auth = useAuth();
    return auth;
  } catch (error) {
    // Se AuthContext não disponível, verificar se estamos em rota de teste
    const isBrowser = typeof window !== 'undefined';
    const isTestRoute = isBrowser && window.location.pathname.startsWith('/test-admin-panel');

    if (isTestRoute && process.env.NODE_ENV !== 'production') {
      // Importar dinamicamente MockAuthContext
      // Nota: Isso requer que o componente esteja dentro de MockAuthProvider
      throw new Error('useAuthOrMock deve ser usado dentro de AuthProvider ou MockAuthProvider');
    }

    throw error;
  }
}
