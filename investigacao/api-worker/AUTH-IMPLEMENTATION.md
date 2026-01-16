# Implementação de Autenticação e Autorização - API Worker

## Visão Geral

Sistema completo de autenticação Firebase JWT com validação de assinatura, multi-tenancy e RBAC (Role-Based Access Control).

## Componentes

### 1. Validação JWT Firebase (`src/auth.ts`)

#### Recursos Implementados

- ✅ **Validação completa de assinatura JWT**
  - Busca chaves públicas do Google (cache de 1 hora)
  - Verifica assinatura usando Web Crypto API
  - Compatível com Cloudflare Workers (sem Firebase Admin SDK)

- ✅ **Verificações de segurança**
  - Expiração do token (`exp`)
  - Token não pode ser do futuro (`iat`)
  - Formato correto (3 partes)
  - Assinatura válida com chaves públicas do Google

- ✅ **Auto-provisioning de usuários**
  - Cria usuário automaticamente no primeiro login
  - Atribui tenant padrão e role 'viewer'

- ✅ **Busca de dados do usuário no D1**
  - `firebase_uid` → `user_id`, `tenant_id`, `role`

#### Fluxo de Autenticação

```typescript
Request com Authorization: Bearer <token>
          ↓
extractBearerToken() → Extrai token do header
          ↓
verifyFirebaseToken() → Valida assinatura e claims
          ↓
getUserFromDatabase() → Busca tenant_id e role no D1
          ↓
setTenantContext() → Prepara contexto RLS (placeholder)
          ↓
Retorna AuthContext { uid, email, tenantId, role, userId }
```

### 2. Tipos TypeScript (`src/types.ts`)

```typescript
interface DecodedToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
  exp: number;
  iat: number;
}

interface AuthContext {
  uid: string;           // Firebase UID
  email: string;         // Email do usuário
  tenantId: string;      // ID do tenant (multi-tenancy)
  role: 'admin' | 'editor' | 'viewer'; // RBAC role
  userId: string;        // ID na tabela users
}
```

### 3. Database Helpers (`src/db-helpers.ts`)

Funções auxiliares para queries que respeitam isolamento de tenant:

#### `queryWithTenant<T>(env, authContext, sql, params)`

Adiciona filtro `tenant_id` automaticamente em queries SELECT:

```typescript
// Antes
const investigations = await env.DB.prepare(
  'SELECT * FROM investigations WHERE status = ?'
).bind('active').all();

// Depois (com isolamento automático)
const investigations = await queryWithTenant(
  env,
  authContext,
  'SELECT * FROM investigations WHERE status = ?',
  ['active']
);
// Equivale a: SELECT * FROM investigations WHERE tenant_id = ? AND status = ?
```

#### `insertWithTenant(env, authContext, table, data)`

Adiciona `tenant_id` automaticamente em INSERTs:

```typescript
await insertWithTenant(env, authContext, 'investigations', {
  id: crypto.randomUUID(),
  cpf: '12345678900',
  status: 'pending'
});
// Insere com tenant_id automaticamente
```

#### `updateWithTenant(env, authContext, table, id, data)`

Valida tenant_id em UPDATEs (previne cross-tenant updates):

```typescript
const updated = await updateWithTenant(
  env,
  authContext,
  'investigations',
  investigationId,
  { status: 'completed' }
);
// UPDATE investigations SET status = ? WHERE tenant_id = ? AND id = ?
```

#### `deleteWithTenant(env, authContext, table, id)`

Valida tenant_id em DELETEs:

```typescript
const deleted = await deleteWithTenant(
  env,
  authContext,
  'investigations',
  investigationId
);
```

#### `hasPermission(authContext, requiredRole)`

Verifica permissão baseado em hierarquia de roles:

```typescript
if (hasPermission(authContext, 'editor')) {
  // Usuário é editor ou admin
}
```

Hierarquia: `admin` (3) > `editor` (2) > `viewer` (1)

#### `requirePermission(authContext, requiredRole)`

Middleware para validar permissão e retornar 403 se não autorizado:

```typescript
const permissionError = requirePermission(authContext, 'admin');
if (permissionError) return permissionError;

// Apenas admins chegam aqui
```

### 4. Integração no Worker (`src/index.ts`)

#### Rotas Públicas (sem autenticação)

- `GET /health` - Health check
- `GET /api/cache/stats` - Estatísticas de cache

#### Rotas com API Key

- `POST /v1/investigations/cpf` - Public REST API
- `POST /v1/investigations/cnpj` - Public REST API
- `GET /v1/investigations/:id` - Public REST API

#### Rotas Autenticadas (JWT)

Todas as outras rotas (`/api/*`) requerem autenticação:

