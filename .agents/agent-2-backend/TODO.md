# 🎯 ROTEIRO AGENT 2 - BACKEND ENGINEER

**Agent ID:** Agent 2
**Role:** Backend Engineer (SERPRO APIs, Cloudflare Workers, D1 Database)
**Workspace:** `.agents/agent-2-backend/`
**Responsabilidade:** Integração de APIs, Backend API, Database

---

## 📋 OBJETIVOS PRINCIPAIS

1. ✅ Implementar 3 APIs SERPRO core (CPF, CNPJ, Dívida Ativa)
2. ✅ Criar Cloudflare Workers API backend
3. ✅ Setup D1 Database com schema completo
4. ✅ Implementar autenticação e middleware
5. ✅ Implementar 6 APIs SERPRO restantes
6. ✅ Sistema de cache e rate limiting

---

## 🚀 SEMANA 1 - FUNDAÇÃO BACKEND

### DIA 1 - ARQUITETURA & SETUP (6-8 horas)

#### ✅ TAREFA 2.1: Criar Estrutura de Diretórios Backend

**Objetivo:** Setup inicial do projeto backend

**Criar estrutura:**
```
C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\backend\
├── workers\
│   ├── api\
│   │   ├── src\
│   │   │   ├── index.ts              # Entry point
│   │   │   ├── router.ts             # Route handler
│   │   │   ├── middleware\
│   │   │   │   ├── auth.ts           # Firebase Auth validation
│   │   │   │   ├── cors.ts           # CORS configuration
│   │   │   │   └── rateLimit.ts      # Rate limiting
│   │   │   ├── controllers\
│   │   │   │   ├── admin.controller.ts
│   │   │   │   └── serpro.controller.ts
│   │   │   ├── services\
│   │   │   │   └── serpro\
│   │   │   │       ├── cpf.service.ts
│   │   │   │       ├── cnpj.service.ts
│   │   │   │       ├── divida-ativa.service.ts
│   │   │   │       ├── renda.service.ts
│   │   │   │       ├── faturamento.service.ts
│   │   │   │       ├── datavalid.service.ts
│   │   │   │       ├── cnd.service.ts
│   │   │   │       ├── integra-contador.service.ts
│   │   │   │       └── raiz-tech.service.ts
│   │   │   ├── types\
│   │   │   │   ├── serpro.types.ts
│   │   │   │   ├── database.types.ts
│   │   │   │   └── api.types.ts
│   │   │   └── utils\
│   │   │       ├── errors.ts
│   │   │       └── logger.ts
│   │   ├── wrangler.toml
│   │   └── package.json
│   └── database\
│       ├── schema.sql
│       ├── migrations\
│       │   └── 001_initial.sql
│       └── seeds\
│           └── initial_data.sql
└── .env.backend
```

**Checklist:**
- [ ] Criar diretórios acima
- [ ] Inicializar package.json: `npm init -y`
- [ ] Instalar dependências:
  ```bash
  npm install hono @hono/zod-validator zod
  npm install -D wrangler @cloudflare/workers-types typescript
  ```
- [ ] Criar tsconfig.json
- [ ] Commit: `[A2] Initialize backend project structure`
- [ ] Atualizar STATUS.md

**Validação:**
```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\backend\workers\api
npm install
npx wrangler init
```

---

#### ✅ TAREFA 2.2: Configurar D1 Database

**Objetivo:** Criar e migrar database schema

**Arquivo:** `backend/workers/database/schema.sql`

