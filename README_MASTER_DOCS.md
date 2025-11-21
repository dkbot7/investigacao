# 📚 MASTER DOCUMENTATION INDEX — investigaree

**Versão**: 1.0
**Data**: 21/11/2025
**Status**: 🟢 Completo

---

## 🎯 SOBRE ESTA DOCUMENTAÇÃO

Este diretório contém **4 Documentos-Mestre** que cobrem TODA a estratégia, operação e arquitetura da plataforma investigaree.

**Para quem é**:
- Fundadores (visão estratégica)
- Time de produto (roadmap e decisões)
- Time de engenharia (arquitetura técnica)
- Time de operações (SOPs e processos)
- Time de vendas/marketing (ICP e narrativas)

---

## 📖 OS 4 DOCUMENTOS-MESTRE

### 📘 1. [PRODUCT_BLUEPRINT.md](./PRODUCT_BLUEPRINT.md)
**"Como o produto funciona, qual problema resolve, para quem, e qual transformação entrega."**

#### Inclui:
- ✅ Manifesto do produto
- ✅ Promessa central e value proposition
- ✅ Category Design (Digital Due Diligence as a Service)
- ✅ Posição no mercado
- ✅ Arquitetura híbrida (SaaS + IA + Serviço estratégico)
- ✅ Matriz de valor (6 módulos)
- ✅ Pricing (Standard R$ 197, Express R$ 397)
- ✅ Roadmap (MVP → Scale → LATAM)
- ✅ Diferenciação competitiva
- ✅ North Star Metric
- ✅ Go-to-Market Strategy

**Leia se você quer entender**:
- Por que investigaree existe
- Qual transformação entrega ao cliente
- Como o produto se posiciona no mercado
- Qual a visão de longo prazo

---

### 📙 2. [TECHNICAL_SYSTEMS.md](./TECHNICAL_SYSTEMS.md)
**"Como o sistema é construído, mantido e operado."**

#### Inclui:
- ✅ Arquitetura completa (diagrama)
- ✅ Stack tecnológico (React, Hono, Cloudflare)
- ✅ Frontend (8 páginas, rotas, contextos)
- ✅ Backend (API endpoints, middleware, cron)
- ✅ Database (Supabase schema, RLS policies)
- ✅ Infraestrutura Cloudflare (DNS, Pages, Workers, R2, KV)
- ✅ Autenticação (Firebase Auth + JWT)
- ✅ Segurança (CORS, rate limiting, secrets)
- ✅ CI/CD e deploy
- ✅ Monitoring e logging
- ✅ Troubleshooting guide
- ✅ Technical decisions log

**Leia se você quer entender**:
- Como o sistema funciona tecnicamente
- Como fazer deploy
- Como debugar problemas
- Decisões de arquitetura e por quê

---

### 📗 3. [OPERATIONS_PLAYBOOK.md](./OPERATIONS_PLAYBOOK.md)
**"Como a equipe opera, executa, processa, entrega, mantém e garante padrão."**

#### Inclui:
- ✅ SOPs completos (5 fases do processamento)
- ✅ Onboarding de cliente
- ✅ Quality Control (checklist obrigatório)
- ✅ Geração de PDF (estrutura do relatório)
- ✅ Indicadores (KPIs primários e secundários)
- ✅ SLA (Standard 48h, Express 6h)
- ✅ Fluxos internos (triagem, investigação, análise, QA, entrega)
- ✅ Handling de exceções (5 cenários)
- ✅ Segurança operacional (LGPD, data retention)
- ✅ Disaster Recovery
- ✅ Escalamento (10 → 1000 relatórios/mês)

**Leia se você quer entender**:
- Como processar um relatório do início ao fim
- Como garantir qualidade consistente
- Como lidar com situações atípicas
- Como escalar operações

---

### 📕 4. [ICP_BEHAVIORAL_PSYCHOLOGY.md](./ICP_BEHAVIORAL_PSYCHOLOGY.md)
**"Como o cliente pensa, sente, compra, deseja, teme e justifica."**

