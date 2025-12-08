# 🎯 ROTEIRO AGENT 3 - FULL-STACK DEVELOPER

**Agent ID:** Agent 3
**Role:** Full-Stack Developer (Frontend Integration, Testes, Relatórios)
**Workspace:** `.agents/agent-3-fullstack/`
**Responsabilidade:** Conectar Frontend → Backend, Relatórios PDF, Testes E2E

---

## 📋 OBJETIVOS PRINCIPAIS

1. ✅ Conectar dashboard do frontend ao backend real (substituir mock)
2. ✅ Implementar sistema de relatórios PDF automatizados
3. ✅ Executar e manter 58 testes E2E passando
4. ✅ Melhorar UX do dashboard com dados reais
5. ✅ Sistema de alertas em tempo real
6. ✅ Export CSV aprimorado

---

## 🚀 SEMANA 1 - PREPARAÇÃO & INTEGRAÇÃO

### DIA 1 - PREPARAÇÃO FRONTEND (6-8 horas)

#### ✅ TAREFA 3.1: Refatorar Service Layer (CONCLUÍDO)

**Objetivo:** Preparar frontend para receber dados reais
**Status:** ✅ CONCLUÍDO - 2025-12-07
**Commit:** `[A3] Create API client service layer`

**Arquivo:** `investigaree/src/lib/api-client.ts` (novo arquivo)

```typescript
// Cliente HTTP genérico
class ApiClient {
  private baseUrl: string;
  private getAuthToken: () => Promise<string>;

  constructor(baseUrl: string, getAuthToken: () => Promise<string>) {
    this.baseUrl = baseUrl;
    this.getAuthToken = getAuthToken;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    const tenantCode = localStorage.getItem('currentTenant');

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'X-Tenant-Code': tenantCode || '',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Singleton instance
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br',
  async () => {
    const { auth } = await import('./firebase');
    const user = auth.currentUser;
    return user ? await user.getIdToken() : '';
  }
);
```

**Checklist:**
- [x] Criar api-client.ts
- [x] Implementar métodos HTTP (GET, POST, PATCH, DELETE)
- [x] Adicionar auth token automático
- [x] Adicionar tenant header
- [x] Error handling global
- [x] Retry logic com exponential backoff
- [x] Commit: `[A3] Create API client service layer`
- [x] Atualizar STATUS.md

---

#### ✅ TAREFA 3.2: Criar SERPRO Service (CONCLUÍDO)

**Status:** ✅ CONCLUÍDO - 2025-12-07
**Commit:** `[A3] Create SERPRO service layer`

**Arquivo:** `investigaree/src/lib/services/serpro.service.ts`

```typescript
import { apiClient } from '../api-client';
import type { CpfResponse, CnpjResponse, DividaAtivaResponse } from '../types/serpro.types';

export class SerproService {
  // CPF
  async consultarCpf(cpf: string): Promise<CpfResponse> {
    return apiClient.post<CpfResponse>('/api/serpro/cpf', { cpf });
  }

  // CNPJ - 3 endpoints
  async consultarCnpjBasica(cnpj: string): Promise<CnpjResponse> {
    return apiClient.post<CnpjResponse>('/api/serpro/cnpj/basica', { cnpj });
  }

  async consultarCnpjQsa(cnpj: string): Promise<CnpjResponse> {
    return apiClient.post<CnpjResponse>('/api/serpro/cnpj/qsa', { cnpj });
  }

  async consultarCnpjEmpresa(cnpj: string): Promise<CnpjResponse> {
    return apiClient.post<CnpjResponse>('/api/serpro/cnpj/empresa', { cnpj });
  }

  // Dívida Ativa
  async consultarDividaAtiva(ni: string): Promise<DividaAtivaResponse> {
    return apiClient.post<DividaAtivaResponse>('/api/serpro/divida-ativa', { ni });
  }

  // Renda
  async consultarRenda(cpf: string) {
    return apiClient.post('/api/serpro/renda', { cpf });
  }

  // Faturamento
  async consultarFaturamento(cnpj: string) {
    return apiClient.post('/api/serpro/faturamento', { cnpj });
  }

  // ... outros métodos conforme Agent 2 implementa
}

export const serproService = new SerproService();
```

