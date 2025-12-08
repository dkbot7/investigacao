/**
 * OFAC - Office of Foreign Assets Control
 * Serviço para verificar SDN List (Specially Designated Nationals)
 *
 * Fonte: U.S. Department of the Treasury
 * URL: https://ofac.treasury.gov/sanctions-list-service
 * XML: https://www.treasury.gov/ofac/downloads/sdn.xml
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

import { logger } from '../../utils/logger';

// ============================================================================
// INTERFACES
// ============================================================================

export interface OFACMatch {
  ent_num: string; // Entity number (ID único)
  sdn_name: string; // Nome na lista
  sdn_type: string; // Individual, Entity, Vessel, Aircraft
  programs: string[]; // Programas de sanção
  remarks: string; // Observações
  score: number; // Score de similaridade (0-100)
}

export interface OFACVerificationResult {
  nome: string;
  encontrado: boolean;
  matches: OFACMatch[];
  nivel_risco: 'baixo' | 'medio' | 'alto' | 'critico';
  verificado_em: string;
}

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const OFAC_SDN_XML_URL = 'https://www.treasury.gov/ofac/downloads/sdn.xml';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Normalizar nome para comparação
 *
 * Remove acentos, converte para minúsculas, remove caracteres especiais.
 */
function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove especiais
    .trim();
}

/**
 * Calcular similaridade entre dois nomes (algoritmo Levenshtein simplificado)
 *
 * Retorna score de 0-100 (100 = match perfeito)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeName(str1);
  const s2 = normalizeName(str2);

  // Match exato
  if (s1 === s2) return 100;

  // Contém
  if (s1.includes(s2) || s2.includes(s1)) return 80;

  // Levenshtein distance simplificado
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 100;

  let distance = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer[i] !== shorter[i]) distance++;
  }
  distance += longer.length - shorter.length;

  const similarity = ((longer.length - distance) / longer.length) * 100;
  return Math.round(similarity);
}

/**
 * Parse XML da SDN List
 *
 * Extrai registros do XML OFAC.
 */
function parseSDNXML(xmlText: string): OFACMatch[] {
  const records: OFACMatch[] = [];

  try {
    // Regex para extrair registros (simplificado - em produção usar XML parser)
    const sdnEntryRegex = /<sdnEntry>([\s\S]*?)<\/sdnEntry>/g;
    const matches = xmlText.matchAll(sdnEntryRegex);

    for (const match of matches) {
      const entry = match[1];

      // Extrair campos
      const uid = entry.match(/<uid>(\d+)<\/uid>/)?.[1] || '';
      const firstName = entry.match(/<firstName>(.*?)<\/firstName>/)?.[1] || '';
      const lastName = entry.match(/<lastName>(.*?)<\/lastName>/)?.[1] || '';
      const title = entry.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const sdnType = entry.match(/<sdnType>(.*?)<\/sdnType>/)?.[1] || '';
      const remarks = entry.match(/<remarks>(.*?)<\/remarks>/)?.[1] || '';

      // Programas
      const programsRegex = /<program>(.*?)<\/program>/g;
      const programMatches = entry.matchAll(programsRegex);
      const programs: string[] = [];
      for (const pm of programMatches) {
        programs.push(pm[1]);
      }

      const fullName = [firstName, lastName, title].filter(Boolean).join(' ');

      if (fullName) {
        records.push({
          ent_num: uid,
          sdn_name: fullName,
          sdn_type: sdnType,
          programs,
          remarks,
          score: 0, // Será calculado na verificação
        });
      }
    }

    logger.info('[OFAC] SDN List parsed:', { total: records.length });
    return records;
  } catch (error: any) {
    logger.error('[OFAC] Erro ao parse XML:', error);
    throw error;
  }
}

// ============================================================================
// CACHE DA SDN LIST
// ============================================================================

let sdnListCache: OFACMatch[] | null = null;
let cacheTimestamp: number | null = null;

/**
 * Obter SDN List (com cache)
 *
 * Download e parse do XML OFAC. Cache de 7 dias.
 */
async function getSDNList(): Promise<OFACMatch[]> {
  const now = Date.now();

  // Verificar cache
  if (sdnListCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    logger.info('[OFAC] Usando cache da SDN List');
    return sdnListCache;
  }

  // Download XML
  logger.info('[OFAC] Downloading SDN List XML...');
  const response = await fetch(OFAC_SDN_XML_URL);

  if (!response.ok) {
    throw new Error(`Failed to download OFAC SDN List: ${response.status}`);
  }

  const xmlText = await response.text();
  const records = parseSDNXML(xmlText);

  // Atualizar cache
  sdnListCache = records;
  cacheTimestamp = now;

  return records;
}

