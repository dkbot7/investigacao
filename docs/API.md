# API Reference - investigaree

**Ultima atualizacao**: 30 de Novembro de 2025
**Versao**: 1.0.0

Base URL: `https://api.investigaree.com.br`

> **Nota**: A especificacao completa OpenAPI 3.1 esta disponivel em [openapi.yaml](./openapi.yaml).
> Pode ser importada no Swagger UI, Postman ou outras ferramentas de API.

---

## Indice de Endpoints

| Grupo | Rota Base | Autenticacao | Descricao |
|-------|-----------|--------------|-----------|
| Health | `/`, `/health` | Nao | Status da API |
| Auth | `/api/auth` | Nao | Registro e sincronizacao |
| Leads | `/api/leads` | Nao | Captacao de leads |
| Consultor | `/api/chatbot` | Nao | Consultas automatizadas |
| Investigation | `/api/investigation` | Nao | Solicitacoes de investigacao |
| Consultas Publicas | `/api/consultas` | Nao | CEP, CNPJ (Brasil API) |
| Infosimples | `/api/infosimples` | Sim | CPF, CNPJ, processos |
| Transparencia | `/api/transparencia` | Sim | Servidores, CEIS, CNEP |
| Webhooks | `/api/webhooks` | Signature | Stripe webhooks |
| Reports | `/api/reports` | Sim | Relatorios de due diligence |
| Payments | `/api/payments` | Sim | Pagamentos Stripe |
| User | `/api/user` | Sim | Perfil do usuario |
| LGPD | `/api/lgpd` | Sim | Direitos do titular |
| Tenant Data | `/api/tenant` | Sim | Dados multi-tenant (B2B) |
| User Data | `/api/userdata` | Sim | Dados individuais (B2C) |
| Admin | `/api/admin` | Sim (admin) | Gerenciamento do sistema |

---

## Autenticacao

Rotas protegidas requerem header de autorizacao:

```
Authorization: Bearer <firebase_id_token>
```

Para obter o token:
```javascript
const token = await firebase.auth().currentUser.getIdToken();
```

---

## Endpoints Publicos

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-29T12:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### API Info

```
GET /
```

**Response:**
```json
{
  "name": "investigaree API",
  "version": "1.0.0",
  "status": "operational",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth",
    "leads": "/api/leads",
    "chatbot": "/api/chatbot/message",
    "reports": "/api/reports",
    "payments": "/api/payments",
    "webhooks": "/api/webhooks/stripe",
    "user": "/api/user",
    "lgpd": "/api/lgpd",
    "consultas": "/api/consultas",
    "infosimples": "/api/infosimples",
    "transparencia": "/api/transparencia"
  }
}
```

---

## Autenticacao (`/api/auth`)

