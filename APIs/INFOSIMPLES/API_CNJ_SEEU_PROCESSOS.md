# Infosimples - API CNJ / SEEU / Processos

**Consulta de Processos de Execução no Sistema Eletrônico de Execução Unificado**

---

## VISAO GERAL

A API permite consultar processos de pessoas físicas e jurídicas no Sistema Eletrônico de Execução Unificado (SEEU) do Conselho Nacional de Justiça (CNJ).

### O que é o SEEU?

O SEEU é o sistema que unifica a tramitação eletrônica de processos de execução em todo o país, incluindo:
- Execuções fiscais
- Execuções cíveis
- Execuções trabalhistas

> **Nota:** O SEEU trata de **execuções** (cobrança de dívidas, cumprimento de sentença), não de processos criminais.

---

## PARAMETROS NECESSARIOS

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cpf` | string | Condicional | CPF da parte |
| `cnpj` | string | Condicional | CNPJ da parte |
| `nome` | string | Condicional | Nome da parte |
| `nome_mae` | string | Não | Nome da mãe (refina busca) |
| `numero_processo` | string | Condicional | Número do processo |

> **Nota:** Deve informar pelo menos um parâmetro de busca

---

## DADOS RETORNADOS

### Primeiro Processo (detalhado)

| Campo | Descrição |
|-------|-----------|
| `informacoes_gerais` | Dados gerais do processo |
| `movimentacoes` | Histórico de movimentações |
| `partes` | Partes envolvidas no processo |

### Processos Encontrados (lista)

| Campo | Descrição |
|-------|-----------|
| `classe_processual` | Classe do processo |
| `data_distribuicao` | Data de distribuição |
| `numero_processo` | Número do processo |
| `partes` | Partes envolvidas |

---

## CASOS DE USO

### 1. Due Diligence
Verificar se pessoa/empresa tem execuções em andamento.

### 2. Análise de Risco
Identificar processos de cobrança antes de fechar negócios.

### 3. KYC (Know Your Customer)
Conhecer situação judicial de clientes/parceiros.

### 4. Verificação de Ações em Tramitação
Acompanhar processos de execução.

### 5. Criação de Dossiês
Compilar informações judiciais sobre investigados.

---

## ENDPOINT

```
GET https://api.infosimples.com/api/v2/consultas/cnj/seeu-processos
```

### Parâmetros de Query

```
?token=SEU_TOKEN&cpf=12345678901
```

ou

```
?token=SEU_TOKEN&cnpj=12345678000199
```

---

## EXEMPLO DE RESPOSTA - PROCESSOS ENCONTRADOS

```json
{
  "code": 200,
  "code_message": "Sucesso",
  "data": [
    {
      "primeiro_processo": {
        "numero_processo": "0001234-56.2023.8.26.0100",
        "classe_processual": "Execução de Título Extrajudicial",
        "data_distribuicao": "15/03/2023",
        "informacoes_gerais": {
          "valor_causa": 50000.00,
          "comarca": "São Paulo",
          "vara": "1ª Vara de Execuções Cíveis"
        },
        "partes": [
          {
            "nome": "BANCO XYZ S/A",
            "tipo": "Exequente"
          },
          {
            "nome": "FULANO DE TAL",
            "tipo": "Executado"
          }
        ],
        "movimentacoes": [
          {
            "data": "20/11/2025",
            "descricao": "Juntada de petição"
          }
        ]
      },
      "processos_encontrados": [
        {
          "numero_processo": "0001234-56.2023.8.26.0100",
          "classe_processual": "Execução de Título Extrajudicial",
          "data_distribuicao": "15/03/2023"
        }
      ]
    }
  ],
  "data_count": 1
}
```

## EXEMPLO DE RESPOSTA - SEM PROCESSOS

```json
{
  "code": 600,
  "code_message": "Não encontrado",
  "data": [],
  "data_count": 0
}
```

---

## INTERPRETACAO DOS RESULTADOS

| Código | Significado |
|--------|-------------|
| **200** | Encontrou processos de execução |
| **600** | NÃO encontrou processos de execução |

---

## TIPOS DE EXECUCAO COBERTOS

| Tipo | Descrição |
|------|-----------|
| **Execução Fiscal** | Cobrança de tributos |
| **Execução de Título Extrajudicial** | Cheques, duplicatas, contratos |
| **Cumprimento de Sentença** | Execução de decisão judicial |
| **Execução de Alimentos** | Cobrança de pensão alimentícia |

---

## PRECO

| Item | Valor |
|------|-------|
| **Preço Base** | Conforme tabela escalonada |
| **Preço Adicional** | Verificar na Infosimples |

Consulte a [tabela de preços](INFOSIMPLES_PLANOS_PRECOS.md) para valores por faixa.

---

## VARIAVEIS DE AMBIENTE

```env
INFOSIMPLES_API_TOKEN=seu_token_aqui
```

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://infosimples.com/consultas/cnj-seeu-processos/
