/**
 * Investigacoes Routes
 *
 * Endpoints para gerenciar investigações de usuários:
 * - Criar nova investigação
 * - Listar investigações do usuário
 * - Buscar investigação específica
 * - Atualizar investigação
 * - Deletar investigação
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 * Fix: Implementação de endpoints faltantes para persistência de investigações
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env, AuthenticatedUser } from '../types/api.types';
import { logger } from '../utils/logger';

const router = new Hono<{ Bindings: Env }>();

// ============================================================================
// INTERFACES
// ============================================================================

interface CreateInvestigacaoRequest {
  nome: string;
  documento: string; // CPF ou CNPJ
  tipo_pessoa?: 'fisica' | 'juridica';
  is_grupo?: boolean;
  grupo_nome?: string;
  grupo_total_documentos?: number;
  categoria?: 'familia' | 'clientes' | 'funcionarios' | 'relacionamentos' | 'empresas';
  status?: 'investigar' | 'investigando' | 'relatorio' | 'monitoramento' | 'aprovado' | 'bloqueado';
  nivel_urgencia?: 'baixa' | 'media' | 'alta' | 'urgente';
  email?: string;
  telefones?: string; // JSON array
  endereco?: string;
  redes_sociais?: string; // JSON object
  placa_veiculo?: string;
  rg?: string;
  estado_civil?: string;
  profissao?: string;
  data_nascimento?: string;
  motivo_investigacao?: string;
  escopo_investigacao?: string; // JSON object
  observacoes?: string;
  prazo_desejado?: string; // Data ISO
}

// ============================================================================
// ROUTES
// ============================================================================

/**
 * POST /api/investigacoes
 *
 * Cria uma nova investigação
 *
 * Body: CreateInvestigacaoRequest
 *
 * Response:
 * {
 *   success: true,
 *   investigacao: { id, nome, documento, status, ... }
 * }
 */
