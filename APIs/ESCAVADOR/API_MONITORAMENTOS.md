# Escavador - API de Monitoramentos

**Acompanhamento Automático de Processos e Termos**

---

## VISAO GERAL

A API de Monitoramentos permite criar alertas para:
1. **Monitoramento de Processos** - Acompanhar movimentações de processos específicos
2. **Monitoramento de Novos Processos** - Alertar quando um termo aparecer em novos processos

---

## 1. MONITORAMENTO DE PROCESSOS

### Criar Monitoramento

```
POST /api/v2/monitoramentos/processos
```

**Custo:** Mensal (verificar plano)

**Parâmetros (body):**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `numero` | string | Sim | Número CNJ do processo |
| `tribunal` | string | Não | Sigla do tribunal específico |
| `frequencia` | string | Não | `DIARIA` ou `SEMANAL` |

**Resposta:**
```json
{
  "id": 12345,
  "numero": "0001234-56.2023.8.26.0100",
  "criado_em": "2025-11-30T10:00:00",
  "data_ultima_verificacao": null,
  "tribunais": [...],
  "frequencia": "DIARIA",
  "status": "ATIVO"
}
```

---

### Listar Monitoramentos

```
GET /api/v2/monitoramentos/processos
```

**Custo:** Gratuito

---

### Obter Monitoramento

```
GET /api/v2/monitoramentos/processos/{id}
```

**Custo:** Gratuito

---

### Remover Monitoramento

```
DELETE /api/v2/monitoramentos/processos/{id}
```

**Custo:** Gratuito

---

## 2. MONITORAMENTO DE NOVOS PROCESSOS

### Criar Monitoramento de Termo

```
POST /api/v2/monitoramentos/novos-processos
```

**Custo:** Mensal (verificar plano)

**Parâmetros (body):**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `termo` | string | Sim | Termo a monitorar (nome, CPF, empresa) |
| `variacoes` | array | Não | Variações do termo |
| `termos_auxiliares` | array | Não | Condições adicionais |
| `tribunais` | array | Não | Tribunais específicos |

### Termos Auxiliares

| Condição | Descrição |
|----------|-----------|
| `CONTEM` | Deve conter o termo |
| `NAO_CONTEM` | Não pode conter o termo |
| `CONTEM_ALGUMA` | Deve conter pelo menos um termo |

**Exemplo:**
```json
{
  "termo": "EMPRESA XYZ LTDA",
  "variacoes": ["EMPRESA XYZ", "XYZ LTDA"],
  "termos_auxiliares": [
    { "condicao": "NAO_CONTEM", "termo": "HOMÔNIMO" }
  ],
  "tribunais": ["TJSP", "TRF3"]
}
```

---

### Listar Monitoramentos

```
GET /api/v2/monitoramentos/novos-processos
```

**Custo:** Gratuito

---

### Obter Monitoramento

```
GET /api/v2/monitoramentos/novos-processos/{id}
```

**Custo:** Gratuito

---

### Remover Monitoramento

```
DELETE /api/v2/monitoramentos/novos-processos/{id}
```

**Custo:** Gratuito

---

### Listar Resultados

```
GET /api/v2/monitoramentos/novos-processos/{id}/resultados
```

**Custo:** Verificar

**Resposta:**
```json
{
  "items": [
    {
      "numero_cnj": "0001234-56.2023.8.26.0100",
      "data_inicio": "2025-11-30",
      "tribunal": "TJSP",
      "match": "EMPRESA XYZ LTDA",
      "estado_origem": { "nome": "São Paulo", "sigla": "SP" }
    }
  ]
}
```

---

## 3. CALLBACKS (WEBHOOKS)

### Listar Callbacks

```
GET /api/v2/callbacks
```

**Custo:** GRÁTIS

**Parâmetros de Query:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `data_minima` | string | Data mínima |
| `data_maxima` | string | Data máxima |
| `evento` | string | Tipo de evento |
| `item_tipo` | string | Tipo: `busca_assincrona`, `monitoramento_tribunal`, `monitoramento_diario` |
| `item_id` | number | ID do item |
| `status` | string | `sucesso`, `em_tentativa`, `erro` |

---

### Marcar Callbacks como Recebidos

```
POST /api/v2/callbacks/marcar-recebidos
```

**Custo:** GRÁTIS

**Body:**
```json
{
  "ids": [1, 2, 3]
}
```

---

### Reenviar Callback

```
POST /api/v2/callbacks/{id}/reenviar
```

**Custo:** GRÁTIS

---

## CASOS DE USO

### 1. Acompanhamento de Clientes
Monitorar processos de clientes automaticamente.

### 2. Gestão de Carteira
Receber alertas de movimentações.

### 3. Vigilância de Concorrentes
Monitorar quando empresa concorrente é processada.

### 4. Due Diligence Contínua
Acompanhar novos processos de parceiros de negócio.

---

## FREQUENCIAS DISPONIVEIS

| Frequência | Descrição |
|------------|-----------|
| `DIARIA` | Verificação diária |
| `SEMANAL` | Verificação semanal |

---

## VARIAVEIS DE AMBIENTE

```env
ESCAVADOR_TOKEN=seu_bearer_token
ESCAVADOR_CALLBACK_URL=https://seu-site.com/webhook/escavador
```

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://api.escavador.com/v2/docs/
