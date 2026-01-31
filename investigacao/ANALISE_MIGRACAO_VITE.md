# Análise de Migração: Next.js → Vite

**Data**: 2026-01-31
**Projeto**: Investigaree
**Framework Atual**: Next.js 15.1.9 App Router
**Framework Destino**: Vite + React Router

---

## 📊 RESUMO EXECUTIVO

### Arquivos a Migrar

| Categoria | Quantidade | Complexidade |
|-----------|-----------|--------------|
| **Páginas (page.tsx)** | 54 | 🟡 Média |
| **Layouts (layout.tsx)** | 7 | 🟡 Média |
| **API Routes (route.ts)** | 8 | 🔴 Alta |
| **Componentes React** | 121 | 🟢 Baixa |
| **Arquivos "use client"** | 122 | 🟢 Baixa |
| **Imports next/image** | 15 | 🟡 Média |
| **Imports next/link** | 51 | 🟡 Média |
| **Hooks de navegação** | 33 | 🟡 Média |

**TOTAL**: ~264 arquivos TypeScript/TSX precisam ser revisados

---

## 🚨 PONTOS CRÍTICOS

### 1. API Routes (8 arquivos) - REQUER BACKEND SEPARADO

Estes arquivos **NÃO FUNCIONARÃO** no Vite e precisam virar um backend Node.js separado:

```
src/app/api/compliance/stats/route.ts
src/app/api/investigations/route.ts
src/app/api/investigations/stats/route.ts
src/app/api/leads/subscribe/route.ts
src/app/api/lgpd/registrar-consentimento/route.ts
src/app/api/lgpd/stats/route.ts
src/app/api/tenants/info/route.ts
src/app/api/userdata/info/route.ts
```

**Soluções**:
- ✅ **Recomendado**: Criar backend Express.js separado
- ⚠️ **Alternativa**: Usar Firebase Functions ou Cloudflare Workers
- ❌ **Não recomendado**: Mover lógica para cliente (inseguro)

---

### 2. Estrutura de Rotas (54 páginas)

Next.js App Router usa **file-based routing** (`page.tsx`):
```
src/app/dashboard/investigacoes/page.tsx → /dashboard/investigacoes
```

Vite precisa de **React Router manual**:
```tsx
// src/App.tsx
<Route path="/dashboard/investigacoes" element={<Investigacoes />} />
```

**Trabalho necessário**: Criar manualmente 54+ rotas no React Router

---

### 3. Layouts Aninhados (7 layouts)

Next.js usa `layout.tsx` para layouts compartilhados:
```
src/app/layout.tsx → root layout
src/app/dashboard/layout.tsx → dashboard layout
```

Vite precisa de **componentes Outlet**:
```tsx
// DashboardLayout.tsx
<DashboardSidebar>
  <Outlet /> {/* filhos renderizam aqui */}
</DashboardSidebar>
```

**Trabalho necessário**: Reestruturar 7 layouts para usar `<Outlet>`

---

### 4. Imports Next.js Específicos

#### next/image (15 ocorrências)
```tsx
// ANTES (Next.js)
import Image from 'next/image'
<Image src="/logo.svg" width={40} height={40} alt="Logo" />

// DEPOIS (Vite)
<img src="/logo.svg" width="40" height="40" alt="Logo" />
```

#### next/link (51 ocorrências)
```tsx
// ANTES (Next.js)
import Link from 'next/link'
<Link href="/sobre">Sobre</Link>

// DEPOIS (Vite + React Router)
import { Link } from 'react-router-dom'
<Link to="/sobre">Sobre</Link>
```

#### Hooks de navegação (33 ocorrências)
```tsx
// ANTES (Next.js)
import { useRouter, usePathname } from 'next/navigation'
const router = useRouter()
const pathname = usePathname()

// DEPOIS (React Router)
import { useNavigate, useLocation } from 'react-router-dom'
const navigate = useNavigate()
const location = useLocation()
```

---

## 📋 CHECKLIST DE MIGRAÇÃO

### Fase 1: Preparação (1-2 dias)
- [ ] Criar novo projeto Vite + React + TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Configurar path aliases (`@/components`)
- [ ] Instalar React Router DOM v6
- [ ] Migrar dependências do package.json

### Fase 2: Backend (2-3 dias)
- [ ] Criar projeto Express.js separado para API routes
- [ ] Migrar 8 API routes para Express endpoints
- [ ] Configurar CORS e autenticação
- [ ] Testar endpoints localmente
- [ ] Deploy backend (Heroku/Railway/Cloudflare Workers)

