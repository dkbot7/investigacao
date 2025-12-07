# Tabelas de Preços Consolidadas - APIs SERPRO + Serasa + JusBrasil

📅 **Data de Extração:** 06/12/2025
📄 **Fonte:** Contratos oficiais SERPRO (Anexo I) + Proposta Serasa Experian + Documentação JusBrasil
🏢 **Contratante:** INVESTIR ITAPEMA LTDA (CNPJ 29.814.517/0001-04)

---

## 📋 Índice

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

### Modelo de Cobrança: ESCALONADO/PROGRESSIVO

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 999 | R$ 0,659 |
| 2 | 1.000 | 9.999 | R$ 0,565 |
| 3 | 10.000 | 49.999 | R$ 0,356 |
| 4 | 50.000 | 99.999 | R$ 0,262 |
| 5 | 100.000 | 249.999 | R$ 0,178 |
| 6 | 250.000 | 499.999 | R$ 0,157 |
| 7 | 500.000 | 999.999 | R$ 0,146 |
| 8 | 1.000.000 | 1.499.999 | R$ 0,136 |
| 9 | 1.500.000 | 2.999.999 | R$ 0,115 |
| 10 | 3.000.000 | 4.499.999 | R$ 0,073 |
| 11 | 4.500.000 | 9.999.999 | R$ 0,052 |
| 12 | 10.000.000 | 16.999.999 | R$ 0,031 |
| 13 | 17.000.000 | 19.999.999 | R$ 0,026 |
| 14 | 20.000.000 | 24.999.999 | R$ 0,023 |
| 15 | 25.000.000 | 29.999.999 | R$ 0,02 |
| 16 | 30.000.000+ | ∞ | R$ 0,017 |

**Unidade:** Por transação
**Recursos Incluídos:** Check Time Stamp (Carimbo de Tempo)

---

## 2. Consulta CNPJ - Contrato 260009

### 2.1 Consulta Básica CNPJ

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 999 | R$ 0,659 |
| 2 | 1.000 | 9.999 | R$ 0,565 |
| 3 | 10.000 | 49.999 | R$ 0,356 |
| 4 | 50.000 | 99.999 | R$ 0,262 |
| 5 | 100.000 | 249.999 | R$ 0,178 |
| 6 | 250.000 | 499.999 | R$ 0,157 |
| 7 | 500.000 | 999.999 | R$ 0,146 |
| 8 | 1.000.000 | 1.499.999 | R$ 0,136 |
| 9 | 1.500.000 | 2.999.999 | R$ 0,115 |
| 10 | 3.000.000 | 4.999.999 | R$ 0,0700 |
| 11 | 5.000.000 | 6.999.999 | R$ 0,06 |
| 12 | 7.000.000 | 9.999.999 | R$ 0,0500 |
| 13 | 10.000.000 | 19.999.999 | R$ 0,0400 |
| 14 | 20.000.000 | 24.999.999 | R$ 0,0350 |
| 15 | 25.000.000 | 29.999.999 | R$ 0,0300 |
| 16 | 30.000.000+ | ∞ | R$ 0,0250 |

**Endpoint:** `/basica/{ni}`
**Unidade:** Consultas

---

### 2.2 Consulta QSA (CPF Mascarado)

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 999 | R$ 0,8680 |
| 2 | 1.000 | 9.999 | R$ 0,7430 |
| 3 | 10.000 | 49.999 | R$ 0,5960 |
| 4 | 50.000 | 99.999 | R$ 0,5020 |
| 5 | 100.000 | 249.999 | R$ 0,3980 |
| 6 | 250.000 | 499.999 | R$ 0,3350 |
| 7 | 500.000 | 999.999 | R$ 0,2720 |
| 8 | 1.000.000 | 1.499.999 | R$ 0,22 |
| 9 | 1.500.000 | 2.999.999 | R$ 0,178 |
| 10 | 3.000.000 | 4.999.999 | R$ 0,1300 |
| 11 | 5.000.000 | 6.999.999 | R$ 0,12 |
| 12 | 7.000.000 | 9.999.999 | R$ 0,11 |
| 13 | 10.000.000 | 19.999.999 | R$ 0,1000 |
| 14 | 20.000.000 | 24.999.999 | R$ 0,0760 |
| 15 | 25.000.000 | 29.999.999 | R$ 0,0720 |
| 16 | 30.000.000+ | ∞ | R$ 0,0670 |

