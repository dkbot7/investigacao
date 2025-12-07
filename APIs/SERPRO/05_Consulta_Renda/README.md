# API Consulta Renda

## 📋 Visão Geral

Consulta de informações de renda de Pessoas Físicas diretamente da base da Receita Federal do Brasil.

**Contratos:** 260008 e 261071
**Status:** ✅ ATIVO
**Versão:** V1

---

## 📁 Arquivos nesta pasta

- **`DOCUMENTACAO_TECNICA.md`** - ⭐ Documentação técnica completa (schemas, endpoints, exemplos)
- **`GUIA_COMPLETO.md`** - ⭐ Guia prático com scripts prontos (Bash, Python, Node.js)
- **`PRECOS.csv`** - Tabela de preços (abre no Excel)
- **`API_CONSULTA_RENDA.md`** - Documentação adicional
- **`README.md`** - Este arquivo

## 📄 Contratos Oficiais

**Contrato 260008**
📎 `../contratos/29814517000104-pedido-473462-contrato-260008.pdf`

**Contrato 261071**
📎 `../contratos/29814517000104-pedido-473467-contrato-261071.pdf`

---

## 🔑 Token

Configure o token no arquivo `.env` da raiz:
```env
SERPRO_RENDA_TOKEN=seu_token_aqui
```

---

## 🚀 Quick Start

### Endpoint

```
GET https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1/renda/{cpf}/{anoBase}
```

### Exemplo cURL

```bash
# 1. Obter token
TOKEN=$(curl -k -H "Authorization: Basic M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh" -d "grant_type=client_credentials" https://gateway.apiserpro.serpro.gov.br/token | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# 2. Consultar Renda
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1/renda/40442820135/2023" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Dados Retornados

- **Rendimentos:**
  - Total de rendimentos
  - Rendimentos tributáveis
  - Rendimentos isentos/não tributáveis
  - Rendimentos do exterior

- **Origem:**
  - Recebidos de Pessoa Jurídica
  - Recebidos de Pessoa Física

- **Deduções:**
  - Contribuição previdenciária
  - Dependentes
  - Pensão alimentícia

- **Impostos:**
  - Imposto pago no ano-base

- **Status:**
  - Situação da declaração (REGULAR, PENDENTE, RETIFICADA, etc.)

---

## 💰 Preços

### ⚠️ MODELO POR FAIXA DE VOLUME TOTAL

**Primeiras 5 consultas:** GRATUITAS

| Volume | Preço Unitário | Exemplo de Custo |
|--------|----------------|------------------|
| 6 a 1.000.000 | R$ 1,569 | 100 consultas = R$ 149,06 |
| 1.000.001 a 2.000.000 | R$ 1,517 | 1.5M consultas = R$ 2.275.492,42 |
| 2.000.001 a 3.000.000 | R$ 1,465 | - |
| 3.000.001 a 4.000.000 | R$ 1,412 | - |
| 8.000.000+ | R$ 1,151 | - |

📊 Consulte `PRECOS.csv` para tabela completa com 10 faixas.

**⚠️ IMPORTANTE:** O preço é definido pelo volume total do mês, não é progressivo como CPF/CNPJ.

---

## 📅 Anos-Base Disponíveis

A API disponibiliza dados dos **últimos 5 anos fiscais**:
- 2024 (mais recente)
- 2023
- 2022
- 2021
- 2020

⚠️ **Atenção:** Nem todos os CPFs possuem declaração para todos os anos.

---

## 🔄 Casos de Uso

### 1. Análise de Crédito
Verificar capacidade de pagamento através do histórico de rendimentos.

### 2. Due Diligence
Compatibilidade entre renda declarada e patrimônio/movimentações.

### 3. Compliance e KYC
Validação de informações financeiras para Know Your Customer.

### 4. Avaliação de Risco
Análise de perfil financeiro para concessão de crédito ou investimentos.

---

## 📚 Recursos Incluídos

- ✅ Consulta de renda dos últimos 5 anos
- ✅ Dados detalhados da declaração IRPF
- ✅ 5 consultas gratuitas por mês
- ✅ X-Request-Tag para agrupamento de faturamento

---

## 🧪 CPFs para Teste (Trial)

| CPF | Ano | Situação |
|-----|-----|----------|
| 40442820135 | 2023 | REGULAR |
| 40442820135 | 2022 | REGULAR |
| 63017285630 | 2023 | PENDENTE |
| 91708635203 | 2023 | RETIFICADA |

**URL Trial:**
```
https://gateway.apiserpro.serpro.gov.br/consulta-renda-trial/v1/renda/{cpf}/{anoBase}
```

---

## 🔗 Links Úteis

- [Documentação Oficial](https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-renda/)
- [Loja SERPRO](https://loja.serpro.gov.br/)
- [Suporte](mailto:css.serpro@serpro.gov.br)

---

## 📖 Documentação Completa

Para informações detalhadas sobre:
- Autenticação OAuth2
- Schema completo de resposta
- Códigos HTTP e bilhetagem
- Scripts prontos para uso (Bash, Python, Node.js)
- Exemplos de consulta histórica
- LGPD e Sigilo Fiscal

📚 **Consulte:** `DOCUMENTACAO_TECNICA.md` e `GUIA_COMPLETO.md`

---

## ⚖️ Conformidade LGPD

⚠️ **DADOS SENSÍVEIS:** Esta API retorna informações protegidas por sigilo fiscal.

**Antes de usar, consulte:**
- Seu DPO (Data Protection Officer)
- Base legal para tratamento de dados
- Finalidade e necessidade da consulta
- Consentimento do titular (quando aplicável)

📌 Uso inadequado pode resultar em sanções administrativas e penais.
