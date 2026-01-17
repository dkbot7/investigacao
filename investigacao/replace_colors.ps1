$allFiles = Get-ChildItem -Path 'C:\Users\Vaio\Documents\TRABALHO\INVESTIGACAO2\investigacao\src' -Recurse -Include '*.tsx','*.ts','*.css' -Exclude 'compiledPosts.ts'
$filesWithBlue = @($allFiles | Select-String -Pattern 'blue-[0-9]' -List | Select -ExpandProperty Path | Get-Unique)

Write-Host "Processando $($filesWithBlue.Count) arquivos restantes..."

foreach ($file in $filesWithBlue) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw

    # Fazer todas as substituições
    $content = $content -replace 'blue-50', 'green-50'
    $content = $content -replace 'blue-100', 'green-100'
    $content = $content -replace 'blue-200', 'green-200'
    $content = $content -replace 'blue-300', 'green-300'
    $content = $content -replace 'blue-400', 'green-400'
    $content = $content -replace 'blue-500', 'green-500'
    $content = $content -replace 'blue-600', 'green-600'
    $content = $content -replace 'blue-700', 'green-700'
    $content = $content -replace 'blue-800', 'green-800'
    $content = $content -replace 'blue-900', 'green-900'

    Set-Content -Path $file -Value $content
    Write-Host "OK: $([System.IO.Path]::GetFileName($file))"
  }
}

Write-Host 'Substituicoes concluidas!'
