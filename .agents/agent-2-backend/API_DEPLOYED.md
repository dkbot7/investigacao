# 🚀 BACKEND API - DEPLOYED!

**Status:** ✅ **EM PRODUÇÃO**
**Data Deploy:** 2025-12-07
**Versão:** ab55af92-0d97-4deb-b948-294742dda45b

---

## 📍 URL da API

**Base URL:** `https://investigaree-api.chatbotimoveis.workers.dev`

---

## ✅ Endpoints Disponíveis

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-07T21:45:38.220Z",
  "checks": {
    "database": "ok"
  }
}
```

### Status
```
GET /api/status
```

**Response:**
```json
{
  "status": "operational",
  "version": "1.0.0",
  "environment": "production"
}
```

---

## 🔐 SERPRO API Endpoints

### CPF Consultation
```
POST /api/serpro/cpf/consulta
```

**Headers:**
```
Authorization: Bearer <firebase-token>
X-Tenant-Code: <tenant-code>
Content-Type: application/json
```

**Body:**
```json
{
  "cpf": "12345678900"
}
```

**Response:**
```json
{
  "ni": "12345678900",
  "nome": "JOÃO DA SILVA",
  "situacao": {
    "codigo": "0",
    "descricao": "REGULAR"
  },
  "nascimento": "01/01/1980"
}
```

---

### CNPJ Consultation (3 endpoints)

#### 1. Consulta Básica
```
GET /api/serpro/cnpj/:cnpj
```

**Custo:** R$ 0.6591
**CPF no QSA:** Mascarado

#### 2. Consulta QSA (Quadro Societário)
```
GET /api/serpro/cnpj/:cnpj/qsa
```

**Custo:** R$ 0.8788
**CPF no QSA:** Mascarado

#### 3. Consulta Empresa (COMPLETA)
```
GET /api/serpro/cnpj/:cnpj/estabelecimentos
```

**Custo:** R$ 1.1722
**CPF no QSA:** ✅ **DESMASCARADO** (ideal para investigação)

---

### Dívida Ativa
```
POST /api/serpro/divida-ativa/consulta
```

**Body:**
```json
{
  "ni": "12345678900"
}
```

**Response:**
```json
{
  "ni": "12345678900",
  "dividas": [
    {
      "numero": "123456789",
      "tipo": "IRPF",
      "situacao": "ATIVA",
      "valor": 5000.00,
      "dataInscricao": "2024-01-15"
    }
  ]
}
```

---

## 🔐 Autenticação

Todos os endpoints `/api/*` requerem **Firebase Authentication**.

**Header obrigatório:**
```
Authorization: Bearer <firebase-id-token>
```

**Como obter o token:**
```javascript
// Frontend (Next.js)
import { auth } from '@/lib/firebase';

const token = await auth.currentUser?.getIdToken();

fetch('https://investigaree-api.chatbotimoveis.workers.dev/api/serpro/cpf/consulta', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Tenant-Code': 'TENANT001',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ cpf: '12345678900' })
});
```

---

## 🏢 Multi-Tenancy

Todos os endpoints SERPRO requerem o header:
```
X-Tenant-Code: <código-do-tenant>
```

Isso permite:
- Tracking de uso por cliente
- Billing separado
- Quotas individuais

---

## 📊 Rate Limiting

- **Limite:** 60 requisições por minuto por usuário
- **Response quando excede:** HTTP 429

```json
{
  "error": "Rate limit exceeded. Try again in 60 seconds."
}
```

---

## 🔴 Configuração Pendente

### Secrets SERPRO (⚠️ IMPORTANTE)

Os seguintes secrets **precisam ser configurados** no Cloudflare Dashboard:

```bash
# Via CLI (se você tiver as credenciais):
npx wrangler secret put SERPRO_CPF_CONSUMER_KEY
npx wrangler secret put SERPRO_CPF_CONSUMER_SECRET
npx wrangler secret put SERPRO_CNPJ_CONSUMER_KEY
npx wrangler secret put SERPRO_CNPJ_CONSUMER_SECRET
npx wrangler secret put SERPRO_DIVIDA_ATIVA_CONSUMER_KEY
npx wrangler secret put SERPRO_DIVIDA_ATIVA_CONSUMER_SECRET
```

**Ou via Cloudflare Dashboard:**
1. Acessar: https://dash.cloudflare.com/
2. Workers & Pages → investigaree-api → Settings → Variables
3. Adicionar Environment Variables (encrypted)

**⚠️ Até que os secrets sejam configurados, as consultas SERPRO retornarão erro 401.**

---

## 🗄️ Database

**D1 Database ID:** `4b9ddf13-d347-4337-8500-8ba37fd08f55`

**Tabelas criadas:**
- `users` - Usuários Firebase
- `tenants` - Clientes/organizações
- `user_tenants` - Mapeamento usuário↔tenant
- `alerts` - Alertas do sistema
- `audit_logs` - Logs de auditoria
- `serpro_usage` - Tracking de uso SERPRO

---

## 📡 CORS

Origens permitidas:
- `https://investigaree.com.br`
- `http://localhost:3000`

Se precisar adicionar outra origem, editar `src/middleware/cors.ts`.

---

## 🐛 Debug & Logs

**Ver logs em tempo real:**
```bash
cd backend/workers/api
npx wrangler tail
```

**Ou no Cloudflare Dashboard:**
https://dash.cloudflare.com/ → Workers & Pages → investigaree-api → Logs

---

## 📈 Métricas

**Endpoint de estatísticas (admin only):**
```
GET /api/admin/stats
```

**Response:**
```json
{
  "totalUsers": 42,
  "totalTenants": 5,
  "serproUsage": {
    "today": 127,
    "thisMonth": 3542,
    "costThisMonth": 2345.67
  },
  "topAPIs": [
    { "api": "cpf", "count": 1234 },
    { "api": "cnpj", "count": 987 }
  ]
}
```

---

## 🔗 Para Agent 3 (Full-Stack)

### Integração Frontend

**1. Atualizar variável de ambiente:**

Arquivo: `investigaree/.env.local`
```
NEXT_PUBLIC_API_URL=https://investigaree-api.chatbotimoveis.workers.dev
```

**2. Atualizar `api-client.ts`:**

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://investigaree-api.chatbotimoveis.workers.dev';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await auth.currentUser?.getIdToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Tenant-Code': getTenantCode(), // Implementar essa função
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
```

**3. Usar nos serviços:**

```typescript
// lib/services/serpro.service.ts
export async function consultarCPF(cpf: string) {
  return apiRequest<CpfResponse>('/api/serpro/cpf/consulta', {
    method: 'POST',
    body: JSON.stringify({ cpf }),
  });
}
```

---

## ✅ Checklist de Integração

### Para Agent 3:
- [ ] Atualizar `.env.local` com `NEXT_PUBLIC_API_URL`
- [ ] Modificar `api-client.ts` para usar API real
- [ ] Implementar função `getTenantCode()`
- [ ] Testar autenticação Firebase
- [ ] Testar endpoint `/health`
- [ ] Testar endpoint `/api/serpro/cpf/consulta`
- [ ] Atualizar testes E2E para usar API real
- [ ] Remover mocks/fixtures (ou torná-los opcionais)

### Para Agent 1:
- [ ] Adicionar `NEXT_PUBLIC_API_URL` ao CI/CD
- [ ] Configurar health check monitoring
- [ ] Configurar alertas de downtime

---

## 🚨 Importante

**⚠️ Secrets SERPRO não estão configurados ainda!**

As credenciais das APIs SERPRO (Consumer Key/Secret) precisam ser adicionadas como secrets no Cloudflare. Até lá, as consultas retornarão erro.

**Onde conseguir as credenciais?**
- Verificar com o cliente/stakeholder
- Ou consultar documentação em `APIs/SERPRO/COMO_OBTER_TOKENS.md`

---

## 📞 Suporte

**Agent 2 (Backend Engineer)**
Workspace: `.agents/agent-2-backend/`
Status: `.agents/agent-2-backend/STATUS.md`

**Deploy realizado:** 2025-12-07
**Próxima atualização:** Configurar secrets + 6 APIs restantes

---

**🎉 Backend está no ar! Agent 3 pode começar a integração!**
