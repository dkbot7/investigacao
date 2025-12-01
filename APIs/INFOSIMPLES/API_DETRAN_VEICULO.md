# Infosimples - APIs DETRAN / Veículos

**Consultas de Veículos nos DETRANs Estaduais**

---

## VISAO GERAL

A Infosimples oferece APIs para consulta de veículos em praticamente todos os DETRANs estaduais do Brasil, além de uma API unificada para consulta nacional de restrições.

---

## API UNIFICADA - DETRAN / Restrições

### Descrição
Consulta restrições em veículos de qualquer estado do Brasil.

### Parâmetros Obrigatórios

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `uf` | string | Estado do veículo |
| `placa` | string | Placa do veículo |
| `renavam` | string | RENAVAM do veículo |
| `chassi` | string | Chassi do veículo |

### Requisitos Especiais por Estado

| UF | Requisito Adicional |
|----|---------------------|
| **TO** | CPF/CNPJ do proprietário |
| **MG, RS, SC** | Login/senha gov.br |
| **SP** | Login/senha DETRAN-SP |

### URL
https://infosimples.com/consultas/detran-restricoes/

---

## APIs POR ESTADO

### DETRAN-SP (São Paulo)

| API | Descrição |
|-----|-----------|
| **Débitos e Restrições** | Consulta débitos, restrições e vistorias |

**Dados retornados:** Débitos pendentes, restrições, vistorias
**URL:** https://infosimples.com/consultas/detran-sp-debitos/

---

### DETRAN-RS (Rio Grande do Sul)

| API | Descrição |
|-----|-----------|
| **Veículo** | Dados do veículo e débitos |

**Casos de uso:** Prevenção a fraudes, gestão cadastral e fiscal
**URL:** https://infosimples.com/consultas/detran-rs-veiculo/

---

### DETRAN-PR (Paraná)

| API | Descrição |
|-----|-----------|
| **Veículo (Completa)** | Dados completos + pendências detalhadas |

**Dados retornados:**
- Cadastro do veículo
- Licenciamento anual
- Seguro obrigatório (DPVAT)
- IPVA
- Multas e autuações

**URL:** https://infosimples.com/consultas/detran-pr-veiculo-completa/

---

### DETRAN-MG (Minas Gerais)

| API | Descrição |
|-----|-----------|
| **Multas (Descritivos)** | Detalhes de autuações e multas |

**Parâmetros:** Placa + Chassi
**URL:** https://infosimples.com/consultas/detran-mg-multas-descritivos/

---

### DETRAN-MS (Mato Grosso do Sul)

| API | Descrição |
|-----|-----------|
| **Veículo** | Cadastro do veículo |
| **Guia Flex / Licenciamentos** | Licenciamentos |

**URLs:**
- https://infosimples.com/consultas/detran-ms-veiculo/
- https://infosimples.com/consultas/detran-ms-licenciamentos-flex/

---

### Outros Estados

| UF | API | URL |
|----|-----|-----|
| **AL** | Veículo | https://infosimples.com/consultas/detran-al-veiculo/ |
| **AP** | Veículo | https://infosimples.com/consultas/detran-ap-veiculo/ |
| **PA** | Veículo | https://infosimples.com/consultas/detran-pa-veiculo/ |

---

## DADOS TIPICAMENTE RETORNADOS

| Campo | Descrição |
|-------|-----------|
| `placa` | Placa do veículo |
| `renavam` | Código RENAVAM |
| `chassi` | Número do chassi |
| `marca_modelo` | Marca e modelo |
| `ano_fabricacao` | Ano de fabricação |
| `ano_modelo` | Ano do modelo |
| `cor` | Cor do veículo |
| `combustivel` | Tipo de combustível |
| `categoria` | Categoria do veículo |
| `situacao` | Situação do veículo |
| `restricoes` | Lista de restrições |
| `debitos` | Lista de débitos |
| `multas` | Lista de multas |

---

## CASOS DE USO

### 1. Prevenção a Fraudes
Verificar se veículo tem restrições antes de compra/venda.

### 2. Gestão de Frotas
Monitorar débitos e multas de veículos empresariais.

### 3. Locadoras
Verificar situação de veículos antes de alugar.

### 4. Financeiras
Consultar restrições antes de financiar veículo.

### 5. Seguradoras
Verificar situação do veículo para cotação.

---

## PRECO

| Item | Valor |
|------|-------|
| **Preço Base** | Conforme tabela escalonada |
| **Preço Adicional** | R$ 0,02 a R$ 0,10 (varia por estado) |

> **ATENÇÃO:** APIs de DETRAN geralmente têm preço adicional devido aos custos de automação.

Consulte a [tabela de preços](INFOSIMPLES_PLANOS_PRECOS.md) para valores por faixa.

---

## VARIAVEIS DE AMBIENTE

```env
INFOSIMPLES_API_TOKEN=seu_token_aqui
```

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://infosimples.com/consultas/
