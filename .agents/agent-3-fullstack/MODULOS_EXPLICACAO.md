# 📚 COMO FUNCIONAM OS MÓDULOS DO DASHBOARD

**Data:** 2025-12-07
**Autor:** Agent 3 (Full-Stack Developer)

---

## ⚠️ ATUALIZAÇÃO IMPORTANTE

**APIs SERPRO são PAGAS!** Dashboard **NÃO PODE** chamar SERPRO diretamente.

**Arquitetura Correta:**
- ✅ Dashboard lê **D1 Database** (cache grátis)
- ❌ Dashboard **NÃO** chama APIs pagas (SERPRO, TSE, etc.)

Ver documentação completa: `ARQUITETURA_CORRETA.md`

---

## 🎯 VISÃO GERAL

Os módulos do dashboard são **páginas especializadas** que permitem ao usuário:

1. **Consultar dados** de funcionários, empresas, óbitos, etc.
2. **Visualizar alertas** (morto, sancionado, beneficiário, etc.)
3. **Filtrar e buscar** informações específicas
4. **Exportar dados** em CSV/PDF
5. **Abrir fichas detalhadas** com histórico completo

---

## 📂 ESTRUTURA DE ARQUIVOS

```
investigaree/src/app/dashboard/
├── funcionarios/
│   └── page.tsx           ← Módulo de Funcionários
├── vinculos/
│   └── page.tsx           ← Módulo de Vínculos Empresariais
├── obitos/
│   └── page.tsx           ← Módulo de Óbitos
├── candidatos/
│   └── page.tsx           ← Módulo de Candidaturas (TSE)
├── beneficios/
│   └── page.tsx           ← Módulo de Benefícios Sociais
├── sancionados/
│   └── page.tsx           ← Módulo de Sancionados (CEIS/OFAC)
└── _data/
    └── mock-data.ts       ← Dados mock (DESABILITADO por segurança)
```

---

## 🔄 FLUXO ATUAL (COM MOCKS)

### Funcionamento Atual ❌

```
┌─────────────────────────────────────┐
│  Página do Dashboard                │
│  (/dashboard/funcionarios)          │
└────────────┬────────────────────────┘
             │
             │ import CLIENTE_01_FUNCIONARIOS
             │
             ▼
┌─────────────────────────────────────┐
│  Arquivo mock-data.ts               │
│  export const CLIENTE_01_... = []   │  ← Arrays vazios (segurança)
└─────────────────────────────────────┘
             │
             │ return []
             ▼
┌─────────────────────────────────────┐
│  UI renderiza lista vazia           │
│  "Nenhum funcionário encontrado"    │
└─────────────────────────────────────┘
```

**Problema:** Os dados mock foram **removidos por segurança** (para evitar vazamento de dados reais de clientes).

---

## 🚀 FLUXO FUTURO (COM BACKEND REAL)

### O Que Precisamos Fazer ✅

```
┌─────────────────────────────────────┐
│  Página do Dashboard                │
│  (/dashboard/funcionarios)          │
└────────────┬────────────────────────┘
             │
             │ useEffect(() => loadData())
             │
             ▼
┌─────────────────────────────────────┐
│  Service Layer                      │
│  serproService.consultarCpf()       │
└────────────┬────────────────────────┘
             │
             │ POST /api/serpro/cpf/consulta
             │
             ▼
┌─────────────────────────────────────┐
│  API Client (api-client.ts)         │
│  + Firebase Auth Token              │
│  + X-Tenant-Code header             │
└────────────┬────────────────────────┘
             │
             │ HTTPS Request
             │
             ▼
┌─────────────────────────────────────┐
│  Cloudflare Worker (Agent 2)        │
│  https://investigaree-api...        │
└────────────┬────────────────────────┘
             │
             │ Query D1 + SERPRO API
             │
             ▼
┌─────────────────────────────────────┐
│  D1 Database + SERPRO API           │
│  Dados reais do CPF                 │
└────────────┬────────────────────────┘
             │
             │ JSON Response
             │
             ▼
┌─────────────────────────────────────┐
│  UI renderiza dados reais           │
│  Nome, CPF, situação, etc.          │
└─────────────────────────────────────┘
```

