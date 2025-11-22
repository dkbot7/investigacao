import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from './AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://investigaree.chatbotimoveis.workers.dev'

interface ApiContextType {
  apiCall: <T>(endpoint: string, options?: RequestInit) => Promise<T>
  createReport: (data: CreateReportData) => Promise<Report>
  getReports: () => Promise<ReportsResponse>
  getReport: (id: string) => Promise<Report>
  createPayment: (data: CreatePaymentData) => Promise<PaymentSession>
}

interface ReportsResponse {
  reports: Report[]
  total: number
}

interface CreateReportData {
  target_name: string
  target_document?: string
  target_email?: string
  target_phone?: string
  services: string[]
  urgency: 'standard' | 'express'
}

interface CreatePaymentData {
  produto: string
  target_name: string
  target_document?: string
  services: string
  urgency: string
  amount: number
}

interface Report {
  id: string
  startup_nome: string
  startup_cnpj: string
  startup_setor?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  recomendacao?: string
  score_integridade?: number
  created_at: string
  prazo_entrega?: string
  pdf_url?: string
}

interface PaymentSession {
  sessionId: string
  url: string
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export function ApiProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()

  const apiCall = async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = await getToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `API Error: ${response.status}`)
    }

    return response.json()
  }

  const createReport = async (data: CreateReportData): Promise<Report> => {
    return apiCall<Report>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const getReports = async (): Promise<ReportsResponse> => {
    return apiCall<ReportsResponse>('/api/reports')
  }

  const getReport = async (id: string): Promise<Report> => {
    return apiCall<Report>(`/api/reports/${id}`)
  }

  const createPayment = async (data: CreatePaymentData): Promise<PaymentSession> => {
    return apiCall<PaymentSession>('/api/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return (
    <ApiContext.Provider
      value={{
        apiCall,
        createReport,
        getReports,
        getReport,
        createPayment,
      }}
    >
      {children}
    </ApiContext.Provider>
  )
}

export function useApi() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}
