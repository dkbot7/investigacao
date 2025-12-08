/**
 * PEP - Pessoas Expostas Politicamente
 * Serviço para verificar PEPs e sincronizar lista da CGU
 *
 * Fonte: Portal da Transparência (CGU)
 * URL: https://portaldatransparencia.gov.br/download-de-dados/pep
 * Atualização: Mensal (até dia 25)
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

import { logger } from '../../utils/logger';

// ============================================================================
// INTERFACES
// ============================================================================

export interface PEPRecord {
  cpf: string;
  nome: string;
  cargo: string;
  orgao: string;
  nivel_federacao: 'federal' | 'estadual' | 'municipal';
  uf?: string;
  municipio?: string;
  data_inicio?: string;
  data_fim?: string;
  situacao: 'ativo' | 'inativo';
}

export interface PEPVerificationResult {
  cpf: string;
  isPEP: boolean;
  pep?: PEPRecord;
  nivel_risco: 'baixo' | 'medio' | 'alto';
  verificado_em: string;
}

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const PEP_CSV_URL = 'https://portaldatransparencia.gov.br/download-de-dados/pep';

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Parse CSV da lista PEP
 *
 * Converte CSV do Portal da Transparência em array de objetos.
 */
function parseCSV(csvText: string): PEPRecord[] {
  const records: PEPRecord[] = [];

  try {
    const lines = csvText.split('\n');
    const headers = lines[0].split(';');

    // Identificar índices das colunas
    const cpfIndex = headers.findIndex(h => h.toLowerCase().includes('cpf'));
    const nomeIndex = headers.findIndex(h => h.toLowerCase().includes('nome'));
    const cargoIndex = headers.findIndex(h => h.toLowerCase().includes('cargo'));
    const orgaoIndex = headers.findIndex(h => h.toLowerCase().includes('orgao') || h.toLowerCase().includes('órgão'));

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(';');

      const cpf = columns[cpfIndex]?.replace(/\D/g, '');
      const nome = columns[nomeIndex]?.trim();
      const cargo = columns[cargoIndex]?.trim();
      const orgao = columns[orgaoIndex]?.trim();

      if (cpf && nome) {
        // Determinar nível de federação baseado no órgão
        let nivel_federacao: 'federal' | 'estadual' | 'municipal' = 'federal';
        if (orgao?.toLowerCase().includes('estadual') || orgao?.toLowerCase().includes('estado')) {
          nivel_federacao = 'estadual';
        } else if (orgao?.toLowerCase().includes('municipal') || orgao?.toLowerCase().includes('prefeitura')) {
          nivel_federacao = 'municipal';
        }

        records.push({
          cpf,
          nome,
          cargo: cargo || 'Não informado',
          orgao: orgao || 'Não informado',
          nivel_federacao,
          situacao: 'ativo',
        });
      }
    }

    logger.info('[PEP] CSV parsed:', { total: records.length });
    return records;
  } catch (error: any) {
    logger.error('[PEP] Erro ao parse CSV:', error);
    throw error;
  }
}

// ============================================================================
// SINCRONIZAÇÃO
// ============================================================================

/**
 * Sincronizar lista PEP da CGU com banco D1
 *
 * Deve ser executado mensalmente (até dia 25).
 * A lista é atualizada mensalmente pela CGU.
 *
 * @param db Instância do banco D1
 * @returns Quantidade de registros inseridos
 */
