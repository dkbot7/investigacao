import { useState, useMemo, useCallback } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
  pageSizeOptions?: number[]
}

interface UsePaginationResult<T> {
  // Dados paginados
  paginatedData: T[]

  // Estado atual
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number

  // Informações da página
  startIndex: number
  endIndex: number
  hasNextPage: boolean
  hasPreviousPage: boolean

  // Ações
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
  setPageSize: (size: number) => void
  reset: () => void
}

/**
 * Hook para paginação client-side
 *
 * @example
 * const {
 *   paginatedData,
 *   currentPage,
 *   totalPages,
 *   nextPage,
 *   previousPage,
 *   goToPage
 * } = usePagination(users, { initialPageSize: 10 })
 */
export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
): UsePaginationResult<T> {
  const {
    initialPage = 1,
    initialPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
  } = options

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / pageSize)

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex)
  }, [data, startIndex, endIndex])

  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [hasNextPage])

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [hasPreviousPage])

  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(pageNumber)
    },
    [totalPages]
  )

  const changePageSize = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }, [])

  const reset = useCallback(() => {
    setCurrentPage(initialPage)
    setPageSize(initialPageSize)
  }, [initialPage, initialPageSize])

  return {
    paginatedData,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    setPageSize: changePageSize,
    reset,
  }
}

/**
 * Componente de controles de paginação
 */
export interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

/**
 * Gera array de números de página para exibição
 * Mostra: [1] ... [current-1, current, current+1] ... [total]
 */
export function usePaginationRange(currentPage: number, totalPages: number, delta: number = 2) {
  return useMemo(() => {
    const range: (number | string)[] = []

    if (totalPages <= 7) {
      // Se tem poucas páginas, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        range.push(i)
      }
    } else {
      // Sempre mostra primeira página
      range.push(1)

      // Calcula o range em torno da página atual
      const start = Math.max(2, currentPage - delta)
      const end = Math.min(totalPages - 1, currentPage + delta)

      // Adiciona "..." se necessário
      if (start > 2) {
        range.push('...')
      }

      // Adiciona páginas do range
      for (let i = start; i <= end; i++) {
        range.push(i)
      }

      // Adiciona "..." se necessário
      if (end < totalPages - 1) {
        range.push('...')
      }

      // Sempre mostra última página
      range.push(totalPages)
    }

    return range
  }, [currentPage, totalPages, delta])
}

/**
 * Hook para paginação server-side
 */
interface UseServerPaginationOptions {
  initialPage?: number
  initialPageSize?: number
  totalItems: number
}

export function useServerPagination(options: UseServerPaginationOptions) {
  const { initialPage = 1, initialPageSize = 10, totalItems } = options

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const hasNextPage = currentPage < totalPages
  const hasPreviousPage = currentPage > 1

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [hasNextPage])

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [hasPreviousPage])

  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(pageNumber)
    },
    [totalPages]
  )

  const changePageSize = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  const reset = useCallback(() => {
    setCurrentPage(initialPage)
    setPageSize(initialPageSize)
  }, [initialPage, initialPageSize])

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    setPageSize: changePageSize,
    reset,
  }
}
