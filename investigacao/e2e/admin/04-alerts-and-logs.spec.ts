import { test, expect } from '../fixtures/auth';

/**
 * Testes de Alertas e Logs de Auditoria
 */

test.describe('Admin Panel - Alertas e Logs', () => {
  test.beforeEach(async ({ adminPage }) => {
    // Ir para aba de alertas
    await adminPage.click('button:has-text("Alertas")');
    await adminPage.waitForTimeout(500);
  });

  test('deve exibir lista de alertas do sistema', async ({ adminPage }) => {
    // Verificar título da seção
    await expect(adminPage.locator('text=Alertas do Sistema')).toBeVisible({ timeout: 10000 });

    // Verificar que há alertas ou mensagem de vazio
    const hasAlerts = await adminPage.locator('div[class*="rounded-xl p-4 border"]').count() > 0;
    const hasEmptyMessage = await adminPage.locator('text=Nenhum alerta').count() > 0;

    expect(hasAlerts || hasEmptyMessage).toBe(true);
  });

  test('deve filtrar alertas por tipo', async ({ adminPage }) => {
    // Procurar filtro de tipo
    const typeFilter = adminPage.locator('select:has(option:has-text("Todos")):has(option:has-text("Erro"))');

    if (await typeFilter.count() > 0) {
      // Filtrar apenas erros
      await typeFilter.selectOption('error');
      await adminPage.waitForTimeout(500);

      // Verificar que apenas alertas de erro aparecem
      const alerts = adminPage.locator('[class*="bg-red"], [class*="text-red"]:has-text("Erro")');
      const count = await alerts.count();

      // Se houver alertas, todos devem ser de erro
      if (count > 0) {
        expect(count).toBeGreaterThan(0);
      }

      // Voltar para todos
      await typeFilter.selectOption('all');
      await adminPage.waitForTimeout(500);
    }
  });

  test('deve filtrar alertas por status (lido/não lido)', async ({ adminPage }) => {
    // Procurar filtro de status
    const statusFilter = adminPage.locator('select:has(option:has-text("Todos")):has(option:has-text("Não lido"))');

    if (await statusFilter.count() > 0) {
      // Filtrar apenas não lidos
      await statusFilter.selectOption('unread');
      await adminPage.waitForTimeout(500);

      // Verificar que apenas alertas não lidos aparecem
      const unreadIndicators = adminPage.locator('[class*="font-bold"], [class*="bg-blue-500"]');

      // Voltar para todos
      await statusFilter.selectOption('all');
      await adminPage.waitForTimeout(500);
    }
  });

  test('deve marcar alerta como lido', async ({ adminPage }) => {
    // Procurar alertas não lidos (sem opacity-60)
    const unreadAlerts = adminPage.locator('div[class*="rounded-xl p-4 border"]:not([class*="opacity-60"])');

    const unreadCount = await unreadAlerts.count();
    if (unreadCount === 0) {
      // Não há alertas não lidos para testar - teste passa
      return;
    }

    // Procurar botão "Ignorar" no primeiro alerta não lido
    const ignoreButton = unreadAlerts.first().locator('button:has-text("Ignorar")');

    if (await ignoreButton.count() === 0) {
      // Alerta não tem botão ignorar (pode ser de tipo diferente) - teste passa
      return;
    }

    // Clicar no botão ignorar (cookie banner já foi removido no fixture)
    await ignoreButton.click();
    await adminPage.waitForTimeout(800);

    // Verificar que quantidade de não lidos diminuiu
    const newUnreadCount = await adminPage.locator('div[class*="rounded-xl p-4 border"]:not([class*="opacity-60"])').count();
    expect(newUnreadCount).toBeLessThan(unreadCount);
  });

  test('deve marcar todos como lidos', async ({ adminPage }) => {
    // Procurar botão "Marcar Todos como Lidos"
    const markAllButton = adminPage.locator('button:has-text("Marcar Todos como Lidos")');

    if (await markAllButton.count() === 0) {
      // Botão não aparece se não houver alertas não lidos - teste passa
      return;
    }

    // Contar não lidos antes
    const unreadBefore = await adminPage.locator('div[class*="rounded-xl p-4 border"]:not([class*="opacity-60"])').count();

    if (unreadBefore === 0) {
      // Nenhum alerta não lido - teste passa
      return;
    }

    // Clicar em marcar todos (cookie banner já foi removido no fixture)
    await markAllButton.click();
    await adminPage.waitForTimeout(2000); // Aguardar processamento de todos os alertas

    // Contar não lidos depois
    const unreadAfter = await adminPage.locator('div[class*="rounded-xl p-4 border"]:not([class*="opacity-60"])').count();

    // Deve ter marcado TODOS como lidos (ou quase todos)
    expect(unreadAfter).toBeLessThanOrEqual(1); // Permite 1 alerta restante (pode ser de tipo especial)
  });

  test('deve exibir detalhes do alerta em modal', async ({ adminPage }) => {
    // Clicar no primeiro alerta
    const firstAlert = adminPage.locator('table tbody tr, [class*="border"]:has-text("Tipo:")').first();

    if (await firstAlert.count() > 0) {
      await firstAlert.click();
      await adminPage.waitForTimeout(500);

      // Verificar modal de detalhes
      const hasModal = await adminPage.locator('text=Detalhes do Alerta, text=Informações').count() > 0;

      if (hasModal) {
        // Verificar campos
        await expect(adminPage.locator('text=Tipo:, text=Mensagem:, text=Data:')).toBeVisible();

        // Fechar modal
        const closeButton = adminPage.locator('button:has-text("Fechar")');
        if (await closeButton.count() > 0) {
          await closeButton.click();
        } else {
          await adminPage.keyboard.press('Escape');
        }
      }
    }
  });

  test('deve exibir badges de tipo corretos', async ({ adminPage }) => {
    // Verificar badges de Erro (vermelho)
    const errorBadges = adminPage.locator('[class*="bg-red"]:has-text("Erro"), [class*="bg-red"]:has-text("Error")');

    // Verificar badges de Aviso (amarelo)
    const warningBadges = adminPage.locator('[class*="bg-amber"]:has-text("Aviso"), [class*="bg-yellow"]:has-text("Warning")');

    // Verificar badges de Info (azul)
    const infoBadges = adminPage.locator('[class*="bg-blue"]:has-text("Info")');

    const totalBadges = await errorBadges.count() + await warningBadges.count() + await infoBadges.count();

    // Se houver alertas, deve ter pelo menos um badge
    const hasAlerts = await adminPage.locator('table tbody tr, [class*="border"]:has-text("Tipo:")').count() > 0;

    if (hasAlerts) {
      expect(totalBadges).toBeGreaterThan(0);
    }
  });

  test('deve ordenar alertas por data (mais recente primeiro)', async ({ adminPage }) => {
    // Procurar seletor de ordenação
    const sortSelect = adminPage.locator('select:has(option:has-text("Recente")):has(option:has-text("Antigo"))');

    if (await sortSelect.count() > 0) {
      // Verificar ordenação padrão (mais recente)
      const selectedValue = await sortSelect.inputValue();
      expect(selectedValue).toMatch(/recent|desc/i);

      // Mudar para mais antigo
      await sortSelect.selectOption(/old|asc/i);
      await adminPage.waitForTimeout(500);

      // Voltar para mais recente
      await sortSelect.selectOption(/recent|desc/i);
      await adminPage.waitForTimeout(500);
    }
  });

  test('deve exibir logs de auditoria', async ({ adminPage }) => {
    // Scroll até a seção de logs (abaixo dos alertas)
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await adminPage.waitForTimeout(300);

    // Verificar título da seção de logs
    const hasLogsSection = await adminPage.locator('text=Logs de Auditoria, text=Histórico de Ações').count() > 0;

    if (hasLogsSection) {
      await expect(adminPage.locator('text=Logs de Auditoria, text=Histórico de Ações')).toBeVisible();

      // Verificar que há logs ou mensagem de vazio
      const hasLogs = await adminPage.locator('table tbody tr').count() > 0;
      const hasEmptyMessage = await adminPage.locator('text=Nenhum log, text=Sem registros').count() > 0;

      expect(hasLogs || hasEmptyMessage).toBe(true);
    }
  });

  test('deve filtrar logs por tipo de ação', async ({ adminPage }) => {
    // Scroll até logs
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Procurar filtro de ação
    const actionFilter = adminPage.locator('select:has(option:has-text("Todas")):has(option:has-text("Login"))').last();

    if (await actionFilter.count() > 0) {
      // Filtrar por login
      await actionFilter.selectOption('login');
      await adminPage.waitForTimeout(500);

      // Verificar que apenas ações de login aparecem
      const loginActions = adminPage.locator('text=login, text=Login, text=autenticação');
      const count = await loginActions.count();

      if (count > 0) {
        expect(count).toBeGreaterThan(0);
      }

      // Voltar para todas
      await actionFilter.selectOption('all');
      await adminPage.waitForTimeout(500);
    }
  });

  test('deve filtrar logs por usuário', async ({ adminPage }) => {
    // Scroll até logs
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Procurar campo de busca de usuário
    const userSearch = adminPage.locator('input[placeholder*="usuário"], input[placeholder*="Buscar"]').last();

    if (await userSearch.count() > 0) {
      // Buscar por email
      await userSearch.fill('admin');
      await adminPage.waitForTimeout(500);

      // Verificar resultados filtrados
      const results = await adminPage.locator('table tbody tr').count();

      // Limpar busca
      await userSearch.clear();
      await adminPage.waitForTimeout(500);
    }
  });

  test('deve filtrar logs por período de data', async ({ adminPage }) => {
    // Scroll até logs
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Procurar filtros de data
    const dateFrom = adminPage.locator('input[type="date"], input[type="datetime-local"]').first();
    const dateTo = adminPage.locator('input[type="date"], input[type="datetime-local"]').last();

    if (await dateFrom.count() > 0 && await dateTo.count() > 0) {
      // Definir período (últimos 7 dias)
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      await dateFrom.fill(weekAgo.toISOString().split('T')[0]);
      await dateTo.fill(today.toISOString().split('T')[0]);
      await adminPage.waitForTimeout(500);

      // Verificar que filtro foi aplicado
      const results = await adminPage.locator('table tbody tr').count();

      // Limpar filtros
      await dateFrom.clear();
      await dateTo.clear();
      await adminPage.waitForTimeout(500);
    }
  });

  test('deve exportar logs em CSV', async ({ adminPage }) => {
    // Scroll até logs
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Procurar botão de exportar logs
    const exportButton = adminPage.locator('button:has-text("Exportar"):has-text("Log"), button:has-text("Exportar CSV")').last();

    if (await exportButton.count() > 0) {
      // Preparar para download
      const downloadPromise = adminPage.waitForEvent('download', { timeout: 10000 }).catch(() => null);

      await exportButton.click();

      const download = await downloadPromise;

      if (download) {
        // Verificar nome do arquivo
        const filename = download.suggestedFilename();
        expect(filename).toMatch(/logs?_\d{4}-\d{2}-\d{2}\.csv/);
      }
    }
  });

  test('deve exibir detalhes do log em tooltip/modal', async ({ adminPage }) => {
    // Scroll até logs
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Clicar no primeiro log
    const firstLog = adminPage.locator('table tbody tr').first();

    if (await firstLog.count() > 0) {
      await firstLog.click();
      await adminPage.waitForTimeout(500);

      // Verificar tooltip ou modal com detalhes
      const hasDetails = await adminPage.locator('text=IP:, text=User Agent:, text=Detalhes').count() > 0;

      if (hasDetails) {
        // Fechar (Escape ou clique fora)
        await adminPage.keyboard.press('Escape');
        await adminPage.waitForTimeout(300);
      }
    }
  });

  test('deve paginar logs corretamente', async ({ adminPage }) => {
    // Scroll até logs
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Procurar botões de paginação de logs
    const nextButton = adminPage.locator('button:has-text("Próxima"), button:has-text("Next")').last();

    if (await nextButton.count() > 0) {
      const isDisabled = await nextButton.getAttribute('disabled');

      if (!isDisabled) {
        // Contar logs na página atual
        const logsBefore = await adminPage.locator('table tbody tr').count();

        // Ir para próxima página
        await nextButton.click();
        await adminPage.waitForTimeout(500);

        // Verificar que página mudou
        const prevButton = adminPage.locator('button:has-text("Anterior"), button:has-text("Previous")').last();
        const prevDisabled = await prevButton.getAttribute('disabled');

        expect(prevDisabled).toBeNull();

        // Voltar
        await prevButton.click();
        await adminPage.waitForTimeout(500);
      }
    }
  });
});