**Endpoint:** `/qsa/{ni}`
**Unidade:** Consultas

---

### 2.3 Consulta Empresa (CPF Completo)

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 999 | R$ 1,1720 |
| 2 | 1.000 | 9.999 | R$ 1,0150 |
| 3 | 10.000 | 49.999 | R$ 0,826 |
| 4 | 50.000 | 99.999 | R$ 0,7010 |
| 5 | 100.000 | 249.999 | R$ 0,565 |
| 6 | 250.000 | 499.999 | R$ 0,4710 |
| 7 | 500.000 | 999.999 | R$ 0,3980 |
| 8 | 1.000.000 | 1.499.999 | R$ 0,3240 |
| 9 | 1.500.000 | 2.999.999 | R$ 0,251 |
| 10 | 3.000.000 | 4.999.999 | R$ 0,19 |
| 11 | 5.000.000 | 6.999.999 | R$ 0,18 |
| 12 | 7.000.000 | 9.999.999 | R$ 0,1700 |
| 13 | 10.000.000 | 19.999.999 | R$ 0,1500 |
| 14 | 20.000.000 | 24.999.999 | R$ 0,1380 |
| 15 | 25.000.000 | 29.999.999 | R$ 0,1220 |
| 16 | 30.000.000+ | ∞ | R$ 0,1080 |

**Endpoint:** `/empresa/{ni}`
**Unidade:** Consultas
**Recursos Incluídos:** Check Time Stamp (Carimbo de Tempo)

---

## 3. Consulta Renda - Contratos 260008 & 261071

### Modelo de Cobrança: POR FAIXA DE VOLUME

⚠️ **ATENÇÃO:** Tabela de preços diferente das demais - cobra por faixa de volume total, não progressivo.

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 5 | R$ 0,00 (GRÁTIS) |
| 2 | 6 | 1.000.000 | R$ 1,569 |
| 3 | 1.000.001 | 2.000.000 | R$ 1,517 |
| 4 | 2.000.001 | 3.000.000 | R$ 1,465 |
| 5 | 3.000.001 | 4.000.000 | R$ 1,412 |
| 6 | 4.000.001 | 5.000.000 | R$ 1,36 |
| 7 | 5.000.001 | 6.000.000 | R$ 1,308 |
| 8 | 6.000.001 | 7.000.000 | R$ 1,255 |
| 9 | 7.000.001 | 8.000.000 | R$ 1,203 |
| 10 | 8.000.000+ | ∞ | R$ 1,151 |

**Unidade:** Requisição
**Observação:** Primeiras 5 consultas GRATUITAS
**Contratos:** 260008 e 261071 (mesma tabela)

### 💡 Exemplo de Cobrança

- **Volume: 100 consultas**
  → 5 grátis + 95 × R$ 1,569 = R$ 149,06

- **Volume: 10.000 consultas**
  → 5 grátis + 9.995 × R$ 1,569 = R$ 15.682,16

---

## 4. Consulta Dívida Ativa - Contrato 261069

