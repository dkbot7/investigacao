# 🔐 Guia: Configurar Secrets SERPRO no Cloudflare Dashboard

**Agent:** Agent 2 (Backend Engineer)
**Data:** 2025-12-07
**Worker:** investigaree-api

---

## 📋 Resumo

Você precisa adicionar **6 secrets** no Cloudflare Dashboard para que o backend possa fazer chamadas às APIs SERPRO.

**Status atual:**
- ✅ API CPF: Credenciais encontradas no `.env`
- ❌ API CNPJ: Token vazio (precisa obter)
- ❌ API Dívida Ativa: Token vazio (precisa obter)

---

## 🌐 Passo 1: Acessar Cloudflare Dashboard

1. Abra o navegador e acesse: **https://dash.cloudflare.com/**
2. Faça login com: **chatbotimoveis@gmail.com**
3. No menu lateral esquerdo, clique em **"Workers & Pages"**
4. Na lista de workers, clique em: **investigaree-api**

---

## ⚙️ Passo 2: Ir para Configurações

1. Na página do worker `investigaree-api`, clique na aba **"Settings"**
2. Role a página até encontrar a seção **"Variables and Secrets"**
3. Você verá a lista de variáveis já configuradas (se houver)

---

## ➕ Passo 3: Adicionar os Secrets

### Secret 1: SERPRO_CPF_CONSUMER_KEY ✅ (Credencial encontrada)

1. Clique no botão **"Add variable"**
2. Preencha:
   - **Variable name:** `SERPRO_CPF_CONSUMER_KEY`
   - **Type:** Selecione **"Encrypt"** (cadeado 🔒)
   - **Value:** `3q4kLDgTu__vUqPfaXQ07MUMOPIa`
3. Clique em **"Save"**

---

### Secret 2: SERPRO_CPF_CONSUMER_SECRET ✅ (Credencial encontrada)

1. Clique no botão **"Add variable"** novamente
2. Preencha:
   - **Variable name:** `SERPRO_CPF_CONSUMER_SECRET`
   - **Type:** Selecione **"Encrypt"** (cadeado 🔒)
   - **Value:** `D_G99Fg5wHO10PNGYP49IYo2EaAa`
3. Clique em **"Save"**

---

### Secret 3: SERPRO_CNPJ_CONSUMER_KEY ❌ (Precisa obter)

**⚠️ IMPORTANTE:** Este token está **vazio** no arquivo `.env`.

**Como obter:**
1. Acesse: https://loja.serpro.gov.br
2. Faça login com **certificado digital e-CNPJ**
3. Vá em **"Gestão de Chaves"**
4. Localize o **CONTRATO 260009** (Consulta CNPJ V2)
5. Clique em **"Visualizar chaves"**
6. Copie o **Consumer Key** (Client ID)

**Depois de obter:**
1. No Cloudflare Dashboard, clique em **"Add variable"**
2. Preencha:
   - **Variable name:** `SERPRO_CNPJ_CONSUMER_KEY`
   - **Type:** **"Encrypt"**
   - **Value:** [Cole o Consumer Key aqui]
3. Clique em **"Save"**

---

### Secret 4: SERPRO_CNPJ_CONSUMER_SECRET ❌ (Precisa obter)

**⚠️ IMPORTANTE:** Este token está **vazio** no arquivo `.env`.

**Como obter:**
1. No mesmo local (Gestão de Chaves → CONTRATO 260009)
2. Copie o **Consumer Secret** (Token)

**Depois de obter:**
1. No Cloudflare Dashboard, clique em **"Add variable"**
2. Preencha:
   - **Variable name:** `SERPRO_CNPJ_CONSUMER_SECRET`
   - **Type:** **"Encrypt"**
   - **Value:** [Cole o Consumer Secret aqui]
3. Clique em **"Save"**

---

### Secret 5: SERPRO_DIVIDA_ATIVA_CONSUMER_KEY ❌ (Precisa obter)

**⚠️ IMPORTANTE:** Este token está **vazio** no arquivo `.env`.

**Como obter:**
1. Acesse: https://loja.serpro.gov.br
2. Vá em **"Gestão de Chaves"**
3. Localize o **CONTRATO 261069** (Consulta Dívida Ativa)
4. Clique em **"Visualizar chaves"**
5. Copie o **Consumer Key**

**Depois de obter:**
1. No Cloudflare Dashboard, clique em **"Add variable"**
2. Preencha:
   - **Variable name:** `SERPRO_DIVIDA_ATIVA_CONSUMER_KEY`
   - **Type:** **"Encrypt"**
   - **Value:** [Cole o Consumer Key aqui]
3. Clique em **"Save"**

---

### Secret 6: SERPRO_DIVIDA_ATIVA_CONSUMER_SECRET ❌ (Precisa obter)

**Como obter:**
1. No mesmo local (Gestão de Chaves → CONTRATO 261069)
2. Copie o **Consumer Secret**

