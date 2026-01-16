# Política de Segurança

## Versões Suportadas

Apenas a versão mais recente do Investigaree recebe atualizações de segurança.

| Versão | Suportada          |
| ------ | ------------------ |
| 2.0.x  | :white_check_mark: |
| 1.x.x  | :x:                |

## Arquitetura de Segurança

### Row Level Security (RLS)

Todas as tabelas multi-tenant no D1 database têm RLS habilitado:

#### Tabelas com RLS
- `users` - Isolamento por tenant_id
- `user_investigacoes` - Isolamento por tenant_id
- `sancoes` - Isolamento por tenant_id
- `ofac_matches` - Isolamento por tenant_id
- `leads` - Público (sem RLS)
- `lgpd_consent_logs` - Público (sem RLS, auditoria)

#### Políticas RLS

```sql
-- Política: usuários só veem dados do próprio tenant
CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = current_setting('app.current_tenant_id')::text);

-- Política: admins veem tudo
CREATE POLICY admin_all_access_users ON users
  USING (current_setting('app.user_role')::text = 'admin');
```

#### Como Usar RLS

**Backend (api-worker):**
```typescript
import { validateFirebaseToken } from './auth';

// 1. Validar token JWT
const auth = await validateFirebaseToken(request);
if (!auth) {
  return new Response('Unauthorized', { status: 401 });
}

// 2. RLS é aplicado automaticamente
// Queries só retornam dados do tenant do usuário
const results = await env.DB.prepare(
  'SELECT * FROM user_investigacoes WHERE status = ?'
).bind('ativo').all();
// ✅ Apenas dados do tenant_id do auth.tenantId serão retornados
```

### Autenticação

#### Firebase Authentication
- **Provider**: Firebase Auth com Google Sign-In
- **Token**: JWT assinado pelo Firebase
- **Validação**: Verificação completa de assinatura usando Google public keys
- **Expiração**: Tokens expiram em 1 hora
- **Refresh**: Automático via Firebase SDK

#### Validação de Token

**Processo completo:**
1. Cliente envia `Authorization: Bearer <token>`
2. Backend extrai token do header
3. Backend busca chaves públicas do Google (`https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`)
4. Backend valida assinatura do JWT usando chave pública correspondente ao `kid` (key ID)
5. Backend verifica claims obrigatórios (iss, aud, exp, iat)
6. Backend busca tenant_id e role do usuário no D1
7. Backend seta contexto RLS: `set_tenant_context(tenant_id, role)`
8. Query executada com RLS aplicado

**Código (api-worker/src/auth.ts):**
```typescript
export async function validateFirebaseToken(request: Request): Promise<AuthContext | null> {
  const token = extractToken(request);

  // 1. Buscar public keys do Google
  const keys = await fetchGooglePublicKeys();

  // 2. Decode token (sem verificação ainda)
  const unverifiedToken = decodeJWT(token);

  // 3. Encontrar chave pública correspondente
  const publicKey = keys[unverifiedToken.header.kid];

  // 4. Verificar assinatura
  const isValid = await verifySignature(token, publicKey);
  if (!isValid) throw new Error('Invalid signature');

  // 5. Verificar claims
  validateClaims(unverifiedToken.payload);

  // 6. Buscar tenant e role no D1
  const user = await db.query('SELECT tenant_id, role FROM users WHERE firebase_uid = ?', uid);

  return {
    uid: payload.sub,
    email: payload.email,
    tenantId: user.tenant_id,
    role: user.role
  };
}
```

### Autorização

#### RBAC (Role-Based Access Control)

**Roles disponíveis:**
- `admin` - Acesso total, pode ver todos os tenants
- `editor` - Pode criar, editar e deletar dados do próprio tenant
- `viewer` - Apenas leitura do próprio tenant

**Implementação:**
```typescript
// Backend middleware
if (auth.role !== 'admin' && requestedTenantId !== auth.tenantId) {
  return new Response('Forbidden', { status: 403 });
}
```

#### Tenant Isolation

**Garantias:**
- ✅ Usuários **nunca** veem dados de outros tenants
- ✅ Tentativas de acesso cross-tenant retornam 403 Forbidden
- ✅ RLS garante isolamento no nível do banco de dados
- ✅ Admins podem ver todos os tenants (para suporte)

