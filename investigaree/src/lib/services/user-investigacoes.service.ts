/**
 * User Investigacoes Service
 *
 * Service layer para gerenciar investigações de usuários (CRUD completo)
 * Integração com endpoints do Agent 2 (backend persistence API)
 *
 * Endpoints: POST/GET/PUT/DELETE /api/investigacoes
 */

import { apiClient } from '../api-client'
import type {
  CreateInvestigacaoRequest,
  UpdateInvestigacaoRequest,
  Investigacao,
  ListInvestigacoesResponse,
  InvestigacaoApiResponse,
} from '../types/user-investigacoes.types'

/**
 * Cria uma nova investigação
 *
 * Endpoint: POST /api/investigacoes
 *
 * @param data Dados da investigação (nome e documento obrigatórios)
 * @returns Investigação criada
 *
 * @example
 * const investigacao = await criarInvestigacao({
 *   nome: 'João Silva',
 *   documento: '12345678900',
 *   tipo_pessoa: 'fisica',
 *   categoria: 'funcionarios',
 *   status: 'investigar',
 *   nivel_urgencia: 'media'
 * });
 */
export async function criarInvestigacao(
  data: CreateInvestigacaoRequest
): Promise<Investigacao> {
  const response = await apiClient.post<InvestigacaoApiResponse>(
    '/api/investigacoes',
    data
  )
  return response.investigacao
}

/**
 * Lista investigações com filtros opcionais
 *
 * Endpoint: GET /api/investigacoes?status=&categoria=&limit=50&offset=0
 *
 * @param filters Filtros opcionais (status, categoria, paginação)
 * @returns Lista de investigações + total + paginação
 *
 * @example
 * const result = await listarInvestigacoes({
 *   status: 'investigando',
 *   categoria: 'funcionarios',
 *   limit: 20,
 *   offset: 0
 * });
 * console.log(result.total); // 145 investigações
 * console.log(result.investigacoes.length); // 20 (página atual)
 */
export async function listarInvestigacoes(filters?: {
  status?: 'investigar' | 'investigando' | 'relatorio' | 'monitoramento' | 'aprovado' | 'bloqueado'
  categoria?: 'familia' | 'clientes' | 'funcionarios' | 'relacionamentos' | 'empresas'
  limit?: number
  offset?: number
}): Promise<ListInvestigacoesResponse> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.categoria) params.set('categoria', filters.categoria)
  if (filters?.limit) params.set('limit', filters.limit.toString())
  if (filters?.offset) params.set('offset', filters.offset.toString())

  const query = params.toString()
  const response = await apiClient.get<ListInvestigacoesResponse>(
    `/api/investigacoes${query ? `?${query}` : ''}`
  )

  return response
}

/**
 * Busca uma investigação por ID
 *
 * Endpoint: GET /api/investigacoes/:id
 *
 * @param id ID da investigação
 * @returns Investigação encontrada
 *
 * @example
 * const investigacao = await buscarInvestigacao(123);
 * console.log(investigacao.nome); // João Silva
 * console.log(investigacao.status); // investigando
 */
export async function buscarInvestigacao(id: number): Promise<Investigacao> {
  const response = await apiClient.get<InvestigacaoApiResponse>(
    `/api/investigacoes/${id}`
  )
  return response.investigacao
}

/**
 * Atualiza uma investigação existente
 *
 * Endpoint: PUT /api/investigacoes/:id
 *
 * @param id ID da investigação
 * @param data Dados parciais para atualizar
 * @returns Investigação atualizada
 *
 * @example
 * const investigacao = await atualizarInvestigacao(123, {
 *   status: 'relatorio',
 *   observacoes: 'Investigação concluída com sucesso'
 * });
 */
export async function atualizarInvestigacao(
  id: number,
  data: UpdateInvestigacaoRequest
): Promise<Investigacao> {
  const response = await apiClient.put<InvestigacaoApiResponse>(
    `/api/investigacoes/${id}`,
    data
  )
  return response.investigacao
}

/**
 * Deleta uma investigação
 *
 * Endpoint: DELETE /api/investigacoes/:id
 *
 * @param id ID da investigação
 * @returns Mensagem de sucesso
 *
 * @example
 * const message = await deletarInvestigacao(123);
 * console.log(message); // "Investigação deletada com sucesso"
 */
export async function deletarInvestigacao(id: number): Promise<string> {
  const response = await apiClient.delete<{ success: boolean; message: string }>(
    `/api/investigacoes/${id}`
  )
  return response.message
}