// ============================================================================
// VERIFICAÇÃO
// ============================================================================

/**
 * Verificar nome contra OFAC SDN List
 *
 * Busca matches por similaridade de nome.
 * Threshold mínimo: 70% de similaridade.
 *
 * @param nome Nome da pessoa/empresa para verificar
 * @param threshold Score mínimo de similaridade (0-100)
 * @returns Resultado da verificação
 */
export async function verificarOFAC(
  nome: string,
  threshold: number = 70
): Promise<OFACVerificationResult> {
  try {
    const sdnList = await getSDNList();

    // Buscar matches
    const matches: OFACMatch[] = [];

    for (const record of sdnList) {
      const score = calculateSimilarity(nome, record.sdn_name);

      if (score >= threshold) {
        matches.push({
          ...record,
          score,
        });
      }
    }

    // Ordenar por score (maior primeiro)
    matches.sort((a, b) => b.score - a.score);

    // Determinar nível de risco
    let nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico' = 'baixo';
    if (matches.length > 0) {
      const bestScore = matches[0].score;
      if (bestScore >= 95) nivelRisco = 'critico';
      else if (bestScore >= 85) nivelRisco = 'alto';
      else if (bestScore >= 70) nivelRisco = 'medio';
    }

    logger.info('[OFAC] Verificação realizada:', {
      nome,
      matches: matches.length,
      nivel_risco: nivelRisco,
    });

    return {
      nome,
      encontrado: matches.length > 0,
      matches,
      nivel_risco: nivelRisco,
      verificado_em: new Date().toISOString(),
    };
  } catch (error: any) {
    logger.error('[OFAC] Erro ao verificar:', error);
    throw error;
  }
}

/**
 * Sincronizar SDN List com banco D1
 *
 * Salva lista completa no D1 para consultas mais rápidas.
 * Deve ser executado semanalmente via cron.
 */
export async function syncSDNListToDB(db: any): Promise<number> {
  try {
    logger.info('[OFAC] Starting SDN List sync to D1...');

    const sdnList = await getSDNList();

    // Limpar tabela
    await db.exec('DELETE FROM ofac_sdn_list');

    // Inserir registros
    let inserted = 0;
    for (const record of sdnList) {
      await db.prepare(`
        INSERT INTO ofac_sdn_list (
          ent_num, sdn_name, sdn_type, programs, full_data
        ) VALUES (?, ?, ?, ?, ?)
      `).bind(
        record.ent_num,
        record.sdn_name,
        record.sdn_type,
        JSON.stringify(record.programs),
        JSON.stringify(record)
      ).run();

      inserted++;
    }

    logger.info('[OFAC] SDN List synced to D1:', { inserted });
    return inserted;
  } catch (error: any) {
    logger.error('[OFAC] Erro ao sync SDN List:', error);
    throw error;
  }
}

/**
 * Verificar OFAC usando banco D1 (mais rápido)
 *
 * Busca na tabela local ao invés de baixar XML.
 */
export async function verificarOFACFromDB(
  db: any,
  nome: string,
  threshold: number = 70
): Promise<OFACVerificationResult> {
  try {
    // Buscar todos os registros (ou implementar busca fuzzy no SQL)
    const { results } = await db.prepare(
      'SELECT * FROM ofac_sdn_list'
    ).all();

    if (!results || results.length === 0) {
      // Se tabela vazia, usar método padrão
      logger.warn('[OFAC] Tabela vazia, usando download XML');
      return verificarOFAC(nome, threshold);
    }

    const matches: OFACMatch[] = [];

    for (const record of results) {
      const score = calculateSimilarity(nome, record.sdn_name);

      if (score >= threshold) {
        matches.push({
          ent_num: record.ent_num,
          sdn_name: record.sdn_name,
          sdn_type: record.sdn_type,
          programs: JSON.parse(record.programs || '[]'),
          remarks: JSON.parse(record.full_data || '{}').remarks || '',
          score,
        });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    let nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico' = 'baixo';
    if (matches.length > 0) {
      const bestScore = matches[0].score;
      if (bestScore >= 95) nivelRisco = 'critico';
      else if (bestScore >= 85) nivelRisco = 'alto';
      else if (bestScore >= 70) nivelRisco = 'medio';
    }

    return {
      nome,
      encontrado: matches.length > 0,
      matches,
      nivel_risco: nivelRisco,
      verificado_em: new Date().toISOString(),
    };
  } catch (error: any) {
    logger.error('[OFAC] Erro ao verificar from DB:', error);
    throw error;
  }
}
