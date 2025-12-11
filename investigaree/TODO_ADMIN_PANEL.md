# TODO - ADMIN PANEL INVESTIGAREE
**Criado em:** 11/12/2025
**Baseado em:** ADMIN_PANEL_RESEARCH_2025.md

---

## 🎯 RESUMO EXECUTIVO

**Objetivo:** Completar implementação do Admin Panel com funcionalidades essenciais identificadas na pesquisa de boas práticas SaaS 2025

**Status Geral:**
- ✅ Backend: 100% implementado e deployed
- ⚠️ Frontend: 40% implementado
- ❌ UI Components: 0% dos novos botões implementados

**Prioridade:** 🔴 ALTA - Funcionalidades críticas para operação

---

## 📋 CHECKLIST GERAL

### ✅ CONCLUÍDO

- [x] Pesquisa de boas práticas admin panels SaaS 2025
- [x] Identificação de funcionalidades faltantes
- [x] Criação de endpoints backend:
  - [x] PATCH `/api/admin/users/:id` - Update user
  - [x] DELETE `/api/admin/users/:id` - Delete user
  - [x] PATCH `/api/admin/tenants/:code` - Update tenant
  - [x] GET `/api/admin/audit-logs` - List audit logs
- [x] Criação de funções API frontend:
  - [x] `updateUser()`
  - [x] `deleteUser()`
  - [x] `updateTenant()`
  - [x] `getAuditLogs()`
- [x] Deploy backend para produção (v954c2f74)
- [x] Documentação da pesquisa (ADMIN_PANEL_RESEARCH_2025.md)
- [x] Criação deste TODO

### ⚠️ EM PROGRESSO

- [ ] Implementação de UI components (0%)
- [ ] Testes de integração (0%)

### ❌ PENDENTE

- [ ] Todas as tasks abaixo

---

## 🔴 PRIORIDADE ALTA (DEVE SER FEITO PRIMEIRO)

### 1. EDIT USER - Botão e Modal
**Prioridade:** 🔴 CRÍTICA
**Estimativa:** 2h
**Arquivo:** `src/app/dashboard/admin/page.tsx`

**Checklist:**
- [ ] **1.1** Criar componente `EditUserModal`
  - [ ] Importar Dialog do Shadcn UI
  - [ ] Criar state para controlar modal (isOpen, currentUser)
  - [ ] Criar form com campos: nome, telefone
  - [ ] Adicionar validação (nome mínimo 3 chars, telefone formato BR)
  - [ ] Implementar handleSubmit com updateUser()
  - [ ] Adicionar loading state durante save
  - [ ] Adicionar feedback toast success/error
  - [ ] Fechar modal após sucesso
  - [ ] Recarregar dados após salvar

- [ ] **1.2** Adicionar botão Edit na tabela de usuários
  - [ ] Adicionar coluna "Ações" se não existir
  - [ ] Criar botão com ícone Pencil (lucide-react)
  - [ ] Adicionar onClick que abre modal
  - [ ] Estilo: ghost button com hover blue
  - [ ] Tooltip "Editar usuário"

- [ ] **1.3** Adicionar botão Edit na versão mobile (cards)
  - [ ] Adicionar no menu de ações do card
  - [ ] Manter consistência visual com desktop

**Código de referência:**
```tsx
// Estado
const [editUserModal, setEditUserModal] = useState(false);
const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);

// Handler
function handleEditUser(user: AdminUser) {
  setUserToEdit(user);
  setEditUserModal(true);
}

// Botão na tabela
<Button
  size="sm"
  variant="ghost"
  onClick={() => handleEditUser(user)}
  className="text-blue-400 hover:text-blue-300"
>
  <Pencil className="w-4 h-4" />
</Button>

// Modal component (ver ADMIN_PANEL_RESEARCH_2025.md seção "EditUserModal")
```

**Arquivos a modificar:**
- `src/app/dashboard/admin/page.tsx` (adicionar botão e modal)

**Testes:**
1. Abrir modal clicando em Edit
2. Editar nome e telefone
3. Salvar e verificar atualização
4. Verificar toast de sucesso
5. Verificar que lista atualiza
6. Testar cancelar sem salvar
7. Testar validação de campos

---

### 2. DELETE USER - Botão e Modal de Confirmação
**Prioridade:** 🔴 CRÍTICA
**Estimativa:** 2h
**Arquivo:** `src/app/dashboard/admin/page.tsx`

