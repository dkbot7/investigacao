# investigaree - Documentacao Tecnica

**Ultima atualizacao**: 30 de Novembro de 2025
**Versao**: 1.0.0

---

## Indice

1. [Visao Geral](#visao-geral)
2. [Arquitetura](#arquitetura)
3. [Stack Tecnologico](#stack-tecnologico)
4. [Estrutura de Diretorios](#estrutura-de-diretorios)
5. [API Backend](#api-backend)
6. [Banco de Dados](#banco-de-dados)
7. [Autenticacao](#autenticacao)
8. [Sistema Multi-Tenant](#sistema-multi-tenant)
9. [APIs Externas](#apis-externas)
10. [Desenvolvimento](#desenvolvimento)
11. [Deploy](#deploy)
12. [Documentacao Adicional](#documentacao-adicional)

---

## Visao Geral

**investigaree** e uma plataforma SaaS de Due Diligence Digital e Investigacao Forense. Permite verificacao de integridade de pessoas e empresas atraves de cruzamento de dados de multiplas fontes publicas brasileiras.

### Principais Funcionalidades

| Modulo | Descricao |
|--------|-----------|
| **Verificacao de Obitos** | Identifica funcionarios falecidos ainda na folha |
| **Candidaturas TSE** | Historico de candidaturas eleitorais |
| **Doacoes de Campanha** | Rastreamento de doacoes a candidatos |
| **Sancoes CEIS/CNEP** | Empresas e pessoas impedidas de contratar |
| **Sancoes OFAC** | Lista de sancoes internacionais (EUA) |
| **Vinculos Empresariais** | Participacao societaria em empresas |
| **Beneficios Sociais** | Auxilio Emergencial, BPC, Bolsa Familia |
| **Relatorios PDF** | Geracao automatica de relatorios |

### Advisory Board

A plataforma conta com o suporte tecnico de **Ibsen Rodrigues Maciel**, referencia nacional em Pericia Forense Computacional:

- Perito Criminal Oficial - Policia Cientifica do Estado do Para (PCE-PA)
- Membro do LABCEDF - Laboratorio de Computacao e Extracao de Dados Forenses
- Diretor Nacional de Pericias em Computacao Forense - ANPAJ (6.000+ associados)
- Ex-Gerente do Nucleo de Fonetica Forense e Extracao de Dados (2022-2024)
- Certificacoes: CELLEBRITE UFED, XRY MSAB, Magnet AXIOM

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
│                        Next.js 16.0.3 + React 19.2.0                        │
│                        Cloudflare Pages                                      │
│                      investigaree.com.br                                     │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               BACKEND                                        │
│                       Cloudflare Workers + Hono 4.6.0                       │
│                      api.investigaree.com.br                                │
│                                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │    Auth    │  │   Tenant   │  │   Admin    │  │ Consultas  │            │
│  │   Routes   │  │    Data    │  │   Routes   │  │   APIs     │            │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Leads    │  │  Chatbot   │  │  Reports   │  │  Payments  │            │
│  │   Routes   │  │   (AI)     │  │   (PDF)    │  │  (Stripe)  │            │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────┐        │
│  │  Middleware: Auth (Firebase) | Rate Limit (KV) | CORS          │        │
│  └────────────────────────────────────────────────────────────────┘        │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│       D1        │   │       R2        │   │       KV        │
│    (SQLite)     │   │    (Storage)    │   │  (Rate Limit)   │
│   Cloudflare    │   │   Cloudflare    │   │   Cloudflare    │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

---

## Stack Tecnologico

### Frontend

| Tecnologia | Versao | Uso |
|------------|--------|-----|
| Next.js | 16.0.3 | Framework React com App Router |
| React | 19.2.0 | UI Library |
| TypeScript | 5.x | Tipagem estatica |
| Tailwind CSS | 4.x | Estilizacao utility-first |
| Framer Motion | 12.23.24 | Animacoes |
| Firebase | 12.6.0 | Autenticacao de usuarios |
| Radix UI | latest | Componentes acessiveis (Accordion, Dialog, Tabs) |
| React Hook Form | 7.66.1 | Gerenciamento de formularios |
| Zod | 4.1.12 | Validacao de schemas |
| Lucide React | 0.554.0 | Icones |
| next-themes | 0.4.6 | Dark/Light mode |

### Backend

| Tecnologia | Versao | Uso |
|------------|--------|-----|
| Cloudflare Workers | - | Runtime serverless |
| Hono | 4.6.0 | Web framework leve e rapido |
| Wrangler | 4.42.0 | CLI Cloudflare |
| D1 | - | Banco SQLite nativo Cloudflare |
| R2 | - | Object storage (PDFs, relatorios) |
| KV | - | Cache e rate limiting |
| Browser Rendering | - | Scraping server-side |
| Zod | 3.23.0 | Validacao de inputs |
| PDFKit | 0.17.2 | Geracao de PDFs |
| XLSX | 0.18.5 | Processamento de Excel |

### Servicos Externos

| Servico | Uso |
|---------|-----|
| Firebase Auth | Autenticacao de usuarios |
| Stripe | Processamento de pagamentos |
| Resend | Email transacional (notificacoes) |
| Automacao | Consultas e analise avancada |
| Infosimples | Consultas CPF/CNPJ/Obito |
| Portal Transparencia | Beneficios, CEIS, CNEP, CEAF |
| TSE | Candidaturas e doacoes |
| BrasilAPI | CNPJ/CEP gratuito |

---

## Estrutura de Diretorios

```
investigaree/
│
├── investigaree/                 # Frontend Next.js
│   ├── src/
│   │   ├── app/                 # App Router (paginas)
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── dashboard/       # Area logada multi-tenant
│   │   │   │   ├── page.tsx     # Dashboard principal
│   │   │   │   ├── admin/       # Painel administrativo
│   │   │   │   ├── funcionarios/
│   │   │   │   ├── obitos/
│   │   │   │   ├── candidatos/
│   │   │   │   ├── doadores/
│   │   │   │   ├── sancionados/
│   │   │   │   ├── vinculos/
│   │   │   │   ├── beneficios/
│   │   │   │   ├── ofac/        # Sancoes OFAC
│   │   │   │   ├── analitico/
│   │   │   │   ├── relatorios/  # Geracao de relatorios
│   │   │   │   └── exportar/
│   │   │   ├── quemsomos/       # Pagina institucional
│   │   │   │   ├── dani-kaloi/
│   │   │   │   └── ibsen-maciel/
│   │   │   ├── servicos/        # Catalogo de servicos
│   │   │   ├── contato/         # Formulario de contato
│   │   │   ├── sobre/           # Sobre a empresa
│   │   │   ├── loginadmin/      # Login administrativo
│   │   │   ├── privacidade/     # Politica de privacidade
│   │   │   ├── termos/          # Termos de uso
│   │   │   ├── cookies/         # Politica de cookies
│   │   │   └── faq/             # Perguntas frequentes
│   │   │
│   │   ├── components/          # Componentes React
│   │   │   ├── dashboard/       # Componentes do dashboard
│   │   │   │   ├── FichaFuncionario.tsx
│   │   │   │   └── NoAccessScreen.tsx
│   │   │   ├── landing/         # Landing page sections
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── AdvisoryBoard.tsx
│   │   │   │   ├── ProtectionAreas.tsx
│   │   │   │   ├── ServicePortals.tsx
│   │   │   │   ├── SocialProof.tsx
│   │   │   │   ├── Pricing.tsx
│   │   │   │   └── FinalCTA.tsx
│   │   │   ├── auth/            # Autenticacao
│   │   │   │   ├── LoginModal.tsx
│   │   │   │   └── RegisterModal.tsx
│   │   │   ├── ui/              # Radix UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── accordion.tsx
│   │   │   │   └── ...
│   │   │   ├── WhatsAppWidget.tsx
│   │   │   ├── WhatsAppButton.tsx
│   │   │   ├── WhatsAppLeadModal.tsx
│   │   │   ├── CookieBanner.tsx
│   │   │   ├── Providers.tsx
│   │   │   └── ClientWidgets.tsx
│   │   │
│   │   ├── hooks/               # Custom Hooks
│   │   │   ├── useTenant.ts     # Hook multi-tenant
│   │   │   ├── useDashboardData.ts
│   │   │   └── useUserData.ts
│   │   │
│   │   └── lib/                 # Utilitarios
│   │       ├── api.ts           # Cliente API autenticado
│   │       ├── admin-api.ts     # API administrativa
│   │       ├── user-api.ts      # API do usuario
│   │       ├── firebase.ts      # Inicializacao Firebase
│   │       └── utils.ts         # Funcoes auxiliares
│   │
│   └── public/                  # Assets estaticos
│
├── workers/                      # Backend Cloudflare Workers
│   ├── index.ts                 # Entry point Hono (router principal)
│   ├── api/                     # Endpoints da API
│   │   ├── auth.ts              # Autenticacao + registro
│   │   ├── admin.ts             # Gerenciamento de usuarios/tenants
│   │   ├── tenant-data.ts       # Dados multi-tenant
│   │   ├── user-data.ts         # Dados individuais do usuario
│   │   ├── user.ts              # Perfil do usuario
│   │   ├── leads.ts             # Captura de leads
│   │   ├── chatbot.ts           # Consultor automatizado
│   │   ├── reports.ts           # Geracao de relatorios PDF
│   │   ├── payments.ts          # Stripe integration
│   │   ├── webhooks.ts          # Webhooks (Stripe, etc)
│   │   ├── investigation.ts     # Pedidos de investigacao
│   │   ├── lgpd.ts              # Direitos LGPD
│   │   ├── consultas-publicas.ts     # APIs gratuitas
│   │   ├── consultas-infosimples.ts  # APIs Infosimples
│   │   └── consultas-transparencia.ts # Portal Transparencia
│   ├── middleware/              # Middlewares
│   │   ├── auth.ts              # Validacao Firebase
│   │   └── rate-limit.ts        # Limitacao por IP
│   ├── services/                # Servicos externos
│   │   └── notifications.ts     # Email via Resend
│   ├── cron/                    # Tarefas agendadas
│   │   └── process-reports.ts   # Processar relatorios pendentes
│   └── migrations/              # SQL migrations (001-009)
│
├── APIs/                         # Documentacao APIs externas
│   ├── CATALOGO_APIS_INVESTIGACAO.md
│   ├── SERPRO/
│   ├── INFOSIMPLES/
│   ├── ESCAVADOR/
│   ├── PORTAL_TRANSPARENCIA/
│   ├── TSE/
│   ├── CGU/
│   └── exemplos_python/
│
├── clientes/                     # Dados de clientes
│   ├── CLIENTE_01/              # COMURG
│   └── CLIENTE_02/
│
├── docs/                         # Documentacao tecnica
│   ├── README.md                # Este arquivo
│   ├── API.md                   # Referencia da API
│   ├── MULTI-TENANT.md          # Sistema multi-tenant
│   ├── DATABASE_ER_DIAGRAM.md   # Diagrama ER (Mermaid)
│   ├── MIGRATIONS_CHANGELOG.md  # Historico de migrations
│   └── openapi.yaml             # Especificacao OpenAPI 3.1
│
├── scripts/                      # Scripts de automacao
├── wrangler.toml                 # Config Cloudflare Workers
├── .env.example                  # Template de variaveis
├── package.json                  # Dependencias backend/raiz
└── DOCUMENTATION_INDEX.md        # Indice central de docs
```

---

## API Backend

### Endpoints Publicos (sem autenticacao)

| Rota | Metodo | Descricao |
|------|--------|-----------|
| `/health` | GET | Health check |
| `/` | GET | Info da API |
| `/api/auth/register` | POST | Registrar usuario |
| `/api/auth/sync` | POST | Sincronizar usuario |
| `/api/leads` | POST | Capturar lead |
| `/api/chatbot/message` | POST | Consultas automatizadas |
| `/api/investigation` | POST | Solicitar investigacao |
| `/api/consultas/cep/:cep` | GET | Consultar CEP |
| `/api/consultas/cnpj/:cnpj` | GET | Consultar CNPJ |
| `/api/infosimples/*` | GET/POST | Consultas Infosimples |
| `/api/transparencia/*` | GET | Portal Transparencia |
| `/api/webhooks/stripe` | POST | Webhook Stripe |

### Endpoints Autenticados (Bearer Token)

| Rota | Metodo | Descricao |
|------|--------|-----------|
| `/api/auth/me` | GET | Usuario atual |
| `/api/user/profile` | GET/PUT | Perfil do usuario |
| `/api/tenant/info` | GET | Info do tenant |
| `/api/tenant/dashboard` | GET | Dados do dashboard |
| `/api/tenant/funcionarios` | GET | Lista funcionarios |
| `/api/tenant/funcionario/:id` | GET | Detalhes funcionario |
| `/api/tenant/obitos` | GET | Lista obitos |
| `/api/tenant/candidatos` | GET | Lista candidatos |
| `/api/tenant/doadores` | GET | Lista doadores |
| `/api/tenant/sancionados` | GET | Lista sancionados |
| `/api/tenant/vinculos` | GET | Lista vinculos |
| `/api/tenant/beneficios` | GET | Lista beneficios |
| `/api/tenant/export/:type` | GET | Exportar CSV |
| `/api/userdata/*` | GET/POST | Dados individuais |
| `/api/reports/*` | GET/POST | Relatorios PDF |
| `/api/payments/*` | GET/POST | Pagamentos |
| `/api/lgpd/*` | GET/POST | Direitos LGPD |
| `/api/admin/*` | GET/POST/DELETE | Administrativo |

Documentacao completa em **[API.md](./API.md)** e **[openapi.yaml](./openapi.yaml)**.

---

## Banco de Dados

O banco de dados utiliza Cloudflare D1 (SQLite). Para detalhes completos:

- **[DATABASE_ER_DIAGRAM.md](./DATABASE_ER_DIAGRAM.md)** - Diagrama visual
- **[MIGRATIONS_CHANGELOG.md](./MIGRATIONS_CHANGELOG.md)** - Historico

### Tabelas Principais

#### Core (Autenticacao)

| Tabela | Descricao |
|--------|-----------|
| `users` | Usuarios sincronizados com Firebase |
| `tenants` | Clientes/organizacoes |
| `user_tenants` | Controle de acesso usuario-tenant |

#### Dados do Tenant

| Tabela | Descricao |
|--------|-----------|
| `tenant_funcionarios` | Base de funcionarios |
| `tenant_candidaturas` | Candidaturas eleitorais TSE |
| `tenant_doacoes` | Doacoes de campanha |
| `tenant_vinculos` | Vinculos empresariais (QSA) |
| `tenant_sancoes` | Sancoes CEIS/CNEP/OFAC |
| `tenant_obitos` | Obitos verificados |
| `tenant_beneficios` | Beneficios sociais |

#### Dados do Usuario Individual

| Tabela | Descricao |
|--------|-----------|
| `user_funcionarios` | Funcionarios do usuario |
| `user_obitos` | Obitos do usuario |
| `user_candidaturas` | Candidaturas do usuario |
| `user_doacoes` | Doacoes do usuario |
| `user_vinculos` | Vinculos do usuario |
| `user_sancoes` | Sancoes do usuario |
| `user_beneficios` | Beneficios do usuario |
| `user_settings` | Configuracoes do usuario |

#### Administrativo

| Tabela | Descricao |
|--------|-----------|
| `admin_alerts` | Sistema de alertas |
| `admin_notification_settings` | Preferencias de notificacao |
| `whatsapp_leads` | Leads do WhatsApp |

---

## Autenticacao

### Fluxo de Login

```
1. Usuario entra email/senha no frontend
2. Firebase Auth valida credenciais
3. Firebase retorna ID Token (JWT)
4. Frontend armazena token em memoria (nao localStorage)
5. Requisicoes incluem header: Authorization: Bearer <token>
6. Backend valida token com Firebase REST API
7. Backend busca usuario no D1 e verifica permissoes tenant
```

### Middleware de Auth

```typescript
// workers/middleware/auth.ts
export async function authMiddleware(c, next) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');

  const decoded = await verifyFirebaseToken(token, c.env);

  if (!decoded) {
    return c.json({ error: 'Token invalido' }, 401);
  }

  c.set('firebaseUid', decoded.uid);
  c.set('userEmail', decoded.email);

  await next();
}
```

---

## Sistema Multi-Tenant

O sistema permite multiplos clientes com isolamento total de dados.

Documentacao completa em **[MULTI-TENANT.md](./MULTI-TENANT.md)**.

### Resumo

- Usuarios sao associados a tenants via `user_tenants`
- Cada requisicao verifica permissao do usuario
- Dados sao filtrados por `tenant_id`
- Novos usuarios sem associacao veem tela de "Aguardando"
- Admin pode conceder/revogar acessos via API

### Roles (Papeis)

| Role | Permissoes |
|------|------------|
| `admin` | Acesso total: visualizar, editar, exportar, gerenciar usuarios |
| `editor` | Visualizar, editar e exportar dados |
| `viewer` | Apenas visualizacao |

---

## APIs Externas

Catalogo completo em **[../APIs/CATALOGO_APIS_INVESTIGACAO.md](../APIs/CATALOGO_APIS_INVESTIGACAO.md)**.

### APIs Utilizadas

| API | Tipo | Uso Principal | Custo |
|-----|------|---------------|-------|
| **Infosimples** | Paga | CPF/CNPJ/Obito | R$ 0,20-0,24/consulta |
| **Portal Transparencia** | Gratuita | Beneficios, CEIS/CNEP/CEAF | Gratis |
| **BrasilAPI** | Gratuita | CNPJ, CEP | Gratis |
| **TSE Dados Abertos** | Gratuita | Candidaturas, Doacoes | Gratis |
| **CGU** | Gratuita | CEIS/CNEP (arquivos) | Gratis |
| **SERPRO** | Paga | CPF/CNPJ oficial | R$ 0,66/consulta |
| **Escavador** | Paga | Processos judiciais | R$ 0,10-0,20/processo |
| **BigDataCorp** | Paga | Dados enriquecidos | R$ 0,05/consulta |

### Exemplos de Codigo

- **JavaScript**: `APIs/*/exemplo-*.js`
- **Python**: `APIs/exemplos_python/`
- **TypeScript**: `APIs/*/consultas-*.ts`

---

## Desenvolvimento

### Pre-requisitos

- Node.js 18+
- npm ou pnpm
- Wrangler CLI 4.x (`npm i -g wrangler`)
- Conta Cloudflare

### Setup Local

```bash
# 1. Clonar repositorio
git clone <repo>
cd investigaree

# 2. Instalar dependencias
npm install
cd investigaree && npm install

# 3. Configurar variaveis de ambiente
cp .env.example .env.local

# 4. Criar banco D1 local
wrangler d1 create investigaree-db

# 5. Rodar migrations
for file in workers/migrations/*.sql; do
  wrangler d1 execute investigaree-db --local --file="$file"
done

# 6. Iniciar desenvolvimento
cd investigaree && npm run dev    # Frontend (porta 3000)
wrangler dev                      # Backend (porta 8787)
```

### Variaveis de Ambiente

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# API
NEXT_PUBLIC_API_URL=http://localhost:8787

# Secrets (wrangler secret put)
FIREBASE_WEB_API_KEY=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=
INFOSIMPLES_API_TOKEN=
PORTAL_TRANSPARENCIA_API_KEY=
```

---

## Deploy

### Frontend (Cloudflare Pages)

```bash
cd investigaree
npm run build
npm run deploy
```

### Backend (Cloudflare Workers)

```bash
# Configurar secrets
wrangler secret put FIREBASE_WEB_API_KEY
wrangler secret put RESEND_API_KEY
wrangler secret put STRIPE_SECRET_KEY
# ... outros secrets

# Deploy
wrangler deploy
```

### CI/CD (GitHub Actions)

Workflows em `.github/workflows/`:
- `deploy.yml` - Deploy automatico do frontend
- `deploy-api.yml` - Deploy automatico do backend

---

## Documentacao Adicional

| Documento | Descricao |
|-----------|-----------|
| **[API.md](./API.md)** | Referencia completa da API REST |
| **[MULTI-TENANT.md](./MULTI-TENANT.md)** | Sistema multi-tenant detalhado |
| **[DATABASE_ER_DIAGRAM.md](./DATABASE_ER_DIAGRAM.md)** | Diagrama ER visual (Mermaid) |
| **[MIGRATIONS_CHANGELOG.md](./MIGRATIONS_CHANGELOG.md)** | Historico de alteracoes do banco |
| **[openapi.yaml](./openapi.yaml)** | Especificacao OpenAPI 3.1 |
| **[../APIs/CATALOGO_APIS_INVESTIGACAO.md](../APIs/CATALOGO_APIS_INVESTIGACAO.md)** | Catalogo de APIs externas |
| **[../APIs/exemplos_python/README.md](../APIs/exemplos_python/README.md)** | Exemplos em Python |
| **[../DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md)** | Indice central de documentacao |

---

## Seguranca

### Boas Praticas Implementadas

1. **Autenticacao**: Firebase Auth com validacao de token JWT
2. **Autorizacao**: Verificacao de tenant em cada requisicao
3. **Rate Limiting**: KV-based por IP (rotas /api/* e /health)
4. **CORS**: Configurado para dominios especificos
5. **Validacao**: Zod em todos os inputs
6. **Secrets**: Armazenados no Cloudflare (nunca no codigo)
7. **HTTPS**: Forcado em todas as conexoes

### Dominios CORS Permitidos

```
https://investigaree.com.br
https://www.investigaree.com.br
https://investigaree.pages.dev
https://*.investigaree.pages.dev
http://localhost:5173 (dev)
```

---

## Suporte

- **Email**: contato@investigaree.com.br
- **WhatsApp**: Link no site
- **Issues**: GitHub Issues

---

**Documento mantido por**: Equipe investigaree
**Ultima atualizacao**: 30 de Novembro de 2025
