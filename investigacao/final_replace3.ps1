# Script simples de substituição
$allFiles = Get-ChildItem -Path 'C:\Users\Vaio\Documents\TRABALHO\INVESTIGACAO2\investigacao\src' -Recurse -Include '*.tsx','*.ts','*.css' -Exclude 'compiledPosts.ts'

$filesProcessed = 0

foreach ($file in $allFiles) {
  $content = [System.IO.File]::ReadAllText($file.FullName)
  $original = $content

  # Fazer todas as substituições
  $content = $content -replace 'blue-50(?![0-9])', 'green-50'
  $content = $content -replace 'blue-100', 'green-100'
  $content = $content -replace 'blue-200', 'green-200'
  $content = $content -replace 'blue-300', 'green-300'
  $content = $content -replace 'blue-400', 'green-400'
  $content = $content -replace 'blue-500', 'green-500'
  $content = $content -replace 'blue-600', 'green-600'
  $content = $content -replace 'blue-700', 'green-700'
  $content = $content -replace 'blue-800', 'green-800'
  $content = $content -replace 'blue-900', 'green-900'

  if ($content -ne $original) {
    [System.IO.File]::WriteAllText($file.FullName, $content)
    $filesProcessed++
    Write-Host "Atualizado: $($file.Name)"
  }
}

Write-Host "Total processado: $filesProcessed arquivos"
