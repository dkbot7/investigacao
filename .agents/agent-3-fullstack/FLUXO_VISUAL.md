# 🎨 FLUXO VISUAL DOS MÓDULOS

**Como funciona HOJE vs. Como vai funcionar AMANHÃ**

---

## ⚠️ CORREÇÃO IMPORTANTE

**Este documento foi criado com um erro conceitual:**
- ❌ Mostrava dashboard chamando APIs SERPRO diretamente
- ✅ **CORRETO:** Dashboard deve ler **D1 Database** (cache)

**Ver arquitetura correta em:** `ARQUITETURA_CORRETA.md`

---

## 📸 SITUAÇÃO ATUAL (BROKEN)

```
┌─────────────────────────────────────────────────────────────┐
│  👤 USUÁRIO                                                  │
│  Acessa: http://localhost:3000/dashboard/funcionarios       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Clica no link
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  📄 PÁGINA: funcionarios/page.tsx                           │
│                                                              │
│  function FuncionariosPage() {                              │
│    const loadFuncionarios = () => {                         │
│      setFuncionarios(CLIENTE_01_FUNCIONARIOS); // ← Import  │
│    }                                                         │
│  }                                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ import { CLIENTE_01_FUNCIONARIOS }
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  📦 ARQUIVO: _data/mock-data.ts                             │
│                                                              │
│  export const CLIENTE_01_FUNCIONARIOS = [];  // ← VAZIO!    │
│                                                              │
│  ⚠️  Arrays vazios por motivo de SEGURANÇA                  │
│  ⚠️  Dados reais foram removidos para evitar vazamento      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ return []
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  🖥️  TELA DO USUÁRIO                                        │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Funcionários                                         │  │
│  │  ─────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │  🔍 Buscar...                                         │  │
│  │                                                       │  │
│  │  ❌ Nenhum funcionário encontrado                    │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

❌ PROBLEMA: Lista sempre vazia, pois mock-data.ts foi esvaziado!
```

---

## 🚀 SITUAÇÃO FUTURA (WORKING)

