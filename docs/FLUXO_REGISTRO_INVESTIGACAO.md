# Fluxo Técnico: Registro de Usuário e Criação de Investigação

**Data:** 03/12/2025
**Elaborado por:** Claude Code / InvestigaRee

---

## Visão Geral

Este documento descreve o fluxo técnico real do backend quando:
1. Um novo usuário cria uma conta
2. Esse usuário abre uma nova investigação

---

## PARTE 1: Novo Usuário Cria Conta

### 1.1 Fluxo Visual

```
FRONTEND                           BACKEND                          BANCO D1
─────────────────────────────────────────────────────────────────────────────
RegisterModal.tsx
    │
    ├─► Firebase Auth ─────────► Cria conta no Firebase
    │   (createUserWithEmailAndPassword)
    │
    ├─► POST /api/auth/register ─► workers/api/auth.ts
    │   Body: {                      │
    │     firebase_uid,              ├─► Valida com Zod
    │     email,                     ├─► Verifica duplicidade
    │     name,                      ├─► INSERT INTO users
    │     phone                      └─► notifyNewUser() ─► Email para admins
    │   }                                                   (Resend API)
    │
    └─► Redireciona para /dashboard
```

### 1.2 Arquivos Envolvidos

| Arquivo | Função |
|---------|--------|
| `investigaree/src/components/auth/RegisterModal.tsx` | Modal de registro no frontend |
| `investigaree/src/contexts/AuthContext.tsx` | Função `signup()` que orquestra o processo |
| `investigaree/src/lib/firebase.ts` | Configuração do Firebase Auth |
| `workers/api/auth.ts` | Endpoint `/api/auth/register` |
| `workers/services/notifications.ts` | Função `notifyNewUser()` |

### 1.3 Passo a Passo Detalhado

**PASSO 1: Frontend - RegisterModal.tsx**

```typescript
const handlePasswordSubmit = async (e: React.FormEvent) => {
  // 1. Validação de senha (6+ caracteres)
  if (password.length < 6) { ... }
  if (password !== confirmPassword) { ... }

  // 2. Chamada para Firebase (Client-side)
  await signup(email, password, { name, whatsapp });

  // 3. Redireciona para dashboard
  window.location.href = "/dashboard";
}
```

**PASSO 2: Frontend - AuthContext.tsx**

```typescript
const signup = async (email: string, password: string, userData: { name: string; whatsapp: string }) => {
  // 1. CRIA CONTA NO FIREBASE
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // 2. ATUALIZA PERFIL DO FIREBASE
  await updateProfile(userCredential.user, {
    displayName: userData.name
  });

  // 3. SINCRONIZA COM D1 DATABASE (Backend)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';
  await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firebase_uid: userCredential.user.uid,
      email: email,
      name: userData.name,
      phone: userData.whatsapp
    })
  });

  setUser(userCredential.user);
}
```

**PASSO 3: Backend - Endpoint POST /api/auth/register**

```typescript
app.post('/register', async (c) => {
  // 1. VALIDAÇÃO DOS DADOS COM ZOD
  const validated = registerSchema.parse(body);

  // 2. VERIFICA SE USUÁRIO JÁ EXISTE
  const existingUser = await c.env.DB.prepare(
    'SELECT id FROM users WHERE firebase_uid = ? OR email = ? LIMIT 1'
  ).bind(validated.firebase_uid, validated.email).first();

  if (existingUser) {
    return c.json({
      success: true,
      user_id: existingUser.id,
      message: 'Usuário já cadastrado',
      existing: true,
    }, 200);
  }

  // 3. CRIA NOVO USUÁRIO NO D1
  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO users (id, firebase_uid, email, name, phone, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(userId, validated.firebase_uid, validated.email, validated.name, validated.phone, now, now).run();

  // 4. NOTIFICA ADMINS (ASYNCHRONOUSLY)
  c.executionCtx.waitUntil(
    notifyNewUser(c.env, {
      email: validated.email,
      name: validated.name,
      phone: validated.phone,
      created_at: now
    })
  );

  return c.json({ success: true, user_id: userId, message: 'Usuário criado com sucesso!' }, 201);
})
```