### Modelo de Cobrança: ESCALONADO/PROGRESSIVO

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 999 | R$ 0,659 |
| 2 | 1.000 | 9.999 | R$ 0,565 |
| 3 | 10.000 | 49.999 | R$ 0,356 |
| 4 | 50.000 | 99.999 | R$ 0,262 |
| 5 | 100.000 | 249.999 | R$ 0,178 |
| 6 | 250.000 | 499.999 | R$ 0,157 |
| 7 | 500.000 | 999.999 | R$ 0,146 |
| 8 | 1.000.000 | 1.499.999 | R$ 0,136 |
| 9 | 1.500.000 | 2.999.999 | R$ 0,115 |
| 10 | 3.000.000 | 4.499.999 | R$ 0,073 |
| 11 | 4.500.000 | 9.999.999 | R$ 0,052 |
| 12 | 10.000.000+ | ∞ | R$ 0,031 |

**Unidade:** Por transação
**Observação:** Mesma tabela da Consulta CPF até faixa 11, mas faixa 12 engloba acima de 10M

---

## 5. Consulta CND - Contrato 261075

### Modelo de Cobrança: POR FAIXA DE VOLUME

⚠️ **ATENÇÃO:** Tabela de preços por faixa de volume total, não progressivo.

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 5.000 | R$ 0,879 |
| 2 | 5.001 | 10.000 | R$ 0,826 |
| 3 | 10.001 | 15.000 | R$ 0,795 |
| 4 | 15.001 | 30.000 | R$ 0,753 |
| 5 | 30.001 | 50.000 | R$ 0,722 |
| 6 | 50.001 | 75.000 | R$ 0,69 |
| 7 | 75.001 | 100.000 | R$ 0,649 |
| 8 | 100.001 | 500.000 | R$ 0,617 |
| 9 | 500.001 | 1.000.000 | R$ 0,534 |
| 10 | 1.000.001 | 2.000.000 | R$ 0,439 |
| 11 | 2.000.001 | 4.000.000 | R$ 0,366 |
| 12 | 4.000.001 | 10.000.000 | R$ 0,314 |
| 13 | 10.000.000+ | ∞ | R$ 0,251 |

**Unidade:** Requisição
**Recursos Incluídos:** Check Time Stamp (Carimbo de Tempo)

### 💡 Exemplo de Cobrança

- **Volume: 3.000 consultas**
  → 3.000 × R$ 0,879 = R$ 2.637,00

- **Volume: 100.000 consultas**
  → 100.000 × R$ 0,649 = R$ 64.900,00

---

## 6. Consulta Faturamento - Contrato 261073

### Modelo de Cobrança: POR FAIXA DE VOLUME

⚠️ **ATENÇÃO:** Tabela de preços por faixa de volume total, não progressivo.

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 5 | R$ 0,00 (GRÁTIS) |
| 2 | 6 | 25.000 | R$ 3,662 |
| 3 | 25.001 | 50.000 | R$ 3,547 |
| 4 | 50.001 | 75.000 | R$ 3,432 |
| 5 | 75.001 | 100.000 | R$ 3,316 |
| 6 | 100.001 | 125.000 | R$ 3,201 |
| 7 | 125.001 | 150.000 | R$ 3,086 |
| 8 | 150.001 | 175.000 | R$ 2,971 |
| 9 | 175.001 | 200.000 | R$ 2,856 |
| 10 | 200.000+ | ∞ | R$ 2,741 |

**Unidade:** Requisição
**Observação:** Primeiras 5 consultas GRATUITAS

### 💡 Exemplo de Cobrança

- **Volume: 100 consultas**
  → 5 grátis + 95 × R$ 3,662 = R$ 347,89

- **Volume: 50.000 consultas**
  → 5 grátis + 49.995 × R$ 3,547 = R$ 177.322,07

---

## 7. Datavalid V4 - Contrato 261070

⚠️ **TABELA NÃO LOCALIZADA NO ANEXO I**

O contrato 261070 (páginas 32-33) não contém a tabela de preços no Anexo I. O documento apresenta apenas:
- Cláusulas de proteção de dados (LGPD)
- Termos de transferência internacional de dados
- Responsabilidades das partes

**Ação Necessária:** Verificar páginas adicionais do contrato ou solicitar tabela ao SERPRO.

