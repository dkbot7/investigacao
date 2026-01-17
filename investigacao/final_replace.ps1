# Script final para substituir TODAS as classes azuis por verdes
# Processa cada arquivo encontrado e faz a substituição

$searchPattern = 'blue-(50|100|200|300|400|500|600|700|800|900)'
$allFiles = Get-ChildItem -Path 'C:\Users\Vaio\Documents\TRABALHO\INVESTIGACAO2\investigacao\src' -Recurse -Include '*.tsx','*.ts','*.css' -Exclude 'compiledPosts.ts'

$count = 0
$filesProcessed = 0

foreach ($file in $allFiles) {
  $content = Get-Content $file -Raw
  $original = $content

  # Fazer todas as substituições de uma vez com replace múltiplo
  $content = $content `
    -replace 'blue-50(?![0-9])', 'green-50' `
    -replace 'blue-100(?![0-9])', 'green-100' `
    -replace 'blue-200(?![0-9])', 'green-200' `
    -replace 'blue-300(?![0-9])', 'green-300' `
    -replace 'blue-400(?![0-9])', 'green-400' `
    -replace 'blue-500(?![0-9])', 'green-500' `
    -replace 'blue-600(?![0-9])', 'green-600' `
    -replace 'blue-700(?![0-9])', 'green-700' `
    -replace 'blue-800(?![0-9])', 'green-800' `
    -replace 'blue-900(?![0-9])', 'green-900'

  if ($content -ne $original) {
    Set-Content -Path $file -Value $content -Encoding UTF8
    $filesProcessed++
    Write-Host "Processado: $($file.Name)"
  }
}

Write-Host "Total de arquivos processados: $filesProcessed"

# Verificação final
$remaining = $allFiles | Select-String -Pattern $searchPattern | Measure-Object
Write-Host "Ocorrências restantes: $($remaining.Count)"
