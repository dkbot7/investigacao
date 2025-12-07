/**
 * API Client - Service Layer
 *
 * Generic HTTP client with automatic authentication, retry logic, and error handling.
 * Wraps the existing fetchAPI function with a class-based interface.
 */

import { auth } from './firebase'
import { APIError } from './api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br'

export interface RequestOptions extends RequestInit {
  retryOnAuthError?: boolean
  tenantCode?: string
}

/**
 * Generic API Client with automatic authentication
 */
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Get authentication token
   */
  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser
    if (!user) {
      throw new Error('Usuário não autenticado')
    }
    return user.getIdToken()
  }

  /**
   * Get tenant code from localStorage
   */
  private getTenantCode(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('currentTenant')
  }

  /**
   * Generic request method with retry logic
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { retryOnAuthError = true, tenantCode, ...fetchOptions } = options

    const token = await this.getAuthToken()
    const tenant = tenantCode || this.getTenantCode()

    const url = `${this.baseUrl}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(fetchOptions.headers as Record<string, string> || {}),
    }

    // Add tenant header if available
    if (tenant) {
      headers['X-Tenant-Code'] = tenant
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    // Handle 401 errors by forcing token refresh and retrying once
    if (response.status === 401 && retryOnAuthError) {
      console.log('[ApiClient] Token expirado, forçando refresh...')

      const user = auth.currentUser
      if (!user) {
        throw new APIError('Usuário não autenticado após refresh', 401, 'AUTH_ERROR')
      }

      // Force token refresh
      const newToken = await user.getIdToken(true)

      // Retry request with new token
      const retryHeaders: HeadersInit = {
        ...headers,
        'Authorization': `Bearer ${newToken}`,
      }

      const retryResponse = await fetch(url, {
        ...fetchOptions,
        headers: retryHeaders,
      })

      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}))
        throw new APIError(
          errorData.message || `HTTP error ${retryResponse.status}`,
          retryResponse.status,
          errorData.code
        )
      }

      return retryResponse.json()
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new APIError(
        errorData.message || `HTTP error ${response.status}`,
        response.status,
        errorData.code
      )
    }

    return response.json()
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

/**
 * Singleton instance
 */
export const apiClient = new ApiClient()