---

## 📋 DETALHAMENTO DOS MÓDULOS

### 1️⃣ MÓDULO: Funcionários

**Arquivo:** `src/app/dashboard/funcionarios/page.tsx`

**Funcionalidades Atuais:**
- ✅ Busca por nome/CPF
- ✅ Filtros por categoria (óbito, benefício, sancionado, etc.)
- ✅ Visualização em lista ou Kanban
- ✅ Paginação (50 itens por página)
- ✅ Modal "Ficha Detalhada"
- ❌ **DADOS: Arrays vazios (mock desabilitado)**

**O Que Precisa Ser Feito:**
```typescript
// ANTES (linha 94-97):
const loadFuncionarios = useCallback(() => {
  // Por enquanto usa dados mock
  setFuncionarios(CLIENTE_01_FUNCIONARIOS); // ← Array vazio!
  setLoading(false);
}, []);

// DEPOIS (integração real):
const loadFuncionarios = useCallback(async () => {
  setLoading(true);
  try {
    // 1. Buscar lista de CPFs do tenant no D1
    const listaCPFs = await adminService.getFuncionariosByTenant();

    // 2. Para cada CPF, consultar SERPRO
    const funcionariosData = await Promise.all(
      listaCPFs.map(async (cpf) => {
        const dadosCPF = await serproService.consultarCpf(cpf);
        const dadosComplementares = await buscarDadosComplementares(cpf);

        return {
          id: cpf,
          nome: dadosCPF.nome,
          cpf: dadosCPF.ni,
          grupo: dadosComplementares.grupo,
          esta_vivo: dadosCPF.situacao.codigo === '0' ? 'SIM' : 'NAO',
          recebe_beneficio: dadosComplementares.recebe_beneficio,
          // ... etc
        };
      })
    );

    setFuncionarios(funcionariosData);
  } catch (error) {
    toast.error('Erro ao carregar funcionários');
    console.error(error);
  } finally {
    setLoading(false);
  }
}, []);
```

**APIs Necessárias:**
- ✅ `POST /api/serpro/cpf/consulta` (já existe!)
- 🔄 `GET /api/admin/tenants/:code/funcionarios` (precisa criar)
- 🔄 `GET /api/investigacao/:cpf/complementares` (precisa criar)

---

### 2️⃣ MÓDULO: Vínculos Empresariais

**Arquivo:** `src/app/dashboard/vinculos/page.tsx`

**Funcionalidades Atuais:**
- ✅ Busca por nome/CPF/CNPJ/Razão Social
- ✅ Filtro por situação cadastral (ATIVA/BAIXADA)
- ✅ Estatísticas (empresas ativas, baixadas, funcionários únicos)
- ✅ Export CSV
- ✅ Modal "Ficha Detalhada" ao clicar em vínculo
- ❌ **DADOS: Arrays vazios (mock desabilitado)**

**O Que Precisa Ser Feito:**
```typescript
// ANTES (linha 57):
const filteredVinculos = CLIENTE_01_VINCULOS.filter(...); // ← Array vazio!

// DEPOIS (integração real):
const [vinculos, setVinculos] = useState([]);

useEffect(() => {
  async function loadVinculos() {
    setLoading(true);
    try {
      // 1. Buscar todos os funcionários do tenant
      const funcionarios = await adminService.getFuncionariosByTenant();

      // 2. Para cada funcionário, consultar vínculos empresariais via CNPJ
      const todosVinculos = [];

      for (const func of funcionarios) {
        // 2a. Buscar em qual(is) empresa(s) ele é sócio
        const empresas = await buscarEmpresasPorSocio(func.cpf);

        for (const empresa of empresas) {
          // 2b. Consultar dados completos da empresa via SERPRO
          const dadosCNPJ = await serproService.consultarCnpjEmpresa(empresa.cnpj);

          // 2c. Montar objeto de vínculo
          todosVinculos.push({
            nome: func.nome,
            cpf: func.cpf,
            cnpj: empresa.cnpj,
            razao_social: dadosCNPJ.razaoSocial,
            situacao_cadastral: dadosCNPJ.situacao,
            qualificacao: empresa.qualificacao,
            grupo: func.grupo
          });
        }
      }

      setVinculos(todosVinculos);
    } catch (error) {
      toast.error('Erro ao carregar vínculos');
    } finally {
      setLoading(false);
    }
  }

  loadVinculos();
}, []);
```