### Fase 3: Componentes (3-4 dias)
- [ ] Copiar 121 componentes de src/components
- [ ] Substituir 15 `next/image` por `<img>`
- [ ] Substituir 51 `next/link` por `react-router-dom`
- [ ] Substituir 33 hooks de navegação
- [ ] Remover 122 diretivas `"use client"` (não necessárias no Vite)

### Fase 4: Páginas e Rotas (4-5 dias)
- [ ] Criar src/pages/ e migrar 54 páginas
- [ ] Criar src/App.tsx com React Router
- [ ] Definir 54+ rotas manualmente
- [ ] Migrar 7 layouts para usar `<Outlet>`
- [ ] Configurar rotas aninhadas (dashboard/*)

### Fase 5: Configuração (1-2 dias)
- [ ] Configurar vite.config.ts
- [ ] Configurar proxy para API backend
- [ ] Migrar variáveis de ambiente (.env)
- [ ] Configurar build otimizado
- [ ] Configurar preview/produção

### Fase 6: Testes e Deploy (2-3 dias)
- [ ] Testar todas as 54 páginas
- [ ] Verificar 8 API endpoints
- [ ] Testar autenticação e Firebase
- [ ] Build de produção
- [ ] Deploy (Vercel/Netlify/Cloudflare Pages)

---

## ⏱️ ESTIMATIVA DE TEMPO

| Fase | Duração | Risco |
|------|---------|-------|
| Preparação | 1-2 dias | 🟢 Baixo |
| Backend | 2-3 dias | 🔴 Alto |
| Componentes | 3-4 dias | 🟡 Médio |
| Páginas e Rotas | 4-5 dias | 🔴 Alto |
| Configuração | 1-2 dias | 🟡 Médio |
| Testes e Deploy | 2-3 dias | 🔴 Alto |

**TOTAL**: 13-19 dias úteis (2-4 semanas de trabalho)

---

## 💰 CUSTO vs BENEFÍCIO

### Custos da Migração
- ⏱️ **15-20 dias** de desenvolvimento
- 🐛 **Alto risco** de bugs durante migração
- 🔧 **Backend adicional** necessário (Express.js)
- 📚 **Curva de aprendizado** React Router
- 💸 **Custo de hospedagem** backend separado

### Benefícios do Vite
- ⚡ **HMR mais rápido** (Hot Module Replacement)
- 📦 **Build mais rápido** que Next.js
- 🎯 **Controle total** sobre rotas
- 💰 **Menor custo** de hospedagem frontend (estático)

### Benefícios do Next.js (mantendo atual)
- 🚀 **Zero configuração** de rotas
- 🔐 **API Routes integrados** (sem backend separado)
- 📄 **SSR/SSG nativo** (SEO melhor)
- 🖼️ **Image optimization** automática
- 📦 **Deploy integrado** Vercel/Cloudflare

---

## 🤔 RECOMENDAÇÃO

### ❌ NÃO MIGRAR AGORA

**Motivos**:
1. **Erro atual é RESOLVÍVEL**: O erro "Cannot find module './7627.js'" é um problema de cache do Next.js que pode ser resolvido em **5 minutos** com:
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Migração muito custosa**: 15-20 dias de trabalho para benefícios marginais

3. **Risco alto de regressão**: Projeto funcional pode quebrar durante migração

4. **Backend adicional necessário**: API Routes precisam virar servidor Express separado

### ✅ RESOLVER ERRO ATUAL

1. Limpar cache Next.js: `rm -rf .next`
2. Rebuild: `npm run build`
3. Testar localhost: `npm run dev`
4. Se persistir, investigar dependências ou módulos corrompidos

### 🔮 QUANDO CONSIDERAR MIGRAÇÃO

Migrar para Vite faz sentido SE:
- ✅ Você precisa de **controle total** sobre bundling
- ✅ Não precisa de **SSR/SSG** (site totalmente client-side)
- ✅ Tem tempo para **2-4 semanas** de migração
- ✅ Já tem **backend separado** pronto

---

## 📝 CONCLUSÃO

**Situação atual**: Erro de build Next.js (cache corrompido)
**Solução rápida**: Limpar .next e rebuild (5 min)
**Solução proposta**: Migrar para Vite (15-20 dias)

**Recomendação**: 🚫 **NÃO MIGRAR**. Resolver erro Next.js primeiro.

Se depois de resolver o erro você ainda quiser migrar, este documento serve como **roadmap completo** para a migração.

---

## 📞 PRÓXIMAS AÇÕES

1. **IMEDIATO**: Resolver erro Next.js (limpar cache)
2. **CURTO PRAZO**: Commit e deploy mudanças atuais (logo + funcionário→sócio)
3. **LONGO PRAZO**: Reavaliar necessidade de Vite após projeto estabilizado
