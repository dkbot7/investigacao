# API SERPRO - Consulta CNPJ

**Dados de Empresas Direto da Receita Federal**

---

## VISÃO GERAL

A Consulta CNPJ permite acesso às informações públicas do Cadastro Nacional de Pessoas Jurídicas, obtidas diretamente das bases da Receita Federal.

### Por que usar?

- Evite surpresas! Conheça melhor seus clientes e fornecedores
- Informações obtidas diretamente das bases da Receita Federal
- Maior confiabilidade, disponibilidade e desempenho

### Benefícios

- Acesso a informações diretamente do Governo, sem intermediários
- Confiabilidade das informações
- Informações sempre atualizadas
- Possibilidade de gerar novos negócios
- Minimiza o risco de fraudes
- Possibilita checagem automática de informações
- Segurança da informação

---

## TIPOS DE CONSULTA

### 1. Consulta Básica

**Dados retornados:**
- Situação Cadastral
- Endereço
- Atividade Econômica
- Natureza Jurídica
- Telefone

### 2. Consulta QSA

**Dados retornados:**
- Tudo da Consulta Básica +
- Dados do Quadro Societário da Empresa
- Opção por MEI
- Opção pelo Simples

### 3. Consulta Empresa (Completa)

**Dados retornados:**
- Tudo da Consulta Básica +
- Tudo da Consulta QSA +
- **CNPJ/CPF dos Sócios** (diferencial)

---

## DADOS E INFORMAÇÕES DE RESPOSTA

### Dados Cadastrais Básicos

| Dado | Básica | QSA | Empresa |
|------|--------|-----|---------|
| CNPJ | ✅ | ✅ | ✅ |
| Identificação de Matriz/Filial | ✅ | ✅ | ✅ |
| Razão social/nome empresarial | ✅ | ✅ | ✅ |
| Nome fantasia | ✅ | ✅ | ✅ |
| Situação cadastral | ✅ | ✅ | ✅ |
| Data da situação cadastral | ✅ | ✅ | ✅ |
| Motivo da situação cadastral | ✅ | ✅ | ✅ |
| Nome da cidade no exterior | ✅ | ✅ | ✅ |
| Código do país | ✅ | ✅ | ✅ |
| Nome do país | ✅ | ✅ | ✅ |
| Código natureza jurídica | ✅ | ✅ | ✅ |
| Data início atividade | ✅ | ✅ | ✅ |

### Atividade Econômica e Endereço

| Dado | Básica | QSA | Empresa |
|------|--------|-----|---------|
| CNAE-fiscal (atividade principal) | ✅ | ✅ | ✅ |
| CNAE-secundária | ✅ | ✅ | ✅ |
| Descrição do tipo de logradouro | ✅ | ✅ | ✅ |
| Nome do logradouro | ✅ | ✅ | ✅ |
| Número de localização | ✅ | ✅ | ✅ |
| Complemento para o endereço | ✅ | ✅ | ✅ |
| Bairro de localização | ✅ | ✅ | ✅ |
| CEP do logradouro | ✅ | ✅ | ✅ |
| UF onde se encontra o estabelecimento | ✅ | ✅ | ✅ |
| Código do município de jurisdição | ✅ | ✅ | ✅ |
| Município de jurisdição | ✅ | ✅ | ✅ |

### Contato

| Dado | Básica | QSA | Empresa |
|------|--------|-----|---------|
| DDD-1 | ✅ | ✅ | ✅ |
| Telefone-1 | ✅ | ✅ | ✅ |
| DDD-2 | ✅ | ✅ | ✅ |
| Telefone-2 | ✅ | ✅ | ✅ |
| DDD-Fax | ✅ | ✅ | ✅ |
| Número-fax | ✅ | ✅ | ✅ |
| Correio eletrônico | ✅ | ✅ | ✅ |

### Informações da Empresa

| Dado | Básica | QSA | Empresa |
|------|--------|-----|---------|
| Qualificação do responsável | ✅ | ✅ | ✅ |
| Capital social da empresa | ✅ | ✅ | ✅ |
| Porte-empresa | ✅ | ✅ | ✅ |
| Situação especial | ✅ | ✅ | ✅ |
| Data situação especial | ✅ | ✅ | ✅ |

### Opção por MEI / Simples

