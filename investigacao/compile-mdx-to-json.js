const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const blogDir = path.join(__dirname, 'content', 'blog');
const outputFile = path.join(__dirname, 'src', 'data', 'compiledPosts.ts');

console.log('🔨 Compiling MDX files to HTML...\n');

// Configure marked for GitHub-flavored markdown
marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
});

// Process custom MDX components and convert to HTML
function processCustomComponents(content) {
  let processed = content;

  // Remove KeyStat components (replace with styled div)
  processed = processed.replace(/<KeyStat\s+[^>]*\/>/g, (match) => {
    const valueMatch = match.match(/value="([^"]*)"/);
    const labelMatch = match.match(/label="([^"]*)"/);
    const value = valueMatch ? valueMatch[1] : '';
    const label = labelMatch ? labelMatch[1] : '';

    return `<div class="my-6 p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
  <div class="text-3xl font-bold text-blue-500 mb-2">${value}</div>
  <div class="text-sm text-slate-600 dark:text-navy-300">${label}</div>
</div>`;
  });

  // Remove ComparisonTable components (replace with simple HTML table)
  processed = processed.replace(/<ComparisonTable[\s\S]*?\/>/g, () => {
    return `<div class="my-6 overflow-x-auto">
  <p class="text-sm text-slate-500 dark:text-navy-400 italic mb-2">Tabela de comparação disponível na versão interativa</p>
</div>`;
  });

  // Remove Timeline components
  processed = processed.replace(/<Timeline[\s\S]*?\/>/g, () => {
    return `<div class="my-6 p-4 rounded-xl bg-slate-100 dark:bg-navy-900/50">
  <p class="text-sm text-slate-500 dark:text-navy-400 italic">Cronograma disponível na versão interativa</p>
</div>`;
  });

  // Convert Callout components to HTML
  processed = processed.replace(/<Callout\s+type="([^"]*)"\s+title="([^"]*)">\s*([\s\S]*?)\s*<\/Callout>/g, (match, type, title, content) => {
    const colors = {
      warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
      info: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
      tip: 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400',
      legal: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
    };
    const colorClass = colors[type] || colors.info;

    return `<div class="my-6 p-6 rounded-xl border ${colorClass}">
  <p class="font-semibold mb-2">${title}</p>
  <div class="text-sm">${content.trim()}</div>
</div>`;
  });

  // Remove CTABanner components
  processed = processed.replace(/<CTABanner[\s\S]*?\/>/g, () => {
    return `<div class="my-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
  <p class="text-lg font-semibold text-slate-900 dark:text-white mb-2">Experimente o Investigaree</p>
  <p class="text-sm text-slate-600 dark:text-navy-300">Consulte fontes públicas oficiais de forma automatizada</p>
</div>`;
  });

  // Remove Quiz components
  processed = processed.replace(/<Quiz[\s\S]*?\/>/g, () => {
    return `<div class="my-8 p-6 rounded-xl bg-slate-100 dark:bg-navy-900/50">
  <p class="font-semibold text-slate-900 dark:text-white mb-2">Quiz Interativo</p>
  <p class="text-sm text-slate-500 dark:text-navy-400 italic">Disponível na versão interativa do blog</p>
</div>`;
  });

  // Convert VideoEmbed components to responsive iframe
  processed = processed.replace(/<VideoEmbed[\s\S]*?\/>/g, (match) => {
    const srcMatch = match.match(/src="([^"]*)"/);
    const titleMatch = match.match(/title="([^"]*)"/);

    if (!srcMatch) return '';

    const src = srcMatch[1];
    const title = titleMatch ? titleMatch[1] : 'Vídeo';

    // Convert YouTube watch URL to embed URL
    let embedUrl = src;
    if (src.includes('youtube.com/watch?v=')) {
      const videoId = src.split('watch?v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (src.includes('youtu.be/')) {
      const videoId = src.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return `<div class="my-8">
  <div class="relative w-full pb-[56.25%] rounded-xl overflow-hidden bg-slate-100 dark:bg-navy-900">
    <iframe
      class="absolute top-0 left-0 w-full h-full"
      src="${embedUrl}"
      title="${title}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
  <p class="text-sm text-slate-600 dark:text-navy-300 text-center mt-2">${title}</p>
</div>`;
  });

  // Remove SeriesNavigation components (usually at start of article)
  processed = processed.replace(/<SeriesNavigation[\s\S]*?\/>/g, (match) => {
    // Extract series name and current part if available
    const nameMatch = match.match(/seriesName="([^"]*)"/);
    const partMatch = match.match(/currentPart=\{(\d+)\}/);
    const totalMatch = match.match(/totalParts=\{(\d+)\}/);
    const prevMatch = match.match(/prevPost=\{\{\s*slug:\s*"([^"]+)"\s*,\s*title:\s*"([^"]+)"\s*\}\}/);
    const nextMatch = match.match(/nextPost=\{\{\s*slug:\s*"([^"]+)"\s*,\s*title:\s*"([^"]+)"\s*\}\}/);

    const seriesName = nameMatch ? nameMatch[1] : 'Série';
    const currentPart = partMatch ? partMatch[1] : '?';
    const totalParts = totalMatch ? totalMatch[1] : '?';

    let navigation = `<div class="my-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20">
  <div class="flex items-center gap-2 mb-3">
    <span class="text-xs font-semibold text-blue-500 uppercase tracking-wider">📚 Série</span>
  </div>
  <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">${seriesName}</h3>
  <p class="text-sm text-slate-600 dark:text-navy-300 mb-4">Parte ${currentPart} de ${totalParts}</p>
  <div class="flex gap-3">`;

    // Add prev/next buttons if available
    if (prevMatch) {
      navigation += `
    <a href="/blog/${prevMatch[1]}" class="text-sm text-blue-500 hover:text-blue-400">← Anterior</a>`;
    }
    if (nextMatch) {
      navigation += `
    <a href="/blog/${nextMatch[1]}" class="text-sm text-blue-500 hover:text-blue-400 ml-auto">Próximo →</a>`;
    }

    navigation += `
  </div>
</div>`;

    return navigation;
  });

  return processed;
}

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
      // Process custom MDX components first
      const processedContent = processCustomComponents(content);

      // Convert markdown content to HTML
      const htmlContent = marked.parse(processedContent);

      compiledPosts[slug] = {
        html: htmlContent,
        frontmatter: data,
      };

      console.log(`✓ ${slug}`);
    } catch (error) {
      console.error(`✗ ${slug}:`, error.message);
    }
  }

  // Write to TypeScript file
  const tsContent = `// Auto-generated - Do not edit manually
// Generated on: ${new Date().toISOString()}

export const compiledPosts: Record<string, { html: string; frontmatter: any }> = ${JSON.stringify(compiledPosts, null, 2)};

export default compiledPosts;
`;

  fs.writeFileSync(outputFile, tsContent, 'utf-8');

  console.log(`\n✅ Compiled ${Object.keys(compiledPosts).length} posts to ${outputFile}`);
  console.log(`📦 File size: ${(fs.statSync(outputFile).size / 1024 / 1024).toFixed(2)} MB`);
}

compileMDX();