```
┌─────────────────────────────────────────────────────────────┐
│  👤 USUÁRIO                                                  │
│  Acessa: http://localhost:3000/dashboard/funcionarios       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Clica no link
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  📄 PÁGINA: funcionarios/page.tsx                           │
│                                                              │
│  function FuncionariosPage() {                              │
│    useEffect(() => {                                        │
│      loadFuncionarios(); // ← Chama função async           │
│    }, []);                                                  │
│                                                              │
│    async function loadFuncionarios() {                      │
│      const data = await apiClient.get('/api/...');         │
│      setFuncionarios(data);                                 │
│    }                                                         │
│  }                                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ GET /api/admin/tenants/CLIENTE_01/funcionarios
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  🔧 API CLIENT: api-client.ts                               │
│                                                              │
│  1. Pega token do Firebase:                                 │
│     const token = await auth.currentUser.getIdToken()       │
│                                                              │
│  2. Monta headers:                                          │
│     Authorization: Bearer eyJhbGc...                        │
│     X-Tenant-Code: CLIENTE_01                               │
│                                                              │
│  3. Faz requisição HTTPS                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS Request
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  ☁️  CLOUDFLARE WORKER (Agent 2)                            │
│  URL: https://investigaree-api.chatbotimoveis.workers.dev  │
│                                                              │
│  GET /api/admin/tenants/CLIENTE_01/funcionarios             │
│                                                              │
│  1. Valida Firebase token ✅                                │
│  2. Verifica permissão do tenant ✅                         │
│  3. Query no D1 Database:                                   │
│     SELECT * FROM funcionarios                              │
│     WHERE tenant_code = 'CLIENTE_01'                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ SQL Query
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  🗄️  D1 DATABASE (SQLite distribuído)                      │
│                                                              │
│  Tabela: funcionarios                                       │
│  ┌──────┬───────────────┬────────┬──────────────────────┐   │
│  │ id   │ tenant_code   │ cpf    │ grupo                │   │
│  ├──────┼───────────────┼────────┼──────────────────────┤   │
│  │ 1    │ CLIENTE_01    │ 123... │ COMURG               │   │
│  │ 2    │ CLIENTE_01    │ 456... │ SECRETARIA           │   │
│  │ 3    │ CLIENTE_01    │ 789... │ COMURG               │   │
│  └──────┴───────────────┴────────┴──────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Results: [{ cpf: "123...", grupo: "COMURG" }, ...]
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  ☁️  CLOUDFLARE WORKER                                      │
│                                                              │
│  Para cada CPF retornado:                                   │
│    1. Consultar API SERPRO:                                 │
│       POST https://gateway.apiserpro.serpro.gov.br/...      │
│                                                              │
│    2. Receber dados:                                        │
│       { ni: "12345678900",                                  │
│         nome: "JOAO DA SILVA",                              │
│         situacao: { codigo: "0", descricao: "REGULAR" } }   │
│                                                              │
│    3. Combinar dados D1 + SERPRO                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ JSON Response
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  📄 PÁGINA: funcionarios/page.tsx                           │
│                                                              │
│  Recebe JSON:                                               │
│  {                                                           │
│    funcionarios: [                                          │
│      {                                                       │
│        id: "1",                                              │
│        nome: "JOAO DA SILVA",                                │
│        cpf: "123.456.789-00",                                │
│        grupo: "COMURG",                                      │
│        esta_vivo: "SIM"                                      │
│      },                                                      │
│      { ... },                                                │
│      { ... }                                                 │
│    ]                                                         │
│  }                                                           │
│                                                              │
│  setFuncionarios(data.funcionarios) ← Atualiza estado      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ React re-render
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  🖥️  TELA DO USUÁRIO                                        │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Funcionários (3 registros)                           │  │
│  │  ─────────────────────────────────────────────────── │  │
│  │                                                       │  │
│  │  🔍 Buscar...                            🔄 ⚙️ 📥     │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ ✅ JOAO DA SILVA                                 │ │  │
│  │  │ CPF: 123.456.789-00                              │ │  │
│  │  │ Grupo: COMURG                                    │ │  │
│  │  │ Status: Vivo                                     │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ ✅ MARIA SANTOS                                  │ │  │
│  │  │ CPF: 456.789.012-34                              │ │  │
│  │  │ Grupo: SECRETARIA                                │ │  │
│  │  │ Status: Vivo                                     │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │ ✅ PEDRO OLIVEIRA                                │ │  │
│  │  │ CPF: 789.012.345-67                              │ │  │
│  │  │ Grupo: COMURG                                    │ │  │
│  │  │ Status: Vivo                                     │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

✅ SUCESSO: Lista preenchida com dados reais do backend!
```

---

## 🔍 COMPARAÇÃO LADO A LADO

| Aspecto | ❌ ATUAL (Broken) | ✅ FUTURO (Working) |
|---------|------------------|---------------------|
| **Fonte de dados** | Array hardcoded (vazio) | Backend API real |
| **Autenticação** | Não requerida | Firebase token |
| **Multi-tenancy** | Não | Sim (X-Tenant-Code) |
| **Dados atualizados** | Não | Sim (tempo real) |
| **Escalável** | Não | Sim |
| **Seguro** | Não (dados no frontend) | Sim (dados no backend) |

---

## 📊 EXEMPLO DE RESPOSTA DA API

### Request
```http
GET /api/admin/tenants/CLIENTE_01/funcionarios HTTP/1.1
Host: investigaree-api.chatbotimoveis.workers.dev
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
X-Tenant-Code: CLIENTE_01
```

### Response
```json
{
  "success": true,
  "funcionarios": [
    {
      "id": "1",
      "cpf": "12345678900",
      "nome": "JOAO DA SILVA",
      "grupo": "COMURG",
      "cargo": "Auxiliar de Serviços Gerais",
      "salario": 1500.00,
      "esta_vivo": "SIM",
      "esta_morto": "NAO",
      "recebe_beneficio": 0,
      "socio_empresa": 0,
      "qtd_empresas": 0,
      "doador_campanha": 0,
      "candidato": 0,
      "sancionado_ceis": 0
    },
    {
      "id": "2",
      "cpf": "98765432100",
      "nome": "MARIA SANTOS",
      "grupo": "SECRETARIA",
      "cargo": "Gerente Administrativo",
      "salario": 4500.00,
      "esta_vivo": "SIM",
      "esta_morto": "NAO",
      "recebe_beneficio": 0,
      "socio_empresa": 1,
      "qtd_empresas": 2,
      "doador_campanha": 1,
      "candidato": 0,
      "sancionado_ceis": 0
    }
  ],
  "total": 2,
  "tenant_code": "CLIENTE_01"
}
```