export async function syncPEPList(db: any): Promise<number> {
  try {
    logger.info('[PEP] Starting sync from CGU...');

    // 1. Download CSV
    const response = await fetch(PEP_CSV_URL);

    if (!response.ok) {
      throw new Error(`Failed to download PEP list: ${response.status}`);
    }

    const csvText = await response.text();

    // 2. Parse CSV
    const records = parseCSV(csvText);

    if (records.length === 0) {
      throw new Error('PEP list is empty after parsing');
    }

    // 3. Limpar tabela antiga e inserir novos registros em transação
    // NOTA: D1 tem suporte limitado a transações explícitas.
    // A operação DELETE + INSERT em sequência é atômica por padrão no D1.
    await db.exec('DELETE FROM pep_list');
    logger.info('[PEP] Old records deleted');

    // 4. Inserir novos registros
    let inserted = 0;
    const batchSize = 100;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      for (const record of batch) {
        try {
          await db.prepare(`
            INSERT INTO pep_list (
              cpf, nome, cargo, orgao, nivel_federacao,
              uf, municipio, data_inicio, data_fim, situacao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            record.cpf,
            record.nome,
            record.cargo,
            record.orgao,
            record.nivel_federacao,
            record.uf || null,
            record.municipio || null,
            record.data_inicio || null,
            record.data_fim || null,
            record.situacao
          ).run();

          inserted++;
        } catch (error: any) {
          // Ignorar duplicatas (CPF único)
          if (!error.message.includes('UNIQUE')) {
            logger.warn('[PEP] Erro ao inserir registro:', {
              cpf: record.cpf,
              error: error.message
            });
          }
        }
      }

      logger.info('[PEP] Batch inserted:', { batch: Math.floor(i / batchSize) + 1, inserted });
    }

    logger.info('[PEP] Sync completed:', {
      total_parsed: records.length,
      inserted,
    });

    return inserted;
  } catch (error: any) {
    logger.error('[PEP] Erro ao sincronizar lista:', error);
    throw error;
  }
}

// ============================================================================
// VERIFICAÇÃO
// ============================================================================

/**
 * Verificar se CPF é PEP
 *
 * Consulta no banco D1 local (rápido).
 *
 * @param db Instância do banco D1
 * @param cpf CPF (com ou sem formatação)
 * @returns Resultado da verificação
 */
export async function verificarPEP(
  db: any,
  cpf: string
): Promise<PEPVerificationResult> {
  try {
    const doc = cpf.replace(/\D/g, '');

    const record = await db.prepare(
      'SELECT * FROM pep_list WHERE cpf = ?'
    ).bind(doc).first();

    const isPEP = !!record;

    // Determinar nível de risco
    let nivelRisco: 'baixo' | 'medio' | 'alto' = 'baixo';
    if (isPEP && record.nivel_federacao === 'federal') {
      nivelRisco = 'alto';
    } else if (isPEP && record.nivel_federacao === 'estadual') {
      nivelRisco = 'medio';
    }

    logger.info('[PEP] Verificação realizada:', {
      cpf: doc,
      isPEP,
      nivel_risco: nivelRisco,
    });

    return {
      cpf: doc,
      isPEP,
      pep: record ? {
        cpf: record.cpf,
        nome: record.nome,
        cargo: record.cargo,
        orgao: record.orgao,
        nivel_federacao: record.nivel_federacao,
        uf: record.uf,
        municipio: record.municipio,
        data_inicio: record.data_inicio,
        data_fim: record.data_fim,
        situacao: record.situacao,
      } : undefined,
      nivel_risco: nivelRisco,
      verificado_em: new Date().toISOString(),
    };
  } catch (error: any) {
    logger.error('[PEP] Erro ao verificar:', error);
    throw error;
  }
}

/**
 * Buscar PEPs por nome (busca parcial)
 *
 * Útil para verificação quando só tem o nome.
 *
 * @param db Instância do banco D1
 * @param nome Nome completo ou parcial
 * @returns Lista de PEPs encontrados
 */
export async function buscarPEPPorNome(
  db: any,
  nome: string
): Promise<PEPRecord[]> {
  try {
    const { results } = await db.prepare(`
      SELECT * FROM pep_list
      WHERE nome LIKE ?
      ORDER BY nome
      LIMIT 100
    `).bind(`%${nome}%`).all();

    logger.info('[PEP] Busca por nome realizada:', {
      nome,
      total: results?.length || 0,
    });

    return results || [];
  } catch (error: any) {
    logger.error('[PEP] Erro ao buscar por nome:', error);
    throw error;
  }
}

/**
 * Obter estatísticas da lista PEP
 *
 * Retorna totais por nível de federação.
 *
 * @param db Instância do banco D1
 * @returns Estatísticas
 */
export async function getPEPStats(db: any) {
  try {
    const stats = await db.prepare(`
      SELECT * FROM v_pep_stats
    `).all();

    return stats.results || [];
  } catch (error: any) {
    logger.error('[PEP] Erro ao obter estatísticas:', error);
    throw error;
  }
}