**Schema completo:**
```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- Firebase UID
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'viewer',       -- admin, editor, viewer
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tenants table
CREATE TABLE tenants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',     -- active, inactive, suspended
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User-Tenant access mapping
CREATE TABLE user_tenants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  tenant_code TEXT NOT NULL,
  access_level TEXT DEFAULT 'viewer', -- admin, editor, viewer
  granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  granted_by TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tenant_code) REFERENCES tenants(tenant_code),
  UNIQUE(user_id, tenant_code)
);

-- Alerts table
CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,               -- system, security, usage, update
  severity TEXT NOT NULL,           -- info, warning, error, critical
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,           -- 0 = unread, 1 = read
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME
);

-- Audit logs table
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,             -- create, update, delete, grant, revoke, query
  entity_type TEXT NOT NULL,        -- user, tenant, alert, serpro_query
  entity_id TEXT,
  metadata TEXT,                    -- JSON string with details
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- SERPRO API usage logs
CREATE TABLE serpro_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  tenant_code TEXT NOT NULL,
  api_name TEXT NOT NULL,           -- cpf, cnpj, divida_ativa, etc.
  document TEXT NOT NULL,           -- CPF/CNPJ consultado
  cost REAL NOT NULL,               -- Custo em R$
  response_status INTEGER,          -- HTTP status
  response_time_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tenant_code) REFERENCES tenants(tenant_code)
);

-- Indexes for performance
CREATE INDEX idx_user_tenants_user ON user_tenants(user_id);
CREATE INDEX idx_user_tenants_tenant ON user_tenants(tenant_code);
CREATE INDEX idx_alerts_read ON alerts(read, created_at);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at);
CREATE INDEX idx_serpro_usage_tenant ON serpro_usage(tenant_code, created_at);
CREATE INDEX idx_serpro_usage_api ON serpro_usage(api_name, created_at);
```

**Comandos:**
```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\backend\workers\api

# Criar database
npx wrangler d1 create investigaree-db

# Copiar ID do output e adicionar em wrangler.toml:
# [[d1_databases]]
# binding = "DB"
# database_name = "investigaree-db"
# database_id = "xxx-xxx-xxx"

# Executar migration
npx wrangler d1 execute investigaree-db --file=../database/schema.sql --local

# Em produção:
npx wrangler d1 execute investigaree-db --file=../database/schema.sql --remote
```

**Checklist:**
- [ ] Escrever schema.sql
- [ ] Criar database local
- [ ] Criar database remoto
- [ ] Executar migrations local
- [ ] Executar migrations remoto
- [ ] Inserir dados iniciais (seeds)
- [ ] Commit: `[A2] Setup D1 database with schema`
- [ ] Atualizar STATUS.md

---

### DIA 2 - INTEGRAÇÃO SERPRO CORE (8-10 horas)

#### ✅ TAREFA 2.3: Implementar SERPRO Client Base

**Objetivo:** Classe base para todas as APIs SERPRO

**Arquivo:** `backend/workers/api/src/services/serpro/base.service.ts`

