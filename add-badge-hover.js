const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'investigaree', 'src', 'app', 'quemsomos', 'ibsen-maciel', 'page.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Replace all Badge variant="outline" that don't already have hover: classes
content = content.replace(
  /<Badge variant="outline" className="([^"]*(?<!hover:)[^"]*)"/g,
  (match, classes) => {
    // Skip if already has hover classes
    if (classes.includes('hover:')) {
      return match;
    }
    // Add hover classes
    return `<Badge variant="outline" className="${classes} hover:bg-navy-700 hover:text-white hover:border-navy-700 transition-all duration-200"`;
  }
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Added hover effects to all Badge variant="outline" elements');