**Checklist:**
- [ ] **2.1** Criar componente `DeleteUserConfirmModal`
  - [ ] Importar Dialog, Alert do Shadcn UI
  - [ ] Criar state (isOpen, userToDelete, confirmText)
  - [ ] Mostrar warning com AlertDestructive
  - [ ] Listar consequências (acessos removidos, etc)
  - [ ] Input para digitar email de confirmação
  - [ ] Botão Delete desabilitado até confirmText === user.email
  - [ ] Implementar handleDelete com deleteUser()
  - [ ] Loading state durante delete
  - [ ] Toast success/error
  - [ ] Recarregar dados após delete

- [ ] **2.2** Adicionar botão Delete na tabela
  - [ ] Ícone Trash (lucide-react)
  - [ ] Variant destructive ou ghost com text-red
  - [ ] onClick abre modal de confirmação
  - [ ] Tooltip "Deletar usuário"

- [ ] **2.3** Adicionar botão Delete na versão mobile

**Código de referência:**
```tsx
// Estado
const [deleteUserModal, setDeleteUserModal] = useState(false);
const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

// Handler
function handleDeleteUser(user: AdminUser) {
  setUserToDelete(user);
  setDeleteUserModal(true);
}

// Botão na tabela
<Button
  size="sm"
  variant="ghost"
  onClick={() => handleDeleteUser(user)}
  className="text-red-400 hover:text-red-300"
>
  <Trash className="w-4 h-4" />
</Button>

// Modal component (ver ADMIN_PANEL_RESEARCH_2025.md seção "DeleteUserConfirmModal")
```

**Arquivos a modificar:**
- `src/app/dashboard/admin/page.tsx`

**Testes:**
1. Clicar em Delete
2. Verificar warning aparece
3. Tentar deletar sem digitar email (botão disabled)
4. Digitar email errado (mensagem de erro)
5. Digitar email correto e deletar
6. Verificar usuário removido da lista
7. Verificar toast de sucesso

---

### 3. EDIT TENANT - Botão e Modal
**Prioridade:** 🔴 ALTA
**Estimativa:** 1.5h
**Arquivo:** `src/app/dashboard/admin/page.tsx`

**Checklist:**
- [ ] **3.1** Criar componente `EditTenantModal`
  - [ ] Form com campos: nome, status
  - [ ] Select para status (active, suspended, inactive)
  - [ ] Code read-only (não editável)
  - [ ] Implementar handleSubmit com updateTenant()
  - [ ] Loading state
  - [ ] Toast feedback
  - [ ] Recarregar dados

- [ ] **3.2** Criar seção de Tenants na UI
  - [ ] Pode ser uma nova tab "Tenants" ou expandir "Overview"
  - [ ] Tabela similar à de usuários
  - [ ] Colunas: Code, Name, Status, Users, Actions

- [ ] **3.3** Adicionar botão Edit para cada tenant
  - [ ] Ícone Pencil
  - [ ] onClick abre modal
  - [ ] Tooltip "Editar tenant"

- [ ] **3.4** Adicionar status badge visual
  - [ ] active = verde
  - [ ] suspended = vermelho
  - [ ] inactive = cinza

**Código de referência:**
```tsx
// Estado
const [editTenantModal, setEditTenantModal] = useState(false);
const [tenantToEdit, setTenantToEdit] = useState<AdminTenant | null>(null);

// Handler
function handleEditTenant(tenant: AdminTenant) {
  setTenantToEdit(tenant);
  setEditTenantModal(true);
}

// Status Badge
function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: 'bg-emerald-500/20 text-emerald-400',
    suspended: 'bg-red-500/20 text-red-400',
    inactive: 'bg-gray-500/20 text-gray-400'
  };
  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}

// Modal component (ver ADMIN_PANEL_RESEARCH_2025.md seção "EditTenantModal")
```

**Arquivos a modificar:**
- `src/app/dashboard/admin/page.tsx`

**Testes:**
1. Visualizar lista de tenants
2. Clicar em Edit
3. Alterar nome e status
4. Salvar e verificar atualização
5. Verificar badge muda cor conforme status
6. Testar cancelar

---

### 4. AUDIT LOGS - Nova Tab
**Prioridade:** 🔴 ALTA (Compliance)
**Estimativa:** 3h
**Arquivo:** `src/app/dashboard/admin/page.tsx`

**Checklist:**
- [ ] **4.1** Adicionar tab "Logs de Auditoria"
  - [ ] Adicionar no menu de tabs (ao lado de Overview, Alerts, etc)
  - [ ] Criar state activeTab que aceita 'audit-logs'
  - [ ] Ícone: FileText ou ScrollText

- [ ] **4.2** Criar seção de Audit Logs
  - [ ] Fetch data com getAuditLogs()
  - [ ] State: logs, loading, filters, pagination
  - [ ] useEffect para carregar logs quando tab ativa

