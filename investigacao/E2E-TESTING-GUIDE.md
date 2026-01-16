# 🧪 Guia de Testes E2E - Admin Panel

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Executando os Testes](#executando-os-testes)
- [Estrutura dos Testes](#estrutura-dos-testes)
- [Cobertura de Testes](#cobertura-de-testes)
- [Troubleshooting](#troubleshooting)
- [CI/CD](#cicd)

---

## 🎯 Visão Geral

Este projeto utiliza **Playwright** para testes E2E (End-to-End) automatizados do Admin Panel. Os testes cobrem todos os fluxos principais documentados no `ADMIN-PANEL-TEST-REPORT.md`.

### 📊 Estatísticas

- **Total de Testes**: 58 testes automatizados
- **Arquivos de Teste**: 5 arquivos spec
- **Navegadores**: Chromium, Mobile Chrome, Mobile Safari
- **Tempo Estimado**: ~3-5 minutos (execução completa)

### ✅ Benefícios

- ✅ Testes automatizados de todos os fluxos críticos
- ✅ Validação em múltiplos navegadores e viewports
- ✅ Screenshots e vídeos em caso de falhas
- ✅ Relatórios HTML interativos
- ✅ Integração fácil com CI/CD

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- NPM ou Yarn
- Projeto investigaree clonado

### Passo a Passo

```bash
# 1. Navegar para o diretório do projeto
cd investigaree

# 2. Instalar dependências (se ainda não instalou)
npm install

# 3. Instalar navegadores do Playwright (se ainda não instalou)
npx playwright install chromium
```

**Nota**: Os navegadores ocupam ~300MB. Você só precisa instalar uma vez.

---

## 🎮 Executando os Testes

### Comandos Disponíveis

#### 1. Executar Todos os Testes (Headless)

```bash
npm test
```

- Executa todos os testes em modo headless (sem interface gráfica)
- Mais rápido, ideal para CI/CD
- Gera relatório HTML automaticamente

#### 2. Executar com Interface Gráfica

```bash
npm run test:headed
```

- Abre navegador visível
- Útil para debugging
- Você pode ver as interações em tempo real

#### 3. Modo UI Interativo (Recomendado para Desenvolvimento)

```bash
npm run test:ui
```

- Interface gráfica do Playwright
- Permite executar testes individualmente
- Mostra cada passo com destaque visual
- Melhor experiência para desenvolvimento

#### 4. Executar Apenas Testes do Admin

```bash
npm run test:admin
```

- Executa apenas os testes da pasta `e2e/admin/`
- Mais rápido que executar todos os testes

#### 5. Modo Debug

```bash
npm run test:debug
```

- Abre o Playwright Inspector
- Permite pausar e inspecionar cada passo
- Útil para investigar falhas

#### 6. Ver Último Relatório

```bash
npm run test:report
```

- Abre o relatório HTML da última execução
- Mostra screenshots, vídeos e traces

---

## 📁 Estrutura dos Testes

```
investigaree/
├── e2e/
│   ├── fixtures/
│   │   └── auth.ts              # Fixture de autenticação
│   └── admin/
│       ├── 01-load-and-navigation.spec.ts    # 7 testes
│       ├── 02-user-management.spec.ts        # 11 testes
│       ├── 03-tenant-management.spec.ts      # 12 testes
│       ├── 04-alerts-and-logs.spec.ts        # 15 testes
│       └── 05-metrics.spec.ts                # 13 testes
├── playwright.config.ts         # Configuração do Playwright
└── playwright-report/           # Relatórios gerados (auto-criado)
```

### 🔑 Arquivo de Fixture (`auth.ts`)

Este arquivo fornece autenticação automática para os testes:

- Injeta usuário admin mock no localStorage
- Navega automaticamente para `/dashboard/admin`
- Aguarda carregamento completo da página
- Reutilizável em todos os testes

**Exemplo de uso**:

```typescript
test('meu teste', async ({ adminPage }) => {
  // adminPage já está autenticado e na página do admin
  await expect(adminPage.locator('text=Admin')).toBeVisible();
});
```

---

## 🎯 Cobertura de Testes

### 01 - Carregamento e Navegação (7 testes)

| # | Teste | O que verifica |
|---|-------|----------------|
| 1 | Carregar painel admin | URL, título, elementos principais |
| 2 | Cards de estatísticas | 4 cards principais visíveis |
| 3 | Abas de navegação | 3 abas (Visão Geral, Alertas, Usuários) |
| 4 | Navegação entre abas | Conteúdo muda corretamente |
| 5 | Banner de desenvolvimento | Exibição e fechamento |
| 6 | Loading spinner | Estado de carregamento inicial |
| 7 | Responsividade mobile | Layout em iPhone 12 (390x844) |

### 02 - Gerenciamento de Usuários (11 testes)

| # | Teste | O que verifica |
|---|-------|----------------|
| 1 | Lista de usuários | Tabela ou cards com usuários |
| 2 | Busca por email/nome | Filtro de usuários |
| 3 | Itens por página | Selector de page size (5, 10, 25) |
| 4 | Paginação | Navegação entre páginas |
| 5 | Exportar CSV | Download de arquivo CSV |
| 6 | Modal conceder acesso | Abertura e campos do modal |
| 7 | Validação do formulário | Campos obrigatórios |
| 8 | Modal revogar acesso | Confirmação de revogação |
| 9 | Cores de último acesso | Indicadores visuais (verde, azul, âmbar) |
| 10 | Badges de roles | Admin (vermelho), Editor (amarelo), Viewer (azul) |
| 11 | Validação CSV | BOM UTF-8, headers corretos |

### 03 - Gerenciamento de Tenants (12 testes)

| # | Teste | O que verifica |
|---|-------|----------------|
| 1 | Lista de tenants | Cards de tenants visíveis |
| 2 | Modal criar tenant | Abertura e campos do formulário |
| 3 | Validação do código | Formato TENANT_XXX |
| 4 | Unicidade do código | Evitar duplicação |
| 5 | Validação do nome | Campo obrigatório |
| 6 | Modal de detalhes | Informações do tenant |
| 7 | Ativar/desativar | Toggle de status |
| 8 | Edição inline | Editar nome do tenant |
| 9 | Usuários do tenant | Contagem exibida no card |
| 10 | Filtro por status | Ativos/Inativos |
| 11 | Ordenação | Por nome ou data |
| 12 | Badges de status | Ativo (verde), Inativo (vermelho) |

### 04 - Alertas e Logs (15 testes)

| # | Teste | O que verifica |
|---|-------|----------------|
| 1 | Lista de alertas | Tabela de alertas visível |
| 2 | Filtro por tipo | Erro, Aviso, Info |
| 3 | Filtro por status | Lido/Não lido |
| 4 | Marcar como lido | Alteração de estado |
| 5 | Marcar todos como lidos | Ação em lote |
| 6 | Modal de detalhes | Detalhes do alerta |
| 7 | Badges de tipo | Erro (vermelho), Aviso (amarelo), Info (azul) |
| 8 | Ordenação por data | Mais recente primeiro |
| 9 | Logs de auditoria | Seção de histórico |
| 10 | Filtro de logs por ação | Login, criação, edição, etc. |
| 11 | Filtro por usuário | Busca por email/nome |
| 12 | Filtro por período | Data de início e fim |
| 13 | Exportar logs CSV | Download de CSV |
| 14 | Detalhes do log | IP, User Agent |
| 15 | Paginação de logs | Navegação entre páginas |

### 05 - Métricas e Analytics (13 testes)

| # | Teste | O que verifica |
|---|-------|----------------|
| 1 | Usuários ativos | Métrica de atividade |
| 2 | Taxa de crescimento | Cálculo e cores corretas |
| 3 | Gráfico temporal | Canvas/SVG visível |
| 4 | Alternância de período | 7d, 30d, 90d |
| 5 | Gráfico de pizza | Distribuição de roles |
| 6 | Top 5 tenants | Ranking de mais ativos |
| 7 | Uso por feature | Métricas de funcionalidades |
| 8 | Tempo médio de sessão | Formato e valor |
| 9 | Taxa de retenção | Porcentagem |
| 10 | Alertas em tempo real | Card atualizado |
| 11 | Atualização ao trocar aba | Re-renderização |
| 12 | Loading state | Spinner durante carregamento |
| 13 | Tooltip com detalhes | Hover sobre métricas |
| 14 | Formatação de números | 1.5K, 2M |
| 15 | Indicadores de tendência | Setas subindo/descendo |
| 16 | Comparação de períodos | "vs. período anterior" |

---

## 🔍 Detalhes de Configuração

### Navegadores Testados

```typescript
// playwright.config.ts
projects: [
  {
    name: 'chromium',           // Desktop Chrome
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'Mobile Chrome',      // Pixel 5
    use: { ...devices['Pixel 5'] },
  },
  {
    name: 'Mobile Safari',      // iPhone 12
    use: { ...devices['iPhone 12'] },
  },
]
```

### Timeouts

- **Teste**: 60 segundos
- **Navegação**: 30 segundos
- **Ação**: 15 segundos
- **Expect**: 10 segundos

### Retry e Workers

- **CI**: 2 retries, 1 worker
- **Local**: 0 retries, workers = CPUs

### Captura de Evidências

- **Screenshot**: Apenas em falhas
- **Vídeo**: Apenas em falhas
- **Trace**: Primeira tentativa com retry

---

## 🐛 Troubleshooting

### Problema: Testes falhando por timeout

**Solução**:

```bash
# Aumentar timeout no playwright.config.ts
timeout: 120 * 1000,  // 2 minutos
```

### Problema: Servidor de desenvolvimento não inicia

**Solução**:

```bash
# Executar servidor manualmente antes dos testes
npm run dev

# Em outro terminal
npm test -- --grep-invert "@requires-server"
```

### Problema: Autenticação não funciona

**Solução**:

Verificar se o Firebase API Key está correto no `e2e/fixtures/auth.ts`:

```typescript
localStorage.setItem(
  'firebase:authUser:AIzaSyB8QEhZF3jqKvJQxJ9kZ9vXWJ6hKzJ2Q3M:[DEFAULT]',
  JSON.stringify(mockUser)
);
```

### Problema: Testes passam localmente, mas falham no CI

**Solução**:

```bash
# Executar testes em modo CI localmente
CI=true npm test

# Verificar logs de erro
npm run test:report
```

### Problema: Navegador não encontrado

**Solução**:

```bash
# Reinstalar navegadores
npx playwright install --with-deps chromium
```

---

## 🚀 CI/CD

### GitHub Actions

Exemplo de workflow:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm test

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### GitLab CI

```yaml
e2e-tests:
  image: mcr.microsoft.com/playwright:v1.57.0-jammy
  stage: test
  script:
    - npm ci
    - npm test
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 1 week
```

---

## 📊 Relatórios

### Formato HTML

Após executar os testes, um relatório HTML é gerado automaticamente:

```bash
# Ver relatório
npm run test:report
```

O relatório inclui:

- ✅ Status de cada teste (Pass/Fail)
- 📸 Screenshots de falhas
- 🎥 Vídeos de falhas
- 🕵️ Traces para debugging
- ⏱️ Tempo de execução
- 📊 Estatísticas gerais

### Formato JSON

Para integração com outras ferramentas:

```bash
# Relatório JSON está em
cat test-results.json
```

---

## 🎯 Boas Práticas

### 1. Execute testes localmente antes de commitar

```bash
npm test
```

### 2. Use o modo UI para desenvolver novos testes

```bash
npm run test:ui
```

### 3. Mantenha os testes independentes

Cada teste deve funcionar isoladamente, sem dependências de outros testes.

### 4. Use seletores resilientes

```typescript
// ✅ Bom
await page.locator('button:has-text("Salvar")').click();

// ❌ Evitar
await page.locator('.btn-123').click();
```

### 5. Aguarde elementos antes de interagir

```typescript
// ✅ Bom
await expect(page.locator('text=Admin')).toBeVisible();
await page.click('button:has-text("Editar")');

// ❌ Evitar
await page.click('button:has-text("Editar")'); // Pode não estar visível ainda
```

---

## 📝 Adicionando Novos Testes

### Passo a Passo

1. **Criar novo arquivo spec**:

```bash
touch e2e/admin/06-meu-teste.spec.ts
```

2. **Importar fixture de autenticação**:

```typescript
import { test, expect } from '../fixtures/auth';
```

3. **Escrever testes**:

```typescript
test.describe('Minha Nova Feature', () => {
  test.beforeEach(async ({ adminPage }) => {
    // Setup
  });

  test('deve fazer algo', async ({ adminPage }) => {
    // Teste
    await expect(adminPage.locator('text=Algo')).toBeVisible();
  });
});
```

4. **Executar o teste**:

```bash
npm run test:ui
```

---

## 🔗 Links Úteis

- [Documentação Playwright](https://playwright.dev/)
- [Guia de Best Practices](https://playwright.dev/docs/best-practices)
- [Seletores do Playwright](https://playwright.dev/docs/selectors)
- [Debugging no Playwright](https://playwright.dev/docs/debug)

---

## 📞 Suporte

Se encontrar problemas:

1. Verificar o [Troubleshooting](#troubleshooting)
2. Consultar o relatório HTML com `npm run test:report`
3. Executar em modo debug com `npm run test:debug`
4. Abrir issue no repositório

---

**Última atualização**: Dezembro 2024
**Versão do Playwright**: 1.57.0
**Cobertura**: 58 testes automatizados
