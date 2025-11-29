# investigaree - Documentacao Tecnica

## Visao Geral

**investigaree** e uma plataforma SaaS de Due Diligence Digital e Investigacao Forense. Permite verificacao de integridade de pessoas e empresas atraves de cruzamento de dados de multiplas fontes publicas brasileiras.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                       │
│                     Next.js 16 + React 19                               │
│                     Cloudflare Pages                                     │
│                   investigaree.com.br                                    │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            BACKEND                                       │
│                    Cloudflare Workers + Hono                            │
│                   api.investigaree.com.br                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │    Auth     │  │   Tenant    │  │   Admin     │  │  Consultas  │   │
│  │   Routes    │  │    Data     │  │   Routes    │  │   Publicas  │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│       D1        │  │       R2        │  │       KV        │
│    (SQLite)     │  │    (Storage)    │  │  (Rate Limit)   │
│   Cloudflare    │  │   Cloudflare    │  │   Cloudflare    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Stack Tecnologico

### Frontend
| Tecnologia | Versao | Uso |
|------------|--------|-----|
| Next.js | 16.0.3 | Framework React |
| React | 19.2.0 | UI Library |
| TypeScript | 5.x | Tipagem |
| Tailwind CSS | 4.x | Estilizacao |
| Framer Motion | 12.x | Animacoes |
| Firebase Auth | 12.x | Autenticacao |
| Shadcn UI | - | Componentes |

### Backend
| Tecnologia | Versao | Uso |
|------------|--------|-----|
| Cloudflare Workers | - | Runtime |
| Hono | 4.6.0 | Web Framework |
| D1 | - | Banco SQLite |
| R2 | - | Object Storage |
| KV | - | Cache/Rate Limit |
| Zod | 3.23.0 | Validacao |

### Servicos Externos
| Servico | Uso |
|---------|-----|
| Firebase Auth | Autenticacao de usuarios |
| Stripe | Pagamentos |
| Resend | Email transacional |
| OpenAI | Analise de dados |
| Brasil API | Consultas publicas |
| Infosimples | CPF/CNPJ/Processos |
| Portal Transparencia | Servidores/Sancoes |

## Estrutura de Diretorios

```
investigaree/
├── investigaree/              # Frontend Next.js
│   ├── src/
│   │   ├── app/              # App Router (paginas)
│   │   │   ├── dashboard/    # Area logada
│   │   │   └── ...          # Paginas publicas
│   │   ├── components/       # Componentes React
│   │   ├── contexts/         # Context API
│   │   ├── hooks/            # Custom Hooks
│   │   └── lib/              # Utilitarios
│   └── public/               # Assets estaticos
│
├── workers/                   # Backend Cloudflare
│   ├── api/                  # Endpoints da API
│   │   ├── auth.ts          # Autenticacao
│   │   ├── admin.ts         # Gerenciamento
│   │   ├── tenant-data.ts   # Dados multi-tenant
│   │   └── ...              # Outros endpoints
│   ├── middleware/           # Middlewares
│   ├── services/             # Servicos externos
│   ├── migrations/           # SQL migrations
│   └── index.ts              # Entry point
│
├── clientes/                  # Dados de clientes
│   └── CLIENTE_01/           # COMURG
│       ├── scripts/          # Scripts de processamento
│       └── dados-*/          # Dados brutos
│
├── docs/                      # Documentacao
│   ├── README.md             # Este arquivo
│   ├── API.md                # Documentacao da API
│   └── MULTI-TENANT.md       # Sistema multi-tenant
│
└── wrangler.toml              # Config Cloudflare
```

## Banco de Dados

### Tabelas Principais

