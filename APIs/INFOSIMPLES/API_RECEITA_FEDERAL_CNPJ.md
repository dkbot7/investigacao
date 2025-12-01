# Infosimples - API Receita Federal / CNPJ

**Consulta de Dados Cadastrais de Pessoa Jurídica**

---

## VISAO GERAL

A API permite consultar dados cadastrais de uma Pessoa Jurídica e sua situação fiscal perante a Receita Federal utilizando o número de CNPJ.

### Diferenciais

- Execução em **milissegundos** (não é RPA tradicional)
- Software proprietário otimizado
- Retorna mais de 40 campos de dados
- Inclui Quadro Societário (QSA)

---

## PARAMETROS NECESSARIOS

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `cnpj` | string | Sim | CNPJ da empresa (14 dígitos) |

---

## DADOS RETORNADOS

### Dados Básicos

| Campo | Descrição |
|-------|-----------|
| `cnpj` | Número do CNPJ |
| `razao_social` | Razão social |
| `nome_fantasia` | Nome fantasia |
| `situacao_cadastral` | Situação perante a RFB |
| `situacao_cadastral_data` | Data da situação |
| `abertura_data` | Data de abertura |
| `natureza_juridica` | Natureza jurídica |
| `porte` | Porte da empresa |
| `capital_social` | Capital social |
| `tipo` | Matriz ou Filial |

### Atividades Econômicas

| Campo | Descrição |
|-------|-----------|
| `atividade_economica` | CNAE principal |
| `atividade_economica_secundaria_lista` | Lista de CNAEs secundários |

### Endereço

| Campo | Descrição |
|-------|-----------|
| `endereco_logradouro` | Logradouro |
| `endereco_numero` | Número |
| `endereco_complemento` | Complemento |
| `endereco_bairro` | Bairro |
| `endereco_municipio` | Município |
| `endereco_uf` | UF |
| `endereco_cep` | CEP |

### Contato

| Campo | Descrição |
|-------|-----------|
| `telefone` | Telefone |
| `email` | E-mail |

### Quadro Societário (QSA)

| Campo | Descrição |
|-------|-----------|
| `qsa` | Lista de sócios/administradores |
| `qsa[].nome` | Nome do sócio |
| `qsa[].cpf_cnpj` | CPF/CNPJ do sócio |
| `qsa[].qualificacao` | Qualificação (ex: Sócio-Administrador) |
| `qsa[].data_entrada` | Data de entrada |

### Total: 40+ campos de dados

---

## SITUACOES CADASTRAIS POSSIVEIS

| Situação | Descrição |
|----------|-----------|
| **Ativa** | Empresa ativa |
| **Suspensa** | Empresa suspensa |
| **Inapta** | Empresa inapta |
| **Baixada** | Empresa encerrada |
| **Nula** | CNPJ inválido |

---

## CASOS DE USO

### 1. Gestão Cadastral
Validar e atualizar dados de empresas parceiras.

### 2. Prevenção a Fraudes
Verificar se empresa tem processos judiciais e dívidas.

### 3. Onboarding de Clientes/Fornecedores
Validar dados durante cadastro.

### 4. Due Diligence
Análise completa de empresas antes de negócios.

### 5. KYC (Know Your Customer)
Conhecer a empresa com quem está negociando.

### 6. Análise de Crédito
Verificar situação da empresa antes de conceder crédito.

---

## ENDPOINT

```
GET https://api.infosimples.com/api/v2/consultas/receita-federal/cnpj
```

### Parâmetros de Query

```
?token=SEU_TOKEN&cnpj=12345678000199
```

---

## EXEMPLO DE RESPOSTA

```json
{
  "code": 200,
  "code_message": "Sucesso",
  "data": [
    {
      "cnpj": "12.345.678/0001-99",
      "razao_social": "EMPRESA EXEMPLO LTDA",
      "nome_fantasia": "EXEMPLO",
      "situacao_cadastral": "Ativa",
      "abertura_data": "01/01/2010",
      "natureza_juridica": "206-2 - Sociedade Empresária Limitada",
      "porte": "Empresa de Pequeno Porte",
      "capital_social": "100000.00",
      "atividade_economica": "62.01-5-01 - Desenvolvimento de programas de computador sob encomenda",
      "endereco_logradouro": "Avenida Paulista",
      "endereco_numero": "1000",
      "endereco_bairro": "Bela Vista",
      "endereco_municipio": "São Paulo",
      "endereco_uf": "SP",
      "endereco_cep": "01310-100",
      "telefone": "(11) 3000-0000",
      "email": "contato@exemplo.com.br",
      "qsa": [
        {
          "nome": "FULANO DE TAL",
          "cpf_cnpj": "***456789**",
          "qualificacao": "49 - Sócio-Administrador",
          "data_entrada": "01/01/2010"
        }
      ]
    }
  ],
  "data_count": 1
}
```

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
**Fonte:** https://infosimples.com/consultas/receita-federal-cnpj/
