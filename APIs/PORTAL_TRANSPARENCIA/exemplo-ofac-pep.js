/**
 * Script para consultar listas OFAC e PEP
 *
 * OFAC - Office of Foreign Assets Control (sanções dos EUA)
 * PEP - Pessoas Politicamente Expostas
 *
 * Fontes utilizadas:
 * - OFAC SDN List: https://sanctionslist.ofac.treas.gov/
 * - PEP Brasil: Dados do Portal da Transparência (já coletados)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const dirCliente = path.join(__dirname, '..');

// ============================================
// CONFIGURAÇÃO
// ============================================
const CONFIG = {
  // URLs da lista OFAC SDN (Specially Designated Nationals)
  // Usando XML que é mais confiável
  ofacSdnUrl: 'https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML',
  ofacSdnUrlAlt: 'https://www.treasury.gov/ofac/downloads/sdn.xml',

  // Arquivos
  arquivoCpfs: path.join(dirCliente, 'cpfs-para-consulta-obito.json'),
  arquivoOfacCache: path.join(dirCliente, 'cache-ofac-sdn.json'),
  arquivoResultado: path.join(dirCliente, 'resultado-ofac-pep.json'),

  // Cache de 24 horas para lista OFAC
  cacheMaxAge: 24 * 60 * 60 * 1000
};

// ============================================
// FUNÇÕES PARA OFAC
// ============================================

async function fetchWithRedirects(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const doRequest = (currentUrl, redirectsLeft) => {
      const urlObj = new URL(currentUrl);
      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*'
        }
      };

      https.get(options, (res) => {
        if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) && res.headers.location) {
          if (redirectsLeft <= 0) {
            reject(new Error('Too many redirects'));
            return;
          }
          let redirectUrl = res.headers.location;
          if (!redirectUrl.startsWith('http')) {
            redirectUrl = `https://${urlObj.hostname}${redirectUrl}`;
          }
          doRequest(redirectUrl, redirectsLeft - 1);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    };

    doRequest(url, maxRedirects);
  });
}

async function baixarListaOFAC() {
  console.log('Baixando lista OFAC SDN...');

  // Tentar URL principal
  try {
    const data = await fetchWithRedirects(CONFIG.ofacSdnUrl);
    return data;
  } catch (e) {
    console.log(`  URL principal falhou: ${e.message}`);
  }

  // Tentar URL alternativa
  try {
    console.log('  Tentando URL alternativa...');
    const data = await fetchWithRedirects(CONFIG.ofacSdnUrlAlt);
    return data;
  } catch (e) {
    console.log(`  URL alternativa também falhou: ${e.message}`);
    throw new Error('Não foi possível baixar lista OFAC');
  }
}

function parsearListaOFAC(xmlData) {
  const registros = [];

  // Parse XML simples - extrair entradas SDN
  const sdnEntryRegex = /<sdnEntry>([\s\S]*?)<\/sdnEntry>/gi;
  const uidRegex = /<uid>(\d+)<\/uid>/i;
  const firstNameRegex = /<firstName>([^<]*)<\/firstName>/i;
  const lastNameRegex = /<lastName>([^<]*)<\/lastName>/i;
  const sdnTypeRegex = /<sdnType>([^<]*)<\/sdnType>/i;
  const programRegex = /<program>([^<]*)<\/program>/gi;
  const remarksRegex = /<remarks>([^<]*)<\/remarks>/i;

  let match;
  while ((match = sdnEntryRegex.exec(xmlData)) !== null) {
    const entry = match[1];

    const uidMatch = entry.match(uidRegex);
    const firstNameMatch = entry.match(firstNameRegex);
    const lastNameMatch = entry.match(lastNameRegex);
    const sdnTypeMatch = entry.match(sdnTypeRegex);
    const remarksMatch = entry.match(remarksRegex);

    // Extrair programas
    const programas = [];
    let programMatch;
    while ((programMatch = programRegex.exec(entry)) !== null) {
      programas.push(programMatch[1]);
    }

    const firstName = firstNameMatch ? firstNameMatch[1].trim() : '';
    const lastName = lastNameMatch ? lastNameMatch[1].trim() : '';
    const nome = `${lastName}${firstName ? ', ' + firstName : ''}`.trim();

    if (nome) {
      registros.push({
        id: uidMatch ? uidMatch[1] : '',
        nome: nome,
        tipo: sdnTypeMatch ? sdnTypeMatch[1] : '',
        programa: programas.join(', '),
        remarks: remarksMatch ? remarksMatch[1] : ''
      });
    }
  }

  return registros;
}

async function obterListaOFAC() {
  // Verificar cache
  if (fs.existsSync(CONFIG.arquivoOfacCache)) {
    const cache = JSON.parse(fs.readFileSync(CONFIG.arquivoOfacCache, 'utf-8'));
    const idade = Date.now() - new Date(cache.baixadoEm).getTime();

    if (idade < CONFIG.cacheMaxAge) {
      console.log(`Usando cache OFAC (${Math.round(idade / 3600000)}h de idade)`);
      return cache.registros;
    }
  }

  // Baixar nova lista
  try {
    const csvData = await baixarListaOFAC();
    const registros = parsearListaOFAC(csvData);

    // Salvar cache
    fs.writeFileSync(CONFIG.arquivoOfacCache, JSON.stringify({
      baixadoEm: new Date().toISOString(),
      totalRegistros: registros.length,
      registros
    }, null, 2), 'utf-8');

    console.log(`Lista OFAC atualizada: ${registros.length} registros`);
    return registros;
  } catch (e) {
    console.log(`Erro ao baixar OFAC: ${e.message}`);

    // Tentar usar cache antigo
    if (fs.existsSync(CONFIG.arquivoOfacCache)) {
      const cache = JSON.parse(fs.readFileSync(CONFIG.arquivoOfacCache, 'utf-8'));
      console.log('Usando cache antigo como fallback');
      return cache.registros;
    }

    return [];
  }
}

function normalizarNome(nome) {
  if (!nome) return '';
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, ' ')
    .trim();
}

function calcularSimilaridade(nome1, nome2) {
  const n1 = normalizarNome(nome1);
  const n2 = normalizarNome(nome2);

  if (n1 === n2) return 1.0;

  // Tokenizar e comparar palavras (apenas palavras com 4+ caracteres para evitar falsos positivos)
  const palavras1 = n1.split(' ').filter(p => p.length >= 4);
  const palavras2 = n2.split(' ').filter(p => p.length >= 4);

  if (palavras1.length === 0 || palavras2.length === 0) return 0;

  // Verificar se um nome completo contém o outro (apenas se forem grandes o suficiente)
  if (n1.length >= 15 && n2.length >= 15) {
    if (n1.includes(n2) || n2.includes(n1)) return 0.95;
  }

  // Contar palavras em comum (exatas, não parciais)
  let match = 0;
  for (const p1 of palavras1) {
    for (const p2 of palavras2) {
      if (p1 === p2 && p1.length >= 4) {
        match++;
        break;
      }
    }
  }

  // Precisamos de pelo menos 2 palavras em comum ou match de nome+sobrenome completo
  if (match < 2) return 0;

  const maxPalavras = Math.max(palavras1.length, palavras2.length);
  return match / maxPalavras;
}

function buscarNaOFAC(nome, listaOFAC) {
  const matches = [];

  for (const registro of listaOFAC) {
    const similaridade = calcularSimilaridade(nome, registro.nome);

    // Apenas matches com alta confiança (>= 50% das palavras em comum, mínimo 2)
    if (similaridade >= 0.5) {
      matches.push({
        ...registro,
        similaridade: Math.round(similaridade * 100),
        matchType: similaridade === 1.0 ? 'EXATO' : similaridade >= 0.8 ? 'ALTO' : 'MODERADO'
      });
    }
  }

  return matches.sort((a, b) => b.similaridade - a.similaridade);
}

// ============================================
// LISTA PEP - BRASIL
// ============================================

function carregarPEPsBrasil() {
  // Buscar dados já coletados de candidatos e servidores
  const pepList = [];

  // Candidatos já identificados
  const arquivoCandidatos = path.join(dirCliente, 'analise-candidaturas', 'candidatos-encontrados.json');
  if (fs.existsSync(arquivoCandidatos)) {
    const candidatos = JSON.parse(fs.readFileSync(arquivoCandidatos, 'utf-8'));
    candidatos.forEach(c => {
      pepList.push({
        cpf: c.cpf,
        nome: c.nome,
        tipo: 'CANDIDATO',
        detalhes: `${c.cargo} - ${c.partido} (${c.ano})`
      });
    });
  }

  // Sancionados do CEIS
  const arquivoSancionados = path.join(dirCliente, 'sancionados-ceis.json');
  if (fs.existsSync(arquivoSancionados)) {
    const sancionados = JSON.parse(fs.readFileSync(arquivoSancionados, 'utf-8'));
    sancionados.forEach(s => {
      pepList.push({
        cpf: s.cpf,
        nome: s.nome,
        tipo: 'SANCIONADO_CEIS',
        detalhes: s.motivo || 'Cadastro de Empresas Inidôneas e Suspensas'
      });
    });
  }

  return pepList;
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================

async function executarConsultas() {
  console.log('==============================================');
  console.log('CONSULTA OFAC E PEP - CLIENTE_01');
  console.log('==============================================\n');

  // Carregar CPFs
  if (!fs.existsSync(CONFIG.arquivoCpfs)) {
    console.log('❌ Arquivo de CPFs não encontrado!');
    console.log('Execute primeiro: node extrair-cpfs-para-api.js');
    return;
  }

  const dadosCpfs = JSON.parse(fs.readFileSync(CONFIG.arquivoCpfs, 'utf-8'));
  console.log(`Total de pessoas a consultar: ${dadosCpfs.totalCpfs}\n`);

  // 1. OFAC
  console.log('=== CONSULTA OFAC SDN ===\n');
  const listaOFAC = await obterListaOFAC();

  const matchesOFAC = [];
  let processados = 0;

  for (const pessoa of dadosCpfs.cpfs) {
    const matches = buscarNaOFAC(pessoa.nome, listaOFAC);

    if (matches.length > 0) {
      matchesOFAC.push({
        cpf: pessoa.cpf,
        nome: pessoa.nome,
        grupo: pessoa.grupo,
        matches: matches.slice(0, 3) // Top 3 matches
      });

      console.log(`⚠️  MATCH OFAC: ${pessoa.nome}`);
      matches.slice(0, 1).forEach(m => {
        console.log(`   → ${m.nome} (${m.similaridade}% - ${m.matchType})`);
      });
    }

    processados++;
    if (processados % 1000 === 0) {
      process.stdout.write(`  Processados: ${processados}/${dadosCpfs.totalCpfs}\r`);
    }
  }

  console.log(`\nTotal matches OFAC: ${matchesOFAC.length}`);

  // 2. PEP Brasil
  console.log('\n=== CONSULTA PEP BRASIL ===\n');
  const listaPEP = carregarPEPsBrasil();
  console.log(`Registros PEP carregados: ${listaPEP.length}`);

  const matchesPEP = [];
  const cpfsSet = new Set(dadosCpfs.cpfs.map(p => p.cpf));

  for (const pep of listaPEP) {
    if (cpfsSet.has(pep.cpf)) {
      const pessoa = dadosCpfs.cpfs.find(p => p.cpf === pep.cpf);
      matchesPEP.push({
        cpf: pep.cpf,
        nome: pessoa?.nome || pep.nome,
        grupo: pessoa?.grupo || 'N/I',
        tipoPEP: pep.tipo,
        detalhes: pep.detalhes
      });

      console.log(`🔴 PEP: ${pessoa?.nome || pep.nome} - ${pep.tipo}`);
    }
  }

  console.log(`\nTotal PEPs encontrados: ${matchesPEP.length}`);

  // Salvar resultados
  const resultado = {
    geradoEm: new Date().toISOString(),
    totalConsultados: dadosCpfs.totalCpfs,
    resumo: {
      matchesOFAC: matchesOFAC.length,
      matchesPEP: matchesPEP.length,
      alertasTotal: matchesOFAC.length + matchesPEP.length
    },
    ofac: {
      fonte: 'US Treasury OFAC SDN List',
      totalRegistrosLista: listaOFAC.length,
      matches: matchesOFAC
    },
    pep: {
      fonte: 'Dados coletados (TSE, CEIS)',
      matches: matchesPEP
    }
  };

  fs.writeFileSync(CONFIG.arquivoResultado, JSON.stringify(resultado, null, 2), 'utf-8');

  console.log('\n==============================================');
  console.log('RESUMO');
  console.log('==============================================');
  console.log(`Total consultados: ${dadosCpfs.totalCpfs}`);
  console.log(`Matches OFAC: ${matchesOFAC.length}`);
  console.log(`PEPs encontrados: ${matchesPEP.length}`);
  console.log(`\n✅ Resultados salvos em: ${CONFIG.arquivoResultado}`);

  return resultado;
}

// ============================================
// EXECUÇÃO
// ============================================

executarConsultas().catch(console.error);