### Registrar Usuario

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "firebase_uid": "abc123",
  "email": "usuario@email.com",
  "name": "Nome Completo",
  "phone": "(62) 99999-9999"
}
```

**Response (201):**
```json
{
  "success": true,
  "user_id": "uuid-do-usuario",
  "message": "Usuario criado com sucesso!"
}
```

### Sincronizar Usuario

```
POST /api/auth/sync
```

**Request Body:**
```json
{
  "firebase_uid": "abc123",
  "email": "usuario@email.com",
  "name": "Nome Atualizado"
}
```

### Obter Usuario Atual

```
GET /api/auth/me
Authorization: Bearer <token>
```

---

## Leads (`/api/leads`)

Captacao de leads via landing page e WhatsApp.

### Criar Lead (Landing Page)

```
POST /api/leads
```

**Request Body:**
```json
{
  "firebase_uid": "abc123",
  "email": "usuario@email.com",
  "name": "Nome",
  "phone": "(62) 99999-9999",
  "consent": true,
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "brand"
}
```

**Response (201):**
```json
{
  "success": true,
  "lead_id": "uuid",
  "message": "Lead cadastrado com sucesso!"
}
```

### Criar Lead (WhatsApp)

```
POST /api/leads/whatsapp
```

**Request Body:**
```json
{
  "nome": "Nome do Lead",
  "contato": "email@ou.telefone",
  "mensagem": "Mensagem opcional",
  "origem": "whatsapp",
  "pagina": "/servicos"
}
```

### Listar Leads

```
GET /api/leads
```

### Estatisticas de Leads

```
GET /api/leads/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "today": 5
  }
}
```

### Obter Lead por ID

```
GET /api/leads/:id
```

---

## Consultor (`/api/chatbot`)

Sistema de consultas automatizadas para analise de integridade.

### Enviar Mensagem

```
POST /api/chatbot/message
```

**Request Body:**
```json
{
  "lead_id": "uuid-opcional",
  "message": "Quero saber sobre due diligence",
  "thread_id": "thread_id_existente"
}
```

**Response:**
```json
{
  "message": "Resposta do assistente...",
  "thread_id": "thread_123",
  "intencao_detectada": "interesse",
  "lead_score": 65
}
```

---

## Investigation (`/api/investigation`)

Solicitacoes de investigacao via email.

### Enviar Solicitacao

```
POST /api/investigation/request
```

**Request Body:**
```json
{
  "userEmail": "cliente@email.com",
  "subject": "Investigacao de Background",
  "description": "Descricao detalhada da investigacao solicitada..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Solicitacao enviada com sucesso"
}
```

---

## Consultas Publicas (`/api/consultas`)

APIs publicas brasileiras (sem autenticacao).

### CEP

```
GET /api/consultas/cep/:cep
```

**Response:**
```json
{
  "cep": "74000-000",
  "logradouro": "Praca Civica",
  "bairro": "Centro",
  "localidade": "Goiania",
  "uf": "GO"
}
```

### CNPJ

```
GET /api/consultas/cnpj/:cnpj
```

**Response:**
```json
{
  "cnpj": "12345678000199",
  "razao_social": "EMPRESA LTDA",
  "nome_fantasia": "LOJA",
  "situacao_cadastral": "ATIVA",
  "data_abertura": "2010-01-01"
}
```

---

## Reports (`/api/reports`)

Relatorios de due diligence. **Requer autenticacao.**

### Listar Relatorios

```
GET /api/reports
Authorization: Bearer <token>
```

**Response:**
```json
{
  "reports": [
    {
      "id": "uuid",
      "startup_nome": "Startup XYZ",
      "startup_cnpj": "12.345.678/0001-99",
      "status": "concluido",
      "recomendacao": "APROVADO",
      "score_integridade": 85,
      "created_at": "2025-11-29T12:00:00.000Z",
      "pdf_url_secure": "https://..."
    }
  ],
  "total": 5
}
```

### Obter Relatorio

```
GET /api/reports/:id
Authorization: Bearer <token>
```

### Criar Relatorio

```
POST /api/reports
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "startup_nome": "Startup XYZ",
  "startup_cnpj": "12.345.678/0001-99",
  "startup_setor": "Fintech",
  "startup_website": "https://startup.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "report_id": "uuid",
  "message": "Relatorio criado com sucesso",
  "prazo_entrega": "2025-12-02T12:00:00.000Z",
  "status": "pendente"
}
```

### Atualizar Relatorio

```
PATCH /api/reports/:id
Authorization: Bearer <token>
```

### Download PDF

```
GET /api/reports/:id/download
Authorization: Bearer <token>
```

Retorna arquivo PDF.

### URL Assinada para Download

```
GET /api/reports/:id/signed-url
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "download_url": "https://...",
  "expires_in": 3600,
  "expires_at": "2025-11-29T13:00:00.000Z"
}
```

### Regenerar PDF

```
POST /api/reports/:id/regenerate-pdf
Authorization: Bearer <token>
```

---

## Payments (`/api/payments`)

Integracao com Stripe. **Requer autenticacao.**

### Criar Checkout Session

```
POST /api/payments/create-intent
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "produto": "relatorio-startup",
  "startup_nome": "Startup XYZ",
  "startup_cnpj": "12.345.678/0001-99"
}
```

**Produtos disponiveis:**
| Produto | Preco |
|---------|-------|
| `relatorio-startup` | R$ 10.000,00 |
| `assinatura-pro` | R$ 2.500,00/mes |
| `assinatura-enterprise` | R$ 5.000,00/mes |

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_xxx",
  "url": "https://checkout.stripe.com/...",
  "amount": 1000000,
  "currency": "brl"
}
```