**APIs Necessárias:**
- ✅ `GET /api/serpro/cnpj/:cnpj/estabelecimentos` (já existe! - retorna QSA com CPF desmascarado)
- 🔄 `GET /api/admin/tenants/:code/funcionarios` (precisa criar)
- 🔄 `POST /api/investigacao/buscar-empresas-por-socio` (precisa criar - consulta reversa)

---

### 3️⃣ MÓDULO: Óbitos

**Arquivo:** `src/app/dashboard/obitos/page.tsx`

**Funcionalidades Esperadas:**
- Busca por nome/CPF
- Filtro por ano de óbito
- Visualização de certidões
- Export CSV

**O Que Precisa Ser Feito:**
```typescript
const loadObitos = useCallback(async () => {
  setLoading(true);
  try {
    // 1. Buscar funcionários do tenant
    const funcionarios = await adminService.getFuncionariosByTenant();

    // 2. Para cada CPF, verificar óbito via API SISOBITO
    const obitosEncontrados = [];

    for (const func of funcionarios) {
      const obito = await verificarObito(func.cpf); // ← API externa (SISOBITO)

      if (obito) {
        obitosEncontrados.push({
          nome: func.nome,
          cpf: func.cpf,
          data_obito: obito.dataObito,
          ano_obito: new Date(obito.dataObito).getFullYear(),
          certidao: obito.certidao,
          grupo: func.grupo
        });
      }
    }

    setObitos(obitosEncontrados);
  } catch (error) {
    toast.error('Erro ao carregar óbitos');
  } finally {
    setLoading(false);
  }
}, []);
```

**APIs Necessárias:**
- 🔄 `POST /api/sisobito/verificar` (precisa integrar - API externa)
- 🔄 `GET /api/admin/tenants/:code/funcionarios` (precisa criar)

---

### 4️⃣ MÓDULO: Candidatos

**Arquivo:** `src/app/dashboard/candidatos/page.tsx`

**O Que Precisa Ser Feito:**
```typescript
const loadCandidatos = useCallback(async () => {
  try {
    const funcionarios = await adminService.getFuncionariosByTenant();

    const candidaturas = [];

    for (const func of funcionarios) {
      // Consultar API TSE (Tribunal Superior Eleitoral)
      const historicoCandidaturas = await consultarCandidaturasTSE(func.cpf);

      for (const cand of historicoCandidaturas) {
        candidaturas.push({
          nome: func.nome,
          cpf: func.cpf,
          ano: cand.ano,
          cargo: cand.cargo,
          partido: cand.partido,
          cidade: cand.municipio,
          estado: cand.uf,
          resultado: cand.situacao, // ELEITO, NÃO ELEITO, SUPLENTE
          grupo: func.grupo
        });
      }
    }

    setCandidatos(candidaturas);
  } catch (error) {
    toast.error('Erro ao carregar candidaturas');
  }
}, []);
```

**APIs Necessárias:**
- 🔄 `POST /api/tse/consultar-candidaturas` (precisa integrar - API TSE)

---

### 5️⃣ MÓDULO: Benefícios Sociais

**Arquivo:** `src/app/dashboard/beneficios/page.tsx`

**O Que Precisa Ser Feito:**
```typescript
const loadBeneficios = useCallback(async () => {
  try {
    const funcionarios = await adminService.getFuncionariosByTenant();

    const beneficios = [];

    for (const func of funcionarios) {
      // Consultar benefícios via API do governo
      const beneficiosPessoa = await consultarBeneficiosSociais(func.cpf);

      for (const ben of beneficiosPessoa) {
        beneficios.push({
          nome: func.nome,
          cpf: func.cpf,
          tipo_beneficio: ben.tipo, // Bolsa Família, Auxílio Brasil, etc.
          valor_mensal: ben.valor,
          situacao: ben.situacao, // ATIVO, BLOQUEADO, CANCELADO
          data_inicio: ben.dataInicio,
          grupo: func.grupo
        });
      }
    }

    setBeneficios(beneficios);
  } catch (error) {
    toast.error('Erro ao carregar benefícios');
  }
}, []);
```

