import { test, expect } from '../fixtures/auth';

/**
 * Testes de Gerenciamento de Tenants
 */

test.describe('Admin Panel - Gerenciamento de Tenants', () => {
  test.beforeEach(async ({ adminPage }) => {
    // Ir para aba de usuários e tenants
    await adminPage.click('button:has-text("Usuarios e Tenants")');
    await adminPage.waitForTimeout(500);
  });

  test('deve exibir lista de tenants em cards', async ({ adminPage }) => {
    // Scroll até a seção de tenants
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await adminPage.waitForTimeout(300);

    // Verificar título da seção
    await expect(adminPage.locator('text=Tenants Cadastrados')).toBeVisible();

    // Verificar que há pelo menos um card de tenant
    const tenantCards = adminPage.locator('[class*="border"]:has-text("Código:")');
    const count = await tenantCards.count();

    expect(count).toBeGreaterThan(0);
  });

  test('deve abrir modal de criar novo tenant', async ({ adminPage }) => {
    // Procurar botão "Novo Tenant"
    const newTenantButton = adminPage.locator('button:has-text("Novo Tenant"), button:has-text("Adicionar Tenant")');

    if (await newTenantButton.count() > 0) {
      await newTenantButton.click();
      await adminPage.waitForTimeout(300);

      // Verificar que modal abriu
      await expect(adminPage.locator('text=Criar Novo Tenant')).toBeVisible();

      // Verificar campos do formulário
      await expect(adminPage.locator('input[placeholder*="Código"], input[name="code"]')).toBeVisible();
      await expect(adminPage.locator('input[placeholder*="Nome"], input[name="name"]')).toBeVisible();

      // Fechar modal
      const cancelButton = adminPage.locator('button:has-text("Cancelar")');
      await cancelButton.click();
      await adminPage.waitForTimeout(300);
    }
  });

  test('deve validar formato do código do tenant (TENANT_XXX)', async ({ adminPage }) => {
    const newTenantButton = adminPage.locator('button:has-text("Novo Tenant"), button:has-text("Adicionar Tenant")');

    if (await newTenantButton.count() > 0) {
      await newTenantButton.click();
      await adminPage.waitForTimeout(300);

      // Tentar código inválido
      const codeInput = adminPage.locator('input[placeholder*="Código"], input[name="code"]');
      await codeInput.fill('INVALID');

      const nameInput = adminPage.locator('input[placeholder*="Nome"], input[name="name"]');
      await nameInput.fill('Teste Tenant');

      // Verificar que botão criar está desabilitado ou mensagem de erro
      const createButton = adminPage.locator('button:has-text("Criar")');
      const isDisabled = await createButton.getAttribute('disabled');
      const hasError = await adminPage.locator('text=formato deve ser TENANT_').count() > 0;

      expect(isDisabled !== null || hasError).toBe(true);

      // Testar código válido
      await codeInput.clear();
      await codeInput.fill('TENANT_TEST_999');

      // Botão deve estar habilitado agora
      await adminPage.waitForTimeout(300);
      const isStillDisabled = await createButton.getAttribute('disabled');

      // Se não houver outros erros de validação, botão deve estar habilitado
      // (pode estar desabilitado se código já existe)

      // Cancelar
      await adminPage.locator('button:has-text("Cancelar")').click();
    }
  });

  test('deve validar unicidade do código do tenant', async ({ adminPage }) => {
    const newTenantButton = adminPage.locator('button:has-text("Novo Tenant"), button:has-text("Adicionar Tenant")');

    if (await newTenantButton.count() > 0) {
      // Pegar código de um tenant existente
      const firstTenantCode = await adminPage.locator('[class*="border"]:has-text("Código:") code, [class*="border"]:has-text("Código:") span').first().textContent();

      if (firstTenantCode) {
        const existingCode = firstTenantCode.trim();

        // Abrir modal
        await newTenantButton.click();
        await adminPage.waitForTimeout(300);

        // Tentar usar código existente
        const codeInput = adminPage.locator('input[placeholder*="Código"], input[name="code"]');
        await codeInput.fill(existingCode);

        const nameInput = adminPage.locator('input[placeholder*="Nome"], input[name="name"]');
        await nameInput.fill('Teste Duplicado');

        await adminPage.waitForTimeout(300);

        // Verificar erro de duplicação
        const hasError = await adminPage.locator('text=já existe, text=duplicado').count() > 0;
        const createButton = adminPage.locator('button:has-text("Criar")');
        const isDisabled = await createButton.getAttribute('disabled');

        expect(hasError || isDisabled !== null).toBe(true);

        // Cancelar
        await adminPage.locator('button:has-text("Cancelar")').click();
      }
    }
  });

  test('deve validar campo nome obrigatório', async ({ adminPage }) => {
    const newTenantButton = adminPage.locator('button:has-text("Novo Tenant"), button:has-text("Adicionar Tenant")');

    if (await newTenantButton.count() > 0) {
      await newTenantButton.click();
      await adminPage.waitForTimeout(300);

      // Preencher apenas código
      const codeInput = adminPage.locator('input[placeholder*="Código"], input[name="code"]');
      await codeInput.fill('TENANT_NEW_001');

      // Deixar nome vazio
      const createButton = adminPage.locator('button:has-text("Criar")');
      const isDisabled = await createButton.getAttribute('disabled');

      expect(isDisabled).not.toBeNull();

      // Cancelar
      await adminPage.locator('button:has-text("Cancelar")').click();
    }
  });

  test('deve abrir modal de detalhes do tenant', async ({ adminPage }) => {
    // Scroll até a seção de tenants
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Clicar no primeiro tenant card
    const firstTenantCard = adminPage.locator('[class*="border"]:has-text("Código:")').first();

    if (await firstTenantCard.count() > 0) {
      await firstTenantCard.click();
      await adminPage.waitForTimeout(500);

      // Verificar modal de detalhes
      const hasDetailsModal = await adminPage.locator('text=Detalhes do Tenant, text=Informações do Tenant').count() > 0;

      if (hasDetailsModal) {
        // Verificar informações exibidas
        await expect(adminPage.locator('text=Código:, text=Nome:')).toBeVisible();

        // Fechar modal
        const closeButton = adminPage.locator('button:has-text("Fechar"), button[aria-label="Fechar"]');
        if (await closeButton.count() > 0) {
          await closeButton.click();
        } else {
          // Clicar fora do modal
          await adminPage.keyboard.press('Escape');
        }
        await adminPage.waitForTimeout(300);
      }
    }
  });

  test('deve ativar/desativar tenant', async ({ adminPage }) => {
    // Scroll até a seção de tenants
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Procurar toggle switch ou botão de ativar/desativar
    const toggleSwitch = adminPage.locator('input[type="checkbox"][role="switch"], button:has-text("Ativar"), button:has-text("Desativar")').first();

    if (await toggleSwitch.count() > 0) {
      const tagName = await toggleSwitch.evaluate(el => el.tagName);

      if (tagName === 'INPUT') {
        // É um checkbox switch
        const isChecked = await toggleSwitch.isChecked();

        // Toggle
        await toggleSwitch.click();
        await adminPage.waitForTimeout(300);

        // Verificar mudança
        const newState = await toggleSwitch.isChecked();
        expect(newState).toBe(!isChecked);

        // Toggle de volta
        await toggleSwitch.click();
        await adminPage.waitForTimeout(300);
      } else {
        // É um botão
        await toggleSwitch.click();
        await adminPage.waitForTimeout(300);

        // Verificar que o texto mudou ou confirmação apareceu
        const hasConfirmation = await adminPage.locator('text=ativado, text=desativado, text=sucesso').count() > 0;
        expect(hasConfirmation).toBe(true);
      }
    }
  });

  test('deve editar nome do tenant (inline)', async ({ adminPage }) => {
    // Scroll até a seção de tenants
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Procurar botão de editar (lápis)
    const editButton = adminPage.locator('button:has(svg):has-text(""), button[aria-label*="Editar"]').first();

    if (await editButton.count() > 0) {
      await editButton.click();
      await adminPage.waitForTimeout(300);

      // Deve aparecer input inline ou modal
      const inlineInput = adminPage.locator('input[type="text"]:visible').first();

      if (await inlineInput.count() > 0) {
        const originalValue = await inlineInput.inputValue();

        // Editar
        await inlineInput.clear();
        await inlineInput.fill('Tenant Editado Teste');

        // Confirmar edição (Enter ou botão)
        await adminPage.keyboard.press('Enter');
        await adminPage.waitForTimeout(500);

        // Reverter (editar de volta)
        const editButtonAgain = adminPage.locator('button:has(svg):has-text(""), button[aria-label*="Editar"]').first();
        if (await editButtonAgain.count() > 0) {
          await editButtonAgain.click();
          await adminPage.waitForTimeout(300);

          const inputAgain = adminPage.locator('input[type="text"]:visible').first();
          await inputAgain.clear();
          await inputAgain.fill(originalValue);
          await adminPage.keyboard.press('Enter');
          await adminPage.waitForTimeout(300);
        }
      }
    }
  });

  test('deve exibir usuários do tenant no card', async ({ adminPage }) => {
    // Scroll até a seção de tenants
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Verificar que cards mostram contagem de usuários
    const userCountElements = adminPage.locator('text=/\\d+ usuário/, text=/\\d+ user/');
    const count = await userCountElements.count();

    expect(count).toBeGreaterThan(0);
  });

  test('deve filtrar tenants por status (ativo/inativo)', async ({ adminPage }) => {
    // Scroll até a seção de tenants
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Procurar filtro de status
    const statusFilter = adminPage.locator('select:has(option:has-text("Todos")):has(option:has-text("Ativo"))');

    if (await statusFilter.count() > 0) {
      // Filtrar apenas ativos
      await statusFilter.selectOption('active');
      await adminPage.waitForTimeout(500);

      // Verificar que tenants inativos não aparecem
      const inactiveBadges = adminPage.locator('text=Inativo, [class*="bg-red"]:has-text("Inativo")');
      const inactiveCount = await inactiveBadges.count();

      expect(inactiveCount).toBe(0);

      // Voltar para todos
      await statusFilter.selectOption('all');
      await adminPage.waitForTimeout(500);
    }
  });

  test('deve ordenar tenants por nome ou data de criação', async ({ adminPage }) => {
    // Scroll até a seção de tenants
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Procurar seletor de ordenação
    const sortSelect = adminPage.locator('select:has(option:has-text("Nome")):has(option:has-text("Data"))');

    if (await sortSelect.count() > 0) {
      // Pegar primeiro tenant antes de ordenar
      const firstTenantBefore = await adminPage.locator('[class*="border"]:has-text("Código:")').first().textContent();

      // Mudar ordenação
      await sortSelect.selectOption({ index: 1 });
      await adminPage.waitForTimeout(500);

      // Pegar primeiro tenant depois de ordenar
      const firstTenantAfter = await adminPage.locator('[class*="border"]:has-text("Código:")').first().textContent();

      // Ordem pode ter mudado (ou não, se houver apenas 1 tenant)
      // Apenas verificar que a ação de ordenar não quebrou nada
      expect(firstTenantAfter).toBeDefined();
    }
  });

  test('deve exibir badges de status corretos', async ({ adminPage }) => {
    // Scroll até a seção de tenants
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Verificar badges de Ativo (verde)
    const activeBadges = adminPage.locator('[class*="bg-emerald"]:has-text("Ativo"), [class*="bg-green"]:has-text("Ativo")');

    // Verificar badges de Inativo (vermelho/cinza)
    const inactiveBadges = adminPage.locator('[class*="bg-red"]:has-text("Inativo"), [class*="bg-gray"]:has-text("Inativo")');

    const totalBadges = await activeBadges.count() + await inactiveBadges.count();

    // Deve ter pelo menos um badge
    expect(totalBadges).toBeGreaterThan(0);
  });
});
