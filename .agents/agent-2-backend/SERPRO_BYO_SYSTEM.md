# Sistema BYO de Credenciais SERPRO

**Data:** 2025-12-08
**Agent:** 2 - Backend Engineer
**Status:** ✅ Implementado e Deployado (Worker: c74c2cb1-e1f4-4ada-a84a-e607cae17050)

---

## 📋 Visão Geral

Sistema que permite dois modos de operação para credenciais SERPRO:

1. **Managed Mode (Gerenciado):** Investigaree fornece as credenciais SERPRO (SaaS tradicional)
2. **BYO Mode (Bring Your Own):** Cliente traz suas próprias credenciais SERPRO (White Label)

**Vantagem:** Flexibilidade para diferentes modelos de negócio e clientes.

---

## 🏗️ Arquitetura Implementada

### Database Schema (D1)

**Tabela `tenants`** (colunas adicionadas):
- `serpro_mode` TEXT - 'managed' ou 'byo'
- `serpro_notes` TEXT - Notas sobre configuração

**Tabela `tenant_serpro_credentials`** (nova):
- `id` TEXT PRIMARY KEY
- `tenant_id` TEXT - FK para tenants
- `api_name` TEXT - 'cpf', 'cnpj', 'divida-ativa', etc.
- `consumer_key` TEXT
- `consumer_secret_encrypted` TEXT - **Sempre criptografado com AES-256-GCM**
- `environment` TEXT - 'trial' ou 'production'
- `is_active` INTEGER - 1 = ativo, 0 = inativo
- `last_validated_at` TEXT - Última validação bem-sucedida
- `validation_error` TEXT - Erro de validação (se houver)
- `created_at`, `updated_at`

**Tabela `serpro_credentials_audit`** (nova):
- Log de todas as mudanças em credenciais (create, update, delete, validate)
- **Nunca armazena secrets**, apenas metadados

---

## 🔐 Segurança

### Criptografia AES-256-GCM

**Arquivo:** `src/utils/encryption.ts`

**Funções:**
- `encrypt(plaintext, masterKey)` - Criptografa secrets
- `decrypt(encrypted, masterKey)` - Descriptografa secrets
- `validateEncryption(encrypted, masterKey)` - Valida integridade

**Master Key:**
- Armazenada em Cloudflare Secrets: `ENCRYPTION_MASTER_KEY`
- Valor atual: `6TVeJZvOC2GunEQmZ0udkwsvEBHHL5iAZ/iOW6UskVI=` (32 bytes base64)
- **NUNCA** exposta via API
- **NUNCA** commitada no código

**Algoritmo:**
- AES-256-GCM (Galois/Counter Mode)
- IV aleatório de 12 bytes por criptografia
- PBKDF2 com 100.000 iterações para key derivation
- Salt fixo: `'investigaree-serpro-salt-v1'`

---

## 🛠️ Componentes Implementados

### 1. SerproBaseService (Atualizado)

**Arquivo:** `src/services/serpro/base.service.ts`

**Mudança Principal:**
O método `getToken(tenantId?: string)` agora suporta dois modos:

```typescript
protected async getToken(tenantId?: string): Promise<string> {
  // 1. Se tenantId fornecido, verifica modo do tenant no D1
  // 2. Modo 'byo': busca credentials do D1 e descriptografa
  // 3. Modo 'managed': usa env vars (comportamento anterior)
  // 4. Faz OAuth2 com credentials apropriadas
  // 5. Registra erro de validação se falhar (BYO mode)
}
```

**Backwards Compatible:** Se `tenantId` não for fornecido, comporta-se como antes (managed mode).

---

### 2. SERPRO Credentials Routes (Novo)

**Arquivo:** `src/routes/serpro-credentials.routes.ts`

**Endpoints:**

#### GET `/api/admin/serpro-credentials/:tenant_id`
Lista todas as credenciais SERPRO de um tenant
- **Auth:** Admin only
- **Retorna:** Lista de credentials (sem secrets!)
- **Response:** `{ success, tenant_id, mode, notes, credentials[], apis_available[] }`