### Dados Sensíveis

#### O que NÃO armazenamos em localStorage
- ❌ Tokens JWT
- ❌ Tenant ID
- ❌ User role
- ❌ Dados de investigação
- ❌ Informações pessoais (CPF, nome, etc)

#### O que PODE ser armazenado em localStorage
- ✅ Preferências de UI (tema, idioma)
- ✅ Estado de onboarding (se usuário já viu tutorial)
- ✅ Backup de leads capturados (redundância)

#### Cookies
- `httpOnly: true` - Não acessível via JavaScript
- `secure: true` - Apenas HTTPS em produção
- `sameSite: 'Strict'` - Proteção contra CSRF
- `maxAge: 86400` - 24 horas

### LGPD Compliance

#### Art. 7º - Base Legal
- Consentimento explícito registrado em `lgpd_consent_logs`
- Timestamp, IP hash, finalidades, versão do texto

#### Art. 8º - Consentimento
- Fornecido por escrito (checkbox + submit)
- Manifestação de vontade clara e inequívoca
- Finalidades específicas registradas

#### Art. 13 - Anonimização
- IP addresses armazenados como hash SHA-256
- Hash não permite reversão para IP original
- Dados anonimizados não estão sob escopo da LGPD

#### Art. 16 - Retenção de Dados
- Consentimentos: 5 anos (prazo recomendado)
- Logs de auditoria: 5 anos
- Dados de investigação: Conforme necessidade do titular

#### Art. 18 - Direitos do Titular
- **Acesso**: `POST /api/lgpd/request` (tipo: 'acesso')
- **Exclusão**: `POST /api/lgpd/request` (tipo: 'exclusao')
- **Portabilidade**: `POST /api/lgpd/request` (tipo: 'portabilidade')

**Implementação:**
```typescript
// Solicitar exclusão de dados
await fetch('/api/lgpd/request', {
  method: 'POST',
  body: JSON.stringify({
    tipo: 'exclusao',
    email: 'usuario@exemplo.com'
  })
});
```

#### Art. 37 - Registro de Operações
- Todos os consentimentos registrados em D1
- Logs estruturados para auditoria
- Rastreamento de source, UTM, user-agent

### Logging e Auditoria

#### Logger Estruturado

**Formato de log:**
```json
{
  "level": "info",
  "message": "Usuário autenticado com sucesso",
  "timestamp": "2024-12-30T10:30:00.000Z",
  "context": {
    "uid": "abc123",
    "tenantId": "CLIENTE_01",
    "role": "editor"
  },
  "source": "Auth"
}
```

**Níveis de log:**
- `debug` - Desenvolvimento apenas
- `info` - Eventos normais (login, consulta bem-sucedida)
- `warn` - Avisos (rate limit próximo, API key expirando)
- `error` - Erros (falha de autenticação, query error)

#### Eventos Auditados

- ✅ Login/logout de usuários
- ✅ Consultas de CPF/CNPJ (SERPRO custa dinheiro)
- ✅ Criação de investigações
- ✅ Mudanças de status no Kanban
- ✅ Consentimentos LGPD
- ✅ Solicitações LGPD (acesso/exclusão/portabilidade)
- ✅ Captura de leads
- ✅ Envio de emails

#### Onde os Logs São Armazenados

**Cloudflare Workers (Backend):**
- Logs vão para Cloudflare Logs (acessível via dashboard)
- Retenção: 24 horas (plano gratuito) ou 30 dias (plano pago)
- Formato: JSON estruturado

**Next.js (Frontend):**
- Desenvolvimento: Console colorizado
- Produção: Vercel Logs ou stdout (JSON)
- Pode integrar com Datadog, Sentry, etc

### Proteção contra Vulnerabilidades Comuns

#### SQL Injection
✅ **Protegido** - Usamos prepared statements em 100% das queries
```typescript
// ✅ Seguro
await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).all();

// ❌ Vulnerável (NÃO usamos)
await db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

#### XSS (Cross-Site Scripting)
✅ **Protegido** - React escapa automaticamente todas as strings
✅ **Sanitização** - DOMPurify usado em MDX content
```tsx
// ✅ Seguro (React escapa automaticamente)
<div>{userData.name}</div>

