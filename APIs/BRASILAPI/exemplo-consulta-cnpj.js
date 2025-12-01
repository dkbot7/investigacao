/**
 * Script para consultar CNPJs na base de dados da Receita Federal
 * e obter informações sobre vínculos empresariais (sócio, administrador, etc)
 *
 * Usa a BrasilAPI (gratuita) para consulta individual de CNPJs
 *
 * Uso: node consultar-cnpjs-receita.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const dirPlanilhas2 = path.join(__dirname, '..', 'planilhas - 2');
const dirDados = path.join(__dirname, '..', 'dados-receita');

// Qualificações de sócio da Receita Federal
const QUALIFICACOES = {
  '05': 'Administrador',
  '08': 'Conselheiro de Administração',
  '10': 'Diretor',
  '16': 'Presidente',
  '17': 'Procurador',
  '20': 'Sociedade Consorciada',
  '21': 'Sociedade Filiada',
  '22': 'Sócio',
  '23': 'Sócio Capitalista',
  '24': 'Sócio Comanditado',
  '25': 'Sócio Comanditário',
  '26': 'Sócio de Indústria',
  '28': 'Sócio-Gerente',
  '29': 'Sócio Incapaz ou Relativamente Incapaz',
  '30': 'Sócio Menor (Assistido/Representado)',
  '31': 'Sócio Ostensivo',
  '37': 'Sócio Pessoa Jurídica Domiciliado no Exterior',
  '38': 'Sócio Pessoa Física Residente no Exterior',
  '49': 'Sócio-Administrador',
  '50': 'Empresário',
  '52': 'Sócio com Capital',
  '53': 'Sócio sem Capital',
  '54': 'Fundador',
  '55': 'Sócio Comanditado Residente no Exterior',
  '56': 'Sócio Comanditário Pessoa Física Residente no Exterior',
  '57': 'Sócio Comanditário Pessoa Jurídica Domiciliado no Exterior',
  '58': 'Sócio Comanditário Incapaz',
  '59': 'Produtor Rural',
  '63': 'Cotas em Tesouraria',
  '65': 'Titular Pessoa Física Residente ou Domiciliado no Brasil',
  '66': 'Titular Pessoa Física Residente ou Domiciliado no Exterior',
  '67': 'Titular Pessoa Física Incapaz ou Relativamente Incapaz',
  '68': 'Titular Pessoa Física Menor (Assistido/Representado)',
  '70': 'Administrador Residente ou Domiciliado no Exterior',
  '71': 'Conselheiro de Administração Residente ou Domiciliado no Exterior',
  '72': 'Diretor Residente ou Domiciliado no Exterior',
  '73': 'Presidente Residente ou Domiciliado no Exterior',
  '74': 'Sócio-Administrador Residente ou Domiciliado no Exterior',
  '75': 'Fundador Residente ou Domiciliado no Exterior',
  '78': 'Titular Pessoa Jurídica Domiciliada no Brasil',
  '79': 'Titular Pessoa Jurídica Domiciliada no Exterior'
};

function lerCSV(caminho) {
  if (!fs.existsSync(caminho)) return [];
  const conteudo = fs.readFileSync(caminho, 'utf-8');
  const linhas = conteudo.trim().split('\n');
  if (linhas.length < 2) return [];

  const header = linhas[0].split('|');
  const dados = [];

  for (let i = 1; i < linhas.length; i++) {
    const cols = linhas[i].split('|');
    const obj = {};
    header.forEach((h, idx) => {
      obj[h.trim()] = cols[idx] || '';
    });
    dados.push(obj);
  }
  return dados;
}

function extrairCNPJsUnicos() {
  const funcionariosPath = path.join(dirPlanilhas2, 'CONSULTADO-EMPRESAS-FUNCIONARIOS.CSV');
  const comurgPath = path.join(dirPlanilhas2, 'CONSULTADO-EMPRESAS-COMURG.CSV');

  const funcionarios = lerCSV(funcionariosPath);
  const comurg = lerCSV(comurgPath);

  const cnpjSet = new Set();
  const cpfCnpjMap = new Map(); // CPF -> [CNPJs]

  [...funcionarios, ...comurg].forEach(row => {
    const cnpjs = row.CNPJS || '';
    const cpf = (row.CPF || '').replace(/\D/g, '').padStart(11, '0');
    const nome = row.Nome || 'N/I';

    if (cnpjs.trim() && /\d{14}/.test(cnpjs)) {
      const cnpjList = cnpjs.split(',').filter(c => c.trim().length >= 14);
      cnpjList.forEach(cnpj => {
        const cnpjLimpo = cnpj.replace(/\D/g, '').padStart(14, '0');
        cnpjSet.add(cnpjLimpo);

        if (!cpfCnpjMap.has(cpf)) {
          cpfCnpjMap.set(cpf, { nome, cnpjs: [] });
        }
        cpfCnpjMap.get(cpf).cnpjs.push(cnpjLimpo);
      });
    }
  });

  return { cnpjs: Array.from(cnpjSet), cpfCnpjMap };
}

function consultarCNPJ(cnpj) {
  return new Promise((resolve) => {
    const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function consultarTodosCNPJs(cnpjs, cacheFile) {
  // Carregar cache existente
  let cache = {};
  if (fs.existsSync(cacheFile)) {
    try {
      cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
      console.log(`Cache carregado: ${Object.keys(cache).length} CNPJs`);
    } catch {
      cache = {};
    }
  }

  const total = cnpjs.length;
  let consultados = 0;
  let erros = 0;
  let doCache = 0;

  for (const cnpj of cnpjs) {
    // Verificar se já está no cache
    if (cache[cnpj]) {
      doCache++;
      continue;
    }

    consultados++;
    process.stdout.write(`\rConsultando ${consultados}/${total - doCache} (${erros} erros)...`);

    const resultado = await consultarCNPJ(cnpj);

    if (resultado) {
      cache[cnpj] = {
        razao_social: resultado.razao_social || '',
        nome_fantasia: resultado.nome_fantasia || '',
        situacao: resultado.descricao_situacao_cadastral || '',
        uf: resultado.uf || '',
        municipio: resultado.municipio || '',
        cnae_principal: resultado.cnae_fiscal_descricao || '',
        qsa: (resultado.qsa || []).map(s => ({
          nome: s.nome_socio,
          cpf_cnpj: s.cnpj_cpf_do_socio || '',
          qualificacao: s.codigo_qualificacao_socio,
          qualificacao_desc: QUALIFICACOES[s.codigo_qualificacao_socio] || s.qualificacao_socio || 'N/I'
        }))
      };
    } else {
      erros++;
      cache[cnpj] = { erro: true, razao_social: 'Consulta falhou' };
    }

    // Salvar cache periodicamente
    if (consultados % 10 === 0) {
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
    }

    // Rate limiting (BrasilAPI: 3 req/s)
    await sleep(350);
  }

  // Salvar cache final
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
  console.log(`\nConsultas finalizadas: ${consultados} novos, ${doCache} do cache, ${erros} erros`);

  return cache;
}

function cruzarDados(cpfCnpjMap, cnpjCache) {
  const resultado = [];

  for (const [cpf, info] of cpfCnpjMap) {
    const vinculos = [];
    const nomeNormalizado = (info.nome || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Extrair 6 dígitos centrais do CPF para matching parcial (formato ***XXXXXX**)
    const cpfCentral = cpf.substring(3, 9);

    for (const cnpj of info.cnpjs) {
      const empresa = cnpjCache[cnpj];
      if (!empresa || empresa.erro) {
        vinculos.push({
          cnpj,
          razao_social: 'N/D',
          qualificacao: 'N/D',
          cnae: ''
        });
        continue;
      }

      const razaoNormalizada = (empresa.razao_social || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      let qualificacao = 'Sócio';

      // 1. Verificar se é MEI/Empresário Individual (razão social contém CPF ou nome completo)
      if (razaoNormalizada.includes(cpf) || razaoNormalizada.includes(nomeNormalizado.split(' ')[0])) {
        // Verificar se é MEI (razão social típica: "NOME COMPLETO CPF")
        if (razaoNormalizada.includes(cpf) || razaoNormalizada.match(/\d{11}$/)) {
          qualificacao = 'Titular/Empresário Individual (MEI)';
        } else {
          qualificacao = 'Titular/Empresário';
        }
      }
      // 2. Procurar o CPF na lista de sócios (QSA) usando matching parcial
      else if (empresa.qsa && empresa.qsa.length > 0) {
        const socio = empresa.qsa.find(s => {
          const cpfMascarado = (s.cpf_cnpj || '');
          // CPF mascarado: ***XXXXXX** - extrair os 6 dígitos centrais
          const match = cpfMascarado.match(/\*{3}(\d{6})\d{0,2}\*{2}/);
          if (match) {
            return match[1] === cpfCentral;
          }
          // Também tentar match por nome
          const nomeSocio = (s.nome || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return nomeSocio === nomeNormalizado || nomeSocio.includes(nomeNormalizado.split(' ')[0]);
        });

        if (socio) {
          qualificacao = socio.qualificacao_desc || 'Sócio';
        }
      }

      vinculos.push({
        cnpj,
        razao_social: empresa.razao_social || 'N/D',
        nome_fantasia: empresa.nome_fantasia || '',
        situacao: empresa.situacao || '',
        uf: empresa.uf || '',
        municipio: empresa.municipio || '',
        cnae: empresa.cnae_principal || '',
        qualificacao
      });
    }

    resultado.push({
      cpf,
      nome: info.nome,
      vinculos
    });
  }

  return resultado;
}

function gerarRelatorio(dados) {
  const linhas = ['CPF|NOME|CNPJ|RAZAO_SOCIAL|QUALIFICACAO|SITUACAO|UF|CNAE'];

  for (const pessoa of dados) {
    for (const vinculo of pessoa.vinculos) {
      linhas.push([
        pessoa.cpf,
        pessoa.nome,
        vinculo.cnpj,
        vinculo.razao_social,
        vinculo.qualificacao,
        vinculo.situacao || '',
        vinculo.uf || '',
        vinculo.cnae || ''
      ].join('|'));
    }
  }

  return linhas.join('\n');
}

async function main() {
  console.log('='.repeat(60));
  console.log('CONSULTA DE CNPJs - RECEITA FEDERAL (via BrasilAPI)');
  console.log('='.repeat(60));

  // Criar diretório de dados
  if (!fs.existsSync(dirDados)) {
    fs.mkdirSync(dirDados, { recursive: true });
  }

  // Extrair CNPJs únicos
  console.log('\n1. Extraindo CNPJs dos funcionários...');
  const { cnpjs, cpfCnpjMap } = extrairCNPJsUnicos();
  console.log(`   Total de CNPJs únicos: ${cnpjs.length}`);
  console.log(`   Total de funcionários com CNPJs: ${cpfCnpjMap.size}`);

  // Consultar CNPJs
  console.log('\n2. Consultando CNPJs na Receita Federal...');
  const cacheFile = path.join(dirDados, 'cache-cnpjs.json');
  const cnpjCache = await consultarTodosCNPJs(cnpjs, cacheFile);

  // Cruzar dados
  console.log('\n3. Cruzando dados para identificar qualificação dos sócios...');
  const dados = cruzarDados(cpfCnpjMap, cnpjCache);

  // Gerar relatório
  console.log('\n4. Gerando relatório...');
  const relatorio = gerarRelatorio(dados);
  const relatorioPath = path.join(dirDados, 'vinculos-empresariais-detalhados.csv');
  fs.writeFileSync(relatorioPath, relatorio);
  console.log(`   Relatório salvo em: ${relatorioPath}`);

  // Estatísticas
  console.log('\n' + '='.repeat(60));
  console.log('RESUMO');
  console.log('='.repeat(60));

  let totalVinculos = 0;
  const qualificacoes = {};

  for (const pessoa of dados) {
    for (const vinculo of pessoa.vinculos) {
      totalVinculos++;
      qualificacoes[vinculo.qualificacao] = (qualificacoes[vinculo.qualificacao] || 0) + 1;
    }
  }

  console.log(`Total de funcionários com vínculos: ${dados.length}`);
  console.log(`Total de vínculos empresariais: ${totalVinculos}`);
  console.log('\nDistribuição por qualificação:');

  Object.entries(qualificacoes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([qual, count]) => {
      console.log(`  ${qual}: ${count}`);
    });

  console.log('='.repeat(60));
}

main().catch(console.error);
