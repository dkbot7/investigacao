# Guia de Aplicação Mobile-First - Dashboard InvestigaRee

## Status: APLICADO PARCIALMENTE
✅ /dashboard/beneficios - CONCLUÍDO
🔄 Restantes 22 páginas - PENDENTE

---

## Padrão Mobile-First 2025 - Melhores Práticas

### 1. CONTAINERS E SPACING

```tsx
// ANTES
<div className="p-4 lg:p-8">
<div className="space-y-6">

// DEPOIS
<div className="p-4 sm:p-6 lg:p-8">
<div className="space-y-4 sm:space-y-6">
```

### 2. TÍTULOS E HEADERS

```tsx
// ANTES
<h1 className="text-2xl font-bold ...">
<h1 className="text-3xl font-bold ...">
<Icon className="w-7 h-7" />
<Icon className="w-8 h-8" />

// DEPOIS
<h1 className="text-xl sm:text-2xl font-bold ...">
<h1 className="text-2xl sm:text-3xl font-bold ...">
<Icon className="w-6 h-6 sm:w-7 sm:h-7" />
<Icon className="w-6 h-6 sm:w-8 sm:h-8" />
```

### 3. BADGES E TAGS

```tsx
// ANTES
<span className="px-3 py-1 ... text-xs">
  Visão Global (Admin)
</span>

// DEPOIS
<span className="px-2 sm:px-3 py-0.5 sm:py-1 ... text-[10px] sm:text-xs">
  <span className="hidden sm:inline">Visão Global (Admin)</span>
  <span className="sm:hidden">Admin</span>
</span>
```

### 4. GRIDS RESPONSIVOS

```tsx
// ANTES
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// DEPOIS
<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
```

### 5. INPUTS E SEARCH

```tsx
// ANTES
<input className="... pl-10 pr-4 py-2.5 ...">
<Icon className="w-5 h-5" />
<div className="relative w-full lg:w-64">

// DEPOIS
<input className="... pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base ...">
<Icon className="w-4 h-4 sm:w-5 sm:h-5" />
<div className="relative w-full sm:w-64">
```

### 6. CARDS E BOTÕES

```tsx
// ANTES
<div className="p-4">
<div className="p-6">
<Button className="px-4 py-2">

// DEPOIS
<div className="p-3 sm:p-4">
<div className="p-4 sm:p-6">
<Button className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base">
```

### 7. FLEX LAYOUTS - Stack on Mobile

```tsx
// ANTES
<div className="flex items-center gap-4">
<div className="flex flex-col lg:flex-row gap-4">

// DEPOIS - Stack on mobile
<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
```

### 8. TABELAS

```tsx
// ANTES
<th className="py-3 px-4 text-sm">
<td className="py-3 px-4">

// DEPOIS
<th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
<td className="py-2 sm:py-3 px-2 sm:px-4">
```

### 9. ÍCONES EM CARDS

```tsx
// ANTES
<div className="p-2 bg-blue-500/10">
  <Icon className="w-5 h-5" />
</div>

// DEPOIS
<div className="p-1.5 sm:p-2 bg-blue-500/10">
  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
</div>
```

### 10. STAT NUMBERS

```tsx
// ANTES
<p className="text-2xl font-bold">

// DEPOIS
<p className="text-xl sm:text-2xl font-bold">
```

---

## Lista de Páginas para Aplicar (23 Total)

### ✅ Concluídas (1)
1. ✅ `/dashboard/beneficios/page.tsx` - MOBILE-FIRST APLICADO

### 🔄 Pendentes (22)

#### Dashboard Principal
2. ❌ `/dashboard/candidatos/page.tsx`
3. ❌ `/dashboard/doadores/page.tsx`
4. ❌ `/dashboard/configuracoes/page.tsx`
5. ❌ `/dashboard/obitos/page.tsx`
6. ❌ `/dashboard/sancionados/page.tsx`
7. ❌ `/dashboard/vinculos/page.tsx`
8. ❌ `/dashboard/ofac/page.tsx`
9. ❌ `/dashboard/alertas/page.tsx`
10. ❌ `/dashboard/exportar/page.tsx`
11. ❌ `/dashboard/lgpd/page.tsx`