router.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    const body = await c.req.json<CreateInvestigacaoRequest>();

    // Validações básicas
    if (!body.nome || !body.documento) {
      return c.json({
        success: false,
        error: 'Campos obrigatórios: nome, documento'
      }, 400);
    }

    // Buscar user_id do D1 usando o firebase_uid
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (!userRecord) {
      // Se usuário não existe no D1, criar
      const newUserId = crypto.randomUUID();
      await c.env.DB.prepare(`
        INSERT INTO users (id, firebase_uid, email, name)
        VALUES (?, ?, ?, ?)
      `).bind(
        newUserId,
        user.uid,
        user.email || '',
        body.nome || ''
      ).run();

      logger.info('User created in D1', { user_id: newUserId, firebase_uid: user.uid });
    }

    const userId = userRecord?.id || crypto.randomUUID();

    // Gerar ID para a investigação
    const investigacaoId = crypto.randomUUID();

    // Inserir investigação
    const result = await c.env.DB.prepare(`
      INSERT INTO user_investigacoes (
        id, user_id, nome, documento, tipo_pessoa,
        is_grupo, grupo_nome, grupo_total_documentos,
        categoria, status, nivel_urgencia,
        email, telefones, endereco, redes_sociais,
        placa_veiculo, rg, estado_civil, profissao, data_nascimento,
        motivo_investigacao, escopo_investigacao, observacoes, prazo_desejado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      investigacaoId,
      userId,
      body.nome,
      body.documento,
      body.tipo_pessoa || 'fisica',
      body.is_grupo ? 1 : 0,
      body.grupo_nome || null,
      body.grupo_total_documentos || 1,
      body.categoria || 'funcionarios',
      body.status || 'investigar',
      body.nivel_urgencia || 'media',
      body.email || null,
      body.telefones || null,
      body.endereco || null,
      body.redes_sociais || null,
      body.placa_veiculo || null,
      body.rg || null,
      body.estado_civil || null,
      body.profissao || null,
      body.data_nascimento || null,
      body.motivo_investigacao || null,
      body.escopo_investigacao || null,
      body.observacoes || null,
      body.prazo_desejado || null
    ).first();

    logger.info('Investigacao created', {
      investigacao_id: investigacaoId,
      user_id: userId,
      documento: body.documento
    });

    // Audit log
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      userId,
      'create',
      'investigacao',
      investigacaoId,
      JSON.stringify({ nome: body.nome, documento: body.documento })
    ).run();

    return c.json({
      success: true,
      investigacao: result
    }, 201);

  } catch (error: any) {
    logger.error('Error creating investigacao', error);
    return c.json({
      success: false,
      error: 'Erro ao criar investigação',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/investigacoes
 *
 * Lista todas as investigações do usuário autenticado
 *
 * Query params:
 * - status: filtrar por status
 * - categoria: filtrar por categoria
 * - limit: limite de resultados (default: 50)
 * - offset: offset para paginação (default: 0)
 *
 * Response:
 * {
 *   success: true,
 *   investigacoes: [...],
 *   total: 123,
 *   limit: 50,
 *   offset: 0
 * }
 */
router.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;

    // Buscar user_id do D1
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (!userRecord) {
      return c.json({
        success: true,
        investigacoes: [],
        total: 0
      });
    }

    // Query params
    const status = c.req.query('status');
    const categoria = c.req.query('categoria');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    // Build query
    let query = 'SELECT * FROM user_investigacoes WHERE user_id = ?';
    const params: any[] = [userRecord.id];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Count total
    let countQuery = 'SELECT COUNT(*) as total FROM user_investigacoes WHERE user_id = ?';
    const countParams: any[] = [userRecord.id];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (categoria) {
      countQuery += ' AND categoria = ?';
      countParams.push(categoria);
    }

    const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first();

    return c.json({
      success: true,
      investigacoes: results,
      total: countResult?.total || 0,
      limit,
      offset
    });

  } catch (error: any) {
    logger.error('Error listing investigacoes', error);
    return c.json({
      success: false,
      error: 'Erro ao listar investigações',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/investigacoes/:id
 *
 * Busca uma investigação específica
 *
 * Response:
 * {
 *   success: true,
 *   investigacao: { ... }
 * }
 */
router.get('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    const investigacaoId = c.req.param('id');

    // Buscar user_id do D1
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (!userRecord) {
      return c.json({
        success: false,
        error: 'Usuário não encontrado'
      }, 404);
    }

    // Buscar investigação
    const investigacao = await c.env.DB.prepare(`
      SELECT * FROM user_investigacoes
      WHERE id = ? AND user_id = ?
    `).bind(investigacaoId, userRecord.id).first();

    if (!investigacao) {
      return c.json({
        success: false,
        error: 'Investigação não encontrada'
      }, 404);
    }

    return c.json({
      success: true,
      investigacao
    });

  } catch (error: any) {
    logger.error('Error fetching investigacao', error);
    return c.json({
      success: false,
      error: 'Erro ao buscar investigação',
      details: error.message
    }, 500);
  }
});

/**
 * PUT /api/investigacoes/:id
 *
 * Atualiza uma investigação
 *
 * Body: Partial<CreateInvestigacaoRequest>
 *
 * Response:
 * {
 *   success: true,
 *   investigacao: { ... }
 * }
 */
router.put('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    const investigacaoId = c.req.param('id');
    const body = await c.req.json<Partial<CreateInvestigacaoRequest>>();

    // Buscar user_id do D1
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (!userRecord) {
      return c.json({
        success: false,
        error: 'Usuário não encontrado'
      }, 404);
    }

    // Verificar se investigação existe e pertence ao usuário
    const existing = await c.env.DB.prepare(`
      SELECT id FROM user_investigacoes
      WHERE id = ? AND user_id = ?
    `).bind(investigacaoId, userRecord.id).first();

    if (!existing) {
      return c.json({
        success: false,
        error: 'Investigação não encontrada'
      }, 404);
    }

    // Build update query dinamicamente
    const updates: string[] = [];
    const params: any[] = [];

    if (body.nome !== undefined) {
      updates.push('nome = ?');
      params.push(body.nome);
    }
    if (body.status !== undefined) {
      updates.push('status = ?');
      params.push(body.status);
    }
    if (body.nivel_urgencia !== undefined) {
      updates.push('nivel_urgencia = ?');
      params.push(body.nivel_urgencia);
    }
    if (body.observacoes !== undefined) {
      updates.push('observacoes = ?');
      params.push(body.observacoes);
    }
    if (body.motivo_investigacao !== undefined) {
      updates.push('motivo_investigacao = ?');
      params.push(body.motivo_investigacao);
    }
    if (body.escopo_investigacao !== undefined) {
      updates.push('escopo_investigacao = ?');
      params.push(body.escopo_investigacao);
    }

    // Sempre atualiza updated_at
    updates.push('updated_at = datetime(\'now\')');

    if (updates.length === 1) {
      // Apenas updated_at, nada para atualizar
      return c.json({
        success: false,
        error: 'Nenhum campo para atualizar'
      }, 400);
    }

    const query = `
      UPDATE user_investigacoes
      SET ${updates.join(', ')}
      WHERE id = ? AND user_id = ?
      RETURNING *
    `;

    params.push(investigacaoId, userRecord.id);

    const result = await c.env.DB.prepare(query).bind(...params).first();

    // Audit log
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      userRecord.id,
      'update',
      'investigacao',
      investigacaoId,
      JSON.stringify(body)
    ).run();

    logger.info('Investigacao updated', {
      investigacao_id: investigacaoId,
      user_id: userRecord.id
    });

    return c.json({
      success: true,
      investigacao: result
    });

  } catch (error: any) {
    logger.error('Error updating investigacao', error);
    return c.json({
      success: false,
      error: 'Erro ao atualizar investigação',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/investigacoes/stats
 *
 * Retorna estatísticas das investigações do usuário
 *
 * Response:
 * {
 *   success: true,
 *   stats: {
 *     total: 10,
 *     por_status: { investigar: 5, investigando: 3, relatorio: 2 },
 *     por_categoria: { funcionarios: 6, empresas: 4 }
 *   }
 * }
 */
router.get('/stats', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;

    // Buscar user_id do D1
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (!userRecord) {
      return c.json({
        success: true,
        stats: {
          total: 0,
          por_status: {},
          por_categoria: {}
        }
      });
    }

    // Total de investigações
    const totalResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as total FROM user_investigacoes
      WHERE user_id = ?
    `).bind(userRecord.id).first();

    // Por status
    const { results: porStatus } = await c.env.DB.prepare(`
      SELECT status, COUNT(*) as count
      FROM user_investigacoes
      WHERE user_id = ?
      GROUP BY status
    `).bind(userRecord.id).all();

    // Por categoria
    const { results: porCategoria } = await c.env.DB.prepare(`
      SELECT categoria, COUNT(*) as count
      FROM user_investigacoes
      WHERE user_id = ?
      GROUP BY categoria
    `).bind(userRecord.id).all();

    // Formatar resultados
    const statusMap: any = {};
    porStatus.forEach((row: any) => {
      statusMap[row.status] = row.count;
    });

    const categoriaMap: any = {};
    porCategoria.forEach((row: any) => {
      categoriaMap[row.categoria] = row.count;
    });

    return c.json({
      success: true,
      stats: {
        total: totalResult?.total || 0,
        por_status: statusMap,
        por_categoria: categoriaMap
      }
    });

  } catch (error: any) {
    logger.error('Error fetching stats', error);
    return c.json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      details: error.message
    }, 500);
  }
});

