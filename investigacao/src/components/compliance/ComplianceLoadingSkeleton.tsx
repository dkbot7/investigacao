/**
 * Compliance Loading Skeleton Component
 *
 * Skeleton loading states para compliance components
 * Usado como fallback de Suspense boundaries
 *
 * Best Practices 2025:
 * - Skeletons > Spinners genéricos (melhor UX)
 * - Deve refletir estrutura real do conteúdo
 * - Animação sutil (pulse)
 *
 * Fontes:
 * - https://dev.to/boopykiki/a-complete-nextjs-streaming-guide-loadingtsx-suspense-and-performance-9g9
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

export function ComplianceStatsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-100 dark:bg-navy-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-6 h-6 rounded-lg bg-slate-300 dark:bg-navy-700" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-300 dark:bg-navy-700 rounded w-1/3" />
              <div className="h-3 bg-slate-200 dark:bg-navy-600 rounded w-1/2" />
            </div>
          </div>
          <div className="h-10 w-32 bg-slate-300 dark:bg-navy-700 rounded-full" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-navy-700" />
              <div className="h-4 w-12 bg-slate-200 dark:bg-navy-700 rounded" />
            </div>

            <div className="space-y-2">
              <div className="h-8 w-16 bg-slate-300 dark:bg-navy-700 rounded" />
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-navy-700 rounded" />
              <div className="h-3 w-full bg-slate-100 dark:bg-navy-600 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ComplianceSearchLoading() {
  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-6 animate-pulse">
      <div className="h-5 w-48 bg-slate-300 dark:bg-navy-700 rounded mb-4" />

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-20 bg-slate-200 dark:bg-navy-700 rounded-lg" />
        ))}
      </div>

      {/* Search Input Skeleton */}
      <div className="flex gap-3">
        <div className="flex-1 h-12 bg-slate-100 dark:bg-navy-800 rounded-lg" />
        <div className="h-12 w-28 bg-blue-500/20 rounded-lg" />
      </div>
    </div>
  )
}

export function ComplianceResultsLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 w-64 bg-slate-300 dark:bg-navy-700 rounded" />
            <div className="h-7 w-24 bg-slate-300 dark:bg-navy-700 rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-200 dark:bg-navy-600 rounded" />
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-navy-600 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton para lista de itens (PEP search results, etc.)
 */
export function ComplianceListLoading({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3 rounded-lg border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800"
        >
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-slate-300 dark:bg-navy-700 rounded" />
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-navy-600 rounded" />
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-navy-600 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
