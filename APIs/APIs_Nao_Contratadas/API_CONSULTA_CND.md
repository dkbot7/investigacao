# API SERPRO - Consulta CND

**Certidão Negativa de Débitos - Direto das Bases do Governo**

---

## VISÃO GERAL

A Consulta CND é uma API HTTP REST que permite obter Certidões Negativas de Débitos diretamente das bases do Governo Federal, sem intervenção humana.

### O que é a CND?

Uma Certidão Negativa de Débitos (CND) ajuda a reduzir riscos em operações com clientes e fornecedores. A API retorna certidões expedidas conjuntamente pela:

- **RFB** - Secretaria Especial da Receita Federal do Brasil
- **PGFN** - Procuradoria-Geral da Fazenda Nacional

Referente a todos os créditos tributários federais e à Dívida Ativa da União (DAU).

### Tipos de Consulta

| Tipo | Descrição |
|------|-----------|
| **Pessoa Física (CPF)** | CND de pessoa física |
| **Pessoa Jurídica (CNPJ)** | CND de empresa |
| **Imóvel Rural** | CND de propriedade rural |

---

## FUNCIONALIDADES

### Pesquisa Automática de Certificado

Quando uma consulta é feita, a ferramenta:

1. Verifica a existência de um certificado válido
2. Se não existir, solicita a emissão de um novo
3. Se um certificado válido for encontrado, retorna:
   - **Código de controle** do certificado
   - **Tipo de certificado** (Negativo ou Positivo com Efeitos de Negativo)
   - **Data de validade**

### Ideal Para

- Entidades Públicas e Privadas
- Automação de Processos de Conformidade
- Análise de Riscos
- Onboarding de fornecedores
- Due Diligence

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnd/ |
| **Loja** | https://loja.serpro.gov.br/consultacnd |

### Autenticação

A API utiliza validação do chamador por meio de chave pública. É necessário gerar um Bearer Token antes de realizar chamadas à API.

```
Authorization: Bearer {seu_token}
```

---

## MODELO DE COBRANÇA

### Características

- **Sem franquia** - Paga apenas pelas consultas realizadas
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Cálculo:** Total = Quantidade × Preço unitário da faixa

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

### Simulação de Custos

| Consultas/Mês | Faixa | Preço Unit. | Custo Total |
|---------------|-------|-------------|-------------|
| 100 | 1 | R$ 0,8788 | R$ 87,88 |
| 500 | 1 | R$ 0,8788 | R$ 439,40 |
| 1.000 | 1 | R$ 0,8788 | R$ 878,80 |
| 5.000 | 1 | R$ 0,8788 | R$ 4.394,00 |
| 10.000 | 2 | R$ 0,8265 | R$ 8.265,00 |
| 50.000 | 5 | R$ 0,7219 | R$ 36.095,00 |
| 100.000 | 7 | R$ 0,6486 | R$ 64.860,00 |

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/consultacnd
2. Clicar em "Quero contratar"
3. Autenticar com certificado digital e-CNPJ
4. Aceitar termos e condições
5. Configurar credenciais de API

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |
| **Formulário** | Disponível na Loja SERPRO |

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta CND
SERPRO_CND_CONSUMER_KEY=sua_consumer_key
SERPRO_CND_CONSUMER_SECRET=seu_consumer_secret
```

---

## CÓDIGOS DE RETORNO

| Código HTTP | Descrição |
|-------------|-----------|
| 200 | Sucesso - Certidão encontrada/emitida |
| 400 | Requisição inválida |
| 401 | Não autorizado (token inválido) |
| 404 | CPF/CNPJ não encontrado |
| 500 | Erro interno do servidor |

---

## OBSERVAÇÕES

1. A certidão tem validade definida pela RFB/PGFN
2. Se já existir certidão válida, a mesma é retornada (sem custo adicional de emissão)
3. A API está integrada diretamente aos sistemas oficiais do Governo
4. Disponibilidade sujeita aos sistemas da Receita Federal

---

**Documento atualizado em:** 29/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
