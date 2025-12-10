# PLANO DE INTEGRAÇÃO - Dashboard COMURG → Investigaree

**Data de criação**: 2025-12-09
**Tempo estimado**: 1-2 horas
**Complexidade**: Baixa (apenas copiar e adaptar)

---

## CONTEXTO

O Dashboard COMURG é uma aplicação Next.js standalone com dados hardcoded (CSVs estáticos).
Objetivo: Integrar todo o dashboard dentro da página `/dashboard/comurgecedidos` do investigaree, protegido por autenticação do tenant COMURG.

---

## PRÉ-REQUISITOS

- [x] Investigaree rodando localmente na porta 3001
- [x] Dashboard COMURG rodando localmente na porta 3000
- [x] Usuário `cliente01@investigaree.com.br` configurado no tenant COMURG
- [x] Página `/dashboard/comurgecedidos` criada e protegida por tenant

---

## FASE 1: PREPARAÇÃO DO AMBIENTE

### 1.1. Instalar dependências no investigaree

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree
npm install papaparse recharts
npm install -D @types/papaparse
```

**Dependências**:
- `papaparse`: Para processar arquivos CSV
- `recharts`: Para gráficos (já usado pelo dashboard)
- `@types/papaparse`: Tipagens TypeScript

### 1.2. Ajustar versão do Next.js (OPCIONAL)

Se houver problemas de compatibilidade, podemos:

**Opção A**: Downgrade dashboard (Next.js 16 → 15.1.9)
```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\clientes\CLIENTE_01\dashboard-comurg
npm install next@15.1.9
```

**Opção B**: Upgrade investigaree (Next.js 15.1.9 → 16)
```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree
npm install next@16.0.3
```

**Recomendação**: Testar primeiro sem mudar versões. Só ajustar se der erro.

---

## FASE 2: COPIAR ARQUIVOS ESTÁTICOS (CSVs)

### 2.1. Copiar dados CSV

**Origem**: `C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\clientes\CLIENTE_01\dashboard-comurg\public\data\`

**Destino**: `C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\public\data\comurg\`

**Arquivos a copiar**:
```
dados_consolidados.csv       ← Principal (base completa)
kpis.csv
por_grupo.csv
por_risco.csv
achados_criticos.csv
obitos.csv
empresas_ativas.csv
beneficios.csv
candidaturas.csv
doacoes.csv
por_centro_custo.csv
estatisticas.csv
```

**Comando PowerShell**:
```powershell
# Criar pasta de destino
New-Item -ItemType Directory -Force -Path "C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\public\data\comurg"

# Copiar todos os CSVs
Copy-Item "C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\clientes\CLIENTE_01\dashboard-comurg\public\data\*.csv" `
          "C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\public\data\comurg\"
```

---

## FASE 3: COPIAR COMPONENTES

### 3.1. Estrutura de destino

```
investigaree/
├── src/
│   ├── components/
│   │   └── comurg/                    ← CRIAR
│   │       ├── ui/
│   │       │   └── card.tsx           ← Copiar (ou usar shadcn/ui)
│   │       ├── charts/
│   │       │   ├── bar-chart.tsx
│   │       │   ├── line-chart.tsx
│   │       │   └── pie-chart.tsx
│   │       ├── sidebar.tsx
│   │       └── funcionario-modal.tsx
│   │
│   ├── contexts/
│   │   └── ComurgDataContext.tsx      ← Copiar e renomear
│   │
│   ├── config/
│   │   └── comurg-dashboard.config.ts ← Copiar
│   │
│   └── app/
│       └── dashboard/
│           └── comurgecedidos/
│               ├── layout.tsx          ← CRIAR (sidebar)
│               ├── page.tsx            ← Substituir (overview)
│               ├── achados-criticos/
│               │   └── page.tsx
│               ├── obitos/
│               │   └── page.tsx
│               ├── empresas/
│               │   └── page.tsx
│               ├── beneficios/
│               │   └── page.tsx
│               ├── atividade-politica/
│               │   └── page.tsx
│               ├── analise-risco/
│               │   └── page.tsx
│               ├── listas-restritivas/
│               │   └── page.tsx
│               ├── cpfs-validos/
│               │   └── page.tsx
│               └── relatorios/
│                   └── page.tsx
```

