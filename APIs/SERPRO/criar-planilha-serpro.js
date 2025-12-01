/**
 * Script para criar planilha de custos das APIs SERPRO
 * Cada API em uma aba separada
 *
 * IMPORTANTE: O modelo de cobrança SERPRO é ESCALONADO/PROGRESSIVO
 * - Você paga cada faixa até esgotar, depois passa para a próxima
 * - Exemplo: Faixa 1 (0-999) + Faixa 2 (1000-9999) + Faixa 3 (10000+)
 *
 * Uso: node criar-planilha-serpro.js
 */

const XLSX = require('xlsx');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'SERPRO_TABELA_PRECOS.xlsx');

// ============================================
// DADOS DAS APIs
// ============================================

const APIs = {
  // API 1: Consulta CND
  'Consulta CND': {
    descricao: 'Certidão Negativa de Débitos - CND',
    fonte: 'RFB + PGFN (Receita Federal + Procuradoria-Geral da Fazenda Nacional)',
    documentacao: 'https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnd/',
    loja: 'https://loja.serpro.gov.br/consultacnd',
    funcionalidades: [
      'Certidão Negativa de Débitos de PF, PJ e Imóveis Rurais',
      'Consulta automática de certificado válido',
      'Emissão de novo certificado se necessário',
      'Retorna: código de controle, tipo (Negativa/Positiva com Efeitos de Negativa), validade'
    ],
    modelo: 'ESCALONADO - Paga cada faixa até esgotar, depois passa para próxima',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    faixas: [
      { faixa: '1', de: 1, ate: 5000, preco: 0.8788 },
      { faixa: '2', de: 5001, ate: 10000, preco: 0.8265 },
      { faixa: '3', de: 10001, ate: 15000, preco: 0.7951 },
      { faixa: '4', de: 15001, ate: 30000, preco: 0.7533 },
      { faixa: '5', de: 30001, ate: 50000, preco: 0.7219 },
      { faixa: '6', de: 50001, ate: 75000, preco: 0.6905 },
      { faixa: '7', de: 75001, ate: 100000, preco: 0.6486 },
      { faixa: '8', de: 100001, ate: 500000, preco: 0.6173 },
      { faixa: '9', de: 500001, ate: 1000000, preco: 0.5336 },
      { faixa: '10', de: 1000001, ate: 2000000, preco: 0.4394 },
      { faixa: '11', de: 2000001, ate: 4000000, preco: 0.3662 },
      { faixa: '12', de: 4000001, ate: 10000000, preco: 0.3139 },
      { faixa: '13', de: 10000001, ate: Infinity, preco: 0.2511 }
    ]
  },

  // API 2: Consulta CPF
  'Consulta CPF': {
    descricao: 'Consulta de Dados de CPF - Cadastro de Pessoas Físicas',
    fonte: 'Receita Federal do Brasil (RFB)',
    documentacao: 'https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cpf/',
    loja: 'https://loja.serpro.gov.br/consultacpf',
    funcionalidades: [
      'NI (Número de Inscrição) + Nome + Situação Cadastral',
      'Data de Nascimento + Ano de Óbito + Data de Inscrição',
      'Nome Social da Pessoa Física',
      'Prevenção a fraudes com dados oficiais da RFB',
      'Ideal para onboarding, análise de crédito, due diligence'
    ],
    modelo: 'ESCALONADO - Paga cada faixa até esgotar, depois passa para próxima',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    faixas: [
      { faixa: '1', de: 1, ate: 999, preco: 0.6591 },
      { faixa: '2', de: 1000, ate: 9999, preco: 0.5649 },
      { faixa: '3', de: 10000, ate: 49999, preco: 0.3557 },
      { faixa: '4', de: 50000, ate: 99999, preco: 0.2616 },
      { faixa: '5', de: 100000, ate: 249999, preco: 0.1775 },
      { faixa: '6', de: 250000, ate: 499999, preco: 0.1569 },
      { faixa: '7', de: 500000, ate: 999999, preco: 0.1465 },
      { faixa: '8', de: 1000000, ate: 1499999, preco: 0.1360 },
      { faixa: '9', de: 1500000, ate: 2999999, preco: 0.1151 },
      { faixa: '10', de: 3000000, ate: 4499999, preco: 0.0732 },
      { faixa: '11', de: 4500000, ate: 9999999, preco: 0.0523 },
      { faixa: '12', de: 10000000, ate: 16999999, preco: 0.0314 },
      { faixa: '13', de: 17000000, ate: 19999999, preco: 0.026 },
      { faixa: '14', de: 20000000, ate: 24999999, preco: 0.023 },
      { faixa: '15', de: 25000000, ate: 29999999, preco: 0.02 },
      { faixa: '16', de: 30000000, ate: Infinity, preco: 0.017 }
    ]
  },

  // API 3: Consulta CNPJ
  'Consulta CNPJ': {
    descricao: 'Consulta de Dados de CNPJ - Cadastro Nacional de Pessoas Jurídicas',
    fonte: 'Receita Federal do Brasil (RFB)',
    documentacao: 'https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnpj/',
    loja: 'https://loja.serpro.gov.br/consultacnpj',
    funcionalidades: [
      'Consulta Básica: Situação cadastral + Endereço + CNAE + Natureza Jurídica + Telefone',
      'Consulta QSA: Básica + Quadro Societário + Opção MEI/Simples',
      'Consulta Empresa: QSA + CPF/CNPJ dos Sócios + Data entrada sociedade',
      'Dados obtidos diretamente da Receita Federal - sempre atualizados',
      'Ideal para Due Diligence, KYC, análise de fornecedores'
    ],
    modelo: 'ESCALONADO - Paga cada faixa até esgotar, depois passa para próxima',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    faixas: [
      { faixa: '1', de: 1, ate: 5000, preco: 0.8788 },
      { faixa: '2', de: 5001, ate: 10000, preco: 0.8265 },
      { faixa: '3', de: 10001, ate: 15000, preco: 0.7951 },
      { faixa: '4', de: 15001, ate: 30000, preco: 0.7533 },
      { faixa: '5', de: 30001, ate: 50000, preco: 0.7219 },
      { faixa: '6', de: 50001, ate: 75000, preco: 0.6905 },
      { faixa: '7', de: 75001, ate: 100000, preco: 0.6486 },
      { faixa: '8', de: 100001, ate: 500000, preco: 0.6173 },
      { faixa: '9', de: 500001, ate: 1000000, preco: 0.5336 },
      { faixa: '10', de: 1000001, ate: 2000000, preco: 0.4394 },
      { faixa: '11', de: 2000001, ate: 4000000, preco: 0.3662 },
      { faixa: '12', de: 4000001, ate: 10000000, preco: 0.3139 },
      { faixa: '13', de: 10000001, ate: Infinity, preco: 0.2511 }
    ]
  },

  // API 4: Consulta DU-E
  'Consulta DU-E': {
    descricao: 'Declaração Única de Exportação - Dados de Comércio Exterior',
    fonte: 'Receita Federal + Secretaria de Comércio Exterior (SECEX)',
    documentacao: 'https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-due/',
    loja: 'https://loja.serpro.gov.br/consultadue',
    funcionalidades: [
      'Comprovação e validação de operações de exportação',
      'Controle e conformidade de operações de câmbio',
      'Processamento de pagamentos internacionais',
      'Informações administrativas, comerciais, financeiras, fiscais e logísticas',
      'Identificação de vendedor e comprador + histórico'
    ],
    modelo: 'ESCALONADO com VALOR FIXO inicial - Faixa 1 = R$ 2.789,07 fixo',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    valorFixoFaixa1: 2789.07,
    faixas: [
      { faixa: '1 (FIXO)', de: 0, ate: 999, preco: 2789.07, fixo: true },
      { faixa: '2', de: 1000, ate: 9999, preco: 2.7829 },
      { faixa: '3', de: 10000, ate: 49999, preco: 1.6844 },
      { faixa: '4', de: 50000, ate: 99999, preco: 1.0985 },
      { faixa: '5', de: 100000, ate: 499999, preco: 0.837 },
      { faixa: '6', de: 500000, ate: 1499999, preco: 0.5440 },
      { faixa: '7', de: 1500000, ate: 4499999, preco: 0.2720 },
      { faixa: '8', de: 4500000, ate: 13499999, preco: 0.1360 },
      { faixa: '9', de: 13500000, ate: Infinity, preco: 0.0732 }
    ]
  },

  // API 5: Consulta Dívida Ativa
  'Consulta Dívida Ativa': {
    descricao: 'Consulta de Débitos Inscritos na Dívida Ativa da União',
    fonte: 'Procuradoria-Geral da Fazenda Nacional (PGFN)',
    documentacao: 'https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-divida-ativa/',
    loja: 'https://loja.serpro.gov.br/consultadividaativa',
    funcionalidades: [
      'Consulta por número de inscrição na Dívida Ativa',
      'Consulta por CPF/CNPJ do devedor',
      'Lista todas as inscrições do devedor',
      'Situação: ATIVA, SUSPENSA, EXTINTA, GARANTIDA',
      'Ideal para Due Diligence, análise de crédito, investigação patrimonial'
    ],
    modelo: 'ESCALONADO - Paga cada faixa até esgotar, depois passa para próxima',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    faixas: [
      { faixa: '1', de: 1, ate: 999, preco: 0.6591 },
      { faixa: '2', de: 1000, ate: 9999, preco: 0.5649 },
      { faixa: '3', de: 10000, ate: 49999, preco: 0.3557 },
      { faixa: '4', de: 50000, ate: 99999, preco: 0.2616 },
      { faixa: '5', de: 100000, ate: 249999, preco: 0.1779 },
      { faixa: '6', de: 250000, ate: 499999, preco: 0.1569 },
      { faixa: '7', de: 500000, ate: 999999, preco: 0.1465 },
      { faixa: '8', de: 1000000, ate: 1499999, preco: 0.1360 },
      { faixa: '9', de: 1500000, ate: 2999999, preco: 0.1151 },
      { faixa: '10', de: 3000000, ate: 4499999, preco: 0.0732 },
      { faixa: '11', de: 4500000, ate: 9999999, preco: 0.0523 },
      { faixa: '12', de: 10000000, ate: Infinity, preco: 0.0314 }
    ]
  },

  // API 6: Consulta Faturamento
  'Consulta Faturamento': {
    descricao: 'Dados de Faturamento Declarado à Receita Federal',
    fonte: 'Receita Federal do Brasil (RFB) via Compartilha Receita',
    documentacao: 'https://apicenter.estaleiro.serpro.gov.br/documentacao/api-consulta-faturamento',
    loja: 'https://loja.serpro.gov.br/consultafaturamento',
    funcionalidades: [
      'Faturamento declarado de empresas de qualquer porte',
      'Dados cadastrais oficiais da RFB',
      'Requer consentimento do titular via e-CAC (TokenCompartilhamento)',
      'Conformidade com LGPD - dados com autorização explícita',
      'Ideal para análise de crédito, Due Diligence, M&A, financiamentos'
    ],
    modelo: 'ESCALONADO com Faixa 1 GRATUITA (1-5 consultas)',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    faixas: [
      { faixa: '1 (GRÁTIS)', de: 1, ate: 5, preco: 0, gratuito: true },
      { faixa: '2', de: 6, ate: 25000, preco: 3.6617 },
      { faixa: '3', de: 25001, ate: 50000, preco: 3.5466 },
      { faixa: '4', de: 50001, ate: 75000, preco: 3.4315 },
      { faixa: '5', de: 75001, ate: 100000, preco: 3.3165 },
      { faixa: '6', de: 100001, ate: 125000, preco: 3.2014 },
      { faixa: '7', de: 125001, ate: 150000, preco: 3.0863 },
      { faixa: '8', de: 150001, ate: 175000, preco: 2.9712 },
      { faixa: '9', de: 175001, ate: 200000, preco: 2.8561 },
      { faixa: '10', de: 200001, ate: Infinity, preco: 2.7410 }
    ]
  },

  // API 7: Consulta NFE
  'Consulta NFE': {
    descricao: 'Nota Fiscal Eletrônica - Modelo 55 (SPED)',
    fonte: 'SPED - Sistema Público de Escrituração Digital',
    documentacao: 'https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-nfe/',
    loja: 'https://loja.serpro.gov.br/consultanfe',
    funcionalidades: [
      'Consulta dados da NF-e pela chave de acesso',
      'Push NF-e: Monitoramento proativo de eventos (30 dias)',
      'Validação de autenticidade e situação de notas fiscais',
      'Dados obtidos diretamente da base do SPED',
      'Ideal para compliance tributário, validação de fornecedores, prevenção a fraudes'
    ],
    modelo: 'ESCALONADO - Paga cada faixa até esgotar, depois passa para próxima',
    cobranca: 'Mensal por faixa de volume (progressivo) - Consulta e Push mesmo valor',
    faixas: [
      { faixa: '1', de: 1, ate: 999, preco: 0.6591 },
      { faixa: '2', de: 1000, ate: 9999, preco: 0.5649 },
      { faixa: '3', de: 10000, ate: 49999, preco: 0.3557 },
      { faixa: '4', de: 50000, ate: 99999, preco: 0.2616 },
      { faixa: '5', de: 100000, ate: 249999, preco: 0.1779 },
      { faixa: '6', de: 250000, ate: 499999, preco: 0.1569 },
      { faixa: '7', de: 500000, ate: 999999, preco: 0.1465 },
      { faixa: '8', de: 1000000, ate: 1499999, preco: 0.1360 },
      { faixa: '9', de: 1500000, ate: 2999999, preco: 0.1151 },
      { faixa: '10', de: 3000000, ate: 4499999, preco: 0.0732 },
      { faixa: '11', de: 4500000, ate: 9999999, preco: 0.0523 },
      { faixa: '12', de: 10000000, ate: 16999999, preco: 0.0314 },
      { faixa: '13', de: 17000000, ate: 19999999, preco: 0.0300 },
      { faixa: '14', de: 20000000, ate: 24999999, preco: 0.0290 },
      { faixa: '15', de: 25000000, ate: 29999999, preco: 0.0280 },
      { faixa: '16', de: 30000000, ate: Infinity, preco: 0.0270 }
    ]
  },

  // API 8: Consulta Renda
  'Consulta Renda': {
    descricao: 'Dados de Renda de PF Declarados à Receita Federal',
    fonte: 'Receita Federal do Brasil (RFB) via Compartilha Receita',
    documentacao: 'https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-renda/',
    loja: 'https://loja.serpro.gov.br/consultarenda',
    funcionalidades: [
      'Renda declarada de pessoas físicas à RFB',
      'Requer consentimento do titular via e-CAC (TokenCompartilhamento)',
      'Conformidade com LGPD - dados com autorização explícita',
      'Ideal para análise de crédito, financiamentos, empréstimos',
      'Validação automatizada de capacidade financeira'
    ],
    modelo: 'ESCALONADO - Paga cada faixa até esgotar, depois passa para próxima',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    faixas: [
      { faixa: '1', de: 1, ate: 999, preco: 0.6591 },
      { faixa: '2', de: 1000, ate: 9999, preco: 0.5649 },
      { faixa: '3', de: 10000, ate: 49999, preco: 0.3557 },
      { faixa: '4', de: 50000, ate: 99999, preco: 0.2616 },
      { faixa: '5', de: 100000, ate: 249999, preco: 0.1779 },
      { faixa: '6', de: 250000, ate: 499999, preco: 0.1569 },
      { faixa: '7', de: 500000, ate: 999999, preco: 0.1465 },
      { faixa: '8', de: 1000000, ate: 1499999, preco: 0.1360 },
      { faixa: '9', de: 1500000, ate: 2999999, preco: 0.1151 },
      { faixa: '10', de: 3000000, ate: 4499999, preco: 0.0732 },
      { faixa: '11', de: 4500000, ate: 9999999, preco: 0.0523 },
      { faixa: '12', de: 10000000, ate: 16999999, preco: 0.0314 },
      { faixa: '13', de: 17000000, ate: 19999999, preco: 0.0300 },
      { faixa: '14', de: 20000000, ate: 24999999, preco: 0.0290 },
      { faixa: '15', de: 25000000, ate: 29999999, preco: 0.0280 },
      { faixa: '16', de: 30000000, ate: Infinity, preco: 0.0270 }
    ]
  },

  // API 9: Consulta Senatran - Básica
  'Senatran Básica': {
    descricao: 'Consulta Online Senatran - Tipo Básica (Veículos, CNH, Infrações)',
    fonte: 'SENATRAN - Secretaria Nacional de Trânsito',
    documentacao: 'https://loja.serpro.gov.br/consultasenatran',
    loja: 'https://loja.serpro.gov.br/consultasenatran',
    funcionalidades: [
      'Dados cadastrais básicos de veículos',
      'Dados básicos de condutores (CNH)',
      'Consulta de infrações',
      'Base Legal: PORTARIA SENATRAN nº 461/2025',
      'Ideal para locadoras, seguradoras, despachantes'
    ],
    modelo: 'ESCALONADO - Paga cada faixa até esgotar, depois passa para próxima',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    faixas: [
      { faixa: '1', de: 1, ate: 50000, preco: 0.83 },
      { faixa: '2', de: 50001, ate: 100000, preco: 0.73 },
      { faixa: '3', de: 100001, ate: 300000, preco: 0.66 },
      { faixa: '4', de: 300001, ate: 600000, preco: 0.57 },
      { faixa: '5', de: 600001, ate: 1000000, preco: 0.51 },
      { faixa: '6', de: 1000001, ate: Infinity, preco: 0.32 }
    ]
  },

  // API 10: Consulta Senatran - Indicadores
  'Senatran Indicadores': {
    descricao: 'Consulta Online Senatran - Com Indicadores (Veículos, CNH, Infrações)',
    fonte: 'SENATRAN - Secretaria Nacional de Trânsito',
    documentacao: 'https://loja.serpro.gov.br/consultasenatran',
    loja: 'https://loja.serpro.gov.br/consultasenatran',
    funcionalidades: [
      'Dados básicos + indicadores de situação',
      'Indicadores de restrições e impedimentos',
      'Indicadores de roubo/furto',
      'Base Legal: PORTARIA SENATRAN nº 461/2025',
      'Ideal para análise rápida de situação'
    ],
    modelo: 'ESCALONADO - Paga cada faixa até esgotar, depois passa para próxima',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    faixas: [
      { faixa: '1', de: 1, ate: 50000, preco: 1.00 },
      { faixa: '2', de: 50001, ate: 100000, preco: 0.91 },
      { faixa: '3', de: 100001, ate: 300000, preco: 0.83 },
      { faixa: '4', de: 300001, ate: 600000, preco: 0.73 },
      { faixa: '5', de: 600001, ate: 1000000, preco: 0.62 },
      { faixa: '6', de: 1000001, ate: Infinity, preco: 0.52 }
    ]
  },

  // API 11: Consulta Senatran - Detalhada
  'Senatran Detalhada': {
    descricao: 'Consulta Online Senatran - Detalhada (Veículos, CNH, Infrações)',
    fonte: 'SENATRAN - Secretaria Nacional de Trânsito',
    documentacao: 'https://loja.serpro.gov.br/consultasenatran',
    loja: 'https://loja.serpro.gov.br/consultasenatran',
    funcionalidades: [
      'Informações completas e detalhadas',
      'Histórico completo de infrações',
      'Detalhes de restrições judiciais',
      'Base Legal: PORTARIA SENATRAN nº 461/2025',
      'Ideal para investigação patrimonial, due diligence'
    ],
    modelo: 'ESCALONADO - Paga cada faixa até esgotar, depois passa para próxima',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    faixas: [
      { faixa: '1', de: 1, ate: 50000, preco: 1.47 },
      { faixa: '2', de: 50001, ate: 100000, preco: 1.31 },
      { faixa: '3', de: 100001, ate: 300000, preco: 1.14 },
      { faixa: '4', de: 300001, ate: 600000, preco: 1.03 },
      { faixa: '5', de: 600001, ate: 1000000, preco: 0.88 },
      { faixa: '6', de: 1000001, ate: Infinity, preco: 0.73 }
    ]
  },

  // API 12: Consulta Senatran - Com Imagem
  'Senatran Com Imagem': {
    descricao: 'Consulta Online Senatran - Com Imagem (Veículos, CNH, Infrações)',
    fonte: 'SENATRAN - Secretaria Nacional de Trânsito',
    documentacao: 'https://loja.serpro.gov.br/consultasenatran',
    loja: 'https://loja.serpro.gov.br/consultasenatran',
    funcionalidades: [
      'Consulta detalhada + imagem do documento/veículo',
      'Foto do condutor (CNH)',
      'Imagem do veículo quando disponível',
      'Base Legal: PORTARIA SENATRAN nº 461/2025',
      'Ideal para verificação visual de identidade'
    ],
    modelo: 'ESCALONADO - Paga cada faixa até esgotar, depois passa para próxima',
    cobranca: 'Mensal por faixa de volume (progressivo)',
    faixas: [
      { faixa: '1', de: 1, ate: 50000, preco: 2.49 },
      { faixa: '2', de: 50001, ate: 100000, preco: 2.19 },
      { faixa: '3', de: 100001, ate: 300000, preco: 1.97 },
      { faixa: '4', de: 300001, ate: 600000, preco: 1.71 },
      { faixa: '5', de: 600001, ate: 1000000, preco: 1.55 },
      { faixa: '6', de: 1000001, ate: Infinity, preco: 0.92 }
    ]
  }
};

