/**
 * SERPRO Credentials Management Service
 *
 * Service layer para gerenciamento de credenciais SERPRO (BYO System)
 * Agent 3 - Frontend Engineer
 * Data: 2025-12-08
 */

import { apiClient } from '@/lib/api-client'

// ============================================================================
// TYPES
// ============================================================================

export type SerproMode = 'managed' | 'byo'

export type SerproApiName =
  | 'cpf'
  | 'cnpj'
  | 'divida-ativa'
  | 'renda'
  | 'faturamento'
  | 'datavalid'
  | 'cnd'
  | 'integra-contador'
  | 'raiz-tech'

export type SerproEnvironment = 'trial' | 'production'

export interface SerproCredential {
  id: string
  api_name: SerproApiName
  consumer_key: string
  // consumer_secret_encrypted is never returned by API (security)
  environment: SerproEnvironment
  is_active: 1 | 0
  last_validated_at: string | null
  validation_error: string | null
  created_at: string
  updated_at: string
}

export interface SerproCredentialsListResponse {
  success: boolean
  tenant_id: string
  mode: SerproMode
  notes: string | null
  credentials: SerproCredential[]
  apis_available: SerproApiName[]
}

export interface SerproCredentialInput {
  api_name: SerproApiName
  consumer_key: string
  consumer_secret: string
  environment?: SerproEnvironment
}

export interface SerproModeUpdateInput {
  mode: SerproMode
}

export interface SerproCredentialSaveResponse {
  success: boolean
  message: string
  api_name: SerproApiName
}

export interface SerproModeUpdateResponse {
  success: boolean
  message: string
  mode: SerproMode
}

export interface SerproCredentialValidateResponse {
  success: boolean
  message?: string
  error?: string
  details?: string
  validated_at?: string
}

export interface SerproCredentialDeleteResponse {
  success: boolean
  message: string
}

// ============================================================================
// SERVICE
// ============================================================================

/**
 * Service para gerenciar credenciais SERPRO de tenants
 * (Admin only)
 */
export class SerproCredentialsService {
  /**
   * Lista todas as credenciais SERPRO de um tenant
   *
   * @param tenantId - ID do tenant
   * @returns Lista de credenciais (sem secrets!)
   */
  async listCredentials(tenantId: string): Promise<SerproCredentialsListResponse> {
    return apiClient.get<SerproCredentialsListResponse>(
      `/api/admin/serpro-credentials/${tenantId}`
    )
  }

  /**
   * Salva/atualiza credenciais SERPRO de um tenant
   *
   * @param tenantId - ID do tenant
   * @param data - Dados da credencial (com consumer_secret)
   * @returns Resposta de sucesso
   */
  async saveCredential(
    tenantId: string,
    data: SerproCredentialInput
  ): Promise<SerproCredentialSaveResponse> {
    return apiClient.post<SerproCredentialSaveResponse>(
      `/api/admin/serpro-credentials/${tenantId}`,
      data
    )
  }

  /**
   * Alterna o modo do tenant (managed ↔ byo)
   *
   * @param tenantId - ID do tenant
   * @param mode - Novo modo ('managed' ou 'byo')
   * @returns Resposta de sucesso
   */
  async updateMode(
    tenantId: string,
    mode: SerproMode
  ): Promise<SerproModeUpdateResponse> {
    return apiClient.put<SerproModeUpdateResponse>(
      `/api/admin/serpro-credentials/${tenantId}/mode`,
      { mode }
    )
  }

  /**
   * Valida se as credenciais SERPRO estão funcionando
   * (Faz teste OAuth2 real com SERPRO)
   *
   * @param tenantId - ID do tenant
   * @param apiName - Nome da API a validar
   * @returns Resultado da validação
   */
  async validateCredential(
    tenantId: string,
    apiName: SerproApiName
  ): Promise<SerproCredentialValidateResponse> {
    return apiClient.post<SerproCredentialValidateResponse>(
      `/api/admin/serpro-credentials/${tenantId}/${apiName}/validate`
    )
  }

  /**
   * Remove credenciais SERPRO de um tenant
   *
   * @param tenantId - ID do tenant
   * @param apiName - Nome da API a remover
   * @returns Resposta de sucesso
   */
  async deleteCredential(
    tenantId: string,
    apiName: SerproApiName
  ): Promise<SerproCredentialDeleteResponse> {
    return apiClient.delete<SerproCredentialDeleteResponse>(
      `/api/admin/serpro-credentials/${tenantId}/${apiName}`
    )
  }
}

/**
 * Singleton instance
 */
export const serproCredentialsService = new SerproCredentialsService()

/**
 * Labels amigáveis para as APIs SERPRO
 */
export const SERPRO_API_LABELS: Record<SerproApiName, string> = {
  'cpf': 'CPF (Consulta)',
  'cnpj': 'CNPJ (Consulta)',
  'divida-ativa': 'Dívida Ativa',
  'renda': 'Renda Estimada',
  'faturamento': 'Faturamento Presumido',
  'datavalid': 'DataValid',
  'cnd': 'CND (Certidão Negativa)',
  'integra-contador': 'Integra Contador',
  'raiz-tech': 'Raiz Tech',
}

/**
 * Descrições das APIs SERPRO
 */
export const SERPRO_API_DESCRIPTIONS: Record<SerproApiName, string> = {
  'cpf': 'Consulta dados cadastrais de CPF na Receita Federal',
  'cnpj': 'Consulta dados cadastrais de CNPJ na Receita Federal',
  'divida-ativa': 'Consulta débitos inscritos em dívida ativa',
  'renda': 'Estimativa de renda de pessoa física',
  'faturamento': 'Estimativa de faturamento de pessoa jurídica',
  'datavalid': 'Validação de dados cadastrais',
  'cnd': 'Certidão Negativa de Débitos',
  'integra-contador': 'Integração com sistema Integra Contador',
  'raiz-tech': 'Integração com sistema Raiz Tech',
}
