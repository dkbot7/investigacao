# PLANO DE IMPLEMENTAÇÃO FRONTEND - COMPLIANCE (V2 REMODELADO)
**Data**: 2025-12-08
**Agent**: Agent 2 - Backend Engineer
**Baseado em**: Pesquisas oficiais atualizadas (2025)

---

## 📚 PESQUISAS REALIZADAS

### **1. APIs Oficiais de Compliance (2025)**

#### **Portal da Transparência - CGU**
- **URL Oficial**: https://portaldatransparencia.gov.br/api-de-dados
- **Catálogo**: https://www.gov.br/conecta/catalogo/apis/portal-da-transparencia-do-governo-federal
- **Bases disponíveis**: CEIS, CNEP, CEAF
- **Atualização**: Dados até 12/2025
- **Formato**: REST API com autenticação via chave API
- **Base URL**: `https://api.portaldatransparencia.gov.br/api-de-dados`
- **Headers necessários**: `chave-api-dados` (opcional para testes)

#### **OFAC SDN List**
- **URL Oficial**: https://ofac.treasury.gov/sanctions-list-service
- **Downloads**: https://sanctionslist.ofac.treas.gov/Home/SdnList
- **Formatos disponíveis**: XML (SDN.XML, SDN_ADVANCED.XML), CSV, Fixed-field
- **Padrão avançado**: XML conforme padrão UN-developed data standard
- **Nota**: Não há REST API JSON, mas os arquivos XML/CSV são atualizados diariamente

#### **Lista PEP - Brasil**
- **URL Oficial**: https://portaldatransparencia.gov.br/download-de-dados/pep
- **Dicionário de dados**: https://portaldatransparencia.gov.br/dicionario-de-dados/pep
- **Dados Abertos**: https://dados.gov.br/dados/conjuntos-dados/pessoas-expostas-politicamente
- **Formato**: CSV (download direto)
- **Campos**: CPF, Nome, Sigla Função, Descrição Função, Nível Função, Nome Órgão, Data Início, Data Fim, Fim Período Carência
- **Fontes**: TCU, Câmara Federal, Senado Federal, Ministério da Economia, CGU
- **Limitações**: Não contempla TODOS os PEPs (deve ser complementado)

### **2. Next.js 15 & React 19 (2025)**

#### **Arquitetura Moderna**
- **App Router**: Padrão recomendado (estável e futuro)
- **React Server Components (RSC)**: Adotado profundamente via App Router
- **Server Actions**: Funções async marcadas com `"use server"` - eliminam necessidade de API routes
- **Route Handlers**: Para APIs públicas, endpoints externos, CORS, múltiplos HTTP methods

#### **Quando usar cada abordagem**

**Server Actions** (preferir quando possível):
- ✅ Submit de formulários
- ✅ Atualização de dados sem criar nova API
- ✅ Lógica diretamente relacionada ao componente UI
- ✅ Reduz boilerplate e expõe menos endpoints

**Route Handlers** (usar quando necessário):
- ✅ Endpoints para sistemas externos/terceiros
- ✅ Múltiplos HTTP methods (GET, POST, PUT, DELETE)
- ✅ Headers, tokens, CORS
- ✅ Apps enterprise ou microservices
- ✅ Proxy/middleware para backend upstream

#### **Data Fetching 2025**
- Fetch direto em Server Components (sem endpoint público)
- `use()` Hook para streaming de dados async
- `revalidateTag()` para cache dinâmico
- Edge deployment para performance global

