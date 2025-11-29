# API Reference - investigaree

Base URL: `https://api.investigaree.com.br`

## Autenticacao

Todas as rotas protegidas requerem header de autorizacao:

```
Authorization: Bearer <firebase_id_token>
```

Para obter o token:
```javascript
const token = await firebase.auth().currentUser.getIdToken();
```

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
    "tenant": "/api/tenant",
    "admin": "/api/admin"
  }
}
```

---

## Autenticacao (`/api/auth`)

### Registrar Usuario

Cria registro no D1 apos cadastro no Firebase.

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

**Response (200) - Usuario ja existe:**
```json
{
  "success": true,
  "user_id": "uuid-existente",
  "message": "Usuario ja cadastrado",
  "existing": true
}
```

### Sincronizar Usuario

Sincroniza dados do Firebase com D1 (idempotente).

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

**Response:**
```json
{
  "success": true,
  "user_id": "uuid",
  "synced": true,
  "created": false
}
```

### Obter Usuario Atual

```
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "firebase_uid": "abc123",
    "email": "usuario@email.com",
    "name": "Nome",
    "phone": "(62) 99999-9999",
    "created_at": "2025-11-29T12:00:00.000Z"
  }
}
```

---

## Tenant (`/api/tenant`)

### Informacoes do Tenant

Retorna tenant(s) que o usuario tem acesso.

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
    "name": "COMURG - Companhia de Urbanizacao de Goiania",
    "role": "viewer"
  },
  "tenants": [
    {
      "id": "tenant_cliente_01",
      "code": "CLIENTE_01",
      "name": "COMURG",
      "role": "viewer"
    }
  ],
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

Dados consolidados para o dashboard principal.

```
GET /api/tenant/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "tenant": {
    "code": "CLIENTE_01",
    "name": "COMURG"
  },
  "stats": {
    "total_funcionarios": 5948,
    "total_obitos": 50,
    "total_beneficiarios": 4,
    "total_sancionados": 1,
    "total_doadores": 81,
    "total_candidatos": 8,
    "total_socios": 501
  },
  "grupos": [
    {
      "grupo": "Comurg",
      "registros": 4590,
      "obitos": 50,
      "candidatos": 8,
      "doadores": 62,
      "sancionados": 1,
      "socios": 381
    },
    {
      "grupo": "Disposicao",
      "registros": 1358,
      "obitos": 0,
      "candidatos": 0,
      "doadores": 19,
      "sancionados": 0,
      "socios": 120
    }
  ],
  "vinculos": {
    "total": 638,
    "cnpjs": 638
  },
  "doacoes": {
    "total_valor": 193648.84,
    "total_doacoes": 81
  },
  "updated_at": "2025-11-29T12:00:00.000Z"
}
```

### Funcionarios

Lista funcionarios com filtros e paginacao.

```
GET /api/tenant/funcionarios
Authorization: Bearer <token>
```

**Query Parameters:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| grupo | string | Filtrar por grupo (ex: "Comurg") |
| busca | string | Busca por nome ou CPF |
| alerta | string | Tipo de alerta: obito, beneficio, sancionado, doador, candidato, socio |
| page | number | Pagina (default: 1) |
| limit | number | Itens por pagina (default: 50) |

**Exemplo:**
```
GET /api/tenant/funcionarios?grupo=Comurg&alerta=obito&page=1&limit=20
```

**Response:**
```json
{
  "funcionarios": [
    {
      "id": "uuid",
      "cadastro": "12345",
      "nome": "JOAO DA SILVA",
      "cpf": "12345678901",
      "grupo": "Comurg",
      "cargo": "Auxiliar",
      "salario": 1500.00,
      "esta_vivo": "NAO",
      "esta_morto": "SIM - Ano: 2023",
      "ano_obito": 2023,
      "recebe_beneficio": 0,
      "socio_empresa": 1,
      "doador_campanha": 0,
      "candidato": 0,
      "sancionado_ceis": 0
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

### Detalhes do Funcionario

```
GET /api/tenant/funcionario/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "funcionario": {
    "id": "uuid",
    "nome": "JOAO DA SILVA",
    "cpf": "12345678901",
    "grupo": "Comurg",
    "cargo": "Auxiliar",
    "salario": 1500.00,
    "data_admissao": "2010-01-15",
    "esta_morto": "SIM - Ano: 2023"
  },
  "candidaturas": [
    {
      "cargo": "VEREADOR",
      "partido": "PT",
      "uf": "GO",
      "ano": 2020,
      "situacao": "Nao Eleito",
      "votos": 150
    }
  ],
  "doacoes": [
    {
      "nome_candidato": "CANDIDATO X",
      "partido": "MDB",
      "ano": 2022,
      "valor": 500.00
    }
  ],
  "vinculos": [
    {
      "cnpj": "12345678000199",
      "razao_social": "EMPRESA LTDA",
      "qualificacao": "Socio-Administrador",
      "situacao_cadastral": "ATIVA"
    }
  ],
  "sancoes": [],
  "beneficios": []
}
```

### Obitos

Lista funcionarios falecidos.

```
GET /api/tenant/obitos
Authorization: Bearer <token>
```

**Response:**
```json
{
  "obitos": [
    {
      "id": "uuid",
      "cadastro": "12345",
      "nome": "JOAO DA SILVA",
      "cpf": "12345678901",
      "grupo": "Comurg",
      "cargo": "Auxiliar",
      "ano_obito": 2023,
      "data_obito": "2023-05-15",
      "fonte": "INFOSIMPLES"
    }
  ],
  "total": 50
}
```

### Candidatos

Lista funcionarios que foram candidatos.

```
GET /api/tenant/candidatos
Authorization: Bearer <token>
```

**Response:**
```json
{
  "candidatos": [
    {
      "funcionario_id": "uuid",
      "nome": "MARIA SILVA",
      "cpf": "98765432101",
      "grupo": "Comurg",
      "cargo": "DEPUTADO ESTADUAL",
      "partido": "PT",
      "uf": "GO",
      "ano": 2022,
      "situacao": "Suplente",
      "votos": 5000
    }
  ],
  "total": 8
}
```

### Doadores

Lista funcionarios que doaram para campanhas.

```
GET /api/tenant/doadores
Authorization: Bearer <token>
```

**Response:**
```json
{
  "doadores": [
    {
      "funcionario_id": "uuid",
      "nome_doador": "JOSE SANTOS",
      "cpf_doador": "11122233344",
      "grupo": "Comurg",
      "nome_candidato": "CANDIDATO Y",
      "partido": "MDB",
      "cargo": "PREFEITO",
      "ano": 2024,
      "valor": 5000.00
    }
  ],
  "total": 81,
  "valor_total": 193648.84
}
```

### Sancionados

Lista funcionarios com sancoes.

```
GET /api/tenant/sancionados
Authorization: Bearer <token>
```

**Response:**
```json
{
  "sancionados": [
    {
      "funcionario_id": "uuid",
      "nome": "FULANO DE TAL",
      "cpf": "55566677788",
      "grupo": "Comurg",
      "tipo_sancao": "CEIS",
      "orgao_sancionador": "TRF1/GO",
      "fundamentacao": "Impedimento de contratar",
      "data_inicio": "2021-12-16",
      "data_fim": "2026-12-16"
    }
  ],
  "total": 1
}
```

### Vinculos Empresariais

Lista vinculos de funcionarios com empresas.

```
GET /api/tenant/vinculos
Authorization: Bearer <token>
```

**Response:**
```json
{
  "vinculos": [
    {
      "funcionario_id": "uuid",
      "nome_socio": "CARLOS SILVA",
      "cpf_socio": "99988877766",
      "grupo": "Comurg",
      "cnpj": "12345678000199",
      "razao_social": "SILVA COMERCIO LTDA",
      "nome_fantasia": "LOJA SILVA",
      "qualificacao": "Socio-Administrador",
      "situacao_cadastral": "ATIVA",
      "capital_social": 50000.00
    }
  ],
  "total": 638,
  "cnpjs_unicos": 500
}
```

### Beneficios

Lista funcionarios que recebem beneficios sociais.

```
GET /api/tenant/beneficios
Authorization: Bearer <token>
```

**Response:**
```json
{
  "beneficios": [
    {
      "funcionario_id": "uuid",
      "nome": "ANA SOUZA",
      "cpf": "44455566677",
      "grupo": "Comurg",
      "cargo": "Auxiliar",
      "salario": 1500.00,
      "tipo_beneficio": "AUXILIO_EMERGENCIAL",
      "valor": 600.00,
      "ano_referencia": 2020
    }
  ],
  "total": 4
}
```

### Exportar Dados

Exporta dados em formato CSV.

```
GET /api/tenant/export/:type
Authorization: Bearer <token>
```

**Tipos disponiveis:**
- `funcionarios`
- `obitos`
- `candidatos`
- `doadores`
- `vinculos`

**Query Parameters:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| grupo | string | Filtrar por grupo |
| alerta | string | Filtrar por tipo de alerta |

**Exemplo:**
```
GET /api/tenant/export/funcionarios?grupo=Comurg&alerta=obito
```

**Response:**
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="obitos.csv"

cadastro;nome;cpf;grupo;cargo;salario;ano_obito
12345;JOAO DA SILVA;12345678901;Comurg;Auxiliar;1500.00;2023
```

---

## Admin (`/api/admin`)

Endpoints administrativos. Requer role `admin`.

### Listar Usuarios

```
GET /api/admin/users
Authorization: Bearer <token>
```

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "usuario@email.com",
      "name": "Nome",
      "phone": "(62) 99999-9999",
      "created_at": "2025-11-29T12:00:00.000Z",
      "tenants": [
        { "code": "CLIENTE_01", "role": "viewer" }
      ]
    }
  ]
}
```

### Listar Tenants

```
GET /api/admin/tenants
Authorization: Bearer <token>
```

**Response:**
```json
{
  "tenants": [
    {
      "id": "tenant_cliente_01",
      "code": "CLIENTE_01",
      "name": "COMURG",
      "status": "active",
      "created_at": "2025-11-28T00:00:00.000Z",
      "user_count": 3
    }
  ]
}
```

### Usuarios Pendentes

Lista usuarios sem acesso a nenhum tenant.

```
GET /api/admin/pending-users
Authorization: Bearer <token>
```

**Response:**
```json
{
  "pending_users": [
    {
      "id": "uuid",
      "email": "novo@usuario.com",
      "name": "Usuario Novo",
      "phone": "(62) 88888-8888",
      "created_at": "2025-11-29T10:00:00.000Z"
    }
  ]
}
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
  "name": "Nome do Novo Cliente"
}
```

**Response (201):**
```json
{
  "success": true,
  "tenant": {
    "id": "tenant_cliente_02",
    "code": "CLIENTE_02",
    "name": "Nome do Novo Cliente"
  }
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

**Roles disponiveis:**
- `admin` - Acesso total
- `editor` - Visualizar e editar
- `viewer` - Apenas visualizar

**Response (201):**
```json
{
  "success": true,
  "message": "Acesso concedido",
  "action": "created"
}
```

**Response (200) - Atualizado:**
```json
{
  "success": true,
  "message": "Acesso atualizado",
  "action": "updated"
}
```

### Revogar Acesso

```
DELETE /api/admin/revoke-access?user_email=x@y.com&tenant_code=CLIENTE_01
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Acesso revogado"
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
  "data_abertura": "2010-01-01",
  "atividade_principal": "Comercio varejista"
}
```

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
- `http://localhost:5173` (desenvolvimento)

## Versionamento

A API atual e v1. Futuras versoes serao disponibilizadas em:
- `/v2/api/...`
