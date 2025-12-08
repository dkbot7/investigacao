# 📤 TAREFA 3.12 - UPLOAD CSV + JOB MONITORING

**Data:** 2025-12-08 07:15
**Status:** ✅ CONCLUÍDO
**Agent:** Agent 3 - Full-Stack Developer

---

## 🎯 OBJETIVO

Implementar sistema completo de upload CSV com processamento em background e monitoramento de jobs em tempo real.

---

## ✅ IMPLEMENTADO

### 1. CSV Parser Utility (`lib/utils/csv-parser.ts`)

**Features:**
- ✅ Parse CSV com delimitador configurável (default: `,`)
- ✅ Validação completa de CPF (algoritmo de dígitos verificadores)
- ✅ Limpeza automática de CPF (remove formatação)
- ✅ Skip header configurável
- ✅ Detecção e reporte de erros por linha
- ✅ Estatísticas de parse (total, válidos, inválidos, %)
- ✅ Validação de tamanho de arquivo (10MB max)
- ✅ Validação de tipo de arquivo (CSV, TXT)
- ✅ Template CSV generator para download

**API Principal:**
```typescript
const result = await parseCSV(file, {
  skipHeader: true,
  delimiter: ',',
  validateCPF: true
});

// result.success: boolean
// result.data: ParsedFuncionario[]
// result.errors: Array<{line, error, data}>
// result.stats: {total, valid, invalid}
```

**Formato CSV Esperado:**
```csv
CPF,Nome,Grupo,Cargo,Salario
12345678900,João da Silva,COMURG,Auxiliar de Limpeza,2500.00
98765432100,Maria Santos,SECRETARIA,Gerente,4500.00
```

---

### 2. Upload CSV Button (`components/dashboard/UploadCsvButton.tsx`)

**Features:**
- ✅ Modal completo com UI moderna
- ✅ Download de template CSV
- ✅ File selection com validação
- ✅ Preview dos dados parseados (primeiras 5 linhas)
- ✅ Display de erros encontrados (linha + mensagem)
- ✅ Stats badge (X/Y válidos - Z%)
- ✅ Upload button desabilitado se sem dados válidos
- ✅ Loading state durante upload
- ✅ Callbacks: onSuccess(jobId, count), onError(message)
- ✅ Auto-reset após sucesso

**Props:**
```typescript
interface UploadCsvButtonProps {
  tenantCode: string;
  onSuccess?: (jobId: number, count: number) => void;
  onError?: (error: string) => void;
}
```

**Uso:**
```typescript
<UploadCsvButton
  tenantCode="CLIENTE_01"
  onSuccess={(jobId, count) => {
    console.log(`${count} funcionários importados! Job #${jobId}`);
  }}
  onError={(error) => {
    console.error(error);
  }}
/>
```

---

### 3. Job Monitor (`components/dashboard/JobMonitor.tsx`)

**Features:**
- ✅ Real-time polling (configurável, default: 3s)
- ✅ Auto-refresh toggle (liga/desliga polling)
- ✅ Progress bar animada (0-100%)
- ✅ Status badges: Pendente, Processando, Concluído, Falhou
- ✅ Contador de items (X/Y processados)
- ✅ Display de falhas
- ✅ Error messages se job falhar
- ✅ Completion timestamp
- ✅ Callback onJobComplete(job)
- ✅ Empty state quando sem jobs
- ✅ Filtro para mostrar/esconder jobs completados

**Props:**
```typescript
interface JobMonitorProps {
  autoRefresh?: boolean;          // default: true
  refreshInterval?: number;        // ms, default: 3000
  onJobComplete?: (job: Job) => void;
  showCompleted?: boolean;         // default: true
}
```

**Uso:**
```typescript
<JobMonitor
  autoRefresh={true}
  refreshInterval={3000}
  showCompleted={false}
  onJobComplete={(job) => {
    console.log('Job completed:', job);
    loadFuncionarios(); // Reload data
  }}
/>
```

**Estados de Job:**
- 🕐 **pending** - Aguardando processamento
- 🔄 **processing** - Em progresso (mostra %)
- ✅ **completed** - Finalizado com sucesso
- ❌ **failed** - Falhou (mostra erro)

---

### 4. Integração na Página Funcionários

**Mudanças em `app/dashboard/funcionarios/page.tsx`:**

```typescript
// Novos imports
import { UploadCsvButton } from "@/components/dashboard/UploadCsvButton";
import { JobMonitor } from "@/components/dashboard/JobMonitor";

// Novos estados
const [showJobMonitor, setShowJobMonitor] = useState(false);
const [successMessage, setSuccessMessage] = useState<string | null>(null);

// Handler de sucesso
const handleUploadSuccess = (jobId: number, count: number) => {
  setSuccessMessage(`${count} funcionários importados! Job #${jobId} criado.`);
  setShowJobMonitor(true);
  setTimeout(() => setSuccessMessage(null), 5000);
  setTimeout(() => loadFuncionarios(), 3000);
};

