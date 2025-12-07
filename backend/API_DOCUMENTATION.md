# 📚 Investigaree Backend API - Documentação

**Versão:** 1.0.0
**Base URL (local):** `http://localhost:8787`
**Base URL (produção):** `https://api.investigaree.com.br`

---

## 🔐 Autenticação

Todos os endpoints `/api/*` requerem autenticação via Firebase ID Token.

**Header necessário:**
```
Authorization: Bearer {FIREBASE_ID_TOKEN}
```

**Header opcional:**
```
X-Tenant-Code: INVESTIGA
```

---

## 📊 Rate Limiting

- **Limite:** 60 requests por minuto por usuário
- **Headers de resposta:**
  - `X-RateLimit-Limit: 60`
  - `X-RateLimit-Remaining: 45`
  - `X-RateLimit-Reset: 1701975600000`

Se exceder o limite, você receberá:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Maximum 60 requests per minute. Try again in 30 seconds."
  }
}
```

---

## 🌐 Endpoints Públicos

### GET /
Informações gerais da API

**Response:**
```json
{
  "name": "Investigaree API",
  "version": "1.0.0",
  "status": "operational",
  "environment": "production",
  "timestamp": "2025-12-07T20:30:00.000Z",
  "endpoints": {
    "health": "/health",
    "serpro": "/api/serpro/*"
  }
}
```

### GET /health
Health check com verificação de database

**Response (healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-07T20:30:00.000Z",
  "checks": {
    "database": "ok"
  }
}
```

### GET /ping
Ping simples

**Response:**
```
pong
```

---

## 🆔 API SERPRO - CPF

### POST /api/serpro/cpf
Consulta individual de CPF

**Request:**
```json
{
  "cpf": "12345678901"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ni": "12345678901",
    "nome": "JOÃO DA SILVA",
    "situacao": {
      "codigo": "0",
      "descricao": "REGULAR"
    },
    "nascimento": "01/01/1980"
  },
  "meta": {
    "timestamp": "2025-12-07T20:30:00.000Z",
    "cost": 0.6591
  }
}
```

**Custo:** R$ 0.6591 (tier 1)

---

### POST /api/serpro/cpf/batch
Consulta em lote (até 100 CPFs)

**Request:**
```json
{
  "cpfs": ["12345678901", "98765432100", "11122233344"]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ni": "12345678901",
      "nome": "JOÃO DA SILVA",
      "situacao": { "codigo": "0", "descricao": "REGULAR" },
      "nascimento": "01/01/1980"
    },
    // ... mais resultados
  ],
  "meta": {
    "timestamp": "2025-12-07T20:30:00.000Z",
    "total": 3,
    "requested": 3
  }
}
```

---

## 🏢 API SERPRO - CNPJ

### POST /api/serpro/cnpj/basica
Dados básicos (CPF mascarado no QSA)

**Request:**
```json
{
  "cnpj": "12345678000190"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ni": "12345678000190",
    "razaoSocial": "EMPRESA EXEMPLO LTDA",
    "nomeFantasia": "EXEMPLO",
    "situacaoCadastral": {
      "codigo": "2",
      "data": "2020-01-01",
      "motivo": ""
    },
    "naturezaJuridica": {
      "codigo": "2062",
      "descricao": "SOCIEDADE EMPRESÁRIA LIMITADA"
    },
    "endereco": {
      "logradouro": "RUA EXEMPLO",
      "numero": "123",
      "bairro": "CENTRO",
      "municipio": "SÃO PAULO",
      "uf": "SP",
      "cep": "01234567"
    }
  },
  "meta": {
    "timestamp": "2025-12-07T20:30:00.000Z",
    "cost": 0.6591,
    "endpoint": "basica"
  }
}
```

**Custo:** R$ 0.6591

---

### POST /api/serpro/cnpj/qsa
Com Quadro de Sócios (CPF mascarado)

**Request:**
```json
{
  "cnpj": "12345678000190"
}
```

**Response:** Similar ao /basica, mas inclui:
```json
{
  "data": {
    // ... campos básicos
    "qsa": [
      {
        "nome": "MARIA SANTOS",
        "cpf": "***456789**",
        "qualificacao": "SÓCIO-ADMINISTRADOR"
      }
    ]
  }
}
```

**Custo:** R$ 0.8788

---

### POST /api/serpro/cnpj/empresa ⭐
Dados completos (CPF DESMASCARADO - ideal para investigação)