### 3.2. Comandos de cópia

**PowerShell**:
```powershell
# Variáveis de caminho
$origem = "C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\clientes\CLIENTE_01\dashboard-comurg"
$destino = "C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\src"

# Criar estrutura de pastas
New-Item -ItemType Directory -Force -Path "$destino\components\comurg\ui"
New-Item -ItemType Directory -Force -Path "$destino\components\comurg\charts"

# Copiar componentes UI
Copy-Item "$origem\components\ui\*" "$destino\components\comurg\ui\" -Recurse
Copy-Item "$origem\components\charts\*" "$destino\components\comurg\charts\" -Recurse
Copy-Item "$origem\components\sidebar.tsx" "$destino\components\comurg\"
Copy-Item "$origem\components\funcionario-modal.tsx" "$destino\components\comurg\"

# Copiar contexto
Copy-Item "$origem\contexts\DataContext.tsx" "$destino\contexts\ComurgDataContext.tsx"

# Copiar config
Copy-Item "$origem\config\dashboard.config.ts" "$destino\config\comurg-dashboard.config.ts"

# Copiar páginas
Copy-Item "$origem\app\overview\page.tsx" "$destino\app\dashboard\comurgecedidos\page.tsx"
Copy-Item "$origem\app\achados-criticos" "$destino\app\dashboard\comurgecedidos\achados-criticos" -Recurse
Copy-Item "$origem\app\obitos" "$destino\app\dashboard\comurgecedidos\obitos" -Recurse
Copy-Item "$origem\app\empresas" "$destino\app\dashboard\comurgecedidos\empresas" -Recurse
Copy-Item "$origem\app\beneficios" "$destino\app\dashboard\comurgecedidos\beneficios" -Recurse
Copy-Item "$origem\app\atividade-politica" "$destino\app\dashboard\comurgecedidos\atividade-politica" -Recurse
Copy-Item "$origem\app\analise-risco" "$destino\app\dashboard\comurgecedidos\analise-risco" -Recurse
Copy-Item "$origem\app\listas-restritivas" "$destino\app\dashboard\comurgecedidos\listas-restritivas" -Recurse
Copy-Item "$origem\app\cpfs-validos" "$destino\app\dashboard\comurgecedidos\cpfs-validos" -Recurse
Copy-Item "$origem\app\relatorios" "$destino\app\dashboard\comurgecedidos\relatorios" -Recurse
```

---

## FASE 4: AJUSTES DE CÓDIGO

### 4.1. Ajustar imports nos componentes copiados

**Buscar e substituir em todos os arquivos copiados**:

```
@/components/ui/         → @/components/comurg/ui/
@/components/charts/     → @/components/comurg/charts/
@/components/sidebar     → @/components/comurg/sidebar
@/contexts/DataContext   → @/contexts/ComurgDataContext
@/config/dashboard       → @/config/comurg-dashboard
```

### 4.2. Ajustar caminhos dos CSVs no DataContext

**Arquivo**: `investigaree/src/contexts/ComurgDataContext.tsx`

**Buscar**: `/data/dados_consolidados.csv`
**Substituir**: `/data/comurg/dados_consolidados.csv`

E todos os outros CSVs que forem referenciados.

### 4.3. Criar layout com sidebar

**Arquivo**: `investigaree/src/app/dashboard/comurgecedidos/layout.tsx`

```typescript
"use client";

import { ComurgDataProvider } from "@/contexts/ComurgDataContext";
import { ComurgSidebar } from "@/components/comurg/sidebar";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ComurgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo, loading } = useUserAccess();
  const router = useRouter();

  // Proteção de tenant
  useEffect(() => {
    if (!loading && userInfo?.tenant?.code !== 'COMURG') {
      router.push('/dashboard');
    }
  }, [userInfo, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (userInfo?.tenant?.code !== 'COMURG') {
    return null;
  }

  return (
    <ComurgDataProvider>
      <div className="flex h-screen overflow-hidden">
        <ComurgSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </ComurgDataProvider>
  );
}
```

### 4.4. Ajustar Sidebar para navegação do COMURG

**Arquivo**: `investigaree/src/components/comurg/sidebar.tsx`

