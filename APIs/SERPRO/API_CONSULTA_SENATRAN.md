# API SERPRO - Consulta Online Senatran

**Informações de Veículos, Condutores e Infrações Direto da SENATRAN**

---

## VISÃO GERAL

A Consulta Online Senatran é uma solução para compartilhamento de informações oficiais de trânsito, com dados obtidos diretamente das bases da Secretaria Nacional de Trânsito (SENATRAN) em tempo real.

### Bases de Dados Disponíveis

- **Veículos** - Dados cadastrais de veículos
- **Carteira de Habilitação (CNH)** - Dados de condutores
- **Infrações** - Multas e penalidades
- **Restrições** - Impedimentos e bloqueios
- **Judiciais** - Restrições judiciais
- **Roubo e Furto** - Veículos com ocorrência

---

## TIPOS DE CONSULTA

A API oferece **4 tipos de consulta** com diferentes níveis de detalhamento:

| Tipo | Descrição |
|------|-----------|
| **Consulta Básica** | Dados cadastrais essenciais |
| **Consulta com Indicadores** | Básica + indicadores de situação |
| **Consulta Detalhada** | Informações completas e detalhadas |
| **Consulta com Imagem** | Detalhada + imagem do documento/veículo |

### Aplicável a Todos os Serviços

Os mesmos tipos de consulta estão disponíveis para:
- Consulta de **Condutor** (CNH)
- Consulta de **Veículo**
- Consulta de **Infração**

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Loja** | https://loja.serpro.gov.br/consultasenatran |
| **Base Legal** | PORTARIA SENATRAN nº 461/2025 |

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Passa por cada faixa até esgotar
- **Preços variam por tipo de consulta** (Básica, Indicadores, Detalhada, Imagem)

### ⚠️ IMPORTANTE: Modelo de Cobrança Escalonado

O SERPRO usa um modelo **progressivo**, onde você paga cada faixa até esgotar:

1. **Faixa 1**: Até 50.000 consultas
2. **Faixa 2**: De 50.001 a 100.000
3. **Faixa 3**: De 100.001 a 300.000
4. E assim por diante...

### Tabela de Preços (Novembro/2025)

| Faixa | Volume | Básica | Indicadores | Detalhada | Com Imagem |
|-------|--------|--------|-------------|-----------|------------|
| **1** | Até 50.000 | R$ 0,83 | R$ 1,00 | R$ 1,47 | R$ 2,49 |
| **2** | 50.001 a 100.000 | R$ 0,73 | R$ 0,91 | R$ 1,31 | R$ 2,19 |
| **3** | 100.001 a 300.000 | R$ 0,66 | R$ 0,83 | R$ 1,14 | R$ 1,97 |
| **4** | 300.001 a 600.000 | R$ 0,57 | R$ 0,73 | R$ 1,03 | R$ 1,71 |
| **5** | 600.001 a 1.000.000 | R$ 0,51 | R$ 0,62 | R$ 0,88 | R$ 1,55 |
| **6** | Acima de 1.000.000 | R$ 0,32 | R$ 0,52 | R$ 0,73 | R$ 0,92 |

**Obs:** Os preços são definidos de acordo com a PORTARIA SENATRAN nº 461/2025.

### Simulação de Custos - Consulta Básica (Modelo Escalonado)

| Consultas/Mês | Cálculo | Custo Total |
|---------------|---------|-------------|
| 10.000 | 10.000 × R$ 0,83 | R$ 8.300,00 |
| 50.000 | 50.000 × R$ 0,83 | R$ 41.500,00 |
| 100.000 | 50.000 × R$ 0,83 + 50.000 × R$ 0,73 | R$ 78.000,00 |
| 300.000 | Faixas 1-2 + 200.000 × R$ 0,66 | R$ 210.000,00 |

### Simulação de Custos - Consulta com Imagem (Modelo Escalonado)

| Consultas/Mês | Cálculo | Custo Total |
|---------------|---------|-------------|
| 10.000 | 10.000 × R$ 2,49 | R$ 24.900,00 |
| 50.000 | 50.000 × R$ 2,49 | R$ 124.500,00 |
| 100.000 | 50.000 × R$ 2,49 + 50.000 × R$ 2,19 | R$ 234.000,00 |

---

## CASOS DE USO

### 1. Locadoras de Veículos
Consulte dados de condutores e veículos antes de alugar.

### 2. Seguradoras
Verifique histórico de sinistros, roubos e infrações.

### 3. Financeiras de Veículos
Análise de risco antes de financiar veículos.

### 4. Despachantes
Automatize consultas de documentação veicular.

### 5. Investigação Patrimonial
Levantamento de veículos em nome de investigados.

### 6. Due Diligence
Verificação de frota de empresas em processos de M&A.

### 7. Empresas de Transporte
Monitoramento de CNH de motoristas.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta Senatran
SERPRO_SENATRAN_CONSUMER_KEY=sua_consumer_key
SERPRO_SENATRAN_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/consultasenatran
2. Clicar em "Quero contratar"
3. Autenticar com certificado digital e-CNPJ
4. Aceitar termos e condições
5. Configurar credenciais de API

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
**Base Legal:** PORTARIA SENATRAN nº 461/2025
