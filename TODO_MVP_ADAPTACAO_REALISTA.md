# 📋 TODO MVP - ADAPTAÇÃO REALISTA (4 SEMANAS)

**PROJETO:** Investigação 2.0 - Reposicionamento Político
**ESTRATÉGIA:** Adaptar código existente (NÃO recriar do zero)
**VERSÃO:** MVP 1.0 Adaptação
**TIMELINE:** 4 semanas (160 horas)
**PÁGINAS:** 7 novas + 3 adaptadas = 10 páginas
**DATA INÍCIO:** 20/01/2026
**DATA ENTREGA:** 14/02/2026

---

## 🎯 ESTRATÉGIA: APROVEITAR O QUE JÁ EXISTE

### ✅ O QUE JÁ TEMOS (NÃO RECRIAR)

**Infraestrutura (100% pronta):**
- ✅ Next.js 16 + React 19 + TypeScript 5
- ✅ Tailwind CSS 4 configurado
- ✅ 22 componentes Shadcn UI prontos (Button, Card, Badge, Input, Dialog, etc)
- ✅ Dark mode com next-themes funcionando
- ✅ Firebase Auth configurado
- ✅ Deploy Cloudflare Pages configurado
- ✅ Google Analytics integrado
- ✅ Design system colorblind-friendly (Okabe-Ito)

**Componentes de Layout (100% prontos):**
- ✅ Header com navegação (22KB, responsivo)
- ✅ Footer (4.7KB)
- ✅ WhatsApp Widget/Button/Modal
- ✅ Cookie Banner (LGPD)
- ✅ Toast notifications (Sonner)
- ✅ Loading states, Empty states, Skeletons

**Páginas Base (aproveitáveis):**
- ✅ Homepage (460 linhas) - ADAPTAR conteúdo
- ✅ `/servicos` (632 linhas) - ADAPTAR para serviços políticos
- ✅ `/dashboard` (865 linhas) - ADAPTAR labels
- ✅ `/contato` - MANTER
- ✅ `/about`, `/quemsomos` - ADAPTAR
- ✅ Páginas legais (privacidade, termos, cookies) - MANTER
- ✅ Blog com MDX - ADICIONAR posts políticos

**Backend/API (80% pronto):**
- ✅ 13 API routes funcionando
- ✅ Firebase Auth + Realtime DB
- ✅ SERPRO configurado (precisa integrar)
- ✅ OpenAI integrado
- ✅ Cloudflare Workers backend (Hono)
- ✅ Nodemailer configurado
- ✅ Stripe configurado (falta integrar)

**Hooks/Contextos (prontos):**
- ✅ 20+ custom hooks (useAuth, useTenant, useDashboardData, etc)
- ✅ AuthContext, MockAuthContext

---

## 📊 RESUMO EXECUTIVO

| Métrica | Valor |
|---------|-------|
| **Total de Tarefas** | 28 (vs. 40 do plano from-scratch) |
| **Semanas** | 4 (vs. 6) |
| **Horas Estimadas** | 160h (vs. 240h) |
| **Economia de Esforço** | 80h (33%) |
| **Páginas Novas** | 7 |
| **Páginas Adaptadas** | 3 |
| **Componentes Reaproveitados** | 22 |
| **Investimento** | R$ 0 (tudo já configurado) |

---

## 📅 SEMANA 1: ADAPTAÇÃO DE CONTEÚDO (5 dias, 40h)

### DIA 1 - Adaptar Homepage (8h)

#### ✅ TAREFA 1.1: Adaptar Hero Section
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 3h
**Arquivo:** `investigacao/src/app/page.tsx` (linhas 1-100)

**O QUE MUDAR:**
- ❌ Remover: "Due Diligence Forense e Proteção Reputacional"
- ✅ Adicionar: "Vetting de Candidatos e Compliance Político"
- ❌ Remover: "5.950 pessoas e empresas auditadas"
- ✅ Adicionar: "200+ campanhas analisadas"
- ❌ Remover: "Aponte sua câmera para um QR Code" (muito B2C)
- ✅ Adicionar: "Relatório completo em 48h garantidas"

**Código (adaptar seção existente):**
```tsx
// ANTES (linha ~15-40):
<h1 className="text-4xl md:text-6xl font-bold mb-6">
  Proteja Sua Reputação com{' '}
  <span className="text-primary">Due Diligence Forense</span>
</h1>
<p className="text-lg md:text-xl text-muted-foreground mb-8">
  Investigação digital, varredura reputacional e remoção emergencial...
</p>

// DEPOIS:
<h1 className="text-4xl md:text-6xl font-bold mb-6">
  Vença Eleições com Candidatos{' '}
  <span className="text-primary">100% Verificados</span>
</h1>
<p className="text-lg md:text-xl text-muted-foreground mb-8">
  Vetting completo de candidatos em 48h. Verificação judicial, financeira e reputacional. Conformidade Lei da Ficha Limpa e TSE garantida.
</p>
```

**Aceite:**
- [ ] Hero adaptado para político
- [ ] Badge: "Conformidade Lei da Ficha Limpa" (não "ISO 27001")
- [ ] CTA principal: "Começar Verificação" (não "Agendar Análise")
- [ ] Social proof: "200+ campanhas" (não "5.950 auditados")
- [ ] Sem QR code (remover)

---

#### ✅ TAREFA 1.2: Adaptar Seção de Serviços
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 3h
**Arquivo:** `investigacao/src/app/page.tsx` (seção ProtectionAreas ou ServicePortals)

**O QUE MUDAR:**

**ANTES (4 serviços forenses):**
1. Remoção Emergencial
2. Varredura Reputacional
3. Monitoramento Contínuo
4. Investigação Digital

**DEPOIS (4 serviços políticos):**
1. **Vetting de Candidatos**
   - Ícone: Shield
   - Descrição: "Verificação completa: judicial, financeira, reputacional. Ficha Limpa garantida."
   - Link: `/servicos/vetting-candidatos`

2. **Triagem de Doadores**
   - Ícone: Users
   - Descrição: "Valide doadores em tempo real. Evite multas TSE. Conformidade automática."
   - Link: `/servicos/triagem-doadores`

3. **Pesquisa de Oposição**
   - Ícone: FileSearch
   - Descrição: "Antecipe ataques. Prepare contra-argumentos. Dentro dos limites legais."
   - Link: `/servicos/pesquisa-oposicao`

4. **Monitoramento TSE**
   - Ícone: TrendingUp
   - Descrição: "Alertas automáticos de mudanças judiciais. Proteção 24/7 durante a campanha."
   - Link: `/servicos/monitoramento`

