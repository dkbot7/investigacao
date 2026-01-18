# 📋 TODO MVP - 6 SEMANAS (40 TAREFAS)

**PROJETO:** Investigação 2.0 - Reposicionamento Político
**VERSÃO:** MVP 1.0
**TIMELINE:** 6 semanas (240 horas)
**PÁGINAS:** 7 essenciais
**DATA INÍCIO:** 20/01/2026
**DATA ENTREGA:** 28/02/2026

---

## 📊 RESUMO EXECUTIVO

| Métrica | Valor |
|---------|-------|
| **Total de Tarefas** | 40 |
| **Semanas** | 6 |
| **Horas Estimadas** | 240h |
| **Páginas** | 7 |
| **Investimento** | R$ 0-200 |
| **Performance Target** | Lighthouse 85+, LCP < 3.5s |

---

## 🎯 PÁGINAS DO MVP (7)

1. `/` - Homepage política
2. `/solucoes/campanhas` - Solução principal
3. `/servicos/vetting-candidatos` - Serviço core
4. `/precos` - Tabela de preços
5. `/contato` - Formulário contato
6. `/dashboard` - Overview dashboard
7. `/dashboard/candidatos` - Dashboard vetting

---

## 📅 SEMANA 1: FUNDAÇÃO (5 dias, 40h)

### DIA 1 - Setup Projeto (8h)

#### ✅ TAREFA 1.1: Inicializar Next.js 14 + TypeScript
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 2h
**Responsável:** Dev

**Comandos:**
```bash
npx create-next-app@latest investigacao2-mvp --typescript --tailwind --app --eslint
cd investigacao2-mvp
npm install
```

**Configurações:**
- ✅ App Router (não Pages Router)
- ✅ TypeScript strict mode
- ✅ Tailwind CSS
- ✅ ESLint
- ✅ Src/ directory: NÃO (usar raiz)

**Aceite:**
- [ ] Projeto inicializado
- [ ] `npm run dev` funciona localhost:3000
- [ ] TypeScript sem erros
- [ ] Git inicializado

---

#### ✅ TAREFA 1.2: Instalar Dependências Core
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 1h

**Comandos:**
```bash
npm install next-themes framer-motion lucide-react
npm install react-hook-form zod @hookform/resolvers
npm install -D @types/node @types/react @types/react-dom
```

**Dependências:**
- `next-themes` - Dark mode
- `framer-motion` - Animações
- `lucide-react` - Ícones
- `react-hook-form` - Formulários
- `zod` - Validação

**Aceite:**
- [ ] Todas instaladas sem erros
- [ ] package.json atualizado
- [ ] TypeScript reconhece tipos

---

#### ✅ TAREFA 1.3: Configurar Tailwind Mobile-First
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 2h

**Arquivo:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      // Mobile-first breakpoints (min-width)
      'xs': '375px',   // iPhone SE base
      'sm': '640px',
      'md': '768px',   // Tablets
      'lg': '1024px',  // Desktop
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Nature Distilled Palette
        primary: {
          50: '#e6f1f7',
          100: '#cce3ef',
          300: '#80b8d8',
          500: '#4a90b8',  // Main brand
          700: '#2d5a7a',
          900: '#1a3a52',  // Deep teal
        },
        accent: {
          electric: '#00d4ff',  // CTAs
          sage: '#7ba89f',
          clay: '#c8a882',
        },
        neutral: {
          0: '#faf9f7',    // Off-white (não #fff)
          50: '#f5f4f2',
          100: '#e8e6e3',
          200: '#d1cec8',
          300: '#b4afa6',
          400: '#8f8980',
          500: '#6b6660',
          600: '#524e49',
          700: '#3a3733',
          800: '#252320',
          900: '#1a1918',  // Dark bg (não #000)
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Inter', 'sans-serif'],
      },
      fontSize: {
        // Mobile-first type scale
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],  // Min legível
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['28px', { lineHeight: '36px' }],   // Mobile hero
        '4xl': ['32px', { lineHeight: '40px' }],
        '5xl': ['40px', { lineHeight: '48px' }],   // Desktop hero
        '6xl': ['48px', { lineHeight: '56px' }],
      },
      spacing: {
        // Touch-friendly spacing
        'touch': '44px',  // Min touch target
      },
    },
  },
  plugins: [],
}
export default config
```

**Aceite:**
- [ ] Dark mode configurado
- [ ] Breakpoints mobile-first
- [ ] Paleta de cores definida
- [ ] Typography scale mobile-first
- [ ] Sem erros TypeScript

---

#### ✅ TAREFA 1.4: Configurar Dark Mode Provider
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 1h

**Arquivo:** `app/providers.tsx`

```typescript
'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  )
}
```

**Arquivo:** `app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Investigação 2.0 - Inteligência Política',
  description: 'Vetting de candidatos e análise política para campanhas eleitorais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**Aceite:**
