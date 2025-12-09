/**
 * Kanban Service - Frontend Integration
 *
 * Conecta o frontend Next.js com os endpoints do Kanban no backend (Cloudflare Workers)
 *
 * Agent 3 - Full-Stack Developer
 * Data: 2025-12-09
 * FASE 1: Implementação Kanban
 *
 * Baseado em melhores práticas 2025:
 * - [Mastering REST API Design](https://medium.com/@syedabdullahrahman/mastering-rest-api-design-essential-best-practices-dos-and-don-ts-for-2024-dd41a2c59133)
 * - [Building a Powerful Kanban Board with React](https://ones.com/blog/building-powerful-kanban-board-application-react-js/)
 * - [Top Drag-and-Drop Libraries for React 2025](https://puckeditor.com/blog/top-5-drag-and-drop-libraries-for-react)
 */

import { apiClient } from '../api-client';

// ============================================================================
// TYPES
// ============================================================================

export type InvestigationStatus =
  | 'investigar'
  | 'investigando'
  | 'relatorio'
  | 'monitoramento'
  | 'aprovado'
  | 'bloqueado';

export type CardType =
  | 'funcionario'
  | 'consulta_cpf'
  | 'consulta_cnpj'
  | 'consulta_divida';

export type ApiType =
  | 'cpf'
  | 'cnpj_basica'
  | 'cnpj_qsa'
  | 'cnpj_empresa'
  | 'divida';

export interface KanbanCard {
  id: number;
  tenant_code: string;
  cpf?: string;
  cnpj?: string;
  nome_importado?: string;
  grupo?: string;
  cargo?: string;
  salario?: number;
  tipo: CardType;
  status_investigacao: InvestigationStatus;
  metadata?: string | Record<string, any>;
  custo: number;
  consultado_em?: string;
  observacoes?: string;
  arquivado: number;
  created_at: string;
  updated_at: string;
  // Campos enriquecidos
  esta_morto?: number;
  ano_obito?: number;
  recebe_beneficio?: number;
  socio_empresa?: number;
  qtd_empresas?: number;
  doador_campanha?: number;
  valor_doacoes?: number;
  candidato?: number;
  sancionado_ceis?: number;
  sancionado_ofac?: number;
}

export interface ListCardsParams {
  status?: InvestigationStatus;
  tipo?: CardType;
  tenant_code: string;
  search?: string;
  limit?: number;
  offset?: number;
  arquivado?: 0 | 1;
}

export interface ListCardsResponse {
  success: boolean;
  cards: KanbanCard[];
  total: number;
  by_status: Record<InvestigationStatus, number>;
  limit: number;
  offset: number;
}

export interface CreateCardParams {
  tipo: CardType;
  cpf?: string;
  cnpj?: string;
  nome?: string;
  grupo?: string;
  cargo?: string;
  salario?: number;
  metadata?: Record<string, any>;
  observacoes?: string;
}

export interface UpdateCardParams {
  nome_importado?: string;
  grupo?: string;
  cargo?: string;
  salario?: number;
  status_investigacao?: InvestigationStatus;
  observacoes?: string;
  metadata?: Record<string, any>;
}

export interface MoveCardParams {
  from: InvestigationStatus;
  to: InvestigationStatus;
}

export interface ConsultCardParams {
  api_type: ApiType;
}

export interface KanbanStats {
  success: boolean;
  by_status: Array<{
    status_investigacao: InvestigationStatus;
    count: number;
    total_cost: number;
    avg_cost: number;
  }>;
  totals: {
    total_cards: number;
    total_cost: number;
    total_tenants: number;
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Listar cards do Kanban com filtros
 */
export async function listKanbanCards(params: ListCardsParams): Promise<ListCardsResponse> {
  const queryParams = new URLSearchParams();

  if (params.status) queryParams.append('status', params.status);
  if (params.tipo) queryParams.append('tipo', params.tipo);
  if (params.tenant_code) queryParams.append('tenant_code', params.tenant_code);
  if (params.search) queryParams.append('search', params.search);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.offset) queryParams.append('offset', params.offset.toString());
  if (params.arquivado !== undefined) queryParams.append('arquivado', params.arquivado.toString());

  const response = await apiClient.get(`/api/kanban/cards?${queryParams.toString()}`);
  return response as ListCardsResponse;
}

/**
 * Buscar um card específico
 */
export async function getKanbanCard(cardId: number): Promise<{ success: boolean; card: KanbanCard & { consult_history: any[] } }> {
  const response = await apiClient.get(`/api/kanban/cards/${cardId}`);
  return response as { success: boolean; card: KanbanCard & { consult_history: any[] } };
}

/**
 * Criar novo card manualmente
 */
export async function createKanbanCard(
  params: CreateCardParams,
  tenantCode: string
): Promise<{ success: boolean; card: KanbanCard }> {
  const response = await apiClient.post('/api/kanban/cards', params, {
    tenantCode,
  });
  return response as { success: boolean; card: KanbanCard };
}

/**
 * Atualizar um card
 */
export async function updateKanbanCard(
  cardId: number,
  params: UpdateCardParams
): Promise<{ success: boolean; card: KanbanCard }> {
  const response = await apiClient.put(`/api/kanban/cards/${cardId}`, params);
  return response as { success: boolean; card: KanbanCard };
}

/**
 * Mover card entre colunas (drag & drop)
 */
export async function moveKanbanCard(
  cardId: number,
  params: MoveCardParams
): Promise<{ success: boolean; card: KanbanCard; message: string }> {
  const response = await apiClient.patch(`/api/kanban/cards/${cardId}/move`, params);
  return response as { success: boolean; card: KanbanCard; message: string };
}

/**
 * Arquivar card (soft delete)
 */
export async function archiveKanbanCard(cardId: number): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete(`/api/kanban/cards/${cardId}`);
  return response as { success: boolean; message: string };
}

