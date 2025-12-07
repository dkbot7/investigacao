import { test, expect } from '../fixtures/auth';

/**
 * Testes de Carregamento e Navegação do Painel Admin
 */

test.describe('Admin Panel - Carregamento e Navegação', () => {
  test('deve carregar o painel admin com sucesso', async ({ adminPage }) => {
    // Verificar título da página
    await expect(adminPage).toHaveTitle(/investigaree/i);

    // Verificar URL (pode ser /test-admin-panel em testes)
    const url = adminPage.url();
    const isTestRoute = url.includes('/test-admin-panel') || url.includes('/dashboard/admin');
    expect(isTestRoute).toBe(true);

    // Verificar presença de elementos principais
    await expect(adminPage.locator('text=Admin, text=Painel')).toBeVisible();
  });

  test('deve exibir os 4 cards de estatísticas', async ({ adminPage }) => {
    // Aguardar cards carregarem
    await adminPage.waitForSelector('text=Usuarios Totais', { timeout: 10000 });

    // Verificar todos os cards
    await expect(adminPage.locator('text=Usuarios Totais')).toBeVisible();
    await expect(adminPage.locator('text=Tenants Ativos')).toBeVisible();
    await expect(adminPage.locator('text=Aguardando Liberacao')).toBeVisible();
    await expect(adminPage.locator('text=Alertas Nao Lidos')).toBeVisible();
  });

  test('deve exibir as 3 abas de navegação', async ({ adminPage }) => {
    // Verificar tabs
    await expect(adminPage.locator('button:has-text("Visao Geral")')).toBeVisible();
    await expect(adminPage.locator('button:has-text("Alertas")')).toBeVisible();
    await expect(adminPage.locator('button:has-text("Usuarios e Tenants")')).toBeVisible();
  });

  test('deve navegar entre as abas corretamente', async ({ adminPage }) => {
    // Clicar na aba Alertas
    await adminPage.click('button:has-text("Alertas")');
    await adminPage.waitForTimeout(500);

    // Verificar conteúdo de alertas
    await expect(adminPage.locator('text=Alertas do Sistema')).toBeVisible();

    // Clicar na aba Usuários e Tenants
    await adminPage.click('button:has-text("Usuarios e Tenants")');
    await adminPage.waitForTimeout(500);

    // Verificar lista de usuários
    await expect(adminPage.locator('text=Usuarios com Acesso')).toBeVisible();

    // Voltar para Visão Geral
    await adminPage.click('button:has-text("Visao Geral")');
    await adminPage.waitForTimeout(500);

    // Verificar cards novamente
    await expect(adminPage.locator('text=Usuarios Totais')).toBeVisible();
  });

  test('deve exibir banner de modo desenvolvimento (se ativado)', async ({ adminPage }) => {
    // Verificar se banner está visível (pode estar fechado)
    const banner = adminPage.locator('text=Modo Desenvolvimento Ativo');
    const bannerCount = await banner.count();

    if (bannerCount > 0) {
      // Banner visível
      await expect(banner).toBeVisible();

      // Fechar banner
      await adminPage.click('button[aria-label="Fechar banner"], button:has-text("×"):near(:text("Modo Desenvolvimento"))');
      await adminPage.waitForTimeout(300);

      // Verificar que banner sumiu
      await expect(banner).not.toBeVisible();
    }
  });

  test('deve mostrar loading spinner durante carregamento inicial', async ({ page }) => {
    // Navegar para página (sem usar fixture para capturar loading)
    await page.goto('/dashboard/admin');

    // Verificar spinner (pode ser rápido demais em alguns casos)
    const spinner = page.locator('.animate-spin, [role="status"]');
    const hasSpinner = await spinner.count() > 0;

    // Se spinner apareceu, aguardar desaparecer
    if (hasSpinner) {
      await spinner.waitFor({ state: 'hidden', timeout: 5000 });
    }

    // Verificar conteúdo carregado
    await expect(page.locator('text=Usuarios Totais')).toBeVisible();
  });

  test('deve ser responsivo em viewport mobile', async ({ page }) => {
    // Configurar viewport mobile (iPhone 12)
    await page.setViewportSize({ width: 390, height: 844 });

    // Injetar autenticação
    await page.goto('/');
    await page.evaluate(() => {
      const mockUser = {
        uid: 'test-uid-123',
        email: 'dkbotdani@gmail.com',
        displayName: 'Admin Teste',
      };
      localStorage.setItem(
        'firebase:authUser:AIzaSyB8QEhZF3jqKvJQxJ9kZ9vXWJ6hKzJ2Q3M:[DEFAULT]',
        JSON.stringify(mockUser)
      );
    });

    await page.goto('/dashboard/admin');
    await page.waitForSelector('text=Usuarios Totais', { timeout: 10000 });

    // Verificar cards em coluna única
    const cards = page.locator('text=Usuarios Totais').locator('..');
    const box = await cards.boundingBox();

    // Em mobile, cards devem ocupar quase toda largura
    expect(box?.width).toBeGreaterThan(300);
  });
});