**Depois de obter:**
1. No Cloudflare Dashboard, clique em **"Add variable"**
2. Preencha:
   - **Variable name:** `SERPRO_DIVIDA_ATIVA_CONSUMER_SECRET`
   - **Type:** **"Encrypt"**
   - **Value:** [Cole o Consumer Secret aqui]
3. Clique em **"Save"**

---

## 💾 Passo 4: Salvar e Deploy

Após adicionar todos os secrets:

1. Clique no botão **"Save and Deploy"** (ou "Deploy")
2. O worker será automaticamente **re-deployado** com os novos secrets
3. Aguarde alguns segundos até o deploy completar

---

## ✅ Passo 5: Verificar

Após o deploy, teste se os secrets foram configurados corretamente:

### Teste 1: Health Check (sempre funciona)
```bash
curl https://investigaree-api.chatbotimoveis.workers.dev/health
```

**Resposta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-07T...",
  "checks": { "database": "ok" }
}
```

### Teste 2: Consulta CPF (requer autenticação + secrets)
```bash
# Você precisará de um token Firebase válido
curl -X POST https://investigaree-api.chatbotimoveis.workers.dev/api/serpro/cpf/consulta \
  -H "Authorization: Bearer <seu-firebase-token>" \
  -H "X-Tenant-Code: TENANT001" \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678900"}'
```

**Se os secrets estiverem corretos:**
- Status 200 + dados do CPF

**Se os secrets estiverem incorretos:**
- Status 401 ou 500
- Error: "Failed to get SERPRO token"

---

## 📊 Checklist Final

### Secrets Configurados:
- [ ] `SERPRO_CPF_CONSUMER_KEY` ✅ (credencial encontrada)
- [ ] `SERPRO_CPF_CONSUMER_SECRET` ✅ (credencial encontrada)
- [ ] `SERPRO_CNPJ_CONSUMER_KEY` ⏳ (precisa obter)
- [ ] `SERPRO_CNPJ_CONSUMER_SECRET` ⏳ (precisa obter)
- [ ] `SERPRO_DIVIDA_ATIVA_CONSUMER_KEY` ⏳ (precisa obter)
- [ ] `SERPRO_DIVIDA_ATIVA_CONSUMER_SECRET` ⏳ (precisa obter)

### Após Configurar:
- [ ] Deploy realizado automaticamente
- [ ] Health check funcionando
- [ ] Teste de consulta CPF realizado
- [ ] Teste de consulta CNPJ realizado
- [ ] Teste de consulta Dívida Ativa realizado

---

## 🆘 Troubleshooting

### Problema: "SERPRO ${apiName} credentials not configured"

**Causa:** Secret não foi adicionado ou nome está errado

**Solução:**
1. Verifique se o nome do secret está **exatamente** como especificado (case-sensitive)
2. Verifique se selecionou **"Encrypt"** (e não "Text")
3. Faça um novo deploy: Settings → Quick edit → Save and deploy

---

### Problema: "Failed to get SERPRO token: 401"

**Causa:** Consumer Key ou Secret incorretos

**Solução:**
1. Volte na Loja SERPRO e confirme as credenciais
2. Atualize o secret no Cloudflare com o valor correto
3. Re-deploy do worker

---

### Problema: Worker não re-deploya após adicionar secrets

**Solução:**
1. Vá em **"Deployments"** (aba no topo)
2. Clique em **"View details"** no deployment mais recente
3. Clique em **"Manage deployment"** → **"Promote to production"**

---

## 📁 Referências

- **Documentação Loja SERPRO:** https://loja.serpro.gov.br
- **API Center SERPRO:** https://apicenter.estaleiro.serpro.gov.br/documentacao/
- **Guia de Tokens:** `APIs/SERPRO/COMO_OBTER_TOKENS.md`
- **Credenciais atuais:** `APIs/SERPRO/.env` (linha 40-148)
- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/

---

## 🎯 Resumo Rápido (TL;DR)

1. Acesse: https://dash.cloudflare.com/ → Workers & Pages → investigaree-api → Settings
2. Adicione **6 secrets** (3 APIs × 2 credenciais):
   - `SERPRO_CPF_CONSUMER_KEY` ← `3q4kLDgTu__vUqPfaXQ07MUMOPIa` ✅
   - `SERPRO_CPF_CONSUMER_SECRET` ← `D_G99Fg5wHO10PNGYP49IYo2EaAa` ✅
   - `SERPRO_CNPJ_CONSUMER_KEY` ← ⏳ obter na Loja SERPRO
   - `SERPRO_CNPJ_CONSUMER_SECRET` ← ⏳ obter na Loja SERPRO
   - `SERPRO_DIVIDA_ATIVA_CONSUMER_KEY` ← ⏳ obter na Loja SERPRO
   - `SERPRO_DIVIDA_ATIVA_CONSUMER_SECRET` ← ⏳ obter na Loja SERPRO
3. Clique em **"Save and Deploy"**
4. Teste: `curl https://investigaree-api.chatbotimoveis.workers.dev/health`

---

**Status:** 2/6 secrets disponíveis (API CPF completa)
**Próximo passo:** Obter credenciais CNPJ e Dívida Ativa na Loja SERPRO
