# SERPRO - Catálogo de APIs Documentadas

**Resumo de todas as APIs SERPRO disponíveis para investigação e due diligence**

---

## VISÃO GERAL

Este documento consolida todas as APIs SERPRO documentadas para uso em processos de investigação, due diligence, compliance e análise de crédito.

**Total de APIs documentadas:** 22

---

## CATEGORIAS DE APIs

### 1. CONSULTAS CADASTRAIS (Receita Federal)

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Consulta CPF** | Dados de pessoas físicas | Nome, situação, nascimento, óbito |
| **Consulta CNPJ** | Dados de pessoas jurídicas | Razão social, sócios, situação, CNAE |
| **Consulta CND** | Certidão Negativa de Débitos | Situação fiscal federal |
| **Consulta Dívida Ativa** | Débitos inscritos na PGFN | Inscrições, valores, situação |

### 2. CONSULTAS FISCAIS/FINANCEIRAS

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Consulta Faturamento** | Faturamento declarado à RFB | Receita declarada de empresas |
| **Consulta Renda** | Renda de pessoas físicas | Renda declarada à RFB |
| **Consulta Restituição** | Restituição do IRPF | Direito/valor de restituição |
| **Consulta NFE** | Notas Fiscais Eletrônicas | Dados de NF-e, situação, Push |

### 3. CONSULTAS DE TRÂNSITO (SENATRAN)

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Senatran Básica** | Dados básicos | Veículos, CNH, infrações |
| **Senatran Indicadores** | Com indicadores | + Restrições, roubo/furto |
| **Senatran Detalhada** | Informações completas | + Histórico detalhado |
| **Senatran Com Imagem** | Com foto/imagem | + Foto do condutor/veículo |

### 4. VALIDAÇÃO DE IDENTIDADE

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Datavalid** | Validação de identidade | Biometria facial, digital, dados |
| **Biovalid** | Prova de vida | Liveness detection |
| **Cartório Data** | Dados para cartórios | CPF/CNPJ (Provimento CNJ 88/2019) |

### 5. COMÉRCIO EXTERIOR

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Consulta DU-E** | Declaração Única de Exportação | Operações de exportação |
| **Integra Comex** | Sistema Siscomex | DI, DUIMP, habilitações |

### 6. IMÓVEIS RURAIS

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Consulta CCIR** | Certificado de Imóveis Rurais | Dados cadastrais INCRA |

### 7. SERVIÇOS CONTÁBEIS/FISCAIS

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Integra Contador** | Plataforma contábil | 84 funcionalidades fiscais |

### 8. DOCUMENTOS DIGITAIS

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Carimbo do Tempo** | Selo temporal | Prova de existência de documento |

### 9. INTEGRAÇÃO GOVERNAMENTAL

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Integra SIAFI** | Sistema financeiro federal | Notas de empenho, crédito, lançamento |
| **Conecta Gov.br** | Interoperabilidade governamental | Troca de dados entre órgãos |
| **AntecipaGov** | Crédito para fornecedores | Contratos, recebíveis, garantias |

### 10. SETOR ESPECÍFICO

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Integra Loja Franca** | Lojas francas de fronteira | Cotas, vendas, controle aduaneiro |

### 11. PRIVACIDADE E LGPD

| API/Plataforma | Descrição | Dados Principais |
|----------------|-----------|------------------|
| **SERPRO LGPD / PDC** | Gestão de privacidade | Consentimentos, requisições LGPD |

---

## MODELO DE COBRANÇA

Todas as APIs SERPRO utilizam o modelo **ESCALONADO/PROGRESSIVO**:

1. Você paga cada faixa até esgotar
2. Depois passa para a próxima faixa com preço menor
3. Quanto maior o volume, menor o custo por consulta

**Exceções:**
- **DU-E**: Faixa 1 com valor FIXO (R$ 2.789,07)
- **Faturamento**: Faixa 1 GRATUITA (1-5 consultas)

---

## COMPARATIVO DE PREÇOS (Faixa 1)

| API | Preço Faixa 1 | Observação |
|-----|---------------|------------|
| Consulta CPF | R$ 0,6591 | Até 999 consultas |
| Consulta CNPJ | R$ 0,8788 | Até 5.000 consultas |
| Consulta CND | R$ 0,8788 | Até 5.000 consultas |
| Consulta Dívida Ativa | R$ 0,6591 | Até 999 consultas |
| Consulta NFE | R$ 0,6591 | Até 999 consultas |
| Consulta Renda | R$ 0,6591 | Até 999 consultas |
| Consulta DU-E | R$ 2.789,07 | **FIXO** até 999 |
| Consulta Faturamento | **GRÁTIS** | Até 5 consultas |
| Senatran Básica | R$ 0,83 | Até 50.000 consultas |
| Senatran Indicadores | R$ 1,00 | Até 50.000 consultas |
| Senatran Detalhada | R$ 1,47 | Até 50.000 consultas |
| Senatran Com Imagem | R$ 2,49 | Até 50.000 consultas |
| SERPRO LGPD / PDC | R$ 0,08 a R$ 0,18 | Por transação (consentimento) |

---

## REQUISITOS PARA CONTRATAÇÃO

1. **Certificado Digital e-CNPJ** da empresa (padrão ICP-Brasil)
2. **Cadastro na Loja SERPRO** (https://loja.serpro.gov.br)
3. Algumas APIs requerem **procuração digital** do titular (Compartilha Receita)

---

## CONTATO SERPRO

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |
| **Loja** | https://loja.serpro.gov.br |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/ |

---

## ARQUIVOS DE DOCUMENTAÇÃO

| Arquivo | API |
|---------|-----|
| `API_CONSULTA_CPF.md` | Consulta CPF |
| `API_CONSULTA_CNPJ.md` | Consulta CNPJ |
| `API_CONSULTA_CND.md` | Consulta CND |
| `API_CONSULTA_DIVIDA_ATIVA.md` | Consulta Dívida Ativa |
| `API_CONSULTA_FATURAMENTO.md` | Consulta Faturamento |
| `API_CONSULTA_RENDA.md` | Consulta Renda |
| `API_CONSULTA_RESTITUICAO.md` | Consulta Restituição |
| `API_CONSULTA_NFE.md` | Consulta NFE |
| `API_CONSULTA_DUE.md` | Consulta DU-E |
| `API_CONSULTA_CCIR.md` | Consulta CCIR |
| `API_CONSULTA_SENATRAN.md` | Consulta Senatran (4 tipos) |
| `API_DATAVALID.md` | Datavalid |
| `API_BIOVALID.md` | Biovalid |
| `API_CARTORIO_DATA.md` | Cartório Data |
| `API_INTEGRA_COMEX.md` | Integra Comex |
| `API_INTEGRA_CONTADOR.md` | Integra Contador |
| `API_CARIMBO_TEMPO.md` | Carimbo do Tempo |
| `API_INTEGRA_SIAFI.md` | Integra SIAFI |
| `API_CONECTA_GOVBR.md` | Conecta Gov.br |
| `API_ANTECIPAGOV.md` | AntecipaGov |
| `API_INTEGRA_LOJA_FRANCA.md` | Integra Loja Franca |
| `API_SERPRO_LGPD_PDC.md` | SERPRO LGPD / PDC |

---

## PLANILHA DE PREÇOS

Arquivo Excel com tabelas de preços detalhadas:
- `SERPRO_TABELA_PRECOS.xlsx`

Gerado por:
- `criar-planilha-serpro.js`

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
