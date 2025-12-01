# Infosimples - API TSE / Doadores e Fornecedores

**Consulta de Doações e Fornecimentos para Campanhas Eleitorais**

---

## VISAO GERAL

A API consulta Doadores e Fornecedores de Eleições Gerais ou Municipais desde **2002** no portal de Divulgação de Candidaturas e Contas Eleitorais do Tribunal Superior Eleitoral (TSE).

### Cobertura

- Eleições Gerais (Presidente, Governador, Senador, Deputados)
- Eleições Municipais (Prefeito, Vereadores)
- Dados desde **2002** até a eleição mais recente

---

## PARAMETROS NECESSARIOS

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `ano` | string | Sim | Ano da eleição (ex: 2022, 2024) |
| `cpf` | string | Condicional | CPF do doador/fornecedor |
| `cnpj` | string | Condicional | CNPJ do doador/fornecedor |
| `nome` | string | Condicional | Nome do doador/fornecedor |

> **Nota:** Deve informar pelo menos um: CPF, CNPJ ou Nome

---

## DADOS RETORNADOS

### Dados Básicos

| Campo | Descrição |
|-------|-----------|
| `cpf` | CPF do doador/fornecedor |
| `cnpj` | CNPJ do doador/fornecedor |
| `nome` | Nome do doador/fornecedor |
| `tipo` | Tipo (Pessoa Física ou Jurídica) |

### Doações

| Campo | Descrição |
|-------|-----------|
| `doacoes.lista` | Lista de doações realizadas |
| `doacoes.quantidade` | Quantidade de doações |
| `doacoes.ranking` | Posição no ranking de doadores |
| `doacoes.valor_estimado` | Valor estimado das doações |
| `doacoes.valor_financeiro` | Valor financeiro das doações |
| `doacoes.valor_total` | Valor total das doações |

### Fornecimentos

| Campo | Descrição |
|-------|-----------|
| `fornecimentos.lista` | Lista de fornecimentos |
| `fornecimentos.quantidade` | Quantidade de fornecimentos |
| `fornecimentos.ranking` | Posição no ranking de fornecedores |
| `fornecimentos.valor_despesas` | Valor de despesas |
| `fornecimentos.valor_terceiros` | Valor de terceiros |
| `fornecimentos.valor_total` | Valor total de fornecimentos |

### Limite de Resultados

> **Retorna até 10 doadores/fornecedores por pesquisa**

---

## CASOS DE USO

### 1. Due Diligence Política
Verificar se pessoa/empresa fez doações para campanhas.

### 2. Análise de Risco Reputacional
Identificar vínculos políticos de parceiros de negócios.

### 3. Compliance
Verificar exposição política de clientes (PEP).

### 4. Investigação
Identificar quais candidatos receberam doações.

### 5. KYC (Know Your Customer)
Conhecer histórico político de clientes/parceiros.

---

## ENDPOINT

```
GET https://api.infosimples.com/api/v2/consultas/tse/doadores-fornecedores
```

### Parâmetros de Query

```
?token=SEU_TOKEN&cpf=12345678901&ano=2022
```

ou

```
?token=SEU_TOKEN&cnpj=12345678000199&ano=2024
```

---

## EXEMPLO DE RESPOSTA - DOADOR ENCONTRADO

```json
{
  "code": 200,
  "code_message": "Sucesso",
  "data": [
    {
      "cpf": "123.456.789-01",
      "nome": "FULANO DE TAL",
      "tipo": "Pessoa Física",
      "doacoes": {
        "lista": [
          {
            "candidato": "CANDIDATO A",
            "partido": "PARTIDO X",
            "cargo": "Deputado Federal",
            "valor": 5000.00,
            "data": "15/08/2022"
          }
        ],
        "quantidade": 1,
        "valor_total": 5000.00
      },
      "fornecimentos": {
        "lista": [],
        "quantidade": 0,
        "valor_total": 0
      }
    }
  ],
  "data_count": 1
}
```

## EXEMPLO DE RESPOSTA - NAO ENCONTRADO

```json
{
  "code": 600,
  "code_message": "Não encontrado",
  "data": [],
  "data_count": 0
}
```

---

## ANOS DE ELEICAO DISPONIVEIS

| Ano | Tipo de Eleição |
|-----|-----------------|
| 2002 | Geral |
| 2004 | Municipal |
| 2006 | Geral |
| 2008 | Municipal |
| 2010 | Geral |
| 2012 | Municipal |
| 2014 | Geral |
| 2016 | Municipal |
| 2018 | Geral |
| 2020 | Municipal |
| 2022 | Geral |
| 2024 | Municipal |

---

## PRECO

| Item | Valor |
|------|-------|
| **Preço Base** | Conforme tabela escalonada |
| **Preço Adicional** | Não tem |

Consulte a [tabela de preços](INFOSIMPLES_PLANOS_PRECOS.md) para valores por faixa.

---

## VARIAVEIS DE AMBIENTE

```env
INFOSIMPLES_API_TOKEN=seu_token_aqui
```

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://infosimples.com/consultas/tse-doadores-fornecedores/
