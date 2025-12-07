# APIs SERPRO - Documentação Completa

## 📌 Visão Geral

Este repositório contém toda a documentação, contratos e configurações das APIs SERPRO contratadas.

**Total de APIs Contratadas:** 9 (14 contratos)
**Status:** ✅ TODAS ATIVAS
**Última Atualização:** 06/12/2025

---

## 📁 Estrutura do Projeto

```
SERPRO/
├── .env                              # Configuração de tokens (NÃO commitar!)
├── .gitignore                        # Arquivos ignorados pelo Git
│
├── contratos/                        # Contratos oficiais em PDF
│   ├── README.md                     # Índice de contratos
│   ├── *-contrato-260005.pdf         # Consulta CPF
│   ├── *-contrato-260009.pdf         # Consulta CNPJ
│   ├── *-contrato-260008.pdf         # Consulta Renda
│   ├── *-contrato-261071.pdf         # Consulta Renda
│   ├── *-contrato-261070.pdf         # Datavalid
│   ├── *-contrato-261069.pdf         # Dívida Ativa
│   ├── *-contrato-261072.pdf         # Raiz Tech
│   ├── *-contrato-261073.pdf         # Faturamento
│   ├── *-contrato-261074.pdf         # Integra Contador
│   └── *-contrato-261075.pdf         # [Verificar API]
│
├── 01_Consulta_CPF/                  # Contrato 260005
│   ├── API_CONSULTA_CPF.md
│   ├── api-consulta-cpf-v2.md
│   ├── PRECOS.csv
│   └── README.md (→ link para contrato PDF)
│
├── 02_Consulta_CNPJ/                 # Contrato 260009
│   ├── API_CONSULTA_CNPJ.md
│   ├── PRECOS.csv
│   └── README.md (→ link para contrato PDF)
│
├── 03_Consulta_Divida_Ativa/         # Contrato 261069
│   ├── API_CONSULTA_DIVIDA_ATIVA.md
│   ├── PRECOS.csv
│   └── README.md (→ link para contrato PDF)
│
├── 04_Consulta_Faturamento/          # Contrato 261073
│   ├── API_CONSULTA_FATURAMENTO.md
│   ├── PRECOS.csv (🎁 5 primeiras GRÁTIS!)
│   └── README.md (→ link para contrato PDF)
│
├── 05_Consulta_Renda/                # Contratos 260008 e 261071
│   ├── API_CONSULTA_RENDA.md
│   ├── PRECOS.csv
│   └── README.md (→ links para 2 contratos PDF)
│
├── 06_Datavalid/                     # Contrato 261070
│   ├── API_DATAVALID.md
│   ├── PRECOS.csv
│   └── README.md (→ link para contrato PDF)
│
├── 07_Integra_Contador/              # Contrato 261074 (84 funcionalidades)
│   ├── API_INTEGRA_CONTADOR.md
│   ├── PRECOS.csv
│   └── README.md (→ link para contrato PDF)
│
├── 08_Raiz_Tech_Pastagens/           # Contrato 261072 (Agronegócio)
│   ├── PRECOS.csv
│   └── README.md (→ link para contrato PDF)
│
├── 09_Consulta_CND/                  # Contrato 261075
│   ├── PRECOS.csv
│   └── README.md (→ link para contrato PDF)
│
├── APIs_Nao_Contratadas/             # APIs disponíveis mas não contratadas
│   └── README.md
│
├── COMO_OBTER_TOKENS.md              # Guia para obter tokens
├── RESUMO_APIS_SERPRO.md             # Resumo geral
├── ESTRUTURA_PROJETO.md              # Documentação da estrutura
└── SERPRO_TABELA_PRECOS.xlsx         # Planilha consolidada
```

---

## 🔑 Configuração de Tokens

### 1. Obter Tokens
1. Acesse https://loja.serpro.gov.br
2. Login com certificado digital e-CNPJ
3. Vá em **"Gestão de Chaves"**
4. Clique em **"Visualizar chaves"** para cada API
5. Copie o **Consumer Secret** (token)

### 2. Configurar .env
Edite o arquivo `.env` na raiz e cole os tokens:

```env
SERPRO_CPF_TOKEN=seu_token_aqui
SERPRO_CNPJ_TOKEN=seu_token_aqui
SERPRO_DIVIDA_ATIVA_TOKEN=seu_token_aqui
SERPRO_FATURAMENTO_TOKEN=seu_token_aqui
SERPRO_RENDA_TOKEN=seu_token_aqui
SERPRO_DATAVALID_TOKEN=seu_token_aqui
SERPRO_INTEGRA_CONTADOR_TOKEN=seu_token_aqui
SERPRO_RAIZ_TECH_PASTAGENS_TOKEN=seu_token_aqui
SERPRO_CND_TOKEN=seu_token_aqui
```

