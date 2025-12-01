# investigaree - Indice de Documentacao

**Atualizado em**: 30 de Novembro de 2025

Este documento serve como indice central para toda a documentacao do projeto investigaree.

---

## Documentacao Tecnica Principal

| Documento | Localizacao | Descricao |
|-----------|-------------|-----------|
| **README Tecnico** | [docs/README.md](./docs/README.md) | Visao geral, arquitetura, stack e setup |
| **API Reference** | [docs/API.md](./docs/API.md) | Referencia completa da API REST |
| **OpenAPI Spec** | [docs/openapi.yaml](./docs/openapi.yaml) | Especificacao OpenAPI 3.1 (Swagger) |
| **Multi-Tenant** | [docs/MULTI-TENANT.md](./docs/MULTI-TENANT.md) | Sistema de isolamento por cliente |
| **Diagrama ER** | [docs/DATABASE_ER_DIAGRAM.md](./docs/DATABASE_ER_DIAGRAM.md) | Diagrama de entidades (Mermaid) |
| **Migrations** | [docs/MIGRATIONS_CHANGELOG.md](./docs/MIGRATIONS_CHANGELOG.md) | Historico de alteracoes do banco |

---

## Frontend (Next.js)

| Documento | Localizacao | Descricao |
|-----------|-------------|-----------|
| **README Frontend** | [investigaree/README.md](./investigaree/README.md) | Setup e estrutura do frontend |
| **Componentes** | [investigaree/src/components/](./investigaree/src/components/) | Componentes React |

---

## APIs Externas

| Documento | Localizacao | Descricao |
|-----------|-------------|-----------|
| **Catalogo Geral** | [APIs/CATALOGO_APIS_INVESTIGACAO.md](./APIs/CATALOGO_APIS_INVESTIGACAO.md) | Todas as APIs com precos e exemplos |
| **SERPRO** | [APIs/SERPRO/](./APIs/SERPRO/) | APIs oficiais do governo (CPF/CNPJ) |
| **Infosimples** | [APIs/INFOSIMPLES/](./APIs/INFOSIMPLES/) | CPF, CNPJ, Obito, Processos |
| **Escavador** | [APIs/ESCAVADOR/](./APIs/ESCAVADOR/) | Processos judiciais |
| **Portal Transparencia** | [APIs/PORTAL_TRANSPARENCIA/](./APIs/PORTAL_TRANSPARENCIA/) | Beneficios e sancoes |
| **TSE** | [APIs/TSE/](./APIs/TSE/) | Candidaturas e doacoes |
| **CGU** | [APIs/CGU/](./APIs/CGU/) | CEIS/CNEP (sancoes) |
| **Exemplos Python** | [APIs/exemplos_python/](./APIs/exemplos_python/) | Codigo Python para consultas |

---

## Scripts e Automacao

| Documento | Localizacao | Descricao |
|-----------|-------------|-----------|
| **README Scripts** | [scripts/README.md](./scripts/README.md) | Setup automatizado (GitHub, Cloudflare) |

---

## Backend (Cloudflare Workers)

| Arquivo | Localizacao | Descricao |
|---------|-------------|-----------|
| **Entry Point** | [workers/index.ts](./workers/index.ts) | Roteamento principal Hono |
| **Auth Routes** | [workers/api/auth.ts](./workers/api/auth.ts) | Registro e sincronizacao |
| **Admin Routes** | [workers/api/admin.ts](./workers/api/admin.ts) | Gerenciamento de usuarios |
| **Tenant Data** | [workers/api/tenant-data.ts](./workers/api/tenant-data.ts) | Endpoints de dados |
| **Migrations** | [workers/migrations/](./workers/migrations/) | SQL migrations (001-009) |

---

## Banco de Dados (D1/SQLite)

### Migrations

| Migration | Arquivo | Descricao |
|-----------|---------|-----------|
| 003 | [003_whatsapp_leads.sql](./workers/migrations/003_whatsapp_leads.sql) | Leads WhatsApp |
| 004 | [004_tenant_data.sql](./workers/migrations/004_tenant_data.sql) | Schema multi-tenant |
| 005 | [005_user_tenants.sql](./workers/migrations/005_user_tenants.sql) | Controle de acesso |
| 006 | [006_seed_admin_access.sql](./workers/migrations/006_seed_admin_access.sql) | Seed CLIENTE_01 |
| 007 | [007_admin_alerts.sql](./workers/migrations/007_admin_alerts.sql) | Sistema de alertas |
| 008 | [008_create_admin_users.sql](./workers/migrations/008_create_admin_users.sql) | Admins master |
| 009 | [009_user_data_individual.sql](./workers/migrations/009_user_data_individual.sql) | Dados por usuario |

---

## Configuracao

| Arquivo | Localizacao | Descricao |
|---------|-------------|-----------|
| **Wrangler** | [wrangler.toml](./wrangler.toml) | Config Cloudflare Workers |
| **Env Example** | [.env.example](./.env.example) | Template de variaveis |
| **Package.json** | [package.json](./package.json) | Dependencias raiz |

---

## Documentacao de Negocios

| Documento | Localizacao | Descricao |
|-----------|-------------|-----------|
| **Analise Concorrentes** | [ANALISE_CONCORRENTES.md](./ANALISE_CONCORRENTES.md) | Benchmark de mercado |
| **Pricing** | [PRICING_REAL_MERCADO_BRASIL_2025.md](./PRICING_REAL_MERCADO_BRASIL_2025.md) | Estrategia de precos |
| **Servicos** | [CARDAPIO_SERVICOS_INVESTIDORES.md](./CARDAPIO_SERVICOS_INVESTIDORES.md) | Catalogo de servicos |
| **Proposta B2B** | [PROPOSTA_COMERCIAL_B2B.md](./PROPOSTA_COMERCIAL_B2B.md) | Template de proposta |

---

## Clientes

| Cliente | Localizacao | Descricao |
|---------|-------------|-----------|
| **CLIENTE_01** | [clientes/CLIENTE_01/](./clientes/CLIENTE_01/) | COMURG - Dados e scripts |
| **CLIENTE_02** | [clientes/CLIENTE_02/](./clientes/CLIENTE_02/) | (Futuro) |

---

## Links Rapidos

### Desenvolvimento
```bash
# Frontend
cd investigaree && npm run dev

# Backend
wrangler dev

# Build
npm run build
```

### Deploy
```bash
# Frontend (Cloudflare Pages)
cd investigaree && npm run build

# Backend (Cloudflare Workers)
wrangler deploy
```

### Documentacao da API
- **Swagger UI**: Importar `docs/openapi.yaml`
- **Postman**: Importar `docs/openapi.yaml`

---

## Contato

- **Email**: contato@investigaree.com.br
- **Site**: https://investigaree.com.br

---

**Mantido por**: Equipe investigaree
