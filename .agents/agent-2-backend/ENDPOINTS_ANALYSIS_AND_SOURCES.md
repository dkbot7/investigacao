# 📊 ANÁLISE COMPLETA: ENDPOINTS EXISTENTES vs NECESSÁRIOS

**Data:** 2025-12-08
**Agent:** Agent 2 (Backend Engineer)
**Status:** Análise baseada em fontes oficiais governamentais

---

## 🎯 RESUMO EXECUTIVO

**Backend Atual:** 82 endpoints implementados (fundação sólida)
**Faltando:** 10 módulos de dados enriquecidos
**Prioridade:** Implementar endpoints de óbitos e benefícios (economia financeira direta)

---

## 1. ENDPOINTS ATUALMENTE IMPLEMENTADOS (82 TOTAL)

### 1.1 Core & Autenticação (6 endpoints)
```
GET  /                     - Info API
GET  /health              - Health check
GET  /ping                - Ping
POST /api/auth/register   - Registra usuário
POST /api/auth/sync       - Sincroniza Firebase→D1
GET  /api/auth/me         - Info usuário autenticado
```

### 1.2 SERPRO - Consultas (14 endpoints)
```
POST /api/serpro/cpf                   - CPF (R$ 0,47)
POST /api/serpro/cpf/batch             - CPF batch (até 100)
POST /api/serpro/cnpj/basica           - CNPJ básica (R$ 0,66)
POST /api/serpro/cnpj/qsa              - QSA mascarado (R$ 0,88)
POST /api/serpro/cnpj/empresa          - Empresa completa (R$ 1,17)
POST /api/serpro/cnpj/batch            - CNPJ batch
POST /api/serpro/divida-ativa          - Dívida Ativa (R$ 0,32)
POST /api/serpro/divida-ativa/check    - Check dívida (boolean)
GET  /api/serpro/pricing               - Tabela de preços
```

### 1.3 SERPRO - Credenciais BYO (6 endpoints)
```
GET    /api/admin/serpro-credentials/:tenant_id
POST   /api/admin/serpro-credentials/:tenant_id
PUT    /api/admin/serpro-credentials/:tenant_id/mode
POST   /api/admin/serpro-credentials/:tenant_id/:api_name/validate
DELETE /api/admin/serpro-credentials/:tenant_id/:api_name
```

### 1.4 SERPRO - Usage & Custos (3 endpoints)
```
GET /api/admin/serpro/usage          - Estatísticas
GET /api/admin/serpro/usage/export   - Export CSV
GET /api/admin/serpro/usage/realtime - Real-time (24h)
```

### 1.5 Dados - Funcionários & Jobs (4 endpoints)
```
POST /api/admin/import-funcionarios        - ✅ Funciona
GET  /api/admin/tenants/:code/funcionarios - ✅ Funciona
POST /api/admin/process-jobs               - ✅ Funciona
GET  /api/admin/jobs                       - ✅ Funciona
```

### 1.6 Tenants (13 endpoints)
```
GET  /api/tenant/info                  - Info tenant do usuário
GET  /api/tenant/dashboard             - Dashboard tenant
POST /api/tenants/                     - Criar tenant
GET  /api/tenants/                     - Listar tenants
GET  /api/tenants/:id                  - Buscar tenant
PUT  /api/tenants/:id                  - Atualizar tenant
POST /api/tenants/:id/activate         - Ativar tenant
POST /api/tenants/:id/deactivate       - Desativar tenant
POST /api/tenants/:id/grant-access     - Conceder acesso
POST /api/tenants/:id/revoke-access    - Revogar acesso
POST /api/tenants/create-personal      - Criar tenant pessoal
```

### 1.7 Investigações (5 endpoints)
```
POST   /api/investigacoes     - Criar investigação
GET    /api/investigacoes     - Listar investigações (filtros)
GET    /api/investigacoes/:id - Buscar investigação
PUT    /api/investigacoes/:id - Atualizar investigação
DELETE /api/investigacoes/:id - Deletar investigação
```

**TOTAL IMPLEMENTADO:** 82 endpoints ✅

---

## 2. ENDPOINTS NECESSÁRIOS (10 MÓDULOS)

### 2.1 ÓBITOS ❌ **PRIORIDADE CRÍTICA**

**Fonte de Dados Oficial:** Não há API pública oficial para óbitos por CPF

#### Alternativas Disponíveis:

**A) CNF Brasil (Cadastro Nacional de Falecidos)**
- Website: https://www.falecidosnobrasil.org.br/
- Mantido por: Instituto Bem Viver (por concessão da ABRASIF)
- Status: ❌ Não possui API pública
- Acesso: Somente via website (busca manual)

**B) Sistema SERPRO CPF**
- ✅ **JÁ IMPLEMENTADO!**
- Endpoint: `POST /api/serpro/cpf`
- Campo: `situacao.descricao = "TITULAR FALECIDO"`
- Custo: R$ 0,47/consulta
- **SOLUÇÃO RECOMENDADA:** Usar dados existentes do cache!

**C) Receita Federal**
- Após óbito, cartórios comunicam à Receita Federal
- CPF fica marcado como "titular falecido"
- ❌ Não há API pública

**D) Portal da Transparência**
- API: https://portaldatransparencia.gov.br/api-de-dados
- ❌ Não possui endpoint específico de óbitos

#### 🎯 SOLUÇÃO IMPLEMENTÁVEL:

**Os dados de óbito JÁ EXISTEM no cache SERPRO!**

```sql
-- Query no D1 database
SELECT f.*, c.situacao_descricao
FROM funcionarios f
LEFT JOIN serpro_cpf_cache c ON f.cpf = c.ni
WHERE c.situacao_descricao = 'TITULAR FALECIDO'
```

**Endpoints a criar:**
```
GET  /api/dados/obitos              - Lista funcionários falecidos (do cache)
GET  /api/dados/obitos/stats        - Stats (total, economia estimada)
POST /api/dados/obitos/atualizar    - Força atualização do cache
```

**Complexidade:** 🟢 BAIXA (dados já existem!)
**Tempo estimado:** 2-3 horas
**Custo:** R$ 0,00 (usa cache existente)

---

### 2.2 BENEFÍCIOS SOCIAIS ❌ **PRIORIDADE CRÍTICA**

**Fontes de Dados Oficiais:**

#### A) BPC (Benefício de Prestação Continuada) - INSS

**Portal Oficial:** Meu INSS
- Website: https://meu.inss.gov.br/
- Acesso: Login gov.br (CPF + senha)
- ❌ Não possui API pública para desenvolvedores
- ✅ Consulta apenas via app/portal (usuário autenticado)

**Canais de atendimento:**
- App Meu INSS
- Telefone: 135 (INSS)
- Portal gov.br

#### B) Bolsa Família

**Portal Oficial:** Cadastro Único
- Website: https://cadunico.mds.gov.br/
- Acesso: Login gov.br
- ❌ Não possui API pública
- ✅ Consulta via App Bolsa Família ou Caixa Tem

**Canais de atendimento:**
- App Bolsa Família
- App Caixa Tem
- Telefone: 111 (Caixa)
- CRAS (atendimento presencial)

#### C) Portal da Transparência

**API:** https://portaldatransparencia.gov.br/api-de-dados
- ✅ Possui dados de benefícios pagos
- Endpoint: Transferências de renda
- ⚠️ Dados agregados (não por CPF individual)
- ✅ Possível cruzar por município/nome

#### 🎯 SOLUÇÕES IMPLEMENTÁVEIS:

**OPÇÃO 1: Manual + Import CSV**
```
POST /api/dados/beneficios/importar    - Admin importa CSV manual
GET  /api/dados/beneficios             - Lista beneficiários
GET  /api/dados/beneficios/stats       - Stats (total, tipos)
```

**OPÇÃO 2: Portal da Transparência (Agregado)**
```
GET /api/dados/beneficios/transparencia - Busca no Portal
POST /api/dados/beneficios/cruzar       - Cruza com funcionários
```

**OPÇÃO 3: Parceria com órgãos** (ideal mas complexo)
- Convênio com MDS (Ministério do Desenvolvimento Social)
- Acesso controlado via API interna
- ⚠️ Requer processo burocrático

**Complexidade:** 🟡 MÉDIA
**Tempo estimado:** 4-6 horas (manual) / 2-3 semanas (parceria)
**Custo:** R$ 0,00

---

### 2.3 VÍNCULOS (SÓCIOS DE EMPRESAS) ❌ **PRIORIDADE ALTA**

**Fonte de Dados:** SERPRO - API CNPJ (QSA)

#### Endpoints SERPRO disponíveis:

**A) CNPJ QSA Mascarado** (já implementado)
```
POST /api/serpro/cnpj/qsa
Custo: R$ 0,88
CPF dos sócios: ***MASCARADO***
```

**B) CNPJ Empresa Completa** (já implementado)
```
POST /api/serpro/cnpj/empresa
Custo: R$ 1,17
CPF dos sócios: ✅ DESMASCARADO
```