**Checklist:**
- [x] Criar serpro.service.ts
- [x] Métodos para 10 APIs SERPRO (CPF, CNPJ, Dívida Ativa, etc.)
- [x] Criar types em `src/lib/types/serpro.types.ts`
- [x] Validação de inputs (CPF/CNPJ format)
- [x] Loading states
- [x] Commit: `[A3] Create SERPRO service layer`
- [x] Atualizar STATUS.md

---

#### ✅ TAREFA 3.3: Criar Admin Service (CONCLUÍDO)

**Status:** ✅ CONCLUÍDO - 2025-12-07
**Commit:** `[A3] Create admin service layer`

**Arquivo:** `investigaree/src/lib/services/admin.service.ts`

```typescript
import { apiClient } from '../api-client';
import type { AdminUser, Tenant, Alert, AuditLog } from '../types/admin.types';

export class AdminService {
  // Users
  async getUsers(): Promise<AdminUser[]> {
    const { users } = await apiClient.get<{ users: AdminUser[] }>('/api/admin/users');
    return users;
  }

  async createUser(userData: Partial<AdminUser>): Promise<AdminUser> {
    return apiClient.post<AdminUser>('/api/admin/users', userData);
  }

  async updateUser(userId: string, userData: Partial<AdminUser>): Promise<AdminUser> {
    return apiClient.patch<AdminUser>(`/api/admin/users/${userId}`, userData);
  }

  // Tenants
  async getTenants(): Promise<Tenant[]> {
    const { tenants } = await apiClient.get<{ tenants: Tenant[] }>('/api/admin/tenants');
    return tenants;
  }

  async createTenant(tenantData: Partial<Tenant>): Promise<Tenant> {
    return apiClient.post<Tenant>('/api/admin/tenants', tenantData);
  }

  async updateTenant(tenantCode: string, tenantData: Partial<Tenant>): Promise<Tenant> {
    return apiClient.patch<Tenant>(`/api/admin/tenants/${tenantCode}`, tenantData);
  }

  // Access control
  async grantAccess(userId: string, tenantCode: string, accessLevel: string): Promise<void> {
    return apiClient.post('/api/admin/grant-access', { userId, tenantCode, accessLevel });
  }

  async revokeAccess(userId: string, tenantCode: string): Promise<void> {
    return apiClient.delete(`/api/admin/revoke-access?userId=${userId}&tenantCode=${tenantCode}`);
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    const { alerts } = await apiClient.get<{ alerts: Alert[] }>('/api/admin/alerts');
    return alerts;
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    return apiClient.post(`/api/admin/alerts/${alertId}/read`, {});
  }

  async markAllAlertsAsRead(): Promise<void> {
    return apiClient.post('/api/admin/alerts/read-all', {});
  }

  // Audit logs
  async getAuditLogs(filters?: { userId?: string; action?: string }): Promise<AuditLog[]> {
    const query = new URLSearchParams(filters as any).toString();
    const { logs } = await apiClient.get<{ logs: AuditLog[] }>(`/api/admin/audit-logs?${query}`);
    return logs;
  }

  // Statistics
  async getStats() {
    return apiClient.get('/api/admin/stats');
  }
}

export const adminService = new AdminService();
```

**Checklist:**
- [x] Criar admin.service.ts
- [x] Implementar todos os métodos (users, tenants, alerts, logs, stats)
- [x] Criar/atualizar types em `src/lib/types/admin.types.ts`
- [x] Error handling específico
- [x] Commit: `[A3] Create admin service layer`
- [x] Atualizar STATUS.md

---

### DIA 2 - INTEGRAÇÃO DASHBOARD (8-10 horas)

#### ✅ TAREFA 3.4: Conectar Admin Panel ao Backend Real (CONCLUÍDO)

**Status:** ✅ CONCLUÍDO - 2025-12-07
**Commit:** `[A3] Connect admin panel to real backend API`

**Objetivo:** Substituir mock data por API calls reais

**Arquivo:** `investigaree/src/app/dashboard/admin/page.tsx`

**Mudanças:**
```typescript
// ANTES (mock):
import { getMockUsers, getMockTenants } from '@/lib/admin-api';

// DEPOIS (real):
import { adminService } from '@/lib/services/admin.service';

export default function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await adminService.getUsers();
        setUsers(userData);
      } catch (error) {
        console.error('Failed to load users:', error);
        toast.error('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ... resto do código
}
```

