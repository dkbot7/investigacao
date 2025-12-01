/**
 * Script para consultar processos judiciais via BigDataCorp API
 * Prioriza: candidatos, doadores e sancionados (já identificados)
 *
 * IMPORTANTE: Configure BIGDATACORP_TOKEN no arquivo .env
 * Cadastre-se em: https://bigdatacorp.com.br/
 *
 * Uso: node verificar-processos-bigdatacorp.js [quantidade]
 * Exemplo: node verificar-processos-bigdatacorp.js 500
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dirDocumentos = path.join(__dirname, '..', 'documentos');

// Configuração
const API_TOKEN = process.env.BIGDATACORP_TOKEN;
const API_URL = 'https://plataforma.bigdatacorp.com.br/pessoas';
const DELAY_ENTRE_REQUISICOES = 300; // 300ms = ~200 req/min (margem de segurança)

/**
 * Padroniza CPF com 11 dígitos
 */
function padronizarCPF(cpf) {
  if (!cpf) return '';
  return String(cpf).replace(/\D/g, '').padStart(11, '0');
}

/**
 * Formata CPF para exibição
 */
function formatarCPF(cpf) {
  if (!cpf || cpf.length !== 11) return cpf;
  return `${cpf.substr(0,3)}.${cpf.substr(3,3)}.${cpf.substr(6,3)}-${cpf.substr(9,2)}`;
}

/**
 * Aguarda um tempo em ms
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Lê planilha Excel
 */
function lerPlanilha(caminho) {
  if (!fs.existsSync(caminho)) {
    console.log(`  Arquivo não encontrado: ${path.basename(caminho)}`);
    return [];
  }
  const workbook = XLSX.readFile(caminho);
  return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
}

/**
 * Filtra registros com achados (SIM) em uma planilha
 */
function filtrarAchados(dados, padraoColuna) {
  const achados = [];
  for (const row of dados) {
    const colunaMatch = Object.keys(row).find(k =>
      k.toLowerCase().includes(padraoColuna.toLowerCase())
    );
    if (colunaMatch && row[colunaMatch] &&
        row[colunaMatch].toString().toUpperCase().startsWith('SIM')) {
      const cpf = padronizarCPF(row.CPF || row.cpf);
      const nome = row.Nome || row.nome || row.NOME || 'N/I';
      if (cpf && cpf !== '00000000000') {
        achados.push({ cpf, nome, detalhe: row[colunaMatch] });
      }
    }
  }
  return achados;
}

/**
 * Extrai CPFs com achados (candidatos, doadores, sancionados)
 */
