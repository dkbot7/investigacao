# Infosimples - Planos e Preços

**Modelo de Cobrança ESCALONADO/PROGRESSIVO**

---

## MODELO DE COBRANÇA

### Importante - Como Funciona

O modelo da Infosimples é **PRÉ-PAGO com ESCALONAMENTO PROGRESSIVO**:

1. **Sua conta tem um saldo** que diminui conforme você usa os serviços
2. **O preço unitário diminui** automaticamente conforme o volume mensal aumenta
3. **Primeiro você paga a faixa mais cara**, depois vai para faixas mais baratas
4. **Cada faixa é consumida até esgotar**, depois passa para a próxima

> **ATENÇÃO:** Os valores menores só se aplicam DEPOIS de consumidos os valores mais altos!

---

## TABELA DE PREÇOS BASE

| Faixa | Volume Mensal | Preço por Consulta |
|-------|---------------|-------------------|
| **1** | 1 a 500 | R$ 0,20 |
| **2** | 501 a 2.000 | R$ 0,15 |
| **3** | 2.001 a 5.000 | R$ 0,13 |
| **4** | 5.001 a 10.000 | R$ 0,11 |
| **5** | 10.001 a 50.000 | R$ 0,09 |
| **6** | 50.001 a 100.000 | R$ 0,07 |
| **7** | 100.001+ | R$ 0,05 |

---

## EXEMPLO DE CÁLCULO ESCALONADO

### Cenário: 60.000 consultas no mês

| Faixa | Consultas | Preço Unit. | Subtotal |
|-------|-----------|-------------|----------|
| 1 | 500 | R$ 0,20 | R$ 100,00 |
| 2 | 1.500 | R$ 0,15 | R$ 225,00 |
| 3 | 3.000 | R$ 0,13 | R$ 390,00 |
| 4 | 5.000 | R$ 0,11 | R$ 550,00 |
| 5 | 40.000 | R$ 0,09 | R$ 3.600,00 |
| 6 | 10.000 | R$ 0,07 | R$ 700,00 |
| **TOTAL** | **60.000** | - | **R$ 5.565,00** |

**Preço médio:** R$ 0,0928 por consulta

---

## PREÇO ADICIONAL

Algumas APIs têm um **preço adicional por chamada**, independentemente do volume total.

O preço adicional existe quando a Infosimples tem custos excepcionais na automação.

### Fórmula

```
Preço Final = Preço Base (da tabela) + Preço Adicional (da API)
```

### Exemplos de Preços Adicionais

| API | Preço Adicional |
|-----|-----------------|
| APIs SENATRAN | R$ 0,12 a R$ 0,18 |
| Algumas APIs DETRAN | R$ 0,02 a R$ 0,10 |
| APIs com captcha | R$ 0,04 |

---

## FRANQUIA MÍNIMA

| Item | Valor |
|------|-------|
| **Franquia Mínima Mensal** | R$ 100,00 |

Se seu consumo mensal for inferior a R$ 100,00, você paga R$ 100,00.

---

## CRÉDITO DE BOAS-VINDAS

| Item | Valor |
|------|-------|
| **Crédito para novos usuários** | R$ 100,00 |

Novos usuários recebem R$ 100,00 para testar os serviços.

---

## VALIDADE DOS CRÉDITOS

| Item | Prazo |
|------|-------|
| **Expiração de créditos** | 12 meses de inatividade |

Créditos não utilizados expiram após 12 meses de conta inativa.

---

## CONTATO PARA PÓS-PAGO

Para empresas que precisam de modelo de cobrança **pós-pago** (fatura mensal), entre em contato com a Infosimples.

---

## CALCULADORA DE PREÇOS

A Infosimples oferece uma ferramenta para estimar custos:

**URL:** https://infosimples.com/consultas/estimativa/

- Permite calcular custo mensal de várias consultas
- Exporta PDF com detalhamento
- Considera preços adicionais

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://infosimples.com/consultas/precos/
