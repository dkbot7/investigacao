# Sistema Multi-Tenant - investigaree

## Visão Geral

O sistema multi-tenant permite que múltiplos clientes usem a mesma plataforma com isolamento total de dados. Cada cliente (tenant) tem seus próprios funcionários, relatórios e dados de investigação.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUÁRIOS                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Admin    │  │ User A   │  │ User B   │  │ User C   │            │
│  │ (viewer) │  │ (editor) │  │ (viewer) │  │ (sem     │            │
│  │          │  │          │  │          │  │  acesso) │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │             │             │                   │
│       ▼             ▼             ▼             ▼                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    user_tenants                              │   │
│  │  (associa usuários a tenants com roles específicos)         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│       │             │             │             │                   │
│       ▼             ▼             ▼             ✗ (sem registro)   │
│  ┌──────────────────────────────────────┐                          │
│  │           TENANTS                     │                          │
│  │  ┌─────────────┐  ┌─────────────┐    │                          │
│  │  │ CLIENTE_01  │  │ CLIENTE_02  │    │                          │
│  │  │ (COMURG)    │  │ (Futuro)    │    │                          │
│  │  └─────────────┘  └─────────────┘    │                          │
│  └──────────────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

## Tabelas do Banco de Dados

### tenants
Armazena informações dos clientes.

```sql
CREATE TABLE tenants (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,      -- 'CLIENTE_01', 'CLIENTE_02'
    name TEXT NOT NULL,             -- 'COMURG - Companhia de Urbanização...'
    email TEXT UNIQUE NOT NULL,     -- Email de contato do tenant
    firebase_uid TEXT UNIQUE,       -- UID do Firebase (opcional)
    status TEXT DEFAULT 'active',   -- 'active', 'inactive', 'suspended'
    config TEXT,                    -- JSON com configurações
    created_at TEXT,
    updated_at TEXT
);
```

### user_tenants
Associa usuários a tenants com roles específicos.

```sql
CREATE TABLE user_tenants (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,          -- FK para users.id
    tenant_id TEXT NOT NULL,        -- FK para tenants.id
    role TEXT DEFAULT 'viewer',     -- 'admin', 'editor', 'viewer'
    granted_by TEXT,                -- Email de quem concedeu
    granted_at TEXT,
    expires_at TEXT,                -- Expiração do acesso (opcional)
    is_active INTEGER DEFAULT 1,
    created_at TEXT,
    updated_at TEXT,
    UNIQUE(user_id, tenant_id)
);
```

### Roles (Papéis)

| Role | Permissões |
|------|------------|
| `admin` | Acesso total: visualizar, editar, exportar, gerenciar |
| `editor` | Visualizar e editar dados |
| `viewer` | Apenas visualização |

## Fluxo de Autenticação e Autorização

### 1. Criação de Conta

```
Usuário → Firebase Auth → D1 (users) → Aguardando liberação
```

1. Usuário preenche formulário de cadastro
2. Firebase cria conta com email/senha
3. Webhook ou API cria registro em `users` no D1
4. Usuário não tem registro em `user_tenants` → sem acesso

### 2. Liberação de Acesso (Admin)

```
Admin → POST /api/admin/grant-access → user_tenants → Acesso liberado
```

```bash
curl -X POST https://api.investigaree.com.br/api/admin/grant-access \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "novo@usuario.com",
    "tenant_code": "CLIENTE_01",
    "role": "viewer"
  }'
```

### 3. Verificação de Acesso (Frontend)

```typescript
// hooks/useTenant.ts
const { tenant, hasAccess, loading } = useTenant();

if (!hasAccess) {
  return <NoAccessScreen />;
}

// Usuário tem acesso, mostrar dashboard
```

### 4. Verificação de Acesso (API)

```typescript
// workers/api/tenant-data.ts
async function verifyTenantAccess(c) {
  const firebaseUid = c.get('firebaseUid');
  const tenants = await getTenantsByFirebaseUid(firebaseUid, c.env.DB);

  if (tenants.length === 0) {
    return { error: 403, message: 'NO_TENANT_ACCESS' };
  }

  return { tenant: tenants[0] };
}
```

## Endpoints da API

### Tenant Info (Usuário)

