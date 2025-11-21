# 🌐 Configurar Domínio Custom no Cloudflare Pages

## Passo a Passo: investigaree.com.br → Cloudflare Pages

---

## Opção 1: Via Dashboard da Cloudflare (Recomendado)

### 1. Acessar Cloudflare Pages Dashboard

1. Acesse: https://dash.cloudflare.com/
2. Navegue para: **Workers & Pages** → **investigaree**
3. Clique na aba **Custom domains**

### 2. Adicionar Domínio Custom

1. Clique em **Set up a custom domain**
2. Digite: `investigaree.com.br`
3. Clique em **Continue**

### 3. Configurar DNS

A Cloudflare irá detectar automaticamente seu domínio e criar os registros DNS necessários:

**Registro CNAME que será criado:**
```
Type:  CNAME
Name:  investigaree.com.br
Target: investigaree.pages.dev
Proxy: ✅ Proxied (laranja)
```

**Adicionar também o www (opcional mas recomendado):**
```
Type:  CNAME
Name:  www
Target: investigaree.pages.dev
Proxy: ✅ Proxied (laranja)
```

### 4. Confirmar

1. Clique em **Activate domain**
2. Aguarde a propagação DNS (pode levar de 5 minutos a 24 horas)
3. O SSL será provisionado automaticamente

---

## Opção 2: Via Cloudflare API (Avançado)

Se preferir usar a API diretamente:

```bash
# Obter Zone ID do domínio investigaree.com.br
curl -X GET "https://api.cloudflare.com/client/v4/zones?name=investigaree.com.br" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"

# Criar registro CNAME
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/dns_records" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "investigaree.com.br",
    "content": "investigaree.pages.dev",
    "proxied": true
  }'
```

---

## Opção 3: Manualmente via DNS Records

Se quiser fazer manualmente:

1. Vá para: **DNS** → **Records**
2. Adicione um novo registro:

```
Type:    CNAME
Name:    @  (ou investigaree.com.br)
Target:  investigaree.pages.dev
Proxy:   ON (ícone laranja)
TTL:     Auto
```

3. (Opcional) Adicione www:

```
Type:    CNAME
Name:    www
Target:  investigaree.pages.dev
Proxy:   ON (ícone laranja)
TTL:     Auto
```

---

## Verificar Configuração

### 1. Verificar DNS
```bash
# Verificar se o CNAME foi criado
nslookup investigaree.com.br
dig investigaree.com.br CNAME

# Deve retornar algo como:
# investigaree.com.br CNAME investigaree.pages.dev
```

### 2. Testar Acesso
```bash
# Testar HTTP
curl -I https://investigaree.com.br/

# Deve retornar 200 OK
```

### 3. Verificar SSL
- Acesse: https://investigaree.com.br/
- Clique no cadeado 🔒 no navegador
- Verifique se o certificado é válido

---

## Configuração Atual

### ✅ Backend (Workers)
- **URL**: https://investigaree.chatbotimoveis.workers.dev
- **Custom Domain**: investigaree.com.br/* (já configurado)
- **Rotas**: API em `/api/*` e `/health`

### ⚠️ Frontend (Pages)
- **URL Atual**: https://a8c4fc79.investigaree.pages.dev
- **Custom Domain**: Ainda não configurado
- **URL Desejada**: https://investigaree.com.br/ (root)

---

## Problema: Conflito de Domínio

**ATENÇÃO**: O domínio `investigaree.com.br` está atualmente configurado para o **Workers** (backend).

### Soluções:

#### Opção A: Subdomínio para Frontend (Recomendado)
```
Backend (Workers):  api.investigaree.com.br
Frontend (Pages):   investigaree.com.br
```

**Passos:**
1. Mudar o Workers para usar `api.investigaree.com.br`
2. Configurar Pages para usar `investigaree.com.br`

#### Opção B: Subdomínio para Backend
```
Frontend (Pages):   investigaree.com.br
Backend (Workers):  api.investigaree.com.br
```

**Passos:**
1. Configurar Pages para `investigaree.com.br`
2. Manter Workers em `api.investigaree.com.br`
3. Atualizar `.env` do frontend: `VITE_API_BASE_URL=https://api.investigaree.com.br`

#### Opção C: App Subdomain para Frontend
```
Backend (Workers):  investigaree.com.br/api/*
Frontend (Pages):   app.investigaree.com.br
```

---

## Recomendação Final

### 🎯 Arquitetura Recomendada

```
investigaree.com.br              → Cloudflare Pages (Frontend)
api.investigaree.com.br          → Cloudflare Workers (Backend API)
www.investigaree.com.br          → Redirect para investigaree.com.br
```

### Comandos para Implementar:

```bash
# 1. Remover rota atual do Workers
# Editar wrangler.toml e comentar:
# [[routes]]
# pattern = "investigaree.com.br/*"
# zone_name = "investigaree.com.br"

# 2. Adicionar nova rota para api subdomain
[[routes]]
pattern = "api.investigaree.com.br/*"
zone_name = "investigaree.com.br"

# 3. Redeploy Workers
npx wrangler deploy

# 4. Atualizar .env do frontend
VITE_API_BASE_URL=https://api.investigaree.com.br

# 5. Rebuild e redeploy frontend
npm run build
npx wrangler pages deploy dist --project-name=investigaree

# 6. Configurar DNS
# CNAME @ → investigaree.pages.dev (Frontend)
# CNAME api → Cloudflare Workers (Backend)
```

---

## Checklist de Configuração

- [ ] Decidir arquitetura (root para frontend ou backend?)
- [ ] Remover/Mover rota atual do Workers
- [ ] Adicionar CNAME no DNS
- [ ] Adicionar domínio custom no Pages Dashboard
- [ ] Atualizar VITE_API_BASE_URL no `.env`
- [ ] Rebuild e redeploy frontend
- [ ] Testar frontend: `curl https://investigaree.com.br/`
- [ ] Testar backend: `curl https://api.investigaree.com.br/health`
- [ ] Verificar SSL
- [ ] Atualizar CORS no backend para incluir novo domínio

---

## Suporte

Se tiver problemas:
1. Verificar propagação DNS: https://dnschecker.org/#CNAME/investigaree.com.br
2. Verificar logs do Workers: `npx wrangler tail`
3. Verificar logs do Pages: Dashboard → investigaree → Logs
