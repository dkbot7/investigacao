import { test as base, expect, Page } from '@playwright/test';

/**
 * Fixture simplificada com mock de autenticação
 * Esta abordagem injeta o estado de autenticação diretamente no contexto React
 */

// Emails admin permitidos
export const ADMIN_EMAILS = [
  'dkbotdani@gmail.com',
  'ibsenmaciel@gmail.com',
  'contato@investigaree.com.br',
];

// Tipo do contexto autenticado
type AdminFixtures = {
  adminPage: Page;
};

// Extend base test com fixtures customizados
export const test = base.extend<AdminFixtures>({
  // Fixture para página admin autenticada
  adminPage: async ({ page }: { page: Page }, use) => {
    // Navegar para a página inicial
    await page.goto('/');

    // Injetar mock de autenticação antes de qualquer script carregar
    await page.addInitScript(() => {
      // Mock do Firebase Auth
      const mockUser = {
        uid: 'test-uid-123',
        email: 'dkbotdani@gmail.com',
        displayName: 'Admin Teste',
        emailVerified: true,
        metadata: {},
        providerData: [],
        refreshToken: 'mock-refresh-token',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'mock-id-token',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
        isAnonymous: false,
        phoneNumber: null,
        photoURL: null,
        providerId: 'firebase',
      };

      // Armazenar no localStorage (formato Firebase)
      localStorage.setItem(
        'firebase:authUser:AIzaSyB8QEhZF3jqKvJQxJ9kZ9vXWJ6hKzJ2Q3M:[DEFAULT]',
        JSON.stringify(mockUser)
      );

      // Mock do Firebase onAuthStateChanged
      let authStateCallback: any = null;

      // Interceptar criação do Firebase app
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        // Permitir todas as chamadas normalmente
        return originalFetch.apply(this, args);
      };

      // Simular que o usuário está autenticado
      setTimeout(() => {
        // Disparar evento de autenticação
        window.dispatchEvent(new CustomEvent('firebase-auth-state-changed', {
          detail: { user: mockUser }
        }));
      }, 100);
    });

    // Navegar para admin panel
    await page.goto('/dashboard/admin');

    // Aguardar a página carregar (usar waitForTimeout como fallback)
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Dar tempo para React renderizar

    await use(page);
  },
});

export { expect };
