# Infosimples - API Portal da Transparência / Auxílio Emergencial

**Consulta de Beneficiários do Auxílio Emergencial (2020-2021)**

---

## VISAO GERAL

A API retorna as **50 primeiras parcelas** do Auxílio Emergencial a partir do CPF ou NIS, limitado aos últimos 12 meses de dados disponíveis.

### O que foi o Auxílio Emergencial?

O Auxílio Emergencial foi um benefício financeiro concedido pelo Governo Federal durante a pandemia de COVID-19 (2020-2021) para:
- Trabalhadores informais
- Microempreendedores individuais (MEI)
- Autônomos
- Desempregados

### Fonte dos Dados

Portal da Transparência CGU: https://portaldatransparencia.cgu.gov.br/beneficios

---

## PARAMETROS NECESSARIOS

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cpf` | string | Condicional | CPF do beneficiário |
| `nis` | string | Condicional | NIS do beneficiário |

> **Nota:** Deve informar pelo menos um: CPF ou NIS

---

## DADOS RETORNADOS

| Campo | Descrição |
|-------|-----------|
| `beneficiario` | Nome do beneficiário |
| `cpf` | CPF do beneficiário |
| `nis` | NIS do beneficiário |
| `municipio` | Município |
| `uf` | Estado (UF) |
| `parcelas` | Lista de parcelas (até 50) |

### Estrutura das Parcelas

| Campo | Descrição |
|-------|-----------|
| `mes_referencia` | Mês de referência |
| `valor` | Valor da parcela |
| `situacao` | Situação da parcela |

---

## VALORES DO AUXILIO EMERGENCIAL

### 2020 - Primeira Fase

| Perfil | Valor Mensal |
|--------|--------------|
| Padrão | R$ 600,00 |
| Mãe chefe de família | R$ 1.200,00 |

### 2020 - Segunda Fase

| Perfil | Valor Mensal |
|--------|--------------|
| Padrão | R$ 300,00 |
| Mãe chefe de família | R$ 600,00 |

### 2021

| Perfil | Valor Mensal |
|--------|--------------|
| Pessoa que mora sozinha | R$ 150,00 |
| Família | R$ 250,00 |
| Mãe chefe de família | R$ 375,00 |

---

## CASOS DE USO

### 1. Investigação de Fraudes
Verificar se pessoa recebeu auxílio indevidamente.

### 2. Due Diligence
Analisar histórico financeiro de pessoas.

### 3. Criação de Dossiês
Compilar informações sobre investigados.

### 4. Análise de Perfil
Verificar situação socioeconômica durante pandemia.

### 5. Compliance
Verificar se funcionários receberam auxílio.

---

## ENDPOINT

```
GET https://api.infosimples.com/api/v2/consultas/portal-transparencia/auxilio
```

### Parâmetros de Query

```
?token=SEU_TOKEN&cpf=12345678901
```

---

## EXEMPLO DE RESPOSTA - BENEFICIARIO ENCONTRADO

```json
{
  "code": 200,
  "code_message": "Sucesso",
  "data": [
    {
      "beneficiario": "MARIA DA SILVA",
      "cpf": "123.456.789-01",
      "nis": "12345678901",
      "municipio": "São Paulo",
      "uf": "SP",
      "parcelas": [
        {
          "mes_referencia": "04/2020",
          "valor": 600.00,
          "situacao": "Sacado"
        },
        {
          "mes_referencia": "05/2020",
          "valor": 600.00,
          "situacao": "Sacado"
        },
        {
          "mes_referencia": "06/2020",
          "valor": 600.00,
          "situacao": "Sacado"
        }
      ]
    }
  ],
  "data_count": 1
}
```

## EXEMPLO DE RESPOSTA - NAO BENEFICIARIO

```json
{
  "code": 600,
  "code_message": "Não encontrado",
  "data": [],
  "data_count": 0
}
```

---

## IMPORTANTE

> O Auxílio Emergencial foi **encerrado em outubro de 2021**. A API retorna dados históricos do período 2020-2021.

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
**Fonte:** https://infosimples.com/consultas/portal-transparencia-auxilio/
