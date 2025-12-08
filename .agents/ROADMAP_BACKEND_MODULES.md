# 🚀 ROADMAP: IMPLEMENTAÇÃO DE MÓDULOS DO BACKEND

**Projeto:** Investigaree - Sistema de Análise de Dados Governamentais
**Cliente:** CLIENTE_01 (e futuros clientes)
**Data:** 2025-12-08
**Responsável:** Agent 2 (Backend Engineer)

---

## 📊 SITUAÇÃO ATUAL

### ✅ **BACKEND: 70% COMPLETO**

**82 endpoints implementados e funcionando:**
- ✅ Sistema de autenticação (Firebase)
- ✅ Multi-tenancy completo
- ✅ 9 APIs SERPRO integradas (CPF, CNPJ, Dívida Ativa, etc)
- ✅ Sistema de cache D1 (economia R$ 14.690/mês)
- ✅ Background jobs e processamento em lote
- ✅ Sistema BYO de credenciais SERPRO
- ✅ Cost tracking e analytics
- ✅ CRUD de investigações

### ❌ **FALTANDO: 10 MÓDULOS DE DADOS**

**Páginas do frontend sem backend:**
1. Óbitos (funcionários falecidos)
2. Vínculos (sócios de empresas)
3. Benefícios sociais (BPC, Bolsa Família)
4. Sancionados (CEIS/CNEP)
5. Candidatos políticos
6. Doadores de campanha
7. OFAC (sanções internacionais)
8. Alertas automáticos
9. Dashboard analítico
10. Geração de relatórios

---

## 🎯 OBJETIVO

**Implementar os 10 módulos faltantes** para que o dashboard fique 100% funcional, permitindo aos clientes:

- Detectar funcionários falecidos (economia financeira)
- Identificar conflitos de interesse (sócios de empresas)
- Verificar acúmulo irregular de renda (benefícios)
- Compliance (sanções CEIS, OFAC)
- Transparência política (candidatos, doações)
- Automação via alertas
- Análise consolidada de dados

---

## 📋 ROADMAP DETALHADO

---

## 🔴 **SPRINT 1: PRIORIDADE CRÍTICA** (1 semana - 6-9 horas)

**Objetivo:** Implementar módulos com **maior impacto financeiro e compliance**

### 1.1 MÓDULO: ÓBITOS
**Tempo estimado:** 2-3 horas
**Prioridade:** 🔴 CRÍTICA

#### **Por que é prioritário:**
- ✅ **Economia financeira direta** para o cliente
- ✅ Detecta fraudes (pagamentos a falecidos)
- ✅ **Dados já existem** no cache SERPRO!
- ✅ Zero custo adicional (R$ 0,00)

#### **O que será implementado:**

**Endpoints:**
```
GET  /api/dados/obitos              - Lista funcionários falecidos
GET  /api/dados/obitos/stats        - Estatísticas (total, por ano, economia)
POST /api/dados/obitos/atualizar    - Força atualização do cache SERPRO
```

**Fonte de dados:**
- Cache SERPRO CPF existente
- Campo: `situacao_descricao = "TITULAR FALECIDO"`
- Tabela D1: `serpro_cpf_cache`

**Benefícios para o cliente:**
- 💰 Identifica pagamentos indevidos a falecidos
- 📊 Calcula economia mensal/anual
- 🔍 Detecta fraudes previdenciárias
- ⚡ Dados em tempo real via cache

---

### 1.2 MÓDULO: VÍNCULOS (SÓCIOS DE EMPRESAS)
**Tempo estimado:** 4-6 horas
**Prioridade:** 🔴 CRÍTICA

#### **Por que é prioritário:**
- ✅ **Compliance e conflito de interesses**
- ✅ Detecta nepotismo
- ✅ Usa cache CNPJ existente
- ✅ Custo baixo: R$ 1,17/empresa (cache 180 dias)

#### **O que será implementado:**

**Endpoints:**
```
GET  /api/dados/vinculos              - Lista funcionários sócios
GET  /api/dados/vinculos/stats        - Total de empresas, faturamento
GET  /api/dados/vinculos/:cpf         - Empresas de um CPF específico
POST /api/dados/vinculos/consultar    - Atualiza cache CNPJ em lote
```

**Fonte de dados:**
- API SERPRO CNPJ (endpoint já existe)
- QSA com CPF **desmascarado** (R$ 1,17/consulta)
- Tabela D1: `serpro_cnpj_cache`