### Listar Pagamentos

```
GET /api/payments
Authorization: Bearer <token>
```

### Obter Pagamento

```
GET /api/payments/:id
Authorization: Bearer <token>
```

---

## User (`/api/user`)

Gerenciamento de perfil. **Requer autenticacao.**

### Obter Perfil

```
GET /api/user/profile
Authorization: Bearer <token>
```

### Atualizar Perfil

```
PATCH /api/user/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "nome_completo": "Nome Atualizado",
  "telefone": "+5562999999999",
  "empresa": "Empresa LTDA",
  "cargo": "Diretor"
}
```

### Atualizar Consentimentos

```
PATCH /api/user/consents
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "lgpd_consent": true,
  "marketing_consent": false,
  "newsletter_consent": true
}
```

### Estatisticas do Usuario

```
GET /api/user/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "reports": {
    "total": 5,
    "pendente": 1,
    "em_andamento": 1,
    "concluido": 3
  },
  "payments": {
    "total": 5,
    "total_spent": 50000,
    "pending": 0,
    "succeeded": 5
  }
}
```

### Historico de Atividades

```
GET /api/user/activity?limit=50&offset=0
Authorization: Bearer <token>
```

### Remover Avatar

```
DELETE /api/user/avatar
Authorization: Bearer <token>
```

---

## LGPD (`/api/lgpd`)

Direitos do titular de dados (LGPD Art. 18). **Requer autenticacao.**

### Criar Solicitacao LGPD

```
POST /api/lgpd/request
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "request_type": "export",
  "reason": "Quero uma copia dos meus dados"
}
```

**Tipos de solicitacao:**
| Tipo | Descricao | Prazo |
|------|-----------|-------|
| `export` | Exportar todos os dados | 24h |
| `delete` | Excluir conta e dados | 30 dias |
| `anonymize` | Anonimizar dados pessoais | 3 dias |
| `rectify` | Corrigir dados | 2 dias |

**Response (201):**
```json
{
  "success": true,
  "request_id": "uuid",
  "message": "Solicitacao registrada com sucesso",
  "status": "pending",
  "estimated_completion": "2025-11-30T12:00:00.000Z"
}
```

### Listar Solicitacoes

```
GET /api/lgpd/requests
Authorization: Bearer <token>
```

### Exportar Dados

```
GET /api/lgpd/export
Authorization: Bearer <token>
```

Retorna JSON com todos os dados do usuario.

### Anonimizar Dados

```
POST /api/lgpd/anonymize
Authorization: Bearer <token>
```

### Excluir Conta

```
DELETE /api/lgpd/delete-account
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "confirm_token": "DELETE_MY_ACCOUNT"
}
```

### Historico de Consentimentos

```
GET /api/lgpd/consents
Authorization: Bearer <token>
```

---

## Tenant Data (`/api/tenant`)

Dados multi-tenant para clientes B2B. **Requer autenticacao.**

### Informacoes do Tenant

```
GET /api/tenant/info
Authorization: Bearer <token>
```

**Response (com acesso):**
```json
{
  "hasAccess": true,
  "tenant": {
    "id": "tenant_cliente_01",
    "code": "CLIENTE_01",
    "name": "COMURG",
    "role": "viewer"
  },
  "tenants": [...],
  "role": "viewer"
}
```

**Response (sem acesso):**
```json
{
  "hasAccess": false,
  "tenant": null,
  "tenants": [],
  "message": "Aguardando liberacao de acesso"
}
```

### Dashboard

```
GET /api/tenant/dashboard
Authorization: Bearer <token>
```

### Funcionarios