```typescript
import { Env } from '../../types/api.types';

export abstract class SerproBaseService {
  protected env: Env;
  protected apiName: string;
  protected baseUrl: string;

  constructor(env: Env, apiName: string, baseUrl: string) {
    this.env = env;
    this.apiName = apiName;
    this.baseUrl = baseUrl;
  }

  protected async getToken(): Promise<string> {
    const consumerKey = this.env[`SERPRO_${this.apiName.toUpperCase()}_CONSUMER_KEY`];
    const consumerSecret = this.env[`SERPRO_${this.apiName.toUpperCase()}_CONSUMER_SECRET`];

    if (!consumerKey || !consumerSecret) {
      throw new Error(`SERPRO ${this.apiName} credentials not configured`);
    }

    // Implementar OAuth2 token request
    const tokenUrl = `${this.baseUrl}/token`;
    const credentials = btoa(`${consumerKey}:${consumerSecret}`);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get SERPRO token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`SERPRO API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  protected async logUsage(
    userId: string,
    tenantCode: string,
    document: string,
    cost: number,
    status: number,
    responseTime: number
  ): Promise<void> {
    await this.env.DB.prepare(`
      INSERT INTO serpro_usage (user_id, tenant_code, api_name, document, cost, response_status, response_time_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(userId, tenantCode, this.apiName, document, cost, status, responseTime).run();
  }
}
```

**Checklist:**
- [ ] Criar base.service.ts
- [ ] Implementar getToken() com OAuth2
- [ ] Implementar makeRequest() genérico
- [ ] Implementar logUsage() para tracking
- [ ] Criar types em serpro.types.ts
- [ ] Commit: `[A2] Create SERPRO base service class`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 2.4: Implementar API CPF (3-4 horas)

**Objetivo:** Primeira integração SERPRO completa

**Arquivo:** `backend/workers/api/src/services/serpro/cpf.service.ts`

```typescript
import { SerproBaseService } from './base.service';
import { CpfResponse } from '../../types/serpro.types';

export class CpfService extends SerproBaseService {
  constructor(env: Env) {
    super(env, 'cpf', 'https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2');
  }

  async consultarCpf(cpf: string, userId: string, tenantCode: string): Promise<CpfResponse> {
    const startTime = Date.now();
    const cpfClean = cpf.replace(/\D/g, '');

    try {
      const response = await this.makeRequest<CpfResponse>(`/cpf/${cpfClean}`);
      const responseTime = Date.now() - startTime;

      // Log usage (R$ 0.6591 por consulta - tier 1)
      await this.logUsage(userId, tenantCode, cpfClean, 0.6591, 200, responseTime);

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      await this.logUsage(userId, tenantCode, cpfClean, 0, 500, responseTime);
      throw error;
    }
  }
}
```

**Arquivo:** `backend/workers/api/src/types/serpro.types.ts`

```typescript
export interface CpfResponse {
  ni: string;                    // CPF
  nome: string;                  // Nome completo
  situacao: {
    codigo: string;              // 0=Regular, 2=Suspensa, etc
    descricao: string;
  };
  nascimento: string;            // DD/MM/YYYY
  timestamp?: string;            // Carimbo de tempo (se contratado)
}

export interface CnpjResponse {
  ni: string;                    // CNPJ
  razaoSocial: string;
  nomeFantasia: string;
  situacaoCadastral: {
    codigo: string;
    data: string;
    motivo: string;
  };
  naturezaJuridica: {
    codigo: string;
    descricao: string;
  };
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
  };
  qsa?: Array<{                  // Quadro de sócios (se endpoint empresa)
    nome: string;
    cpf: string;                 // Desmascarado apenas no endpoint /empresa
    qualificacao: string;
  }>;
  timestamp?: string;
}

// Adicionar outros tipos conforme implementa APIs
```

**Checklist:**
- [ ] Criar cpf.service.ts
- [ ] Implementar consultarCpf()
- [ ] Validar CPF (regex, dígitos verificadores)
- [ ] Criar types para response
- [ ] Testar localmente: `npx wrangler dev`
- [ ] Commit: `[A2] Implement SERPRO CPF API integration`
- [ ] Atualizar STATUS.md
- [ ] **Postar em COORDINATION.md: API CPF pronta**

---

#### ✅ TAREFA 2.5: Implementar API CNPJ (3-4 horas)

**Arquivo:** `backend/workers/api/src/services/serpro/cnpj.service.ts`

```typescript
export class CnpjService extends SerproBaseService {
  constructor(env: Env) {
    super(env, 'cnpj', 'https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2');
  }

  async consultarCnpjBasica(cnpj: string, userId: string, tenantCode: string): Promise<CnpjResponse> {
    // Endpoint: /basica/{cnpj}
    // Custo: R$ 0.6591
    // CPF mascarado no QSA
  }

  async consultarCnpjQsa(cnpj: string, userId: string, tenantCode: string): Promise<CnpjResponse> {
    // Endpoint: /qsa/{cnpj}
    // Custo: R$ 0.8788
    // CPF mascarado no QSA
  }

  async consultarCnpjEmpresa(cnpj: string, userId: string, tenantCode: string): Promise<CnpjResponse> {
    // Endpoint: /empresa/{cnpj}
    // Custo: R$ 1.1722
    // CPF DESMASCARADO - ideal para investigação
  }
}
```

**Checklist:**
- [ ] Criar cnpj.service.ts
- [ ] Implementar 3 endpoints (basica, qsa, empresa)
- [ ] Validar CNPJ (regex, dígitos verificadores)
- [ ] Criar types para response
- [ ] Testar localmente
- [ ] Commit: `[A2] Implement SERPRO CNPJ API integration (3 endpoints)`
- [ ] Atualizar STATUS.md
- [ ] **Postar em COORDINATION.md: API CNPJ pronta**

---

#### ✅ TAREFA 2.6: Implementar API Dívida Ativa (2-3 horas)

**Arquivo:** `backend/workers/api/src/services/serpro/divida-ativa.service.ts`

```typescript
export class DividaAtivaService extends SerproBaseService {
  constructor(env: Env) {
    super(env, 'divida_ativa', 'https://gateway.apiserpro.serpro.gov.br/consulta-divida-ativa/v1');
  }

  async consultarDivida(ni: string, userId: string, tenantCode: string): Promise<DividaAtivaResponse> {
    // Endpoint: /divida/{ni}
    // ni = CPF ou CNPJ
    // Custo: R$ 0.6591
    // Retorna dívidas junto à PGFN
  }
}
```

**Checklist:**
- [ ] Criar divida-ativa.service.ts
- [ ] Implementar consultarDivida()
- [ ] Criar types para response
- [ ] Testar localmente
- [ ] Commit: `[A2] Implement SERPRO Dívida Ativa API integration`
- [ ] Atualizar STATUS.md
- [ ] **Postar em COORDINATION.md: 3 APIs core completas!**

---

### DIA 3 - API ROUTES & MIDDLEWARE (6-8 horas)

#### ✅ TAREFA 2.7: Criar Router com Hono

**Arquivo:** `backend/workers/api/src/index.ts`

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { serproRoutes } from './routes/serpro.routes';
import { adminRoutes } from './routes/admin.routes';

export interface Env {
  DB: D1Database;
  SERPRO_CPF_CONSUMER_KEY: string;
  SERPRO_CPF_CONSUMER_SECRET: string;
  // ... outras env vars
}

const app = new Hono<{ Bindings: Env }>();

// Middlewares globais
app.use('*', cors({
  origin: ['https://investigaree.com.br', 'http://localhost:3000'],
  credentials: true
}));

// Rotas públicas (health check)
app.get('/health', (c) => c.json({ status: 'ok' }));

// Rotas protegidas
app.use('/api/*', authMiddleware);
app.use('/api/serpro/*', rateLimitMiddleware);

// Routes
app.route('/api/serpro', serproRoutes);
app.route('/api/admin', adminRoutes);

export default app;
```

**Checklist:**
- [ ] Criar index.ts
- [ ] Setup Hono router
- [ ] Configurar CORS
- [ ] Criar rotas modulares
- [ ] Commit: `[A2] Setup Hono router and API structure`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 2.8: Implementar Auth Middleware (3-4 horas)

**Arquivo:** `backend/workers/api/src/middleware/auth.ts`

```typescript
import { Context, Next } from 'hono';
import { Env } from '../types/api.types';

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);

  try {
    // Validar Firebase ID Token
    const user = await verifyFirebaseToken(token);

    // Adicionar user ao context
    c.set('user', user);

    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}

async function verifyFirebaseToken(token: string) {
  // Implementar validação de token Firebase
  // Opção 1: Usar Firebase Admin SDK (requer setup)
  // Opção 2: Validar manualmente com Google's public keys

  const response = await fetch(
    `https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`
  );
  const publicKeys = await response.json();

  // Decodificar e validar JWT
  // ... implementação de validação JWT

  return {
    uid: 'firebase-uid',
    email: 'user@example.com'
  };
}
```

**Checklist:**
- [ ] Criar auth.ts middleware
- [ ] Implementar Firebase token validation
- [ ] Testar com token válido
- [ ] Testar com token inválido
- [ ] Commit: `[A2] Implement Firebase Auth middleware`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 2.9: Implementar Rate Limiting (2-3 horas)

**Arquivo:** `backend/workers/api/src/middleware/rateLimit.ts`

```typescript
import { Context, Next } from 'hono';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function rateLimitMiddleware(c: Context, next: Next) {
  const user = c.get('user');
  const key = `${user.uid}:${Date.now() / 60000 | 0}`; // 1 minuto

  const limit = rateLimitMap.get(key) || { count: 0, resetAt: Date.now() + 60000 };
  limit.count++;

  if (limit.count > 60) { // 60 requests por minuto
    return c.json({ error: 'Rate limit exceeded' }, 429);
  }

  rateLimitMap.set(key, limit);

  await next();
}
```

**Checklist:**
- [ ] Criar rateLimit.ts middleware
- [ ] Implementar contador por usuário
- [ ] Configurar limites (60/min)
- [ ] Testar rate limiting
- [ ] Commit: `[A2] Implement rate limiting middleware`
- [ ] Atualizar STATUS.md

---

### DIA 4-5 - ENDPOINTS & CONTROLLERS (8-10 horas)

#### ✅ TAREFA 2.10: Criar SERPRO Endpoints

**Arquivo:** `backend/workers/api/src/routes/serpro.routes.ts`

```typescript
import { Hono } from 'hono';
import { CpfService } from '../services/serpro/cpf.service';
import { CnpjService } from '../services/serpro/cnpj.service';
import { DividaAtivaService } from '../services/serpro/divida-ativa.service';

const serpro = new Hono();

// CPF
serpro.post('/cpf', async (c) => {
  const { cpf } = await c.req.json();
  const user = c.get('user');
  const tenantCode = c.req.header('X-Tenant-Code');

  const service = new CpfService(c.env);
  const result = await service.consultarCpf(cpf, user.uid, tenantCode);

  return c.json(result);
});

// CNPJ - 3 endpoints
serpro.post('/cnpj/basica', async (c) => { /* ... */ });
serpro.post('/cnpj/qsa', async (c) => { /* ... */ });
serpro.post('/cnpj/empresa', async (c) => { /* ... */ });

// Dívida Ativa
serpro.post('/divida-ativa', async (c) => { /* ... */ });

export { serpro as serproRoutes };
```

**Checklist:**
- [ ] Criar serpro.routes.ts
- [ ] Implementar POST /cpf
- [ ] Implementar POST /cnpj/* (3 endpoints)
- [ ] Implementar POST /divida-ativa
- [ ] Validação de inputs (Zod)
- [ ] Error handling
- [ ] Commit: `[A2] Create SERPRO API endpoints`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 2.11: Criar Admin Endpoints (4-6 horas)

**Arquivo:** `backend/workers/api/src/routes/admin.routes.ts`

```typescript
import { Hono } from 'hono';

const admin = new Hono();

// Users
admin.get('/users', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM users').all();
  return c.json({ users: result.results });
});

