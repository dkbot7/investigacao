# investigaree - Frontend

**Ultima atualizacao**: 29 de Novembro de 2025

Plataforma SaaS de Due Diligence Digital e Investigacao Forense.

## Stack

- **Framework**: Next.js 16.0.3
- **UI Library**: React 19.2.0
- **Linguagem**: TypeScript 5.x
- **Estilizacao**: Tailwind CSS 4.x
- **Componentes**: Shadcn UI
- **Animacoes**: Framer Motion 12.x
- **Autenticacao**: Firebase Auth 12.x
- **Deploy**: Cloudflare Pages

## Estrutura

```
src/
├── app/                    # App Router (paginas)
│   ├── dashboard/          # Area logada
│   │   ├── admin/          # Painel administrativo
│   │   ├── obitos/         # Consulta de obitos
│   │   ├── candidatos/     # Candidatos TSE
│   │   ├── doadores/       # Doadores de campanha
│   │   ├── sancionados/    # CEIS/CNEP
│   │   ├── vinculos/       # Vinculos empresariais
│   │   ├── beneficios/     # Beneficios sociais
│   │   ├── funcionarios/   # Lista de funcionarios
│   │   ├── analitico/      # Relatorios analiticos
│   │   └── exportar/       # Exportacao de dados
│   ├── quemsomos/          # Pagina institucional
│   │   └── ibsen-maciel/   # Perfil do advisor
│   ├── servicos/           # Servicos oferecidos
│   └── ...                 # Outras paginas publicas
├── components/             # Componentes React
│   ├── dashboard/          # Componentes do dashboard
│   ├── landing/            # Componentes da landing page
│   └── ui/                 # Shadcn UI components
├── contexts/               # Context API (Auth, Theme)
├── hooks/                  # Custom Hooks
│   └── useTenant.ts        # Hook de tenant multi-tenant
├── lib/                    # Utilitarios
│   ├── api.ts              # Cliente API
│   └── admin-api.ts        # API administrativa
└── public/                 # Assets estaticos
    └── images/             # Imagens (incluindo fotos do time)
```

## Scripts

```bash
# Desenvolvimento
npm run dev

# Build para producao
npm run build

# Lint
npm run lint

# Type check
npm run typecheck
```

## Variaveis de Ambiente

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# API Backend
NEXT_PUBLIC_API_URL=https://api.investigaree.com.br

# (Local)
NEXT_PUBLIC_API_URL=http://localhost:8787
```

## Features

### Dashboard Multi-Tenant
- Sistema de controle de acesso por tenant
- Cada cliente ve apenas seus dados
- Roles: admin, editor, viewer

### Modulos do Dashboard
- **Obitos**: Verificacao de funcionarios falecidos
- **Candidatos**: Historico de candidaturas TSE
- **Doadores**: Doacoes de campanha eleitoral
- **Sancionados**: CEIS/CNEP (impedidos de contratar)
- **Vinculos**: Participacao societaria em empresas
- **Beneficios**: Auxilio emergencial, Bolsa Familia, etc

### Admin Panel
- Gerenciamento de usuarios
- Controle de acesso a tenants
- Alertas de novos cadastros
- Estatisticas do sistema

### Landing Page
- Secao de servicos
- Advisory Board (Ibsen Maciel)
- Integracao WhatsApp
- Formulario de contato

## Advisory Board

A plataforma conta com o suporte tecnico de:

**Ibsen Rodrigues Maciel**
- Perito Criminal Oficial - PCE-PA (1o lugar concurso 2019)
- Membro do LABCEDF - PC-PA
- Ex-Gerente do Nucleo de Fonetica Forense (2022-2024)
- Diretor Nacional de Pericias - ANPAJ (6.000+ associados)
- Certificacoes: CELLEBRITE UFED, XRY MSAB, Magnet AXIOM

## Deploy

O deploy e automatico via GitHub Actions para Cloudflare Pages.

```bash
# Build local
npm run build

# O deploy acontece automaticamente no push para main
```

## Documentacao

- [Documentacao Tecnica](../docs/README.md)
- [API Reference](../docs/API.md)
- [Sistema Multi-Tenant](../docs/MULTI-TENANT.md)