```
GET /api/tenant/funcionarios?grupo=Comurg&alerta=obito&page=1&limit=50
Authorization: Bearer <token>
```

**Query Parameters:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| grupo | string | Filtrar por grupo |
| busca | string | Busca por nome ou CPF |
| alerta | string | obito, beneficio, sancionado, doador, candidato, socio |
| page | number | Pagina (default: 1) |
| limit | number | Itens por pagina (default: 50) |

### Detalhes do Funcionario

```
GET /api/tenant/funcionario/:id
Authorization: Bearer <token>
```

### Obitos

```
GET /api/tenant/obitos
Authorization: Bearer <token>
```

### Candidatos

```
GET /api/tenant/candidatos
Authorization: Bearer <token>
```

### Doadores

```
GET /api/tenant/doadores
Authorization: Bearer <token>
```

### Sancionados

```
GET /api/tenant/sancionados
Authorization: Bearer <token>
```

### Vinculos Empresariais

```
GET /api/tenant/vinculos
Authorization: Bearer <token>
```

### Beneficios

```
GET /api/tenant/beneficios
Authorization: Bearer <token>
```

### Exportar Dados

```
GET /api/tenant/export/:type?grupo=Comurg
Authorization: Bearer <token>
```

**Tipos:** `funcionarios`, `obitos`, `candidatos`, `doadores`, `vinculos`

Retorna CSV.

---

## User Data (`/api/userdata`)

Dados individuais por usuario (B2C). **Requer autenticacao.**

### Informacoes do Usuario

```
GET /api/userdata/info
Authorization: Bearer <token>
```

**Response:**
```json
{
  "hasAccess": true,
  "user": {
    "id": "uuid",
    "email": "usuario@email.com"
  },
  "settings": {
    "plano": "free",
    "limite_funcionarios": 100
  },
  "stats": {
    "total_funcionarios": 50
  }
}
```

### Dashboard

```
GET /api/userdata/dashboard
Authorization: Bearer <token>
```

### Funcionarios

```
GET /api/userdata/funcionarios?grupo=&busca=&alerta=&page=1&limit=50
Authorization: Bearer <token>
```

### Adicionar Funcionario

```
POST /api/userdata/funcionarios
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "nome": "JOAO DA SILVA",
  "cpf": "12345678901",
  "grupo": "Administrativo",
  "cargo": "Analista",
  "salario": 5000
}
```

### Importar Funcionarios

```
POST /api/userdata/funcionarios/import
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "funcionarios": [
    { "nome": "JOAO", "cpf": "123...", "grupo": "..." },
    { "nome": "MARIA", "cpf": "456...", "grupo": "..." }
  ]
}
```

### Detalhes do Funcionario

```
GET /api/userdata/funcionario/:id
Authorization: Bearer <token>
```

### Obitos

```
GET /api/userdata/obitos
Authorization: Bearer <token>
```

### Candidatos

```
GET /api/userdata/candidatos
Authorization: Bearer <token>
```

### Doadores

```
GET /api/userdata/doadores
Authorization: Bearer <token>
```

### Sancionados

```
GET /api/userdata/sancionados
Authorization: Bearer <token>
```

### Vinculos

```
GET /api/userdata/vinculos
Authorization: Bearer <token>
```

### Beneficios

```
GET /api/userdata/beneficios
Authorization: Bearer <token>
```

### Atualizar Configuracoes

```
PUT /api/userdata/settings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "empresa_nome": "Minha Empresa",
  "empresa_cnpj": "12.345.678/0001-99"
}
```

---

## Admin (`/api/admin`)

Gerenciamento do sistema. **Requer role `admin`.**

### Listar Usuarios

```
GET /api/admin/users
Authorization: Bearer <token>
```

### Listar Tenants

```
GET /api/admin/tenants
Authorization: Bearer <token>
```

### Usuarios Pendentes

```
GET /api/admin/pending-users
Authorization: Bearer <token>
```

### Criar Tenant

