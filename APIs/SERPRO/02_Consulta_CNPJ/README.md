# API Consulta CNPJ v2

## 📋 Visão Geral

Consulta de dados cadastrais de Pessoas Jurídicas diretamente da base da Receita Federal do Brasil.

**Contrato:** 260009
**Status:** ✅ ATIVO
**Versão:** V2 (Mercado Privado)

---

## 📁 Arquivos nesta pasta

- **`DOCUMENTACAO_TECNICA.md`** - ⭐ Documentação técnica completa (schemas, endpoints, exemplos)
- **`GUIA_COMPLETO.md`** - ⭐ Guia prático com scripts prontos (Bash, Python, Node.js)
- **`PRECOS_BASICA.csv`** - Tabela de preços Consulta Básica (abre no Excel)
- **`PRECOS_QSA.csv`** - Tabela de preços Consulta QSA (abre no Excel)
- **`PRECOS_EMPRESA.csv`** - Tabela de preços Consulta Empresa (abre no Excel)
- **`Anexo_V3.pdf`** - Tabela de Natureza Jurídica x Qualificação
- **`API_CONSULTA_CNPJ.md`** - Documentação adicional
- **`README.md`** - Este arquivo

## 📄 Contrato Oficial

**Contrato 260009**
📎 `../contratos/29814517000104-pedido-473456-contrato-260009.pdf`

---

## 🔑 Token

Configure o token no arquivo `.env` da raiz:
```env
SERPRO_CNPJ_TOKEN=seu_token_aqui
```

---

## 🚀 Quick Start

### Endpoints Disponíveis

#### 1. Consulta Básica
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/basica/{cnpj}
```

#### 2. Consulta QSA (CPF mascarado)
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/qsa/{cnpj}
```

#### 3. Consulta Empresa (CPF completo)
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/empresa/{cnpj}
```

### Exemplo cURL

```bash
# 1. Obter token
TOKEN=$(curl -k -H "Authorization: Basic M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh" -d "grant_type=client_credentials" https://gateway.apiserpro.serpro.gov.br/token | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# 2. Consultar CNPJ (Empresa com CPF completo)
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/empresa/34238864000168" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Dados Retornados

### Consulta Básica
- Razão social / Nome fantasia
- Situação cadastral
- Data de abertura
- CNAE principal
- Natureza jurídica
- Endereço completo
- Telefones e e-mail
- Capital social
- Porte da empresa

### Consulta QSA (+Básica)
- Quadro de Sócios e Administradores
- CPF dos sócios **MASCARADO** (`***000002**`)
- Qualificação dos sócios
- Data de entrada na sociedade

### Consulta Empresa (+Básica)
- Quadro de Sócios e Administradores
- CPF dos sócios **COMPLETO** (sem máscara)
- Qualificação dos sócios
- Data de entrada na sociedade

---

## 💰 Preços

### Consulta Básica
**Faixa 1:** R$ 0,659 por consulta (1 a 999 consultas)

### Consulta QSA
**Faixa 1:** R$ 0,868 por consulta (1 a 999 consultas)

### Consulta Empresa
**Faixa 1:** R$ 1,172 por consulta (1 a 999 consultas)

📊 Consulte os arquivos `PRECOS_*.csv` para tabela completa com 16 faixas de preço.

---

## 🔄 Diferenças Entre os Tipos de Consulta

| Característica | Básica | QSA | Empresa |
|----------------|--------|-----|---------|
| **Dados Cadastrais** | ✅ | ✅ | ✅ |
| **QSA Incluído** | ❌ | ✅ | ✅ |
| **CPF dos Sócios** | ❌ | ⚠️ Mascarado | ✅ Completo |
| **Preço (Faixa 1)** | R$ 0,659 | R$ 0,868 | R$ 1,172 |
| **Uso Recomendado** | Validação básica | Compliance sem LGPD | Due diligence completa |

---

## 📚 Recursos Incluídos

- ✅ Consulta Básica CNPJ
- ✅ Consulta QSA (CPF mascarado)
- ✅ Consulta Empresa (CPF completo)
- ✅ Check Time Stamp (Carimbo de Tempo)

---

## 🧪 CNPJs para Teste (Trial)

| CNPJ | Situação |
|------|----------|
| 34238864000168 | ATIVO |
| 54447820000155 | SUSPENSO |
| 46768703000165 | INAPTO |
| 31151791000184 | BAIXADO |
| 34428654000132 | NULO |

**URL Trial:**
```
https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df-trial/v2/{tipo}/{cnpj}
```

---

## 🔗 Links Úteis

- [Documentação Oficial V2](https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnpj/pt/consulta-cnpj-df-v2/)
- [Loja SERPRO](https://loja.serpro.gov.br/consultacnpj)
- [Suporte](mailto:css.serpro@serpro.gov.br)
- [Validador de Carimbo de Tempo](https://aplicacao.estaleiro.serpro.gov.br/check-time-stamp/)

---

## 📖 Documentação Completa

Para informações detalhadas sobre:
- Autenticação OAuth2
- Schemas completos de resposta
- Códigos HTTP e bilhetagem
- Tabelas de referência (qualificação de sócios, natureza jurídica, etc.)
- Scripts prontos para uso (Bash, Python, Node.js)
- Exemplos de uso com Carimbo de Tempo e X-Request-Tag

📚 **Consulte:** `DOCUMENTACAO_TECNICA.md` e `GUIA_COMPLETO.md`
