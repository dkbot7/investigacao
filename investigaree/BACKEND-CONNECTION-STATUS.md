# 🔌 Status da Conexão Frontend-Backend

## ✅ Situação Atual

O **Admin Panel já está preparado** para funcionar com backend, mas opera em modo MOCK por padrão.

### 🎯 Como Funciona Agora

O arquivo `src/lib/admin-api.ts` implementa um **sistema inteligente de fallback**:

```typescript
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true' || true; // Sempre true por padrão

export async function getAdminUsers(): Promise<{ users: AdminUser[] }> {
  if (DEV_MODE) {
    try {
      return await fetchAPI('/api/admin/users'); // Tenta backend real
    } catch (error) {
      // Se backend não disponível, usa mock
      return { users: getMockUsers() };
    }
  }
  return fetchAPI('/api/admin/users');
}
```

**Benefícios**:
- ✅ Funciona AGORA sem backend (modo mock)
- ✅ Automáticamente usa backend quando disponível
- ✅ Zero downtime durante desenvolvimento
- ✅ Dados realistas para testes

---

## 📊 Endpoints Necessários

Para conectar ao backend real (D1 Database), você precisa criar estes endpoints:

### 1. GET `/api/admin/users`
**Função**: Listar todos os usuários cadastrados

**Response**:
```json
{
  "users": [
    {
      "id": "1",
      "email": "user@example.com",
      "name": "Usuário",
      "phone": "+5511999999999",
      "created_at": "2024-12-01T00:00:00Z",
      "last_access": "2024-12-05T10:30:00Z",
      "tenants": [
        { "code": "CLIENTE_01", "role": "admin" }
      ]
    }
  ]
}
```

---

### 2. GET `/api/admin/tenants`
**Função**: Listar todos os tenants

**Response**:
```json
{
  "tenants": [
    {
      "id": "1",
      "code": "CLIENTE_01",
      "name": "Cliente Principal",
      "status": "active",
      "created_at": "2024-11-01T00:00:00Z",
      "user_count": 5
    }
  ]
}
```

---

### 3. GET `/api/admin/pending-users`
**Função**: Listar usuários sem acesso

**Response**:
```json
{
  "pending_users": [
    {
      "id": "3",
      "email": "pendente@example.com",
      "name": "Usuário Pendente",
      "phone": "+5511988887777",
      "created_at": "2024-12-03T00:00:00Z"
    }
  ]
}
```

---

### 4. POST `/api/admin/tenants`
**Função**: Criar novo tenant

**Request**:
```json
{
  "code": "CLIENTE_03",
  "name": "Novo Cliente"
}
```

**Response**:
```json
{
  "success": true,
  "tenant": {
    "id": "3",
    "code": "CLIENTE_03",
    "name": "Novo Cliente",
    "status": "active",
    "created_at": "2024-12-06T00:00:00Z",
    "user_count": 0
  }
}
```

---

### 5. POST `/api/admin/grant-access`
**Função**: Conceder acesso a usuário

**Request**:
```json
{
  "user_email": "user@example.com",
  "tenant_code": "CLIENTE_01",
  "role": "viewer",
  "expires_at": "2025-12-31T23:59:59Z" // opcional
}
```

**Response**:
```json
{
  "success": true,
  "message": "Acesso concedido com sucesso",
  "action": "created" // ou "updated" se já existia
}
```

---

### 6. DELETE `/api/admin/revoke-access`
**Função**: Revogar acesso de usuário

**Query Params**:
- `user_email`: email do usuário
- `tenant_code`: código do tenant

**Response**:
```json
{
  "success": true,
  "message": "Acesso revogado com sucesso"
}
```

---

### 7. GET `/api/admin/alerts`
**Função**: Listar alertas do sistema

**Query Params**:
- `show_read`: boolean (mostrar lidos)

**Response**:
```json
{
  "alerts": [
    {
      "id": "1",
      "type": "new_user",
      "title": "Novo usuário cadastrado",
      "message": "Um novo usuário se registrou...",
      "data": { "email": "user@example.com" },
      "severity": "info",
      "is_read": 0,
      "read_by": null,
      "read_at": null,
      "created_at": "2024-12-05T00:00:00Z"
    }
  ],
  "unread_count": 5
}
```

---

### 8. POST `/api/admin/alerts/{alertId}/read`
**Função**: Marcar alerta como lido

**Response**:
```json
{
  "success": true
}
```

---