**Benefícios para o cliente:**
- 🏢 Identifica funcionários com empresas próprias
- ⚖️ Detecta conflito de interesses
- 🔎 Verifica fornecedores (cruzamento CPF)
- 💼 Compliance em licitações

---

## 🟡 **SPRINT 2: PRIORIDADE ALTA** (1 semana - 8-12 horas)

**Objetivo:** Compliance legal e auditoria

### 2.1 MÓDULO: SANCIONADOS (CEIS/CNEP)
**Tempo estimado:** 4-6 horas
**Prioridade:** 🟡 ALTA

#### **Por que é importante:**
- ✅ **Impedimento legal** de contratação
- ✅ Risco jurídico para o cliente
- ✅ **API oficial gratuita** (Portal da Transparência)

#### **O que será implementado:**

**Endpoints:**
```
GET  /api/dados/sancionados           - Lista funcionários sancionados
GET  /api/dados/sancionados/stats     - Por órgão, motivo, período
GET  /api/dados/sancionados/:cpf      - Detalhes das sanções
POST /api/dados/sancionados/consultar - Consulta em lote via API CGU
POST /api/dados/sancionados/importar  - Import CSV do Portal
```

**Fonte de dados:**
- **API oficial:** Portal da Transparência (CGU)
- Endpoint: `/api-de-dados/ceis` e `/api-de-dados/cnep`
- Custo: **R$ 0,00** (API pública)
- Fonte: https://portaldatransparencia.gov.br/api-de-dados

**Benefícios para o cliente:**
- ⚖️ Compliance legal (Lei de Licitações)
- 🚫 Evita contratar sancionados
- 📋 Auditoria CGU/TCU
- 💼 Proteção jurídica

---

### 2.2 MÓDULO: BENEFÍCIOS SOCIAIS (BPC, BOLSA FAMÍLIA)
**Tempo estimado:** 4-6 horas (manual) / 2-3 semanas (parceria)
**Prioridade:** 🟡 ALTA

#### **Por que é importante:**
- ✅ **Acúmulo irregular de renda**
- ✅ Compliance previdenciário
- ✅ Auditoria interna

#### **Desafio:**
⚠️ **Não há API pública oficial para benefícios**

**Soluções possíveis:**

**OPÇÃO A: Import Manual (rápido - 4-6h)**
```
POST /api/dados/beneficios/importar   - Admin importa CSV/Excel
GET  /api/dados/beneficios            - Lista beneficiários
GET  /api/dados/beneficios/stats      - Estatísticas
```

**OPÇÃO B: Portal da Transparência (médio - 6-8h)**
- Usar dados agregados do Portal
- Cruzamento por município + nome
- Menor precisão, mas automatizado

**OPÇÃO C: Parceria com MDS (ideal - 2-3 semanas)**
- Convênio com Ministério do Desenvolvimento Social
- Acesso controlado à base de dados
- ⚠️ Requer processo burocrático

**Recomendação:** Iniciar com OPÇÃO A (manual), evoluir para OPÇÃO B.

**Benefícios para o cliente:**
- 💰 Identifica acúmulo irregular de renda
- 📊 Compliance previdenciário
- 🔍 Auditoria de benefícios sociais

---

## 🟢 **SPRINT 3: PRIORIDADE MÉDIA** (2 semanas - 12-18 horas)

**Objetivo:** Transparência política e sanções internacionais

### 3.1 MÓDULO: CANDIDATOS POLÍTICOS
**Tempo estimado:** 4-6 horas
**Prioridade:** 🟢 MÉDIA

#### **Fonte de dados:**
- **TSE - Portal de Dados Abertos**
- Website: https://dadosabertos.tse.jus.br/
- ❌ Sem API REST (apenas CSV bulk)
- Dataset: Candidatos desde 1994

**Solução:**
```
POST /api/dados/candidatos/importar   - Upload CSV do TSE
GET  /api/dados/candidatos            - Lista candidatos
GET  /api/dados/candidatos/stats      - Por partido, cargo, ano
GET  /api/dados/candidatos/:cpf       - Candidaturas de um CPF
```

---

### 3.2 MÓDULO: DOADORES DE CAMPANHA
**Tempo estimado:** 4-6 horas
**Prioridade:** 🟢 MÉDIA