**Aceite:**
- [ ] 4 cards atualizados
- [ ] Ícones trocados (usar lucide-react)
- [ ] Links apontam para novas páginas
- [ ] Mantém estrutura grid responsiva

---

#### ✅ TAREFA 1.3: Adaptar Stats/Social Proof
**Prioridade:** 🟡 ALTA
**Tempo:** 2h
**Arquivo:** `investigacao/src/app/page.tsx` (seção de números/stats)

**ANTES:**
- 5.950 pessoas auditadas
- 99.2% satisfação
- 24/7 monitoramento

**DEPOIS:**
- **463.367** candidatos em 2024 (municípios)
- **336** consultorias políticas (mercado)
- **48h** entrega garantida
- **200+** campanhas analisadas
- **R$ 4,9bi** gastos eleitorais 2024

**Aceite:**
- [ ] Stats adaptados para contexto político
- [ ] Números atualizados (do ANALISE_MERCADO.md)
- [ ] Fonte: TSE, dados oficiais

---

### DIA 2 - Adaptar Página de Serviços (8h)

#### ✅ TAREFA 2.1: Reescrever `/servicos`
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h
**Arquivo:** `investigacao/src/app/servicos/page.tsx` (632 linhas)

**ESTRATÉGIA:**
- Manter estrutura (Hero + Grid de serviços + FAQ)
- Substituir conteúdo forense por político

**SERVIÇOS ANTIGOS (remover):**
1. Varredura Reputacional Digital
2. Investigação de Vínculos Criminais
3. Análise de Mídias Sociais
4. Verificação de Background
5. Monitoramento de Dark Web
6. Auditoria de Compliance
7. Due Diligence Corporativa
8. Proteção de Executivos

**SERVIÇOS NOVOS (adicionar):**
1. **Vetting de Candidatos** (Core)
2. **Triagem de Doadores**
3. **Pesquisa de Oposição**
4. **Monitoramento TSE**
5. **Análise de Chapas**
6. **Compliance LGPD Político**

**Aceite:**
- [ ] Hero adaptado
- [ ] 6 cards de serviços (vs. 8 antigos)
- [ ] Cada card: Ícone + Título + Descrição + CTA
- [ ] FAQ reescrito (12 perguntas sobre política)
- [ ] Pricing: "A partir de R$ 2.500" (não "R$ 500")

---

#### ✅ TAREFA 2.2: Atualizar FAQ
**Prioridade:** 🟡 ALTA
**Tempo:** 2h
**Arquivo:** `investigacao/src/app/servicos/page.tsx` (seção FAQ)

**12 PERGUNTAS POLÍTICAS:**
1. O que é vetting de candidatos?
2. Quanto tempo leva uma verificação completa?
3. O vetting garante conformidade com Lei da Ficha Limpa?
4. Quais documentos preciso fornecer?
5. Como funciona a triagem de doadores?
6. A pesquisa de oposição é legal?
7. Posso monitorar adversários?
8. Quais bancos de dados vocês consultam?
9. O relatório pode ser usado no TSE?
10. Quanto custa o vetting?
11. Vocês trabalham com que tipo de campanha?
12. Como garantem sigilo (LGPD)?

**Aceite:**
- [ ] FAQ adaptado para político
- [ ] Accordion component mantido (já existe)
- [ ] Respostas técnicas mas acessíveis

---

### DIA 3 - Adaptar Dashboard (8h)

#### ✅ TAREFA 3.1: Adaptar Labels do Dashboard
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 4h
**Arquivo:** `investigacao/src/app/dashboard/page.tsx` (865 linhas)

**MUDANÇAS DE LABELS:**

**ANTES → DEPOIS:**
- "Investigações" → "Candidatos Verificados"
- "Consultas realizadas" → "Verificações em andamento"
- "Alertas de risco" → "Alertas TSE"
- "Beneficiários" → "Doadores triados"
- "Sancionados" → "Inelegíveis" (manter, mas adaptar)
- "OFAC" → "TSE Sancionados"

**Cards Dashboard:**
```tsx
// ADAPTAR stats do topo (linha ~50-100)
<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium">
      Candidatos Verificados
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">142</div>
    <p className="text-xs text-muted-foreground">
      +12% vs. mês anterior
    </p>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium">
      Em Verificação
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">8</div>
    <p className="text-xs text-muted-foreground">
      Entrega em 24-48h
    </p>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium">
      Alertas TSE
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-destructive">3</div>
    <p className="text-xs text-muted-foreground">
      Inelegibilidades detectadas
    </p>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium">
      Doadores Triados
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">1.247</div>
    <p className="text-xs text-muted-foreground">
      100% conformes TSE
    </p>
  </CardContent>
</Card>
```

**Aceite:**
- [ ] 4 cards de stats adaptados
- [ ] Labels em português político
- [ ] Ícones apropriados
- [ ] Mock data realista

---

#### ✅ TAREFA 3.2: Adaptar Navegação Lateral
**Prioridade:** 🟡 ALTA
**Tempo:** 2h
**Arquivo:** `investigacao/src/components/...` (sidebar navigation)

**ANTES:**
- Dashboard
- Investigações
- Consultas (CPF/CNPJ)
- Beneficiários
- Sancionados
- OFAC
- Óbitos
- Compliance
- LGPD
- Relatórios
- Exportar
- API Keys
- Configurações

**DEPOIS:**
- Dashboard
- **Candidatos** (era Investigações)
- **Doadores** (era Beneficiários)
- **TSE Sancionados** (era OFAC)
- Consultas (CPF/CNPJ) - MANTER
- Compliance
- LGPD
- Relatórios
- Exportar
- API Keys
- Configurações

**Aceite:**
- [ ] 11 itens menu (vs. 13)
- [ ] Labels adaptados
- [ ] Ícones atualizados
- [ ] Rotas funcionando

---

#### ✅ TAREFA 3.3: Criar Mock Data Política
**Prioridade:** 🟡 ALTA
**Tempo:** 2h
**Arquivo:** CRIAR `investigacao/src/data/mock-candidatos.ts`

