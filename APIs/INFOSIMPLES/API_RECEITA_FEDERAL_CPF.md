# Infosimples - API Receita Federal / CPF

**Consulta de Dados Cadastrais de Pessoa Física**

---

## VISAO GERAL

A API permite consultar dados cadastrais de uma Pessoa Física e sua situação fiscal perante a Receita Federal utilizando o número de CPF e a Data de Nascimento.

### Diferenciais

- Execução em **milissegundos** (não é RPA tradicional)
- Software proprietário otimizado
- Alta disponibilidade

---

## PARAMETROS NECESSARIOS

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cpf` | string | Sim | CPF da pessoa (11 dígitos) |
| `birthdate` | string | Sim | Data de nascimento (YYYY-MM-DD) |

---

## DADOS RETORNADOS

| Campo | Descrição |
|-------|-----------|
| `cpf` | Número do CPF |
| `nome` | Nome completo |
| `nome_civil` | Nome civil |
| `nome_social` | Nome social (se houver) |
| `data_nascimento` | Data de nascimento |
| `data_inscricao` | Data de inscrição no CPF |
| `situacao_cadastral` | Situação perante a RFB |
| `ano_obito` | Ano de óbito (se falecido) |
| `digito_verificador` | Dígito verificador do CPF |
| `consulta_datahora` | Data/hora da consulta |
| `receipt` | Comprovante da consulta |
| `qrcode_url` | URL do QR Code |

### Total: 19 campos de dados

---

## SITUACOES CADASTRAIS POSSIVEIS

| Situação | Descrição |
|----------|-----------|
| **Regular** | CPF ativo e regular |
| **Pendente de Regularização** | Pendências com a RFB |
| **Suspenso** | CPF suspenso |
| **Cancelado por Multiplicidade** | CPF duplicado |
| **Nulo** | CPF inválido |
| **Titular Falecido** | Pessoa falecida |

---

## CASOS DE USO

### 1. Onboarding de Clientes/Fornecedores
Validar dados cadastrais durante cadastro.

### 2. Prevenção a Fraudes
Confirmar que nome, CPF e data de nascimento coincidem.

### 3. Verificação de Óbito
Confirmar se a pessoa está viva (não consta ano de óbito).

### 4. Gestão Cadastral
Atualização e validação de cadastros.

### 5. Análise de Crédito
Verificar situação cadastral antes de conceder crédito.

### 6. KYC (Know Your Customer)
Processos de conhecimento do cliente.

---

## ENDPOINT

```
GET https://api.infosimples.com/api/v2/consultas/receita-federal/cpf
```

### Parâmetros de Query

```
?token=SEU_TOKEN&cpf=12345678901&birthdate=1990-01-15
```

---

## EXEMPLO DE RESPOSTA

```json
{
  "code": 200,
  "code_message": "Sucesso",
  "data": [
    {
      "cpf": "123.456.789-01",
      "nome": "FULANO DE TAL",
      "nome_civil": "FULANO DE TAL",
      "nome_social": null,
      "data_nascimento": "15/01/1990",
      "data_inscricao": "antes de 1990",
      "situacao_cadastral": "Regular",
      "ano_obito": null,
      "consulta_datahora": "30/11/2025 10:30:45"
    }
  ],
  "data_count": 1
}
```

---

## CODIGOS DE RESPOSTA

| Código | Descrição |
|--------|-----------|
| **200** | Sucesso - resultado único |
| **201** | Sucesso - múltiplos resultados |
| **600** | Não encontrado |
| **400** | Erro nos parâmetros |
| **500** | Erro interno |

---

## PRECO

| Item | Valor |
|------|-------|
| **Preço Base** | Conforme tabela escalonada |
| **Preço Adicional** | Não tem |

Consulte a [tabela de preços](INFOSIMPLES_PLANOS_PRECOS.md) para valores por faixa.

---

## VARIAVEIS DE AMBIENTE

```env
INFOSIMPLES_API_TOKEN=seu_token_aqui
```

---

**Documento atualizado em:** 30/11/2025
**Fonte:** https://infosimples.com/consultas/receita-federal-cpf/
