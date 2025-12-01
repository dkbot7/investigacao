/**
 * Script para verificar óbito usando a API Infosimples
 * Preenche as colunas "esta vivo?" e "esta morto?"
 *
 * Uso: node verificar-obito.js [quantidade]
 * Exemplo: node verificar-obito.js 3
 */

const XLSX = require('xlsx');
const path = require('path');

// Configuração
const INFOSIMPLES_TOKEN = '43nV3YhetfYkxAZAUGCRNp8gcWtJazIoIRxu1mMm';
const INFOSIMPLES_URL = 'https://api.infosimples.com/api/v2/consultas/receita-federal/cpf';

// Delay entre requisições (ms)
const DELAY_ENTRE_REQUISICOES = 2000;

/**
 * Padroniza CPF com 11 dígitos
 */
function padronizarCPF(cpf) {
  if (!cpf) return '';
  return String(cpf).replace(/\D/g, '').padStart(11, '0');
}

/**
 * Converte data do formato Excel para YYYY-MM-DD
 */
function converterData(dataStr) {
  if (!dataStr) return null;

  if (typeof dataStr === 'number') {
    const data = new Date(Date.UTC(1899, 11, 30) + dataStr * 86400000);
    const ano = data.getUTCFullYear();
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const dia = String(data.getUTCDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  const str = String(dataStr).trim();

  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(str)) {
    const partes = str.split('/');
    let mes = partes[0].padStart(2, '0');
    let dia = partes[1].padStart(2, '0');
    let ano = partes[2];
    if (ano.length === 2) {
      ano = parseInt(ano) > 50 ? '19' + ano : '20' + ano;
    }
    return `${ano}-${mes}-${dia}`;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [dia, mes, ano] = str.split('/');
    return `${ano}-${mes}-${dia}`;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  return null;
}

/**
 * Consulta CPF na API Infosimples
 */
async function consultarCPF(cpf, dataNascimento) {
  const url = `${INFOSIMPLES_URL}?token=${INFOSIMPLES_TOKEN}&cpf=${cpf}&birthdate=${dataNascimento}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200 && data.data && data.data.length > 0) {
      return {
        sucesso: true,
        dados: data.data[0],
        custo: data.header?.price || '0.24'
      };
    } else {
      return {
        sucesso: false,
        erro: data.code_message || 'Erro desconhecido',
        codigo: data.code
      };
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Processa a planilha e verifica óbitos
 */
async function processarPlanilha(caminhoEntrada, caminhoSaida, quantidade) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processando: ${path.basename(caminhoEntrada)}`);
  console.log('='.repeat(60));

  // Usar arquivo de saída se existir (para continuar de onde parou)
  const fs = require('fs');
  const arquivoBase = fs.existsSync(caminhoSaida) ? caminhoSaida : caminhoEntrada;
  console.log(`Usando como base: ${path.basename(arquivoBase)}`);

  const workbook = XLSX.readFile(arquivoBase);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Encontrar índices das colunas
  const cabecalho = dados[0];
  const colunas = {
    nome: -1,
    cpf: -1,
    nascimento: -1,
    estaVivo: -1,
    estaMorto: -1
  };

  for (let i = 0; i < cabecalho.length; i++) {
    const col = String(cabecalho[i] || '').toLowerCase().trim();
    if (col === 'nome') colunas.nome = i;
    if (col === 'cpf') colunas.cpf = i;
    if (col.includes('nascimento')) colunas.nascimento = i;
    if (col.includes('esta vivo') || col.includes('está vivo')) colunas.estaVivo = i;
    if (col.includes('esta morto') || col.includes('está morto')) colunas.estaMorto = i;
  }

  console.log('\nColunas encontradas:');
  console.log(`  Nome: ${colunas.nome >= 0 ? cabecalho[colunas.nome] : 'NÃO ENCONTRADA'}`);
  console.log(`  CPF: ${colunas.cpf >= 0 ? cabecalho[colunas.cpf] : 'NÃO ENCONTRADA'}`);
  console.log(`  Nascimento: ${colunas.nascimento >= 0 ? cabecalho[colunas.nascimento] : 'NÃO ENCONTRADA'}`);
  console.log(`  Esta vivo?: ${colunas.estaVivo >= 0 ? cabecalho[colunas.estaVivo] : 'NÃO ENCONTRADA'}`);
  console.log(`  Esta morto?: ${colunas.estaMorto >= 0 ? cabecalho[colunas.estaMorto] : 'NÃO ENCONTRADA'}`);

  if (colunas.cpf < 0 || colunas.nascimento < 0) {
    console.error('\nERRO: Colunas obrigatórias não encontradas!');
    return { processados: 0, vivos: 0, mortos: 0, erros: 0 };
  }

  const resultado = {
    processados: 0,
    vivos: 0,
    mortos: 0,
    erros: 0,
    custoTotal: 0
  };

  const totalRegistros = dados.length - 1;
  console.log(`\nProcessando até ${quantidade} registros (de ${totalRegistros} total)...\n`);

  for (let i = 1; i <= totalRegistros; i++) {
    // Parar se já processou a quantidade desejada
    if (resultado.processados >= quantidade) {
      console.log(`\nAtingido limite de ${quantidade} consultas.`);
      break;
    }
    const linha = dados[i];
    if (!linha) continue;

    const nome = linha[colunas.nome] || 'N/A';
    const cpfOriginal = linha[colunas.cpf];
    const nascimentoOriginal = linha[colunas.nascimento];

    // Pular se já tem informação de óbito
    const estaVivoAtual = String(linha[colunas.estaVivo] || '').trim();
    const estaMortoAtual = String(linha[colunas.estaMorto] || '').trim();
    if (estaVivoAtual || estaMortoAtual) {
      continue; // Já processado
    }

    if (!cpfOriginal || !nascimentoOriginal) {
      console.log(`[${i}] PULADO - Dados incompletos`);
      continue;
    }

    const cpf = padronizarCPF(cpfOriginal);
    const dataNascimento = converterData(nascimentoOriginal);

    if (!dataNascimento) {
      console.log(`[${i}] ERRO - Data de nascimento inválida`);
      resultado.erros++;
      continue;
    }

    console.log(`[${i}] Consultando ${nome.substring(0, 30)}...`);

    const consulta = await consultarCPF(cpf, dataNascimento);

    if (!consulta.sucesso) {
      console.log(`    ❌ ERRO: ${consulta.erro}`);
      resultado.erros++;
    } else {
      resultado.custoTotal += parseFloat(consulta.custo);
      resultado.processados++;

      const anoObito = consulta.dados.ano_obito;
      const situacao = consulta.dados.situacao_cadastral;

      if (anoObito) {
        console.log(`    💀 FALECIDO em ${anoObito} (Situação: ${situacao})`);
        if (colunas.estaVivo >= 0) linha[colunas.estaVivo] = 'NÃO';
        if (colunas.estaMorto >= 0) linha[colunas.estaMorto] = `SIM - Ano: ${anoObito}`;
        resultado.mortos++;
      } else {
        // Marcar situação especial se não for REGULAR
        const situacaoExtra = situacao !== 'REGULAR' ? ` (${situacao})` : '';
        console.log(`    ✅ VIVO (Situação: ${situacao})`);
        if (colunas.estaVivo >= 0) linha[colunas.estaVivo] = `SIM${situacaoExtra}`;
        if (colunas.estaMorto >= 0) linha[colunas.estaMorto] = 'NÃO';
        resultado.vivos++;
      }
    }

    // SALVAR A CADA CONSULTA para não perder dados
    const novaWorksheet = XLSX.utils.aoa_to_sheet(dados);
    const novoWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(novoWorkbook, novaWorksheet, sheetName);
    XLSX.writeFile(novoWorkbook, caminhoSaida);

    // Delay entre requisições
    await new Promise(resolve => setTimeout(resolve, DELAY_ENTRE_REQUISICOES));
  }

  // Salvar planilha atualizada
  const novaWorksheet = XLSX.utils.aoa_to_sheet(dados);
  const novoWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(novoWorkbook, novaWorksheet, sheetName);
  XLSX.writeFile(novoWorkbook, caminhoSaida);

  console.log(`\nArquivo salvo: ${path.basename(caminhoSaida)}`);

  return resultado;
}

async function main() {
  const quantidade = parseInt(process.argv[2]) || 3;
  const grupo = process.argv[3] || 'todos'; // 'disposicao', 'comurg' ou 'todos'

  console.log('='.repeat(60));
  console.log('VERIFICAÇÃO DE ÓBITO - Infosimples API');
  console.log('='.repeat(60));
  console.log(`Quantidade a processar por grupo: ${quantidade}`);
  console.log(`Grupo(s): ${grupo}`);

  const dirDocumentos = path.join(__dirname, '..', 'documentos');

  const planilhas = [];

  if (grupo === 'disposicao' || grupo === 'todos') {
    planilhas.push({
      nome: 'Empregados a Disposição',
      entrada: path.join(dirDocumentos, 'Empregados a Disposição - CPFs Corrigidos.xlsx'),
      saida: path.join(dirDocumentos, 'Empregados a Disposição - Obito.xlsx')
    });
  }

  if (grupo === 'comurg' || grupo === 'todos') {
    planilhas.push({
      nome: 'Empregados na Comurg',
      entrada: path.join(dirDocumentos, 'Empregados na Comurg - CPFs Corrigidos.xlsx'),
      saida: path.join(dirDocumentos, 'Empregados na Comurg - Obito.xlsx')
    });
  }

  let totalGeral = {
    processados: 0,
    vivos: 0,
    mortos: 0,
    erros: 0,
    custoTotal: 0
  };

  for (const planilha of planilhas) {
    console.log(`\n>>> Processando: ${planilha.nome}`);

    const resultado = await processarPlanilha(
      planilha.entrada,
      planilha.saida,
      quantidade
    );

    totalGeral.processados += resultado.processados;
    totalGeral.vivos += resultado.vivos;
    totalGeral.mortos += resultado.mortos;
    totalGeral.erros += resultado.erros;
    totalGeral.custoTotal += resultado.custoTotal;
  }

  console.log('\n' + '='.repeat(60));
  console.log('RESUMO FINAL (TODOS OS GRUPOS)');
  console.log('='.repeat(60));
  console.log(`Processados: ${totalGeral.processados}`);
  console.log(`Vivos: ${totalGeral.vivos}`);
  console.log(`Falecidos: ${totalGeral.mortos}`);
  console.log(`Erros: ${totalGeral.erros}`);
  console.log(`Custo total: R$ ${totalGeral.custoTotal.toFixed(2)}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