#### Inclui:
- ✅ ICP detalhado (demográfico, profissional, psicográfico)
- ✅ Psicografia (traços de personalidade, valores, hobbies)
- ✅ Framework JTBD (Jobs To Be Done)
- ✅ Drivers internos (5 motivações escondidas)
- ✅ Objeções emocionais (5 principais + como superar)
- ✅ Momento ideal de compra (gatilhos de urgência)
- ✅ Narrativas possíveis (4 personas)
- ✅ Linguagem recomendada (palavras-chave, tom)
- ✅ Propostas transformacionais (DE → PARA)
- ✅ Segmentação psicográfica (4 segmentos)
- ✅ Momentos de verdade (5 touchpoints críticos)

**Leia se você quer entender**:
- Quem é o cliente ideal
- Por que ele compra (ou não compra)
- Como falar com ele
- Quais objeções superar

---

## 🗺️ COMO USAR ESTA DOCUMENTAÇÃO

### Para Fundadores/C-Level
1. **Comece com**: PRODUCT_BLUEPRINT.md (visão estratégica)
2. **Depois leia**: ICP_BEHAVIORAL_PSYCHOLOGY.md (entender o mercado)
3. **Consulte quando necessário**: TECHNICAL_SYSTEMS.md, OPERATIONS_PLAYBOOK.md

### Para Produto/Marketing
1. **Comece com**: ICP_BEHAVIORAL_PSYCHOLOGY.md (cliente)
2. **Depois leia**: PRODUCT_BLUEPRINT.md (posicionamento)
3. **Consulte**: OPERATIONS_PLAYBOOK.md (entender limitações/capacidade)

### Para Engenharia
1. **Comece com**: TECHNICAL_SYSTEMS.md (arquitetura)
2. **Depois leia**: PRODUCT_BLUEPRINT.md (entender o porquê)
3. **Consulte**: OPERATIONS_PLAYBOOK.md (fluxos que o sistema deve suportar)

### Para Operações
1. **Comece com**: OPERATIONS_PLAYBOOK.md (SOPs)
2. **Depois leia**: PRODUCT_BLUEPRINT.md (entender o produto)
3. **Consulte**: TECHNICAL_SYSTEMS.md (quando houver issues técnicos)

### Para Novos Funcionários (Onboarding)
**Ordem recomendada**:
1. **Dia 1-2**: PRODUCT_BLUEPRINT.md (entender o negócio)
2. **Dia 3-4**: ICP_BEHAVIORAL_PSYCHOLOGY.md (entender o cliente)
3. **Dia 5-7**: OPERATIONS_PLAYBOOK.md (processos) OU TECHNICAL_SYSTEMS.md (tech)
4. **Semana 2+**: Consulta conforme necessidade

---

## 🤖 GUIA PARA CLAUDE CODE (ou próximo desenvolvedor)

### 📖 PASSO A PASSO DE LEITURA OBRIGATÓRIA

**IMPORTANTE**: Antes de começar qualquer tarefa, leia esta seção completa!

---

#### ✅ FASE 1: CONTEXTO ESTRATÉGICO (30 minutos)

**1.1 Leia primeiro**: [PRODUCT_BLUEPRINT.md](./PRODUCT_BLUEPRINT.md)

**Foque especialmente em**:
- [ ] Seção "Manifesto do Produto" — Entenda POR QUÊ o produto existe
- [ ] Seção "Promessa Central" — O que entregamos ao cliente
- [ ] Seção "Matriz de Valor" — Os 6 módulos de investigação
- [ ] Seção "Roadmap" — Em qual fase estamos (MVP concluído)

**Checkpoint**:
- ❓ Você consegue explicar qual problema investigaree resolve?
- ❓ Você sabe quem é o cliente ideal?
- ❓ Você entende qual a transformação que entregamos?

**Se respondeu SIM a todas**: ✅ Prossiga para Fase 2
**Se respondeu NÃO a alguma**: ⚠️ Releia as seções relevantes

---

#### ✅ FASE 2: ARQUITETURA TÉCNICA (45 minutos)

**2.1 Leia**: [TECHNICAL_SYSTEMS.md](./TECHNICAL_SYSTEMS.md)

**Foque especialmente em**:
- [ ] Seção "Arquitetura Geral" — Diagrama visual do sistema
- [ ] Seção "Frontend Architecture" — Estrutura de páginas e rotas
- [ ] Seção "Backend Architecture" — API endpoints disponíveis
- [ ] Seção "Database Architecture" — Schema do Supabase
- [ ] Seção "Cloudflare Infrastructure" — Como está deployado

