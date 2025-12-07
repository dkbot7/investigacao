# 🏗️ ARQUITETURA CORRETA - D1 COMO CACHE

**⚠️ IMPORTANTE:** APIs SERPRO são **PAGAS POR CONSULTA**!
Dashboard **NUNCA** deve chamar SERPRO diretamente.

---

## 🚨 PRINCÍPIO FUNDAMENTAL

```
┌─────────────────────────────────────────────────────────────┐
│  🔒 REGRA DE OURO                                            │
│                                                               │
│  ❌ Dashboard NÃO pode consultar APIs pagas                 │
│  ✅ Dashboard SÓ pode ler D1 Database (cache)               │
│                                                               │
│  Motivo: Cada consulta SERPRO = R$ 0,50 a R$ 1,50           │
│  100 visualizações = R$ 50,00 a R$ 150,00! 💸                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 FLUXO CORRETO

### ETAPA 1: Carga Inicial (Admin Manual)

```
┌─────────────────────────────────────────────────────────────┐
│  👨‍💼 ADMINISTRADOR                                           │
│  Acessa: /dashboard/admin/carga-inicial                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Upload de arquivo CSV com CPFs
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  📄 ARQUIVO: funcionarios.csv                                │
│  ┌───────────────┬──────────┬─────────────────────────────┐ │
│  │ cpf           │ grupo    │ cargo                       │ │
│  ├───────────────┼──────────┼─────────────────────────────┤ │
│  │ 12345678900   │ COMURG   │ Auxiliar                    │ │
│  │ 98765432100   │ SECRETAR │ Gerente                     │ │
│  │ ...           │ ...      │ ...                         │ │
│  └───────────────┴──────────┴─────────────────────────────┘ │
│  (1.000 funcionários)                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ POST /api/admin/import-funcionarios
                 │ Body: { cpfs: [...] }
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  ☁️  CLOUDFLARE WORKER                                      │
│                                                               │
│  1. Salvar CPFs no D1:                                       │
│     INSERT INTO funcionarios (cpf, grupo, cargo, ...)        │
│                                                               │
│  2. Enfileirar job de processamento:                         │
│     INSERT INTO jobs_queue (type, status, data)              │
│     VALUES ('serpro_batch', 'pending', {...})                │
│                                                               │
│  3. Retornar ao admin:                                       │
│     "1.000 CPFs importados. Job enfileirado."                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Job criado
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🗄️  D1 DATABASE                                            │
│                                                               │
│  Tabela: funcionarios                                        │
│  ┌──────────────┬──────────┬──────────┬──────────────────┐  │
│  │ cpf          │ grupo    │ cargo    │ dados_serpro     │  │
│  ├──────────────┼──────────┼──────────┼──────────────────┤  │
│  │ 12345678900  │ COMURG   │ Auxiliar │ NULL (pendente)  │  │
│  │ 98765432100  │ SECRETAR │ Gerente  │ NULL (pendente)  │  │
│  └──────────────┴──────────┴──────────┴──────────────────┘  │
│                                                               │
│  Tabela: jobs_queue                                          │
│  ┌──────┬──────────────┬─────────┬────────────────────────┐ │
│  │ id   │ type         │ status  │ data                   │ │
│  ├──────┼──────────────┼─────────┼────────────────────────┤ │
│  │ 1    │ serpro_batch │ pending │ {cpfs: [123..., ...]}  │ │
│  └──────┴──────────────┴─────────┴────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### ETAPA 2: Processamento em Background (Cron Job)

