# Fluxo de Registro e Criação Automática de Tenant

## Visão Geral

Todo usuário que cria uma conta no InvestigaRee automaticamente recebe seu próprio tenant pessoal isolado. Não existe conta sem tenant.

## Fluxo de Registro

### 1. Usuário preenche formulário de registro
**Componente:** `investigaree/src/components/auth/RegisterModal.tsx`

Dados coletados:
- Nome completo
- Email
- WhatsApp
- Senha

### 2. Conta criada no Firebase Authentication
**Arquivo:** `investigaree/src/contexts/AuthContext.tsx:52-84`

```typescript
await createUserWithEmailAndPassword(auth, email, password)
await updateProfile(userCredential.user, { displayName: name })
```

### 3. Sincronização com banco D1
**Endpoint:** `POST /api/auth/register`
**Arquivo:** `backend/workers/api/src/routes/auth.routes.ts:35-143`

O backend executa automaticamente:

#### 3.1. Criar registro do usuário
```sql
INSERT INTO users (id, firebase_uid, email, name, phone)
VALUES (?, ?, ?, ?, ?)
```

#### 3.2. Criar tenant pessoal
```sql
INSERT INTO tenants (id, code, name, email, firebase_uid, status, serpro_mode, serpro_notes)
VALUES (
  'tenant_{8_chars_do_user_id}',
  'USER_{8_CHARS_UPPERCASE}',
  '{nome} (Conta Pessoal)',
  '{email}',
  '{firebase_uid}',
  'active',
  'managed',
  'Tenant pessoal criado automaticamente. Entre em contato para ativar consultas.'
)
```

#### 3.3. Associar usuário ao tenant como admin
```sql
INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by, granted_at)
VALUES (?, ?, ?, 'admin', 'system', datetime('now'))
```

#### 3.4. Criar configurações padrão
```sql
INSERT INTO user_settings (id, user_id, empresa_nome, plano, limite_consultas_mes)
VALUES (?, ?, ?, 'free', 0)
```

### 4. Resultado

O usuário recebe:
- ✅ Conta ativa no Firebase
- ✅ Registro no banco D1
- ✅ Tenant pessoal exclusivo (formato: `USER_{ID}`)
- ✅ Role de `admin` no seu tenant
- ✅ Plano `free` com 0 consultas gratuitas
- ✅ Acesso imediato ao dashboard

## Fluxo de Login (Fallback)

Se um usuário faz login mas não existe no D1, o endpoint `/api/auth/sync` cria automaticamente:

**Endpoint:** `POST /api/auth/sync`
**Arquivo:** `backend/workers/api/src/routes/auth.routes.ts:157-246`

Este endpoint garante que mesmo usuários que foram criados diretamente no Firebase (edge case) recebam seu tenant pessoal.

## Formato do Tenant Pessoal

| Campo | Formato | Exemplo |
|-------|---------|---------|
| ID | `tenant_{8_chars}` | `tenant_a1ac3e4d` |
| Code | `USER_{8_CHARS_UPPERCASE}` | `USER_A1AC3E4D` |
| Name | `{nome} (Conta Pessoal)` | `Danielle Kaloi (Conta Pessoal)` |
| Status | `active` | `active` |
| SERPRO Mode | `managed` | `managed` |
| Plano | `free` | `free` |
| Consultas/mês | `0` | `0` |

## Políticas

### Segurança
- Cada usuário tem acesso apenas ao seu tenant pessoal
- Dados completamente isolados entre tenants
- Impossível acessar dados de outros usuários

### Monetização
- Nenhuma consulta gratuita incluída
- Usuário precisa entrar em contato para ativar plano pago
- Configuração de credenciais SERPRO só após contato

### Multi-Tenant
- Um usuário pode ter acesso a múltiplos tenants
- Admin pode conceder acesso a tenants compartilhados
- Tenant pessoal sempre permanece ativo (não pode ser revogado)

## Endpoints Relacionados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/register` | POST | Cria usuário + tenant pessoal |
| `/api/auth/sync` | POST | Sincroniza Firebase com D1 |
| `/api/tenant/info` | GET | Retorna tenants do usuário |
| `/api/tenant/dashboard` | GET | Retorna dados do dashboard |
| `/api/tenants/create-personal` | POST | Cria tenant pessoal para usuário existente (admin only) |

## Migração de Usuários Existentes

Para migrar usuários de tenants compartilhados para tenants pessoais:

```bash
# Via script SQL
cd backend/workers/api
npx wrangler d1 execute investigaree-db --remote --file ../../../scripts/create-{user}-personal-tenant.sql

# Via endpoint (admin only)
POST /api/tenants/create-personal
{
  "user_email": "usuario@example.com",
  "revoke_existing_access": true  // Remove acesso aos tenants anteriores
}
```

## Testes

Para testar o fluxo completo:

1. Acesse https://investigaree.com.br
2. Clique em "Criar conta"
3. Preencha os dados e crie a conta
4. Verifique que foi redirecionado para `/dashboard`
5. No console do navegador, verifique a chamada para `/api/auth/register`
6. Confirme que recebeu um tenant no formato `USER_*`

## Histórico

- **2025-12-08:** Implementação da criação automática de tenant pessoal
- **2025-12-08:** Migração de ibsenmaciel@gmail.com para USER_FBA8B02D
- **2025-12-08:** Migração de dkbotdani@gmail.com para USER_A1AC3E4D
- **2025-12-08:** Correção do bug de logout após criação de tenant
- **2025-12-08:** Implementação dos endpoints /api/tenant/info e /api/tenant/dashboard
