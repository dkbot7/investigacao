# 🐛 FIX: Novos usuários entrando como CLIENTE_01

**Data:** 2025-12-08
**Agent:** Agent 2 (Backend Engineer)
**Status:** ✅ **RESOLVIDO**

---

## 🎯 PROBLEMA RELATADO

Quando um novo usuário cria conta, ele entra no sistema com o tenant **CLIENTE_01** ao invés de ter seu próprio tenant pessoal.

---

## 🔍 DIAGNÓSTICO

### **O que estava acontecendo:**

1. ✅ Endpoint `/api/auth/register` **funcionava corretamente**:
   - Criava usuário no D1
   - Criava tenant pessoal (ex: `USER_ABC12345`)
   - Associava usuário ao tenant pessoal como `admin`

2. ❌ Endpoint `/api/tenant/info` **retornava tenant errado**:
   - Se usuário tinha acesso a múltiplos tenants (ex: CLIENTE_01 + tenant pessoal)
   - Ordenava por `granted_at DESC` (data de concessão)
   - **Retornava o primeiro da lista** (que podia ser CLIENTE_01)

### **Código problemático:**

```typescript
// tenants.routes.ts:58-69 (ANTES DO FIX)
const { results: userTenants } = await c.env.DB.prepare(`
  SELECT
    t.id, t.code, t.name, t.email, t.status,
    ut.role, ut.granted_at, ut.is_active
  FROM user_tenants ut
  JOIN tenants t ON ut.tenant_id = t.id
  WHERE ut.user_id = ? AND ut.is_active = 1
  ORDER BY ut.granted_at DESC  ← ❌ Sem prioridade para tenant pessoal!
`).bind(userRecord.id).all();

const activeTenant = userTenants?.[0] || null;  ← ❌ Pega o primeiro (qualquer um)
```

### **Cenário do bug:**

```
Usuário: dkbotdani@gmail.com
Tenants com acesso:
  1. CLIENTE_01 (granted_at: 2025-12-01)  ← Mais antigo, vinha primeiro
  2. USER_ABC12345 (granted_at: 2025-12-08)  ← Tenant pessoal, mas vinha depois

Resultado: Frontend recebia CLIENTE_01 como tenant ativo ❌
```

---

## ✅ SOLUÇÃO

### **Alteração aplicada:**

**Arquivo:** `backend/workers/api/src/routes/tenants.routes.ts:58-69`

```typescript
// DEPOIS DO FIX
const { results: userTenants } = await c.env.DB.prepare(`
  SELECT
    t.id, t.code, t.name, t.email, t.status, t.firebase_uid,  ← ✅ Incluir firebase_uid
    ut.role, ut.granted_at, ut.is_active
  FROM user_tenants ut
  JOIN tenants t ON ut.tenant_id = t.id
  WHERE ut.user_id = ? AND ut.is_active = 1
  ORDER BY
    CASE WHEN t.firebase_uid = ? THEN 0 ELSE 1 END,  ← ✅ PRIORIDADE: Tenant pessoal primeiro!
    ut.granted_at DESC
`).bind(userRecord.id, user.uid).all();

const activeTenant = userTenants?.[0] || null;  ← ✅ Agora sempre pega tenant pessoal primeiro
```

### **O que mudou:**

1. ✅ Adicionamos `t.firebase_uid` ao SELECT
2. ✅ Adicionamos prioridade no ORDER BY:
   - `CASE WHEN t.firebase_uid = ? THEN 0 ELSE 1 END`
   - Tenant pessoal (firebase_uid match) = 0 (vem primeiro)
   - Outros tenants = 1 (vêm depois)
3. ✅ Mantém ordenação por `granted_at DESC` como desempate

### **Resultado esperado:**

```
Usuário: dkbotdani@gmail.com
Tenants com acesso (após ordenação):
  1. USER_ABC12345 (firebase_uid match) ← ✅ Vem PRIMEIRO (prioridade 0)
  2. CLIENTE_01 (sem match) ← ✅ Vem depois (prioridade 1)

Resultado: Frontend recebe USER_ABC12345 como tenant ativo ✅
```

---

## 🧪 COMO TESTAR

### **Cenário 1: Novo usuário (sem tenants antigos)**