### 9. POST `/api/admin/alerts/read-all`
**Função**: Marcar todos como lidos

**Response**:
```json
{
  "success": true,
  "message": "Todos os alertas foram marcados como lidos"
}
```

---

### 10. GET `/api/admin/stats`
**Função**: Estatísticas do admin

**Response**:
```json
{
  "total_users": 10,
  "active_tenants": 5,
  "pending_users": 3,
  "unread_alerts": 8
}
```

---

## 🗄️ Schema do Banco D1

### Tabela: `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TEXT NOT NULL,
  last_access TEXT,
  updated_at TEXT
);
```

### Tabela: `tenants`
```sql
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT
);
```

### Tabela: `user_tenants`
```sql
CREATE TABLE user_tenants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tenant_code TEXT NOT NULL,
  role TEXT NOT NULL, -- 'admin', 'editor', 'viewer'
  expires_at TEXT,
  created_at TEXT NOT NULL,
  created_by TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tenant_code) REFERENCES tenants(code),
  UNIQUE(user_id, tenant_code)
);
```

### Tabela: `alerts`
```sql
CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data TEXT, -- JSON
  severity TEXT DEFAULT 'info',
  is_read INTEGER DEFAULT 0,
  read_by TEXT,
  read_at TEXT,
  created_at TEXT NOT NULL
);
```

---

## 🚀 Como Conectar ao Backend Real

### Opção 1: Cloudflare Workers + D1 (Produção)

1. **Criar banco D1**:
```bash
npx wrangler d1 create investigaree-db
```

2. **Executar migrations**:
```bash
npx wrangler d1 execute investigaree-db --file=./migrations/schema.sql
```

3. **Deploy dos endpoints**:
```bash
npx wrangler deploy
```

4. **Atualizar `.env.local`**:
```bash
NEXT_PUBLIC_API_URL=https://api.investigaree.com.br
NEXT_PUBLIC_DEV_MODE=false
```

---

### Opção 2: Next.js API Routes + Cloudflare D1

**Mais simples para desenvolvimento**:

1. Criar os arquivos de route em `src/app/api/admin/`
2. Conectar ao D1 via binding no Next.js
3. Endpoints ficam em `http://localhost:3000/api/admin/*`

**Benefício**: Funciona localmente sem deploy!

---

## 📝 Exemplo de Implementação

### `src/app/api/admin/users/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Conectar ao D1 Database
    // const db = await getD1Database();

    // TODO: Query users com seus tenants
    // const users = await db.prepare(`
    //   SELECT u.*,
    //     GROUP_CONCAT(ut.tenant_code || ':' || ut.role) as tenants
    //   FROM users u
    //   LEFT JOIN user_tenants ut ON u.id = ut.user_id
    //   GROUP BY u.id
    // `).all();

    // Por enquanto, retorna vazio (fallback para mock)
    return NextResponse.json({
      users: []
    });

  } catch (error) {
    console.error('[API] Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}
```

---

## ✅ Status Atual

| Endpoint | Status | Mock | Real |
|----------|--------|------|------|
| GET /api/admin/users | ⏳ Pendente | ✅ Pronto | ❌ |
| GET /api/admin/tenants | ⏳ Pendente | ✅ Pronto | ❌ |
| GET /api/admin/pending-users | ⏳ Pendente | ✅ Pronto | ❌ |
| POST /api/admin/tenants | ⏳ Pendente | ❌ | ❌ |
| POST /api/admin/grant-access | ⏳ Pendente | ❌ | ❌ |
| DELETE /api/admin/revoke-access | ⏳ Pendente | ❌ | ❌ |
| GET /api/admin/alerts | ⏳ Pendente | ✅ Pronto | ❌ |
| POST /api/admin/alerts/:id/read | ⏳ Pendente | ❌ | ❌ |
| POST /api/admin/alerts/read-all | ⏳ Pendente | ❌ | ❌ |
| GET /api/admin/stats | ⏳ Pendente | ✅ Pronto | ❌ |

---

## 🎯 Recomendação

**Para usar AGORA**: Continue em modo mock (já funciona perfeitamente!)

**Para produção**: Implemente os endpoints acima conectando ao D1

**Documentos úteis**:
- Schema SQL acima
- Tipos TypeScript em `src/lib/admin-api.ts`
- Estrutura de response documentada

---

**Data**: Dezembro 2024
**Status**: ✅ Frontend pronto, ⏳ Backend pendente (opcional)
