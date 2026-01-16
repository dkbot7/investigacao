/**
 * LGPD Handler - Backend API Worker
 *
 * Endpoints para gerenciamento de LGPD:
 * - GET  /api/lgpd/stats - Estatísticas de compliance LGPD
 * - POST /api/lgpd/consent - Registrar consentimento
 * - GET  /api/lgpd/requests - Listar solicitações LGPD
 * - POST /api/lgpd/request - Criar solicitação LGPD (acesso, exclusão, portabilidade)
 */

import { Env } from '../types';
import { logger } from '../logger';
import { AuthContext } from '../auth';

/**
 * GET /api/lgpd/stats
 * Retorna estatísticas de compliance LGPD
 */
export async function handleGetLGPDStats(
  request: Request,
  env: Env,
  auth: AuthContext
): Promise<Response> {
  try {
    logger.info('Buscando stats LGPD', {}, 'LGPD');

    // 1. Total de consentimentos registrados
    const totalConsentimentosResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM lgpd_consent_logs
    `).first<{ count: number }>();

    const totalConsentimentos = totalConsentimentosResult?.count || 0;

    // 2. Consentimentos ativos (consentimento = 1)
    const consentimentosAtivosResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM lgpd_consent_logs
      WHERE consentimento = 1
    `).first<{ count: number }>();

    const consentimentosAtivos = consentimentosAtivosResult?.count || 0;

    // 3. Solicitações de acesso (Art. 18 LGPD)
    const solicitacoesAcessoResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM lgpd_requests
      WHERE tipo = 'acesso'
    `).first<{ count: number }>();

    const solicitacoesAcesso = solicitacoesAcessoResult?.count || 0;

    // 4. Solicitações de exclusão (Art. 18 LGPD)
    const solicitacoesExclusaoResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM lgpd_requests
      WHERE tipo = 'exclusao'
    `).first<{ count: number }>();

    const solicitacoesExclusao = solicitacoesExclusaoResult?.count || 0;

    // 5. Solicitações de portabilidade (Art. 18 LGPD)
    const solicitacoesPortabilidadeResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM lgpd_requests
      WHERE tipo = 'portabilidade'
    `).first<{ count: number }>();

    const solicitacoesPortabilidade = solicitacoesPortabilidadeResult?.count || 0;

    // 6. Solicitações pendentes
    const solicitacoesPendentesResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM lgpd_requests
      WHERE status = 'pendente'
    `).first<{ count: number }>();

    const solicitacoesPendentes = solicitacoesPendentesResult?.count || 0;

    // 7. Taxa de resposta (concluídas / total)
    const totalSolicitacoes = solicitacoesAcesso + solicitacoesExclusao + solicitacoesPortabilidade;
    const solicitacoesConcluidasResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM lgpd_requests
      WHERE status = 'concluido'
    `).first<{ count: number }>();

    const solicitacoesConcluidas = solicitacoesConcluidasResult?.count || 0;
    const taxaResposta = totalSolicitacoes > 0
      ? (solicitacoesConcluidas / totalSolicitacoes * 100).toFixed(2)
      : '100.00';

    const stats = {
      totalConsentimentos,
      consentimentosAtivos,
      consentimentosInativos: totalConsentimentos - consentimentosAtivos,
      taxaConsentimento: totalConsentimentos > 0
        ? (consentimentosAtivos / totalConsentimentos * 100).toFixed(2)
        : '0.00',
      solicitacoesAcesso,
      solicitacoesExclusao,
      solicitacoesPortabilidade,
      totalSolicitacoes,
      solicitacoesPendentes,
      solicitacoesConcluidas,
      taxaResposta,
      timestamp: new Date().toISOString()
    };

    logger.info('Stats LGPD retornadas', {
      totalConsentimentos,
      totalSolicitacoes
    }, 'LGPD');

    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Erro ao buscar stats LGPD',
      error instanceof Error ? error : undefined,
      {},
      'LGPD'
    );

    return new Response(
      JSON.stringify({
        error: 'Erro ao buscar estatísticas LGPD',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /api/lgpd/consent
 * Registra consentimento LGPD (chamado pelo frontend /api/lgpd/registrar-consentimento)
 */
export async function handleRegisterConsent(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = await request.json();

    const {
      timestamp,
      consentimento,
      finalidades,
      ip_hash,
      user_agent,
      granular,
      versao_texto,
      source
    } = body;

    // Validação
    if (typeof consentimento !== 'boolean') {
      return new Response(
        JSON.stringify({ success: false, error: 'Campo consentimento inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = crypto.randomUUID();

    // Inserir no D1
    await env.DB.prepare(`
      INSERT INTO lgpd_consent_logs (
        id, timestamp, consentimento, finalidades, ip_hash,
        user_agent, granular, versao_texto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      timestamp || new Date().toISOString(),
      consentimento ? 1 : 0,
      JSON.stringify(finalidades),
      ip_hash,
      user_agent,
      JSON.stringify(granular || {}),
      versao_texto || '1.0.0'
    ).run();

    logger.info('Consentimento LGPD registrado', {
      id,
      consentimento,
      finalidades: finalidades?.length || 0
    }, 'LGPD');

    return new Response(
      JSON.stringify({ success: true, id }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logger.error('Erro ao registrar consentimento',
      error instanceof Error ? error : undefined,
      {},
      'LGPD'
    );

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro ao registrar consentimento',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /api/lgpd/requests
 * Lista solicitações LGPD (acesso, exclusão, portabilidade)
 */
export async function handleGetLGPDRequests(
  request: Request,
  env: Env,
  auth: AuthContext
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const tipo = url.searchParams.get('tipo');
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    logger.info('Listando solicitações LGPD', { tipo, status, limit, offset }, 'LGPD');

    let query = `
      SELECT
        id,
        tipo,
        user_id,
        email,
        status,
        created_at,
        completed_at
      FROM lgpd_requests
      WHERE 1=1
    `;

    const params: any[] = [];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const requests = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      requests: requests.results || [],
      total: requests.results?.length || 0,
      tipo,
      status,
      limit,
      offset
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    logger.error('Erro ao listar solicitações LGPD',
      error instanceof Error ? error : undefined,
      {},
      'LGPD'
    );

    return new Response(
      JSON.stringify({
        error: 'Erro ao listar solicitações LGPD',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * POST /api/lgpd/request
 * Cria nova solicitação LGPD (acesso, exclusão, portabilidade)
 */
export async function handleCreateLGPDRequest(
  request: Request,
  env: Env,
  auth?: AuthContext
): Promise<Response> {
  try {
    const body = await request.json();

    const { tipo, email, user_id } = body;

    // Validação
    if (!tipo || !['acesso', 'exclusao', 'portabilidade'].includes(tipo)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tipo inválido. Use: acesso, exclusao ou portabilidade' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email é obrigatório' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(`
      INSERT INTO lgpd_requests (
        id, tipo, user_id, email, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      tipo,
      user_id || null,
      email,
      'pendente',
      new Date().toISOString()
    ).run();

    logger.info('Solicitação LGPD criada', {
      id,
      tipo,
      email
    }, 'LGPD');

    return new Response(
      JSON.stringify({ success: true, id, tipo }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logger.error('Erro ao criar solicitação LGPD',
      error instanceof Error ? error : undefined,
      {},
      'LGPD'
    );

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro ao criar solicitação LGPD',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
