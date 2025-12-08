/**
 * Dados Routes
 *
 * Endpoints para gerenciar dados de investigação:
 * - Importar funcionários
 * - Listar funcionários (com cache SERPRO)
 * - Processar jobs (admin only)
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env } from '../types/api.types';

const router = new Hono<{ Bindings: Env }>();

/**
 * POST /api/admin/import-funcionarios
 *
 * Importa lista de funcionários de um CSV e cria job para consultar SERPRO
 *
 * Body:
 * {
 *   tenant_code: "CLIENTE_01",
 *   funcionarios: [
 *     { cpf: "12345678900", grupo: "COMURG", cargo: "Auxiliar", salario: 1500 },
 *     { cpf: "98765432100", grupo: "SECRETARIA", cargo: "Gerente", salario: 4500 }
 *   ]
 * }
 *
 * Response:
 * {
 *   success: true,
 *   message: "2 funcionários importados",
 *   job_created: true,
 *   job_id: 1,
 *   tenant_code: "CLIENTE_01"
 * }
 */
router.post('/import-funcionarios', authMiddleware, async (c) => {
  const { tenant_code, funcionarios } = await c.req.json();

  // Validações
  if (!tenant_code || !funcionarios || !Array.isArray(funcionarios)) {
    return c.json({ error: 'Dados inválidos. Esperado: { tenant_code, funcionarios: [] }' }, 400);
  }

  if (funcionarios.length === 0) {
    return c.json({ error: 'Lista de funcionários vazia' }, 400);
  }

  try {
    // 1. Inserir funcionários no D1
    const insertStmt = c.env.DB.prepare(`
      INSERT INTO funcionarios (tenant_code, cpf, nome_importado, grupo, cargo, salario)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(tenant_code, cpf) DO UPDATE SET
        nome_importado = excluded.nome_importado,
        grupo = excluded.grupo,
        cargo = excluded.cargo,
        salario = excluded.salario,
        updated_at = CURRENT_TIMESTAMP
    `);

    const batch = funcionarios.map((f: any) =>
      insertStmt.bind(
        tenant_code,
        f.cpf,
        f.nome || null,
        f.grupo || null,
        f.cargo || null,
        f.salario || null
      )
    );

    await c.env.DB.batch(batch);

    // 2. Criar job para consultar SERPRO em background
    const cpfs = funcionarios.map((f: any) => f.cpf);

    const jobResult = await c.env.DB.prepare(`
      INSERT INTO jobs_queue (type, tenant_code, status, data_json, items_total, priority)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING id
    `).bind(
      'consultar_cpf_batch',
      tenant_code,
      'pending',
      JSON.stringify({ cpfs }),
      cpfs.length,
      5  // Prioridade média
    ).first();

    // 3. Log de auditoria
    const userId = c.get('userId') || 'system';
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, metadata)
      VALUES (?, ?, ?, ?)
    `).bind(
      userId,
      'import',
      'funcionarios',
      JSON.stringify({ tenant_code, count: funcionarios.length })
    ).run();

    return c.json({
      success: true,
      message: `${funcionarios.length} funcionários importados`,
      job_created: true,
      job_id: jobResult?.id,
      tenant_code
    });

  } catch (error: any) {
    console.error('[Import Funcionários] Erro:', error);
    return c.json({
      error: 'Erro ao importar funcionários',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/admin/tenants/:code/funcionarios
 *
 * Lista funcionários de um tenant com dados do cache SERPRO
 *
 * Response:
 * {
 *   funcionarios: [...],
 *   total: 123,
 *   cache_stats: { cached: 100, pending: 23, expired: 0, percentage: 81 }
 * }
 */
router.get('/tenants/:code/funcionarios', authMiddleware, async (c) => {
  const tenantCode = c.req.param('code');

  try {
    // Query principal: JOIN com cache SERPRO
    const { results } = await c.env.DB.prepare(`
      SELECT
        f.id,
        f.cpf,
        f.grupo,
        f.cargo,
        f.salario,

        -- Dados do cache SERPRO (se existir)
        COALESCE(cache.nome, f.nome_importado) as nome,
        cache.nascimento,
        cache.situacao_codigo,
        cache.situacao_descricao,
        cache.updated_at as ultima_consulta_serpro,

        -- Dados enriquecidos
        f.esta_morto,
        f.ano_obito,
        f.recebe_beneficio,
        f.qual_beneficio,
        f.socio_empresa,
        f.qtd_empresas,
        f.doador_campanha,
        f.valor_doacoes,
        f.candidato,
        f.sancionado_ceis,
        f.sancionado_ofac,

        -- Status do cache
        CASE
          WHEN cache.cpf IS NULL THEN 'pending'
          WHEN cache.expires_at < datetime('now') THEN 'expired'
          ELSE 'cached'
        END as cache_status

      FROM funcionarios f
      LEFT JOIN serpro_cpf_cache cache ON f.cpf = cache.cpf
      WHERE f.tenant_code = ?
      ORDER BY f.id
    `).bind(tenantCode).all();

    // Estatísticas do cache
    const cached = results.filter((r: any) => r.cache_status === 'cached').length;
    const pending = results.filter((r: any) => r.cache_status === 'pending').length;
    const expired = results.filter((r: any) => r.cache_status === 'expired').length;

    return c.json({
      funcionarios: results,
      total: results.length,
      cache_stats: {
        cached,
        pending,
        expired,
        percentage: results.length > 0 ? Math.round((cached / results.length) * 100) : 0
      },
      tenant_code: tenantCode
    });

  } catch (error: any) {
    console.error('[List Funcionários] Erro:', error);
    return c.json({
      error: 'Erro ao listar funcionários',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/admin/process-jobs
 *
 * Processa manualmente jobs pendentes (para testes/admin)
 *
 * Response:
 * {
 *   success: true,
 *   jobs_processed: 1,
 *   message: "Job #1 processado"
 * }
 */
router.post('/process-jobs', authMiddleware, async (c) => {
  try {
    // Importar processador
    const { processJobs } = await import('../cron/process-jobs');

    await processJobs(c.env);

    return c.json({
      success: true,
      message: 'Processamento de jobs iniciado'
    });

  } catch (error: any) {
    console.error('[Process Jobs] Erro:', error);
    return c.json({
      error: 'Erro ao processar jobs',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/admin/jobs
 *
 * Lista jobs da fila (para monitoramento)
 */
router.get('/jobs', authMiddleware, async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT
        id, type, tenant_code, status, priority, progress,
        items_total, items_processed, items_failed,
        created_at, started_at, completed_at
      FROM jobs_queue
      ORDER BY priority ASC, created_at DESC
      LIMIT 50
    `).all();

    return c.json({
      jobs: results,
      total: results.length
    });

  } catch (error: any) {
    console.error('[List Jobs] Erro:', error);
    return c.json({
      error: 'Erro ao listar jobs',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/admin/tenants/:code/funcionarios/from-serpro
 *
 * Cria ou atualiza um funcionário a partir de uma consulta SERPRO
 * Integração com Kanban: auto-cria card com status 'investigando'
 *
 * Body:
 * {
 *   cpf: "12345678900",
 *   tipo: "consulta_cpf",
 *   metadata: {
 *     api: "cpf",
 *     nome: "João da Silva",
 *     nascimento: "01/01/1990",
 *     situacao: "regular"
 *   },
 *   custo: 0.50,
 *   status_investigacao: "investigando"  // opcional, default: 'investigando'
 * }
 *
 * Response:
 * {
 *   success: true,
 *   funcionario: { id, cpf, nome, ... },
 *   created: true
 * }
 */
router.post('/tenants/:code/funcionarios/from-serpro', authMiddleware, async (c) => {
  const tenantCode = c.req.param('code');
  const { cpf, tipo, metadata, custo, status_investigacao, cnpj } = await c.req.json();

  // Validações
  if (!cpf && !cnpj) {
    return c.json({ error: 'CPF ou CNPJ obrigatório' }, 400);
  }

  if (!tipo) {
    return c.json({ error: 'Tipo obrigatório (ex: consulta_cpf, consulta_cnpj)' }, 400);
  }

  try {
    const userId = c.get('userId') || 'system';
    const documento = cpf || cnpj;
    const statusKanban = status_investigacao || 'investigando';
    const metadataJson = JSON.stringify(metadata || {});
    const custoValue = custo || 0.00;

    // Verificar se funcionário já existe
    const existing = await c.env.DB.prepare(`
      SELECT id FROM funcionarios
      WHERE tenant_code = ? AND cpf = ?
    `).bind(tenantCode, documento).first();

    let funcionarioId;

    if (existing) {
      // Atualizar existente
      await c.env.DB.prepare(`
        UPDATE funcionarios SET
          nome_importado = ?,
          tipo = ?,
          metadata = ?,
          custo = custo + ?,
          consultado_em = CURRENT_TIMESTAMP,
          status_investigacao = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE tenant_code = ? AND cpf = ?
      `).bind(
        metadata?.nome || null,
        tipo,
        metadataJson,
        custoValue,
        statusKanban,
        tenantCode,
        documento
      ).run();

      funcionarioId = existing.id;

    } else {
      // Criar novo
      const result = await c.env.DB.prepare(`
        INSERT INTO funcionarios (
          tenant_code, cpf, nome_importado, tipo, metadata,
          custo, consultado_em, status_investigacao
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
        RETURNING id
      `).bind(
        tenantCode,
        documento,
        metadata?.nome || null,
        tipo,
        metadataJson,
        custoValue,
        statusKanban
      ).first();

      funcionarioId = result?.id;
    }

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      userId,
      existing ? 'update' : 'create',
      'funcionario_serpro',
      String(funcionarioId),
      metadataJson
    ).run();

    // Buscar dados completos do funcionário criado/atualizado
    const funcionario = await c.env.DB.prepare(`
      SELECT
        f.id, f.cpf, f.nome_importado as nome, f.grupo, f.cargo, f.salario,
        f.tipo, f.metadata, f.custo, f.consultado_em, f.status_investigacao,
        f.observacoes, f.arquivado, f.created_at, f.updated_at
      FROM funcionarios f
      WHERE f.id = ?
    `).bind(funcionarioId).first();

    return c.json({
      success: true,
      funcionario: funcionario,
      created: !existing,
      tenant_code: tenantCode
    });

  } catch (error: any) {
    console.error('[From SERPRO] Erro:', error);
    return c.json({
      error: 'Erro ao criar funcionário',
      details: error.message
    }, 500);
  }
});

/**
 * PATCH /api/admin/tenants/:code/funcionarios/:id
 *
 * Atualiza status e campos de um funcionário (Kanban drag & drop)
 *
 * Body:
 * {
 *   status_investigacao?: "investigar" | "investigando" | "relatorio" | "monitoramento" | "aprovado" | "bloqueado",
 *   observacoes?: "texto livre",
 *   arquivado?: 0 | 1
 * }
 */
router.patch('/tenants/:code/funcionarios/:id', authMiddleware, async (c) => {
  const tenantCode = c.req.param('code');
  const funcionarioId = c.req.param('id');
  const updates = await c.req.json();

  try {
    const userId = c.get('userId') || 'system';

    // Construir SQL dinamicamente baseado nos campos enviados
    const allowedFields = ['status_investigacao', 'observacoes', 'arquivado'];
    const updateFields = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .map(key => `${key} = ?`);

    if (updateFields.length === 0) {
      return c.json({ error: 'Nenhum campo válido para atualizar' }, 400);
    }

    const values = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .map(key => updates[key]);

    await c.env.DB.prepare(`
      UPDATE funcionarios SET
        ${updateFields.join(', ')},
        updated_at = CURRENT_TIMESTAMP
      WHERE tenant_code = ? AND id = ?
    `).bind(...values, tenantCode, funcionarioId).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      userId,
      'update',
      'funcionario',
      funcionarioId,
      JSON.stringify(updates)
    ).run();

    // Retornar funcionário atualizado
    const funcionario = await c.env.DB.prepare(`
      SELECT * FROM funcionarios
      WHERE tenant_code = ? AND id = ?
    `).bind(tenantCode, funcionarioId).first();

    return c.json({
      success: true,
      funcionario: funcionario
    });

  } catch (error: any) {
    console.error('[Update Funcionário] Erro:', error);
    return c.json({
      error: 'Erro ao atualizar funcionário',
      details: error.message
    }, 500);
  }
});

export default router;
