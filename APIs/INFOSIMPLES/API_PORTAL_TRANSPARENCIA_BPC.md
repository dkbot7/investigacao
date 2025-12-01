# Infosimples - API Portal da Transparência / BPC

**Consulta de Beneficiários do Benefício de Prestação Continuada**

---

## VISAO GERAL

A API consulta o Portal da Transparência para o Benefício de Prestação Continuada (BPC), limitando a **50 parcelas** na tabela de disponibilizados.

### O que é o BPC?

O BPC é um benefício assistencial (não previdenciário) garantido pela LOAS (Lei Orgânica da Assistência Social) que paga 1 salário mínimo mensal a:
- Idosos com 65 anos ou mais
- Pessoas com deficiência de qualquer idade

Requisito: Renda familiar per capita inferior a 1/4 do salário mínimo.

### Fonte dos Dados

Portal da Transparência CGU: https://portaldatransparencia.cgu.gov.br/beneficios/bpc

---

## PARAMETROS NECESSARIOS

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cpf` | string | Sim | CPF do beneficiário |

---

## DADOS RETORNADOS

| Campo | Descrição |
|-------|-----------|
| `beneficiario` | Nome do beneficiário |
| `cpf` | CPF do beneficiário |
| `cpf_representante_legal` | CPF do representante legal (se houver) |
| `municipio` | Município |
| `uf` | Estado (UF) |
| `valor` | Valor do benefício (1 salário mínimo) |
| `parcelas` | Lista de parcelas (até 50) |

### Estrutura das Parcelas

| Campo | Descrição |
|-------|-----------|
| `mes_competencia` | Mês de competência |
| `mes_referencia` | Mês de referência |
| `municipio` | Município |
| `valor` | Valor da parcela |
| `observacoes` | Observações |

---

## LIMITE DE RESULTADOS

> **Retorna até 50 parcelas** disponibilizadas

---

## CASOS DE USO

### 1. Análise de Risco Reputacional
Acompanhar se parceiros de negócios recebem benefícios assistenciais.

### 2. Due Diligence
Verificar informações declaradas por pessoas.

### 3. Criação de Dossiês
Compilar informações sobre pessoas investigadas.

### 4. KYC (Know Your Customer)
Verificar perfil socioeconômico de clientes.

### 5. Terceirização de Serviços
Avaliar perfil de prestadores de serviço.

---

## ENDPOINT

```
GET https://api.infosimples.com/api/v2/consultas/portal-transparencia/bpc
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
      "beneficiario": "JOSE DA SILVA",
      "cpf": "123.456.789-01",
      "cpf_representante_legal": null,
      "municipio": "Rio de Janeiro",
      "uf": "RJ",
      "valor": 1412.00,
      "parcelas": [
        {
          "mes_competencia": "11/2025",
          "mes_referencia": "11/2025",
          "municipio": "Rio de Janeiro",
          "valor": 1412.00,
          "observacoes": null
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

## INTERPRETACAO DOS RESULTADOS

| Código | Significado |
|--------|-------------|
| **200** | Pessoa recebe BPC |
| **600** | Pessoa NÃO recebe BPC |

---

## VALOR DO BPC

| Ano | Valor |
|-----|-------|
| 2024 | R$ 1.412,00 |
| 2025 | R$ 1.518,00 (previsto) |

> O BPC sempre equivale a 1 salário mínimo vigente

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
**Fonte:** https://infosimples.com/consultas/portal-transparencia-bpc/