// ============================================
// FUNÇÃO PARA CALCULAR CUSTO ESCALONADO
// ============================================

function calcularCustoEscalonado(faixas, quantidade) {
  let custoTotal = 0;
  let consultasRestantes = quantidade;
  let detalhes = [];

  for (const faixa of faixas) {
    if (consultasRestantes <= 0) break;

    // Se é faixa com valor fixo
    if (faixa.fixo) {
      custoTotal += faixa.preco;
      const consultasNaFaixa = Math.min(consultasRestantes, faixa.ate - faixa.de + 1);
      detalhes.push(`Faixa ${faixa.faixa}: R$ ${faixa.preco.toFixed(2)} (fixo para até ${faixa.ate + 1} consultas)`);
      consultasRestantes -= consultasNaFaixa;
      continue;
    }

    // Se é faixa gratuita
    if (faixa.gratuito) {
      const consultasNaFaixa = Math.min(consultasRestantes, faixa.ate - faixa.de + 1);
      detalhes.push(`Faixa ${faixa.faixa}: ${consultasNaFaixa} consultas GRÁTIS`);
      consultasRestantes -= consultasNaFaixa;
      continue;
    }

    const consultasNaFaixa = Math.min(consultasRestantes, faixa.ate - faixa.de + 1);
    const custoFaixa = consultasNaFaixa * faixa.preco;
    custoTotal += custoFaixa;

    if (consultasNaFaixa > 0) {
      detalhes.push(`Faixa ${faixa.faixa}: ${consultasNaFaixa.toLocaleString()} × R$ ${faixa.preco} = R$ ${custoFaixa.toFixed(2)}`);
    }

    consultasRestantes -= consultasNaFaixa;
  }

  return { custoTotal, detalhes };
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function criarAbaAPI(wb, nomeAPI, dados) {
  const rows = [];

  // Cabeçalho
  rows.push(['API SERPRO - ' + nomeAPI.toUpperCase()]);
  rows.push(['']);
  rows.push(['INFORMAÇÕES GERAIS']);
  rows.push(['Descrição:', dados.descricao]);
  rows.push(['Fonte dos Dados:', dados.fonte]);
  rows.push(['Documentação:', dados.documentacao]);
  rows.push(['Loja SERPRO:', dados.loja || 'N/A']);
  rows.push(['Modelo de Cobrança:', dados.modelo]);
  rows.push(['Período de Apuração:', dados.cobranca]);
  rows.push(['']);

  // Funcionalidades
  rows.push(['FUNCIONALIDADES']);
  dados.funcionalidades.forEach((func, i) => {
    rows.push([`${i + 1}.`, func]);
  });
  rows.push(['']);

  // AVISO IMPORTANTE
  rows.push(['⚠️ IMPORTANTE: MODELO DE COBRANÇA ESCALONADO']);
  rows.push(['O SERPRO usa cobrança PROGRESSIVA: você paga cada faixa até esgotar, depois passa para a próxima.']);
  rows.push(['Exemplo: 15.000 consultas = Faixa 1 (5.000) + Faixa 2 (5.000) + Faixa 3 (5.000)']);
  rows.push(['']);

  // Tabela de preços
  rows.push(['TABELA DE PREÇOS']);
  rows.push(['Faixa', 'De', 'Até', 'Preço por Consulta (R$)', 'Qtd na Faixa']);

  dados.faixas.forEach(f => {
    const qtdFaixa = f.ate === Infinity ? 'Ilimitado' : (f.ate - f.de + 1).toLocaleString();
    let precoStr;
    if (f.fixo) {
      precoStr = `${f.preco.toFixed(2)} (FIXO)`;
    } else if (f.gratuito) {
      precoStr = 'GRÁTIS';
    } else {
      precoStr = f.preco;
    }
    rows.push([
      `Faixa ${f.faixa}`,
      f.de.toLocaleString(),
      f.ate === Infinity ? 'Acima' : f.ate.toLocaleString(),
      precoStr,
      qtdFaixa
    ]);
  });

  rows.push(['']);

  // Simulador de custos ESCALONADO
  rows.push(['SIMULADOR DE CUSTOS (MODELO ESCALONADO)']);
  rows.push(['Quantidade', 'Cálculo Detalhado', 'Custo Total (R$)']);

  const simulacoes = [100, 500, 1000, 5000, 10000, 50000, 100000];
  simulacoes.forEach(qtd => {
    const resultado = calcularCustoEscalonado(dados.faixas, qtd);
    rows.push([
      qtd.toLocaleString(),
      resultado.detalhes.join(' + '),
      `R$ ${resultado.custoTotal.toFixed(2)}`
    ]);
  });

  // Criar worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Ajustar larguras das colunas
  ws['!cols'] = [
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 25 },
    { wch: 15 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, nomeAPI.substring(0, 31));
}

function criarAbaCNPJDetalhada(wb) {
  const rows = [];

  rows.push(['API SERPRO - CONSULTA CNPJ - DETALHAMENTO']);
  rows.push(['']);
  rows.push(['TIPOS DE CONSULTA DISPONÍVEIS']);
  rows.push(['']);
  rows.push(['DADO RETORNADO', 'BÁSICA', 'QSA', 'EMPRESA']);
  rows.push(['']);
  rows.push(['=== DADOS CADASTRAIS ===', '', '', '']);
  rows.push(['CNPJ', 'X', 'X', 'X']);
  rows.push(['Razão social/nome empresarial', 'X', 'X', 'X']);
  rows.push(['Nome fantasia', 'X', 'X', 'X']);
  rows.push(['Situação cadastral', 'X', 'X', 'X']);
  rows.push(['CNAE-fiscal (atividade principal)', 'X', 'X', 'X']);
  rows.push(['Endereço completo', 'X', 'X', 'X']);
  rows.push(['Telefones e e-mail', 'X', 'X', 'X']);
  rows.push(['Capital social', 'X', 'X', 'X']);
  rows.push(['']);
  rows.push(['=== OPÇÃO MEI / SIMPLES ===', '', '', '']);
  rows.push(['Opção pelo Simples', '-', 'X', 'X']);
  rows.push(['Opção pelo MEI', '-', 'X', 'X']);
  rows.push(['']);
  rows.push(['=== QUADRO SOCIETÁRIO ===', '', '', '']);
  rows.push(['Nome do sócio', '-', 'X', 'X']);
  rows.push(['*** CNPJ/CPF do sócio ***', '-', '-', 'X']);
  rows.push(['*** Data entrada sociedade ***', '-', '-', 'X']);
  rows.push(['*** CPF representante legal ***', '-', '-', 'X']);
  rows.push(['']);
  rows.push(['LEGENDA:']);
  rows.push(['X = Disponível | - = Não disponível | *** = EXCLUSIVO Consulta Empresa']);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 40 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws, 'CNPJ Detalhado');
}