```
┌─────────────────────────────────────────────────────────────┐
│  ⏰ CLOUDFLARE CRON TRIGGER                                 │
│  - Configurado para rodar a cada 1 hora                     │
│  - Ou sob demanda via endpoint /api/admin/process-jobs      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Buscar jobs pendentes
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  ☁️  WORKER: processJobs()                                  │
│                                                               │
│  1. Query D1:                                                │
│     SELECT * FROM jobs_queue                                 │
│     WHERE status = 'pending'                                 │
│     LIMIT 1                                                  │
│                                                               │
│  2. Pegar CPFs do job (ex: 100 CPFs por job)                │
│                                                               │
│  3. Para cada CPF:                                           │
│     a) Consultar SERPRO (💰 PAGO!)                          │
│     b) Salvar resposta no D1                                 │
│     c) Aguardar 1 segundo (rate limit)                       │
│                                                               │
│  4. Marcar job como 'completed'                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Para cada CPF no job:
                 │   POST https://gateway.apiserpro.serpro.gov.br/...
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  💰 API SERPRO                                               │
│  - Consulta controlada (100 CPFs/hora)                      │
│  - Custo: ~R$ 50,00 a R$ 150,00 por job                     │
│  - Rate limit: 60/min (respeitado com delay)                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Response:
                 │ { ni: "123...", nome: "JOAO", situacao: {...} }
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  ☁️  WORKER: saveToCache()                                  │
│                                                               │
│  UPDATE funcionarios                                         │
│  SET dados_serpro = ?                                        │
│  WHERE cpf = ?                                               │
│                                                               │
│  OU                                                          │
│                                                               │
│  INSERT INTO serpro_cpf_cache                                │
│  (cpf, nome, nascimento, situacao, ...)                      │
│  VALUES (?, ?, ?, ?, ...)                                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Dados salvos
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🗄️  D1 DATABASE                                            │
│                                                               │
│  Tabela: funcionarios                                        │
│  ┌──────────────┬──────────┬────────────────────────────┐   │
│  │ cpf          │ grupo    │ dados_serpro               │   │
│  ├──────────────┼──────────┼────────────────────────────┤   │
│  │ 12345678900  │ COMURG   │ {nome:"JOAO",situacao:...} │   │
│  │ 98765432100  │ SECRETAR │ {nome:"MARIA",...}         │   │
│  └──────────────┴──────────┴────────────────────────────┘   │
│                                                               │
│  Tabela: serpro_cpf_cache                                    │
│  ┌─────────┬──────────────┬─────────┬────────────────────┐  │
│  │ cpf     │ nome         │ situacao│ ultima_atualizacao │  │
│  ├─────────┼──────────────┼─────────┼────────────────────┤  │
│  │ 123...  │ JOAO SILVA   │ REGULAR │ 2025-12-07 22:00   │  │
│  │ 456...  │ MARIA SANTOS │ REGULAR │ 2025-12-07 22:00   │  │
│  └─────────┴──────────────┴─────────┴────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

✅ RESULTADO: 100 CPFs consultados e salvos!
💰 CUSTO: ~R$ 50,00 (uma única vez)
```

---

### ETAPA 3: Dashboard Consulta Cache (GRÁTIS!)

```
┌─────────────────────────────────────────────────────────────┐
│  👤 USUÁRIO                                                  │
│  Acessa: /dashboard/funcionarios                            │
│  (pode acessar 1.000x por dia - sem custo!)                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ GET /api/admin/tenants/:code/funcionarios
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  ☁️  CLOUDFLARE WORKER                                      │
│                                                               │
│  ⚠️  NÃO CHAMA SERPRO! Apenas query no D1:                  │
│                                                               │
│  const results = await DB.prepare(`                          │
│    SELECT                                                    │
│      f.cpf,                                                  │
│      f.grupo,                                                │
│      f.cargo,                                                │
│      c.nome,                                                 │
│      c.situacao,                                             │
│      c.nascimento                                            │
│    FROM funcionarios f                                       │
│    LEFT JOIN serpro_cpf_cache c ON f.cpf = c.cpf             │
│    WHERE f.tenant_code = ?                                   │
│  `).bind(tenantCode).all();                                  │
│                                                               │
│  return { funcionarios: results };                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ SQL Query (instantâneo, grátis)
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🗄️  D1 DATABASE (cache)                                   │
│  - Retorna dados salvos                                      │
│  - Custo: R$ 0,00                                            │
│  - Latência: ~10ms                                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ JSON Response
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  🖥️  DASHBOARD                                              │
│                                                               │
│  ✅ JOAO SILVA (CPF: 123...)                                │
│  ✅ MARIA SANTOS (CPF: 456...)                              │
│                                                               │
│  💰 Custo desta visualização: R$ 0,00                       │
│  ⚡ Latência: 10ms (super rápido!)                          │
└─────────────────────────────────────────────────────────────┘

✅ RESULTADO: Dashboard exibe dados salvos
💰 CUSTO: R$ 0,00 (cache grátis!)
```

---

## 🗄️ ESTRUTURA DO D1 DATABASE

### Tabela: funcionarios
```sql
CREATE TABLE funcionarios (
  id TEXT PRIMARY KEY,
  tenant_code TEXT NOT NULL,
  cpf TEXT NOT NULL,
  grupo TEXT,
  cargo TEXT,
  salario REAL,
  -- Dados enriquecidos (vindos de outras fontes):
  esta_morto INTEGER DEFAULT 0,  -- 0=não, 1=sim
  ano_obito INTEGER,
  recebe_beneficio INTEGER DEFAULT 0,
  qual_beneficio TEXT,
  socio_empresa INTEGER DEFAULT 0,
  qtd_empresas INTEGER DEFAULT 0,
  doador_campanha INTEGER DEFAULT 0,
  valor_doacoes REAL,
  candidato INTEGER DEFAULT 0,
  sancionado_ceis INTEGER DEFAULT 0,
  -- Timestamps:
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_code, cpf)
);
```

### Tabela: serpro_cpf_cache
```sql
CREATE TABLE serpro_cpf_cache (
  cpf TEXT PRIMARY KEY,
  nome TEXT,
  nascimento TEXT,
  situacao_codigo TEXT,
  situacao_descricao TEXT,
  -- Dados completos JSON:
  dados_completos TEXT, -- JSON com resposta completa da SERPRO
  -- Controle de cache:
  ultima_consulta TEXT DEFAULT CURRENT_TIMESTAMP,
  valido_ate TEXT,  -- Data de expiração (ex: 90 dias)
  consultas_count INTEGER DEFAULT 1
);
```

