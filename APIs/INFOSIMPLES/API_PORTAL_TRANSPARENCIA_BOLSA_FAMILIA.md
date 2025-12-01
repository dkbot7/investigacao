# Infosimples - API Portal da Transparência / Bolsa Família

**Consulta de Beneficiários do Programa Bolsa Família**

---

## VISAO GERAL

A API retorna as **50 primeiras parcelas** de recebidos e sacados do Bolsa Família a partir do CPF ou NIS enviado para a consulta de Benefícios do Portal da Transparência.

### Fonte dos Dados

Portal da Transparência CGU: https://portaldatransparencia.cgu.gov.br/beneficios

---

## PARAMETROS NECESSARIOS

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cpf` | string | Condicional | CPF do beneficiário |
| `nis` | string | Condicional | NIS do beneficiário |
| `data_inicio` | string | Não | Data início (filtro) |
| `data_fim` | string | Não | Data fim (filtro) |
| `municipio` | string | Não | Município (filtro) |

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
| `valor` | Valor do benefício |
| `recebidos` | Lista de parcelas recebidas (até 50) |
| `sacados` | Lista de parcelas sacadas (até 50) |

### Estrutura das Parcelas

| Campo | Descrição |
|-------|-----------|
| `mes_referencia` | Mês de referência |
| `valor` | Valor da parcela |
| `data_saque` | Data do saque (se sacado) |

---

## LIMITE DE RESULTADOS

> **Retorna até 50 parcelas** de recebidos e sacados

---

## CASOS DE USO

### 1. Criação de Dossiês
Compilar informações sobre pessoas investigadas.

### 2. KYC (Know Your Customer)
Verificar se cliente recebe benefícios sociais.

### 3. Análise de Risco
Avaliar perfil socioeconômico de clientes.

### 4. Due Diligence
Verificar informações declaradas por pessoas.

### 5. Investigação
Identificar beneficiários de programas sociais.

---

## ENDPOINT

```
GET https://api.infosimples.com/api/v2/consultas/portal-transparencia/bolsa-familia
```

### Parâmetros de Query

```
?token=SEU_TOKEN&cpf=12345678901
```

ou

```
?token=SEU_TOKEN&nis=12345678901
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
      "valor": 600.00,
      "recebidos": [
        {
          "mes_referencia": "11/2025",
          "valor": 600.00
        },
        {
          "mes_referencia": "10/2025",
          "valor": 600.00
        }
      ],
      "sacados": [
        {
          "mes_referencia": "11/2025",
          "valor": 600.00,
          "data_saque": "20/11/2025"
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
| **200** | Pessoa recebe Bolsa Família |
| **600** | Pessoa NÃO recebe Bolsa Família |

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
**Fonte:** https://infosimples.com/consultas/portal-transparencia-bolsa/
