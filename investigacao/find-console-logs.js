/**
 * Script para encontrar e categorizar console.log no código
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Buscando console.log no código...\n');

const srcPath = path.join(__dirname, 'src');
const files = glob.sync('**/*.{ts,tsx,js,jsx}', { cwd: srcPath, absolute: true });

const results = {
  legitimate: [],    // logger.ts, GoogleAnalytics, error boundaries
  debug: [],         // console.log temporários
  mock: [],          // MockAuthContext e similares
  total: 0
};

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const match = line.match(/console\.(log|warn|error|debug|info)/);
    if (match) {
      results.total++;

      const relativePath = path.relative(srcPath, file);
      const lineNum = index + 1;
      const entry = {
        file: relativePath,
        line: lineNum,
        code: line.trim(),
        type: match[1]
      };

      // Categorizar
      if (file.includes('logger.ts') ||
          file.includes('GoogleAnalytics') ||
          (match[1] === 'error' && line.includes('catch'))) {
        results.legitimate.push(entry);
      } else if (file.includes('Mock') || file.includes('.backup.')) {
        results.mock.push(entry);
      } else {
        results.debug.push(entry);
      }
    }
  });
});

console.log(`📊 Total de console.*: ${results.total}\n`);
console.log(`✅ Legítimos (manter): ${results.legitimate.length}`);
console.log(`🧪 Mock/Backup (ignorar): ${results.mock.length}`);
console.log(`❌ Debug (remover): ${results.debug.length}\n`);

console.log('❌ Console.log a REMOVER:\n');
results.debug.slice(0, 20).forEach((entry, i) => {
  console.log(`${i+1}. ${entry.file}:${entry.line}`);
  console.log(`   ${entry.code}`);
});

if (results.debug.length > 20) {
  console.log(`\n... e mais ${results.debug.length - 20} ocorrências`);
}

// Salvar relatório
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: results.total,
    legitimate: results.legitimate.length,
    mock: results.mock.length,
    toRemove: results.debug.length
  },
  filesToClean: [...new Set(results.debug.map(e => e.file))]
};

fs.writeFileSync('console-log-report.json', JSON.stringify(report, null, 2));
console.log('\n📝 Relatório salvo em console-log-report.json');
