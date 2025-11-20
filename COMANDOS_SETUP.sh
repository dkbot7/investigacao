#!/bin/bash

# ========================================
# investigaree - Comandos de Setup
# Execute linha por linha conforme necessário
# ========================================

echo "🚀 investigaree - Setup Completo"
echo ""

# ========================================
# 1. INSTALAR DEPENDÊNCIAS
# ========================================

echo "📦 Instalando dependências..."
npm install

# ========================================
# 2. CONFIGURAR CLOUDFLARE WORKERS SECRETS
# ========================================

echo ""
echo "🔐 Configurando secrets do Cloudflare Workers..."
echo "Cole os valores quando solicitado"
echo ""

# Firebase
wrangler secret put FIREBASE_WEB_API_KEY
# Cole a Web API Key do Firebase Console

# Stripe
wrangler secret put STRIPE_SECRET_KEY
# Cole a Secret Key do Stripe (começa com sk_test_ ou sk_live_)

wrangler secret put STRIPE_WEBHOOK_SECRET
# Cole o Webhook Secret do Stripe (começa com whsec_)

# Google Custom Search
wrangler secret put GOOGLE_API_KEY
# Cole a API Key do Google Cloud Console

wrangler secret put GOOGLE_CSE_ID
# Cole o Custom Search Engine ID

# DeHashed
wrangler secret put DEHASHED_EMAIL
# Cole o email da sua conta DeHashed

wrangler secret put DEHASHED_API_KEY
# Cole a API Key do DeHashed

# OpenAI
wrangler secret put OPENAI_API_KEY
# Cole a API Key da OpenAI (começa com sk-)

# Supabase
wrangler secret put SUPABASE_URL
# Cole a URL do projeto Supabase (https://xyz.supabase.co)

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Cole a Service Role Key do Supabase

# CNPJ - BrasilAPI é GRATUITA, mas adicione valores dummy
wrangler secret put API_BRASIL_BEARER_TOKEN
# Cole: "not_needed"

wrangler secret put API_BRASIL_DEVICE_TOKEN
# Cole: "not_needed"

# Secrets gerais
wrangler secret put URL_SECRET
# Cole uma string aleatória longa (para HMAC de URLs)

wrangler secret put JWT_SECRET
# Cole uma string aleatória longa (para JWT)

wrangler secret put ENVIRONMENT
# Cole: "production"

wrangler secret put APP_VERSION
# Cole: "1.0.0"

# ========================================
# 3. CRIAR ARQUIVO .env.local PARA DESENVOLVIMENTO
# ========================================

echo ""
echo "📝 Criando arquivo .env.local..."

cat > .env.local << 'EOF'
# Firebase
FIREBASE_WEB_API_KEY=AIzaSy...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google
GOOGLE_API_KEY=AIzaSy...
GOOGLE_CSE_ID=...

# DeHashed
DEHASHED_EMAIL=seu@email.com
DEHASHED_API_KEY=...

# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# CNPJ - BrasilAPI (GRATUITA - não precisa de credenciais reais)
API_BRASIL_BEARER_TOKEN=not_needed
API_BRASIL_DEVICE_TOKEN=not_needed

# Secrets
URL_SECRET=string_aleatoria_longa
JWT_SECRET=string_aleatoria_longa

# Environment
ENVIRONMENT=development
APP_VERSION=1.0.0
EOF

echo "✅ Arquivo .env.local criado!"
echo "⚠️  IMPORTANTE: Edite o arquivo e preencha os valores reais!"

# ========================================
# 4. CONFIGURAR SUPABASE DATABASE
# ========================================

echo ""
echo "🗄️  Configurando database no Supabase..."
echo "Execute os seguintes comandos no SQL Editor do Supabase:"
echo ""
echo "-- 1. Execute database/001_initial_schema.sql"
echo "-- 2. Execute database/002_rls_policies.sql"
echo ""

# Ou via psql (se tiver acesso direto):
# psql -h sua-instancia.supabase.co -U postgres -d postgres -f database/001_initial_schema.sql
# psql -h sua-instancia.supabase.co -U postgres -d postgres -f database/002_rls_policies.sql

# ========================================
# 5. CONFIGURAR CLOUDFLARE R2 & KV
# ========================================