**Arquivos para atualizar:**
- `src/app/dashboard/admin/page.tsx`
- Todos os componentes em `src/components/dashboard/`

**Checklist:**
- [x] Substituir getMockUsers() por adminService.getUsers()
- [x] Substituir getMockTenants() por adminService.getTenants()
- [x] Adicionar loading states
- [x] Adicionar error handling com toast
- [x] Testar CRUD de users
- [x] Testar CRUD de tenants
- [x] Testar grant/revoke access
- [x] Commit: `[A3] Connect admin panel to real backend API`
- [x] Atualizar STATUS.md
- [x] **Postar em COORDINATION.md: Admin panel conectado ao backend!**

---

#### ✅ TAREFA 3.5: Conectar Dashboard Módulos ao Backend (6-8 horas)

**Módulos para conectar:**

1. **Funcionários** (`/dashboard/funcionarios`)
   - Consulta CPF via SERPRO
   - Salvar resultados no D1
   - Exibir histórico de consultas

2. **Óbitos** (`/dashboard/obitos`)
   - API SISOBITO (se disponível) ou mock
   - Verificação de CPF vs. base de óbitos

3. **Candidatos** (`/dashboard/candidatos`)
   - API TSE ou mock
   - Histórico de candidaturas

4. **Vínculos** (`/dashboard/vinculos`)
   - CNPJ via SERPRO (endpoint /empresa)
   - Exibir QSA com CPF desmascarado

**Exemplo - Funcionários:**

**Arquivo:** `investigaree/src/app/dashboard/funcionarios/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { serproService } from '@/lib/services/serpro.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function FuncionariosPage() {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleConsultar() {
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido');
      return;
    }

    setLoading(true);
    try {
      const data = await serproService.consultarCpf(cpf);
      setResult(data);
      toast.success('CPF consultado com sucesso');
    } catch (error) {
      toast.error('Erro ao consultar CPF');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Consulta de Funcionários</h1>

      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Digite o CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          maxLength={14}
        />
        <Button onClick={handleConsultar} disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar'}
        </Button>
      </div>

      {result && (
        <div className="bg-navy-900 p-6 rounded-lg">
          <h2 className="text-xl mb-4">Resultado da Consulta</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-gray-400">CPF:</dt>
              <dd className="font-mono">{result.ni}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Nome:</dt>
              <dd>{result.nome}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Nascimento:</dt>
              <dd>{result.nascimento}</dd>
            </div>
            <div>
              <dt className="text-gray-400">Situação:</dt>
              <dd>{result.situacao.descricao}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
```

**Checklist:**
- [ ] Atualizar página Funcionários
- [ ] Atualizar página Óbitos
- [ ] Atualizar página Candidatos
- [ ] Atualizar página Vínculos
- [ ] Adicionar loading states em todos
- [ ] Error handling em todos
- [ ] Success/error toasts
- [ ] Commit: `[A3] Connect dashboard modules to backend`
- [ ] Atualizar STATUS.md

---

### DIA 3 - SISTEMA DE RELATÓRIOS (8-10 horas)

#### ✅ TAREFA 3.6: Implementar PDF Report Generator

**Objetivo:** Relatórios PDF automatizados de due diligence

**Instalar dependências:**
```bash
cd investigaree
npm install jspdf jspdf-autotable
npm install -D @types/jspdf
```

**Arquivo:** `investigaree/src/lib/services/report.service.ts`

