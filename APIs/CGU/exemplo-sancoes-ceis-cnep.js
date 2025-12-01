/**
 * Script para verificar sanções usando dados da CGU (CEIS/CNEP)
 * Consulta os arquivos CSV baixados do Portal da Transparência
 *
 * Uso: node verificar-sancoes-cgu.js [quantidade]
 * Exemplo: node verificar-sancoes-cgu.js 1359
 *
 * Fonte: https://portaldatransparencia.gov.br/download-de-dados/ceis
 *        https://portaldatransparencia.gov.br/download-de-dados/cnep
 *
 * CEIS = Cadastro de Empresas Inidôneas e Suspensas (sanções administrativas)
 * CNEP = Cadastro Nacional de Empresas Punidas (Lei Anticorrupção)
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Diretórios
const dirDadosCGU = path.join(__dirname, '..', 'dados-cgu');
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
 * Retorna um Map com CPF -> array de sanções
 */
async function buscarSancoesEmArquivo(arquivo, cpfsBuscados, cadastro) {
  const sancoes = new Map();

  // Inicializar Map para cada CPF
  cpfsBuscados.forEach(cpf => sancoes.set(cpf, []));

  if (!fs.existsSync(arquivo)) {
    console.log(`  ⚠️  Arquivo não encontrado: ${path.basename(arquivo)}`);
    return sancoes;
  }

  const fileStream = fs.createReadStream(arquivo, { encoding: 'latin1' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let cabecalho = null;
  let linhasProcessadas = 0;
  let sancoesEncontradas = 0;

  // Índices das colunas relevantes
  let idxCPF = -1;
  let idxTipoPessoa = -1;
  let idxNome = -1;
  let idxCategoria = -1;
  let idxDataInicio = -1;
  let idxDataFinal = -1;
  let idxOrgao = -1;
  let idxUF = -1;
  let idxProcesso = -1;
  let idxFundamentacao = -1;

  for await (const linha of rl) {
    if (!cabecalho) {
      cabecalho = linha.split(';').map(col => col.replace(/"/g, '').toLowerCase().trim());

      // Encontrar índices das colunas
      cabecalho.forEach((col, i) => {
        if (col.includes('cpf ou cnpj')) idxCPF = i;
        if (col === 'tipo de pessoa') idxTipoPessoa = i;
        if (col === 'nome do sancionado') idxNome = i;
        if (col.includes('categoria')) idxCategoria = i;
        if (col.includes('data início')) idxDataInicio = i;
        if (col.includes('data final')) idxDataFinal = i;
        if (col.includes('órgão sancionador') && !col.includes('uf') && !col.includes('esfera')) idxOrgao = i;
        if (col === 'uf órgão sancionador') idxUF = i;
        if (col.includes('número do processo')) idxProcesso = i;
        if (col.includes('fundamentação')) idxFundamentacao = i;
      });

      continue;
    }

    linhasProcessadas++;

    const campos = linha.split(';').map(c => c.replace(/"/g, '').trim());
    const tipoPessoa = campos[idxTipoPessoa];

    // Só processar pessoas físicas (F)
    if (tipoPessoa !== 'F') continue;

    const cpfSancionado = padronizarCPF(campos[idxCPF]);

    if (cpfsBuscados.has(cpfSancionado)) {
      const sancao = {
        cadastro: cadastro,
        nome: campos[idxNome] || 'N/I',
        categoria: campos[idxCategoria] || 'N/I',
        dataInicio: campos[idxDataInicio] || 'N/I',
        dataFinal: campos[idxDataFinal] || 'N/I',
        orgao: campos[idxOrgao] || 'N/I',
        uf: campos[idxUF] || 'N/I',
        processo: campos[idxProcesso] || 'N/I',
        fundamentacao: (campos[idxFundamentacao] || '').substring(0, 100)
      };

      sancoes.get(cpfSancionado).push(sancao);
      sancoesEncontradas++;
    }

    // Log de progresso a cada 50k linhas
    if (linhasProcessadas % 50000 === 0) {
      process.stdout.write(`\r  Processando... ${linhasProcessadas.toLocaleString()} linhas`);
    }
  }

  console.log(`\r  ✅ ${path.basename(arquivo)}: ${linhasProcessadas.toLocaleString()} linhas, ${sancoesEncontradas} sanções encontradas`);

  return sancoes;
}

/**
 * Processa todos os arquivos de sanções
 */
async function processarSancoes(cpfsBuscados) {
  console.log(`\n📅 Processando sanções CGU...`);

  const sancoesTotais = new Map();
  cpfsBuscados.forEach(cpf => sancoesTotais.set(cpf, []));

  // Listar arquivos CSV de sanções
  const arquivosCEIS = fs.readdirSync(dirDadosCGU).filter(f =>
    f.toUpperCase().includes('CEIS') &&
    f.endsWith('.csv')
  );

  const arquivosCNEP = fs.readdirSync(dirDadosCGU).filter(f =>
    f.toUpperCase().includes('CNEP') &&
    f.endsWith('.csv')
  );

  console.log(`\n🔍 Processando CEIS (Empresas Inidôneas e Suspensas)...`);
  for (const arquivo of arquivosCEIS) {
    const caminhoArquivo = path.join(dirDadosCGU, arquivo);
    const sancoes = await buscarSancoesEmArquivo(caminhoArquivo, cpfsBuscados, 'CEIS');

    // Mesclar resultados
    for (const [cpf, lista] of sancoes) {
      sancoesTotais.get(cpf).push(...lista);
    }
  }

  console.log(`\n🔍 Processando CNEP (Lei Anticorrupção)...`);
  for (const arquivo of arquivosCNEP) {
    const caminhoArquivo = path.join(dirDadosCGU, arquivo);
    const sancoes = await buscarSancoesEmArquivo(caminhoArquivo, cpfsBuscados, 'CNEP');

    // Mesclar resultados
    for (const [cpf, lista] of sancoes) {
      sancoesTotais.get(cpf).push(...lista);
    }
  }

  return sancoesTotais;
}

/**
 * Formata sanções para exibição
 */
function formatarSancoes(sancoes) {
  if (!sancoes || sancoes.length === 0) return null;

  const detalhes = sancoes.map(s => {
    return `[${s.cadastro}] ${s.categoria} - ${s.orgao}/${s.uf} (${s.dataInicio} a ${s.dataFinal})`;
  });

  return detalhes.join(' | ');
}

/**
 * Função principal
 */
async function main() {
  const quantidade = parseInt(process.argv[2]) || 1359;

  console.log('='.repeat(60));
  console.log('VERIFICAÇÃO DE SANÇÕES - Dados CGU (CEIS/CNEP)');
  console.log('='.repeat(60));
  console.log(`Quantidade a processar: ${quantidade}`);
  console.log(`Fonte: Portal da Transparência - CGU`);

  // Carregar planilha - Empregados à Disposição
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

  // Verificar se existe coluna de sanções, senão adicionar
  let colunaSancoes = -1;
  for (let i = 0; i < cabecalho.length; i++) {
    const col = String(cabecalho[i] || '').toLowerCase().trim();
    if (col.includes('sanç') || col.includes('ceis') || col.includes('cnep')) {
      colunaSancoes = i;
      break;
    }
  }

  // Se não existe, adicionar ao final
  if (colunaSancoes < 0) {
    colunaSancoes = cabecalho.length;
    cabecalho.push('possui sanção administrativa (CEIS/CNEP)?');
  }

  console.log('\nColunas encontradas:');
  console.log(`  Nome: ${colunas.nome >= 0 ? cabecalho[colunas.nome] : 'NÃO ENCONTRADA'}`);
  console.log(`  CPF: ${colunas.cpf >= 0 ? cabecalho[colunas.cpf] : 'NÃO ENCONTRADA'}`);
  console.log(`  Sanções: ${cabecalho[colunaSancoes]}`);

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

  // Processar sanções
  const sancoes = await processarSancoes(cpfsParaBuscar);

  // Atualizar planilha
  console.log('\n📝 Atualizando planilha...');

  const resultado = {
    processados: 0,
    comSancao: 0,
    semSancao: 0
  };

  for (let i = 1; i <= linhasParaProcessar; i++) {
    const linha = dados[i];
    if (!linha) continue;

    const nome = linha[colunas.nome] || 'N/A';
    const cpf = padronizarCPF(linha[colunas.cpf]);

    if (!cpf) continue;

    resultado.processados++;

    const sancoesEncontradas = sancoes.get(cpf) || [];
    const descSancoes = formatarSancoes(sancoesEncontradas);

    if (descSancoes) {
      console.log(`[${i}] ${nome.substring(0, 30)}... ⚠️ SANCIONADO`);
      console.log(`    ${descSancoes}`);

      linha[colunaSancoes] = `SIM - ${descSancoes}`;
      resultado.comSancao++;
    } else {
      linha[colunaSancoes] = 'NÃO - Sem sanções no CEIS/CNEP';
      resultado.semSancao++;
    }

    // Log de progresso a cada 500 registros
    if (resultado.processados % 500 === 0) {
      console.log(`  Progresso: ${resultado.processados}/${linhasParaProcessar} processados`);
    }
  }

  // Salvar planilha
  const caminhoSaida = path.join(dirDocumentos, 'Empregados a Disposição - Sancoes-CGU.xlsx');
  const novaWorksheet = XLSX.utils.aoa_to_sheet(dados);
  const novoWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(novoWorkbook, novaWorksheet, sheetName);
  XLSX.writeFile(novoWorkbook, caminhoSaida);

  console.log('\n' + '='.repeat(60));
  console.log('RESUMO FINAL');
  console.log('='.repeat(60));
  console.log(`Processados: ${resultado.processados}`);
  console.log(`Com sanções: ${resultado.comSancao}`);
  console.log(`Sem sanções: ${resultado.semSancao}`);
  console.log(`Arquivo salvo: ${path.basename(caminhoSaida)}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
