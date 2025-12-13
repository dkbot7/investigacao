# Partial Prerendering (PPR) - Guia de Implementação

## O que é PPR?

Partial Prerendering (PPR) é uma estratégia de renderização experimental do Next.js 15 que permite combinar conteúdo estático e dinâmico na mesma rota, melhorando significativamente a performance inicial da página.

## Como Funciona

1. **Shell Estático**: O servidor envia primeiro um shell contendo todo o conteúdo estático
2. **Holes Dinâmicos**: Deixa "buracos" para o conteúdo dinâmico que será carregado depois
3. **Streaming Paralelo**: O conteúdo dinâmico é transmitido em paralelo, reduzindo o tempo total de carregamento

## Configuração Global

PPR está habilitado em modo incremental em `next.config.ts`:

```typescript
experimental: {
  ppr: 'incremental', // Permite opt-in por rota
}
```

## Como Usar em uma Página

### 1. Habilitar PPR na Rota

Adicione `experimental_ppr = true` na página:

```typescript
// src/app/sua-pagina/page.tsx
export const experimental_ppr = true;
```

### 2. Separar Conteúdo Estático e Dinâmico

Use `Suspense` para envolver componentes dinâmicos:

```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      {/* Conteúdo estático - pré-renderizado */}
      <StaticComponent />

      {/* Conteúdo dinâmico - streamed */}
      <Suspense fallback={<LoadingSkeleton />}>
        <DynamicComponent />
      </Suspense>
    </>
  );
}
```

### 3. Criar Componente Dinâmico (async)

```typescript
async function DynamicComponent() {
  // Fetch de dados do servidor ou API
  const data = await fetchData();

  return <div>{data}</div>;
}
```

### 4. Criar Fallback de Loading

```typescript
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );
}
```

## Exemplo Completo

Ver implementação real em:
- **Landing Page**: `src/app/page.tsx`
- **About Page**: `src/app/about/page.tsx` (exemplo com Suspense)

## Páginas com PPR Implementado

- ✅ `src/app/page.tsx` - Landing page (totalmente estática)
- ✅ `src/app/about/page.tsx` - About com stats dinâmicas

## Próximas Páginas para Implementar

### Alta Prioridade
- `/blog/[slug]/page.tsx` - Posts individuais (conteúdo estático + comentários dinâmicos)
- `/pricing/page.tsx` - Pricing (estático + dados de trial dinâmicos)

### Média Prioridade
- `/dashboard/page.tsx` - Dashboard principal (layout estático + stats dinâmicas)
- `/dashboard/analytics/page.tsx` - Analytics (gráficos estáticos + dados dinâmicos)

### Considerações Importantes

1. **Client Components**: Páginas com `"use client"` precisam ser refatoradas para usar Server Components
2. **Dynamic APIs**: Uso de `cookies()`, `headers()` faz Next.js optar por renderização dinâmica
3. **Revalidation**: Combine com ISR usando `export const revalidate = 3600`
4. **Fallbacks**: Sempre forneça fallbacks significativos para melhor UX

## Performance Expected

Com PPR implementado corretamente:
- ⚡ **FCP (First Contentful Paint)**: ~50-70% mais rápido
- 📊 **LCP (Largest Contentful Paint)**: ~30-40% melhoria
- 🎯 **TTI (Time to Interactive)**: Usuário vê conteúdo imediatamente

## Debugging PPR

Para verificar se PPR está funcionando:

```bash
npm run build
```

Procure por mensagens como:
```
Route (app)                        Size     First Load JS
┌ ○ /                             142 B          87.2 kB
└ ƒ /about                        1.23 kB        88.3 kB

○  (Static)  prerendered as static content
ƒ  (Dynamic) server-rendered on demand with partial prerendering
```

## Referências

- [Next.js Partial Prerendering Docs](https://nextjs.org/docs/15/app/getting-started/partial-prerendering)
- [Vercel Blog: PPR](https://vercel.com/blog/partial-prerendering-with-next-js-creating-a-new-default-rendering-model)
- [React Libraries Guide](https://www.reactlibraries.com/how-tos/partial-prerendering-in-next-js-15-a-complete-guide)
