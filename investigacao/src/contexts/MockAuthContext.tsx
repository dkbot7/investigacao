"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "firebase/auth";

/**
 * Mock Auth Context para testes E2E
 * Este contexto simula um usuário admin autenticado
 */

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, userData: { name: string; whatsapp: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error("useMockAuth must be used within a MockAuthProvider");
  }
  return context;
}

// Exportar também como useAuth para compatibilidade
export function useAuth() {
  return useMockAuth();
}

interface MockAuthProviderProps {
  children: ReactNode;
}

export function MockAuthProvider({ children }: MockAuthProviderProps) {
  // Mock user - admin
  const mockUser = {
    uid: 'test-uid-123',
    email: 'dkbotdani@gmail.com',
    displayName: 'Admin Teste',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
    delete: async () => {},
    getIdToken: async () => 'mock-id-token',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
  } as User;

  const signup = async () => {
    console.log('[MockAuth] Signup chamado');
  };

  const login = async () => {
    console.log('[MockAuth] Login chamado');
  };

  const logout = async () => {
    console.log('[MockAuth] Logout chamado');
  };

  const resetPassword = async () => {
    console.log('[MockAuth] Reset password chamado');
  };

  const value: AuthContextType = {
    user: mockUser,
    loading: false,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}
