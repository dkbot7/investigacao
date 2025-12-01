# Escavador - API de Envolvidos

**Busca de Processos por CPF, CNPJ ou Nome**

---

## VISAO GERAL

A API de Envolvidos permite buscar processos judiciais a partir de dados de uma pessoa física ou jurídica, incluindo CPF, CNPJ ou nome.

---

## ENDPOINTS DISPONIVEIS

### 1. Buscar Processos por CPF/CNPJ

```
GET /api/v2/envolvido/processos
```

**Custo:** R$ 0,10

**Parâmetros de Query:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cpf_cnpj` | string | Sim* | CPF ou CNPJ (apenas números) |
| `nome` | string | Sim* | Nome da pessoa/empresa |
| `ordem` | string | Não | `asc` ou `desc` |
| `limit` | number | Não | 50 ou 100 |
| `tribunais[]` | array | Não | Filtrar por tribunais |
| `incluir_homonimos` | boolean | Não | Incluir homônimos |
| `status` | string | Não | `ATIVO` ou `INATIVO` |
| `data_minima` | string | Não | Data mínima (YYYY-MM-DD) |
| `data_maxima` | string | Não | Data máxima (YYYY-MM-DD) |

*Obrigatório informar `cpf_cnpj` OU `nome`

---

### 2. Buscar Processos por Nome

```
GET /api/v2/envolvido/processos?nome={nome}
```

**Custo:** R$ 0,10

> **ATENÇÃO:** Busca por nome pode retornar homônimos. Recomenda-se filtrar por estado quando possível.

---

### 3. Obter Resumo do Envolvido

```
GET /api/v2/envolvido/resumo
```

**Custo:** GRÁTIS

**Parâmetros de Query:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cpf_cnpj` | string | Sim* | CPF ou CNPJ |
| `nome` | string | Sim* | Nome da pessoa/empresa |

**Dados Retornados:**
- Nome
- Tipo de pessoa (física/jurídica)
- Quantidade de processos

> **Dica:** Use o resumo (gratuito) antes de listar processos para verificar se há resultados.

---

## DADOS RETORNADOS

### Envolvido Encontrado

| Campo | Descrição |
|-------|-----------|
| `nome` | Nome encontrado |
| `tipo_pessoa` | `fisica` ou `juridica` |
| `quantidade_processos` | Total de processos |

### Lista de Processos

Para cada processo:

| Campo | Descrição |
|-------|-----------|
| `numero_cnj` | Número do processo |
| `titulo_polo_ativo` | Parte autora |
| `titulo_polo_passivo` | Parte ré |
| `ano_inicio` | Ano de início |
| `data_inicio` | Data de início |
| `estado_origem` | Estado onde iniciou |
| `unidade_origem` | Vara/comarca |
| `data_ultima_movimentacao` | Última movimentação |
| `quantidade_movimentacoes` | Total de movimentações |
| `fontes` | Tribunais onde tramita |

---

## OBSERVACOES IMPORTANTES

### Busca por CPF

Pode ocorrer de a pessoa ter homônimos, tornando o nome não único. Além disso, se os processos não tiverem o CPF registrado no sistema do tribunal, podem não ser retornados.

**Recomendação:** Combine busca por CPF + busca por nome filtrada por estado.

### Busca por Nome

- Pode retornar homônimos
- Recomenda-se filtrar por estado
- Use aspas para nomes compostos

---

## EXEMPLOS DE USO

### Buscar por CPF

```javascript
const cpf = '12345678901';
const response = await fetch(
  `https://api.escavador.com/api/v2/envolvido/processos?cpf_cnpj=${cpf}`,
  {
    headers: {
      'Authorization': `Bearer ${ESCAVADOR_TOKEN}`,
      'Accept': 'application/json'
    }
  }
);

const data = await response.json();
console.log(`Encontrados: ${data.envolvido_encontrado.quantidade_processos} processos`);
```

### Verificar Resumo (Grátis)

```javascript
const cpf = '12345678901';
const response = await fetch(
  `https://api.escavador.com/api/v2/envolvido/resumo?cpf_cnpj=${cpf}`,
  {
    headers: {
      'Authorization': `Bearer ${ESCAVADOR_TOKEN}`,
      'Accept': 'application/json'
    }
  }
);

const resumo = await response.json();
console.log(`${resumo.nome}: ${resumo.quantidade_processos} processos`);
// Se quantidade > 0, então buscar lista detalhada
```

---

## FILTROS DISPONIVEIS

### Por Tribunal

```
?tribunais[]=TJSP&tribunais[]=TRF3
```

### Por Status

```
?status=ATIVO     // Apenas processos ativos
?status=INATIVO   // Apenas arquivados
```

### Por Data

```
?data_minima=2020-01-01
?data_maxima=2024-12-31
```

---

## VARIAVEIS DE AMBIENTE

```env
ESCAVADOR_TOKEN=seu_bearer_token
```

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://api.escavador.com/v2/docs/
