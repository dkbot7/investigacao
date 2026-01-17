# Script final para substituir TODAS as classes azuis por verdes
$allFiles = Get-ChildItem -Path 'C:\Users\Vaio\Documents\TRABALHO\INVESTIGACAO2\investigacao\src' -Recurse -Include '*.tsx','*.ts','*.css' -Exclude 'compiledPosts.ts'

$filesProcessed = 0

foreach ($file in $allFiles) {
  # Ler arquivo como array de linhas
  $lines = @(Get-Content $file -Encoding UTF8)
  $content = $lines -join "`n"
  $original = $content

  # Fazer todas as substituições
  $content = $content -replace 'blue-50(?![0-9])', 'green-50'
  $content = $content -replace 'blue-100(?![0-9])', 'green-100'
  $content = $content -replace 'blue-200(?![0-9])', 'green-200'
  $content = $content -replace 'blue-300(?![0-9])', 'green-300'
  $content = $content -replace 'blue-400(?![0-9])', 'green-400'
  $content = $content -replace 'blue-500(?![0-9])', 'green-500'
  $content = $content -replace 'blue-600(?![0-9])', 'green-600'
  $content = $content -replace 'blue-700(?![0-9])', 'green-700'
  $content = $content -replace 'blue-800(?![0-9])', 'green-800'
  $content = $content -replace 'blue-900(?![0-9])', 'green-900'

  if ($content -ne $original) {
    Set-Content -Path $file -Value $content -Encoding UTF8 -Force
    $filesProcessed++
    Write-Host "Atualizado: $($file.Name)"
  }
}

Write-Host "Arquivos processados: $filesProcessed"
