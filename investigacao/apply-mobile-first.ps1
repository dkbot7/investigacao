# Script PowerShell para aplicar mobile-first em todas as páginas do dashboard
# Este script aplica as melhores práticas de 2025 de forma sistemática

$pages = @(
    "src/app/dashboard/beneficios/page.tsx",
    "src/app/dashboard/candidatos/page.tsx",
    "src/app/dashboard/doadores/page.tsx",
    "src/app/dashboard/configuracoes/page.tsx",
    "src/app/dashboard/obitos/page.tsx",
    "src/app/dashboard/sancionados/page.tsx",
    "src/app/dashboard/vinculos/page.tsx",
    "src/app/dashboard/ofac/page.tsx",
    "src/app/dashboard/alertas/page.tsx",
    "src/app/dashboard/exportar/page.tsx",
    "src/app/dashboard/lgpd/page.tsx",
    "src/app/dashboard/consultas/cpf/page.tsx",
    "src/app/dashboard/consultas/cnpj/page.tsx",
    "src/app/dashboard/comurgempresas/page.tsx",
    "src/app/dashboard/comurgobitos/page.tsx",
    "src/app/dashboard/comurgbeneficios/page.tsx",
    "src/app/dashboard/comurgatividadepolitica/page.tsx",
    "src/app/dashboard/comurganaliserisco/page.tsx",
    "src/app/dashboard/comurgachadoscriticos/page.tsx",
    "src/app/dashboard/comurglistasrestritivas/page.tsx",
    "src/app/dashboard/comurgecedidos/page.tsx"
)

function Apply-MobileFirst {
    param($content)

    # Container padding
    $content = $content -replace 'className="p-4 lg:p-8"', 'className="p-4 sm:p-6 lg:p-8"'

    # Spacing
    $content = $content -replace 'className="space-y-6"', 'className="space-y-4 sm:space-y-6"'
    $content = $content -replace 'gap-4"', 'gap-3 sm:gap-4"'
    $content = $content -replace 'gap-3"', 'gap-2 sm:gap-3"'

    # Títulos
    $content = $content -replace 'text-2xl font-bold', 'text-xl sm:text-2xl font-bold'
    $content = $content -replace 'text-3xl font-bold', 'text-2xl sm:text-3xl font-bold'
    $content = $content -replace 'text-xl font', 'text-lg sm:text-xl font'

    # Ícones nos títulos
    $content = $content -replace 'w-7 h-7', 'w-6 h-6 sm:w-7 sm:h-7'
    $content = $content -replace 'w-8 h-8', 'w-6 h-6 sm:w-8 sm:h-8'
    $content = $content -replace 'w-6 h-6(?! sm)', 'w-5 h-5 sm:w-6 sm:h-6'

    # Flex layouts - Stack on mobile
    $content = $content -replace 'flex flex-col lg:flex-row', 'flex flex-col sm:flex-row'
    $content = $content -replace 'flex items-center gap', 'flex flex-col sm:flex-row items-stretch sm:items-center gap'

    # Inputs e Search
    $content = $content -replace 'w-full lg:w-64', 'w-full sm:w-64'
    $content = $content -replace 'pl-9 pr-4 py-2', 'pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5'
    $content = $content -replace 'pl-10 pr-4 py-2', 'pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5'
    $content = $content -replace 'text-sm"', 'text-sm sm:text-base"'

    # Badges
    $content = $content -replace 'px-3 py-1', 'px-2 sm:px-3 py-0.5 sm:py-1'
    $content = $content -replace 'text-xs font', 'text-[10px] sm:text-xs font'

    # Grids
    $content = $content -replace 'grid-cols-2 lg:grid-cols-4', 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
    $content = $content -replace 'grid-cols-1 md:grid-cols-2', 'grid-cols-1 sm:grid-cols-2'
    $content = $content -replace 'grid-cols-1 md:grid-cols-3', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

    # Cards padding
    $content = $content -replace 'rounded-xl p-4(?! sm)', 'rounded-xl p-3 sm:p-4'
    $content = $content -replace 'rounded-xl p-6(?! sm)', 'rounded-xl p-4 sm:p-6'
    $content = $content -replace 'p-2 bg-', 'p-1.5 sm:p-2 bg-'

    # Tabelas
    $content = $content -replace 'py-3 px-4 text-sm', 'py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm'
    $content = $content -replace 'py-3 px-4(?! text)', 'py-2 sm:py-3 px-2 sm:px-4'

    # Botões
    $content = $content -replace 'px-4 py-2(?! sm)', 'px-3 sm:px-4 py-2 sm:py-2.5'
    $content = $content -replace 'w-4 h-4 mr-2', 'w-4 h-4 sm:w-5 sm:h-5 mr-2'
    $content = $content -replace 'w-5 h-5 mr-2', 'w-4 h-4 sm:w-5 sm:h-5 mr-2'

    return $content
}

foreach ($page in $pages) {
    $fullPath = Join-Path $PSScriptRoot $page

    if (Test-Path $fullPath) {
        Write-Host "Processando: $page" -ForegroundColor Green

        $content = Get-Content $fullPath -Raw -Encoding UTF8
        $newContent = Apply-MobileFirst $content

        Set-Content $fullPath -Value $newContent -Encoding UTF8 -NoNewline

        Write-Host "  ✓ Concluído" -ForegroundColor Cyan
    } else {
        Write-Host "  ✗ Arquivo não encontrado: $fullPath" -ForegroundColor Yellow
    }
}

Write-Host "`nProcessamento concluído para todas as páginas!" -ForegroundColor Green
