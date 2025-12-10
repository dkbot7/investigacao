# Template Padrão de Tenants - Sistema Investigaree

## Visão Geral

Este documento especifica o template padrão para criação de novos tenants no sistema Investigaree. O sistema suporta dois tipos principais de tenants: **Pessoais** e **Compartilhados/Corporativos**.

---

## 1. TIPOS DE TENANT

### 1.1 Tenant Pessoal (USER_*)

**Características:**
- Criado automaticamente quando usuário se registra
- Código: `USER_{first8charsOfUserId}`
- Nome: `{userName} (Conta Pessoal)`
- Proprietário único (usuário que criou)
- Dados isolados e privados
- Uso: Investigações pessoais do usuário

**Exemplo:**
```json
{
  "id": "tenant_abc12345",
  "code": "USER_ABC1",
  "name": "João Silva (Conta Pessoal)",
  "email": "joao.silva@email.com",
  "firebase_uid": "abc123def456",
  "status": "active",
  "config": {
    "type": "personal",
    "auto_created": true
  },
  "serpro_mode": "managed",
  "serpro_notes": "Tenant pessoal criado automaticamente. Entre em contato para ativar consultas."
}
```

### 1.2 Tenant Compartilhado/Corporativo

**Características:**
- Criado manualmente pelo administrador
- Código: Customizado (ex: COMURG, EMPRESA_XYZ)
- Nome: Nome completo da organização
- Múltiplos usuários com diferentes papéis
- Dados compartilhados entre membros autorizados
- Uso: Investigações corporativas/institucionais

**Exemplo:**
```json
{
  "id": "tenant_comurg_001",
  "code": "COMURG",
  "name": "COMURG - Companhia Urbanizadora da Região do Goiânia",
  "email": "contato@comurg.go.gov.br",
  "firebase_uid": null,
  "status": "active",
  "config": {
    "type": "corporate",
    "features": {
      "bulk_queries": true,
      "api_access": true,
      "advanced_analytics": true,
      "custom_reports": true
    },
    "limits": {
      "max_users": 50,
      "max_queries_month": 10000,
      "data_retention_days": 730
    },
    "integrations": {
      "serpro": true,
      "receita_federal": true,
      "tse": true
    }
  },
  "serpro_mode": "custom",
  "serpro_notes": "Credenciais próprias configuradas. Ambiente produção."
}
```

---

## 2. ESTRUTURA DE DADOS PADRÃO

### 2.1 Tabela: `tenants`

```sql
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,                    -- tenant_{code}_{timestamp}
  code TEXT UNIQUE NOT NULL,              -- Código único (ex: COMURG, USER_ABC1)
  name TEXT NOT NULL,                     -- Nome completo do tenant
  email TEXT UNIQUE NOT NULL,             -- Email de contato
  firebase_uid TEXT UNIQUE,               -- UID do Firebase (se tenant pessoal)
  status TEXT DEFAULT 'active',           -- active, inactive, suspended, trial
  config TEXT,                            -- JSON com configurações específicas
  serpro_mode TEXT DEFAULT 'managed',     -- managed, custom, disabled
  serpro_notes TEXT,                      -- Notas sobre configuração SERPRO
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### 2.2 Configurações JSON (campo `config`)

**Schema do config:**
```typescript
interface TenantConfig {
  type: 'personal' | 'corporate';
  auto_created?: boolean;

  // Features habilitadas
  features?: {
    bulk_queries?: boolean;           // Consultas em lote
    api_access?: boolean;             // Acesso via API
    advanced_analytics?: boolean;     // Analytics avançado
    custom_reports?: boolean;         // Relatórios customizados
    data_export?: boolean;            // Exportação de dados
    webhook_notifications?: boolean;  // Webhooks
  };

  // Limites e quotas
  limits?: {
    max_users?: number;               // Máximo de usuários
    max_queries_month?: number;       // Limite mensal de consultas
    data_retention_days?: number;     // Retenção de dados em dias
    max_storage_mb?: number;          // Espaço de armazenamento
  };

  // Integrações externas
  integrations?: {
    serpro?: boolean;
    receita_federal?: boolean;
    tse?: boolean;
    tse_doacoes?: boolean;
    consulta_cnpj?: boolean;
  };

