#!/usr/bin/env node
/**
 * Download base CNPJ via GitHub (mais rapido que Receita Federal)
 * Fonte: https://github.com/jonathands/dados-abertos-receita-cnpj/releases/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'bases_dados', 'cnpj_receita_federal');
const RELEASE = '2024.09';
const BASE_URL = `https://github.com/jonathands/dados-abertos-receita-cnpj/releases/download/${RELEASE}/`;

// Arquivos de Sócios (o que você precisa!)
const SOCIOS_FILES = [
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
  'Qualificacoes.zip'
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    const request = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (response) => {
      // GitHub usa redirects para downloads
      if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const total = parseInt(response.headers['content-length'], 10);
      let downloaded = 0;
      let lastPct = 0;

      response.on('data', (chunk) => {
        downloaded += chunk.length;
        const pct = Math.floor((downloaded / total) * 100);
        if (pct >= lastPct + 10) {
          process.stdout.write(` ${pct}%`);
          lastPct = pct;
        }
      });

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(' OK');
        resolve();
      });
    });

    request.on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });

    request.setTimeout(600000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

async function main() {
  console.log('='.repeat(60));
  console.log('  Download Base CNPJ - GitHub Mirror');
  console.log('  Release: ' + RELEASE);
  console.log('='.repeat(60));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`\nDiretorio: ${OUTPUT_DIR}\n`);

  for (let i = 0; i < SOCIOS_FILES.length; i++) {
    const file = SOCIOS_FILES[i];
    const url = BASE_URL + file;
    const dest = path.join(OUTPUT_DIR, file);

    if (fs.existsSync(dest)) {
      const stats = fs.statSync(dest);
      console.log(`[${i+1}/${SOCIOS_FILES.length}] ${file} - ja existe (${formatBytes(stats.size)})`);
      continue;
    }

    process.stdout.write(`[${i+1}/${SOCIOS_FILES.length}] ${file} - baixando...`);

    try {
      await downloadFile(url, dest);
    } catch (err) {
      console.log(` ERRO: ${err.message}`);
    }
  }

  // Calcular total
  let total = 0;
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.zip'));
  files.forEach(f => {
    total += fs.statSync(path.join(OUTPUT_DIR, f)).size;
  });

  console.log('\n' + '='.repeat(60));
  console.log(`  Download concluido! ${files.length} arquivos (${formatBytes(total)})`);
  console.log('='.repeat(60));
}

main().catch(console.error);
