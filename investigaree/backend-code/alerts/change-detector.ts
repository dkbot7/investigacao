/**
 * Change Detector - Detecta mudanças em investigações
 *
 * Compara snapshot anterior com dados atuais e identifica alterações críticas
 */

import { Env } from '../types';

export interface Change {
  type: 'ceis_entry' | 'processo_novo' | 'vinculo_mudanca' | 'cnep_entry' | 'obito';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  oldValue: any;
  newValue: any;
}

/**
 * Verifica mudanças em uma investigação comparando com snapshot anterior
 */
export async function checkInvestigationChanges(
  env: Env,
  investigationId: string,
  tenantId: string,
  currentData: any,
  enabledAlertTypes: string[]
): Promise<Change[]> {
  const changes: Change[] = [];

  // 1. Buscar último snapshot
  const snapshot = await env.DB.prepare(
    `SELECT snapshot_data, created_at
     FROM investigation_snapshots
     WHERE investigation_id = ?
     ORDER BY created_at DESC
     LIMIT 1`
  ).bind(investigationId).first<{ snapshot_data: string; created_at: number }>();

  // Se não há snapshot, criar um e retornar vazio
  if (!snapshot) {
    await createSnapshot(env, investigationId, tenantId, currentData);
    return changes;
  }

  const oldData = JSON.parse(snapshot.snapshot_data);

  // 2. Verificar mudanças por tipo de alerta
  if (enabledAlertTypes.includes('ceis_entry')) {
    const ceisChanges = detectCEISChanges(oldData, currentData);
    changes.push(...ceisChanges);
  }

  if (enabledAlertTypes.includes('processo_novo')) {
    const processoChanges = detectProcessoChanges(oldData, currentData);
    changes.push(...processoChanges);
  }

  if (enabledAlertTypes.includes('vinculo_mudanca')) {
    const vinculoChanges = detectVinculoChanges(oldData, currentData);
    changes.push(...vinculoChanges);
  }

  if (enabledAlertTypes.includes('cnep_entry')) {
    const cnepChanges = detectCNEPChanges(oldData, currentData);
    changes.push(...cnepChanges);
  }

  if (enabledAlertTypes.includes('obito')) {
    const obitoChange = detectObitoChange(oldData, currentData);
    if (obitoChange) changes.push(obitoChange);
  }

  // 3. Se houve mudanças, atualizar snapshot
  if (changes.length > 0) {
    await createSnapshot(env, investigationId, tenantId, currentData);
  }

  return changes;
}

/**
 * Detecta novas entradas em CEIS
 */
function detectCEISChanges(oldData: any, newData: any): Change[] {
  const oldCeis = oldData.ceis || [];
  const newCeis = newData.ceis || [];

  if (newCeis.length > oldCeis.length) {
    const newEntries = newCeis.slice(oldCeis.length);

    return newEntries.map((entry: any) => ({
      type: 'ceis_entry' as const,
      severity: 'critical' as const,
      title: 'Novo Registro CEIS Detectado',
      description: `Pessoa foi incluída no Cadastro de Empresas Inidôneas e Suspensas (CEIS). Órgão: ${entry.orgao || 'N/A'}`,
      oldValue: { count: oldCeis.length },
      newValue: { count: newCeis.length, new: entry }
    }));
  }

  return [];
}

/**
 * Detecta novos processos judiciais
 */
function detectProcessoChanges(oldData: any, newData: any): Change[] {
  const oldProcessos = oldData.processos || [];
  const newProcessos = newData.processos || [];

  if (newProcessos.length > oldProcessos.length) {
    const newEntries = newProcessos.slice(oldProcessos.length);

    return newEntries.map((processo: any) => ({
      type: 'processo_novo' as const,
      severity: 'high' as const,
      title: 'Novo Processo Judicial',
      description: `Novo processo identificado. Tribunal: ${processo.tribunal || 'N/A'}. Tipo: ${processo.tipo || 'N/A'}`,
      oldValue: { count: oldProcessos.length },
      newValue: { count: newProcessos.length, new: processo }
    }));
  }

  return [];
}

/**
 * Detecta mudanças em vínculos empresariais
 */
function detectVinculoChanges(oldData: any, newData: any): Change[] {
  const oldVinculos = oldData.vinculos || [];
  const newVinculos = newData.vinculos || [];

  if (newVinculos.length !== oldVinculos.length) {
    return [{
      type: 'vinculo_mudanca' as const,
      severity: 'medium' as const,
      title: 'Mudança em Vínculos Empresariais',
      description: `Vínculos empresariais alterados. Anterior: ${oldVinculos.length}, Atual: ${newVinculos.length}`,
      oldValue: { count: oldVinculos.length, vinculos: oldVinculos },
      newValue: { count: newVinculos.length, vinculos: newVinculos }
    }];
  }

  return [];
}

/**
 * Detecta novas entradas em CNEP
 */
function detectCNEPChanges(oldData: any, newData: any): Change[] {
  const oldCnep = oldData.cnep || [];
  const newCnep = newData.cnep || [];

  if (newCnep.length > oldCnep.length) {
    const newEntries = newCnep.slice(oldCnep.length);

    return newEntries.map((entry: any) => ({
      type: 'cnep_entry' as const,
      severity: 'critical' as const,
      title: 'Novo Registro CNEP Detectado',
      description: `Pessoa foi incluída no Cadastro Nacional de Empresas Punidas (CNEP). Sanção: ${entry.tipo_sancao || 'N/A'}`,
      oldValue: { count: oldCnep.length },
      newValue: { count: newCnep.length, new: entry }
    }));
  }

  return [];
}

/**
 * Detecta óbito
 */
function detectObitoChange(oldData: any, newData: any): Change | null {
  const oldObito = oldData.obito || false;
  const newObito = newData.obito || false;

  if (!oldObito && newObito) {
    return {
      type: 'obito' as const,
      severity: 'critical' as const,
      title: 'Óbito Registrado',
      description: 'Foi identificado registro de óbito para a pessoa investigada.',
      oldValue: { obito: false },
      newValue: { obito: true, data: newData.data_obito }
    };
  }

  return null;
}

/**
 * Cria snapshot do estado atual da investigação
 */
async function createSnapshot(
  env: Env,
  investigationId: string,
  tenantId: string,
  data: any
): Promise<void> {
  const snapshotId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  await env.DB.prepare(
    `INSERT INTO investigation_snapshots (id, investigation_id, tenant_id, snapshot_data, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(
    snapshotId,
    investigationId,
    tenantId,
    JSON.stringify(data),
    now
  ).run();
}
