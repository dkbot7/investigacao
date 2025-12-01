# API SERPRO - Consulta Renda

**Dados de Renda de Pessoas Físicas Declarados à Receita Federal**

---

## VISÃO GERAL

A API Consulta Renda permite consultar informações de renda de pessoas físicas declaradas oficialmente à Receita Federal do Brasil, mediante consentimento do titular.

É uma solução integrada à plataforma **Compartilha Receita**, que permite que o titular dos dados autorize, via e-CAC, o compartilhamento de suas informações fiscais com terceiros de forma segura e em conformidade com a LGPD.

### Por que usar?

- Dados oficiais de renda declarados à RFB
- Consentimento explícito do titular
- Conformidade com LGPD
- Redução de fraudes em operações de crédito
- Validação automatizada de capacidade financeira

---

## VANTAGENS E BENEFÍCIOS

### Benefícios do Serviço

- Melhora a qualidade da avaliação de crédito
- Minimiza o risco de fraudes
- Acesso a informações diretamente do Governo, sem intermediários
- Informações sempre atualizadas
- Segurança e confiabilidade da informação
- Possibilita automatizar consultas e verificação das informações

### Características da Contratação

- Contratação 100% online e sem taxa de instalação
- Modelo de cobrança pós-pago
- Liberação imediata de acesso desde que o cliente tenha um certificado digital e-CNPJ
- Quanto maior o consumo, menor o custo unitário
- Alta disponibilidade
- Cancelamento a qualquer momento, sem taxas ou multas

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

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) + TokenCompartilhamento |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-renda/ |
| **Loja** | https://loja.serpro.gov.br/consultarenda |

### Requisito Especial

- **TokenCompartilhamento**: Token gerado pelo titular da informação via e-CAC após autorizar o compartilhamento de dados de renda

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Passa por cada faixa até esgotar

### ⚠️ IMPORTANTE: Modelo de Cobrança Escalonado

O SERPRO usa um modelo **progressivo**, onde você paga cada faixa até esgotar:

1. **Faixa 1**: Até 999 consultas, paga R$ 0,6591/consulta
2. **Faixa 2**: De 1.000 a 9.999, paga R$ 0,5649/consulta
3. **Faixa 3**: De 10.000 a 49.999, paga R$ 0,3557/consulta
4. E assim por diante...

### Tabela de Preços (Novembro/2025)

| Faixa | Quantidade de Consultas | Valor por Consulta |
|-------|-------------------------|-------------------|
| 1 | Até 999 | R$ 0,6591 |
| 2 | De 1.000 a 9.999 | R$ 0,5649 |
| 3 | De 10.000 a 49.999 | R$ 0,3557 |
| 4 | De 50.000 a 99.999 | R$ 0,2616 |
| 5 | De 100.000 a 249.999 | R$ 0,1779 |
| 6 | De 250.000 a 499.999 | R$ 0,1569 |
| 7 | De 500.000 a 999.999 | R$ 0,1465 |
| 8 | De 1.000.000 a 1.499.999 | R$ 0,1360 |
| 9 | De 1.500.000 a 2.999.999 | R$ 0,1151 |
| 10 | De 3.000.000 a 4.499.999 | R$ 0,0732 |
| 11 | De 4.500.000 a 9.999.999 | R$ 0,0523 |
| 12 | De 10.000.000 a 16.999.999 | R$ 0,0314 |
| 13 | De 17.000.000 a 19.999.999 | R$ 0,0300 |
| 14 | De 20.000.000 a 24.999.999 | R$ 0,0290 |
| 15 | De 25.000.000 a 29.999.999 | R$ 0,0280 |
| 16 | Acima de 30.000.000 | R$ 0,0270 |

### Simulação de Custos (Modelo Escalonado)

| Consultas/Mês | Cálculo | Custo Total |
|---------------|---------|-------------|
| 100 | 100 × R$ 0,6591 | R$ 65,91 |
| 500 | 500 × R$ 0,6591 | R$ 329,55 |
| 1.000 | 999 × R$ 0,6591 + 1 × R$ 0,5649 | R$ 659,41 |
| 5.000 | Faixa 1 + 4.001 × R$ 0,5649 | R$ 2.919,65 |
| 10.000 | Faixas 1-2 + 1 × R$ 0,3557 | R$ 5.744,56 |

---

## CASOS DE USO

### 1. Análise de Crédito
Valide a renda declarada de solicitantes de crédito com dados oficiais da RFB.

### 2. Financiamentos Imobiliários
Confirme capacidade de pagamento em operações de financiamento.

### 3. Empréstimos Consignados
Verifique renda antes de conceder empréstimos.

### 4. Locação de Imóveis
Valide renda de locatários com dados oficiais.

### 5. Onboarding de Clientes
Automatize validação de renda no cadastro de novos clientes.

### 6. Due Diligence
Verifique informações de renda em processos de investigação.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta Renda
SERPRO_RENDA_CONSUMER_KEY=sua_consumer_key
SERPRO_RENDA_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/consultarenda
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