**Recursos Incluídos:** Carimbo de Tempo

---

## 8. Integra Contador - Contrato 261074

### 8.1 Consulta

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 300 | R$ 0,24 |
| 2 | 301 | 1.000 | R$ 0,21 |
| 3 | 1.001 | 3.000 | R$ 0,18 |
| 4 | 3.001 | 7.000 | R$ 0,16 |
| 5 | 7.001 | 15.000 | R$ 0,14 |
| 6 | 15.001 | 23.000 | R$ 0,11 |
| 7 | 23.001 | 30.000 | R$ 0,09 |
| 8 | 30.000+ | ∞ | R$ 0,06 |

**Unidade:** Requisição

---

### 8.2 Declaração

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 100 | R$ 0,40 |
| 2 | 101 | 500 | R$ 0,36 |
| 3 | 501 | 1.000 | R$ 0,32 |
| 4 | 1.001 | 3.000 | R$ 0,28 |
| 5 | 3.001 | 5.000 | R$ 0,24 |
| 6 | 5.001 | 8.000 | R$ 0,20 |
| 7 | 8.001 | 10.000 | R$ 0,16 |
| 8 | 10.000+ | ∞ | R$ 0,12 |

**Unidade:** Requisição

---

### 8.3 Emissão

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 500 | R$ 0,32 |
| 2 | 501 | 5.000 | R$ 0,29 |
| 3 | 5.001 | 10.000 | R$ 0,26 |
| 4 | 10.001 | 15.000 | R$ 0,22 |
| 5 | 15.001 | 25.000 | R$ 0,19 |
| 6 | 25.001 | 35.000 | R$ 0,16 |
| 7 | 35.001 | 50.000 | R$ 0,12 |
| 8 | 50.000+ | ∞ | R$ 0,08 |

**Unidade:** Requisição

**Observação:** API com 3 tipos de operação (Consulta, Declaração, Emissão)

---

## 9. Raiz Tech - Pastagens Degradadas - Contrato 261072

### Modelo de Cobrança: POR FAIXA DE VOLUME

⚠️ **ATENÇÃO:** Apenas 6 faixas de preço. Tabela de preços por faixa de volume total.

| Faixa | De | Até | Preço Unitário |
|-------|------------|------------|----------------|
| 1 | 1 | 5.000 | R$ 3,50 |
| 2 | 5.001 | 10.000 | R$ 3,32 |
| 3 | 10.001 | 50.000 | R$ 3,15 |
| 4 | 50.001 | 120.000 | R$ 2,97 |
| 5 | 120.001 | 180.000 | R$ 2,80 |
| 6 | 180.000+ | ∞ | R$ 2,62 |

**Unidade:** Consulta

### 💡 Exemplo de Cobrança

- **Volume: 1.000 consultas**
  → 1.000 × R$ 3,50 = R$ 3.500,00

- **Volume: 100.000 consultas**
  → 100.000 × R$ 2,97 = R$ 297.000,00

---

## 📊 Resumo Comparativo de Preços (Faixa 1)

| API | Preço Inicial (Faixa 1) | Tipo de Cobrança |
|-----|--------------------------|------------------|
| **Consulta CPF** | R$ 0,659 | Progressivo |
| **CNPJ Básica** | R$ 0,659 | Progressivo |
| **CNPJ QSA** | R$ 0,868 | Progressivo |
| **CNPJ Empresa** | R$ 1,172 | Progressivo |
| **Consulta Renda** | R$ 1,569 (após 5 grátis) | Por Faixa |
| **Dívida Ativa** | R$ 0,659 | Progressivo |
| **CND** | R$ 0,879 | Por Faixa |
| **Faturamento** | R$ 3,662 (após 5 grátis) | Por Faixa |
| **Datavalid V4** | *Não localizada* | - |
| **Integra Contador (Consulta)** | R$ 0,240 | Por Faixa |
| **Integra Contador (Declaração)** | R$ 0,400 | Por Faixa |
| **Integra Contador (Emissão)** | R$ 0,320 | Por Faixa |
| **Raiz Tech Pastagens** | R$ 3,500 | Por Faixa |

