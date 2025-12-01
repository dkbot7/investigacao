# API SERPRO - AntecipaGov

**Operações de Crédito para Fornecedores do Governo Federal**

---

## VISÃO GERAL

O AntecipaGov é uma API que permite aos fornecedores de materiais e serviços a órgãos do Governo Federal com contrato ativo, utilizar até **70% dos valores ainda disponíveis para recebimento** como garantia para a obtenção de empréstimos em instituições financeiras credenciadas.

### Integração com ComprasNet

A plataforma está integrada ao portal **ComprasNet**, que tem:
- **R$ 924 bilhões** em valor de contratos vigentes
- **28.465 fornecedores** habilitados
- **84 mil contratos** vigentes e habilitados

---

## FUNCIONALIDADES

### Operações Disponíveis

| Operação | Descrição |
|----------|-----------|
| **Registro** | Registrar operação de crédito |
| **Cancelamento** | Cancelar operação registrada |
| **Amortização** | Registrar amortização de dívida |
| **Liquidação** | Registrar liquidação de operação |
| **Consulta** | Consultar operações de crédito |
| **Detalhamento** | Consultar detalhes de contratos |
| **Cotação** | Consultar pedidos de cotação de crédito |

### Dados Disponibilizados

| Dado | Descrição |
|------|-----------|
| **CNPJ do Fornecedor** | Identificação do fornecedor |
| **Saldo Devedor** | Valor ainda devido |
| **Margem Contábil** | Margem disponível para garantia |
| **Dados do Órgão** | Órgão contratante |
| **Dados do Contrato** | Informações contratuais |
| **Valor Original** | Valor original do contrato |
| **Valor Empenhado** | Valor empenhado |
| **Valor Liquidado** | Valor já liquidado |
| **Valor Pago** | Valor já pago |
| **Histórico de Pagamentos** | Pagamentos realizados |
| **Termos Aditivos** | Aditivos ao contrato |

---

## ESTRUTURA DO SISTEMA

O AntecipaGov é composto por dois módulos:

### 1. Portal de Antecipação de Recebíveis

- Fornecedor solicita propostas de crédito a várias instituições simultaneamente
- Compara propostas e escolhe a mais interessante
- Interface web para gestão

### 2. Barramento de Serviços de Informação (API)

- Instituições financeiras encaminham propostas
- Registram operações de crédito
- Integração automatizada

---

## GARANTIAS E SEGURANÇA

Conforme **Instrução Normativa nº 53/2020**:

- Operações garantidas por **conta vinculada específica**
- Governo envia parte dos pagamentos para conta bloqueada
- Conta fica bloqueada até quitação da dívida com o banco
- Segurança jurídica para instituições financeiras

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 + Certificado Digital |
| **Disponibilidade** | 24 horas por dia |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/api-antecipa-gov/ |
| **Loja** | https://loja.serpro.gov.br/antecipagov |
| **Portal** | https://www.gov.br/compras/pt-br/antecipagov |

### Atualização de Dados

- Consulta aos pedidos de cotação atualizada **1 vez ao dia**
- Atualização às **6:00 da manhã**

---

## MODELO DE COBRANÇA

### Características

> **NOTA:** O AntecipaGov possui autorização de uso específica.
>
> Cada instituição financeira interessada deve solicitar ao Ministério da Economia autorização para adesão à API.

---

## CASOS DE USO

### 1. Instituições Financeiras
Oferecer crédito garantido por contratos governamentais.

### 2. Fornecedores do Governo
Obter capital de giro usando recebíveis como garantia.

### 3. Análise de Risco
Avaliar capacidade de pagamento baseada em contratos públicos.

### 4. Due Diligence
Verificar contratos ativos de fornecedores com o governo.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - AntecipaGov
SERPRO_ANTECIPAGOV_CONSUMER_KEY=sua_consumer_key
SERPRO_ANTECIPAGOV_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Autorização do Ministério da Economia** (para instituições financeiras)
2. **Certificado Digital e-CNPJ** da empresa
3. Cadastro na Loja SERPRO

### Passos

1. Solicitar autorização ao Ministério da Economia
2. Acessar https://loja.serpro.gov.br/antecipagov
3. Autenticar com certificado digital e-CNPJ
4. Aceitar termos e condições
5. Configurar credenciais de API

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |

---

## BASE LEGAL

- **Instrução Normativa nº 53**, de 8 de julho de 2020
- **Portaria nº 21.332**, de 25 de setembro de 2020

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