function criarAbaCPFDetalhada(wb) {
  const rows = [];

  rows.push(['API SERPRO - CONSULTA CPF - DETALHAMENTO']);
  rows.push(['']);
  rows.push(['CAMPOS RETORNADOS']);
  rows.push(['']);
  rows.push(['Campo', 'Descrição']);
  rows.push(['NI', 'Número de Inscrição (CPF)']);
  rows.push(['Nome', 'Nome da Pessoa Física']);
  rows.push(['Situação', 'Código + Descrição da situação cadastral']);
  rows.push(['Data de Nascimento', 'Formato DDMMAAAA']);
  rows.push(['Ano de Óbito', 'Formato AAAA (quando aplicável)']);
  rows.push(['Data de Inscrição', 'Formato DDMMAAAA']);
  rows.push(['Nome Social', 'Nome social da pessoa']);
  rows.push(['']);
  rows.push(['SITUAÇÕES CADASTRAIS']);
  rows.push(['Código', 'Descrição']);
  rows.push(['0', 'Regular']);
  rows.push(['2', 'Suspensa']);
  rows.push(['3', 'Titular Falecido']);
  rows.push(['4', 'Pendente de Regularização']);
  rows.push(['5', 'Cancelada por Multiplicidade']);
  rows.push(['8', 'Nula']);
  rows.push(['9', 'Cancelada de Ofício']);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 25 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, ws, 'CPF Detalhado');
}

