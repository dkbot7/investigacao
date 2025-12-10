"use client";

import { ComurgDataProvider } from "@/contexts/ComurgDataContext";
import { useUserAccess } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ComurgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo, loading } = useUserAccess();
  const router = useRouter();

  // Proteção de tenant - apenas COMURG
  useEffect(() => {
    if (!loading && userInfo?.tenant?.code !== 'COMURG') {
      console.warn("[ComurgCedidos] Acesso negado - tenant:", userInfo?.tenant?.code);
      router.push('/dashboard');
    }
  }, [userInfo, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não é COMURG, não renderiza nada (vai redirecionar)
  if (userInfo?.tenant?.code !== 'COMURG') {
    return null;
  }

  return (
    <ComurgDataProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ComurgDataProvider>
  );
}
