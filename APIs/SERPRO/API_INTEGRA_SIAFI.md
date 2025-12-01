# API SERPRO - Integra SIAFI

**Integração com o Sistema Integrado de Administração Financeira do Governo Federal**

---

## VISÃO GERAL

O **Integra SIAFI** é uma API que permite a criação, atualização e consulta de diversos documentos contábeis diretamente no Sistema Integrado de Administração Financeira do Governo Federal (SIAFI).

### O que é o SIAFI?

O SIAFI é o principal sistema de gestão financeira do Governo Federal brasileiro, responsável por:
- Controle orçamentário
- Administração financeira
- Contabilidade pública
- Execução de despesas

---

## FUNCIONALIDADES

### Documentos Contábeis Suportados

| Documento | Sigla | Descrição |
|-----------|-------|-----------|
| **Nota de Empenho** | NE | Compromisso de despesa |
| **Nota de Crédito** | NC | Transferência de crédito |
| **Nota de Lançamento** | NL | Registros contábeis |
| **Nota de Dotação** | ND | Dotação orçamentária |
| **Nota de Detalhamento Orçamentário** | NDO | Detalhamento de créditos |
| **Nota de Bloqueio** | NB | Bloqueio de recursos |

### Operações Disponíveis

| Operação | Descrição |
|----------|-----------|
| **Criação** | Criar novos documentos contábeis |
| **Atualização** | Modificar documentos existentes |
| **Consulta** | Buscar documentos registrados |
| **Validação** | Verificar conformidade de dados |

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Disponibilidade** | 08:00 às 22:30 (dias úteis) |
| **Certificado** | e-CNPJ obrigatório |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/integra-siafi/ |
| **Quick Start** | https://apicenter.estaleiro.serpro.gov.br/documentacao/integra-siafi/pt/global/quick_start/ |

### Horário de Funcionamento

> **IMPORTANTE:** A API Integra SIAFI funciona de acordo com a disponibilidade da Rede SIAFI:
> - **Horário:** Das 08:00 às 22:30
> - **Dias:** Somente dias úteis
> - **Fora do horário:** API indisponível

---

## AMBIENTE DE DEMONSTRAÇÃO

A API Integra SIAFI Demonstração é o ambiente de testes (modo Trial):
- Dados de exemplo (Mock)
- Objetivo: demonstrar funcionamento da API
- Sem custos durante período de teste

---

## AUTENTICAÇÃO

As APIs da plataforma SERPRO utilizam o protocolo OAuth2:

1. Obter **Consumer Key** e **Consumer Secret** na Área do Cliente
2. Gerar token de acesso via endpoint de autenticação
3. Usar Bearer Token nas requisições

```env
# SERPRO - Integra SIAFI
SERPRO_SIAFI_CONSUMER_KEY=sua_consumer_key
SERPRO_SIAFI_CONSUMER_SECRET=seu_consumer_secret
```

---

## MODELO DE COBRANÇA

### Características

- **Contrato anual** - Vigência de 12 meses
- **Prorrogável** - Até 120 meses (Lei 14.133/2021)
- **Certificado Digital** - e-CNPJ obrigatório para contratação

### Tabela de Preços

> **NOTA:** A tabela de preços específica do Integra SIAFI deve ser consultada na [Plataforma de Inteligência de Negócios](https://loja.serpro.gov.br/en/pin) do SERPRO.

---

## CASOS DE USO

### 1. Órgãos Federais
Integração de sistemas próprios com o SIAFI.

### 2. Gestão Orçamentária
Automação de processos de empenho e pagamento.

### 3. Controle Contábil
Registro automatizado de lançamentos contábeis.

### 4. Auditoria
Consulta e verificação de documentos financeiros.

### 5. Sistemas ERP
Integração de ERPs corporativos com o SIAFI.

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa/órgão
2. Cadastro na Loja SERPRO
3. Habilitação junto à STN (Secretaria do Tesouro Nacional)

### Passos

1. Acessar https://loja.serpro.gov.br/en/pin
2. Clicar em "Conheça as Consultas"
3. Autenticar com certificado digital e-CNPJ
4. Clicar em "Quero Contratar" na página da API Integra SIAFI
5. Aceitar termos e condições

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |
| **Portal Gov.br** | https://www.gov.br/pt-br/servicos/contratar-consulta-integra-siafi |

---

## BASE LEGAL

- **Lei nº 14.133/2021** - Lei de Licitações
- Arts. 106 e 107 - Prorrogação de contratos

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://apicenter.estaleiro.serpro.gov.br/documentacao/integra-siafi/
