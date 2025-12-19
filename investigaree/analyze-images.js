/**
 * Analisador de Imagens do Blog - Investigaree
 *
 * Gera prompts otimizados para criação de imagens de capa
 * baseados no contexto de cada post do blog.
 */

const fs = require('fs');
const path = require('path');

// Ler o arquivo mockPosts.ts
const mockPostsPath = path.join(__dirname, 'src', 'data', 'mockPosts.ts');
const content = fs.readFileSync(mockPostsPath, 'utf-8');

// Extrair informações dos posts
const posts = [];
const postRegex = /{\s*id:\s*"(\d+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",[\s\S]*?coverImage:\s*"([^"]+)",[\s\S]*?tags:\s*\[([^\]]+)\]/g;

let match;
while ((match = postRegex.exec(content)) !== null) {
  const [, id, slug, title, excerpt, coverImage, tagsStr] = match;
  const tags = tagsStr.split(',').map(t => t.trim().replace(/"/g, ''));

  posts.push({
    id,
    slug,
    title,
    excerpt,
    coverImage,
    tags,
  });
}

console.log(`\n📊 Total de posts analisados: ${posts.length}\n`);

// Função para gerar prompt de imagem baseado no contexto
function generateImagePrompt(post) {
  const { title, excerpt, tags } = post;

  // Determinar estilo visual baseado nas tags e conteúdo
  let style = 'professional photography, corporate style, modern';
  let subject = '';
  let mood = 'serious, trustworthy, professional';
  let colors = 'blue and dark tones';

  // Análise de contexto
  if (tags.some(t => t.includes('perícia') || t.includes('forense'))) {
    style = 'forensic investigation scene, professional laboratory';
    subject = 'forensic expert analyzing digital evidence on computer screens';
    mood = 'scientific, precise, technical';
    colors = 'cool blue tones, professional lighting';
  } else if (tags.some(t => t.includes('fraude') || t.includes('golpe'))) {
    style = 'cybersecurity concept, digital security';
    subject = 'digital security shield, protected data, hacker prevention';
    mood = 'alert, protective, warning';
    colors = 'red and orange alert tones, contrasted with blue secure elements';
  } else if (tags.some(t => t.includes('empresa') || t.includes('CNPJ'))) {
    style = 'business intelligence, corporate investigation';
    subject = 'business documents, company analysis, corporate building';
    mood = 'analytical, professional, decisive';
    colors = 'navy blue, silver, professional corporate colors';
  } else if (tags.some(t => t.includes('OSINT') || t.includes('investigação'))) {
    style = 'digital investigation workspace, OSINT concept';
    subject = 'multiple monitors showing data analysis, investigation dashboard';
    mood = 'focused, investigative, detailed';
    colors = 'dark background with bright screen displays';
  } else if (tags.some(t => t.includes('dados') || t.includes('público'))) {
    style = 'data visualization, government transparency';
    subject = 'open data databases, public records, digital documents';
    mood = 'transparent, accessible, organized';
    colors = 'clean white and blue, professional data viz colors';
  } else if (tags.some(t => t.includes('due diligence') || t.includes('background check'))) {
    style = 'professional due diligence, business analysis';
    subject = 'businessperson reviewing documents, checklist verification';
    mood = 'thorough, careful, professional';
    colors = 'professional blue and gray tones';
  }

  // Construir prompt otimizado
  const prompt = `Professional stock photo for blog post about "${title.substring(0, 60)}".
Visual concept: ${subject}.
Style: ${style}.
Mood: ${mood}.
Color palette: ${colors}.
Composition: wide horizontal format 1200x675px, rule of thirds, professional lighting, high quality, 4K resolution, suitable for blog header image.
Brazilian context when relevant. No text overlay, clean professional image.`;

  return prompt.replace(/\s+/g, ' ').trim();
}

// Gerar relatório
console.log('═══════════════════════════════════════════════════════════════════════════\n');
console.log('🎨 PROMPTS PARA GERAÇÃO DE IMAGENS - BLOG INVESTIGAREE\n');
console.log('═══════════════════════════════════════════════════════════════════════════\n');

const imagePrompts = [];

posts.forEach((post, index) => {
  const prompt = generateImagePrompt(post);
  const isUnsplash = post.coverImage.includes('unsplash.com');
  const isLocal = post.coverImage.startsWith('/images/');
  const isYoutube = post.coverImage.includes('youtube.com');

  imagePrompts.push({
    id: post.id,
    slug: post.slug,
    title: post.title,
    currentImage: post.coverImage,
    imageSource: isUnsplash ? 'Unsplash' : isLocal ? 'Local' : isYoutube ? 'YouTube' : 'Other',
    prompt: prompt,
    tags: post.tags,
  });

  console.log(`\n┌─────────────────────────────────────────────────────────────────────────┐`);
  console.log(`│ POST #${post.id.padEnd(2)} - ${post.slug.substring(0, 50).padEnd(50)} │`);
  console.log(`└─────────────────────────────────────────────────────────────────────────┘`);
  console.log(`\n📌 TÍTULO: ${post.title}`);
  console.log(`\n🖼️  IMAGEM ATUAL: ${post.coverImage}`);
  console.log(`   Fonte: ${isUnsplash ? '🌄 Unsplash' : isLocal ? '💾 Local' : isYoutube ? '🎥 YouTube' : '❓ Outro'}`);
  console.log(`\n🎨 PROMPT GERADOR:\n`);
  console.log(`   ${prompt}`);
  console.log(`\n🏷️  TAGS: ${post.tags.slice(0, 5).join(', ')}`);
  console.log(`\n${'─'.repeat(77)}`);
});

// Salvar JSON para uso posterior
const outputPath = path.join(__dirname, 'image-prompts.json');
fs.writeFileSync(outputPath, JSON.stringify(imagePrompts, null, 2));

console.log(`\n\n✅ Análise completa!`);
console.log(`📁 Prompts salvos em: ${outputPath}`);
console.log(`\n📊 Estatísticas:`);
console.log(`   Total de posts: ${posts.length}`);
console.log(`   Imagens Unsplash: ${imagePrompts.filter(p => p.imageSource === 'Unsplash').length}`);
console.log(`   Imagens Locais: ${imagePrompts.filter(p => p.imageSource === 'Local').length}`);
console.log(`   Imagens YouTube: ${imagePrompts.filter(p => p.imageSource === 'YouTube').length}`);
console.log(`\n`);
