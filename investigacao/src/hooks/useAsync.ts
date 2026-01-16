import { useState, useEffect, useCallback } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseAsyncOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

/**
 * Hook para gerenciar estados assíncronos (loading, data, error)
 *
 * @example
 * const { data, loading, error, execute, reset } = useAsync(
 *   () => serproService.consultarCpf('12345678900'),
 *   { onSuccess: (data) => toast.success('CPF consultado!') }
 * )
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { initialData = null, onSuccess, onError } = options

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await asyncFunction()
      setState({ data, loading: false, error: null })
      onSuccess?.(data)
      return data
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setState((prev) => ({ ...prev, loading: false, error: err }))
      onError?.(err)
      throw err
    }
  }, [asyncFunction, onSuccess, onError])

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null })
  }, [initialData])

  const setData = useCallback((data: T) => {
    setState((prev) => ({ ...prev, data }))
  }, [])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
    setData,
  }
}

/**
 * Hook para executar função assíncrona automaticamente ao montar
 *
 * @example
 * const { data, loading, error, refetch } = useAsyncEffect(
 *   () => adminService.getUsers()
 * )
 */
export function useAsyncEffect<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> & { deps?: React.DependencyList } = {}
) {
  const { deps = [], ...asyncOptions } = options
  const async = useAsync(asyncFunction, asyncOptions)

  useEffect(() => {
    async.execute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    ...async,
    refetch: async.execute,
  }
}

/**
 * Hook para debounce de funções assíncronas
 *
 * @example
 * const { execute, loading } = useAsyncDebounce(
 *   (query) => api.search(query),
 *   500
 * )
 */
export function useAsyncDebounce<T, A extends any[]>(
  asyncFunction: (...args: A) => Promise<T>,
  delay: number = 300
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const execute = useCallback(
    (...args: A) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      setState((prev) => ({ ...prev, loading: true, error: null }))

      const id = setTimeout(async () => {
        try {
          const data = await asyncFunction(...args)
          setState({ data, loading: false, error: null })
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Unknown error')
          setState((prev) => ({ ...prev, loading: false, error: err }))
        }
      }, delay)

      setTimeoutId(id)
    },
    [asyncFunction, delay, timeoutId]
  )

  const cancel = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [timeoutId])

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    cancel,
  }
}

/**
 * Hook para polling (requisições periódicas)
 *
 * @example
 * const { data, loading, start, stop } = useAsyncPolling(
 *   () => adminService.getAlerts(),
 *   30000 // Poll a cada 30 segundos
 * )
 */
export function useAsyncPolling<T>(
  asyncFunction: () => Promise<T>,
  interval: number = 5000,
  options: UseAsyncOptions<T> & { autoStart?: boolean } = {}
) {
  const { autoStart = false, ...asyncOptions } = options
  const async = useAsync(asyncFunction, asyncOptions)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const start = useCallback(() => {
    // Execute imediatamente
    async.execute()

    // Configure polling
    const id = setInterval(() => {
      async.execute()
    }, interval)

    setIntervalId(id)
  }, [async, interval])

  const stop = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }, [intervalId])

  useEffect(() => {
    if (autoStart) {
      start()
    }

    return () => {
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    ...async,
    start,
    stop,
    isPolling: intervalId !== null,
  }
}
