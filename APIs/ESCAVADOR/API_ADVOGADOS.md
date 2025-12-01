# Escavador - API de Advogados

**Busca de Processos por Número OAB**

---

## VISAO GERAL

A API de Advogados permite buscar processos onde um advogado atuou, utilizando o número de inscrição na OAB.

---

## ENDPOINTS DISPONIVEIS

### 1. Buscar Processos por OAB

```
GET /api/v2/advogado/processos
```

**Custo:** R$ 0,10

**Parâmetros de Query:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `oab_numero` | string | Sim | Número da OAB |
| `oab_estado` | string | Sim | Estado da OAB (sigla: SP, RJ, etc.) |
| `oab_tipo` | string | Não | Tipo de inscrição |
| `ordem` | string | Não | `asc` ou `desc` |
| `limit` | number | Não | 50 ou 100 |
| `tribunais[]` | array | Não | Filtrar por tribunais |
| `status` | string | Não | `ATIVO` ou `INATIVO` |
| `data_minima` | string | Não | Data mínima (YYYY-MM-DD) |
| `data_maxima` | string | Não | Data máxima (YYYY-MM-DD) |

### Tipos de OAB

| Tipo | Descrição |
|------|-----------|
| `ADVOGADO` | Inscrição principal |
| `SUPLEMENTAR` | Inscrição suplementar (outro estado) |
| `ESTAGIARIO` | Estagiário de advocacia |
| `CONSULTOR_ESTRANGEIRO` | Advogado estrangeiro |

---

### 2. Obter Resumo do Advogado

```
GET /api/v2/advogado/resumo
```

**Custo:** GRÁTIS

**Parâmetros de Query:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `oab_numero` | string | Sim | Número da OAB |
| `oab_estado` | string | Sim | Estado da OAB |
| `oab_tipo` | string | Não | Tipo de inscrição |

**Dados Retornados:**
- Nome do advogado
- Tipo de inscrição
- Quantidade de processos

---

## DADOS RETORNADOS

### Lista de Processos

Para cada processo:

| Campo | Descrição |
|-------|-----------|
| `numero_cnj` | Número do processo |
| `titulo_polo_ativo` | Parte autora |
| `titulo_polo_passivo` | Parte ré |
| `ano_inicio` | Ano de início |
| `estado_origem` | Estado |
| `fontes` | Tribunais |

### Envolvidos com OAB

Cada envolvido pode ter lista de OABs:

```json
{
  "nome": "FULANO DE TAL",
  "oabs": [
    {
      "uf": "SP",
      "tipo": "ADVOGADO",
      "numero": 123456
    },
    {
      "uf": "RJ",
      "tipo": "SUPLEMENTAR",
      "numero": 234567
    }
  ]
}
```

---

## EXEMPLOS DE USO

### Buscar Processos de um Advogado

```javascript
const oabNumero = '123456';
const oabEstado = 'SP';

const response = await fetch(
  `https://api.escavador.com/api/v2/advogado/processos?oab_numero=${oabNumero}&oab_estado=${oabEstado}`,
  {
    headers: {
      'Authorization': `Bearer ${ESCAVADOR_TOKEN}`,
      'Accept': 'application/json'
    }
  }
);

const data = await response.json();
console.log(`Processos encontrados: ${data.items.length}`);
```

### Verificar Resumo (Grátis)

```javascript
const response = await fetch(
  `https://api.escavador.com/api/v2/advogado/resumo?oab_numero=123456&oab_estado=SP`,
  {
    headers: {
      'Authorization': `Bearer ${ESCAVADOR_TOKEN}`,
      'Accept': 'application/json'
    }
  }
);

const resumo = await response.json();
console.log(`${resumo.nome}: ${resumo.quantidade_processos} processos`);
```

---

## CASOS DE USO

### 1. Due Diligence de Advogados
Verificar histórico de atuação de um advogado.

### 2. Análise de Carteira
Mapear processos de um escritório.

### 3. Verificação de Experiência
Confirmar experiência em determinada área.

### 4. Compliance
Verificar conflitos de interesse.

---

## VARIAVEIS DE AMBIENTE

```env
ESCAVADOR_TOKEN=seu_bearer_token
```

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://api.escavador.com/v2/docs/
