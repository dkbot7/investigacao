const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'content', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

console.log(`Found ${files.length} MDX files\n`);

files.slice(0, 3).forEach(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const lines = content.split('\n').slice(0, 20);
  console.log(`=== ${file} ===`);
  console.log(lines.join('\n'));
  console.log('\n');
});