---

## 📌 Observações Importantes

### Modelos de Cobrança

#### 1️⃣ **Progressivo/Escalonado**
Cada faixa é cobrada com seu preço específico. Para 15.000 consultas:
- Faixa 1: 999 × R$ 0,659
- Faixa 2: 9.000 × R$ 0,565
- Faixa 3: 5.001 × R$ 0,356

**APIs com cobrança progressiva:**
- Consulta CPF
- Consulta CNPJ (3 tipos)
- Consulta Dívida Ativa

#### 2️⃣ **Por Faixa de Volume Total**
O preço unitário depende do volume total mensal. Para 15.000 consultas em CND:
- 15.000 está na Faixa 4 (15.001-30.000)
- Todas as 15.000 consultas × R$ 0,753

**APIs com cobrança por faixa:**
- Consulta Renda
- Consulta CND
- Consulta Faturamento
- Integra Contador (3 tipos)
- Raiz Tech Pastagens

### Consultas Gratuitas

Apenas **3 APIs** oferecem consultas gratuitas iniciais:
- **Consulta Renda:** 5 primeiras consultas
- **Consulta Faturamento:** 5 primeiras consultas
- **Raiz Tech Pastagens:** Nenhuma (todas são pagas)

### Recursos Inclusos Sem Custo Adicional

✅ **Check Time Stamp (Carimbo de Tempo)** - GRATUITO
APIs que oferecem:
- Consulta CPF
- Consulta CNPJ (3 tipos)
- Consulta CND
- Datavalid V4

✅ **X-Request-Tag** (Identificador de Requisição) - GRATUITO
Todas as APIs permitem uso do header para agrupamento de faturamento.

---

## 🔍 APIs Pendentes de Informação

### Datavalid V4 (Contrato 261070)
- ❌ Tabela de preços não localizada no Anexo I do contrato
- ✅ Contrato válido e ativo
- ⚠️ Necessário verificar páginas adicionais ou solicitar ao SERPRO

---

## 📞 Contato para Esclarecimentos

**SERPRO - Suporte Comercial**
📧 E-mail: css.serpro@serpro.gov.br
📞 Telefone: 0800 728 2323
🕐 Horário: Segunda a Sexta, 7h às 19h (horário de Brasília)

**Loja SERPRO:** https://loja.serpro.gov.br
**API Center:** https://apicenter.estaleiro.serpro.gov.br

---

## 10. Serasa - Relatório Avançado PF

### Modelo de Cobrança: PACOTE MENSAL COM VOLUME FIXO

**Opção 1 - Valor Mensal: R$ 3.554,00**

| Volume | Preço Original | Desconto | Preço Final | Custo Total |
|--------|----------------|----------|-------------|-------------|
| 380 consultas | R$ 18,66 | 50% | **R$ 9,33** | R$ 3.545,40 |

**Opção 2 - Valor Mensal: R$ 4.736,00**

| Volume | Preço Original | Desconto | Preço Final | Custo Total |
|--------|----------------|----------|-------------|-------------|
| 538 consultas | R$ 17,59 | 50% | **R$ 8,80** | R$ 4.734,40 |

**Fonte:** Proposta Comercial Serasa Experian
**Observações:**
- Primeiro pagamento: 30 dias após contratação
- Desconto de 50% promocional (verificar validade)
- Consultas não utilizadas no mês não acumulam
- Acesso via plataforma web (não é API REST)

---

## 11. Serasa - Relatório Avançado PJ

### Modelo de Cobrança: PACOTE MENSAL COM VOLUME FIXO

**Opção 1 - Valor Mensal: R$ 3.554,00**

