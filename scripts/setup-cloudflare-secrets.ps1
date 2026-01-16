# ============================================
# SETUP CLOUDFLARE SECRETS - INVESTIGACAO (PowerShell)
# ============================================
# Este script configura todos os secrets necessários no Cloudflare Workers
# Execute na raiz do projeto: .\scripts\setup-cloudflare-secrets.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔐 Configurando secrets do Cloudflare Workers para INVESTIGACAO" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# FIREBASE
# ============================================
Write-Host "📱 FIREBASE ADMIN CREDENTIALS" -ForegroundColor Yellow
Write-Host "Cole o JSON completo das credenciais do Firebase Admin SDK:"
npx wrangler secret put FIREBASE_ADMIN_CREDENTIALS
Write-Host "✅ FIREBASE_ADMIN_CREDENTIALS configurado`n" -ForegroundColor Green

# ============================================
# OPENAI
# ============================================
Write-Host "🤖 OPENAI API" -ForegroundColor Yellow
Write-Host "Digite sua OpenAI API Key:"
npx wrangler secret put OPENAI_API_KEY
Write-Host "✅ OPENAI_API_KEY configurado`n" -ForegroundColor Green

# ============================================
# GOOGLE
# ============================================
Write-Host "🔍 GOOGLE API" -ForegroundColor Yellow
Write-Host "Digite sua Google API Key:"
npx wrangler secret put GOOGLE_API_KEY
Write-Host "✅ GOOGLE_API_KEY configurado`n" -ForegroundColor Green

# ============================================
# STRIPE
# ============================================
Write-Host "💳 STRIPE" -ForegroundColor Yellow
Write-Host "Digite sua Stripe Secret Key:"
npx wrangler secret put STRIPE_SECRET_KEY

Write-Host "Digite sua Stripe Webhook Secret:"
npx wrangler secret put STRIPE_WEBHOOK_SECRET
Write-Host "✅ STRIPE configurado`n" -ForegroundColor Green

# ============================================
# SEGURANÇA
# ============================================
Write-Host "🔒 SEGURANÇA" -ForegroundColor Yellow

Write-Host "Gerando URL_SECRET automaticamente..."
$URL_SECRET = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host "Gerado: $URL_SECRET"
$URL_SECRET | npx wrangler secret put URL_SECRET

Write-Host "Gerando JWT_SECRET automaticamente..."
$JWT_SECRET = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host "Gerado: $JWT_SECRET"
$JWT_SECRET | npx wrangler secret put JWT_SECRET

Write-Host "Gerando ENCRYPTION_MASTER_KEY automaticamente..."
$ENCRYPTION_KEY = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
Write-Host "Gerado: $ENCRYPTION_KEY"
$ENCRYPTION_KEY | npx wrangler secret put ENCRYPTION_MASTER_KEY

Write-Host "✅ Secrets de segurança configurados`n" -ForegroundColor Green

# ============================================
# API BRASIL
# ============================================
Write-Host "🇧🇷 API BRASIL" -ForegroundColor Yellow
$apibrasilResponse = Read-Host "Você possui credenciais da API Brasil? (s/n)"
if ($apibrasilResponse -eq "s") {
  Write-Host "Digite seu API Brasil Bearer Token:"
  npx wrangler secret put API_BRASIL_BEARER_TOKEN

  Write-Host "Digite seu API Brasil Device Token:"
  npx wrangler secret put API_BRASIL_DEVICE_TOKEN
  Write-Host "✅ API Brasil configurada`n" -ForegroundColor Green
} else {
  Write-Host "⏭️  Pulando API Brasil`n" -ForegroundColor Yellow
}

# ============================================
# DEHASHED
# ============================================
Write-Host "🔓 DEHASHED" -ForegroundColor Yellow
$dehashedResponse = Read-Host "Você possui credenciais do Dehashed? (s/n)"
if ($dehashedResponse -eq "s") {
  Write-Host "Digite seu email do Dehashed:"
  npx wrangler secret put DEHASHED_EMAIL

  Write-Host "Digite sua Dehashed API Key:"
  npx wrangler secret put DEHASHED_API_KEY
  Write-Host "✅ Dehashed configurado`n" -ForegroundColor Green
} else {
  Write-Host "⏭️  Pulando Dehashed`n" -ForegroundColor Yellow
}

# ============================================
# RESEND (EMAIL)
# ============================================
Write-Host "📧 RESEND (Email)" -ForegroundColor Yellow
$resendResponse = Read-Host "Você possui API Key do Resend? (s/n)"
if ($resendResponse -eq "s") {
  Write-Host "Digite sua Resend API Key:"
  npx wrangler secret put RESEND_API_KEY
  Write-Host "✅ Resend configurado`n" -ForegroundColor Green
} else {
  Write-Host "⏭️  Pulando Resend`n" -ForegroundColor Yellow
}

# ============================================
# SERPRO APIs (OPCIONAL)
# ============================================
Write-Host "🏛️  SERPRO APIs" -ForegroundColor Yellow
$serproResponse = Read-Host "Você possui credenciais SERPRO? (s/n)"
if ($serproResponse -eq "s") {
  Write-Host "Digite o Consumer Key da API CPF:"
  npx wrangler secret put SERPRO_CPF_CONSUMER_KEY
  Write-Host "Digite o Consumer Secret da API CPF:"
  npx wrangler secret put SERPRO_CPF_CONSUMER_SECRET

  Write-Host "Digite o Consumer Key da API CNPJ:"
  npx wrangler secret put SERPRO_CNPJ_CONSUMER_KEY
  Write-Host "Digite o Consumer Secret da API CNPJ:"
  npx wrangler secret put SERPRO_CNPJ_CONSUMER_SECRET

  Write-Host "Digite o Consumer Key da API Dívida Ativa:"
  npx wrangler secret put SERPRO_DIVIDA_ATIVA_CONSUMER_KEY
  Write-Host "Digite o Consumer Secret da API Dívida Ativa:"
  npx wrangler secret put SERPRO_DIVIDA_ATIVA_CONSUMER_SECRET

  Write-Host "✅ SERPRO APIs configuradas`n" -ForegroundColor Green
} else {
  Write-Host "⏭️  Pulando SERPRO APIs (modo BYO será usado)`n" -ForegroundColor Yellow
}

# ============================================
# LISTAGEM FINAL
# ============================================
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✅ Configuração de secrets concluída!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para verificar os secrets configurados, execute:"
Write-Host "  npx wrangler secret list"
Write-Host ""
Write-Host "Para adicionar mais secrets no futuro:"
Write-Host "  npx wrangler secret put NOME_DO_SECRET"
Write-Host ""