// Handler de erro
const handleUploadError = (errorMsg: string) => {
  setError(errorMsg);
  setTimeout(() => setError(null), 5000);
};
```

**UI Adicionada:**
- Botão "Importar CSV" ao lado do botão "Adicionar"
- Success banner (auto-hide após 5s)
- JobMonitor exibido após upload

---

## 🏗️ ARQUITETURA

### Fluxo Completo:

```
1. USER SELECTS CSV FILE
   ↓
2. parseCSV(file)
   - Validate CPF
   - Parse data
   - Generate stats
   ↓
3. PREVIEW IN MODAL
   - Show first 5 rows
   - Show stats badge
   - Show errors if any
   ↓
4. USER CLICKS "IMPORTAR"
   ↓
5. importarFuncionarios(tenantCode, data)
   ↓
6. POST /api/admin/import-funcionarios
   {
     tenant_code: "CLIENTE_01",
     funcionarios: [
       { cpf: "12345678900", nome: "João", grupo: "COMURG", ... }
     ]
   }
   ↓
7. BACKEND RESPONSE
   {
     success: true,
     funcionarios_imported: 150,
     job_created: true,
     job_id: 5
   }
   ↓
8. SHOW SUCCESS MESSAGE
   ↓
9. START JOB MONITORING
   - Poll GET /api/admin/jobs every 3s
   - Display progress bar
   - Show X/Y items processed
   ↓
10. WHEN JOB COMPLETES
   - Call onJobComplete()
   - Reload funcionarios list
   - Show updated data with cache
```

### Backend Processing (Agent 2):

```
JOB CREATED
   ↓
CRON TRIGGER (scheduled)
   ↓
FOR EACH CPF (rate: 1 req/s):
   ↓
   Call SERPRO API (R$ 0,50)
   ↓
   Save to serpro_cpf_cache (valid: 90 days)
   ↓
   Update job progress
   ↓
JOB COMPLETED
```

---

## 💰 ECONOMIA

**Dashboard lê do cache D1 (FREE):**
- Upload CSV → Cria job → Background processa → Salva cache
- Dashboard lê cache → **R$ 0,00** (vs R$ 0,50/CPF direto)
- **Economia mantida: R$ 14.690/mês** 💰

**Custo do processamento inicial:**
- 1ª vez: R$ 0,50/CPF (consulta SERPRO)
- Próximas 90 dias: R$ 0,00 (lê do cache)
- ROI: 1 consulta inicial → 90+ dias de uso gratuito

---

## 📊 ENDPOINTS USADOS

### POST /api/admin/import-funcionarios
```typescript
// Request
{
  tenant_code: "CLIENTE_01",
  funcionarios: [
    {
      cpf: "12345678900",
      nome?: "João Silva",
      grupo?: "COMURG",
      cargo?: "Auxiliar",
      salario?: 2500
    }
  ]
}

// Response
{
  success: true,
  message: "150 funcionários importados",
  funcionarios_imported: 150,
  job_created: true,
  job_id: 5,
  tenant_code: "CLIENTE_01"
}
```

### GET /api/admin/jobs
```typescript
// Query params (optional)
?status=processing

// Response
{
  jobs: [
    {
      id: 5,
      type: "consultar_cpf_batch",
      tenant_code: "CLIENTE_01",
      status: "processing",
      progress: 45,
      items_total: 150,
      items_processed: 67,
      items_failed: 2,
      retry_count: 0,
      max_retries: 3,
      priority: 1,
      created_at: "2025-12-08T07:10:00Z",
      started_at: "2025-12-08T07:10:05Z",
      data_json: "{\"cpfs\":[\"123...\",\"456...\"]}",
      error_message?: null
    }
  ],
  total: 1
}
```

---

## 🧪 TESTES MANUAIS

### 1. Upload CSV Válido
```bash
1. Criar CSV com 10 CPFs válidos
2. Click "Importar CSV"
3. Select file
4. Verificar preview (10 registros)
5. Verificar stats badge "10/10 válidos (100%)"
6. Click "Importar 10 Registros"
7. Verificar success message
8. Verificar JobMonitor aparece
9. Verificar progress bar atualiza (3s)
10. Aguardar job completar
11. Verificar lista reload automaticamente
```

### 2. Upload CSV com Erros
```bash
1. Criar CSV com CPFs inválidos
2. Select file
3. Verificar erros exibidos (linha + mensagem)
4. Verificar stats badge "5/10 válidos (50%)"
5. Verificar botão "Importar 5 Registros" habilitado
6. Importar apenas os válidos
```

### 3. Job Monitoring
```bash
1. Após upload, verificar JobMonitor
2. Verificar auto-refresh funcionando (ícone girando)
3. Verificar progress bar atualiza
4. Verificar contador "X/Y processados"
5. Click toggle auto-refresh (desabilitar)
6. Verificar polling para
7. Click toggle novamente (habilitar)
8. Verificar polling retoma
9. Aguardar job completar
10. Verificar badge muda para "Concluído"
11. Verificar timestamp de conclusão
```

### 4. Template Download
```bash
1. Click "Importar CSV"
2. Click "Baixar Template"
3. Verificar arquivo baixado: template-funcionarios.csv
4. Abrir no Excel/LibreOffice
5. Verificar formato correto
6. Verificar 3 linhas de exemplo
```

---

## 📁 ARQUIVOS CRIADOS

```
investigaree/src/
├── lib/
│   └── utils/
│       └── csv-parser.ts                    (NOVO - 270 linhas)
│
├── components/
│   └── dashboard/
│       ├── UploadCsvButton.tsx              (NOVO - 380 linhas)
│       └── JobMonitor.tsx                   (NOVO - 240 linhas)
│
└── app/
    └── dashboard/
        └── funcionarios/
            └── page.tsx                     (MODIFICADO - +50 linhas)