```typescript
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportData {
  investigacao: {
    id: string;
    tipo: string;
    dataInicio: string;
    responsavel: string;
  };
  pessoa: {
    nome: string;
    cpf: string;
    nascimento: string;
    situacaoCpf: string;
  };
  empresas?: Array<{
    cnpj: string;
    razaoSocial: string;
    participacao: string;
  }>;
  dividas?: Array<{
    tipo: string;
    valor: number;
    situacao: string;
  }>;
  processos?: Array<{
    numero: string;
    tipo: string;
    tribunal: string;
  }>;
  conclusoes: string[];
}

export class ReportService {
  generateDueDiligenceReport(data: ReportData): jsPDF {
    const doc = new jsPDF();
    let yPos = 20;

    // Header com logo
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue 500
    doc.text('INVESTIGAREE', 20, yPos);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Relatório de Due Diligence', 20, yPos + 7);

    yPos += 20;

    // Informações da Investigação
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('1. INFORMAÇÕES DA INVESTIGAÇÃO', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    const infoData = [
      ['ID da Investigação', data.investigacao.id],
      ['Tipo', data.investigacao.tipo],
      ['Data de Início', data.investigacao.dataInicio],
      ['Responsável', data.investigacao.responsavel]
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: infoData,
      theme: 'plain',
      styles: { cellPadding: 3 }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Dados da Pessoa
    doc.setFontSize(14);
    doc.text('2. DADOS CADASTRAIS', 20, yPos);
    yPos += 10;

    const pessoaData = [
      ['Nome Completo', data.pessoa.nome],
      ['CPF', data.pessoa.cpf],
      ['Data de Nascimento', data.pessoa.nascimento],
      ['Situação CPF', data.pessoa.situacaoCpf]
    ];

    autoTable(doc, {
      startY: yPos,
      body: pessoaData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Vínculos Empresariais
    if (data.empresas && data.empresas.length > 0) {
      doc.setFontSize(14);
      doc.text('3. VÍNCULOS EMPRESARIAIS', 20, yPos);
      yPos += 10;

      autoTable(doc, {
        startY: yPos,
        head: [['CNPJ', 'Razão Social', 'Participação']],
        body: data.empresas.map(e => [e.cnpj, e.razaoSocial, e.participacao]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Dívidas
    if (data.dividas && data.dividas.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text('4. DÍVIDAS E PENDÊNCIAS FISCAIS', 20, yPos);
      yPos += 10;

      autoTable(doc, {
        startY: yPos,
        head: [['Tipo', 'Valor', 'Situação']],
        body: data.dividas.map(d => [
          d.tipo,
          `R$ ${d.valor.toLocaleString('pt-BR')}`,
          d.situacao
        ]),
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68] } // Red for debts
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Processos Judiciais
    if (data.processos && data.processos.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text('5. PROCESSOS JUDICIAIS', 20, yPos);
      yPos += 10;

      autoTable(doc, {
        startY: yPos,
        head: [['Número', 'Tipo', 'Tribunal']],
        body: data.processos.map(p => [p.numero, p.tipo, p.tribunal]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Conclusões e Recomendações
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text('6. CONCLUSÕES E RECOMENDAÇÕES', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    data.conclusoes.forEach((conclusao, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${conclusao}`, 170);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 7;

      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Footer em todas as páginas
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount} | Gerado em ${new Date().toLocaleString('pt-BR')}`,
        20,
        290
      );
      doc.text('investigaree.com.br | Confidencial', 150, 290);
    }

    return doc;
  }

  async downloadReport(data: ReportData, filename: string) {
    const doc = this.generateDueDiligenceReport(data);
    doc.save(filename);
  }

  async previewReport(data: ReportData): Promise<string> {
    const doc = this.generateDueDiligenceReport(data);
    return doc.output('dataurlstring');
  }
}

export const reportService = new ReportService();
```

**Checklist:**
- [ ] Instalar jspdf + jspdf-autotable
- [ ] Criar report.service.ts
- [ ] Implementar generateDueDiligenceReport()
- [ ] Template com branding Investigaree
- [ ] Seções: Info, Cadastro, Empresas, Dívidas, Processos, Conclusões
- [ ] Footer com página e timestamp
- [ ] Métodos: download, preview
- [ ] Commit: `[A3] Implement PDF report generator`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 3.7: Integrar Relatórios no Dashboard (4-5 horas)

**Arquivo:** `investigaree/src/app/dashboard/relatorios/page.tsx`

**Funcionalidades:**
- Selecionar investigação
- Preview do PDF
- Download PDF
- Enviar por email (futuro)

**Checklist:**
- [ ] Criar página de relatórios
- [ ] Formulário de seleção de dados
- [ ] Preview PDF em iframe
- [ ] Botão de download
- [ ] Loading states
- [ ] Commit: `[A3] Add PDF reports to dashboard`
- [ ] Atualizar STATUS.md

---

### DIA 4-5 - TESTES E2E & REFINAMENTO (10-12 horas)

#### ✅ TAREFA 3.8: Atualizar Testes E2E para Backend Real

**Objetivo:** Modificar fixtures para usar API real em vez de mocks

**Aguardar:** Agent 1 completar Firebase Emulator setup

**Arquivo:** `investigaree/e2e/fixtures/auth.ts`

