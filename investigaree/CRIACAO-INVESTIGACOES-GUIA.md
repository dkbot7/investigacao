# GUIA COMPLETO: Criação de Investigações no Investigaree

**Última atualização:** 10/12/2025
**Versão:** 1.0
**Autor:** Documentação Técnica Investigaree

---

## 📚 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Métodos de Criação](#métodos-de-criação)
4. [Schema do Banco de Dados](#schema-do-banco-de-dados)
5. [API REST Endpoints](#api-rest-endpoints)
6. [Exemplos de Código](#exemplos-de-código)
7. [Validações e Regras](#validações-e-regras)
8. [Troubleshooting](#troubleshooting)
9. [Documentação Relacionada](#documentação-relacionada)

---

## 📋 Visão Geral

Este documento descreve todos os métodos disponíveis para criar novas investigações no sistema Investigaree, desde a interface web até integração programática via API REST.

### O que é uma Investigação?

Uma investigação é um registro no banco de dados D1 que representa uma solicitação de **due diligence**, **background check** ou **investigação forense** sobre uma pessoa física ou jurídica.

### Fluxo Básico

```
Criação → [Status: investigar]
    ↓
Análise → [Status: investigando]
    ↓
Relatório → [Status: relatorio]
    ↓
Conclusão → [Status: aprovado | bloqueado | monitoramento]
```

---

## 🔧 Pré-requisitos

### 1. Autenticação

Todas as operações requerem autenticação via **Firebase Auth**:

```typescript
import { getAuth } from 'firebase/auth'

const auth = getAuth()
const user = auth.currentUser

if (user) {
  const token = await user.getIdToken()
  // Use o token nas requisições
}
```

### 2. Permissões

- Usuário deve estar autenticado
- Usuário deve ter acesso ao tenant
- Role mínima: `viewer` (para visualizar), `editor` (para criar/editar)

### 3. Backend Ativo

- **Produção:** `https://api.investigaree.com.br`
- **Desenvolvimento:** `http://localhost:8787` (Cloudflare Workers local)

> **Ver também:** [BACKEND-CONNECTION-STATUS.md](./BACKEND-CONNECTION-STATUS.md)

---

## 🎯 Métodos de Criação

## Método 1: Interface Web (Recomendado)

### Acesso ao Dashboard

```
http://localhost:3000/dashboard/
```

### Passo a Passo

1. **Login no Sistema**
   - Acesse `/login`
   - Faça login com credenciais Firebase
   - Será redirecionado para `/dashboard`

2. **Abrir Modal de Nova Investigação**
   - Clique no botão "Nova Investigação" no header
   - Ou acesse o menu "Investigações" → "Criar Nova"

3. **Preencher Formulário**

   **Modo Rápido (Dados Básicos):**
   - Nome completo
   - CPF/CNPJ
   - Categoria
   - Nível de urgência

   **Modo Completo (Wizard 4 Etapas):**
   - **Etapa 1:** Dados básicos
   - **Etapa 2:** Dados de contato
   - **Etapa 3:** Detalhes da investigação
   - **Etapa 4:** Revisão e confirmação

4. **Submeter**
   - Clique em "Criar Investigação"
   - Sistema valida e envia para API
   - Redireciona para página de detalhes

### Componente Responsável

```typescript
// Arquivo: src/components/dashboard/AddInvestigacaoModal.tsx
<AddInvestigacaoModal
  isOpen={isOpen}
  onClose={handleClose}
  onSuccess={handleSuccess}
/>
```

---

## Método 2: API REST

### Endpoint de Criação

```http
POST https://api.investigaree.com.br/api/investigacoes
```

### Headers Obrigatórios

```http
Authorization: Bearer <firebase_jwt_token>
Content-Type: application/json
```

### Payload Mínimo

```json
{
  "nome": "João da Silva",
  "documento": "12345678900"
}
```

### Payload Completo

```json
{
  "nome": "João da Silva",
  "documento": "12345678900",
  "tipo_pessoa": "fisica",
  "categoria": "funcionarios",
  "status": "investigar",
  "nivel_urgencia": "media",

  "email": "joao@example.com",
  "telefones": "[\"(11) 98765-4321\", \"(11) 3456-7890\"]",
  "endereco": "Rua ABC, 123, São Paulo - SP, 01234-567",
  "redes_sociais": "{\"instagram\":\"@joaosilva\",\"facebook\":\"joao.silva\",\"linkedin\":\"joao-silva\"}",
  "placa_veiculo": "ABC1D23",

  "rg": "12.345.678-9",
  "estado_civil": "casado",
  "profissao": "Engenheiro de Software",
  "data_nascimento": "1990-01-15",

  "motivo_investigacao": "Background check para contratação",
  "escopo_investigacao": "{\"antecedentes_criminais\":true,\"processos_judiciais\":true,\"situacao_fiscal\":true,\"vinculos_empresariais\":false,\"comportamento_rotina\":false,\"verificacao_informacoes\":true}",
  "observacoes": "Verificar histórico profissional",
  "prazo_desejado": "2025-12-30"
}
```

### Response de Sucesso

```json
{
  "success": true,
  "investigacao": {
    "id": "a1b2c3d4e5f6",
    "user_id": "firebase_uid",
    "nome": "João da Silva",
    "documento": "12345678900",
    "tipo_pessoa": "fisica",
    "categoria": "funcionarios",
    "status": "investigar",
    "nivel_urgencia": "media",
    "created_at": "2025-12-10T21:45:00Z",
    "updated_at": "2025-12-10T21:45:00Z"
  }
}
```

### Response de Erro

```json
{
  "success": false,
  "error": "Campos obrigatórios: nome, documento"
}
```

### Exemplo cURL

```bash
curl -X POST https://api.investigaree.com.br/api/investigacoes \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "documento": "98765432100",
    "categoria": "familia",
    "nivel_urgencia": "alta",
    "motivo_investigacao": "Verificação para processo judicial"
  }'
```

---

## Método 3: Via Código TypeScript

### Usando Service Layer (Recomendado)

```typescript
import { criarInvestigacao } from '@/lib/services/user-investigacoes.service'

async function criarNovaInvestigacao() {
  try {
    const investigacao = await criarInvestigacao({
      // Obrigatórios
      nome: "Carlos Oliveira",
      documento: "11122233344",

      // Opcionais
      tipo_pessoa: "fisica",
      categoria: "clientes",
      nivel_urgencia: "media",

      email: "carlos@example.com",
      telefones: JSON.stringify(["(21) 98765-4321"]),

      motivo_investigacao: "Due diligence para parceria comercial",
      escopo_investigacao: JSON.stringify({
        antecedentes_criminais: true,
        processos_judiciais: true,
        situacao_fiscal: true
      })
    })

    console.log("✅ Investigação criada:", investigacao.id)
    return investigacao

  } catch (error) {
    console.error("❌ Erro:", error)
    throw error
  }
}
```

### Usando Fetch API Direto

```typescript
import { getAuth } from 'firebase/auth'

async function criarInvestigacaoComFetch() {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const token = await user.getIdToken()

  const response = await fetch('https://api.investigaree.com.br/api/investigacoes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: "Ana Paula",
      documento: "99988877766",
      categoria: "relacionamentos",
      nivel_urgencia: "alta"
    })
  })

  const data = await response.json()

  if (data.success) {
    return data.investigacao
  } else {
    throw new Error(data.error)
  }
}
```

### Usando React Hook

```typescript
import { useInvestigations } from '@/hooks/useInvestigations'

function MeuComponente() {
  const { createInvestigation, loading, error } = useInvestigations()

  const handleSubmit = async (formData: any) => {
    try {
      const investigacao = await createInvestigation({
        nome: formData.nome,
        documento: formData.cpf,
        categoria: formData.categoria,
        nivel_urgencia: formData.urgencia
      })

      console.log("Criado:", investigacao.id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
    </form>
  )
}
```

---

## Método 4: Direto no Banco D1 (Dev/Debug)

### Via Wrangler CLI

```bash
npx wrangler d1 execute investigaree-db --local --command "
INSERT INTO user_investigacoes (
  id, user_id, nome, documento, tipo_pessoa,
  categoria, status, nivel_urgencia, created_at, updated_at
) VALUES (
  lower(hex(randomblob(16))),
  'firebase_uid_do_usuario',
  'Pedro Costa',
  '55566677788',
  'fisica',
  'empresas',
  'investigar',
  'urgente',
  datetime('now'),
  datetime('now')
);
"
```

### Via Better-SQLite3 (Desenvolvimento Local)

```javascript
const Database = require('better-sqlite3')
const db = new Database('./investigaree.db')

const stmt = db.prepare(`
  INSERT INTO user_investigacoes (
    id, user_id, nome, documento, tipo_pessoa,
    categoria, status, nivel_urgencia,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`)

const result = stmt.run(
  'a1b2c3d4e5f6',      // id gerado
  'firebase_user_id',  // user_id
  'Roberto Silva',     // nome
  '12312312312',       // documento
  'fisica',            // tipo_pessoa
  'funcionarios',      // categoria
  'investigar',        // status
  'media'              // nivel_urgencia
)

console.log('ID inserido:', result.lastInsertRowid)
```

---

## 🗄️ Schema do Banco de Dados

### Tabela: `user_investigacoes`

```sql
CREATE TABLE user_investigacoes (
  -- Identificação
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Dados Básicos (OBRIGATÓRIOS)
  nome TEXT NOT NULL,
  documento TEXT NOT NULL,

  -- Tipo e Categoria
  tipo_pessoa TEXT DEFAULT 'fisica'
    CHECK (tipo_pessoa IN ('fisica', 'juridica')),

  categoria TEXT DEFAULT 'funcionarios'
    CHECK (categoria IN ('familia', 'clientes', 'funcionarios', 'relacionamentos', 'empresas')),

  -- Status e Workflow
  status TEXT DEFAULT 'investigar'
    CHECK (status IN ('investigar', 'investigando', 'relatorio', 'monitoramento', 'aprovado', 'bloqueado')),

  nivel_urgencia TEXT DEFAULT 'media'
    CHECK (nivel_urgencia IN ('baixa', 'media', 'alta', 'urgente')),

  -- Grupo (Lote)
  is_grupo INTEGER DEFAULT 0,
  grupo_nome TEXT,
  grupo_total_documentos INTEGER DEFAULT 1,

  -- Dados de Contato
  email TEXT,
  telefones TEXT,              -- JSON: ["(11) 98765-4321", ...]
  endereco TEXT,
  redes_sociais TEXT,          -- JSON: {"instagram": "@user", ...}
  placa_veiculo TEXT,

  -- Dados Pessoais (Pessoa Física)
  rg TEXT,
  estado_civil TEXT,
  profissao TEXT,
  data_nascimento TEXT,        -- ISO date: "1990-01-15"

  -- Investigação
  motivo_investigacao TEXT,
  escopo_investigacao TEXT,    -- JSON: {"antecedentes_criminais": true, ...}
  observacoes TEXT,
  prazo_desejado TEXT,         -- ISO date

  -- Relatório
  relatorio_url TEXT,
  relatorio_gerado_em TEXT,

  -- Auditoria
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Índices

```sql
CREATE INDEX idx_user_investigacoes_user_id ON user_investigacoes(user_id);
CREATE INDEX idx_user_investigacoes_status ON user_investigacoes(status);
CREATE INDEX idx_user_investigacoes_categoria ON user_investigacoes(categoria);
CREATE INDEX idx_user_investigacoes_documento ON user_investigacoes(documento);
```

---

## 🔌 API REST Endpoints

### POST `/api/investigacoes`
Cria uma nova investigação.

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:** Ver [Payload Completo](#payload-completo)

**Response:** `201 Created` com objeto da investigação

---

### GET `/api/investigacoes`
Lista investigações do usuário autenticado.

**Query Parameters:**
- `status` (opcional): Filtrar por status
- `categoria` (opcional): Filtrar por categoria
- `limit` (opcional, padrão: 50): Quantidade de resultados
- `offset` (opcional, padrão: 0): Offset para paginação

**Response:**
```json
{
  "success": true,
  "investigacoes": [...],
  "total": 123,
  "limit": 50,
  "offset": 0
}
```

---

### GET `/api/investigacoes/:id`
Busca uma investigação específica por ID.

**Response:**
```json
{
  "success": true,
  "investigacao": { ... }
}
```

---

### PUT `/api/investigacoes/:id`
Atualiza uma investigação existente.

**Body:** Campos parciais (mesma estrutura do POST)

**Response:**
```json
{
  "success": true,
  "investigacao": { ... }
}
```

---

### DELETE `/api/investigacoes/:id`
Deleta uma investigação.

**Response:**
```json
{
  "success": true,
  "message": "Investigação deletada com sucesso"
}
```

---

### GET `/api/investigacoes/stats`
Retorna estatísticas das investigações.

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 100,
    "por_status": {
      "investigar": 40,
      "investigando": 30,
      "relatorio": 20,
      "aprovado": 10
    },
    "por_categoria": {
      "funcionarios": 60,
      "empresas": 25,
      "familia": 15
    }
  }
}
```

---

## 📝 Exemplos de Código

### Exemplo 1: Background Check de Funcionário

```typescript
import { criarInvestigacao } from '@/lib/services/user-investigacoes.service'

async function backgroundCheckFuncionario() {
  const investigacao = await criarInvestigacao({
    nome: "Roberto Alves da Silva",
    documento: "12345678900",
    tipo_pessoa: "fisica",
    categoria: "funcionarios",
    nivel_urgencia: "alta",

    email: "roberto@example.com",
    telefones: JSON.stringify(["(11) 98765-4321"]),

    rg: "12.345.678-9",
    data_nascimento: "1988-05-10",
    profissao: "Analista de Sistemas",

    motivo_investigacao: "Background check para contratação como Gerente de TI",
    escopo_investigacao: JSON.stringify({
      antecedentes_criminais: true,
      processos_judiciais: true,
      situacao_fiscal: true,
      vinculos_empresariais: true,
      verificacao_informacoes: true
    }),
    observacoes: "Cargo de confiança com acesso a dados sensíveis",
    prazo_desejado: "2025-12-25"
  })

  console.log('Investigação criada:', investigacao.id)
  return investigacao
}
```

---

### Exemplo 2: Due Diligence de Empresa

```typescript
async function dueDiligenceEmpresa() {
  const investigacao = await criarInvestigacao({
    nome: "Tech Solutions LTDA",
    documento: "12345678000199", // CNPJ
    tipo_pessoa: "juridica",
    categoria: "empresas",
    nivel_urgencia: "urgente",

    email: "contato@techsolutions.com.br",
    telefones: JSON.stringify(["(11) 3456-7890"]),
    endereco: "Av. Paulista, 1000, São Paulo - SP",

    motivo_investigacao: "Due diligence para fusão e aquisição",
    escopo_investigacao: JSON.stringify({
      processos_judiciais: true,
      situacao_fiscal: true,
      vinculos_empresariais: true,
      verificacao_informacoes: true
    }),
    prazo_desejado: "2025-12-20"
  })

  return investigacao
}
```

---

### Exemplo 3: Investigação em Lote (Múltiplos CPFs)

```typescript
async function investigacaoEmLote(cpfs: string[]) {
  const promises = cpfs.map(async (cpf, index) => {
    return criarInvestigacao({
      nome: `Investigado ${index + 1}`,
      documento: cpf,
      categoria: "funcionarios",
      is_grupo: 1,
      grupo_nome: "Auditoria Funcionários - Dezembro 2025",
      grupo_total_documentos: cpfs.length,
      motivo_investigacao: "Auditoria periódica de funcionários"
    })
  })

  const investigacoes = await Promise.all(promises)
  console.log(`${investigacoes.length} investigações criadas em lote`)

  return investigacoes
}

// Uso
const cpfs = ["12345678900", "98765432100", "11122233344"]
investigacaoEmLote(cpfs)
```

---

### Exemplo 4: Com Tratamento de Erros Completo

```typescript
import { criarInvestigacao } from '@/lib/services/user-investigacoes.service'
import { toast } from 'sonner'

async function criarComTratamentoErros(dados: any) {
  try {
    // Validação prévia
    if (!dados.nome || !dados.documento) {
      throw new Error('Nome e documento são obrigatórios')
    }

    // Validar formato do CPF (básico)
    if (dados.documento.length !== 11 && dados.documento.length !== 14) {
      throw new Error('CPF deve ter 11 dígitos ou CNPJ 14 dígitos')
    }

    // Criar investigação
    const investigacao = await criarInvestigacao(dados)

    // Feedback de sucesso
    toast.success('Investigação criada com sucesso!', {
      description: `ID: ${investigacao.id}`
    })

    return investigacao

  } catch (error) {
    // Log do erro
    console.error('Erro ao criar investigação:', error)

    // Feedback ao usuário
    if (error.message.includes('autenticação')) {
      toast.error('Você precisa estar logado')
    } else if (error.message.includes('permissão')) {
      toast.error('Você não tem permissão para criar investigações')
    } else {
      toast.error('Erro ao criar investigação', {
        description: error.message
      })
    }

    throw error
  }
}
```

---

## ✅ Validações e Regras

### Campos Obrigatórios

✅ **`nome`**: Não pode ser vazio
✅ **`documento`**: CPF (11 dígitos) ou CNPJ (14 dígitos) sem formatação

### Valores Válidos (Enums)

**`tipo_pessoa`:**
- `'fisica'` (padrão)
- `'juridica'`

**`categoria`:**
- `'familia'`
- `'clientes'`
- `'funcionarios'` (padrão)
- `'relacionamentos'`
- `'empresas'`

**`status`:**
- `'investigar'` (padrão) - Aguardando início
- `'investigando'` - Em andamento
- `'relatorio'` - Gerando relatório
- `'monitoramento'` - Monitoramento contínuo
- `'aprovado'` - Concluído e aprovado
- `'bloqueado'` - Bloqueado/Cancelado

**`nivel_urgencia`:**
- `'baixa'`
- `'media'` (padrão)
- `'alta'`
- `'urgente'`

### Formato de Campos JSON

**`telefones`** (string JSON):
```json
"[\"(11) 98765-4321\", \"(11) 3456-7890\"]"
```

**`redes_sociais`** (string JSON):
```json
"{\"instagram\":\"@usuario\",\"facebook\":\"usuario.nome\",\"linkedin\":\"usuario-nome\"}"
```

**`escopo_investigacao`** (string JSON):
```json
"{\"antecedentes_criminais\":true,\"processos_judiciais\":true,\"situacao_fiscal\":false,\"vinculos_empresariais\":true,\"comportamento_rotina\":false,\"verificacao_informacoes\":true}"
```

### Regras de Negócio

1. **Documento único por usuário:** Não pode criar investigação duplicada (mesmo CPF/CNPJ) no status `investigar` ou `investigando`
2. **Prazo desejado:** Deve ser data futura (ISO format: `2025-12-30`)
3. **Grupo:** Se `is_grupo = 1`, `grupo_nome` é obrigatório
4. **Tipo pessoa → Campos:** Se `tipo_pessoa = 'juridica'`, campos como `rg`, `estado_civil` não são aplicáveis

---

## 🚨 Troubleshooting

### Erro: "Campos obrigatórios: nome, documento"

**Causa:** Payload não contém `nome` ou `documento`

**Solução:**
```json
{
  "nome": "Nome Completo",
  "documento": "12345678900"
}
```

---

### Erro: "Unauthorized" (401)

**Causa:** Token Firebase ausente ou inválido

**Solução:**
```typescript
const auth = getAuth()
const user = auth.currentUser
const token = await user.getIdToken(true) // force refresh
```

---

### Erro: "Invalid enum value for tipo_pessoa"

**Causa:** Valor inválido em campo enum

**Solução:** Use apenas valores permitidos:
```typescript
tipo_pessoa: 'fisica' // ou 'juridica'
categoria: 'funcionarios' // ou 'familia', 'clientes', etc
```

---

### Erro: "JSON parse error in telefones"

**Causa:** Campo JSON mal formatado

**Solução:**
```typescript
// ❌ Errado
telefones: "[(11) 98765-4321]"

// ✅ Correto
telefones: JSON.stringify(["(11) 98765-4321"])
```

---

### Investigação não aparece na lista

**Possíveis causas:**
1. Criada para outro `user_id`
2. Filtros ativos no frontend
3. Cache do browser

**Verificação:**
```typescript
// Listar todas sem filtros
const { investigacoes } = await listarInvestigacoes({
  limit: 100,
  offset: 0
})
console.log(investigacoes)
```

---

## 📚 Documentação Relacionada

### Documentos na Raiz do Projeto

- **[README.md](./README.md)** - Visão geral do projeto
- **[BACKEND-CONNECTION-STATUS.md](./BACKEND-CONNECTION-STATUS.md)** - Status da conexão backend
- **[BACKEND-SETUP.md](./BACKEND-SETUP.md)** - Configuração do backend
- **[ADMIN-PANEL-README.md](./ADMIN-PANEL-README.md)** - Painel administrativo
- **[ADMIN-PANEL-TECHNICAL-DOCS.md](./ADMIN-PANEL-TECHNICAL-DOCS.md)** - Docs técnicos do admin
- **[E2E-TESTING-GUIDE.md](./E2E-TESTING-GUIDE.md)** - Guia de testes E2E
- **[DEPLOY.md](./DEPLOY.md)** - Processo de deploy

### Arquivos Importantes no Código

**Services:**
- `src/lib/services/user-investigacoes.service.ts` - Camada de serviço
- `src/lib/services/investigacao.service.ts` - Lógica de negócio

**Types:**
- `src/lib/types/user-investigacoes.types.ts` - Tipos TypeScript

**Components:**
- `src/components/dashboard/AddInvestigacaoModal.tsx` - Modal de criação
- `src/components/dashboard/InvestigacoesList.tsx` - Listagem

**Hooks:**
- `src/hooks/useInvestigations.ts` - Hook React para investigações

**API Routes:**
- `src/app/api/investigacoes/route.ts` - Next.js API routes (local dev)

**Backend (Cloudflare Workers):**
- `backend/workers/api/src/routes/investigacoes.routes.ts` - Rotas da API
- `backend/workers/database/migrations/` - Migrations do D1

---

## 🔗 Links Úteis

- **Dashboard Local:** http://localhost:3000/dashboard/
- **API Produção:** https://api.investigaree.com.br
- **Documentação Firebase:** https://firebase.google.com/docs/auth
- **Cloudflare D1 Docs:** https://developers.cloudflare.com/d1/

---

## 📝 Notas de Versão

**v1.0 (10/12/2025)**
- Documentação inicial completa
- Todos os 4 métodos de criação documentados
- Exemplos de código práticos
- Schema completo do banco
- API REST endpoints documentados
- Seção de troubleshooting

---

## 👥 Suporte

Para dúvidas ou problemas:

1. Consulte a [documentação técnica completa](./ADMIN-PANEL-TECHNICAL-DOCS.md)
2. Verifique os [logs de auditoria](./BACKEND-CONNECTION-STATUS.md)
3. Execute os [testes E2E](./E2E-TESTING-GUIDE.md)
4. Entre em contato: contato@investigaree.com.br

---

**Investigaree** - Due Diligence Digital com Rigor Forense
© 2025 - Todos os direitos reservados
