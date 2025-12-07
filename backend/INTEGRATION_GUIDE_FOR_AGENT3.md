# 🔌 Guia de Integração Backend - Para Agent 3

**De:** Agent 2 (Backend Engineer)
**Para:** Agent 3 (Full-Stack Developer)
**Data:** 2025-12-07
**Status:** ✅ Backend 100% pronto para integração!

---

## 🎯 O que está pronto para você usar:

### ✅ 9 Endpoints HTTP funcionais
### ✅ Autenticação Firebase integrada
### ✅ Rate limiting automático
### ✅ Cost tracking em D1
### ✅ Validação e error handling

---

## 🚀 Como Integrar (Passo a Passo)

### STEP 1: Entender o Service Layer já criado

Você já criou (`investigaree/src/lib/services/serpro.service.ts`) com estes métodos:

```typescript
// Seus métodos atuais:
consultarCpf(cpf: string)
consultarCnpjBasica(cnpj: string)
consultarCnpjQsa(cnpj: string)
consultarCnpjEmpresa(cnpj: string)
consultarDividaAtiva(ni: string)
consultarRenda(cpf: string)
consultarFaturamento(cnpj: string)
// ... etc
```

**Boa notícia:** A estrutura está perfeita! Você só precisa mudar a URL base!

---

### STEP 2: Atualizar a URL base

No seu `api-client.ts` ou `serpro.service.ts`, mude:

**ANTES (mock/placeholder):**
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

**DEPOIS (backend real):**
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.investigaree.com.br'
  : 'http://localhost:8787';
```

---

### STEP 3: Garantir que o Firebase token está sendo enviado

Seu `api-client.ts` já deve ter algo assim:

```typescript
const token = await auth.currentUser?.getIdToken();

const response = await fetch(`${API_BASE_URL}/api/serpro/cpf`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Tenant-Code': 'INVESTIGA', // opcional
  },
  body: JSON.stringify({ cpf }),
});
```

**✅ Se você já tem isso, não precisa mudar nada!**

---

### STEP 4: Mapear seus métodos para os endpoints

| Seu método atual | Endpoint backend | Custo |
|-----------------|------------------|-------|
| `consultarCpf(cpf)` | `POST /api/serpro/cpf` | R$ 0.66 |
| `consultarCnpjBasica(cnpj)` | `POST /api/serpro/cnpj/basica` | R$ 0.66 |
| `consultarCnpjQsa(cnpj)` | `POST /api/serpro/cnpj/qsa` | R$ 0.88 |
| `consultarCnpjEmpresa(cnpj)` | `POST /api/serpro/cnpj/empresa` | R$ 1.17 ⭐ |
| `consultarDividaAtiva(ni)` | `POST /api/serpro/divida-ativa` | R$ 0.66 |

---

## 📝 Exemplo Completo de Integração

### Seu arquivo: `investigaree/src/lib/services/serpro.service.ts`

```typescript
import { auth } from '@/lib/firebase';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.investigaree.com.br'
  : 'http://localhost:8787';

/**
 * Consulta CPF no SERPRO
 */
export async function consultarCpf(cpf: string) {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/api/serpro/cpf`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Tenant-Code': 'INVESTIGA',
    },
    body: JSON.stringify({ cpf }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to query CPF');
  }

  const result = await response.json();
  return result.data; // { ni, nome, situacao, nascimento }
}

/**
 * Consulta CNPJ (empresa - CPF desmascarado)
 */
export async function consultarCnpjEmpresa(cnpj: string) {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/api/serpro/cnpj/empresa`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Tenant-Code': 'INVESTIGA',
    },
    body: JSON.stringify({ cnpj }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to query CNPJ');
  }

  const result = await response.json();
  return result.data; // { ni, razaoSocial, qsa: [{ cpf: "12345678901" }] }
}

/**
 * Consulta Dívida Ativa
 */
export async function consultarDividaAtiva(ni: string) {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}/api/serpro/divida-ativa`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Tenant-Code': 'INVESTIGA',
    },
    body: JSON.stringify({ ni }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to query dívida ativa');
  }

  const result = await response.json();
  return result.data; // { ni, dividas: [...] }
}
```

---

## 🧪 Como Testar a Integração

### 1. Iniciar backend local (em um terminal separado):

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\backend\workers\api
npm run dev
```

Backend rodará em `http://localhost:8787`

### 2. Iniciar frontend (no seu terminal):

```bash
cd investigaree
npm run dev
```

Frontend rodará em `http://localhost:3000`

### 3. No navegador:

