import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup para os testes E2E
 * Cria um estado de autenticação que pode ser reutilizado
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Iniciando setup global dos testes...');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navegar para a página
    await page.goto('http://localhost:3000/');

    // Injetar autenticação mock
    await page.evaluate(() => {
      const mockUser = {
        uid: 'test-uid-123',
        email: 'dkbotdani@gmail.com',
        displayName: 'Admin Teste',
        emailVerified: true,
      };

      localStorage.setItem(
        'firebase:authUser:AIzaSyB8QEhZF3jqKvJQxJ9kZ9vXWJ6hKzJ2Q3M:[DEFAULT]',
        JSON.stringify(mockUser)
      );
    });

    // Salvar estado de autenticação
    await page.context().storageState({ path: 'e2e/.auth/admin.json' });

    console.log('✅ Estado de autenticação criado em e2e/.auth/admin.json');
  } catch (error) {
    console.error('❌ Erro no global setup:', error);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
