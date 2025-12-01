# Infosimples - APIs Tribunais / Certidões

**Consultas de Certidões em Tribunais Federais e Estaduais**

---

## VISAO GERAL

A Infosimples oferece APIs para emissão e consulta de certidões em todos os Tribunais Regionais Federais (TRFs) e principais Tribunais de Justiça Estaduais (TJs).

---

## TRIBUNAIS REGIONAIS FEDERAIS (TRFs)

### TRF1 - 1ª Região

| Abrangência | Estados |
|-------------|---------|
| **TRF1** | AC, AM, AP, BA, DF, GO, MA, MT, PA, PI, RO, RR, TO |

| API | Descrição |
|-----|-----------|
| **Certidão Negativa Cível e Criminal** | Emite certidão no portal do TRF1 |
| **Processo** | Consulta situação de processos |

**URLs:**
- https://infosimples.com/consultas/tribunal-trf1-certidao/
- https://infosimples.com/consultas/tribunal-trf1-processo/

---

### TRF2 - 2ª Região

| Abrangência | Estados |
|-------------|---------|
| **TRF2** | RJ, ES |

| API | Descrição |
|-----|-----------|
| **Certidão Negativa Cível e Criminal** | Emite certidão no portal do TRF2 |
| **Processo** | Consulta situação de processos |

**URLs:**
- https://infosimples.com/consultas/tribunal-trf2-certidao/
- https://infosimples.com/consultas/tribunal-trf2-processo/

---

### TRF3 - 3ª Região

| Abrangência | Estados |
|-------------|---------|
| **TRF3** | SP, MS |

| API | Descrição |
|-----|-----------|
| **Certidão de Distribuição** | Certidão de distribuição de processos |

**URL:** https://infosimples.com/consultas/tribunal-trf3-certidao-distr/

---

### TRF4 - 4ª Região

| Abrangência | Estados |
|-------------|---------|
| **TRF4** | RS, PR, SC |

| API | Descrição |
|-----|-----------|
| **Certidão Negativa Cível e Criminal** | Emite certidão no portal do TRF4 |

**URL:** https://infosimples.com/consultas/tribunal-trf4-certidao/

---

### TRF5 - 5ª Região

| Abrangência | Estados |
|-------------|---------|
| **TRF5** | AL, CE, PB, PE, RN, SE |

| API | Descrição |
|-----|-----------|
| **Certidão Negativa Cível e Criminal** | Emite certidão no portal do TRF5 |

**URL:** https://infosimples.com/consultas/tribunal-trf5-certidao/

---

### TRF6 - 6ª Região

| Abrangência | Estados |
|-------------|---------|
| **TRF6** | MG |

| API | Descrição |
|-----|-----------|
| **Certidão Negativa Cível e Criminal** | Emite certidão no portal do TRF6 |

**URL:** https://infosimples.com/consultas/tribunal-trf6-certidao/

---

## TRIBUNAIS DE JUSTICA ESTADUAIS (TJs)

### TJSP - São Paulo

| API | Descrição |
|-----|-----------|
| **Visualizar Certidão** | Obtém PDF de certidão do TJSP |

**URL:** https://infosimples.com/consultas/tribunal-tjsp-obter-certidao/

---

### TJRS - Rio Grande do Sul

| API | Descrição |
|-----|-----------|
| **Certidão do 1º Grau** | Certidão de 1º grau de jurisdição |

**URL:** https://infosimples.com/consultas/tribunal-tjrs-primeiro-grau/

---

## DADOS TIPICAMENTE RETORNADOS

| Campo | Descrição |
|-------|-----------|
| `certidao_pdf` | PDF da certidão (base64) |
| `certidao_url` | URL para download |
| `situacao` | Positiva ou Negativa |
| `validade` | Data de validade |
| `numero_certidao` | Número da certidão |
| `data_emissao` | Data de emissão |
| `processos` | Lista de processos (se positiva) |

---

## TIPOS DE CERTIDAO

| Tipo | Descrição |
|------|-----------|
| **Negativa** | Não há processos contra a pessoa/empresa |
| **Positiva** | Há processos em andamento |
| **Positiva com Efeito de Negativa** | Há processos, mas suspensos/parcelados |

---

## CASOS DE USO

### 1. Due Diligence
Verificar situação judicial de pessoas e empresas.

### 2. Licitações
Certidões exigidas para participar de licitações.

### 3. Contratações
Verificar antecedentes de funcionários/fornecedores.

### 4. Análise de Crédito
Verificar se há processos antes de conceder crédito.

### 5. KYC (Know Your Customer)
Conhecer situação judicial de clientes.

### 6. Imobiliário
Certidões para compra/venda de imóveis.

---

## PRECO

| Item | Valor |
|------|-------|
| **Preço Base** | Conforme tabela escalonada |
| **Preço Adicional** | Varia por tribunal |

Consulte a [tabela de preços](INFOSIMPLES_PLANOS_PRECOS.md) para valores por faixa.

---

## VARIAVEIS DE AMBIENTE

```env
INFOSIMPLES_API_TOKEN=seu_token_aqui
```

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://infosimples.com/consultas/