function criarAbaResumo(wb, apis) {
  const rows = [];

  rows.push(['SERPRO - RESUMO DE APIs E PREÇOS']);
  rows.push(['Documento de Referência - InvestigaRee']);
  rows.push(['Atualizado em: ' + new Date().toLocaleDateString('pt-BR')]);
  rows.push(['']);
  rows.push(['⚠️ IMPORTANTE: MODELO DE COBRANÇA ESCALONADO/PROGRESSIVO']);
  rows.push(['Você paga CADA FAIXA até esgotar, depois passa para a próxima com preço menor.']);
  rows.push(['Não é preço único - é SOMA de todas as faixas até o volume consumido.']);
  rows.push(['']);

  rows.push(['API', 'Descrição', 'Preço Faixa 1 (R$)', 'Preço Última Faixa (R$)', 'Documentação']);

  Object.keys(apis).forEach(nome => {
    const api = apis[nome];
    let precoFaixa1;
    if (api.faixas[0].fixo) {
      precoFaixa1 = `${api.faixas[0].preco} (FIXO)`;
    } else if (api.faixas[0].gratuito) {
      precoFaixa1 = 'GRÁTIS';
    } else {
      precoFaixa1 = api.faixas[0].preco;
    }
    const precoUltima = api.faixas[api.faixas.length - 1].preco;
    rows.push([nome, api.descricao, precoFaixa1, precoUltima, api.documentacao]);
  });

  rows.push(['']);
  rows.push(['']);
  rows.push(['OBSERVAÇÕES:']);
  rows.push(['1. Modelo ESCALONADO: paga cada faixa até esgotar, depois passa para próxima']);
  rows.push(['2. Algumas APIs têm VALOR FIXO na Faixa 1 (ex: DU-E = R$ 2.789,07)']);
  rows.push(['3. O custo total é a SOMA de todas as faixas consumidas']);
  rows.push(['4. Contratação requer certificado digital e-CNPJ']);
  rows.push(['5. Cancele a qualquer momento sem multas']);
  rows.push(['']);
  rows.push(['CONTATO SERPRO:']);
  rows.push(['Email: css.serpro@serpro.gov.br']);
  rows.push(['Telefone: 0800 728 2323']);
  rows.push(['Loja: https://loja.serpro.gov.br']);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 18 }, { wch: 45 }, { wch: 20 }, { wch: 22 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, ws, 'RESUMO');
}

