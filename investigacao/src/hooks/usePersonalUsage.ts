import { useState, useEffect, useCallback } from 'react'
import { getPersonalUsage, PersonalUsageResponse } from '@/lib/api'

interface UsePersonalUsageOptions {
  period?: 'today' | 'week' | 'month' | 'all'
  enabled?: boolean
  onSuccess?: (data: PersonalUsageResponse) => void
  onError?: (error: Error) => void
}

/**
 * Hook para buscar estatísticas de uso pessoal SERPRO
 *
 * @example
 * const { data, loading, error, refresh } = usePersonalUsage({
 *   period: 'month',
 *   onSuccess: (data) => console.log('Uso:', data.summary.total_cost)
 * })
 */
export function usePersonalUsage(options: UsePersonalUsageOptions = {}) {
  const { period = 'month', enabled = true, onSuccess, onError } = options

  const [data, setData] = useState<PersonalUsageResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const response = await getPersonalUsage(period)
      setData(response)
      onSuccess?.(response)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao buscar estatísticas')
      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [period, enabled, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refresh,
    // Helpers
    summary: data?.summary || null,
    byApi: data?.by_api || [],
    byDate: data?.by_date || [],
    recentQueries: data?.recent_queries || [],
  }
}