### 1.4 Tabela Afetada: `users`

**Schema:**
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,              -- UUID gerado no backend
  firebase_uid TEXT UNIQUE NOT NULL, -- UID do Firebase
  email TEXT UNIQUE NOT NULL,        -- Email único
  name TEXT,                         -- Nome do usuário
  phone TEXT,                        -- Telefone/WhatsApp
  created_at TEXT,                   -- Data de criação
  updated_at TEXT                    -- Data de última atualização
);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
```

**Exemplo de registro inserido:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firebase_uid": "abc123xyz789",
  "email": "usuario@example.com",
  "name": "Roberto Andrade",
  "phone": "(11) 99999-9999",
  "created_at": "2025-12-03T10:30:45.000Z",
  "updated_at": "2025-12-03T10:30:45.000Z"
}
```

### 1.5 Validações Realizadas

| Campo | Validação | Erro Retornado |
|-------|-----------|-----------------|
| `firebase_uid` | Obrigatório, min 1 char | "Firebase UID é obrigatório" |
| `email` | Email válido (RFC 5322) | "Email inválido" |
| `name` | Opcional | - |
| `phone` | Opcional | - |
| Duplicidade | firebase_uid UNIQUE, email UNIQUE | Retorna user_id existente |

### 1.6 Notificações por Email

**Destinatários:**
- dkbotdani@gmail.com
- ibsenmaciel@gmail.com
- contato@investigaree.com.br

**Provider:** Resend API

**Conteúdo:**
```html
<h2>Novo Usuário Cadastrado</h2>
<p><strong>Email:</strong> usuario@example.com</p>
<p><strong>Nome:</strong> Roberto Andrade</p>
<p><strong>Telefone:</strong> (11) 99999-9999</p>
<p><strong>Data:</strong> 03/12/2025 10:30</p>
```

---

## PARTE 2: Usuário Abre Nova Investigação

### 2.1 Fluxo Visual

```
FRONTEND                           BACKEND                          BANCO D1
─────────────────────────────────────────────────────────────────────────────
AddInvestigacaoModal.tsx
    │
    ├─► Valida: nome OU documento obrigatório
    │
    └─► POST /api/investigations ─► workers/api/investigations.ts
        Headers: {                     │
          Authorization: Bearer [token] ├─► authMiddleware()
        }                              │    └─► Valida token Firebase
        Body: {                        │    └─► Busca user no D1
          nome,                        │
          documento,                   ├─► ensureUser() - cria user se não existir
          tipo_pessoa,                 │
          categoria,                   ├─► INSERT INTO user_investigacoes
          nivel_urgencia,              │
          motivo_investigacao,         └─► Email para admins (Resend API)
          ...                              To: investigaree@gmail.com,
        }                                       ibsenmaciel@gmail.com
```

### 2.2 Arquivos Envolvidos

| Arquivo | Função |
|---------|--------|
| `investigaree/src/components/dashboard/AddInvestigacaoModal.tsx` | Modal de criação de investigação |
| `investigaree/src/lib/api.ts` | Função `createInvestigation()` |
| `workers/middleware/auth.ts` | Middleware de autenticação |
| `workers/api/investigations.ts` | Endpoint `/api/investigations` |

### 2.3 Passo a Passo Detalhado

