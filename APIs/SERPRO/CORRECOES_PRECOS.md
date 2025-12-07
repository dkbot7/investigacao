# Correções de Preços - Valores Oficiais dos Contratos SERPRO

📅 **Data da Revisão**: 06/12/2025
🔍 **Fonte**: Anexo I dos contratos oficiais SERPRO
✅ **Status**: Valores validados contra PDFs dos contratos

---

## ✅ APIs COM VALORES CORRETOS

As seguintes APIs **NÃO necessitam correção** - os valores no relatório conferem com os contratos:

### 1. Consulta Renda (Contratos 260008 & 261071) ✅
- Faixa 1 (1-5): R$ 0,00 (GRÁTIS) ✅
- Faixa 2 (6-1.000.000): R$ 1,569 ✅
- Faixa 3 (1.000.001-2.000.000): R$ 1,517 ✅
- Faixa 4 (2.000.001-3.000.000): R$ 1,465 ✅
- Faixa 5 (3.000.001-4.000.000): R$ 1,412 ✅
- Faixa 6 (4.000.001-5.000.000): R$ 1,36 ✅
- Faixa 7 (5.000.001-6.000.000): R$ 1,308 ✅
- Faixa 8 (6.000.001-7.000.000): R$ 1,255 ✅
- Faixa 9 (7.000.001-8.000.000): R$ 1,203 ✅
- Faixa 10 (Acima de 8.000.000): R$ 1,151 ✅

### 2. Datavalid V4 (Contrato 261070) ✅
Todos os 8 tipos de validação estão corretos conforme o contrato

### 3. Raiz Tech (Contrato 261072) ✅
- Faixa 1 (1-5.000): R$ 3,50 ✅
- Faixa 2 (5.001-10.000): R$ 3,32 ✅
- Faixa 3 (10.001-50.000): R$ 3,15 ✅
- Faixa 4 (50.001-120.000): R$ 2,97 ✅
- Faixa 5 (120.001-180.000): R$ 2,80 ✅
- Faixa 6 (A partir de 180.001): R$ 2,62 ✅

---

## ⚠️ CORREÇÕES NECESSÁRIAS

### 1. Consulta CPF (Contrato 260005)

**Valores no relatório atual vs Contrato oficial:**

| Faixa | Volume | Relatório (INCORRETO) | Contrato (CORRETO) | Diferença |
|-------|--------|----------------------|-------------------|-----------|
| 1 | 1-999 | R$ 0,6590 | **R$ 0,659** | Arredondamento |
| 2 | 1.000-9.999 | R$ 0,5650 | **R$ 0,565** | Arredondamento |
| 3 | 10.000-49.999 | R$ 0,3560 | **R$ 0,356** | Arredondamento |
| 4 | 50.000-99.999 | R$ 0,2620 | **R$ 0,262** | Arredondamento |
| 5 | 100.000-249.999 | R$ 0,1780 | **R$ 0,178** | Arredondamento |
| 6 | 250.000-499.999 | R$ 0,1570 | **R$ 0,157** | Arredondamento |
| 7 | 500.000-999.999 | R$ 0,1460 | **R$ 0,146** | Arredondamento |
| 8 | 1.000.000-1.499.999 | R$ 0,1360 | **R$ 0,136** | Arredondamento |
| 9 | 1.500.000-2.999.999 | R$ 0,1150 | **R$ 0,115** | Arredondamento |
| 10 | 3.000.000-4.499.999 | R$ 0,0730 | **R$ 0,073** | Arredondamento |
| 11 | 4.500.000-9.999.999 | R$ 0,0520 | **R$ 0,052** | Arredondamento |
| 12 | 10.000.000-16.999.999 | R$ 0,0310 | **R$ 0,031** | Arredondamento |
| 13 | 17.000.000-19.999.999 | R$ 0,0260 | **R$ 0,026** | Arredondamento |
| 14 | 20.000.000-24.999.999 | R$ 0,0230 | **R$ 0,023** | Arredondamento |
| 15 | 25.000.000-29.999.999 | R$ 0,0200 | **R$ 0,02** | OK |
| 16 | 30.000.000+ | R$ 0,0170 | **R$ 0,017** | Arredondamento |

**Observação**: Diferença é apenas de formatação (casas decimais). Valores reais são os mesmos.

---

### 2. Consulta CNPJ (Contrato 260009)

#### 2.1 Consulta Básica - Valores CORRETOS ✅

