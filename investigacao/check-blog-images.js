/**
 * Script para verificar imagens de posts do blog
 */

const fs = require('fs');
const path = require('path');

console.log('🖼️  Verificando imagens do blog...\n');

// Ler mockPosts.ts
const mockPostsPath = path.join(__dirname, 'src/data/mockPosts.ts');
const content = fs.readFileSync(mockPostsPath, 'utf-8');

// Extrair array de posts (simples parse)
const match = content.match(/export const MOCK_POSTS: BlogPost\[\] = (\[[\s\S]*\]);/);
if (!match) {
  console.error('❌ Erro ao extrair MOCK_POSTS');
  process.exit(1);
}

const posts = eval(match[1]);

console.log(`📚 Total de posts: ${posts.length}\n`);

// Analisar imagens
const stats = {
  comImagem: 0,
  semImagem: 0,
  imagensInvalidas: [],
  postsSemImagem: []
};

posts.forEach(post => {
  if (post.coverImage && post.coverImage.trim() !== '') {
    stats.comImagem++;

    // Verificar se arquivo existe
    const imagePath = path.join(__dirname, 'public', post.coverImage);
    if (!fs.existsSync(imagePath)) {
      stats.imagensInvalidas.push({
        post: post.slug,
        imagem: post.coverImage
      });
    }
  } else {
    stats.semImagem++;
    stats.postsSemImagem.push({
      slug: post.slug,
      title: post.title
    });
  }
});

console.log('📊 Estatísticas:');
console.log(`   ✅ Com imagem: ${stats.comImagem}`);
console.log(`   ❌ Sem imagem: ${stats.semImagem}`);
console.log(`   ⚠️  Imagens não encontradas: ${stats.imagensInvalidas.length}\n`);

if (stats.semImagem > 0) {
  console.log('❌ Posts SEM imagem:');
  stats.postsSemImagem.slice(0, 10).forEach((post, i) => {
    console.log(`   ${i+1}. ${post.slug}`);
    console.log(`      "${post.title}"`);
  });
  if (stats.semImagem > 10) {
    console.log(`   ... e mais ${stats.semImagem - 10} posts\n`);
  }
}

if (stats.imagensInvalidas.length > 0) {
  console.log('\n⚠️  Imagens referenciadas mas NÃO ENCONTRADAS:');
  stats.imagensInvalidas.forEach((item, i) => {
    console.log(`   ${i+1}. ${item.post}`);
    console.log(`      ${item.imagem}`);
  });
}

// Salvar relatório
fs.writeFileSync('blog-images-report.json', JSON.stringify({
  timestamp: new Date().toISOString(),
  total: posts.length,
  stats,
  postsSemImagem: stats.postsSemImagem
}, null, 2));

console.log('\n📝 Relatório salvo em blog-images-report.json');