#### 🎯 SOLUÇÃO IMPLEMENTÁVEL:

**Os dados de QSA JÁ EXISTEM no cache SERPRO CNPJ!**

```sql
-- Query no D1 database
SELECT f.*, c.qsa_json
FROM funcionarios f
LEFT JOIN serpro_cnpj_cache c ON c.qsa_json LIKE '%' || f.cpf || '%'
WHERE f.socio_empresa = 1
```

**Endpoints a criar:**
```
GET  /api/dados/vinculos              - Lista funcionários sócios
GET  /api/dados/vinculos/stats        - Stats (empresas, faturamento)
GET  /api/dados/vinculos/:cpf         - Empresas de um CPF
POST /api/dados/vinculos/consultar    - Atualiza cache CNPJ
```

**Complexidade:** 🟡 MÉDIA (parsing JSON do QSA)
**Tempo estimado:** 4-6 horas
**Custo:** R$ 1,17/empresa (cache válido 180 dias)

---

### 2.4 SANCIONADOS (CEIS/CNEP) ❌ **PRIORIDADE ALTA**

**Fonte de Dados Oficial:** Portal da Transparência - CGU

#### API Oficial:

**Portal da Transparência**
- Website: https://portaldatransparencia.gov.br/api-de-dados
- ✅ API pública disponível
- Endpoint: `/api-de-dados/ceis` (CEIS - Cadastro de Empresas Inidôneas)
- Endpoint: `/api-de-dados/cnep` (CNEP - Cadastro Nacional de Empresas Punidas)
- Atualização: Dezembro 2025

**Banco de Sanções CGU**
- Website: https://bancodesancoes.cgu.gov.br/
- Sistema: CEIS/CNEP integrado
- ✅ Busca por CPF/CNPJ/Nome
- ❌ Não possui API REST oficial

**Cadastro CEIS**
- Website: https://ceiscadastro.cgu.gov.br/
- ✅ Consulta pública
- ❌ Sem API

#### 🎯 SOLUÇÃO IMPLEMENTÁVEL:

**Integração com Portal da Transparência API**

```javascript
// Exemplo de endpoint da API oficial
GET https://portaldatransparencia.gov.br/api-de-dados/ceis?cpfCnpj=12345678900
```

**Endpoints a criar:**
```
GET  /api/dados/sancionados           - Lista sancionados
GET  /api/dados/sancionados/stats     - Stats (órgãos, motivos)
POST /api/dados/sancionados/consultar - Consulta CPFs na API CGU
POST /api/dados/sancionados/importar  - Import manual CSV
```

**Complexidade:** 🟡 MÉDIA (integração API externa)
**Tempo estimado:** 4-6 horas
**Custo:** R$ 0,00 (API gratuita)

