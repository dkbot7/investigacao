# CATÁLOGO DE APIs PARA INVESTIGAÇÃO E DUE DILIGENCE

**Documento de Referência - InvestigaRee**
**Atualizado em:** 29/11/2025
**Versão:** 1.0

---

## ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [APIs Pagas](#2-apis-pagas)
   - [SERPRO](#21-serpro)
   - [Serasa Experian](#22-serasa-experian)
   - [Infosimples](#23-infosimples)
   - [Escavador](#24-escavador)
   - [BigDataCorp](#25-bigdatacorp)
   - [CNPJa](#26-cnpja)
3. [APIs Gratuitas](#3-apis-gratuitas)
   - [Portal da Transparência](#31-portal-da-transparência)
   - [BrasilAPI](#32-brasilapi)
   - [TSE - Dados Abertos](#33-tse---dados-abertos)
   - [CGU - Dados Abertos](#34-cgu---dados-abertos)
   - [OFAC SDN](#35-ofac-sdn)
   - [DataJud CNJ](#36-datajud-cnj)
4. [Comparativo de Funcionalidades](#4-comparativo-de-funcionalidades)
5. [Recomendações por Caso de Uso](#5-recomendações-por-caso-de-uso)
6. [Configuração no Projeto](#6-configuração-no-projeto)

---

## 1. VISÃO GERAL

Este documento cataloga todas as APIs disponíveis para consultas de investigação e due diligence, incluindo informações de cadastro, processos judiciais, sanções, vínculos empresariais e eleitorais.

### Resumo Rápido

| API | Tipo | Dados Principais | Custo Estimado |
|-----|------|------------------|----------------|
| SERPRO | Paga | CPF/CNPJ oficial RFB | R$ 0,66/consulta |
| Serasa Experian | Paga | Score, negativações | Sob consulta |
| Infosimples | Paga | CPF, CNPJ, óbito, processos | R$ 0,20-0,24/consulta |
| Escavador | Paga | Processos judiciais | R$ 0,10-0,20/processo |
| BigDataCorp | Paga | Processos, dados enriquecidos | R$ 0,05/consulta |
| Portal Transparência | Gratuita | Benefícios, sanções, servidores | Grátis |
| BrasilAPI | Gratuita | CNPJ, CEP, bancos | Grátis |
| TSE | Gratuita | Candidaturas, doações | Grátis |

---

## 2. APIS PAGAS

### 2.1 SERPRO

**Serviço de Processamento de Dados do Governo Federal**

| Item | Descrição |
|------|-----------|
| **Website** | https://loja.serpro.gov.br |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/ |
| **Tipo** | API REST |
| **Autenticação** | OAuth 2.0 (Consumer Key + Secret) |

#### Serviços Disponíveis

**Consulta CPF**
- Situação cadastral na Receita Federal
- Nome completo
- Data de nascimento
- Situação do CPF (Regular, Pendente, Suspenso, Cancelado, Nulo)
- Data da inscrição

**Consulta CNPJ**
- **Básica:** Situação cadastral, endereço, CNAE, natureza jurídica, telefone
- **QSA:** Dados acima + quadro societário + opção MEI/Simples
- **Empresa:** Dados completos + CPF/CNPJ dos sócios

#### Preços

| Volume Mensal | Preço por Consulta |
|---------------|-------------------|
| Até 999 | R$ 662,40 (fixo) |
| 1.000 - 10.000 | R$ 0,66 |
| 10.001 - 50.000 | R$ 0,33 |
| 50.001 - 100.000 | R$ 0,17 |
| 100.001 - 500.000 | R$ 0,08 |
| 500.001 - 1.000.000 | R$ 0,04 |
| Acima de 1.000.000 | R$ 0,02 |

#### Como Contratar
1. Acessar https://loja.serpro.gov.br
2. Necessário certificado digital e-CNPJ
3. Contato: css.serpro@serpro.gov.br | 0800 728 2323

#### Variáveis de Ambiente
```env
SERPRO_CONSUMER_KEY=sua_consumer_key
SERPRO_CONSUMER_SECRET=seu_consumer_secret
```

---

### 2.2 SERASA EXPERIAN

**Bureau de Crédito - Análise de Risco**

| Item | Descrição |
|------|-----------|
| **Website** | https://www.serasaexperian.com.br |
| **Portal Integração** | https://www.serasaexperian.com.br/portal-integracao/ |
| **Tipo** | API REST / WebService |
| **Autenticação** | Login + Senha + Token |

#### Serviços Disponíveis

**Score de Crédito (0-1000)**
- Pontuação de risco de inadimplência
- Quanto mais próximo de 1000, menor o risco
- Histórico de comportamento financeiro

**Consulta Completa PF/PJ**
- Dívidas e negativações
- Protestos
- Ações judiciais
- Cheques sem fundo
- Score
- Referências comerciais
- Rendimento mensal estimado
- Recomendação de limite de crédito

**Consulta Básica**
- Dados cadastrais
- Situação do documento
- Restrições financeiras

#### Preços
- **Modelo:** Contrato empresarial com volume mínimo
- **Negociação:** Direta com Serasa ou distribuidores autorizados
- **Distribuidores:** Think Data, TecnoSpeed (facilitam integração)

#### Como Contratar
1. Contato com Serasa Experian comercial
2. Ou através de distribuidores autorizados (Think Data, TecnoSpeed)
3. Necessário CNPJ ativo e contrato formal

#### Variáveis de Ambiente
```env
SERASA_LOGIN=seu_login
SERASA_SENHA=sua_senha
SERASA_CODIGO_CLIENTE=seu_codigo
```

#### Observações LGPD
- Requer consentimento do titular para consulta
- Finalidade legítima obrigatória
- Guardar registro de consentimento

---

### 2.3 INFOSIMPLES

**Automação de Consultas em Fontes Oficiais**

| Item | Descrição |
|------|-----------|
| **Website** | https://infosimples.com |
| **Documentação** | https://infosimples.com/consultas/ |
| **Tipo** | API REST (JSON) |
| **Autenticação** | Token de API |

#### Serviços Disponíveis

**Receita Federal**
- CPF (dados cadastrais + situação + óbito)
- CNPJ (dados cadastrais + QSA)
- Simples Nacional
- IRPF (restituição)
- CND Federal (PGFN)

**Cartórios e Registros**
- Certidão de óbito
- Protestos
- Certidões negativas

**Tribunais**
- Processos judiciais (diversos tribunais)
- Certidões de distribuição

**Veículos**
- Consulta de placas
- Multas
- Débitos

#### Preços

**Tabela Base (por volume mensal):**

| Volume | Preço Base |
|--------|-----------|
| 1 - 500 | R$ 0,20 |
| 501 - 2.000 | R$ 0,15 |
| 2.001 - 5.000 | R$ 0,13 |
| 5.001 - 10.000 | R$ 0,11 |
| 10.001 - 50.000 | R$ 0,09 |
| 50.001 - 100.000 | R$ 0,07 |
| Acima de 100.000 | R$ 0,05 |

**Adicional por tipo de consulta:**
- CPF Receita Federal: +R$ 0,04
- CNPJ Receita Federal: +R$ 0,04
- Processos Judiciais: +R$ 0,04 a R$ 0,06

**Exemplo:** Consulta CPF = R$ 0,20 (base) + R$ 0,04 = **R$ 0,24**

**Mínimo mensal:** R$ 100,00
**Crédito inicial para testes:** R$ 100,00

#### Como Contratar
1. Cadastro em https://infosimples.com
2. Obter token de API no painel
3. Crédito inicial de R$ 100 para testes

#### Variáveis de Ambiente
```env
INFOSIMPLES_API_TOKEN=seu_token_aqui
```

#### Exemplo de Uso
```javascript
const url = `https://api.infosimples.com/api/v2/consultas/receita-federal/cpf?token=${TOKEN}&cpf=${cpf}&birthdate=${dataNascimento}`;
const response = await fetch(url);
const data = await response.json();
```

---

### 2.4 ESCAVADOR

**Plataforma de Dados Jurídicos**

| Item | Descrição |
|------|-----------|
| **Website** | https://www.escavador.com |
| **API v1 Docs** | https://api.escavador.com/v1/docs/ |
| **API v2 Docs** | https://api.escavador.com/v2/docs/ |
| **Suporte** | https://suporte-api.escavador.com |
| **Tipo** | API REST |
| **Autenticação** | Bearer Token |

#### Serviços Disponíveis

**API v1**
- Busca de processos
- Monitoramento de processos
- Busca de pessoas
- Busca de empresas
- Consulta em Diários Oficiais

**API v2 (mais detalhada)**
- Capa do processo (informações básicas)
- Movimentações do processo
- Documentos públicos do processo
- Atualização em tempo real no tribunal
- Busca por OAB
- Busca por CPF/CNPJ do envolvido

#### Preços (API v2)

| Serviço | Preço |
|---------|-------|
| Capa do processo | R$ 0,10 |
| Movimentações | R$ 0,10 |
| Documentos públicos | R$ 0,12 |
| Atualização no tribunal | R$ 0,15 |
| Atualização + documentos | R$ 0,20 |

**Modelo de cobrança inteligente:**
- Dentro de 24h para o mesmo processo, paga-se apenas o serviço mais caro
- Exemplo: Capa (R$ 0,10) → Atualização (R$ 0,15) = Total R$ 0,15 (não R$ 0,25)

#### Limites
- 500 requisições por minuto

#### Cobertura
- Todos os tribunais do Brasil
- Diários Oficiais de todas as esferas

#### Como Contratar
1. Cadastro em https://www.escavador.com
2. Acessar área de API
3. Gerar Bearer Token

#### Variáveis de Ambiente
```env
ESCAVADOR_BEARER_TOKEN=seu_token_aqui
```

#### Exemplo de Uso
```javascript
const response = await fetch('https://api.escavador.com/v2/processos/busca', {
  headers: {
    'Authorization': `Bearer ${ESCAVADOR_TOKEN}`,
    'Content-Type': 'application/json'
  },
  method: 'POST',
  body: JSON.stringify({ cpf: '12345678900' })
});
```

#### Funcionalidade Especial
- Acesso a autos de processos via certificado digital A1
- Permite automatizar download de documentos restritos

---

### 2.5 BIGDATACORP

**Plataforma de Enriquecimento de Dados**

| Item | Descrição |
|------|-----------|
| **Website** | https://bigdatacorp.com.br |
| **Documentação** | https://docs.bigdatacorp.com.br |
| **Tipo** | API REST |
| **Autenticação** | Token de API |

#### Serviços Disponíveis

**Pessoas (CPF)**
- Dados cadastrais completos
- Processos judiciais
- Endereços históricos
- Telefones e e-mails
- Vínculos empresariais
- Score de risco

**Empresas (CNPJ)**
- Dados cadastrais
- Quadro societário
- Processos judiciais
- Situação fiscal
- Endereços e contatos

#### Preços
- **Por consulta:** R$ 0,05
- **Novos usuários:** 500 consultas grátis

#### Como Contratar
1. Cadastro em https://bigdatacorp.com.br
2. 500 consultas grátis para teste
3. Recarga via cartão ou boleto

#### Variáveis de Ambiente
```env
BIGDATACORP_TOKEN=seu_token_aqui
```

---

### 2.6 CNPJa

**Consulta de CNPJ Especializada**

| Item | Descrição |
|------|-----------|
| **Website** | https://www.cnpja.com |
| **Documentação** | https://www.cnpja.com/docs |
| **Tipo** | API REST |
| **Autenticação** | API Key |

#### Serviços Disponíveis
- Dados cadastrais de CNPJ
- Quadro societário (QSA)
- CNAEs
- Situação cadastral
- Histórico de alterações

#### Variáveis de Ambiente
```env
CNPJA_API_KEY=sua_api_key
```

---

## 3. APIS GRATUITAS

### 3.1 PORTAL DA TRANSPARÊNCIA

**Controladoria-Geral da União (CGU)**

| Item | Descrição |
|------|-----------|
| **Website** | https://portaldatransparencia.gov.br |
| **Documentação** | https://portaldatransparencia.gov.br/api-de-dados |
| **Tipo** | API REST |
| **Autenticação** | API Key (header: chave-api-dados) |

#### Endpoints Disponíveis

**Benefícios Sociais**
- `auxilio-emergencial-por-cpf-ou-nis` - Auxílio Emergencial
- `novo-bolsa-familia-sacado-por-nis` - Bolsa Família
- `seguro-defeso-pescador-artesanal-por-cpf-ou-nis` - Seguro Defeso
- `bpc-por-nis` - BPC (Benefício de Prestação Continuada)

**Sanções**
- `ceis` - Cadastro de Empresas Inidôneas e Suspensas
- `cnep` - Cadastro Nacional de Empresas Punidas
- `cepim` - Cadastro de Entidades Privadas Sem Fins Lucrativos Impedidas
- `ceaf` - Cadastro de Expulsões da Administração Federal

**Servidores Públicos**
- `servidores` - Servidores federais ativos e inativos

**Licitações e Contratos**
- `contratos` - Contratos do Governo Federal
- `licitacoes` - Licitações

#### Limites
- 30 requisições por minuto (recomendado)
- Sem custo

#### Como Obter API Key
1. Acessar https://portaldatransparencia.gov.br/api-de-dados
2. Cadastrar e-mail
3. Receber chave por e-mail

#### Variáveis de Ambiente
```env
PORTAL_TRANSPARENCIA_API_KEY=sua_chave_aqui
```

---

### 3.2 BRASILAPI

**API Pública de Dados Brasileiros**

| Item | Descrição |
|------|-----------|
| **Website** | https://brasilapi.com.br |
| **Documentação** | https://brasilapi.com.br/docs |
| **Tipo** | API REST |
| **Autenticação** | Não requer |

#### Endpoints Disponíveis
- `/cnpj/v1/{cnpj}` - Dados de CNPJ
- `/cep/v1/{cep}` - Dados de CEP
- `/banks/v1` - Lista de bancos
- `/feriados/v1/{ano}` - Feriados nacionais
- `/ddd/v1/{ddd}` - Cidades por DDD

#### Limites
- Uso livre (fair use)
- Rate limiting em caso de abuso

#### Exemplo de Uso
```javascript
const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
const empresa = await response.json();
```

---

### 3.3 TSE - DADOS ABERTOS

**Tribunal Superior Eleitoral**

| Item | Descrição |
|------|-----------|
| **Portal** | https://dadosabertos.tse.jus.br |
| **DivulgaCand** | https://divulgacandcontas.tse.jus.br |
| **Tipo** | Arquivos CSV + API |
| **Autenticação** | Não requer |

#### Dados Disponíveis

**Candidaturas**
- Dados dos candidatos (nome, CPF, partido, cargo)
- Situação da candidatura
- Bens declarados
- Histórico eleitoral

**Receitas de Campanha**
- Doações recebidas
- CPF/CNPJ do doador
- Valores
- Doador originário

**Despesas de Campanha**
- Gastos contratados
- Gastos pagos
- Fornecedores

#### Arquivos por Estado
- Formato: `receitas_candidatos_2024_GO.csv`
- Encoding: Latin-1 (ISO-8859-1)
- Separador: `;`

#### Uso no Projeto
Os arquivos CSV são baixados e processados localmente em `dados-tse/`.

---

### 3.4 CGU - DADOS ABERTOS

**Bases de Sanções da CGU**

| Item | Descrição |
|------|-----------|
| **CEIS** | https://portaldatransparencia.gov.br/download-de-dados/ceis |
| **CNEP** | https://portaldatransparencia.gov.br/download-de-dados/cnep |
| **Tipo** | Arquivos CSV |
| **Autenticação** | Não requer |

#### Dados Disponíveis

**CEIS (Empresas Inidôneas)**
- Razão social / Nome
- CPF/CNPJ
- Tipo de sanção
- Órgão sancionador
- Data início/fim

**CNEP (Empresas Punidas - Lei Anticorrupção)**
- Dados similares ao CEIS
- Sanções da Lei 12.846/2013

#### Uso no Projeto
Arquivos baixados em `dados-cgu/` e processados localmente.

---

### 3.5 OFAC SDN

**Office of Foreign Assets Control (EUA)**

| Item | Descrição |
|------|-----------|
| **Website** | https://sanctionslist.ofac.treas.gov |
| **Lista SDN** | https://www.treasury.gov/ofac/downloads/sdn.xml |
| **Tipo** | Arquivo XML |
| **Autenticação** | Não requer |

#### Dados Disponíveis
- Lista de pessoas e entidades sancionadas pelos EUA
- Nomes e aliases
- Datas de nascimento
- Nacionalidades
- Documentos de identificação

#### Uso
- Download do XML
- Cache local (24h)
- Comparação por similaridade de nomes

---

### 3.6 DATAJUD CNJ

**API Pública do Conselho Nacional de Justiça**

| Item | Descrição |
|------|-----------|
| **Website** | https://datajud-wiki.cnj.jus.br/api-publica |
| **Tipo** | API REST |
| **Autenticação** | API Key (cadastro gratuito) |

#### Dados Disponíveis
- Processos judiciais de todos os tribunais
- Movimentações
- Classes e assuntos processuais
- Estatísticas

---

## 4. COMPARATIVO DE FUNCIONALIDADES

### Consulta de CPF

| API | Dados Básicos | Óbito | Score | Processos | Preço |
|-----|--------------|-------|-------|-----------|-------|
| SERPRO | ✅ Oficial | ❌ | ❌ | ❌ | R$ 0,66 |
| Serasa | ✅ | ❌ | ✅ | ✅ | Contrato |
| Infosimples | ✅ | ✅ | ❌ | ✅ | R$ 0,24 |
| BigDataCorp | ✅ | ❌ | ✅ | ✅ | R$ 0,05 |

### Consulta de CNPJ

| API | Dados Básicos | QSA | Situação | Preço |
|-----|--------------|-----|----------|-------|
| SERPRO | ✅ Oficial | ✅ | ✅ | R$ 0,66 |
| BrasilAPI | ✅ | ✅ | ✅ | Grátis |
| Infosimples | ✅ | ✅ | ✅ | R$ 0,24 |
| CNPJa | ✅ | ✅ | ✅ | Pago |

### Processos Judiciais

| API | Cobertura | Movimentações | Documentos | Preço |
|-----|-----------|---------------|------------|-------|
| Escavador | Nacional | ✅ | ✅ | R$ 0,10-0,20 |
| BigDataCorp | Nacional | ✅ | ❌ | R$ 0,05 |
| Infosimples | Parcial | ✅ | ❌ | R$ 0,24+ |
| DataJud | Nacional | ✅ | ❌ | Grátis |

### Sanções e Restrições

| API | CEIS/CNEP | OFAC | Serasa | PEP |
|-----|-----------|------|--------|-----|
| Portal Transparência | ✅ | ❌ | ❌ | ✅ |
| OFAC | ❌ | ✅ | ❌ | ❌ |
| Serasa | ❌ | ❌ | ✅ | ❌ |

---

## 5. RECOMENDAÇÕES POR CASO DE USO

### Due Diligence Completa (Pessoa Física)

1. **Infosimples** - CPF + Óbito (R$ 0,24)
2. **Portal Transparência** - Benefícios + Sanções (Grátis)
3. **Escavador** - Processos judiciais (R$ 0,10-0,20)
4. **TSE** - Candidaturas + Doações (Grátis)
5. **OFAC** - Sanções internacionais (Grátis)

**Custo estimado:** R$ 0,34 - R$ 0,44 por pessoa

### Due Diligence Completa (Pessoa Jurídica)

1. **BrasilAPI** - CNPJ básico (Grátis)
2. **SERPRO** - CNPJ oficial com QSA (R$ 0,66)
3. **Portal Transparência** - CEIS/CNEP (Grátis)
4. **Escavador** - Processos (R$ 0,10-0,20)

**Custo estimado:** R$ 0,76 - R$ 0,86 por empresa

### Verificação Rápida (Alto Volume)

1. **BigDataCorp** - Dados completos (R$ 0,05)
2. **Portal Transparência** - Sanções (Grátis)

**Custo estimado:** R$ 0,05 por consulta

### Análise de Crédito

1. **Serasa** - Score + Negativações (Contrato)
2. **BigDataCorp** - Complemento (R$ 0,05)

---

## 6. CONFIGURAÇÃO NO PROJETO

### Arquivo .env

```env
# ================================================================================
#                         APIs DE CONSULTA - INVESTIGAREE
# ================================================================================

# ------------------------------------------------------------------------------
# SERPRO - Consulta CPF/CNPJ Oficial (PAGA)
# https://loja.serpro.gov.br
# ------------------------------------------------------------------------------
SERPRO_CONSUMER_KEY=
SERPRO_CONSUMER_SECRET=

# ------------------------------------------------------------------------------
# SERASA EXPERIAN - Score e Negativações (PAGA)
# https://www.serasaexperian.com.br
# ------------------------------------------------------------------------------
SERASA_LOGIN=
SERASA_SENHA=
SERASA_CODIGO_CLIENTE=

# ------------------------------------------------------------------------------
# INFOSIMPLES - Consultas Diversas (PAGA)
# https://infosimples.com
# R$ 0,20-0,24 por consulta | Mínimo R$ 100/mês
# ------------------------------------------------------------------------------
INFOSIMPLES_API_TOKEN=

# ------------------------------------------------------------------------------
# ESCAVADOR - Processos Judiciais (PAGA)
# https://api.escavador.com
# R$ 0,10-0,20 por processo
# ------------------------------------------------------------------------------
ESCAVADOR_BEARER_TOKEN=

# ------------------------------------------------------------------------------
# BIGDATACORP - Enriquecimento de Dados (PAGA)
# https://bigdatacorp.com.br
# R$ 0,05 por consulta | 500 grátis para novos usuários
# ------------------------------------------------------------------------------
BIGDATACORP_TOKEN=

# ------------------------------------------------------------------------------
# CNPJa - Consulta CNPJ (PAGA)
# https://www.cnpja.com
# ------------------------------------------------------------------------------
CNPJA_API_KEY=

# ------------------------------------------------------------------------------
# PORTAL DA TRANSPARÊNCIA - Dados Abertos (GRATUITO)
# https://portaldatransparencia.gov.br/api-de-dados
# ------------------------------------------------------------------------------
PORTAL_TRANSPARENCIA_API_KEY=

# ------------------------------------------------------------------------------
# DATAJUD CNJ - Processos Judiciais (GRATUITO)
# https://datajud-wiki.cnj.jus.br/api-publica
# ------------------------------------------------------------------------------
DATAJUD_API_KEY=
```

### Scripts Disponíveis

| Script | API Utilizada | Função |
|--------|--------------|--------|
| `verificar-obito.js` | Infosimples | Consulta CPF + óbito |
| `consultar-beneficios-sociais.js` | Portal Transparência | Auxílio Emergencial, Seguro Defeso |
| `consultar-ofac-pep.js` | OFAC | Lista de sanções internacionais |
| `consultar-cnpjs-receita.js` | BrasilAPI | Dados de CNPJ |
| `verificar-candidaturas-tse.js` | TSE (local) | Candidaturas eleitorais |
| `verificar-doacoes-tse.js` | TSE (local) | Doações de campanha |
| `verificar-sancoes-cgu.js` | CGU (local) | CEIS/CNEP |
| `verificar-processos-bigdatacorp.js` | BigDataCorp | Processos judiciais |

---

## 7. NOVAS APIs DESCOBERTAS (30/11/2025)

### 7.1 SINTEGRA WS

**API de Consulta CPF/CNPJ com 300 consultas grátis/mês**

| Item | Descrição |
|------|-----------|
| **Website** | https://www.sintegraws.com.br |
| **Documentação** | https://www.sintegraws.com.br/api/documentacao-api-receita-federal-cpf.php |
| **Tipo** | API REST |
| **Autenticação** | Token (gerado após cadastro) |
| **Consultas grátis** | 300/mês |

#### Dados Retornados (CPF)

| Campo | Descrição |
|-------|-----------|
| `nome` | Nome completo |
| `data_nascimento` | Data de nascimento (dd/mm/aaaa) |
| `nome_mae` | Nome da mãe |
| `situacao_cadastral` | Regular, Suspensa, **Titular Falecido**, Cancelada, etc |
| `ano_obito` | Ano do óbito (se falecido) |
| `idade` | Idade calculada |
| `sexo` | Gênero |
| `qsa` | Empresas onde é sócio (CNPJ, razão social, qualificação) |

#### Endpoint
```
GET https://www.sintegraws.com.br/api/v1/execute-api.php
    ?token={token}
    &cpf={cpf}
    &data-nascimento={ddmmaaaa}
    &plugin=CPF
```

#### Códigos de Retorno
- `0` = Sucesso
- `1` = CPF não encontrado
- `2` = Formato CPF inválido
- `3` = Token inválido
- `5` = Créditos esgotados
- `9` = Data nascimento não confere

#### Limitação
⚠️ **Requer data de nascimento** para consultar CPF

---

### 7.2 CPFCNPJ.COM.BR

**API de Consulta CPF sem precisar de data de nascimento**

| Item | Descrição |
|------|-----------|
| **Website** | https://www.cpfcnpj.com.br |
| **Tipo** | API REST |
| **Autenticação** | Token |
| **Trial** | Gratuito (sem cartão) |

#### Dados Retornados
- Nome completo
- **Data de nascimento** (sem precisar informar!)
- Nome da mãe
- Situação cadastral
- Gênero

#### Vantagem Principal
Permite obter a **data de nascimento** apenas com o CPF, possibilitando depois consultar óbito em outras APIs mais baratas.

---

### 7.3 CONSULTA.GURU

**Consulta gratuita de CPF/CNPJ**

| Item | Descrição |
|------|-----------|
| **Website** | https://consulta.guru |
| **API Docs** | https://consulta.guru/docs |
| **Tipo** | API REST |
| **Custo** | Gratuito (com limites) |

#### Dados Retornados
- Nome
- Data de nascimento
- Situação cadastral

---

### 7.4 CNF BRASIL

**Cadastro Nacional de Falecidos**

| Item | Descrição |
|------|-----------|
| **Website** | https://www.falecidosnobrasil.org.br |
| **Tipo** | Consulta manual (web) |
| **Custo** | Gratuito |

#### O que retorna
- Nome do cartório que registrou o óbito
- Dados do registro (livro, folha, termo)
- Contato do cartório (email, telefone)

#### Limitação
- Consulta manual (não é API)
- Não emite certidão de óbito

---

### 7.5 SITUACAO-CADASTRAL.COM

**Consulta gratuita de situação cadastral**

| Item | Descrição |
|------|-----------|
| **Website** | https://www.situacao-cadastral.com |
| **Tipo** | Consulta web (scraping Receita) |
| **Custo** | Gratuito |

#### Dados Retornados
- Situação cadastral (Regular, Suspensa, Titular Falecido, etc)

#### Limitação
- Requer data de nascimento
- Consulta manual

---

### 7.6 COMPARATIVO ATUALIZADO

| API | Grátis/mês | Precisa Data Nasc? | Retorna Óbito? | Retorna Data Nasc? |
|-----|------------|-------------------|----------------|-------------------|
| **SERPRO** | 0 | ❌ Não | ✅ Sim | ✅ Sim |
| **SintegraWS** | 300 | ✅ Sim | ✅ Sim | ✅ Sim |
| **Infosimples** | 0 | ✅ Sim | ✅ Sim | ❌ Não |
| **BigDataCorp** | 500 | ❌ Não | ✅ Sim | ✅ Sim |
| **cpfcnpj.com.br** | Trial | ❌ Não | ❌ Não | ✅ Sim |
| **CNF Brasil** | Ilimitado | ❌ Não | ✅ Sim | ❌ Não |

---

## ANEXO A - LINKS ÚTEIS

### Documentação Oficial
- SERPRO: https://apicenter.estaleiro.serpro.gov.br/documentacao/
- Serasa: https://www.serasaexperian.com.br/portal-integracao/
- Infosimples: https://infosimples.com/consultas/
- Escavador: https://api.escavador.com/v2/docs/
- Portal Transparência: https://portaldatransparencia.gov.br/api-de-dados
- BrasilAPI: https://brasilapi.com.br/docs
- DataJud: https://datajud-wiki.cnj.jus.br/api-publica

### Suporte
- SERPRO: css.serpro@serpro.gov.br | 0800 728 2323
- Escavador: https://suporte-api.escavador.com
- Infosimples: suporte@infosimples.com

---

---

## 8. EXEMPLOS DE CODIGO

### JavaScript/TypeScript
Os exemplos em JavaScript estao nas pastas de cada API:
- `APIs/INFOSIMPLES/exemplo-consulta-cpf-obito.js`
- `APIs/PORTAL_TRANSPARENCIA/exemplo-beneficios-sociais.js`
- `APIs/TSE/exemplo-candidaturas.js`
- `APIs/CGU/exemplo-sancoes-ceis-cnep.js`

### Python
Exemplos completos em Python estao em `APIs/exemplos_python/`:
- `consultas_apis.py` - Classes para todas as APIs
- `processamento_lote.py` - Processamento em batch
- `requirements.txt` - Dependencias

Ver [exemplos_python/README.md](./exemplos_python/README.md) para instrucoes.

---

**Documento mantido por:** InvestigaRee
**Ultima atualizacao:** 30/11/2025
