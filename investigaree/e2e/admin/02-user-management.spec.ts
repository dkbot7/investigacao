import { test, expect } from '../fixtures/auth';

/**
 * Testes de Gerenciamento de Usuários
 */

test.describe('Admin Panel - Gerenciamento de Usuários', () => {
  test.beforeEach(async ({ adminPage }) => {
    // Ir para aba de usuários
    await adminPage.click('button:has-text("Usuarios e Tenants")');
    await adminPage.waitForTimeout(500);
  });

  test('deve exibir lista de usuários com acesso', async ({ adminPage }) => {
    // Verificar título da seção
    await expect(adminPage.locator('text=Usuarios com Acesso')).toBeVisible();

    // Aguardar tabela ou cards carregarem
    const hasTable = await adminPage.locator('table').count() > 0;
    const hasCards = await adminPage.locator('.md\\:hidden [class*="space-y"]').count() > 0;

    expect(hasTable || hasCards).toBe(true);
  });

  test('deve buscar usuários por email/nome', async ({ adminPage }) => {
    // Localizar campo de busca
    const searchInput = adminPage.locator('input[placeholder*="Buscar"], input[type="search"]');

    if (await searchInput.count() > 0) {
      // Digitar na busca
      await searchInput.fill('teste');
      await adminPage.waitForTimeout(500); // Aguardar debounce

      // Verificar que algum resultado aparece ou mensagem de vazio
      const hasResults = await adminPage.locator('table tbody tr, [class*="space-y"] > div').count() > 0;
      const hasEmptyMessage = await adminPage.locator('text=Nenhum usuário encontrado').count() > 0;

      expect(hasResults || hasEmptyMessage).toBe(true);

      // Limpar busca
      await searchInput.clear();
      await adminPage.waitForTimeout(500);
    }
  });

  test('deve alterar quantidade de itens por página', async ({ adminPage }) => {
    // Localizar seletor de page size
    const pageSize = adminPage.locator('select:has(option:has-text("5")):has(option:has-text("10"))');

    if (await pageSize.count() > 0) {
      // Mudar para 5 itens
      await pageSize.selectOption('5');
      await adminPage.waitForTimeout(500);

      // Verificar que seletor está em 5
      const selectedValue = await pageSize.inputValue();
      expect(selectedValue).toBe('5');

      // Voltar para 10
      await pageSize.selectOption('10');
      await adminPage.waitForTimeout(500);
    }
  });

  test('deve navegar pela paginação', async ({ adminPage }) => {
    // Verificar se há paginação
    const nextButton = adminPage.locator('button:has-text("Próxima"), button:has-text("Next")');

    if (await nextButton.count() > 0) {
      const isDisabled = await nextButton.getAttribute('disabled');

      if (!isDisabled) {
        // Clicar em próxima
        await nextButton.click();
        await adminPage.waitForTimeout(500);

        // Verificar que página mudou (procurar botão Anterior habilitado)
        const prevButton = adminPage.locator('button:has-text("Anterior"), button:has-text("Previous")');
        const prevDisabled = await prevButton.getAttribute('disabled');

        expect(prevDisabled).toBeNull();
      }
    }
  });

  test('deve exportar CSV de usuários', async ({ adminPage }) => {
    // Localizar botão de exportar
    const exportButton = adminPage.locator('button:has-text("Exportar CSV")');

    if (await exportButton.count() > 0) {
      // Preparar para download
      const [download] = await Promise.all([
        adminPage.waitForEvent('download', { timeout: 10000 }),
        exportButton.click(),
      ]);

      // Verificar nome do arquivo
      const filename = download.suggestedFilename();
      expect(filename).toMatch(/usuarios_\d{4}-\d{2}-\d{2}\.csv/);

      // Opcional: Verificar conteúdo do CSV
      const path = await download.path();
      if (path) {
        const fs = require('fs');
        const content = fs.readFileSync(path, 'utf-8');

        // Verificar BOM UTF-8
        expect(content.charCodeAt(0)).toBe(0xFEFF);

        // Verificar headers
        expect(content).toContain('ID,Nome,Email');
      }
    }
  });

  test('deve abrir modal de conceder acesso', async ({ adminPage }) => {
    // Procurar botão "Liberar" ou "Conceder Acesso"
    const grantButton = adminPage.locator('button:has-text("Liberar"), button:has-text("Conceder Acesso")').first();

    if (await grantButton.count() > 0) {
      // Clicar no botão
      await grantButton.click();
      await adminPage.waitForTimeout(300);

      // Verificar que modal abriu (usando heading mais específico)
      await expect(adminPage.locator('h3:has-text("Conceder Acesso")')).toBeVisible();

      // Verificar campos do formulário
      await expect(adminPage.locator('select, [role="combobox"]')).toHaveCount(2, { timeout: 5000 }); // Tenant e Role

      // Fechar modal
      const cancelButton = adminPage.locator('button:has-text("Cancelar")');
      await cancelButton.click();
      await adminPage.waitForTimeout(300);
    }
  });

  test('deve validar formulário de conceder acesso', async ({ adminPage }) => {
    const grantButton = adminPage.locator('button:has-text("Liberar"), button:has-text("Conceder Acesso")').first();

    if (await grantButton.count() > 0) {
      await grantButton.click();
      await adminPage.waitForTimeout(300);

      // Selecionar tenant
      const tenantSelect = adminPage.locator('select').first();
      await tenantSelect.selectOption({ index: 0 });

      // Selecionar role
      const roleSelect = adminPage.locator('select').nth(1);
      await roleSelect.selectOption('viewer');

      // Verificar botão Conceder habilitado
      const confirmButton = adminPage.locator('button:has-text("Conceder")');
      const isDisabled = await confirmButton.getAttribute('disabled');
      expect(isDisabled).toBeNull();

      // Cancelar
      await adminPage.locator('button:has-text("Cancelar")').click();
    }
  });

  test('deve abrir modal de revogar acesso', async ({ adminPage }) => {
    // Procurar botão X vermelho (revogar)
    const revokeButton = adminPage.locator('button[class*="red"]:has(svg)').first();

    if (await revokeButton.count() > 0) {
      await revokeButton.click();
      await adminPage.waitForTimeout(300);

      // Verificar modal de confirmação (procurar por qualquer um dos textos)
      const confirmDialog = adminPage.locator('h3:has-text("Confirmar Revogação"), h3:has-text("Revogar Acesso")');
      await expect(confirmDialog.first()).toBeVisible();

      // Verificar aviso
      const warningText = adminPage.locator('text=não pode ser desfeita, text=irreversível');
      const hasWarning = await warningText.count() > 0;
      if (hasWarning) {
        await expect(warningText.first()).toBeVisible();
      }

      // Cancelar
      await adminPage.locator('button:has-text("Cancelar")').click();
      await adminPage.waitForTimeout(300);
    }
  });

  test('deve exibir cores diferentes para último acesso', async ({ adminPage }) => {
    // Aguardar tabela/cards
    await adminPage.waitForSelector('table tbody tr, [class*="space-y"] > div', { timeout: 5000 });

    // Verificar elementos de último acesso com cores
    const lastAccessElements = adminPage.locator('[class*="text-emerald"], [class*="text-blue"], [class*="text-amber"], [class*="text-white"]');

    const count = await lastAccessElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve exibir badges de roles corretos', async ({ adminPage }) => {
    // Verificar badges de admin (vermelho)
    const adminBadges = adminPage.locator('[class*="bg-red"]:has-text("admin")');

    // Verificar badges de editor (amarelo)
    const editorBadges = adminPage.locator('[class*="bg-amber"]:has-text("editor")');

    // Verificar badges de viewer (azul)
    const viewerBadges = adminPage.locator('[class*="bg-blue"]:has-text("viewer")');

    const totalBadges = await adminBadges.count() + await editorBadges.count() + await viewerBadges.count();

    // Deve ter pelo menos um badge
    expect(totalBadges).toBeGreaterThan(0);
  });
});
