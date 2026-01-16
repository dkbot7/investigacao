/**
 * Gerador de Imagens para Blog - Investigaree
 *
 * Usa OpenAI Image API com DALL-E 3 para gerar
 * imagens customizadas para os posts do blog baseado nos prompts
 * otimizados gerados pelo analyze-images.js
 *
 * Baseado na documentação oficial:
 * https://platform.openai.com/docs/guides/images
 * https://platform.openai.com/docs/api-reference/images/create
 */

const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuração da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Carregar prompts
const promptsPath = path.join(__dirname, 'image-prompts.json');
const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));

// Diretório para salvar imagens
const outputDir = path.join(__dirname, 'public', 'images', 'blog', 'generated');

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Download de imagem de uma URL
 */
const https = require('https');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = require('fs').createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      require('fs').unlink(filepath, () => reject(err));
    });
  });
}

/**
 * Gerar imagem usando Image API com DALL-E 3
 *
 * @param {Object} post - Post data com prompt
 * @param {number} index - Index atual
 * @param {number} total - Total de imagens
 * @returns {Promise<Object>} - Resultado da geração
 */
async function generateImage(post, index, total) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🎨 GERANDO IMAGEM ${index + 1}/${total}`);
  console.log(`${'═'.repeat(80)}\n`);
  console.log(`📌 POST #${post.id}: ${post.title}`);
  console.log(`🔖 SLUG: ${post.slug}\n`);
  console.log(`💬 PROMPT:\n${post.prompt}\n`);
  console.log(`⏳ Aguardando resposta da OpenAI Image API...\n`);

  try {
    // Gerar imagem usando Image API
    // https://platform.openai.com/docs/api-reference/images/create
    const response = await openai.images.generate({
      model: "dall-e-3", // DALL-E 3 não requer org verification
      prompt: post.prompt,
      n: 1, // Gerar 1 imagem
      size: "1792x1024", // Landscape format (depois crop para 1200x675)
      quality: "hd", // HD quality
    });

    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;

    console.log(`✅ Imagem gerada com sucesso!`);
    console.log(`🔗 URL temporária: ${imageUrl}`);

    if (revisedPrompt && revisedPrompt !== post.prompt) {
      console.log(`\n🔄 Prompt revisado pela OpenAI:\n${revisedPrompt}`);
    }
    console.log('');

    // Nome do arquivo
    const filename = `${post.slug}.png`;
    const filepath = path.join(outputDir, filename);

    // Download da imagem
    console.log(`💾 Baixando imagem...`);
    await downloadImage(imageUrl, filepath);

    // Obter tamanho do arquivo
    const stats = fs.statSync(filepath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`✅ Salvo em: ${filepath}`);
    console.log(`📦 Tamanho: ${fileSizeInMB} MB\n`);

    // Retornar informações
    return {
      success: true,
      post: post,
      filename: filename,
      filepath: filepath,
      localPath: `/images/blog/generated/${filename}`,
      fileSize: fileSizeInMB,
      revisedPrompt: revisedPrompt || null,
      url: imageUrl,
    };

  } catch (error) {
    console.error(`❌ ERRO ao gerar imagem:`);
    console.error(`   Mensagem: ${error.message}`);

    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.data, null, 2));
    }

    if (error.status === 429) {
      console.error('\n   ⚠️  Rate limit atingido. Aguarde alguns segundos e tente novamente.');
    } else if (error.status === 400) {
      console.error('\n   ⚠️  Prompt pode violar políticas de conteúdo ou ter problema de formato.');
    }

    console.log('');

    return {
      success: false,
      post: post,
      error: error.message,
      errorCode: error.status,
    };
  }
}

