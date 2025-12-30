/**
 * Compliance Handler - Backend API Worker
 *
 * Endpoints para estatísticas de compliance:
 * - GET /api/compliance/stats - Estatísticas agregadas de compliance
 * - GET /api/compliance/pep - Lista de PEPs
 * - GET /api/compliance/sancoes - Lista de sanções (CEIS/CNEP)
 */

import { Env } from '../types';
import { logger } from '../logger';
import { AuthContext } from '../auth';

/**
 * GET /api/compliance/stats
 * Retorna estatísticas agregadas de compliance para o tenant
 */
export async function handleGetComplianceStats(
  request: Request,
  env: Env,
  auth: AuthContext
): Promise<Response> {
  try {
    const { tenantId } = auth;

    logger.info('Buscando stats de compliance', { tenantId }, 'Compliance');

    // 1. Contar PEPs (Pessoas Expostas Politicamente)
    const pepsResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM user_investigacoes
      WHERE tenant_id = ?
        AND is_pep = 1
    `).bind(tenantId).first<{ count: number }>();

    const totalPEP = pepsResult?.count || 0;

    // 2. Contar sanções CEIS
    const ceisResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM sancoes
      WHERE tenant_id = ?
        AND tipo = 'CEIS'
    `).bind(tenantId).first<{ count: number }>();

    const totalSancoesCEIS = ceisResult?.count || 0;

    // 3. Contar sanções CNEP
    const cnepResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM sancoes
      WHERE tenant_id = ?
        AND tipo = 'CNEP'
    `).bind(tenantId).first<{ count: number }>();

    const totalSancoesCNEP = cnepResult?.count || 0;

    // 4. Contar matches OFAC
    const ofacResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM ofac_matches
      WHERE tenant_id = ?
    `).bind(tenantId).first<{ count: number }>();

    const totalOFACMatches = ofacResult?.count || 0;

    // 5. Contar total de investigações
    const investigacoesResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM user_investigacoes
      WHERE tenant_id = ?
    `).bind(tenantId).first<{ count: number }>();

    const totalInvestigacoes = investigacoesResult?.count || 0;

    // 6. Taxa de compliance (%)
    const taxaCompliance = totalInvestigacoes > 0
      ? ((totalInvestigacoes - totalPEP - totalSancoesCEIS - totalSancoesCNEP) / totalInvestigacoes * 100)
      : 100;

    const stats = {
      totalPEP,
      totalSancoesCEIS,
      totalSancoesCNEP,
      totalOFACMatches,
      totalInvestigacoes,
      totalAlertas: totalPEP + totalSancoesCEIS + totalSancoesCNEP + totalOFACMatches,
      taxaCompliance: Math.max(0, Math.min(100, taxaCompliance)).toFixed(2),
      timestamp: new Date().toISOString()
    };

    logger.info('Stats de compliance retornadas', {
      tenantId,
      totalAlertas: stats.totalAlertas
    }, 'Compliance');

    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Erro ao buscar stats de compliance',
      error instanceof Error ? error : undefined,
      { tenantId: auth.tenantId },
      'Compliance'
    );

    return new Response(
      JSON.stringify({
        error: 'Erro ao buscar estatísticas de compliance',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /api/compliance/pep
 * Lista todas as Pessoas Expostas Politicamente do tenant
 */
export async function handleGetPEPs(
  request: Request,
  env: Env,
  auth: AuthContext
): Promise<Response> {
  try {
    const { tenantId } = auth;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    logger.info('Listando PEPs', { tenantId, limit, offset }, 'Compliance');

    const peps = await env.DB.prepare(`
      SELECT
        id,
        cpf,
        nome,
        is_pep,
        pep_nivel,
        pep_desde,
        pep_cargo,
        created_at
      FROM user_investigacoes
      WHERE tenant_id = ?
        AND is_pep = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(tenantId, limit, offset).all();

    return new Response(JSON.stringify({
      peps: peps.results || [],
      total: peps.results?.length || 0,
      limit,
      offset
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Erro ao listar PEPs',
      error instanceof Error ? error : undefined,
      { tenantId: auth.tenantId },
      'Compliance'
    );

    return new Response(
      JSON.stringify({
        error: 'Erro ao listar PEPs',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /api/compliance/sancoes
 * Lista todas as sanções (CEIS/CNEP/CEPIM) do tenant
 */
export async function handleGetSancoes(
  request: Request,
  env: Env,
  auth: AuthContext
): Promise<Response> {
  try {
    const { tenantId } = auth;
    const url = new URL(request.url);
    const tipo = url.searchParams.get('tipo'); // CEIS, CNEP, CEPIM
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    logger.info('Listando sanções', { tenantId, tipo, limit, offset }, 'Compliance');

    let query = `
      SELECT
        id,
        cpf,
        nome,
        tipo,
        data_sancao,
        orgao_sancionador,
        motivo,
        valor_multa,
        created_at
      FROM sancoes
      WHERE tenant_id = ?
    `;

    const params: any[] = [tenantId];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const sancoes = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      sancoes: sancoes.results || [],
      total: sancoes.results?.length || 0,
      tipo,
      limit,
      offset
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Erro ao listar sanções',
      error instanceof Error ? error : undefined,
      { tenantId: auth.tenantId },
      'Compliance'
    );

    return new Response(
      JSON.stringify({
        error: 'Erro ao listar sanções',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
