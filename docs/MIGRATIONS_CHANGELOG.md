# Changelog de Migrations - investigaree

**Atualizado em:** 30/11/2025

Este documento registra todas as alteracoes no schema do banco de dados D1 (SQLite).

---

## Indice de Migrations

| Migration | Arquivo | Status | Descricao |
|-----------|---------|--------|-----------|
| 001 | `001_initial_schema.sql` | Manual | Schema inicial (users, leads) - executado manualmente |
| 002 | `002_rls_policies.sql` | Manual | Politicas de seguranca - executado manualmente |
| 003 | `003_whatsapp_leads.sql` | Arquivo | Leads do WhatsApp |
| 004 | `004_tenant_data.sql` | Arquivo | Sistema multi-tenant completo |
| 005 | `005_user_tenants.sql` | Arquivo | Controle de acesso usuario-tenant |
| 006 | `006_seed_admin_access.sql` | Arquivo | Seed: CLIENTE_01 e admin |
| 007 | `007_admin_alerts.sql` | Arquivo | Sistema de alertas admin |
| 008 | `008_create_admin_users.sql` | Arquivo | Usuarios admin master |
| 009 | `009_user_data_individual.sql` | Arquivo | Dados individuais por usuario (B2C) |

> **Nota:** Os arquivos de migration estao em `workers/migrations/`. Migrations 001 e 002 foram executadas manualmente durante setup inicial.

---

## Detalhamento por Migration

### 001 - Initial Schema

**Data estimada:** Novembro 2025
**Arquivo:** `001_initial_schema.sql`

#### Tabelas Criadas

| Tabela | Descricao |
|--------|-----------|
| `users` | Usuarios do sistema sincronizados com Firebase |
| `leads` | Leads capturados do site |

#### Schema

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    firebase_uid TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    created_at TEXT,
    updated_at TEXT
);

CREATE TABLE leads (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    empresa TEXT,
    mensagem TEXT,
    origem TEXT,
    created_at TEXT
);
```

---

### 002 - RLS Policies

**Data estimada:** Novembro 2025
**Arquivo:** `002_rls_policies.sql`

#### Alteracoes

- Configuracao de politicas de seguranca a nivel de linha (RLS)
- Preparacao para isolamento de dados

> **Nota:** D1/SQLite nao suporta RLS nativo como PostgreSQL. O isolamento e feito via aplicacao.

---

### 003 - WhatsApp Leads

**Data estimada:** Novembro 2025
**Arquivo:** `003_whatsapp_leads.sql`

#### Tabelas Criadas

| Tabela | Descricao |
|--------|-----------|
| `whatsapp_leads` | Leads capturados via WhatsApp widget |

#### Schema

```sql
CREATE TABLE whatsapp_leads (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    contato TEXT NOT NULL,
    mensagem TEXT,
    origem TEXT DEFAULT 'whatsapp',
    pagina TEXT DEFAULT '/',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    total_contatos INTEGER DEFAULT 1
);
```

#### Indices

```sql
CREATE INDEX idx_whatsapp_leads_contato ON whatsapp_leads(contato);
CREATE INDEX idx_whatsapp_leads_created_at ON whatsapp_leads(created_at);
```

---

### 004 - Tenant Data (MAJOR)

**Data estimada:** 28 Novembro 2025
**Arquivo:** `004_tenant_data.sql`

#### Impacto

> **MIGRATION PRINCIPAL** - Implementa todo o sistema multi-tenant

#### Tabelas Criadas

| Tabela | Registros | Descricao |
|--------|-----------|-----------|
| `tenants` | Clientes | Organizacoes/clientes da plataforma |
| `tenant_funcionarios` | ~6000 | Funcionarios de cada tenant |
| `tenant_candidaturas` | ~10 | Candidaturas eleitorais TSE |
| `tenant_doacoes` | ~100 | Doacoes de campanha |
| `tenant_vinculos` | ~600 | Vinculos empresariais (QSA) |
| `tenant_sancoes` | ~5 | Sancoes CEIS/CNEP/OFAC |
| `tenant_obitos` | ~50 | Obitos verificados |
| `tenant_beneficios` | ~10 | Beneficios sociais |

#### Campos Importantes - tenant_funcionarios

```sql
-- Identificacao
cadastro, nome, cpf, cpf_valido, data_nascimento, sexo