```typescript
// Em index.ts (linha 294)
const authResult = await authenticate(request, env);

if (authResult instanceof Response) {
  // Auth falhou, retornar erro 401
  return authResult;
}

const user = authResult; // AuthContext com tenantId e role

// Rate limiting por userId
const rateLimitResult = await checkRateLimit(env, 'global', user.userId);

// Usar user.tenantId e user.role para autorização
```

## Row Level Security (RLS)

### Status Atual

⚠️ **D1 não suporta session variables como PostgreSQL**

As migrations SQL em `migrations/013_row_level_security.sql` foram criadas para preparar o schema para RLS quando D1 suportar.

### Implementação Atual (Workaround)

1. **Filtros manuais por tenant_id** em todas as queries
2. **Helpers automatizados** (`queryWithTenant`, `insertWithTenant`, etc)
3. **Validação no código** antes de operações sensíveis

### Migração Futura

Quando D1 suportar session variables:

```sql
-- Definir contexto (uma vez por request)
SET app.current_tenant_id = 'tenant-123';
SET app.current_user_id = 'user-456';
SET app.user_role = 'editor';

-- RLS policies aplicarão automaticamente
SELECT * FROM investigations; -- Retorna só do tenant-123
```

## Segurança

### Validação de Assinatura JWT

✅ **Assinatura verificada com chaves públicas do Google**

- Busca de `https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`
- Cache de 1 hora (chaves rotacionam raramente)
- Web Crypto API para verificação (nativo do Workers)

### Proteções Implementadas

- ✅ Token expirado → 401 Unauthorized
- ✅ Assinatura inválida → 401 Unauthorized
- ✅ Token mal-formado → 401 Unauthorized
- ✅ Usuário não encontrado → 403 Forbidden (após criar auto-provisioning)
- ✅ Cross-tenant access → Bloqueado pelos helpers

### Proteções Faltantes

- ⚠️ Validação de `aud` (audience) - TODO
- ⚠️ Validação de `iss` (issuer) - TODO
- ⚠️ Token revogado (Firebase Revocation Check) - TODO

## TODOs

### Curto Prazo

- [ ] Adicionar validação de `aud` (Firebase Project ID)
- [ ] Adicionar validação de `iss` (issuer)
- [ ] Melhorar lógica de auto-provisioning (tenant assignment)
- [ ] Adicionar audit log para criação automática de usuários

### Médio Prazo

- [ ] Implementar token revocation check (Firebase)
- [ ] Adicionar refresh token handling
- [ ] Cache de AuthContext (evitar DB lookup em toda request)

### Longo Prazo

- [ ] Migrar para RLS nativo quando D1 suportar
- [ ] Implementar rate limiting por tenant
- [ ] Adicionar IP whitelisting por tenant

## Exemplos de Uso

### Handler Protegido (Qualquer Role)

```typescript
export async function handleGetInvestigations(
  request: Request,
  env: Env,
  authContext: AuthContext
): Promise<Response> {
  // Buscar apenas investigações do tenant do usuário
  const investigations = await queryWithTenant(
    env,
    authContext,
    'SELECT * FROM investigations WHERE status = ?',
    ['active']
  );

  return new Response(JSON.stringify(investigations), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Handler com Permissão Específica

```typescript
export async function handleDeleteInvestigation(
  request: Request,
  env: Env,
  authContext: AuthContext,
  investigationId: string
): Promise<Response> {
  // Apenas admins podem deletar
  const permissionError = requirePermission(authContext, 'admin');
  if (permissionError) return permissionError;

  // Deletar (já valida tenant_id)
  const deleted = await deleteWithTenant(
    env,
    authContext,
    'investigations',
    investigationId
  );

  if (!deleted) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Handler com Validação Custom

```typescript
export async function handleUpdateInvestigation(
  request: Request,
  env: Env,
  authContext: AuthContext,
  investigationId: string
): Promise<Response> {
  // Editors e admins podem editar
  const permissionError = requirePermission(authContext, 'editor');
  if (permissionError) return permissionError;

  const body = await request.json();

  // Atualizar (já valida tenant_id)
  const updated = await updateWithTenant(
    env,
    authContext,
    'investigations',
    investigationId,
    body
  );

  return new Response(JSON.stringify({ success: updated }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

## Testes

### Testar Localmente

```bash
cd api-worker
wrangler dev

# Em outro terminal
curl -H "Authorization: Bearer <firebase-token>" \
  http://localhost:8787/api/alerts
```

### Testar em Produção

```bash
curl -H "Authorization: Bearer <firebase-token>" \
  https://api.investigaree.com.br/api/alerts
```

## Referências

- [Firebase Auth JWT Structure](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
- [Google Public Keys](https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [D1 Database](https://developers.cloudflare.com/d1/)
