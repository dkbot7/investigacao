# ============================================
# SETUP SCRIPT - investigaree
# ============================================
# Execute: .\scripts\setup.ps1
# Requer: Node.js 18+, npm, wrangler

param(
    [switch]$Local,      # Setup local apenas
    [switch]$Production, # Deploy para producao
    [switch]$SkipDB      # Pular setup do banco
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  investigaree - Setup Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "[1/7] Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Node.js nao encontrado. Instale em https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green

# Verificar npm
$npmVersion = npm --version 2>$null
Write-Host "  npm: $npmVersion" -ForegroundColor Green

# Verificar wrangler
Write-Host "[2/7] Verificando Wrangler CLI..." -ForegroundColor Yellow
$wranglerVersion = npx wrangler --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Instalando Wrangler..." -ForegroundColor Yellow
    npm install -g wrangler
}
Write-Host "  Wrangler: OK" -ForegroundColor Green

# Instalar dependencias raiz
Write-Host "[3/7] Instalando dependencias (raiz)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao instalar dependencias" -ForegroundColor Red
    exit 1
}
Write-Host "  Dependencias raiz: OK" -ForegroundColor Green

# Instalar dependencias frontend
Write-Host "[4/7] Instalando dependencias (frontend)..." -ForegroundColor Yellow
Set-Location investigaree
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao instalar dependencias do frontend" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "  Dependencias frontend: OK" -ForegroundColor Green

# Verificar .env.local
Write-Host "[5/7] Verificando configuracao..." -ForegroundColor Yellow
$envFile = "investigaree/.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "  Criando .env.local..." -ForegroundColor Yellow
    Copy-Item "investigaree/.env.example" $envFile -ErrorAction SilentlyContinue
    if (-not (Test-Path $envFile)) {
        @"
# Firebase (obrigatorio)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# API URL
NEXT_PUBLIC_API_URL=http://localhost:8787
"@ | Out-File -FilePath $envFile -Encoding utf8
    }
    Write-Host "  ATENCAO: Configure as variaveis em $envFile" -ForegroundColor Yellow
} else {
    Write-Host "  .env.local: OK" -ForegroundColor Green
}

# Setup do banco D1
if (-not $SkipDB) {
    Write-Host "[6/7] Configurando banco de dados D1..." -ForegroundColor Yellow

    if ($Local) {
        Write-Host "  Executando migrations (local)..." -ForegroundColor Yellow
        npx wrangler d1 execute investigaree-db --local --file=scripts/setup-database.sql
    } else {
        Write-Host "  Executando migrations (remoto)..." -ForegroundColor Yellow
        npx wrangler d1 execute investigaree-db --file=scripts/setup-database.sql
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Banco de dados: OK" -ForegroundColor Green
    } else {
        Write-Host "  AVISO: Erro nas migrations (pode ja estar configurado)" -ForegroundColor Yellow
    }
} else {
    Write-Host "[6/7] Pulando setup do banco..." -ForegroundColor Yellow
}

# Build ou deploy
Write-Host "[7/7] Finalizando..." -ForegroundColor Yellow

if ($Production) {
    Write-Host "  Fazendo build do frontend..." -ForegroundColor Yellow
    Set-Location investigaree
    npm run build
    Set-Location ..

    Write-Host "  Fazendo deploy do worker..." -ForegroundColor Yellow
    npx wrangler deploy

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  Deploy concluido!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  Setup concluido!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Cyan
    Write-Host "  1. Configure as variaveis em investigaree/.env.local" -ForegroundColor White
    Write-Host "  2. Inicie o frontend: cd investigaree && npm run dev" -ForegroundColor White
    Write-Host "  3. Inicie o backend:  npx wrangler dev" -ForegroundColor White
    Write-Host ""
    Write-Host "URLs:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  Backend:  http://localhost:8787" -ForegroundColor White
}

Write-Host ""
