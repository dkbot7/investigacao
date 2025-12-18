const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const blogDir = path.join(__dirname, 'content', 'blog');
const outputFile = path.join(__dirname, 'src', 'data', 'compiledPosts.json');

console.log('🔨 Compiling MDX files to HTML...\n');

// Configure marked for GitHub-flavored markdown
marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
});

function compileMDX() {
  const files = fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.mdx'))
    .sort();

  const compiledPosts = {};

  for (const file of files) {
    const slug = file.replace('.mdx', '');
    const filePath = path.join(blogDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    try {
      // Convert markdown content to HTML (basic conversion for now)
      // MDX components will be handled separately
      const htmlContent = marked.parse(content);

      compiledPosts[slug] = {
        html: htmlContent,
        frontmatter: data,
      };

      console.log(`✓ ${slug}`);
    } catch (error) {
      console.error(`✗ ${slug}:`, error.message);
    }
  }

  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(compiledPosts, null, 2), 'utf-8');

  console.log(`\n✅ Compiled ${Object.keys(compiledPosts).length} posts to ${outputFile}`);
  console.log(`📦 File size: ${(fs.statSync(outputFile).size / 1024 / 1024).toFixed(2)} MB`);
}

compileMDX();
