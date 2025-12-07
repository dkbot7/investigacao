# API Consulta CNPJ v2 - Documentação Técnica Completa

## 📋 Visão Geral

O serviço Consulta CNPJ é disponibilizado através do HTTP REST, oferecendo operações de consulta às informações cadastrais de Pessoas Jurídicas no Brasil, diretamente da base da Receita Federal.

**Contrato:** 260009
**Versão Contratada:** V2 (Mercado Privado)
**Documentação Oficial:** https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnpj/pt/consulta-cnpj-df-v2/

---

## 🔐 Autenticação

As APIs do SERPRO utilizam o protocolo **OAuth2** para autenticação e autorização de acesso.

### Credenciais do Contrato

**Consumer Key:** `3q4kLDgTu__vUqPfaXQ07MUMOPIa`
**Consumer Secret:** `D_G99Fg5wHO10PNGYP49IYo2EaAa`

⚠️ **IMPORTANTE:** O Consumer Key e Consumer Secret identificam seu contrato com o SERPRO. **Mantenha essas informações protegidas!**

### Passo a Passo para Autenticação

#### 1️⃣ Prepare as Credenciais em Base64

Concatene Consumer Key e Consumer Secret separados por `:` e converta para Base64:

```bash
echo -n "3q4kLDgTu__vUqPfaXQ07MUMOPIa:D_G99Fg5wHO10PNGYP49IYo2EaAa" | base64
```

**Resultado:**
```
M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh
```

#### 2️⃣ Solicite o Token de Acesso (Bearer)

**Endpoint:** `POST https://gateway.apiserpro.serpro.gov.br/token`

**Headers:**
```
Authorization: Basic M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh
Content-Type: application/x-www-form-urlencoded
```

**Body:**
```
grant_type=client_credentials
```

**Exemplo cURL:**
```bash
curl -k -H "Authorization: Basic M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh" -d "grant_type=client_credentials" https://gateway.apiserpro.serpro.gov.br/token
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

**Exemplo de Consulta Básica:**
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/basica/34238864000168" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer c66a7def1c96f7008a0c397dc588b6d7"
```

### ⏰ Renovação do Token

Tokens expiram em **1 hora (3600 segundos)**. Recomenda-se:
1. Armazenar o token e o horário de obtenção
2. Renovar automaticamente antes da expiração
3. Implementar tratamento de erro 401 (Unauthorized) para renovação emergencial

---

## 🌐 Endpoints Disponíveis

A API Consulta CNPJ v2 oferece **3 tipos de consulta** com níveis diferentes de informação:

### 1. Consulta Básica (`/basica/{ni}`)

**Descrição:** Retorna informações básicas da empresa (dados cadastrais principais)

**URL Produção:**
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/basica/{ni}
```

**URL Trial:**
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df-trial/v2/basica/{ni}
```

**Parâmetros:**
- `{ni}`: CNPJ (apenas números, 14 dígitos)

**Exemplo:**
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/basica/34238864000168" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Accept: application/json"
```

---

### 2. Consulta QSA (`/qsa/{ni}`)

**Descrição:** Retorna informações básicas + QSA (Quadro de Sócios e Administradores) **sem CPF dos sócios**

**URL Produção:**
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/qsa/{ni}
```

**URL Trial:**
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df-trial/v2/qsa/{ni}
```

**Parâmetros:**
- `{ni}`: CNPJ (apenas números, 14 dígitos)

**Exemplo:**
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/qsa/34238864000168" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Accept: application/json"
```

---

### 3. Consulta Empresa (`/empresa/{ni}`)

**Descrição:** Retorna informações completas da empresa incluindo QSA **com CPF dos sócios**

**URL Produção:**
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/empresa/{ni}
```

**URL Trial:**
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df-trial/v2/empresa/{ni}
```

**Parâmetros:**
- `{ni}`: CNPJ (apenas números, 14 dígitos)