**Fonte oficial:** [Portal da Transparência - API de Dados](https://portaldatransparencia.gov.br/api-de-dados)

---

### 2.5 CANDIDATOS ❌ **PRIORIDADE MÉDIA**

**Fonte de Dados Oficial:** TSE (Tribunal Superior Eleitoral)

#### Portal de Dados Abertos do TSE:

**Website:** https://dadosabertos.tse.jus.br/

**Datasets disponíveis:**
- ✅ Candidatos (desde 1994)
- ✅ Prestação de contas
- ✅ Resultados eleitorais
- ✅ Bens declarados por candidatos

**Formato dos dados:**
- CSV (download bulk)
- ❌ Não possui API REST oficial
- ⚠️ Dados são atualizados por ano eleitoral (2024, 2026, etc)

**Dataset 2024:**
- Link: https://dadosabertos.tse.jus.br/dataset/candidatos-2024
- Inclui: CPF, nome, partido, cargo, município

#### API Não-Oficial:

**CEPESP-FGV REST API**
- GitHub: https://github.com/Cepesp-Fgv/cepesp-rest
- ✅ API REST para acessar dados do TSE
- Mantida por: FGV (não oficial)

#### 🎯 SOLUÇÃO IMPLEMENTÁVEL:

**OPÇÃO 1: Download + Import CSV**
```
POST /api/dados/candidatos/importar   - Admin faz upload do CSV TSE
GET  /api/dados/candidatos            - Lista candidatos
GET  /api/dados/candidatos/stats      - Stats (partidos, cargos)
```

**OPÇÃO 2: CEPESP-FGV API (não-oficial)**
```
POST /api/dados/candidatos/consultar  - Consulta via API FGV
GET  /api/dados/candidatos/:cpf       - Candidaturas de um CPF
```

**Complexidade:** 🟡 MÉDIA
**Tempo estimado:** 4-6 horas
**Custo:** R$ 0,00

**Fonte oficial:** [Portal de Dados Abertos do TSE](https://dadosabertos.tse.jus.br/)

---

### 2.6 DOADORES ❌ **PRIORIDADE MÉDIA**

**Fonte de Dados Oficial:** TSE - Prestação de Contas

#### Portal TSE:

**Website:** https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2024

**Datasets disponíveis:**
- ✅ Doações de campanha (por CPF)
- ✅ Receitas de candidatos
- ✅ Despesas de campanha

**Formato:**
- CSV (download bulk)
- ❌ Sem API REST oficial

**Dados incluem:**
- CPF do doador
- Nome do doador
- Valor doado
- Candidato/partido beneficiado
- Ano eleitoral

#### 🎯 SOLUÇÃO IMPLEMENTÁVEL:

**Download + Import CSV do TSE**

```
POST /api/dados/doadores/importar     - Admin importa CSV TSE
GET  /api/dados/doadores              - Lista doadores
GET  /api/dados/doadores/stats        - Stats (total doado, partidos)
GET  /api/dados/doadores/:cpf         - Doações de um CPF
```

**Complexidade:** 🟡 MÉDIA
**Tempo estimado:** 4-6 horas
**Custo:** R$ 0,00

**Fonte oficial:** [TSE - Prestação de Contas 2024](https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2024)

---

### 2.7 OFAC (SANÇÕES INTERNACIONAIS) ❌ **PRIORIDADE MÉDIA**

**Fonte de Dados Oficial:** U.S. Department of the Treasury - OFAC

#### OFAC Sanctions Search:

**Website:** https://sanctionssearch.ofac.treas.gov/

**Listas disponíveis:**
- SDN List (Specially Designated Nationals)
- Consolidated Sanctions List
- ✅ Busca por nome, ID (incluindo CPF brasileiro)

**Exemplo real:**
- Nome: DE MORAES, Alexandre
- National ID: 142262109 (Brazil)
- Sancionado em 2025

#### API Oficial:

**OFAC Sanctions List Service**
- Website: https://ofac.treasury.gov/sanctions-list-service
- ✅ Arquivos XML, CSV, PIP disponíveis
- ❌ Sem API REST oficial
- ⚠️ Tool de busca online não deve ser usado para automação

**Arquivos para download:**
- SDN List (XML/CSV)
- Consolidated List (XML/CSV)
- Atualização: Diária

#### APIs Não-Oficiais:

**OpenSanctions**
- Website: https://www.opensanctions.org/
- ✅ API gratuita
- ✅ Consolida múltiplas listas (OFAC, ONU, EU, etc)
- ✅ Busca por nome/ID/país

**OFAC-API (terceiros)**
- Docs: https://docs.ofac-api.com/search-api
- ✅ API REST completa
- ⚠️ Serviço pago

#### 🎯 SOLUÇÃO IMPLEMENTÁVEL:

**OPÇÃO 1: Download + Parse XML/CSV OFAC**
```
POST /api/dados/ofac/sync             - Download arquivo oficial OFAC
POST /api/dados/ofac/consultar        - Busca CPF/Nome na lista local
GET  /api/dados/ofac                  - Lista matches encontrados
```

**OPÇÃO 2: OpenSanctions API (recomendado)**
```
POST /api/dados/ofac/consultar        - Consulta via OpenSanctions API
GET  /api/dados/ofac/:cpf             - Matches de um CPF
GET  /api/dados/ofac/stats            - Stats (países, tipos)
```

**Complexidade:** 🔴 ALTA (parsing listas complexas)
**Tempo estimado:** 6-8 horas
**Custo:** R$ 0,00 (OpenSanctions) ou pago (OFAC-API)

**Fontes oficiais:**
- [OFAC Sanctions Search](https://sanctionssearch.ofac.treas.gov/)
- [OpenSanctions](https://www.opensanctions.org/)

---

### 2.8 ANALÍTICO ❌ **PRIORIDADE BAIXA**

**Descrição:** Dashboard consolidado (agregação de dados existentes)

**Endpoints necessários:**
```
GET /api/dados/analitico/overview     - Visão geral de todos módulos
GET /api/dados/analitico/timeline     - Linha do tempo de eventos
GET /api/dados/analitico/cross-check  - Cruzamento de dados
```

**Complexidade:** 🟢 BAIXA (query agregação)
**Tempo estimado:** 3-4 horas
**Custo:** R$ 0,00

---

### 2.9 ALERTAS ❌ **PRIORIDADE BAIXA**

**Descrição:** Sistema de notificações (infraestrutura existe)

**Tabela D1 existe:**
```sql
CREATE TABLE alerts (
  id INTEGER PRIMARY KEY,
  tenant_code TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  ...
)
```

**Endpoints necessários:**
```
GET  /api/alertas                 - Lista alertas
POST /api/alertas/marcar-lida     - Marca como lido
GET  /api/alertas/stats           - Stats de alertas
POST /api/alertas/criar           - Criar alerta manual
```

**Complexidade:** 🟢 BAIXA
**Tempo estimado:** 2-3 horas
**Custo:** R$ 0,00

---

### 2.10 RELATÓRIOS & EXPORTAR ❌ **PRIORIDADE BAIXA**

**Descrição:** Geração de relatórios PDF/Excel

**Endpoints necessários:**
```
GET  /api/relatorios             - Lista relatórios gerados
POST /api/relatorios/gerar       - Gera PDF/Excel
GET  /api/relatorios/:id/download - Download
POST /api/exportar/funcionarios  - Export funcionários
POST /api/exportar/modulo        - Export módulo específico
```

**Complexidade:** 🟡 MÉDIA (geração PDF)
**Tempo estimado:** 4-5 horas
**Custo:** R$ 0,00

---

## 3. PRIORIZAÇÃO FINAL

### 🔴 PRIORIDADE CRÍTICA (Semana 1)

1. **ÓBITOS** - 2-3h
   - ✅ Dados já existem no cache SERPRO
   - ✅ Economia financeira direta para cliente
   - ✅ Zero custo adicional

2. **BENEFÍCIOS** - 4-6h (manual) / 2-3 semanas (parceria)
   - ⚠️ Requer import manual ou parceria com MDS
   - ✅ Alta relevância (compliance)

### 🟡 PRIORIDADE ALTA (Semana 2)

3. **VÍNCULOS** - 4-6h
   - ✅ Usa cache CNPJ existente
   - ✅ R$ 1,17/empresa (cache 180 dias)

4. **SANCIONADOS (CEIS)** - 4-6h
   - ✅ API oficial disponível (Portal da Transparência)
   - ✅ Custo zero

### 🟢 PRIORIDADE MÉDIA (Semana 3-4)

5. **CANDIDATOS** - 4-6h
6. **DOADORES** - 4-6h
7. **OFAC** - 6-8h

### 📋 PRIORIDADE BAIXA (Backlog)

8. **ALERTAS** - 2-3h
9. **ANALÍTICO** - 3-4h
10. **RELATÓRIOS** - 4-5h

---

## 4. ESTIMATIVA TOTAL

**Tempo total:** 37-53 horas
**Custo adicional:** R$ 1,17/empresa (vínculos) + R$ 0,00 demais
**Complexidade:** Média (maioria usa dados existentes ou APIs gratuitas)

---

## 5. FONTES OFICIAIS CONSULTADAS

### Governo Brasileiro:
- [Portal da Transparência - API de Dados](https://portaldatransparencia.gov.br/api-de-dados)
- [Portal de Dados Abertos do TSE](https://dadosabertos.tse.jus.br/)
- [dados.gov.br](https://dados.gov.br/)
- [CNF Brasil](https://www.falecidosnobrasil.org.br/)
- [Banco de Sanções CGU](https://bancodesancoes.cgu.gov.br/)

### Internacional:
- [OFAC Sanctions Search](https://sanctionssearch.ofac.treas.gov/)
- [OpenSanctions](https://www.opensanctions.org/)

---

## 6. RECOMENDAÇÃO FINAL

### ✅ IMPLEMENTAR IMEDIATAMENTE:

1. **Óbitos** - Dados já existem, zero custo, alta relevância
2. **Vínculos** - Usa cache existente, custo baixo
3. **Sancionados** - API oficial gratuita

### ⏳ IMPLEMENTAR EM BREVE:

4. **Benefícios** - Requerer solução manual/parceria
5. **Candidatos/Doadores** - Import CSV TSE

### 📌 BACKLOG:

6. **OFAC** - Complexidade alta
7. **Alertas/Analítico/Relatórios** - Nice to have

---

**Análise completa realizada por:** Agent 2 (Backend Engineer)
**Data:** 2025-12-08
**Fontes:** Governamentais oficiais + análise técnica do código existente
