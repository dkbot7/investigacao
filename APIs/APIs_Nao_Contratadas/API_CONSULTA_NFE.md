# API SERPRO - Consulta NFE

**Acesso a Informações Atualizadas da Nota Fiscal Eletrônica**

---

## VISÃO GERAL

Ao integrar sua aplicação à Consulta NF-e, você dispõe de informações estratégicas da **NFe Modelo 55** obtidas diretamente da base do **SPED**, garantindo maior assertividade à tomada de decisões e minimizando riscos de negócios.

### O que é NF-e?

A Nota Fiscal Eletrônica (NF-e) é um documento de existência exclusivamente digital, emitido e armazenado eletronicamente. A **chave da NFe** é um código que identifica de forma única cada nota fiscal eletrônica.

### Funcionalidade Push NF-e

A funcionalidade **Push NF-e** é uma solução que permite o monitoramento proativo de eventos de notas fiscais na base NF-e. O produto alerta a ocorrência de mudança na situação da nota fiscal informada, acelerando processos e reduzindo o custo das operações financeiras com informações de situação disponíveis online.

---

## VANTAGENS E BENEFÍCIOS

### Benefícios do Serviço

- Melhora a qualidade da avaliação de crédito
- Minimiza o risco de fraudes
- Acesso a informações diretamente do Governo, sem intermediários
- Informações sempre atualizadas
- Segurança e confiabilidade da informação
- Possibilita automatizar consultas e verificação das informações

### Características da Contratação

- Contratação 100% online e sem taxa de instalação
- Modelo de cobrança pós-pago
- Liberação imediata de acesso desde que o cliente tenha um certificado digital e-CNPJ
- Quanto maior o consumo, menor o custo unitário
- Alta disponibilidade
- Cancelamento a qualquer momento, sem taxas ou multas

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-nfe/ |
| **Loja** | https://loja.serpro.gov.br/consultanfe |
| **Portal NF-e** | https://www.nfe.fazenda.gov.br/portal/principal.aspx |

### Funcionalidades Disponíveis

| Funcionalidade | Descrição |
|----------------|-----------|
| **Consulta NF-e** | Consulta dados da Nota Fiscal Eletrônica pela chave |
| **Push NF-e** | Monitoramento proativo de eventos/mudanças na NF-e |

### Cobrança do Push

O **PUSH é cobrado por nota incluída para monitoramento**, vigente durante **30 dias**. O valor é o mesmo da consulta.

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Passa por cada faixa até esgotar
- Consulta e Push têm o mesmo valor

### ⚠️ IMPORTANTE: Modelo de Cobrança Escalonado

O SERPRO usa um modelo **progressivo**, onde você paga cada faixa até esgotar:

1. **Faixa 1**: Até 999 consultas, paga R$ 0,6591/consulta
2. **Faixa 2**: De 1.000 a 9.999, paga R$ 0,5649/consulta
3. **Faixa 3**: De 10.000 a 49.999, paga R$ 0,3557/consulta
4. E assim por diante...

### Tabela de Preços (Novembro/2025)

| Faixa | Quantidade de Consultas | Valor por Consulta |
|-------|-------------------------|-------------------|
| 1 | Até 999 | R$ 0,6591 |
| 2 | De 1.000 a 9.999 | R$ 0,5649 |
| 3 | De 10.000 a 49.999 | R$ 0,3557 |
| 4 | De 50.000 a 99.999 | R$ 0,2616 |
| 5 | De 100.000 a 249.999 | R$ 0,1779 |
| 6 | De 250.000 a 499.999 | R$ 0,1569 |
| 7 | De 500.000 a 999.999 | R$ 0,1465 |
| 8 | De 1.000.000 a 1.499.999 | R$ 0,1360 |
| 9 | De 1.500.000 a 2.999.999 | R$ 0,1151 |
| 10 | De 3.000.000 a 4.499.999 | R$ 0,0732 |
| 11 | De 4.500.000 a 9.999.999 | R$ 0,0523 |
| 12 | De 10.000.000 a 16.999.999 | R$ 0,0314 |
| 13 | De 17.000.000 a 19.999.999 | R$ 0,0300 |
| 14 | De 20.000.000 a 24.999.999 | R$ 0,0290 |
| 15 | De 25.000.000 a 29.999.999 | R$ 0,0280 |
| 16 | Acima de 30.000.000 | R$ 0,0270 |

### Simulação de Custos (Modelo Escalonado)

| Consultas/Mês | Cálculo | Custo Total |
|---------------|---------|-------------|
| 100 | 100 × R$ 0,6591 | R$ 65,91 |
| 500 | 500 × R$ 0,6591 | R$ 329,55 |
| 1.000 | 999 × R$ 0,6591 + 1 × R$ 0,5649 | R$ 659,41 |
| 5.000 | Faixa 1 + 4.001 × R$ 0,5649 | R$ 2.919,65 |
| 10.000 | Faixas 1-2 + 1 × R$ 0,3557 | R$ 5.744,56 |

---

## CASOS DE USO

### 1. Validação de Notas Fiscais
Verifique a autenticidade e situação de notas fiscais recebidas.

### 2. Análise de Crédito
Avalie o histórico de emissão de notas fiscais de clientes.

### 3. Compliance Tributário
Garanta conformidade nas operações fiscais da empresa.

### 4. Monitoramento de Fornecedores
Acompanhe em tempo real as notas emitidas por fornecedores.

### 5. Automação de Processos
Integre validação automática de NF-e nos sistemas da empresa.

### 6. Prevenção a Fraudes
Detecte notas fiscais fraudulentas ou canceladas.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta NFE
SERPRO_NFE_CONSUMER_KEY=sua_consumer_key
SERPRO_NFE_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/consultanfe
2. Clicar em "Quero contratar"
3. Autenticar com certificado digital e-CNPJ
4. Aceitar termos e condições
5. Configurar credenciais de API

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |

---

**Documento atualizado em:** 29/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
