# 🚀 Investigaree Backend API

Backend API para integração com SERPRO e gerenciamento de dados.

## 📁 Estrutura do Projeto

```
backend/
├── workers/
│   ├── api/                    # Cloudflare Worker (API HTTP)
│   │   ├── src/
│   │   │   ├── index.ts        # Entry point
│   │   │   ├── types/          # TypeScript types
│   │   │   ├── services/       # Business logic
│   │   │   │   └── serpro/     # SERPRO API integrations
│   │   │   ├── middleware/     # Express-like middlewares
│   │   │   ├── routes/         # HTTP routes
│   │   │   └── utils/          # Utilities
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── wrangler.toml
│   └── database/               # D1 Database
│       ├── schema.sql          # Database schema
│       └── seeds/              # Initial data
└── API_DOCUMENTATION.md        # Full API docs
```

## 🛠️ Tecnologias

- **Runtime:** Cloudflare Workers (V8 isolates)
- **Framework:** Hono (fast web framework)
- **Database:** Cloudflare D1 (SQLite)
- **Validation:** Zod
- **Language:** TypeScript

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou pnpm
- Wrangler CLI

### Instalação

```bash
cd backend/workers/api
npm install
```

### Desenvolvimento Local

```bash
npm run dev
```

API estará disponível em `http://localhost:8787`

### Scripts Disponíveis

```bash
npm run dev              # Start local dev server
npm run deploy           # Deploy to production
npm run tail             # View real-time logs
npm run db:create        # Create D1 database
npm run db:migrate       # Run migrations
npm run db:migrate:local # Run migrations locally
```

## 🔐 Configuração

### Variáveis de Ambiente

Configure os secrets do Cloudflare:

```bash
# SERPRO API Credentials
npx wrangler secret put SERPRO_CPF_CONSUMER_KEY
npx wrangler secret put SERPRO_CPF_CONSUMER_SECRET
npx wrangler secret put SERPRO_CNPJ_CONSUMER_KEY
npx wrangler secret put SERPRO_CNPJ_CONSUMER_SECRET
npx wrangler secret put SERPRO_DIVIDA_ATIVA_CONSUMER_KEY
npx wrangler secret put SERPRO_DIVIDA_ATIVA_CONSUMER_SECRET
# ... mais 6 APIs
```

### Database Setup

```bash
# Criar database
npm run db:create

# Executar migrations
npm run db:migrate

# Verificar
npx wrangler d1 execute investigaree-db --command="SELECT * FROM users LIMIT 1"
```

## 📚 Documentação

Ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para documentação completa da API.

## 🧪 Testando

### Health Check
```bash
curl http://localhost:8787/health
```

### Endpoint Protegido
```bash
curl -X POST http://localhost:8787/api/serpro/cpf \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678901"}'
```

## 📊 APIs SERPRO Disponíveis

✅ **CPF** - Consulta de dados cadastrais
- Single query
- Batch queries (até 100)

✅ **CNPJ** - Consulta empresarial (3 níveis)
- `/basica` - Dados básicos (R$ 0.66)
- `/qsa` - Com quadro societário/CPF mascarado (R$ 0.88)
- `/empresa` - CPF desmascarado (R$ 1.17) ⭐

✅ **Dívida Ativa** - Consulta de débitos federais
- Aceita CPF ou CNPJ
- Quick check (boolean)

## 🔒 Segurança

- ✅ Firebase Authentication
- ✅ Rate Limiting (60 req/min)
- ✅ CORS configurado
- ✅ CPF/CNPJ validation
- ✅ Audit logging
- ✅ Cost tracking

## 📈 Monitoramento

### Logs em tempo real:
```bash
npx wrangler tail
```

### Queries de custo:
```sql
-- Custo total por API (último mês)
SELECT
  api_name,
  COUNT(*) as queries,
  SUM(cost) as total_cost
FROM serpro_usage
WHERE created_at >= date('now', '-30 days')
GROUP BY api_name;
```

## 🚀 Deploy

### Deploy para produção:
```bash
npm run deploy
```

### Verificar deploy:
```bash
curl https://api.investigaree.com.br/health
```

## 📝 Changelog

### v1.0.0 (2025-12-07)
- ✅ Initial release
- ✅ 3 SERPRO APIs (CPF, CNPJ, Dívida Ativa)
- ✅ 9 HTTP endpoints
- ✅ Auth + Rate limiting
- ✅ D1 Database com 6 tabelas
- ✅ Cost tracking automático

## 👥 Autores

**Agent 2** - Backend Engineer - Implementação completa

## 📄 Licença

Propriedade de Investigaree

---

**Status:** ✅ Production Ready
**Versão:** 1.0.0
**Última atualização:** 2025-12-07