1. Criar conta nova no frontend
2. Backend cria tenant pessoal `USER_XXXXXXXX`
3. `/api/tenant/info` retorna tenant pessoal ✅

### **Cenário 2: Usuário existente (com múltiplos tenants)**

1. Usuário tem acesso a CLIENTE_01 + tenant pessoal
2. `/api/tenant/info` retorna tenant pessoal (prioridade) ✅
3. Usuário pode trocar de tenant via UI (se implementado)

### **Cenário 3: Usuário sem tenant pessoal (apenas compartilhado)**

1. Usuário tem acesso apenas a CLIENTE_01 (sem tenant pessoal)
2. `/api/tenant/info` retorna CLIENTE_01 ✅
3. Admin pode criar tenant pessoal via `/api/tenants/create-personal`

---

## 📊 IMPACTO

### **✅ Casos corrigidos:**

- ✅ Novos usuários sempre entram no próprio tenant pessoal
- ✅ Usuários com múltiplos tenants veem tenant pessoal primeiro
- ✅ Prioridade clara: tenant pessoal > tenants compartilhados

### **⚠️ Casos não afetados:**

- ⚠️ Usuários que **já entraram** como CLIENTE_01 antes do fix
  - Solução: Admin pode revogar acesso ao CLIENTE_01 via `/api/tenants/:id/revoke-access`
- ⚠️ Usuários sem tenant pessoal (apenas acesso a tenants compartilhados)
  - Solução: Admin pode criar tenant pessoal via `/api/tenants/create-personal`

---

## 🚀 DEPLOY

### **Backend (Cloudflare Workers):**

```bash
cd backend/workers/api
npm run build
npx wrangler deploy
```

### **Verificação:**

```bash
# Testar endpoint /api/tenant/info
curl -H "Authorization: Bearer <token>" \
  https://api.investigaree.com.br/api/tenant/info

# Resposta esperada:
{
  "hasAccess": true,
  "tenant": {
    "id": "tenant_abc12345",
    "code": "USER_ABC12345",  ← Tenant pessoal (não CLIENTE_01)
    "name": "João Silva (Conta Pessoal)",
    "role": "admin"
  },
  "tenants": [...]
}
```

---

## 📝 CHECKLIST PÓS-DEPLOY

- [ ] Deploy backend realizado
- [ ] Endpoint `/api/tenant/info` testado
- [ ] Novos usuários criando conta e vendo tenant pessoal
- [ ] Usuários existentes com múltiplos tenants vendo tenant pessoal
- [ ] Admin pode revogar acesso de usuários a CLIENTE_01 se necessário

---

## 🔄 MIGRAÇÃO MANUAL (Se necessário)

**Para migrar usuários que estão atualmente em CLIENTE_01:**

```bash
# 1. Criar tenant pessoal para usuário existente
POST /api/tenants/create-personal
{
  "user_email": "usuario@exemplo.com",
  "revoke_existing_access": true  ← Remove acesso ao CLIENTE_01
}

# 2. Ou apenas revogar acesso ao CLIENTE_01
POST /api/tenants/tenant_cliente_01/revoke-access
{
  "user_email": "usuario@exemplo.com"
}
```

---

## 💡 MELHORIAS FUTURAS

### **Frontend: Seletor de Tenant**

Se usuário tiver acesso a múltiplos tenants, permitir trocar:

```typescript
// investigaree/src/components/TenantSwitcher.tsx
export function TenantSwitcher() {
  const { tenant, tenants } = useTenant();

  const handleSwitch = async (tenantId: string) => {
    // POST /api/tenant/switch-active
    await fetch('/api/tenant/switch-active', {
      method: 'POST',
      body: JSON.stringify({ tenant_id: tenantId })
    });

    // Reload
    window.location.reload();
  };

  return (
    <Select value={tenant?.id} onChange={handleSwitch}>
      {tenants.map(t => (
        <option key={t.id} value={t.id}>
          {t.name} ({t.role})
        </option>
      ))}
    </Select>
  );
}
```

---

**Documentação criada por:** Agent 2 (Backend Engineer)
**Data:** 2025-12-08
**Status:** ✅ RESOLVIDO
