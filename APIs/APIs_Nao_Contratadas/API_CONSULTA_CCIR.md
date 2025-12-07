# API SERPRO - Consulta CCIR

**Certificado de Cadastro de Imóveis Rurais**

---

## VISÃO GERAL

A API Consulta CCIR permite consultar dados do Certificado de Cadastro de Imóveis Rurais (CCIR) através do número de identificação dos titulares ou códigos dos imóveis rurais, eliminando a necessidade de comprovações manuais repetidas.

### O que é o CCIR?

O Certificado de Cadastro de Imóvel Rural (CCIR) é um documento emitido pelo INCRA que comprova o cadastro do imóvel rural no Sistema Nacional de Cadastro Rural (SNCR). É obrigatório para:
- Transferência de imóveis rurais
- Financiamentos agrícolas
- Processos de regularização fundiária

---

## FUNCIONALIDADES

### 1. Consulta por CPF/CNPJ

Consulte os códigos de imóveis rurais utilizando o CPF ou CNPJ dos proprietários/titulares.

### 2. Consulta por Código do Imóvel

Acesse os dados completos do Certificado de Cadastro do Imóvel Rural pelo código do imóvel.

### 3. Dados Retornados

| Dado | Descrição |
|------|-----------|
| **Código do Imóvel** | Identificação única do imóvel rural |
| **Dados do Certificado** | Informações completas do CCIR |
| **Titulares** | Informações dos proprietários |
| **Situação** | Status do cadastro |

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-ccir/ |
| **Disponibilidade** | 24 horas por dia |

### Acesso

O acesso aos serviços depende das permissões específicas concedidas ao contratante. As credenciais são codificadas em base64 para autenticação.

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Quanto maior o volume, menor o preço unitário

### Tabela de Preços

> **NOTA:** A tabela de preços específica da Consulta CCIR deve ser consultada diretamente na Loja SERPRO ou através do contato comercial.

---

## CASOS DE USO

### 1. Cartórios de Registro de Imóveis
Verificação de regularidade cadastral para transferências.

### 2. Bancos e Financeiras
Validação para concessão de crédito rural.

### 3. Regularização Fundiária
Processos de regularização de propriedades rurais.

### 4. Due Diligence Imobiliária
Levantamento de propriedades rurais em processos de M&A.

### 5. Investigação Patrimonial
Identificação de imóveis rurais em nome de investigados.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta CCIR
SERPRO_CCIR_CONSUMER_KEY=sua_consumer_key
SERPRO_CCIR_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar a Loja SERPRO
2. Buscar por "Consulta CCIR"
3. Clicar em "Quero contratar"
4. Autenticar com certificado digital e-CNPJ
5. Aceitar termos e condições
6. Configurar credenciais de API

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