- [ ] Dark mode funciona
- [ ] Toggle manual funciona
- [ ] System preference detectado
- [ ] Sem flash de tema

---

#### ✅ TAREFA 1.5: Criar Componentes Base
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 2h

**Arquivo:** `components/ui/button.tsx`

```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base styles (mobile-first)
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-accent-electric text-neutral-900 hover:bg-accent-electric/90 active:scale-[0.98]',
        secondary: 'bg-primary-500 text-white hover:bg-primary-700',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white',
        ghost: 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
      },
      size: {
        sm: 'h-10 px-4 text-sm min-w-[44px]',      // Min touch 44px
        md: 'h-11 px-6 text-base min-w-[44px]',
        lg: 'h-14 px-8 text-lg min-w-[44px]',      // Recomendado mobile
        full: 'h-14 w-full px-8 text-lg',          // Full-width mobile CTAs
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Aceite:**
- [ ] Todas variantes funcionam
- [ ] Touch targets >= 44px
- [ ] Dark mode funciona
- [ ] TypeScript sem erros

---

### DIA 2 - Design System (8h)

#### ✅ TAREFA 2.1: Criar Card Component
**Prioridade:** 🟡 ALTA
**Tempo:** 1.5h

**Arquivo:** `components/ui/card.tsx`

```typescript
import { HTMLAttributes, forwardRef } from 'react'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`
        rounded-xl bg-white dark:bg-neutral-800
        border border-neutral-200 dark:border-neutral-700
        p-6 md:p-8
        shadow-sm hover:shadow-md transition-shadow
        ${className}
      `}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 pb-4 ${className}`}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-xl md:text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-neutral-600 dark:text-neutral-400 ${className}`}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`pt-0 ${className}`} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
```

**Aceite:**
- [ ] Card responsivo mobile-first
- [ ] Dark mode funciona
- [ ] Padding mobile (24px) vs desktop (32px)
- [ ] Hover states funcionam

---

#### ✅ TAREFA 2.2: Criar Badge Component
**Prioridade:** 🟡 ALTA
**Tempo:** 1h

**Arquivo:** `components/ui/badge.tsx`

```typescript
import { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-900 dark:bg-primary-900/20 dark:text-primary-300',
        success: 'bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-300',
        warning: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-300',
        danger: 'bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-300',
        outline: 'border border-primary-500 text-primary-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ variant, className })} {...props} />
  )
}