---

## 🎯 O QUE PRECISA SER FEITO (TAREFA 3.5)

### Backend (Agent 2)

```typescript
// backend/workers/api/src/routes/admin.ts

router.get('/tenants/:code/funcionarios', async (c) => {
  const tenantCode = c.req.param('code');

  // Query D1
  const { results } = await c.env.DB.prepare(`
    SELECT
      id,
      cpf,
      nome,
      grupo,
      cargo,
      salario,
      esta_vivo,
      esta_morto,
      recebe_beneficio,
      socio_empresa,
      qtd_empresas,
      doador_campanha,
      candidato,
      sancionado_ceis
    FROM funcionarios
    WHERE tenant_code = ?
    ORDER BY nome
  `).bind(tenantCode).all();

  return c.json({
    success: true,
    funcionarios: results,
    total: results.length,
    tenant_code: tenantCode
  });
});
```

### Frontend (Agent 3)

```typescript
// investigaree/src/app/dashboard/funcionarios/page.tsx

const loadFuncionarios = useCallback(async () => {
  setLoading(true);
  try {
    // Pegar tenant atual do localStorage ou context
    const tenantCode = localStorage.getItem('currentTenant') || 'CLIENTE_01';

    // Buscar funcionários via API
    const response = await apiClient.get<{
      funcionarios: Funcionario[];
      total: number;
    }>(`/api/admin/tenants/${tenantCode}/funcionarios`);

    // Atualizar estado
    setFuncionarios(response.funcionarios);

    toast.success(`${response.total} funcionários carregados`);
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error);
    toast.error('Erro ao carregar funcionários');
  } finally {
    setLoading(false);
  }
}, []);
```

---

## 🚀 TESTES

### 1. Adicionar dados de teste no D1

```bash
npx wrangler d1 execute investigaree-db --remote --command="
INSERT INTO funcionarios (tenant_code, cpf, nome, grupo, cargo, salario, esta_vivo, esta_morto)
VALUES
  ('CLIENTE_01', '12345678900', 'JOAO DA SILVA', 'COMURG', 'Auxiliar', 1500, 'SIM', 'NAO'),
  ('CLIENTE_01', '98765432100', 'MARIA SANTOS', 'SECRETARIA', 'Gerente', 4500, 'SIM', 'NAO');
"
```

### 2. Testar endpoint no backend

```bash
curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     -H "X-Tenant-Code: CLIENTE_01" \
     https://investigaree-api.chatbotimoveis.workers.dev/api/admin/tenants/CLIENTE_01/funcionarios
```

### 3. Testar no frontend

```bash
# Acessar:
http://localhost:3000/dashboard/funcionarios

# Verificar:
# - Lista não está vazia ✅
# - Nomes corretos aparecem ✅
# - Filtros funcionam ✅
# - Busca funciona ✅
```

---

## ❓ FAQ

### P: Por que os dados mock foram removidos?
**R:** Por segurança! O arquivo `mock-data.ts` continha dados REAIS de clientes (CPFs, nomes, empresas). Qualquer pessoa com acesso ao código poderia ver esses dados. Agora, os dados ficam no backend protegido com autenticação.

### P: Como o sistema sabe qual tenant usar?
**R:** Via header `X-Tenant-Code` enviado em toda requisição. O frontend pega esse código do localStorage (setado no login).

### P: O que acontece se a API estiver offline?
**R:** O `api-client.ts` tem retry logic. Após 3 tentativas, mostra erro ao usuário via toast.

### P: Preciso criar tabelas no D1?
**R:** Agent 2 já criou as migrations. Execute:
```bash
npx wrangler d1 migrations apply investigaree-db --remote
```

---

**FIM DO FLUXO VISUAL**

Ficou claro como funcionam os módulos? 🎯
