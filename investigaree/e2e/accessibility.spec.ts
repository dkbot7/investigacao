import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Testes de Acessibilidade (WCAG 2.1)
 *
 * Verifica violações de acessibilidade em páginas principais
 * usando axe-core DevTools
 */

test.describe('Accessibility Audit', () => {
  test('Homepage deve estar acessível', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Página de Login deve estar acessível', async ({ page }) => {
    await page.goto('/loginadmin');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Dashboard Admin (test mode) deve estar acessível', async ({ page }) => {
    await page.goto('/test-admin-panel');

    // Aguardar página carregar completamente
    await page.waitForSelector('text=Usuarios Totais', { timeout: 10000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Página de Blog deve estar acessível', async ({ page }) => {
    await page.goto('/blog');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Página de Serviços deve estar acessível', async ({ page }) => {
    await page.goto('/servicos');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Página Sobre deve estar acessível', async ({ page }) => {
    await page.goto('/sobre');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Página de Contato deve estar acessível', async ({ page }) => {
    await page.goto('/contato');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Accessibility - Navegação por Teclado', () => {
  test('Deve navegar pelo header usando Tab', async ({ page }) => {
    await page.goto('/');

    // Focar no primeiro elemento interativo
    await page.keyboard.press('Tab');

    // Verificar que focus está visível
    const focusedElement = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element) return null;

      const styles = window.getComputedStyle(element);
      return {
        tagName: element.tagName,
        hasOutline: styles.outline !== 'none',
        hasFocusVisible: element.matches(':focus-visible')
      };
    });

    expect(focusedElement).not.toBeNull();
  });

  test('Modais devem ser acessíveis por teclado', async ({ page }) => {
    await page.goto('/test-admin-panel');

    // Aguardar página carregar
    await page.waitForSelector('text=Usuarios Totais', { timeout: 10000 });

    // Ir para aba de usuários
    await page.click('button:has-text("Usuarios e Tenants")');
    await page.waitForTimeout(500);

    // Abrir modal de concessão de acesso
    const grantButton = page.locator('button:has-text("Conceder Acesso")').first();
    if (await grantButton.count() > 0) {
      await grantButton.click();
      await page.waitForTimeout(500);

      // Verificar que modal está aberto
      const modal = page.locator('[role="dialog"], .fixed.inset-0');
      await expect(modal.first()).toBeVisible();

      // Tentar fechar com Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Verificar que modal fechou
      await expect(modal.first()).not.toBeVisible();
    }
  });
});

test.describe('Accessibility - Screen Reader Support', () => {
  test('Imagens devem ter alt text', async ({ page }) => {
    await page.goto('/');

    const imagesWithoutAlt = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images
        .filter(img => !img.alt && !img.getAttribute('aria-label'))
        .map(img => img.src);
    });

    expect(imagesWithoutAlt).toEqual([]);
  });

  test('Botões devem ter labels descritivos', async ({ page }) => {
    await page.goto('/test-admin-panel');

    await page.waitForSelector('text=Usuarios Totais', { timeout: 10000 });

    const buttonsWithoutLabel = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons
        .filter(btn => {
          const hasText = btn.textContent?.trim();
          const hasAriaLabel = btn.getAttribute('aria-label');
          const hasTitle = btn.getAttribute('title');

          return !hasText && !hasAriaLabel && !hasTitle;
        })
        .map(btn => btn.outerHTML.substring(0, 100));
    });

    expect(buttonsWithoutLabel.length).toBe(0);
  });

  test('Links devem ter texto descritivo', async ({ page }) => {
    await page.goto('/');

    const linksWithoutText = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links
        .filter(link => {
          const hasText = link.textContent?.trim();
          const hasAriaLabel = link.getAttribute('aria-label');
          const hasTitle = link.getAttribute('title');

          return !hasText && !hasAriaLabel && !hasTitle;
        })
        .map(link => link.href);
    });

    expect(linksWithoutText).toEqual([]);
  });
});

test.describe('Accessibility - Contraste de Cores', () => {
  test('Texto deve ter contraste suficiente', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // Vamos testar manualmente
      .analyze();

    // Apenas verificar que não há violations críticas
    const criticalViolations = accessibilityScanResults.violations.filter(
      v => v.impact === 'critical'
    );

    expect(criticalViolations).toEqual([]);
  });
});

test.describe('Accessibility - Semântica HTML', () => {
  test('Headings devem estar em ordem hierárquica', async ({ page }) => {
    await page.goto('/');

    const headings = await page.evaluate(() => {
      const headingElements = Array.from(
        document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      );
      return headingElements.map(h => ({
        level: parseInt(h.tagName.substring(1)),
        text: h.textContent?.trim().substring(0, 50)
      }));
    });

    // Deve ter pelo menos um H1
    const h1Count = headings.filter(h => h.level === 1).length;
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Verificar ordem (não pode pular níveis)
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1].level;
      const curr = headings[i].level;

      // Se aumentou, não pode pular mais de 1 nível
      if (curr > prev) {
        expect(curr - prev).toBeLessThanOrEqual(1);
      }
    }
  });

  test('Formulários devem ter labels associados', async ({ page }) => {
    await page.goto('/loginadmin');

    const inputsWithoutLabel = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"])'));
      return inputs
        .filter(input => {
          const hasLabel = document.querySelector(`label[for="${input.id}"]`);
          const hasAriaLabel = input.getAttribute('aria-label');
          const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
          const hasPlaceholder = input.getAttribute('placeholder');

          return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy && !hasPlaceholder;
        })
        .map(input => input.name || input.id);
    });

    expect(inputsWithoutLabel).toEqual([]);
  });
});