| Volume | Preço Original | Desconto | Preço Final | Custo Total |
|--------|----------------|----------|-------------|-------------|
| 247 consultas | R$ 28,74 | 50% | **R$ 14,37** | R$ 3.549,39 |

**Opção 2 - Valor Mensal: R$ 4.736,00**

| Volume | Preço Original | Desconto | Preço Final | Custo Total |
|--------|----------------|----------|-------------|-------------|
| 349 consultas | R$ 27,08 | 50% | **R$ 13,54** | R$ 4.725,46 |

**Fonte:** Proposta Comercial Serasa Experian
**Observações:**
- Primeiro pagamento: 30 dias após contratação
- Desconto de 50% promocional (verificar validade)
- Consultas não utilizadas no mês não acumulam
- Acesso via plataforma web (não é API REST)
- Inclui Quadro Social com CPF completo dos sócios
- Inclui Limite de Crédito Sugerido e Perfil Financeiro

---

## 📊 Resumo Comparativo

### Modelos de Cobrança

**SERPRO - Progressivo/Escalonado (6 APIs):**
- Consulta CPF, CNPJ Básica, CNPJ QSA, CNPJ Empresa, Dívida Ativa, Integra Contador
- Cada faixa de volume tem seu próprio preço
- Custo total = soma dos custos de cada faixa

**SERPRO - Por Faixa de Volume Total (6 endpoints):**
- Consulta Renda, CND, Faturamento, Raiz Tech, Integra Contador (consulta e declaração)
- Preço único baseado no volume total do mês
- Custo total = volume × preço da faixa

**Serasa - Pacote Mensal Fixo:**
- Relatório Avançado PF e PJ
- Volume fixo de consultas por pacote
- Preço fixo mensal independente do uso

### APIs Gratuitas

- **Consulta Renda:** 5 consultas gratuitas/mês
- **Consulta Faturamento:** 5 consultas gratuitas/mês

### Desconto Atual

- **Serasa:** 50% de desconto promocional (verificar prazo)

---

## 12. JusBrasil - Consulta PRO

### Modelo de Cobrança: PAY-PER-CALL (Valor Fixo)

**Fornecedor:** JusBrasil
**Produto:** Background Check API - Consulta PRO
**Tipo:** API REST com autenticação via API Key

| Item | Valor |
|------|-------|
| Preço por Chamada (qualquer endpoint) | R$ 4,00 |
| Consumo Mínimo Mensal | R$ 1.000,00 |
| Equivalente em Consultas Mínimas | 250 consultas/mês |

### Tabela de Custos por Volume

| Volume de Consultas | Custo Total Mensal |
|--------------------|--------------------|
| 250 (mínimo) | R$ 1.000,00 |
| 500 | R$ 2.000,00 |
| 1.000 | R$ 4.000,00 |
| 2.500 | R$ 10.000,00 |
| 5.000 | R$ 20.000,00 |

### Endpoints e Preços

Todos os endpoints custam **R$ 4,00 por chamada de API**:

| Endpoint | Descrição | Custo |
|----------|-----------|-------|
| POST /lawsuits/criminal | Processos Criminais | R$ 4,00 |
| POST /lawsuits/civil | Processos Civis | R$ 4,00 |
| POST /lawsuits/trabalhista | Processos Trabalhistas | R$ 4,00 |
| POST /mp | Registros Ministério Público | R$ 4,00 |
| POST /bnmp | Mandados de Prisão (BNMP) | R$ 4,00 |
| POST /empregador-irregular | Empregadores Irregulares | R$ 4,00 |
| POST /consulta-em-lote | Consulta em Lote (até 3.000 CPFs) | R$ 4,00 por CPF |
| GET /consulta-em-lote/ | Listar lotes processados | Gratuito |
| GET /consulta-em-lote/download/<id> | Download resultado | Gratuito |

### Exemplo Prático de Custos

