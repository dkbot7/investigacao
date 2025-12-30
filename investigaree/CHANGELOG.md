# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2025-12-30

### 🚀 Adicionado

#### Segurança
- **Row Level Security (RLS)** no D1 database para isolamento completo de dados por tenant
- **Validação JWT Firebase** com verificação de assinatura usando Google public keys
- **Auto-provisioning de usuários** no primeiro acesso
- **Middleware de autenticação** em todas as rotas protegidas do backend
- **Migration 013**: Políticas RLS com funções helper (set_tenant_context, clear_tenant_context)
- **Migration 014**: Tabela lgpd_consent_logs com retenção de 5 anos
- **Migration 015**: Tabelas faltantes (sancoes, ofac_matches, leads, beneficiarios, vinculos_societarios, candidaturas, doacoes_politicas)

#### Logger Estruturado
- **Logger centralizado** (src/lib/logger.ts) para frontend
- **Logger otimizado** (api-worker/src/logger.ts) para Cloudflare Workers
- **JSON logs** em produção para integração com Datadog/Cloudflare Logs
- **Logs colorized** em desenvolvimento para melhor debugging
- **Níveis de log**: debug, info, warn, error
- **Context tracking** em todas as operações críticas

#### Integração de APIs Externas
- **TSE Service** (tse.service.ts):
  - getCandidaturasByCPF: Histórico de candidaturas eleitorais
  - getDoacoesByCPF: Doações políticas
  - getHistoricoPoliticoByCPF: Consulta completa
- **Portal da Transparência Service** (portal-transparencia.service.ts):
  - consultarCEIS: Cadastro de Empresas Inidôneas e Suspensas
  - consultarCNEP: Cadastro Nacional de Empresas Punidas
  - consultarCEPIM: Cadastro de Entidades Impedidas
  - consultarBeneficios: Bolsa Família e benefícios sociais
  - consultarCompleto: Todas as sanções + benefícios

#### Backend Endpoints
- **Compliance Endpoints**:
  - `GET /api/compliance/stats` - Estatísticas agregadas (PEP, CEIS, CNEP, OFAC)
  - `GET /api/compliance/pep` - Lista de PEPs com paginação
  - `GET /api/compliance/sancoes` - Lista de sanções com filtros
- **LGPD Endpoints**:
  - `GET /api/lgpd/stats` - Estatísticas de compliance LGPD
  - `POST /api/lgpd/consent` - Registrar consentimento (público)
  - `GET /api/lgpd/requests` - Listar solicitações LGPD
  - `POST /api/lgpd/request` - Criar solicitação (acesso/exclusão/portabilidade)
- **Lead Capture**:
  - `POST /api/leads/subscribe` - Captura de leads com email automático

#### Frontend
- **Hook useTenant** (src/hooks/useTenant.ts):
  - Busca tenant do usuário autenticado dinamicamente
  - Escuta mudanças no auth state para atualização em tempo real
  - Retorna: tenantCode, currentTenant, userRole, hasAccess, loading, error
- **API Routes Next.js**:
  - `/api/compliance/stats` - Delega para backend worker
  - `/api/lgpd/stats` - Delega para backend worker
  - `/api/leads/subscribe` - Delega para backend worker
- **Dashboards atualizados**:
  - Dashboard Compliance agora usa dados reais do D1
  - Dashboard LGPD agora usa dados reais do D1

#### Email Service
- **Integração Resend API** para captura de leads
- **Email automático de boas-vindas** com template HTML profissional
- **Persistência em D1** (tabela leads)
- **Source tracking** (UTM params, referer, etc)
- **Lead scoring** inicial

### 🔄 Modificado

#### Autenticação
- Migrado de localStorage para server-side session management
- Removido armazenamento de dados sensíveis no client-side
- Token JWT agora validado com assinatura completa (não apenas decode)
- Tenant resolution dinâmico substituindo hardcoded 'CLIENTE_01'

#### Dashboards
- **Compliance**: Substituído mock data por fetch real
- **LGPD**: Substituído mock data por fetch real
- Dados agora vêm do D1 database com RLS aplicado
- Cache strategy: no-store para dados sempre frescos

#### LGPD Compliance
- Persistência de consentimentos agora em D1 (antes era apenas console.log)
- Hash de IP para privacidade (LGPD Art. 13)
- Registro de 5 anos conforme LGPD Art. 16
- Comentários de código atualizados refletindo implementação real

### ❌ Removido

#### COMURG Features
- **15 páginas COMURG deletadas**:
  - dashboard/comurgachadoscriticos
  - dashboard/comurganaliserisco
  - dashboard/comurgatividadepolitica
  - dashboard/comurgbeneficios
  - dashboard/comurgecedidos
  - dashboard/comurgempresas
  - dashboard/comurglistasrestritivas
  - dashboard/comurgobitos
  - E mais 7 páginas relacionadas