function extrairCPFsPrioritarios() {
  const cpfsPrioritarios = new Map(); // CPF -> { nome, prioridade, categorias }

  console.log('\nIdentificando CPFs prioritários...');

  // Função para adicionar CPF prioritário
  function adicionarPrioritario(cpf, nome, categoria, fonte, prioridadeBase) {
    if (!cpf || cpf === '00000000000') return;

    if (!cpfsPrioritarios.has(cpf)) {
      cpfsPrioritarios.set(cpf, { nome, prioridade: prioridadeBase, categorias: [categoria], fonte });
    } else {
      const existente = cpfsPrioritarios.get(cpf);
      if (!existente.categorias.includes(categoria)) {
        existente.categorias.push(categoria);
        existente.prioridade += prioridadeBase;
      }
    }
  }

  // === SANCIONADOS (MAIOR PRIORIDADE) ===
  console.log('\n  Carregando sancionados...');
  const sancoesDisp = lerPlanilha(path.join(dirDocumentos, 'Empregados a Disposição - Sancoes-CGU.xlsx'));
  const sancoesComurg = lerPlanilha(path.join(dirDocumentos, 'Empregados na Comurg - Sancoes-CGU.xlsx'));

  const sancionadosDisp = filtrarAchados(sancoesDisp, 'sanç');
  const sancionadosComurg = filtrarAchados(sancoesComurg, 'sanç');

  sancionadosDisp.forEach(s => adicionarPrioritario(s.cpf, s.nome, 'SANCIONADO', 'Disposição', 100));
  sancionadosComurg.forEach(s => adicionarPrioritario(s.cpf, s.nome, 'SANCIONADO', 'Comurg', 100));

  console.log(`    Sancionados Disposição: ${sancionadosDisp.length}`);
  console.log(`    Sancionados Comurg: ${sancionadosComurg.length}`);

  // === CANDIDATOS ===
  console.log('\n  Carregando candidatos...');
  const candDisp = lerPlanilha(path.join(dirDocumentos, 'Empregados a Disposição - Candidaturas-TSE.xlsx'));
  const candComurg = lerPlanilha(path.join(dirDocumentos, 'Empregados na Comurg - Candidaturas-TSE.xlsx'));

  const candidatosDisp = filtrarAchados(candDisp, 'candidato');
  const candidatosComurg = filtrarAchados(candComurg, 'candidato');

  candidatosDisp.forEach(c => adicionarPrioritario(c.cpf, c.nome, 'CANDIDATO', 'Disposição', 50));
  candidatosComurg.forEach(c => adicionarPrioritario(c.cpf, c.nome, 'CANDIDATO', 'Comurg', 50));

  console.log(`    Candidatos Disposição: ${candidatosDisp.length}`);
  console.log(`    Candidatos Comurg: ${candidatosComurg.length}`);

  // === DOADORES ===
  console.log('\n  Carregando doadores...');
  const doacDisp = lerPlanilha(path.join(dirDocumentos, 'Empregados a Disposição - Doacoes-TSE.xlsx'));
  const doacComurg = lerPlanilha(path.join(dirDocumentos, 'Empregados na Comurg - Doacoes-TSE.xlsx'));

  const doadoresDisp = filtrarAchados(doacDisp, 'doador');
  const doadoresComurg = filtrarAchados(doacComurg, 'doador');

  doadoresDisp.forEach(d => adicionarPrioritario(d.cpf, d.nome, 'DOADOR', 'Disposição', 30));
  doadoresComurg.forEach(d => adicionarPrioritario(d.cpf, d.nome, 'DOADOR', 'Comurg', 30));

  console.log(`    Doadores Disposição: ${doadoresDisp.length}`);
  console.log(`    Doadores Comurg: ${doadoresComurg.length}`);

  // Ordenar por prioridade (maior primeiro)
  const cpfsOrdenados = Array.from(cpfsPrioritarios.entries())
    .sort((a, b) => b[1].prioridade - a[1].prioridade)
    .map(([cpf, dados]) => ({ cpf, ...dados }));

  console.log(`\n  Total de CPFs prioritários (únicos): ${cpfsOrdenados.length}`);

  // Mostrar resumo
  const sancionados = cpfsOrdenados.filter(p => p.categorias.includes('SANCIONADO'));
  const candidatos = cpfsOrdenados.filter(p => p.categorias.includes('CANDIDATO'));
  const doadores = cpfsOrdenados.filter(p => p.categorias.includes('DOADOR'));

  console.log(`    - Com sanção: ${sancionados.length}`);
  console.log(`    - Com candidatura: ${candidatos.length}`);
  console.log(`    - Com doação: ${doadores.length}`);

  return cpfsOrdenados;
}

/**
 * Consulta processos judiciais de um CPF na BigDataCorp
 */
