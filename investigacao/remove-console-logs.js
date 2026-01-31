/**
 * Script para remover console.log de produção
 *
 * Remove:
 * - console.log()
 * - console.warn() que não são em catch blocks
 * - console.debug()
 * - console.info()
 *
 * Preserva:
 * - console.error() em catch blocks
 * - Comentários com console (exemplos de documentação)
 * - Arquivos Mock e .backup
 */

const fs = require('fs');
const path = require('path');

const report = JSON.parse(fs.readFileSync('console-log-report.json', 'utf-8'));
const srcPath = path.join(__dirname, 'src');

let totalRemoved = 0;
let filesModified = 0;

console.log('🧹 Removendo console.log de produção...\n');

report.filesToClean.forEach(relPath => {
  const filePath = path.join(srcPath, relPath);

  // Pular arquivos Mock e backup
  if (relPath.includes('Mock') || relPath.includes('.backup.')) {
    console.log(`⏭️  Pulando ${relPath} (Mock/Backup)`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const newLines = [];
  let removedInFile = 0;

  lines.forEach((line, index) => {
    // Preservar linhas que são comentários (JSDoc examples)
    if (line.trim().startsWith('*') && line.includes('console.')) {
      newLines.push(line);
      return;
    }

    // Preservar console.error em catch blocks (verificar linha anterior)
    const prevLine = index > 0 ? lines[index - 1] : '';
    const nextLine = index < lines.length - 1 ? lines[index + 1] : '';

    if (line.includes('console.error') &&
        (prevLine.includes('catch') || prevLine.includes('} catch') ||
         content.slice(0, content.indexOf(line)).lastIndexOf('catch') >
         content.slice(0, content.indexOf(line)).lastIndexOf('try'))) {
      newLines.push(line);
      return;
    }

    // Remover console.log, console.warn, console.debug, console.info
    if (line.match(/\s*console\.(log|warn|debug|info)\(/) &&
        !line.trim().startsWith('//') &&
        !line.trim().startsWith('*')) {
      removedInFile++;
      totalRemoved++;
      // Não adicionar a linha (remove ela)
      return;
    }

    newLines.push(line);
  });

  if (removedInFile > 0) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
    filesModified++;
    console.log(`✅ ${relPath}: ${removedInFile} console.* removidos`);
  }
});

console.log(`\n📊 Resumo:`);
console.log(`   - Arquivos modificados: ${filesModified}`);
console.log(`   - Console.* removidos: ${totalRemoved}`);
console.log(`\n✨ Limpeza concluída!`);
