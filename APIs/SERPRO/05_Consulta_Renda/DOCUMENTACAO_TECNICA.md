# API Consulta Renda - Documentação Técnica Completa

## 📋 Visão Geral

O serviço Consulta Renda é disponibilizado através do HTTP REST, oferecendo operação de consulta às informações de renda de Pessoas Físicas no Brasil, diretamente da base da Receita Federal.

**Contratos:** 260008 e 261071
**Versão Contratada:** V1
**Documentação Oficial:** https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-renda/

---

## 🔐 Autenticação

As APIs do SERPRO utilizam o protocolo **OAuth2** para autenticação e autorização de acesso.

### Credenciais do Contrato

**Consumer Key:** `sua_consumer_key_aqui` (obtenha em https://loja.serpro.gov.br/)
**Consumer Secret:** `seu_consumer_secret_aqui` (obtenha em https://loja.serpro.gov.br/)

⚠️ **IMPORTANTE:** O Consumer Key e Consumer Secret identificam seu contrato com o SERPRO. **Mantenha essas informações protegidas!**

### Passo a Passo para Autenticação

#### 1️⃣ Prepare as Credenciais em Base64

Concatene Consumer Key e Consumer Secret separados por `:` e converta para Base64:

```bash
echo -n "sua_consumer_key_aqui:seu_consumer_secret_aqui" | base64
```

**Resultado:**
```
base64_das_suas_credenciais
```

#### 2️⃣ Solicite o Token de Acesso (Bearer)

**Endpoint:** `POST https://gateway.apiserpro.serpro.gov.br/token`

**Headers:**
```
Authorization: Basic base64_das_suas_credenciais
Content-Type: application/x-www-form-urlencoded
```

**Body:**
```
grant_type=client_credentials
```

**Exemplo cURL:**
```bash
curl -k -H "Authorization: Basic base64_das_suas_credenciais" -d "grant_type=client_credentials" https://gateway.apiserpro.serpro.gov.br/token
```

⚠️ **Dica:** Se receber erro "415 Unsupported Media Type", certifique-se de incluir o header `Content-Type: application/x-www-form-urlencoded`

#### 3️⃣ Receba o Token de Acesso

**Resposta:**
```json
{
  "scope": "am_application_scope default",
  "token_type": "Bearer",
  "expires_in": 3600,
  "access_token": "c66a7def1c96f7008a0c397dc588b6d7"
}
```

**Campos:**
- `access_token`: Token de acesso a ser usado nas requisições
- `expires_in`: Tempo de validade em segundos (3600 = 1 hora)
- `token_type`: Tipo do token (Bearer)

#### 4️⃣ Use o Token nas Requisições

**Exemplo de Consulta:**
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1/renda/40442820135/2023" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer c66a7def1c96f7008a0c397dc588b6d7"
```

### ⏰ Renovação do Token

Tokens expiram em **1 hora (3600 segundos)**. Recomenda-se:
1. Armazenar o token e o horário de obtenção
2. Renovar automaticamente antes da expiração
3. Implementar tratamento de erro 401 (Unauthorized) para renovação emergencial

---

## 🌐 Endpoint Disponível

A API Consulta Renda oferece **1 endpoint** para consulta de informações de renda:

### Consulta Renda por CPF e Ano-Base

**Descrição:** Retorna informações de renda declaradas de uma pessoa física para um ano-base específico

**URL Produção:**
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1/renda/{cpf}/{anoBase}
```

**URL Trial:**
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-renda-trial/v1/renda/{cpf}/{anoBase}
```

**Parâmetros:**
- `{cpf}`: CPF da pessoa física (apenas números, 11 dígitos)
- `{anoBase}`: Ano-base da declaração (formato AAAA, ex: 2023)

**Exemplo:**
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1/renda/40442820135/2023" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Accept: application/json"
```

---

## 📊 Schema de Resposta

### Resposta de Sucesso (HTTP 200)

```json
{
  "cpf": "40442820135",
  "anoBase": "2023",
  "rendimentoTributavel": 85000.00,
  "rendimentoIsentoNaoTributavel": 12000.00,
  "rendimentoTributavelRecebidoDeJuridica": 80000.00,
  "rendimentoTributavelRecebidoDeFisica": 5000.00,
  "contribuicaoPrevidenciariaOficial": 9876.54,
  "pensaoAlimenticia": 0.00,
  "impostoPago": 15234.78,
  "rendimentoExterior": 0.00,
  "deducoesDependentes": 2275.08,
  "totalRendimentos": 97000.00,
  "situacao": "REGULAR"
}
```

### Descrição dos Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `cpf` | String | CPF consultado (11 dígitos) |
| `anoBase` | String | Ano-base da declaração (AAAA) |
| `rendimentoTributavel` | Decimal | Total de rendimentos tributáveis |
| `rendimentoIsentoNaoTributavel` | Decimal | Total de rendimentos isentos e não tributáveis |
| `rendimentoTributavelRecebidoDeJuridica` | Decimal | Rendimentos tributáveis recebidos de pessoa jurídica |
| `rendimentoTributavelRecebidoDeFisica` | Decimal | Rendimentos tributáveis recebidos de pessoa física |
| `contribuicaoPrevidenciariaOficial` | Decimal | Contribuição previdenciária oficial |
| `pensaoAlimenticia` | Decimal | Valor de pensão alimentícia pago |
| `impostoPago` | Decimal | Imposto de renda pago no ano-base |
| `rendimentoExterior` | Decimal | Rendimentos recebidos do exterior |
| `deducoesDependentes` | Decimal | Deduções com dependentes |
| `totalRendimentos` | Decimal | Total geral de rendimentos (tributáveis + isentos) |
| `situacao` | String | Situação da declaração (REGULAR, PENDENTE, RETIFICADA, etc.) |

**Observações:**
- Todos os valores monetários são em **Reais (BRL)**
- Valores decimais utilizam ponto (.) como separador
- Campos podem retornar `0.00` quando não há valor declarado
- O campo `situacao` pode ter os seguintes valores:
  - `REGULAR`: Declaração regular, sem pendências
  - `PENDENTE`: Declaração com pendências a resolver
  - `RETIFICADA`: Declaração foi retificada
  - `EM PROCESSAMENTO`: Declaração em processamento pela RFB

---

## 🔢 Códigos de Retorno HTTP

### Sucesso

| Código | Descrição | Bilhetado? | Quando Ocorre |
|--------|-----------|------------|---------------|
| **200** | OK | ✅ SIM | Consulta realizada com sucesso - Dados de renda encontrados |
| **404** | Not Found | ✅ SIM | CPF não possui declaração para o ano-base consultado |

### Erros do Cliente

| Código | Descrição | Bilhetado? | Quando Ocorre |
|--------|-----------|------------|---------------|
| **400** | Bad Request | ❌ NÃO | Requisição inválida (CPF ou ano-base com formato incorreto) |
| **401** | Unauthorized | ❌ NÃO | Token inválido, expirado ou não fornecido |
| **403** | Forbidden | ❌ NÃO | Acesso negado (sem permissão para este recurso) |

### Erros do Servidor

| Código | Descrição | Bilhetado? | Quando Ocorre |
|--------|-----------|------------|---------------|
| **500** | Internal Server Error | ❌ NÃO | Erro interno no servidor SERPRO |
| **502** | Bad Gateway | ❌ NÃO | Gateway inválido |
| **504** | Gateway Timeout | ❌ NÃO | Timeout no gateway (servidor demorou para responder) |

### 💰 Bilhetagem (Cobrança)

**Códigos que GERAM cobrança:**
- ✅ 200 (OK)
- ✅ 404 (Not Found)

**Códigos que NÃO geram cobrança:**
- ❌ 400, 401, 403 (erros do cliente)
- ❌ 500, 502, 504 (erros do servidor)

⚠️ **IMPORTANTE:** Consultas que retornam 404 (sem declaração para o ano-base) **são cobradas** normalmente!

---

## 🧪 Ambiente de Testes (Trial)

### CPFs e Anos para Teste

Use estes dados no ambiente Trial:

| CPF | Ano-Base | Situação | Descrição |
|-----|----------|----------|-----------|
| 40442820135 | 2023 | REGULAR | CPF com declaração regular |
| 40442820135 | 2022 | REGULAR | Mesmo CPF, ano anterior |
| 40442820135 | 2021 | REGULAR | Histórico de rendimentos |
| 63017285630 | 2023 | PENDENTE | Declaração com pendências |
| 91708635203 | 2023 | RETIFICADA | Declaração retificada |

### URL Trial

```
GET https://gateway.apiserpro.serpro.gov.br/consulta-renda-trial/v1/renda/{cpf}/{anoBase}
```

**Exemplo de Teste:**
```bash
# Obter token (mesmo processo)
TOKEN=$(curl -k -H "Authorization: Basic base64_das_suas_credenciais" -d "grant_type=client_credentials" https://gateway.apiserpro.serpro.gov.br/token | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Consulta no Trial
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-renda-trial/v1/renda/40442820135/2023" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📅 Anos-Base Disponíveis

A API disponibiliza dados de renda dos últimos **5 anos fiscais**.

**Anos disponíveis em 2025:**
- 2024 (ano-base mais recente)
- 2023
- 2022
- 2021
- 2020

⚠️ **ATENÇÃO:**
- Declarações do ano corrente podem não estar disponíveis até o término do prazo de entrega (geralmente 31 de maio)
- Dados de anos anteriores a 2020 podem não estar disponíveis
- Nem todos os CPFs possuem declaração para todos os anos (autônomos, menores valores de renda, etc.)

---

## 🔄 Casos de Uso Comuns

### 1. Análise de Crédito

```bash
# Verificar renda dos últimos 3 anos
for ano in 2024 2023 2022; do
  echo "Consultando ano $ano..."
  curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1/renda/40442820135/$ano" \
    -H "Authorization: Bearer $TOKEN"
done
```

**Uso:** Análise de capacidade de pagamento para concessão de crédito

---

### 2. Due Diligence

```bash
# Consulta para verificação de compatibilidade patrimonial
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1/renda/40442820135/2023" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Request-Tag: DUE_DILIGENCE_CLIENTE_123"
```

**Uso:** Verificação de compatibilidade entre renda declarada e patrimônio declarado

---

### 3. Compliance e KYC

```bash
# Consulta com timestamp para validade jurídica
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1/renda/40442820135/2023" \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-signature: 1" \
  -D headers.txt
```

**Uso:** Know Your Customer (KYC) com prova temporal da consulta

---

## 🏷️ Identificador Opcional de Requisições (X-Request-Tag)

### O que é?

O campo `X-Request-Tag` é um **cabeçalho opcional** que serve como identificador de requisições para fins de **agrupamento no faturamento**.

### Especificações

- **Tipo:** String (texto livre)
- **Tamanho máximo:** 32 caracteres
- **Validação:** Nenhuma (sem validação de conteúdo)
- **Obrigatório:** NÃO (totalmente opcional)

### Como Usar?

Adicione o header `X-Request-Tag` com um valor de até 32 caracteres:

```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1/renda/40442820135/2023" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "X-Request-Tag: DEPTO_CREDITO"
```

### Exemplos de Uso

```bash
# Por departamento
-H "X-Request-Tag: DEPTO_CREDITO"
-H "X-Request-Tag: DEPTO_JURIDICO"
-H "X-Request-Tag: DEPTO_COMPLIANCE"

# Por projeto
-H "X-Request-Tag: PROJETO_ANALISE_RISCO"
-H "X-Request-Tag: AUDITORIA_2025"

# Por cliente
-H "X-Request-Tag: CLIENTE_XYZ"
-H "X-Request-Tag: ONBOARDING_ABC"

# Por tipo de análise
-H "X-Request-Tag: ANALISE_CREDITO"
-H "X-Request-Tag: DUE_DILIGENCE"
-H "X-Request-Tag: KYC_VERIFICATION"
```

### Para que Serve?

O `X-Request-Tag` permite **agrupar consultas** no relatório de faturamento do SERPRO, facilitando:

1. **Rateio de Custos** - Identificar quanto cada departamento consumiu
2. **Análise de Uso** - Ver quais projetos/clientes geraram mais consultas
3. **Auditoria Interna** - Rastrear origem das consultas
4. **Controle Orçamentário** - Monitorar gastos por centro de custo

---

## 📄 Conformidade Legal

### LGPD (Lei Geral de Proteção de Dados)

⚠️ **ATENÇÃO:** Esta API retorna dados pessoais sensíveis (renda, CPF).

**Responsabilidades do Contratante:**
1. Ter **base legal** para o tratamento dos dados (Art. 7º da LGPD)
2. Coletar **apenas dados necessários** (princípio da minimização)
3. Informar o **titular** sobre o tratamento (transparência)
4. Implementar **medidas de segurança** adequadas
5. Manter **registro das operações** de tratamento

**Bases Legais Comuns:**
- Execução de contrato
- Legítimo interesse (análise de crédito)
- Proteção ao crédito
- Exercício regular de direito
- Consentimento do titular (quando aplicável)

**Finalidades Permitidas:**
- ✅ Análise de crédito e risco
- ✅ Due diligence para relações comerciais
- ✅ Compliance e prevenção à lavagem de dinheiro
- ✅ Verificação de capacidade financeira
- ❌ Discriminação (negada venda por baixa renda)
- ❌ Compartilhamento não autorizado
- ❌ Marketing direto sem consentimento

📌 **Consulte seu DPO (Data Protection Officer) antes de implementar!**

---

### Sigilo Fiscal

⚠️ **IMPORTANTE:** Dados de renda são protegidos por **sigilo fiscal** (Art. 198 do CTN).

**Quem pode consultar:**
- ✅ O próprio titular (com consentimento)
- ✅ Instituições financeiras (análise de crédito - Lei Complementar 105/2001)
- ✅ Empresas com relação comercial fundamentada
- ❌ Terceiros sem base legal
- ❌ Fins meramente informativos

**Recomendações:**
1. Coletar **consentimento** do titular sempre que possível
2. Documentar a **finalidade** da consulta
3. Manter **logs** de acesso
4. Implementar **controles** de segurança da informação
5. Treinar equipes sobre **confidencialidade**

---

## 📊 Modelo de Cobrança

### ⚠️ ATENÇÃO: Modelo Diferente!

A API Consulta Renda **NÃO utiliza modelo progressivo** como CPF e CNPJ.

**Modelo de Cobrança:** POR FAIXA DE VOLUME TOTAL

O preço unitário é determinado pelo **volume total de consultas** no mês.

### Como Funciona?

Se você fizer **50.000 consultas** em um mês:
- Você está na **Faixa 3** (10.000 a 49.999)
- **TODAS** as 50.000 consultas são cobradas a R$ 1,569 cada
- Total: 50.000 × R$ 1,569 = **R$ 78.450,00**

**DIFERENTE de CPF/CNPJ**, onde cada faixa tem seu preço:
- Faixa 1: 999 × R$ 0,659
- Faixa 2: 9.000 × R$ 0,565
- Faixa 3: 40.001 × R$ 0,356

### 💡 Dica de Economia

Como o preço é por faixa total:
- Planeje o volume mensal com antecedência
- Volumes maiores têm preço unitário menor
- Evite ultrapassar faixas por poucas consultas

**Exemplo:**
- **24.999 consultas:** Faixa 2 → 24.999 × R$ 1,569 = R$ 39.223,43
- **25.001 consultas:** Faixa 3 → 25.001 × R$ 1,517 = R$ 37.926,52

✅ Neste caso, **aumentar 2 consultas economiza R$ 1.296,91!**

---

## 🎁 Consultas Gratuitas

As **5 primeiras consultas** do mês são **GRATUITAS**!

**Exemplo:**
- Volume mensal: 100 consultas
- Consultas cobradas: 95
- Consultas grátis: 5
- Custo: 95 × R$ 1,569 = **R$ 149,06**

⚠️ **IMPORTANTE:** As 5 consultas gratuitas se aplicam a **todos** os volumes, inclusive Trial.

---

## 📞 Suporte

**E-mail:** css.serpro@serpro.gov.br
**Telefone:** 0800 728 2323
**Horário:** Segunda a Sexta, 7h às 19h (horário de Brasília)

**Central de Atendimento SERPRO:**
- **Canal Integrado:** Loja SERPRO → Gestão de Chaves → Suporte
- **API Center:** https://apicenter.estaleiro.serpro.gov.br/

---

## 🔗 Links Úteis

- **Documentação Oficial:** https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-renda/
- **Loja SERPRO:** https://loja.serpro.gov.br/
- **Gestão de Chaves:** https://loja.serpro.gov.br/ (acesso com e-CNPJ)
- **API Center:** https://apicenter.estaleiro.serpro.gov.br/

---

## ⚖️ Considerações Jurídicas

### Responsabilidade Civil

A consulta de dados de renda deve observar:
1. **Finalidade legítima** e documentada
2. **Proporcionalidade** no tratamento
3. **Segurança** no armazenamento
4. **Transparência** com o titular

### Uso Indevido

O uso indevido de dados pode acarretar:
- ⚠️ Sanções administrativas (LGPD)
- ⚠️ Multas de até 2% do faturamento ou R$ 50 milhões
- ⚠️ Responsabilidade civil por danos
- ⚠️ Crimes contra o sigilo fiscal

### Retenção de Dados

Recomendações:
- Armazenar apenas pelo **tempo necessário**
- Implementar **políticas de descarte**
- Documentar **ciclo de vida** dos dados
- Atender **direitos dos titulares** (acesso, retificação, exclusão)

---

**Documento gerado em:** 06/12/2025
**Última atualização:** 06/12/2025
**Versão:** 1.0