- [ ] **4.3** Implementar filtros
  - [ ] Select: Ação (create, update, delete, grant, revoke, all)
  - [ ] Select: Tipo de Entidade (user, tenant, alert, all)
  - [ ] Input: Buscar por usuário (email)
  - [ ] Date range picker (opcional)
  - [ ] Botão "Aplicar Filtros"
  - [ ] Botão "Limpar Filtros"

- [ ] **4.4** Criar tabela de logs
  - [ ] Colunas:
    - Data/Hora (formatado pt-BR)
    - Usuário (nome + email)
    - Ação (badge colorido)
    - Tipo
    - Entidade ID
    - Detalhes (botão para expandir metadata JSON)
  - [ ] Paginação (limit 50 por página)
  - [ ] Loading skeleton
  - [ ] Empty state quando sem logs

- [ ] **4.5** Adicionar ação "Ver Detalhes"
  - [ ] Modal ou popover mostrando metadata JSON formatado
  - [ ] Syntax highlighting (optional)

- [ ] **4.6** Adicionar Export CSV de logs
  - [ ] Botão "Export CSV" no header
  - [ ] Respeitar filtros ativos
  - [ ] Colunas: timestamp, user, action, entity_type, entity_id, metadata

**Código de referência:**
```tsx
// Estado
const [auditLogs, setAuditLogs] = useState<any[]>([]);
const [auditLogsLoading, setAuditLogsLoading] = useState(false);
const [auditFilters, setAuditFilters] = useState({
  action: '',
  entityType: '',
  userId: '',
  limit: 50,
  offset: 0
});

// Load logs
async function loadAuditLogs() {
  setAuditLogsLoading(true);
  try {
    const result = await getAuditLogs(auditFilters);
    setAuditLogs(result.data.logs);
  } catch (error) {
    toast.error('Erro ao carregar logs');
  } finally {
    setAuditLogsLoading(false);
  }
}

useEffect(() => {
  if (activeTab === 'audit-logs') {
    loadAuditLogs();
  }
}, [activeTab, auditFilters]);

// Action Badge
function ActionBadge({ action }: { action: string }) {
  const colors = {
    create: 'bg-emerald-500/20 text-emerald-400',
    update: 'bg-blue-500/20 text-blue-400',
    delete: 'bg-red-500/20 text-red-400',
    grant: 'bg-purple-500/20 text-purple-400',
    revoke: 'bg-orange-500/20 text-orange-400'
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[action] || 'bg-gray-500/20 text-gray-400'}`}>
      {action}
    </span>
  );
}
```

**Arquivos a modificar:**
- `src/app/dashboard/admin/page.tsx`

**Testes:**
1. Navegar para tab Audit Logs
2. Verificar logs carregam
3. Testar cada filtro individualmente
4. Testar combinação de filtros
5. Testar paginação
6. Clicar em "Ver Detalhes" e ver metadata
7. Exportar CSV e verificar conteúdo

---

## 🟡 PRIORIDADE MÉDIA (PODE SER FEITO DEPOIS)

### 5. EXPORT TENANTS CSV
**Prioridade:** 🟡 MÉDIA
**Estimativa:** 1h
**Arquivo:** `src/app/dashboard/admin/page.tsx`

**Checklist:**
- [ ] **5.1** Criar função exportTenantsCSV()
  - [ ] Headers: Código, Nome, Status, Criado em, Usuários
  - [ ] Mapear tenants para rows
  - [ ] Criar blob CSV
  - [ ] Trigger download

- [ ] **5.2** Adicionar botão "Export CSV" na seção de Tenants
  - [ ] Ícone Download
  - [ ] Mesmo estilo do Export Users
  - [ ] onClick chama exportTenantsCSV()

**Código de referência:**
```tsx
function exportTenantsCSV() {
  const headers = ['Código', 'Nome', 'Status', 'Criado em', 'Usuários'];
  const rows = tenants.map(t => [
    t.code,
    t.name,
    t.status,
    new Date(t.created_at).toLocaleDateString('pt-BR'),
    t.user_count.toString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `tenants_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();

  toast.success('CSV exportado com sucesso!');
}
```

**Testes:**
1. Clicar em Export CSV
2. Verificar arquivo baixado
3. Abrir CSV e verificar dados
4. Verificar encoding UTF-8 (acentos)

---

### 6. DISABLE/ENABLE USER TOGGLE
**Prioridade:** 🟡 MÉDIA
**Estimativa:** 3h
**Requisito:** Migração de banco de dados

**Checklist:**
- [ ] **6.1** Migração de banco D1
  - [ ] Criar migration file `006_add_user_disabled_field.sql`
  - [ ] Adicionar coluna `disabled INTEGER DEFAULT 0` na tabela `users`
  - [ ] Rodar migration no D1 de produção
  - [ ] Atualizar schema.sql

- [ ] **6.2** Backend - Endpoint de update status
  - [ ] PATCH `/api/admin/users/:id/status`
  - [ ] Body: `{ disabled: boolean }`
  - [ ] Log de auditoria

- [ ] **6.3** Frontend - API function
  - [ ] `toggleUserStatus(userId: string, disabled: boolean)`

- [ ] **6.4** UI - Toggle switch
  - [ ] Adicionar coluna "Status" na tabela
  - [ ] Switch component (Shadcn UI)
  - [ ] Enabled = verde, Disabled = vermelho
  - [ ] onClick atualiza status
  - [ ] Confirmação ao desabilitar
  - [ ] Visual indicator (opacity reduzida quando disabled)

**Código SQL:**
```sql
-- Migration 006
ALTER TABLE users ADD COLUMN disabled INTEGER DEFAULT 0;

-- Index para performance
CREATE INDEX IF NOT EXISTS idx_users_disabled ON users(disabled);
```

**Testes:**
1. Desabilitar usuário
2. Verificar não consegue fazer login
3. Reabilitar usuário
4. Verificar login funciona
5. Verificar audit log registrado

---

### 7. ADVANCED FILTERS
**Prioridade:** 🟡 MÉDIA
**Estimativa:** 2h

**Checklist:**
- [ ] **7.1** Filtros adicionais para usuários
  - [ ] Filtro por role (admin, editor, viewer)
  - [ ] Filtro por último acesso (1h, 24h, 7d, 30d, nunca)
  - [ ] Filtro por data de criação (range)
  - [ ] Filtro por tenant específico

- [ ] **7.2** UI para filtros avançados
  - [ ] Accordion "Filtros Avançados" (collapsed por default)
  - [ ] Grid de selects
  - [ ] Botão "Aplicar"
  - [ ] Botão "Limpar Filtros"
  - [ ] Indicador visual de filtros ativos

- [ ] **7.3** Save/Load filter presets (opcional)
  - [ ] LocalStorage para salvar presets
  - [ ] Dropdown "Filtros Salvos"
  - [ ] Botão "Salvar Filtro Atual"
  - [ ] Input para nomear preset

**Testes:**
1. Aplicar cada filtro individualmente
2. Combinar múltiplos filtros
3. Limpar filtros
4. Salvar preset
5. Carregar preset

---

## 🟢 PRIORIDADE BAIXA (NICE TO HAVE)

### 8. BULK ACTIONS
**Prioridade:** 🟢 BAIXA
**Estimativa:** 4h

**Checklist:**
- [ ] Checkbox selection em cada row
- [ ] Select All checkbox no header
- [ ] Action bar quando items selecionados
- [ ] Bulk Grant Access
- [ ] Bulk Delete (com confirmação)
- [ ] Bulk Export

---

### 9. REAL-TIME AUTO-REFRESH
**Prioridade:** 🟢 BAIXA
**Estimativa:** 2h

**Checklist:**
- [ ] Toggle "Auto-refresh"
- [ ] Interval selector (30s, 1min, 5min)
- [ ] Timestamp "Atualizado há X minutos"
- [ ] Pause on user interaction

---

### 10. DASHBOARD WIDGETS
**Prioridade:** 🟢 BAIXA
**Estimativa:** 6h

**Checklist:**
- [ ] User Growth Chart (line chart)
- [ ] Tenant Activity Heatmap
- [ ] Top Users by Activity
- [ ] System Health indicators

---

### 11. MOBILE ENHANCEMENTS
**Prioridade:** 🟢 BAIXA
**Estimativa:** 3h

**Checklist:**
- [ ] Swipe actions (swipe left = delete, right = edit)
- [ ] Bottom sheet modals
- [ ] Pull-to-refresh
- [ ] Sticky table headers

---

### 12. ACCESSIBILITY (A11Y)
**Prioridade:** 🟢 BAIXA
**Estimativa:** 4h

**Checklist:**
- [ ] Keyboard navigation completo
- [ ] ARIA labels em todos botões
- [ ] Screen reader testing
- [ ] Color contrast audit
- [ ] Focus indicators
- [ ] Alt text em ícones

---

## 🧪 TESTING CHECKLIST

### Testes Funcionais
- [ ] Todos os botões clicáveis
- [ ] Todos os modals abrem/fecham corretamente
- [ ] Formulários validam corretamente
- [ ] Feedback toast aparece em todas ações
- [ ] Dados atualizam após CRUD operations
- [ ] Filtros aplicam corretamente
- [ ] Paginação funciona
- [ ] Export CSV gera arquivo correto

### Testes de Performance
- [ ] Tabelas com 1000+ items renderizam rápido
- [ ] Search com debounce não trava
- [ ] Modals abrem em < 100ms
- [ ] API calls têm loading states

### Testes de UX
- [ ] Mobile responsive
- [ ] Dark mode funciona em todos componentes
- [ ] Animações smooth
- [ ] Empty states informativos
- [ ] Error states claros

### Testes de Segurança
- [ ] Apenas admins podem acessar
- [ ] Confirmação em ações destrutivas
- [ ] Audit logs em todas operações críticas
- [ ] Inputs sanitizados

---

## 📊 MÉTRICAS DE SUCESSO

**Objetivos mensuráveis:**

1. **Funcionalidade:**
   - ✅ 100% dos endpoints backend implementados
   - ⚠️ 40% dos componentes UI implementados (target: 100%)
   - ❌ 0% dos novos botões implementados (target: 100%)

2. **Performance:**
   - Target: Todas páginas carregam em < 2s
   - Target: Modals abrem em < 100ms
   - Target: Search response < 300ms

3. **UX:**
   - Target: 0 cliques desnecessários para ações comuns
   - Target: Feedback visual em 100% das ações
   - Target: Mobile-friendly (100% das features)

4. **Compliance:**
   - Target: 100% das ações críticas com audit log
   - Target: Confirmação em 100% das ações destrutivas

---

## 📅 CRONOGRAMA SUGERIDO

### Sprint 1 (Prioridade Alta) - 8-10 horas
- Dia 1: Edit User (2h) + Delete User (2h)
- Dia 2: Edit Tenant (1.5h) + Audit Logs Tab (3h)
- Dia 3: Testes e refinamentos (1.5h)

### Sprint 2 (Prioridade Média) - 6-8 horas
- Dia 4: Export Tenants CSV (1h) + Disable/Enable User (3h)
- Dia 5: Advanced Filters (2h) + Testes (1h)

### Sprint 3 (Prioridade Baixa) - Opcional
- Conforme demanda e disponibilidade

---

## 🚀 QUICK START GUIDE

**Para começar a implementar agora:**

1. **Setup:**
   ```bash
   cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGA/investigaree
   npm run dev
   ```

2. **Abrir arquivo:**
   ```bash
   code src/app/dashboard/admin/page.tsx
   ```

3. **Importar componentes necessários:**
   ```tsx
   import { Pencil, Trash, FileText } from 'lucide-react';
   import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
   import { Alert, AlertDescription } from '@/components/ui/alert';
   import { updateUser, deleteUser, updateTenant, getAuditLogs } from '@/lib/admin-api';
   ```

4. **Começar com Task #1 (Edit User)**

---

## 📝 NOTAS IMPORTANTES

1. **Não quebrar funcionalidades existentes:**
   - Testar tudo que já funciona após cada mudança
   - Manter componentes existentes intactos

2. **Seguir padrões do projeto:**
   - Usar Shadcn UI components
   - Usar Tailwind classes existentes
   - Manter dark mode compatível
   - Usar toast (sonner) para feedback

3. **Código limpo:**
   - TypeScript strict
   - Componentes pequenos e reutilizáveis
   - Comentários em lógicas complexas
   - Nomear variáveis descritivamente

4. **Git commits:**
   - Commits pequenos e frequentes
   - Mensagens descritivas
   - Testar antes de commitar

---

## 🔗 ARQUIVOS RELACIONADOS

- `ADMIN_PANEL_RESEARCH_2025.md` - Documentação da pesquisa
- `src/app/dashboard/admin/page.tsx` - Main admin panel component
- `src/lib/admin-api.ts` - API functions
- `backend/workers/api/src/routes/admin.routes.ts` - Backend endpoints
- `backend/workers/database/schema.sql` - Database schema

---

## ✅ DONE CRITERIA

**Este TODO estará completo quando:**

- [x] Documento criado e revisado
- [ ] Todas tasks de prioridade ALTA concluídas
- [ ] Todas tasks testadas e funcionando
- [ ] Código commitado e pushed
- [ ] Documentação atualizada
- [ ] README atualizado com novas features
- [ ] Deploy realizado
- [ ] Stakeholders notificados

---

**Última atualização:** 11/12/2025
**Status:** 📋 TODO Completo - Pronto para Implementação
**Próxima ação:** Começar Task #1 - Edit User Button + Modal
