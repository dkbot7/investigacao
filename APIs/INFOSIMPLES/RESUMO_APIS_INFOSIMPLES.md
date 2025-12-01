# Infosimples - Catálogo de APIs Documentadas

**Resumo de todas as APIs Infosimples disponíveis para investigação e due diligence**

---

## VISAO GERAL

A Infosimples oferece centenas de APIs para consultas em bases de dados governamentais e comerciais brasileiras, com execução em milissegundos e retorno em JSON.

**Modelo de Cobrança:** PRÉ-PAGO ESCALONADO/PROGRESSIVO
- Quanto maior o volume, menor o preço por consulta
- Primeiro você paga a faixa mais cara, depois as mais baratas
- Franquia mínima: R$ 100,00/mês

---

## TABELA DE PRECOS BASE

| Faixa | Volume Mensal | Preço/Consulta |
|-------|---------------|----------------|
| 1 | 1 a 500 | R$ 0,20 |
| 2 | 501 a 2.000 | R$ 0,15 |
| 3 | 2.001 a 5.000 | R$ 0,13 |
| 4 | 5.001 a 10.000 | R$ 0,11 |
| 5 | 10.001 a 50.000 | R$ 0,09 |
| 6 | 50.001 a 100.000 | R$ 0,07 |
| 7 | 100.001+ | R$ 0,05 |

> **IMPORTANTE:** Algumas APIs têm preço adicional (R$ 0,02 a R$ 0,18)

---

## CATEGORIAS DE APIs

### 1. RECEITA FEDERAL

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **CPF** | Dados de pessoa física | Nome, situação, óbito, nascimento |
| **CNPJ** | Dados de pessoa jurídica | Razão social, QSA, situação, CNAE |
| **PGFN / CND Federal** | Certidão negativa de débitos | Situação fiscal federal |
| **Simples Nacional** | Situação no Simples | Optante, data opção |
| **NFE** | Notas fiscais eletrônicas | Dados de NF-e |
| **MEI** | Microempreendedor individual | Situação do MEI |

### 2. PORTAL DA TRANSPARENCIA

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Bolsa Família** | Beneficiários do programa | Valor, parcelas (até 50) |
| **BPC** | Benefício Prestação Continuada | Valor, parcelas (até 50) |
| **Auxílio Emergencial** | Beneficiários 2020-2021 | Valor, parcelas históricas |
| **Servidor Público** | Servidores federais | Remuneração, vínculo |
| **Repasse de Verba** | Repasses para estados/municípios | Valores repassados |

### 3. TSE - TRIBUNAL SUPERIOR ELEITORAL

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Doadores e Fornecedores** | Doações de campanha | Candidatos, valores, desde 2002 |
| **Certidão Eleitoral** | Situação eleitoral | Quitação eleitoral |

### 4. CNJ - CONSELHO NACIONAL DE JUSTICA

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **SEEU Processos** | Processos de execução | Execuções fiscais, cíveis |
| **Mandados de Prisão** | Mandados ativos | Situação de mandados |
| **Improbidade** | Atos de improbidade | Condenações |

### 5. TRIBUNAIS FEDERAIS (TRFs)

| Tribunal | APIs Disponíveis |
|----------|------------------|
| **TRF1** | Certidão Cível/Criminal, Processos |
| **TRF2** | Certidão Cível/Criminal, Processos |
| **TRF3** | Certidão de Distribuição |
| **TRF4** | Certidão Cível/Criminal |
| **TRF5** | Certidão Cível/Criminal |
| **TRF6** | Certidão Cível/Criminal |

### 6. TRIBUNAIS ESTADUAIS (TJs)

| Tribunal | APIs Disponíveis |
|----------|------------------|
| **TJSP** | Certidões, Processos |
| **TJRS** | Certidão 1º Grau |
| **Outros TJs** | Diversas certidões |

### 7. DETRAN - VEICULOS

| API | Descrição | Estados |
|-----|-----------|---------|
| **Restrições (Unificada)** | Restrições nacionais | Todos |
| **Débitos e Restrições** | Débitos estaduais | SP, MG, RS, PR, etc. |
| **Veículo** | Dados do veículo | Vários estados |
| **Multas** | Multas detalhadas | MG, SP, etc. |

### 8. SENATRAN

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **Veículo** | Dados RENAVAM | Restrições, recalls |
| **Meus Veículos** | Veículos por CPF | Listagem, detalhes |
| **Infrações** | Multas do veículo | Últimos 12 meses |
| **CNH** | Habilitação | Validade, categoria |

### 9. CONSELHOS PROFISSIONAIS

| API | Descrição |
|-----|-----------|
| **CFM** | Conselho Federal de Medicina |
| **CRO** | Conselho Regional de Odontologia (27 estados) |
| **CFF** | Conselho Federal de Farmácia |
| **CREA** | Conselho de Engenharia |
| **CRC** | Conselho de Contabilidade |

### 10. MEIO AMBIENTE

| API | Descrição | Dados Principais |
|-----|-----------|------------------|
| **CAR** | Cadastro Ambiental Rural | Shapefiles, dados |
| **INCRA** | Imóveis rurais | Coordenadas, área |
| **IBAMA** | Embargos e multas | Autuações ambientais |

### 11. UTILIDADES

| API | Descrição |
|-----|-----------|
| **Contas de Luz** | Cemig, CPFL, Light, Enel, etc. |
| **Contas de Água** | SABESP, SAESA |
| **CEP** | Consulta de CEP |
| **Correios** | Rastreamento de encomendas |

---

## APIS DOCUMENTADAS NESTE REPOSITORIO

| Arquivo | API |
|---------|-----|
| `API_RECEITA_FEDERAL_CPF.md` | Receita Federal / CPF |
| `API_RECEITA_FEDERAL_CNPJ.md` | Receita Federal / CNPJ |
| `API_TSE_DOADORES_FORNECEDORES.md` | TSE / Doadores e Fornecedores |
| `API_PORTAL_TRANSPARENCIA_BOLSA_FAMILIA.md` | Portal Transparência / Bolsa Família |
| `API_PORTAL_TRANSPARENCIA_BPC.md` | Portal Transparência / BPC |
| `API_PORTAL_TRANSPARENCIA_AUXILIO.md` | Portal Transparência / Auxílio Emergencial |
| `API_CNJ_SEEU_PROCESSOS.md` | CNJ / SEEU / Processos |
| `API_DETRAN_VEICULO.md` | DETRAN / Veículos (vários estados) |
| `API_TRIBUNAIS_CERTIDOES.md` | Tribunais / Certidões (TRFs e TJs) |
| `INFOSIMPLES_PLANOS_PRECOS.md` | Planos e Preços detalhados |

---

## DIFERENCIAIS TECNICOS

| Característica | Descrição |
|----------------|-----------|
| **Tempo de Resposta** | Milissegundos (não é RPA tradicional) |
| **Formato** | JSON (web service) |
| **Integração** | API REST simples |
| **Autenticação** | Token de API |

---

## BOAS-VINDAS

| Item | Valor |
|------|-------|
| **Crédito inicial** | R$ 100,00 |
| **Validade** | 12 meses de inatividade |

---

## CONTATO

| Canal | Informação |
|-------|------------|
| **Email** | suporte@infosimples.com.br |
| **Site** | https://infosimples.com |
| **APIs** | https://infosimples.com/consultas/ |
| **Preços** | https://infosimples.com/consultas/precos/ |
| **Estimativa** | https://infosimples.com/consultas/estimativa/ |

---

## VARIAVEIS DE AMBIENTE

```env
INFOSIMPLES_API_TOKEN=seu_token_aqui
```

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://infosimples.com