**APIs Necessárias:**
- 🔄 `POST /api/beneficios/consultar` (precisa integrar - API gov.br)

---

### 6️⃣ MÓDULO: Sancionados

**Arquivo:** `src/app/dashboard/sancionados/page.tsx`

**O Que Precisa Ser Feito:**
```typescript
const loadSancionados = useCallback(async () => {
  try {
    const funcionarios = await adminService.getFuncionariosByTenant();

    const sancionados = [];

    for (const func of funcionarios) {
      // Consultar múltiplas bases
      const [ceis, cnep, ofac] = await Promise.all([
        consultarCEIS(func.cpf),    // Cadastro de Empresas Inidôneas e Suspensas
        consultarCNEP(func.cpf),    // Cadastro Nacional de Empresas Punidas
        consultarOFAC(func.nome)    // Office of Foreign Assets Control (USA)
      ]);

      if (ceis || cnep || ofac) {
        sancionados.push({
          nome: func.nome,
          cpf: func.cpf,
          tipo_sancao: [
            ceis ? 'CEIS' : null,
            cnep ? 'CNEP' : null,
            ofac ? 'OFAC' : null
          ].filter(Boolean).join(', '),
          orgao_sancionador: ceis?.orgao || cnep?.orgao || 'OFAC/USA',
          data_inicio: ceis?.dataInicio || cnep?.dataInicio || ofac?.date,
          data_fim: ceis?.dataFim || cnep?.dataFim || null,
          grupo: func.grupo
        });
      }
    }

    setSancionados(sancionados);
  } catch (error) {
    toast.error('Erro ao carregar sancionados');
  }
}, []);
```

**APIs Necessárias:**
- 🔄 `POST /api/ceis/consultar` (precisa integrar - Portal da Transparência)
- 🔄 `POST /api/cnep/consultar` (precisa integrar - Portal da Transparência)
- 🔄 `POST /api/ofac/consultar` (precisa integrar - OFAC API)

---

## 🎨 COMPONENTES REUTILIZÁVEIS

Todos os módulos compartilham componentes comuns:

### FichaFuncionario.tsx

**Localização:** `src/components/dashboard/FichaFuncionario.tsx`

**Funcionalidade:**
- Modal lateral que exibe **todos os dados** de um funcionário específico
- Abas: Dados Cadastrais, Vínculos, Candidaturas, Doações, Sanções, Benefícios
- Permite navegar entre diferentes funcionários sem fechar o modal

**Uso:**
```typescript
const [selectedFuncionario, setSelectedFuncionario] = useState(null);

// Ao clicar em um item da lista:
<div onClick={() => setSelectedFuncionario(funcionario)}>
  {funcionario.nome}
</div>

// Renderizar modal:
{selectedFuncionario && (
  <FichaFuncionario
    funcionario={selectedFuncionario}
    onClose={() => setSelectedFuncionario(null)}
    getCandidaturasByCPF={getCandidaturasByCPF}
    getDoacoesByCPF={getDoacoesByCPF}
    getVinculosByCPF={getVinculosByCPF}
    getSancoesByCPF={getSancoesByCPF}
    getBeneficiosByCPF={getBeneficiosByCPF}
  />
)}
```

---

## 📊 FORMATO DOS DADOS

