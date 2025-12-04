/**
 * YouTube to Blog Post Converter
 *
 * Uso:
 *   node scripts/youtube-to-blog.js
 *
 * O script vai pedir:
 *   1. URL do vídeo do YouTube
 *   2. Transcrição (cole o texto)
 *   3. Informações básicas do post
 *
 * E vai gerar automaticamente o arquivo MDX no content/blog/
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

// Extrai ID do vídeo do YouTube
function extractYouTubeId(url) {
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// Gera slug a partir do título
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Espaços para hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .substring(0, 60); // Limita tamanho
}

// Template do MDX
function generateMDX(data) {
  const {
    title,
    slug,
    excerpt,
    authorId,
    contentType,
    topicId,
    skillLevel,
    tags,
    videoUrl,
    videoId,
    transcription,
    publishedAt
  } = data;

  // Estrutura o conteúdo baseado na transcrição
  const structuredContent = structureContent(transcription, title, videoUrl);

  return `---
title: "${title}"
excerpt: "${excerpt}"
coverImage: "https://img.youtube.com/vi/${videoId}/maxresdefault.jpg"
authorId: "${authorId}"
contentType: "${contentType}"
topicId: "${topicId}"
skillLevel: "${skillLevel}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
publishedAt: "${publishedAt}"
readingTime: ${Math.ceil(transcription.split(' ').length / 200)}
featured: false
videoUrl: "${videoUrl}"
---

<Callout type="info" title="Sobre este conteúdo">
Este artigo foi criado a partir de um vídeo. Assista ao vídeo original ou leia a transcrição estruturada abaixo.
</Callout>

<VideoEmbed
  src="${videoUrl}"
  title="${title}"
/>

---

${structuredContent}

---

<CTABanner
  title="Precisa de uma investigação profissional?"
  description="Metodologia validada por Perito Criminal Oficial"
  buttonText="Falar com Especialista"
  buttonLink="/contato"
/>
`;
}

// Estrutura o conteúdo da transcrição em seções
function structureContent(transcription, title, videoUrl) {
  // Divide em parágrafos
  const paragraphs = transcription
    .split(/[.!?]+/)
    .filter(p => p.trim().length > 20)
    .map(p => p.trim());

  // Agrupa em seções de ~3-4 parágrafos
  const sections = [];
  let currentSection = [];

  paragraphs.forEach((p, i) => {
    currentSection.push(p + '.');
    if (currentSection.length >= 3 || i === paragraphs.length - 1) {
      sections.push(currentSection.join(' '));
      currentSection = [];
    }
  });

  // Gera headers automáticos
  const sectionTitles = [
    "Introdução",
    "Contexto",
    "Desenvolvimento",
    "Pontos Principais",
    "Análise",
    "Considerações",
    "Conclusão"
  ];

  let content = '';
  sections.forEach((section, i) => {
    const sectionTitle = sectionTitles[Math.min(i, sectionTitles.length - 1)];
    if (i > 0) {
      content += `\n## ${sectionTitle}\n\n`;
    }
    content += section + '\n';
  });

  return content;
}

// Atualiza blogPosts.ts com o novo slug
function updateBlogPostsSlugs(slug) {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'blogPosts.ts');
  let content = fs.readFileSync(filePath, 'utf-8');

  // Encontra o array de slugs e adiciona o novo
  const insertPoint = content.lastIndexOf('];');
  if (insertPoint > -1) {
    const newSlug = `  // Auto-generated\n  "${slug}",\n`;
    content = content.slice(0, insertPoint) + newSlug + content.slice(insertPoint);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Slug adicionado em blogPosts.ts`);
  }
}

// Menu de opções
const AUTHORS = {
  '1': { id: 'ibsen-maciel', name: 'Ibsen Maciel' },
  '2': { id: 'dani-kaloi', name: 'Dani Kaloi' },
  '3': { id: 'equipe', name: 'Equipe Investigaree' }
};

const TOPICS = {
  '1': { id: 'metodologia-forense', name: 'Metodologia Forense' },
  '2': { id: 'osint-brasil', name: 'OSINT Brasil' },
  '3': { id: 'due-diligence', name: 'Due Diligence' },
  '4': { id: 'protecao-familiar', name: 'Proteção Familiar' },
  '5': { id: 'protecao-empresarial', name: 'Proteção Empresarial' },
  '6': { id: 'casos-praticos', name: 'Casos Práticos' }
};

const CONTENT_TYPES = {
  '1': 'artigo',
  '2': 'tutorial',
  '3': 'entrevista',
  '4': 'case-study',
  '5': 'video'
};

const SKILL_LEVELS = {
  '1': 'iniciante',
  '2': 'intermediario',
  '3': 'avancado'
};

async function main() {
  console.log('\n🎬 YouTube to Blog Post Converter\n');
  console.log('=' .repeat(50) + '\n');

  // 1. URL do YouTube
  const videoUrl = await question('📺 URL do vídeo do YouTube: ');
  const videoId = extractYouTubeId(videoUrl);

  if (!videoId) {
    console.log('❌ URL inválida do YouTube');
    rl.close();
    return;
  }
  console.log(`   Video ID: ${videoId}\n`);

  // 2. Título
  const title = await question('📝 Título do post: ');
  const suggestedSlug = generateSlug(title);
  const slug = await question(`🔗 Slug (Enter para "${suggestedSlug}"): `) || suggestedSlug;

  // 3. Excerpt
  const excerpt = await question('📄 Descrição curta (excerpt): ');

  // 4. Autor
  console.log('\n👤 Autor:');
  Object.entries(AUTHORS).forEach(([key, val]) => console.log(`   ${key}. ${val.name}`));
  const authorChoice = await question('   Escolha: ');
  const authorId = AUTHORS[authorChoice]?.id || 'equipe';

  // 5. Tipo de conteúdo
  console.log('\n📚 Tipo de conteúdo:');
  Object.entries(CONTENT_TYPES).forEach(([key, val]) => console.log(`   ${key}. ${val}`));
  const contentChoice = await question('   Escolha: ');
  const contentType = CONTENT_TYPES[contentChoice] || 'artigo';

  // 6. Tópico
  console.log('\n🏷️  Tópico:');
  Object.entries(TOPICS).forEach(([key, val]) => console.log(`   ${key}. ${val.name}`));
  const topicChoice = await question('   Escolha: ');
  const topicId = TOPICS[topicChoice]?.id || 'metodologia-forense';

  // 7. Nível
  console.log('\n📊 Nível:');
  Object.entries(SKILL_LEVELS).forEach(([key, val]) => console.log(`   ${key}. ${val}`));
  const levelChoice = await question('   Escolha: ');
  const skillLevel = SKILL_LEVELS[levelChoice] || 'iniciante';

  // 8. Tags
  const tagsInput = await question('\n🏷️  Tags (separadas por vírgula): ');
  const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

  // 9. Data de publicação
  const dateInput = await question('\n📅 Data de publicação (YYYY-MM-DD ou Enter para hoje): ');
  const publishedAt = dateInput
    ? new Date(dateInput).toISOString()
    : new Date().toISOString();

  // 10. Transcrição
  console.log('\n📝 Cole a transcrição do vídeo (termine com uma linha vazia):');

  let transcription = '';
  const collectTranscription = () => {
    return new Promise((resolve) => {
      const lines = [];
      const onLine = (line) => {
        if (line === '') {
          rl.removeListener('line', onLine);
          resolve(lines.join(' '));
        } else {
          lines.push(line);
        }
      };
      rl.on('line', onLine);
    });
  };

  transcription = await collectTranscription();

  // Gera o MDX
  console.log('\n⏳ Gerando arquivo MDX...\n');

  const mdxContent = generateMDX({
    title,
    slug,
    excerpt,
    authorId,
    contentType,
    topicId,
    skillLevel,
    tags,
    videoUrl,
    videoId,
    transcription,
    publishedAt
  });

  // Salva o arquivo
  const outputDir = path.join(__dirname, '..', 'content', 'blog');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${slug}.mdx`);
  fs.writeFileSync(outputPath, mdxContent);

  console.log(`✅ Arquivo criado: content/blog/${slug}.mdx`);

  // Atualiza blogPosts.ts
  updateBlogPostsSlugs(slug);

  console.log(`\n🎉 Post criado com sucesso!`);
  console.log(`   URL: http://localhost:3000/blog/${slug}`);
  console.log(`\n💡 Dica: Edite o arquivo MDX para melhorar a estrutura do conteúdo.\n`);

  rl.close();
}

main().catch(console.error);