**Atualizar para:**
```typescript
import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login com Firebase Emulator
    await page.goto('http://localhost:3000/loginadmin');

    await page.fill('[name="email"]', 'admin@investigaree.com.br');
    await page.fill('[name="password"]', 'test123456');
    await page.click('button[type="submit"]');

    // Aguardar redirect para dashboard
    await page.waitForURL('**/dashboard/admin');

    await use(page);
  }
});
```

**Atualizar testes:**
- `e2e/admin/02-user-management.spec.ts`
- `e2e/admin/03-tenant-management.spec.ts`
- `e2e/admin/04-alerts-and-logs.spec.ts`
- `e2e/admin/05-metrics.spec.ts`

**Checklist:**
- [ ] Atualizar auth fixture para Firebase Emulator
- [ ] Remover mocks de API em todos os testes
- [ ] Adicionar seed data no D1 para testes
- [ ] Rodar todos os 58 testes: `npm run test:emulator`
- [ ] Corrigir testes quebrados
- [ ] Confirmar 58/58 passing
- [ ] Commit: `[A3] Update E2E tests to use real backend`
- [ ] Atualizar STATUS.md
- [ ] **Postar em COORDINATION.md: 58 testes E2E passando com backend real!**

---

#### ✅ TAREFA 3.9: Melhorar UX com Loading States (4-5 horas)

**Objetivo:** UX profissional durante carregamento de dados

**Componentes para adicionar:**

1. **Skeleton Loaders**

**Arquivo:** `investigaree/src/components/ui/skeleton.tsx`

```typescript
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-10 bg-navy-800 animate-pulse rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-navy-900 p-6 rounded-lg">
      <div className="h-6 bg-navy-800 animate-pulse rounded w-1/3 mb-4" />
      <div className="h-4 bg-navy-800 animate-pulse rounded w-2/3" />
    </div>
  );
}
```

2. **Progress Indicators**

**Uso:**
```typescript
{loading ? (
  <TableSkeleton rows={10} cols={5} />
) : (
  <DataTable data={users} columns={columns} />
)}
```

**Checklist:**
- [ ] Criar skeleton components
- [ ] Adicionar em todas as páginas de dashboard
- [ ] Progress bar para uploads
- [ ] Spinner para ações rápidas
- [ ] Toast notifications para feedback
- [ ] Commit: `[A3] Improve UX with loading states and skeletons`
- [ ] Atualizar STATUS.md

---

## 🚀 SEMANA 2-3 - FEATURES AVANÇADAS

### ✅ TAREFA 3.10: Sistema de Alertas em Tempo Real (6-8 horas)

**Objetivo:** Notificações quando dados mudam (ex: novo processo, mudança CPF)

**Estratégia:** Polling a cada 30 segundos no dashboard

**Arquivo:** `investigaree/src/hooks/useAlerts.ts`

```typescript
import { useEffect, useState } from 'use';
import { adminService } from '@/lib/services/admin.service';

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await adminService.getAlerts();
        setAlerts(data);
        setUnreadCount(data.filter(a => !a.read).length);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    }

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (alertId: string) => {
    await adminService.markAlertAsRead(alertId);
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
    setUnreadCount(prev => prev - 1);
  };

  return { alerts, unreadCount, markAsRead };
}
```

**Componente de notificação:**

**Arquivo:** `investigaree/src/components/dashboard/AlertDropdown.tsx`

**Checklist:**
- [ ] Criar useAlerts hook
- [ ] Criar AlertDropdown component
- [ ] Adicionar em TopNavBar
- [ ] Badge com contador de unread
- [ ] Marcar como lido ao clicar
- [ ] Commit: `[A3] Add real-time alerts system`
- [ ] Atualizar STATUS.md

---

### ✅ TAREFA 3.11: Export CSV Aprimorado (4-6 horas)

**Objetivo:** Export com mais formatos e opções

**Arquivo:** `investigaree/src/lib/services/export.service.ts`

```typescript
export class ExportService {
  exportToCSV(data: any[], filename: string) {
    // Adicionar BOM para UTF-8
    const BOM = '\uFEFF';
    const csvContent = this.arrayToCSV(data);
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, filename);
  }

  exportToExcel(data: any[], filename: string) {
    // Usar library como xlsx ou exceljs
  }

  exportToJSON(data: any[], filename: string) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    this.downloadBlob(blob, filename);
  }

  private arrayToCSV(data: any[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ];

    return csvRows.join('\n');
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();
```

