# 🚀 CONFIGURAR DOMÍNIO CUSTOM - PASSO A PASSO RÁPIDO

## ✅ Preparação Completa

- ✅ Backend deployado em: `api.investigaree.com.br/*`
- ✅ Frontend buildado com novo API URL
- ✅ CORS atualizado para aceitar investigaree.com.br
- ✅ Favicon adicionado

---

## 📋 PASSO 1: Configurar DNS (Cloudflare Dashboard)

### Acesse DNS Records

1. Vá para: https://dash.cloudflare.com/
2. Selecione a zona: **investigaree.com.br**
3. Clique em **DNS** → **Records**

### Adicionar/Modificar Registros

#### Registro 1: Root Domain (@)
```
Type:    CNAME
Name:    @
Target:  investigaree.pages.dev
Proxy:   ✅ Proxied (ícone laranja)
TTL:     Auto
```

**Se já existir um registro @ apontando para Workers:**
- Clique no registro existente
- Mude o Target para: `investigaree.pages.dev`
- Mantenha Proxy ON
- Clique em **Save**

#### Registro 2: API Subdomain
```
Type:    CNAME
Name:    api
Target:  investigaree.chatbotimoveis.workers.dev
Proxy:   ✅ Proxied (ícone laranja)
TTL:     Auto
```

**Se não existir:**
- Clique em **Add record**
- Preencha os campos acima
- Clique em **Save**

#### Registro 3: WWW (Opcional)
```
Type:    CNAME
Name:    www
Target:  investigaree.pages.dev
Proxy:   ✅ Proxied (ícone laranja)
TTL:     Auto
```

---

## 📋 PASSO 2: Adicionar Custom Domain no Pages

### Acesse Pages Dashboard

1. Vá para: https://dash.cloudflare.com/
2. Clique em **Workers & Pages**
3. Selecione: **investigaree** (Pages project)
4. Clique na aba: **Custom domains**

### Adicionar Domínio

1. Clique em **Set up a custom domain**
2. Digite: `investigaree.com.br`
3. Clique em **Continue**
4. A Cloudflare vai detectar o CNAME automaticamente
5. Clique em **Activate domain**

### Adicionar WWW (Opcional)

1. Clique novamente em **Set up a custom domain**
2. Digite: `www.investigaree.com.br`
3. Clique em **Continue**
4. Clique em **Activate domain**

---

## 🧪 PASSO 3: Testar Configuração

### Testar Backend (API)

```bash
# Health check
curl https://api.investigaree.com.br/health

# Deve retornar:
# {"status":"ok","version":"1.0.0","environment":"production"}

# Chatbot
curl -X POST https://api.investigaree.com.br/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Olá"}'
```

### Testar Frontend

```bash
# Homepage
curl -I https://investigaree.com.br/

# Deve retornar:
# HTTP/1.1 200 OK
# Content-Type: text/html

# Favicon
curl -I https://investigaree.com.br/favicon.svg
```

### Testar no Navegador

1. Acesse: https://investigaree.com.br/
2. Deve carregar a landing page
3. Verifique o favicon no tabuleiro do navegador
4. Abra o DevTools (F12) → Console
5. Não deve ter erros de CORS

---

## ⏱️ Tempo de Propagação

- **DNS**: 5 minutos a 24 horas (geralmente 5-10 minutos com Cloudflare)
- **SSL**: Automático via Cloudflare (Universal SSL)
- **Pages Custom Domain**: Ativação imediata após DNS propagar

### Verificar Propagação DNS

```bash
# Verificar CNAME
nslookup investigaree.com.br

# Verificar CNAME da API
nslookup api.investigaree.com.br

# Ou use: https://dnschecker.org/
```

---

## 📊 Resumo da Arquitetura Final

```
┌─────────────────────────────────────────────────────┐
│                 investigaree.com.br                 │
│                                                     │
│  Frontend (Pages)      →  React SPA                │
│  Landing Page          →  /                        │
│  Dashboard             →  /dashboard               │
│  Login/Register        →  /login, /register        │
│                                                     │
└─────────────────────────────────────────────────────┘
                          ↓
                   Chama API via
                          ↓
┌─────────────────────────────────────────────────────┐
│              api.investigaree.com.br                │
│                                                     │
│  Backend (Workers)     →  Hono API                 │
│  Health Check          →  /health                  │
│  Endpoints             →  /api/*                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Checklist Final

- [ ] DNS: Registro @ (CNAME) → investigaree.pages.dev
- [ ] DNS: Registro api (CNAME) → investigaree.chatbotimoveis.workers.dev
- [ ] DNS: Registro www (CNAME) → investigaree.pages.dev (opcional)
- [ ] Pages: Custom domain `investigaree.com.br` adicionado
- [ ] Pages: Custom domain `www.investigaree.com.br` adicionado (opcional)
- [ ] Teste: `curl https://investigaree.com.br/` → 200 OK
- [ ] Teste: `curl https://api.investigaree.com.br/health` → 200 OK
- [ ] Teste: Navegador → https://investigaree.com.br/ → Landing page carregando
- [ ] Teste: Favicon visível no navegador
- [ ] Teste: DevTools → Sem erros de CORS

---

## 🆘 Troubleshooting

### Erro: "This site can't be reached"
- **Causa**: DNS ainda não propagou
- **Solução**: Aguarde 10-15 minutos e tente novamente

### Erro: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH"
- **Causa**: SSL ainda está sendo provisionado
- **Solução**: Aguarde 5-10 minutos

### Erro: CORS no Frontend
- **Causa**: Backend não aceita requisições do domínio
- **Solução**: Já foi configurado, mas verifique console do navegador

### Frontend carrega mas API não responde
- **Causa**: VITE_API_BASE_URL incorreto
- **Solução**: Verificar `.env` → deve ser `https://api.investigaree.com.br`

### API retorna 404
- **Causa**: Rota não configurada no Workers
- **Solução**: Verificar `wrangler.toml` → deve ter `pattern = "api.investigaree.com.br/*"`

---

## 📞 Comandos Úteis

```bash
# Verificar DNS
dig investigaree.com.br
dig api.investigaree.com.br

# Testar SSL
curl -vI https://investigaree.com.br/

# Ver logs do Workers
npx wrangler tail

# Ver deployments do Pages
npx wrangler pages deployment list --project-name=investigaree

# Redeploy se necessário
npm run build
npx wrangler pages deploy dist --project-name=investigaree
```

---

## 🎉 Após Configuração

URLs finais:
- **Frontend**: https://investigaree.com.br
- **Backend API**: https://api.investigaree.com.br
- **Health**: https://api.investigaree.com.br/health
- **Docs API**: https://api.investigaree.com.br/

**Pronto para produção! 🚀**