### Tabela: serpro_cnpj_cache
```sql
CREATE TABLE serpro_cnpj_cache (
  cnpj TEXT PRIMARY KEY,
  razao_social TEXT,
  situacao_cadastral TEXT,
  qsa TEXT,  -- JSON com quadro societário
  dados_completos TEXT,  -- JSON com resposta completa
  ultima_consulta TEXT DEFAULT CURRENT_TIMESTAMP,
  valido_ate TEXT
);
```

### Tabela: jobs_queue
```sql
CREATE TABLE jobs_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,  -- 'serpro_batch', 'cnpj_batch', etc.
  status TEXT NOT NULL,  -- 'pending', 'processing', 'completed', 'failed'
  data TEXT,  -- JSON com parâmetros do job
  progress INTEGER DEFAULT 0,  -- 0-100%
  error TEXT,  -- Mensagem de erro (se falhou)
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  started_at TEXT,
  completed_at TEXT
);
```

---

## 🔄 ATUALIZAÇÃO PERIÓDICA

### Estratégia de Cache

```sql
-- Verificar CPFs desatualizados (>90 dias):
SELECT cpf
FROM serpro_cpf_cache
WHERE julianday('now') - julianday(ultima_consulta) > 90
LIMIT 100;

-- Criar job para re-consultar:
INSERT INTO jobs_queue (type, status, data)
VALUES (
  'serpro_refresh',
  'pending',
  json_object('cpfs', json_array(...))
);
```

### Cron Schedule
```toml
# wrangler.toml
[triggers]
crons = [
  "0 */1 * * *"  # A cada 1 hora: processar jobs pendentes
]
```

---

## 💰 CONTROLE DE CUSTOS

### Dashboard de Custos (Admin)

```
┌─────────────────────────────────────────────────────────────┐
│  📊 PAINEL DE CUSTOS SERPRO                                  │
│                                                               │
│  📅 Este Mês (Dezembro/2025)                                 │
│  ────────────────────────────────────────────────────────    │
│  Consultas CPF:        1.234 × R$ 0,50 = R$ 617,00          │
│  Consultas CNPJ:         87 × R$ 1,17 = R$ 101,79           │
│  Dívida Ativa:          456 × R$ 0,75 = R$ 342,00           │
│  ────────────────────────────────────────────────────────    │
│  TOTAL:                                   R$ 1.060,79        │
│                                                               │
│  📈 Jobs Pendentes: 3                                        │
│  ⏸️  Jobs Pausados:  0                                       │
│  ✅ Jobs Completos:  47                                      │
│                                                               │
│  [⏸️  Pausar Jobs]  [▶️  Processar Agora]  [📊 Relatório]   │
└─────────────────────────────────────────────────────────────┘
```

### Tabela: serpro_usage_log
```sql
CREATE TABLE serpro_usage_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_name TEXT,  -- 'cpf', 'cnpj', 'divida_ativa'
  cpf_cnpj TEXT,
  custo REAL,  -- Custo em R$
  status TEXT,  -- 'success', 'error'
  tenant_code TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Query para dashboard:
SELECT
  api_name,
  COUNT(*) as total_consultas,
  SUM(custo) as custo_total
FROM serpro_usage_log
WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
GROUP BY api_name;
```

---

## ✅ RESUMO DA ARQUITETURA CORRETA

| Componente | Função | Custo |
|------------|--------|-------|
| **Dashboard** | Exibir dados | R$ 0,00 (só lê cache) |
| **D1 Database** | Armazenar cache | R$ 0,00 (plano grátis) |
| **Cron Jobs** | Processar jobs | R$ 0,00 (Cloudflare Workers grátis) |
| **API SERPRO** | Consultas controladas | ~R$ 0,50-1,50 por CPF (PAGO!) |

**Total mensal estimado:** R$ 500-2.000 (dependendo do volume)

---

## 🚀 IMPLEMENTAÇÃO (PRÓXIMOS PASSOS)

### 1. Criar Tabelas no D1
```bash
npx wrangler d1 execute investigaree-db --remote --file=migrations/002_cache_tables.sql
```

### 2. Implementar Endpoint de Importação
```typescript
// POST /api/admin/import-funcionarios
// Body: { cpfs: ["123...", "456..."], tenant_code: "CLIENTE_01" }
```

### 3. Implementar Job Processor
```typescript
// Cron: processar jobs a cada 1 hora
// Rate limit: 60 consultas/min
```

### 4. Dashboard Lê Cache
```typescript
// GET /api/admin/tenants/:code/funcionarios
// SELECT FROM funcionarios + serpro_cpf_cache
```

---

**FIM - ARQUITETURA CORRETA** ✅

Agora o sistema está **seguro** e **econômico**! 🔒💰