```typescript
export interface Candidato {
  id: string
  nome: string
  cpf: string
  cargo: 'vereador' | 'prefeito' | 'deputado_estadual' | 'deputado_federal' | 'senador' | 'governador'
  partido: string
  estado: string
  municipio?: string
  status: 'verificado' | 'em_analise' | 'pendente' | 'inelegivel'
  fichaLimpa: boolean
  alertas: number
  dataVerificacao?: Date
  dataEntrega?: Date
  relatorioUrl?: string
}

export const mockCandidatos: Candidato[] = [
  {
    id: '1',
    nome: 'João Silva Santos',
    cpf: '123.456.789-00',
    cargo: 'vereador',
    partido: 'PARTIDO-01',
    estado: 'SP',
    municipio: 'São Paulo',
    status: 'verificado',
    fichaLimpa: true,
    alertas: 0,
    dataVerificacao: new Date('2026-01-15'),
    relatorioUrl: '/relatorios/candidato-1.pdf',
  },
  {
    id: '2',
    nome: 'Maria Oliveira Costa',
    cpf: '987.654.321-00',
    cargo: 'prefeito',
    partido: 'PARTIDO-02',
    estado: 'RJ',
    municipio: 'Rio de Janeiro',
    status: 'inelegivel',
    fichaLimpa: false,
    alertas: 3,
    dataVerificacao: new Date('2026-01-14'),
    relatorioUrl: '/relatorios/candidato-2.pdf',
  },
  {
    id: '3',
    nome: 'Carlos Pereira Lima',
    cpf: '456.789.123-00',
    cargo: 'deputado_estadual',
    partido: 'PARTIDO-03',
    estado: 'MG',
    status: 'em_analise',
    fichaLimpa: true,
    alertas: 1,
    dataVerificacao: new Date('2026-01-17'),
  },
  // ... mais 7 candidatos mock
]

export const mockDoadores = [
  {
    id: '1',
    nome: 'Empresa ABC Ltda',
    cnpj: '12.345.678/0001-00',
    valor: 50000,
    data: new Date('2026-01-10'),
    status: 'aprovado',
    tse72h: true,
  },
  // ... mais doadores
]
```

**Aceite:**
- [ ] Arquivo criado
- [ ] 10+ candidatos mock
- [ ] 10+ doadores mock
- [ ] TypeScript types corretos
- [ ] Dados realistas

---

### DIA 4-5 - Adaptar Header/Footer + Criar Navegação (16h)

#### ✅ TAREFA 4.1: Adaptar Header Navigation
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 4h
**Arquivo:** `investigacao/src/components/Header.tsx` (22KB)

**NAVEGAÇÃO ATUAL:**
```
- Início
- Serviços (dropdown)
- Sobre (dropdown: Quem Somos, Metodologia, Casos)
- Recursos (dropdown: Blog, Glossário, FAQ)
- Contato
```

**NAVEGAÇÃO NOVA:**
```
- Início
- Soluções (dropdown NOVO):
  ├─ Para Campanhas
  ├─ Para Partidos
  ├─ Para Consultorias
  └─ Para Lobbying

- Serviços (dropdown adaptado):
  ├─ Vetting de Candidatos
  ├─ Triagem de Doadores
  ├─ Pesquisa de Oposição
  └─ Monitoramento TSE

- Recursos (dropdown adaptado):
  ├─ Guia Lei Ficha Limpa (NOVO)
  ├─ Guia Compliance TSE (NOVO)
  ├─ Blog
  └─ FAQ

- Preços (NOVO)
- Contato
```

**Código (adaptar seção existente no Header):**
```tsx
// ADICIONAR dropdown "Soluções"
<DropdownMenu>
  <DropdownMenuTrigger className="flex items-center gap-1">
    Soluções <ChevronDown className="w-4 h-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem asChild>
      <Link href="/solucoes/campanhas">
        <Target className="w-4 h-4 mr-2" />
        Para Campanhas
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href="/solucoes/partidos">
        <Building className="w-4 h-4 mr-2" />
        Para Partidos
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href="/solucoes/consultorias">
        <Users className="w-4 h-4 mr-2" />
        Para Consultorias
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link href="/solucoes/lobbying">
        <Briefcase className="w-4 h-4 mr-2" />
        Para Lobbying
      </Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Aceite:**
- [ ] Dropdown "Soluções" adicionado
- [ ] Dropdown "Serviços" atualizado (4 itens)
- [ ] Dropdown "Recursos" atualizado (4 itens)
- [ ] Link "Preços" adicionado
- [ ] Mobile hamburger funciona
- [ ] Desktop dropdowns funcionam

---

#### ✅ TAREFA 4.2: Adaptar Footer
**Prioridade:** 🟢 MÉDIA
**Tempo:** 2h
**Arquivo:** `investigacao/src/components/Footer.tsx` (4.7KB)

**MUDANÇAS:**
- Coluna "Soluções": Adicionar 4 links (Campanhas, Partidos, Consultorias, Lobbying)
- Coluna "Serviços": Atualizar para 4 serviços políticos
- Coluna "Recursos": Adicionar Guias (Ficha Limpa, TSE)
- Copyright: "TSE & LGPD compliant" (adicionar)

**Aceite:**
- [ ] 4 colunas desktop mantidas
- [ ] 1 coluna mobile mantida
- [ ] Links atualizados
- [ ] Copyright adaptado

---

#### ✅ TAREFA 4.3: Criar Componente "Badge Compliance"
**Prioridade:** 🟢 MÉDIA
**Tempo:** 2h
**Arquivo:** CRIAR `investigacao/src/components/ComplianceBadges.tsx`

```tsx
import { Badge } from '@/components/ui/badge'
import { Shield, Scale, Lock, CheckCircle } from 'lucide-react'

export function ComplianceBadges() {
  const badges = [
    {
      icon: Shield,
      label: 'Lei Ficha Limpa',
      color: 'bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-300'
    },
    {
      icon: Scale,
      label: 'TSE Compliant',
      color: 'bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300'
    },
    {
      icon: Lock,
      label: 'LGPD Certificado',
      color: 'bg-purple-100 text-purple-900 dark:bg-purple-900/20 dark:text-purple-300'
    },
    {
      icon: CheckCircle,
      label: 'Auditoria Externa',
      color: 'bg-orange-100 text-orange-900 dark:bg-orange-900/20 dark:text-orange-300'
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className={`flex items-center gap-2 p-4 rounded-lg border ${badge.color}`}
        >
          <badge.icon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{badge.label}</span>
        </div>
      ))}
    </div>
  )
}
```

**Aceite:**
- [ ] Componente criado
- [ ] 4 badges compliance
- [ ] Grid responsivo (2 cols mobile, 4 cols desktop)
- [ ] Dark mode funciona

---

## 📅 SEMANA 2: CRIAR 7 PÁGINAS NOVAS (5 dias, 40h)

### ✅ TAREFA 5.1: Criar `/solucoes/campanhas`
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h
**Arquivo:** CRIAR `investigacao/src/app/solucoes/campanhas/page.tsx`

**ESTRUTURA:**
1. Hero (Badge + Título + Subtítulo + CTAs)
2. Problema/Urgência (Stats TSE)
3. Como Funciona (Timeline 5 passos)
4. Pacotes de Preço (3 tiers)
5. Cases de Sucesso (3 cards)
6. FAQ (10 perguntas)
7. CTA Final

**APROVEITAR:**
- ✅ Componentes: Card, Badge, Button (já existem)
- ✅ Layout responsivo (já funciona)
- ✅ Dark mode (já funciona)

**Código base:**
```tsx
import { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Target, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ComplianceBadges } from '@/components/ComplianceBadges'