  // Configurações de billing
  billing?: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise';
    billing_email?: string;
    contract_start?: string;
    contract_end?: string;
  };

  // Customizações visuais
  branding?: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
  };
}
```

---

## 3. TEMPLATES PRÉ-DEFINIDOS

### 3.1 Template FREE (Tenant Pessoal)

```json
{
  "type": "personal",
  "auto_created": true,
  "features": {
    "bulk_queries": false,
    "api_access": false,
    "advanced_analytics": false,
    "custom_reports": false,
    "data_export": true,
    "webhook_notifications": false
  },
  "limits": {
    "max_users": 1,
    "max_queries_month": 100,
    "data_retention_days": 90,
    "max_storage_mb": 100
  },
  "integrations": {
    "serpro": false,
    "receita_federal": true,
    "tse": true,
    "tse_doacoes": true,
    "consulta_cnpj": true
  },
  "billing": {
    "plan": "free"
  }
}
```

### 3.2 Template BASIC (Pequenas Empresas)

```json
{
  "type": "corporate",
  "features": {
    "bulk_queries": true,
    "api_access": false,
    "advanced_analytics": true,
    "custom_reports": false,
    "data_export": true,
    "webhook_notifications": false
  },
  "limits": {
    "max_users": 5,
    "max_queries_month": 1000,
    "data_retention_days": 180,
    "max_storage_mb": 500
  },
  "integrations": {
    "serpro": true,
    "receita_federal": true,
    "tse": true,
    "tse_doacoes": true,
    "consulta_cnpj": true
  },
  "billing": {
    "plan": "basic"
  }
}
```

### 3.3 Template PRO (Médias Empresas)

```json
{
  "type": "corporate",
  "features": {
    "bulk_queries": true,
    "api_access": true,
    "advanced_analytics": true,
    "custom_reports": true,
    "data_export": true,
    "webhook_notifications": true
  },
  "limits": {
    "max_users": 20,
    "max_queries_month": 5000,
    "data_retention_days": 365,
    "max_storage_mb": 2000
  },
  "integrations": {
    "serpro": true,
    "receita_federal": true,
    "tse": true,
    "tse_doacoes": true,
    "consulta_cnpj": true
  },
  "billing": {
    "plan": "pro"
  }
}
```

### 3.4 Template ENTERPRISE (Grandes Organizações)

```json
{
  "type": "corporate",
  "features": {
    "bulk_queries": true,
    "api_access": true,
    "advanced_analytics": true,
    "custom_reports": true,
    "data_export": true,
    "webhook_notifications": true
  },
  "limits": {
    "max_users": 100,
    "max_queries_month": 50000,
    "data_retention_days": 730,
    "max_storage_mb": 10000
  },
  "integrations": {
    "serpro": true,
    "receita_federal": true,
    "tse": true,
    "tse_doacoes": true,
    "consulta_cnpj": true
  },
  "billing": {
    "plan": "enterprise"
  },
  "branding": {
    "logo_url": "",
    "primary_color": "#1976d2",
    "secondary_color": "#424242"
  }
}
```

---

## 4. ESTRUTURA DE DADOS DO TENANT

### 4.1 Tabelas Criadas Automaticamente

Quando um tenant é criado, as seguintes estruturas de dados ficam disponíveis:

**Tabelas de Investigação:**
- `tenant_funcionarios`: Dados de funcionários/investigados
- `tenant_obitos`: Registros de óbitos verificados
- `tenant_candidaturas`: Candidaturas políticas
- `tenant_doacoes`: Doações de campanha
- `tenant_vinculos`: Vínculos empresariais (QSA)
- `tenant_sancoes`: Sanções (CEIS, CNEP, OFAC, etc)
- `tenant_beneficios`: Benefícios sociais (Bolsa Família, BPC, etc)
- `tenant_processos`: Processos judiciais
- `tenant_consultas_log`: Log de todas as consultas realizadas

### 4.2 Schema das Tabelas Principais

**tenant_funcionarios:**
```sql
CREATE TABLE IF NOT EXISTS tenant_funcionarios (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  cpf TEXT NOT NULL,
  nome TEXT,
  matricula TEXT,
  cargo TEXT,
  setor TEXT,
  salario REAL,
  data_admissao TEXT,
  situacao TEXT DEFAULT 'ativo',
  metadata TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  UNIQUE(tenant_id, cpf)
);
```

**tenant_consultas_log:**
```sql
CREATE TABLE IF NOT EXISTS tenant_consultas_log (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  tipo_consulta TEXT NOT NULL,
  parametros TEXT,
  resultado TEXT,
  status TEXT,
  erro TEXT,
  duracao_ms INTEGER,
  custo REAL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 5. PERMISSÕES E ACESSOS

### 5.1 Tabela user_tenants

```sql
CREATE TABLE IF NOT EXISTS user_tenants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  role TEXT DEFAULT 'viewer',             -- admin, editor, viewer
  granted_by TEXT,                        -- ID do usuário que concedeu
  granted_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT,                        -- Data de expiração (opcional)
  is_active INTEGER DEFAULT 1,
  metadata TEXT,                          -- JSON com dados adicionais
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  UNIQUE(user_id, tenant_id)
);
```

### 5.2 Roles (Papéis)

**ADMIN:**
- Acesso total ao tenant
- Pode adicionar/remover usuários
- Pode alterar configurações
- Pode criar/editar/deletar dados
- Pode exportar dados
- Pode ver logs de auditoria

**EDITOR:**
- Pode criar/editar dados
- Pode fazer consultas
- Pode exportar dados
- NÃO pode gerenciar usuários
- NÃO pode alterar configurações

**VIEWER:**
- Acesso somente leitura
- Pode visualizar dados existentes
- Pode fazer consultas limitadas
- NÃO pode editar dados
- NÃO pode exportar dados completos

### 5.3 Permissões Padrão ao Criar Tenant

**Tenant Pessoal:**
- Criador: role = `admin`
- is_active = 1
- expires_at = null (sem expiração)

**Tenant Corporativo:**
- Primeiro usuário: role = `admin`
- Usuários adicionais: role = `viewer` (deve ser promovido manualmente)

---

## 6. DADOS INICIAIS DO TENANT

### 6.1 Configurações Iniciais

Ao criar um tenant, os seguintes dados devem ser inicializados:

```json
{
  "welcome_message": "Bem-vindo ao Investigaree! Comece importando seus dados.",
  "onboarding_completed": false,
  "setup_steps": {
    "profile_completed": false,
    "first_query_done": false,
    "data_imported": false,
    "team_invited": false
  },
  "notifications": {
    "email_enabled": true,
    "email_frequency": "daily",
    "alert_on_critical_findings": true,
    "alert_on_quota_limit": true
  },
  "preferences": {
    "default_view": "dashboard",
    "results_per_page": 50,
    "export_format": "xlsx",
    "timezone": "America/Sao_Paulo"
  }
}
```

### 6.2 Pastas e Recursos

**Estrutura de Pastas (se usar storage):**
```
/tenants/{tenant_id}/
  /uploads/          # Arquivos importados
  /exports/          # Relatórios exportados
  /attachments/      # Anexos diversos
  /logos/            # Logo customizado
```

---

## 7. PROCESSO DE CRIAÇÃO DE TENANT

### 7.1 Fluxo Automático (Tenant Pessoal)

```
1. Usuário se registra via Firebase Auth
   ↓
2. POST /api/auth/sync ou /api/auth/register
   ↓
3. Sistema verifica se usuário já existe
   ↓
4. Se novo:
   a. Cria registro em `users`
   b. Gera tenant pessoal com código USER_{id}
   c. Aplica template FREE
   d. Cria associação em `user_tenants` com role=admin
   e. Inicializa configurações padrão
   ↓
5. Retorna token + tenant info
```

### 7.2 Fluxo Manual (Tenant Corporativo)

```
1. Admin acessa painel de criação de tenant
   ↓
2. Preenche formulário:
   - Nome do tenant
   - Código único
   - Email de contato
   - Plano desejado
   ↓
3. Sistema valida dados:
   - Código não duplicado
   - Email válido
   ↓
4. Cria tenant:
   a. Gera ID único
   b. Aplica template do plano escolhido
   c. Define status inicial
   d. Cria estruturas de dados
   ↓
5. Associa usuário administrador:
   a. Cria entrada em `user_tenants`
   b. Define role=admin
   ↓
6. Envia email de boas-vindas
   ↓
7. Retorna tenant criado
```

---

## 8. MIGRATION SQL

### 8.1 Função para Criar Tenant

```sql
-- Stored procedure (adaptado para D1/SQLite)
-- Nota: D1 não suporta stored procedures, deve ser implementado na aplicação

-- Inserir tenant
INSERT INTO tenants (id, code, name, email, status, config, serpro_mode, serpro_notes)
VALUES (?, ?, ?, ?, 'active', ?, 'managed', 'Aguardando configuração');

-- Associar usuário criador como admin
INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by, is_active)
VALUES (?, ?, ?, 'admin', 'system', 1);
```

### 8.2 Índices Recomendados

```sql
-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tenants_code ON tenants(code);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_user_tenants_user ON user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant ON user_tenants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_active ON user_tenants(is_active);
CREATE INDEX IF NOT EXISTS idx_tenant_funcionarios_tenant ON tenant_funcionarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_funcionarios_cpf ON tenant_funcionarios(cpf);
```

---

## 9. VALIDAÇÕES E REGRAS DE NEGÓCIO

### 9.1 Validações ao Criar Tenant

**Código (code):**
- Obrigatório
- Único no sistema
- Formato: 3-20 caracteres alfanuméricos + underscore
- Não pode começar com número
- Uppercase

**Nome (name):**
- Obrigatório
- Mínimo 3 caracteres
- Máximo 100 caracteres

**Email:**
- Obrigatório
- Formato válido
- Único no sistema

**Status:**
- Valores permitidos: active, inactive, suspended, trial
- Padrão: active

### 9.2 Limites por Plano

| Recurso | FREE | BASIC | PRO | ENTERPRISE |
|---------|------|-------|-----|------------|
| Usuários | 1 | 5 | 20 | 100+ |
| Consultas/mês | 100 | 1.000 | 5.000 | 50.000+ |
| Retenção dados | 90 dias | 180 dias | 365 dias | 730 dias |
| Storage | 100 MB | 500 MB | 2 GB | 10 GB+ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| Webhooks | ❌ | ❌ | ✅ | ✅ |
| Relatórios Custom | ❌ | ❌ | ✅ | ✅ |
| Branding | ❌ | ❌ | ❌ | ✅ |

### 9.3 Regras de Upgrade/Downgrade

**Upgrade:**
- Pode ser feito a qualquer momento
- Novos limites aplicados imediatamente
- Cobrança proporcional

**Downgrade:**
- Requer aprovação se houver excesso de uso
- Dados excedentes devem ser arquivados
- Aplicado no próximo ciclo de billing

---

## 10. MONITORAMENTO E MÉTRICAS

### 10.1 Métricas por Tenant

```typescript
interface TenantMetrics {
  // Uso
  total_queries_month: number;
  total_users: number;
  total_records: number;
  storage_used_mb: number;

  // Atividade
  last_login: string;
  last_query: string;
  queries_last_7_days: number;

  // Quotas
  quota_usage_percent: number;
  quota_alerts: boolean;

  // Saúde
  status: string;
  health_score: number;
}
```

### 10.2 Alertas Automáticos

**80% da quota:**
- Email para admin do tenant
- Notificação no dashboard

**100% da quota:**
- Bloqueio de novas consultas
- Email urgente
- Oferta de upgrade

**Inatividade > 30 dias:**
- Email de reengajamento
- Sugestão de downgrade (se pago)

---

## 11. EXEMPLOS DE USO

### 11.1 Criar Tenant Pessoal (via código)

```typescript
import { createPersonalTenant } from './services/tenant.service';

const tenant = await createPersonalTenant({
  userId: 'user_abc123',
  userName: 'João Silva',
  userEmail: 'joao@email.com'
});

// Resultado:
// {
//   id: 'tenant_xyz789',
//   code: 'USER_ABC1',
//   name: 'João Silva (Conta Pessoal)',
//   status: 'active',
//   config: { ... template FREE ... }
// }
```

### 11.2 Criar Tenant Corporativo (via código)

```typescript
import { createCorporateTenant } from './services/tenant.service';

const tenant = await createCorporateTenant({
  code: 'EMPRESA_XYZ',
  name: 'Empresa XYZ Ltda',
  email: 'contato@empresaxyz.com',
  plan: 'pro',
  adminUserId: 'user_admin123'
});

// Resultado:
// {
//   id: 'tenant_empresaxyz_001',
//   code: 'EMPRESA_XYZ',
//   name: 'Empresa XYZ Ltda',
//   status: 'active',
//   config: { ... template PRO ... }
// }
```

### 11.3 Adicionar Usuário ao Tenant

```typescript
import { grantTenantAccess } from './services/tenant.service';

await grantTenantAccess({
  tenantId: 'tenant_empresaxyz_001',
  userEmail: 'maria@email.com',
  role: 'editor',
  grantedBy: 'user_admin123'
});
```

---

## 12. PRÓXIMOS PASSOS

### 12.1 Implementação Recomendada

1. **Criar serviço de tenant** (`tenant.service.ts`)
   - Funções: createPersonalTenant, createCorporateTenant
   - Validações e aplicação de templates

2. **Criar endpoint de criação manual** (`POST /api/admin/tenants`)
   - Apenas para super-admins
   - Formulário de criação no painel admin

3. **Implementar middleware de quotas**
   - Verificar limites antes de operações
   - Bloquear se quota excedida

4. **Dashboard de monitoramento**
   - Métricas de uso por tenant
   - Alertas de quota
   - Saúde geral do sistema

5. **Testes automatizados**
   - Criação de tenant pessoal
   - Criação de tenant corporativo
   - Validações de limites
   - Isolamento de dados

---

## 13. REFERÊNCIAS

**Arquivos do Projeto:**
- `/backend/workers/api/src/routes/tenants.routes.ts` - API de tenants
- `/backend/workers/api/src/routes/auth.routes.ts` - Autenticação
- `/database/002_tenant_tables.sql` - Schema do BD
- `/investigaree/src/lib/services/tenants.service.ts` - Client service

**Documentação:**
- Multi-tenancy: [https://www.cloudflare.com/learning/cloud/what-is-multitenancy/](https://www.cloudflare.com/learning/cloud/what-is-multitenancy/)
- Cloudflare D1: [https://developers.cloudflare.com/d1/](https://developers.cloudflare.com/d1/)
- Firebase Auth: [https://firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)

---

**Última atualização:** 2025-12-10
**Versão:** 1.0
**Autor:** Sistema Investigaree
