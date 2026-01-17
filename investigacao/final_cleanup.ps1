$files = @(
  'C:\Users\Vaio\Documents\TRABALHO\INVESTIGACAO2\investigacao\src\components\dashboard\AlertsList.tsx',
  'C:\Users\Vaio\Documents\TRABALHO\INVESTIGACAO2\investigacao\src\components\landing\ServicePortals.tsx'
)

foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file)
  $original = $content

  $content = $content -replace 'dark:bg-blue-950', 'dark:bg-green-950'
  $content = $content -replace 'dark:from-blue-950', 'dark:from-green-950'
  $content = $content -replace 'dark:to-blue-950', 'dark:to-green-950'

  if ($content -ne $original) {
    [System.IO.File]::WriteAllText($file, $content)
    Write-Host "OK: $([System.IO.Path]::GetFileName($file))"
  }
}

Write-Host "Limpeza final concluida!"
