# 🚀 investigaree - Guia de Início Rápido

## ✅ O que já está pronto

### 📁 Estrutura Base do Projeto
- ✅ Design System monocromático azul (WCAG AAA compliant)
- ✅ Arquitetura técnica completa documentada
- ✅ Schema de banco de dados Supabase (PostgreSQL)
- ✅ Configurações de projeto (Vite, Wrangler, Tailwind, TypeScript)
- ✅ Documentação completa (README, APIs, LGPD)

---

## 📦 Próximos Passos para Implementação

### 1️⃣ Setup Inicial (30 minutos)

```bash
# 1. Clone ou inicialize o repositório
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
git init
git add .
git commit -m "feat: initial project structure"

# 2. Crie o repositório no GitHub
# Vá para https://github.com/new
# Nome: investigaree
# Descrição: Due Diligence Forense para Investidores Anjo
# Visibilidade: Private (inicialmente)

# 3. Conecte o repositório local ao GitHub
git remote add origin https://github.com/dkbot7/investigaree.git
git branch -M main
git push -u origin main

# 4. Instale as dependências
npm install

# 5. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais reais
```

---

### 2️⃣ Setup Supabase (20 minutos)

```bash
# 1. Crie um projeto em https://supabase.com
# - Nome: investigaree
# - Região: South America (São Paulo)
# - Senha do DB: [senha forte]

# 2. Anote as credenciais:
# - Project URL
# - Anon public key
# - Service role key (secret!)

# 3. Execute as migrations
# No Supabase Dashboard > SQL Editor
# Execute os arquivos na ordem:
# - database/001_initial_schema.sql
# - database/002_rls_policies.sql

# 4. Configure Storage Bucket
# No Supabase Dashboard > Storage
# Criar bucket 'reports' (private)
```

---

### 3️⃣ Setup Firebase (15 minutos)

```bash
# 1. Crie um projeto em https://console.firebase.google.com
# Nome: investigaree

# 2. Ative Authentication:
# - Email/Password
# - Phone (para MFA)

# 3. Registre um Web App
# - Nome: investigaree Web
# - Copie o firebaseConfig

# 4. Gere Service Account (para Workers)
# Project Settings > Service Accounts > Generate new private key
# Baixe o JSON e copie o conteúdo para .env
```

---

### 4️⃣ Setup APIs Externas (30 minutos)

#### Google Custom Search
```bash
# 1. Acesse https://console.cloud.google.com
# 2. Crie novo projeto: investigaree-apis
# 3. Ative APIs:
#    - Custom Search API
#    - Gmail API
# 4. Crie credenciais (API Key)
# 5. Crie Custom Search Engine:
#    https://programmablesearchengine.google.com
#    - Buscar em toda web
#    - Copie Search Engine ID (cx)
```

#### API Brasil
```bash
# 1. Cadastre-se em https://apibrasil.com.br
# 2. Escolha plano (recomendado: Plus - R$ 99/mês)
# 3. Copie Bearer Token e Device Token
```

#### DeHashed
```bash
# 1. Cadastre-se em https://dehashed.com
# 2. Assine plano API ($200/mês recomendado)
# 3. Copie API Key
```

#### OpenAI
```bash
# 1. Cadastre-se em https://platform.openai.com
# 2. Adicione créditos ($10 mínimo)
# 3. Crie API Key
# 4. Anote Organization ID
```

#### Stripe
```bash
# 1. Cadastre-se em https://stripe.com
# 2. Configure para Brasil (BRL)
# 3. Ative métodos: Card, Boleto, Pix
# 4. Copie Publishable Key e Secret Key
# 5. Configure Webhook:
#    - URL: https://investigaree.com.br/api/webhooks/stripe
#    - Eventos: payment_intent.*, customer.subscription.*
#    - Copie Webhook Secret
```

---

### 5️⃣ Setup Cloudflare (20 minutos)

```bash
# 1. Crie conta em https://cloudflare.com
# 2. Adicione domínio investigaree.com.br
# 3. Configure DNS:
#    @ A 192.0.2.1 (proxy on)
#    www CNAME investigaree.com.br (proxy on)

# 4. Workers & Pages > Create Application > Workers
# - Nome: investigaree
# - Anotar Account ID

# 5. Crie KV Namespace
npx wrangler kv:namespace create "KV"
npx wrangler kv:namespace create "KV" --preview
# Copie os IDs para wrangler.toml

# 6. Adicione secrets
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put FIREBASE_ADMIN_CREDENTIALS
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put GOOGLE_API_KEY
npx wrangler secret put API_BRASIL_BEARER_TOKEN
npx wrangler secret put DEHASHED_API_KEY
npx wrangler secret put URL_SECRET
npx wrangler secret put JWT_SECRET
```