**Cenário 1: Background Check Individual Completo**
- Processos Criminais: R$ 4,00
- Processos Civis: R$ 4,00
- Processos Trabalhistas: R$ 4,00
- BNMP (Mandados): R$ 4,00
- **Total por pessoa: R$ 16,00**

**Cenário 2: Processo Seletivo - 80 Candidatos/Mês**
- 80 candidatos × R$ 16,00 = **R$ 1.280,00/mês**

**Cenário 3: Lote de 1.000 CPFs (apenas criminais)**
- 1.000 CPFs × R$ 4,00 = **R$ 4.000,00**

### Características Especiais (Incluídas sem Custo Adicional)

✅ Paginação ilimitada (mesma consulta)
✅ Sistema de confiança (ALTA/MEDIA/BAIXA)
✅ Processamento em lote (até 3.000 CPFs via CSV)
✅ Ambiente Sandbox para testes
✅ API Key management
✅ Retorno padrão de 100 processos por requisição

### Observações Importantes

1. **Consumo Mínimo Obrigatório:** R$ 1.000,00/mês (250 consultas)
2. **Paginação:** Requisições de paginação da mesma consulta não geram custo adicional
3. **Batch Processing:** Tempo de processamento ~30 minutos para lotes grandes
4. **Endpoints Gratuitos:** Listar e baixar resultados de lotes não cobra
5. **Dados Públicos:** Processos judiciais são dados públicos (Art. 11 CPC)
6. **LGPD:** Requer conformidade (bases legais: Art. 7º, VI ou IX da Lei 13.709/2018)

---

## 📊 Resumo Comparativo: SERPRO vs Serasa vs JusBrasil

| Critério | SERPRO | Serasa | JusBrasil |
|----------|--------|--------|-----------|
| **Tipo de Dados** | Dados oficiais (CPF, CNPJ, Renda) | Score, protestos, dívidas | Processos judiciais |
| **Modelo de Preço** | Escalonado/progressivo | Pacote mensal fixo | Pay-per-call fixo |
| **Preço Inicial** | A partir de R$ 0,08 | R$ 8,80 - R$ 14,37/consulta | R$ 4,00/consulta |
| **Consumo Mínimo** | Não há | R$ 3.554 ou R$ 4.736/mês | R$ 1.000/mês |
| **Tipo de API** | REST/JSON (OAuth2) | Plataforma web | REST/JSON (API Key) |
| **Trial/Sandbox** | ✅ Sim (gratuito) | ❌ Não | ✅ Sim (gratuito) |
| **Uso Principal** | Validação cadastral, KYC | Análise de crédito | Background check judicial |

### Estratégia de Uso Combinado

**Para análise completa de uma pessoa física:**

1. **SERPRO Consulta CPF** (R$ 0,08 - R$ 0,66)
   - Validar CPF e obter dados cadastrais oficiais da Receita Federal

2. **Serasa Relatório Avançado PF** (R$ 8,80 - R$ 9,33)
   - Obter score de crédito, protestos, dívidas vencidas e ações judiciais financeiras

3. **JusBrasil Consulta PRO** (R$ 16,00 para 4 consultas)
   - Verificar processos criminais, civis, trabalhistas e mandados de prisão

**Custo total por pessoa (análise completa):** R$ 24,88 - R$ 25,99

---

## ⚠️ Observações Finais Consolidadas

- **SERPRO:** Preços escalonados, quanto maior o volume, menor o custo unitário
- **Serasa:** Desconto promocional de 50% (verificar validade), pacote mensal fechado
- **JusBrasil:** Preço fixo por consulta, ideal para volumes variáveis acima do mínimo

**Recomendação:** Para volumes mensais superiores a 250 consultas judiciais, JusBrasil oferece melhor custo-benefício comparado a soluções similares.

---

**Documento gerado em:** 06/12/2025
**Última atualização:** 06/12/2025
**Versão:** 3.0
**Extraído por:** Claude Code (Anthropic)