#### Consultas
12. ❌ `/dashboard/consultas/cpf/page.tsx`
13. ❌ `/dashboard/consultas/cnpj/page.tsx`

#### Páginas COMURG (9 páginas)
14. ❌ `/dashboard/comurgempresas/page.tsx`
15. ❌ `/dashboard/comurgobitos/page.tsx`
16. ❌ `/dashboard/comurgbeneficios/page.tsx`
17. ❌ `/dashboard/comurgatividadepolitica/page.tsx`
18. ❌ `/dashboard/comurganaliserisco/page.tsx`
19. ❌ `/dashboard/comurgachadoscriticos/page.tsx`
20. ❌ `/dashboard/comurglistasrestritivas/page.tsx`
21. ❌ `/dashboard/comurgecedidos/page.tsx`
22. ❌ `/dashboard/compliance/page.tsx` (se existir)

---

## Como Aplicar

### Opção 1: Script PowerShell (Automático)
```powershell
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree
powershell -ExecutionPolicy Bypass -File apply-mobile-first.ps1
```

### Opção 2: Busca e Substituição Manual (VSCode)

Use Find & Replace (Ctrl+Shift+H) com RegEx ativado:

1. **Container padding:**
   - Buscar: `className="p-4 lg:p-8"`
   - Substituir: `className="p-4 sm:p-6 lg:p-8"`

2. **Spacing:**
   - Buscar: `className="space-y-6"`
   - Substituir: `className="space-y-4 sm:space-y-6"`

3. **Títulos:**
   - Buscar: `text-2xl font-bold`
   - Substituir: `text-xl sm:text-2xl font-bold`

4. **Ícones:**
   - Buscar: `w-7 h-7`
   - Substituir: `w-6 h-6 sm:w-7 sm:h-7"`

(Continue com os demais padrões acima)

### Opção 3: Claude Code (Assistido)
Peça para o Claude Code aplicar as mudanças página por página, informando:
- Qual página processar
- Use este guia como referência

---

## Checklist de Verificação Pós-Aplicação

Para cada página modificada, verifique:

- [ ] Container tem `p-4 sm:p-6 lg:p-8`
- [ ] Spacing tem `space-y-4 sm:space-y-6`
- [ ] Títulos h1 tem `text-xl sm:text-2xl`
- [ ] Ícones principais tem `w-6 h-6 sm:w-7 sm:h-7`
- [ ] Grids tem `grid-cols-2 sm:grid-cols-2 lg:grid-cols-4`
- [ ] Flex layouts stackam no mobile com `flex-col sm:flex-row`
- [ ] Inputs tem padding progressivo `py-2 sm:py-2.5`
- [ ] Tabelas tem `py-2 sm:py-3 px-2 sm:px-4`
- [ ] Cards tem `p-3 sm:p-4`
- [ ] Badges tem `text-[10px] sm:text-xs`

---

## Teste em Dispositivos

Após aplicação, teste em:
1. **Mobile** (320px-480px): iPhone SE, Android pequeno
2. **Small** (640px-768px): Tablets pequenos
3. **Medium** (768px-1024px): Tablets
4. **Large** (1024px+): Desktop

### Ferramentas de Teste
- Chrome DevTools (F12 > Toggle Device Toolbar)
- Firefox Responsive Design Mode
- BrowserStack / LambdaTest

---

## Notas Importantes

1. **Prioridade Mobile:** Sempre comece com o menor tamanho
2. **Breakpoints Tailwind:**
   - `sm`: 640px
   - `md`: 768px
   - `lg`: 1024px
   - `xl`: 1280px

3. **Não use `md:` sozinho:** Sempre use `sm:` primeiro
4. **Touch targets:** Mínimo 44x44px (16px text + padding)
5. **Readability:** Text mínimo 14px no mobile

---

## Progresso: 1/23 (4.3%)

**Última atualização:** 2025-12-11
**Responsável:** Claude Code Agent
**Status:** EM ANDAMENTO