**PASSO 1: Frontend - AddInvestigacaoModal.tsx**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // 1. VALIDAÇÃO: Nome OU Documento obrigatório
  if (!formData.nome.trim() && !formData.cpf_cnpj.trim()) {
    setError("Preencha pelo menos o Nome ou o Documento");
    return;
  }

  // 2. FORMATAÇÃO DO DOCUMENTO (remover formatação)
  const docFormatted = formData.cpf_cnpj.replace(/\D/g, "");

  // 3. PREPARAÇÃO DOS DADOS
  const data = {
    nome: formData.nome.trim(),
    documento: docFormatted,
    tipo_pessoa: tipoPessoa,
    categoria: categoriasArray[0] || 'funcionarios',
    nivel_urgencia: formData.nivel_urgencia,
    motivo_investigacao: formData.motivo_investigacao,
    // ... outros campos
  };

  // 4. CHAMADA À API
  await createInvestigation(data);
  onSuccess();
}
```

**PASSO 2: Frontend - API Client (lib/api.ts)**

```typescript
export async function createInvestigation(data: InvestigationData) {
  return fetchAPI<{ success: boolean; id: string; message: string }>(
    '/api/investigations',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

// fetchAPI adiciona automaticamente o token Firebase
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  const token = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  return response.json();
}
```

**PASSO 3: Backend - Middleware de Autenticação**

```typescript
export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: true, message: 'Token de autenticação não fornecido' }, 401);
  }

  const token = authHeader.substring(7);

  // VALIDA TOKEN COM FIREBASE
  const decodedToken = await verifyFirebaseToken(token, c.env);

  if (!decodedToken) {
    return c.json({ error: true, message: 'Token inválido ou expirado' }, 401);
  }

  // BUSCA USUÁRIO NO D1
  const user = await getUserFromD1(decodedToken.uid, c.env.DB);

  // ADICIONA DADOS AO CONTEXTO
  c.set('user', user);
  c.set('userId', user?.id || null);
  c.set('firebaseUid', decodedToken.uid);
  c.set('userEmail', decodedToken.email);

  await next();
}
```

**PASSO 4: Backend - Endpoint POST /api/investigations**

```typescript
app.post('/', async (c) => {
  // 1. GARANTE QUE USUÁRIO EXISTE NO D1
  const user = await ensureUser(c);
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401);
  }

  const body = await c.req.json();

  // 2. VALIDAÇÃO: Nome OU Documento obrigatório
  if (!body.nome && !body.documento) {
    return c.json({ error: true, message: 'Preencha pelo menos o Nome ou o Documento' }, 400);
  }

  // 3. GERA ID ÚNICO
  const id = crypto.randomUUID();

  // 4. INSERE NA TABELA user_investigacoes
  await c.env.DB.prepare(`
    INSERT INTO user_investigacoes (
      id, user_id, nome, documento, tipo_pessoa, categoria,
      status, nivel_urgencia, motivo_investigacao, observacoes,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'investigar', ?, ?, ?, datetime('now'), datetime('now'))
  `).bind(
    id, user.id, body.nome, body.documento, body.tipo_pessoa,
    body.categoria, body.nivel_urgencia, body.motivo_investigacao, body.observacoes
  ).run();

  // 5. NOTIFICA ADMINS
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'investigaree <noreply@investigaree.com.br>',
      to: ['investigaree@gmail.com', 'ibsenmaciel@gmail.com'],
      subject: `Nova Investigação - ${body.nome}`,
      html: `<h2>Nova Investigação Solicitada</h2>
             <p><strong>Cliente:</strong> ${user.email}</p>
             <p><strong>Investigado:</strong> ${body.nome}</p>
             <p><strong>Documento:</strong> ${body.documento}</p>
             <p><strong>Categoria:</strong> ${body.categoria}</p>
             <p><strong>Urgência:</strong> ${body.nivel_urgencia}</p>`
    })
  });

  return c.json({ success: true, id, message: 'Investigacao criada com sucesso' });
})
```

### 2.4 Tabela Afetada: `user_investigacoes`

**Schema:**
```sql
CREATE TABLE IF NOT EXISTS user_investigacoes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Dados do investigado
  nome TEXT,
  documento TEXT,
  tipo_pessoa TEXT DEFAULT 'fisica',
  is_grupo INTEGER DEFAULT 0,
  grupo_nome TEXT,
  grupo_total_documentos INTEGER DEFAULT 1,

  -- Categorização
  categoria TEXT DEFAULT 'funcionarios',

  -- Status e Workflow
  status TEXT DEFAULT 'investigar',
  nivel_urgencia TEXT DEFAULT 'media',

  -- Informações adicionais
  email TEXT,
  telefones TEXT,
  endereco TEXT,
  redes_sociais TEXT,
  rg TEXT,
  data_nascimento TEXT,

  -- Investigação
  motivo_investigacao TEXT,
  escopo_investigacao TEXT,
  observacoes TEXT,

  -- Relatório
  relatorio_url TEXT,
  relatorio_gerado_em TEXT,

  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Exemplo de registro inserido:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João da Silva",
  "documento": "12345678900",
  "tipo_pessoa": "fisica",
  "categoria": "funcionarios",
  "status": "investigar",
  "nivel_urgencia": "media",
  "motivo_investigacao": "Candidato a emprego",
  "created_at": "2025-12-03T10:35:20.000Z",
  "updated_at": "2025-12-03T10:35:20.000Z"
}
```

### 2.5 Workflow de Status

```
investigar → investigando → relatorio → aprovado/bloqueado → monitoramento
```

| Status | Descrição |
|--------|-----------|
| `investigar` | Aguardando início da investigação (status inicial) |
| `investigando` | Investigação em andamento |
| `relatorio` | Relatório sendo elaborado |
| `aprovado` | Investigado aprovado |
| `bloqueado` | Investigado com restrições |
| `monitoramento` | Em monitoramento contínuo |

### 2.6 Notificações por Email

**Destinatários:**
- investigaree@gmail.com
- ibsenmaciel@gmail.com

**Conteúdo:**
```html
<h2>Nova Investigação Solicitada</h2>
<p><strong>Cliente:</strong> usuario@example.com</p>
<p><strong>Investigado:</strong> João da Silva</p>
<p><strong>Documento:</strong> 123.456.789-00</p>
<p><strong>Categoria:</strong> funcionarios</p>
<p><strong>Urgência:</strong> media</p>
<p><strong>Motivo:</strong> Candidato a emprego</p>
<hr>
<p><small>ID: 660e8400-e29b-41d4-a716-446655440001</small></p>
```

---

## PARTE 3: Endpoints Resumo

### Registro de Usuário

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| Firebase Auth API | POST | - | Cria usuário no Firebase |
| `/api/auth/register` | POST | - | Sincroniza com D1 |

### Criação de Investigação

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| `/api/investigations` | POST | Bearer Token | Cria nova investigação |
| Resend API | POST | API Key | Envia email para admins |

---

## PARTE 4: Problemas Identificados

| # | Problema | Severidade | Impacto |
|---|----------|-----------|---------|
| 1 | **Sem validação de CPF/CNPJ** | ALTA | Aceita documentos inválidos |
| 2 | **Usuário não recebe email de confirmação** | ALTA | Sem feedback ao usuário |
| 3 | **Sem rate limiting** | MÉDIA | Pode criar infinitas investigações |
| 4 | **Sem verificação de email** (double opt-in) | MÉDIA | Emails falsos podem ser usados |
| 5 | **Sem validação formal de telefone** | BAIXA | Telefones inválidos aceitos |
| 6 | **`ensureUser()` cria usuário sem Firebase válido** | BAIXA | Possíveis usuários órfãos |

---

## PARTE 5: Recomendações de Melhoria

### Curto Prazo
1. Implementar validação de CPF/CNPJ no backend
2. Enviar email de confirmação ao usuário após registro
3. Enviar email de confirmação ao usuário após criar investigação

### Médio Prazo
4. Implementar rate limiting (ex: 50 investigações/hora)
5. Adicionar verificação de email (double opt-in)
6. Validar formato de telefone

### Longo Prazo
7. Implementar fila de processamento para investigações
8. Adicionar dashboard de acompanhamento em tempo real
9. Implementar notificações push/WhatsApp

---

## Arquitetura Resumida

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                      │
│  RegisterModal.tsx ──► AuthContext.signup() ──► Firebase Auth   │
│  AddInvestigacaoModal.tsx ──► createInvestigation() ──► API     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│             CLOUDFLARE WORKERS (Hono Framework)                 │
│  POST /api/auth/register ──► INSERT users                       │
│  POST /api/investigations ──► INSERT user_investigacoes         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              CLOUDFLARE D1 (SQLite)                              │
│  TABLE: users                                                    │
│  TABLE: user_investigacoes                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RESEND API (Email)                            │
│  Notifica admins sobre novos usuários e investigações           │
└─────────────────────────────────────────────────────────────────┘
```

---

*Documento gerado em 03/12/2025 - InvestigaRee*
