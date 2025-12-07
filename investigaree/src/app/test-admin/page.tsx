"use client";

/**
 * Página de teste para E2E
 * Esta página renderiza o admin panel sem autenticação Firebase
 * APENAS para ambiente de desenvolvimento/teste
 *
 * Acesse: http://localhost:3000/test-admin
 */

export default function TestAdminPage() {
  // Apenas em desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Página de Teste</h2>
          <p className="text-slate-500 dark:text-gray-400">Esta página só está disponível em desenvolvimento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center p-4">
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">🧪 Modo de Teste E2E</h1>
        <p className="text-slate-600 dark:text-gray-300 mb-6">
          Você está autenticado como <strong>Admin Teste (dkbotdani@gmail.com)</strong>
        </p>
        <p className="text-slate-500 dark:text-gray-400 mb-6">
          Esta página usa MockAuthContext para simular autenticação sem Firebase.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard/admin"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Ir para Admin Panel (com auth real)
          </a>
        </div>
        <p className="text-sm text-slate-900 dark:text-gray-500 mt-6">
          Nota: O admin panel real ainda requer autenticação Firebase.
          Para testes E2E, use esta rota de teste ou configure o Firebase Emulator.
        </p>
      </div>
    </div>
  );
}