export const metadata: Metadata = {
  title: 'Soluções para Campanhas Políticas | Investigação 2.0',
  description: 'Vetting completo de candidatos, triagem de doadores e compliance TSE. Solução integrada para campanhas vencedoras.',
}

export default function CampanhasPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="default" className="mb-4">
              <Target className="w-3 h-3 mr-1.5" />
              Solução para Campanhas Políticas
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vença com Candidatos Verificados e Compliance Total
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Do pré-lançamento à prestação de contas, oferecemos vetting completo, triagem de doadores e pesquisa de oposição. Tudo em conformidade com TSE e Lei da Ficha Limpa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contato">
                  Solicitar Proposta <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/servicos/vetting-candidatos">Ver Serviços</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problema + Urgência */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Um Candidato Inelegível Pode Derrubar Toda a Chapa
            </h2>
            <p className="text-lg text-muted-foreground">
              Lei da Ficha Limpa: 8 anos de inelegibilidade. TSE cassa chapas inteiras. Sua campanha não pode arriscar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-destructive/50">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-destructive mb-2">8 anos</div>
                <p className="text-sm text-muted-foreground">De inelegibilidade (Lei da Ficha Limpa)</p>
              </CardContent>
            </Card>

            <Card className="border-warning/50">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-warning mb-2">463.367</div>
                <p className="text-sm text-muted-foreground">Candidatos em 2024 (municípios)</p>
              </CardContent>
            </Card>

            <Card className="border-primary/50">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">72h</div>
                <p className="text-sm text-muted-foreground">Prazo TSE para reportar doações</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Como Funciona */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Como Funciona Nossa Solução
          </h2>

          {/* Timeline aqui - usar componente existente ou criar simples */}
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="py-16">
        <div className="container">
          <ComplianceBadges />
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para Candidatos 100% Verificados?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Comece sua verificação hoje. Relatório completo em 48h.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contato">
                Começar Agora <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
```

**Aceite:**
- [ ] Página funciona em 375px
- [ ] Hero mobile-first
- [ ] Stats grid responsivo
- [ ] CTAs funcionam
- [ ] SEO metadata correto

---

### ✅ TAREFA 5.2: Criar `/servicos/vetting-candidatos`
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h
**Arquivo:** CRIAR `investigacao/src/app/servicos/vetting-candidatos/page.tsx`

**ESTRUTURA:**
1. Hero
2. O Que Verificamos (Accordion mobile, Grid desktop)
3. 3 Pacotes (Básico R$ 2.500, Completo R$ 5.000, Urgente R$ 10.000)
4. Processo em 5 Passos
5. FAQ
6. CTA

**APROVEITAR:**
- ✅ Accordion component (já existe em ui/)
- ✅ Card, Badge, Button (já existem)
- ✅ Pricing grid pattern (da página atual)

**Aceite:**
- [ ] Accordion funciona touch (mobile)
- [ ] 3 pacotes responsivos
- [ ] FAQ funcionando
- [ ] CTA sticky mobile (opcional)

---

### ✅ TAREFA 5.3: Criar `/servicos/triagem-doadores`
**Prioridade:** 🟡 ALTA
**Tempo:** 4h
**Arquivo:** CRIAR `investigacao/src/app/servicos/triagem-doadores/page.tsx`

**ESTRUTURA (mais simples):**
1. Hero
2. Problema (Multas TSE, prazo 72h)
3. Solução (Triagem automática)
4. Preços (Plano mensal: R$ 1.500/mês)
5. FAQ
6. CTA

**Aceite:**
- [ ] Página completa
- [ ] Pricing mensal (vs. único)
- [ ] FAQ 8 perguntas

---

### ✅ TAREFA 5.4: Criar `/precos`
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h
**Arquivo:** CRIAR `investigacao/src/app/precos/page.tsx`

**ESTRUTURA:**
1. Hero
2. Tabs por Público (Campanhas, Partidos, Consultorias) - scroll horizontal mobile
3. Tabela Comparação 3 Tiers
4. Serviços Avulsos (lista simples)
5. FAQ Preços
6. CTA "Dúvidas?"

**APROVEITAR:**
- ✅ Tabs component (já existe em ui/)
- ✅ Card pricing pattern

**Aceite:**
- [ ] Tabs scroll horizontal mobile
- [ ] 3 tiers comparação
- [ ] Preços transparentes
- [ ] CTA conversão

---

### ✅ TAREFA 5.5: Criar `/recursos/ficha-limpa`
**Prioridade:** 🟢 MÉDIA
**Tempo:** 4h
**Arquivo:** CRIAR `investigacao/src/app/recursos/ficha-limpa/page.tsx`

**ESTRUTURA (Guia Educacional):**
1. Hero "Guia Completo Lei Ficha Limpa"
2. TOC (Table of Contents) - sticky sidebar desktop, collapse mobile
3. Conteúdo (Markdown ou MDX)
   - O que é a Lei
   - Quem se aplica
   - 8 anos de inelegibilidade
   - Como verificar
   - Casos de cassação
4. Download PDF
5. CTA "Precisa verificar candidatos?"

**APROVEITAR:**
- ✅ Blog MDX structure (já existe)
- ✅ TableOfContents component (já existe para blog)

**Aceite:**
- [ ] TOC sticky desktop
- [ ] TOC collapse mobile
- [ ] Conteúdo estruturado
- [ ] Download PDF (mock ou real)

---

### ✅ TAREFA 5.6: Criar `/recursos/compliance-tse`
**Prioridade:** 🟢 MÉDIA
**Tempo:** 4h
**Arquivo:** CRIAR `investigacao/src/app/recursos/compliance-tse/page.tsx`

**ESTRUTURA (similar a Ficha Limpa):**
1. Hero "Guia Compliance TSE"
2. TOC
3. Conteúdo:
   - Prazos TSE (72h doações, etc)
   - Multas e penalidades
   - Como evitar cassação
   - Checklist compliance
4. Download PDF
5. CTA

**Aceite:**
- [ ] Estrutura similar a /ficha-limpa
- [ ] Conteúdo específico TSE
- [ ] Download funciona

---

### ✅ TAREFA 5.7: Criar `/dashboard/candidatos`
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 10h
**Arquivo:** CRIAR `investigacao/src/app/dashboard/candidatos/page.tsx`

**ESTRUTURA:**
1. Header com "Novo Candidato" button
2. Busca (full-width mobile)
3. Filtros (modal mobile, sidebar desktop)
4. Lista:
   - Mobile: Cards verticais
   - Desktop: Tabela
5. Pagination
6. Empty state (se sem candidatos)

**APROVEITAR:**
- ✅ Dialog component (para modal "Novo Candidato")
- ✅ Input, Select (para busca/filtros)
- ✅ Card, Table components
- ✅ Empty State component (já existe)
- ✅ Mock data (criado na Tarefa 3.3)

**Código base:**
```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { mockCandidatos } from '@/data/mock-candidatos'

