# JusBrasil Consulta PRO - API de Background Check

## 📋 Visão Geral

A **JusBrasil Consulta PRO** é uma API REST que permite consultar processos judiciais e registros públicos em todo o Brasil através de integração via API.

**Fornecedor**: JusBrasil
**Produto**: Background Check API - Consulta PRO
**Tipo**: API REST com autenticação via API Key
**Base URL**: `https://api.jusbrasil.com.br/background-check/`

---

## 🔍 O que é possível consultar?

### Processos Judiciais
- ✅ **Processos Criminais** - Consulta em tribunais de todo o Brasil
- ✅ **Processos Civis** - Ações cíveis e correlatas
- ✅ **Processos Trabalhistas** - Ações na Justiça do Trabalho

### Registros Públicos
- ✅ **Registros MP** - Ministério Público
- ✅ **Registros BNMP** - Banco Nacional de Mandados de Prisão
- ✅ **Empregador Irregular** - Registro de empregadores com irregularidades

### Funcionalidades Especiais
- ✅ **Consulta em Lote** - Até 3.000 registros via upload CSV
- ✅ **Paginação** - Sistema cursor-based para grandes volumes
- ✅ **Níveis de Confiança** - ALTA, MEDIA, BAIXA para associação ao CPF

---

## 💰 Preços

| Item | Valor |
|------|-------|
| **Preço por Chamada** | R$ 4,00 |
| **Consumo Mínimo Mensal** | R$ 1.000,00 |
| **Modelo de Cobrança** | Pay-per-call |

**Exemplos de Volume:**
- R$ 1.000/mês = 250 consultas/mês (mínimo)
- R$ 2.000/mês = 500 consultas/mês
- R$ 5.000/mês = 1.250 consultas/mês

---

## 🔐 Autenticação

A autenticação é feita via **API Key** no header da requisição:

```bash
apikey: <sua_api_key>
```

A API Key pode ser gerada e gerenciada através do painel de administração da JusBrasil.

---

## 📊 Endpoints Disponíveis

### 1. Processos Criminais
```
POST /lawsuits/criminal
```

### 2. Processos Civis
```
POST /lawsuits/civil
```

### 3. Processos Trabalhistas
```
POST /lawsuits/trabalhista
```

### 4. Registros MP
```
POST /mp
```

### 5. Registros BNMP
```
POST /bnmp
```

### 6. Empregador Irregular
```
POST /empregador-irregular
```

### 7. Consulta em Lote (Upload)
```
POST /consulta-em-lote
```

### 8. Listar Consultas em Lote
```
GET /consulta-em-lote/
```

### 9. Download Resultado Lote
```
GET /consulta-em-lote/download/<id>
```

---

## 📖 Documentação Completa

Para documentação técnica detalhada, consulte:
- **RELATORIO_JUSBRASIL_COMPLETO.md** - Documentação técnica completa com exemplos de código, JSON responses, casos de uso e guia de integração
- **PRECOS.csv** - Tabela de preços detalhada
- **DOCUMENTACAO_TECNICA.md** - Referência técnica de todos os endpoints

---

## ⚖️ LGPD e Conformidade

A utilização da API JusBrasil deve estar em conformidade com a **Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)**.

**Bases Legais Aplicáveis:**
- Art. 7º, VI - Exercício regular de direitos
- Art. 7º, IX - Legítimo interesse

**Importante:**
- Dados são públicos (processos judiciais)
- Requer consentimento do titular para uso comercial
- Necessário manter registro de finalidade e base legal

---

## 🚀 Como Começar

1. **Obter API Key** - Solicite acesso através do painel JusBrasil
2. **Testar em Sandbox** - Use ambiente de testes antes de produção
3. **Implementar** - Integre os endpoints necessários
4. **Monitorar** - Acompanhe consumo para otimizar custos

---

## 📞 Suporte

Para dúvidas técnicas ou comerciais, consulte a documentação oficial da JusBrasil ou entre em contato com o suporte técnico.

---

**Última Atualização**: Dezembro 2024
**Versão da API**: v1