admin.post('/users', async (c) => { /* Create user */ });
admin.patch('/users/:id', async (c) => { /* Update user */ });

// Tenants
admin.get('/tenants', async (c) => { /* List tenants */ });
admin.post('/tenants', async (c) => { /* Create tenant */ });
admin.patch('/tenants/:code', async (c) => { /* Update tenant */ });

// Access control
admin.post('/grant-access', async (c) => { /* Grant user access to tenant */ });
admin.delete('/revoke-access', async (c) => { /* Revoke access */ });

// Alerts
admin.get('/alerts', async (c) => { /* List alerts */ });
admin.post('/alerts/:id/read', async (c) => { /* Mark as read */ });

// Audit logs
admin.get('/audit-logs', async (c) => { /* List logs */ });

// Stats
admin.get('/stats', async (c) => { /* Dashboard statistics */ });

export { admin as adminRoutes };
```

**Checklist:**
- [ ] Criar admin.routes.ts
- [ ] Implementar 10 endpoints admin
- [ ] Validação de role (apenas admin)
- [ ] Audit logging em todas as ações
- [ ] Commit: `[A2] Create admin API endpoints`
- [ ] Atualizar STATUS.md
- [ ] **Postar em COORDINATION.md: Backend API completo (core)**

---

## 🚀 SEMANA 2-3 - EXPANSÃO APIS

### ✅ TAREFA 2.12: Implementar 6 APIs SERPRO Restantes (20-30 horas)

**APIs a implementar:**

1. **Consulta Renda** (4-5 horas)
   - Endpoint: /renda/{cpf}
   - Custo: R$ 1.5690 (5 free/month)
   - Arquivo: `renda.service.ts`

2. **Consulta Faturamento** (4-5 horas)
   - Endpoint: /faturamento/{cnpj}
   - Custo: R$ 3.6620 (5 free/month)
   - Arquivo: `faturamento.service.ts`

3. **Datavalid V4** (5-6 horas)
   - Biometria + validação identidade
   - Arquivo: `datavalid.service.ts`

4. **CND** (3-4 horas)
   - Certidão Negativa de Débitos
   - Custo: R$ 0.8788
   - Arquivo: `cnd.service.ts`

5. **Integra Contador** (4-5 horas)
   - 3 endpoints (consulta, declaração, emissão)
   - Custo: R$ 0.24-0.40
   - Arquivo: `integra-contador.service.ts`

6. **Raiz Tech Pastagens** (3-4 horas)
   - Análise agro
   - Custo: R$ 3.50
   - Arquivo: `raiz-tech.service.ts`

**Checklist geral (repetir para cada API):**
- [ ] Ler documentação em `APIs/SERPRO/XX_Nome_API/`
- [ ] Criar service class
- [ ] Implementar métodos de consulta
- [ ] Criar types
- [ ] Adicionar endpoint em routes
- [ ] Testar localmente
- [ ] Commit: `[A2] Implement SERPRO [API_NAME] integration`
- [ ] Atualizar STATUS.md

**Após completar todas:**
- [ ] **Postar em COORDINATION.md: 9 APIs SERPRO 100% integradas!**

---

### ✅ TAREFA 2.13: Sistema de Cache (6-8 horas)

**Objetivo:** Reduzir custos com cache de consultas repetidas

**Estratégia:**
- CPF/CNPJ: Cache 7 dias (dados cadastrais mudam raramente)
- Dívida Ativa: Cache 1 dia (atualizado frequentemente)
- Renda/Faturamento: Cache 30 dias

**Implementação:**

**Arquivo:** `backend/workers/api/src/middleware/cache.ts`

```typescript
export async function cacheMiddleware(c: Context, next: Next) {
  const cacheKey = `${c.req.url}:${JSON.stringify(await c.req.json())}`;

  // Check cache
  const cached = await c.env.CACHE.get(cacheKey);
  if (cached) {
    return c.json(JSON.parse(cached));
  }

  await next();

  // Store in cache
  const response = await c.res.clone().json();
  await c.env.CACHE.put(cacheKey, JSON.stringify(response), {
    expirationTtl: 7 * 24 * 60 * 60 // 7 days
  });
}
```

**Checklist:**
- [ ] Configurar KV namespace no Wrangler
- [ ] Criar cache middleware
- [ ] Aplicar em rotas SERPRO
- [ ] Testar hit/miss de cache
- [ ] Adicionar headers de cache (X-Cache: HIT/MISS)
- [ ] Commit: `[A2] Implement caching system for SERPRO APIs`
- [ ] Atualizar STATUS.md

---

### ✅ TAREFA 2.14: Cost Tracking Dashboard (4-6 horas)

**Objetivo:** Monitorar gastos com APIs SERPRO

**Query examples:**
```sql
-- Custo total por tenant (último mês)
SELECT
  tenant_code,
  SUM(cost) as total_cost,
  COUNT(*) as total_queries
