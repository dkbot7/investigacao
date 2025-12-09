/**
 * Kanban Routes
 *
 * Endpoints para gerenciar cards do Kanban (funcionários):
 * - Listar cards por coluna/status
 * - Criar novo card
 * - Mover card entre colunas
 * - Atualizar card
 * - Arquivar/deletar card
 * - Executar consulta SERPRO do card
 * - Estatísticas do Kanban
 *
 * Agent 3 - Full-Stack Developer
 * Data: 2025-12-08
 * FASE 1: Implementação Kanban
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import type { Env, AuthenticatedUser } from '../types/api.types';
import { logger } from '../utils/logger';
import { CpfService } from '../services/serpro/cpf.service';
import { CnpjService } from '../services/serpro/cnpj.service';

const router = new Hono<{ Bindings: Env }>();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const createCardSchema = z.object({
  tipo: z.enum(['funcionario', 'consulta_cpf', 'consulta_cnpj', 'consulta_divida']),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  nome: z.string().optional(),
  grupo: z.string().optional(),
  cargo: z.string().optional(),
  salario: z.number().optional(),
  metadata: z.string().optional(), // JSON string
  observacoes: z.string().optional(),
});

const updateCardSchema = z.object({
  nome_importado: z.string().optional(),
  grupo: z.string().optional(),
  cargo: z.string().optional(),
  salario: z.number().optional(),
  status_investigacao: z.enum([
    'investigar',
    'investigando',
    'relatorio',
    'monitoramento',
    'aprovado',
    'bloqueado'
  ]).optional(),
  observacoes: z.string().optional(),
  metadata: z.string().optional(),
});

const moveCardSchema = z.object({
  from: z.enum(['investigar', 'investigando', 'relatorio', 'monitoramento', 'aprovado', 'bloqueado']),
  to: z.enum(['investigar', 'investigando', 'relatorio', 'monitoramento', 'aprovado', 'bloqueado']),
});

const consultSchema = z.object({
  api_type: z.enum(['cpf', 'cnpj_basica', 'cnpj_qsa', 'cnpj_empresa', 'divida']),
});

// ============================================================================
// ROUTES
// ============================================================================

/**
 * GET /api/kanban/cards
 *
 * Lista cards do Kanban com filtros
 *
 * Query params:
 * - status: filtrar por status/coluna (default: todos)
 * - tipo: filtrar por tipo (default: todos)
 * - tenant_code: filtrar por tenant (obrigatório se não admin)
 * - search: buscar por nome/cpf/cnpj
 * - limit: limite de resultados (default: 100)
 * - offset: offset para paginação (default: 0)
 * - arquivado: incluir arquivados (default: 0)
 *
 * Response:
 * {
 *   success: true,
 *   cards: [...],
 *   total: 123,
 *   by_status: { investigar: 10, investigando: 5, ... }
 * }
 */
