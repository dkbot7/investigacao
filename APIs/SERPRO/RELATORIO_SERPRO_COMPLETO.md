# Relatório Completo - APIs SERPRO

📅 **Data:** 06/12/2025
🏢 **Contratante:** INVESTIR ITAPEMA LTDA (CNPJ 29.814.517/0001-04)
📊 **Total de APIs:** 9 APIs SERPRO contratadas
📄 **Fonte:** Contratos oficiais SERPRO (Anexo I de cada contrato)
🔗 **Fornecedor:** Serviço Federal de Processamento de Dados (SERPRO)

---

## 📌 Índice

1. [Consulta CPF](#1-consulta-cpf---contrato-260005)
2. [Consulta CNPJ](#2-consulta-cnpj---contrato-260009)
3. [Consulta Renda](#3-consulta-renda---contratos-260008--261071)
4. [Consulta Dívida Ativa](#4-consulta-dívida-ativa---contrato-261069)
5. [Consulta CND](#5-consulta-cnd---contrato-261075)
6. [Consulta Faturamento](#6-consulta-faturamento---contrato-261073)
7. [Datavalid V4](#7-datavalid-v4---contrato-261070)
8. [Integra Contador](#8-integra-contador---contrato-261074)
9. [Raiz Tech - Pastagens Degradadas](#9-raiz-tech---pastagens-degradadas---contrato-261072)

---

## 1. Consulta CPF - Contrato 260005

### Endpoint Único

**URL:** `GET /consulta-cpf-df/v2/cpf/{cpf}`

**Modelo de Cobrança:** PROGRESSIVO/ESCALONADO

| Faixa | Volume | Preço Unitário | Custo Acumulado (até o final da faixa) |
|-------|--------|----------------|----------------------------------------|
| 1 | 1 - 999 | R$ 0,6590 | R$ 658,36 |
| 2 | 1.000 - 9.999 | R$ 0,5650 | R$ 5.743,21 |
| 3 | 10.000 - 49.999 | R$ 0,3560 | R$ 19.983,21 |
| 4 | 50.000 - 99.999 | R$ 0,2620 | R$ 33.083,21 |
| 5 | 100.000 - 249.999 | R$ 0,1780 | R$ 59.783,21 |
| 6 | 250.000 - 499.999 | R$ 0,1570 | R$ 99.033,21 |
| 7 | 500.000 - 999.999 | R$ 0,1460 | R$ 172.033,21 |
| 8 | 1.000.000 - 1.499.999 | R$ 0,1360 | R$ 240.033,21 |
| 9 | 1.500.000 - 2.999.999 | R$ 0,1150 | R$ 412.533,21 |
| 10 | 3.000.000 - 4.499.999 | R$ 0,0730 | R$ 522.033,21 |
| 11 | 4.500.000 - 9.999.999 | R$ 0,0520 | R$ 808.533,21 |
| 12 | 10.000.000 - 16.999.999 | R$ 0,0310 | R$ 1.025.533,21 |
| 13 | 17.000.000 - 19.999.999 | R$ 0,0260 | R$ 1.103.533,21 |
| 14 | 20.000.000 - 24.999.999 | R$ 0,0230 | R$ 1.218.533,21 |
| 15 | 25.000.000 - 29.999.999 | R$ 0,0200 | R$ 1.318.533,21 |
| 16 | 30.000.000+ | R$ 0,0170 | - |

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
| 1 | 1 - 999 | R$ 0,6590 | R$ 658,21 |
| 2 | 1.000 - 9.999 | R$ 0,5650 | R$ 5.743,21 |
| 3 | 10.000 - 49.999 | R$ 0,3560 | R$ 19.983,21 |
| 4 | 50.000 - 99.999 | R$ 0,2620 | R$ 33.083,21 |
| 5 | 100.000 - 249.999 | R$ 0,1780 | R$ 59.783,21 |
| 6 | 250.000 - 499.999 | R$ 0,1570 | R$ 99.033,21 |
| 7 | 500.000 - 999.999 | R$ 0,1460 | R$ 172.033,21 |
| 8 | 1.000.000 - 1.499.999 | R$ 0,1360 | R$ 240.033,21 |
| 9 | 1.500.000 - 2.999.999 | R$ 0,1150 | R$ 412.533,21 |
| 10 | 3.000.000 - 4.999.999 | R$ 0,0700 | R$ 552.533,21 |
| 11 | 5.000.000 - 6.999.999 | R$ 0,0600 | R$ 672.533,21 |
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
| 8 | 1.000.000 - 1.499.999 | R$ 0,2200 | R$ 445.943,73 |
| 9 | 1.500.000 - 2.999.999 | R$ 0,1780 | R$ 712.943,73 |
| 10 | 3.000.000 - 4.999.999 | R$ 0,1300 | R$ 972.943,73 |
| 11 | 5.000.000 - 6.999.999 | R$ 0,1200 | R$ 1.212.943,73 |
| 12 | 7.000.000 - 9.999.999 | R$ 0,1100 | R$ 1.542.943,73 |
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
| 3 | 10.000 - 49.999 | R$ 0,8260 | R$ 43.345,83 |
| 4 | 50.000 - 99.999 | R$ 0,7010 | R$ 78.395,83 |
| 5 | 100.000 - 249.999 | R$ 0,5650 | R$ 163.145,83 |
| 6 | 250.000 - 499.999 | R$ 0,4710 | R$ 280.895,83 |
| 7 | 500.000 - 999.999 | R$ 0,3980 | R$ 479.895,83 |
| 8 | 1.000.000 - 1.499.999 | R$ 0,3240 | R$ 641.895,83 |
| 9 | 1.500.000 - 2.999.999 | R$ 0,2510 | R$ 1.018.395,83 |
| 10 | 3.000.000 - 4.999.999 | R$ 0,1900 | R$ 1.398.395,83 |
| 11 | 5.000.000 - 6.999.999 | R$ 0,1800 | R$ 1.758.395,83 |
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
| 2 | 6 - 1.000.000 | R$ 1,5690 | R$ 1.569.000,00 |
| 3 | 1.000.001 - 2.000.000 | R$ 1,5170 | R$ 3.034.000,00 |
| 4 | 2.000.001 - 3.000.000 | R$ 1,4650 | R$ 4.395.000,00 |
| 5 | 3.000.001 - 4.000.000 | R$ 1,4120 | R$ 5.648.000,00 |
| 6 | 4.000.001 - 5.000.000 | R$ 1,3600 | R$ 6.800.000,00 |
| 7 | 5.000.001 - 6.000.000 | R$ 1,3080 | R$ 7.848.000,00 |
| 8 | 6.000.001 - 7.000.000 | R$ 1,2550 | R$ 8.785.000,00 |
| 9 | 7.000.001 - 8.000.000 | R$ 1,2030 | R$ 9.624.000,00 |
| 10 | 8.000.000+ | R$ 1,1510 | - |

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
| 1 | 1 - 999 | R$ 0,6590 | R$ 658,21 |
| 2 | 1.000 - 9.999 | R$ 0,5650 | R$ 5.743,21 |
| 3 | 10.000 - 49.999 | R$ 0,3560 | R$ 19.983,21 |
| 4 | 50.000 - 99.999 | R$ 0,2620 | R$ 33.083,21 |
| 5 | 100.000 - 249.999 | R$ 0,1780 | R$ 59.783,21 |
| 6 | 250.000 - 499.999 | R$ 0,1570 | R$ 99.033,21 |
| 7 | 500.000 - 999.999 | R$ 0,1460 | R$ 172.033,21 |
| 8 | 1.000.000 - 1.499.999 | R$ 0,1360 | R$ 240.033,21 |
| 9 | 1.500.000 - 2.999.999 | R$ 0,1150 | R$ 412.533,21 |
| 10 | 3.000.000 - 4.499.999 | R$ 0,0730 | R$ 522.033,21 |
| 11 | 4.500.000 - 9.999.999 | R$ 0,0520 | R$ 808.533,21 |
| 12 | 10.000.000+ | R$ 0,0310 | - |

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
| 1 | 1 - 5.000 | R$ 0,8790 | R$ 4.395,00 |
| 2 | 5.001 - 10.000 | R$ 0,8260 | R$ 8.260,00 |
| 3 | 10.001 - 15.000 | R$ 0,7950 | R$ 11.925,00 |
| 4 | 15.001 - 30.000 | R$ 0,7530 | R$ 22.590,00 |
| 5 | 30.001 - 50.000 | R$ 0,7220 | R$ 36.100,00 |
| 6 | 50.001 - 75.000 | R$ 0,6900 | R$ 51.750,00 |
| 7 | 75.001 - 100.000 | R$ 0,6490 | R$ 64.900,00 |
| 8 | 100.001 - 500.000 | R$ 0,6170 | R$ 308.500,00 |
| 9 | 500.001 - 1.000.000 | R$ 0,5340 | R$ 534.000,00 |
| 10 | 1.000.001 - 2.000.000 | R$ 0,4390 | R$ 878.000,00 |
| 11 | 2.000.001 - 4.000.000 | R$ 0,3660 | R$ 1.464.000,00 |
| 12 | 4.000.001 - 10.000.000 | R$ 0,3140 | R$ 3.140.000,00 |
| 13 | 10.000.000+ | R$ 0,2510 | - |

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
| 2 | 6 - 25.000 | R$ 3,6620 | R$ 91.550,00 |
| 3 | 25.001 - 50.000 | R$ 3,5470 | R$ 177.350,00 |
| 4 | 50.001 - 75.000 | R$ 3,4320 | R$ 257.400,00 |
| 5 | 75.001 - 100.000 | R$ 3,3160 | R$ 331.600,00 |
| 6 | 100.001 - 125.000 | R$ 3,2010 | R$ 400.125,00 |
| 7 | 125.001 - 150.000 | R$ 3,0860 | R$ 462.900,00 |
| 8 | 150.001 - 175.000 | R$ 2,9710 | R$ 519.925,00 |
| 9 | 175.001 - 200.000 | R$ 2,8560 | R$ 571.200,00 |
| 10 | 200.000+ | R$ 2,7410 | - |

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
| 1 | 1 - 300 | R$ 0,2400 | R$ 72,00 |
| 2 | 301 - 1.000 | R$ 0,2100 | R$ 210,00 |
| 3 | 1.001 - 3.000 | R$ 0,1800 | R$ 540,00 |
| 4 | 3.001 - 7.000 | R$ 0,1600 | R$ 1.120,00 |
| 5 | 7.001 - 15.000 | R$ 0,1400 | R$ 2.100,00 |
| 6 | 15.001 - 23.000 | R$ 0,1100 | R$ 2.530,00 |
| 7 | 23.001 - 30.000 | R$ 0,0900 | R$ 2.700,00 |
| 8 | 30.000+ | R$ 0,0600 | - |

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
| 1 | 1 - 100 | R$ 0,4000 | R$ 40,00 |
| 2 | 101 - 500 | R$ 0,3600 | R$ 180,00 |
| 3 | 501 - 1.000 | R$ 0,3200 | R$ 320,00 |
| 4 | 1.001 - 3.000 | R$ 0,2800 | R$ 840,00 |
| 5 | 3.001 - 5.000 | R$ 0,2400 | R$ 1.200,00 |
| 6 | 5.001 - 8.000 | R$ 0,2000 | R$ 1.600,00 |
| 7 | 8.001 - 10.000 | R$ 0,1600 | R$ 1.600,00 |
| 8 | 10.000+ | R$ 0,1200 | - |

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
| 1 | 1 - 500 | R$ 0,3200 | R$ 160,00 |
| 2 | 501 - 5.000 | R$ 0,2900 | R$ 1.450,00 |
| 3 | 5.001 - 10.000 | R$ 0,2600 | R$ 2.600,00 |
| 4 | 10.001 - 15.000 | R$ 0,2200 | R$ 3.300,00 |
| 5 | 15.001 - 25.000 | R$ 0,1900 | R$ 4.750,00 |
| 6 | 25.001 - 35.000 | R$ 0,1600 | R$ 5.600,00 |
| 7 | 35.001 - 50.000 | R$ 0,1200 | R$ 6.000,00 |
| 8 | 50.000+ | R$ 0,0800 | - |

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
| 1 | 1 - 5.000 | R$ 3,5000 | R$ 17.500,00 |
| 2 | 5.001 - 10.000 | R$ 3,3200 | R$ 33.200,00 |
| 3 | 10.001 - 50.000 | R$ 3,1500 | R$ 157.500,00 |
| 4 | 50.001 - 120.000 | R$ 2,9700 | R$ 356.400,00 |
| 5 | 120.001 - 180.000 | R$ 2,8000 | R$ 504.000,00 |
| 6 | 180.000+ | R$ 2,6200 | - |

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

7. **Integração:** Todas as APIs SERPRO usam autenticação OAuth2 e retornam dados em formato JSON.

8. **Carimbo de Tempo:** Serviço gratuito de certificação temporal ICP-Brasil disponível via header `x-signature: 1`.

---

## 📊 Resumo Executivo SERPRO

### Total de Endpoints

**14 endpoints** distribuídos em 9 APIs:

| API | Endpoints | Modelo de Preço |
|-----|-----------|-----------------|
| Consulta CPF | 1 | Progressivo |
| Consulta CNPJ | 3 (Básica, QSA, Empresa) | Progressivo |
| Consulta Renda | 1 | Por Faixa Total |
| Consulta Dívida Ativa | 1 | Progressivo |
| Consulta CND | 1 | Por Faixa Total |
| Consulta Faturamento | 1 | Por Faixa Total |
| Datavalid V4 | 1 | Preço não localizado |
| Integra Contador | 3 (Consulta, Declaração, Emissão) | Misto |
| Raiz Tech Pastagens | 1 | Por Faixa Total |

### Modelos de Cobrança

**Progressivo/Escalonado (6 endpoints):**
- Cada faixa tem seu preço
- Custo = soma dos custos de cada faixa
- Mais econômico para alto volume
- **Endpoints:** CPF, CNPJ (3), Dívida Ativa, Integra Contador Consulta

**Por Faixa de Volume Total (7 endpoints):**
- Preço único baseado no volume total mensal
- Custo = volume × preço da faixa
- Mais simples de calcular
- **Endpoints:** Renda, CND, Faturamento, Raiz Tech, Integra Contador (Declaração e Emissão)

### Consultas Gratuitas

- **Consulta Renda:** 5 consultas/mês
- **Consulta Faturamento:** 5 consultas/mês

### Faixa de Preços

| Tipo | Menor Preço | Maior Preço | Exemplo |
|------|-------------|-------------|---------|
| **Pessoa Física** | R$ 0,017 | R$ 1,569 | CPF (alto volume) a Renda (baixo volume) |
| **Pessoa Jurídica** | R$ 0,025 | R$ 3,662 | CNPJ Básica (alto volume) a Faturamento (baixo volume) |
| **Serviços Especializados** | R$ 1,151 | R$ 3,500 | Raiz Tech |

### Dados Oficiais Disponíveis

✅ **Receita Federal:** CPF, CNPJ, Renda (IRPF), Faturamento
✅ **PGFN:** Dívida Ativa, CND
✅ **RFB:** Validação de dados (Datavalid)
✅ **Receita Federal:** Integra Contador (obrigações acessórias)
✅ **Embrapa:** Raiz Tech (análise agronômica)

### Recursos Exclusivos SERPRO

- **Carimbo de Tempo ICP-Brasil:** Certificação temporal gratuita
- **X-Request-Tag:** Agrupamento de faturamento por projeto/cliente
- **Ambiente Trial:** Testes gratuitos com dados fictícios
- **Dados Governamentais Oficiais:** Fonte primária de dados públicos
- **API REST:** Integração automatizada

---

## 🔗 Links Úteis SERPRO

**Loja SERPRO:**
https://loja.serpro.gov.br

**API Center (Documentação):**
https://apicenter.estaleiro.serpro.gov.br

**Suporte:**
📧 css.serpro@serpro.gov.br
📞 0800 728 2323
🕐 Segunda a Sexta, 7h às 19h (horário de Brasília)

**Portal SERPRO:**
https://www.serpro.gov.br

---

**FIM DO RELATÓRIO SERPRO**