Atualizar os links de navegação:

```typescript
// ANTES (dashboard standalone)
href: "/overview"

// DEPOIS (dentro do investigaree)
href: "/dashboard/comurgecedidos"
```

```typescript
// ANTES
href: "/obitos"

// DEPOIS
href: "/dashboard/comurgecedidos/obitos"
```

Fazer isso para TODAS as páginas.

### 4.5. Remover layout.tsx das páginas individuais

Se as páginas copiadas tiverem seu próprio `layout.tsx`, remover, pois agora usamos o layout geral do `/dashboard/comurgecedidos/layout.tsx`.

### 4.6. Adicionar proteção extra nas páginas (redundância)

Em cada `page.tsx` copiada, no topo do componente:

```typescript
"use client";

import { useUserAccess } from "@/hooks/useUserAccess";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ObitosPage() {
  const { userInfo, loading } = useUserAccess();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userInfo?.tenant?.code !== 'COMURG') {
      router.push('/dashboard');
    }
  }, [userInfo, loading, router]);

  if (loading) return <div>Carregando...</div>;
  if (userInfo?.tenant?.code !== 'COMURG') return null;

  // ... resto do código da página
}
```

---

## FASE 5: AJUSTES FINAIS

### 5.1. Verificar componentes shadcn/ui

O dashboard COMURG tem um componente `Card` próprio. Verificar se é compatível com o shadcn/ui do investigaree.

**Opção A**: Usar o Card do shadcn/ui
```typescript
// Substituir
import { Card } from "@/components/comurg/ui/card"

// Por
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
```

**Opção B**: Manter o Card do COMURG (mais simples)
- Deixar como está

### 5.2. Ajustar estilos globais (se necessário)

Se o dashboard COMURG tiver estilos específicos em `globals.css`, copiar apenas os estilos necessários para o investigaree.

### 5.3. Remover referências ao Inter font

O investigaree usa Geist font. Remover imports do Inter nos arquivos copiados:

```typescript
// REMOVER
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

// E remover className={inter.className}
```

---

## FASE 6: TESTES

### 6.1. Checklist de testes

- [ ] Login com `cliente01@investigaree.com.br`
- [ ] Acessar `/dashboard/comurgecedidos`
- [ ] Verificar se sidebar aparece
- [ ] Testar navegação entre páginas:
  - [ ] Overview (lista de funcionários)
  - [ ] Achados Críticos
  - [ ] Óbitos
  - [ ] Empresas
  - [ ] Benefícios
  - [ ] Atividade Política
  - [ ] Análise de Risco
  - [ ] Listas Restritivas
  - [ ] CPFs Válidos
  - [ ] Relatórios
- [ ] Verificar se gráficos renderizam
- [ ] Testar busca de funcionários
- [ ] Testar paginação
- [ ] Abrir modal de detalhes de funcionário
- [ ] Testar seletor de colunas (Overview)
- [ ] Verificar se KPIs aparecem corretamente
- [ ] Logout e tentar acessar com outro usuário (deve redirecionar)

### 6.2. Teste de segurança

1. Login com outro usuário que NÃO é COMURG
2. Tentar acessar `/dashboard/comurgecedidos` diretamente
3. Deve redirecionar para `/dashboard`
4. Tentar acessar `/data/comurg/dados_consolidados.csv` diretamente
   - ⚠️ Vai funcionar (público), mas OK para MVP

---

## FASE 7: MELHORIAS FUTURAS (OPCIONAL)

### 7.1. Proteção dos CSVs

Mover CSVs para fora do `/public` e servir via API Route:

```typescript
// app/api/comurg/data/[...file]/route.ts
export async function GET(request: NextRequest) {
  // Verificar tenant COMURG
  // Ler CSV do filesystem
  // Retornar dados
}
```

### 7.2. Migração para D1

Se no futuro quiser dados dinâmicos:
1. Criar tabelas no D1
2. Importar CSVs para D1
3. Criar APIs no Worker
4. Substituir DataContext por chamadas de API

### 7.3. Adicionar link no menu principal

Atualizar o menu principal do investigaree para mostrar link para "Dashboard COMURG" apenas para usuários do tenant COMURG.

---

