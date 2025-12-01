# API SERPRO - Biovalid

**Validação de Prova de Vida (Liveness Detection)**

---

## VISÃO GERAL

O Biovalid é uma solução de validação de "prova de vida" que comprova a identidade do usuário em tempo real. É um serviço complementar ao Datavalid, focado especificamente em detectar se a pessoa que está realizando a validação está realmente presente e viva no momento da autenticação.

### Objetivo

Prevenir fraudes onde criminosos tentam utilizar:
- Fotos de outras pessoas
- Vídeos pré-gravados
- Máscaras ou representações faciais
- Deepfakes ou manipulações digitais

---

## FUNCIONALIDADES

### 1. Liveness Detection (Prova de Vida)

Verificação de que a pessoa está viva e presente no momento da captura, utilizando:
- Análise de movimentos faciais
- Detecção de profundidade
- Análise de textura da pele
- Verificação de piscar de olhos

### 2. Validação Biométrica

Após confirmar a prova de vida:
- Comparação facial com bases oficiais
- Validação de identidade
- Retorno de índice de similaridade

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Disponibilidade** | Azure Marketplace |
| **Loja** | https://loja.serpro.gov.br |

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Quanto maior o volume, menor o preço unitário

### Tabela de Preços

> **NOTA:** A tabela de preços específica do Biovalid deve ser consultada diretamente na Loja SERPRO.

---

## CASOS DE USO

### 1. Onboarding Digital
Validação de identidade em cadastros de novos clientes.

### 2. Empréstimos Consignados
Prova de vida para contratação de empréstimos.

### 3. Bancos Digitais
Abertura de contas com validação biométrica.

### 4. Assinatura de Contratos
Confirmação de identidade em contratos digitais.

### 5. Benefícios Previdenciários
Prova de vida para beneficiários do INSS.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Biovalid
SERPRO_BIOVALID_CONSUMER_KEY=sua_consumer_key
SERPRO_BIOVALID_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
