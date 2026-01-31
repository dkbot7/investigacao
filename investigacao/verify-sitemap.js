/**
 * Script de verificação do sitemap.xml
 */

const sitemap = require('./src/app/sitemap.ts').default;

console.log('🔍 Verificando sitemap.xml...\n');

const urls = sitemap();

console.log(`📊 Total de URLs: ${urls.length}`);
console.log('\n📋 Distribuição:');

const categories = {
  'Homepage': urls.filter(u => u.url.endsWith('.com.br') || u.url.endsWith('.com.br/')).length,
  'Institucionais': urls.filter(u => /\/(about|quemsomos|sobre|contato|metodologia|cases|recursos|series|faq|glossario)$/.test(u.url)).length,
  'Serviços': urls.filter(u => /\/servicos/.test(u.url)).length,
  'Soluções': urls.filter(u => /\/solucoes/.test(u.url)).length,
  'Preços': urls.filter(u => /\/precos/.test(u.url)).length,
  'Blog Index': urls.filter(u => u.url.endsWith('/blog')).length,
  'Blog Posts': urls.filter(u => /\/blog\/[a-z0-9-]+$/.test(u.url)).length,
  'Legal': urls.filter(u => /\/(privacidade|termos|cookies|disclaimer|lgpd)$/.test(u.url)).length,
};

Object.entries(categories).forEach(([name, count]) => {
  console.log(`   - ${name}: ${count}`);
});

console.log('\n✅ Primeiras 10 URLs:');
urls.slice(0, 10).forEach((url, i) => {
  console.log(`   ${i+1}. ${url.url} (prioridade: ${url.priority})`);
});

console.log('\n📝 Últimas 5 URLs (posts do blog):');
urls.slice(-5).forEach((url, i) => {
  console.log(`   ${urls.length - 4 + i}. ${url.url} (prioridade: ${url.priority})`);
});

console.log('\n✨ Verificação concluída!');