## COMANDOS RÁPIDOS DE REFERÊNCIA

### Instalar dependências
```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree
npm install papaparse recharts
npm install -D @types/papaparse
```

### Copiar CSVs
```powershell
New-Item -ItemType Directory -Force -Path "C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\public\data\comurg"
Copy-Item "C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\clientes\CLIENTE_01\dashboard-comurg\public\data\*.csv" "C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\public\data\comurg\"
```

### Testar localmente
```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree
npm run dev -- -p 3001
```

Acessar: http://localhost:3001/dashboard/comurgecedidos

---

## TROUBLESHOOTING

### Erro: "Module not found: Can't resolve '@/components/ui/card'"

**Causa**: Import path incorreto
**Solução**: Mudar para `@/components/comurg/ui/card` ou usar shadcn/ui

### Erro: "CSV não carrega / fetch 404"

**Causa**: Caminho do CSV incorreto no DataContext
**Solução**: Verificar se CSVs estão em `/public/data/comurg/` e DataContext usa esse caminho

### Erro: "Module not found: papaparse"

**Causa**: Dependência não instalada
**Solução**: `npm install papaparse`

### Sidebar não aparece

**Causa**: Layout não foi criado ou DataProvider não está envolvendo
**Solução**: Verificar `layout.tsx` em `/dashboard/comurgecedidos/`

### Redirecionamento infinito

**Causa**: Lógica de proteção de tenant com bug
**Solução**: Verificar useEffect de redirecionamento, adicionar condição `!loading`

### Gráficos não renderizam

**Causa**: Recharts não instalado ou dados não carregados
**Solução**:
1. `npm install recharts`
2. Verificar console do browser para erros de dados

---

## ESTIMATIVA DE TEMPO

| Fase | Descrição | Tempo |
|------|-----------|-------|
| 1 | Preparação (instalar deps) | 5 min |
| 2 | Copiar CSVs | 2 min |
| 3 | Copiar componentes | 10 min |
| 4 | Ajustar código (imports, paths) | 30 min |
| 5 | Ajustes finais (styles, fonts) | 15 min |
| 6 | Testes | 20 min |
| **TOTAL** | | **~1h 22min** |

---

## CHECKLIST FINAL

### Antes de começar
- [ ] Backup do investigaree (`git commit` antes de começar)
- [ ] Dashboard COMURG funcionando localmente
- [ ] Investigaree funcionando localmente

### Durante implementação
- [ ] Dependências instaladas
- [ ] CSVs copiados
- [ ] Componentes copiados
- [ ] Imports ajustados
- [ ] Layout criado
- [ ] Sidebar ajustada
- [ ] Proteção de tenant implementada

### Testes
- [ ] Login funciona
- [ ] Redirecionamento funciona
- [ ] Todas as páginas carregam
- [ ] Dados aparecem
- [ ] Gráficos renderizam
- [ ] Navegação funciona

### Deploy
- [ ] Git commit com mensagem descritiva
- [ ] Git push (dispara GitHub Actions)
- [ ] Verificar deploy em produção
- [ ] Testar em produção

---

## OBSERVAÇÕES IMPORTANTES

1. **Dados públicos**: Os CSVs ficam acessíveis em `/public/data/comurg/` - qualquer um que souber a URL pode baixar. Para MVP isso é aceitável, mas considere mover para API se for sensível.

2. **Performance**: Com muitos dados (>10.000 registros), o processamento client-side pode ficar lento. Considere paginação server-side no futuro.

3. **Manutenção**: Dados estão hardcoded nos CSVs. Para atualizar, precisará substituir os arquivos CSV e fazer redeploy.

4. **Escalabilidade**: Esta é uma solução MVP. Para escalar, migre para D1 + APIs no futuro.

---

## PRÓXIMOS PASSOS APÓS INTEGRAÇÃO

1. Adicionar link "Dashboard COMURG" no menu principal (apenas para tenant COMURG)
2. Melhorar UX de loading (skeleton screens)
3. Adicionar export de dados (Excel, PDF)
4. Implementar filtros avançados
5. Adicionar notificações de achados críticos
6. Criar relatórios automatizados

---

**Documento criado em**: 2025-12-09
**Versão**: 1.0
**Status**: Pronto para execução