**Checkpoint**:
- ❓ Você sabe quantas páginas existem no frontend? (Resposta: 8)
- ❓ Você sabe onde estão os endpoints da API? (Resposta: workers/api/)
- ❓ Você sabe qual banco de dados usamos? (Resposta: Supabase PostgreSQL)
- ❓ Você sabe como fazer deploy? (Resposta: npm run build && wrangler deploy)

**Se respondeu SIM a todas**: ✅ Prossiga para Fase 3
**Se respondeu NÃO a alguma**: ⚠️ Releia as seções relevantes

---

#### ✅ FASE 3: PROCESSOS OPERACIONAIS (30 minutos)

**3.1 Leia**: [OPERATIONS_PLAYBOOK.md](./OPERATIONS_PLAYBOOK.md)

**Foque especialmente em**:
- [ ] Seção "SOP 001" — Processamento de novo relatório (5 fases)
- [ ] Seção "Quality Control" — Checklist de QC
- [ ] Seção "Indicadores Operacionais" — KPIs que importam

**Checkpoint**:
- ❓ Você sabe quantas fases tem o processamento de um relatório? (Resposta: 5)
- ❓ Você sabe qual o SLA do plano Express? (Resposta: 6h)
- ❓ Você sabe quais os 6 módulos de investigação? (Resposta: Identidade, Criminal, Digital, Societário, Breach, Reputação)

**Se respondeu SIM a todas**: ✅ Prossiga para Fase 4
**Se respondeu NÃO a alguma**: ⚠️ Releia as seções relevantes

---

#### ✅ FASE 4: PSICOLOGIA DO CLIENTE (20 minutos - opcional mas recomendado)

**4.1 Leia**: [ICP_BEHAVIORAL_PSYCHOLOGY.md](./ICP_BEHAVIORAL_PSYCHOLOGY.md)

**Foque especialmente em**:
- [ ] Seção "Ideal Customer Profile" — Quem é o cliente
- [ ] Seção "Drivers Internos" — Por que ele compra
- [ ] Seção "Objeções Emocionais" — Principais objeções

**Checkpoint**:
- ❓ Você sabe quem é o cliente ideal? (Resposta: Investidores-anjo, VCs, Empresários)
- ❓ Você entende a principal motivação? (Resposta: Medo de perda > Desejo de ganho)

**Se respondeu SIM**: ✅ Você está pronto para trabalhar!

---

### 🚀 PRÓXIMOS PASSOS TÉCNICOS (após leitura)

Agora que você leu toda a documentação, aqui está o que fazer:

---

#### 📍 ESTADO ATUAL DO PROJETO (21/11/2025)

**✅ O que JÁ ESTÁ FUNCIONANDO**:
- ✅ Frontend deployado (8 páginas funcionais)
- ✅ Backend API deployado (10 endpoints)
- ✅ Tabela `leads` criada no Supabase
- ✅ Fluxo de cadastro de leads funcionando
- ✅ Domínio custom (investigaree.com.br)
- ✅ SSL/TLS ativo
- ✅ Firebase Auth configurado
- ✅ Página /obrigado com jogo Snake

**URLs em produção**:
- Frontend: https://investigaree.com.br
- Backend: https://api.investigaree.com.br
- Health check: https://api.investigaree.com.br/health

**🔴 O que AINDA NÃO ESTÁ FUNCIONANDO**:
- ❌ Frontend NÃO está conectado ao backend (usando mock data)
- ❌ Stripe checkout NÃO está implementado
- ❌ Processamento de relatórios NÃO existe ainda
- ❌ Geração de PDF NÃO está implementada
- ❌ Tabelas `users`, `reports`, `payments` NÃO existem no Supabase

---

#### 🎯 PRIORIDADE #1: CONECTAR FRONTEND COM BACKEND REAL

**Local**: `src/contexts/ApiContext.tsx`

**O que fazer**:
1. Implementar chamadas API reais (substituir mock data)
2. Usar `VITE_API_BASE_URL` para fazer fetch
3. Anexar token Firebase JWT no header Authorization
4. Tratar erros adequadamente
5. Atualizar loading states

**Referência**: Ver seção "Backend Architecture" em TECHNICAL_SYSTEMS.md

