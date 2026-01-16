@echo off
echo ========================================
echo DEPLOY INVESTIGAREE - CLOUDFLARE PAGES
echo ========================================
echo.

echo [1/3] Building...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Deploying to Cloudflare Pages...
call npx wrangler pages deploy out --project-name=investigaree --commit-dirty=true
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Deploy failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo DEPLOY COMPLETO!
echo ========================================
echo Acesse a URL acima para testar
echo.
pause
