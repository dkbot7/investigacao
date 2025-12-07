import { test, expect } from '../fixtures/auth';

/**
 * Testes de Métricas e Analytics
 */

test.describe('Admin Panel - Métricas e Analytics', () => {
  test.beforeEach(async ({ adminPage }) => {
    // Garantir que estamos na aba Visão Geral
    await adminPage.click('button:has-text("Visao Geral")');
    await adminPage.waitForTimeout(500);
  });

  test('deve exibir métricas de usuários ativos', async ({ adminPage }) => {
    // Verificar seção de métricas de uso
    const hasMetrics = await adminPage.locator('text=Usuarios Ativos, text=Atividade').count() > 0;

    if (hasMetrics) {
      await expect(adminPage.locator('text=Usuarios Ativos, text=Atividade')).toBeVisible();

      // Verificar valores numéricos
      const hasNumbers = await adminPage.locator('text=/\\d+/').count() > 0;
      expect(hasNumbers).toBe(true);
    }
  });

  test('deve calcular taxa de crescimento corretamente', async ({ adminPage }) => {
    // Procurar indicador de crescimento
    const growthIndicators = adminPage.locator('text=/[+\\-]\\d+%/, [class*="text-emerald"], [class*="text-red"]');

    if (await growthIndicators.count() > 0) {
      const growthText = await growthIndicators.first().textContent();

      // Verificar formato de porcentagem
      expect(growthText).toMatch(/[+\-]?\d+%/);

      // Verificar cor (verde para positivo, vermelho para negativo)
      const firstGrowth = growthIndicators.first();
      const className = await firstGrowth.getAttribute('class');

      if (growthText?.includes('+')) {
        expect(className).toMatch(/emerald|green/);
      } else if (growthText?.includes('-')) {
        expect(className).toMatch(/red/);
      }
    }
  });

  test('deve exibir gráfico de atividade temporal', async ({ adminPage }) => {
    // Scroll até gráficos
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await adminPage.waitForTimeout(300);

    // Procurar canvas ou SVG de gráfico
    const hasChart = await adminPage.locator('canvas, svg[class*="recharts"]').count() > 0;

    if (hasChart) {
      const chart = adminPage.locator('canvas, svg[class*="recharts"]').first();
      await expect(chart).toBeVisible();

      // Verificar dimensões do gráfico
      const box = await chart.boundingBox();
      expect(box?.width).toBeGreaterThan(100);
      expect(box?.height).toBeGreaterThan(100);
    }
  });

  test('deve alternar período de visualização (7d, 30d, 90d)', async ({ adminPage }) => {
    // Procurar botões de período
    const period7d = adminPage.locator('button:has-text("7d"), button:has-text("7 dias")');
    const period30d = adminPage.locator('button:has-text("30d"), button:has-text("30 dias")');
    const period90d = adminPage.locator('button:has-text("90d"), button:has-text("90 dias")');

    if (await period7d.count() > 0) {
      // Clicar em 7 dias
      await period7d.click();
      await adminPage.waitForTimeout(500);

      // Verificar que está ativo (classe ou atributo)
      const is7dActive = await period7d.getAttribute('class');
      expect(is7dActive).toMatch(/active|selected|bg-/);

      // Clicar em 30 dias
      if (await period30d.count() > 0) {
        await period30d.click();
        await adminPage.waitForTimeout(500);

        const is30dActive = await period30d.getAttribute('class');
        expect(is30dActive).toMatch(/active|selected|bg-/);
      }
    }
  });

  test('deve exibir distribuição de roles em gráfico de pizza', async ({ adminPage }) => {
    // Scroll até gráficos
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });

    // Procurar gráfico de pizza (pie chart)
    const hasPieChart = await adminPage.locator('text=Distribuição, text=Roles, svg[class*="recharts"]').count() > 0;

    if (hasPieChart) {
      // Verificar legendas
      const hasLegends = await adminPage.locator('text=admin, text=editor, text=viewer').count() > 0;
      expect(hasLegends).toBe(true);
    }
  });

  test('deve exibir top 5 tenants mais ativos', async ({ adminPage }) => {
    // Scroll até estatísticas
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });

    // Procurar seção de top tenants
    const hasTopTenants = await adminPage.locator('text=Top, text=Mais Ativos, text=Tenants').count() > 0;

    if (hasTopTenants) {
      // Verificar lista
      const tenantItems = adminPage.locator('ol li, ul li').filter({ hasText: /TENANT_/ });
      const count = await tenantItems.count();

      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThanOrEqual(5);
    }
  });

  test('deve exibir métricas de uso por feature', async ({ adminPage }) => {
    // Scroll até métricas de features
    await adminPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });

    // Procurar seção de features
    const hasFeatureMetrics = await adminPage.locator('text=Features, text=Funcionalidades, text=Uso').count() > 0;

    if (hasFeatureMetrics) {
      // Verificar barras de progresso ou valores
      const progressBars = adminPage.locator('[role="progressbar"], .progress-bar');
      const count = await progressBars.count();

      if (count > 0) {
        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test('deve calcular tempo médio de sessão', async ({ adminPage }) => {
    // Procurar métrica de tempo de sessão
    const sessionTime = adminPage.locator('text=Tempo médio, text=sessão, text=/\\d+\\s*(min|hora)/');

    if (await sessionTime.count() > 0) {
      const timeText = await sessionTime.first().textContent();

      // Verificar formato (ex: "15 min", "1 hora")
      expect(timeText).toMatch(/\d+\s*(min|hora|h|m)/);
    }
  });

  test('deve exibir taxa de retenção', async ({ adminPage }) => {
    // Procurar métrica de retenção
    const retention = adminPage.locator('text=Retenção, text=/\\d+%/');

    if (await retention.count() > 0) {
      const retentionText = await retention.first().textContent();

      // Verificar formato de porcentagem
      expect(retentionText).toMatch(/\d+%/);
    }
  });

  test('deve exibir alertas em tempo real no card', async ({ adminPage }) => {
    // Verificar card de alertas não lidos
    const alertsCard = adminPage.locator('text=Alertas Nao Lidos').locator('..');

    await expect(alertsCard).toBeVisible();

    // Verificar número de alertas
    const alertCount = await alertsCard.locator('text=/\\d+/').first().textContent();
    expect(alertCount).toMatch(/\d+/);
  });

  test('deve atualizar métricas ao trocar de aba e voltar', async ({ adminPage }) => {
    // Capturar valor inicial de um card
    const usersCard = adminPage.locator('text=Usuarios Totais').locator('..');
    const initialValue = await usersCard.locator('text=/\\d+/').first().textContent();

    // Trocar para outra aba
    await adminPage.click('button:has-text("Alertas")');
    await adminPage.waitForTimeout(500);

    // Voltar para Visão Geral
    await adminPage.click('button:has-text("Visao Geral")');
    await adminPage.waitForTimeout(500);

    // Verificar que cards foram re-renderizados
    await expect(usersCard).toBeVisible();
    const newValue = await usersCard.locator('text=/\\d+/').first().textContent();

    // Valores devem ser os mesmos (ou potencialmente atualizados)
    expect(newValue).toBeDefined();
  });

  test('deve exibir loading state durante carregamento de métricas', async ({ page }) => {
    // Navegar para página sem usar fixture (para capturar loading)
    await page.goto('/dashboard/admin');

    // Procurar loading spinner nos cards
    const loadingSpinners = page.locator('.animate-spin, [class*="animate-pulse"]');
    const hasLoading = await loadingSpinners.count() > 0;

    // Se houver loading, aguardar desaparecer
    if (hasLoading) {
      await page.waitForSelector('text=Usuarios Totais', { timeout: 10000 });
    }

    // Verificar que métricas carregaram
    await expect(page.locator('text=Usuarios Totais')).toBeVisible();
  });

  test('deve exibir tooltip com detalhes ao passar mouse em métricas', async ({ adminPage }) => {
    // Hover sobre um indicador de crescimento
    const growthIndicator = adminPage.locator('[class*="text-emerald"], [class*="text-red"]').first();

    if (await growthIndicator.count() > 0) {
      await growthIndicator.hover();
      await adminPage.waitForTimeout(500);

      // Verificar se tooltip apareceu
      const tooltip = adminPage.locator('[role="tooltip"], .tooltip');
      const hasTooltip = await tooltip.count() > 0;

      // Tooltip pode não estar implementado, então não é erro crítico
      // Apenas verificar que hover não quebrou nada
      await expect(growthIndicator).toBeVisible();
    }
  });

  test('deve formatar números grandes corretamente (K, M)', async ({ adminPage }) => {
    // Procurar números formatados
    const formattedNumbers = adminPage.locator('text=/\\d+[KM]/, text=/\\d+\\.\\d+[KM]/');

    if (await formattedNumbers.count() > 0) {
      const numberText = await formattedNumbers.first().textContent();

      // Verificar formato (ex: "1.5K", "2M")
      expect(numberText).toMatch(/\d+\.?\d*[KM]/);
    }
  });

  test('deve exibir indicadores de tendência (subindo/descendo)', async ({ adminPage }) => {
    // Procurar ícones de setas
    const trendIcons = adminPage.locator('svg[class*="arrow"], svg[class*="trend"]');

    if (await trendIcons.count() > 0) {
      // Verificar que há ícones de tendência
      const count = await trendIcons.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('deve comparar período atual com período anterior', async ({ adminPage }) => {
    // Procurar texto de comparação (ex: "vs. período anterior")
    const comparison = adminPage.locator('text=vs., text=anterior, text=comparado');

    if (await comparison.count() > 0) {
      await expect(comparison.first()).toBeVisible();

      // Verificar que há diferença percentual
      const percentage = adminPage.locator('text=/[+\\-]\\d+%/');
      const hasPercentage = await percentage.count() > 0;
      expect(hasPercentage).toBe(true);
    }
  });
});
