import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* Tempo máximo por teste */
  timeout: 60 * 1000,

  /* Configuração de expect */
  expect: {
    timeout: 10000,
  },

  /* Executar testes em paralelo */
  fullyParallel: true,

  /* Falhar o build CI se você acidentalmente deixou test.only */
  forbidOnly: !!process.env.CI,

  /* Retry em CI */
  retries: process.env.CI ? 2 : 0,

  /* Workers em paralelo */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list']
  ],

  /* Configuração compartilhada para todos os projetos */
  use: {
    /* URL base */
    baseURL: 'http://localhost:3000',

    /* Coletar trace em falhas */
    trace: 'on-first-retry',

    /* Screenshot apenas em falhas */
    screenshot: 'only-on-failure',

    /* Video apenas em falhas */
    video: 'retain-on-failure',

    /* Timeout de navegação */
    navigationTimeout: 30000,

    /* Timeout de ação */
    actionTimeout: 15000,
  },

  /* Configurar projetos para diferentes navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Descomentar para testar em outros navegadores
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */

    /* Testes Mobile */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Executar servidor de desenvolvimento antes dos testes */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