| Faixa | Volume | Valor Contrato |
|-------|--------|---------------|
| 1 | 1-999 | R$ 0,659 |
| 2 | 1.000-9.999 | R$ 0,565 |
| 3 | 10.000-49.999 | R$ 0,356 |
| 4 | 50.000-99.999 | R$ 0,262 |
| 5 | 100.000-249.999 | R$ 0,178 |
| 6 | 250.000-499.999 | R$ 0,157 |
| 7 | 500.000-999.999 | R$ 0,146 |
| 8 | 1.000.000-1.499.999 | R$ 0,136 |
| 9 | 1.500.000-2.999.999 | R$ 0,115 |
| 10 | 3.000.000-4.999.999 | R$ 0,07 |
| 11 | 5.000.000-6.999.999 | R$ 0,06 |
| 12 | 7.000.000-9.999.999 | R$ 0,05 |
| 13 | 10.000.000-19.999.999 | R$ 0,04 |
| 14 | 20.000.000-24.999.999 | R$ 0,035 |
| 15 | 25.000.000-29.999.999 | R$ 0,03 |
| 16 | 30.000.000+ | R$ 0,025 |

#### 2.2 Consulta QSA - Valores CORRETOS ✅

| Faixa | Volume | Valor Contrato |
|-------|--------|---------------|
| 1 | 1-999 | R$ 0,868 |
| 2 | 1.000-9.999 | R$ 0,743 |
| 3 | 10.000-49.999 | R$ 0,596 |
| 4 | 50.000-99.999 | R$ 0,502 |
| 5 | 100.000-249.999 | R$ 0,398 |
| 6 | 250.000-499.999 | R$ 0,335 |
| 7 | 500.000-999.999 | R$ 0,272 |
| 8 | 1.000.000-1.499.999 | R$ 0,22 |
| 9 | 1.500.000-2.999.999 | R$ 0,178 |
| 10 | 3.000.000-4.999.999 | R$ 0,13 |
| 11 | 5.000.000-6.999.999 | R$ 0,12 |
| 12 | 7.000.000-9.999.999 | R$ 0,11 |
| 13 | 10.000.000-19.999.999 | R$ 0,10 |
| 14 | 20.000.000-24.999.999 | R$ 0,076 |
| 15 | 25.000.000-29.999.999 | R$ 0,072 |
| 16 | 30.000.000+ | R$ 0,067 |

#### 2.3 Consulta Empresa (CPF Completo) - Valores CORRETOS ✅

| Faixa | Volume | Valor Contrato |
|-------|--------|---------------|
| 1 | 1-999 | R$ 1,172 |
| 2 | 1.000-9.999 | R$ 1,015 |
| 3 | 10.000-49.999 | R$ 0,826 |
| 4 | 50.000-99.999 | R$ 0,701 |
| 5 | 100.000-249.999 | R$ 0,565 |
| 6 | 250.000-499.999 | R$ 0,471 |
| 7 | 500.000-999.999 | R$ 0,398 |
| 8 | 1.000.000-1.499.999 | R$ 0,324 |
| 9 | 1.500.000-2.999.999 | R$ 0,251 |
| 10 | 3.000.000-4.999.999 | R$ 0,19 |
| 11 | 5.000.000-6.999.999 | R$ 0,18 |
| 12 | 7.000.000-9.999.999 | R$ 0,17 |
| 13 | 10.000.000-19.999.999 | R$ 0,15 |
| 14 | 20.000.000-24.999.999 | R$ 0,138 |
| 15 | 25.000.000-29.999.999 | R$ 0,122 |
| 16 | 30.000.000+ | R$ 0,108 |

---

### 3. Consulta Dívida Ativa (Contrato 261069)

**Valores CORRETOS no contrato:**

| Faixa | Volume | Valor |
|-------|--------|-------|
| 1 | 1-999 | R$ 0,659 |
| 2 | 1.000-9.999 | R$ 0,565 |
| 3 | 10.000-49.999 | R$ 0,356 |
| 4 | 50.000-99.999 | R$ 0,262 |
| 5 | 100.000-249.999 | R$ 0,178 |
| 6 | 250.000-499.999 | R$ 0,157 |
| 7 | 500.000-999.999 | R$ 0,146 |
| 8 | 1.000.000-1.499.999 | R$ 0,136 |
| 9 | 1.500.000-2.999.999 | R$ 0,115 |
| 10 | 3.000.000-4.499.999 | R$ 0,073 |
| 11 | 4.500.000-9.999.999 | R$ 0,052 |
| 12 | 10.000.000+ | R$ 0,031 |

---

### 4. Consulta CND (Contrato 261075)

**Valores CORRETOS no contrato:**

| Faixa | Volume | Valor |
|-------|--------|-------|
| 1 | 1-5.000 | R$ 0,879 |
| 2 | 5.001-10.000 | R$ 0,826 |
| 3 | 10.001-15.000 | R$ 0,795 |
| 4 | 15.001-30.000 | R$ 0,753 |
| 5 | 30.001-50.000 | R$ 0,722 |
| 6 | 50.001-75.000 | R$ 0,69 |
| 7 | 75.001-100.000 | R$ 0,649 |
| 8 | 100.001-500.000 | R$ 0,617 |
| 9 | 500.001-1.000.000 | R$ 0,534 |
| 10 | 1.000.001-2.000.000 | R$ 0,439 |
| 11 | 2.000.001-4.000.000 | R$ 0,366 |
| 12 | 4.000.001-10.000.000 | R$ 0,314 |
| 13 | 10.000.000+ | R$ 0,251 |