```
GET /api/tenant/info
Authorization: Bearer <firebase_token>

Response (com acesso):
{
  "hasAccess": true,
  "tenant": {
    "id": "tenant_cliente_01",
    "code": "CLIENTE_01",
    "name": "COMURG",
    "role": "viewer"
  },
  "tenants": [...]
}

Response (sem acesso):
{
  "hasAccess": false,
  "tenant": null,
  "tenants": [],
  "message": "Aguardando liberação de acesso"
}
```

### Dashboard Data

```
GET /api/tenant/dashboard
GET /api/tenant/funcionarios
GET /api/tenant/obitos
GET /api/tenant/candidatos
GET /api/tenant/doadores
GET /api/tenant/sancionados
GET /api/tenant/vinculos
GET /api/tenant/beneficios
```

### Admin Endpoints

```
GET  /api/admin/users           # Lista todos os usuários
GET  /api/admin/tenants         # Lista todos os tenants
GET  /api/admin/pending-users   # Usuários aguardando liberação
POST /api/admin/tenants         # Criar novo tenant
POST /api/admin/grant-access    # Conceder acesso
DELETE /api/admin/revoke-access # Revogar acesso
```

## Componentes do Frontend

### useTenant Hook

```typescript
import { useTenant } from '@/hooks/useTenant';

function DashboardLayout() {
  const { tenant, hasAccess, loading, error } = useTenant();

  if (loading) return <LoadingSpinner />;
  if (!hasAccess) return <NoAccessScreen />;

  return <Dashboard tenant={tenant} />;
}
```

### NoAccessScreen

Tela exibida quando o usuário está autenticado mas não tem acesso a nenhum tenant.

- Mostra mensagem amigável
- Instruções sobre próximos passos
- Links para contato (WhatsApp, Email)
- Botão de logout

## Migrations

### Ordem de Execução

```bash
# 1. Schema inicial (se não existir)
wrangler d1 execute investigaree-db --file=workers/migrations/004_tenant_data.sql

# 2. Tabela user_tenants
wrangler d1 execute investigaree-db --file=workers/migrations/005_user_tenants.sql

# 3. Seed do admin (após ter usuário admin cadastrado)
wrangler d1 execute investigaree-db --file=workers/migrations/006_seed_admin_access.sql
```

### Associar Admin Manualmente

```sql
-- Encontrar ID do usuário admin
SELECT id, email FROM users WHERE email = 'contato@investigaree.com.br';

-- Associar ao tenant
INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by, is_active)
VALUES (
  lower(hex(randomblob(16))),
  '<user_id>',
  'tenant_cliente_01',
  'admin',
  'system',
  1
);
```

## Desenvolvimento Local

Quando a API não está disponível, o hook `useTenant` usa fallback:

```typescript
// hooks/useTenant.ts
const ADMIN_EMAILS = [
  "contato@investigaree.com.br",
  "admin@investigaree.com.br",
];

// Se API falhar e email está em ADMIN_EMAILS:
// → Retorna mock do CLIENTE_01 com acesso

// Se API falhar e email NÃO está em ADMIN_EMAILS:
// → Retorna hasAccess: false (tela de aguardando)
```

## Checklist de Deploy

- [ ] Executar migration `005_user_tenants.sql`
- [ ] Executar migration `006_seed_admin_access.sql`
- [ ] Deploy do Worker (`wrangler deploy`)
- [ ] Build e deploy do frontend
- [ ] Verificar acesso do admin via `/api/tenant/info`
- [ ] Testar criação de novo usuário (deve ver tela de aguardando)
- [ ] Testar liberação de acesso via `/api/admin/grant-access`

## Troubleshooting

### Usuário admin não tem acesso

```sql
-- Verificar se usuário existe
SELECT * FROM users WHERE email = 'contato@investigaree.com.br';

-- Verificar se tem associação com tenant
SELECT ut.*, t.code
FROM user_tenants ut
JOIN tenants t ON ut.tenant_id = t.id
WHERE ut.user_id = '<user_id>';

-- Se não tiver, criar:
INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by, is_active)
VALUES (lower(hex(randomblob(16))), '<user_id>', 'tenant_cliente_01', 'admin', 'system', 1);
```

### API retorna 403 mesmo com acesso

1. Verificar se `is_active = 1` na associação
2. Verificar se `expires_at` não passou
3. Verificar se tenant tem `status = 'active'`
4. Verificar se o token Firebase está sendo passado corretamente

### Frontend mostra tela de aguardando para admin

1. Verificar console do navegador para erros
2. Verificar se `ADMIN_EMAILS` inclui o email correto
3. Verificar se a API está respondendo em `/api/tenant/info`