---

### 6️⃣ Desenvolvimento Local (5 minutos)

```bash
# Terminal 1: Frontend (Vite)
npm run dev
# Acesse: http://localhost:5173

# Terminal 2: Backend (Wrangler)
npm run wrangler:dev
# Workers rodando em: http://localhost:8787

# Testar integração:
# Frontend faz chamadas para /api/* que o Vite proxy para Workers
```

---

### 7️⃣ Deploy para Produção (10 minutos)

```bash
# 1. Build do projeto
npm run build

# 2. Deploy Workers + Assets
npm run wrangler:deploy

# 3. Configurar domínio customizado
# No Cloudflare Dashboard:
# Workers & Pages > investigaree > Settings > Triggers
# Custom Domains > Add: investigaree.com.br

# 4. Verificar deploy
# https://investigaree.com.br
```

---

## 🧪 Checklist de Testes

### ✅ Frontend
- [ ] Landing page carrega sem erros
- [ ] Formulário de captação funciona
- [ ] Validações estão corretas
- [ ] Design system está aplicado
- [ ] Mobile responsivo

### ✅ Backend / APIs
- [ ] POST /api/leads cria lead no Supabase
- [ ] Firebase Auth funciona (login/register)
- [ ] Stripe checkout abre corretamente
- [ ] Webhook Stripe processa pagamentos
- [ ] APIs externas retornam dados

### ✅ Banco de Dados
- [ ] Tabelas criadas corretamente
- [ ] RLS policies funcionando
- [ ] Inserts/Selects funcionam
- [ ] Storage bucket aceita uploads

### ✅ Segurança
- [ ] .env não está no Git
- [ ] Secrets configurados no Workers
- [ ] CORS configurado corretamente
- [ ] Rate limiting funcionando

---

## 📋 Ordem de Implementação Recomendada

### Sprint 1: Core Foundation (Semana 1)
1. ✅ Setup completo de infraestrutura
2. Landing page básica
3. Formulário de captação de leads
4. Integração Supabase (salvar leads)

### Sprint 2: Autenticação e Pagamento (Semana 2)
5. Firebase Authentication
6. Dashboard do usuário
7. Stripe Checkout
8. Webhook Stripe

### Sprint 3: Geração de Relatórios (Semanas 3-4)
9. Integração Google Custom Search
10. Integração API Brasil (CNPJ)
11. Integração DeHashed
12. OpenAI para análise
13. Geração de PDF
14. Upload Supabase Storage

### Sprint 4: Chatbot e Refinamentos (Semana 5)
15. Chatbot OpenAI Assistants
16. Notificações por email
17. Dashboard de métricas
18. Ajustes de UX

### Sprint 5: SEO e Lançamento (Semana 6)
19. Bing SEO (IndexNow)
20. Meta tags e Open Graph
21. Sitemap e robots.txt
22. Testes finais
23. 🚀 Lançamento

---

## 🆘 Troubleshooting Comum

### "Cannot find module '@/*'"
```bash
# Problema: Alias paths não configurados
# Solução: Verificar tsconfig.json e vite.config.ts
```

### "Supabase client error"
```bash
# Problema: Variáveis de ambiente não carregadas
# Solução: Reiniciar dev server após editar .env
```

### "Wrangler deploy failed"
```bash
# Problema: Secrets não configurados
# Solução: Rodar npx wrangler secret list para ver o que falta
```

### "CORS error no frontend"
```bash
# Problema: Cloudflare não configurado para permitir origem
# Solução: Adicionar middleware CORS no Workers
```

---

## 🔗 Links Úteis

- **Documentação Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Supabase Docs**: https://supabase.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **OpenAI API Docs**: https://platform.openai.com/docs
- **shadcn/ui Components**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 💡 Dicas Importantes

1. **Nunca commite .env** - Use .env.example como template
2. **Teste localmente primeiro** - Antes de deploy, valide tudo em dev
3. **Use Wrangler tail** - Para debug em tempo real dos Workers
4. **Monitore custos de APIs** - Especialmente OpenAI e DeHashed
5. **Backup do banco** - Supabase faz isso automaticamente, mas valide
6. **Versionamento semântico** - Use commits descritivos (feat, fix, docs)
7. **LGPD é obrigatório** - Não pule a implementação dos termos e consentimentos

---

## 📞 Suporte

Se tiver dúvidas durante o setup:
- 📧 Email: contato@investigaree.com.br
- 📱 WhatsApp: (47) 99261-1117

---

**Preparado por: Claude (Anthropic)**
**Data: 20/01/2025**
**Versão: 1.0**

🔵 investigaree - Protegendo investimentos com inteligência
