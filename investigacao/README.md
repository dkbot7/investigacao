# investigacao

**Última atualização**: 30 de Dezembro de 2025
**Versão**: 2.0.0

Plataforma SaaS de Due Diligence Digital e Investigação Forense com foco em compliance, LGPD e inteligência investigativa.

---

## Stack Tecnologico

| Tecnologia | Versao | Uso |
|------------|--------|-----|
| **Next.js** | 16.0.3 | Framework React com App Router |
| **React** | 19.2.0 | UI Library |
| **TypeScript** | 5.x | Tipagem estatica |
| **Tailwind CSS** | 4.x | Estilizacao utility-first |
| **Shadcn UI** | latest | Componentes acessiveis |
| **Framer Motion** | 12.x | Animacoes |
| **Firebase Auth** | 12.x | Autenticacao de usuarios |
| **React Hook Form** | 7.66.1 | Gerenciamento de formularios |
| **Zod** | 4.1.12 | Validacao de schemas |
| **Deploy** | Cloudflare Pages | Hospedagem |

---

## Estrutura do Projeto

```
src/
├── app/                        # App Router (paginas)
│   ├── page.tsx                # Homepage (landing page)
│   ├── dashboard/              # Area logada multi-tenant
│   │   ├── page.tsx            # Dashboard principal
│   │   ├── admin/              # Painel administrativo
│   │   ├── funcionarios/       # Lista de funcionarios
│   │   ├── obitos/             # Verificacao de obitos
│   │   ├── candidatos/         # Candidatos TSE
│   │   ├── doadores/           # Doadores de campanha
│   │   ├── sancionados/        # CEIS/CNEP
│   │   ├── ofac/               # Lista OFAC (sancoes internacionais)
│   │   ├── vinculos/           # Vinculos empresariais
│   │   ├── beneficios/         # Beneficios sociais
│   │   ├── analitico/          # Graficos e estatisticas
│   │   ├── relatorios/         # Relatorios de due diligence
│   │   └── exportar/           # Exportacao CSV/Excel
│   ├── quemsomos/              # Pagina institucional
│   │   ├── page.tsx            # Equipe
│   │   ├── dani-kaloi/         # Perfil fundadora
│   │   └── ibsen-maciel/       # Perfil advisor
│   ├── servicos/               # Catalogo de servicos
│   ├── contato/                # Formulario de contato
│   ├── sobre/                  # Sobre a empresa
│   ├── loginadmin/             # Login administrativo
│   ├── privacidade/            # Politica de privacidade
│   ├── termos/                 # Termos de uso
│   ├── cookies/                # Politica de cookies
│   └── faq/                    # Perguntas frequentes
│
├── components/                 # Componentes React
│   ├── dashboard/              # Componentes do dashboard
│   │   ├── Sidebar.tsx
│   │   ├── StatsCard.tsx
│   │   ├── DataTable.tsx
│   │   └── ...
│   ├── landing/                # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Team.tsx
│   │   └── ...
│   ├── ui/                     # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── auth/                   # Componentes de autenticacao
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       └── ...
│
├── contexts/                   # Context API
│   ├── AuthContext.tsx         # Estado de autenticacao
│   └── ThemeContext.tsx        # Tema (dark/light)
│
├── hooks/                      # Custom Hooks
│   ├── useTenant.ts            # Hook multi-tenant
│   ├── useAuth.ts              # Hook de autenticacao
│   └── useApi.ts               # Hook para chamadas API
│
├── lib/                        # Utilitarios
│   ├── api.ts                  # Cliente API autenticado
│   ├── admin-api.ts            # API administrativa
│   ├── user-api.ts             # API do usuario
│   ├── firebase.ts             # Inicializacao Firebase
│   └── utils.ts                # Funcoes auxiliares
│
└── public/                     # Assets estaticos
    ├── images/                 # Imagens (fotos do time, etc)
    ├── favicon.ico
    └── ...
```

---

## Scripts Disponiveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build para producao
npm run build

# Iniciar servidor de producao
npm run start

# Linting
npm run lint

# Type checking
npm run typecheck
```

---

## Variaveis de Ambiente

Crie um arquivo `.env.local` na pasta `investigacao/`:

```env
# Firebase Auth
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto

# API Backend
NEXT_PUBLIC_API_URL=https://api.investigacao.com.br