echo ""
echo "☁️  Configuração necessária no Cloudflare Dashboard:"
echo ""
echo "1. R2 Storage:"
echo "   - Crie bucket: 'investigaree-reports'"
echo "   - Configure CORS para GET requests"
echo ""
echo "2. KV Namespace:"
echo "   - Crie namespace: 'investigaree-rate-limits'"
echo "   - Copie o ID e adicione ao wrangler.toml"
echo ""
echo "3. Browser Rendering:"
echo "   - Ative em Workers & Pages > Browser Rendering"
echo ""

# ========================================
# 6. ATUALIZAR WRANGLER.TOML
# ========================================

echo ""
echo "⚙️  Não esqueça de atualizar wrangler.toml com:"
echo ""
echo "[[kv_namespaces]]"
echo "binding = \"KV\""
echo "id = \"SEU_KV_ID_AQUI\""
echo ""
echo "[[r2_buckets]]"
echo "binding = \"R2\""
echo "bucket_name = \"investigaree-reports\""
echo ""
echo "[browser]"
echo "binding = \"BROWSER\""
echo ""

# ========================================
# 7. TESTAR LOCALMENTE
# ========================================

echo ""
echo "🧪 Para testar localmente:"
echo ""
echo "npm run dev"
echo ""
echo "Acesse: http://localhost:8787"
echo ""

# ========================================
# 8. DEPLOY PARA PRODUÇÃO
# ========================================

echo ""
echo "🚀 Para fazer deploy:"
echo ""
echo "wrangler deploy"
echo ""

# ========================================
# 9. TESTAR WEBHOOKS DO STRIPE (OPCIONAL)
# ========================================

echo ""
echo "🔗 Para testar webhooks do Stripe localmente:"
echo ""
echo "# Instale o Stripe CLI:"
echo "# https://stripe.com/docs/stripe-cli"
echo ""
echo "# Listen webhooks:"
echo "stripe listen --forward-to http://localhost:8787/api/webhooks/stripe"
echo ""
echo "# Trigger evento de teste:"
echo "stripe trigger payment_intent.succeeded"
echo ""

# ========================================
# 10. CONFIGURAR DNS E DOMÍNIO
# ========================================

echo ""
echo "🌐 Após deploy, configure DNS:"
echo ""
echo "1. Adicione domínio no Cloudflare: investigaree.com.br"
echo "2. Configure rota custom em Workers & Pages"
echo "3. Atualize webhook URL no Stripe para:"
echo "   https://investigaree.com.br/api/webhooks/stripe"
echo ""

# ========================================
# 11. COMANDOS ÚTEIS
# ========================================

echo ""
echo "📚 Comandos úteis:"
echo ""
echo "# Ver logs em tempo real"
echo "wrangler tail"
echo ""
echo "# Listar secrets configurados"
echo "wrangler secret list"
echo ""
echo "# Deletar secret"
echo "wrangler secret delete NOME_DO_SECRET"
echo ""
echo "# Testar cron jobs localmente"
echo "wrangler dev --test-scheduled"
echo ""
echo "# Verificar configuração"
echo "wrangler whoami"
echo ""

# ========================================
# CHECKLIST FINAL
# ========================================

echo ""
echo "✅ CHECKLIST DE SETUP COMPLETO:"
echo ""
echo "Backend:"
echo "[ ] Dependências instaladas (npm install)"
echo "[ ] Secrets configurados (wrangler secret put)"
echo "[ ] .env.local criado e preenchido"
echo "[ ] Database migrations executadas"
echo "[ ] R2 bucket criado"
echo "[ ] KV namespace criado"
echo "[ ] Browser Rendering ativado"
echo "[ ] wrangler.toml atualizado"
echo "[ ] Deploy realizado (wrangler deploy)"
echo ""
echo "APIs Externas:"
echo "[ ] Firebase projeto criado"
echo "[ ] Stripe conta criada e webhook configurado"
echo "[ ] Google Cloud projeto criado + Custom Search Engine"
echo "[ ] DeHashed assinatura ativa"
echo "[ ] OpenAI API key gerada"
echo "[ ] Supabase projeto criado"
echo ""
echo "DNS & Produção:"
echo "[ ] Domínio configurado no Cloudflare"
echo "[ ] Rota custom configurada"
echo "[ ] SSL/TLS ativo"
echo "[ ] Webhook do Stripe atualizado com URL de produção"
echo ""

echo ""
echo "🎉 Setup completo! Boa sorte com a investigaree!"
echo ""
echo "📚 Documentação completa em:"
echo "   - README.md"
echo "   - QUICKSTART.md"
echo "   - SETUP_APIS.md"
echo "   - STATUS_IMPLEMENTACAO.md"
echo ""