router.get('/cards', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;

    // Query params
    const status = c.req.query('status');
    const tipo = c.req.query('tipo');
    const tenantCode = c.req.query('tenant_code');
    const search = c.req.query('search');
    const limit = parseInt(c.req.query('limit') || '100');
    const offset = parseInt(c.req.query('offset') || '0');
    const arquivado = parseInt(c.req.query('arquivado') || '0');

    // Buscar user_id
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (!userRecord) {
      return c.json({
        success: false,
        error: 'Usuário não encontrado'
      }, 404);
    }

    // Verificar acesso ao tenant
    let effectiveTenantCode = tenantCode;

    if (user.role !== 'admin' && !tenantCode) {
      // Usuário normal precisa especificar tenant_code
      return c.json({
        success: false,
        error: 'tenant_code é obrigatório'
      }, 400);
    }

    // Build query
    let query = 'SELECT * FROM funcionarios WHERE 1=1';
    const params: any[] = [];

    if (tenantCode) {
      query += ' AND tenant_code = ?';
      params.push(tenantCode);
    }

    if (status) {
      query += ' AND status_investigacao = ?';
      params.push(status);
    }

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }

    if (search) {
      query += ' AND (nome_importado LIKE ? OR cpf LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' AND arquivado = ?';
    params.push(arquivado);

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Count total
    let countQuery = 'SELECT COUNT(*) as total FROM funcionarios WHERE 1=1';
    const countParams: any[] = [];

    if (tenantCode) {
      countQuery += ' AND tenant_code = ?';
      countParams.push(tenantCode);
    }

    if (status) {
      countQuery += ' AND status_investigacao = ?';
      countParams.push(status);
    }

    if (tipo) {
      countQuery += ' AND tipo = ?';
      countParams.push(tipo);
    }

    if (search) {
      countQuery += ' AND (nome_importado LIKE ? OR cpf LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    countQuery += ' AND arquivado = ?';
    countParams.push(arquivado);

    const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first();

    // Aggregate by status
    let statsQuery = `
      SELECT status_investigacao, COUNT(*) as count
      FROM funcionarios
      WHERE arquivado = 0
    `;
    const statsParams: any[] = [];

    if (tenantCode) {
      statsQuery += ' AND tenant_code = ?';
      statsParams.push(tenantCode);
    }

    statsQuery += ' GROUP BY status_investigacao';

    const { results: statsResults } = await c.env.DB.prepare(statsQuery).bind(...statsParams).all();

    // Build by_status object
    const byStatus: Record<string, number> = {
      investigar: 0,
      investigando: 0,
      relatorio: 0,
      monitoramento: 0,
      aprovado: 0,
      bloqueado: 0,
    };

    statsResults?.forEach((row: any) => {
      byStatus[row.status_investigacao] = row.count;
    });

    return c.json({
      success: true,
      cards: results,
      total: countResult?.total || 0,
      by_status: byStatus,
      limit,
      offset,
    });

  } catch (error: any) {
    logger.error('Error fetching kanban cards', error);
    return c.json({
      success: false,
      error: 'Erro ao buscar cards do Kanban',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/kanban/cards/:id
 *
 * Busca um card específico com detalhes completos
 */
router.get('/cards/:id', authMiddleware, async (c) => {
  try {
    const cardId = c.req.param('id');
    const user = c.get('user') as AuthenticatedUser;

    const card = await c.env.DB.prepare(
      'SELECT * FROM funcionarios WHERE id = ?'
    ).bind(cardId).first();

    if (!card) {
      return c.json({
        success: false,
        error: 'Card não encontrado'
      }, 404);
    }

    // Verificar acesso (admin ou mesmo tenant)
    if (user.role !== 'admin') {
      const userRecord = await c.env.DB.prepare(
        'SELECT id FROM users WHERE firebase_uid = ?'
      ).bind(user.uid).first();

      if (!userRecord) {
        return c.json({
          success: false,
          error: 'Usuário não encontrado'
        }, 404);
      }

      // Verificar se user tem acesso ao tenant do card
      const hasAccess = await c.env.DB.prepare(`
        SELECT 1 FROM user_tenants ut
        JOIN tenants t ON ut.tenant_id = t.id
        WHERE ut.user_id = ? AND t.code = ? AND ut.is_active = 1
      `).bind(userRecord.id, card.tenant_code).first();

      if (!hasAccess) {
        return c.json({
          success: false,
          error: 'Sem permissão para acessar este card'
        }, 403);
      }
    }

    // Buscar histórico de consultas SERPRO
    const { results: consultHistory } = await c.env.DB.prepare(`
      SELECT api_name, cost, response_status, created_at
      FROM serpro_usage
      WHERE document = ? OR document = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).bind(card.cpf || '', card.cnpj || '').all();

    return c.json({
      success: true,
      card: {
        ...card,
        consult_history: consultHistory || []
      }
    });

  } catch (error: any) {
    logger.error('Error fetching card', error);
    return c.json({
      success: false,
      error: 'Erro ao buscar card',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/kanban/cards
 *
 * Cria novo card manualmente
 */
router.post('/cards', authMiddleware, zValidator('json', createCardSchema), async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    const body = c.req.valid('json');
    const tenantCode = c.req.header('X-Tenant-Code');

    if (!tenantCode) {
      return c.json({
        success: false,
        error: 'Header X-Tenant-Code é obrigatório'
      }, 400);
    }

    // Validar documento
    if (body.tipo === 'consulta_cpf' || body.tipo === 'funcionario') {
      if (!body.cpf) {
        return c.json({
          success: false,
          error: 'CPF é obrigatório para este tipo'
        }, 400);
      }
    }

    if (body.tipo === 'consulta_cnpj') {
      if (!body.cnpj) {
        return c.json({
          success: false,
          error: 'CNPJ é obrigatório para este tipo'
        }, 400);
      }
    }

    // Inserir card
    const result = await c.env.DB.prepare(`
      INSERT INTO funcionarios (
        tenant_code, cpf, nome_importado, tipo, grupo, cargo, salario,
        metadata, observacoes, status_investigacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'investigar')
      RETURNING *
    `).bind(
      tenantCode,
      body.cpf || null,
      body.nome || null,
      body.tipo,
      body.grupo || null,
      body.cargo || null,
      body.salario || null,
      body.metadata || null,
      body.observacoes || null
    ).first();

    logger.info('Kanban card created', {
      card_id: result?.id,
      tenant_code: tenantCode,
      tipo: body.tipo
    });

    return c.json({
      success: true,
      card: result
    }, 201);

  } catch (error: any) {
    logger.error('Error creating card', error);
    return c.json({
      success: false,
      error: 'Erro ao criar card',
      details: error.message
    }, 500);
  }
});

/**
 * PUT /api/kanban/cards/:id
 *
 * Atualiza um card (campos genéricos)
 */
router.put('/cards/:id', authMiddleware, zValidator('json', updateCardSchema), async (c) => {
  try {
    const cardId = c.req.param('id');
    const body = c.req.valid('json');

    // Build update query
    const updates: string[] = [];
    const params: any[] = [];

    if (body.nome_importado !== undefined) {
      updates.push('nome_importado = ?');
      params.push(body.nome_importado);
    }
    if (body.grupo !== undefined) {
      updates.push('grupo = ?');
      params.push(body.grupo);
    }
    if (body.cargo !== undefined) {
      updates.push('cargo = ?');
      params.push(body.cargo);
    }
    if (body.salario !== undefined) {
      updates.push('salario = ?');
      params.push(body.salario);
    }
    if (body.status_investigacao !== undefined) {
      updates.push('status_investigacao = ?');
      params.push(body.status_investigacao);
    }
    if (body.observacoes !== undefined) {
      updates.push('observacoes = ?');
      params.push(body.observacoes);
    }
    if (body.metadata !== undefined) {
      updates.push('metadata = ?');
      params.push(body.metadata);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    if (updates.length === 1) {
      return c.json({
        success: false,
        error: 'Nenhum campo para atualizar'
      }, 400);
    }

    const query = `
      UPDATE funcionarios
      SET ${updates.join(', ')}
      WHERE id = ?
      RETURNING *
    `;

    params.push(cardId);

    const result = await c.env.DB.prepare(query).bind(...params).first();

    if (!result) {
      return c.json({
        success: false,
        error: 'Card não encontrado'
      }, 404);
    }

    logger.info('Kanban card updated', { card_id: cardId });

    return c.json({
      success: true,
      card: result
    });

  } catch (error: any) {
    logger.error('Error updating card', error);
    return c.json({
      success: false,
      error: 'Erro ao atualizar card',
      details: error.message
    }, 500);
  }
});

/**
 * PATCH /api/kanban/cards/:id/move
 *
 * Move card entre colunas (atualiza status_investigacao)
 */
router.patch('/cards/:id/move', authMiddleware, zValidator('json', moveCardSchema), async (c) => {
  try {
    const cardId = c.req.param('id');
    const { from, to } = c.req.valid('json');

    // Verificar se card existe e está na coluna "from"
    const card = await c.env.DB.prepare(
      'SELECT id, status_investigacao FROM funcionarios WHERE id = ?'
    ).bind(cardId).first();

    if (!card) {
      return c.json({
        success: false,
        error: 'Card não encontrado'
      }, 404);
    }

    if (card.status_investigacao !== from) {
      return c.json({
        success: false,
        error: `Card não está na coluna "${from}"`
      }, 400);
    }

    // Mover para nova coluna
    const result = await c.env.DB.prepare(`
      UPDATE funcionarios
      SET status_investigacao = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING *
    `).bind(to, cardId).first();

    logger.info('Kanban card moved', {
      card_id: cardId,
      from,
      to
    });

    return c.json({
      success: true,
      card: result,
      message: `Card movido de "${from}" para "${to}"`
    });

  } catch (error: any) {
    logger.error('Error moving card', error);
    return c.json({
      success: false,
      error: 'Erro ao mover card',
      details: error.message
    }, 500);
  }
});

/**
 * DELETE /api/kanban/cards/:id
 *
 * Arquiva um card (soft delete)
 */
router.delete('/cards/:id', authMiddleware, async (c) => {
  try {
    const cardId = c.req.param('id');
    const hardDelete = c.req.query('hard') === 'true';

    if (hardDelete) {
      // Hard delete (apenas admin)
      const user = c.get('user') as AuthenticatedUser;
      if (user.role !== 'admin') {
        return c.json({
          success: false,
          error: 'Apenas admins podem deletar permanentemente'
        }, 403);
      }

      await c.env.DB.prepare(
        'DELETE FROM funcionarios WHERE id = ?'
      ).bind(cardId).run();

      logger.info('Kanban card deleted (hard)', { card_id: cardId });

      return c.json({
        success: true,
        message: 'Card deletado permanentemente'
      });

    } else {
      // Soft delete (arquivar)
      const result = await c.env.DB.prepare(`
        UPDATE funcionarios
        SET arquivado = 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        RETURNING *
      `).bind(cardId).first();

      if (!result) {
        return c.json({
          success: false,
          error: 'Card não encontrado'
        }, 404);
      }

      logger.info('Kanban card archived', { card_id: cardId });

      return c.json({
        success: true,
        card: result,
        message: 'Card arquivado'
      });
    }

  } catch (error: any) {
    logger.error('Error deleting/archiving card', error);
    return c.json({
      success: false,
      error: 'Erro ao arquivar card',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/kanban/cards/:id/consult
 *
 * Executa consulta SERPRO no card e atualiza metadados
 */
router.post('/cards/:id/consult', authMiddleware, zValidator('json', consultSchema), async (c) => {
  try {
    const cardId = c.req.param('id');
    const { api_type } = c.req.valid('json');
    const user = c.get('user') as AuthenticatedUser;

    // Buscar card
    const card = await c.env.DB.prepare(
      'SELECT * FROM funcionarios WHERE id = ?'
    ).bind(cardId).first();

    if (!card) {
      return c.json({
        success: false,
        error: 'Card não encontrado'
      }, 404);
    }

    let result: any;
    let cost = 0;

    // Executar consulta apropriada
    if (api_type === 'cpf') {
      if (!card.cpf) {
        return c.json({
          success: false,
          error: 'Card não possui CPF'
        }, 400);
      }

      const cpfService = new CpfService(c.env);
      result = await cpfService.consultarCpf(card.cpf, user.uid, card.tenant_code);
      cost = 0.6591;

    } else if (api_type.startsWith('cnpj_')) {
      if (!card.cnpj) {
        return c.json({
          success: false,
          error: 'Card não possui CNPJ'
        }, 400);
      }

      const cnpjService = new CnpjService(c.env);

      if (api_type === 'cnpj_basica') {
        result = await cnpjService.consultarCnpjBasica(card.cnpj, user.uid, card.tenant_code);
        cost = 0.6591;
      } else if (api_type === 'cnpj_qsa') {
        result = await cnpjService.consultarCnpjQsa(card.cnpj, user.uid, card.tenant_code);
        cost = 0.8788;
      } else if (api_type === 'cnpj_empresa') {
        result = await cnpjService.consultarCnpjEmpresa(card.cnpj, user.uid, card.tenant_code);
        cost = 1.1722;
      }
    }

    // Atualizar card com dados da consulta
    const newMetadata = {
      ...(card.metadata ? JSON.parse(card.metadata) : {}),
      [api_type]: result,
      last_consult: new Date().toISOString()
    };

    const updatedCard = await c.env.DB.prepare(`
      UPDATE funcionarios
      SET
        metadata = ?,
        custo = custo + ?,
        consultado_em = CURRENT_TIMESTAMP,
        status_investigacao = CASE
          WHEN status_investigacao = 'investigar' THEN 'investigando'
          ELSE status_investigacao
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING *
    `).bind(
      JSON.stringify(newMetadata),
      cost,
      cardId
    ).first();

    logger.info('Kanban card consulted', {
      card_id: cardId,
      api_type,
      cost
    });

    return c.json({
      success: true,
      card: updatedCard,
      consult_result: result,
      cost
    });

  } catch (error: any) {
    logger.error('Error consulting card', error);
    return c.json({
      success: false,
      error: 'Erro ao consultar card',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/kanban/stats
 *
 * Retorna estatísticas agregadas do Kanban
 */
router.get('/stats', authMiddleware, async (c) => {
  try {
    const tenantCode = c.req.query('tenant_code');

    let query = `
      SELECT
        status_investigacao,
        COUNT(*) as count,
        SUM(custo) as total_cost,
        AVG(custo) as avg_cost
      FROM funcionarios
      WHERE arquivado = 0
    `;
    const params: any[] = [];

    if (tenantCode) {
      query += ' AND tenant_code = ?';
      params.push(tenantCode);
    }

    query += ' GROUP BY status_investigacao';

    const { results } = await c.env.DB.prepare(query).bind(...params).all();

    // Total stats
    let totalQuery = `
      SELECT
        COUNT(*) as total_cards,
        SUM(custo) as total_cost,
        COUNT(DISTINCT tenant_code) as total_tenants
      FROM funcionarios
      WHERE arquivado = 0
    `;
    const totalParams: any[] = [];

    if (tenantCode) {
      totalQuery += ' AND tenant_code = ?';
      totalParams.push(tenantCode);
    }

    const totals = await c.env.DB.prepare(totalQuery).bind(...totalParams).first();

    return c.json({
      success: true,
      by_status: results,
      totals: totals || {
        total_cards: 0,
        total_cost: 0,
        total_tenants: 0
      }
    });

  } catch (error: any) {
    logger.error('Error fetching kanban stats', error);
    return c.json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      details: error.message
    }, 500);
  }
});

export default router;
