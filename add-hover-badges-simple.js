const fs = require('fs');
const path = require('path');

const files = [
  'investigaree/src/app/quemsomos/ibsen-maciel/page.tsx',
  'investigaree/src/app/quemsomos/dani-kaloi/page.tsx',
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

  // Replace all Badge variant="outline" that don't already have hover: classes
  const newContent = content.replace(
    /<Badge variant="outline" className="([^"]*(?<!hover:)[^"]*)"/g,
    (match, classes) => {
      // Skip if already has hover classes
      if (classes.includes('hover:')) {
        return match;
      }
      updated = true;
      // Add hover classes
      return `<Badge variant="outline" className="${classes} hover:bg-navy-700 hover:text-white hover:border-navy-700 transition-all duration-200"`;
    }
  );

  if (updated) {
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    totalUpdated++;
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
});

console.log(`\n✨ Total files updated: ${totalUpdated}`);