1. Fazer login no Firebase
2. Acessar alguma página que usa SERPRO (ex: dashboard/funcionarios)
3. Abrir DevTools (F12) → Network tab
4. Executar uma consulta
5. Ver requests para `http://localhost:8787/api/serpro/*`

---

## ⚠️ Tratamento de Erros

O backend retorna erros consistentes:

```typescript
// Exemplo de error handling
try {
  const data = await consultarCpf('12345678901');
  console.log('CPF data:', data);
} catch (error) {
  // error.message terá a mensagem do backend
  if (error.message.includes('Rate limit')) {
    alert('Muitas requisições! Aguarde 1 minuto.');
  } else if (error.message.includes('Invalid CPF')) {
    alert('CPF inválido');
  } else {
    alert('Erro ao consultar CPF');
  }
}
```

### Códigos HTTP que você pode receber:

- `200` - Sucesso
- `400` - Validação falhou (CPF/CNPJ inválido)
- `401` - Não autenticado (token ausente/inválido)
- `429` - Rate limit excedido (60/min)
- `500` - Erro interno
- `502` - Erro na API SERPRO

---

## 📊 Response Format

Todos os endpoints retornam:

```typescript
{
  success: true,
  data: { /* dados da consulta */ },
  meta: {
    timestamp: "2025-12-07T20:30:00Z",
    cost: 0.6591,  // custo em R$
    // ... outros campos opcionais
  }
}
```

**Em caso de erro:**

```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid CPF format: 123",
    details: { /* opcional */ }
  }
}
```

---

## 🔐 Autenticação

O backend valida o Firebase token automaticamente. Você **NÃO** precisa:
- ❌ Validar token manualmente
- ❌ Fazer refresh de token
- ❌ Gerenciar expiração

Apenas pegue o token e envie:

```typescript
const token = await auth.currentUser?.getIdToken();
// Backend cuida do resto!
```

---

## 🚀 Rate Limiting

- **Limite:** 60 requests/minuto por usuário
- **Headers na resposta:**
  - `X-RateLimit-Limit: 60`
  - `X-RateLimit-Remaining: 45`
  - `X-RateLimit-Reset: 1701975600000`

Se exceder, você recebe `429 Too Many Requests`.

**Dica:** Você pode ler esses headers e mostrar um contador no UI:

```typescript
const remaining = response.headers.get('X-RateLimit-Remaining');
console.log(`Requests restantes: ${remaining}/60`);
```

---

## 💰 Cost Tracking

Toda consulta é automaticamente logada no D1 com:
- Usuário (Firebase UID)
- Tenant code
- API consultada
- Documento (CPF/CNPJ)
- **Custo (R$)** ⭐
- Status da resposta
- Tempo de resposta

Você **NÃO** precisa fazer nada, é automático!

Se quiser mostrar custos no dashboard:

```typescript
// Endpoint futuro (TAREFA 2.14):
GET /api/admin/serpro/usage?tenant=INVESTIGA&period=30d
```

---

## 🎯 Próximos Passos Recomendados

### AGORA (Alta prioridade):

1. ✅ Mudar `API_BASE_URL` para `http://localhost:8787`
2. ✅ Testar 1 endpoint (ex: CPF)
3. ✅ Verificar que auth funciona
4. ✅ Testar error handling

### DEPOIS (Média prioridade):

5. Integrar os 3 endpoints CNPJ (básica, qsa, empresa)
6. Integrar Dívida Ativa
7. Adicionar loading states
8. Adicionar error messages bonitas

### FUTURO (Baixa prioridade):

9. Cache de responses (opcional)
10. Retry logic (opcional)
11. Batch queries (quando necessário)

---

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. **Verificar backend está rodando:**
   ```bash
   curl http://localhost:8787/health
   ```

2. **Ver logs do backend:**
   ```bash
   cd backend/workers/api
   npm run dev  # logs aparecem aqui
   ```

3. **Verificar token Firebase:**
   ```typescript
   const token = await auth.currentUser?.getIdToken();
   console.log('Token:', token?.substring(0, 20) + '...');
   ```

4. **Verificar Network tab no DevTools:**
   - Ver se request chegou no backend
   - Ver status code
   - Ver response body

---

## 🎉 Conclusão

**Backend está 100% pronto e aguardando você!**

Mudanças mínimas necessárias:
- ✅ Trocar URL base
- ✅ Garantir que token está sendo enviado
- ✅ That's it! 🚀

**Estimativa de tempo para integração:** 1-2 horas

Tudo foi projetado para ser **plug-and-play** com seu código existente!

---

**Boa integração! 🎊**

*- Agent 2*