-- Vinculo empregaticio
cargo, salario, data_admissao, vinculo, grupo

-- Flags de verificacao (preenchidas por scripts)
esta_vivo, esta_morto, ano_obito
recebe_beneficio, qual_beneficio
socio_empresa, qtd_empresas
doador_campanha, valor_doacoes
candidato
sancionado_ceis, sancionado_ofac
```

#### Indices Criados

```sql
idx_tenant_func_tenant (tenant_id)
idx_tenant_func_cpf (cpf)
idx_tenant_func_nome (nome)
idx_tenant_func_grupo (tenant_id, grupo)
-- E indices similares para todas tabelas tenant_*
```

#### Seed Inicial

```sql
INSERT INTO tenants (id, code, name, email, status) VALUES
('tenant_cliente_01', 'CLIENTE_01', 'COMURG - Companhia de Urbanizacao de Goiania',
 'cliente01@investigaree.com.br', 'active');
```

---

### 005 - User Tenants

**Data estimada:** 28 Novembro 2025
**Arquivo:** `005_user_tenants.sql`

#### Tabelas Criadas

| Tabela | Descricao |
|--------|-----------|
| `user_tenants` | Associacao N:N entre usuarios e tenants |

#### Schema

```sql
CREATE TABLE user_tenants (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,           -- FK users.id
    tenant_id TEXT NOT NULL,         -- FK tenants.id
    role TEXT DEFAULT 'viewer',      -- 'admin', 'editor', 'viewer'
    granted_by TEXT,                 -- Quem concedeu
    granted_at TEXT,                 -- Quando
    expires_at TEXT,                 -- Expiracao (opcional)
    is_active INTEGER DEFAULT 1,     -- Ativo?
    created_at TEXT,
    updated_at TEXT,
    UNIQUE(user_id, tenant_id)
);
```

#### Roles Disponiveis

| Role | Permissoes |
|------|------------|
| `admin` | Visualizar, editar, exportar, gerenciar usuarios |
| `editor` | Visualizar, editar, exportar |
| `viewer` | Apenas visualizar |

---

### 006 - Seed Admin Access

**Data estimada:** 28 Novembro 2025
**Arquivo:** `006_seed_admin_access.sql`

#### Acoes

1. Garante existencia do tenant CLIENTE_01
2. Associa usuario admin ao CLIENTE_01 com role `admin`

#### SQL

```sql
INSERT OR IGNORE INTO tenants (id, code, name, email, status)
VALUES (
  'tenant_cliente_01',
  'CLIENTE_01',
  'COMURG - Companhia de Urbanizacao de Goiania',
  'cliente01@investigaree.com.br',
  'active'
);

INSERT OR IGNORE INTO user_tenants (id, user_id, tenant_id, role, granted_by, is_active)
SELECT lower(hex(randomblob(16))), u.id, 'tenant_cliente_01', 'admin', 'system', 1
FROM users u WHERE u.email = 'contato@investigaree.com.br';
```

---

### 007 - Admin Alerts

**Data estimada:** 29 Novembro 2025
**Arquivo:** `007_admin_alerts.sql`

#### Tabelas Criadas

| Tabela | Descricao |
|--------|-----------|
| `admin_alerts` | Alertas para administradores |
| `admin_notification_settings` | Preferencias de notificacao |

#### Schema - admin_alerts

```sql
CREATE TABLE admin_alerts (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,           -- 'new_user', 'new_lead', 'error'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data TEXT,                    -- JSON adicional
    severity TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'success'
    is_read INTEGER DEFAULT 0,
    read_by TEXT,
    read_at TEXT,
    created_at TEXT
);
```

#### Tipos de Alerta

| Type | Descricao | Severity |
|------|-----------|----------|
| `new_user` | Novo usuario cadastrado | info |
| `new_lead` | Novo lead capturado | info |
| `access_request` | Solicitacao de acesso | warning |
| `error` | Erro no sistema | error |

#### Seed - Admins Master

```sql
INSERT INTO admin_notification_settings (admin_email, notify_new_users, notify_new_leads, notify_errors)
VALUES
    ('dkbotdani@gmail.com', 1, 1, 1),
    ('ibsenmaciel@gmail.com', 1, 1, 1),
    ('contato@investigaree.com.br', 1, 1, 1);