async function consultarProcessos(cpf) {
  const body = {
    Datasets: 'processes',
    q: `doc{${cpf}}`
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'AccessToken': API_TOKEN
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Token inválido ou expirado: ${errorText}`);
      }
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Extrair informações relevantes
    if (data && data.Result && data.Result.length > 0) {
      const resultado = data.Result[0];

      if (resultado.Lawsuits && resultado.Lawsuits.length > 0) {
        return {
          sucesso: true,
          totalProcessos: resultado.TotalLawsuits || resultado.Lawsuits.length,
          comoAutor: resultado.TotalLawsuitsAsAuthor || 0,
          comoReu: resultado.TotalLawsuitsAsDefendant || 0,
          comoOutro: resultado.TotalLawsuitsAsOther || 0,
          processos: resultado.Lawsuits.slice(0, 10).map(p => ({
            numero: p.Number || p.LawsuitNumber || 'N/I',
            tipo: p.Type || p.LawsuitType || 'N/I',
            tribunal: p.Court || p.CourtName || 'N/I',
            vara: p.CourtDistrict || 'N/I',
            assunto: p.Subject || p.MainSubject || 'N/I',
            valor: p.Value || 'N/I',
            dataDistribuicao: p.DistributionDate || p.StartDate || 'N/I',
            status: p.Status || 'N/I',
            parteAutora: p.AuthorName || 'N/I',
            parteRe: p.DefendantName || 'N/I',
            polo: p.PartyType || 'N/I'
          }))
        };
      }
    }

    return {
      sucesso: true,
      totalProcessos: 0,
      processos: []
    };

  } catch (error) {
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Formata informações de processos para a planilha
 */
function formatarProcessosParaPlanilha(resultado) {
  if (!resultado.sucesso) {
    return `ERRO - ${resultado.erro}`;
  }

  if (resultado.totalProcessos === 0) {
    return 'NÃO - Nenhum processo encontrado';
  }

  let descricao = `SIM - ${resultado.totalProcessos} processo(s)`;
  descricao += ` | Autor: ${resultado.comoAutor}, Réu: ${resultado.comoReu}, Outro: ${resultado.comoOutro}`;

  // Adicionar detalhes dos primeiros processos
  if (resultado.processos && resultado.processos.length > 0) {
    const detalhes = resultado.processos.slice(0, 5).map(p => {
      let info = `[${p.numero}]`;
      if (p.tipo !== 'N/I') info += ` ${p.tipo}`;
      if (p.tribunal !== 'N/I') info += ` - ${p.tribunal}`;
      if (p.assunto !== 'N/I') info += ` (${p.assunto.substring(0, 50)})`;
      if (p.polo !== 'N/I') info += ` como ${p.polo}`;
      return info;
    });
    descricao += ' | ' + detalhes.join(' | ');
  }

  return descricao;
}

/**
 * Função principal
 */
async function main() {
  const quantidade = parseInt(process.argv[2]) || 500;

  console.log('='.repeat(70));
  console.log('CONSULTA DE PROCESSOS JUDICIAIS - BigDataCorp API');
  console.log('='.repeat(70));

  console.log(`\nQuantidade máxima a consultar: ${quantidade}`);
  console.log(`Delay entre requisições: ${DELAY_ENTRE_REQUISICOES}ms`);

  // Extrair CPFs prioritários
  const cpfsPrioritarios = extrairCPFsPrioritarios();

  if (cpfsPrioritarios.length === 0) {
    console.error('\n❌ Nenhum CPF prioritário encontrado!');
    console.error('Verifique se as planilhas de resultados existem.');
    process.exit(1);
  }

  // Mostrar TOP 20 prioritários
  console.log('\n=== TOP 20 CPFs PRIORITÁRIOS ===');
  cpfsPrioritarios.slice(0, 20).forEach((p, i) => {
    console.log(`${(i+1).toString().padStart(2)}. ${p.nome.substring(0, 35).padEnd(35)} | ${p.categorias.join(', ').padEnd(25)} | ${p.fonte}`);
  });

  // Verificar token
  if (!API_TOKEN) {
    console.error('\n❌ ERRO: Token da BigDataCorp não configurado!');
    console.error('Configure BIGDATACORP_TOKEN no arquivo .env');
    console.error('\nPara obter um token:');
    console.error('1. Acesse https://bigdatacorp.com.br/');
    console.error('2. Cadastre-se ou faça login');
    console.error('3. Gere um token de acesso no painel');
    console.error(`\nCusto estimado para ${Math.min(quantidade, cpfsPrioritarios.length)} consultas: R$ ${(Math.min(quantidade, cpfsPrioritarios.length) * 0.05).toFixed(2)}`);
    process.exit(1);
  }

  // Limitar à quantidade solicitada
  const cpfsParaConsultar = cpfsPrioritarios.slice(0, quantidade);
  console.log(`\nCPFs a consultar: ${cpfsParaConsultar.length}`);

  // Testar conexão
  console.log('\nTestando conexão com a API...');
  const teste = await consultarProcessos('00000000000');
  if (!teste.sucesso && teste.erro.includes('Token')) {
    console.error(`\n❌ ${teste.erro}`);
    process.exit(1);
  }
  console.log('✅ Conexão OK\n');

  // Resultados
  const resultados = [];
  let processados = 0;
  let comProcessos = 0;
  let semProcessos = 0;
  let erros = 0;

  // Processar cada CPF
  for (const pessoa of cpfsParaConsultar) {
    processados++;

    // Consultar API
    const resultado = await consultarProcessos(pessoa.cpf);

    // Preparar resultado
    const registro = {
      Nome: pessoa.nome,
      CPF: formatarCPF(pessoa.cpf),
      Categorias: pessoa.categorias.join(', '),
      Fonte: pessoa.fonte,
      'Possui Processos?': '',
      'Total Processos': '',
      'Detalhes': ''
    };

    if (!resultado.sucesso) {
      console.log(`[${processados}/${cpfsParaConsultar.length}] ${pessoa.nome.substring(0, 30)}... ❌ ${resultado.erro}`);
      registro['Possui Processos?'] = 'ERRO';
      registro['Detalhes'] = resultado.erro;
      erros++;

      // Se erro de token, parar
      if (resultado.erro.includes('Token')) {
        console.error('\n⚠️ Erro de autenticação. Verifique o token.');
        break;
      }
    } else if (resultado.totalProcessos > 0) {
      console.log(`[${processados}/${cpfsParaConsultar.length}] ${pessoa.nome.substring(0, 30)}... ⚖️ ${resultado.totalProcessos} processo(s)`);
      registro['Possui Processos?'] = 'SIM';
      registro['Total Processos'] = resultado.totalProcessos;
      registro['Detalhes'] = formatarProcessosParaPlanilha(resultado);
      comProcessos++;
    } else {
      registro['Possui Processos?'] = 'NÃO';
      registro['Total Processos'] = 0;
      registro['Detalhes'] = 'Nenhum processo encontrado';
      semProcessos++;
    }

    resultados.push(registro);

    // Aguardar entre requisições
    await delay(DELAY_ENTRE_REQUISICOES);

    // Log de progresso
    if (processados % 50 === 0) {
      console.log(`\n  Progresso: ${processados}/${cpfsParaConsultar.length}`);
      console.log(`  Com processos: ${comProcessos} | Sem processos: ${semProcessos} | Erros: ${erros}\n`);
    }
  }

  // Salvar planilha
  console.log('\n' + '='.repeat(70));
  console.log('SALVANDO RESULTADOS');
  console.log('='.repeat(70));

  const worksheet = XLSX.utils.json_to_sheet(resultados);

  // Ajustar largura das colunas
  worksheet['!cols'] = [
    { wch: 45 },  // Nome
    { wch: 16 },  // CPF
    { wch: 30 },  // Categorias
    { wch: 15 },  // Fonte
    { wch: 18 },  // Possui Processos?
    { wch: 15 },  // Total Processos
    { wch: 150 }  // Detalhes
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Processos Judiciais');

  const arquivoSaida = path.join(dirDocumentos, 'Processos-Judiciais-BigDataCorp.xlsx');
  XLSX.writeFile(workbook, arquivoSaida);

  console.log(`\nArquivo salvo: ${path.basename(arquivoSaida)}`);

  // Resumo final
  console.log('\n' + '='.repeat(70));
  console.log('RESUMO FINAL');
  console.log('='.repeat(70));
  console.log(`Total processados: ${processados}`);
  console.log(`Com processos: ${comProcessos}`);
  console.log(`Sem processos: ${semProcessos}`);
  console.log(`Erros: ${erros}`);
  console.log(`Custo estimado: R$ ${(processados * 0.05).toFixed(2)} (R$ 0,05 por consulta)`);

  // Listar pessoas com processos
  if (comProcessos > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('PESSOAS COM PROCESSOS JUDICIAIS');
    console.log('='.repeat(70));
    resultados.filter(r => r['Possui Processos?'] === 'SIM').forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.Nome}`);
      console.log(`   CPF: ${r.CPF} | Categorias: ${r.Categorias}`);
      console.log(`   Processos: ${r['Total Processos']}`);
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log('PROCESSAMENTO CONCLUÍDO');
  console.log('='.repeat(70));
}

main().catch(console.error);
