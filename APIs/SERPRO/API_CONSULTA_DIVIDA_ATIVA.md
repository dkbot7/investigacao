# API SERPRO - Consulta Dívida Ativa

**Consulta de Débitos Inscritos na Dívida Ativa da União**

---

## VISÃO GERAL

A API Consulta Dívida Ativa permite consultar débitos inscritos na Dívida Ativa da União diretamente da base de dados da Procuradoria-Geral da Fazenda Nacional (PGFN).

### O que é Dívida Ativa?

A Dívida Ativa da União representa os créditos da Fazenda Nacional (tributários e não tributários) que não foram pagos no prazo legal e foram inscritos para cobrança judicial ou extrajudicial.

---

## FUNCIONALIDADES

### 1. Consulta por Número de Inscrição

Submeta um número de inscrição na Dívida Ativa e obtenha dados cadastrais detalhados do débito.

### 2. Consulta por CPF/CNPJ do Devedor

Submeta um CPF ou CNPJ e obtenha:
- Lista de todas as inscrições de dívida ativa
- Informações cadastrais básicas do devedor
- Status de cada inscrição

---

## DADOS RETORNADOS

### Por Inscrição

| Campo | Descrição |
|-------|-----------|
| **numeroInscricao** | Número da inscrição na Dívida Ativa |
| **situacaoDescricao** | Status da dívida (ATIVA, EXTINTA, SUSPENSA, etc.) |
| **valorTotalConsolidadoMoeda** | Valor da inscrição individual |
| **dataInscricao** | Data da inscrição |
| **natureza** | Tributária ou Não-Tributária |
| **orgaoOrigem** | Órgão que originou a dívida |

### Por Devedor (CPF/CNPJ)

| Campo | Descrição |
|-------|-----------|
| **cpfCnpj** | CPF ou CNPJ do devedor |
| **nome** | Nome/Razão Social |
| **inscricoes[]** | Array com todas as inscrições |
| **totalInscricoes** | Quantidade de inscrições |

### Situações Possíveis

| Situação | Descrição |
|----------|-----------|
| ATIVA | Dívida em cobrança |
| SUSPENSA | Cobrança suspensa (parcelamento, judicial) |
| EXTINTA | Dívida quitada ou prescrita |
| GARANTIDA | Dívida com garantia oferecida |

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-divida-ativa/ |
| **Loja** | https://loja.serpro.gov.br/consultadividaativa |

### Endpoints Disponíveis

- `consulta-divida-ativa` - Consulta padrão
- `consulta-divida-ativa-df` - Consulta com dados detalhados

---

## CASOS DE USO

### 1. Due Diligence de Fornecedores
Verifique se fornecedores possuem débitos com a União antes de contratar.

### 2. Análise de Crédito
Identifique se clientes possuem dívidas ativas que podem indicar risco de crédito.

### 3. Compliance
Monitore a situação fiscal de parceiros comerciais.

### 4. Investigação Patrimonial
Identifique passivos fiscais em processos de investigação.

### 5. M&A (Fusões e Aquisições)
Levante passivos fiscais de empresas em processos de aquisição.

---

## IMPORTANTE

- O valor retornado (`valorTotalConsolidadoMoeda`) representa o valor de UMA inscrição individual
- Para calcular o total da dívida do devedor, é necessário **somar** os valores de todas as inscrições no array de resposta
- A consulta retorna **múltiplas inscrições** quando o devedor possui mais de um débito

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
| 12 | Acima de 10.000.000 | R$ 0,0314 |

### Simulação de Custos (Modelo Escalonado)

| Consultas/Mês | Cálculo | Custo Total |
|---------------|---------|-------------|
| 100 | 100 × R$ 0,6591 | R$ 65,91 |
| 500 | 500 × R$ 0,6591 | R$ 329,55 |
| 1.000 | 999 × R$ 0,6591 + 1 × R$ 0,5649 | R$ 659,41 |
| 5.000 | Faixa 1 + 4.001 × R$ 0,5649 | R$ 2.919,65 |
| 10.000 | Faixas 1-2 + 1 × R$ 0,3557 | R$ 5.744,56 |

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta Dívida Ativa
SERPRO_DIVIDA_ATIVA_CONSUMER_KEY=sua_consumer_key
SERPRO_DIVIDA_ATIVA_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/consultadividaativa
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
