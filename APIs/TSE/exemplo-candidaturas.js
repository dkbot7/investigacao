/**
 * Script para verificar candidaturas usando dados do TSE
 * Consulta os arquivos CSV baixados do Portal de Dados Abertos do TSE
 *
 * Uso: node verificar-candidaturas-tse.js [quantidade]
 * Exemplo: node verificar-candidaturas-tse.js 3
 *
 * Fonte: https://dadosabertos.tse.jus.br/dataset/candidatos-2024
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Diretórios
const dirDadosTSE = path.join(__dirname, '..', 'dados-tse');
const dirDocumentos = path.join(__dirname, '..', 'documentos');

/**
 * Padroniza CPF com 11 dígitos
 */
function padronizarCPF(cpf) {
  if (!cpf) return '';
  return String(cpf).replace(/\D/g, '').padStart(11, '0');
}

/**
 * Lê um arquivo CSV linha por linha e busca por CPFs
 * Retorna um Map com CPF -> array de candidaturas
 */
async function buscarCandidaturasEmArquivo(arquivo, cpfsBuscados) {
  const candidaturas = new Map();

  // Inicializar Map para cada CPF
  cpfsBuscados.forEach(cpf => candidaturas.set(cpf, []));

  if (!fs.existsSync(arquivo)) {
    console.log(`  ⚠️  Arquivo não encontrado: ${path.basename(arquivo)}`);
    return candidaturas;
  }

  const fileStream = fs.createReadStream(arquivo, { encoding: 'latin1' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let cabecalho = null;
  let linhasProcessadas = 0;
  let candidaturasEncontradas = 0;

  // Índices das colunas relevantes
  let idxCPF = -1;
  let idxNome = -1;
  let idxCargo = -1;
  let idxPartido = -1;
  let idxMunicipio = -1;
  let idxUF = -1;
  let idxSituacao = -1;
  let idxNumero = -1;
  let idxEleito = -1;

  for await (const linha of rl) {
    if (!cabecalho) {
      cabecalho = linha.split(';').map(col => col.replace(/"/g, '').toLowerCase().trim());

      // Encontrar índices das colunas - nomes específicos do TSE
      cabecalho.forEach((col, i) => {
        if (col === 'nr_cpf_candidato') idxCPF = i;
        if (col === 'nm_candidato') idxNome = i;
        if (col === 'ds_cargo') idxCargo = i;
        if (col === 'sg_partido') idxPartido = i;
        if (col === 'nm_ue') idxMunicipio = i;
        if (col === 'sg_uf') idxUF = i;
        if (col === 'ds_situacao_candidatura') idxSituacao = i;
        if (col === 'nr_candidato') idxNumero = i;
        if (col === 'ds_sit_tot_turno') idxEleito = i;
      });

      continue;
    }

    linhasProcessadas++;

    const campos = linha.split(';').map(c => c.replace(/"/g, '').trim());
    const cpfCandidato = padronizarCPF(campos[idxCPF]);

    if (cpfsBuscados.has(cpfCandidato)) {
      const candidatura = {
        nome: campos[idxNome] || 'N/I',
        cargo: campos[idxCargo] || 'N/I',
        partido: campos[idxPartido] || 'N/I',
        numero: campos[idxNumero] || 'N/I',
        municipio: campos[idxMunicipio] || 'N/I',
        uf: campos[idxUF] || 'N/I',
        situacao: campos[idxSituacao] || 'N/I',
        eleito: campos[idxEleito] || 'N/I'
      };

      candidaturas.get(cpfCandidato).push(candidatura);
      candidaturasEncontradas++;
    }

    // Log de progresso a cada 100k linhas
    if (linhasProcessadas % 100000 === 0) {
      process.stdout.write(`\r  Processando... ${linhasProcessadas.toLocaleString()} linhas`);
    }
  }

  console.log(`\r  ✅ ${path.basename(arquivo)}: ${linhasProcessadas.toLocaleString()} linhas, ${candidaturasEncontradas} candidaturas encontradas`);

  return candidaturas;
}

/**
 * Processa todos os arquivos de candidatos de um ano
 */
async function processarAno(ano, cpfsBuscados) {
  console.log(`\n📅 Processando candidaturas de ${ano}...`);

  const candidaturasTotais = new Map();
  cpfsBuscados.forEach(cpf => candidaturasTotais.set(cpf, []));

  // Listar apenas arquivos consulta_cand (dados de candidatos)
  const arquivosExtraidos = fs.readdirSync(dirDadosTSE).filter(f =>
    f.toLowerCase().startsWith('consulta_cand') &&
    f.includes(ano.toString()) &&
    f.endsWith('.csv')
  );

  if (arquivosExtraidos.length === 0) {
    console.log(`  ⚠️  Nenhum arquivo de candidatos encontrado para ${ano}`);
    return candidaturasTotais;
  }

  for (const arquivo of arquivosExtraidos) {
    const caminhoArquivo = path.join(dirDadosTSE, arquivo);
    const candidaturas = await buscarCandidaturasEmArquivo(caminhoArquivo, cpfsBuscados);

    // Mesclar resultados
    for (const [cpf, lista] of candidaturas) {
      candidaturasTotais.get(cpf).push(...lista);
    }
  }

  return candidaturasTotais;
}

/**
 * Formata candidaturas para exibição
 */
function formatarCandidaturas(candidaturas) {
  if (!candidaturas || candidaturas.length === 0) return null;

  const detalhes = candidaturas.map(c => {
    return `${c.cargo} - ${c.partido} (${c.numero}) - ${c.municipio}/${c.uf} - ${c.situacao} - ${c.eleito}`;
  });

  return detalhes.join(' | ');
}

/**
 * Função principal
 */
async function main() {
  const quantidade = parseInt(process.argv[2]) || 3;

  console.log('='.repeat(60));
  console.log('VERIFICAÇÃO DE CANDIDATURAS - Dados TSE');
  console.log('='.repeat(60));
  console.log(`Quantidade a processar: ${quantidade}`);
  console.log(`Fonte: Portal de Dados Abertos do TSE`);

  // Carregar planilha
  const caminhoEntrada = path.join(dirDocumentos, 'Empregados a Disposição - CPFs Corrigidos.xlsx');
  const workbook = XLSX.readFile(caminhoEntrada);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Encontrar colunas
  const cabecalho = dados[0];
  const colunas = { nome: -1, cpf: -1 };

  for (let i = 0; i < cabecalho.length; i++) {
    const col = String(cabecalho[i] || '').toLowerCase().trim();
    if (col === 'nome') colunas.nome = i;
    if (col === 'cpf') colunas.cpf = i;
  }

  // Verificar se existe coluna de candidatura, senão adicionar
  let colunaCandidatura = -1;
  for (let i = 0; i < cabecalho.length; i++) {
    const col = String(cabecalho[i] || '').toLowerCase().trim();
    if (col.includes('candidato') && col.includes('eleicao')) {
      colunaCandidatura = i;
      break;
    }
  }

  // Se não existe, adicionar ao final
  if (colunaCandidatura < 0) {
    colunaCandidatura = cabecalho.length;
    cabecalho.push('foi candidato em alguma eleicao de 2022 e/ou 2024?');
  }

  console.log('\nColunas encontradas:');
  console.log(`  Nome: ${colunas.nome >= 0 ? cabecalho[colunas.nome] : 'NÃO ENCONTRADA'}`);
  console.log(`  CPF: ${colunas.cpf >= 0 ? cabecalho[colunas.cpf] : 'NÃO ENCONTRADA'}`);
  console.log(`  Candidatura: ${cabecalho[colunaCandidatura]}`);

  // Coletar CPFs para busca
  const cpfsParaBuscar = new Set();
  const linhasParaProcessar = Math.min(quantidade, dados.length - 1);

  for (let i = 1; i <= linhasParaProcessar; i++) {
    const linha = dados[i];
    if (linha && linha[colunas.cpf]) {
      cpfsParaBuscar.add(padronizarCPF(linha[colunas.cpf]));
    }
  }

  console.log(`\nCPFs a buscar: ${cpfsParaBuscar.size}`);

  // Processar anos
  const cand2024 = await processarAno(2024, cpfsParaBuscar);
  const cand2022 = await processarAno(2022, cpfsParaBuscar);

  // Atualizar planilha
  console.log('\n📝 Atualizando planilha...');

  const resultado = {
    processados: 0,
    comCandidatura: 0,
    semCandidatura: 0
  };

  for (let i = 1; i <= linhasParaProcessar; i++) {
    const linha = dados[i];
    if (!linha) continue;

    const nome = linha[colunas.nome] || 'N/A';
    const cpf = padronizarCPF(linha[colunas.cpf]);

    if (!cpf) continue;

    resultado.processados++;

    const c2024 = cand2024.get(cpf) || [];
    const c2022 = cand2022.get(cpf) || [];

    const desc2024 = formatarCandidaturas(c2024);
    const desc2022 = formatarCandidaturas(c2022);

    if (desc2024 || desc2022) {
      const partes = [];
      if (desc2022) partes.push(`2022: ${desc2022}`);
      if (desc2024) partes.push(`2024: ${desc2024}`);

      console.log(`[${i}] ${nome.substring(0, 30)}... 🗳️ FOI CANDIDATO`);
      partes.forEach(p => console.log(`    ${p}`));

      linha[colunaCandidatura] = `SIM - ${partes.join(' | ')}`;
      resultado.comCandidatura++;
    } else {
      console.log(`[${i}] ${nome.substring(0, 30)}... ✅ Não foi candidato`);
      linha[colunaCandidatura] = 'NÃO - Não foi candidato em 2022 nem 2024';
      resultado.semCandidatura++;
    }
  }

  // Salvar planilha
  const caminhoSaida = path.join(dirDocumentos, 'Empregados a Disposição - Candidaturas-TSE.xlsx');
  const novaWorksheet = XLSX.utils.aoa_to_sheet(dados);
  const novoWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(novoWorkbook, novaWorksheet, sheetName);
  XLSX.writeFile(novoWorkbook, caminhoSaida);

  console.log('\n' + '='.repeat(60));
  console.log('RESUMO FINAL');
  console.log('='.repeat(60));
  console.log(`Processados: ${resultado.processados}`);
  console.log(`Foram candidatos: ${resultado.comCandidatura}`);
  console.log(`Não foram candidatos: ${resultado.semCandidatura}`);
  console.log(`Arquivo salvo: ${path.basename(caminhoSaida)}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