```

---

### 008 - Create Admin Users

**Data estimada:** 29 Novembro 2025
**Arquivo:** `008_create_admin_users.sql`

#### Acoes

1. Cria usuarios admin master na tabela users
2. Associa admins ao CLIENTE_01 com role admin

#### Usuarios Criados

| ID | Email | Nome |
|----|-------|------|
| `admin_dani_master` | dkbotdani@gmail.com | Dani Kaloi (Admin Master) |
| `admin_ibsen` | ibsenmaciel@gmail.com | Ibsen Maciel (Admin) |

#### SQL

```sql
INSERT OR IGNORE INTO users (id, email, name, created_at, updated_at)
VALUES
  ('admin_dani_master', 'dkbotdani@gmail.com', 'Dani Kaloi (Admin Master)', datetime('now'), datetime('now')),
  ('admin_ibsen', 'ibsenmaciel@gmail.com', 'Ibsen Maciel (Admin)', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO user_tenants (id, user_id, tenant_id, role, granted_by, is_active)
VALUES
  (lower(hex(randomblob(16))), 'admin_dani_master', 'tenant_cliente_01', 'admin', 'system', 1),
  (lower(hex(randomblob(16))), 'admin_ibsen', 'tenant_cliente_01', 'admin', 'system', 1);
```

---

### 009 - User Data Individual

**Data estimada:** 29 Novembro 2025
**Arquivo:** `009_user_data_individual.sql`

#### Impacto

> **MODELO ALTERNATIVO** - Dados isolados por usuario (nao por tenant)

#### Motivacao

Permite que usuarios individuais (nao vinculados a tenant) tenham seus proprios dados isolados.

#### Tabelas Criadas

| Tabela | Descricao |
|--------|-----------|
| `user_funcionarios` | Funcionarios do usuario |
| `user_obitos` | Obitos verificados |
| `user_candidaturas` | Candidaturas |
| `user_doacoes` | Doacoes |
| `user_vinculos` | Vinculos empresariais |
| `user_sancoes` | Sancoes |
| `user_beneficios` | Beneficios |
| `user_settings` | Configuracoes do usuario |

#### Schema - user_settings

```sql
CREATE TABLE user_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    empresa_nome TEXT,
    empresa_cnpj TEXT,
    plano TEXT DEFAULT 'free',
    limite_funcionarios INTEGER DEFAULT 100,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Como Executar Migrations

### Desenvolvimento Local

```bash
# Executar migration especifica
wrangler d1 execute investigaree-db --local --file=workers/migrations/004_tenant_data.sql

# Executar todas em ordem
for file in workers/migrations/*.sql; do
  wrangler d1 execute investigaree-db --local --file="$file"
done
```

### Producao

```bash
# Com confirmacao
wrangler d1 execute investigaree-db --file=workers/migrations/004_tenant_data.sql

# Verificar resultado
wrangler d1 execute investigaree-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

---

## Proximas Migrations Planejadas

| Migration | Descricao | Status |
|-----------|-----------|--------|
| 010 | Tabela de logs de auditoria (LGPD) | Planejado |
| 011 | Tabela de planos e billing | Planejado |
| 012 | Tabela de relatorios gerados | Planejado |

---

## Rollback

> **ATENCAO:** D1 nao suporta transacoes multi-statement. Rollbacks devem ser feitos manualmente.

### Exemplo de Rollback

```sql
-- Rollback da migration 007
DROP TABLE IF EXISTS admin_alerts;
DROP TABLE IF EXISTS admin_notification_settings;
```

---

**Documento atualizado em:** 30/11/2025
