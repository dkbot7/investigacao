# API SERPRO - Consulta Faturamento

**Dados de Faturamento com a Segurança e Transparência da RFB**

---

## VISÃO GERAL

O Consulta Faturamento é um serviço de informação que permite a realização de consulta de dados de faturamento das empresas brasileiras de qualquer porte, baseado nas declarações enviadas à RFB.

É possível recuperar informações declaradas oficialmente e atualizadas das bases governamentais, realizando o compartilhamento dos dados mediante **consentimento do titular** por meio da plataforma Sistema de Autorização e Compartilhamento de Dados da RFB.

### Informações Disponibilizadas

- **Faturamento Declarado**
- **Dados Cadastrais**

### Por que usar?

A Consulta Faturamento é oferecida por meio de API com arquitetura simples, segura e escalonável, integrada à plataforma **Compartilha Receita**.

Essa solução da RFB permite que o titular dos dados autorize, via e-CAC, o compartilhamento de suas informações fiscais com terceiros, de forma **gratuita e consciente**.

---

## COMO FUNCIONA A AUTORIZAÇÃO

### Passo a Passo do Titular

| Etapa | Descrição |
|-------|-----------|
| **1. Informações** | O titular escolhe qual o **conjunto de dados** que deseja compartilhar via acesso ao Portal e-CAC da Receita Federal |
| **2. Vigência** | O titular escolhe a **vigência** do compartilhamento de dados |
| **3. Destinatário** | O titular escolhe o **CNPJ destinatário** do compartilhamento de dados |
| **4. Assinatura Digital** | O titular realiza assinatura digital do compartilhamento, gerando assim o **TokenCompartilhamento** |

### Consulta pelo Destinatário

O destinatário dos dados, ao realizar a consulta, informa o respectivo **TokenCompartilhamento** e recebe os dados criptografados, onde somente ele poderá decriptar.

---

## BENEFÍCIOS

### Do Risco à Oportunidade

Riscos e ineficiências que são superados com o serviço de Consulta Faturamento:

- Alto custo operacional na análise da solicitação de crédito
- Risco quanto à origem das informações possibilitando fraudes e inadimplência
- Adequação do processo atual ao normativo da LGPD
- Dificuldade na oferta de serviços adequados ao perfil do cliente

### Vantagens

- Dados oficiais declarados à Receita Federal
- Consentimento explícito do titular (LGPD)
- Segurança com criptografia ponta-a-ponta
- Informações atualizadas das bases governamentais

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) + TokenCompartilhamento |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/api-consulta-faturamento |
| **Loja** | https://loja.serpro.gov.br/consultafaturamento |

### Requisito Especial

- **TokenCompartilhamento**: Token gerado pelo titular da informação via e-CAC após autorizar o compartilhamento

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Faixa 1 GRATUITA** - primeiras 5 consultas sem custo!
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Passa por cada faixa até esgotar

### ⚠️ IMPORTANTE: Modelo de Cobrança Escalonado

O SERPRO usa um modelo **progressivo**, onde você paga cada faixa até esgotar:

1. **Faixa 1**: Primeiras 5 consultas são **GRATUITAS** (R$ 0,00)
2. **Faixa 2**: Das 6 até 25.000 consultas, paga R$ 3,6617/consulta
3. **Faixa 3**: Das 25.001 até 50.000, paga R$ 3,5466/consulta
4. E assim por diante...

### Tabela de Preços (Novembro/2025)

| Faixa | Quantidade de Consultas | Valor por Consulta |
|-------|-------------------------|-------------------|
| **Faixa 1 (GRÁTIS)** | De 1 a 5 | **R$ 0,00** |
| Faixa 2 | De 6 a 25.000 | R$ 3,6617 |
| Faixa 3 | De 25.001 a 50.000 | R$ 3,5466 |
| Faixa 4 | De 50.001 a 75.000 | R$ 3,4315 |
| Faixa 5 | De 75.001 a 100.000 | R$ 3,3165 |
| Faixa 6 | De 100.001 a 125.000 | R$ 3,2014 |
| Faixa 7 | De 125.001 a 150.000 | R$ 3,0863 |
| Faixa 8 | De 150.001 a 175.000 | R$ 2,9712 |
| Faixa 9 | De 175.001 a 200.000 | R$ 2,8561 |
| Faixa 10 | Acima de 200.000 | R$ 2,7410 |

### Simulação de Custos (Modelo Escalonado)

| Consultas/Mês | Cálculo | Custo Total |
|---------------|---------|-------------|
| 5 | Faixa 1 (grátis) | R$ 0,00 |
| 100 | 5 grátis + 95 × R$ 3,6617 | R$ 347,86 |
| 1.000 | 5 grátis + 995 × R$ 3,6617 | R$ 3.643,39 |
| 25.000 | 5 grátis + 24.995 × R$ 3,6617 | R$ 91.524,20 |
| 50.000 | Faixas 1-2 + 25.000 × R$ 3,5466 | R$ 180.189,20 |

---

## CASOS DE USO

### 1. Análise de Crédito
Avalie a capacidade de pagamento de empresas com base no faturamento declarado.

### 2. Due Diligence
Verifique o faturamento real de empresas em processos de M&A ou investimento.

### 3. Concessão de Financiamentos
Bancos podem validar faturamento declarado para concessão de empréstimos.

### 4. Licitações e Contratos
Confirme o porte da empresa baseado em faturamento oficial.

### 5. Compliance e LGPD
Acesse dados com consentimento explícito do titular, em conformidade com LGPD.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta Faturamento
SERPRO_FATURAMENTO_CONSUMER_KEY=sua_consumer_key
SERPRO_FATURAMENTO_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/consultafaturamento
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

**Documento atualizado em:** 29/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