**Fontes**:
- [Next.js 15 in 2025: Features, Best Practices](https://javascript.plainenglish.io/next-js-15-in-2025-features-best-practices-and-why-its-still-the-framework-to-beat-a535c7338ca8)
- [Server Actions in Next.js: The Future of API Routes](https://medium.com/@sparklewebhelp/server-actions-in-next-js-the-future-of-api-routes-06e51b22a59f)
- [Next.js 15: App Router — Complete Senior-Level Guide](https://medium.com/@livenapps/next-js-15-app-router-a-complete-senior-level-guide-0554a2b820f7)

### **3. LGPD Frontend Compliance (2025)**

#### **Requisitos Legais**
- Consentimento deve ser: **livre, informado e inequívoco**
- Linguagem simples e cotidiana
- Revogação fácil, gratuita e acessível
- **Proibido**: checkboxes pré-marcadas, consentimento implícito
- **Obrigatório**: Documentação e logs de auditoria

#### **Consent Management Platforms (CMP) - Requisitos 2025**
- Suporte universal: GDPR, CCPA/CPRA, LGPD, POPIA
- Auto-descoberta de tecnologias de tracking
- Bloqueio de scripts não-essenciais até consentimento
- Performance: carregamento assíncrono, script mínimo, CDN
- Gestão de ciclo completo: consentimento → deleção
- Trilha de auditoria clara para reguladores

#### **Bibliotecas React Recomendadas**
1. **react-cookie-consent** (npm) - Simples e customizável
2. **react-cookie-law** - Granularidade GDPR/EU
3. **SlashID React SDK** - GDPRConsentDialog component
4. Integrações nativas LGPD específicas disponíveis

**Fontes**:
- [LGPD Compliance Checklist 2025](https://captaincompliance.com/education/lgpd-compliance-checklist/)
- [LGPD & Consent Guide for Executives](https://securiti.ai/infographics/lgpd-and-cookie-consent-compliance/)
- [GDPR Consent Management React](https://www.slashid.dev/blog/gdpr-consent-management-react/)

---

## 🏗️ ARQUITETURA ATUAL DO FRONTEND

### **Stack Tecnológico**
```json
{
  "next": "^16.0.8",
  "react": "^19.2.1",
  "react-dom": "^19.2.1",
  "typescript": "^5",
  "firebase": "^12.6.0",
  "@opennextjs/cloudflare": "^1.14.4"
}
```

### **Características**
- ✅ Next.js 16 (App Router)
- ✅ React 19 (RSC ready)
- ✅ TypeScript
- ✅ Cloudflare deployment (@opennextjs/cloudflare)
- ✅ Standalone output mode
- ✅ Turbopack enabled
- ✅ Performance optimizations configuradas

### **Padrão Atual**
- **Todas as páginas dashboard**: `"use client"` (20/20 arquivos)
- **Hook de dados**: `useDashboardData.ts` centralizado
- **API client**: `lib/api.ts` com Firebase auth
- **Dados mockados**: Desabilitados (segurança)

### **Oportunidade de Melhoria**
⚠️ **Usar Server Components + Server Actions** ao invés de client-side everywhere
- Reduz JS bundle
- Melhora SEO
- Melhor performance inicial
- Menos código exposto ao cliente

---

## 🎯 PLANO REMODELADO - ABORDAGEM MODERNA

### **FASE 1: INFRAESTRUTURA API (Server-First)**

#### **1.1. Criar Server Actions** (ao invés de Route Handlers tradicionais)

**Arquivo**: `investigaree/src/app/actions/compliance.ts`

```typescript
'use server'

import { auth } from '@/lib/firebase-admin' // Server-side Firebase
import { cookies } from 'next/headers'

// ============================================
// PEP ACTIONS
// ============================================

export async function verificarPEPAction(cpf: string) {
  // Autenticação server-side
  const sessionCookie = cookies().get('session')?.value
  if (!sessionCookie) throw new Error('Não autenticado')

  const decodedClaims = await auth.verifySessionCookie(sessionCookie)

  // Chamada direta ao backend API
  const response = await fetch(
    `${process.env.API_URL}/api/compliance/pep/verificar?cpf=${cpf}`,
    {
      headers: {
        'Authorization': `Bearer ${decodedClaims.token}`,
      },
    }
  )

  if (!response.ok) throw new Error('Erro ao verificar PEP')

  return response.json()
}

export async function buscarPEPPorNomeAction(nome: string) {
  // Similar ao acima
}

// ============================================
// SANÇÕES CGU ACTIONS
// ============================================

export async function verificarSancoesAction(documento: string) {
  const sessionCookie = cookies().get('session')?.value
  if (!sessionCookie) throw new Error('Não autenticado')

  const decodedClaims = await auth.verifySessionCookie(sessionCookie)

  const response = await fetch(
    `${process.env.API_URL}/api/compliance/cgu/consolidado?documento=${documento}`,
    {
      headers: {
        'Authorization': `Bearer ${decodedClaims.token}`,
      },
    }
  )

  if (!response.ok) throw new Error('Erro ao verificar sanções')

  return response.json()
}

// ============================================
// OFAC ACTIONS
// ============================================

export async function verificarOFACAction(nome: string, threshold = 70) {
  const sessionCookie = cookies().get('session')?.value
  if (!sessionCookie) throw new Error('Não autenticado')

  const decodedClaims = await auth.verifySessionCookie(sessionCookie)

  const response = await fetch(
    `${process.env.API_URL}/api/compliance/ofac/verificar?nome=${encodeURIComponent(nome)}&threshold=${threshold}`,
    {
      headers: {
        'Authorization': `Bearer ${decodedClaims.token}`,
      },
    }
  )

  if (!response.ok) throw new Error('Erro ao verificar OFAC')

  return response.json()
}

// ============================================
// LGPD ACTIONS
// ============================================

export async function criarSolicitacaoLGPDAction(data: {
  tipo_solicitacao: string
  email: string
  nome?: string
  cpf?: string
  descricao?: string
}) {
  const sessionCookie = cookies().get('session')?.value
  if (!sessionCookie) throw new Error('Não autenticado')

  const decodedClaims = await auth.verifySessionCookie(sessionCookie)

  const response = await fetch(
    `${process.env.API_URL}/api/lgpd/solicitacao`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${decodedClaims.token}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) throw new Error('Erro ao criar solicitação')

  return response.json()
}

export async function exportarDadosAction() {
  const sessionCookie = cookies().get('session')?.value
  if (!sessionCookie) throw new Error('Não autenticado')

  const decodedClaims = await auth.verifySessionCookie(sessionCookie)

  const response = await fetch(
    `${process.env.API_URL}/api/lgpd/exportar-dados`,
    {
      headers: {
        'Authorization': `Bearer ${decodedClaims.token}`,
      },
    }
  )

  if (!response.ok) throw new Error('Erro ao exportar dados')

  const blob = await response.blob()
  return Buffer.from(await blob.arrayBuffer())
}
```

**Vantagens desta abordagem**:
- ✅ Token de autenticação não exposto ao cliente
- ✅ Menos código JavaScript no bundle do cliente
- ✅ Melhor segurança (credenciais server-side)
- ✅ Pode fazer cache no servidor
- ✅ Menos boilerplate

#### **1.2. Criar Route Handlers apenas para endpoints públicos**

**Arquivo**: `investigaree/src/app/api/webhook/compliance/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

// Webhook para receber notificações de atualização de listas
export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-webhook-signature')

  // Validar signature
  // Processar webhook

  return NextResponse.json({ received: true })
}
```

**Usar Route Handlers apenas para**:
- Webhooks externos
- Endpoints públicos (se necessário)
- Integrações com terceiros

---

### **FASE 2: COMPONENTES SERVER-FIRST**

#### **2.1. Criar Server Components para Data Display**

**Arquivo**: `investigaree/src/app/dashboard/compliance/page.tsx`

```typescript
// NÃO usar "use client" - é Server Component por padrão
import { Suspense } from 'react'
import { ComplianceStats } from '@/components/compliance/ComplianceStats'
import { ComplianceSearch } from '@/components/compliance/ComplianceSearch'
import { Loading } from '@/components/ui/loading'

export default async function CompliancePage() {
  // Fetch direto no Server Component - sem endpoint público
  const stats = await fetch(
    `${process.env.API_URL}/api/compliance/stats`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
      next: { revalidate: 3600 }, // Cache 1 hora
    }
  ).then(res => res.json())

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-2xl font-bold">Compliance & Due Diligence</h1>

      {/* Server Component - renderiza no servidor */}
      <ComplianceStats stats={stats} />

      {/* Client Component - apenas onde necessário interatividade */}
      <Suspense fallback={<Loading />}>
        <ComplianceSearch />
      </Suspense>
    </div>
  )
}
```

#### **2.2. Client Components apenas onde necessário**

**Arquivo**: `investigaree/src/components/compliance/ComplianceSearch.tsx`

```typescript
'use client'

import { useState, useTransition } from 'react'
import { verificarPEPAction, verificarSancoesAction } from '@/app/actions/compliance'
import { Button } from '@/components/ui/button'

export function ComplianceSearch() {
  const [cpf, setCpf] = useState('')
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState(null)

  const handleSearch = () => {
    startTransition(async () => {
      const [pep, sancoes] = await Promise.all([
        verificarPEPAction(cpf),
        verificarSancoesAction(cpf),
      ])

      setResult({ pep, sancoes })
    })
  }

  return (
    <div>
      <input
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        placeholder="Digite o CPF..."
      />
      <Button onClick={handleSearch} disabled={isPending}>
        {isPending ? 'Verificando...' : 'Verificar'}
      </Button>

      {result && <ResultDisplay result={result} />}
    </div>
  )
}
```

---

### **FASE 3: LGPD CONSENT MANAGEMENT**

#### **3.1. Instalar biblioteca**

```bash
npm install react-cookie-consent
```

#### **3.2. Implementar Consent Banner**

**Arquivo**: `investigaree/src/components/lgpd/ConsentBanner.tsx`

```typescript
'use client'

import CookieConsent from 'react-cookie-consent'
import { useState, useEffect } from 'react'

export function LGPDConsentBanner() {
  const [showDetails, setShowDetails] = useState(false)

  const handleAccept = async () => {
    // Registrar consentimento no backend
    await fetch('/api/lgpd/registrar-consentimento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consentimento: true,
        finalidades: ['analytics', 'funcional'],
        timestamp: new Date().toISOString(),
      }),
    })
  }

  const handleDecline = async () => {
    // Registrar recusa
    await fetch('/api/lgpd/registrar-consentimento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consentimento: false,
        timestamp: new Date().toISOString(),
      }),
    })
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText="Aceitar"
      declineButtonText="Recusar"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      cookieName="lgpd_consent"
      style={{
        background: 'rgba(0, 0, 0, 0.9)',
        padding: '20px',
      }}
      buttonStyle={{
        background: '#4CAF50',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '4px',
      }}
      declineButtonStyle={{
        background: '#f44336',
        color: '#fff',
        fontSize: '14px',
        borderRadius: '4px',
      }}
    >
      <div>
        <h3 className="font-bold mb-2">Privacidade e Cookies (LGPD)</h3>
        <p className="text-sm mb-2">
          Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para
          melhorar sua experiência. Você pode escolher quais tipos de cookies deseja aceitar.
        </p>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-400 underline"
        >
          {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
        </button>

        {showDetails && (
          <div className="mt-3 text-xs space-y-2">
            <div>
              <strong>Cookies Essenciais:</strong> Necessários para autenticação e segurança.
            </div>
            <div>
              <strong>Cookies Analíticos:</strong> Nos ajudam a entender como você usa o site
              (Google Analytics).
            </div>
            <div>
              <strong>Seus Direitos (LGPD):</strong> Você pode acessar, corrigir ou solicitar
              a exclusão dos seus dados a qualquer momento em{' '}
              <a href="/dashboard/lgpd" className="text-blue-400 underline">
                Meus Dados (LGPD)
              </a>
            </div>
          </div>
        )}
      </div>
    </CookieConsent>
  )
}
```

#### **3.3. Adicionar ao Layout**

**Arquivo**: `investigaree/src/app/layout.tsx`

```typescript
import { LGPDConsentBanner } from '@/components/lgpd/ConsentBanner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <LGPDConsentBanner />
      </body>
    </html>
  )
}
```

---

### **FASE 4: PÁGINAS DE COMPLIANCE**

#### **4.1. Dashboard Compliance (Server Component)**

**Arquivo**: `investigaree/src/app/dashboard/compliance/page.tsx`

```typescript
import { Suspense } from 'react'
import { Shield, AlertTriangle } from 'lucide-react'
import { ComplianceSearch } from '@/components/compliance/ComplianceSearch'
import { ComplianceStats } from '@/components/compliance/ComplianceStats'

// Fetch direto no servidor
async function getComplianceData() {
  const res = await fetch(
    `${process.env.API_URL}/api/compliance/dashboard`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default async function CompliancePage() {
  const data = await getComplianceData()

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Shield className="w-7 h-7 text-blue-400" />
          Compliance & Due Diligence
        </h1>
        <p className="text-slate-600 dark:text-white/60 mt-1">
          Verificação de PEP, sanções (CEIS/CNEP) e listas internacionais (OFAC)
        </p>
      </div>

      {/* Stats - Server Component */}
      <ComplianceStats stats={data.stats} />

      {/* Search - Client Component */}
      <Suspense fallback={<div>Carregando busca...</div>}>
        <ComplianceSearch />
      </Suspense>
    </div>
  )
}
```

#### **4.2. Página LGPD (Client + Server mix)**

**Arquivo**: `investigaree/src/app/dashboard/lgpd/page.tsx`

```typescript
import { Suspense } from 'react'
import { MySolicitacoes } from '@/components/lgpd/MySolicitacoes'
import { QuickActions } from '@/components/lgpd/QuickActions'
import { Shield } from 'lucide-react'

export default function LGPDPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Shield className="w-7 h-7 text-blue-400" />
          Meus Dados (LGPD)
        </h1>
        <p className="text-slate-600 dark:text-white/60 mt-1">
          Gerencie seus dados pessoais e solicitações LGPD
        </p>
      </div>

      {/* Client Component */}
      <QuickActions />

      {/* Fetch e render no servidor */}
      <Suspense fallback={<div>Carregando solicitações...</div>}>
        <MySolicitacoes />
      </Suspense>
    </div>
  )
}
```

---

### **FASE 5: ATUALIZAR PÁGINAS EXISTENTES**

#### **5.1. Consulta CPF - Adicionar Compliance**

**Arquivo**: `investigaree/src/app/dashboard/consultas/cpf/page.tsx`

Adicionar ao componente existente:

```typescript
'use client'

import { verificarPEPAction, verificarSancoesAction } from '@/app/actions/compliance'
import { ComplianceBadge } from '@/components/compliance/ComplianceBadge'

// ... código existente ...

const handleConsultar = async (cpf: string) => {
  try {
    setLoading(true)

    // Consultas existentes + compliance em paralelo
    const [cpfData, pepResult, sancoesResult] = await Promise.all([
      consultarCPF(cpf),
      verificarPEPAction(cpf),
      verificarSancoesAction(cpf),
    ])

    setResults({
      ...cpfData,
      compliance: {
        pep: pepResult,
        sancoes: sancoesResult,
      }
    })
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}

// No JSX, adicionar:
{results.compliance?.pep.isPEP && (
  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-4">
    <div className="flex items-center justify-between">
      <h4 className="font-semibold text-red-400">
        ⚠️ Pessoa Exposta Politicamente (PEP)
      </h4>
      <ComplianceBadge nivelRisco={results.compliance.pep.nivel_risco} tipo="pep" />
    </div>
    <p className="text-sm mt-2">
      {results.compliance.pep.pep.cargo} - {results.compliance.pep.pep.orgao}
    </p>
  </div>
)}
```

---

## 📊 CHECKLIST DE IMPLEMENTAÇÃO REMODELADO

### **ALTA PRIORIDADE** (1-2 dias)
- [ ] Criar `app/actions/compliance.ts` com Server Actions
- [ ] Instalar `react-cookie-consent`
- [ ] Criar `components/lgpd/ConsentBanner.tsx`
- [ ] Adicionar ConsentBanner ao layout
- [ ] Criar `components/compliance/ComplianceBadge.tsx`
- [ ] Atualizar `dashboard/consultas/cpf/page.tsx` com compliance

### **MÉDIA PRIORIDADE** (2-3 dias)
- [ ] Criar `app/dashboard/compliance/page.tsx` (Server Component)
- [ ] Criar `components/compliance/ComplianceSearch.tsx` (Client)
- [ ] Criar `components/compliance/ComplianceStats.tsx` (Server)
- [ ] Criar `app/dashboard/lgpd/page.tsx`
- [ ] Criar `components/lgpd/QuickActions.tsx`
- [ ] Criar `components/lgpd/MySolicitacoes.tsx`

### **BAIXA PRIORIDADE** (1-2 dias)
- [ ] Atualizar `dashboard/ofac/page.tsx` (converter para Server Component)
- [ ] Atualizar `dashboard/sancionados/page.tsx` (converter para Server Component)
- [ ] Adicionar cards compliance no `dashboard/page.tsx`
- [ ] Testes e2e com Playwright

---

## ⏱️ ESTIMATIVAS ATUALIZADAS

| Fase | Tempo | Complexidade | Abordagem |
|------|-------|--------------|-----------|
| Server Actions | 4h | Média | Server-first |
| LGPD Consent | 2h | Baixa | Library pronta |
| Componentes | 4h | Média | Server + Client mix |
| Páginas Novas | 6h | Média | Server Components |
| Atualizar Existentes | 4h | Baixa | Incremental |
| Testes | 2h | Baixa | Playwright |
| **TOTAL** | **22h** | **Média** | **Moderna** |

---

## 🎯 DIFERENÇAS DA V1

| Aspecto | V1 (Original) | V2 (Remodelado) |
|---------|---------------|-----------------|
| API Layer | Route Handlers + client fetch | Server Actions |
| Componentes | Tudo "use client" | Server Components + Client islands |
| Auth | Firebase client-side | Firebase Admin server-side |
| Bundle Size | Maior (tudo no cliente) | Menor (server-first) |
| Segurança | Tokens expostos | Tokens server-only |
| Performance | Client-side fetch | Server-side fetch + streaming |
| SEO | Ruim (CSR) | Excelente (SSR) |
| Cache | Client-side | Server-side (Next.js) |
| Modernidade | Tradicional (2023) | Cutting-edge (2025) |

---

## 📚 FONTES OFICIAIS

### **APIs Governamentais**
- [Portal da Transparência - API de Dados](https://portaldatransparencia.gov.br/api-de-dados)
- [Catálogo de APIs Gov.br](https://www.gov.br/conecta/catalogo/apis/portal-da-transparencia-do-governo-federal)
- [Lista PEP Download](https://portaldatransparencia.gov.br/download-de-dados/pep)
- [OFAC Sanctions List Service](https://ofac.treasury.gov/sanctions-list-service)
- [Banco de Sanções CEIS/CNEP](https://www.gov.br/corregedorias/pt-br/institucional/sistemas-correcionais/banco-de-sancoes-ceis-cnep)

### **Next.js & React**
- [Next.js 15 in 2025: Features & Best Practices](https://javascript.plainenglish.io/next-js-15-in-2025-features-best-practices-and-why-its-still-the-framework-to-beat-a535c7338ca8)
- [Server Actions: The Future of API Routes](https://medium.com/@sparklewebhelp/server-actions-in-next-js-the-future-of-api-routes-06e51b22a59f)
- [Next.js 15 App Router Complete Guide](https://medium.com/@livenapps/next-js-15-app-router-a-complete-senior-level-guide-0554a2b820f7)
- [Next.js Best Practices 2025](https://www.raftlabs.com/blog/building-with-next-js-best-practices-and-benefits-for-performance-first-teams/)

### **LGPD Compliance**
- [LGPD Compliance Checklist 2025](https://captaincompliance.com/education/lgpd-compliance-checklist/)
- [LGPD & Consent Guide for Executives](https://securiti.ai/infographics/lgpd-and-cookie-consent-compliance/)
- [GDPR Consent Management React](https://www.slashid.dev/blog/gdpr-consent-management-react/)
- [Best Consent Management Platforms 2025](https://secureprivacy.ai/blog/best-consent-management-platforms-in-2025)

---

**Criado por**: Agent 2 - Backend Engineer
**Data**: 2025-12-08
**Versão**: 2.0 (Remodelado com pesquisas oficiais)