**Arquivos a modificar**:
- `src/contexts/ApiContext.tsx`
- `src/pages/DashboardPage.tsx` (usar dados reais)
- `src/pages/CreateReportPage.tsx` (chamar API real)

---

#### 🎯 PRIORIDADE #2: CRIAR TABELAS FALTANTES NO SUPABASE

**Tabelas necessárias**:
- `users` (usuários da plataforma)
- `reports` (relatórios solicitados)
- `payments` (pagamentos Stripe)

**Referência**: Ver seção "Database Architecture" em TECHNICAL_SYSTEMS.md

**Como fazer**:
1. Acesse Supabase Dashboard
2. SQL Editor → New Query
3. Execute o SQL (fornecido em TECHNICAL_SYSTEMS.md)
4. Verificar que tabelas foram criadas

---

#### 🎯 PRIORIDADE #3: INTEGRAÇÃO STRIPE CHECKOUT

**Local**: `workers/api/payments.ts` e `src/pages/CreateReportPage.tsx`

**O que fazer**:
1. Criar endpoint POST /api/payments/create-checkout
2. Criar sessão do Stripe Checkout
3. Retornar URL de checkout
4. Frontend redireciona para URL
5. Webhook atualiza status do pagamento

**Referência**: Ver seção "API Endpoints" em TECHNICAL_SYSTEMS.md

**Arquivos a criar/modificar**:
- `workers/api/payments.ts`
- `workers/api/webhooks.ts`
- `src/pages/CreateReportPage.tsx`
- `src/pages/PaymentsPage.tsx`

---

#### 🎯 PRIORIDADE #4: PROCESSAMENTO DE RELATÓRIOS

**Local**: `workers/services/report-processor.ts` (criar)

**O que fazer**:
1. Criar worker de processamento
2. Integrar APIs externas (Google, API Brasil, etc)
3. Consolidar dados em JSON
4. Gerar PDF
5. Upload para R2
6. Atualizar status do relatório

**Referência**: Ver seção "SOP 001" em OPERATIONS_PLAYBOOK.md

**Arquivos a criar**:
- `workers/services/report-processor.ts`
- `workers/services/pdf-generator.ts`
- `workers/cron/process-reports.ts`

---

### 📝 COMANDOS ÚTEIS

```bash
# ==================== DESENVOLVIMENTO ====================

# Frontend dev server
npm run dev
# → http://localhost:5173

# Backend dev server
npx wrangler dev workers/index.ts
# → http://localhost:8787

# Build frontend
npm run build

# ==================== DEPLOY ====================

# Deploy completo (backend + frontend)
npm run build && \
npx wrangler deploy && \
npx wrangler pages deploy dist --project-name=investigaree

# Deploy apenas frontend
npm run build && npx wrangler pages deploy dist --project-name=investigaree

# Deploy apenas backend
npx wrangler deploy

# ==================== LOGS ====================

# Ver logs do Workers em tempo real
npx wrangler tail

# Ver logs formatados
npx wrangler tail --format pretty

# ==================== TESTES ====================

# Testar frontend
curl https://investigaree.com.br/

# Testar backend
curl https://api.investigaree.com.br/health

# Testar endpoint com auth
curl -X GET https://api.investigaree.com.br/api/reports \
  -H "Authorization: Bearer FIREBASE_TOKEN" \
  -H "Content-Type: application/json"
```

---

### 🎓 CONVENÇÕES DE CÓDIGO

**Antes de codificar, siga estas regras**:

1. **TypeScript estrito**: Sempre tipado, sem `any`
2. **Componentes funcionais**: Usar hooks (não classes)
3. **Nomes descritivos**: `createReport` não `doStuff`
4. **Comentários apenas quando necessário**: Código auto-explicativo
5. **Error handling**: Sempre tratar erros com try/catch
6. **Logs informativos**: `console.log('[INFO] Descrição')`
7. **Commits semânticos**: `feat:`, `fix:`, `docs:`, etc

---

### 🔍 TROUBLESHOOTING RÁPIDO

**Erro de CORS?**
→ Verificar `workers/index.ts` linha 75-88 (configuração CORS)

**Erro de Firebase Auth?**
→ Verificar `.env` tem `VITE_FIREBASE_API_KEY` correto

**Erro de Supabase?**
→ Verificar RLS policies estão corretas

