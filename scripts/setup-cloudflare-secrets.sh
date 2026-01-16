#!/bin/bash

# ============================================
# SETUP CLOUDFLARE SECRETS - INVESTIGACAO
# ============================================
# Este script configura todos os secrets necessários no Cloudflare Workers
# Execute na raiz do projeto: bash scripts/setup-cloudflare-secrets.sh

set -e

echo "🔐 Configurando secrets do Cloudflare Workers para INVESTIGACAO"
echo "=================================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# FIREBASE
# ============================================
echo -e "${YELLOW}📱 FIREBASE ADMIN CREDENTIALS${NC}"
echo "Cole o JSON completo das credenciais do Firebase Admin SDK:"
npx wrangler secret put FIREBASE_ADMIN_CREDENTIALS
echo -e "${GREEN}✅ FIREBASE_ADMIN_CREDENTIALS configurado${NC}\n"

# ============================================
# OPENAI
# ============================================
echo -e "${YELLOW}🤖 OPENAI API${NC}"
echo "Digite sua OpenAI API Key:"
npx wrangler secret put OPENAI_API_KEY
echo -e "${GREEN}✅ OPENAI_API_KEY configurado${NC}\n"

# ============================================
# GOOGLE
# ============================================
echo -e "${YELLOW}🔍 GOOGLE API${NC}"
echo "Digite sua Google API Key:"
npx wrangler secret put GOOGLE_API_KEY
echo -e "${GREEN}✅ GOOGLE_API_KEY configurado${NC}\n"

# ============================================
# STRIPE
# ============================================
echo -e "${YELLOW}💳 STRIPE${NC}"
echo "Digite sua Stripe Secret Key:"
npx wrangler secret put STRIPE_SECRET_KEY

echo "Digite sua Stripe Webhook Secret:"
npx wrangler secret put STRIPE_WEBHOOK_SECRET
echo -e "${GREEN}✅ STRIPE configurado${NC}\n"

# ============================================
# SEGURANÇA
# ============================================
echo -e "${YELLOW}🔒 SEGURANÇA${NC}"
echo "Digite a URL_SECRET (ou deixe vazio para gerar automaticamente):"
read URL_SECRET_INPUT
if [ -z "$URL_SECRET_INPUT" ]; then
  URL_SECRET_INPUT=$(openssl rand -base64 32)
  echo "Gerado automaticamente: $URL_SECRET_INPUT"
fi
echo "$URL_SECRET_INPUT" | npx wrangler secret put URL_SECRET

echo "Digite a JWT_SECRET (ou deixe vazio para gerar automaticamente):"
read JWT_SECRET_INPUT
if [ -z "$JWT_SECRET_INPUT" ]; then
  JWT_SECRET_INPUT=$(openssl rand -base64 32)
  echo "Gerado automaticamente: $JWT_SECRET_INPUT"
fi
echo "$JWT_SECRET_INPUT" | npx wrangler secret put JWT_SECRET

echo "Digite a ENCRYPTION_MASTER_KEY (ou deixe vazio para gerar automaticamente):"
read ENCRYPTION_KEY_INPUT
if [ -z "$ENCRYPTION_KEY_INPUT" ]; then
  ENCRYPTION_KEY_INPUT=$(openssl rand -base64 32)
  echo "Gerado automaticamente: $ENCRYPTION_KEY_INPUT"
fi
echo "$ENCRYPTION_KEY_INPUT" | npx wrangler secret put ENCRYPTION_MASTER_KEY
echo -e "${GREEN}✅ Secrets de segurança configurados${NC}\n"

# ============================================
# API BRASIL
# ============================================
echo -e "${YELLOW}🇧🇷 API BRASIL${NC}"
read -p "Você possui credenciais da API Brasil? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  echo "Digite seu API Brasil Bearer Token:"
  npx wrangler secret put API_BRASIL_BEARER_TOKEN

  echo "Digite seu API Brasil Device Token:"
  npx wrangler secret put API_BRASIL_DEVICE_TOKEN
  echo -e "${GREEN}✅ API Brasil configurada${NC}\n"
else
  echo -e "${YELLOW}⏭️  Pulando API Brasil${NC}\n"
fi

# ============================================
# DEHASHED
# ============================================
echo -e "${YELLOW}🔓 DEHASHED${NC}"
read -p "Você possui credenciais do Dehashed? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  echo "Digite seu email do Dehashed:"
  npx wrangler secret put DEHASHED_EMAIL

  echo "Digite sua Dehashed API Key:"
  npx wrangler secret put DEHASHED_API_KEY
  echo -e "${GREEN}✅ Dehashed configurado${NC}\n"
else
  echo -e "${YELLOW}⏭️  Pulando Dehashed${NC}\n"
fi

# ============================================
# RESEND (EMAIL)
# ============================================
echo -e "${YELLOW}📧 RESEND (Email)${NC}"
read -p "Você possui API Key do Resend? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  echo "Digite sua Resend API Key:"
  npx wrangler secret put RESEND_API_KEY
  echo -e "${GREEN}✅ Resend configurado${NC}\n"
else
  echo -e "${YELLOW}⏭️  Pulando Resend${NC}\n"
fi

# ============================================
# SERPRO APIs (OPCIONAL)
# ============================================
echo -e "${YELLOW}🏛️  SERPRO APIs${NC}"
read -p "Você possui credenciais SERPRO? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  echo "Digite o Consumer Key da API CPF:"
  npx wrangler secret put SERPRO_CPF_CONSUMER_KEY
  echo "Digite o Consumer Secret da API CPF:"
  npx wrangler secret put SERPRO_CPF_CONSUMER_SECRET

  echo "Digite o Consumer Key da API CNPJ:"
  npx wrangler secret put SERPRO_CNPJ_CONSUMER_KEY
  echo "Digite o Consumer Secret da API CNPJ:"
  npx wrangler secret put SERPRO_CNPJ_CONSUMER_SECRET

  echo "Digite o Consumer Key da API Dívida Ativa:"
  npx wrangler secret put SERPRO_DIVIDA_ATIVA_CONSUMER_KEY
  echo "Digite o Consumer Secret da API Dívida Ativa:"
  npx wrangler secret put SERPRO_DIVIDA_ATIVA_CONSUMER_SECRET

  echo -e "${GREEN}✅ SERPRO APIs configuradas${NC}\n"
else
  echo -e "${YELLOW}⏭️  Pulando SERPRO APIs (modo BYO será usado)${NC}\n"
fi

# ============================================
# LISTAGEM FINAL
# ============================================
echo ""
echo "=================================================="
echo -e "${GREEN}✅ Configuração de secrets concluída!${NC}"
echo "=================================================="
echo ""
echo "Para verificar os secrets configurados, execute:"
echo "  npx wrangler secret list"
echo ""
echo "Para adicionar mais secrets no futuro:"
echo "  npx wrangler secret put NOME_DO_SECRET"
echo ""
