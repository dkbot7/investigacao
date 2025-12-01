#!/usr/bin/env node
/**
 * Processa arquivos de Sócios do CNPJ (formato CSV) e cria banco SQLite
 *
 * ATENÇÃO: O CPF está parcialmente mascarado (***XXXXXX**) nos dados públicos.
 * Apenas os 6 dígitos do meio são visíveis.
 *
 * Uso:
 *   node scripts/processar-socios-cnpj.js           # Processa todos
 *   node scripts/processar-socios-cnpj.js --test    # Processa apenas 1 arquivo
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Database = require('better-sqlite3');
const AdmZip = require('adm-zip');

const INPUT_DIR = path.join(__dirname, '..', 'bases_dados', 'cnpj_receita_federal');
const OUTPUT_DB = path.join(__dirname, '..', 'bases_dados', 'socios.sqlite');

/**
 * Extrai CPF parcial do formato mascarado ***XXXXXX**
 */
function extrairCpfParcial(cpfMascarado) {
  // Remove asteriscos e aspas
  const limpo = cpfMascarado.replace(/[*"]/g, '');
  return limpo.trim();
}

/**
 * Parseia linha CSV com ponto e vírgula
 */
function parseCSV(line) {
  // Remove aspas e split por ;
  const campos = line.split(';').map(c => c.replace(/"/g, '').trim());

  // Layout: cnpj_basico;identificador;nome;cpf;qualificacao;data_entrada;pais;repr_cpf;repr_nome;repr_qual;faixa_etaria
  return {
    cnpj_basico: campos[0],
    identificador_socio: campos[1],
    nome_socio: campos[2],
    cpf_cnpj_socio: campos[3],
    qualificacao: campos[4],
    data_entrada: campos[5],
    pais: campos[6],
    representante_cpf: campos[7],
    representante_nome: campos[8],
    representante_qualificacao: campos[9],
    faixa_etaria: campos[10]
  };
}

async function extractZip(zipPath, tempDir) {
  console.log(`  Extraindo ${path.basename(zipPath)}...`);
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();

  for (const entry of entries) {
    if (entry.entryName.includes('SOCIO') || entry.entryName.endsWith('.csv') || entry.entryName.endsWith('CSV')) {
      const destPath = path.join(tempDir, 'temp_socios.csv');
      zip.extractEntryTo(entry, tempDir, false, true, false, 'temp_socios.csv');
      return destPath;
    }
  }

  // Primeiro arquivo se não encontrar específico
  const entry = entries[0];
  const destPath = path.join(tempDir, 'temp_socios.csv');
  zip.extractEntryTo(entry, tempDir, false, true, false, 'temp_socios.csv');
  return destPath;
}

async function processFile(filePath, db, insertStmt) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, { encoding: 'latin1' }),
      crlfDelay: Infinity
    });

    let count = 0;
    let batch = [];
    const BATCH_SIZE = 10000;

    const insertBatch = () => {
      if (batch.length === 0) return;

      const transaction = db.transaction(() => {
        for (const row of batch) {
          try {
            insertStmt.run(row);
          } catch (e) {
            // Ignora duplicatas
          }
        }
      });
      transaction();
      batch = [];
    };

    rl.on('line', (line) => {
      if (!line || line.length < 20) return;

      try {
        const data = parseCSV(line);

        // Só processa pessoa física (identificador = 2)
        if (data.identificador_socio === '2' && data.cpf_cnpj_socio) {
          const cpfParcial = extrairCpfParcial(data.cpf_cnpj_socio);

          if (cpfParcial && cpfParcial.length >= 6) {
            batch.push({
              cpf_parcial: cpfParcial,
              nome: data.nome_socio,
              cnpj_basico: data.cnpj_basico,
              qualificacao: data.qualificacao,
              data_entrada: data.data_entrada
            });
            count++;

            if (batch.length >= BATCH_SIZE) {
              insertBatch();
              process.stdout.write(`\r    ${count.toLocaleString()} sócios processados...`);
            }
          }
        }
      } catch (e) {
        // Ignora linhas mal formatadas
      }
    });

    rl.on('close', () => {
      insertBatch();
      console.log(`\r    ${count.toLocaleString()} sócios processados.     `);
      resolve(count);
    });

    rl.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const testMode = args.includes('--test');

  console.log('='.repeat(60));
  console.log('  Processador de Sócios CNPJ → SQLite');
  console.log('='.repeat(60));
  console.log('\n⚠️  ATENÇÃO: CPFs estão parcialmente mascarados!');
  console.log('   Apenas os 6 dígitos do meio são visíveis.\n');

  // Verificar arquivos
  const zipFiles = fs.readdirSync(INPUT_DIR)
    .filter(f => f.startsWith('Socios') && f.endsWith('.zip'))
    .sort();

  if (zipFiles.length === 0) {
    console.log('Nenhum arquivo Socios*.zip encontrado.');
    console.log('Execute: node scripts/download-cnpj-github.js');
    process.exit(1);
  }

  console.log(`Encontrados ${zipFiles.length} arquivos de sócios`);
  console.log(`Banco: ${OUTPUT_DB}`);
  console.log(`Modo: ${testMode ? 'TESTE (1 arquivo)' : 'COMPLETO'}\n`);

  // Criar banco
  if (fs.existsSync(OUTPUT_DB)) {
    fs.unlinkSync(OUTPUT_DB);
  }

  const db = new Database(OUTPUT_DB);

  // Criar tabela - usando CPF parcial
  db.exec(`
    CREATE TABLE IF NOT EXISTS socios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cpf_parcial TEXT NOT NULL,
      nome TEXT,
      cnpj_basico TEXT NOT NULL,
      qualificacao TEXT,
      data_entrada TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_socios_cpf ON socios(cpf_parcial);
    CREATE INDEX IF NOT EXISTS idx_socios_nome ON socios(nome);
    CREATE INDEX IF NOT EXISTS idx_socios_cnpj ON socios(cnpj_basico);
  `);

  const insertStmt = db.prepare(`
    INSERT INTO socios (cpf_parcial, nome, cnpj_basico, qualificacao, data_entrada)
    VALUES (@cpf_parcial, @nome, @cnpj_basico, @qualificacao, @data_entrada)
  `);

  // Processar arquivos
  const filesToProcess = testMode ? [zipFiles[0]] : zipFiles;
  let totalSocios = 0;

  for (let i = 0; i < filesToProcess.length; i++) {
    const zipFile = filesToProcess[i];
    console.log(`[${i+1}/${filesToProcess.length}] ${zipFile}`);

    const zipPath = path.join(INPUT_DIR, zipFile);

    try {
      const extractedPath = await extractZip(zipPath, INPUT_DIR);
      const dataFile = path.join(INPUT_DIR, 'temp_socios.csv');

      if (fs.existsSync(dataFile)) {
        const count = await processFile(dataFile, db, insertStmt);
        totalSocios += count;
        fs.unlinkSync(dataFile);
      } else {
        console.log('    Arquivo extraído não encontrado');
      }
    } catch (err) {
      console.log(`    ERRO: ${err.message}`);
    }
  }

  db.close();

  console.log('\n' + '='.repeat(60));
  console.log(`  Concluído! ${totalSocios.toLocaleString()} sócios processados`);
  console.log(`  Banco: ${OUTPUT_DB}`);
  console.log('='.repeat(60));

  const stats = fs.statSync(OUTPUT_DB);
  console.log(`\nTamanho do banco: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  console.log('\nPara consultar por NOME:');
  console.log('  node scripts/consultar-socios.js "JOAO DA SILVA"');
  console.log('\nPara consultar por CPF parcial (6 dígitos do meio):');
  console.log('  node scripts/consultar-socios.js --cpf 775488');
}

main().catch(console.error);
