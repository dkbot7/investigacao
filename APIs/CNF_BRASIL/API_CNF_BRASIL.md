# CNF Brasil - Cadastro Nacional de Falecidos

**Localização de Certidões de Óbito em Cartórios**

---

## VISÃO GERAL

O CNF Brasil (Cadastro Nacional de Falecidos) é uma ferramenta de pesquisa que permite localizar onde foi registrado o óbito de uma pessoa, retornando informações do cartório responsável.

| Item | Valor |
|------|-------|
| **Site** | https://www.falecidosnobrasil.org.br |
| **Base de Dados** | +50 milhões de registros |
| **Cobertura** | Cartórios de todo o Brasil |
| **Custo Consulta Manual** | Gratuito |
| **API** | Disponível (sob orçamento) |

---

## DADOS RETORNADOS

| Campo | Descrição |
|-------|-----------|
| **Nome do Cartório** | Cartório que registrou o óbito |
| **Localização** | Cidade/Estado do cartório |
| **Dados do Registro** | Livro, folha, termo |
| **Contato** | Email e telefone do cartório |
| **Data do Registro** | Data em que foi registrado |

---

## CONSULTA MANUAL (GRATUITA)

### Parâmetros de Busca

| Parâmetro | Obrigatório | Descrição |
|-----------|-------------|-----------|
| **Nome** | Sim | Nome da pessoa (mín. 3 caracteres) |
| **Busca Exata** | Não | Checkbox para busca exata |

> **Nota:** CPF não é necessário para consulta

### Como Consultar

1. Acessar https://www.falecidosnobrasil.org.br
2. Preencher o nome da pessoa no campo de busca
3. Marcar "busca exata" se desejar correspondência exata
4. Clicar em "Pesquisar"
5. Visualizar resultados com dados do cartório

---

## API (PAGA)

### Contato para Orçamento

| Item | Informação |
|------|------------|
| **Email** | relacionamento@cnfbrasil.org.br |
| **Assunto** | "API - Orçamento" |

### Modelo de Email para Solicitação

```
Assunto: API - Orçamento

Prezados,

Gostaria de solicitar orçamento para acesso à API do CNF Brasil.

Informações:
- Volume estimado: [X] consultas/mês
- Finalidade: [Due diligence / Investigação / Cadastro]
- Empresa: [Nome da empresa]
- CNPJ: [CNPJ]
- Responsável: [Nome]
- Telefone: [Telefone]

Aguardo retorno com informações sobre:
- Preço por consulta
- Documentação técnica da API
- Requisitos para integração

Atenciosamente,
[Assinatura]
```

---

## CASOS DE USO

### 1. Investigação de Óbito
Após confirmar óbito via SERPRO/Receita, localizar o cartório para obter certidão.

### 2. Due Diligence
Verificar se pessoa consta como falecida e obter comprovação documental.

### 3. Fraude de Identidade
Identificar uso de documentos de pessoas falecidas.

### 4. Herança e Inventário
Localizar certidão de óbito para processos de inventário.

### 5. Atualização Cadastral
Confirmar óbito de clientes/beneficiários em bases de dados.

---

## FLUXO RECOMENDADO

```
┌─────────────────────────────────────────────────────────┐
│                    VERIFICAÇÃO DE ÓBITO                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. SERPRO (R$ 0,66/CPF)                                │
│     └─> Confirma: VIVO ou FALECIDO + Ano do óbito       │
│                                                          │
│  2. CNF BRASIL (Grátis manual / API paga)               │
│     └─> Localiza: Cartório + Dados do registro          │
│                                                          │
│  3. CARTÓRIO (R$ 50-100 por certidão)                   │
│     └─> Emite: Certidão de Óbito oficial                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## COMPARATIVO COM OUTRAS FONTES

| Fonte | Confirma Óbito | Ano Óbito | Localiza Cartório | Custo |
|-------|----------------|-----------|-------------------|-------|
| **SERPRO** | Sim | Sim | Não | R$ 0,66 |
| **Infosimples** | Sim | Sim | Não | R$ 0,20 |
| **Receita Federal** | Sim | Não | Não | Grátis |
| **CNF Brasil** | Sim | Sim | **SIM** | Grátis/API |

---

## LIMITAÇÕES

| Limitação | Descrição |
|-----------|-----------|
| **Cobertura** | Nem todos os óbitos estão cadastrados |
| **Atualização** | Pode haver delay na inclusão de novos registros |
| **Consulta Manual** | Trabalhoso para grande volume |
| **API** | Preço não divulgado publicamente |

---

## DICAS DE USO

### Para Consulta Manual em Lote

1. Primeiro filtrar apenas os **falecidos** (via SERPRO)
2. Exportar lista com nomes
3. Consultar um a um no site
4. Registrar dados do cartório em planilha

### Nomes Comuns

Para nomes muito comuns (ex: "João da Silva"), usar informações adicionais:
- Filtrar por estado/cidade se disponível
- Cruzar com data aproximada do óbito (ano do SERPRO)

---

## VARIÁVEIS DE AMBIENTE

```env
# CNF Brasil - API (quando contratada)
CNF_BRASIL_API_KEY=sua_api_key
CNF_BRASIL_API_URL=https://api.falecidosnobrasil.org.br
```

---

## CONTATO

| Canal | Informação |
|-------|------------|
| **Site** | https://www.falecidosnobrasil.org.br |
| **Email Comercial** | relacionamento@cnfbrasil.org.br |
| **Assunto API** | "API - Orçamento" |

---

**Documento criado em:** 02/12/2025
**Fonte:** https://www.falecidosnobrasil.org.br
