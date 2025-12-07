# API SERPRO - Datavalid

**Ecossistema de Validação de Identidade Digital**

---

## VISÃO GERAL

O Datavalid é um ecossistema de validação de identidade digital que combina e integra diversas funcionalidades, com o diferencial de acesso direto nas bases do governo, sem intermediários. É a **única solução do mercado** capaz de operar de forma unificada na validação de identidade.

### Diferenciais

- **Acurácia de 99,9%** na validação biométrica
- Acesso online e em tempo real a dados atualizados de bases oficiais
- **Sem limite de volume** de requisições
- Bases consultadas: CNH, CPF, CNPJ (Receita Federal)

---

## TIPOS DE VALIDAÇÃO

### 1. Validação de Dados Biográficos

Validação de informações cadastrais:
- Nome completo
- Data de nascimento
- CPF e situação cadastral
- Endereço
- Filiação (nome da mãe/pai)
- Situação do documento

### 2. Validação Biométrica Facial

- Reconhecimento facial com **99,9% de acurácia**
- Comparação com foto da CNH
- Retorna índice de similaridade e faixa de probabilidade (baixa, alta, altíssima)
- **Liveness detection** passivo (não requer movimentos do usuário)

### 3. Validação por Impressão Digital

- Comparação de uma ou mais digitais
- Base de comparação: digitais da CNH
- Retorna índice de similaridade e faixa de probabilidade

### 4. Validação de QR Code da CNH

- Leitura e validação do QR Code da CNH
- Extração automática de dados do documento

### 5. Validação de Dados de PJ (CNPJ)

- Validação de dados cadastrais de pessoas jurídicas
- Dados da Receita Federal

---

## O QUE O DATAVALID FAZ E NÃO FAZ

### FAZ:
- Compara dados enviados com bases governamentais
- Retorna índice de similaridade biométrica
- Valida autenticidade de dados cadastrais
- Opera em conformidade com requisitos do INSS para empréstimos

### NÃO FAZ:
- **Não verifica** se imagens faciais sofreram manipulação (deepfakes)
- **Não retorna** dados das bases de validação (apenas confirma/nega)
- **Não determina** regras de negócio do cliente

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/datavalid/ |
| **API Docs** | https://apidocs.datavalidp.estaleiro.serpro.gov.br/ |
| **Loja** | https://loja.serpro.gov.br/datavalid |

### Linguagens Suportadas

Guias de início rápido disponíveis em:
- cURL
- Node.js
- Java
- PHP

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Quanto maior o volume, menor o preço unitário
- **Sem limite** de requisições

### Período de Teste Gratuito

- **30 dias** de teste gratuito OU
- **3.000 consultas** gratuitas (o que ocorrer primeiro)
- Cancelamento deve ser feito dentro do período/limite para não haver cobrança

### Tabela de Preços

> **NOTA:** A tabela de preços específica do Datavalid deve ser consultada diretamente na [Loja SERPRO](https://loja.serpro.gov.br/datavalid).
>
> O modelo de cobrança é progressivo/escalonado, similar às outras APIs SERPRO.

---

## CASOS DE USO

### 1. Onboarding Digital
Validação de identidade em cadastros de novos clientes.

### 2. Prevenção a Fraudes
Verificação biométrica para impedir fraudes de identidade.

### 3. Empréstimos Consignados (INSS)
Validação em conformidade com requisitos do INSS.

### 4. Abertura de Contas Digitais
Validação de identidade para bancos e fintechs.

### 5. Assinatura de Contratos Digitais
Confirmação de identidade em contratos eletrônicos.

### 6. Prova de Vida
Verificação de que a pessoa está viva (liveness detection).

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Datavalid
SERPRO_DATAVALID_CONSUMER_KEY=sua_consumer_key
SERPRO_DATAVALID_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/datavalid
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

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
**Versão Atual:** Datavalid V4