export { Badge, badgeVariants }
```

**Aceite:**
- [ ] Todas variantes funcionam
- [ ] Dark mode funciona
- [ ] Tamanho legível mobile

---

#### ✅ TAREFA 2.3: Criar Input Component
**Prioridade:** 🟡 ALTA
**Tempo:** 1.5h

**Arquivo:** `components/ui/input.tsx`

```typescript
import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
        )}
        <input
          type={type}
          className={`
            flex h-14 w-full rounded-lg
            border border-neutral-300 dark:border-neutral-600
            bg-white dark:bg-neutral-800
            px-4 py-3 text-base
            placeholder:text-neutral-400 dark:placeholder:text-neutral-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:cursor-not-allowed disabled:opacity-50
            transition-all
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

**Aceite:**
- [ ] Altura 56px (touch-friendly)
- [ ] Label sempre visível (não placeholder)
- [ ] Erro inline abaixo
- [ ] Dark mode funciona
- [ ] Focus states claros

---

#### ✅ TAREFA 2.4: Criar Header Component
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 2h

**Arquivo:** `components/layout/header.tsx`

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold text-primary-900 dark:text-primary-300">
              Investigação 2.0
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/solucoes/campanhas" className="text-sm font-medium hover:text-primary-500 transition-colors">
              Soluções
            </Link>
            <Link href="/servicos/vetting-candidatos" className="text-sm font-medium hover:text-primary-500 transition-colors">
              Serviços
            </Link>
            <Link href="/precos" className="text-sm font-medium hover:text-primary-500 transition-colors">
              Preços
            </Link>
            <Link href="/contato" className="text-sm font-medium hover:text-primary-500 transition-colors">
              Contato
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/contato">Começar</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 dark:border-neutral-800">
            <nav className="flex flex-col space-y-4">
              <Link href="/solucoes/campanhas" className="text-base font-medium hover:text-primary-500 transition-colors">
                Soluções
              </Link>
              <Link href="/servicos/vetting-candidatos" className="text-base font-medium hover:text-primary-500 transition-colors">
                Serviços
              </Link>
              <Link href="/precos" className="text-base font-medium hover:text-primary-500 transition-colors">
                Preços
              </Link>
              <Link href="/contato" className="text-base font-medium hover:text-primary-500 transition-colors">
                Contato
              </Link>
              <div className="pt-4 space-y-3">
                <Button variant="outline" size="full" asChild>
                  <Link href="/dashboard">Login</Link>
                </Button>
                <Button size="full" asChild>
                  <Link href="/contato">Começar</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
```

**Aceite:**
- [ ] Mobile: hamburger menu 44x44px
- [ ] Mobile: menu overlay full-screen
- [ ] Desktop: menu horizontal
- [ ] Dark mode toggle funciona
- [ ] Sticky top funciona
- [ ] Backdrop blur funciona

---

#### ✅ TAREFA 2.5: Criar Footer Component
**Prioridade:** 🟢 MÉDIA
**Tempo:** 1.5h

**Arquivo:** `components/layout/footer.tsx`

```typescript
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Mobile: 1 coluna, Desktop: 4 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Coluna 1: Brand */}
          <div>
            <h3 className="text-lg font-bold mb-4">Investigação 2.0</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Inteligência política para campanhas eleitorais vencedoras.
            </p>
          </div>

          {/* Coluna 2: Soluções */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Soluções</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/solucoes/campanhas" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 transition-colors">
                  Para Campanhas
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Serviços */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Serviços</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/servicos/vetting-candidatos" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 transition-colors">
                  Vetting de Candidatos
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contato" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
            © {currentYear} Investigação 2.0. Todos os direitos reservados. LGPD & TSE compliant.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

**Aceite:**
- [ ] Mobile: 1 coluna vertical
- [ ] Desktop: 4 colunas
- [ ] Links >= 44px altura mobile
- [ ] Dark mode funciona

---

### DIA 3-5 - Setup Finalização (24h)

#### ✅ TAREFA 3.1: Configurar Git & Deploy
**Prioridade:** 🟡 ALTA
**Tempo:** 2h

**Comandos:**
```bash
git init
git add .
git commit -m "feat: MVP setup inicial - Next.js 14 + design system"
git branch -M main
```

**Aceite:**
- [ ] Git inicializado
- [ ] Primeiro commit feito
- [ ] .gitignore configurado

---

## 📅 SEMANA 2: HOMEPAGE (5 dias, 40h)

#### ✅ TAREFA 4.1: Hero Section Mobile-First
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h

**Arquivo:** `app/page.tsx`

```typescript
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-0 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="default" className="mb-6">
              <Shield className="w-3 h-3 mr-1.5" />
              Conformidade Lei da Ficha Limpa
            </Badge>

            {/* Título Mobile: 32px, Desktop: 56px */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900 dark:text-neutral-0">
              Vença Eleições com Candidatos{' '}
              <span className="text-primary-500">Verificados</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Evite surpresas na campanha. Vetting completo de candidatos em 48h com verificação judicial, financeira e reputacional.
            </p>

            {/* CTAs Mobile: Full-width, Desktop: Inline */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="sm:w-auto w-full">
                <Link href="/contato">
                  Começar Verificação
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="sm:w-auto w-full">
                <Link href="/solucoes/campanhas">Ver Demo</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>200+ campanhas analisadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>48h entrega garantida</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>TSE compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

**Mobile-First Checklist:**
- [ ] Título: 32px mobile, 56px desktop
- [ ] CTAs: full-width mobile, inline desktop
- [ ] Badge: sticky ou inline mobile
- [ ] Social proof: vertical mobile, horizontal desktop
- [ ] LCP < 3.5s (3G)
- [ ] Testado em iPhone SE (375px)

**Aceite:**
- [ ] Layout vertical mobile
- [ ] CTAs >= 56px altura
- [ ] Sem scroll horizontal
- [ ] Dark mode funciona
- [ ] Performance: LCP < 3.5s

---

#### ✅ TAREFA 4.2: Seção Problema + Urgência
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 4h

**Adicionar após Hero em `app/page.tsx`:**

```typescript
{/* Problema + Urgência */}
<section className="py-16 md:py-24 bg-white dark:bg-neutral-900">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Um Candidato Inelegível Pode Derrubar Toda a Chapa
      </h2>
      <p className="text-lg text-neutral-600 dark:text-neutral-400">
        Lei da Ficha Limpa: 8 anos de inelegibilidade. TSE cassa chapas inteiras. Sua campanha não pode arriscar.
      </p>
    </div>

    {/* Stats - Mobile: Vertical, Desktop: Horizontal */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div className="text-center p-6 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
        <div className="text-4xl md:text-5xl font-bold text-red-600 dark:text-red-400 mb-2">
          8 anos
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          De inelegibilidade (Lei da Ficha Limpa)
        </div>
      </div>

      <div className="text-center p-6 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800">
        <div className="text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
          463.367
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Candidatos em 2024 (municípios)
        </div>
      </div>

      <div className="text-center p-6 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
        <div className="text-4xl md:text-5xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
          72h
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Prazo TSE para reportar doações
        </div>
      </div>
    </div>
  </div>
</section>
```

**Aceite:**
- [ ] Stats: 1 por linha mobile, 3 colunas desktop
- [ ] Números: 40px mobile, 56px desktop
- [ ] Cores urgência (vermelho, laranja, amarelo)
- [ ] Dark mode funciona

---

#### ✅ TAREFA 4.3: Grid 4 Soluções (Cards)
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 5h

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Shield, Users, FileSearch, TrendingUp } from 'lucide-react'

{/* 4 Soluções */}
<section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-800">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Soluções para Cada Fase da Campanha
      </h2>
      <p className="text-lg text-neutral-600 dark:text-neutral-400">
        Do pré-lançamento à prestação de contas, protegemos sua campanha em todas as etapas.
      </p>
    </div>

    {/* Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary-500" />
          </div>
          <CardTitle className="text-xl">Vetting de Candidatos</CardTitle>
          <CardDescription>
            Verificação completa: judicial, financeira, reputacional. Ficha Limpa garantida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" size="sm" asChild className="w-full">
            <Link href="/servicos/vetting-candidatos">
              Saiba mais <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-accent-sage/20 dark:bg-accent-sage/10 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-accent-sage" />
          </div>
          <CardTitle className="text-xl">Triagem de Doadores</CardTitle>
          <CardDescription>
            Valide doadores em tempo real. Evite multas TSE. Conformidade automática.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" size="sm" className="w-full">
            Saiba mais <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-accent-clay/20 dark:bg-accent-clay/10 flex items-center justify-center mb-4">
            <FileSearch className="w-6 h-6 text-accent-clay" />
          </div>
          <CardTitle className="text-xl">Pesquisa de Oposição</CardTitle>
          <CardDescription>
            Antecipe ataques. Prepare contra-argumentos. Dentro dos limites legais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" size="sm" className="w-full">
            Saiba mais <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-accent-electric/20 dark:bg-accent-electric/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-accent-electric" />
          </div>
          <CardTitle className="text-xl">Monitoramento Contínuo</CardTitle>
          <CardDescription>
            Alertas automáticos de mudanças judiciais. Proteção 24/7 durante a campanha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" size="sm" className="w-full">
            Saiba mais <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</section>
```

**Aceite:**
- [ ] Mobile: 1 coluna vertical
- [ ] Tablet: 2x2 grid
- [ ] Desktop: 1x4 horizontal
- [ ] Cards: padding 24px mobile, 32px desktop
- [ ] Ícones: 48px
- [ ] Hover states funcionam

---

#### ✅ TAREFA 4.4: CTA Final + Footer
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 3h

```typescript
{/* CTA Final */}
<section className="py-16 md:py-24 bg-primary-900 text-white">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Pronto para Candidatos 100% Verificados?
      </h2>
      <p className="text-lg text-primary-100 mb-8">
        Comece sua verificação hoje. Relatório completo em 48h. Sem surpresas no TSE.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" variant="primary" asChild className="bg-accent-electric hover:bg-accent-electric/90 text-neutral-900 w-full sm:w-auto">
          <Link href="/contato">
            Começar Agora <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-900">
          <Link href="/precos">Ver Preços</Link>
        </Button>
      </div>
    </div>
  </div>
</section>
```

**Aceite:**
- [ ] CTAs: full-width mobile, inline desktop
- [ ] Background contrastante
- [ ] Texto legível (WCAG AA)
- [ ] Botões >= 56px

---

## 📅 SEMANA 3: PÁGINA SOLUÇÕES (5 dias, 40h)

#### ✅ TAREFA 5.1: /solucoes/campanhas - Hero
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 4h

**Arquivo:** `app/solucoes/campanhas/page.tsx`

```typescript
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Target } from 'lucide-react'
import Link from 'next/link'

export default function CampanhasPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-primary-900/20 dark:to-neutral-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <Badge variant="default" className="mb-6">
              <Target className="w-3 h-3 mr-1.5" />
              Solução para Campanhas Políticas
            </Badge>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-neutral-0">
              Vença com Candidatos Verificados e Conformidade Total
            </h1>

            {/* Subtítulo */}
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-8">
              Do pré-lançamento à prestação de contas, oferecemos vetting completo, triagem de doadores e pesquisa de oposição. Tudo em conformidade com TSE e Lei da Ficha Limpa.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/contato">
                  Solicitar Proposta <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/servicos/vetting-candidatos">Ver Serviços</Link>
              </Button>
            </div>

            {/* Bullets */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Verificação judicial completa (TRE, TSE, CNJ)
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Triagem de doadores em tempo real
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Pesquisa de oposição (dentro dos limites legais)
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Relatório completo em 48h garantidas
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
```

**Aceite:**
- [ ] Hero mobile-first (vertical)
- [ ] Título: 32px mobile, 48px desktop
- [ ] CTAs: full-width mobile
- [ ] Bullets: 1 col mobile, 2 col desktop
- [ ] Badge sticky ou inline

---

#### ✅ TAREFA 5.2: Tabela de Preços (3 tiers)
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h

```typescript
import { Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

{/* Preços */}
<section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-800">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Pacotes para Campanhas
      </h2>
      <p className="text-lg text-neutral-600 dark:text-neutral-400">
        Escolha o pacote ideal para o tamanho da sua campanha. Todos incluem conformidade TSE.
      </p>
    </div>

    {/* Grid: 1 col mobile (carousel), 3 col desktop */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {/* Básico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Básico</CardTitle>
          <CardDescription>Vereador / Prefeito Cidade Pequena</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">R$ 2.500</span>
            <span className="text-neutral-600 dark:text-neutral-400">/campanha</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Vetting de 1 candidato</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Verificação judicial (TRE, TSE)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Relatório PDF em 48h</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Suporte por email</span>
            </li>
          </ul>
          <Button variant="outline" size="lg" className="w-full">
            Escolher Básico
          </Button>
        </CardContent>
      </Card>

      {/* Profissional - DESTACADO */}
      <Card className="border-2 border-primary-500 shadow-xl">
        <div className="bg-primary-500 text-white text-center py-2 text-sm font-semibold">
          MAIS POPULAR
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">Profissional</CardTitle>
          <CardDescription>Prefeito / Deputado Estadual</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">R$ 15.000</span>
            <span className="text-neutral-600 dark:text-neutral-400">/campanha</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Vetting de até 5 candidatos</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Triagem ilimitada de doadores</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Pesquisa de oposição (1 adversário)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Dashboard web + relatórios</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Suporte prioritário (WhatsApp)</span>
            </li>
          </ul>
          <Button size="lg" className="w-full">
            Escolher Profissional
          </Button>
        </CardContent>
      </Card>

      {/* Enterprise */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Enterprise</CardTitle>
          <CardDescription>Governador / Senador / Chapas Grandes</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">Custom</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Vetting ilimitado</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Monitoramento 24/7</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Pesquisa oposição ilimitada</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">API dedicada</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Account manager dedicado</span>
            </li>
          </ul>
          <Button variant="outline" size="lg" className="w-full">
            Falar com Vendas
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</section>
```

**Mobile-First Checklist:**
- [ ] Mobile: 1 coluna por vez (scroll horizontal ou carousel)
- [ ] Tablet: 2 colunas visíveis
- [ ] Desktop: 3 colunas lado a lado
- [ ] Card destacado: border colorido
- [ ] Botões: full-width mobile (56px)
- [ ] Preços legíveis: 40px mobile

**Aceite:**
- [ ] Funciona em 375px
- [ ] Swipe horizontal mobile (se carousel)
- [ ] Card destacado visível
- [ ] Botões >= 56px

---

## 📅 SEMANA 4: SERVIÇO + PREÇOS + CONTATO (5 dias, 40h)

#### ✅ TAREFA 6.1: /servicos/vetting-candidatos
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 8h

**Estrutura:**
- Hero (similar a campanhas)
- "O que verificamos" (accordion mobile, grid desktop)
- 3 Pacotes (Básico, Completo, Urgente)
- Processo em 5 passos (vertical mobile, horizontal desktop)
- FAQ accordion
- CTA final

**Aceite:**
- [ ] Hero mobile-first
- [ ] Accordion mobile funciona (touch-friendly)
- [ ] Pacotes: 1 col mobile, 3 col desktop
- [ ] Timeline: vertical mobile, horizontal desktop

---

#### ✅ TAREFA 6.2: /precos - Página Completa
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h

**Estrutura:**
- Tabs por público (Campanhas, Partidos) - scroll horizontal mobile
- Tabela de comparação (swipe horizontal mobile)
- Serviços avulsos (accordion mobile)
- FAQ preços (accordion)
- CTA "Dúvidas? Fale conosco"

**Aceite:**
- [ ] Tabs: scroll horizontal mobile
- [ ] Tabela: swipe horizontal com indicador
- [ ] Accordions funcionam touch
- [ ] Sticky CTA bottom mobile

---

#### ✅ TAREFA 6.3: /contato - Formulário
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h

**Arquivo:** `app/contato/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

const formSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  tipo: z.enum(['campanha', 'partido', 'consultoria', 'outro']),
  mensagem: z.string().min(10, 'Mensagem muito curta'),
})

type FormData = z.infer<typeof formSchema>

export default function ContatoPage() {
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
    // Simular envio (integrar com API depois)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(data)
    alert('Mensagem enviada! Retornaremos em 24h.')
    reset()
    setIsSubmitting(false)
  }

  return (
    <main className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Fale Conosco
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-12 text-center">
            Tire suas dúvidas ou solicite uma proposta personalizada. Retornamos em até 24h.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              {...register('nome')}
              error={errors.nome?.message}
            />

            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Telefone (WhatsApp)"
              type="tel"
              placeholder="(11) 99999-9999"
              autoComplete="tel"
              {...register('telefone')}
              error={errors.telefone?.message}
            />

            <div className="w-full">
              <label className="block text-sm font-medium mb-2">
                Tipo de cliente
              </label>
              <select
                className="flex h-14 w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register('tipo')}
              >
                <option value="campanha">Campanha Política</option>
                <option value="partido">Partido Político</option>
                <option value="consultoria">Consultoria</option>
                <option value="outro">Outro</option>
              </select>
              {errors.tipo && (
                <p className="mt-1.5 text-sm text-red-600">{errors.tipo.message}</p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium mb-2">
                Mensagem
              </label>
              <textarea
                className="flex min-h-32 w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Conte-nos sobre sua necessidade..."
                {...register('mensagem')}
              />
              {errors.mensagem && (
                <p className="mt-1.5 text-sm text-red-600">{errors.mensagem.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              <Send className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
```

**Mobile-First Checklist:**
- [ ] Labels sempre visíveis (não placeholder)
- [ ] Inputs: 56px altura (touch-friendly)
- [ ] Input type correto (email, tel)
- [ ] Autocomplete: on (facilita preenchimento mobile)
- [ ] Erros: inline abaixo do campo
- [ ] Submit: full-width 56px mobile
- [ ] Validação client-side (Zod + React Hook Form)

**Aceite:**
- [ ] Formulário funciona em 375px
- [ ] Validação funciona
- [ ] Erros inline visíveis
- [ ] Submit disabled durante envio
- [ ] Feedback sucesso/erro

---

## 📅 SEMANA 5: DASHBOARD MVP (5 dias, 40h)

#### ✅ TAREFA 7.1: /dashboard - Overview
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 10h

**Estrutura:**
- Layout: sidebar desktop, bottom tabs mobile
- Stats cards (4): Candidatos verificados, Em análise, Alertas, Doadores triados
- Gráfico simples (Chart.js ou Recharts)
- Tabela últimas verificações (cards mobile, table desktop)
- CTA "Nova Verificação"

**Mobile-First:**
- [ ] Bottom tab bar mobile (não sidebar)
- [ ] Stats: 1 col mobile, 2x2 tablet, 4 col desktop
- [ ] Tabela: cards mobile, table desktop
- [ ] Nav: 56px altura tabs

---

#### ✅ TAREFA 7.2: /dashboard/candidatos - Lista
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 10h

**Estrutura:**
- Busca: full-width mobile
- Filtros: modal full-screen mobile, sidebar desktop
- Lista: cards mobile, table desktop
- Pagination: simples (Anterior/Próximo)
- Actions: dropdown no card mobile

**Mobile-First:**
- [ ] Busca: full-width input 56px
- [ ] Filtros: modal bottom sheet mobile
- [ ] Cards: padding 20px, dados verticais
- [ ] Actions: dropdown touch-friendly

---

## 📅 SEMANA 6: POLISH + LAUNCH (5 dias, 40h)

#### ✅ TAREFA 8.1: Performance Optimization
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 8h

**Checklist:**
- [ ] Otimizar imagens (WebP, lazy loading)
- [ ] Font subsetting (PT-BR only)
- [ ] Remove console.logs
- [ ] Minify CSS/JS (Next.js automático)
- [ ] Lighthouse CI: target 85+ mobile

**Comandos:**
```bash
npm run build
npm run start
# Lighthouse CI mobile test
npx lighthouse http://localhost:3000 --only-categories=performance --view
```

**Aceite:**
- [ ] LCP < 3.5s (3G)
- [ ] Lighthouse Performance >= 85 mobile
- [ ] CLS < 0.1
- [ ] Imagens otimizadas (< 150KB hero)

---

#### ✅ TAREFA 8.2: Mobile Testing em Dispositivos Reais
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 6h

**Testes Obrigatórios:**
- [ ] iPhone SE (375px) - pior caso
- [ ] iPhone 14 (390px) - mais comum
- [ ] Samsung Galaxy (412px)
- [ ] iPad (768px)

**Checklist por Dispositivo:**
- [ ] Sem scroll horizontal
- [ ] Todos CTAs >= 44px
- [ ] Formulários funcionam
- [ ] Menu mobile funciona
- [ ] Dark mode funciona
- [ ] Performance aceitável (3G)

---

#### ✅ TAREFA 8.3: Testes Cross-Browser
**Prioridade:** 🟡 ALTA
**Tempo:** 4h

**Browsers:**
- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + iOS)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)

**Checklist:**
- [ ] Layout não quebra
- [ ] Dark mode funciona
- [ ] Formulários funcionam
- [ ] Animações smooth

---

#### ✅ TAREFA 8.4: SEO Básico
**Prioridade:** 🟡 ALTA
**Tempo:** 3h

**Arquivo:** `app/layout.tsx` e páginas individuais

```typescript
export const metadata: Metadata = {
  title: 'Investigação 2.0 - Vetting de Candidatos | Inteligência Política',
  description: 'Vetting completo de candidatos em 48h. Verificação judicial, financeira e reputacional. Conformidade Lei da Ficha Limpa e TSE.',
  keywords: 'vetting candidatos, lei da ficha limpa, campanha política, TSE, verificação candidatos',
  openGraph: {
    title: 'Investigação 2.0 - Vetting de Candidatos',
    description: 'Vetting completo em 48h. Conformidade TSE garantida.',
    type: 'website',
    locale: 'pt_BR',
  },
}
```

**Aceite:**
- [ ] Metadata em todas as 7 páginas
- [ ] Títulos únicos por página
- [ ] Descriptions otimizadas (150-160 chars)
- [ ] OG tags (Open Graph)

---

#### ✅ TAREFA 8.5: Documentação MVP
**Prioridade:** 🟢 MÉDIA
**Tempo:** 3h

**Criar:** `README_MVP.md`

**Conteúdo:**
- Páginas implementadas (7)
- Como rodar (npm run dev)
- Estrutura de pastas
- Componentes principais
- Performance targets atingidos
- Próximos passos (v1.5 e v2)

---

#### ✅ TAREFA 8.6: Deploy Vercel
**Prioridade:** 🔴 CRÍTICA
**Tempo:** 2h

**Comandos:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Aceite:**
- [ ] Deploy funciona
- [ ] URL pública ativa
- [ ] Performance em produção OK
- [ ] Lighthouse 85+ em produção

---

## ✅ CRITÉRIOS DE ACEITAÇÃO MVP

### MVP Completo Quando:

**Páginas (7/7):**
- [ ] `/` - Homepage
- [ ] `/solucoes/campanhas` - Solução campanhas
- [ ] `/servicos/vetting-candidatos` - Serviço core
- [ ] `/precos` - Preços
- [ ] `/contato` - Contato
- [ ] `/dashboard` - Dashboard overview
- [ ] `/dashboard/candidatos` - Lista candidatos

**Performance:**
- [ ] Lighthouse >= 85 mobile (todas páginas)
- [ ] LCP < 3.5s 3G (homepage)
- [ ] CLS < 0.1
- [ ] Sem erros console

**Mobile-First:**
- [ ] Funciona em 375px (iPhone SE)
- [ ] Touch targets >= 44px (TODOS)
- [ ] Sem scroll horizontal
- [ ] Testado em 2+ dispositivos reais

**Funcionalidade:**
- [ ] Dark mode funciona (manual toggle)
- [ ] Formulário contato funciona
- [ ] Navegação completa (sem orphans)
- [ ] Dashboard mock funcional

**Deploy:**
- [ ] Produção ativa (Vercel)
- [ ] URL pública funcionando
- [ ] SSL ativo (HTTPS)

---

## 📊 TRACKING DE PROGRESSO

### Semana 1: Fundação ⬜ 0/5
- [ ] TAREFA 1.1: Next.js setup (2h)
- [ ] TAREFA 1.2: Dependências (1h)
- [ ] TAREFA 1.3: Tailwind config (2h)
- [ ] TAREFA 1.4: Dark mode (1h)
- [ ] TAREFA 1.5: Componentes base (2h)
- [ ] TAREFA 2.1: Card (1.5h)
- [ ] TAREFA 2.2: Badge (1h)
- [ ] TAREFA 2.3: Input (1.5h)
- [ ] TAREFA 2.4: Header (2h)
- [ ] TAREFA 2.5: Footer (1.5h)
- [ ] TAREFA 3.1: Git (2h)

### Semana 2: Homepage ⬜ 0/4
- [ ] TAREFA 4.1: Hero (6h)
- [ ] TAREFA 4.2: Problema (4h)
- [ ] TAREFA 4.3: Grid 4 soluções (5h)
- [ ] TAREFA 4.4: CTA final (3h)

### Semana 3: Soluções ⬜ 0/2
- [ ] TAREFA 5.1: Hero campanhas (4h)
- [ ] TAREFA 5.2: Tabela preços (6h)

### Semana 4: Serviço + Preços + Contato ⬜ 0/3
- [ ] TAREFA 6.1: Vetting page (8h)
- [ ] TAREFA 6.2: Preços page (6h)
- [ ] TAREFA 6.3: Contato form (6h)

### Semana 5: Dashboard ⬜ 0/2
- [ ] TAREFA 7.1: Dashboard overview (10h)
- [ ] TAREFA 7.2: Lista candidatos (10h)

### Semana 6: Polish + Launch ⬜ 0/6
- [ ] TAREFA 8.1: Performance (8h)
- [ ] TAREFA 8.2: Mobile testing (6h)
- [ ] TAREFA 8.3: Cross-browser (4h)
- [ ] TAREFA 8.4: SEO (3h)
- [ ] TAREFA 8.5: Docs (3h)
- [ ] TAREFA 8.6: Deploy (2h)

**TOTAL: 40 tarefas | 240 horas | 6 semanas**

---

## 🚀 PRÓXIMOS PASSOS PÓS-MVP

### Se MVP validar (15+ leads qualificados):

**V1.5 (Semanas 7-9):**
- Adicionar 3 outras soluções (Partidos, Consultorias, Lobbying)
- Expandir 3 outros serviços (Triagem, Pesquisa, Monitoramento)
- Integrar API real (substituir mocks)
- Adicionar autenticação (NextAuth.js)

**V2.0 (Semanas 10-14 - Award-Winning):**
- Kinetic typography
- 3D elements (React Three Fiber)
- Glassmorphism
- AI personalization
- Performance < 2.0s LCP
- Lighthouse 95+
- Submeter para Awwwards

---

**DOCUMENTO:** TODO MVP 6 Semanas
**DATA:** 17/01/2026
**VERSÃO:** 1.0
**STATUS:** ✅ PRONTO PARA EXECUÇÃO
**INÍCIO RECOMENDADO:** 20/01/2026
**ENTREGA PREVISTA:** 28/02/2026
