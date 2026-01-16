import { test as base, expect, Page } from '@playwright/test';

/**
 * Fixture customizado com autenticação para testes do admin panel
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
  isAuthenticated: boolean;
};

// Extend base test com fixtures customizados
export const test = base.extend<AdminFixtures>({
  // Fixture para página admin autenticada
  adminPage: async ({ page }: { page: Page }, use) => {
    // Usar rota de teste que tem MockAuthContext
    // Esta rota não precisa de autenticação Firebase real
    await page.goto('/test-admin-panel', { waitUntil: 'domcontentloaded' });

    // Aguardar carregamento da página
    await page.waitForTimeout(2000); // Dar tempo para React renderizar

    // Remover cookie banner global para não interferir nos testes
    await page.evaluate(() => {
      // Remover banner de cookies se existir
      const cookieBanner = document.querySelector('[role="dialog"][aria-labelledby="cookie-banner-title"]');
      if (cookieBanner) {
        cookieBanner.remove();
      }
      // Também adicionar CSS para esconder qualquer banner futuro
      const style = document.createElement('style');
      style.textContent = '[role="dialog"].fixed.bottom-0 { display: none !important; }';
      document.head.appendChild(style);
    });

    // Verificar se carregou corretamente
    try {
      await page.waitForSelector('text=Usuarios Totais, text=Admin, h1', { timeout: 10000 });
    } catch (e) {
      console.log('⚠️ Admin panel test page não carregou completamente');
    }

    await use(page);
  },

  // Fixture para verificar autenticação
  isAuthenticated: async ({ page }, use) => {
    const isAuth = await page.evaluate(() => {
      const authData = localStorage.getItem('firebase:authUser:AIzaSyB8QEhZF3jqKvJQxJ9kZ9vXWJ6hKzJ2Q3M:[DEFAULT]');
      return !!authData;
    });

    await use(isAuth);
  },
});

export { expect };
