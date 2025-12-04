/**
 * Script de exemplo para consulta no CNF Brasil
 *
 * ATENÇÃO: A API do CNF Brasil requer contratação prévia.
 * Este script é um modelo para quando a API estiver disponível.
 *
 * Para solicitar acesso à API:
 * Email: relacionamento@cnfbrasil.org.br
 * Assunto: "API - Orçamento"
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Configuração da API (preencher após contratação)
const CNF_BRASIL_CONFIG = {
  apiKey: process.env.CNF_BRASIL_API_KEY || '',
  apiUrl: process.env.CNF_BRASIL_API_URL || 'https://api.falecidosnobrasil.org.br',
};

/**
 * Consulta óbito no CNF Brasil (modelo - ajustar conforme documentação oficial)
 */
async function consultarCNFBrasil(nome) {
  if (!CNF_BRASIL_CONFIG.apiKey) {
    return {
      sucesso: false,
      erro: 'API Key não configurada. Solicite em relacionamento@cnfbrasil.org.br'
    };
  }

  try {
    // MODELO - ajustar endpoint e parâmetros conforme documentação oficial
    const url = `${CNF_BRASIL_CONFIG.apiUrl}/consulta?nome=${encodeURIComponent(nome)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CNF_BRASIL_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { sucesso: false, erro: `HTTP ${response.status}` };
    }

    const data = await response.json();

    // MODELO de resposta esperada - ajustar conforme documentação
    return {
      sucesso: true,
      encontrado: data.encontrado || false,
      cartorio: data.cartorio || '',
      cidade: data.cidade || '',
      estado: data.estado || '',
      livro: data.livro || '',
      folha: data.folha || '',
      termo: data.termo || '',
      dataRegistro: data.data_registro || '',
      contatoCartorio: data.contato || ''
    };

  } catch (error) {
    return { sucesso: false, erro: error.message };
  }
}

/**
 * Gera lista de falecidos para consulta manual no CNF Brasil
 * Usa a planilha de resultados do SERPRO
 */
function gerarListaConsultaManual(arquivoEntrada, arquivoSaida) {
  console.log('='.repeat(60));
  console.log('GERADOR DE LISTA PARA CONSULTA CNF BRASIL');
  console.log('='.repeat(60));

  if (!fs.existsSync(arquivoEntrada)) {
    console.error(`Arquivo não encontrado: ${arquivoEntrada}`);
    return;
  }

  const workbook = XLSX.readFile(arquivoEntrada);
  const dados = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  // Filtrar apenas falecidos
  const falecidos = dados.filter(row => {
    const situacao = (row['Situação'] || row['Situacao'] || row['situacao_cadastral'] || '').toUpperCase();
    const obito = row['Ano Óbito'] || row['ano_obito'] || row['obito'] || '';

    return situacao.includes('FALECIDO') || obito;
  });

  console.log(`\nTotal de registros: ${dados.length}`);
  console.log(`Falecidos encontrados: ${falecidos.length}`);

  if (falecidos.length === 0) {
    console.log('\nNenhum falecido encontrado para gerar lista.');
    return;
  }

  // Gerar planilha para consulta manual
  const listaConsulta = falecidos.map((row, idx) => ({
    '#': idx + 1,
    'Nome': row.Nome || row.nome || '',
    'CPF': row.CPF || row.cpf || '',
    'Ano Óbito': row['Ano Óbito'] || row['ano_obito'] || row['obito'] || '',
    'Cartório': '', // Preencher manualmente
    'Cidade/UF': '', // Preencher manualmente
    'Livro/Folha/Termo': '', // Preencher manualmente
    'Contato Cartório': '', // Preencher manualmente
    'Consultado CNF': 'NÃO', // Marcar SIM após consultar
    'Observações': ''
  }));

  // Salvar planilha
  const ws = XLSX.utils.json_to_sheet(listaConsulta);
  ws['!cols'] = [
    { wch: 5 },   // #
    { wch: 40 },  // Nome
    { wch: 15 },  // CPF
    { wch: 12 },  // Ano Óbito
    { wch: 35 },  // Cartório
    { wch: 20 },  // Cidade/UF
    { wch: 20 },  // Livro/Folha/Termo
    { wch: 30 },  // Contato Cartório
    { wch: 15 },  // Consultado CNF
    { wch: 30 },  // Observações
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Consulta CNF Brasil');
  XLSX.writeFile(wb, arquivoSaida);

  console.log(`\nArquivo gerado: ${path.basename(arquivoSaida)}`);
  console.log('\n' + '='.repeat(60));
  console.log('INSTRUÇÕES PARA CONSULTA MANUAL');
  console.log('='.repeat(60));
  console.log('\n1. Acesse: https://www.falecidosnobrasil.org.br');
  console.log('2. Para cada nome na lista:');
  console.log('   - Digite o nome no campo de busca');
  console.log('   - Anote os dados do cartório');
  console.log('   - Preencha a planilha');
  console.log('3. Marque "Consultado CNF" como SIM');
  console.log('\n' + '='.repeat(60));
}

// Execução
const args = process.argv.slice(2);

if (args[0] === 'gerar-lista') {
  const entrada = args[1] || 'Resultado_SERPRO.xlsx';
  const saida = args[2] || 'Lista_Consulta_CNF_Brasil.xlsx';
  gerarListaConsultaManual(entrada, saida);
} else {
  console.log(`
USO:
  node exemplo_consulta_cnf.js gerar-lista [arquivo_entrada] [arquivo_saida]

EXEMPLOS:
  node exemplo_consulta_cnf.js gerar-lista Resultado_SERPRO.xlsx Lista_CNF.xlsx

NOTA:
  Para usar a API automatizada, solicite acesso em:
  Email: relacionamento@cnfbrasil.org.br
  Assunto: "API - Orçamento"
  `);
}
