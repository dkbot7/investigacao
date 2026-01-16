# Investigaree API - Cloudflare Worker

Backend API Edge para o sistema Investigaree.

## 🚀 Features Implementadas

### ✅ Alertas Automáticos
- Cron Trigger diário (9h UTC / 6h BRT)
- Detecção automática de mudanças em investigações
- Notificações via email (Resend API)
- API completa para gerenciar alertas

### 🔐 Autenticação
- Firebase JWT token verification
- Bearer token authentication
- Protected routes

### 📊 Endpoints Disponíveis

**Alertas:**
- `GET  /api/alerts` - Lista alertas do usuário
- `POST /api/alerts/:id/read` - Marca alerta como lido
- `POST /api/alerts/mark-all-read` - Marca todos como lidos
- `GET  /api/alerts/unread-count` - Conta não lidos
- `GET  /api/alerts/config` - Busca configuração
- `PUT  /api/alerts/config` - Atualiza configuração

**Health Check:**
- `GET /health` - Status do Worker

## 📦 Setup

### 1. Instalar dependências

\`\`\`bash
npm install
\`\`\`

### 2. Configurar D1 Database

Criar database no Cloudflare Dashboard e atualizar `wrangler.toml`:

\`\`\`toml
[[d1_databases]]
binding = "DB"
database_name = "investigaree-db"
database_id = "SEU_DATABASE_ID_AQUI"
\`\`\`

### 3. Rodar migrations

\`\`\`bash
# Migration SQL está em ../migrations/001_create_alerts_tables.sql
# Executar no Cloudflare Dashboard ou via wrangler:
wrangler d1 execute investigaree-db --file=../migrations/001_create_alerts_tables.sql
\`\`\`

### 4. Configurar secrets

\`\`\`bash
# Resend API Key (para emails)
wrangler secret put RESEND_API_KEY
# Colar a key quando solicitado: re_...
\`\`\`

### 5. Deploy

\`\`\`bash
# Desenvolvimento local
npm run dev

# Deploy para produção
npm run deploy
\`\`\`

## 🔧 Desenvolvimento

\`\`\`bash
# Dev local (porta 8787)
npm run dev

# Logs em tempo real
npm run tail
\`\`\`

## 📝 Estrutura

\`\`\`
api-worker/
├── src/
│   ├── index.ts              # Entry point + routing
│   ├── types.ts              # TypeScript types
│   ├── auth.ts               # Firebase auth verification
│   ├── scheduled.ts          # Cron handler + change detection
│   └── handlers/
│       └── alerts.ts         # Alerts API handlers
├── wrangler.toml             # Cloudflare config
├── package.json
└── tsconfig.json
\`\`\`

## 🌐 URLs de Produção

- **API:** https://api.investigaree.com.br
- **Health Check:** https://api.investigaree.com.br/health

## ⏰ Cron Schedule

\`\`\`toml
[triggers]
crons = ["0 9 * * *"]  # Diariamente às 9h UTC (6h BRT)
\`\`\`

## 🔒 Variáveis de Ambiente

\`\`\`toml
[vars]
ENVIRONMENT = "production"

# Secrets (via wrangler secret put):
# - RESEND_API_KEY
\`\`\`

## 📊 Database Schema

Ver `../migrations/001_create_alerts_tables.sql`:

- `investigation_snapshots` - Snapshots de estado anterior
- `alerts` - Alertas gerados
- `alert_config` - Configurações por tenant

## 🐛 Troubleshooting

**Erro ao deployar:**
\`\`\`bash
# Verificar se wrangler está autenticado
wrangler whoami

# Re-autenticar se necessário
wrangler login
\`\`\`

**Cron não executa:**
- Esperar até 15 minutos para propagação
- Verificar logs: `wrangler tail`

**Emails não enviam:**
- Verificar se `RESEND_API_KEY` está configurada
- Verificar se domínio está verificado no Resend

## 📚 Documentação

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [D1 Database](https://developers.cloudflare.com/d1/)
- [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Resend API](https://resend.com/docs)