export default function CandidatosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredCandidatos = mockCandidatos.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Candidatos</h1>
          <p className="text-muted-foreground">Gerencie verificações de candidatos</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Candidato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Candidato para Verificação</DialogTitle>
            </DialogHeader>
            {/* Form aqui */}
            <div className="space-y-4">
              <Input label="Nome completo" placeholder="Ex: João Silva Santos" />
              <Input label="CPF" placeholder="000.000.000-00" />
              <Input label="Cargo" placeholder="Ex: Vereador" />
              <Button className="w-full">Iniciar Verificação</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Lista (Mobile: Cards, Desktop: Table) */}
      {filteredCandidatos.length === 0 ? (
        <EmptyState
          title="Nenhum candidato encontrado"
          description="Comece adicionando um candidato para verificação"
          action={
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Candidato
            </Button>
          }
        />
      ) : (
        <>
          {/* Mobile: Cards */}
          <div className="grid md:hidden gap-4">
            {filteredCandidatos.map((candidato) => (
              <Card key={candidato.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{candidato.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">{candidato.cpf}</p>
                    </div>
                    <Badge variant={candidato.status === 'verificado' ? 'default' : candidato.status === 'inelegivel' ? 'destructive' : 'secondary'}>
                      {candidato.status === 'verificado' ? 'Verificado' : candidato.status === 'inelegivel' ? 'Inelegível' : 'Em Análise'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cargo:</span>
                      <span className="font-medium">{candidato.cargo.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Partido:</span>
                      <span className="font-medium">{candidato.partido}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ficha Limpa:</span>
                      <span className={candidato.fichaLimpa ? 'text-green-600' : 'text-red-600'}>
                        {candidato.fichaLimpa ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    {candidato.alertas > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Alertas:</span>
                        <Badge variant="destructive">{candidato.alertas}</Badge>
                      </div>
                    )}
                  </div>
                  {candidato.relatorioUrl && (
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <a href={candidato.relatorioUrl} target="_blank">
                        Ver Relatório
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block rounded-lg border">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">CPF</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Cargo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Ficha Limpa</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidatos.map((candidato) => (
                  <tr key={candidato.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{candidato.nome}</td>
                    <td className="px-4 py-3 text-sm font-mono">{candidato.cpf}</td>
                    <td className="px-4 py-3 text-sm">{candidato.cargo.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <Badge variant={candidato.status === 'verificado' ? 'default' : candidato.status === 'inelegivel' ? 'destructive' : 'secondary'}>
                        {candidato.status === 'verificado' ? 'Verificado' : candidato.status === 'inelegivel' ? 'Inelegível' : 'Em Análise'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={candidato.fichaLimpa ? 'text-green-600' : 'text-red-600'}>
                        {candidato.fichaLimpa ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {candidato.relatorioUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={candidato.relatorioUrl} target="_blank">
                            Ver Relatório
                          </a>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
```

**Aceite:**
- [ ] Busca funciona
- [ ] Dialog "Novo Candidato" funciona
- [ ] Mobile: Cards verticais
- [ ] Desktop: Tabela
- [ ] Empty state funciona
- [ ] Mock data aparece

---

## 📅 SEMANA 3: INTEGRAÇÕES E BACKEND (5 dias, 40h)

### ✅ TAREFA 6.1: Integrar SERPRO CPF
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 8h
**Arquivo:** CRIAR `investigacao/src/lib/integrations/serpro.ts`

**O QUE FAZER:**
- ✅ SERPRO JÁ CONFIGURADO (variáveis ambiente existem)
- Criar wrapper functions para APIs SERPRO
- Implementar rate limiting
- Cache de resultados (24h)
- Error handling

**APIs SERPRO a usar:**
1. `/consulta-cpf/v1` - Dados cadastrais
2. `/consulta-cnpj/v1` - Dados empresas
3. `/divida-ativa/v1` - Dívidas
4. `/certidao-criminal/v1` - Antecedentes

**Código base:**
```typescript
// investigacao/src/lib/integrations/serpro.ts
const SERPRO_BASE_URL = process.env.SERPRO_API_URL || 'https://gateway.apiserpro.serpro.gov.br'
const SERPRO_API_KEY = process.env.SERPRO_API_KEY

interface SERPROCPFResponse {
  cpf: string
  nome: string
  dataNascimento: string
  situacao: 'REGULAR' | 'SUSPENSA' | 'CANCELADA' | 'NULA'
  // ... outros campos
}

export async function consultarCPF(cpf: string): Promise<SERPROCPFResponse> {
  const cleanCPF = cpf.replace(/\D/g, '')

  const response = await fetch(`${SERPRO_BASE_URL}/consulta-cpf/v1/cpf/${cleanCPF}`, {
    headers: {
      'Authorization': `Bearer ${SERPRO_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`SERPRO API error: ${response.status}`)
  }

  return response.json()
}

export async function consultarDividaAtiva(cpf: string) {
  // Implementar
}

export async function consultarCertidaoCriminal(cpf: string) {
  // Implementar
}
```

**Aceite:**
- [ ] Wrapper functions criadas (4 APIs)
- [ ] Error handling robusto
- [ ] Rate limiting implementado
- [ ] Cache básico (in-memory ou Redis)
- [ ] Testes com CPF real (ambiente de testes SERPRO)

---

### ✅ TAREFA 6.2: Criar API Route `/api/candidatos/verificar`
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h
**Arquivo:** CRIAR `investigacao/src/app/api/candidatos/verificar/route.ts`

**FUNCIONALIDADE:**
- Receber CPF do candidato
- Chamar SERPRO APIs (CPF, Dívida Ativa, Criminal)
- Processar resultados
- Salvar no Firebase Realtime DB
- Retornar status

**Código base:**
```typescript
// investigacao/src/app/api/candidatos/verificar/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { consultarCPF, consultarDividaAtiva, consultarCertidaoCriminal } from '@/lib/integrations/serpro'
import { getDatabase, ref, set } from 'firebase/database'

export async function POST(request: NextRequest) {
  try {
    const { cpf, nome, cargo } = await request.json()

    // Validações
    if (!cpf || !nome) {
      return NextResponse.json(
        { error: 'CPF e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Consultar SERPRO (paralelo)
    const [dadosCPF, dividaAtiva, certidaoCriminal] = await Promise.all([
      consultarCPF(cpf),
      consultarDividaAtiva(cpf),
      consultarCertidaoCriminal(cpf),
    ])

    // Calcular status
    const fichaLimpa = dadosCPF.situacao === 'REGULAR' &&
                       !certidaoCriminal.temCondenacao &&
                       !dividaAtiva.temDivida

    const alertas = []
    if (dadosCPF.situacao !== 'REGULAR') alertas.push('CPF irregular')
    if (certidaoCriminal.temCondenacao) alertas.push('Condenação criminal')
    if (dividaAtiva.temDivida) alertas.push('Dívida ativa')

    // Salvar no Firebase
    const db = getDatabase()
    const candidatoId = `${Date.now()}-${cpf.replace(/\D/g, '')}`
    const candidatoRef = ref(db, `candidatos/${candidatoId}`)

    await set(candidatoRef, {
      id: candidatoId,
      nome,
      cpf,
      cargo,
      fichaLimpa,
      alertas: alertas.length,
      detalhes: {
        dadosCPF,
        dividaAtiva,
        certidaoCriminal,
      },
      status: alertas.length > 0 ? 'inelegivel' : 'verificado',
      dataVerificacao: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      candidatoId,
      fichaLimpa,
      alertas,
    })

  } catch (error) {
    console.error('Erro ao verificar candidato:', error)
    return NextResponse.json(
      { error: 'Erro ao processar verificação' },
      { status: 500 }
    )
  }
}
```

**Aceite:**
- [ ] API route funciona
- [ ] Valida inputs
- [ ] Chama SERPRO (3 APIs em paralelo)
- [ ] Salva no Firebase
- [ ] Retorna JSON correto
- [ ] Error handling robusto

---

### ✅ TAREFA 6.3: Conectar Dashboard com Firebase
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h
**Arquivo:** Atualizar `investigacao/src/app/dashboard/candidatos/page.tsx`

**MUDANÇAS:**
- Substituir `mockCandidatos` por dados reais do Firebase
- Usar `useEffect` + `onValue` para real-time updates
- Loading states enquanto carrega
- Error states se falhar

**Código:**
```typescript
'use client'

import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue } from 'firebase/database'
import { Skeleton } from '@/components/ui/skeleton'

export default function CandidatosPage() {
  const [candidatos, setCandidatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const db = getDatabase()
    const candidatosRef = ref(db, 'candidatos')

    const unsubscribe = onValue(
      candidatosRef,
      (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const candidatosArray = Object.values(data)
          setCandidatos(candidatosArray)
        }
        setLoading(false)
      },
      (error) => {
        console.error('Erro ao carregar candidatos:', error)
        setError(error.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erro ao carregar: {error}</p>
      </div>
    )
  }

  // ... resto do código (busca, filtros, lista)
}
```

**Aceite:**
- [ ] Dados Firebase aparecem
- [ ] Real-time updates funcionam
- [ ] Loading skeleton enquanto carrega
- [ ] Error state se falhar
- [ ] Cleanup (unsubscribe) no unmount

---

### ✅ TAREFA 6.4: Implementar Form "Novo Candidato"
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h
**Arquivo:** CRIAR `investigacao/src/components/NovoCandidatoForm.tsx`

**FUNCIONALIDADE:**
- Form com React Hook Form + Zod
- Validação CPF (11 dígitos, formato)
- Submeter para `/api/candidatos/verificar`
- Loading state durante processamento
- Toast de sucesso/erro

**Código:**
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const formSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (formato: 000.000.000-00)'),
  cargo: z.enum(['vereador', 'prefeito', 'deputado_estadual', 'deputado_federal', 'senador', 'governador']),
  partido: z.string().min(2, 'Partido obrigatório'),
  estado: z.string().length(2, 'UF deve ter 2 letras'),
})

type FormData = z.infer<typeof formSchema>

export function NovoCandidatoForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/candidatos/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Erro ao processar verificação')

      const result = await response.json()

      toast.success('Candidato adicionado com sucesso!', {
        description: result.fichaLimpa
          ? 'Ficha limpa verificada ✓'
          : `${result.alertas.length} alerta(s) encontrado(s)`,
      })

      reset()
      onSuccess?.()

    } catch (error) {
      toast.error('Erro ao adicionar candidato', {
        description: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome completo"
        placeholder="Ex: João Silva Santos"
        {...register('nome')}
        error={errors.nome?.message}
      />

      <Input
        label="CPF"
        placeholder="000.000.000-00"
        {...register('cpf')}
        error={errors.cpf?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Cargo</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
            {...register('cargo')}
          >
            <option value="vereador">Vereador</option>
            <option value="prefeito">Prefeito</option>
            <option value="deputado_estadual">Deputado Estadual</option>
            <option value="deputado_federal">Deputado Federal</option>
            <option value="senador">Senador</option>
            <option value="governador">Governador</option>
          </select>
          {errors.cargo && <p className="text-sm text-destructive mt-1">{errors.cargo.message}</p>}
        </div>

        <Input
          label="Partido"
          placeholder="Ex: PARTIDO-01"
          {...register('partido')}
          error={errors.partido?.message}
        />
      </div>

      <Input
        label="Estado (UF)"
        placeholder="Ex: SP"
        maxLength={2}
        {...register('estado')}
        error={errors.estado?.message}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Processando...' : 'Iniciar Verificação'}
      </Button>
    </form>
  )
}
```

**Aceite:**
- [ ] Form valida inputs (Zod)
- [ ] CPF formato correto
- [ ] Submit chama API
- [ ] Loading durante processamento
- [ ] Toast success/error
- [ ] Reset form após sucesso

---

### ✅ TAREFA 6.5: Geração de Relatório PDF (Básico)
**Prioridade:** 🟡 ALTA
**Tempo:** 8h
**Arquivo:** CRIAR `investigacao/src/app/api/candidatos/[id]/relatorio/route.ts`

**FUNCIONALIDADE:**
- Endpoint GET `/api/candidatos/{id}/relatorio`
- Buscar dados do candidato no Firebase
- Gerar PDF básico (pode usar biblioteca `pdfkit` ou `react-pdf`)
- Retornar PDF para download

**Alternativa Simples (MVP):**
- Gerar HTML bem formatado
- Usar `window.print()` no client
- Ou integrar com serviço externo (DocRaptor, PDFShift)

**Aceite:**
- [ ] Endpoint funciona
- [ ] PDF gerado (básico)
- [ ] Download funciona
- [ ] Contém dados essenciais (nome, CPF, ficha limpa, alertas)

---

## 📅 SEMANA 4: POLISH + TESTES + CONTEÚDO (5 dias, 40h)

### ✅ TAREFA 7.1: Escrever 5 Blog Posts Políticos
**Prioridade:** 🟡 ALTA
**Tempo:** 10h
**Arquivos:** CRIAR em `investigacao/src/content/blog/`

**POSTS:**
1. `lei-ficha-limpa-guia-completo.mdx` - Guia completo Lei Ficha Limpa
2. `vetting-candidatos-2026.mdx` - Como fazer vetting em 2026
3. `tse-compliance-evitar-multas.mdx` - Como evitar multas TSE
4. `casos-cassacao-chapas.mdx` - 5 casos de cassação de chapas
5. `triagem-doadores-72h.mdx` - Triagem de doadores e prazo 72h

**APROVEITAR:**
- ✅ Blog MDX structure já existe
- ✅ Templates de blog existentes
- ✅ Componentes (AuthorCard, RelatedPosts, etc)

**Aceite:**
- [ ] 5 posts criados (mínimo 1000 palavras cada)
- [ ] Metadata SEO correta
- [ ] Imagens otimizadas (WebP)
- [ ] Links internos para serviços

---

### ✅ TAREFA 7.2: Criar 3 Cases de Sucesso
**Prioridade:** 🟢 MÉDIA
**Tempo:** 6h
**Arquivo:** Atualizar `investigacao/src/data/portfolio-casos.ts`

**CASES:**
1. "Campanha Vereador SP - 100% Ficha Limpa"
   - Cliente: Consultoria política (anônimo)
   - Desafio: Verificar 50 candidatos em 72h
   - Solução: Vetting paralelo
   - Resultado: 3 inelegíveis detectados, chapa ajustada, eleição vencida

2. "Partido Estadual - Triagem 1.500 Doadores"
   - Cliente: Partido político (anônimo)
   - Desafio: Conformidade TSE 72h
   - Solução: Triagem automática
   - Resultado: Zero multas, R$ 2M arrecadados

3. "Campanha Governador - Pesquisa Oposição"
   - Cliente: Campanha governador (anônimo)
   - Desafio: Antecipa ataques adversário
   - Solução: Pesquisa legal oposição
   - Resultado: Contra-argumentos preparados, debates vencidos

**Aceite:**
- [ ] 3 cases escritos
- [ ] Dados anonimizados (LGPD)
- [ ] Métricas realistas
- [ ] Aparecem na homepage e /cases

---

### ✅ TAREFA 7.3: Performance Optimization
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 8h

**CHECKLIST:**
- [ ] Otimizar imagens (converter para WebP/AVIF)
- [ ] Lazy loading em todas imagens (exceto hero)
- [ ] Font subsetting PT-BR (já pode estar feito)
- [ ] Remove console.logs (já configurado em next.config)
- [ ] Code splitting automático (Next.js já faz)
- [ ] Lighthouse CI: target 85+ mobile

**Comandos:**
```bash
cd investigacao
npm run build
npm run start

# Lighthouse test
npx lighthouse http://localhost:3000 --only-categories=performance --view
```

**Metas:**
- [ ] LCP < 3.5s (3G Slow)
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lighthouse Performance >= 85 mobile
- [ ] Total page < 1MB

---

### ✅ TAREFA 7.4: Mobile Testing (Dispositivos Reais)
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h

**DISPOSITIVOS:**
- [ ] iPhone (qualquer modelo iOS 15+)
- [ ] Android (qualquer modelo Android 11+)

**PÁGINAS A TESTAR:**
1. Homepage
2. /solucoes/campanhas
3. /servicos/vetting-candidatos
4. /precos
5. /contato
6. /dashboard
7. /dashboard/candidatos

**CHECKLIST POR PÁGINA:**
- [ ] Sem scroll horizontal
- [ ] CTAs >= 44px (todos)
- [ ] Formulários funcionam (preenchimento fácil)
- [ ] Menu mobile funciona (hamburguer, overlay)
- [ ] Dark mode funciona
- [ ] Performance aceitável (carrega em < 5s em 4G)
- [ ] Textos legíveis sem zoom (16px+)

---

### ✅ TAREFA 7.5: Cross-Browser Testing
**Prioridade:** 🟡 ALTA
**Tempo:** 4h

**BROWSERS:**
- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + iOS)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)

**CHECKLIST:**
- [ ] Layout não quebra
- [ ] Dark mode funciona
- [ ] Formulários funcionam
- [ ] Animações smooth (Framer Motion)
- [ ] Dropdowns funcionam

---

### ✅ TAREFA 7.6: SEO Metadata (7 páginas novas)
**Prioridade:** 🟡 ALTA
**Tempo:** 2h

**ADICIONAR EM CADA PÁGINA:**

```typescript
// Exemplo: /solucoes/campanhas/page.tsx
export const metadata: Metadata = {
  title: 'Soluções para Campanhas Políticas | Investigação 2.0',
  description: 'Vetting completo de candidatos, triagem de doadores e compliance TSE. Solução integrada para campanhas vencedoras. Relatório em 48h.',
  keywords: 'vetting candidatos, campanha política, lei ficha limpa, TSE, compliance político',
  openGraph: {
    title: 'Soluções para Campanhas Políticas',
    description: 'Vetting completo em 48h. Conformidade TSE garantida.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://seudominio.com/solucoes/campanhas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soluções para Campanhas Políticas',
    description: 'Vetting completo em 48h. Conformidade TSE garantida.',
  },
}
```

**PÁGINAS:**
1. /solucoes/campanhas
2. /servicos/vetting-candidatos
3. /servicos/triagem-doadores
4. /precos
5. /recursos/ficha-limpa
6. /recursos/compliance-tse
7. /dashboard/candidatos (noindex, nofollow)

**Aceite:**
- [ ] Metadata em todas páginas
- [ ] Títulos únicos (50-60 chars)
- [ ] Descriptions otimizadas (150-160 chars)
- [ ] OG tags (Open Graph)
- [ ] Twitter Cards

---

### ✅ TAREFA 7.7: Documentação Atualizada
**Prioridade:** 🟢 MÉDIA
**Tempo:** 4h
**Arquivo:** CRIAR `MVP_ADAPTACAO_CONCLUIDO.md`

**CONTEÚDO:**
1. O que foi feito (40 tarefas)
2. Páginas criadas (7 novas)
3. Páginas adaptadas (3)
4. Integrações implementadas (SERPRO, Firebase)
5. Performance atingida
6. Como rodar localmente
7. Próximos passos (v1.5, v2)

**Aceite:**
- [ ] Documento criado
- [ ] Completo e atualizado
- [ ] Inclui screenshots
- [ ] Roadmap v1.5 e v2

---

## ✅ CRITÉRIOS DE ACEITAÇÃO MVP

### MVP COMPLETO QUANDO:

**Páginas (10/10):**
- [ ] `/` - Homepage (ADAPTADA)
- [ ] `/servicos` - Serviços (ADAPTADA)
- [ ] `/dashboard` - Dashboard (ADAPTADA)
- [ ] `/solucoes/campanhas` - NOVA
- [ ] `/servicos/vetting-candidatos` - NOVA
- [ ] `/servicos/triagem-doadores` - NOVA
- [ ] `/precos` - NOVA
- [ ] `/recursos/ficha-limpa` - NOVA
- [ ] `/recursos/compliance-tse` - NOVA
- [ ] `/dashboard/candidatos` - NOVA

**Funcionalidades:**
- [ ] Header navegação atualizado (Soluções, Serviços, Recursos, Preços)
- [ ] Dark mode funcionando
- [ ] Form "Novo Candidato" funciona
- [ ] Integração SERPRO funciona (CPF, Dívida, Criminal)
- [ ] Firebase real-time updates funciona
- [ ] Relatório PDF gerado (básico)
- [ ] Blog 5 posts políticos
- [ ] 3 cases de sucesso

**Performance:**
- [ ] Lighthouse >= 85 mobile (homepage)
- [ ] LCP < 3.5s 3G (homepage)
- [ ] CLS < 0.1
- [ ] Sem erros console

**Mobile-First:**
- [ ] Funciona em 375px (iPhone SE)
- [ ] Touch targets >= 44px
- [ ] Testado em 2+ dispositivos reais
- [ ] Sem scroll horizontal

**Deploy:**
- [ ] Produção ativa (Cloudflare Pages)
- [ ] URL pública funcionando
- [ ] SSL ativo (HTTPS)
- [ ] Variáveis ambiente configuradas

---

## 📊 TRACKING DE PROGRESSO

### Semana 1: Adaptação de Conteúdo ⬜ 0/10
- [ ] 1.1: Hero homepage (3h)
- [ ] 1.2: Seção serviços homepage (3h)
- [ ] 1.3: Stats homepage (2h)
- [ ] 2.1: Reescrever /servicos (6h)
- [ ] 2.2: FAQ (2h)
- [ ] 3.1: Dashboard labels (4h)
- [ ] 3.2: Navegação lateral (2h)
- [ ] 3.3: Mock data (2h)
- [ ] 4.1: Header navegação (4h)
- [ ] 4.2: Footer (2h)
- [ ] 4.3: Compliance badges component (2h)

### Semana 2: Criar 7 Páginas ⬜ 0/7
- [ ] 5.1: /solucoes/campanhas (6h)
- [ ] 5.2: /vetting-candidatos (6h)
- [ ] 5.3: /triagem-doadores (4h)
- [ ] 5.4: /precos (6h)
- [ ] 5.5: /ficha-limpa (4h)
- [ ] 5.6: /compliance-tse (4h)
- [ ] 5.7: /dashboard/candidatos (10h)

### Semana 3: Integrações ⬜ 0/5
- [ ] 6.1: SERPRO wrapper (8h)
- [ ] 6.2: API /verificar (6h)
- [ ] 6.3: Firebase real-time (6h)
- [ ] 6.4: Form Novo Candidato (6h)
- [ ] 6.5: PDF relatório (8h)

### Semana 4: Polish + Conteúdo ⬜ 0/7
- [ ] 7.1: 5 blog posts (10h)
- [ ] 7.2: 3 cases (6h)
- [ ] 7.3: Performance (8h)
- [ ] 7.4: Mobile testing (6h)
- [ ] 7.5: Cross-browser (4h)
- [ ] 7.6: SEO metadata (2h)
- [ ] 7.7: Documentação (4h)

**TOTAL: 28 tarefas | 160 horas | 4 semanas**

---

## 💰 ECONOMIA VS. PLANO FROM-SCRATCH

| Métrica | From-Scratch | Adaptação | Economia |
|---------|--------------|-----------|----------|
| **Tarefas** | 40 | 28 | 12 (30%) |
| **Horas** | 240h | 160h | 80h (33%) |
| **Semanas** | 6 | 4 | 2 (33%) |
| **Setup** | 16h | 0h | 16h (100%) |
| **Design System** | 24h | 4h | 20h (83%) |
| **Componentes** | 40h | 2h | 38h (95%) |
| **Infraestrutura** | R$ 200 | R$ 0 | R$ 200 |

**TOTAL ECONOMIZADO: 80 horas de trabalho + R$ 200 + 2 semanas**

---

## 🚀 PRÓXIMOS PASSOS PÓS-MVP

### V1.5 (Semanas 5-6) - Se MVP validar:
- [ ] Adicionar 3 outras soluções (Partidos, Consultorias, Lobbying)
- [ ] Expandir 3 serviços (Pesquisa Oposição, Monitoramento TSE)
- [ ] Integrar Stripe (pagamentos)
- [ ] Autenticação multi-tenant real (substituir mock)
- [ ] Dashboard: Doadores, Relatórios avançados

### V2.0 (Semanas 10-14) - Award-Winning:
- [ ] Kinetic typography
- [ ] Glassmorphism
- [ ] Micro-interactions avançadas
- [ ] AI personalization (OpenAI já integrado)
- [ ] Performance < 2.0s LCP
- [ ] Lighthouse 95+
- [ ] Submeter Awwwards

---

## 🎯 VANTAGENS DESTA ABORDAGEM

1. **Aproveita 80% do código existente** (componentes, design system, infraestrutura)
2. **Reduz tempo em 33%** (4 semanas vs. 6)
3. **Zero custo adicional** (tudo já configurado)
4. **Menor risco** (stack testada, components prontos)
5. **Foco no que importa** (conteúdo político, integrações SERPRO/TSE)
6. **Deploy imediato** (Cloudflare já configurado)
7. **Dark mode pronto** (next-themes funcionando)
8. **Blog pronto** (apenas adicionar posts políticos)
9. **Firebase configurado** (apenas usar)
10. **Mobile-first garantido** (design system já responsivo)

---

**DOCUMENTO:** TODO MVP Adaptação Realista
**DATA:** 17/01/2026
**VERSÃO:** 1.0
**BASEADO EM:** Codebase existente (Next.js 16 + 21 páginas + 60 componentes)
**STATUS:** ✅ PRONTO PARA EXECUÇÃO
**INÍCIO RECOMENDADO:** 20/01/2026 (segunda-feira)
**ENTREGA PREVISTA:** 14/02/2026 (4 semanas)
**ECONOMIA:** 80h trabalho + 2 semanas + R$ 200