/**
 * DELETE /api/investigacoes/:id
 *
 * Deleta uma investigação
 *
 * Response:
 * {
 *   success: true,
 *   message: "Investigação deletada com sucesso"
 * }
 */
router.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    const investigacaoId = c.req.param('id');

    // Buscar user_id do D1
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (!userRecord) {
      return c.json({
        success: false,
        error: 'Usuário não encontrado'
      }, 404);
    }

    // Verificar se investigação existe e pertence ao usuário
    const existing = await c.env.DB.prepare(`
      SELECT id FROM user_investigacoes
      WHERE id = ? AND user_id = ?
    `).bind(investigacaoId, userRecord.id).first();

    if (!existing) {
      return c.json({
        success: false,
        error: 'Investigação não encontrada'
      }, 404);
    }

    // Deletar investigação
    await c.env.DB.prepare(`
      DELETE FROM user_investigacoes
      WHERE id = ? AND user_id = ?
    `).bind(investigacaoId, userRecord.id).run();

    // Audit log
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      userRecord.id,
      'delete',
      'investigacao',
      investigacaoId,
      JSON.stringify({})
    ).run();

    logger.info('Investigacao deleted', {
      investigacao_id: investigacaoId,
      user_id: userRecord.id
    });

    return c.json({
      success: true,
      message: 'Investigação deletada com sucesso'
    });

  } catch (error: any) {
    logger.error('Error deleting investigacao', error);
    return c.json({
      success: false,
      error: 'Erro ao deletar investigação',
      details: error.message
    }, 500);
  }
});

export default router;