---

### 5. Consulta Faturamento (Contrato 261073)

**Valores CORRETOS no contrato:**

| Faixa | Volume | Relatório (INCORRETO) | Contrato (CORRETO) |
|-------|--------|--------------------- |-------------------|
| 1 | 1-5 | Não listado | **R$ 0,00 (GRÁTIS)** |
| 2 | 6-25.000 | R$ 3,6620 | **R$ 3,662** |
| 3 | 25.001-50.000 | R$ 3,5470 | **R$ 3,547** |
| 4 | 50.001-75.000 | R$ 3,4320 | **R$ 3,432** |
| 5 | 75.001-100.000 | R$ 3,3160 | **R$ 3,316** |
| 6 | 100.001-125.000 | R$ 3,2010 | **R$ 3,201** |
| 7 | 125.001-150.000 | R$ 3,0860 | **R$ 3,086** |
| 8 | 150.001-175.000 | R$ 2,9710 | **R$ 2,971** |
| 9 | 175.001-200.000 | R$ 2,8560 | **R$ 2,856** |
| 10 | 200.000+ | R$ 2,7410 | **R$ 2,741** |

**⚠️ FALTA IMPORTANTE**: A Faixa 1 (1-5 consultas) é **GRATUITA** - isso NÃO estava mencionado no relatório!

---

### 6. Integra Contador (Contrato 261074)

**Valores CORRETOS no contrato:**

#### 6.1 Endpoint: Consulta
| Faixa | Volume | Valor |
|-------|--------|-------|
| 1 | 1-300 | R$ 0,24 |
| 2 | 301-1.000 | R$ 0,21 |
| 3 | 1.001-3.000 | R$ 0,18 |
| 4 | 3.001-7.000 | R$ 0,16 |
| 5 | 7.001-15.000 | R$ 0,14 |
| 6 | 15.001-23.000 | R$ 0,11 |
| 7 | 23.001-30.000 | R$ 0,09 |
| 8 | 30.000+ | R$ 0,06 |

#### 6.2 Endpoint: Declaração
| Faixa | Volume | Valor |
|-------|--------|-------|
| 1 | 1-100 | R$ 0,40 |
| 2 | 101-500 | R$ 0,36 |
| 3 | 501-1.000 | R$ 0,32 |
| 4 | 1.001-3.000 | R$ 0,28 |
| 5 | 3.001-5.000 | R$ 0,24 |
| 6 | 5.001-8.000 | R$ 0,20 |
| 7 | 8.001-10.000 | R$ 0,16 |
| 8 | 10.000+ | R$ 0,12 |

#### 6.3 Endpoint: Emissão
| Faixa | Volume | Valor |
|-------|--------|-------|
| 1 | 1-500 | R$ 0,32 |
| 2 | 501-5.000 | R$ 0,29 |
| 3 | 5.001-10.000 | R$ 0,26 |
| 4 | 10.001-15.000 | R$ 0,22 |
| 5 | 15.001-25.000 | R$ 0,19 |
| 6 | 25.001-35.000 | R$ 0,16 |
| 7 | 35.001-50.000 | R$ 0,12 |
| 8 | 50.000+ | R$ 0,08 |

---

## 📊 Resumo das Correções

### Padrão de Formatação Identificado

**Problema principal**: Casas decimais extras nos valores.

- **Relatório atual**: R$ 0,6590 (4 casas decimais)
- **Contrato oficial**: R$ 0,659 (3 casas decimais)

### Ações Recomendadas

1. ✅ **Remover o zero final** em todos os preços com 4 casas decimais
2. ✅ **Adicionar a informação de "5 consultas gratuitas"** em Consulta Faturamento
3. ✅ **Manter 3 casas decimais** como padrão (conforme contratos oficiais)

### Impacto

⚠️ **Baixo impacto financeiro** - Os valores reais são os mesmos, apenas a formatação está diferente.

**Exceção**: Consulta Faturamento - faltou mencionar que as 5 primeiras consultas/mês são gratuitas.

---

## ✅ Validação Final

Todos os valores foram conferidos contra os PDFs oficiais dos contratos SERPRO:

- ✅ Contrato 260005 (CPF)
- ✅ Contrato 260009 (CNPJ)
- ✅ Contrato 260008 + 261071 (Renda)
- ✅ Contrato 261069 (Dívida Ativa)
- ✅ Contrato 261070 (Datavalid V4)
- ✅ Contrato 261072 (Raiz Tech)
- ✅ Contrato 261073 (Faturamento)
- ✅ Contrato 261074 (Integra Contador)
- ✅ Contrato 261075 (CND)

**Data da Validação**: 06/12/2025
**Método**: Extração direta dos PDFs via pdftotext e análise do Anexo I de cada contrato