**Build falhou?**
→ Verificar `npm run build` localmente primeiro

**Deploy falhou?**
→ Verificar `wrangler.toml` está correto

---

### 📚 DOCUMENTOS DE REFERÊNCIA RÁPIDA

**Precisa saber como processar um relatório?**
→ OPERATIONS_PLAYBOOK.md seção "SOP 001"

**Precisa saber estrutura do banco?**
→ TECHNICAL_SYSTEMS.md seção "Database Architecture"

**Precisa saber endpoints da API?**
→ TECHNICAL_SYSTEMS.md seção "API Endpoints"

**Precisa saber sobre o cliente?**
→ ICP_BEHAVIORAL_PSYCHOLOGY.md

**Precisa saber visão do produto?**
→ PRODUCT_BLUEPRINT.md seção "Manifesto"

---

### ✅ CHECKLIST ANTES DE COMEÇAR A CODIFICAR

- [ ] Li PRODUCT_BLUEPRINT.md completo
- [ ] Li TECHNICAL_SYSTEMS.md completo
- [ ] Li OPERATIONS_PLAYBOOK.md (pelo menos SOP 001)
- [ ] Entendo o estado atual do projeto
- [ ] Sei qual é a Prioridade #1 atual
- [ ] Verifiquei que ambiente local funciona (`npm run dev`)
- [ ] Tenho acesso a:
  - [ ] Cloudflare Dashboard
  - [ ] Supabase Dashboard
  - [ ] Firebase Console
  - [ ] Stripe Dashboard (se necessário)

**Se todos marcados**: ✅ Você está pronto para começar!

**Se algum NÃO marcado**: ⚠️ Complete antes de prosseguir

---

### 🚨 REGRA DE OURO

**ANTES DE FAZER QUALQUER ALTERAÇÃO**:
1. Leia a documentação relevante
2. Entenda o contexto
3. Planeje a solução
4. Execute com cuidado
5. Teste localmente
6. Deploy

**NÃO**:
- ❌ Codificar sem entender o contexto
- ❌ Fazer deploy sem testar localmente
- ❌ Modificar código sem ler a documentação
- ❌ Inventar soluções sem consultar TECHNICAL_SYSTEMS.md

---

### 🎯 OBJETIVO FINAL

**Transformar investigaree de MVP → Produto completo**

**Fases**:
1. ✅ **MVP** (CONCLUÍDO) — Frontend + Backend básico
2. 🔄 **Alpha** (EM ANDAMENTO) — Integração completa + Primeiros 10 relatórios
3. ⏳ **Beta** (Próximo) — Automação + Escala para 100 relatórios/mês
4. ⏳ **Scale** (Futuro) — Product-Market Fit + R$ 100k MRR

**Estamos na transição MVP → Alpha**

**Próximo milestone**: Processar primeiro relatório real end-to-end

---

## 📊 DOCUMENTAÇÃO COMPLEMENTAR

Além dos 4 Documentos-Mestre, você também pode consultar:

### Documentos Técnicos Específicos
- [PROJETO_COMPLETO.md](./PROJETO_COMPLETO.md) — Visão técnica geral do projeto
- [ARQUITETURA_TECNICA.md](./ARQUITETURA_TECNICA.md) — Detalhes de arquitetura
- [FLUXO_LEAD_IMPLEMENTADO.md](./FLUXO_LEAD_IMPLEMENTADO.md) — Implementação do cadastro de leads
- [EXECUTAR_SQL_SUPABASE.md](./EXECUTAR_SQL_SUPABASE.md) — Instruções para criar tabelas

### Documentos de Sessão
- [SESSAO_21_NOV_2025.md](./SESSAO_21_NOV_2025.md) — Log da sessão de desenvolvimento

### Migrações de Banco
- [supabase/migrations/create_leads_table.sql](./supabase/migrations/create_leads_table.sql) — SQL para criar tabela leads

---

## 🔄 CICLO DE ATUALIZAÇÃO

### Frequência de Revisão

| Documento | Frequência | Responsável |
|-----------|------------|-------------|
| PRODUCT_BLUEPRINT.md | Trimestral | Product Lead |
| TECHNICAL_SYSTEMS.md | Mensal | Engineering Lead |
| OPERATIONS_PLAYBOOK.md | Mensal | Operations Lead |
| ICP_BEHAVIORAL_PSYCHOLOGY.md | Trimestral | Marketing Lead |