**Request:**
```json
{
  "cnpj": "12345678000190"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // ... campos básicos
    "qsa": [
      {
        "nome": "MARIA SANTOS",
        "cpf": "98765432100",  // CPF COMPLETO!
        "qualificacao": "SÓCIO-ADMINISTRADOR"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-12-07T20:30:00.000Z",
    "cost": 1.1722,
    "endpoint": "empresa",
    "note": "CPF in QSA is UNMASKED"
  }
}
```

**Custo:** R$ 1.1722

---

### POST /api/serpro/cnpj/batch
Consulta em lote

**Request:**
```json
{
  "cnpjs": ["12345678000190", "98765432000100"],
  "level": "empresa"  // "basica" | "qsa" | "empresa" (default: empresa)
}
```

---

## 💰 API SERPRO - Dívida Ativa

### POST /api/serpro/divida-ativa
Consulta dívidas federais (aceita CPF ou CNPJ)

**Request:**
```json
{
  "ni": "12345678901"  // CPF ou CNPJ
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ni": "12345678901",
    "dividas": [
      {
        "numero": "12345678901234",
        "tipo": "IRPF",
        "situacao": "ATIVA",
        "dataInscricao": "2020-01-01",
        "valor": 5000.00,
        "orgao": "RECEITA FEDERAL"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-12-07T20:30:00.000Z",
    "cost": 0.6591,
    "hasDebts": true
  }
}
```

**Custo:** R$ 0.6591

---

### POST /api/serpro/divida-ativa/check
Verificação rápida (retorna apenas boolean)

**Request:**
```json
{
  "ni": "12345678901"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hasDebts": true
  },
  "meta": {
    "timestamp": "2025-12-07T20:30:00.000Z"
  }
}
```

---

## 💵 GET /api/serpro/pricing
Informações de preços

**Response:**
```json
{
  "success": true,
  "data": {
    "cpf": {
      "single": 0.6591,
      "tiers": [
        { "range": "1-10,000", "price": 0.6591 },
        { "range": "10,001-50,000", "price": 0.5893 },
        { "range": "50,001-100,000", "price": 0.5274 },
        { "range": "100,001+", "price": 0.4719 }
      ]
    },
    "cnpj": {
      "basica": 0.6591,
      "qsa": 0.8788,
      "empresa": 1.1722
    },
    "dividaAtiva": {
      "single": 0.6591
    }
  },
  "meta": {
    "currency": "BRL",
    "unit": "per query"
  }
}
```

---

## ❌ Tratamento de Erros

Todos os erros seguem este formato:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Opcional
  }
}
```

### Códigos de Erro Comuns:

- `UNAUTHORIZED` (401) - Token ausente ou inválido
- `FORBIDDEN` (403) - Sem permissão
- `NOT_FOUND` (404) - Rota não encontrada
- `VALIDATION_ERROR` (400) - Dados inválidos
- `RATE_LIMIT_EXCEEDED` (429) - Rate limit excedido
- `SERPRO_ERROR` (502) - Erro na API SERPRO
- `DATABASE_ERROR` (500) - Erro no banco de dados
- `INTERNAL_ERROR` (500) - Erro interno

---

## 🧪 Testando Localmente

### 1. Iniciar servidor local:
```bash
cd backend/workers/api
npm run dev
```

### 2. Testar health check:
```bash
curl http://localhost:8787/health
```

### 3. Testar endpoint protegido (precisa de token Firebase):
```bash
curl -X POST http://localhost:8787/api/serpro/cpf \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678901"}'
```

---

## 📝 Logs

Para ver logs em tempo real:
```bash
npx wrangler tail
```

Logs são em formato JSON:
```json
{
  "level": "info",
  "message": "[Investigaree] Request received",
  "timestamp": "2025-12-07T20:30:00.000Z",
  "data": {
    "method": "POST",
    "path": "/api/serpro/cpf"
  }
}
```

---

## 🚀 Deploy

### Deploy para produção:
```bash
cd backend/workers/api
npm run deploy
```

### Configurar secrets:
```bash
npx wrangler secret put SERPRO_CPF_CONSUMER_KEY
npx wrangler secret put SERPRO_CPF_CONSUMER_SECRET
# ... repetir para todas as 9 APIs
```

---

## 📊 Cost Tracking

Todas as consultas são automaticamente logadas na tabela `serpro_usage`:

```sql
SELECT
  api_name,
  COUNT(*) as queries,
  SUM(cost) as total_cost
FROM serpro_usage
WHERE tenant_code = 'INVESTIGA'
  AND created_at >= date('now', '-30 days')
GROUP BY api_name;
```

---

**Documentação gerada por:** Agent 2 - Backend Engineer
**Data:** 2025-12-07
**Versão:** 1.0.0
