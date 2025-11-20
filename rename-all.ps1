# Script para renomear startintel e investigacaodigitalpericiaforense para investigaree

$rootPath = "C:\Users\Vaio\Documents\TRABALHO\INVESTIGA"

Write-Host "Iniciando substituicoes..." -ForegroundColor Green

# Buscar todos os arquivos relevantes
$files = Get-ChildItem -Path $rootPath -Recurse -Include *.json,*.md,*.ts,*.js,*.toml,*.sh -File

$totalFiles = $files.Count
$processedFiles = 0

foreach ($file in $files) {
    $processedFiles++
    Write-Host "[$processedFiles/$totalFiles] Processando: $($file.Name)" -ForegroundColor Cyan

    try {
        # Ler conteudo
        $content = Get-Content $file.FullName -Raw -Encoding UTF8

        # Fazer substituicoes (case-sensitive e case-insensitive)
        $originalContent = $content

        $content = $content -replace 'startintel\.com\.br', 'investigaree.com.br'
        $content = $content -replace 'startintel', 'investigaree'
        $content = $content -replace 'StartIntel', 'Investigaree'
        $content = $content -replace 'STARTINTEL', 'INVESTIGAREE'

        $content = $content -replace 'investigacaodigitalpericiaforense\.com\.br', 'investigaree.com.br'
        $content = $content -replace 'investigacaodigitalpericiaforense', 'investigaree'

        $content = $content -replace 'dkbot7/startintel', 'dkbot7/investigaree'

        # Salvar se houve mudancas
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  Atualizado" -ForegroundColor Green
        } else {
            Write-Host "  Sem alteracoes" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "  Erro: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Concluido! $processedFiles arquivos processados." -ForegroundColor Green