### Funcionário
```typescript
interface Funcionario {
  id: string;
  cadastro?: string;         // ID do cadastro no sistema
  nome: string;              // Nome completo
  cpf: string;               // CPF (11 dígitos)
  grupo: string;             // Grupo/Setor (ex: "COMURG", "SECRETARIA")
  cargo?: string;            // Cargo (ex: "Auxiliar Administrativo")
  salario?: number;          // Salário (ex: 2500.00)
  esta_vivo?: string;        // "SIM" ou "NAO"
  esta_morto?: string;       // "SIM" ou "NAO"
  ano_obito?: number;        // Ano do óbito (ex: 2022)
  recebe_beneficio?: number; // 0 ou 1
  qual_beneficio?: string;   // Nome do benefício
  socio_empresa?: number;    // 0 ou 1
  qtd_empresas?: number;     // Quantidade de CNPJs
  doador_campanha?: number;  // 0 ou 1
  valor_doacoes?: number;    // Total doado (R$)
  candidato?: number;        // 0 ou 1
  sancionado_ceis?: number;  // 0 ou 1
  sancionado_ofac?: number;  // 0 ou 1
}
```

### Vínculo Empresarial
```typescript
interface Vinculo {
  nome: string;              // Nome do sócio
  cpf: string;               // CPF do sócio
  cnpj: string;              // CNPJ da empresa
  razao_social: string;      // Razão social
  situacao_cadastral: string;// "ATIVA", "BAIXADA", "SUSPENSA"
  qualificacao: string;      // "Sócio-Administrador", "Sócio"
  grupo: string;             // Grupo do funcionário
}
```

---

## 🔧 APIS DO BACKEND (AGENT 2)

### ✅ Já Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/health` | GET | Health check |
| `/api/status` | GET | Status da API |
| `/api/serpro/cpf/consulta` | POST | Consulta CPF (SERPRO) |
| `/api/serpro/cnpj/:cnpj` | GET | Consulta CNPJ básica |
| `/api/serpro/cnpj/:cnpj/qsa` | GET | Consulta QSA (mascarado) |
| `/api/serpro/cnpj/:cnpj/estabelecimentos` | GET | Consulta completa (CPF desmascarado) ⭐ |
| `/api/serpro/divida-ativa/consulta` | POST | Consulta Dívida Ativa |
| `/api/admin/users` | GET | Lista usuários |
| `/api/admin/tenants` | GET | Lista tenants |
| `/api/admin/alerts` | GET | Lista alertas |
| `/api/admin/stats` | GET | Estatísticas |

---

### 🔄 Precisam Ser Criadas

| Endpoint | Método | Descrição | Prioridade |
|----------|--------|-----------|-----------|
| `/api/admin/tenants/:code/funcionarios` | GET | Lista funcionários do tenant | 🔴 ALTA |
| `/api/investigacao/:cpf/dados-completos` | GET | Dados completos de um CPF | 🔴 ALTA |
| `/api/investigacao/buscar-empresas-por-socio` | POST | Busca reversa (CPF → CNPJs) | 🟠 MÉDIA |
| `/api/sisobito/verificar` | POST | Verifica óbito via SISOBITO | 🟡 BAIXA |
| `/api/tse/consultar-candidaturas` | POST | Consulta candidaturas TSE | 🟡 BAIXA |
| `/api/beneficios/consultar` | POST | Consulta benefícios sociais | 🟡 BAIXA |
| `/api/ceis/consultar` | POST | Consulta CEIS | 🟡 BAIXA |
| `/api/cnep/consultar` | POST | Consulta CNEP | 🟡 BAIXA |
| `/api/ofac/consultar` | POST | Consulta OFAC | 🟡 BAIXA |

---

## 🎯 ESTRATÉGIA DE IMPLEMENTAÇÃO

### FASE 1: Dados Básicos (TAREFA 3.5)

**Objetivo:** Fazer funcionar com dados mínimos

1. Criar endpoint: `GET /api/admin/tenants/:code/funcionarios`
   - Retorna lista de CPFs cadastrados no tenant

2. Módulo Funcionários:
   - Carregar CPFs do tenant
   - Para cada CPF, consultar `POST /api/serpro/cpf/consulta`
   - Exibir dados básicos (nome, CPF, situação)

3. Módulo Vínculos:
   - Usar endpoint `GET /api/serpro/cnpj/:cnpj/estabelecimentos`
   - Exibir QSA com CPF desmascarado

**Resultado:** 2 módulos funcionando com dados reais!

---

### FASE 2: Dados Complementares

**Objetivo:** Enriquecer com mais fontes

