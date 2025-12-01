# Escavador - Planos e Preços da API

**Plataforma de Dados Jurídicos - Processos, Diários Oficiais e Monitoramentos**

---

## MODELO DE COBRANCA

### Sistema de Créditos

O Escavador funciona com sistema de **créditos em centavos**:

- Cada requisição consome créditos
- O custo aparece no header `Creditos-Utilizados` da resposta
- Você pode consultar seu saldo no painel da API

### Modalidades de Pagamento

| Modalidade | Descrição |
|------------|-----------|
| **Pré-pago** | Compra créditos e usa até acabar |
| **Pós-pago** | Contrato com fatura mensal (negociação) |

---

## TABELA DE PRECOS - API v2

### Consultas de Processos

| Serviço | Custo | Descrição |
|---------|-------|-----------|
| **Capa do Processo** | R$ 0,10 | Dados básicos: número, partes, tribunal, classe |
| **Movimentações** | R$ 0,10 | Lista de movimentações do processo |
| **Envolvidos** | R$ 0,10 | Lista detalhada de partes e advogados |
| **Documentos Públicos** | R$ 0,12 | Lista de documentos públicos disponíveis |
| **Atualização no Tribunal** | R$ 0,15 | Busca dados atualizados direto no tribunal |
| **Atualização + Documentos** | R$ 0,20 | Atualização com download de documentos |

### Consultas de Envolvidos

| Serviço | Custo | Descrição |
|---------|-------|-----------|
| **Processos por CPF/CNPJ** | R$ 0,10 | Lista processos de uma pessoa/empresa |
| **Processos por Nome** | R$ 0,10 | Lista processos por nome (pode ter homônimos) |
| **Resumo do Envolvido** | **GRÁTIS** | Apenas quantidade de processos |

### Consultas de Advogados

| Serviço | Custo | Descrição |
|---------|-------|-----------|
| **Processos por OAB** | R$ 0,10 | Lista processos de um advogado |
| **Resumo do Advogado** | **GRÁTIS** | Apenas quantidade de processos |

### Resumo Inteligente (IA)

| Serviço | Custo | Descrição |
|---------|-------|-----------|
| **Solicitar Resumo IA** | Variável | Gera resumo com inteligência artificial |
| **Obter Resumo IA** | Variável | Recupera resumo gerado |

### Monitoramentos

| Serviço | Custo | Descrição |
|---------|-------|-----------|
| **Monitoramento de Processo** | Mensal | Acompanha movimentações |
| **Monitoramento de Novos Processos** | Mensal | Alerta quando termo aparece em novo processo |

### Callbacks e Outros

| Serviço | Custo | Descrição |
|---------|-------|-----------|
| **Listar Callbacks** | **GRÁTIS** | Lista webhooks recebidos |
| **Marcar Recebidos** | **GRÁTIS** | Confirma recebimento de callbacks |
| **Reenviar Callback** | **GRÁTIS** | Reenvia webhook falhado |
| **Listar Tribunais** | **GRÁTIS** | Lista tribunais disponíveis |

---

## REGRA DE COBRANCA INTELIGENTE

> **Dentro de 24h para o mesmo processo, você paga apenas o serviço mais caro**

### Exemplo

| Hora | Consulta | Preço Individual | Cobrado |
|------|----------|------------------|---------|
| 10:00 | Capa do processo | R$ 0,10 | R$ 0,10 |
| 10:05 | Movimentações (mesmo processo) | R$ 0,10 | R$ 0,00 |
| 10:10 | Atualização no tribunal | R$ 0,15 | R$ 0,05* |

*Cobra apenas a diferença para o maior valor

**Total cobrado: R$ 0,15** (não R$ 0,35)

---

## CREDITOS PARA TESTE

| Item | Valor |
|------|-------|
| **Créditos iniciais** | Variável (verificar no cadastro) |
| **Validade** | Sem expiração enquanto conta ativa |

---

## LIMITES

| Item | Limite |
|------|--------|
| **Requisições por minuto** | 500 |
| **Resultados por página** | 50 ou 100 |

---

## COBERTURA

### Tribunais

- **Todos os tribunais do Brasil**
- Justiça Federal (TRFs)
- Justiça Estadual (TJs)
- Justiça do Trabalho (TRTs)
- Justiça Eleitoral (TREs)
- Tribunais Superiores (STF, STJ, TST, TSE)

### Diários Oficiais

- Diário Oficial da União (DOU)
- Diários de Justiça de todos os estados
- Diários de Justiça dos tribunais

---

## COMO COMPRAR CREDITOS

### Passo a Passo

1. Acessar https://api.escavador.com
2. Fazer login no painel
3. Clicar em "Comprar Créditos"
4. Escolher valor
5. Pagar via cartão ou boleto

### Pacotes Especiais

Para alto volume de consumo, a Escavador oferece:
- Valores diferenciados
- Pacotes personalizados
- Negociação com consultores comerciais

---

## CONTATO

| Canal | Informação |
|-------|------------|
| **Suporte API** | https://suporte-api.escavador.com |
| **Site** | https://www.escavador.com |
| **API Docs v2** | https://api.escavador.com/v2/docs/ |
| **Painel** | https://api.escavador.com |

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://api.escavador.com