**Exemplo:**
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/empresa/34238864000168" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Accept: application/json"
```

---

## 📊 Schemas de Resposta

### Schema: Consulta Básica

```json
{
  "ni": "34238864000168",
  "data_abertura": "2011-01-12",
  "nome_empresarial": "SERVICO FEDERAL DE PROCESSAMENTO DE DADOS (SERPRO)",
  "nome_fantasia": "SERPRO BRASILIA",
  "cnae_principal": {
    "codigo": "6311900",
    "descricao": "Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet"
  },
  "natureza_juridica": {
    "codigo": "2038",
    "descricao": "Empresa Pública"
  },
  "endereco": {
    "logradouro": "SRTVN 701 VIA W 5 NORTE",
    "numero": "S/N",
    "complemento": "BLOCO A EDIFICIO SEDE",
    "cep": "70719900",
    "bairro": "ASA NORTE",
    "municipio": "BRASILIA",
    "uf": "DF"
  },
  "situacao_especial": "",
  "situacao_cadastral": {
    "codigo": "2",
    "data": "2004-05-22",
    "motivo": ""
  },
  "orgao_registro": "0110100",
  "tipo_estabelecimento": "1",
  "correio_eletronico": "atendimento@serpro.gov.br",
  "capital_social": "0",
  "porte": "05",
  "telefones": [
    {
      "ddd": "061",
      "numero": "34412702"
    }
  ],
  "nome_orgao": "MINISTERIO DA FAZENDA",
  "ente_federativo": "BR"
}
```

### Schema: Consulta QSA

Retorna todos os campos da **Consulta Básica** + array `qsa`:

```json
{
  "ni": "34238864000168",
  "data_abertura": "2011-01-12",
  "nome_empresarial": "...",
  "...": "...",
  "qsa": [
    {
      "nome_socio": "GILBERTO KASSAB",
      "codigo_qualificacao_socio": "05",
      "qualificacao_socio": "Administrador",
      "codigo_pais_socio_estrangeiro": "",
      "nome_pais_socio_estrangeiro": "",
      "cpf_cnpj_socio": "***000002**",
      "data_entrada_sociedade": "2016-05-12",
      "cpf_representante_legal": "***000000**",
      "nome_representante_legal": "",
      "codigo_qualificacao_representante_legal": "00",
      "qualificacao_representante_legal": "Não informada"
    }
  ]
}
```

⚠️ **ATENÇÃO:** Na consulta QSA, o campo `cpf_cnpj_socio` retorna **CPF mascarado** (`***000002**`)

### Schema: Consulta Empresa

Retorna todos os campos da **Consulta Básica** + array `socios`:

```json
{
  "ni": "34238864000168",
  "data_abertura": "2011-01-12",
  "nome_empresarial": "...",
  "...": "...",
  "socios": [
    {
      "nome_socio": "GILBERTO KASSAB",
      "codigo_qualificacao_socio": "05",
      "qualificacao_socio": "Administrador",
      "codigo_pais_socio_estrangeiro": "",
      "nome_pais_socio_estrangeiro": "",
      "cpf_cnpj_socio": "40001447887",
      "data_entrada_sociedade": "2016-05-12",
      "cpf_representante_legal": "00000000000",
      "nome_representante_legal": "",
      "codigo_qualificacao_representante_legal": "00",
      "qualificacao_representante_legal": "Não informada"
    }
  ]
}
```

✅ **DIFERENÇA:** Na consulta Empresa, o campo `cpf_cnpj_socio` retorna **CPF completo** sem máscara

---

## 📖 Descrição dos Campos

### Campos Principais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `ni` | String | CNPJ (14 dígitos) |
| `data_abertura` | String | Data de abertura no formato AAAA-MM-DD |
| `nome_empresarial` | String | Razão social / Nome empresarial |
| `nome_fantasia` | String | Nome fantasia |
| `cnae_principal` | Object | CNAE principal (código e descrição) |
| `natureza_juridica` | Object | Natureza jurídica (código e descrição) |
| `endereco` | Object | Endereço completo do estabelecimento |
| `situacao_cadastral` | Object | Situação cadastral (código, data, motivo) |
| `situacao_especial` | String | Situação especial |
| `orgao_registro` | String | Código do órgão de registro |
| `nome_orgao` | String | Nome do órgão supervisor |
| `tipo_estabelecimento` | String | Tipo: 1=Matriz, 2=Filial |
| `correio_eletronico` | String | E-mail |
| `capital_social` | String | Capital social |
| `porte` | String | Porte da empresa |
| `telefones` | Array | Lista de telefones (DDD + número) |
| `ente_federativo` | String | Ente federativo responsável |

### Objeto: CNAE Principal

```json
{
  "codigo": "6311900",
  "descricao": "Tratamento de dados, provedores de serviços de aplicação..."
}
```

### Objeto: Natureza Jurídica

```json
{
  "codigo": "2038",
  "descricao": "Empresa Pública"
}
```

### Objeto: Endereço

```json
{
  "logradouro": "SRTVN 701 VIA W 5 NORTE",
  "numero": "S/N",
  "complemento": "BLOCO A EDIFICIO SEDE",
  "cep": "70719900",
  "bairro": "ASA NORTE",
  "municipio": "BRASILIA",
  "uf": "DF"
}
```

### Objeto: Situação Cadastral

```json
{
  "codigo": "2",
  "data": "2004-05-22",
  "motivo": ""
}
```

### Array: QSA / Sócios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome_socio` | String | Nome do sócio ou administrador |
| `codigo_qualificacao_socio` | String | Código da qualificação (ver tabela) |
| `qualificacao_socio` | String | Descrição da qualificação |
| `codigo_pais_socio_estrangeiro` | String | Código do país (se estrangeiro) |
| `nome_pais_socio_estrangeiro` | String | Nome do país (se estrangeiro) |
| `cpf_cnpj_socio` | String | CPF/CNPJ do sócio (mascarado no /qsa, completo no /empresa) |
| `data_entrada_sociedade` | String | Data de entrada no QSA (AAAA-MM-DD) |
| `cpf_representante_legal` | String | CPF do representante legal |
| `nome_representante_legal` | String | Nome do representante legal |
| `codigo_qualificacao_representante_legal` | String | Código qualificação do representante |
| `qualificacao_representante_legal` | String | Descrição qualificação do representante |