📖 **Guia detalhado:** `COMO_OBTER_TOKENS.md`

---

## 📊 APIs Contratadas

| # | API | Contrato(s) | Preço Inicial | Recursos Especiais |
|---|-----|-------------|---------------|-------------------|
| 1 | **Consulta CPF** | 260005 | R$ 0,6591 | ✅ Check Time Stamp |
| 2 | **Consulta CNPJ** | 260009 | R$ 0,8788 | ✅ Check Time Stamp |
| 3 | **Consulta Dívida Ativa** | 261069 | R$ 0,6591 | PGFN |
| 4 | **Consulta Faturamento** | 261073 | 🎁 GRÁTIS (1-5) | Primeiras 5 grátis |
| 5 | **Consulta Renda** | 260008, 261071 | R$ 0,6591 | 2 contratos |
| 6 | **Datavalid V4** | 261070 | Consultar | ✅ Biometria + Time Stamp |
| 7 | **Integra Contador** | 261074 | Consultar | 84 funcionalidades |
| 8 | **Raiz Tech Pastagens** | 261072 | Consultar | 🌾 Agronegócio |
| 9 | **Consulta CND** | 261075 | R$ 0,8788 | ✅ Check Time Stamp |

---

## 🚀 Quick Start

### Exemplo: Consulta CPF

```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/consulta/40442820135" \
  -H "Authorization: Bearer SEU_TOKEN_CPF"
```

### Exemplo: Consulta CNPJ

```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj/v2/empresa/34028316000103" \
  -H "Authorization: Bearer SEU_TOKEN_CNPJ"
```

---

## 📚 Documentação por API

Cada pasta de API contém:

- **`README.md`** - Visão geral, quick start e link para contrato oficial (PDF)
- **`PRECOS.csv`** - Tabela completa de preços (abre no Excel)
- **`API_*.md`** - Documentação técnica detalhada

### 📄 Contratos Oficiais

Todos os contratos oficiais em PDF estão na pasta **`contratos/`**

Cada README de API contém link direto para seu(s) contrato(s).

---

## 💰 Modelo de Cobrança

**Tipo:** ESCALONADO/PROGRESSIVO

Você paga cada faixa completamente antes de passar para a próxima.

**Exemplo:** 15.000 consultas CPF
- Faixa 1: 999 × R$ 0,6591 = R$ 657,36
- Faixa 2: 9.000 × R$ 0,5649 = R$ 5.084,10
- Faixa 3: 5.001 × R$ 0,3557 = R$ 1.778,91
- **Total:** R$ 7.520,37

---

## 🔒 Segurança

- ⚠️ O arquivo `.env` está em `.gitignore`
- ⚠️ **NUNCA** commite tokens no Git
- ⚠️ Use variáveis de ambiente em produção
- ⚠️ Mantenha backups seguros
- ⚠️ Revogue tokens comprometidos imediatamente

---

## 📞 Suporte SERPRO

| Canal | Informação |
|-------|------------|
| **Loja** | https://loja.serpro.gov.br |
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/ |
| **Horário** | Segunda a sexta, 8h-18h (Brasília) |

---

## 🎯 Próximos Passos

1. ✅ Configure os tokens no `.env`
2. ✅ Teste cada API
3. ✅ Leia a documentação específica de cada API
4. ✅ Implemente tratamento de erros
5. ✅ Configure rate limiting
6. ✅ Implemente logging/auditoria

---

## 📖 Arquivos de Referência

- **`contratos/`** - Todos os contratos oficiais em PDF (10 contratos)
- `COMO_OBTER_TOKENS.md` - Como obter tokens na Loja SERPRO
- `RESUMO_APIS_SERPRO.md` - Resumo de todas as APIs disponíveis
- `ESTRUTURA_PROJETO.md` - Documentação da estrutura
- `SERPRO_TABELA_PRECOS.xlsx` - Planilha consolidada de preços

---

## 🆕 APIs Não Contratadas

Há **14 APIs** disponíveis no SERPRO que ainda não foram contratadas.

📁 Consulte: `APIs_Nao_Contratadas/README.md`

Exemplos:
- Consulta Restituição
- Consulta NFE
- Senatran (4 tipos)
- Biovalid
- E mais...

---

**Última atualização:** 06/12/2025
**Mantido por:** _[Seu nome/equipe]_
