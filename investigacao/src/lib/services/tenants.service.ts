/**
 * Tenants Service
 *
 * Service layer para gerenciamento de tenants (multi-tenancy)
 * Integração com endpoints do Agent 2 (backend persistence API)
 *
 * Endpoints: POST/GET/PUT /api/tenants + activate/deactivate/grant-access/revoke-access
 */

import { apiClient } from '../api-client'
import type {
  CreateTenantRequest,
  UpdateTenantRequest,
  Tenant,
  ListTenantsResponse,
  TenantApiResponse,
  GrantAccessRequest,
  RevokeAccessRequest,
  SuccessMessageResponse,
} from '../types/tenants.types'

/**
 * Cria um novo tenant (admin only)
 *
 * Endpoint: POST /api/tenants
 *
 * @param data Dados do tenant (code, name, email obrigatórios)
 * @returns Tenant criado
 *
 * @example
 * const tenant = await criarTenant({
 *   code: 'CLIENTE_02',
 *   name: 'Cliente Exemplo LTDA',
 *   email: 'contato@clienteexemplo.com.br',
 *   status: 'active'
 * });
 */
export async function criarTenant(
  data: CreateTenantRequest
): Promise<Tenant> {
  const response = await apiClient.post<TenantApiResponse>(
    '/api/tenants',
    data
  )
  return response.tenant
}

/**
 * Lista tenants com filtros opcionais
 *
 * Endpoint: GET /api/tenants?status=&limit=50&offset=0
 *
 * Admin: vê todos os tenants
 * Usuário normal: vê apenas tenants que tem acesso
 *
 * @param filters Filtros opcionais (status, paginação)
 * @returns Lista de tenants + total + paginação
 *
 * @example
 * const result = await listarTenants({
 *   status: 'active',
 *   limit: 20,
 *   offset: 0
 * });
 * console.log(result.total); // 10 tenants
 * console.log(result.tenants.length); // 10 (todos ativos)
 */
export async function listarTenants(filters?: {
  status?: 'active' | 'inactive'
  limit?: number
  offset?: number
}): Promise<ListTenantsResponse> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.limit) params.set('limit', filters.limit.toString())
  if (filters?.offset) params.set('offset', filters.offset.toString())

  const query = params.toString()
  const response = await apiClient.get<ListTenantsResponse>(
    `/api/tenants${query ? `?${query}` : ''}`
  )

  return response
}

/**
 * Busca um tenant por ID
 *
 * Endpoint: GET /api/tenants/:id
 *
 * @param id ID do tenant
 * @returns Tenant encontrado
 *
 * @example
 * const tenant = await buscarTenant(1);
 * console.log(tenant.code); // CLIENTE_01
 * console.log(tenant.name); // Prefeitura de Goiânia
 */
export async function buscarTenant(id: number): Promise<Tenant> {
  const response = await apiClient.get<TenantApiResponse>(
    `/api/tenants/${id}`
  )
  return response.tenant
}

/**
 * Atualiza um tenant existente (admin only)
 *
 * Endpoint: PUT /api/tenants/:id
 *
 * @param id ID do tenant
 * @param data Dados parciais para atualizar
 * @returns Tenant atualizado
 *
 * @example
 * const tenant = await atualizarTenant(1, {
 *   name: 'Prefeitura de Goiânia - Atualizado',
 *   email: 'novo-email@goiania.go.gov.br'
 * });
 */
export async function atualizarTenant(
  id: number,
  data: UpdateTenantRequest
): Promise<Tenant> {
  const response = await apiClient.put<TenantApiResponse>(
    `/api/tenants/${id}`,
    data
  )
  return response.tenant
}

/**
 * Ativa um tenant (admin only)
 *
 * Endpoint: POST /api/tenants/:id/activate
 *
 * @param id ID do tenant
 * @returns Tenant ativado + mensagem de sucesso
 *
 * @example
 * const result = await ativarTenant(1);
 * console.log(result.message); // "Tenant ativado com sucesso"
 * console.log(result.tenant.status); // "active"
 */
export async function ativarTenant(id: number): Promise<{
  message: string
  tenant: Tenant
}> {
  const response = await apiClient.post<SuccessMessageResponse & { tenant: Tenant }>(
    `/api/tenants/${id}/activate`,
    {}
  )
  return response
}

/**
 * Desativa um tenant (admin only)
 *
 * Endpoint: POST /api/tenants/:id/deactivate
 *
 * @param id ID do tenant
 * @returns Tenant desativado + mensagem de sucesso
 *
 * @example
 * const result = await desativarTenant(1);
 * console.log(result.message); // "Tenant desativado com sucesso"
 * console.log(result.tenant.status); // "inactive"
 */
export async function desativarTenant(id: number): Promise<{
  message: string
  tenant: Tenant
}> {
  const response = await apiClient.post<SuccessMessageResponse & { tenant: Tenant }>(
    `/api/tenants/${id}/deactivate`,
    {}
  )
  return response
}

/**
 * Concede acesso de um usuário a um tenant (admin only)
 *
 * Endpoint: POST /api/tenants/:id/grant-access
 *
 * @param id ID do tenant
 * @param data Email do usuário + role (admin, editor, viewer)
 * @returns Mensagem de sucesso
 *
 * @example
 * const message = await concederAcesso(1, {
 *   user_email: 'usuario@exemplo.com',
 *   role: 'editor'
 * });
 * console.log(message); // "Acesso concedido com sucesso"
 */
export async function concederAcesso(
  id: number,
  data: GrantAccessRequest
): Promise<string> {
  const response = await apiClient.post<SuccessMessageResponse>(
    `/api/tenants/${id}/grant-access`,
    data
  )
  return response.message
}

/**
 * Revoga acesso de um usuário a um tenant (admin only)
 *
 * Endpoint: POST /api/tenants/:id/revoke-access
 *
 * @param id ID do tenant
 * @param data Email do usuário
 * @returns Mensagem de sucesso
 *
 * @example
 * const message = await revogarAcesso(1, {
 *   user_email: 'usuario@exemplo.com'
 * });
 * console.log(message); // "Acesso revogado com sucesso"
 */
export async function revogarAcesso(
  id: number,
  data: RevokeAccessRequest
): Promise<string> {
  const response = await apiClient.post<SuccessMessageResponse>(
    `/api/tenants/${id}/revoke-access`,
    data
  )
  return response.message
}