#### **Fonte de dados:**
- **TSE - Prestação de Contas**
- Dataset: Doações desde 1994
- ❌ Sem API REST (apenas CSV bulk)

**Solução:**
```
POST /api/dados/doadores/importar     - Upload CSV do TSE
GET  /api/dados/doadores              - Lista doadores
GET  /api/dados/doadores/stats        - Total doado, partidos
GET  /api/dados/doadores/:cpf         - Doações de um CPF
```

---

### 3.3 MÓDULO: OFAC (SANÇÕES INTERNACIONAIS)
**Tempo estimado:** 6-8 horas
**Prioridade:** 🟢 MÉDIA

#### **Fonte de dados:**
- **OFAC - U.S. Department of Treasury**
- Website: https://sanctionssearch.ofac.treas.gov/
- **OpenSanctions API** (recomendado - gratuito)
- Website: https://www.opensanctions.org/

**Solução:**
```
POST /api/dados/ofac/sync             - Download lista oficial OFAC
POST /api/dados/ofac/consultar        - Consulta via OpenSanctions API
GET  /api/dados/ofac                  - Lista matches encontrados
GET  /api/dados/ofac/:cpf             - Sanções de um CPF
```

**Benefícios:**
- 🌍 Compliance internacional
- 💼 Negócios com empresas estrangeiras
- 🚫 Evita sanções secundárias

---

## 📌 **SPRINT 4: PRIORIDADE BAIXA** (1 semana - 9-12 horas)

**Objetivo:** UX e automação

### 4.1 MÓDULO: ALERTAS AUTOMÁTICOS
**Tempo estimado:** 2-3 horas
**Prioridade:** 📌 BAIXA

**O que será implementado:**
```
GET  /api/alertas                 - Lista alertas do tenant
POST /api/alertas/marcar-lida     - Marca como lido
GET  /api/alertas/stats           - Estatísticas
POST /api/alertas/criar           - Criar alerta manual
```

**Infraestrutura:**
- ✅ Tabela D1 `alerts` já existe
- ⚠️ Falta implementar rotas

---

### 4.2 MÓDULO: DASHBOARD ANALÍTICO
**Tempo estimado:** 3-4 horas
**Prioridade:** 📌 BAIXA

**O que será implementado:**
```
GET /api/dados/analitico/overview    - Visão consolidada
GET /api/dados/analitico/timeline    - Linha do tempo
GET /api/dados/analitico/cross-check - Cruzamento de dados
```

---

### 4.3 MÓDULO: RELATÓRIOS E EXPORTAÇÃO
**Tempo estimado:** 4-5 horas
**Prioridade:** 📌 BAIXA

**O que será implementado:**
```
GET  /api/relatorios             - Lista relatórios gerados
POST /api/relatorios/gerar       - Gera PDF/Excel
GET  /api/relatorios/:id/download - Download
POST /api/exportar/funcionarios  - Export CSV/Excel
POST /api/exportar/completo      - Export todos os dados
```

---

## 💰 ANÁLISE DE CUSTOS

### **Custos por Módulo:**

| Módulo | Fonte de Dados | Custo |
|--------|---------------|-------|
| Óbitos | Cache SERPRO CPF | **R$ 0,00** (usa cache existente) |
| Vínculos | Cache SERPRO CNPJ | **R$ 1,17/empresa** (cache 180 dias) |
| Sancionados | API Portal Transparência | **R$ 0,00** (API gratuita) |
| Benefícios | Import manual | **R$ 0,00** |
| Candidatos | CSV TSE | **R$ 0,00** |
| Doadores | CSV TSE | **R$ 0,00** |
| OFAC | OpenSanctions API | **R$ 0,00** (API gratuita) |
| Alertas | Interno | **R$ 0,00** |
| Analítico | Interno | **R$ 0,00** |
| Relatórios | Interno | **R$ 0,00** |

**CUSTO TOTAL ADICIONAL:** ~R$ 0,00 a R$ 100/mês (vínculos)

### **Economia para o Cliente:**

**Com Módulo de Óbitos:**
- Detectar 1 funcionário falecido recebendo R$ 5.000/mês
- **Economia anual:** R$ 60.000
- **ROI:** Imediato

**Com Módulo de Benefícios:**
- Detectar 1 funcionário com acúmulo irregular
- **Economia/Multa evitada:** R$ 10.000 - R$ 50.000
- **Compliance:** Invaluável

