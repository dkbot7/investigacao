# PESQUISA - BOAS PRÁTICAS ADMIN PANELS SAAS 2025

**Data da Pesquisa:** 11/12/2025
**Projeto:** Investigaree Admin Panel
**Objetivo:** Identificar funcionalidades essenciais faltando no admin panel e implementar conforme padrões da indústria

---

## 📊 FONTES OFICIAIS CONSULTADAS

### 1. Admin Dashboard Design Best Practices for SaaS Platforms
**Fonte:** [Medium - Rosalie (Oct 2025)](https://medium.com/@rosalie24/admin-dashboard-design-best-practices-for-saas-platforms-2f77e21b394b)

**Key Findings:**
- Real-time data display é essencial para dashboards modernos
- Métricas chave (KPIs): MRR, CAC, churn rate devem estar visíveis
- Elementos interativos: drill-down, filtros inteligentes, seletores de tempo dinâmicos
- Customização: permitir adicionar/remover/reorganizar widgets

### 2. Admin Dashboard UI/UX: Best Practices for 2025
**Fonte:** [Medium - Carlos Smith (2025)](https://medium.com/@CarlosSmith24/admin-dashboard-ui-ux-best-practices-for-2025-8bdc6090c57d)

**Key Findings:**
- Navegação lógica: agrupar features similares, ferramentas mais usadas facilmente acessíveis
- Design minimal e moderno com elementos visuais engajadores
- Performance: usuários esperam resposta em 2-3 segundos
- Progressive disclosure: mostrar apenas opções essenciais inicialmente

### 3. SaaS Dashboard Design Best Practices
**Fonte:** [Adam Fard Studio](https://adamfard.com/blog/saas-dashboard-design)

**Key Findings:**
- Mobile-first, design adaptativo é crucial
- Evitar enterrar features essenciais em múltiplas camadas de cliques
- Design claro que mantém usuários focados
- Collaboration tools embarcadas (comentários, tags, tasks)

### 4. How to Create a Good Admin Panel: Design Tips & Features List
**Fonte:** [Aspirity](https://aspirity.com/blog/good-admin-panel-design)

**Key Findings:**
- UI Components essenciais: botões, forms, tabelas, modals, alerts, notifications
- Navegação: navbars, sidebars, breadcrumbs, tabs
- Top bar: search, quick navigation buttons, user menu
- Features de gerenciamento de usuários são críticas

### 5. Top Dashboard Design Trends for SaaS Products in 2025
**Fonte:** [UITOP Design](https://uitop.design/blog/design/top-dashboard-design-trends/)

**Key Findings:**
- AI integration: dicas inteligentes e resumos contextuais
- Trends emergentes: dashboards conversacionais, micro-interactions
- Data visualization: gráficos interativos e dashboards customizáveis

### 6. User Management UI Components 2025
**Fonte:** [CoreUI](https://coreui.io/)

**Key Findings:**
- Component libraries modernas: compatíveis com React, Angular, Vue
- Componentes essenciais: buttons, forms, charts, tables
- Fully customizable e responsive
- User management específico: add, edit, view, export data, pagination

---

## 🎯 FUNCIONALIDADES ESSENCIAIS IDENTIFICADAS

### ✅ JÁ IMPLEMENTADO NO INVESTIGAREE

1. **Busca e Filtros**
   - ✅ Search bar para usuários
   - ✅ Filtro por tenant
   - ✅ Debounced search

2. **Visualização de Dados**
   - ✅ Cards com KPIs (Total Users, Active Tenants, Pending Users, Alerts)
   - ✅ Tabelas responsivas (desktop + mobile views)
   - ✅ Paginação com seletor de items por página

3. **Gerenciamento de Acesso**
   - ✅ Grant Access (conceder acesso usuário → tenant)
   - ✅ Revoke Access (revogar acesso)
   - ✅ Visualização de roles (admin, editor, viewer)

4. **Exportação**
   - ✅ Export Users CSV

5. **Alertas**
   - ✅ Sistema de alertas com unread count
   - ✅ Mark as read individual
   - ✅ Mark all as read

6. **UI/UX**
   - ✅ Dark mode
   - ✅ Hover states e animações (Framer Motion)
   - ✅ Responsive design
   - ✅ Loading states

---

## ❌ FUNCIONALIDADES FALTANDO (IDENTIFICADAS NA PESQUISA)

### 1. AÇÕES DE GERENCIAMENTO DE USUÁRIOS

#### 1.1 Edit User
**Status:** ⚠️ Backend implementado / Frontend pendente

**O que falta:**
- Botão "Edit" em cada linha da tabela de usuários
- Modal para editar nome e telefone
- Validação de formulário
- Feedback visual de sucesso/erro

**Endpoint criado:**
```
PATCH /api/admin/users/:id
Body: { name: string, phone: string }
```

**Função API criada:**
```typescript
updateUser(userId: string, data: { name: string; phone: string })
```

#### 1.2 Delete User
**Status:** ⚠️ Backend implementado / Frontend pendente

**O que falta:**
- Botão "Delete" em cada linha da tabela
- Modal de confirmação com warning
- Feedback de sucesso após deleção
- Atualização da lista após deleção

**Endpoint criado:**
```
DELETE /api/admin/users/:id
```

**Função API criada:**
```typescript
deleteUser(userId: string)
```

**Boas práticas:**
- Sempre pedir confirmação dupla
- Mostrar consequências (ex: "Todos os acessos serão removidos")
- Log de auditoria automático

#### 1.3 Disable/Enable User
**Status:** ❌ Não implementado

**O que precisa:**
- Campo `disabled` na tabela `users` do banco D1
- Toggle switch em cada linha
- Endpoint PATCH para atualizar status
- Visual indicator de usuário desabilitado (ex: opacity reduzida)

**Sugestão de implementação:**
```sql
ALTER TABLE users ADD COLUMN disabled INTEGER DEFAULT 0;
```

```
PATCH /api/admin/users/:id/status
Body: { disabled: boolean }
```

---

### 2. AÇÕES DE GERENCIAMENTO DE TENANTS

#### 2.1 Edit Tenant
**Status:** ⚠️ Backend implementado / Frontend pendente

**O que falta:**
- Botão "Edit" na seção de tenants
- Modal para editar nome e status
- Seletor de status (active, suspended, inactive)
- Feedback visual

**Endpoint criado:**
```
PATCH /api/admin/tenants/:code
Body: { name: string, status: string }
```

**Função API criada:**
```typescript
updateTenant(tenantCode: string, data: { name: string; status: string })
```

#### 2.2 Suspend/Activate Tenant
**Status:** ⚠️ Endpoint existe / UI pendente

**O que falta:**
- Toggle ou botão de ação rápida
- Status badge visual (active = green, suspended = red)
- Confirmação ao suspender (afeta todos os usuários)

**Usando endpoint existente:**
```typescript
updateTenant(code, { name, status: 'suspended' })
updateTenant(code, { name, status: 'active' })
```

#### 2.3 Export Tenants CSV
**Status:** ❌ Não implementado

**O que precisa:**
- Botão "Export CSV" na seção de tenants
- Função similar ao export users
- Colunas: code, name, status, created_at, user_count

**Sugestão de implementação:**
```typescript
function exportTenantsCSV() {
  const headers = ['Código', 'Nome', 'Status', 'Criado em', 'Usuários'];
  const rows = tenants.map(t => [
    t.code,
    t.name,
    t.status,
    new Date(t.created_at).toLocaleDateString('pt-BR'),
    t.user_count
  ]);
  // ... criar CSV e download
}
```

---

### 3. AUDIT LOGS (LOGS DE AUDITORIA)

#### 3.1 View Audit Logs
**Status:** ⚠️ Backend implementado / Frontend pendente

**O que falta:**
- Nova tab "Logs de Auditoria"
- Tabela com filtros:
  - Por usuário
  - Por ação (create, update, delete, grant, revoke)
  - Por tipo de entidade (user, tenant, alert)
  - Por data
- Paginação
- Export CSV de logs

**Endpoint criado:**
```
GET /api/admin/audit-logs?userId=&action=&entityType=&limit=&offset=
```

**Função API criada:**
```typescript
getAuditLogs(filters?: {
  userId?: string;
  action?: string;
  entityType?: string;
  limit?: number;
  offset?: number;
})
```

**Dados retornados:**
```typescript
{
  id: number;
  user_id: string;
  user_email: string;
  user_name: string;
  action: string; // create, update, delete, grant, revoke
  entity_type: string; // user, tenant, alert
  entity_id: string;
  metadata: string; // JSON
  ip_address: string;
  user_agent: string;
  created_at: string;
}
```

**Sugestão de UI:**
```tsx
<div className="audit-logs-tab">
  <div className="filters">
    <select name="action">
      <option value="">Todas as ações</option>
      <option value="create">Create</option>
      <option value="update">Update</option>
      <option value="delete">Delete</option>
      <option value="grant">Grant Access</option>
      <option value="revoke">Revoke Access</option>
    </select>

    <select name="entityType">
      <option value="">Todos os tipos</option>
      <option value="user">User</option>
      <option value="tenant">Tenant</option>
      <option value="alert">Alert</option>
    </select>

    <input type="date" name="startDate" />
    <input type="date" name="endDate" />
  </div>

  <table>
    <thead>
      <tr>
        <th>Data/Hora</th>
        <th>Usuário</th>
        <th>Ação</th>
        <th>Tipo</th>
        <th>Entidade</th>
        <th>Detalhes</th>
      </tr>
    </thead>
    <tbody>
      {logs.map(log => (
        <tr key={log.id}>
          <td>{formatDateTime(log.created_at)}</td>
          <td>{log.user_name} ({log.user_email})</td>
          <td><Badge>{log.action}</Badge></td>
          <td>{log.entity_type}</td>
          <td>{log.entity_id}</td>
          <td><ViewDetailsButton metadata={log.metadata} /></td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

### 4. BULK ACTIONS (AÇÕES EM MASSA)

**Status:** ❌ Não implementado

**O que precisa:**
- Checkbox selection em cada linha
- "Select All" checkbox no header
- Action bar quando items selecionados:
  - Bulk Grant Access
  - Bulk Delete
  - Bulk Export

**Boas práticas da pesquisa:**
- Mostrar contador: "3 items selecionados"
- Botão "Clear selection"
- Confirmação antes de ações destrutivas

**Exemplo de implementação:**
```tsx
const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

function handleBulkDelete() {
  if (confirm(`Deletar ${selectedUsers.length} usuários?`)) {
    Promise.all(selectedUsers.map(id => deleteUser(id)))
      .then(() => {
        toast.success('Usuários deletados');
        setSelectedUsers([]);
        loadData();
      });
  }
}
```

---

### 5. REAL-TIME FEATURES

**Status:** ❌ Não implementado

**Sugestões da pesquisa:**
- Auto-refresh de dados a cada X segundos
- WebSocket para notificações em tempo real
- Indicador "Atualizado há X minutos"
- Botão manual "Refresh"

**Já temos:** Botão "Atualizar" ✅

**Pode adicionar:**
- Auto-refresh opcional (toggle)
- Timestamp de última atualização
- Loading skeleton durante refresh

---

### 6. ADVANCED SEARCH & FILTERS

**Status:** ⚠️ Parcialmente implementado

**O que temos:**
- ✅ Search por email, nome, tenant

**O que falta:**
- Filtro por role (admin, editor, viewer)
- Filtro por status (active, pending)
- Filtro por data de criação
- Filtro por último acesso
- Save/Load search presets

**Sugestão:**
```tsx
<div className="advanced-filters">
  <select name="role">
    <option value="">Todos os roles</option>
    <option value="admin">Admin</option>
    <option value="editor">Editor</option>
    <option value="viewer">Viewer</option>
  </select>

  <select name="lastAccess">
    <option value="">Qualquer acesso</option>
    <option value="1h">Última hora</option>
    <option value="24h">Últimas 24h</option>
    <option value="7d">Últimos 7 dias</option>
    <option value="30d">Últimos 30 dias</option>
    <option value="never">Nunca acessou</option>
  </select>

  <button onClick={saveFilter}>💾 Salvar filtro</button>
  <button onClick={loadFilter}>📂 Carregar filtro</button>
</div>
```

---

### 7. NOTIFICATIONS & ALERTS ENHANCEMENTS

**O que temos:**
- ✅ Sistema de alertas básico
- ✅ Mark as read

**Sugestões da pesquisa:**
- Priority levels (low, medium, high, critical)
- Categorização (system, security, usage, update)
- Notification preferences (email, in-app, push)
- Alert history (não apenas não lidos)
- Search em alertas

---

### 8. DASHBOARD WIDGETS (TRENDS DA PESQUISA)

**Widgets sugeridos:**

1. **User Growth Chart**
   - Gráfico de crescimento de usuários por mês
   - Line chart ou bar chart

2. **Tenant Activity Heatmap**
   - Mapa de calor de atividade por tenant
   - Identifica tenants mais/menos ativos

3. **Top Users by Activity**
   - Ranking de usuários mais ativos
   - Baseado em audit logs

4. **System Health**
   - Uptime
   - Response time médio
   - Errors rate

**Bibliotecas recomendadas:**
- Recharts (já usado no projeto)
- Chart.js
- Victory Charts

---

### 9. MOBILE OPTIMIZATION

**O que temos:**
- ✅ Responsive tables
- ✅ Mobile views

**Pode melhorar:**
- Swipe actions em mobile (swipe left = delete, swipe right = edit)
- Bottom sheet modals em vez de center modals
- Sticky headers em tabelas longas
- Pull-to-refresh

---

### 10. ACCESSIBILITY (A11Y)

**Checklist da pesquisa:**
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] ARIA labels em todos os botões
- [ ] Screen reader support
- [ ] Color contrast mínimo 4.5:1
- [ ] Focus indicators visíveis
- [ ] Alt text em ícones

---

## 🚀 ENDPOINTS BACKEND IMPLEMENTADOS

### User Management
```
✅ GET    /api/admin/users              - Lista todos usuários
✅ GET    /api/admin/users/:id          - Busca usuário por ID
✅ PATCH  /api/admin/users/:id          - Atualiza usuário (nome, phone)
✅ DELETE /api/admin/users/:id          - Deleta usuário permanentemente
✅ GET    /api/admin/pending-users      - Lista usuários sem acesso
```

### Tenant Management
```
✅ GET    /api/admin/tenants            - Lista todos tenants
✅ POST   /api/admin/tenants            - Cria novo tenant
✅ PATCH  /api/admin/tenants/:code      - Atualiza tenant (nome, status)
```

### Access Control
```
✅ POST   /api/admin/grant-access       - Concede acesso user → tenant
✅ DELETE /api/admin/revoke-access      - Revoga acesso
```

### Statistics
```
✅ GET    /api/admin/stats              - Estatísticas gerais do sistema
```

### Alerts
```
✅ GET    /api/admin/alerts             - Lista alertas
✅ POST   /api/admin/alerts/:id/read    - Marca alerta como lido
✅ POST   /api/admin/alerts/read-all    - Marca todos como lidos
```

### Audit Logs
```
✅ GET    /api/admin/audit-logs         - Lista logs de auditoria com filtros
```

---

## 📋 FUNÇÕES API FRONTEND CRIADAS

Arquivo: `src/lib/admin-api.ts`

```typescript
✅ getAdminUsers(): Promise<{ users: AdminUser[] }>
✅ getAdminTenants(): Promise<{ tenants: AdminTenant[] }>
✅ getPendingUsers(): Promise<{ pending_users: PendingUser[] }>
✅ createTenant(data: { code: string; name: string })
✅ grantAccess(data: { user_email, tenant_code, role })
✅ revokeAccess(data: { user_email, tenant_code })
✅ getAdminAlerts(showRead?: boolean)
✅ markAlertAsRead(alertId: string)
✅ markAllAlertsAsRead()
✅ getAdminStats(): Promise<AdminStats>

🆕 updateUser(userId: string, data: { name: string; phone: string })
🆕 deleteUser(userId: string)
🆕 updateTenant(tenantCode: string, data: { name: string; status: string })
🆕 getAuditLogs(filters?: { userId, action, entityType, limit, offset })
```

---

## 🎨 UI COMPONENTS SUGERIDOS

### Modal Components Necessários

1. **EditUserModal**
```tsx
interface EditUserModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await updateUser(user.id, { name, phone });
      toast.success('Usuário atualizado!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Email (não editável)</Label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

2. **DeleteUserConfirmModal**
```tsx
function DeleteUserConfirmModal({ user, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  async function handleDelete() {
    if (confirmText !== user.email) {
      toast.error('Digite o email corretamente para confirmar');
      return;
    }

    setLoading(true);
    try {
      await deleteUser(user.id);
      toast.success('Usuário deletado!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao deletar usuário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-500">⚠️ Deletar Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              Esta ação é IRREVERSÍVEL. Todos os acessos deste usuário serão removidos.
            </AlertDescription>
          </Alert>

          <div>
            <p className="mb-2">Usuário: <strong>{user.name || user.email}</strong></p>
            <p className="mb-2">Email: <strong>{user.email}</strong></p>
            <p className="mb-4">Tenants com acesso: <strong>{user.tenants.length}</strong></p>
          </div>

          <div>
            <Label>Digite o email do usuário para confirmar:</Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={user.email}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || confirmText !== user.email}
          >
            {loading ? 'Deletando...' : 'Deletar Permanentemente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

3. **EditTenantModal**
```tsx
function EditTenantModal({ tenant, isOpen, onClose, onSuccess }) {
  const [name, setName] = useState(tenant.name);
  const [status, setStatus] = useState(tenant.status);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await updateTenant(tenant.code, { name, status });
      toast.success('Tenant atualizado!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar tenant');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tenant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Código (não editável)</Label>
            <Input value={tenant.code} disabled />
          </div>
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="active">Ativo</option>
              <option value="suspended">Suspenso</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 📊 DEPLOYMENT STATUS

**Backend:**
- ✅ Deployed to: `api.investigaree.com.br`
- ✅ Version ID: `954c2f74-3284-429b-86f2-c0d723664fbd`
- ✅ Deploy Date: 11/12/2025
- ✅ Status: Operational

**Frontend:**
- ⚠️ API functions created, UI components pending
- ⚠️ Localhost running: `http://localhost:3000`

---

## 🎯 PRIORIZAÇÃO DE IMPLEMENTAÇÃO

### 🔴 Alta Prioridade (Crítico para operação)
1. **Edit User Button + Modal** - Funcionalidade básica de gerenciamento
2. **Delete User Button + Confirmation** - Gerenciamento de ciclo de vida
3. **Audit Logs Tab** - Compliance e rastreabilidade
4. **Edit Tenant Button + Modal** - Gerenciamento de tenants

### 🟡 Média Prioridade (Melhora UX)
5. **Export Tenants CSV** - Paridade com export users
6. **Advanced Filters** - Melhor busca e descoberta
7. **Disable/Enable User Toggle** - Soft delete vs hard delete

### 🟢 Baixa Prioridade (Nice to have)
8. **Bulk Actions** - Eficiência em operações em massa
9. **Real-time Auto-refresh** - Dados sempre atualizados
10. **Dashboard Widgets** - Visualizações avançadas
11. **Mobile Swipe Actions** - Melhor UX mobile
12. **Accessibility Enhancements** - WCAG compliance

---

## 📝 NOTAS DE IMPLEMENTAÇÃO

### Padrões de Código
- Usar Shadcn UI components (Dialog, Button, Input, Label, Alert)
- Usar Framer Motion para animações
- Usar React Hook Form para formulários complexos
- Usar Zod para validação
- Usar toast (sonner) para feedbacks

### Segurança
- ✅ Todos endpoints requerem authentication (authMiddleware)
- ✅ Audit logs automáticos em todas operações críticas
- ⚠️ Considerar adicionar role-based access (admin only para certas ações)
- ⚠️ Rate limiting em operações destrutivas

### Performance
- Paginação server-side para audit logs (já implementado)
- Debounce em searches (já implementado)
- Lazy loading de modals
- Otimistic UI updates quando possível

---

## 📚 REFERÊNCIAS

1. [Medium - Admin Dashboard Design Best Practices for SaaS Platforms](https://medium.com/@rosalie24/admin-dashboard-design-best-practices-for-saas-platforms-2f77e21b394b)
2. [Medium - Admin Dashboard UI/UX: Best Practices for 2025](https://medium.com/@CarlosSmith24/admin-dashboard-ui-ux-best-practices-for-2025-8bdc6090c57d)
3. [Adam Fard - SaaS Dashboard Design: Best Practices](https://adamfard.com/blog/saas-dashboard-design)
4. [Aspirity - How to Create a Good Admin Panel](https://aspirity.com/blog/good-admin-panel-design)
5. [UITOP - Top Dashboard Design Trends for SaaS Products in 2025](https://uitop.design/blog/design/top-dashboard-design-trends/)
6. [CoreUI - UI Components Libraries](https://coreui.io/)
7. [TailAdmin - Free Tailwind CSS Admin Dashboard Template](https://tailadmin.com/)
8. [MUI - Free React Dashboard Templates 2025](https://mui.com/store/collections/free-react-dashboard/)

---

**Documento criado por:** Claude Sonnet 4.5 (Agent 1)
**Última atualização:** 11/12/2025
**Status:** ✅ Research Complete | ⚠️ Implementation In Progress