### Processo de Atualização

1. **Proposta de mudança**
   - Criar issue no GitHub
   - Justificar por que a mudança é necessária

2. **Revisão**
   - Lead do documento revisa
   - Aprova ou solicita ajustes

3. **Implementação**
   - Editar documento
   - Atualizar "Última atualização" no topo
   - Incrementar versão se necessário

4. **Comunicação**
   - Avisar time sobre mudanças críticas
   - Slack/email com resumo do que mudou

---

## 🎯 NORTH STAR METRICS POR ÁREA

Cada documento se conecta a uma métrica principal:

| Documento | North Star Metric |
|-----------|-------------------|
| **PRODUCT_BLUEPRINT** | Decisões críticas protegidas/mês |
| **TECHNICAL_SYSTEMS** | Uptime 99.9%+ |
| **OPERATIONS_PLAYBOOK** | SLA compliance >95% |
| **ICP_BEHAVIORAL_PSYCHOLOGY** | NPS >50 |

---

## 📞 DÚVIDAS SOBRE A DOCUMENTAÇÃO

**Documento desatualizado?**
- Abrir issue no GitHub com tag `[docs]`

**Falta algo importante?**
- Propor adição via pull request

**Não entendeu algo?**
- Perguntar no Slack #docs

**Conflito entre documentos?**
- Avisar imediatamente, pode ser erro crítico

---

## 🎖️ PRINCÍPIOS DA DOCUMENTAÇÃO

1. **Viva e atualizada** (não documento morto)
2. **Single source of truth** (sem duplicação)
3. **Actionable** (cada seção tem ação clara)
4. **Para humanos** (não só para máquinas)
5. **Versionada** (histórico de mudanças)

---

## 📚 HIERARQUIA DE DOCUMENTAÇÃO

```
📚 MASTER DOCS (Estratégico)
├── 📘 PRODUCT_BLUEPRINT.md
├── 📙 TECHNICAL_SYSTEMS.md
├── 📗 OPERATIONS_PLAYBOOK.md
└── 📕 ICP_BEHAVIORAL_PSYCHOLOGY.md

📂 COMPLEMENTARY DOCS (Tático)
├── PROJETO_COMPLETO.md
├── ARQUITETURA_TECNICA.md
├── FLUXO_LEAD_IMPLEMENTADO.md
└── ...

📝 SESSION LOGS (Histórico)
├── SESSAO_21_NOV_2025.md
└── ...

🗃️ CODE DOCS (Técnico)
├── README.md (root)
├── src/README.md
├── workers/README.md
└── ...
```

---

## ✅ CHECKLIST DE ONBOARDING (Novo Funcionário)

**Semana 1**:
- [ ] Ler PRODUCT_BLUEPRINT.md completo
- [ ] Ler ICP_BEHAVIORAL_PSYCHOLOGY.md completo
- [ ] Ler seção relevante de OPERATIONS_PLAYBOOK.md OU TECHNICAL_SYSTEMS.md

**Semana 2**:
- [ ] Processar 1 relatório (se Ops) OU fazer 1 feature (se Eng)
- [ ] Revisar documentação complementar
- [ ] Identificar gaps na documentação

**Semana 3**:
- [ ] Sugerir melhorias na documentação
- [ ] Estar fluente em processos/sistemas principais

---

## 🏆 CONTRIBUIDORES

**Criação Inicial** (21/11/2025):
- Claude Code (AI Assistant)
- Paulo (Product Lead)

**Manutenção Contínua**:
- Product Team
- Engineering Team
- Operations Team
- Marketing Team

---

## 📅 CHANGELOG

### v1.0 (21/11/2025)
- ✅ Criação inicial dos 4 Documentos-Mestre
- ✅ PRODUCT_BLUEPRINT.md completo
- ✅ TECHNICAL_SYSTEMS.md completo
- ✅ OPERATIONS_PLAYBOOK.md completo
- ✅ ICP_BEHAVIORAL_PSYCHOLOGY.md completo

---

**Próxima revisão geral**: Fevereiro 2026

---

*"Documentação excelente é a diferença entre uma startup e uma empresa escalável."*