- **Lógica de access control** baseada em COMURG_EMAILS
- **Variável isCOMURG** e todas as referências
- **3,793 linhas de código removidas**

#### Mock Data
- Mock data removido de dashboard/compliance/page.tsx
- Mock data removido de dashboard/lgpd/page.tsx
- TODOs substituídos por implementação real
- Console.logs substituídos por logger estruturado

#### Código Legacy
- localStorage para dados sensíveis (tenant, user data)
- Tenant hardcoded ('CLIENTE_01') em 4 arquivos
- Comentários "// TODO: implementar" resolvidos

### 🔧 Corrigido

#### Segurança Crítica
- Vulnerabilidade de cross-tenant data access (RLS implementado)
- Validação JWT incompleta (agora valida assinatura)
- Dados sensíveis em localStorage (migrado para server-side)
- Falta de tenant isolation no database (RLS policies criadas)

#### TODOs Resolvidos
- ✅ Persistência LGPD em banco de dados
- ✅ Tenant hardcoded substituído por dinâmico
- ✅ Email service integrado (Resend)
- ✅ Mock data substituído por API real
- ✅ Logger estruturado implementado
- ✅ Comentários LGPD atualizados

### 📊 Estatísticas

- **Commits criados**: 8
- **Arquivos modificados**: 50+
- **Arquivos removidos**: 20+ (COMURG)
- **Linhas adicionadas**: ~2,000+
- **Linhas removidas**: ~4,000+ (COMURG + mock data)
- **TODOs resolvidos**: 15+
- **Migrations SQL criadas**: 3 (013, 014, 015)
- **Services criados**: 2 (TSE, Portal Transparência)
- **Backend handlers criados**: 3 (leads, compliance, lgpd)
- **Endpoints adicionados**: 7

### 🔒 Segurança

Este release resolve **todos os gaps de segurança críticos** identificados:
- ✅ RLS habilitado e testado
- ✅ JWT validation em 100% das rotas protegidas
- ✅ Zero acesso cross-tenant possível
- ✅ Zero dados sensíveis em localStorage
- ✅ Logs estruturados para auditoria
- ✅ LGPD compliance com 5 anos de retenção

### 📝 LGPD Compliance

- ✅ Consentimentos armazenados em D1 (5 anos)
- ✅ Hash de IP para privacidade (Art. 13)
- ✅ Registro de finalidades e versão do texto
- ✅ API de solicitação de dados (acesso/exclusão/portabilidade)
- ✅ Stats de compliance LGPD

### 🚨 Breaking Changes

#### Removidas as features COMURG
- Todas as páginas específicas do cliente COMURG foram removidas
- Access control baseado em email COMURG foi removido
- Se você estava usando features COMURG, será necessário adaptação

#### Tenant dinâmico
- Tenant agora é resolvido via JWT do usuário autenticado
- Não é mais possível hardcodar 'CLIENTE_01'
- Todas as consultas agora respeitam o tenant do usuário logado

#### API Changes
- Endpoints agora exigem `Authorization: Bearer <token>` header
- Tokens devem ser válidos (assinatura verificada)
- RLS aplicado automaticamente (não é possível acessar dados de outro tenant)

### 🔄 Migration Guide

#### Se você estava usando COMURG:
```diff
- Páginas /dashboard/comurg* foram removidas
- Migre para páginas genéricas de investigações
- Access control agora é por tenant, não por email
```

#### Se você estava usando localStorage para tenant:
```diff
- localStorage.getItem('currentTenant')
+ const { tenantCode } = useTenant()
```

#### Se você tinha mock data em dashboards:
```diff
- const stats = { totalPEP: 247, ... } // mock
+ const stats = await fetch('/api/compliance/stats')
```

### 📚 Documentação

- CHANGELOG.md criado
- SECURITY.md criado
- README.md atualizado
- API.md atualizado com novos endpoints

---

## [1.0.0] - 2024-12-12

### Inicial
- Release inicial do Investigaree
- Features básicas de investigação
- Integração SERPRO (CPF, CNPJ)
- Dashboard Kanban
- Sistema de alertas

---

**Legenda:**
- 🚀 **Adicionado**: Novas features
- 🔄 **Modificado**: Mudanças em features existentes
- ❌ **Removido**: Features removidas
- 🔧 **Corrigido**: Bug fixes
- 🔒 **Segurança**: Vulnerabilidades corrigidas
- 📝 **Documentação**: Mudanças em documentação