| Dado | Básica | QSA | Empresa |
|------|--------|-----|---------|
| Opção pelo simples | ❌ | ✅ | ✅ |
| Data opção pelo simples | ❌ | ✅ | ✅ |
| Data exclusão do simples | ❌ | ✅ | ✅ |
| Opção pelo MEI | ❌ | ✅ | ✅ |

### Sócio (QSA)

| Dado | Básica | QSA | Empresa |
|------|--------|-----|---------|
| Identificador de sócio | ❌ | ✅ | ✅ |
| Nome sócio (PF) ou razão social (PJ) | ❌ | ✅ | ✅ |
| **CNPJ/CPF sócio** | ❌ | ❌ | ✅ |
| Código de qualificação do sócio | ❌ | ✅ | ✅ |
| Data entrada sociedade | ❌ | ❌ | ✅ |
| Código do país do sócio estrangeiro | ❌ | ✅ | ✅ |
| Nome do país do sócio estrangeiro | ❌ | ✅ | ✅ |
| CPF do representante legal | ❌ | ❌ | ✅ |
| Nome do representante | ❌ | ✅ | ✅ |
| Código de qualificação do representante legal | ❌ | ✅ | ✅ |

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnpj/ |
| **Loja** | https://loja.serpro.gov.br/consultacnpj |

### Argumento de Consulta

| Tipo de Consulta | Parâmetro |
|------------------|-----------|
| Consulta Básica | CNPJ |
| Consulta QSA | CNPJ |
| Consulta Empresa | CNPJ |

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo**
- Identifique a sua faixa de preços conforme o volume de consumo
- Multiplique então o número de consultas pelo valor unitário da respectiva faixa de quantidade de consultas no mês

### Tabela de Preços (Novembro/2025)

| Faixa | Quantidade de Requisições | Preço por Requisição (R$) |
|-------|---------------------------|---------------------------|
| 1 | até 5.000 | R$ 0,8788 |
| 2 | de 5.001 a 10.000 | R$ 0,8265 |
| 3 | de 10.001 a 15.000 | R$ 0,7951 |
| 4 | de 15.001 a 30.000 | R$ 0,7533 |
| 5 | de 30.001 a 50.000 | R$ 0,7219 |
| 6 | de 50.001 a 75.000 | R$ 0,6905 |
| 7 | de 75.001 a 100.000 | R$ 0,6486 |
| 8 | de 100.001 a 500.000 | R$ 0,6173 |
| 9 | de 500.001 a 1.000.000 | R$ 0,5336 |
| 10 | de 1.000.001 a 2.000.000 | R$ 0,4394 |
| 11 | de 2.000.001 a 4.000.000 | R$ 0,3662 |
| 12 | de 4.000.001 a 10.000.000 | R$ 0,3139 |
| 13 | acima de 10.000.000 | R$ 0,2511 |

---

## COMPARATIVO DOS PLANOS

| Característica | Básica | QSA | Empresa |
|----------------|--------|-----|---------|
| Dados cadastrais | ✅ | ✅ | ✅ |
| Endereço completo | ✅ | ✅ | ✅ |
| Telefones e e-mail | ✅ | ✅ | ✅ |
| CNAE principal e secundária | ✅ | ✅ | ✅ |
| Capital social | ✅ | ✅ | ✅ |
| Opção Simples/MEI | ❌ | ✅ | ✅ |
| Quadro societário (nomes) | ❌ | ✅ | ✅ |
| **CPF/CNPJ dos sócios** | ❌ | ❌ | ✅ |
| Data entrada sócios | ❌ | ❌ | ✅ |
| Representante legal | ❌ | ✅ | ✅ |
| CPF representante legal | ❌ | ❌ | ✅ |

### Recomendação por Uso

| Caso de Uso | Tipo Recomendado |
|-------------|------------------|
| Validação básica de CNPJ | Básica |
| Verificar Simples Nacional | QSA |
| Conhecer sócios (nomes) | QSA |
| **Due Diligence completa** | **Empresa** |
| **Identificar CPF dos sócios** | **Empresa** |
| Análise de risco de fornecedores | Empresa |

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta CNPJ
SERPRO_CNPJ_CONSUMER_KEY=sua_consumer_key
SERPRO_CNPJ_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/consultacnpj
2. Clicar em "Quero contratar"
3. Autenticar com certificado digital e-CNPJ
4. Selecionar o tipo de consulta desejado
5. Aceitar termos e condições
6. Configurar credenciais de API

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |
| **Formulário** | Disponível na Loja SERPRO |

---

**Documento atualizado em:** 29/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