```
POST /api/admin/tenants
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "code": "CLIENTE_02",
  "name": "Nome do Cliente"
}
```

### Conceder Acesso

```
POST /api/admin/grant-access
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "user_email": "usuario@email.com",
  "tenant_code": "CLIENTE_01",
  "role": "viewer",
  "expires_at": "2025-12-31T23:59:59.000Z"
}
```

**Roles:** `admin`, `editor`, `viewer`

### Revogar Acesso

```
DELETE /api/admin/revoke-access?user_email=x@y.com&tenant_code=CLIENTE_01
Authorization: Bearer <token>
```

### Listar Alertas

```
GET /api/admin/alerts?unread_only=true&limit=50
Authorization: Bearer <token>
```

### Marcar Alerta como Lido

```
POST /api/admin/alerts/:id/read
Authorization: Bearer <token>
```

### Marcar Todos como Lidos

```
POST /api/admin/alerts/read-all
Authorization: Bearer <token>
```

### Contagem de Alertas

```
GET /api/admin/alerts/count
Authorization: Bearer <token>
```

### Estatisticas do Sistema

```
GET /api/admin/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_users": 15,
  "total_tenants": 2,
  "pending_users": 3,
  "active_tenants": 2
}
```

---

## Webhooks (`/api/webhooks`)

Webhooks de servicos externos.

### Stripe Webhook

```
POST /api/webhooks/stripe
Stripe-Signature: <signature>
```

Processa eventos do Stripe:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

---

## Erros

### Formato de Erro

```json
{
  "error": true,
  "message": "Descricao do erro",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Codigos de Erro

| Codigo | HTTP | Descricao |
|--------|------|-----------|
| AUTH_TOKEN_MISSING | 401 | Token nao fornecido |
| AUTH_TOKEN_INVALID | 401 | Token invalido ou expirado |
| AUTH_REQUIRED | 401 | Autenticacao necessaria |
| USER_NOT_FOUND | 404 | Usuario nao encontrado |
| NO_TENANT_ACCESS | 403 | Usuario sem acesso a tenant |
| ADMIN_ONLY | 403 | Apenas administradores |
| PAYMENT_REQUIRED | 402 | Pagamento necessario |
| ACTIVE_DATA_EXISTS | 409 | Dados ativos impedem acao |
| PENDING_PAYMENTS | 409 | Pagamentos pendentes |
| VALIDATION_ERROR | 400 | Dados invalidos |
| NOT_FOUND | 404 | Recurso nao encontrado |
| INTERNAL_ERROR | 500 | Erro interno |

---

## Rate Limiting

- 100 requisicoes por minuto por IP
- Headers de resposta:
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisicoes restantes
  - `X-RateLimit-Reset`: Timestamp de reset

## CORS

Origens permitidas:
- `https://investigaree.com.br`
- `https://www.investigaree.com.br`
- `https://investigaree.pages.dev`
- `https://*.investigaree.pages.dev`
- `http://localhost:5173` (desenvolvimento)

---

## Arquivos de Implementacao

| Endpoint | Arquivo |
|----------|---------|
| `/api/auth` | `workers/api/auth.ts` |
| `/api/leads` | `workers/api/leads.ts` |
| `/api/chatbot` | `workers/api/chatbot.ts` |
| `/api/investigation` | `workers/api/investigation.ts` |
| `/api/consultas` | `workers/api/consultas-publicas.ts` |
| `/api/infosimples` | `workers/api/consultas-infosimples.ts` |
| `/api/transparencia` | `workers/api/consultas-transparencia.ts` |
| `/api/webhooks` | `workers/api/webhooks.ts` |
| `/api/reports` | `workers/api/reports.ts` |
| `/api/payments` | `workers/api/payments.ts` |
| `/api/user` | `workers/api/user.ts` |
| `/api/lgpd` | `workers/api/lgpd.ts` |
| `/api/tenant` | `workers/api/tenant-data.ts` |
| `/api/userdata` | `workers/api/user-data.ts` |
| `/api/admin` | `workers/api/admin.ts` |