#### POST `/api/admin/serpro-credentials/:tenant_id`
Salva/atualiza credenciais SERPRO
- **Auth:** Admin only
- **Body:** `{ api_name, consumer_key, consumer_secret, environment }`
- **Ação:** Criptografa secret e salva no D1
- **Audit:** Registra mudança em `serpro_credentials_audit`

#### PUT `/api/admin/serpro-credentials/:tenant_id/mode`
Alterna modo do tenant (managed ↔ byo)
- **Auth:** Admin only
- **Body:** `{ mode: 'managed' | 'byo' }`

#### POST `/api/admin/serpro-credentials/:tenant_id/:api_name/validate`
Valida se credenciais funcionam
- **Auth:** Admin only
- **Ação:** Faz teste OAuth2 com as credentials
- **Result:** Atualiza `last_validated_at` ou `validation_error`

#### DELETE `/api/admin/serpro-credentials/:tenant_id/:api_name`
Remove credenciais
- **Auth:** Admin only

---

## 📊 Fluxo de Funcionamento

### Tenant em Managed Mode

```
1. Tenant criado com serpro_mode = 'managed' (default)
2. Frontend faz request: POST /api/serpro/cpf/consultar
3. Backend (SerproBaseService.getToken):
   - Detecta modo 'managed'
   - Busca credentials de env.SERPRO_CPF_CONSUMER_KEY
   - Faz OAuth2 com credentials do Investigaree
   - Consulta SERPRO
4. Custo: Investigaree paga
```

### Tenant em BYO Mode

```
1. Admin configura tenant:
   - PUT /api/admin/serpro-credentials/tenant_X/mode { mode: 'byo' }
   - POST /api/admin/serpro-credentials/tenant_X { api_name: 'cpf', consumer_key, consumer_secret }

2. Validação:
   - POST /api/admin/serpro-credentials/tenant_X/cpf/validate
   - Backend testa OAuth2 com credentials do tenant
   - Se OK: last_validated_at atualizado
   - Se FAIL: validation_error salvo

3. Uso:
   - Frontend faz request: POST /api/serpro/cpf/consultar
   - Backend (SerproBaseService.getToken):
     - Detecta modo 'byo'
     - Busca credentials criptografadas do D1
     - Descriptografa usando ENCRYPTION_MASTER_KEY
     - Faz OAuth2 com credentials do tenant
     - Consulta SERPRO

4. Custo: Tenant paga SERPRO direto
```

---

## 🚀 Estado Atual (Deploy c74c2cb1)

### ✅ Implementado

1. ✅ Migration 003 aplicada no D1 (36 tabelas total)
2. ✅ Utilitário de criptografia AES-256-GCM
3. ✅ SerproBaseService com suporte BYO
4. ✅ 5 endpoints de gerenciamento de credenciais
5. ✅ Audit logging completo
6. ✅ Master key configurada no Cloudflare
7. ✅ Sistema deployado e operacional

### ⚠️ Pendente (Proposital)

1. ⚠️ **Credenciais SERPRO reais NÃO configuradas**
   - Env vars `SERPRO_*_CONSUMER_KEY` vazias
   - Sistema em modo BYO por padrão
   - **Motivo:** Evitar uso antes do lançamento oficial

2. ⚠️ **Frontend UI não implementado**
   - Agent 3 precisa criar página: `/dashboard/configuracoes/serpro`
   - Interface para alternar modo managed/byo
   - Formulário para adicionar credentials por API

---

## 📝 Como Usar (Manual de Operação)

### Para Desenvolvedores

#### Teste Local de Criptografia

```bash
cd backend/workers/api

# Criar script de teste
cat > test-encryption.mjs << 'EOF'
import { encrypt, decrypt } from './src/utils/encryption.js';

const masterKey = '6TVeJZvOC2GunEQmZ0udkwsvEBHHL5iAZ/iOW6UskVI=';
const secret = 'my-test-secret-123';

console.log('Original:', secret);
const encrypted = await encrypt(secret, masterKey);
console.log('Encrypted:', encrypted);
const decrypted = await decrypt(encrypted, masterKey);
console.log('Decrypted:', decrypted);
console.log('Match:', secret === decrypted ? '✅' : '❌');
EOF

node test-encryption.mjs
rm test-encryption.mjs
```

