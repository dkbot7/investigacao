# API Documentation - Investigaree

**Versão**: 2.0.0
**Base URL**: `https://api.investigaree.com.br`
**Formato**: JSON
**Autenticação**: JWT Bearer Token (Firebase)

---

## Índice

- [Autenticação](#autenticação)
- [User Endpoints](#user-endpoints)
- [Compliance Endpoints](#compliance-endpoints)
- [LGPD Endpoints](#lgpd-endpoints)
- [Leads Endpoints](#leads-endpoints)
- [Public REST API (v1)](#public-rest-api-v1)
- [Códigos de Status](#códigos-de-status)
- [Rate Limiting](#rate-limiting)

---

## Autenticação

Todos os endpoints (exceto os marcados como 🌐 **Público**) requerem autenticação via JWT Firebase.

### Header de Autenticação

```http
Authorization: Bearer <firebase_jwt_token>
```

### Obter Token (Frontend)

```typescript
import { auth } from '@/lib/firebase';

const user = auth.currentUser;
const token = await user.getIdToken();

// Fazer request
const response = await fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Validação de Token (Backend)

O backend valida o token em cada requisição:
1. Verifica assinatura usando Google public keys
2. Valida claims (iss, aud, exp, iat)
3. Busca tenant_id e role no D1
4. Aplica Row Level Security (RLS)

---

## User Endpoints

### GET /api/user/tenant-info

Retorna informações do tenant do usuário autenticado.

**Autenticação**: ✅ Obrigatória

**Response:**
```json
{
  "hasAccess": true,
  "tenant": {
    "id": "abc123",
    "code": "CLIENTE_01",
    "name": "Empresa XYZ Ltda",
    "status": "active",
    "email": "contato@empresa.com.br"
  },
  "tenants": [
    {
      "id": "abc123",
      "code": "CLIENTE_01",
      "name": "Empresa XYZ Ltda",
      "status": "active"
    }
  ],
  "user": {
    "uid": "firebase_uid_123",
    "email": "usuario@empresa.com.br",
    "role": "editor",
    "userId": "user_id_123"
  }
}
```

**Exemplo:**
```typescript
const response = await fetch('/api/user/tenant-info', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { tenant } = await response.json();
console.log(tenant.code); // "CLIENTE_01"
```

---

## Compliance Endpoints

### GET /api/compliance/stats

Retorna estatísticas agregadas de compliance do tenant.

**Autenticação**: ✅ Obrigatória

**Response:**
```json
{
  "totalPEP": 247,
  "totalSancoesCEIS": 89,
  "totalSancoesCNEP": 34,
  "totalOFACMatches": 5,
  "totalInvestigacoes": 1500,
  "totalAlertas": 375,
  "taxaCompliance": "75.00",
  "timestamp": "2025-12-30T10:30:00.000Z"
}
```

**Exemplo:**
```typescript
const response = await fetch('/api/compliance/stats', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const stats = await response.json();
```

---

### GET /api/compliance/pep

Lista todas as Pessoas Expostas Politicamente do tenant.

**Autenticação**: ✅ Obrigatória

**Query Parameters:**
- `limit` (opcional): Número de resultados por página (padrão: 100)
- `offset` (opcional): Offset para paginação (padrão: 0)

**Response:**
```json
{
  "peps": [
    {
      "id": "pep_123",
      "cpf": "12345678900",
      "nome": "João da Silva",
      "is_pep": 1,
      "pep_nivel": "2",
      "pep_desde": "2020-01-15",
      "pep_cargo": "Prefeito",
      "created_at": "2025-12-30T08:00:00.000Z"
    }
  ],
  "total": 247,
  "limit": 100,
  "offset": 0
}
```

---

### GET /api/compliance/sancoes

Lista todas as sanções (CEIS/CNEP/CEPIM) do tenant.

**Autenticação**: ✅ Obrigatória

**Query Parameters:**
- `tipo` (opcional): Filtro por tipo ('CEIS', 'CNEP', 'CEPIM')
- `limit` (opcional): Número de resultados (padrão: 100)
- `offset` (opcional): Offset para paginação (padrão: 0)

**Response:**
```json
{
  "sancoes": [
    {
      "id": "sancao_456",
      "cpf": "98765432100",
      "nome": "Maria Santos",
      "tipo": "CEIS",
      "data_sancao": "2023-05-20",
      "orgao_sancionador": "CGU",
      "motivo": "Fraude em licitação",
      "valor_multa": 50000.00,
      "created_at": "2025-12-30T09:00:00.000Z"
    }
  ],
  "total": 89,
  "tipo": "CEIS",
  "limit": 100,
  "offset": 0
}
```

**Exemplo - Filtrar apenas CNEP:**
```typescript
const response = await fetch('/api/compliance/sancoes?tipo=CNEP', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## LGPD Endpoints

### GET /api/lgpd/stats

Retorna estatísticas de compliance LGPD.

**Autenticação**: ✅ Obrigatória

**Response:**
```json
{
  "totalConsentimentos": 1247,
  "consentimentosAtivos": 1156,
  "consentimentosInativos": 91,
  "taxaConsentimento": "92.70",
  "solicitacoesAcesso": 34,
  "solicitacoesExclusao": 12,
  "solicitacoesPortabilidade": 8,
  "totalSolicitacoes": 54,
  "solicitacoesPendentes": 5,
  "solicitacoesConcluidas": 49,
  "taxaResposta": "90.74",
  "timestamp": "2025-12-30T10:30:00.000Z"
}
```

---

### POST /api/lgpd/consent

🌐 **Público** - Registra consentimento LGPD (sem autenticação).

**Body:**
```json
{
  "timestamp": "2025-12-30T10:30:00.000Z",
  "consentimento": true,
  "finalidades": ["analytics", "marketing"],
  "ip_hash": "ip_a1b2c3d4",
  "user_agent": "Mozilla/5.0...",
  "granular": {},
  "versao_texto": "1.0.0"
}
```

**Response:**
```json
{
  "success": true,
  "id": "consent_123abc"
}
```

**Exemplo:**
```typescript
const response = await fetch('/api/lgpd/consent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    timestamp: new Date().toISOString(),
    consentimento: true,
    finalidades: ['analytics', 'marketing'],
    ip_hash: hashIP(userIP),
    user_agent: navigator.userAgent,
    versao_texto: '1.0.0'
  })
});
```

---

### GET /api/lgpd/requests

Lista solicitações LGPD (acesso, exclusão, portabilidade).

**Autenticação**: ✅ Obrigatória (Admin apenas)

**Query Parameters:**
- `tipo` (opcional): 'acesso', 'exclusao', 'portabilidade'
- `status` (opcional): 'pendente', 'em_processamento', 'concluido'
- `limit` (opcional): Padrão 50
- `offset` (opcional): Padrão 0

**Response:**
```json
{
  "requests": [
    {
      "id": "req_789",
      "tipo": "exclusao",
      "user_id": "user_123",
      "email": "usuario@email.com",
      "status": "pendente",
      "created_at": "2025-12-30T09:00:00.000Z",
      "completed_at": null
    }
  ],
  "total": 5,
  "limit": 50,
  "offset": 0
}
```

---

### POST /api/lgpd/request

Cria nova solicitação LGPD.

**Autenticação**: ✅ Obrigatória (ou público se houver email)

**Body:**
```json
{
  "tipo": "exclusao",
  "email": "usuario@email.com",
  "user_id": "user_123"
}
```

**Tipos válidos:**
- `acesso` - Solicitar acesso aos dados (LGPD Art. 18, III)
- `exclusao` - Solicitar exclusão dos dados (LGPD Art. 18, VI)
- `portabilidade` - Solicitar portabilidade dos dados (LGPD Art. 18, V)

**Response:**
```json
{
  "success": true,
  "id": "req_abc123",
  "tipo": "exclusao"
}
```

---

## Leads Endpoints

### POST /api/leads/subscribe

🌐 **Público** - Registra lead de captura (blog, landing pages).

**Body:**
```json
{
  "email": "lead@exemplo.com",
  "name": "João Silva",
  "source": "blog_lead_capture",
  "resource": "Checklist Due Diligence",
  "resourceType": "checklist"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead cadastrado com sucesso",
  "leadId": "lead_xyz789",
  "isNew": true
}
```

**Features:**
- Salva lead no D1 database
- Envia email de boas-vindas via Resend
- Rastreia UTM params automaticamente
- Verifica duplicatas antes de inserir

**Exemplo:**
```typescript
const response = await fetch('/api/leads/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'lead@exemplo.com',
    name: 'João Silva',
    source: 'blog_lead_capture',
    resource: 'Checklist Due Diligence'
  })
});
```

---

## Public REST API (v1)

API pública com autenticação via API Key.

### Autenticação

```http
X-API-Key: sua_api_key_aqui
```

### POST /v1/investigations/cpf

Cria investigação de CPF.

**Headers:**
- `X-API-Key`: Sua API key
- `Content-Type`: application/json

**Body:**
```json
{
  "cpf": "12345678900"
}
```

**Response:**
```json
{
  "id": "inv_123",
  "cpf": "12345678900",
  "status": "processing",
  "created_at": "2025-12-30T10:30:00.000Z"
}
```

**Rate Limit:** 100 req/min por API key

---

### POST /v1/investigations/cnpj

Cria investigação de CNPJ.

**Headers:**
- `X-API-Key`: Sua API key
- `Content-Type`: application/json

**Body:**
```json
{
  "cnpj": "12345678000199"
}
```

**Response:**
```json
{
  "id": "inv_456",
  "cnpj": "12345678000199",
  "status": "processing",
  "created_at": "2025-12-30T10:30:00.000Z"
}
```

---

### GET /v1/investigations/:id

Busca investigação por ID.

**Headers:**
- `X-API-Key`: Sua API key

**Response:**
```json
{
  "id": "inv_123",
  "cpf": "12345678900",
  "status": "completed",
  "data": {
    "nome": "João da Silva",
    "nascimento": "1990-01-15",
    "situacao": {
      "codigo": "0",
      "descricao": "Regular"
    }
  },
  "created_at": "2025-12-30T10:30:00.000Z",
  "completed_at": "2025-12-30T10:31:30.000Z"
}
```

---

## Códigos de Status

| Código | Significado |
|--------|-------------|
| `200` | OK - Requisição bem-sucedida |
| `201` | Created - Recurso criado com sucesso |
| `400` | Bad Request - Dados inválidos no body |
| `401` | Unauthorized - Token ausente ou inválido |
| `403` | Forbidden - Sem permissão para acessar recurso |
| `404` | Not Found - Recurso não encontrado |
| `429` | Too Many Requests - Rate limit excedido |
| `500` | Internal Server Error - Erro no servidor |

---

## Rate Limiting

### API Pública (v1)
- **Limite**: 100 requisições/minuto por API key
- **Header de resposta**: `X-RateLimit-Remaining`
- **Resposta ao exceder**: HTTP 429

```json
{
  "error": "Rate limit exceeded",
  "retry_after": 60
}
```

### Endpoints Autenticados
- **Limite**: 500 requisições/minuto por usuário
- **Aplicado**: Automaticamente via Cloudflare Workers

---

## Erros Comuns

### 401 Unauthorized

```json
{
  "error": "Token de autorização ausente"
}
```

**Causa**: Header `Authorization` não enviado ou token inválido.

**Solução**: Certifique-se de enviar `Authorization: Bearer <token>`.

---

### 403 Forbidden

```json
{
  "error": "Acesso negado ao tenant solicitado"
}
```

**Causa**: Tentativa de acessar dados de outro tenant.

**Solução**: Row Level Security (RLS) impede acesso cross-tenant.

---

### 404 Not Found

```json
{
  "error": "Not found",
  "path": "/api/endpoint-invalido",
  "method": "GET"
}
```

**Causa**: Endpoint não existe.

**Solução**: Verifique a documentação para o endpoint correto.

---

## Changelog da API

### v2.0.0 (2025-12-30)
- ✅ Adicionado `/api/compliance/stats`
- ✅ Adicionado `/api/compliance/pep`
- ✅ Adicionado `/api/compliance/sancoes`
- ✅ Adicionado `/api/lgpd/stats`
- ✅ Adicionado `/api/lgpd/consent` (público)
- ✅ Adicionado `/api/lgpd/requests`
- ✅ Adicionado `/api/lgpd/request`
- ✅ Adicionado `/api/leads/subscribe` (público)
- ✅ Validação JWT com assinatura completa (Google public keys)
- ✅ Row Level Security (RLS) em todas as queries

### v1.0.0 (2024-12-12)
- ✅ Public REST API (v1)
- ✅ `/api/user/tenant-info`
- ✅ Autenticação Firebase básica

---

## Suporte

**Email**: api@investigaree.com.br
**Documentação completa**: [SECURITY.md](./SECURITY.md)
**Reportar vulnerabilidades**: security@investigaree.com.br

---

**Última atualização**: 2025-12-30
**Versão da API**: 2.0.0
