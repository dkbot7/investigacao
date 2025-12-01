#!/usr/bin/env node
/**
 * Consulta sócios no banco local
 *
 * Uso:
 *   node scripts/consultar-socios.js "JOAO DA SILVA"        # Busca por nome
 *   node scripts/consultar-socios.js --cpf 775488           # Busca por CPF parcial (6 dígitos)
 *   node scripts/consultar-socios.js --cnpj 12345678        # Busca sócios de um CNPJ
 */

const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'bases_dados', 'socios.sqlite');

if (!fs.existsSync(DB_PATH)) {
  console.log('Banco de dados não encontrado!');
  console.log('Execute:');
  console.log('  1. node scripts/download-cnpj-github.js');
  console.log('  2. node scripts/processar-socios-cnpj.js');
  process.exit(1);
}

const Database = require('better-sqlite3');
const db = new Database(DB_PATH, { readonly: true });

// Qualificações
const QUALIFICACOES = {
  '05': 'Administrador',
  '08': 'Conselheiro de Administração',
  '10': 'Diretor',
  '16': 'Presidente',
  '17': 'Procurador',
  '22': 'Sócio',
  '28': 'Sócio-Administrador',
  '29': 'Sócio-Gerente',
  '49': 'Sócio-Administrador',
  '50': 'Sócio Comanditado',
  '51': 'Sócio Comanditário',
  '52': 'Sócio de Indústria',
  '53': 'Sócio-Gerente',
  '54': 'Fundador',
  '55': 'Sócio Ostensivo',
  '56': 'Sócio Participante',
  '57': 'Sócio Proprietário',
  '65': 'Titular PF Residente Brasil',
  '66': 'Titular PF Residente Exterior'
};

function formatarData(data) {
  if (!data || data.length !== 8) return data || 'N/A';
  return `${data.substr(6,2)}/${data.substr(4,2)}/${data.substr(0,4)}`;
}

function buscarPorNome(nome) {
  const stmt = db.prepare(`
    SELECT cpf_parcial, nome, cnpj_basico, qualificacao, data_entrada
    FROM socios
    WHERE nome LIKE ?
    ORDER BY nome, data_entrada DESC
    LIMIT 100
  `);

  return stmt.all(`%${nome.toUpperCase()}%`);
}

function buscarPorCpfParcial(cpfParcial) {
  const stmt = db.prepare(`
    SELECT cpf_parcial, nome, cnpj_basico, qualificacao, data_entrada
    FROM socios
    WHERE cpf_parcial LIKE ?
    ORDER BY data_entrada DESC
    LIMIT 100
  `);

  return stmt.all(`%${cpfParcial}%`);
}

function buscarPorCnpj(cnpjBasico) {
  const stmt = db.prepare(`
    SELECT cpf_parcial, nome, cnpj_basico, qualificacao, data_entrada
    FROM socios
    WHERE cnpj_basico = ?
    ORDER BY qualificacao, nome
  `);

  return stmt.all(cnpjBasico.replace(/\D/g, '').substring(0, 8));
}

function exibirResultados(resultados, titulo) {
  console.log('='.repeat(60));
  console.log(`  ${titulo}`);
  console.log('='.repeat(60));

  if (resultados.length === 0) {
    console.log('\n❌ Nenhum resultado encontrado.');
    return;
  }

  console.log(`\n✅ ${resultados.length} resultado(s):\n`);
  console.log('-'.repeat(60));

  resultados.forEach((r, i) => {
    const qual = QUALIFICACOES[r.qualificacao] || r.qualificacao;
    console.log(`[${i+1}] ${r.nome}`);
    console.log(`    CPF parcial: ***${r.cpf_parcial}**`);
    console.log(`    CNPJ base: ${r.cnpj_basico}`);
    console.log(`    Qualificação: ${qual}`);
    console.log(`    Entrada: ${formatarData(r.data_entrada)}`);
    console.log('-'.repeat(60));
  });

  // Estatísticas
  if (resultados.length > 1) {
    const cnpjs = new Set(resultados.map(r => r.cnpj_basico));
    const nomes = new Set(resultados.map(r => r.nome));
    console.log(`\nResumo:`);
    console.log(`  Pessoas únicas: ${nomes.size}`);
    console.log(`  Empresas únicas: ${cnpjs.size}`);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Uso:');
    console.log('  node scripts/consultar-socios.js "NOME DA PESSOA"');
    console.log('  node scripts/consultar-socios.js --cpf 775488');
    console.log('  node scripts/consultar-socios.js --cnpj 12345678');
    console.log('\n⚠️  CPFs estão parcialmente mascarados (apenas 6 dígitos do meio)');
    process.exit(1);
  }

  let resultados;
  let titulo;

  if (args[0] === '--cpf' && args[1]) {
    const cpf = args[1].replace(/\D/g, '');
    titulo = `Busca por CPF parcial: ${cpf}`;
    resultados = buscarPorCpfParcial(cpf);
  } else if (args[0] === '--cnpj' && args[1]) {
    const cnpj = args[1].replace(/\D/g, '').substring(0, 8);
    titulo = `Sócios do CNPJ base: ${cnpj}`;
    resultados = buscarPorCnpj(cnpj);
  } else {
    const nome = args.join(' ');
    titulo = `Busca por nome: "${nome}"`;
    resultados = buscarPorNome(nome);
  }

  exibirResultados(resultados, titulo);
  db.close();
}

main();