/**
 * Deletar card permanentemente (apenas admin)
 */
export async function deleteKanbanCard(cardId: number): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete(`/api/kanban/cards/${cardId}?hard=true`);
  return response as { success: boolean; message: string };
}

/**
 * Executar consulta SERPRO no card
 */
export async function consultKanbanCard(
  cardId: number,
  params: ConsultCardParams
): Promise<{
  success: boolean;
  card: KanbanCard;
  consult_result: any;
  cost: number;
}> {
  const response = await apiClient.post(`/api/kanban/cards/${cardId}/consult`, params);
  return response as { success: boolean; card: KanbanCard; consult_result: any; cost: number };
}

/**
 * Obter estatísticas do Kanban
 */
export async function getKanbanStats(tenantCode?: string): Promise<KanbanStats> {
  const queryParams = tenantCode ? `?tenant_code=${tenantCode}` : '';
  const response = await apiClient.get(`/api/kanban/stats${queryParams}`);
  return response as KanbanStats;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validar transição de status
 * Baseado no workflow: investigar → investigando → relatorio → monitoramento → (aprovado | bloqueado)
 */
export function isValidStatusTransition(from: InvestigationStatus, to: InvestigationStatus): boolean {
  const validTransitions: Record<InvestigationStatus, InvestigationStatus[]> = {
    investigar: ['investigando', 'bloqueado'],
    investigando: ['investigar', 'relatorio', 'bloqueado'],
    relatorio: ['investigando', 'monitoramento', 'bloqueado'],
    monitoramento: ['relatorio', 'aprovado', 'bloqueado'],
    aprovado: ['monitoramento'], // Pode voltar para monitoramento se necessário
    bloqueado: ['investigar'], // Pode desbloquear para re-investigar
  };

  return validTransitions[from]?.includes(to) || false;
}

/**
 * Formatar CPF para exibição
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
  }
  return cpf;
}

/**
 * Formatar CNPJ para exibição
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length === 14) {
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/${cleaned.substring(8, 12)}-${cleaned.substring(12)}`;
  }
  return cnpj;
}

/**
 * Obter nome do tipo de card
 */
export function getCardTypeName(tipo: CardType): string {
  const names: Record<CardType, string> = {
    funcionario: 'Funcionário',
    consulta_cpf: 'Consulta CPF',
    consulta_cnpj: 'Consulta CNPJ',
    consulta_divida: 'Consulta Dívida',
  };
  return names[tipo] || tipo;
}

/**
 * Obter nome do status de investigação
 */
export function getStatusName(status: InvestigationStatus): string {
  const names: Record<InvestigationStatus, string> = {
    investigar: 'Investigar',
    investigando: 'Investigando',
    relatorio: 'Relatório',
    monitoramento: 'Monitoramento',
    aprovado: 'Aprovado',
    bloqueado: 'Bloqueado',
  };
  return names[status] || status;
}

/**
 * Obter cor do status
 */
export function getStatusColor(status: InvestigationStatus): {
  text: string;
  bg: string;
  border: string;
} {
  const colors: Record<InvestigationStatus, { text: string; bg: string; border: string }> = {
    investigar: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    investigando: {
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    relatorio: {
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
    },
    monitoramento: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
    },
    aprovado: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    bloqueado: {
      text: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
    },
  };
  return colors[status] || colors.investigar;
}