function criarAbaModeloCobranca(wb) {
  const rows = [];

  rows.push(['SERPRO - ENTENDENDO O MODELO DE COBRANÇA ESCALONADO']);
  rows.push(['']);
  rows.push(['O QUE É COBRANÇA ESCALONADA/PROGRESSIVA?']);
  rows.push(['']);
  rows.push(['Diferente de um preço único, você paga CADA FAIXA sequencialmente:']);
  rows.push(['']);
  rows.push(['EXEMPLO PRÁTICO - 15.000 consultas de CPF:']);
  rows.push(['']);
  rows.push(['Faixa', 'Quantidade', 'Preço Unit.', 'Subtotal']);
  rows.push(['Faixa 1 (1-999)', '999', 'R$ 0,6591', 'R$ 658,44']);
  rows.push(['Faixa 2 (1.000-9.999)', '9.000', 'R$ 0,5649', 'R$ 5.084,10']);
  rows.push(['Faixa 3 (10.000-49.999)', '5.001', 'R$ 0,3557', 'R$ 1.779,06']);
  rows.push(['', '', 'TOTAL:', 'R$ 7.521,60']);
  rows.push(['']);
  rows.push(['SE FOSSE PREÇO ÚNICO (errado):']);
  rows.push(['15.000 × R$ 0,3557 = R$ 5.335,50 (NÃO É ASSIM!)']);
  rows.push(['']);
  rows.push(['']);
  rows.push(['EXEMPLO COM VALOR FIXO - DU-E com 5.000 consultas:']);
  rows.push(['']);
  rows.push(['Faixa', 'Quantidade', 'Preço', 'Subtotal']);
  rows.push(['Faixa 1 (0-999)', '999', 'R$ 2.789,07 FIXO', 'R$ 2.789,07']);
  rows.push(['Faixa 2 (1.000-9.999)', '4.001', 'R$ 2,7829/consulta', 'R$ 11.134,90']);
  rows.push(['', '', 'TOTAL:', 'R$ 13.923,97']);
  rows.push(['']);
  rows.push(['']);
  rows.push(['DICA: Quanto MAIS você consome, MENOR o preço médio por consulta.']);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Modelo Cobrança');
}