#### users
Usuarios do sistema (sincronizado com Firebase).

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    firebase_uid TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    created_at TEXT,
    updated_at TEXT
);
```

#### tenants
Clientes/organizacoes do sistema.

```sql
CREATE TABLE tenants (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,     -- 'CLIENTE_01'
    name TEXT NOT NULL,            -- 'COMURG'
    email TEXT,
    status TEXT DEFAULT 'active',
    config TEXT,                   -- JSON
    created_at TEXT,
    updated_at TEXT
);
```

#### user_tenants
Associacao usuarios-tenants (controle de acesso).

```sql
CREATE TABLE user_tenants (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    role TEXT DEFAULT 'viewer',    -- admin, editor, viewer
    granted_by TEXT,
    expires_at TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT,
    UNIQUE(user_id, tenant_id)
);
```

#### tenant_funcionarios
Funcionarios de cada tenant.

```sql
CREATE TABLE tenant_funcionarios (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    cadastro TEXT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL,
    grupo TEXT NOT NULL,
    cargo TEXT,
    salario REAL,
    -- Flags de verificacao
    esta_vivo TEXT,
    esta_morto TEXT,
    ano_obito INTEGER,
    recebe_beneficio INTEGER,
    socio_empresa INTEGER,
    doador_campanha INTEGER,
    candidato INTEGER,
    sancionado_ceis INTEGER,
    -- ...
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
```

### Tabelas de Dados Relacionados

- `tenant_candidaturas` - Candidaturas TSE
- `tenant_doacoes` - Doacoes de campanha
- `tenant_vinculos` - Vinculos empresariais
- `tenant_sancoes` - Sancoes CEIS/CNEP
- `tenant_obitos` - Obitos verificados
- `tenant_beneficios` - Beneficios sociais

## Autenticacao

### Fluxo de Login

```
1. Usuario entra email/senha no frontend
2. Firebase Auth valida credenciais
3. Firebase retorna ID Token (JWT)
4. Frontend armazena token em memoria
5. Requisicoes incluem header: Authorization: Bearer <token>
6. Backend valida token com Firebase REST API
7. Backend busca usuario no D1 e verifica permissoes
```

### Middleware de Auth

```typescript
// workers/middleware/auth.ts
export async function authMiddleware(c, next) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');

  // Validar com Firebase
  const decoded = await verifyFirebaseToken(token, c.env);

  if (!decoded) {
    return c.json({ error: 'Token invalido' }, 401);
  }

  // Adicionar ao contexto
  c.set('firebaseUid', decoded.uid);
  c.set('userEmail', decoded.email);

  await next();
}
```

## Sistema Multi-Tenant

Ver documentacao completa em [MULTI-TENANT.md](./MULTI-TENANT.md).

### Resumo

- Usuarios sao associados a tenants via `user_tenants`
- Cada requisicao verifica permissao do usuario
- Dados sao filtrados por `tenant_id`
- Novos usuarios sem associacao veem tela de "Aguardando"
- Admin pode conceder/revogar acessos via API

## Desenvolvimento Local

### Pre-requisitos

- Node.js 18+
- npm ou pnpm
- Wrangler CLI (`npm i -g wrangler`)
- Conta Cloudflare

### Setup

```bash
# 1. Clonar repositorio
git clone <repo>
cd investigaree

# 2. Instalar dependencias
npm install
cd investigaree && npm install
cd ../workers && npm install

# 3. Configurar variaveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas chaves

# 4. Criar banco D1 local
wrangler d1 create investigaree-db

# 5. Rodar migrations
wrangler d1 execute investigaree-db --local --file=workers/migrations/004_tenant_data.sql
wrangler d1 execute investigaree-db --local --file=workers/migrations/005_user_tenants.sql

# 6. Iniciar desenvolvimento
npm run dev          # Frontend (porta 3000)
wrangler dev         # Backend (porta 8787)
```

### Variaveis de Ambiente

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# API
NEXT_PUBLIC_API_URL=http://localhost:8787

# Secrets (wrangler secret put)
FIREBASE_WEB_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
OPENAI_API_KEY=
```

## Deploy

### Frontend (Cloudflare Pages)

```bash
cd investigaree
npm run build
# Deploy via Cloudflare Dashboard ou CLI
```

### Backend (Cloudflare Workers)

```bash
# Configurar secrets
wrangler secret put FIREBASE_WEB_API_KEY
wrangler secret put STRIPE_SECRET_KEY
# ... outros secrets

# Rodar migrations em producao
wrangler d1 execute investigaree-db --file=workers/migrations/005_user_tenants.sql

# Deploy
wrangler deploy
```

### CI/CD (GitHub Actions)

Os workflows estao em `.github/workflows/`:
- `deploy.yml` - Deploy do frontend
- `deploy-api.yml` - Deploy do backend

## Testes

```bash
# Frontend
cd investigaree
npm run test        # Jest
npm run test:e2e    # Playwright (se configurado)

# Backend
cd workers
npm run test        # Vitest
```

## Monitoramento

- **Logs**: `wrangler tail` para logs em tempo real
- **Metricas**: Cloudflare Dashboard
- **Erros**: Sentry (configurar em producao)

## Seguranca

### Boas Praticas Implementadas

1. **Autenticacao**: Firebase Auth com validacao de token
2. **Autorizacao**: Verificacao de tenant em cada requisicao
3. **Rate Limiting**: KV-based por IP
4. **CORS**: Configurado para dominios especificos
5. **Validacao**: Zod em todos os inputs
6. **Audit Logs**: Registro de acessos (LGPD)
7. **Secrets**: Armazenados no Cloudflare

### Headers de Seguranca

```typescript
// Configurados no Cloudflare Pages
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## Contribuicao

1. Criar branch: `git checkout -b feature/nome`
2. Fazer commits: `git commit -m "feat: descricao"`
3. Push: `git push origin feature/nome`
4. Abrir Pull Request

### Convencoes de Commit

- `feat:` Nova funcionalidade
- `fix:` Correcao de bug
- `docs:` Documentacao
- `refactor:` Refatoracao
- `test:` Testes
- `chore:` Manutencao

## Suporte

- Email: contato@investigaree.com.br
- Issues: GitHub Issues
