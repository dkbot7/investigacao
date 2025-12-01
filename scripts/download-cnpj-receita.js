#!/usr/bin/env node
/**
 * Script para baixar base de dados CNPJ da Receita Federal
 * Fonte: https://dadosabertos.rfb.gov.br/CNPJ/
 *
 * Uso: node scripts/download-cnpj-receita.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuração
const BASE_URL = 'https://dadosabertos.rfb.gov.br/CNPJ/';
const OUTPUT_DIR = path.join(__dirname, '..', 'bases_dados', 'cnpj_receita_federal');

// Arquivos para baixar (socios é o mais importante para vinculos)
const ARQUIVOS = [
  // Sócios - QSA completo (o que você precisa!)
  'Socios0.zip',
  'Socios1.zip',
  'Socios2.zip',
  'Socios3.zip',
  'Socios4.zip',
  'Socios5.zip',
  'Socios6.zip',
  'Socios7.zip',
  'Socios8.zip',
  'Socios9.zip',

  // Empresas - dados cadastrais
  'Empresas0.zip',
  'Empresas1.zip',
  'Empresas2.zip',
  'Empresas3.zip',
  'Empresas4.zip',
  'Empresas5.zip',
  'Empresas6.zip',
  'Empresas7.zip',
  'Empresas8.zip',
  'Empresas9.zip',

  // Estabelecimentos - endereços, telefones
  'Estabelecimentos0.zip',
  'Estabelecimentos1.zip',
  'Estabelecimentos2.zip',
  'Estabelecimentos3.zip',
  'Estabelecimentos4.zip',
  'Estabelecimentos5.zip',
  'Estabelecimentos6.zip',
  'Estabelecimentos7.zip',
  'Estabelecimentos8.zip',
  'Estabelecimentos9.zip',

  // Tabelas auxiliares
  'Cnaes.zip',
  'Motivos.zip',
  'Municipios.zip',
  'Naturezas.zip',
  'Paises.zip',
  'Qualificacoes.zip',
  'Simples.zip'
];

// Apenas sócios (download rápido para teste)
const APENAS_SOCIOS = [
  'Socios0.zip',
  'Socios1.zip',
  'Socios2.zip',
  'Socios3.zip',
  'Socios4.zip',
  'Socios5.zip',
  'Socios6.zip',
  'Socios7.zip',
  'Socios8.zip',
  'Socios9.zip',
  'Qualificacoes.zip' // tabela de qualificações (socio-administrador, etc)
];

/**
 * Baixa um arquivo com suporte a redirect
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    const request = (url.startsWith('https') ? https : http).get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;
      let lastPercent = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const percent = Math.floor((downloadedSize / totalSize) * 100);
        if (percent > lastPercent && percent % 10 === 0) {
          process.stdout.write(`  ${percent}%`);
          lastPercent = percent;
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(' OK');
        resolve(destPath);
      });
    });

    request.on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });

    request.setTimeout(300000, () => { // 5 min timeout
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

/**
 * Formata bytes para exibição
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);
  const apenassocios = args.includes('--socios') || args.includes('-s');
  const arquivos = apenassocios ? APENAS_SOCIOS : ARQUIVOS;

  console.log('='.repeat(60));
  console.log('  Download Base CNPJ - Receita Federal');
  console.log('='.repeat(60));
  console.log(`\nDiretório: ${OUTPUT_DIR}`);
  console.log(`Arquivos: ${arquivos.length}`);
  console.log(`Modo: ${apenassocios ? 'Apenas Sócios (~3GB)' : 'Completo (~25GB)'}`);
  console.log('\n' + '-'.repeat(60));

  // Criar diretório se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < arquivos.length; i++) {
    const arquivo = arquivos[i];
    const url = BASE_URL + arquivo;
    const destPath = path.join(OUTPUT_DIR, arquivo);

    // Pular se já existe
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      console.log(`[${i+1}/${arquivos.length}] ${arquivo} - já existe (${formatBytes(stats.size)})`);
      successCount++;
      continue;
    }

    process.stdout.write(`[${i+1}/${arquivos.length}] ${arquivo} - baixando...`);

    try {
      await downloadFile(url, destPath);
      const stats = fs.statSync(destPath);
      console.log(`    Tamanho: ${formatBytes(stats.size)}`);
      successCount++;
    } catch (err) {
      console.log(` ERRO: ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`  Concluído: ${successCount} OK, ${errorCount} erros`);
  console.log('='.repeat(60));

  // Listar arquivos baixados
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    let totalSize = 0;
    files.forEach(f => {
      const stats = fs.statSync(path.join(OUTPUT_DIR, f));
      totalSize += stats.size;
    });
    console.log(`\nTotal baixado: ${formatBytes(totalSize)}`);
  }
}

main().catch(console.error);
