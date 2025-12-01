# Escavador - API de Processos Judiciais

**Consulta, Busca e Atualização de Processos em Todos os Tribunais do Brasil**

---

## VISAO GERAL

A API de Processos do Escavador permite consultar dados de processos judiciais em todos os tribunais do Brasil, incluindo movimentações, envolvidos, documentos e atualizações em tempo real.

### Cobertura

- **Todos os 91 tribunais** do Brasil
- Justiça Federal, Estadual, Trabalhista, Eleitoral
- Tribunais Superiores (STF, STJ, TST, TSE)
- 1º e 2º graus de jurisdição

---

## ENDPOINTS DISPONIVEIS

### 1. Buscar Processo por Número CNJ

```
GET /api/v2/processos/numero_cnj/{numero}
```

**Custo:** R$ 0,10

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `numero` | string | Número CNJ (formato: NNNNNNN-DD.AAAA.J.TR.OOOO) |

**Dados Retornados:**
- Número CNJ
- Títulos dos polos (ativo/passivo)
- Ano de início
- Estado de origem
- Unidade de origem (vara, comarca)
- Data última movimentação
- Quantidade de movimentações
- Fontes (tribunais onde tramita)
- Processos relacionados

---

### 2. Buscar Movimentações

```
GET /api/v2/processos/numero_cnj/{numero}/movimentacoes
```

**Custo:** R$ 0,10

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `numero` | string | Número CNJ |
| `limit` | number | 50 ou 100 resultados |

**Dados Retornados:**
- ID da movimentação
- Data
- Tipo (andamento, decisão, sentença, etc.)
- Conteúdo (texto da movimentação)
- Fonte (tribunal, grau)

---

### 3. Buscar Envolvidos do Processo

```
GET /api/v2/processos/numero_cnj/{numero}/envolvidos
```

**Custo:** R$ 0,10

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `numero` | string | Número CNJ |
| `limit` | number | 50 ou 100 resultados |

**Dados Retornados:**
- Nome da parte
- Tipo de pessoa (física/jurídica)
- CPF/CNPJ (quando disponível)
- Quantidade de processos
- Participações (tipo, polo, advogados)

---

### 4. Buscar Documentos Públicos

```
GET /api/v2/processos/numero_cnj/{numero}/documentos-publicos
```

**Custo:** R$ 0,12

**Parâmetros:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `numero` | string | Número CNJ |
| `limit` | number | 50 ou 100 resultados |

**Dados Retornados:**
- ID do documento
- Título
- Descrição
- Data
- Tipo
- Extensão do arquivo
- Quantidade de páginas
- Link para download

---

### 5. Buscar Autos do Processo

```
GET /api/v2/processos/numero_cnj/{numero}/autos
```

**Custo:** Variável (requer atualização prévia com autos=1)

> **Nota:** Inclui documentos públicos e restritos. Pode requerer certificado digital.

---

### 6. Verificar Status de Atualização

```
GET /api/v2/processos/numero_cnj/{numero}/status-atualizacao
```

**Custo:** Verificar

**Dados Retornados:**
- Número CNJ
- Data última verificação
- Tempo desde última verificação
- Status da última atualização

---

### 7. Solicitar Atualização no Tribunal

```
POST /api/v2/processos/numero_cnj/{numero}/solicitar-atualizacao
```

**Custo:** R$ 0,15 a R$ 0,20 (conforme opções)

**Parâmetros (body):**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `enviar_callback` | boolean | Enviar webhook quando concluir |
| `documentos_publicos` | boolean | Baixar documentos públicos |
| `autos` | boolean | Baixar autos (requer certificado) |
| `utilizar_certificado` | boolean | Usar certificado digital |
| `certificado_id` | number | ID do certificado cadastrado |
| `usuario` | string | Login do tribunal (opcional) |
| `senha` | string | Senha do tribunal (opcional) |

---

## INFORMACOES DA CAPA

Quando você consulta um processo, a "capa" contém:

| Campo | Descrição |
|-------|-----------|
| `classe` | Classe processual (Ação Civil Pública, etc.) |
| `assunto` | Assunto principal |
| `assuntos_normalizados` | Lista de assuntos padronizados |
| `area` | Área (Cível, Criminal, Trabalhista, etc.) |
| `orgao_julgador` | Vara/Câmara julgadora |
| `situacao` | Situação do processo |
| `valor_causa` | Valor da causa |
| `data_distribuicao` | Data de distribuição |
| `data_arquivamento` | Data de arquivamento (se houver) |

---

## EXEMPLO DE USO

### Buscar Processo

```javascript
const response = await fetch(
  'https://api.escavador.com/api/v2/processos/numero_cnj/0001234-56.2023.8.26.0100',
  {
    headers: {
      'Authorization': `Bearer ${ESCAVADOR_TOKEN}`,
      'Accept': 'application/json'
    }
  }
);

const processo = await response.json();
console.log(processo.titulo_polo_ativo); // "FULANO DE TAL"
console.log(processo.fontes[0].capa.classe); // "Ação Civil Pública"
```

---

## VARIAVEIS DE AMBIENTE

```env
ESCAVADOR_TOKEN=seu_bearer_token
```

---

## LIMITES

| Item | Limite |
|------|--------|
| **Requisições/minuto** | 500 |
| **Resultados/página** | 50 ou 100 |

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://api.escavador.com/v2/docs/
