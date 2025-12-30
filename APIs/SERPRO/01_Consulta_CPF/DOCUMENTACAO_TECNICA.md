# API Consulta CPF - Documentação Técnica Completa

## 📋 Visão Geral

O serviço Consulta CPF é disponibilizado através do HTTP REST, oferecendo operação de consulta às informações cadastrais de Pessoas Físicas no Brasil.

**Contrato:** 260005
**Versão Contratada:** V2 (Direto na Faixa)

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
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/40442820135" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer c66a7def1c96f7008a0c397dc588b6d7"
```

**Resposta Esperada:**
```json
{
  "ni": "40442820135",
  "nome": "PESSOA FISICA DA SILVA",
  "situacao": {
    "codigo": "0",
    "descricao": "REGULAR"
  },
  "nascimento": "14111970",
  "dataInscricao": "20091985"
}
```

### ⏰ Renovação do Token

- ⏱️ **Validade:** 1 hora (3600 segundos)
- 🔄 **Quando renovar:** Quando receber erro HTTP 401 (Unauthorized)
- ♻️ **Como renovar:** Repita o Passo 2 para obter novo token
- 💡 **Recomendação:** Gere um novo token a cada hora preventivamente

---

## 🌐 Servidores

### Produção (V2 - Direto na Faixa)
```
https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2
```

### Trial (Degustação)
```
https://gateway.apiserpro.serpro.gov.br/consulta-cpf-trial/v2
```

### Outras Versões Disponíveis

**V1 - Direto na Faixa:**
```
https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v1
```

**V1 - Padrão:**
```
https://gateway.apiserpro.serpro.gov.br/consulta-cpf/v1
```

---

## 📡 Endpoints Disponíveis

### 1. Consulta CPF

**Método:** `GET`
**Path:** `/cpf/{ni}`
**Descrição:** Retorna os dados do Cadastro de Pessoa Física (CPF)

**Parâmetros:**
- `{ni}` - Número de Inscrição do CPF (11 dígitos, apenas números)

**Exemplo de Requisição:**
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/99999999999" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

### 2. Status da API

**Método:** `GET`
**Path:** `/status`
**Descrição:** Retorna o status da API CPF

**Exemplo de Requisição:**
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/status" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📊 Schemas de Resposta

### CPF (V2)

```json
{
  "ni": "99999999999",
  "nome": "PESSOA FISICA DA SILVA",
  "situacao": {
    "codigo": "0",
    "descricao": "REGULAR"
  },
  "nascimento": "01051976",
  "obito": "2023",
  "dataInscricao": "10051976",
  "nomeSocial": "PESSOA FISICA DA SILVA SOCIAL"
}
```

**Campos:**

| Campo | Tipo | Obrigatório | Formato | Descrição |
|-------|------|-------------|---------|-----------|
| `ni` | string | ✅ Sim | 99999999999 | Número de Inscrição no Cadastro de Pessoa Física |
| `nome` | string | ✅ Sim | - | Nome da Pessoa Física |
| `situacao` | object | ✅ Sim | {...} | Situação Cadastral da Pessoa Física, formada por dois campos |
| `situacao.codigo` | string | ✅ Sim | "0" a "9" | Código da Situação Cadastral |
| `situacao.descricao` | string | ✅ Sim | - | Descrição da Situação Cadastral |
| `nascimento` | string | ✅ Sim | DDMMAAAA | Data de Nascimento da Pessoa Física |
| `obito` | string | ⚠️ Opcional | AAAA | Ano de Óbito da Pessoa Física |
| `dataInscricao` | string | ⚠️ Opcional* | DDMMAAAA | Data de Inscrição da Pessoa Física |
| `nomeSocial` | string | ⚠️ Opcional | - | Nome Social da Pessoa Física |

**⚠️ Observação sobre `dataInscricao`:**
Apesar de ser opcional (porque foi incluído na base depois da criação do cadastro), quando este campo está ausente a API retorna código **206 (Conteúdo Parcial)**. Na prática, se comporta como obrigatório devido à sua importância

---

### CPF (V1)

```json
{
  "ni": "99999999999",
  "nome": "PESSOA FISICA DA SILVA",
  "situacao": {
    "codigo": "0",
    "descricao": "REGULAR"
  },
  "nascimento": "31011800",
  "obito": "1800"
}
```

**Diferenças V1 vs V2:**
- ❌ V1 não retorna `dataInscricao`
- ❌ V1 não retorna `nomeSocial`
- ✅ V2 tem campos adicionais

---

## 🔢 Códigos de Situação Cadastral

| Código | Descrição | Significado |
|--------|-----------|-------------|
| 0 | REGULAR | CPF regular, sem restrições |
| 2 | SUSPENSA | CPF com situação suspensa |
| 3 | TITULAR FALECIDO | CPF de pessoa falecida |
| 4 | PENDENTE DE REGULARIZAÇÃO | Precisa regularizar situação |
| 5 | CANCELADA POR MULTIPLICIDADE | CPF cancelado por duplicidade |
| 8 | NULA | CPF com situação nula |
| 9 | CANCELADA DE OFÍCIO | CPF cancelado pela RFB |

---

## 📝 Exemplo Completo de Uso

### 1. Obter Token de Acesso

```bash
curl -X POST "https://gateway.apiserpro.serpro.gov.br/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -u "sua_consumer_key_aqui:seu_consumer_secret_aqui"
```

**Resposta:**
```json
{
  "access_token": "seu_token_jwt_aqui",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### 2. Consultar CPF

```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/40442820135" \
  -H "Authorization: Bearer seu_token_jwt_aqui"
```

**Resposta de Sucesso (200):**
```json
{
  "ni": "40442820135",
  "nome": "PESSOA FISICA DA SILVA",
  "situacao": {
    "codigo": "0",
    "descricao": "REGULAR"
  },
  "nascimento": "15081970",
  "dataInscricao": "20091985"
}
```

---

## ⚠️ Códigos de Retorno HTTP

### 💰 Códigos Bilhetados vs Não Bilhetados

**⚠️ IMPORTANTE:** Os seguintes códigos **NÃO serão bilhetados** no faturamento:
- `400` (Requisição inválida)
- `401` (Não autorizado)
- `403` (Proibido)
- `500` (Erro no servidor)
- `504` (Tempo Esgotado do Gateway)

**✅ Códigos Bilhetados:**
- `200` (OK)
- `206` (Conteúdo Parcial)
- `404` (Não Encontrado)
- `422` (LGPD: Dados de Menor de Idade)

---

### 200 - OK ✅ BILHETADO
**Descrição:** Tudo funcionou como esperado e a validação dos dados foi realizada com sucesso.

```json
{
  "ni": "40442820135",
  "nome": "PESSOA FISICA DA SILVA",
  "situacao": {
    "codigo": "0",
    "descricao": "REGULAR"
  },
  "nascimento": "15081970",
  "dataInscricao": "20091985"
}
```

---

### 206 - Conteúdo Parcial ✅ BILHETADO
**Descrição:** As informações foram retornadas, mas não completamente.

**Quando ocorre:**
- Quando o registro de CPF não possui `dataInscricao`
- Ou quando outro campo considerado de retorno obrigatório está faltando

**⚠️ IMPORTANTE:** Apesar do campo `dataInscricao` ser opcional (porque foi incluído na base de CPF algum tempo depois da criação do cadastro), o código 206 será retornado quando este campo estiver faltando. Na prática este campo se comporta como obrigatório devido à sua importância.

```json
{
  "ni": "99999999999",
  "nome": "PESSOA FISICA DA SILVA",
  "situacao": {
    "codigo": "0",
    "descricao": "REGULAR"
  },
  "nascimento": "15081970"
  // dataInscricao ausente - retorna 206
}
```

---

### 400 - Requisição Inválida ❌ NÃO BILHETADO
**Descrição:** O número de CPF informado não é válido.

**Causas:**
- CPF com formato inválido
- CPF com dígitos verificadores incorretos
- CPF com caracteres não numéricos

```json
{
  "error": "invalid_request",
  "error_description": "O número de CPF informado não é válido"
}
```

**Exemplo:**
```bash
# CPF inválido (dígitos verificadores errados)
GET /cpf/12345678901
# Retorna: 400
```

---

### 401 - Não Autorizado ❌ NÃO BILHETADO
**Descrição:** Problemas durante a autenticação.

**Causas:**
- Token de acesso inválido
- Token expirado
- Credenciais incorretas
- Consumer Key/Secret inválidos

```json
{
  "error": "invalid_token",
  "error_description": "Token inválido ou expirado"
}
```

---

### 403 - Proibido ❌ NÃO BILHETADO
**Descrição:** Este erro ocorre quando há algum caminho errado na requisição.

**Causa:** URL da requisição está incorreta.

**✅ Correto:**
```
https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/{ni}
```

**❌ Incorreto:**
```
https://gateway.apiserpro.serpro.gov.br/consulta-cpf/cpf/{ni}
https://gateway.apiserpro.serpro.gov.br/cpf/{ni}
```

---

### 404 - Não Encontrado ✅ BILHETADO
**Descrição:** Não existe CPF com o número de inscrição informado.

**Causa:** CPF consultado não existe na base da Receita Federal.

```json
{
  "error": "not_found",
  "error_description": "Não existe CPF com o número de inscrição informado"
}
```

**⚠️ ATENÇÃO:** Este código **É BILHETADO** mesmo não retornando dados!

---

### 422 - LGPD: Dados de Menor de Idade ✅ BILHETADO
**Descrição:** Dados de menor de idade bloqueados em atendimento à Lei Geral de Proteção de Dados - LGPD.

**Legislação:**
- **Lei Geral de Proteção de Dados Pessoais (LGPD)** - Lei Nº 13.709, de 14 de agosto de 2018
- **Autoridade Nacional de Proteção de Dados (ANPD)** - Decreto Nº 10.474, de 26 de agosto de 2020

**Objetivo:** Proteger os direitos fundamentais de liberdade e de privacidade e o livre desenvolvimento da personalidade da pessoa natural.

```json
{
  "error": "lgpd_protection",
  "error_description": "Dados de menor de idade bloqueados em atendimento à LGPD"
}
```

**Quando ocorre:**
- CPF de pessoa com menos de 18 anos
- Proteção de dados de menores conforme LGPD

**⚠️ ATENÇÃO:** Este código **É BILHETADO**!

---

### 500 - Erro no Servidor ❌ NÃO BILHETADO
**Descrição:** Ocorreu algum erro interno no Servidor.

**Causa:** Problema interno na API do SERPRO.

**Ação:** Tentar novamente após alguns minutos. Se persistir, contatar o suporte.

```json
{
  "error": "internal_server_error",
  "error_description": "Ocorreu algum erro interno no Servidor"
}
```

---

### 504 - Tempo Esgotado do Gateway ❌ NÃO BILHETADO
**Descrição:** Ocorreu algum erro de rede e o gateway não respondeu a tempo.

**Causa:** A requisição não chegou até a API Consulta CPF devido a problemas de rede.

**Ação:** Tentar novamente.

```json
{
  "error": "gateway_timeout",
  "error_description": "Tempo esgotado aguardando resposta do servidor"
}
```

---

## 📊 Resumo de Faturamento

| Código | Descrição | Bilhetado? | Observação |
|--------|-----------|------------|------------|
| 200 | OK | ✅ SIM | Consulta bem-sucedida |
| 206 | Conteúdo Parcial | ✅ SIM | Dados incompletos (ex: sem dataInscricao) |
| 400 | Requisição Inválida | ❌ NÃO | CPF com formato inválido |
| 401 | Não Autorizado | ❌ NÃO | Problema de autenticação |
| 403 | Proibido | ❌ NÃO | URL incorreta |
| 404 | Não Encontrado | ✅ SIM | CPF não existe na base |
| 422 | LGPD Menor | ✅ SIM | Dados de menor bloqueados |
| 500 | Erro no Servidor | ❌ NÃO | Erro interno SERPRO |
| 504 | Timeout Gateway | ❌ NÃO | Problema de rede |

**⚠️ IMPORTANTE:**
- Códigos **200, 206, 404 e 422** são **BILHETADOS**
- Erros de cliente (400, 401, 403) e servidor (500, 504) **NÃO são bilhetados**

---

## ⏰ Carimbo de Tempo (Time Stamp)

### O que é?

O **Carimbo de Tempo** é um serviço que adiciona assinatura digital com timestamp às consultas realizadas, garantindo:
- ✅ Prova de que a consulta foi realizada em determinado momento
- ✅ Integridade dos dados retornados
- ✅ Não-repúdio da informação
- ✅ Validade jurídica da consulta

### 🎁 Serviço Gratuito

**IMPORTANTE:** O Carimbo de Tempo **NÃO é uma API contratada separadamente**.

Este serviço está **incorporado e disponível GRATUITAMENTE** nas demais APIs do SERPRO, incluindo a Consulta CPF.

### Como Solicitar

Para solicitar que sua requisição venha com assinatura de Carimbo de Tempo, basta incluir no cabeçalho da requisição:

```
x-signature: 1
```

**Exemplo de Requisição com Carimbo de Tempo:**
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/40442820135" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "x-signature: 1"
```

### Resposta com Carimbo de Tempo

A assinatura será retornada no **cabeçalho da resposta**, com o nome `stamp`.

**Exemplo de Cabeçalho de Resposta:**
```
HTTP/1.1 200 OK
Content-Type: application/json
stamp: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Verificando a Assinatura

Para verificar a assinatura do Carimbo de Tempo, utilize a **API Verifica Carimbo de Tempo**.

**Endpoint:** `POST https://gateway.apiserpro.serpro.gov.br/checkstamp-trial/1/check`

**Chave Trial:** `Bearer 06aef429-a981-3ec5-a1f8-71d38d86481e`

**Documentação:** https://apicenter.estaleiro.serpro.gov.br/documentacao/api-carimbo-tempo/

### Exemplo de Verificação

**Requisição:**
```json
POST /checkstamp-trial/1/check
{
  "document": {
    // Dados do documento retornado pela API
  },
  "timestamp": {
    // Carimbo de tempo recebido no header 'stamp'
  }
}
```

**Resposta - Assinatura Válida:**
```json
{
  "status": "Success",
  "message": "Documento assinado em 06-Dec-2025 14:30:45:123 GMT-3"
}
```

**Resposta - Assinatura Inválida:**
```json
{
  "status": "Fault",
  "message": "O documento fornecido não corresponde ao do carimbo de tempo!"
}
```

### Códigos de Situação - Verificação

| Código | Status | Mensagem |
|--------|--------|----------|
| 200 | Success | Documento assinado em [data/hora] |
| 400 | Fault | O documento fornecido não corresponde ao do carimbo de tempo! |
| 403 | Fault (900908) | Access failure for API: /checkstamp/1, version: 1 status: (900908) - Resource forbidden |
| 500 | Fault | Erro interno do servidor |

### Casos de Uso

O Carimbo de Tempo é especialmente útil para:
- 📋 Processos judiciais (prova de consulta em determinada data)
- 🏛️ Due diligence com validade jurídica
- 🔍 Auditorias e compliance
- 📊 Relatórios que precisam de comprovação temporal
- ⚖️ Procedimentos legais que exigem prova de data

### Observações Importantes

1. ✅ **Gratuito:** Não há custo adicional para usar o Carimbo de Tempo
2. ✅ **Opcional:** Você escolhe quando usar através do header `x-signature: 1`
3. ✅ **Disponível em todas as APIs:** CPF, CNPJ, CND, Renda, etc.
4. ✅ **Validade Jurídica:** Possui validade legal para processos
5. ⚠️ **Verificação Separada:** Use a API Verifica Carimbo para validar

---

## 🏷️ Identificador Opcional de Requisições (X-Request-Tag)

### O que é?

O campo `X-Request-Tag` é um **cabeçalho opcional** que serve como identificador de requisições para fins de **agrupamento no faturamento**.

### Para que serve?

Este campo permite que você **agrupe e identifique** suas requisições no relatório de faturamento.

**Exemplos de uso:**
- 🏢 Agrupar requisições por departamento da empresa
- 👥 Identificar requisições por usuário/cliente
- 📊 Separar requisições por projeto/aplicação
- 🔍 Rastrear requisições por tipo de investigação

### Como usar?

Adicione o cabeçalho `X-Request-Tag` em sua requisição:

```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/40442820135" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "X-Request-Tag: DEPTO_RH"
```

**Outro exemplo - Identificando usuário:**
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/40442820135" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "X-Request-Tag: usuario_joao_silva"
```

### Especificações

- **Tipo:** String (texto livre)
- **Tamanho máximo:** 32 caracteres
- **Validação:** Nenhuma (sem validação de conteúdo)
- **Obrigatório:** NÃO (totalmente opcional)

### ⚠️ Importante

1. ✅ **Controle do Cliente:** Você é responsável por manter o controle das informações enviadas neste campo
2. ✅ **Relatório de Faturamento:** O agrupamento aparecerá no relatório de faturamento do SERPRO
3. ✅ **Sem Validação:** O SERPRO não valida o conteúdo deste campo
4. ⚠️ **Planejamento:** Defina uma convenção de nomenclatura antes de começar a usar

### Caso de Uso: Entidades de Classe / Grupos Econômicos

#### Modalidade Global com Ônus Entidade

Para entidades de classe ou grupos econômicos que contratam em **modalidade global** (onde a entidade paga por todos os associados), o `X-Request-Tag` pode ser usado para:

- Identificar qual associado realizou cada requisição
- Gerar relatórios de uso por associado
- Realizar rateio de custos

**Exemplo:**
```bash
# Entidade: Sindicato XYZ
# Associado: Empresa ABC Ltda (CNPJ 12.345.678/0001-90)

curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/40442820135" \
  -H "Authorization: Bearer TOKEN_DA_ENTIDADE" \
  -H "X-Request-Tag: CNPJ_12345678000190"
```

#### Modalidade com Ônus Associado

Se cada associado possui **sua própria chave de consumo** (ônus individual), **NÃO é necessário** usar o `X-Request-Tag` para identificação, pois cada associado já possui faturamento separado.

### Exemplo de Convenção de Nomenclatura

```
Formato: TIPO_IDENTIFICADOR_VALOR

Exemplos:
- DEPTO_RH
- DEPTO_FINANCEIRO
- DEPTO_COMPLIANCE
- USER_joao_silva
- USER_maria_santos
- PROJ_investigacao_001
- PROJ_due_diligence_2025
- CNPJ_12345678000190
- APP_portal_web
- APP_mobile_android
```

### Visualização no Faturamento

O relatório de faturamento do SERPRO mostrará algo como:

| X-Request-Tag | Quantidade | Valor Total |
|---------------|------------|-------------|
| DEPTO_RH | 1.500 | R$ 988,65 |
| DEPTO_FINANCEIRO | 3.200 | R$ 1.808,80 |
| DEPTO_COMPLIANCE | 850 | R$ 560,24 |
| **TOTAL** | **5.550** | **R$ 3.357,69** |

---

## 🔗 Recursos Adicionais

- **Documentação Oficial:** https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cpf/
- **Chamadas Detalhadas:** https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cpf/pt/chamadas/consulta-cpf-df/
- **Chaves para Degustação:** https://apicenter.estaleiro.serpro.gov.br/
- **Arquivo OAS3:** `consulta-cpf-df-v2-pt.yaml`

---

## 🧪 Ambiente Trial (Demonstração)

### O que é?

A **API CPF Trial** é o ambiente de testes com **dados fictícios (Mock)**, com objetivo de demonstrar o funcionamento da API sem custos.

**URL Trial:** `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df-trial/v2`

### Como Usar

1. Acesse a [API CPF Demonstração](https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cpf/)
2. Escolha o método (endpoint) a testar
3. Clique em **"Try it Out"**
4. Insira os cabeçalhos e/ou altere o corpo da requisição
5. Clique em **"Execute"**

### 📋 CPFs Fictícios para Teste

Use os CPFs abaixo para testar o ambiente Trial:

#### ✅ CPF Regular

| CPF | Situação | Código |
|-----|----------|--------|
| 40442820135 | Regular | 0 |
| 63017285995 | Regular | 0 |
| 91708635203 | Regular | 0 |
| 58136053391 | Regular | 0 |

#### ⚠️ CPF Suspensa

| CPF | Situação | Código |
|-----|----------|--------|
| 40532176871 | Suspensa | 2 |
| 47123586964 | Suspensa | 2 |

#### 🔄 CPF Pendente de Regularização

| CPF | Situação | Código |
|-----|----------|--------|
| 07691852312 | Pendente de Regularização | 4 |
| 10975384600 | Pendente de Regularização | 4 |

#### ❌ CPF Cancelada por Multiplicidade

| CPF | Situação | Código |
|-----|----------|--------|
| 01648527949 | Cancelada por Multiplicidade | 5 |
| 47893062592 | Cancelada por Multiplicidade | 5 |

#### ⛔ CPF Nula

| CPF | Situação | Código |
|-----|----------|--------|
| 98302514705 | Nula | 8 |
| 18025346790 | Nula | 8 |

#### 🚫 CPF Cancelada de Ofício

| CPF | Situação | Código |
|-----|----------|--------|
| 64913872591 | Cancelada de Ofício | 9 |
| 52389071686 | Cancelada de Ofício | 9 |

#### 💀 CPF Titular Falecido

| CPF | Situação | Código |
|-----|----------|--------|
| 05137518743 | Titular Falecido | 3 |
| 08849979878 | Titular Falecido | 3 |

### Exemplo de Teste com Trial

```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df-trial/v2/cpf/40442820135" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_TRIAL"
```

**Resposta Esperada:**
```json
{
  "ni": "40442820135",
  "nome": "Nome do CPF 404.428.201-35",
  "situacao": {
    "codigo": "0",
    "descricao": "Regular"
  },
  "nascimento": "14111970"
}
```

### ⚠️ Importante sobre Trial

1. 🎭 **Dados Fictícios:** Todos os dados retornados são de exemplo (mock)
2. 🆓 **Gratuito:** Não há cobrança por consultas no ambiente Trial
3. 🧪 **Para Testes:** Use para desenvolver e testar sua integração
4. 🚀 **Produção:** Após testes, use o ambiente de produção com dados reais

---

## 📌 Observações Importantes

1. **Token de Acesso:** Válido por 1 hora (3600 segundos)
2. **Rate Limit:** Consulte seu contrato para limites específicos
3. **Formato de Data:** DDMMAAAA (dia-mês-ano)
4. **CPF:** Apenas números, sem pontos ou traços
5. **LGPD:** Respeitar finalidade e consentimento ao usar os dados
6. **Logs:** Manter registro de auditoria das consultas

---

**Última atualização:** 06/12/2025
**Versão da API:** V2
**Contrato:** 260005