// ============================================
// EXECUÇÃO PRINCIPAL
// ============================================

function main() {
  console.log('==============================================');
  console.log('CRIANDO PLANILHA DE PREÇOS SERPRO');
  console.log('(Modelo de Cobrança Escalonado/Progressivo)');
  console.log('==============================================\n');

  const wb = XLSX.utils.book_new();

  // Criar abas
  criarAbaResumo(wb, APIs);
  criarAbaModeloCobranca(wb);

  Object.keys(APIs).forEach(nomeAPI => {
    console.log(`Criando aba: ${nomeAPI}`);
    criarAbaAPI(wb, nomeAPI, APIs[nomeAPI]);
  });

  console.log('Criando aba: CPF Detalhado');
  criarAbaCPFDetalhada(wb);

  console.log('Criando aba: CNPJ Detalhado');
  criarAbaCNPJDetalhada(wb);

  XLSX.writeFile(wb, OUTPUT_FILE);

  console.log(`\n✅ Planilha criada: ${OUTPUT_FILE}`);
  console.log(`\nAbas criadas:`);
  console.log(`  - RESUMO`);
  console.log(`  - Modelo Cobrança`);
  Object.keys(APIs).forEach(nome => {
    console.log(`  - ${nome}`);
  });
  console.log(`  - CPF Detalhado`);
  console.log(`  - CNPJ Detalhado`);
}

main();
