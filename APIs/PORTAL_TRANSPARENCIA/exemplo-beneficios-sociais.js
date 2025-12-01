/**
 * Script para consultar benefícios sociais via API Portal da Transparência
 *
 * Verifica se funcionários da COMURG/Disposição recebem:
 * - Novo Bolsa Família
 * - BPC (Benefício de Prestação Continuada)
 * - Auxílio Emergencial (histórico)
 * - Seguro Defeso
 *
 * Documentação: https://portaldatransparencia.gov.br/api-de-dados
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const dirCliente = path.join(__dirname, '..');

// ============================================
// CONFIGURAÇÃO
// ============================================
const CONFIG = {
  // API Key do Portal da Transparência
  apiKey: process.env.PORTAL_TRANSPARENCIA_API_KEY || '1c069d26585a0dd550dcb4b9679ac3c5',

  // Base URL
  baseUrl: 'https://api.portaldatransparencia.gov.br/api-de-dados',

  // Períodos a consultar (últimos 12 meses)
  periodos: ['202401', '202402', '202403', '202404', '202405', '202406',
             '202407', '202408', '202409', '202410', '202411', '202412'],

  // Arquivos
  arquivoCpfs: path.join(dirCliente, 'cpfs-para-consulta-obito.json'),
  arquivoResultado: path.join(dirCliente, 'resultado-beneficios-sociais.json'),
  arquivoProgresso: path.join(dirCliente, 'progresso-beneficios.json'),

  // Rate limiting - 30 req/min para evitar bloqueio
  delayEntreRequests: 2000, // 2 segundos

  // Timeout
  timeout: 30000
};

// ============================================
// FUNÇÕES DE API
// ============================================

function makeRequest(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${CONFIG.baseUrl}/${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'chave-api-dados': CONFIG.apiKey,
        'Accept': 'application/json'
      },
      timeout: CONFIG.timeout
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const json = JSON.parse(data);
            resolve(json);
          } else if (res.statusCode === 403) {
            resolve({ erro: 'Acesso negado - endpoint pode não existir', status: 403 });
          } else {
            resolve({ erro: `HTTP ${res.statusCode}`, data });
          }
        } catch (e) {
          resolve({ erro: 'Parse error', data });
        }
      });
    });

    req.on('error', (e) => resolve({ erro: e.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ erro: 'Timeout' });
    });

    req.end();
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// CONSULTAS DE BENEFÍCIOS
// ============================================

async function consultarBolsaFamiliaPorNIS(nis, periodo) {
  const result = await makeRequest('novo-bolsa-familia-sacado-por-nis', {
    nis: nis,
    anoMesCompetencia: periodo,
    pagina: 1
  });
  return result;
}

async function consultarAuxilioEmergencial(cpfOuNis) {
  const result = await makeRequest('auxilio-emergencial-por-cpf-ou-nis', {
    codigoBeneficiario: cpfOuNis,
    pagina: 1
  });
  return result;
}

async function consultarSeguroDefeso(cpfOuNis) {
  const result = await makeRequest('seguro-defeso-pescador-artesanal-por-cpf-ou-nis', {
    codigoBeneficiario: cpfOuNis,
    pagina: 1
  });
  return result;
}

async function consultarCEIS(cpf) {
  // Consulta CEIS por CPF
  // NOTA: A API ignora o parâmetro se o CPF não existe e retorna lista completa
  // Por isso precisamos verificar se o CPF retornado corresponde ao consultado
  const result = await makeRequest('ceis', {
    cpfSancionado: cpf,
    pagina: 1
  });

  // Filtrar apenas resultados que correspondem ao CPF consultado
  if (Array.isArray(result)) {
    const cpfFormatado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    const cpfMascarado = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.$2.$3-**');

    return result.filter(r => {
      if (!r.pessoa) return false;
      const cpfPessoa = r.pessoa.cpfFormatado || '';
      // Verificar se o CPF corresponde (pode estar mascarado como ***.XXX.XXX-**)
      if (cpfPessoa === cpfFormatado) return true;
      if (cpfPessoa === cpfMascarado) return true;
      // Comparar apenas os dígitos do meio (que aparecem na máscara)
      const meioConsultado = cpf.substring(3, 9); // 6 dígitos do meio
      const meioPessoa = cpfPessoa.replace(/\D/g, '').substring(3, 9);
      return meioConsultado === meioPessoa;
    });
  }

  return [];
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

async function executarConsultas() {
  console.log('==============================================');
  console.log('CONSULTA BENEFÍCIOS SOCIAIS - PORTAL TRANSPARÊNCIA');
  console.log('==============================================\n');

  // Carregar CPFs
  if (!fs.existsSync(CONFIG.arquivoCpfs)) {
    console.log('❌ Arquivo de CPFs não encontrado!');
    return;
  }

  const dadosCpfs = JSON.parse(fs.readFileSync(CONFIG.arquivoCpfs, 'utf-8'));
  console.log(`Total de pessoas a consultar: ${dadosCpfs.totalCpfs}\n`);

  // Carregar progresso anterior
  let progresso = { ultimoIndex: 0, resultados: [] };
  if (fs.existsSync(CONFIG.arquivoProgresso)) {
    progresso = JSON.parse(fs.readFileSync(CONFIG.arquivoProgresso, 'utf-8'));
    console.log(`Retomando da posição ${progresso.ultimoIndex}...\n`);
  }

  const resultados = progresso.resultados || [];
  const beneficiariosEncontrados = {
    bolsaFamilia: [],
    auxilioEmergencial: [],
    seguroDefeso: [],
    ceis: []
  };

  // Processar cada CPF
  const startIndex = progresso.ultimoIndex;

  for (let i = startIndex; i < dadosCpfs.cpfs.length; i++) {
    const pessoa = dadosCpfs.cpfs[i];
    const cpfLimpo = pessoa.cpf.replace(/\D/g, '');

    process.stdout.write(`\r[${i + 1}/${dadosCpfs.totalCpfs}] Consultando ${pessoa.nome.substring(0, 30)}...`.padEnd(80));

    try {
      // 1. Consultar Auxílio Emergencial (não precisa de NIS)
      const auxEmerg = await consultarAuxilioEmergencial(cpfLimpo);
      if (Array.isArray(auxEmerg) && auxEmerg.length > 0) {
        beneficiariosEncontrados.auxilioEmergencial.push({
          cpf: pessoa.cpf,
          nome: pessoa.nome,
          grupo: pessoa.grupo,
          beneficios: auxEmerg
        });
        console.log(`\n⚠️  AUXÍLIO EMERGENCIAL: ${pessoa.nome}`);
      }
      await sleep(CONFIG.delayEntreRequests);

      // 2. Consultar Seguro Defeso
      const segDefeso = await consultarSeguroDefeso(cpfLimpo);
      if (Array.isArray(segDefeso) && segDefeso.length > 0) {
        beneficiariosEncontrados.seguroDefeso.push({
          cpf: pessoa.cpf,
          nome: pessoa.nome,
          grupo: pessoa.grupo,
          beneficios: segDefeso
        });
        console.log(`\n⚠️  SEGURO DEFESO: ${pessoa.nome}`);
      }
      await sleep(CONFIG.delayEntreRequests);

      // 3. Consultar CEIS (sanções)
      const ceis = await consultarCEIS(cpfLimpo);
      if (Array.isArray(ceis) && ceis.length > 0) {
        beneficiariosEncontrados.ceis.push({
          cpf: pessoa.cpf,
          nome: pessoa.nome,
          grupo: pessoa.grupo,
          sancoes: ceis
        });
        console.log(`\n🔴 SANCIONADO CEIS: ${pessoa.nome}`);
      }
      await sleep(CONFIG.delayEntreRequests);

    } catch (e) {
      console.log(`\n❌ Erro ao consultar ${pessoa.nome}: ${e.message}`);
    }

    // Salvar progresso a CADA consulta para não perder dados
    progresso.ultimoIndex = i + 1;
    progresso.resultados = resultados;
    progresso.beneficiariosEncontrados = beneficiariosEncontrados;
    fs.writeFileSync(CONFIG.arquivoProgresso, JSON.stringify(progresso, null, 2), 'utf-8');

    // Log a cada 50 registros
    if ((i + 1) % 50 === 0) {
      console.log(`\n📁 Progresso salvo (${i + 1}/${dadosCpfs.totalCpfs}) - Aux.Emerg: ${beneficiariosEncontrados.auxilioEmergencial.length} | CEIS: ${beneficiariosEncontrados.ceis.length}`);
    }
  }

  // Salvar resultados finais
  const resultado = {
    geradoEm: new Date().toISOString(),
    totalConsultados: dadosCpfs.totalCpfs,
    resumo: {
      auxilioEmergencial: beneficiariosEncontrados.auxilioEmergencial.length,
      seguroDefeso: beneficiariosEncontrados.seguroDefeso.length,
      sancionadosCEIS: beneficiariosEncontrados.ceis.length,
      totalAlertas: beneficiariosEncontrados.auxilioEmergencial.length +
                    beneficiariosEncontrados.seguroDefeso.length +
                    beneficiariosEncontrados.ceis.length
    },
    detalhes: beneficiariosEncontrados
  };

  fs.writeFileSync(CONFIG.arquivoResultado, JSON.stringify(resultado, null, 2), 'utf-8');

  // Limpar progresso
  if (fs.existsSync(CONFIG.arquivoProgresso)) {
    fs.unlinkSync(CONFIG.arquivoProgresso);
  }

  // Resumo
  console.log('\n\n==============================================');
  console.log('RESUMO');
  console.log('==============================================');
  console.log(`Total consultados: ${dadosCpfs.totalCpfs}`);
  console.log(`Auxílio Emergencial: ${beneficiariosEncontrados.auxilioEmergencial.length}`);
  console.log(`Seguro Defeso: ${beneficiariosEncontrados.seguroDefeso.length}`);
  console.log(`Sancionados CEIS: ${beneficiariosEncontrados.ceis.length}`);
  console.log(`\n✅ Resultados salvos em: ${CONFIG.arquivoResultado}`);

  // Alertas detalhados
  if (beneficiariosEncontrados.auxilioEmergencial.length > 0) {
    console.log('\n--- AUXÍLIO EMERGENCIAL ---');
    beneficiariosEncontrados.auxilioEmergencial.forEach(b => {
      console.log(`  ${b.nome} (${b.cpf}) - ${b.grupo}`);
    });
  }

  if (beneficiariosEncontrados.seguroDefeso.length > 0) {
    console.log('\n--- SEGURO DEFESO ---');
    beneficiariosEncontrados.seguroDefeso.forEach(b => {
      console.log(`  ${b.nome} (${b.cpf}) - ${b.grupo}`);
    });
  }

  if (beneficiariosEncontrados.ceis.length > 0) {
    console.log('\n--- SANCIONADOS CEIS ---');
    beneficiariosEncontrados.ceis.forEach(b => {
      console.log(`  ${b.nome} (${b.cpf}) - ${b.grupo}`);
    });
  }

  return resultado;
}

// ============================================
// EXECUÇÃO
// ============================================

executarConsultas().catch(console.error);