---

## 📋 Tabelas de Referência

### Tipo de Estabelecimento

| Código | Descrição |
|--------|-----------|
| 1 | Matriz |
| 2 | Filial |

### Porte da Empresa

| Código | Descrição |
|--------|-----------|
| 00 | Não informado |
| 01 | Micro Empresa |
| 03 | Empresa de Pequeno Porte |
| 05 | Demais |

### Situação Cadastral

| Código | Descrição |
|--------|-----------|
| 1 | Nula |
| 2 | Ativa |
| 3 | Suspensa |
| 4 | Inapta |
| 8 | Baixada |

### Tipo de Sócio

| Código | Descrição |
|--------|-----------|
| 1 | Pessoa Jurídica |
| 2 | Pessoa Física |
| 3 | Estrangeiro |

### Qualificação do Sócio (Exemplos)

| Código | Descrição |
|--------|-----------|
| 05 | Administrador |
| 08 | Conselheiro de Administração |
| 10 | Diretor |
| 16 | Presidente |
| 17 | Procurador |
| 22 | Sócio |
| 28 | Sócio Pessoa Física Residente no Exterior |
| 37 | Sócio Pessoa Jurídica Domiciliado no Exterior |
| 49 | Sócio-Administrador |
| 52 | Sócio Capitalista |
| 53 | Sócio Comanditado |
| 54 | Sócio Comanditário |
| 55 | Sócio de Indústria |
| 56 | Sócio-Gerente |
| 57 | Sócio Incapaz ou Relat.Incapaz (exceto menor) |
| 58 | Sócio Menor (Assistido/Representado) |
| 59 | Sócio Ostensivo |
| 63 | Sócio Quotista |

📎 **Referência Completa:** Consulte o arquivo `Anexo_V3.pdf` nesta pasta para a tabela completa de Natureza Jurídica x Qualificação do Representante.

---

## 🔢 Códigos de Retorno HTTP

### Sucesso

| Código | Descrição | Bilhetado? | Quando Ocorre |
|--------|-----------|------------|---------------|
| **200** | OK | ✅ SIM | Consulta realizada com sucesso - CNPJ encontrado com todos os dados |
| **206** | Partial Content | ✅ SIM | Conteúdo parcial - CNPJ encontrado mas com dados incompletos |
| **404** | Not Found | ✅ SIM | CNPJ não encontrado na base da Receita Federal |