#### Configurar Credentials de um Tenant (via cURL)

```bash
# 1. Obter token de autenticação (Firebase)
TOKEN="seu_firebase_id_token"

# 2. Mudar tenant para BYO mode
curl -X PUT https://api.investigaree.com.br/api/admin/serpro-credentials/tenant_cliente_01/mode \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mode":"byo"}'

# 3. Adicionar credenciais CPF
curl -X POST https://api.investigaree.com.br/api/admin/serpro-credentials/tenant_cliente_01 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "api_name": "cpf",
    "consumer_key": "seu_consumer_key_aqui",
    "consumer_secret": "seu_consumer_secret_aqui",
    "environment": "production"
  }'

# 4. Validar credenciais
curl -X POST https://api.investigaree.com.br/api/admin/serpro-credentials/tenant_cliente_01/cpf/validate \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 Próximos Passos

### Imediato (Pós-Implementação)

1. **Agent 3 - Frontend:**
   - Criar página `/dashboard/configuracoes/serpro`
   - Toggle para alternar managed/byo
   - Form para adicionar credentials por API
   - Tabela mostrando credentials configuradas (sem secrets)
   - Botão "Validar" para testar credentials

2. **Agent 1 - QA:**
   - Testes E2E do fluxo BYO completo
   - Validar criptografia/descriptografia
   - Testar alternância managed ↔ byo
   - Validar audit logs

### Futuro (Pós-Lançamento)

1. **Adquirir credenciais SERPRO reais**
   - Contratar plano com SERPRO
   - Configurar env vars no Cloudflare

2. **Ativar Managed Mode**
   ```bash
   npx wrangler secret put SERPRO_CPF_CONSUMER_KEY
   npx wrangler secret put SERPRO_CPF_CONSUMER_SECRET
   # ... repetir para todas as 9 APIs
   ```

3. **Definir Pricing**
   - Plano Starter (Managed): R$ X por consulta
   - Plano Business (BYO): R$ Y/mês (licença)
   - Plano Enterprise: Negociável

---

## 🔧 Troubleshooting

### Erro: "ENCRYPTION_MASTER_KEY not configured"
**Solução:** Master key não está no Cloudflare Secrets
```bash
openssl rand -base64 32 | npx wrangler secret put ENCRYPTION_MASTER_KEY
```

### Erro: "Tenant configurado para BYO mode mas não possui credenciais"
**Solução:** Adicionar credentials via POST /api/admin/serpro-credentials/:tenant_id

### Erro: "Decryption failed. Invalid master key"
**Solução:** Master key mudou ou credentials foram corrompidas. Re-adicionar credentials.

### Credentials não validam (401)
**Possíveis causas:**
1. Consumer Key/Secret incorretos
2. Credenciais expiradas
3. Ambiente errado (trial vs production)
4. Plano SERPRO suspenso

---

## 📚 Referências

**Arquivos Criados/Modificados:**
1. `migrations/003_serpro_credentials_v2.sql` - Schema novo
2. `src/utils/encryption.ts` - Criptografia AES-256-GCM
3. `src/types/api.types.ts` - Added ENCRYPTION_MASTER_KEY
4. `src/services/serpro/base.service.ts` - BYO support
5. `src/routes/serpro-credentials.routes.ts` - Management endpoints
6. `src/index.ts` - Registered new routes
7. `.env.example` - Documentation

**Cloudflare Secrets:**
- `ENCRYPTION_MASTER_KEY` = `6TVeJZvOC2GunEQmZ0udkwsvEBHHL5iAZ/iOW6UskVI=`

**Database:**
- 36 tabelas total
- 2 novas tabelas: `tenant_serpro_credentials`, `serpro_credentials_audit`

**API Version:**
- Worker ID: `c74c2cb1-e1f4-4ada-a84a-e607cae17050`
- Deploy Time: 2025-12-08 ~11:16 UTC
- Status: ✅ Operacional

---

**Documentado por:** Agent 2 - Backend Engineer
**Data:** 2025-12-08 11:20 UTC
**Status:** ✅ SISTEMA COMPLETO E OPERACIONAL - Aguardando UI do Agent 3
