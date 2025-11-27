"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, userData: { name: string; whatsapp: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, userData: { name: string; whatsapp: string }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Atualizar perfil com nome
      await updateProfile(userCredential.user, {
        displayName: userData.name
      });

      // Aqui você pode salvar dados adicionais (whatsapp) no Firestore se necessário
      // Por enquanto, salvamos apenas no displayName

      setUser(userCredential.user);
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      throw new Error(error.message || "Erro ao criar conta");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      throw new Error(error.message || "Erro ao fazer login");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      throw new Error(error.message || "Erro ao fazer logout");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Erro ao enviar email de recuperacao:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
