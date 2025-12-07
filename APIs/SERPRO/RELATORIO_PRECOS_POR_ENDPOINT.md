# Relatório de Preços por Endpoint - APIs SERPRO

📅 **Data:** 06/12/2025
🏢 **Contratante:** INVESTIR ITAPEMA LTDA (CNPJ 29.814.517/0001-04)
📊 **Total de APIs:** 12 produtos contratados (9 SERPRO + 2 Serasa + 1 JusBrasil)
📄 **Fonte:** Contratos oficiais SERPRO (Anexo I) + Proposta Serasa Experian + Documentação JusBrasil

---

## 📌 Índice

### APIs SERPRO

1. [Consulta CPF](#1-consulta-cpf---contrato-260005)
2. [Consulta CNPJ](#2-consulta-cnpj---contrato-260009)
3. [Consulta Renda](#3-consulta-renda---contratos-260008--261071)
4. [Consulta Dívida Ativa](#4-consulta-dívida-ativa---contrato-261069)
5. [Consulta CND](#5-consulta-cnd---contrato-261075)
6. [Consulta Faturamento](#6-consulta-faturamento---contrato-261073)
7. [Datavalid V4](#7-datavalid-v4---contrato-261070)
8. [Integra Contador](#8-integra-contador---contrato-261074)
9. [Raiz Tech - Pastagens Degradadas](#9-raiz-tech---pastagens-degradadas---contrato-261072)

### Serasa Experian

10. [Relatório Avançado PF](#10-serasa---relatório-avançado-pf)
11. [Relatório Avançado PJ](#11-serasa---relatório-avançado-pj)

### JusBrasil

12. [JusBrasil Consulta PRO](#12-jusbrasil---consulta-pro)

---

## 1. Consulta CPF - Contrato 260005

### Endpoint Único

**URL:** `GET /consulta-cpf-df/v2/cpf/{cpf}`

**Modelo de Cobrança:** PROGRESSIVO/ESCALONADO

| Faixa | Volume | Preço Unitário | Custo Acumulado (até o final da faixa) |
|-------|--------|----------------|----------------------------------------|
| 1 | 1 - 999 | R$ 0,659 | R$ 658,36 |
| 2 | 1.000 - 9.999 | R$ 0,565 | R$ 5.743,21 |
| 3 | 10.000 - 49.999 | R$ 0,356 | R$ 19.983,21 |
| 4 | 50.000 - 99.999 | R$ 0,262 | R$ 33.083,21 |
| 5 | 100.000 - 249.999 | R$ 0,178 | R$ 59.783,21 |
| 6 | 250.000 - 499.999 | R$ 0,157 | R$ 99.033,21 |
| 7 | 500.000 - 999.999 | R$ 0,146 | R$ 172.033,21 |
| 8 | 1.000.000 - 1.499.999 | R$ 0,136 | R$ 240.033,21 |
| 9 | 1.500.000 - 2.999.999 | R$ 0,115 | R$ 412.533,21 |
| 10 | 3.000.000 - 4.499.999 | R$ 0,073 | R$ 522.033,21 |
| 11 | 4.500.000 - 9.999.999 | R$ 0,052 | R$ 808.533,21 |
| 12 | 10.000.000 - 16.999.999 | R$ 0,031 | R$ 1.025.533,21 |
| 13 | 17.000.000 - 19.999.999 | R$ 0,026 | R$ 1.103.533,21 |
| 14 | 20.000.000 - 24.999.999 | R$ 0,023 | R$ 1.218.533,21 |
| 15 | 25.000.000 - 29.999.999 | R$ 0,02 | R$ 1.318.533,21 |
| 16 | 30.000.000+ | R$ 0,017 | - |

**Recursos Inclusos:** Check Time Stamp (Carimbo de Tempo) - GRATUITO

**📋 Dados Retornados:**
- `ni` - CPF (11 dígitos)
- `nome` - Nome completo
- `situacao` - Situação cadastral (código e descrição)
  - 0 = Regular
  - 2 = Suspensa
  - 3 = Titular falecido
  - 4 = Pendente de regularização
  - 5 = Cancelada por multiplicidade
  - 8 = Nula
  - 9 = Cancelada de ofício
- `nascimento` - Data de nascimento (DDMMAAAA)
- `dataInscricao` - Data de inscrição no CPF (DDMMAAAA)
- `obito` - Data de óbito (se aplicável)
- `nomeSocial` - Nome social (se cadastrado)

**Exemplo de Custo:**
- 100 consultas = R$ 65,90
- 1.000 consultas = R$ 658,36
- 10.000 consultas = R$ 5.743,21
- 100.000 consultas = R$ 33.083,21

---

## 2. Consulta CNPJ - Contrato 260009

### 2.1 Endpoint: Consulta Básica

**URL:** `GET /consulta-cnpj-df/v2/basica/{cnpj}`

**Modelo de Cobrança:** PROGRESSIVO/ESCALONADO

| Faixa | Volume | Preço Unitário | Custo Acumulado |
|-------|--------|----------------|-----------------|
| 1 | 1 - 999 | R$ 0,659 | R$ 658,21 |
| 2 | 1.000 - 9.999 | R$ 0,565 | R$ 5.743,21 |
| 3 | 10.000 - 49.999 | R$ 0,356 | R$ 19.983,21 |
| 4 | 50.000 - 99.999 | R$ 0,262 | R$ 33.083,21 |
| 5 | 100.000 - 249.999 | R$ 0,178 | R$ 59.783,21 |
| 6 | 250.000 - 499.999 | R$ 0,157 | R$ 99.033,21 |
| 7 | 500.000 - 999.999 | R$ 0,146 | R$ 172.033,21 |
| 8 | 1.000.000 - 1.499.999 | R$ 0,136 | R$ 240.033,21 |
| 9 | 1.500.000 - 2.999.999 | R$ 0,115 | R$ 412.533,21 |
| 10 | 3.000.000 - 4.999.999 | R$ 0,0700 | R$ 552.533,21 |
| 11 | 5.000.000 - 6.999.999 | R$ 0,06 | R$ 672.533,21 |
| 12 | 7.000.000 - 9.999.999 | R$ 0,0500 | R$ 822.533,21 |
| 13 | 10.000.000 - 19.999.999 | R$ 0,0400 | R$ 1.222.533,21 |
| 14 | 20.000.000 - 24.999.999 | R$ 0,0350 | R$ 1.397.533,21 |
| 15 | 25.000.000 - 29.999.999 | R$ 0,0300 | R$ 1.547.533,21 |
| 16 | 30.000.000+ | R$ 0,0250 | - |

**📋 Dados Retornados:**
- `ni` - CNPJ (14 dígitos)
- `data_abertura` - Data de abertura (AAAA-MM-DD)
- `nome_empresarial` - Razão social
- `nome_fantasia` - Nome fantasia
- `cnae_principal` - CNAE principal (código e descrição)
- `natureza_juridica` - Natureza jurídica (código e descrição)
- `endereco` - Endereço completo (logradouro, número, complemento, bairro, município, UF, CEP)
- `situacao_cadastral` - Situação (código, data, motivo)
  - 1 = Nula
  - 2 = Ativa
  - 3 = Suspensa
  - 4 = Inapta
  - 8 = Baixada
- `situacao_especial` - Situação especial
- `orgao_registro` - Código do órgão de registro
- `nome_orgao` - Nome do órgão supervisor
- `tipo_estabelecimento` - 1=Matriz, 2=Filial
- `correio_eletronico` - E-mail
- `capital_social` - Capital social
- `porte` - Porte (01=ME, 03=EPP, 05=Demais)
- `telefones` - Array com DDD e número
- `ente_federativo` - Ente federativo responsável

**Exemplo de Custo:**
- 100 consultas = R$ 65,90
- 1.000 consultas = R$ 658,21
- 10.000 consultas = R$ 5.743,21

---

### 2.2 Endpoint: Consulta QSA (CPF Mascarado)

**URL:** `GET /consulta-cnpj-df/v2/qsa/{cnpj}`

**Modelo de Cobrança:** PROGRESSIVO/ESCALONADO

| Faixa | Volume | Preço Unitário | Custo Acumulado |
|-------|--------|----------------|-----------------|
| 1 | 1 - 999 | R$ 0,8680 | R$ 866,73 |
| 2 | 1.000 - 9.999 | R$ 0,7430 | R$ 7.553,73 |
| 3 | 10.000 - 49.999 | R$ 0,5960 | R$ 31.393,73 |
| 4 | 50.000 - 99.999 | R$ 0,5020 | R$ 56.493,73 |
| 5 | 100.000 - 249.999 | R$ 0,3980 | R$ 116.193,73 |
| 6 | 250.000 - 499.999 | R$ 0,3350 | R$ 199.943,73 |
| 7 | 500.000 - 999.999 | R$ 0,2720 | R$ 335.943,73 |
| 8 | 1.000.000 - 1.499.999 | R$ 0,22 | R$ 445.943,73 |
| 9 | 1.500.000 - 2.999.999 | R$ 0,178 | R$ 712.943,73 |
| 10 | 3.000.000 - 4.999.999 | R$ 0,1300 | R$ 972.943,73 |
| 11 | 5.000.000 - 6.999.999 | R$ 0,12 | R$ 1.212.943,73 |
| 12 | 7.000.000 - 9.999.999 | R$ 0,11 | R$ 1.542.943,73 |
| 13 | 10.000.000 - 19.999.999 | R$ 0,1000 | R$ 2.542.943,73 |
| 14 | 20.000.000 - 24.999.999 | R$ 0,0760 | R$ 2.922.943,73 |
| 15 | 25.000.000 - 29.999.999 | R$ 0,0720 | R$ 3.282.943,73 |
| 16 | 30.000.000+ | R$ 0,0670 | - |

**📋 Dados Retornados:**
- **Todos os campos da Consulta Básica** +
- `qsa` - Array com Quadro de Sócios e Administradores:
  - `nome_socio` - Nome do sócio/administrador
  - `codigo_qualificacao_socio` - Código da qualificação
  - `qualificacao_socio` - Descrição da qualificação
  - `codigo_pais_socio_estrangeiro` - Código do país (se estrangeiro)
  - `nome_pais_socio_estrangeiro` - Nome do país (se estrangeiro)
  - `cpf_cnpj_socio` - **CPF MASCARADO** (`***000002**`)
  - `data_entrada_sociedade` - Data de entrada (AAAA-MM-DD)
  - `cpf_representante_legal` - CPF do representante (mascarado)
  - `nome_representante_legal` - Nome do representante
  - `codigo_qualificacao_representante_legal` - Código qualificação
  - `qualificacao_representante_legal` - Descrição qualificação

**Diferença vs Básica:** +31,7% mais caro (Faixa 1)

**Exemplo de Custo:**
- 100 consultas = R$ 86,80
- 1.000 consultas = R$ 866,73
- 10.000 consultas = R$ 7.553,73

---

### 2.3 Endpoint: Consulta Empresa (CPF Completo)

**URL:** `GET /consulta-cnpj-df/v2/empresa/{cnpj}`

**Modelo de Cobrança:** PROGRESSIVO/ESCALONADO

| Faixa | Volume | Preço Unitário | Custo Acumulado |
|-------|--------|----------------|-----------------|
| 1 | 1 - 999 | R$ 1,1720 | R$ 1.170,83 |
| 2 | 1.000 - 9.999 | R$ 1,0150 | R$ 10.305,83 |
| 3 | 10.000 - 49.999 | R$ 0,826 | R$ 43.345,83 |
| 4 | 50.000 - 99.999 | R$ 0,7010 | R$ 78.395,83 |
| 5 | 100.000 - 249.999 | R$ 0,565 | R$ 163.145,83 |
| 6 | 250.000 - 499.999 | R$ 0,4710 | R$ 280.895,83 |
| 7 | 500.000 - 999.999 | R$ 0,3980 | R$ 479.895,83 |
| 8 | 1.000.000 - 1.499.999 | R$ 0,3240 | R$ 641.895,83 |
| 9 | 1.500.000 - 2.999.999 | R$ 0,251 | R$ 1.018.395,83 |
| 10 | 3.000.000 - 4.999.999 | R$ 0,19 | R$ 1.398.395,83 |
| 11 | 5.000.000 - 6.999.999 | R$ 0,18 | R$ 1.758.395,83 |
| 12 | 7.000.000 - 9.999.999 | R$ 0,1700 | R$ 2.268.395,83 |
| 13 | 10.000.000 - 19.999.999 | R$ 0,1500 | R$ 3.768.395,83 |
| 14 | 20.000.000 - 24.999.999 | R$ 0,1380 | R$ 4.458.395,83 |
| 15 | 25.000.000 - 29.999.999 | R$ 0,1220 | R$ 5.068.395,83 |
| 16 | 30.000.000+ | R$ 0,1080 | - |

**📋 Dados Retornados:**
- **Todos os campos da Consulta Básica** +
- `socios` - Array com sócios e administradores:
  - `nome_socio` - Nome do sócio/administrador
  - `codigo_qualificacao_socio` - Código da qualificação
  - `qualificacao_socio` - Descrição da qualificação (05=Administrador, 22=Sócio, 49=Sócio-Administrador, etc.)
  - `codigo_pais_socio_estrangeiro` - Código do país (se estrangeiro)
  - `nome_pais_socio_estrangeiro` - Nome do país (se estrangeiro)
  - `cpf_cnpj_socio` - **CPF COMPLETO** (sem máscara - 11 dígitos)
  - `data_entrada_sociedade` - Data de entrada (AAAA-MM-DD)
  - `cpf_representante_legal` - CPF do representante (completo)
  - `nome_representante_legal` - Nome do representante
  - `codigo_qualificacao_representante_legal` - Código qualificação
  - `qualificacao_representante_legal` - Descrição qualificação

**⚠️ DIFERENÇA PRINCIPAL:** CPF dos sócios retorna **COMPLETO** para cruzamento de dados e investigações.

**Diferença vs Básica:** +77,8% mais caro (Faixa 1)

**Recursos Inclusos:** Check Time Stamp (Carimbo de Tempo) - GRATUITO

**Exemplo de Custo:**
- 100 consultas = R$ 117,20
- 1.000 consultas = R$ 1.170,83
- 10.000 consultas = R$ 10.305,83

---

## 3. Consulta Renda - Contratos 260008 & 261071

### Endpoint Único

**URL:** `GET /consulta-renda/v1/renda/{cpf}/{anoBase}`

**Modelo de Cobrança:** ⚠️ POR FAIXA DE VOLUME TOTAL (NÃO PROGRESSIVO)

**Consultas Gratuitas:** 5 primeiras consultas do mês

| Faixa | Volume | Preço Unitário | Custo Total (Máximo da Faixa) |
|-------|--------|----------------|-------------------------------|
| 1 | 1 - 5 | **R$ 0,00 (GRÁTIS)** | R$ 0,00 |
| 2 | 6 - 1.000.000 | R$ 1,569 | R$ 1.569.000,00 |
| 3 | 1.000.001 - 2.000.000 | R$ 1,517 | R$ 3.034.000,00 |
| 4 | 2.000.001 - 3.000.000 | R$ 1,465 | R$ 4.395.000,00 |
| 5 | 3.000.001 - 4.000.000 | R$ 1,412 | R$ 5.648.000,00 |
| 6 | 4.000.001 - 5.000.000 | R$ 1,36 | R$ 6.800.000,00 |
| 7 | 5.000.001 - 6.000.000 | R$ 1,308 | R$ 7.848.000,00 |
| 8 | 6.000.001 - 7.000.000 | R$ 1,255 | R$ 8.785.000,00 |
| 9 | 7.000.001 - 8.000.000 | R$ 1,203 | R$ 9.624.000,00 |
| 10 | 8.000.000+ | R$ 1,151 | - |

**⚠️ COMO FUNCIONA:**
- Se você fizer **100 consultas** no mês → Faixa 2 → **95 cobradas** × R$ 1,569 = **R$ 149,06**
- Se você fizer **1.500.000 consultas** no mês → Faixa 3 → **1.499.995 cobradas** × R$ 1,517 = **R$ 2.275.492,42**

**📋 Dados Retornados:**
- `cpf` - CPF consultado (11 dígitos)
- `anoBase` - Ano-base da declaração (AAAA)
- `rendimentoTributavel` - Total de rendimentos tributáveis
- `rendimentoIsentoNaoTributavel` - Total de rendimentos isentos
- `rendimentoTributavelRecebidoDeJuridica` - Rendimentos de PJ
- `rendimentoTributavelRecebidoDeFisica` - Rendimentos de PF
- `contribuicaoPrevidenciariaOficial` - Contribuição previdenciária
- `pensaoAlimenticia` - Pensão alimentícia paga
- `impostoPago` - Imposto de renda pago
- `rendimentoExterior` - Rendimentos do exterior
- `deducoesDependentes` - Deduções com dependentes
- `totalRendimentos` - Total geral (tributáveis + isentos)
- `situacao` - Situação da declaração (REGULAR, PENDENTE, RETIFICADA, EM PROCESSAMENTO)

**💡 Uso:** Análise de crédito, due diligence, verificação de compatibilidade patrimonial, KYC

**📅 Anos Disponíveis:** Últimos 5 anos fiscais (2020-2024)

**Exemplo de Custo:**
- 10 consultas = R$ 7,85 (5 grátis + 5 pagas)
- 100 consultas = R$ 149,06 (5 grátis + 95 pagas)
- 1.000 consultas = R$ 1.561,16 (5 grátis + 995 pagas)
- 10.000 consultas = R$ 15.679,26 (5 grátis + 9.995 pagas)

---

## 4. Consulta Dívida Ativa - Contrato 261069

### Endpoint Único

**URL:** `GET /consulta-divida-ativa-df/v1/divida/{ni}`

**Modelo de Cobrança:** PROGRESSIVO/ESCALONADO

| Faixa | Volume | Preço Unitário | Custo Acumulado |
|-------|--------|----------------|-----------------|
| 1 | 1 - 999 | R$ 0,659 | R$ 658,21 |
| 2 | 1.000 - 9.999 | R$ 0,565 | R$ 5.743,21 |
| 3 | 10.000 - 49.999 | R$ 0,356 | R$ 19.983,21 |
| 4 | 50.000 - 99.999 | R$ 0,262 | R$ 33.083,21 |
| 5 | 100.000 - 249.999 | R$ 0,178 | R$ 59.783,21 |
| 6 | 250.000 - 499.999 | R$ 0,157 | R$ 99.033,21 |
| 7 | 500.000 - 999.999 | R$ 0,146 | R$ 172.033,21 |
| 8 | 1.000.000 - 1.499.999 | R$ 0,136 | R$ 240.033,21 |
| 9 | 1.500.000 - 2.999.999 | R$ 0,115 | R$ 412.533,21 |
| 10 | 3.000.000 - 4.499.999 | R$ 0,073 | R$ 522.033,21 |
| 11 | 4.500.000 - 9.999.999 | R$ 0,052 | R$ 808.533,21 |
| 12 | 10.000.000+ | R$ 0,031 | - |

**📋 Dados Retornados:**
- `ni` - CPF ou CNPJ consultado
- `nomeDevedor` - Nome do devedor
- `inscricoes` - Array com inscrições na dívida ativa:
  - `numeroInscricao` - Número da inscrição
  - `situacao` - Situação da inscrição (ATIVA, SUSPENSA, PARCELADA, EXTINTA)
  - `dataInscricao` - Data de inscrição (AAAA-MM-DD)
  - `valorConsolidado` - Valor total atualizado
  - `orgaoOrigem` - Órgão de origem do débito
  - `tipoDebito` - Tipo de débito (Tributário, Não Tributário)
  - `naturezaDebito` - Natureza do débito
  - `motivoSituacao` - Motivo da situação atual
- `totalDebito` - Somatório de todos os débitos ativos

**💡 Uso:** Due diligence, análise de risco, verificação de regularidade fiscal, compliance

**⚠️ LGPD:** Dados protegidos - requer base legal para consulta

**Observação:** Mesma tabela da Consulta CPF até faixa 11, mas faixa 12 engloba tudo acima de 10M

**Exemplo de Custo:**
- 100 consultas = R$ 65,90
- 1.000 consultas = R$ 658,21
- 10.000 consultas = R$ 5.743,21

---

## 5. Consulta CND - Contrato 261075

### Endpoint Único

**URL:** `GET /consulta-cnd/v1/certidao/{ni}`

**Modelo de Cobrança:** ⚠️ POR FAIXA DE VOLUME TOTAL (NÃO PROGRESSIVO)

| Faixa | Volume | Preço Unitário | Custo Total (Máximo) |
|-------|--------|----------------|----------------------|
| 1 | 1 - 5.000 | R$ 0,879 | R$ 4.395,00 |
| 2 | 5.001 - 10.000 | R$ 0,826 | R$ 8.260,00 |
| 3 | 10.001 - 15.000 | R$ 0,795 | R$ 11.925,00 |
| 4 | 15.001 - 30.000 | R$ 0,753 | R$ 22.590,00 |
| 5 | 30.001 - 50.000 | R$ 0,722 | R$ 36.100,00 |
| 6 | 50.001 - 75.000 | R$ 0,69 | R$ 51.750,00 |
| 7 | 75.001 - 100.000 | R$ 0,649 | R$ 64.900,00 |
| 8 | 100.001 - 500.000 | R$ 0,617 | R$ 308.500,00 |
| 9 | 500.001 - 1.000.000 | R$ 0,534 | R$ 534.000,00 |
| 10 | 1.000.001 - 2.000.000 | R$ 0,439 | R$ 878.000,00 |
| 11 | 2.000.001 - 4.000.000 | R$ 0,366 | R$ 1.464.000,00 |
| 12 | 4.000.001 - 10.000.000 | R$ 0,314 | R$ 3.140.000,00 |
| 13 | 10.000.000+ | R$ 0,251 | - |

**📋 Dados Retornados:**
- `ni` - CPF ou CNPJ consultado
- `nome` - Nome da pessoa física ou jurídica
- `situacao` - Situação da certidão:
  - POSITIVA COM EFEITO DE NEGATIVA - Há débitos mas com suspensão de exigibilidade
  - NEGATIVA - Não há débitos
  - POSITIVA - Há débitos pendentes
- `certidoes` - Array com certidões emitidas:
  - `numeroCertidao` - Número da certidão
  - `tipoCertidao` - Tipo (UNIÃO, DIVIDA_ATIVA_UNIÃO, PREVIDENCIARIA)
  - `dataEmissao` - Data de emissão (AAAA-MM-DD)
  - `dataValidade` - Data de validade (AAAA-MM-DD)
  - `codigoControle` - Código de controle para validação
  - `urlValidacao` - URL para validação online
- `observacoes` - Observações sobre a situação

**💡 Uso:** Licitações, contratações, comprovação de regularidade fiscal, análise de fornecedores

**✅ Validade:** Certidões têm validade de 180 dias

**Recursos Inclusos:** Check Time Stamp (Carimbo de Tempo) - GRATUITO

**Exemplo de Custo:**
- 3.000 consultas = R$ 2.637,00 (Faixa 1)
- 10.000 consultas = R$ 8.260,00 (Faixa 2)
- 50.000 consultas = R$ 36.100,00 (Faixa 5)
- 100.000 consultas = R$ 64.900,00 (Faixa 7)

---

## 6. Consulta Faturamento - Contrato 261073

### Endpoint Único

**URL:** `GET /consulta-faturamento/v1/faturamento/{cnpj}/{anoBase}`

**Modelo de Cobrança:** ⚠️ POR FAIXA DE VOLUME TOTAL (NÃO PROGRESSIVO)

**Consultas Gratuitas:** 5 primeiras consultas do mês

| Faixa | Volume | Preço Unitário | Custo Total (Máximo) |
|-------|--------|----------------|----------------------|
| 1 | 1 - 5 | **R$ 0,00 (GRÁTIS)** | R$ 0,00 |
| 2 | 6 - 25.000 | R$ 3,662 | R$ 91.550,00 |
| 3 | 25.001 - 50.000 | R$ 3,547 | R$ 177.350,00 |
| 4 | 50.001 - 75.000 | R$ 3,432 | R$ 257.400,00 |
| 5 | 75.001 - 100.000 | R$ 3,316 | R$ 331.600,00 |
| 6 | 100.001 - 125.000 | R$ 3,201 | R$ 400.125,00 |
| 7 | 125.001 - 150.000 | R$ 3,086 | R$ 462.900,00 |
| 8 | 150.001 - 175.000 | R$ 2,971 | R$ 519.925,00 |
| 9 | 175.001 - 200.000 | R$ 2,856 | R$ 571.200,00 |
| 10 | 200.000+ | R$ 2,741 | - |

**📋 Dados Retornados:**
- `cnpj` - CNPJ consultado
- `anoBase` - Ano-base da declaração
- `razaoSocial` - Razão social da empresa
- `faturamento` - Objeto com dados de faturamento:
  - `receitaBruta` - Receita bruta total
  - `receitaBrutaVendas` - Receita bruta de vendas
  - `receitaBrutaServicos` - Receita bruta de serviços
  - `receitaBrutaExportacao` - Receita bruta de exportação
  - `deducoes` - Deduções da receita bruta
  - `receitaLiquida` - Receita líquida (bruta - deduções)
  - `custosMercadorias` - Custos com mercadorias vendidas
  - `lucro Bruto` - Lucro bruto
  - `despesasOperacionais` - Despesas operacionais
  - `lucroOperacional` - Lucro operacional
- `situacao` - Situação da declaração (ATIVA, RETIFICADA, CANCELADA)
- `dataDeclaracao` - Data da declaração

**💡 Uso:** Análise de crédito empresarial, due diligence, verificação de capacidade financeira

**📅 Anos Disponíveis:** Dados dos últimos 5 anos fiscais

**⚠️ LGPD:** Dados empresariais - requer base legal

**Exemplo de Custo:**
- 10 consultas = R$ 18,31 (5 grátis + 5 pagas × R$ 3,662)
- 100 consultas = R$ 347,89 (5 grátis + 95 pagas × R$ 3,662)
- 1.000 consultas = R$ 3.644,71 (5 grátis + 995 pagas × R$ 3,662)
- 50.000 consultas = R$ 177.332,07 (5 grátis + 49.995 pagas × R$ 3,547)

---

## 7. Datavalid V4 - Contrato 261070

### Status: ⚠️ TABELA DE PREÇOS NÃO LOCALIZADA

**Contrato:** 261070 (V4 Mercado Privado Individual)

**Endpoint:** `POST /datavalid/v4/validate`

**Observação:** O contrato 261070 (páginas 32-33 do PDF) não contém a tabela de preços no Anexo I. As páginas apresentam apenas cláusulas de LGPD e transferência internacional de dados.

**Recursos Inclusos:** Carimbo de Tempo

**Ação Necessária:**
- Verificar páginas adicionais do contrato
- Consultar SERPRO para obter tabela de preços
- Verificar se está em outro anexo do contrato

**📋 Dados Retornados (esperados):**
- `cpf` - CPF validado
- `nome` - Nome completo
- `dataNascimento` - Data de nascimento
- `situacaoCadastral` - Situação no CPF
- `biometria` - Resultado da validação biométrica:
  - `score` - Score de similaridade (0-100%)
  - `resultado` - APROVADO, REPROVADO, INDETERMINADO
  - `confianca` - Nível de confiança
- `documentos` - Validação de documentos:
  - `cnh` - Validação CNH
  - `rg` - Validação RG
  - `tituloEleitor` - Validação Título de Eleitor
- `enderecos` - Validação de endereços
- `telefones` - Validação de telefones
- `emails` - Validação de e-mails
- `validacaoCompleta` - Score geral de validação

**💡 Uso:** KYC (Know Your Customer), onboarding digital, prevenção à fraude, abertura de contas

**🔒 Segurança:** Validação com bases oficiais do governo (TSE, DENATRAN, RFB)

**Recursos Inclusos:** Carimbo de Tempo

---

## 8. Integra Contador - Contrato 261074

### 8.1 Endpoint: Consulta

**URL:** `GET /integra-contador/v1/consulta/{ni}`

**Modelo de Cobrança:** ⚠️ POR FAIXA DE VOLUME TOTAL (NÃO PROGRESSIVO)

| Faixa | Volume | Preço Unitário | Custo Total (Máximo) |
|-------|--------|----------------|----------------------|
| 1 | 1 - 300 | R$ 0,24 | R$ 72,00 |
| 2 | 301 - 1.000 | R$ 0,21 | R$ 210,00 |
| 3 | 1.001 - 3.000 | R$ 0,18 | R$ 540,00 |
| 4 | 3.001 - 7.000 | R$ 0,16 | R$ 1.120,00 |
| 5 | 7.001 - 15.000 | R$ 0,14 | R$ 2.100,00 |
| 6 | 15.001 - 23.000 | R$ 0,11 | R$ 2.530,00 |
| 7 | 23.001 - 30.000 | R$ 0,09 | R$ 2.700,00 |
| 8 | 30.000+ | R$ 0,06 | - |

**📋 Dados Retornados:**
- `ni` - CPF ou CNPJ consultado
- `nome` - Nome da pessoa física ou jurídica
- `obrigacoesPendentes` - Array com obrigações:
  - `tipoObrigacao` - Tipo (DCTF, EFD, DIRF, etc.)
  - `periodo` - Período de apuração
  - `situacao` - Situação (PENDENTE, ENTREGUE, ATRASADA)
  - `dataVencimento` - Data de vencimento
  - `valorMulta` - Valor da multa (se em atraso)
- `regularidadeFiscal` - Status de regularidade
- `certidoesDisponiveis` - Certidões que podem ser emitidas
- `ultimaAtualizacao` - Data da última atualização

**💡 Uso:** Plataformas contábeis, ERPs, compliance fiscal, automação contábil

**Operação:** Consulta de dados para serviços contábeis

**Exemplo de Custo:**
- 100 consultas = R$ 24,00 (Faixa 1)
- 1.000 consultas = R$ 210,00 (Faixa 2)
- 10.000 consultas = R$ 1.400,00 (Faixa 5)

---

### 8.2 Endpoint: Declaração

**URL:** `POST /integra-contador/v1/declaracao`

**Modelo de Cobrança:** ⚠️ POR FAIXA DE VOLUME TOTAL (NÃO PROGRESSIVO)

| Faixa | Volume | Preço Unitário | Custo Total (Máximo) |
|-------|--------|----------------|----------------------|
| 1 | 1 - 100 | R$ 0,40 | R$ 40,00 |
| 2 | 101 - 500 | R$ 0,36 | R$ 180,00 |
| 3 | 501 - 1.000 | R$ 0,32 | R$ 320,00 |
| 4 | 1.001 - 3.000 | R$ 0,28 | R$ 840,00 |
| 5 | 3.001 - 5.000 | R$ 0,24 | R$ 1.200,00 |
| 6 | 5.001 - 8.000 | R$ 0,20 | R$ 1.600,00 |
| 7 | 8.001 - 10.000 | R$ 0,16 | R$ 1.600,00 |
| 8 | 10.000+ | R$ 0,12 | - |

**📋 Dados de Entrada e Retorno:**

**Envio (POST):**
- `tipoDeclaracao` - Tipo (DCTF, EFD-Contribuições, etc.)
- `periodo` - Período de apuração
- `cnpj` - CNPJ declarante
- `dados` - XML ou JSON com dados da declaração
- `certificadoDigital` - Assinatura digital (opcional)

**Retorno:**
- `protocolo` - Número do protocolo de envio
- `dataRecebimento` - Data/hora de recebimento
- `situacao` - Situação (RECEBIDA, PROCESSANDO, PROCESSADA, ERRO)
- `recibo` - Recibo de entrega
- `erros` - Array com erros de validação (se houver)
- `avisos` - Array com avisos
- `hash` - Hash da declaração para auditoria

**💡 Uso:** Transmissão automatizada de declarações fiscais

**Operação:** Envio de declarações

**Exemplo de Custo:**
- 50 declarações = R$ 20,00 (Faixa 1)
- 500 declarações = R$ 180,00 (Faixa 2)
- 5.000 declarações = R$ 1.200,00 (Faixa 5)

---

### 8.3 Endpoint: Emissão

**URL:** `POST /integra-contador/v1/emissao`

**Modelo de Cobrança:** ⚠️ POR FAIXA DE VOLUME TOTAL (NÃO PROGRESSIVO)

| Faixa | Volume | Preço Unitário | Custo Total (Máximo) |
|-------|--------|----------------|----------------------|
| 1 | 1 - 500 | R$ 0,32 | R$ 160,00 |
| 2 | 501 - 5.000 | R$ 0,29 | R$ 1.450,00 |
| 3 | 5.001 - 10.000 | R$ 0,26 | R$ 2.600,00 |
| 4 | 10.001 - 15.000 | R$ 0,22 | R$ 3.300,00 |
| 5 | 15.001 - 25.000 | R$ 0,19 | R$ 4.750,00 |
| 6 | 25.001 - 35.000 | R$ 0,16 | R$ 5.600,00 |
| 7 | 35.001 - 50.000 | R$ 0,12 | R$ 6.000,00 |
| 8 | 50.000+ | R$ 0,08 | - |

**📋 Dados de Entrada e Retorno:**

**Envio (POST):**
- `tipoDocumento` - Tipo (DARF, GPS, DAS, etc.)
- `ni` - CPF ou CNPJ
- `periodo` - Período de apuração
- `valorPrincipal` - Valor principal
- `valorMulta` - Valor da multa (se houver)
- `valorJuros` - Valor de juros (se houver)
- `codigoReceita` - Código da receita

**Retorno:**
- `codigoBarras` - Código de barras para pagamento
- `linhaDigitavel` - Linha digitável
- `qrCode` - QR Code (base64 ou URL)
- `dataVencimento` - Data de vencimento
- `valorTotal` - Valor total a pagar
- `pdf` - PDF do documento (base64 ou URL)
- `protocolo` - Protocolo de emissão
- `hash` - Hash do documento para validação

**💡 Uso:** Geração automatizada de guias de pagamento

**Operação:** Emissão de documentos

**Exemplo de Custo:**
- 100 emissões = R$ 32,00 (Faixa 1)
- 1.000 emissões = R$ 290,00 (Faixa 2)
- 10.000 emissões = R$ 2.600,00 (Faixa 3)

---

## 9. Raiz Tech - Pastagens Degradadas - Contrato 261072

### Endpoint Único

**URL:** `GET /raiz-tech-pastagens/v1/pastagens/{coordenadas}`

**Modelo de Cobrança:** ⚠️ POR FAIXA DE VOLUME TOTAL (NÃO PROGRESSIVO)

| Faixa | Volume | Preço Unitário | Custo Total (Máximo) |
|-------|--------|----------------|----------------------|
| 1 | 1 - 5.000 | R$ 3,50 | R$ 17.500,00 |
| 2 | 5.001 - 10.000 | R$ 3,32 | R$ 33.200,00 |
| 3 | 10.001 - 50.000 | R$ 3,15 | R$ 157.500,00 |
| 4 | 50.001 - 120.000 | R$ 2,97 | R$ 356.400,00 |
| 5 | 120.001 - 180.000 | R$ 2,80 | R$ 504.000,00 |
| 6 | 180.000+ | R$ 2,62 | - |

**📋 Dados de Entrada e Retorno:**

**Entrada:**
- `latitude` - Latitude do ponto de análise
- `longitude` - Longitude do ponto de análise
- `area` - Área em hectares (opcional)
- `dataReferencia` - Data de referência para análise

**Retorno:**
- `coordenadas` - Coordenadas analisadas (lat/long)
- `nivelDegradacao` - Nível de degradação:
  - BAIXO - 0-30%
  - MODERADO - 31-60%
  - ALTO - 61-85%
  - SEVERO - 86-100%
- `percentualDegradacao` - Percentual exato (0-100%)
- `areaDegradada` - Área degradada em hectares
- `biomassa` - Estimativa de biomassa
- `indiceSaude` - Índice de saúde da pastagem (NDVI)
- `recomendacoes` - Array com recomendações:
  - `acao` - Ação recomendada (RECUPERACAO, REFORMA, MANUTENCAO)
  - `prioridade` - Prioridade (ALTA, MEDIA, BAIXA)
  - `descricao` - Descrição da recomendação
- `historicoAnalises` - Histórico de análises anteriores
- `imagemSatelite` - URL da imagem de satélite
- `dataAnalise` - Data da análise

**💡 Uso:** Gestão de propriedades rurais, compliance ambiental, crédito rural, sustentabilidade

**🌱 Tecnologia:** Análise por imagens de satélite (NDVI - Índice de Vegetação)

**Exemplo de Custo:**
- 100 consultas = R$ 350,00 (Faixa 1)
- 1.000 consultas = R$ 3.500,00 (Faixa 1)
- 10.000 consultas = R$ 33.200,00 (Faixa 2)
- 100.000 consultas = R$ 297.000,00 (Faixa 4)

---

## 📊 Resumo Comparativo de Preços (Faixa 1 / Menor Volume)

| API | Endpoint | Preço Inicial | Modelo | Grátis |
|-----|----------|---------------|--------|--------|
| **Consulta CPF** | `/cpf/{cpf}` | R$ 0,659 | Progressivo | Não |
| **CNPJ Básica** | `/basica/{cnpj}` | R$ 0,659 | Progressivo | Não |
| **CNPJ QSA** | `/qsa/{cnpj}` | R$ 0,868 | Progressivo | Não |
| **CNPJ Empresa** | `/empresa/{cnpj}` | R$ 1,172 | Progressivo | Não |
| **Consulta Renda** | `/renda/{cpf}/{ano}` | R$ 1,569 | Por Faixa | 5 consultas |
| **Dívida Ativa** | `/divida/{ni}` | R$ 0,659 | Progressivo | Não |
| **CND** | `/certidao/{ni}` | R$ 0,879 | Por Faixa | Não |
| **Faturamento** | `/faturamento/{cnpj}/{ano}` | R$ 3,662 | Por Faixa | 5 consultas |
| **Datavalid V4** | `/validate` | *N/D* | - | - |
| **Integra - Consulta** | `/consulta/{ni}` | R$ 0,240 | Por Faixa | Não |
| **Integra - Declaração** | `/declaracao` | R$ 0,400 | Por Faixa | Não |
| **Integra - Emissão** | `/emissao` | R$ 0,320 | Por Faixa | Não |
| **Raiz Tech** | `/pastagens/{coords}` | R$ 3,500 | Por Faixa | Não |

---

## 💰 Análise de Custo para 10.000 Consultas

| API/Endpoint | Custo Total | Custo Médio/Consulta | Modelo |
|--------------|-------------|----------------------|--------|
| **Integra - Consulta** | R$ 1.400,00 | R$ 0,140 | Por Faixa (Faixa 5) |
| **Consulta CPF** | R$ 5.743,21 | R$ 0,574 | Progressivo |
| **Dívida Ativa** | R$ 5.743,21 | R$ 0,574 | Progressivo |
| **CNPJ Básica** | R$ 5.743,21 | R$ 0,574 | Progressivo |
| **CNPJ QSA** | R$ 7.553,73 | R$ 0,755 | Progressivo |
| **CND** | R$ 8.260,00 | R$ 0,826 | Por Faixa (Faixa 2) |
| **CNPJ Empresa** | R$ 10.305,83 | R$ 1,031 | Progressivo |
| **Integra - Emissão** | R$ 2.600,00 | R$ 0,260 | Por Faixa (Faixa 3) |
| **Consulta Renda** | R$ 15.679,26 | R$ 1,568 | Por Faixa (Faixa 2) |
| **Raiz Tech** | R$ 33.200,00 | R$ 3,320 | Por Faixa (Faixa 2) |

**Mais Econômica:** Integra Contador - Consulta (R$ 0,14/consulta)
**Mais Cara:** Raiz Tech Pastagens (R$ 3,32/consulta)

---

## 🎁 APIs com Consultas Gratuitas

Apenas **2 APIs** oferecem consultas gratuitas:

1. **Consulta Renda** - 5 consultas grátis/mês
2. **Consulta Faturamento** - 5 consultas grátis/mês

Todas as demais APIs cobram desde a primeira consulta.

---

## ⚙️ Modelos de Cobrança

### Modelo Progressivo/Escalonado (5 APIs)
Cada faixa tem seu preço. Mais econômico para alto volume.

**APIs:**
- Consulta CPF
- Consulta CNPJ (3 endpoints)
- Consulta Dívida Ativa

**Exemplo:** 15.000 consultas CPF
```
Faixa 1:    999 × R$ 0,659 = R$ 658,36
Faixa 2:  9.000 × R$ 0,565 = R$ 5.085,00
Faixa 3:  5.001 × R$ 0,356 = R$ 1.780,36
TOTAL: R$ 7.523,72 (média R$ 0,50/consulta)
```

### Modelo Por Faixa de Volume Total (4 APIs + 3 endpoints)
Preço único baseado no volume total do mês.

**APIs:**
- Consulta Renda
- Consulta CND
- Consulta Faturamento
- Integra Contador (3 endpoints)
- Raiz Tech Pastagens

**Exemplo:** 15.000 consultas CND
```
Volume total: 15.000 consultas
Faixa aplicável: Faixa 3 (10.001-15.000)
Preço unitário: R$ 0,795
TOTAL: 15.000 × R$ 0,795 = R$ 11.925,00 (média R$ 0,795/consulta)
```

---

## 📌 Recursos Gratuitos Inclusos

### Check Time Stamp (Carimbo de Tempo)

**Disponível em:**
- ✅ Consulta CPF
- ✅ Consulta CNPJ (3 endpoints)
- ✅ Consulta CND
- ✅ Datavalid V4

**Como usar:** Adicionar header `x-signature: 1`

**Valor:** GRATUITO (sem custo adicional)

**Benefício:** Validade jurídica da consulta com timestamp certificado pela ICP-Brasil

---

### X-Request-Tag (Identificador de Requisição)

**Disponível em:** TODAS as APIs

**Como usar:** Adicionar header `X-Request-Tag: IDENTIFICADOR` (máx 32 chars)

**Valor:** GRATUITO (sem custo adicional)

**Benefício:** Agrupamento de consultas no faturamento para rateio de custos

---

## 🔍 Total de Endpoints Contratados

| Categoria | Quantidade | Endpoints |
|-----------|------------|-----------|
| **Consultas Cadastrais** | 6 | CPF (1) + CNPJ (3) + CND (1) + Dívida Ativa (1) |
| **Consultas Fiscais** | 2 | Renda (1) + Faturamento (1) |
| **Validação** | 1 | Datavalid (1) |
| **Serviços Contábeis** | 3 | Integra Contador (3) |
| **Agronegócio** | 1 | Raiz Tech (1) |
| **TOTAL** | **14 endpoints** | Distribuídos em 9 contratos |

---

## 📞 Contato e Suporte

**SERPRO - Atendimento ao Cliente**
📧 E-mail: css.serpro@serpro.gov.br
📞 Telefone: 0800 728 2323
🕐 Horário: Segunda a Sexta, 7h às 19h (Brasília)

**Canais Online:**
- Loja SERPRO: https://loja.serpro.gov.br
- API Center: https://apicenter.estaleiro.serpro.gov.br
- Gestão de Chaves: https://loja.serpro.gov.br (acesso com e-CNPJ)

---

**Documento gerado em:** 06/12/2025
**Última atualização:** 06/12/2025
**Versão:** 1.0
**Total de páginas:** Este relatório consolidado

---

## 📝 Notas Importantes

1. **Bilhetagem:** Consultas com retorno 200, 206 e 404 são cobradas. Erros 4xx e 5xx não são cobrados.

2. **Datavalid V4:** Tabela de preços não localizada no contrato. Necessário consultar SERPRO.

3. **Ambiente Trial:** Todas as APIs possuem ambiente de testes gratuito com dados fictícios.

4. **LGPD:** Consultas de CPF, Renda e CNPJ envolvem dados pessoais protegidos. Consulte seu DPO.

5. **Validade dos Preços:** Conforme contratos vigentes até 28/11/2030.

6. **Reajustes:** Valores podem ser reajustados conforme cláusulas contratuais.

---

## 10. Serasa - Relatório Avançado PF

### Informações Gerais

**Fornecedor:** Serasa Experian
**Tipo:** Plataforma Web (não é API REST)
**Acesso:** Via interface web
**Fonte:** Proposta Comercial Serasa Experian

### Modelo de Cobrança: PACOTE MENSAL COM VOLUME FIXO

**Opção 1 - R$ 3.554,00/mês**

| Volume | Preço Original | Desconto | Preço Final | Custo Total |
|--------|----------------|----------|-------------|-------------|
| 380 consultas | R$ 18,66 | 50% | **R$ 9,33** | R$ 3.545,40 |

**Opção 2 - R$ 4.736,00/mês**

| Volume | Preço Original | Desconto | Preço Final | Custo Total |
|--------|----------------|----------|-------------|-------------|
| 538 consultas | R$ 17,59 | 50% | **R$ 8,80** | R$ 4.734,40 |

### 📋 Dados Retornados:

**Identificação e Cadastro:**
- `cpf` - CPF (11 dígitos)
- `nome` - Nome completo
- `data_nascimento` - Data de nascimento
- `nome_mae` - Nome da mãe
- `situacao_cpf` - Situação do documento (REGULAR, SUSPENSA, FALECIDO)

**Endereço e Contato:**
- `endereco_completo` - Logradouro, número, bairro, cidade, UF, CEP
- `telefone_residencial` - Telefone fixo
- `telefone_comercial` - Telefone comercial
- `telefone_celular` - Celular

**Participação Societária:**
- `participacao_empresas` - Lista de CNPJs onde é sócio/administrador

**Anotações Negativas (Pefin/Refin):**
- `pendencias_internas` - Dívidas comerciais (Pefin)
- `pendencias_financeiras` - Dívidas bancárias (Refin)
- `quantidade`, `valor`, `ultimo_registro` - Detalhes das pendências

**Cheques:**
- `cheques_sem_fundo_bacen` - Cheques devolvidos por insuficiência de fundos
- `cheques_cancelados` - Cheques cancelados
- `cheques_extraviados` - Cheques roubados, furtados ou extraviados

**Protestos:**
- `protestos_nacionais` - Protestos em cartórios de todo Brasil
- `data`, `valor`, `cartorio`, `cidade_uf` - Detalhes do protesto

**Ações Judiciais:**
- `acoes_judiciais` - Ações cíveis e trabalhistas
- Tipo, vara, comarca

**Participação em Empresas Falidas:**
- `participacao_falencias` - Empresas falidas onde é/foi sócio

**Consultas à Serasa:**
- `consultas_realizadas` - Histórico de consultas ao CPF
- `total_consultas_credito` - Total de consultas de crédito
- `total_consultas_cheque` - Total de consultas de cheque
- Períodos: últimos 15, 16-30, 31-60, 61-90 dias

**Score e Comportamento:**
- `serasa_score` - Score de 0 a 1000
- `probabilidade_pagamento` - % de chance de pagamento
- `historico_pagamento_pf` - Dados do Cadastro Positivo

**Renda Estimada:**
- `renda_mensal_estimada` - Faixa de renda (R$ 0 a R$ 1.000, R$ 1.000 a R$ 3.000, etc.)
- Baseada em modelos estatísticos da Serasa

**Documentos Roubados/Furtados:**
- `documentos_roubados_furtados_extraviados` - Ocorrências registradas

**Metadados:**
- `protocolo_consulta` - Número do protocolo para auditoria
- `data_consulta` - Data e hora da consulta
- `data_ultima_atualizacao_cadastral` - Última atualização dos dados

**💡 Uso:** Análise de crédito completa, concessão de empréstimos, vendas parceladas, prevenção de fraudes

**⚠️ LGPD:** Dados pessoais sensíveis protegidos pela LGPD. Requer base legal e finalidade legítima.

**📌 Observações:**
- Primeiro pagamento: 30 dias após contratação
- Desconto de 50% promocional
- Consultas não utilizadas no mês não acumulam
- Protocolo de consulta disponível para auditoria

---

## 11. Serasa - Relatório Avançado PJ

### Informações Gerais

**Fornecedor:** Serasa Experian
**Tipo:** Plataforma Web (não é API REST)
**Acesso:** Via interface web
**Fonte:** Proposta Comercial Serasa Experian

### Modelo de Cobrança: PACOTE MENSAL COM VOLUME FIXO

**Opção 1 - R$ 3.554,00/mês**

| Volume | Preço Original | Desconto | Preço Final | Custo Total |
|--------|----------------|----------|-------------|-------------|
| 247 consultas | R$ 28,74 | 50% | **R$ 14,37** | R$ 3.549,39 |

**Opção 2 - R$ 4.736,00/mês**

| Volume | Preço Original | Desconto | Preço Final | Custo Total |
|--------|----------------|----------|-------------|-------------|
| 349 consultas | R$ 27,08 | 50% | **R$ 13,54** | R$ 4.725,46 |

### 📋 Dados Retornados:

**Identificação e Cadastro:**
- `cnpj` - CNPJ (14 dígitos)
- `razao_social` - Razão social
- `nome_fantasia` - Nome fantasia
- `situacao_cnpj` - Situação (ATIVA, BAIXADA, SUSPENSA, INAPTA, NULA)
- `data_abertura` - Data de início das atividades
- `tipo_sociedade` - Tipo societário

**Endereço e Contato:**
- `endereco_completo` - Logradouro, número, bairro, cidade, UF, CEP
- `telefone` - Telefone(s) da empresa
- `site` - Website (quando disponível)

**Atividade Econômica:**
- `cnae_principal` - CNAE principal
- `ramo_atividade` - Descrição do ramo
- `codigo_atividade_serasa` - Código interno Serasa

**Filiais:**
- `numero_filiais` - Quantidade de filiais
- `consultar_filiais` - Link para detalhes (se disponível)

**Quadro Social e Administrativo (QSA):**
- `socios` - Array com sócios:
  - `cpf_cnpj_socio` - **CPF COMPLETO** (11 dígitos) ou CNPJ
  - `nome` - Nome do sócio
  - `qualificacao` - Cargo (Sócio-Administrador, Sócio, Diretor, etc.)
  - `participacao` - % de participação societária
  - `entrada` - Data de entrada na sociedade
  - `nacionalidade` - Nacionalidade
  - `pais_origem` - País de origem (quando estrangeiro)

- `administradores` - Array com administradores:
  - `cpf` - **CPF COMPLETO** do administrador
  - `nome` - Nome completo
  - `cargo` - Cargo administrativo
  - `estado_civil` - Estado civil
  - `data_entrada` - Data de início do mandato
  - `mandato` - Período do mandato (quando aplicável)

**Capital Social:**
- `capital_social` - Valor do capital social
- `capital_realizado` - Capital integralizado

**Anotações Negativas:**
- `protestos_nacionais` - Protestos em cartórios de todo Brasil
  - `data`, `valor`, `cartorio`, `cidade_uf`

- `dividas_vencidas` - Dívidas em aberto
  - Valor, credor, período

- `acoes_judiciais` - Ações judiciais
  - Tipo, vara, comarca, valor da causa

**Falência e Recuperação:**
- `recuperacao_judicial` - Situação de recuperação judicial
  - Status, data, vara

- `falencia` - Situação de falência
  - Status, data, vara

- `participacao_falencias` - Participação dos sócios em outras empresas falidas

**Cheques:**
- `cheques_sem_fundo` - Cheques devolvidos
- `cheques_cancelados` - Cheques cancelados
- `cheques_extraviados` - Cheques extraviados/roubados

**Consultas à Serasa:**
- `consultas_realizadas` - Histórico de consultas ao CNPJ
- Períodos: 0-15, 16-30, 31-60, 61-90 dias
- `razao_social_consultante` - Quem consultou

**Score e Limite:**
- `serasa_score_pj` - Score empresarial (0-1000)
- `probabilidade_pagamento` - % de chance de inadimplência
- `limite_credito_sugerido` - Sugestão de limite de crédito baseado em análise de risco
- `historico_positivo_comercial` - Dados de pagamentos em dia

**Perfil Financeiro (quando disponível):**
- `balanco_patrimonial` - Dados do balanço
- `demonstrativo_financeiro` - Tipo (Balanço, Simples, etc.)
- `valor_milhares_reais` - Valores em milhares
- `ativo_total` - Total do ativo
- `passivo_total` - Total do passivo
- `patrimonio_liquido` - Patrimônio líquido
- `resultado_exercicio` - Lucro ou prejuízo
- `data_balanco` - Data de referência do balanço
- `padrao_contabil` - Padrão contábil usado (BR GAAP, etc.)

**Índices Econômico-Financeiros:**
- `endividamento_total` - % de endividamento
- `liquidez_corrente` - Índice de liquidez
- `rentabilidade_capital` - % de rentabilidade
- `rentabilidade_vendas` - Margem líquida
- `variacao_vendas` - Crescimento de vendas

**Alertas e Inconsistências:**
- `alerta_inconsistencias_comerciais` - Alertas de comportamento atípico
- `alerta_identidade_pj` - Suspeitas de fraude
- `alerta_obito` - Sócios falecidos com participação ativa
- `vendas_com_cartao` - Informações de vendas com cartão

**Informações Adicionais:**
- `registro_junta_comercial` - Número do registro
- `registro_realizado_em` - Data do registro
- `nire` - NIRE (Número de Identificação do Registro de Empresa)
- `numero_funcionarios` - Quantidade de funcionários (estimativa)
- `opcao_tributaria` - Regime tributário (Simples, Presumido, Real)

**Metadados:**
- `protocolo_consulta` - Número do protocolo para auditoria
- `data_consulta` - Data e hora da consulta
- `informacao_atualizada_em` - Data da última atualização dos dados

**💡 Uso:** Análise de crédito B2B, due diligence, homologação de fornecedores, verificação de parceiros comerciais, investigação empresarial

**⚠️ LGPD:** Contém CPF completo dos sócios e administradores. Dados pessoais protegidos pela LGPD.

**📌 Observações:**
- Primeiro pagamento: 30 dias após contratação
- Desconto de 50% promocional
- Consultas não utilizadas no mês não acumulam
- Protocolo de consulta disponível para auditoria
- Dados financeiros disponíveis apenas para empresas com demonstrativo público

---

## 📊 Resumo Comparativo SERPRO vs Serasa

| Característica | APIs SERPRO | Serasa Experian |
|----------------|-------------|-----------------|
| **Tipo de Acesso** | API REST (OAuth2) | Plataforma Web |
| **Autenticação** | Bearer Token | Login web |
| **Integração** | ✅ Automatizada | ❌ Manual (interface) |
| **Formato Resposta** | JSON | HTML/PDF |
| **Dados de Origem** | Governo Federal | Bureau de Crédito Privado |
| **CPF** | ✅ (R$ 0,659 - R$ 0,017) | ✅ (R$ 8,80 - R$ 9,33) |
| **CNPJ** | ✅ (R$ 0,659 - R$ 1,172) | ✅ (R$ 13,54 - R$ 14,37) |
| **Renda** | ✅ Oficial (IRPF) | ✅ Estimada (modelo) |
| **Score** | ❌ | ✅ Serasa Score |
| **Histórico Crédito** | ❌ | ✅ Cadastro Positivo |
| **Protestos** | ✅ (via Dívida Ativa) | ✅ Todos os cartórios |
| **Ações Judiciais** | ❌ | ✅ |
| **Cheques** | ❌ | ✅ |
| **Modelo de Preço** | Progressivo/Volume Total | Pacote Mensal Fixo |
| **Carimbo de Tempo** | ✅ Gratuito (ICP-Brasil) | ❌ |

### Complementaridade

As APIs SERPRO e Serasa Experian são **complementares**:

- **SERPRO:** Dados oficiais do governo (CPF, CNPJ, Renda declarada, dívidas federais)
- **Serasa:** Dados de mercado (score, histórico de crédito, protestos, cheques, comportamento)

**Recomendação:** Usar ambas para análise completa de crédito e due diligence.

---

## 📝 Observações Finais

1. **Modelo de Preços Serasa:** Pacote mensal com volume fixo (não progressivo como SERPRO)

2. **Desconto Promocional:** 50% de desconto na proposta Serasa (válido para contratação imediata)

3. **Datavalid V4:** Tabela de preços não localizada no contrato. Necessário consultar SERPRO.

4. **Ambiente Trial:** Todas as APIs SERPRO possuem ambiente de testes gratuito com dados fictícios. Serasa não oferece trial.

5. **LGPD:** Consultas de CPF, Renda e CNPJ (ambos fornecedores) envolvem dados pessoais protegidos. Consulte seu DPO.

6. **Validade dos Preços SERPRO:** Conforme contratos vigentes até 28/11/2030.

7. **Validade da Proposta Serasa:** Verificar prazo de validade com o fornecedor.

8. **Reajustes:** Valores podem ser reajustados conforme cláusulas contratuais.

---

## 12. JusBrasil - Consulta PRO

### Informações Gerais

**Fornecedor:** JusBrasil
**Produto:** Background Check API - Consulta PRO
**Tipo de API:** REST/JSON
**Autenticação:** API Key (header)
**Base URL:** `https://api.jusbrasil.com.br/background-check/`

### Modelo de Cobrança: PAY-PER-CALL

| Item | Valor |
|------|-------|
| **Preço por Chamada** | R$ 4,00 |
| **Consumo Mínimo Mensal** | R$ 1.000,00 |
| **Equivalente em Consultas Mínimas** | 250 consultas/mês |

### Simulação de Volumes

| Volume Mensal | Custo Total | Custo Unitário |
|---------------|-------------|----------------|
| 250 consultas (mínimo) | R$ 1.000,00 | R$ 4,00 |
| 500 consultas | R$ 2.000,00 | R$ 4,00 |
| 1.000 consultas | R$ 4.000,00 | R$ 4,00 |
| 2.500 consultas | R$ 10.000,00 | R$ 4,00 |
| 5.000 consultas | R$ 20.000,00 | R$ 4,00 |

### Endpoints Disponíveis

Todos os endpoints custam **R$ 4,00 por chamada**:

| Endpoint | Método | Descrição | Custo |
|----------|--------|-----------|-------|
| `/lawsuits/criminal` | POST | Processos Criminais | R$ 4,00 |
| `/lawsuits/civil` | POST | Processos Civis | R$ 4,00 |
| `/lawsuits/trabalhista` | POST | Processos Trabalhistas | R$ 4,00 |
| `/mp` | POST | Registros Ministério Público | R$ 4,00 |
| `/bnmp` | POST | Mandados de Prisão (BNMP) | R$ 4,00 |
| `/empregador-irregular` | POST | Empregadores Irregulares | R$ 4,00 |
| `/consulta-em-lote` | POST | Upload Lote (até 3.000 CPFs) | R$ 4,00 por CPF |
| `/consulta-em-lote/` | GET | Listar Lotes | Gratuito |
| `/consulta-em-lote/download/<id>` | GET | Download Resultado | Gratuito |

### Características Principais

✅ **Paginação:** Cursor-based (requisições de paginação não cobram adicional)
✅ **Batch Processing:** Até 3.000 CPFs por lote via CSV
✅ **Níveis de Confiança:** ALTA, MEDIA, BAIXA para associação ao CPF
✅ **Limite Padrão:** 100 processos por requisição
✅ **Tempo de Processamento Batch:** ~30 minutos
✅ **Ambientes:** Production e Sandbox

### Funcionalidades Incluídas (Sem Custo Adicional)

- Paginação ilimitada (mesma consulta)
- Sistema de confiança (confidence levels)
- Consulta em lote (batch processing)
- API Key management
- Ambiente Sandbox para testes

### Exemplo de Custo - Background Check Completo

**Cenário:** Verificar 1 candidato consultando 4 tipos de processo

| Consulta | Custo |
|----------|-------|
| Processos Criminais | R$ 4,00 |
| Processos Civis | R$ 4,00 |
| Processos Trabalhistas | R$ 4,00 |
| BNMP (Mandados de Prisão) | R$ 4,00 |
| **Total por candidato** | **R$ 16,00** |

**Para 80 candidatos/mês:** 80 × R$ 16,00 = **R$ 1.280,00/mês**

### Dados Retornados

Para cada processo, a API retorna:

- Número do processo (CNJ)
- Tribunal e tipo (criminal, civil, trabalhista)
- Nível de confiança (ALTA/MEDIA/BAIXA)
- Status do processo (ativo, arquivado, suspenso)
- Partes envolvidas (autor, réu, etc.)
- Tipificação CNJ e legislação aplicada
- Valor da causa
- Datas (distribuição, última movimentação)
- Movimentações processuais
- Processos relacionados
- Advogados das partes

### Observações Importantes

1. **Consumo Mínimo Obrigatório:** R$ 1.000,00/mês (250 consultas)
2. **Paginação Não Cobra:** Buscar páginas adicionais da mesma consulta não gera custo extra
3. **Batch = Soma de CPFs:** Consulta em lote cobra R$ 4,00 por cada CPF no CSV
4. **Endpoints Gratuitos:** GET /consulta-em-lote/ e download não cobram
5. **Dados Públicos:** Processos judiciais são dados públicos (Art. 11 CPC)
6. **LGPD:** Requer conformidade com LGPD (bases legais: Art. 7º, VI ou IX)

### Comparativo com Outras Plataformas

| Critério | JusBrasil | SERPRO CPF | Serasa Avançado PF |
|----------|-----------|------------|-------------------|
| **Tipo de Dados** | Processos judiciais | Dados cadastrais RF | Score + protestos + dívidas |
| **Preço/Consulta** | R$ 4,00 | R$ 0,08 - R$ 0,66 | R$ 8,80 - R$ 9,33 |
| **Consumo Mínimo** | R$ 1.000/mês | Não há | R$ 3.554/mês |
| **Modelo** | Pay-per-call fixo | Escalonado | Pacote mensal |
| **Uso Ideal** | Background check judicial | Validação CPF | Análise crédito |

### Documentação Completa

📄 **RELATORIO_JUSBRASIL_COMPLETO.md** - Documentação técnica detalhada com:
- Exemplos de código (Python, Node.js, PHP)
- Estruturas JSON completas
- Casos de uso detalhados
- Guia de conformidade LGPD
- Troubleshooting e boas práticas

---

**FIM DO RELATÓRIO**