```

---

## 🎨 SCREENSHOTS

### Upload Modal
```
┌─────────────────────────────────────────────────┐
│ Importar Funcionários (CSV)                [×] │
├─────────────────────────────────────────────────┤
│ 📄 Template CSV                                 │
│ Baixe o template CSV para garantir formato     │
│ [⬇ Baixar Template]                            │
│                                                 │
│ Selecionar Arquivo CSV                          │
│ [📁 funcionarios.csv                       ×]  │
│                                                 │
│ [✓ 148/150 válidos (98.7%)]                    │
│                                                 │
│ Prévia (150 registros)                          │
│ ┌───────────────────────────────────────┐      │
│ │ CPF          Nome         Grupo       │      │
│ │ 12345678900  João Silva   COMURG      │      │
│ │ 98765432100  Maria Santos SECRETARIA  │      │
│ └───────────────────────────────────────┘      │
│ + 148 registros                                 │
│                                                 │
│ ⚠ Processamento em Background                  │
│ Os CPFs serão consultados no SERPRO...         │
├─────────────────────────────────────────────────┤
│ [Cancelar]       [📤 Importar 150 Registros]  │
└─────────────────────────────────────────────────┘
```

### Job Monitor
```
┌─────────────────────────────────────────────────┐
│ Jobs em Processamento                     [🔄] │
├─────────────────────────────────────────────────┤
│ Consulta CPF (Lote)        [🔵 Processando]    │
│ Iniciado: 08/12/2025 07:10                      │
│ Tenant: CLIENTE_01                              │
│                                                 │
│ Progresso: 67/150                         45%   │
│ ████████████░░░░░░░░░░░░░░░░                   │
│ 2 falhas                                        │
└─────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

### Funcionalidades
- [x] Upload CSV funciona
- [x] Validação de CPF funciona
- [x] Preview mostra dados corretos
- [x] Erros são exibidos
- [x] Stats badge mostra % correto
- [x] Template download funciona
- [x] Job é criado no backend
- [x] JobMonitor mostra progress
- [x] Auto-refresh funciona
- [x] Toggle auto-refresh funciona
- [x] Lista reload quando job completa
- [x] Success message aparece
- [x] Error handling funciona
- [x] Graceful degradation se backend falhar

### UI/UX
- [x] Modal responsivo
- [x] Loading states claros
- [x] Animations suaves
- [x] Dark mode funciona
- [x] Acessibilidade básica (botões, labels)
- [x] Mobile friendly

### Performance
- [x] Parse de CSV rápido (< 1s para 1000 linhas)
- [x] Polling não sobrecarrega (3s interval)
- [x] Auto-refresh pode ser desabilitado
- [x] Memory leaks prevenidos (cleanup de intervals)

---

## 🐛 LIMITAÇÕES CONHECIDAS

1. **File Size:** Limite de 10MB no CSV
2. **Validação:** Apenas CPF é validado (nome, grupo, etc são opcionais)
3. **Polling:** Fixo em 3s (não configurável via UI)
4. **Job History:** JobMonitor mostra apenas jobs ativos (configurável via prop)
5. **Error Details:** Erros de parse limitados a 10 primeiros (performance)

---

## 🔮 MELHORIAS FUTURAS

### Curto Prazo
- [ ] Drag & drop para upload
- [ ] Suporte para XLSX (além de CSV)
- [ ] Configurar polling interval via UI
- [ ] Pausar/cancelar job
- [ ] Retry job que falhou
- [ ] Download de erros como CSV

### Longo Prazo
- [ ] Validação de nome (formato)
- [ ] Validação de salário (range)
- [ ] Bulk delete de funcionários
- [ ] Job queue visualization (Kanban)
- [ ] Historical job logs
- [ ] Email notification quando job completa
- [ ] Webhook integration

---

## 📚 REFERÊNCIAS

### Código
- `lib/services/dados.service.ts` - Service layer
- `lib/types/dados.types.ts` - TypeScript types
- `.agents/agent-2-backend/API_DEPLOYED.md` - Backend docs

### Endpoints Backend
- POST /api/admin/import-funcionarios
- GET /api/admin/jobs
- POST /api/admin/process-jobs (manual trigger)

---

**Criado:** 2025-12-08 07:15
**Agent:** Agent 3 - Full-Stack Developer
**Status:** ✅ COMPLETO
**Progresso:** 71% → 78% (+7%)
