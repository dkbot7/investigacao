/**
 * localStorage utilities for DEV mode
 * Used to persist investigations locally when API is not available
 */

import { Investigacao, InvestigacaoStats, CreateInvestigacaoData } from '@/hooks/useInvestigations'

const STORAGE_KEY = 'investigaree_dev_investigations'

/**
 * Get all investigations from localStorage
 */
export function getLocalInvestigations(userId: string): Investigacao[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    if (!stored) return []

    const data = JSON.parse(stored)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return []
  }
}

/**
 * Save investigation to localStorage
 */
export function saveLocalInvestigation(userId: string, data: CreateInvestigacaoData): Investigacao {
  if (typeof window === 'undefined') {
    throw new Error('localStorage is not available')
  }

  // Get existing investigations
  const existing = getLocalInvestigations(userId)

  // Create new investigation with proper structure
  const newInvestigation: Investigacao = {
    id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    nome: data.nome,
    documento: data.documento,
    tipo_pessoa: data.tipo_pessoa || 'fisica',
    is_grupo: data.is_grupo || false,
    grupo_nome: data.grupo_nome,
    grupo_total_documentos: data.grupo_total_documentos || 1,
    categoria: data.categoria || 'funcionarios',
    status: 'investigar',
    nivel_urgencia: data.nivel_urgencia || 'media',
    email: data.email,
    telefones: data.telefones,
    endereco: data.endereco,
    motivo_investigacao: data.motivo_investigacao,
    observacoes: data.observacoes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Add to beginning of array (most recent first)
  const updated = [newInvestigation, ...existing]

  // Save back to localStorage
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(updated))
    console.log('[DEV MODE] Investigation saved to localStorage:', newInvestigation)
    return newInvestigation
  } catch (error) {
    console.error('Error saving to localStorage:', error)
    throw new Error('Failed to save investigation to localStorage')
  }
}

/**
 * Update investigation in localStorage
 */
export function updateLocalInvestigation(userId: string, id: string, updates: Partial<Investigacao>): void {
  if (typeof window === 'undefined') return

  const existing = getLocalInvestigations(userId)
  const index = existing.findIndex(inv => inv.id === id)

  if (index === -1) {
    console.warn(`Investigation ${id} not found in localStorage`)
    return
  }

  existing[index] = {
    ...existing[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(existing))
    console.log('[DEV MODE] Investigation updated in localStorage:', id)
  } catch (error) {
    console.error('Error updating localStorage:', error)
  }
}

/**
 * Delete investigation from localStorage
 */
export function deleteLocalInvestigation(userId: string, id: string): void {
  if (typeof window === 'undefined') return

  const existing = getLocalInvestigations(userId)
  const filtered = existing.filter(inv => inv.id !== id)

  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(filtered))
    console.log('[DEV MODE] Investigation deleted from localStorage:', id)
  } catch (error) {
    console.error('Error deleting from localStorage:', error)
  }
}

/**
 * Calculate stats from localStorage investigations
 */
export function getLocalStats(userId: string): InvestigacaoStats {
  const investigations = getLocalInvestigations(userId)

  return {
    total: investigations.length,
    em_andamento: investigations.filter(inv =>
      inv.status === 'investigar' || inv.status === 'investigando'
    ).length,
    com_relatorio: investigations.filter(inv =>
      inv.status === 'relatorio' && inv.relatorio_url
    ).length,
    concluidas: investigations.filter(inv =>
      inv.status === 'aprovado' || inv.status === 'monitoramento'
    ).length,
    bloqueadas: investigations.filter(inv =>
      inv.status === 'bloqueado'
    ).length,
  }
}

/**
 * Clear all investigations from localStorage (for testing)
 */
export function clearLocalInvestigations(userId: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(`${STORAGE_KEY}_${userId}`)
    console.log('[DEV MODE] All investigations cleared from localStorage')
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}