1. Integrar APIs externas (SISOBITO, TSE, Benefícios)
2. Criar endpoints de cache no backend
3. Atualizar módulos para consumir novas APIs

**Resultado:** Todos os 6 módulos funcionando!

---

### FASE 3: Performance & Cache

**Objetivo:** Otimizar consultas

1. Implementar cache no D1
2. Background jobs para atualização
3. Websockets para atualizações em tempo real

**Resultado:** Sistema rápido e escalável!

---

## 📝 EXEMPLO COMPLETO: Módulo Funcionários

### Código Atual (Broken)
```typescript
// ❌ PROBLEMA: CLIENTE_01_FUNCIONARIOS = []
const loadFuncionarios = useCallback(() => {
  setFuncionarios(CLIENTE_01_FUNCIONARIOS); // Array vazio!
  setLoading(false);
}, []);
```

### Código Futuro (Working)
```typescript
// ✅ SOLUÇÃO: Consultar backend real
const loadFuncionarios = useCallback(async () => {
  setLoading(true);
  try {
    // 1. Buscar lista de funcionários do tenant
    const response = await apiClient.get(`/api/admin/tenants/CLIENTE_01/funcionarios`);

    // 2. Response exemplo:
    // { funcionarios: [
    //   { cpf: "12345678900", grupo: "COMURG", cargo: "Auxiliar" },
    //   { cpf: "98765432100", grupo: "SECRETARIA", cargo: "Gerente" }
    // ]}

    // 3. Para cada funcionário, enriquecer com dados SERPRO
    const funcionariosCompletos = await Promise.all(
      response.funcionarios.map(async (func) => {
        try {
          // Consultar CPF na SERPRO
          const dadosCPF = await serproService.consultarCpf(func.cpf);

          return {
            id: func.cpf,
            nome: dadosCPF.nome,
            cpf: dadosCPF.ni,
            grupo: func.grupo,
            cargo: func.cargo,
            esta_vivo: dadosCPF.situacao.codigo === '0' ? 'SIM' : 'NAO',
            // ... outros campos
          };
        } catch (error) {
          console.error(`Erro ao consultar CPF ${func.cpf}:`, error);
          return {
            id: func.cpf,
            nome: 'Erro ao carregar',
            cpf: func.cpf,
            grupo: func.grupo,
            esta_vivo: 'DESCONHECIDO'
          };
        }
      })
    );

    setFuncionarios(funcionariosCompletos);
    toast.success(`${funcionariosCompletos.length} funcionários carregados`);

  } catch (error) {
    console.error('Erro ao carregar funcionários:', error);
    toast.error('Erro ao carregar funcionários');
  } finally {
    setLoading(false);
  }
}, []);
```

---

## 🚀 PRÓXIMO PASSO IMEDIATO

**Para fazer TAREFA 3.5 funcionar:**

1. **Agent 2** precisa criar endpoint:
```typescript
// backend/workers/api/src/routes/admin.ts
router.get('/tenants/:code/funcionarios', async (c) => {
  const tenantCode = c.req.param('code');

  // Query D1 database
  const { results } = await c.env.DB.prepare(
    'SELECT cpf, grupo, cargo FROM funcionarios WHERE tenant_code = ?'
  ).bind(tenantCode).all();

  return c.json({ funcionarios: results });
});
```

2. **Agent 3** atualiza módulo:
```typescript
// investigaree/src/app/dashboard/funcionarios/page.tsx
// Substituir linha 94-97 pelo código "Futuro" acima
```

3. **Testar:**
```bash
# 1. Adicionar funcionários no D1:
npx wrangler d1 execute investigaree-db --remote --command="
  INSERT INTO funcionarios (tenant_code, cpf, grupo, cargo)
  VALUES ('CLIENTE_01', '12345678900', 'COMURG', 'Auxiliar');
"

# 2. Acessar: http://localhost:3000/dashboard/funcionarios
# 3. Verificar se carrega os dados!
```

---

**FIM DA DOCUMENTAÇÃO**

Se tiver dúvidas sobre qualquer parte, me pergunte! 🚀
