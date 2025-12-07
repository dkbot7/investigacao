const fs = require('fs');
const path = require('path');

const files = [
  'investigaree/src/app/servicos/page.tsx',
  'investigaree/src/app/recursos/page.tsx',
  'investigaree/src/app/sobre/page.tsx',
];

const replacements = [
  // Purple backgrounds to blue
  { from: /bg-purple-100/g, to: 'bg-blue-100' },
  { from: /bg-purple-200/g, to: 'bg-blue-200' },
  { from: /bg-purple-50/g, to: 'bg-blue-50' },
  { from: /bg-purple-900\/30/g, to: 'bg-blue-900/30' },
  { from: /bg-purple-900\/20/g, to: 'bg-blue-900/20' },

  // Purple text to blue
  { from: /text-purple-600/g, to: 'text-blue-500' },
  { from: /text-purple-500/g, to: 'text-blue-500' },
  { from: /text-purple-400/g, to: 'text-blue-400' },

  // Purple borders to blue
  { from: /border-purple-600/g, to: 'border-blue-500' },
  { from: /border-purple-500/g, to: 'border-blue-500' },
  { from: /border-purple-400/g, to: 'border-blue-400' },

  // Gradients
  { from: /from-purple-600/g, to: 'from-blue-500' },
  { from: /to-purple-600/g, to: 'to-blue-500' },
  { from: /from-purple-500/g, to: 'from-blue-500' },
  { from: /to-purple-500/g, to: 'to-blue-500' },
];

let totalUpdated = 0;

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      updated = true;
    }
  });

  if (updated) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    totalUpdated++;
  } else {
    console.log(`ℹ️  No purple colors found: ${filePath}`);
  }
});

console.log(`\n✨ Total files updated: ${totalUpdated}`);