FROM serpro_usage
WHERE created_at >= date('now', '-30 days')
GROUP BY tenant_code;

-- API mais usada
SELECT
  api_name,
  COUNT(*) as queries,
  SUM(cost) as total_cost
FROM serpro_usage
WHERE created_at >= date('now', '-30 days')
GROUP BY api_name
ORDER BY total_cost DESC;

-- Usuários top spenders
SELECT
  u.email,
  COUNT(su.id) as queries,
  SUM(su.cost) as total_cost
FROM serpro_usage su
JOIN users u ON su.user_id = u.id
WHERE su.created_at >= date('now', '-30 days')
GROUP BY u.email
ORDER BY total_cost DESC
LIMIT 10;
```

**Endpoint:** `GET /api/admin/serpro/usage`

**Checklist:**
- [ ] Criar endpoint de usage statistics
- [ ] Queries SQL otimizadas
- [ ] Filtros por data, tenant, API
- [ ] Exportar CSV de usage
- [ ] Commit: `[A2] Add SERPRO cost tracking dashboard`
- [ ] Atualizar STATUS.md

---

## 🚀 SEMANA 4 - POLISH & DEPLOY

### ✅ TAREFA 2.15: Deploy para Produção (4-6 horas)

**Checklist:**
- [ ] Configurar secrets no Cloudflare:
  ```bash
  npx wrangler secret put SERPRO_CPF_CONSUMER_KEY
  npx wrangler secret put SERPRO_CPF_CONSUMER_SECRET
  # ... repetir para todas as 9 APIs
  ```
- [ ] Configurar D1 binding em wrangler.toml
- [ ] Deploy: `npx wrangler deploy`
- [ ] Testar endpoints em produção
- [ ] Configurar custom domain: `api.investigaree.com.br`
- [ ] Commit: `[A2] Deploy backend to production`
- [ ] Atualizar STATUS.md para DONE
- [ ] **Postar em COORDINATION.md: Backend em produção! 🚀**

---

## 📊 MÉTRICAS DE SUCESSO

- [ ] 9 APIs SERPRO integradas e funcionais
- [ ] Response time médio < 500ms
- [ ] 99.9% uptime
- [ ] Cache hit rate > 40%
- [ ] Zero vazamento de credenciais
- [ ] Audit logs para 100% das ações
- [ ] Cost tracking funcionando

---

## 🔗 DEPENDÊNCIAS

**Aguardando de outros agents:**
- Agent 1: Build corrigido (para começar)
- Agent 3: Feedback sobre endpoints (após integração)

**Fornecendo para outros agents:**
- Agent 3: API URL e endpoints (assim que deploy)
- Agent 1: Variáveis de ambiente para CI/CD

---

## 📝 COMUNICAÇÃO

**Atualizar STATUS.md:**
- A cada API implementada
- Quando encontrar blocker
- No mínimo a cada 4 horas

**Postar em COORDINATION.md:**
- Ao completar 3 APIs core (DIA 2)
- Ao completar backend API completo (DIA 5)
- Ao completar 9 APIs SERPRO (SEMANA 2-3)
- Quando backend estiver em produção

---

## 🛠️ FERRAMENTAS & COMANDOS

**Setup:**
```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\backend\workers\api
npm install
```

**Desenvolvimento:**
```bash
npx wrangler dev              # Local development
npx wrangler d1 execute ...   # Database commands
```

**Deploy:**
```bash
npx wrangler deploy
npx wrangler tail             # View logs
```

---

## 📂 ARQUIVOS SOB RESPONSABILIDADE

**Exclusivos (apenas Agent 2):**
- `backend/**/*` (todo diretório backend)
- `investigaree/src/lib/serpro/**/*` (se criar client SDK)

**Coordenados:**
- Nenhum (backend é isolado)

---

**Criado:** 2025-12-07
**Última atualização:** 2025-12-07 15:00