### Erros do Cliente

| Código | Descrição | Bilhetado? | Quando Ocorre |
|--------|-----------|------------|---------------|
| **400** | Bad Request | ❌ NÃO | Requisição inválida (CNPJ com formato incorreto, parâmetros faltando) |
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
- ✅ 206 (Partial Content)
- ✅ 404 (Not Found)

**Códigos que NÃO geram cobrança:**
- ❌ 400, 401, 403 (erros do cliente)
- ❌ 500, 502, 504 (erros do servidor)

⚠️ **IMPORTANTE:** Consultas que retornam 404 (CNPJ não encontrado) **são cobradas** normalmente!

---

## 🧪 Ambiente de Testes (Trial)

### CNPJs para Teste

Use estes CNPJs no ambiente Trial:

| CNPJ | Situação Cadastral | Uso |
|------|-------------------|-----|
| 34238864000168 | ATIVO | Testes de consulta com sucesso |
| 54447820000155 | SUSPENSO | Testes com empresa suspensa |
| 46768703000165 | INAPTO | Testes com empresa inapta |
| 31151791000184 | BAIXADO | Testes com empresa baixada |
| 34428654000132 | NULO | Testes com CNPJ nulo |

### URLs Trial

```
Básica:  https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df-trial/v2/basica/{ni}
QSA:     https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df-trial/v2/qsa/{ni}
Empresa: https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df-trial/v2/empresa/{ni}
```

**Exemplo de Teste:**
```bash
# Obter token (mesmo processo)
TOKEN=$(curl -k -H "Authorization: Basic M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh" -d "grant_type=client_credentials" https://gateway.apiserpro.serpro.gov.br/token | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Consulta básica no Trial
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df-trial/v2/basica/34238864000168" \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⏱️ Carimbo de Tempo (Time Stamp)

O **Carimbo de Tempo** é um serviço **GRATUITO e OPCIONAL** oferecido pelo SERPRO para conferir validade jurídica às consultas realizadas.

### O que é?

É uma **assinatura digital** emitida por uma **Autoridade de Carimbo de Tempo (ACT)** credenciada pela ICP-Brasil que:
- Comprova a **data e hora exata** da consulta
- Garante a **integridade dos dados** retornados
- Tem **validade jurídica** reconhecida

### Como Usar?

Adicione o header `x-signature: 1` na requisição:

```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/basica/34238864000168" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "x-signature: 1"
```

### Resposta com Carimbo de Tempo

A resposta incluirá o header `stamp` com a assinatura digital em formato Base64:

**Headers da Resposta:**
```
HTTP/1.1 200 OK
Content-Type: application/json
stamp: MIIR3QYJKoZIhvcNAQcCoIIRzjCCEcoCAQExDTALBglghkgBZQMEAgEwCwYJKoZIhvcNAQcBoII...
```

### Validação do Carimbo

Para validar o carimbo de tempo, use o validador oficial do SERPRO:

🔗 **Validador:** https://aplicacao.estaleiro.serpro.gov.br/check-time-stamp/

**Como validar:**
1. Acesse o validador
2. Cole o valor do header `stamp`
3. Cole o JSON retornado na consulta
4. Clique em "Validar"
5. O sistema confirmará a autenticidade e mostrará data/hora da consulta

### Quando Usar?

Recomendado para:
- ✅ Processos judiciais
- ✅ Auditorias
- ✅ Compliance regulatório
- ✅ Due diligence com validade jurídica
- ✅ Investigações que necessitem prova temporal

### Custo

**GRATUITO** - Não há custo adicional para usar o Carimbo de Tempo!

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
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/basica/34238864000168" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "X-Request-Tag: DEPTO_FINANCEIRO"
```

### Exemplos de Uso

```bash
# Por departamento
-H "X-Request-Tag: DEPTO_RH"
-H "X-Request-Tag: DEPTO_JURIDICO"
-H "X-Request-Tag: DEPTO_COMPLIANCE"

# Por projeto
-H "X-Request-Tag: PROJETO_ABC"
-H "X-Request-Tag: AUDITORIA_2025"

# Por cliente
-H "X-Request-Tag: CLIENTE_XYZ"
-H "X-Request-Tag: CASE_123"

# Por tipo de consulta
-H "X-Request-Tag: ONBOARDING"
-H "X-Request-Tag: DUE_DILIGENCE"
-H "X-Request-Tag: MONITORING"
```