/**
 * Delay entre requisições para respeitar rate limits
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main - Gerar imagens prioritárias
 */
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════════════╗');
  console.log('║  🎨  GERADOR DE IMAGENS - BLOG INVESTIGAREE                              ║');
  console.log('║  Powered by OpenAI DALL-E 3                                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════╝\n');

  // Verificar API Key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERRO: OPENAI_API_KEY não encontrada no .env.local');
    console.error('💡 Adicione sua API Key ao arquivo .env.local');
    console.error('\nExemplo:');
    console.error('OPENAI_API_KEY=sk-proj-...\n');
    process.exit(1);
  }

  console.log('✅ API Key da OpenAI encontrada');
  console.log(`📂 Diretório de saída: ${outputDir}\n`);

  // Filtrar posts prioritários (featured)
  const priorityPosts = prompts.filter(p =>
    ['1', '2', '3'].includes(p.id) // Posts #1, #2, #3 (featured)
  );

  console.log(`🎯 Posts prioritários selecionados: ${priorityPosts.length}\n`);
  priorityPosts.forEach((p, i) => {
    console.log(`   ${i + 1}. POST #${p.id} - ${p.title.substring(0, 60)}...`);
  });

  console.log(`\n⚙️  Configurações:`);
  console.log(`   Modelo: dall-e-3`);
  console.log(`   Tamanho: 1792x1024 (landscape - depois crop para 1200x675)`);
  console.log(`   Qualidade: hd`);
  console.log(`   Formato: PNG\n`);

  console.log(`💰 Estimativa de custo:`);
  console.log(`   DALL-E 3 HD (1792x1024): $0.12 por imagem`);
  console.log(`   Total de imagens: ${priorityPosts.length} × $0.12 = $${(priorityPosts.length * 0.12).toFixed(2)}`);
  console.log(`   Consulte: https://openai.com/api/pricing/\n`);

  const results = [];

  // Gerar cada imagem
  for (let i = 0; i < priorityPosts.length; i++) {
    const post = priorityPosts[i];

    // Gerar imagem
    const result = await generateImage(post, i, priorityPosts.length);
    results.push(result);

    // Delay entre requisições para evitar rate limit
    if (i < priorityPosts.length - 1) {
      const delaySeconds = 5;
      console.log(`⏸️  Aguardando ${delaySeconds} segundos antes da próxima imagem...`);
      console.log(`   (Para evitar rate limits da OpenAI)\n`);
      await sleep(delaySeconds * 1000);
    }
  }

  // Resumo final
  console.log(`\n${'═'.repeat(80)}`);
  console.log('📊 RESUMO FINAL');
  console.log(`${'═'.repeat(80)}\n`);

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Geradas com sucesso: ${successful.length}/${results.length}`);
  console.log(`❌ Falharam: ${failed.length}/${results.length}\n`);

  if (successful.length > 0) {
    console.log('🖼️  IMAGENS GERADAS:\n');

    let totalSize = 0;

    successful.forEach((r, i) => {
      console.log(`   ${i + 1}. POST #${r.post.id} - ${r.post.slug}`);
      console.log(`      📁 Local: ${r.localPath}`);
      console.log(`      📦 Tamanho: ${r.fileSize} MB`);

      if (r.revisedPrompt && r.revisedPrompt !== r.post.prompt) {
        console.log(`      🔄 Prompt revisado: ${r.revisedPrompt.substring(0, 80)}...`);
      }

      console.log('');
      totalSize += parseFloat(r.fileSize);
    });

    console.log(`   📊 Tamanho total: ${totalSize.toFixed(2)} MB\n`);
  }

  if (failed.length > 0) {
    console.log('❌ ERROS:\n');
    failed.forEach((r, i) => {
      console.log(`   ${i + 1}. POST #${r.post.id} - ${r.post.slug}`);
      console.log(`      Erro: ${r.error}`);
      if (r.errorCode) {
        console.log(`      Código: ${r.errorCode}`);
      }
      console.log('');
    });
  }

  // Salvar resultados em JSON
  const resultsPath = path.join(__dirname, 'image-generation-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`💾 Resultados salvos em: ${resultsPath}\n`);

  // Próximos passos
  if (successful.length > 0) {
    console.log(`${'═'.repeat(80)}`);
    console.log('🚀 PRÓXIMOS PASSOS');
    console.log(`${'═'.repeat(80)}\n`);
    console.log('1. ✅ Verificar as imagens geradas em: public/images/blog/generated/\n');
    console.log('2. 🖼️  OPCIONAL: Fazer crop para 1200x675px se necessário\n');
    console.log('3. 📝 Atualizar coverImage no MDX de cada post:\n');

    successful.forEach((r) => {
      const mdxPath = `content/blog/${r.post.slug}.mdx`;
      console.log(`   ${mdxPath}:`);
      console.log(`   coverImage: "${r.localPath}"\n`);
    });

    console.log('4. 🔄 Regenerar mockPosts.ts:');
    console.log('   node generate-mockposts.js\n');
    console.log('5. 🏗️  Build do projeto:');
    console.log('   npm run build\n');
    console.log('6. 🚀 Deploy:');
    console.log('   npm run deploy\n');
  }

  console.log('✨ Geração concluída!\n');

  if (failed.length > 0) {
    process.exit(1);
  }
}

// Executar
main().catch((error) => {
  console.error('\n❌ Erro fatal:', error.message);
  process.exit(1);
});
