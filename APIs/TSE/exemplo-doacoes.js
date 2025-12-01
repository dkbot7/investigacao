/**
 * Script para verificar doações de campanha usando dados do TSE
 * Consulta os arquivos CSV baixados do Portal de Dados Abertos do TSE
 *
 * Uso: node verificar-doacoes-tse.js [quantidade]
 * Exemplo: node verificar-doacoes-tse.js 3
 *
 * Fonte: https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2024
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
 * Retorna um Map com CPF -> array de doações
 */
async function buscarDoacoesEmArquivo(arquivo, cpfsBuscados) {
  const doacoes = new Map();

  // Inicializar Map para cada CPF
  cpfsBuscados.forEach(cpf => doacoes.set(cpf, []));

  if (!fs.existsSync(arquivo)) {
    console.log(`  ⚠️  Arquivo não encontrado: ${path.basename(arquivo)}`);
    return doacoes;
  }

  const fileStream = fs.createReadStream(arquivo, { encoding: 'latin1' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let cabecalho = null;
  let linhasProcessadas = 0;
  let doacoesEncontradas = 0;

  // Índices das colunas relevantes
  let idxCPF = -1;
  let idxNomeDoador = -1;
  let idxValor = -1;
  let idxCandidato = -1;
  let idxPartido = -1;
  let idxCargo = -1;
  let idxMunicipio = -1;
  let idxUF = -1;

  for await (const linha of rl) {
    if (!cabecalho) {
      cabecalho = linha.split(';').map(col => col.replace(/"/g, '').toLowerCase().trim());

      // Encontrar índices das colunas - nomes específicos do TSE
      cabecalho.forEach((col, i) => {
        if (col === 'nr_cpf_cnpj_doador') idxCPF = i;
        if (col === 'nm_doador' || col === 'nm_doador_rfb') idxNomeDoador = i;
        if (col === 'vr_receita') idxValor = i;
        if (col === 'nm_candidato') idxCandidato = i;
        if (col === 'sg_partido') idxPartido = i;
        if (col === 'ds_cargo') idxCargo = i;
        if (col === 'nm_ue') idxMunicipio = i;
        if (col === 'sg_uf') idxUF = i;
      });

      continue;
    }

    linhasProcessadas++;

    const campos = linha.split(';').map(c => c.replace(/"/g, '').trim());
    const cpfDoador = padronizarCPF(campos[idxCPF]);

    if (cpfsBuscados.has(cpfDoador)) {
      const doacao = {
        nomeDoador: campos[idxNomeDoador] || 'N/I',
        valor: campos[idxValor] || '0',
        candidato: campos[idxCandidato] || 'N/I',
        partido: campos[idxPartido] || 'N/I',
        cargo: campos[idxCargo] || 'N/I',
        municipio: campos[idxMunicipio] || 'N/I',
        uf: campos[idxUF] || 'N/I'
      };

      doacoes.get(cpfDoador).push(doacao);
      doacoesEncontradas++;
    }

    // Log de progresso a cada 100k linhas
    if (linhasProcessadas % 100000 === 0) {
      process.stdout.write(`\r  Processando... ${linhasProcessadas.toLocaleString()} linhas`);
    }
  }

  console.log(`\r  ✅ ${path.basename(arquivo)}: ${linhasProcessadas.toLocaleString()} linhas, ${doacoesEncontradas} doações encontradas`);

  return doacoes;
}

/**
 * Processa todos os arquivos de receitas de um ano
 */
async function processarAno(ano, cpfsBuscados) {
  console.log(`\n📅 Processando doações de ${ano}...`);

  const doacoesTotais = new Map();
  cpfsBuscados.forEach(cpf => doacoesTotais.set(cpf, []));

  // Padrão de arquivos de receitas
  const padroes = [
    `receitas_candidatos_${ano}_BRASIL.csv`,
    `receitas_candidatos_doadores_${ano}_BRASIL.csv`,
    `receitas_candidatos_${ano}.csv`
  ];

  // Listar arquivos no diretório
  const arquivosExtraidos = fs.readdirSync(dirDadosTSE).filter(f =>
    f.toLowerCase().includes('receita') &&
    f.includes(ano.toString()) &&
    f.endsWith('.csv')
  );

  if (arquivosExtraidos.length === 0) {
    console.log(`  ⚠️  Nenhum arquivo de receitas encontrado para ${ano}`);
    return doacoesTotais;
  }

  for (const arquivo of arquivosExtraidos) {
    const caminhoArquivo = path.join(dirDadosTSE, arquivo);
    const doacoes = await buscarDoacoesEmArquivo(caminhoArquivo, cpfsBuscados);

    // Mesclar resultados
    for (const [cpf, lista] of doacoes) {
      doacoesTotais.get(cpf).push(...lista);
    }
  }

  return doacoesTotais;
}

/**
 * Formata doações para exibição
 */
function formatarDoacoes(doacoes) {
  if (!doacoes || doacoes.length === 0) return null;

  const total = doacoes.reduce((acc, d) => {
    const valor = parseFloat(d.valor.replace(',', '.')) || 0;
    return acc + valor;
  }, 0);

  const detalhes = doacoes.slice(0, 3).map(d => {
    const valor = parseFloat(d.valor.replace(',', '.')) || 0;
    return `${d.candidato} (${d.partido}): R$ ${valor.toFixed(2)}`;
  });

  let resultado = `${doacoes.length} doação(ões) - Total R$ ${total.toFixed(2)}`;
  if (detalhes.length > 0) {
    resultado += ` [${detalhes.join('; ')}]`;
  }
  if (doacoes.length > 3) {
    resultado += ` ... e mais ${doacoes.length - 3}`;
  }

  return resultado;
}

/**
 * Função principal
 */
async function main() {
  const quantidade = parseInt(process.argv[2]) || 3;

  console.log('='.repeat(60));
  console.log('VERIFICAÇÃO DE DOAÇÕES DE CAMPANHA - Dados TSE');
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
  const colunas = { nome: -1, cpf: -1, doacoes: -1 };

  for (let i = 0; i < cabecalho.length; i++) {
    const col = String(cabecalho[i] || '').toLowerCase().trim();
    if (col === 'nome') colunas.nome = i;
    if (col === 'cpf') colunas.cpf = i;
    if (col.includes('doador') && col.includes('campanha')) colunas.doacoes = i;
  }

  console.log('\nColunas encontradas:');
  console.log(`  Nome: ${colunas.nome >= 0 ? cabecalho[colunas.nome] : 'NÃO ENCONTRADA'}`);
  console.log(`  CPF: ${colunas.cpf >= 0 ? cabecalho[colunas.cpf] : 'NÃO ENCONTRADA'}`);
  console.log(`  Doações: ${colunas.doacoes >= 0 ? cabecalho[colunas.doacoes] : 'NÃO ENCONTRADA'}`);

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
  const doacoes2024 = await processarAno(2024, cpfsParaBuscar);
  const doacoes2022 = await processarAno(2022, cpfsParaBuscar);

  // Atualizar planilha
  console.log('\n📝 Atualizando planilha...');

  const resultado = {
    processados: 0,
    comDoacoes: 0,
    semDoacoes: 0
  };

  for (let i = 1; i <= linhasParaProcessar; i++) {
    const linha = dados[i];
    if (!linha) continue;

    const nome = linha[colunas.nome] || 'N/A';
    const cpf = padronizarCPF(linha[colunas.cpf]);

    if (!cpf) continue;

    resultado.processados++;

    const d2024 = doacoes2024.get(cpf) || [];
    const d2022 = doacoes2022.get(cpf) || [];

    const desc2024 = formatarDoacoes(d2024);
    const desc2022 = formatarDoacoes(d2022);

    if (desc2024 || desc2022) {
      const partes = [];
      if (desc2022) partes.push(`2022: ${desc2022}`);
      if (desc2024) partes.push(`2024: ${desc2024}`);

      console.log(`[${i}] ${nome.substring(0, 30)}... 💰 DOADOR`);
      partes.forEach(p => console.log(`    ${p}`));

      if (colunas.doacoes >= 0) {
        linha[colunas.doacoes] = `SIM - ${partes.join(' | ')}`;
      }
      resultado.comDoacoes++;
    } else {
      console.log(`[${i}] ${nome.substring(0, 30)}... ✅ Sem doações`);

      if (colunas.doacoes >= 0) {
        linha[colunas.doacoes] = 'NÃO - Sem doações em 2022 e 2024';
      }
      resultado.semDoacoes++;
    }
  }

  // Salvar planilha
  const caminhoSaida = path.join(dirDocumentos, 'Empregados a Disposição - Doacoes-TSE.xlsx');
  const novaWorksheet = XLSX.utils.aoa_to_sheet(dados);
  const novoWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(novoWorkbook, novaWorksheet, sheetName);
  XLSX.writeFile(novoWorkbook, caminhoSaida);

  console.log('\n' + '='.repeat(60));
  console.log('RESUMO FINAL');
  console.log('='.repeat(60));
  console.log(`Processados: ${resultado.processados}`);
  console.log(`Com doações: ${resultado.comDoacoes}`);
  console.log(`Sem doações: ${resultado.semDoacoes}`);
  console.log(`Arquivo salvo: ${path.basename(caminhoSaida)}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