### Para que Serve?

O `X-Request-Tag` permite **agrupar consultas** no relatório de faturamento do SERPRO, facilitando:

1. **Rateio de Custos** - Identificar quanto cada departamento consumiu
2. **Análise de Uso** - Ver quais projetos/clientes geraram mais consultas
3. **Auditoria Interna** - Rastrear origem das consultas
4. **Controle Orçamentário** - Monitorar gastos por centro de custo

### Exemplo Completo

```bash
# Consulta com Tag
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/empresa/34238864000168" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "X-Request-Tag: ONBOARDING_CLIENTE_ABC" \
  -H "Accept: application/json"

# Consulta com Tag + Carimbo de Tempo
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2/empresa/34238864000168" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "X-Request-Tag: PROCESSO_JUDICIAL_789" \
  -H "x-signature: 1" \
  -H "Accept: application/json"
```

### Benefícios

- ✅ Sem custo adicional
- ✅ Facilita gestão financeira
- ✅ Melhora rastreabilidade
- ✅ Simplifica rateio entre departamentos
- ✅ Não afeta performance da API

---

## 🔄 Diferenças Entre os 3 Tipos de Consulta

| Característica | Consulta Básica | Consulta QSA | Consulta Empresa |
|----------------|----------------|--------------|------------------|
| **Endpoint** | `/basica/{ni}` | `/qsa/{ni}` | `/empresa/{ni}` |
| **Dados Cadastrais** | ✅ Sim | ✅ Sim | ✅ Sim |
| **QSA Incluído** | ❌ Não | ✅ Sim | ✅ Sim |
| **CPF dos Sócios** | ❌ Não | ❌ Mascarado (`***000002**`) | ✅ Completo |
| **Preço (Faixa 1)** | R$ 0,659 | R$ 0,868 | R$ 1,172 |
| **Uso Recomendado** | Validação básica | Due diligence sem LGPD | Investigação completa |

### Quando Usar Cada Tipo?

**Consulta Básica** (`/basica`)
- ✅ Validação de existência da empresa
- ✅ Verificação de situação cadastral
- ✅ Confirmação de endereço/contato
- ✅ Menor custo

**Consulta QSA** (`/qsa`)
- ✅ Análise de estrutura societária
- ✅ Identificação de administradores
- ✅ Compliance básico
- ✅ Quando não precisa de CPF dos sócios

**Consulta Empresa** (`/empresa`)
- ✅ Due diligence completa
- ✅ Investigação de vínculos societários
- ✅ Background check aprofundado
- ✅ Quando precisa de CPF dos sócios para cruzamento

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

- **Documentação Oficial:** https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnpj/pt/consulta-cnpj-df-v2/
- **Loja SERPRO:** https://loja.serpro.gov.br/consultacnpj
- **Gestão de Chaves:** https://loja.serpro.gov.br/ (acesso com e-CNPJ)
- **Validador de Carimbo de Tempo:** https://aplicacao.estaleiro.serpro.gov.br/check-time-stamp/
- **API Center:** https://apicenter.estaleiro.serpro.gov.br/

---

## 📄 Conformidade Legal

### LGPD (Lei Geral de Proteção de Dados)

⚠️ **ATENÇÃO:** Esta API retorna dados pessoais (CPF, nome, endereço).

**Responsabilidades do Contratante:**
1. Ter **base legal** para o tratamento dos dados (Art. 7º da LGPD)
2. Coletar **apenas dados necessários** (princípio da minimização)
3. Informar o **titular** sobre o tratamento (transparência)
4. Implementar **medidas de segurança** adequadas
5. Manter **registro das operações** de tratamento

**Bases Legais Comuns:**
- Execução de contrato
- Legítimo interesse
- Proteção ao crédito
- Exercício regular de direito

📌 **Consulte seu DPO (Data Protection Officer) antes de implementar!**

---

**Documento gerado em:** 06/12/2025
**Última atualização:** 06/12/2025
**Versão:** 1.0
