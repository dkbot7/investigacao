# 📊 RELATÓRIO COMPLETO - JusBrasil Consulta PRO API

**Empresa**: INVESTIR ITAPEMA LTDA
**CNPJ**: 29.814.517/0001-04
**Fornecedor**: JusBrasil
**Produto**: Background Check API - Consulta PRO
**Data do Relatório**: Dezembro 2024

---

## 📑 Índice

1. [Visão Geral](#1-visão-geral)
2. [Autenticação e Segurança](#2-autenticação-e-segurança)
3. [Endpoints Disponíveis](#3-endpoints-disponíveis)
4. [Estrutura de Dados Retornados](#4-estrutura-de-dados-retornados)
5. [Consulta em Lote (Batch)](#5-consulta-em-lote-batch)
6. [Paginação e Limites](#6-paginação-e-limites)
7. [Níveis de Confiança](#7-níveis-de-confiança)
8. [Preços e Modelo de Cobrança](#8-preços-e-modelo-de-cobrança)
9. [Casos de Uso](#9-casos-de-uso)
10. [LGPD e Conformidade Legal](#10-lgpd-e-conformidade-legal)
11. [Exemplos Práticos de Integração](#11-exemplos-práticos-de-integração)
12. [Comparativo com Outras Plataformas](#12-comparativo-com-outras-plataformas)
13. [Troubleshooting e Boas Práticas](#13-troubleshooting-e-boas-práticas)
14. [Referências e Documentação](#14-referências-e-documentação)

---

## 1. Visão Geral

### 1.1 O que é a JusBrasil Consulta PRO?

A **JusBrasil Consulta PRO** é uma API REST que permite realizar consultas automatizadas em bases de dados jurídicas e registros públicos de todo o Brasil. A plataforma agrega informações de:

- **Tribunais Estaduais** (TJ's de todos os estados)
- **Tribunais Regionais do Trabalho** (TRT's)
- **Tribunais Regionais Federais** (TRF's)
- **Tribunais Superiores** (STF, STJ, TST, etc.)
- **Ministério Público** (MP Estadual e Federal)
- **Banco Nacional de Mandados de Prisão** (BNMP)
- **Registros de Empregadores Irregulares**

### 1.2 Características Principais

| Característica | Descrição |
|----------------|-----------|
| **Tipo de API** | REST/JSON |
| **Base URL** | `https://api.jusbrasil.com.br/background-check/` |
| **Autenticação** | API Key (header) |
| **Formato Resposta** | JSON |
| **Paginação** | Cursor-based |
| **Limite Padrão** | 100 registros por consulta |
| **Batch Processing** | Até 3.000 registros via CSV |
| **Ambientes** | Production e Sandbox |

### 1.3 Quando Utilizar?

A API JusBrasil é ideal para:

✅ **Background Check** - Verificação de antecedentes judiciais
✅ **Due Diligence** - Investigação pré-contratual
✅ **Compliance** - Verificação de processos criminais e trabalhistas
✅ **RH** - Análise de candidatos em processos seletivos
✅ **Crédito** - Verificação de ações judiciais que possam impactar crédito
✅ **Auditoria** - Levantamento de passivos judiciais

---

## 2. Autenticação e Segurança

### 2.1 Obtendo a API Key

A autenticação é realizada via **API Key** que deve ser incluída no header de todas as requisições.

**Header de Autenticação:**
```
apikey: <sua_api_key>
```

### 2.2 Gerenciamento de API Keys

A JusBrasil oferece um painel de administração onde é possível:

- **Gerar novas API Keys**
- **Revogar keys comprometidas**
- **Monitorar uso por key**
- **Configurar permissões por key**

### 2.3 Ambientes Disponíveis

#### Production
- **URL**: `https://api.jusbrasil.com.br/background-check/`
- **Uso**: Consultas reais com cobrança
- **API Key**: Production key

#### Sandbox
- **URL**: `https://sandbox.api.jusbrasil.com.br/background-check/`
- **Uso**: Testes sem cobrança
- **API Key**: Sandbox key
- **Dados**: Fictícios ou amostrais

### 2.4 Segurança e Boas Práticas

⚠️ **IMPORTANTE:**

1. **Nunca exponha sua API Key** em código frontend ou repositórios públicos
2. **Use HTTPS** para todas as requisições
3. **Rotacione keys periodicamente** (recomendado: a cada 90 dias)
4. **Implemente rate limiting** do seu lado para evitar custos excessivos
5. **Monitore uso suspeito** através do painel de administração
6. **Use keys diferentes** para cada ambiente (dev, staging, prod)

---

## 3. Endpoints Disponíveis

### 3.1 Processos Criminais

**Endpoint:**
```
POST https://api.jusbrasil.com.br/background-check/lawsuits/criminal
```

**Descrição:**
Consulta processos criminais em todos os tribunais do Brasil vinculados ao CPF informado.

**Headers:**
```
apikey: <sua_api_key>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "cpf": "12345678900",
  "cursor": null,
  "limit": 100
}
```

**Exemplo curl:**
```bash
curl --request POST \
  --url https://api.jusbrasil.com.br/background-check/lawsuits/criminal \
  --header 'apikey: <sua_api_key>' \
  --header 'Content-Type: application/json' \
  --data '{
    "cpf": "12345678900"
  }'
```

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cpf` | string | ✅ Sim | CPF a ser consultado (apenas números) |
| `cursor` | string | ❌ Não | Cursor para paginação (primeira consulta = null) |
| `limit` | integer | ❌ Não | Limite de processos retornados (padrão: 100) |

---

### 3.2 Processos Civis

**Endpoint:**
```
POST https://api.jusbrasil.com.br/background-check/lawsuits/civil
```

**Descrição:**
Consulta processos civis (ações cíveis, execuções, etc.) vinculados ao CPF.

**Body (JSON):**
```json
{
  "cpf": "12345678900",
  "cursor": null,
  "limit": 100
}
```

**Exemplo curl:**
```bash
curl --request POST \
  --url https://api.jusbrasil.com.br/background-check/lawsuits/civil \
  --header 'apikey: <sua_api_key>' \
  --header 'Content-Type: application/json' \
  --data '{
    "cpf": "12345678900"
  }'
```

---

### 3.3 Processos Trabalhistas

**Endpoint:**
```
POST https://api.jusbrasil.com.br/background-check/lawsuits/trabalhista
```

**Descrição:**
Consulta processos trabalhistas na Justiça do Trabalho (TRT's).

**Body (JSON):**
```json
{
  "cpf": "12345678900",
  "cursor": null,
  "limit": 100
}
```

**Exemplo curl:**
```bash
curl --request POST \
  --url https://api.jusbrasil.com.br/background-check/lawsuits/trabalhista \
  --header 'apikey: <sua_api_key>' \
  --header 'Content-Type: application/json' \
  --data '{
    "cpf": "12345678900"
  }'
```

---

### 3.4 Registros do Ministério Público (MP)

**Endpoint:**
```
POST https://api.jusbrasil.com.br/background-check/mp
```

**Descrição:**
Consulta registros de denúncias, investigações e ações do Ministério Público.

**Body (JSON):**
```json
{
  "cpf": "12345678900",
  "cursor": null,
  "limit": 100
}
```

**Exemplo curl:**
```bash
curl --request POST \
  --url https://api.jusbrasil.com.br/background-check/mp \
  --header 'apikey: <sua_api_key>' \
  --header 'Content-Type: application/json' \
  --data '{
    "cpf": "12345678900"
  }'
```

---

### 3.5 Banco Nacional de Mandados de Prisão (BNMP)

**Endpoint:**
```
POST https://api.jusbrasil.com.br/background-check/bnmp
```

**Descrição:**
Consulta mandados de prisão ativos no Banco Nacional de Mandados de Prisão (CNJ).

**Body (JSON):**
```json
{
  "cpf": "12345678900",
  "cursor": null,
  "limit": 100
}
```

**Exemplo curl:**
```bash
curl --request POST \
  --url https://api.jusbrasil.com.br/background-check/bnmp \
  --header 'apikey: <sua_api_key>' \
  --header 'Content-Type: application/json' \
  --data '{
    "cpf": "12345678900"
  }'
```

⚠️ **ATENÇÃO:**
Consultas ao BNMP retornam mandados de prisão **ativos**. A presença de registros indica situação crítica que exige análise jurídica imediata.

---

### 3.6 Empregador Irregular

**Endpoint:**
```
POST https://api.jusbrasil.com.br/background-check/empregador-irregular
```

**Descrição:**
Consulta registros de empregadores com irregularidades trabalhistas (trabalho análogo à escravidão, trabalho infantil, etc.).

**Body (JSON):**
```json
{
  "cpf": "12345678900",
  "cursor": null,
  "limit": 100
}
```

**Exemplo curl:**
```bash
curl --request POST \
  --url https://api.jusbrasil.com.br/background-check/empregador-irregular \
  --header 'apikey: <sua_api_key>' \
  --header 'Content-Type: application/json' \
  --data '{
    "cpf": "12345678900"
  }'
```

---

## 4. Estrutura de Dados Retornados

### 4.1 Estrutura Geral da Resposta

Todos os endpoints retornam uma estrutura JSON similar:

```json
{
  "data": [
    {
      "id": "processo-id-unico",
      "numero_processo": "0000000-00.0000.0.00.0000",
      "confidence": "ALTA",
      "tribunal": "TJSP",
      "tipo": "CRIMINAL",
      "status": {
        "inferido": "Em andamento",
        "normalizado": "ACTIVE",
        "tribunal": "Aguardando julgamento"
      },
      "partes": [
        {
          "tipo": "AUTOR",
          "nome": "João da Silva",
          "cpf": "12345678900",
          "advogados": [
            {
              "nome": "Dr. Advogado da Silva",
              "oab": "SP123456"
            }
          ]
        }
      ],
      "tipificacao": {
        "cnj": "Penal - Crime contra o patrimônio",
        "legislacao": [
          {
            "titulo": "Código Penal",
            "artigo": "Art. 155",
            "descricao": "Furto"
          }
        ]
      },
      "valor_causa": 50000.00,
      "data_distribuicao": "2023-05-15",
      "ultima_movimentacao": "2024-11-20",
      "processos_relacionados": [
        "0000001-00.0000.0.00.0001"
      ],
      "movimentacoes": [
        {
          "data": "2024-11-20",
          "descricao": "Audiência de instrução e julgamento"
        }
      ]
    }
  ],
  "next_cursor": "eyJpZCI6MTIzNDU2fQ==",
  "has_more": true
}
```

### 4.2 Campos Principais

#### 4.2.1 Identificação do Processo

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | ID único do processo na base JusBrasil |
| `numero_processo` | string | Número CNJ do processo |
| `tribunal` | string | Código do tribunal (TJSP, TJRJ, TRT02, etc.) |
| `tipo` | string | Tipo do processo (CRIMINAL, CIVIL, TRABALHISTA) |

#### 4.2.2 Nível de Confiança (Confidence)

| Valor | Significado |
|-------|-------------|
| `ALTA` | Alta confiança de que o processo pertence ao CPF consultado |
| `MEDIA` | Média confiança - pode haver homonímia |
| `BAIXA` | Baixa confiança - nome similar mas dados divergentes |

#### 4.2.3 Status do Processo

```json
"status": {
  "inferido": "Em andamento",      // Status inferido pela JusBrasil
  "normalizado": "ACTIVE",          // Status normalizado (ACTIVE, ARCHIVED, SUSPENDED)
  "tribunal": "Aguardando julgamento" // Status original do tribunal
}
```

#### 4.2.4 Partes do Processo

```json
"partes": [
  {
    "tipo": "AUTOR",              // AUTOR, RÉU, TESTEMUNHA, etc.
    "nome": "João da Silva",
    "cpf": "12345678900",
    "advogados": [
      {
        "nome": "Dr. Advogado",
        "oab": "SP123456"
      }
    ]
  }
]
```

#### 4.2.5 Tipificação (Classificação CNJ)

```json
"tipificacao": {
  "cnj": "Penal - Crime contra o patrimônio",
  "legislacao": [
    {
      "titulo": "Código Penal",
      "artigo": "Art. 155",
      "descricao": "Furto"
    }
  ]
}
```

#### 4.2.6 Movimentações Processuais

```json
"movimentacoes": [
  {
    "data": "2024-11-20",
    "descricao": "Audiência de instrução e julgamento",
    "tipo": "AUDIENCIA"
  },
  {
    "data": "2024-10-15",
    "descricao": "Sentença publicada",
    "tipo": "SENTENCA"
  }
]
```

### 4.3 Exemplo Completo de Resposta - Processo Criminal

```json
{
  "data": [
    {
      "id": "proc-criminal-001",
      "numero_processo": "0001234-56.2023.8.26.0100",
      "confidence": "ALTA",
      "tribunal": "TJSP",
      "tipo": "CRIMINAL",
      "status": {
        "inferido": "Condenado em 1ª instância",
        "normalizado": "ACTIVE",
        "tribunal": "Aguardando julgamento de apelação"
      },
      "partes": [
        {
          "tipo": "RÉU",
          "nome": "João da Silva Santos",
          "cpf": "12345678900",
          "advogados": [
            {
              "nome": "Maria Oliveira Advocacia",
              "oab": "SP987654"
            }
          ]
        },
        {
          "tipo": "MINISTÉRIO PÚBLICO",
          "nome": "Ministério Público do Estado de São Paulo",
          "cpf": null,
          "advogados": []
        }
      ],
      "tipificacao": {
        "cnj": "Penal - Crime contra o patrimônio",
        "legislacao": [
          {
            "titulo": "Código Penal - Decreto Lei nº 2.848/1940",
            "artigo": "Art. 155, caput",
            "descricao": "Furto simples"
          }
        ]
      },
      "valor_causa": null,
      "data_distribuicao": "2023-03-15",
      "ultima_movimentacao": "2024-11-28",
      "processos_relacionados": [],
      "movimentacoes": [
        {
          "data": "2024-11-28",
          "descricao": "Apelação remetida ao Tribunal",
          "tipo": "RECURSO"
        },
        {
          "data": "2024-09-10",
          "descricao": "Sentença condenatória - 2 anos de reclusão em regime aberto",
          "tipo": "SENTENCA"
        },
        {
          "data": "2024-06-20",
          "descricao": "Audiência de instrução e julgamento realizada",
          "tipo": "AUDIENCIA"
        },
        {
          "data": "2023-03-15",
          "descricao": "Processo distribuído",
          "tipo": "DISTRIBUICAO"
        }
      ]
    }
  ],
  "next_cursor": null,
  "has_more": false
}
```

### 4.4 Exemplo Completo de Resposta - Processo Trabalhista

```json
{
  "data": [
    {
      "id": "proc-trab-001",
      "numero_processo": "0000123-45.2024.5.02.0001",
      "confidence": "ALTA",
      "tribunal": "TRT02",
      "tipo": "TRABALHISTA",
      "status": {
        "inferido": "Acordo homologado",
        "normalizado": "ARCHIVED",
        "tribunal": "Processo arquivado"
      },
      "partes": [
        {
          "tipo": "RECLAMANTE",
          "nome": "Maria Santos Silva",
          "cpf": "98765432100",
          "advogados": [
            {
              "nome": "Sindicato dos Trabalhadores",
              "oab": "SP111222"
            }
          ]
        },
        {
          "tipo": "RECLAMADO",
          "nome": "EMPRESA XYZ LTDA",
          "cpf": null,
          "advogados": [
            {
              "nome": "Escritório Advocacia Empresarial",
              "oab": "SP333444"
            }
          ]
        }
      ],
      "tipificacao": {
        "cnj": "Trabalhista - Rescisão do contrato de trabalho",
        "legislacao": [
          {
            "titulo": "CLT - Consolidação das Leis do Trabalho",
            "artigo": "Art. 477",
            "descricao": "Verbas rescisórias"
          }
        ]
      },
      "valor_causa": 85000.00,
      "data_distribuicao": "2024-02-10",
      "ultima_movimentacao": "2024-10-15",
      "processos_relacionados": [],
      "movimentacoes": [
        {
          "data": "2024-10-15",
          "descricao": "Acordo homologado - R$ 45.000,00",
          "tipo": "ACORDO"
        },
        {
          "data": "2024-08-05",
          "descricao": "Audiência de conciliação",
          "tipo": "AUDIENCIA"
        },
        {
          "data": "2024-02-10",
          "descricao": "Reclamação trabalhista distribuída",
          "tipo": "DISTRIBUICAO"
        }
      ]
    }
  ],
  "next_cursor": null,
  "has_more": false
}
```

### 4.5 Exemplo de Resposta - BNMP (Mandado de Prisão)

```json
{
  "data": [
    {
      "id": "bnmp-001",
      "numero_mandado": "BNMP-123456-2024",
      "confidence": "ALTA",
      "tribunal": "TJSP",
      "tipo": "MANDADO_PRISAO",
      "status": {
        "inferido": "Mandado ativo",
        "normalizado": "ACTIVE",
        "tribunal": "Aguardando cumprimento"
      },
      "partes": [
        {
          "tipo": "INVESTIGADO",
          "nome": "Carlos Alberto Silva",
          "cpf": "11122233344",
          "advogados": []
        }
      ],
      "tipificacao": {
        "cnj": "Mandado de Prisão - Crime contra a vida",
        "legislacao": [
          {
            "titulo": "Código Penal",
            "artigo": "Art. 121",
            "descricao": "Homicídio"
          }
        ]
      },
      "data_emissao": "2024-05-20",
      "tipo_mandado": "PRISÃO PREVENTIVA",
      "orgao_expedidor": "1ª Vara Criminal de São Paulo/SP",
      "observacoes": "Mandado de prisão preventiva expedido em inquérito policial"
    }
  ],
  "next_cursor": null,
  "has_more": false
}
```

---

## 5. Consulta em Lote (Batch)

### 5.1 Overview

A funcionalidade de **Consulta em Lote** permite processar até **3.000 CPFs** de uma única vez através do upload de um arquivo CSV.

**Características:**
- ✅ Até 3.000 CPFs por lote
- ✅ Processamento assíncrono
- ✅ Tempo médio: ~30 minutos
- ✅ Download do resultado em CSV
- ✅ Custo: R$ 4,00 por CPF consultado

### 5.2 Fluxo de Consulta em Lote

```
1. Upload CSV → 2. Processamento Assíncrono → 3. Download Resultado
   (POST)              (~30 minutos)                  (GET)
```

### 5.3 Passo 1: Upload do CSV

**Endpoint:**
```
POST https://api.jusbrasil.com.br/background-check/consulta-em-lote
```

**Headers:**
```
apikey: <sua_api_key>
Content-Type: multipart/form-data
```

**Body (multipart/form-data):**
```
file: <arquivo.csv>
query_type: criminal
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `file` | file | Arquivo CSV com CPFs |
| `query_type` | string | Tipo de consulta: criminal, civil, trabalhista, mp, bnmp, empregador-irregular |

**Formato do CSV (input):**
```csv
cpf
12345678900
98765432100
11122233344
```

**Exemplo curl:**
```bash
curl --request POST \
  --url https://api.jusbrasil.com.br/background-check/consulta-em-lote \
  --header 'apikey: <sua_api_key>' \
  --header 'Content-Type: multipart/form-data' \
  --form 'file=@cpfs.csv' \
  --form 'query_type=criminal'
```

**Resposta (201 Created):**
```json
{
  "id": "batch-abc123def456",
  "status": "PROCESSING",
  "query_type": "criminal",
  "total_records": 3,
  "created_at": "2024-12-06T10:30:00Z",
  "estimated_completion": "2024-12-06T11:00:00Z"
}
```

### 5.4 Passo 2: Verificar Status do Lote

**Endpoint:**
```
GET https://api.jusbrasil.com.br/background-check/consulta-em-lote/
```

**Headers:**
```
apikey: <sua_api_key>
```

**Exemplo curl:**
```bash
curl --request GET \
  --url https://api.jusbrasil.com.br/background-check/consulta-em-lote/ \
  --header 'apikey: <sua_api_key>'
```

**Resposta:**
```json
{
  "batches": [
    {
      "id": "batch-abc123def456",
      "status": "COMPLETED",
      "query_type": "criminal",
      "total_records": 3,
      "processed_records": 3,
      "created_at": "2024-12-06T10:30:00Z",
      "completed_at": "2024-12-06T11:05:00Z"
    },
    {
      "id": "batch-xyz789ghi012",
      "status": "PROCESSING",
      "query_type": "civil",
      "total_records": 500,
      "processed_records": 245,
      "created_at": "2024-12-06T09:00:00Z",
      "estimated_completion": "2024-12-06T09:30:00Z"
    }
  ]
}
```

**Status possíveis:**
- `PROCESSING` - Em processamento
- `COMPLETED` - Concluído e pronto para download
- `FAILED` - Falha no processamento
- `PARTIAL` - Processamento parcial (alguns CPFs falharam)

### 5.5 Passo 3: Download do Resultado

**Endpoint:**
```
GET https://api.jusbrasil.com.br/background-check/consulta-em-lote/download/<id>
```

**Headers:**
```
apikey: <sua_api_key>
```

**Exemplo curl:**
```bash
curl --request GET \
  --url https://api.jusbrasil.com.br/background-check/consulta-em-lote/download/batch-abc123def456 \
  --header 'apikey: <sua_api_key>' \
  --output resultado.csv
```

**Formato do CSV (output):**
```csv
cpf,total_processos,confidence,tribunal,numero_processo,tipo,status,data_distribuicao
12345678900,2,ALTA,TJSP,0001234-56.2023.8.26.0100,CRIMINAL,ACTIVE,2023-03-15
12345678900,2,ALTA,TJRJ,0005678-90.2024.8.19.0001,CIVIL,ACTIVE,2024-01-10
98765432100,0,,,,,,,
11122233344,1,ALTA,TRT02,0000123-45.2024.5.02.0001,TRABALHISTA,ARCHIVED,2024-02-10
```

### 5.6 Exemplo Completo em Python

```python
import requests
import time

API_KEY = 'sua_api_key'
BASE_URL = 'https://api.jusbrasil.com.br/background-check'

# Passo 1: Upload do CSV
def upload_batch(csv_file_path, query_type='criminal'):
    url = f'{BASE_URL}/consulta-em-lote'
    headers = {'apikey': API_KEY}
    files = {'file': open(csv_file_path, 'rb')}
    data = {'query_type': query_type}

    response = requests.post(url, headers=headers, files=files, data=data)
    return response.json()

# Passo 2: Verificar status
def check_status(batch_id):
    url = f'{BASE_URL}/consulta-em-lote/'
    headers = {'apikey': API_KEY}

    response = requests.get(url, headers=headers)
    batches = response.json()['batches']

    for batch in batches:
        if batch['id'] == batch_id:
            return batch
    return None

# Passo 3: Download do resultado
def download_result(batch_id, output_path):
    url = f'{BASE_URL}/consulta-em-lote/download/{batch_id}'
    headers = {'apikey': API_KEY}

    response = requests.get(url, headers=headers)
    with open(output_path, 'wb') as f:
        f.write(response.content)
    return output_path

# Fluxo completo
batch = upload_batch('cpfs.csv', 'criminal')
batch_id = batch['id']
print(f"Batch criado: {batch_id}")

# Aguardar conclusão
while True:
    status = check_status(batch_id)
    if status['status'] == 'COMPLETED':
        print("Processamento concluído!")
        break
    elif status['status'] == 'FAILED':
        print("Erro no processamento!")
        break
    else:
        print(f"Processando... {status['processed_records']}/{status['total_records']}")
        time.sleep(30)  # Aguardar 30 segundos

# Download
download_result(batch_id, 'resultado.csv')
print("Resultado baixado com sucesso!")
```

---

## 6. Paginação e Limites

### 6.1 Sistema de Paginação Cursor-Based

A API JusBrasil utiliza **paginação baseada em cursor** para lidar com grandes volumes de dados.

**Como funciona:**

1. Primeira requisição: `cursor = null`
2. Resposta contém: `next_cursor` e `has_more`
3. Próxima requisição: usa o `next_cursor` recebido
4. Repete até `has_more = false`

### 6.2 Exemplo de Paginação

**Requisição 1:**
```json
{
  "cpf": "12345678900",
  "cursor": null,
  "limit": 100
}
```

**Resposta 1:**
```json
{
  "data": [ /* 100 processos */ ],
  "next_cursor": "eyJpZCI6MTAwfQ==",
  "has_more": true
}
```

**Requisição 2:**
```json
{
  "cpf": "12345678900",
  "cursor": "eyJpZCI6MTAwfQ==",
  "limit": 100
}
```

**Resposta 2:**
```json
{
  "data": [ /* próximos 100 processos */ ],
  "next_cursor": "eyJpZCI6MjAwfQ==",
  "has_more": true
}
```

**Requisição 3:**
```json
{
  "cpf": "12345678900",
  "cursor": "eyJpZCI6MjAwfQ==",
  "limit": 100
}
```

**Resposta 3:**
```json
{
  "data": [ /* últimos 50 processos */ ],
  "next_cursor": null,
  "has_more": false
}
```

### 6.3 Implementação em Python

```python
def get_all_lawsuits(cpf, lawsuit_type='criminal'):
    url = f'{BASE_URL}/lawsuits/{lawsuit_type}'
    headers = {'apikey': API_KEY, 'Content-Type': 'application/json'}

    all_data = []
    cursor = None
    has_more = True

    while has_more:
        payload = {
            'cpf': cpf,
            'cursor': cursor,
            'limit': 100
        }

        response = requests.post(url, headers=headers, json=payload)
        result = response.json()

        all_data.extend(result['data'])
        cursor = result.get('next_cursor')
        has_more = result.get('has_more', False)

        print(f"Obtidos {len(result['data'])} registros. Total: {len(all_data)}")

    return all_data

# Uso
processos = get_all_lawsuits('12345678900', 'criminal')
print(f"Total de processos criminais: {len(processos)}")
```

### 6.4 Limites e Restrições

| Limite | Valor | Observação |
|--------|-------|------------|
| **Registros por requisição** | 100 (padrão) | Configurável via parâmetro `limit` |
| **Máximo por requisição** | 500 | Limite superior |
| **Batch (CSV)** | 3.000 CPFs | Por lote |
| **Rate Limiting** | A definir | Consultar contrato |

---

## 7. Níveis de Confiança

### 7.1 O que é o Confidence Level?

O campo `confidence` indica o **nível de certeza** de que o processo está realmente vinculado ao CPF consultado.

### 7.2 Classificação

| Nível | Descrição | Quando ocorre |
|-------|-----------|---------------|
| **ALTA** | Alta confiança | CPF encontrado explicitamente no processo OU nome completo + dados biográficos conferem |
| **MEDIA** | Média confiança | Nome completo confere mas CPF não consta no processo |
| **BAIXA** | Baixa confiança | Apenas nome parcial confere (possível homonímia) |

### 7.3 Exemplo Prático

**CPF Consultado**: 123.456.789-00
**Nome**: João da Silva Santos

**Processo 1 - ALTA confiança:**
```json
{
  "numero_processo": "0001234-56.2023.8.26.0100",
  "confidence": "ALTA",
  "partes": [
    {
      "tipo": "RÉU",
      "nome": "João da Silva Santos",
      "cpf": "12345678900"  // ← CPF confere
    }
  ]
}
```

**Processo 2 - MEDIA confiança:**
```json
{
  "numero_processo": "0005678-90.2024.8.19.0001",
  "confidence": "MEDIA",
  "partes": [
    {
      "tipo": "AUTOR",
      "nome": "João da Silva Santos",  // ← Nome confere
      "cpf": null  // ← CPF não consta
    }
  ]
}
```

**Processo 3 - BAIXA confiança:**
```json
{
  "numero_processo": "0009999-99.2022.5.02.0001",
  "confidence": "BAIXA",
  "partes": [
    {
      "tipo": "TESTEMUNHA",
      "nome": "João Silva",  // ← Nome parcial (homonímia provável)
      "cpf": null
    }
  ]
}
```

### 7.4 Boas Práticas

✅ **Processos com confiança ALTA:**
- Considere como confirmados
- Use em relatórios de background check

⚠️ **Processos com confiança MEDIA:**
- Requer verificação manual
- Considere data de nascimento, filiação, etc.

❌ **Processos com confiança BAIXA:**
- Alta probabilidade de homonímia
- Não use sem validação adicional
- Pode excluir de relatórios automatizados

### 7.5 Exemplo de Filtro em Python

```python
def filter_by_confidence(processos, min_confidence='MEDIA'):
    confidence_levels = {'BAIXA': 1, 'MEDIA': 2, 'ALTA': 3}
    min_level = confidence_levels[min_confidence]

    filtered = [
        p for p in processos
        if confidence_levels.get(p['confidence'], 0) >= min_level
    ]

    return filtered

# Uso
todos_processos = get_all_lawsuits('12345678900', 'criminal')
processos_confiaveis = filter_by_confidence(todos_processos, 'MEDIA')

print(f"Total: {len(todos_processos)}")
print(f"Confiáveis (MEDIA ou ALTA): {len(processos_confiaveis)}")
```

---

## 8. Preços e Modelo de Cobrança

### 8.1 Tabela de Preços

| Item | Valor |
|------|-------|
| **Preço por Chamada de API** | R$ 4,00 |
| **Consumo Mínimo Mensal** | R$ 1.000,00 |
| **Modelo** | Pay-per-call |

### 8.2 Simulação de Volumes

| Volume Mensal | Custo Total | Custo Unitário Efetivo |
|---------------|-------------|------------------------|
| 250 consultas | R$ 1.000,00 | R$ 4,00 (mínimo) |
| 500 consultas | R$ 2.000,00 | R$ 4,00 |
| 1.000 consultas | R$ 4.000,00 | R$ 4,00 |
| 2.500 consultas | R$ 10.000,00 | R$ 4,00 |
| 5.000 consultas | R$ 20.000,00 | R$ 4,00 |

⚠️ **ATENÇÃO:**
O consumo mínimo de **R$ 1.000,00/mês** é obrigatório, equivalente a **250 consultas/mês**.

### 8.3 O que conta como "1 chamada"?

Cada **requisição POST** aos endpoints conta como 1 chamada:

✅ **Cobra R$ 4,00:**
- POST /lawsuits/criminal (1 CPF)
- POST /lawsuits/civil (1 CPF)
- POST /lawsuits/trabalhista (1 CPF)
- POST /mp (1 CPF)
- POST /bnmp (1 CPF)
- POST /empregador-irregular (1 CPF)
- POST /consulta-em-lote (cobra R$ 4,00 por CPF no CSV)

❌ **NÃO cobra:**
- Requisições de paginação (mesmo CPF, próxima página)
- GET /consulta-em-lote/ (listar lotes)
- GET /consulta-em-lote/download/<id> (baixar resultado)

### 8.4 Exemplo de Cálculo - Cenário Real

**Empresa realiza background check de 80 candidatos/mês**

Para cada candidato, consulta:
- Processos criminais (1 chamada)
- Processos civis (1 chamada)
- Processos trabalhistas (1 chamada)
- BNMP (1 chamada)

**Total por candidato**: 4 chamadas = R$ 16,00
**Total mensal**: 80 × R$ 16,00 = **R$ 1.280,00**

### 8.5 Comparativo com Consulta em Lote

**Cenário**: Consultar 1.000 CPFs para processos criminais

**Opção 1 - Requisições individuais:**
- 1.000 chamadas POST /lawsuits/criminal
- Custo: 1.000 × R$ 4,00 = **R$ 4.000,00**
- Tempo: ~1-2 horas (depende de rate limit)

**Opção 2 - Consulta em lote:**
- 1 upload CSV com 1.000 CPFs
- Custo: 1.000 × R$ 4,00 = **R$ 4.000,00** (mesmo custo)
- Tempo: ~30 minutos (processamento assíncrono)

✅ **Vantagem do lote**: Processamento mais rápido e simplificado

### 8.6 Otimização de Custos

**Dicas para reduzir custos:**

1. **Cache local** - Armazene resultados para evitar consultas duplicadas
2. **Consulta em lote** - Use batch para grandes volumes
3. **Filtragem prévia** - Consulte apenas quando realmente necessário
4. **Paginação consciente** - Requisições de paginação não cobram adicionalmente
5. **Monitoramento** - Acompanhe uso no painel para evitar excessos

**Exemplo de cache em Python:**
```python
import json
from datetime import datetime, timedelta

CACHE_FILE = 'cache_jusbrasil.json'
CACHE_EXPIRY_DAYS = 30

def load_cache():
    try:
        with open(CACHE_FILE, 'r') as f:
            return json.load(f)
    except:
        return {}

def save_cache(cache):
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f)

def get_cached_or_fetch(cpf, lawsuit_type='criminal'):
    cache = load_cache()
    cache_key = f"{cpf}_{lawsuit_type}"

    # Verificar se existe em cache e não expirou
    if cache_key in cache:
        cached_data = cache[cache_key]
        cached_date = datetime.fromisoformat(cached_data['timestamp'])
        if datetime.now() - cached_date < timedelta(days=CACHE_EXPIRY_DAYS):
            print(f"Usando cache para {cpf} ({lawsuit_type})")
            return cached_data['data']

    # Buscar da API
    print(f"Consultando API para {cpf} ({lawsuit_type})")
    data = get_all_lawsuits(cpf, lawsuit_type)

    # Salvar em cache
    cache[cache_key] = {
        'timestamp': datetime.now().isoformat(),
        'data': data
    }
    save_cache(cache)

    return data
```

---

## 9. Casos de Uso

### 9.1 Background Check em Processo Seletivo

**Cenário:**
Empresa precisa verificar antecedentes de candidatos antes da contratação.

**Fluxo:**
1. Candidato autoriza consulta (LGPD)
2. Sistema consulta:
   - Processos criminais
   - Processos trabalhistas
   - BNMP
3. Gera relatório automático
4. RH analisa resultado

**Implementação:**
```python
def background_check_candidato(cpf, nome):
    relatorio = {
        'cpf': cpf,
        'nome': nome,
        'data_consulta': datetime.now().isoformat(),
        'resultado': {}
    }

    # Consultar processos criminais
    criminais = get_all_lawsuits(cpf, 'criminal')
    criminais_alta = [p for p in criminais if p['confidence'] == 'ALTA']
    relatorio['resultado']['processos_criminais'] = {
        'total': len(criminais),
        'alta_confianca': len(criminais_alta),
        'detalhes': criminais_alta
    }

    # Consultar processos trabalhistas
    trabalhistas = get_all_lawsuits(cpf, 'trabalhista')
    trabalhistas_alta = [p for p in trabalhistas if p['confidence'] == 'ALTA']
    relatorio['resultado']['processos_trabalhistas'] = {
        'total': len(trabalhistas),
        'alta_confianca': len(trabalhistas_alta),
        'detalhes': trabalhistas_alta
    }

    # Consultar BNMP
    bnmp = get_all_lawsuits(cpf, 'bnmp')
    relatorio['resultado']['mandados_prisao'] = {
        'total': len(bnmp),
        'detalhes': bnmp
    }

    # Análise de risco
    if len(bnmp) > 0:
        relatorio['classificacao_risco'] = 'CRÍTICO'
    elif len(criminais_alta) > 0:
        relatorio['classificacao_risco'] = 'ALTO'
    elif len(trabalhistas_alta) > 3:
        relatorio['classificacao_risco'] = 'MÉDIO'
    else:
        relatorio['classificacao_risco'] = 'BAIXO'

    return relatorio

# Uso
relatorio = background_check_candidato('12345678900', 'João da Silva')
print(f"Classificação de Risco: {relatorio['classificacao_risco']}")
```

### 9.2 Due Diligence de Fornecedores/Parceiros

**Cenário:**
Empresa precisa avaliar fornecedor antes de fechar contrato.

**Fluxo:**
1. Obter CPFs de sócios/administradores
2. Consultar processos de cada sócio:
   - Civis (execuções, falências)
   - Criminais (crimes financeiros, estelionato)
   - Trabalhistas (passivo trabalhista)
3. Avaliar risco consolidado

**Implementação:**
```python
def due_diligence_empresa(socios):
    """
    socios: lista de dicts com {'cpf': '...', 'nome': '...', 'cargo': '...'}
    """
    relatorio_empresa = {
        'data_analise': datetime.now().isoformat(),
        'socios_analisados': len(socios),
        'resultados': []
    }

    for socio in socios:
        # Background check completo de cada sócio
        civis = get_all_lawsuits(socio['cpf'], 'civil')
        criminais = get_all_lawsuits(socio['cpf'], 'criminal')
        trabalhistas = get_all_lawsuits(socio['cpf'], 'trabalhista')

        # Filtrar processos relevantes
        execucoes = [p for p in civis if 'execução' in p.get('tipificacao', {}).get('cnj', '').lower()]
        crimes_financeiros = [
            p for p in criminais
            if any(termo in str(p.get('tipificacao', {})).lower()
                   for termo in ['estelionato', 'fraude', 'apropriação'])
        ]

        resultado_socio = {
            'cpf': socio['cpf'],
            'nome': socio['nome'],
            'cargo': socio['cargo'],
            'processos': {
                'total_civis': len(civis),
                'execucoes': len(execucoes),
                'total_criminais': len(criminais),
                'crimes_financeiros': len(crimes_financeiros),
                'total_trabalhistas': len(trabalhistas)
            },
            'red_flags': []
        }

        # Identificar red flags
        if len(crimes_financeiros) > 0:
            resultado_socio['red_flags'].append(f"CRÍTICO: {len(crimes_financeiros)} processo(s) criminal(is) financeiro(s)")
        if len(execucoes) > 5:
            resultado_socio['red_flags'].append(f"ALTO: {len(execucoes)} execução(ões) cível(is)")
        if len(trabalhistas) > 10:
            resultado_socio['red_flags'].append(f"MÉDIO: Histórico trabalhista elevado ({len(trabalhistas)} processos)")

        relatorio_empresa['resultados'].append(resultado_socio)

    # Classificação geral
    total_red_flags = sum(len(r['red_flags']) for r in relatorio_empresa['resultados'])
    if total_red_flags >= 5:
        relatorio_empresa['recomendacao'] = 'NÃO CONTRATAR - Risco elevado'
    elif total_red_flags >= 2:
        relatorio_empresa['recomendacao'] = 'CAUTELA - Análise jurídica detalhada recomendada'
    else:
        relatorio_empresa['recomendacao'] = 'BAIXO RISCO - Pode prosseguir'

    return relatorio_empresa
```

### 9.3 Monitoramento Contínuo de Clientes (Compliance)

**Cenário:**
Instituição financeira precisa monitorar continuamente sua carteira de clientes para identificar novos processos judiciais.

**Fluxo:**
1. Job diário/semanal consulta todos os CPFs da base
2. Compara com última consulta
3. Identifica novos processos
4. Alerta equipe de compliance

**Implementação:**
```python
import json
from datetime import datetime

def monitoramento_continuo(base_cpfs):
    """
    base_cpfs: lista de CPFs a monitorar
    """
    LAST_CHECK_FILE = 'last_check.json'

    # Carregar última verificação
    try:
        with open(LAST_CHECK_FILE, 'r') as f:
            last_check = json.load(f)
    except:
        last_check = {}

    alertas = []

    for cpf in base_cpfs:
        # Consultar processos atuais
        processos_atuais = {}
        for tipo in ['criminal', 'civil', 'trabalhista', 'bnmp']:
            processos_atuais[tipo] = get_all_lawsuits(cpf, tipo)

        # Comparar com última verificação
        if cpf in last_check:
            for tipo, processos in processos_atuais.items():
                processos_anteriores_ids = set(last_check[cpf].get(tipo, []))
                processos_atuais_ids = set([p['id'] for p in processos])

                novos_processos_ids = processos_atuais_ids - processos_anteriores_ids

                if novos_processos_ids:
                    novos_processos = [p for p in processos if p['id'] in novos_processos_ids]
                    alertas.append({
                        'cpf': cpf,
                        'tipo': tipo,
                        'quantidade_novos': len(novos_processos),
                        'processos': novos_processos,
                        'timestamp': datetime.now().isoformat()
                    })

        # Atualizar registro
        last_check[cpf] = {
            tipo: [p['id'] for p in processos]
            for tipo, processos in processos_atuais.items()
        }

    # Salvar estado atual
    with open(LAST_CHECK_FILE, 'w') as f:
        json.dump(last_check, f)

    return alertas

# Uso em job agendado
def job_diario():
    cpfs_clientes = carregar_base_clientes()  # sua função
    alertas = monitoramento_continuo(cpfs_clientes)

    if alertas:
        enviar_email_compliance(alertas)  # sua função
        print(f"{len(alertas)} novos alertas gerados")
    else:
        print("Nenhum novo processo identificado")
```

### 9.4 Análise de Crédito Complementar

**Cenário:**
Fintech usa API JusBrasil como fonte adicional para scoring de crédito.

**Variáveis extraídas:**
- Total de execuções cíveis
- Processos trabalhistas (passivo trabalhista)
- Mandados de prisão ativos
- Processos criminais financeiros

**Implementação:**
```python
def scoring_judicial(cpf):
    score = 1000  # Score inicial

    # Consultar todas as fontes
    civis = get_all_lawsuits(cpf, 'civil')
    criminais = get_all_lawsuits(cpf, 'criminal')
    trabalhistas = get_all_lawsuits(cpf, 'trabalhista')
    bnmp = get_all_lawsuits(cpf, 'bnmp')

    # Penalizações
    score -= len([p for p in civis if 'execução' in str(p).lower()]) * 50
    score -= len([p for p in criminais if p['confidence'] == 'ALTA']) * 100
    score -= len(trabalhistas) * 10
    score -= len(bnmp) * 500

    # Garantir score mínimo
    score = max(score, 0)

    return {
        'score_judicial': score,
        'fatores': {
            'execucoes_civeis': len([p for p in civis if 'execução' in str(p).lower()]),
            'processos_criminais': len(criminais),
            'processos_trabalhistas': len(trabalhistas),
            'mandados_prisao': len(bnmp)
        }
    }
```

### 9.5 Validação de Locatários (Imobiliário)

**Cenário:**
Imobiliária valida histórico judicial de potencial locatário.

**Implementação:**
```python
def avaliar_locatario(cpf, nome, renda_declarada):
    relatorio = {
        'cpf': cpf,
        'nome': nome,
        'renda_declarada': renda_declarada,
        'aprovado': False,
        'motivo': ''
    }

    # Consultas
    civis = get_all_lawsuits(cpf, 'civil')
    criminais = get_all_lawsuits(cpf, 'criminal')

    # Filtros específicos
    acoes_despejo = [p for p in civis if 'despejo' in str(p).lower() or 'locação' in str(p).lower()]
    execucoes = [p for p in civis if 'execução' in str(p).lower()]

    # Regras de aprovação
    if len(criminais) > 0:
        relatorio['motivo'] = 'Reprovado: Processos criminais identificados'
    elif len(acoes_despejo) > 0:
        relatorio['motivo'] = 'Reprovado: Histórico de ações de despejo'
    elif len(execucoes) > 3:
        relatorio['motivo'] = 'Reprovado: Múltiplas execuções cíveis'
    else:
        relatorio['aprovado'] = True
        relatorio['motivo'] = 'Aprovado: Sem restrições judiciais relevantes'

    relatorio['detalhes'] = {
        'acoes_despejo': len(acoes_despejo),
        'execucoes': len(execucoes),
        'processos_criminais': len(criminais)
    }

    return relatorio
```

---

## 10. LGPD e Conformidade Legal

### 10.1 Base Legal para Consulta de Processos Judiciais

**Natureza dos Dados:**
- Processos judiciais são **dados públicos** (art. 11 do CPC)
- Disponíveis para consulta em sites dos tribunais
- LGPD permite tratamento de dados públicos (Art. 7º, VI)

**Bases Legais Aplicáveis (Art. 7º da LGPD):**

| Base Legal | Quando se aplica |
|------------|------------------|
| **Art. 7º, VI - Exercício regular de direitos** | Análise de crédito, due diligence |
| **Art. 7º, IX - Legítimo interesse** | Background check, compliance |
| **Art. 7º, II - Cumprimento de obrigação legal** | KYC, PLD-FT (Lei 9.613/98) |

### 10.2 Requisitos LGPD para Uso da API

✅ **Transparência:**
- Informar ao titular sobre a consulta
- Incluir em Política de Privacidade
- Especificar finalidade

✅ **Finalidade Legítima:**
- Background check em processo seletivo
- Due diligence pré-contratual
- Análise de risco de crédito
- Compliance regulatório

✅ **Necessidade:**
- Consultar apenas quando realmente necessário
- Não coletar dados excessivos

✅ **Segurança:**
- Armazenar dados com criptografia
- Controle de acesso restrito
- Logs de auditoria

### 10.3 Modelo de Termo de Consentimento

**Exemplo para Background Check:**

```
TERMO DE AUTORIZAÇÃO PARA CONSULTA DE ANTECEDENTES JUDICIAIS

Eu, [NOME COMPLETO], CPF nº [CPF], AUTORIZO a empresa [NOME DA EMPRESA],
CNPJ nº [CNPJ], a realizar consulta de meus antecedentes judiciais através
da API JusBrasil Consulta PRO, abrangendo:

- Processos criminais
- Processos cíveis
- Processos trabalhistas
- Registros no Ministério Público
- Mandados de prisão (BNMP)

FINALIDADE: Análise de background check para processo seletivo de emprego.

PRAZO DE ARMAZENAMENTO: Os dados serão armazenados pelo prazo de 12 meses
ou até o término do processo seletivo, o que ocorrer primeiro.

DIREITOS DO TITULAR: Tenho ciência de que posso, a qualquer momento:
- Solicitar cópia dos dados coletados
- Solicitar correção de dados inexatos
- Solicitar eliminação dos dados
- Revogar este consentimento

Local e Data: _____________, ___ de ________ de 20__

_________________________________
Assinatura do Titular
```

### 10.4 Modelo de Cláusula Contratual (B2B)

**Para contratos com fornecedores/parceiros:**

```
CLÁUSULA X - VERIFICAÇÃO DE ANTECEDENTES E PROTEÇÃO DE DADOS

X.1 A CONTRATADA autoriza expressamente a CONTRATANTE a realizar consultas
de antecedentes judiciais de seus sócios, administradores e representantes
legais através de plataformas especializadas, incluindo mas não se limitando
à API JusBrasil Consulta PRO.

X.2 As consultas terão como finalidade exclusiva a realização de due diligence
e avaliação de risco contratual, em conformidade com o legítimo interesse da
CONTRATANTE (Art. 7º, IX da Lei 13.709/2018).

X.3 A CONTRATANTE compromete-se a:
a) Utilizar os dados exclusivamente para a finalidade indicada;
b) Armazenar os dados com medidas de segurança adequadas;
c) Eliminar os dados ao término do contrato ou quando não forem mais necessários;
d) Não compartilhar os dados com terceiros sem autorização.

X.4 A CONTRATADA declara ter ciência de que a presença de processos judiciais
relevantes poderá implicar em rescisão contratual, conforme cláusula de
resolução por onerosidade excessiva.
```

### 10.5 Registro de Operações de Tratamento (ROT)

**Template para LGPD:**

| Campo | Conteúdo |
|-------|----------|
| **Operação** | Consulta de processos judiciais via API JusBrasil |
| **Agentes de Tratamento** | Controlador: [EMPRESA] / Operador: JusBrasil |
| **Dados Tratados** | CPF, nome completo, processos judiciais |
| **Finalidade** | Background check, due diligence, análise de crédito |
| **Base Legal** | Art. 7º, IX - Legítimo interesse |
| **Categorias de Titulares** | Candidatos a emprego, fornecedores, clientes |
| **Compartilhamento** | Não há compartilhamento com terceiros |
| **Segurança** | Criptografia AES-256, acesso restrito via RBAC |
| **Retenção** | 12 meses ou término da finalidade |
| **Eliminação** | Automática após prazo de retenção |

### 10.6 Checklist de Conformidade LGPD

Antes de implementar a API JusBrasil, verifique:

- [ ] Finalidade legítima e específica definida
- [ ] Base legal adequada identificada (Art. 7º da LGPD)
- [ ] Termo de consentimento ou cláusula contratual preparada
- [ ] Política de Privacidade atualizada com menção à consulta
- [ ] Medidas de segurança implementadas (criptografia, acesso restrito)
- [ ] Prazo de retenção de dados definido
- [ ] Processo de eliminação de dados implementado
- [ ] Canal para exercício de direitos do titular criado
- [ ] Registro de Operações de Tratamento (ROT) documentado
- [ ] Equipe treinada sobre LGPD e manuseio de dados sensíveis
- [ ] DPO (Data Protection Officer) informado sobre o tratamento
- [ ] Análise de Impacto (RIPD) realizada, se aplicável

### 10.7 Sanções e Penalidades

**Descumprimento da LGPD pode resultar em:**

| Sanção | Descrição |
|--------|-----------|
| **Advertência** | Primeira infração leve |
| **Multa Simples** | Até 2% do faturamento (limitado a R$ 50 milhões por infração) |
| **Multa Diária** | Até R$ 50 milhões no total |
| **Publicização da Infração** | Exposição pública da violação |
| **Bloqueio dos Dados** | Suspensão do banco de dados |
| **Eliminação dos Dados** | Ordem de exclusão permanente |

### 10.8 Dados Sensíveis e Processos Judiciais

⚠️ **IMPORTANTE:**

Processos criminais podem revelar **dados sensíveis** (Art. 5º, II da LGPD):
- Origem racial ou étnica
- Convicção religiosa
- Opinião política
- Filiação a sindicato
- Dado referente à saúde ou vida sexual
- Dado genético ou biométrico

**Tratamento de dados sensíveis exige:**
- Consentimento específico e destacado, OU
- Base legal específica (Art. 11 da LGPD)

**Recomendação:**
Ao processar resultados, implemente filtros para **anonimizar** ou **ocultar** informações sensíveis que não sejam estritamente necessárias para a finalidade.

---

## 11. Exemplos Práticos de Integração

### 11.1 Integração Python Completa

```python
import requests
import json
from datetime import datetime
from typing import List, Dict, Optional

class JusBrasilAPI:
    """Cliente Python para JusBrasil Consulta PRO API"""

    def __init__(self, api_key: str, sandbox: bool = False):
        self.api_key = api_key
        self.base_url = (
            'https://sandbox.api.jusbrasil.com.br/background-check'
            if sandbox
            else 'https://api.jusbrasil.com.br/background-check'
        )

    def _headers(self) -> Dict[str, str]:
        return {
            'apikey': self.api_key,
            'Content-Type': 'application/json'
        }

    def consultar_processos(
        self,
        cpf: str,
        tipo: str = 'criminal',
        confidence_min: str = 'MEDIA'
    ) -> List[Dict]:
        """
        Consulta processos de um CPF com filtro de confiança

        Args:
            cpf: CPF a consultar (apenas números)
            tipo: criminal, civil, trabalhista, mp, bnmp, empregador-irregular
            confidence_min: BAIXA, MEDIA, ALTA

        Returns:
            Lista de processos filtrados
        """
        url = f'{self.base_url}/lawsuits/{tipo}'

        all_data = []
        cursor = None
        has_more = True

        while has_more:
            payload = {
                'cpf': cpf,
                'cursor': cursor,
                'limit': 100
            }

            response = requests.post(url, headers=self._headers(), json=payload)
            response.raise_for_status()

            result = response.json()
            all_data.extend(result.get('data', []))
            cursor = result.get('next_cursor')
            has_more = result.get('has_more', False)

        # Filtrar por confiança
        confidence_levels = {'BAIXA': 1, 'MEDIA': 2, 'ALTA': 3}
        min_level = confidence_levels[confidence_min]

        filtered = [
            p for p in all_data
            if confidence_levels.get(p.get('confidence'), 0) >= min_level
        ]

        return filtered

    def background_check_completo(
        self,
        cpf: str,
        nome: str,
        tipos: List[str] = None
    ) -> Dict:
        """
        Realiza background check completo

        Args:
            cpf: CPF a consultar
            nome: Nome do titular (para o relatório)
            tipos: Lista de tipos a consultar (default: todos)

        Returns:
            Relatório consolidado
        """
        if tipos is None:
            tipos = ['criminal', 'civil', 'trabalhista', 'bnmp']

        relatorio = {
            'cpf': cpf,
            'nome': nome,
            'data_consulta': datetime.now().isoformat(),
            'processos': {},
            'resumo': {},
            'classificacao_risco': 'BAIXO'
        }

        total_processos = 0
        processos_criticos = 0

        for tipo in tipos:
            processos = self.consultar_processos(cpf, tipo, 'MEDIA')
            relatorio['processos'][tipo] = processos

            total_processos += len(processos)

            # Contar processos críticos
            if tipo == 'bnmp':
                processos_criticos += len(processos)
            elif tipo == 'criminal':
                processos_criticos += len([p for p in processos if p.get('confidence') == 'ALTA'])

        relatorio['resumo']['total_processos'] = total_processos
        relatorio['resumo']['processos_criticos'] = processos_criticos

        # Classificar risco
        if processos_criticos > 0:
            relatorio['classificacao_risco'] = 'CRÍTICO'
        elif total_processos > 10:
            relatorio['classificacao_risco'] = 'ALTO'
        elif total_processos > 5:
            relatorio['classificacao_risco'] = 'MÉDIO'

        return relatorio

    def upload_lote(
        self,
        csv_path: str,
        query_type: str = 'criminal'
    ) -> str:
        """
        Upload de arquivo CSV para consulta em lote

        Args:
            csv_path: Caminho do arquivo CSV
            query_type: Tipo de consulta

        Returns:
            ID do lote criado
        """
        url = f'{self.base_url}/consulta-em-lote'
        headers = {'apikey': self.api_key}

        files = {'file': open(csv_path, 'rb')}
        data = {'query_type': query_type}

        response = requests.post(url, headers=headers, files=files, data=data)
        response.raise_for_status()

        return response.json()['id']

    def verificar_lote(self, batch_id: str) -> Dict:
        """Verifica status de lote"""
        url = f'{self.base_url}/consulta-em-lote/'
        response = requests.get(url, headers={'apikey': self.api_key})
        response.raise_for_status()

        batches = response.json()['batches']
        for batch in batches:
            if batch['id'] == batch_id:
                return batch

        raise ValueError(f"Lote {batch_id} não encontrado")

    def download_lote(self, batch_id: str, output_path: str):
        """Download resultado de lote"""
        url = f'{self.base_url}/consulta-em-lote/download/{batch_id}'
        response = requests.get(url, headers={'apikey': self.api_key})
        response.raise_for_status()

        with open(output_path, 'wb') as f:
            f.write(response.content)


# Exemplo de uso
if __name__ == '__main__':
    # Inicializar cliente
    api = JusBrasilAPI(api_key='sua_api_key_aqui', sandbox=True)

    # Background check individual
    relatorio = api.background_check_completo(
        cpf='12345678900',
        nome='João da Silva'
    )

    print(f"Classificação de Risco: {relatorio['classificacao_risco']}")
    print(f"Total de Processos: {relatorio['resumo']['total_processos']}")

    # Salvar relatório
    with open('relatorio_background_check.json', 'w') as f:
        json.dump(relatorio, f, indent=2, ensure_ascii=False)
```

### 11.2 Integração Node.js

```javascript
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

class JusBrasilAPI {
    constructor(apiKey, sandbox = false) {
        this.apiKey = apiKey;
        this.baseURL = sandbox
            ? 'https://sandbox.api.jusbrasil.com.br/background-check'
            : 'https://api.jusbrasil.com.br/background-check';
    }

    headers() {
        return {
            'apikey': this.apiKey,
            'Content-Type': 'application/json'
        };
    }

    async consultarProcessos(cpf, tipo = 'criminal', confidenceMin = 'MEDIA') {
        const url = `${this.baseURL}/lawsuits/${tipo}`;
        let allData = [];
        let cursor = null;
        let hasMore = true;

        while (hasMore) {
            const payload = {
                cpf: cpf,
                cursor: cursor,
                limit: 100
            };

            const response = await axios.post(url, payload, {
                headers: this.headers()
            });

            allData = allData.concat(response.data.data || []);
            cursor = response.data.next_cursor;
            hasMore = response.data.has_more || false;
        }

        // Filtrar por confiança
        const confidenceLevels = { 'BAIXA': 1, 'MEDIA': 2, 'ALTA': 3 };
        const minLevel = confidenceLevels[confidenceMin];

        return allData.filter(p =>
            confidenceLevels[p.confidence] >= minLevel
        );
    }

    async backgroundCheckCompleto(cpf, nome, tipos = null) {
        if (!tipos) {
            tipos = ['criminal', 'civil', 'trabalhista', 'bnmp'];
        }

        const relatorio = {
            cpf: cpf,
            nome: nome,
            data_consulta: new Date().toISOString(),
            processos: {},
            resumo: {},
            classificacao_risco: 'BAIXO'
        };

        let totalProcessos = 0;
        let processosCriticos = 0;

        for (const tipo of tipos) {
            const processos = await this.consultarProcessos(cpf, tipo, 'MEDIA');
            relatorio.processos[tipo] = processos;

            totalProcessos += processos.length;

            if (tipo === 'bnmp') {
                processosCriticos += processos.length;
            } else if (tipo === 'criminal') {
                processosCriticos += processos.filter(p => p.confidence === 'ALTA').length;
            }
        }

        relatorio.resumo.total_processos = totalProcessos;
        relatorio.resumo.processos_criticos = processosCriticos;

        if (processosCriticos > 0) {
            relatorio.classificacao_risco = 'CRÍTICO';
        } else if (totalProcessos > 10) {
            relatorio.classificacao_risco = 'ALTO';
        } else if (totalProcessos > 5) {
            relatorio.classificacao_risco = 'MÉDIO';
        }

        return relatorio;
    }

    async uploadLote(csvPath, queryType = 'criminal') {
        const url = `${this.baseURL}/consulta-em-lote`;
        const formData = new FormData();
        formData.append('file', fs.createReadStream(csvPath));
        formData.append('query_type', queryType);

        const response = await axios.post(url, formData, {
            headers: {
                'apikey': this.apiKey,
                ...formData.getHeaders()
            }
        });

        return response.data.id;
    }

    async verificarLote(batchId) {
        const url = `${this.baseURL}/consulta-em-lote/`;
        const response = await axios.get(url, {
            headers: { 'apikey': this.apiKey }
        });

        const batch = response.data.batches.find(b => b.id === batchId);
        if (!batch) {
            throw new Error(`Lote ${batchId} não encontrado`);
        }

        return batch;
    }

    async downloadLote(batchId, outputPath) {
        const url = `${this.baseURL}/consulta-em-lote/download/${batchId}`;
        const response = await axios.get(url, {
            headers: { 'apikey': this.apiKey },
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }
}

// Exemplo de uso
(async () => {
    const api = new JusBrasilAPI('sua_api_key_aqui', true);

    const relatorio = await api.backgroundCheckCompleto(
        '12345678900',
        'João da Silva'
    );

    console.log(`Classificação de Risco: ${relatorio.classificacao_risco}`);
    console.log(`Total de Processos: ${relatorio.resumo.total_processos}`);

    fs.writeFileSync(
        'relatorio_background_check.json',
        JSON.stringify(relatorio, null, 2)
    );
})();
```

### 11.3 Integração PHP

```php
<?php

class JusBrasilAPI {
    private $apiKey;
    private $baseURL;

    public function __construct($apiKey, $sandbox = false) {
        $this->apiKey = $apiKey;
        $this->baseURL = $sandbox
            ? 'https://sandbox.api.jusbrasil.com.br/background-check'
            : 'https://api.jusbrasil.com.br/background-check';
    }

    private function headers() {
        return [
            'apikey: ' . $this->apiKey,
            'Content-Type: application/json'
        ];
    }

    public function consultarProcessos($cpf, $tipo = 'criminal', $confidenceMin = 'MEDIA') {
        $url = $this->baseURL . '/lawsuits/' . $tipo;
        $allData = [];
        $cursor = null;
        $hasMore = true;

        while ($hasMore) {
            $payload = [
                'cpf' => $cpf,
                'cursor' => $cursor,
                'limit' => 100
            ];

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headers());

            $response = curl_exec($ch);
            curl_close($ch);

            $result = json_decode($response, true);
            $allData = array_merge($allData, $result['data'] ?? []);
            $cursor = $result['next_cursor'] ?? null;
            $hasMore = $result['has_more'] ?? false;
        }

        // Filtrar por confiança
        $confidenceLevels = ['BAIXA' => 1, 'MEDIA' => 2, 'ALTA' => 3];
        $minLevel = $confidenceLevels[$confidenceMin];

        return array_filter($allData, function($p) use ($confidenceLevels, $minLevel) {
            return ($confidenceLevels[$p['confidence']] ?? 0) >= $minLevel;
        });
    }

    public function backgroundCheckCompleto($cpf, $nome, $tipos = null) {
        if ($tipos === null) {
            $tipos = ['criminal', 'civil', 'trabalhista', 'bnmp'];
        }

        $relatorio = [
            'cpf' => $cpf,
            'nome' => $nome,
            'data_consulta' => date('c'),
            'processos' => [],
            'resumo' => [],
            'classificacao_risco' => 'BAIXO'
        ];

        $totalProcessos = 0;
        $processosCriticos = 0;

        foreach ($tipos as $tipo) {
            $processos = $this->consultarProcessos($cpf, $tipo, 'MEDIA');
            $relatorio['processos'][$tipo] = $processos;

            $totalProcessos += count($processos);

            if ($tipo === 'bnmp') {
                $processosCriticos += count($processos);
            } elseif ($tipo === 'criminal') {
                $processosCriticos += count(array_filter($processos, function($p) {
                    return $p['confidence'] === 'ALTA';
                }));
            }
        }

        $relatorio['resumo']['total_processos'] = $totalProcessos;
        $relatorio['resumo']['processos_criticos'] = $processosCriticos;

        if ($processosCriticos > 0) {
            $relatorio['classificacao_risco'] = 'CRÍTICO';
        } elseif ($totalProcessos > 10) {
            $relatorio['classificacao_risco'] = 'ALTO';
        } elseif ($totalProcessos > 5) {
            $relatorio['classificacao_risco'] = 'MÉDIO';
        }

        return $relatorio;
    }
}

// Exemplo de uso
$api = new JusBrasilAPI('sua_api_key_aqui', true);

$relatorio = $api->backgroundCheckCompleto('12345678900', 'João da Silva');

echo "Classificação de Risco: " . $relatorio['classificacao_risco'] . "\n";
echo "Total de Processos: " . $relatorio['resumo']['total_processos'] . "\n";

file_put_contents(
    'relatorio_background_check.json',
    json_encode($relatorio, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);
?>
```

---

## 12. Comparativo com Outras Plataformas

### 12.1 JusBrasil vs SERPRO vs Serasa

| Critério | JusBrasil | SERPRO | Serasa |
|----------|-----------|--------|--------|
| **Tipo de Dados** | Processos judiciais | Dados cadastrais oficiais | Score de crédito e histórico financeiro |
| **Fonte** | Tribunais de todo Brasil | Receita Federal, INSS | Bureaus de crédito |
| **Preço/Consulta** | R$ 4,00 | R$ 0,08 - R$ 7,00 | R$ 8,80 - R$ 14,37 |
| **Consumo Mínimo** | R$ 1.000/mês | Variável | R$ 3.554/mês ou R$ 4.736/mês |
| **Tipo de API** | REST/JSON | REST/JSON (OAuth2) | Plataforma web (não API pública) |
| **Batch Processing** | ✅ Sim (3.000/lote) | ❌ Não documentado | ✅ Sim (via plataforma) |
| **Paginação** | ✅ Cursor-based | ✅ Sim | N/A |
| **Dados Retornados** | Processos, tipificação, partes | CPF, CNPJ, Renda | Score, protestos, dívidas, ações |
| **Confidence Level** | ✅ ALTA/MEDIA/BAIXA | N/A | N/A |
| **Casos de Uso** | Background check judicial, compliance | Validação cadastral, KYC | Análise de crédito, risco financeiro |

### 12.2 Quando usar cada plataforma?

**Use JusBrasil quando:**
- ✅ Precisa verificar antecedentes judiciais
- ✅ Due diligence de fornecedores/parceiros
- ✅ Background check em processos seletivos
- ✅ Compliance regulatório (PLD-FT)
- ✅ Identificar passivo judicial trabalhista

**Use SERPRO quando:**
- ✅ Validar CPF/CNPJ
- ✅ Obter dados cadastrais oficiais
- ✅ Verificar situação cadastral na Receita
- ✅ Estimar renda (consulta renda)
- ✅ KYC (Know Your Customer)

**Use Serasa quando:**
- ✅ Análise de crédito
- ✅ Score de pagamento
- ✅ Verificar protestos e dívidas
- ✅ Cheques sem fundos
- ✅ Ações de cobrança

### 12.3 Estratégia Multi-Fonte

**Cenário Ideal: Combinar as 3 plataformas**

```python
def analise_completa_pessoa(cpf, nome):
    relatorio_final = {
        'cpf': cpf,
        'nome': nome,
        'data_analise': datetime.now().isoformat(),
        'fontes': {}
    }

    # 1. SERPRO - Validação cadastral
    serpro_api = SerproAPI(token='...')
    dados_serpro = serpro_api.consultar_cpf(cpf)
    relatorio_final['fontes']['serpro'] = {
        'situacao_cpf': dados_serpro['situacao'],
        'nome_rf': dados_serpro['nome'],
        'data_nascimento': dados_serpro['data_nascimento']
    }

    # 2. Serasa - Score de crédito
    serasa_api = SerasaAPI(api_key='...')
    dados_serasa = serasa_api.relatorio_avancado_pf(cpf)
    relatorio_final['fontes']['serasa'] = {
        'score': dados_serasa['score'],
        'protestos': len(dados_serasa['protestos']),
        'dividas_vencidas': dados_serasa['total_dividas']
    }

    # 3. JusBrasil - Processos judiciais
    jusbrasil_api = JusBrasilAPI(api_key='...')
    dados_jusbrasil = jusbrasil_api.background_check_completo(cpf, nome)
    relatorio_final['fontes']['jusbrasil'] = {
        'total_processos': dados_jusbrasil['resumo']['total_processos'],
        'processos_criticos': dados_jusbrasil['resumo']['processos_criticos'],
        'classificacao_risco': dados_jusbrasil['classificacao_risco']
    }

    # Scoring Consolidado
    score_final = 1000
    score_final -= dados_serasa['protestos'] * 50
    score_final -= dados_jusbrasil['resumo']['processos_criticos'] * 100
    score_final -= (1000 - dados_serasa['score'])

    relatorio_final['score_consolidado'] = max(score_final, 0)

    # Decisão Final
    if (dados_serpro['situacao'] == 'SUSPENSA' or
        dados_jusbrasil['classificacao_risco'] == 'CRÍTICO' or
        dados_serasa['score'] < 300):
        relatorio_final['decisao'] = 'REJEITAR'
    elif score_final < 500:
        relatorio_final['decisao'] = 'ANALISAR MANUALMENTE'
    else:
        relatorio_final['decisao'] = 'APROVAR'

    return relatorio_final
```

---

## 13. Troubleshooting e Boas Práticas

### 13.1 Erros Comuns

#### Erro 401 - Unauthorized

**Causa:**
- API Key inválida ou expirada
- API Key não enviada no header

**Solução:**
```bash
# Verificar se o header está correto
curl --request POST \
  --url https://api.jusbrasil.com.br/background-check/lawsuits/criminal \
  --header 'apikey: SUA_API_KEY_AQUI' \  # ← Verificar este header
  --header 'Content-Type: application/json' \
  --data '{"cpf": "12345678900"}'
```

#### Erro 400 - Bad Request

**Causa:**
- CPF em formato inválido
- JSON malformado
- Parâmetros obrigatórios faltando

**Solução:**
```python
# CPF deve conter apenas números
cpf = '123.456.789-00'
cpf_limpo = cpf.replace('.', '').replace('-', '')  # → '12345678900'

# JSON deve estar bem formado
payload = {
    'cpf': cpf_limpo,  # ✅ String com apenas números
    'cursor': None,    # ✅ null em JSON
    'limit': 100       # ✅ Integer
}
```

#### Erro 429 - Too Many Requests

**Causa:**
- Rate limit excedido

**Solução:**
```python
import time
from functools import wraps

def rate_limit(max_per_second=10):
    min_interval = 1.0 / max_per_second
    last_called = [0.0]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            left_to_wait = min_interval - elapsed
            if left_to_wait > 0:
                time.sleep(left_to_wait)
            ret = func(*args, **kwargs)
            last_called[0] = time.time()
            return ret
        return wrapper
    return decorator

@rate_limit(max_per_second=5)
def consultar_com_rate_limit(cpf, tipo):
    return api.consultar_processos(cpf, tipo)
```

#### Erro 500 - Internal Server Error

**Causa:**
- Problema no servidor da JusBrasil
- Timeout de tribunais

**Solução:**
```python
import time
from requests.exceptions import RequestException

def consultar_com_retry(cpf, tipo, max_retries=3):
    for attempt in range(max_retries):
        try:
            return api.consultar_processos(cpf, tipo)
        except RequestException as e:
            if attempt == max_retries - 1:
                raise
            wait_time = 2 ** attempt  # Exponential backoff
            print(f"Erro na tentativa {attempt + 1}, aguardando {wait_time}s...")
            time.sleep(wait_time)
```

### 13.2 Boas Práticas de Performance

#### 1. Cache Local

```python
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_or_fetch(cpf, tipo, cache_expiry=86400):
    cache_key = f"jusbrasil:{cpf}:{tipo}"

    # Tentar cache
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    # Buscar da API
    data = api.consultar_processos(cpf, tipo)

    # Salvar em cache
    redis_client.setex(cache_key, cache_expiry, json.dumps(data))

    return data
```

#### 2. Processamento Assíncrono

```python
import asyncio
import aiohttp

async def consultar_async(session, cpf, tipo):
    url = f'{api.base_url}/lawsuits/{tipo}'
    headers = api._headers()
    payload = {'cpf': cpf, 'cursor': None, 'limit': 100}

    async with session.post(url, headers=headers, json=payload) as response:
        return await response.json()

async def background_check_async(cpf):
    async with aiohttp.ClientSession() as session:
        tasks = [
            consultar_async(session, cpf, 'criminal'),
            consultar_async(session, cpf, 'civil'),
            consultar_async(session, cpf, 'trabalhista'),
            consultar_async(session, cpf, 'bnmp')
        ]
        results = await asyncio.gather(*tasks)
        return {
            'criminal': results[0],
            'civil': results[1],
            'trabalhista': results[2],
            'bnmp': results[3]
        }

# Uso
loop = asyncio.get_event_loop()
resultado = loop.run_until_complete(background_check_async('12345678900'))
```

#### 3. Batch Processing para Grandes Volumes

```python
def processar_lista_cpfs_otimizado(cpfs, tipo='criminal'):
    # Para listas grandes (>500), usar batch
    if len(cpfs) > 500:
        # Criar CSV
        with open('temp_batch.csv', 'w') as f:
            f.write('cpf\n')
            for cpf in cpfs:
                f.write(f'{cpf}\n')

        # Upload batch
        batch_id = api.upload_lote('temp_batch.csv', tipo)

        # Aguardar conclusão
        while True:
            status = api.verificar_lote(batch_id)
            if status['status'] == 'COMPLETED':
                break
            time.sleep(30)

        # Download
        api.download_lote(batch_id, 'resultado.csv')

        # Processar resultado
        import pandas as pd
        return pd.read_csv('resultado.csv')

    # Para listas pequenas, consultar individualmente com cache
    else:
        resultados = []
        for cpf in cpfs:
            resultados.append(get_cached_or_fetch(cpf, tipo))
        return resultados
```

### 13.3 Monitoramento e Logs

```python
import logging
from datetime import datetime

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('jusbrasil_api.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger('JusBrasilAPI')

class JusBrasilAPIComLogs(JusBrasilAPI):
    def consultar_processos(self, cpf, tipo='criminal', confidence_min='MEDIA'):
        logger.info(f"Iniciando consulta - CPF: {cpf[:3]}***, Tipo: {tipo}")
        start_time = datetime.now()

        try:
            result = super().consultar_processos(cpf, tipo, confidence_min)
            elapsed = (datetime.now() - start_time).total_seconds()
            logger.info(f"Consulta concluída - {len(result)} processos, {elapsed:.2f}s")
            return result
        except Exception as e:
            logger.error(f"Erro na consulta - CPF: {cpf[:3]}***, Tipo: {tipo}, Erro: {str(e)}")
            raise
```

### 13.4 Validação de CPF

```python
def validar_cpf(cpf):
    # Remove caracteres não numéricos
    cpf = ''.join(filter(str.isdigit, cpf))

    # Verifica se tem 11 dígitos
    if len(cpf) != 11:
        return False

    # Verifica se todos os dígitos são iguais
    if cpf == cpf[0] * 11:
        return False

    # Valida primeiro dígito verificador
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    resto = soma % 11
    digito1 = 0 if resto < 2 else 11 - resto

    if int(cpf[9]) != digito1:
        return False

    # Valida segundo dígito verificador
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    resto = soma % 11
    digito2 = 0 if resto < 2 else 11 - resto

    if int(cpf[10]) != digito2:
        return False

    return True

# Uso
if validar_cpf('123.456.789-00'):
    resultado = api.consultar_processos('12345678900', 'criminal')
else:
    print("CPF inválido")
```

---

## 14. Referências e Documentação

### 14.1 Documentação Oficial

- **JusBrasil API Docs**: https://api.jusbrasil.com.br/docs (consultar documentação atualizada)
- **Portal do Desenvolvedor**: Acesse através do painel de administração
- **Changelog**: Verifique atualizações de API no portal

### 14.2 Legislação Relevante

| Lei | Descrição | Link |
|-----|-----------|------|
| **Lei 13.709/2018** | LGPD - Lei Geral de Proteção de Dados | http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm |
| **Lei 13.105/2015** | CPC - Código de Processo Civil (Art. 11 - Publicidade) | http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm |
| **Resolução CNJ 121/2010** | Dispõe sobre divulgação de dados processuais | https://atos.cnj.jus.br/atos/detalhar/124 |
| **Lei 9.613/1998** | PLD-FT - Prevenção à Lavagem de Dinheiro | http://www.planalto.gov.br/ccivil_03/leis/l9613.htm |

### 14.3 Ferramentas Recomendadas

**Para Desenvolvimento:**
- **Postman**: Teste de endpoints REST - https://www.postman.com/
- **Insomnia**: Cliente REST alternativo - https://insomnia.rest/
- **jq**: Processamento de JSON via CLI - https://stedolan.github.io/jq/

**Para Monitoramento:**
- **Sentry**: Monitoramento de erros - https://sentry.io/
- **DataDog**: Monitoramento de APIs - https://www.datadoghq.com/
- **Grafana**: Dashboards de métricas - https://grafana.com/

**Para Cache:**
- **Redis**: Cache em memória - https://redis.io/
- **Memcached**: Cache distribuído - https://memcached.org/

### 14.4 Bibliotecas Úteis

**Python:**
```bash
pip install requests  # Cliente HTTP
pip install pandas    # Processamento de CSV
pip install redis     # Cache Redis
pip install aiohttp   # Requisições assíncronas
```

**Node.js:**
```bash
npm install axios        # Cliente HTTP
npm install csv-parser  # Processamento de CSV
npm install redis       # Cache Redis
npm install async       # Controle de fluxo assíncrono
```

**PHP:**
```bash
composer require guzzlehttp/guzzle  # Cliente HTTP
composer require predis/predis      # Cache Redis
```

### 14.5 Contato e Suporte

**JusBrasil:**
- **Site**: https://www.jusbrasil.com.br/
- **Suporte Técnico**: Consultar portal do desenvolvedor
- **Comercial**: Consultar site oficial

**ANPD (Autoridade Nacional de Proteção de Dados):**
- **Site**: https://www.gov.br/anpd/pt-br
- **Canal de Atendimento**: Para dúvidas sobre LGPD

---

## 🎯 Resumo Executivo

### Principais Características

✅ **API REST** com JSON responses
✅ **Autenticação via API Key**
✅ **6 endpoints principais** + batch processing
✅ **Paginação cursor-based** para grandes volumes
✅ **Confidence levels** (ALTA/MEDIA/BAIXA)
✅ **Batch de até 3.000 CPFs** via CSV
✅ **R$ 4,00 por consulta** (mínimo R$ 1.000/mês)

### Casos de Uso Ideais

1. **Background Check** em processos seletivos
2. **Due Diligence** de fornecedores e parceiros
3. **Compliance** regulatório (PLD-FT)
4. **Análise de Risco** complementar
5. **Monitoramento Contínuo** de carteira de clientes

### Integração Recomendada

Para análise completa de pessoas físicas, **combine**:
- **SERPRO** - Validação cadastral oficial
- **Serasa** - Score de crédito e protestos
- **JusBrasil** - Processos judiciais

---

**Última Atualização**: Dezembro 2024
**Versão do Relatório**: 1.0
**Preparado por**: INVESTIR ITAPEMA LTDA (CNPJ 29.814.517/0001-04)