// ⚠️ Cuidado (dangerouslySetInnerHTML)
// Usado apenas em MDX com DOMPurify
<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

#### CSRF (Cross-Site Request Forgery)
✅ **Protegido** - Cookies com `sameSite: 'Strict'`
✅ **JWT em header** - Não em cookies (não é vulnerável a CSRF)

#### Clickjacking
✅ **Protegido** - `X-Frame-Options: DENY` header
✅ **CSP** - Content Security Policy configurado

#### Rate Limiting
✅ **Implementado** - Cloudflare Workers rate limiting
- API pública: 100 req/min por API key
- Endpoints autenticados: 500 req/min por usuário

### Dependências e Atualizações

#### Scan de Vulnerabilidades
```bash
# Frontend
npm audit

# Backend (Cloudflare Workers)
npm audit --prefix api-worker
```

#### Atualizações Automáticas
- Dependabot habilitado no GitHub
- Pull requests automáticos para security patches
- Review manual antes de merge

### Ambiente de Produção

#### Cloudflare Workers (Backend)
- **Secrets**: Armazenados no Cloudflare Dashboard (nunca em código)
  - `FIREBASE_PROJECT_ID`
  - `SERPRO_API_KEY`
  - `RESEND_API_KEY`
  - `PORTAL_TRANSPARENCIA_API_KEY`
- **D1 Database**: Isolado por environment (preview vs production)
- **Wrangler secrets**: `wrangler secret put <SECRET_NAME>`

#### Vercel (Frontend)
- **Environment Variables**: Configuradas no Vercel Dashboard
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_FIREBASE_*` (públicas, ok)
- **Preview Deployments**: Ambiente isolado para testes

#### Recomendações de Deploy

**NÃO fazer:**
- ❌ Commit de secrets no git
- ❌ Hardcode de API keys
- ❌ Usar mesma database para dev e prod
- ❌ Deploy direto para produção sem testes

**FAZER:**
- ✅ Usar environment variables para secrets
- ✅ Testar em preview deployment primeiro
- ✅ Executar migrations em ambiente de staging
- ✅ Ter rollback plan para cada deploy

## Reportar Vulnerabilidades

### Como Reportar

Se você descobriu uma vulnerabilidade de segurança, **NÃO** abra uma issue pública.

**Envie um email para:**
- 📧 **security@investigaree.com.br**
- 📧 **contato@investigaree.com.br** (cópia)

**Inclua:**
1. Descrição detalhada da vulnerabilidade
2. Steps to reproduce
3. Impacto potencial
4. Sugestão de correção (se tiver)

### O que Esperamos de Você

- ✅ Dê tempo razoável para corrigirmos (90 dias)
- ✅ Não explore a vulnerabilidade além de PoC
- ✅ Não acesse dados de outros usuários
- ✅ Não execute DoS ou ações destrutivas

### O que Você Pode Esperar de Nós

- ✅ Resposta em até 48 horas
- ✅ Timeline de correção clara
- ✅ Crédito na release notes (se desejar)
- ✅ Possível recompensa (bounty) para vulnerabilidades críticas

### Vulnerabilidades Aceitáveis para Report

- 🔴 **Crítico**: RCE, SQL Injection, Auth bypass
- 🟠 **Alto**: XSS stored, CSRF em ações críticas, Privilege escalation
- 🟡 **Médio**: XSS reflected, Information disclosure
- 🟢 **Baixo**: CORS misconfiguration, Missing security headers

### Fora de Escopo

- ❌ Rate limiting bypass (já implementado)
- ❌ Clickjacking em páginas públicas (sem dados sensíveis)
- ❌ Self-XSS (requer interação do usuário)
- ❌ Vulnerabilidades em dependências já com patch disponível

## Auditorias de Segurança

### Última Auditoria
- **Data**: 2025-12-30
- **Escopo**: RLS, JWT validation, LGPD compliance
- **Findings**: 0 vulnerabilidades críticas

### Próxima Auditoria Prevista
- **Data**: 2026-03-30 (trimestral)
- **Escopo**: Completo (frontend + backend + database)

---

**Última atualização**: 2025-12-30
**Versão**: 2.0.0