# Desenvolvimento local
# NEXT_PUBLIC_API_URL=http://localhost:8787
```

---

## Features Principais

### Dashboard Multi-Tenant
- Sistema de controle de acesso por tenant (cliente)
- Cada cliente ve apenas seus dados
- Roles: admin, editor, viewer
- Tela de "Aguardando acesso" para usuarios novos

### Modulos do Dashboard

| Modulo | Descricao |
|--------|-----------|
| **Funcionarios** | Lista completa com filtros e busca |
| **Obitos** | Funcionarios falecidos verificados |
| **Candidatos** | Historico de candidaturas TSE |
| **Doadores** | Doacoes de campanha eleitoral |
| **Sancionados** | CEIS/CNEP (impedidos de contratar) |
| **OFAC** | Lista OFAC (sancoes internacionais) |
| **Vinculos** | Participacao societaria em empresas |
| **Beneficios** | Auxilio emergencial, BPC, etc |
| **Analitico** | Graficos e estatisticas |
| **Relatorios** | Due diligence reports |
| **Exportar** | Download CSV/Excel |

### Admin Panel
- Gerenciamento de usuarios
- Controle de acesso a tenants
- Alertas de novos cadastros
- Estatisticas do sistema

### Landing Page
- Design navy/gold profissional
- Secao de servicos
- Advisory Board
- Integracao WhatsApp
- Formulario de contato

---

## Advisory Board

A plataforma conta com o suporte tecnico de:

**Ibsen Rodrigues Maciel**
- Perito Criminal Oficial - PCE-PA (1o lugar concurso 2019)
- Membro do LABCEDF - Laboratorio de Computacao e Extracao de Dados Forenses
- Ex-Gerente do Nucleo de Fonetica Forense (2022-2024)
- Diretor Nacional de Pericias - ANPAJ (6.000+ associados)
- Certificacoes: CELLEBRITE UFED, XRY MSAB, Magnet AXIOM

---

## Autenticacao

O sistema usa Firebase Auth para autenticacao:

```typescript
// contexts/AuthContext.tsx
const { user, loading, signIn, signOut } = useAuth();

// Verificar se esta logado
if (!user) {
  redirect('/login');
}

// Obter token para API
const token = await user.getIdToken();
```

### Hook useTenant

```typescript
// hooks/useTenant.ts
const { tenantCode, currentTenant, userRole, hasAccess, loading, error } = useTenant();

if (loading) return <LoadingSpinner />;
if (!hasAccess) return <NoAccessScreen />;

return <Dashboard tenant={currentTenant} />;
```

---

## Segurança

### Row Level Security (RLS)

Todas as tabelas multi-tenant no D1 database têm RLS habilitado:
- ✅ `users` - Isolamento por tenant_id
- ✅ `user_investigacoes` - Isolamento por tenant_id
- ✅ `sancoes` - Isolamento por tenant_id
- ✅ `ofac_matches` - Isolamento por tenant_id

**Garantias:**
- Usuários nunca veem dados de outros tenants
- Tentativas de acesso cross-tenant retornam 403 Forbidden
- RLS garante isolamento no nível do banco de dados
- Admins podem ver todos os tenants (para suporte)

### Validação JWT Firebase

**Processo completo:**
1. Cliente envia `Authorization: Bearer <token>`
2. Backend extrai token do header
3. Backend busca chaves públicas do Google
4. Backend valida assinatura do JWT usando chave pública
5. Backend verifica claims obrigatórios (iss, aud, exp, iat)
6. Backend busca tenant_id e role do usuário no D1
7. Backend seta contexto RLS
8. Query executada com RLS aplicado

### LGPD Compliance

- ✅ Consentimentos armazenados em D1 (5 anos)
- ✅ Hash de IP para privacidade (LGPD Art. 13)
- ✅ Registro de finalidades e versão do texto
- ✅ API de solicitação de dados (acesso/exclusão/portabilidade)
- ✅ Stats de compliance LGPD

**Mais detalhes:** Veja [SECURITY.md](./SECURITY.md)

---

## Deploy

O deploy e automatico via GitHub Actions para Cloudflare Pages.

### Build Manual

```bash
# Build
npm run build

# O output fica em out/ (export estatico)
```

### Configuracao Next.js

```typescript
// next.config.ts
const nextConfig = {
  output: 'export',  // Static export para Cloudflare Pages
  images: {
    unoptimized: true
  }
};
```

---

## Documentacao Relacionada

| Documento | Descricao |
|-----------|-----------|
| [docs/README.md](../docs/README.md) | Documentacao tecnica completa |
| [docs/API.md](../docs/API.md) | Referencia da API |
| [docs/MULTI-TENANT.md](../docs/MULTI-TENANT.md) | Sistema multi-tenant |
| [docs/openapi.yaml](../docs/openapi.yaml) | Especificacao OpenAPI |

---

## Troubleshooting

### Erro de CORS

Verifique se `NEXT_PUBLIC_API_URL` esta correto e se o backend esta rodando.

### Token invalido

1. Limpe o cache do navegador
2. Faca logout e login novamente
3. Verifique se Firebase esta configurado corretamente

### Tela de "Aguardando acesso"

Usuario novo ainda nao tem associacao com tenant. Um admin precisa liberar via:
```
POST /api/admin/grant-access
```

---

**Mantido por**: Equipe investigacao
# Test
