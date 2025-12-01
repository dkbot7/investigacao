# API SERPRO - Integra Loja Franca

**Integração de Lojas Francas de Fronteira com Sistema Aduaneiro da Receita Federal**

---

## VISÃO GERAL

O **Integra Loja Franca** é uma API que possibilita a integração dos sistemas das Lojas Francas de Fronteira Terrestre ao sistema de controle e fiscalização aduaneira da Receita Federal para a prestação de obrigações tributárias.

### Base Legal

- **IN RFB Nº 2075** de 23 de março de 2022
- Toda Loja Franca localizada em fronteira terrestre do país deverá dispor de sistema informatizado integrado ao sistema de controle de lojas francas da Receita Federal

### Público-Alvo

> **IMPORTANTE:** O uso do Integra Loja Franca é permitido **apenas para lojas autorizadas** pela Receita Federal a operar sob o regime aduaneiro especial de lojas francas.

---

## FUNCIONALIDADES

### 1. Consulta de Cota de Viajante

| Funcionalidade | Descrição |
|----------------|-----------|
| **Cota Disponível** | Consulta cota restante para um viajante |
| **Identificação** | Retorna nome e data de nascimento |
| **Última Venda** | Data da última compra do viajante |
| **CPF Obrigatório** | Para viajantes brasileiros |

### 2. Cotação de Moeda

- Retorna cotação do dólar de uma determinada data
- Usado para conversão de valores

### 3. Processamento de Vendas

- Efetua operações de processamento de venda
- Registro de transações no sistema aduaneiro
- Controle de quota de isenção

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 + Certificado Digital |
| **Segurança** | SSL/TLS obrigatório |
| **Versão** | v1.6 |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/integra-loja-franca/pt/introducao/ |
| **Loja** | https://loja.serpro.gov.br/en/integralojafranca |

### Segurança

A segurança da API é baseada em:
- **SSL/TLS** obrigatório
- **Certificado Digital** válido e reconhecido pelo SERPRO
- **Handshake SSL** entre aplicação cliente e API

---

## AMBIENTE E ENDPOINTS

Após contratação, as seguintes informações ficam disponíveis na área do cliente (cliente.serpro.gov.br):
- Status de ativação do contrato
- Consumer Key
- Consumer Secret
- Endpoints de produção
- Link para documentação

---

## DADOS DO VIAJANTE

### Identificação

| Campo | Descrição | Obrigatório |
|-------|-----------|-------------|
| **CPF** | Documento brasileiro | Sim (brasileiros) |
| **Nome** | Nome completo | Retornado pela API |
| **Data Nascimento** | Data de nascimento | Retornado pela API |
| **Última Venda** | Data última compra | Retornado pela API |

### Cota de Isenção

A API permite verificar quanto da cota de isenção fiscal o viajante ainda possui disponível para compras em lojas francas.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Integra Loja Franca
SERPRO_LOJAFRANCA_CONSUMER_KEY=sua_consumer_key
SERPRO_LOJAFRANCA_CONSUMER_SECRET=seu_consumer_secret
```

---

## MODELO DE COBRANÇA

### Características

- **Exclusivo para Lojas Francas** autorizadas pela RFB
- Modelo de precificação específico para o setor
- Contratação via certificado digital e-CNPJ

### Tabela de Preços

> **NOTA:** A tabela de preços específica deve ser consultada diretamente na [Loja SERPRO](https://loja.serpro.gov.br/en/integralojafranca).

---

## CASOS DE USO

### 1. Venda em Loja Franca
Verificar cota disponível antes de processar venda.

### 2. Controle Fiscal
Registro de vendas junto à Receita Federal.

### 3. Gestão de Clientes
Consultar histórico de compras de viajantes.

### 4. Conversão de Moeda
Obter cotação oficial do dólar para precificação.

---

## COMO CONTRATAR

### Requisitos

1. **Autorização da Receita Federal** para operar como Loja Franca
2. **Certificado Digital e-CNPJ** da loja
3. Sistema informatizado para integração
4. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/en/integralojafranca
2. Clicar em "Quero contratar"
3. Autenticar com certificado digital e-CNPJ
4. Aceitar termos e condições
5. Configurar credenciais de API

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |
| **Suporte** | Central Serpro de Atendimento |
| **Área do Cliente** | cliente.serpro.gov.br |

---

## DOCUMENTAÇÃO ADICIONAL

| Recurso | Link |
|---------|------|
| **Introdução** | https://apicenter.estaleiro.serpro.gov.br/documentacao/integra-loja-franca/pt/introducao/ |
| **Como Contratar** | http://apicenter.estaleiro.serpro.gov.br/documentacao/integra-loja-franca/pt/como_contratar/ |
| **FAQ** | https://apicenter.estaleiro.serpro.gov.br/documentacao/integra-loja-franca/pt/faq/ |
| **Modelo de Dados** | http://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=47740 |
| **Gov.br** | https://www.gov.br/pt-br/servicos/integra-loja-franca |
| **Central de Ajuda** | https://centraldeajuda.serpro.gov.br/duvidas/pt/suporte/sup_integralojafranca/ |

---

## BASE LEGAL

- **IN RFB Nº 2075/2022** - Instrução Normativa sobre Lojas Francas

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://apicenter.estaleiro.serpro.gov.br/documentacao/integra-loja-franca/