---

## ⏱️ CRONOGRAMA TOTAL

### **Resumo:**

| Sprint | Duração | Horas | Módulos | Prioridade |
|--------|---------|-------|---------|------------|
| Sprint 1 | 1 semana | 6-9h | Óbitos, Vínculos | 🔴 Crítica |
| Sprint 2 | 1 semana | 8-12h | Sancionados, Benefícios | 🟡 Alta |
| Sprint 3 | 2 semanas | 12-18h | Candidatos, Doadores, OFAC | 🟢 Média |
| Sprint 4 | 1 semana | 9-12h | Alertas, Analítico, Relatórios | 📌 Baixa |

**TOTAL:** 5 semanas | 35-51 horas de desenvolvimento

---

## 🎯 ENTREGÁVEIS POR SPRINT

### **Sprint 1 (Semana 1):**
✅ Módulo Óbitos funcionando
✅ Módulo Vínculos funcionando
✅ Dashboard mostrando economia estimada
✅ Testes E2E passando

### **Sprint 2 (Semana 2):**
✅ Módulo Sancionados integrado (API CGU)
✅ Módulo Benefícios (import manual)
✅ Documentação de compliance

### **Sprint 3 (Semana 3-4):**
✅ Módulos políticos (Candidatos, Doadores)
✅ Módulo OFAC (sanções internacionais)
✅ Dashboard de transparência política

### **Sprint 4 (Semana 5):**
✅ Sistema de alertas automáticos
✅ Dashboard analítico consolidado
✅ Geração de relatórios PDF/Excel
✅ **Sistema 100% completo**

---

## 📊 BENEFÍCIOS PARA O CLIENTE

### **Retorno sobre Investimento (ROI):**

**Investimento:** 35-51 horas de desenvolvimento
**Retorno:**
- 💰 Economia com óbitos detectados
- ⚖️ Compliance legal (evita multas)
- 🔍 Detecção de fraudes
- 💼 Transparência e auditoria
- 🚀 Sistema completo e profissional

**Exemplo prático:**
- Cliente com 1.000 funcionários
- 1 funcionário falecido detectado (R$ 5.000/mês)
- **ROI em 1 mês:** R$ 60.000/ano

### **Valor Agregado:**

1. **Conformidade Legal:**
   - Compliance com TCU/CGU
   - Auditoria transparente
   - Proteção jurídica

2. **Redução de Custos:**
   - Pagamentos indevidos eliminados
   - Fraudes detectadas precocemente
   - Economia em processos manuais

3. **Decisões Baseadas em Dados:**
   - Dashboard analítico completo
   - Cruzamento de informações
   - Relatórios profissionais

4. **Diferencial Competitivo:**
   - Sistema único no mercado
   - Integração com fontes oficiais
   - Automação completa

---

## 🚦 PRÓXIMOS PASSOS

### **1. APROVAÇÃO DO ROADMAP**
- [ ] Cliente aprovar priorização
- [ ] Definir prazo de início
- [ ] Alocar recursos

### **2. PREPARAÇÃO (1 dia)**
- [ ] Setup ambiente de desenvolvimento
- [ ] Configurar acesso a APIs governamentais
- [ ] Preparar documentação técnica

### **3. EXECUÇÃO (5 semanas)**
- [ ] Executar Sprints 1-4
- [ ] Testes contínuos
- [ ] Deploy incremental

### **4. ENTREGA FINAL**
- [ ] Treinamento do cliente
- [ ] Documentação completa
- [ ] Suporte pós-implementação

---

## 📞 CONTATO

**Responsável:** Agent 2 (Backend Engineer)
**Workspace:** `.agents/agent-2-backend/`
**Status:** `.agents/agent-2-backend/STATUS.md`
**Documentação Técnica:** `.agents/agent-2-backend/ENDPOINTS_ANALYSIS_AND_SOURCES.md`

---

## 📎 ANEXOS

1. **Análise Técnica Completa:** `ENDPOINTS_ANALYSIS_AND_SOURCES.md`
2. **Backend API Deployed:** `API_DEPLOYED.md`
3. **Frontend Integration:** `FRONTEND_INTEGRATION_COMPLETE.md`

---

**Data de criação:** 2025-12-08
**Última atualização:** 2025-12-08
**Versão:** 1.0
**Status:** ✅ AGUARDANDO APROVAÇÃO
