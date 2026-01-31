/**
 * Script para substituir "funcionário" por "sócio" em textos de interface
 */

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/landing/Pricing.tsx',
  'src/components/landing/ProtectionAreas.tsx',
  'src/app/solucoes/background-check-executivos/page.tsx',
  'src/app/solucoes/auditoria-licitacoes/page.tsx',
  'src/app/disclaimer/page.tsx',
];

let totalReplacements = 0;

console.log('🔄 Substituindo "funcionário" por "sócio" em textos de interface...\n');

filesToUpdate.forEach(relPath => {
  const filePath = path.join(__dirname, relPath);

  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Arquivo não encontrado: ${relPath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Substituir variações
  content = content.replace(/funcionário/g, 'sócio');
  content = content.replace(/Funcionário/g, 'Sócio');
  content = content.replace(/funcionários/g, 'sócios');
  content = content.replace(/Funcionários/g, 'Sócios');
  content = content.replace(/FUNCIONÁRIO/g, 'SÓCIO');
  content = content.replace(/FUNCIONÁRIOS/g, 'SÓCIOS');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    const count = (originalContent.match(/funcionário/gi) || []).length;
    totalReplacements += count;
    console.log(`✅ ${relPath}: ${count} substituições`);
  }
});

console.log(`\n📊 Total: ${totalReplacements} substituições realizadas`);
console.log('✨ Concluído!');