**Checklist:**
- [ ] Criar export.service.ts
- [ ] CSV com BOM (UTF-8)
- [ ] Excel export (opcional)
- [ ] JSON export
- [ ] Adicionar em página /dashboard/exportar
- [ ] Seleção de colunas
- [ ] Filtros de data
- [ ] Commit: `[A3] Enhance CSV/Excel export functionality`
- [ ] Atualizar STATUS.md

---

### ✅ TAREFA 3.12: Batch Processing (6-8 horas)

**Objetivo:** Upload CSV com 100+ CPFs para consulta em lote

**Arquivo:** `investigaree/src/app/dashboard/funcionarios/batch/page.tsx`

**Funcionalidades:**
- Upload CSV
- Parse e validação
- Queue de processamento
- Progress bar em tempo real
- Download resultados

**Checklist:**
- [ ] Criar página de batch processing
- [ ] Upload CSV com validação
- [ ] Queue local (processar 1 por vez para evitar rate limit)
- [ ] Progress indicator
- [ ] Download resultados em CSV
- [ ] Commit: `[A3] Add batch processing for bulk CPF queries`
- [ ] Atualizar STATUS.md

---

## 🚀 SEMANA 4 - POLISH & TESTING

### ✅ TAREFA 3.13: Accessibility Audit (4-6 horas)

**Checklist:**
- [ ] Instalar axe-core: `npm install -D @axe-core/playwright`
- [ ] Adicionar testes de acessibilidade
- [ ] Corrigir issues de contraste
- [ ] Adicionar aria-labels faltantes
- [ ] Navegação por teclado
- [ ] Screen reader testing
- [ ] Commit: `[A3] Accessibility improvements`
- [ ] Atualizar STATUS.md

---

### ✅ TAREFA 3.14: Performance Optimization (4-6 horas)

**Checklist:**
- [ ] Lazy loading de componentes pesados
- [ ] Virtualized lists para tabelas grandes
- [ ] Memoization de computações caras
- [ ] Image optimization
- [ ] Code splitting
- [ ] Bundle analysis
- [ ] Commit: `[A3] Performance optimizations`
- [ ] Atualizar STATUS.md para DONE

---

## 📊 MÉTRICAS DE SUCESSO

- [ ] 100% dos módulos conectados ao backend real
- [ ] 58/58 testes E2E passando
- [ ] Relatórios PDF gerados com sucesso
- [ ] Export CSV funcionando perfeitamente
- [ ] Alertas em tempo real operacionais
- [ ] Lighthouse Accessibility score > 90
- [ ] Zero console errors em produção

---

## 🔗 DEPENDÊNCIAS

**Aguardando de outros agents:**
- Agent 1: Firebase Emulator configurado
- Agent 2: Backend API deployado e funcionando

**Fornecendo para outros agents:**
- Agent 1: Feedback sobre testes E2E
- Agent 2: Feedback sobre endpoints

---

## 📝 COMUNICAÇÃO

**Atualizar STATUS.md:**
- A cada módulo conectado
- A cada feature implementada
- No mínimo a cada 4 horas

**Postar em COORDINATION.md:**
- Ao conectar admin panel
- Ao completar integração de dashboard
- Quando 58 testes estiverem passando
- Ao completar relatórios PDF

---

## 🛠️ FERRAMENTAS & COMANDOS

**Setup:**
```bash
cd investigaree
npm install
```

**Desenvolvimento:**
```bash
npm run dev                    # Dev server
npm run build                  # Build
npm run test:e2e               # E2E tests
```

**Testes:**
```bash
npm run emulator               # Firebase emulator
npm run test:emulator          # Tests com emulator
```

---

## 📂 ARQUIVOS SOB RESPONSABILIDADE

**Exclusivos (apenas Agent 3):**
- `src/lib/services/**/*`
- `src/app/dashboard/**/*` (páginas)
- `src/components/dashboard/**/*`
- `e2e/**/*` (testes)

**Coordenados (comunicar antes de modificar):**
- `src/lib/api.ts`
- `src/lib/admin-api.ts` (deprecar após migração)

---

**Criado:** 2025-12-07
**Última atualização:** 2025-12-07 15:30
