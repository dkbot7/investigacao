/**
 * User Investigations API Routes
 * API para gerenciamento de investigações do usuário
 */

import { Hono } from 'hono'
import { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// ============================================
// HELPERS
// ============================================

function getUserId(c: any): string | null {
  return c.get('userId') as string | null
}

function getFirebaseUid(c: any): string | null {
  return c.get('firebaseUid') as string | null
}

async function ensureUser(c: any): Promise<{ id: string; email: string } | null> {
  const firebaseUid = getFirebaseUid(c)
  const userEmail = c.get('userEmail') as string

  if (!firebaseUid) return null

  let user = await c.env.DB.prepare(
    'SELECT id, email FROM users WHERE firebase_uid = ? LIMIT 1'
  ).bind(firebaseUid).first() as { id: string; email: string } | null

  if (!user && userEmail) {
    const userId = crypto.randomUUID()
    await c.env.DB.prepare(`
      INSERT INTO users (id, firebase_uid, email, created_at, updated_at)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `).bind(userId, firebaseUid, userEmail).run()

    await c.env.DB.prepare(`
      INSERT INTO user_settings (id, user_id, plano, limite_funcionarios)
      VALUES (?, ?, 'free', 100)
    `).bind(crypto.randomUUID(), userId).run()

    user = { id: userId, email: userEmail }
  }

  return user
}

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/investigations
 * Lista de investigações do usuário
 */
app.get('/', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  const { status, categoria, busca, page = '1', limit = '20' } = c.req.query()
  const offset = (parseInt(page) - 1) * parseInt(limit)

  try {
    let whereClause = 'WHERE user_id = ?'
    const params: any[] = [user.id]

    if (status) {
      whereClause += ' AND status = ?'
      params.push(status)
    }

    if (categoria) {
      whereClause += ' AND categoria = ?'
      params.push(categoria)
    }

    if (busca) {
      whereClause += ' AND (nome LIKE ? OR documento LIKE ?)'
      params.push(`%${busca}%`, `%${busca}%`)
    }

    // Count total
    const countResult = await c.env.DB.prepare(
      `SELECT COUNT(*) as total FROM user_investigacoes ${whereClause}`
    ).bind(...params).first()

    // Get data
    const query = `
      SELECT
        id, nome, documento, tipo_pessoa, is_grupo, grupo_nome, grupo_total_documentos,
        categoria, status, nivel_urgencia,
        email, telefones, endereco, motivo_investigacao, observacoes,
        relatorio_url, relatorio_gerado_em,
        created_at, updated_at
      FROM user_investigacoes
      ${whereClause}
      ORDER BY
        CASE nivel_urgencia
          WHEN 'urgente' THEN 1
          WHEN 'alta' THEN 2
          WHEN 'media' THEN 3
          ELSE 4
        END,
        created_at DESC
      LIMIT ? OFFSET ?
    `
    params.push(parseInt(limit), offset)

    const investigacoes = await c.env.DB.prepare(query).bind(...params).all()

    return c.json({
      investigacoes: investigacoes.results,
      pagination: {
        total: (countResult as any)?.total || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(((countResult as any)?.total || 0) / parseInt(limit))
      }
    })
  } catch (err) {
    console.error('[INVESTIGATIONS] List error:', err)
    return c.json({ error: true, message: 'Erro ao buscar investigacoes' }, 500)
  }
})

/**
 * GET /api/investigations/stats
 * Estatísticas das investigações do usuário
 */
app.get('/stats', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const stats = await c.env.DB.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status IN ('investigar', 'investigando') THEN 1 ELSE 0 END) as em_andamento,
        SUM(CASE WHEN status = 'relatorio' THEN 1 ELSE 0 END) as com_relatorio,
        SUM(CASE WHEN status IN ('aprovado', 'monitoramento') THEN 1 ELSE 0 END) as concluidas,
        SUM(CASE WHEN status = 'bloqueado' THEN 1 ELSE 0 END) as bloqueadas
      FROM user_investigacoes
      WHERE user_id = ?
    `).bind(user.id).first()

    const porCategoria = await c.env.DB.prepare(`
      SELECT categoria, COUNT(*) as total
      FROM user_investigacoes
      WHERE user_id = ?
      GROUP BY categoria
    `).bind(user.id).all()

    const porStatus = await c.env.DB.prepare(`
      SELECT status, COUNT(*) as total
      FROM user_investigacoes
      WHERE user_id = ?
      GROUP BY status
    `).bind(user.id).all()

    return c.json({
      stats,
      por_categoria: porCategoria.results,
      por_status: porStatus.results
    })
  } catch (err) {
    console.error('[INVESTIGATIONS] Stats error:', err)
    return c.json({ error: true, message: 'Erro ao buscar estatisticas' }, 500)
  }
})

/**
 * GET /api/investigations/:id
 * Detalhes de uma investigação
 */
app.get('/:id', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  const id = c.req.param('id')

  try {
    const investigacao = await c.env.DB.prepare(`
      SELECT * FROM user_investigacoes
      WHERE id = ? AND user_id = ?
    `).bind(id, user.id).first()

    if (!investigacao) {
      return c.json({ error: true, message: 'Investigacao nao encontrada' }, 404)
    }

    // Buscar mensagens relacionadas
    const mensagens = await c.env.DB.prepare(`
      SELECT * FROM user_mensagens
      WHERE investigacao_id = ? AND user_id = ?
      ORDER BY created_at DESC
    `).bind(id, user.id).all()

    return c.json({
      investigacao,
      mensagens: mensagens.results
    })
  } catch (err) {
    console.error('[INVESTIGATIONS] Detail error:', err)
    return c.json({ error: true, message: 'Erro ao buscar investigacao' }, 500)
  }
})

/**
 * POST /api/investigations
 * Criar nova investigação
 */
app.post('/', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const body = await c.req.json()
    const {
      nome,
      documento,
      tipo_pessoa = 'fisica',
      is_grupo = false,
      grupo_nome,
      grupo_total_documentos = 1,
      categoria = 'funcionarios',
      nivel_urgencia = 'media',
      email,
      telefones,
      endereco,
      redes_sociais,
      placa_veiculo,
      rg,
      estado_civil,
      profissao,
      data_nascimento,
      motivo_investigacao,
      escopo_investigacao,
      observacoes,
      prazo_desejado
    } = body

    if (!nome || !documento) {
      return c.json({ error: true, message: 'Nome e documento sao obrigatorios' }, 400)
    }

    const id = crypto.randomUUID()

    await c.env.DB.prepare(`
      INSERT INTO user_investigacoes (
        id, user_id, nome, documento, tipo_pessoa, is_grupo, grupo_nome, grupo_total_documentos,
        categoria, status, nivel_urgencia,
        email, telefones, endereco, redes_sociais, placa_veiculo,
        rg, estado_civil, profissao, data_nascimento,
        motivo_investigacao, escopo_investigacao, observacoes, prazo_desejado,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'investigar', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      id, user.id, nome, documento, tipo_pessoa,
      is_grupo ? 1 : 0, grupo_nome || null, grupo_total_documentos,
      categoria, nivel_urgencia,
      email || null,
      telefones ? JSON.stringify(telefones) : null,
      endereco || null,
      redes_sociais ? JSON.stringify(redes_sociais) : null,
      placa_veiculo || null,
      rg || null, estado_civil || null, profissao || null, data_nascimento || null,
      motivo_investigacao || null,
      escopo_investigacao ? JSON.stringify(escopo_investigacao) : null,
      observacoes || null, prazo_desejado || null
    ).run()

    // Notificar admin por email (opcional)
    try {
      if (c.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'investigaree <noreply@investigaree.com.br>',
            to: ['investigaree@gmail.com', 'ibsenmaciel@gmail.com'],
            subject: `Nova Investigação - ${nome}`,
            html: `
              <h2>Nova Investigação Solicitada</h2>
              <p><strong>Cliente:</strong> ${user.email}</p>
              <p><strong>Investigado:</strong> ${nome}</p>
              <p><strong>Documento:</strong> ${documento}</p>
              <p><strong>Tipo:</strong> ${tipo_pessoa === 'juridica' ? 'Pessoa Jurídica' : 'Pessoa Física'}</p>
              <p><strong>Categoria:</strong> ${categoria}</p>
              <p><strong>Urgência:</strong> ${nivel_urgencia}</p>
              ${motivo_investigacao ? `<p><strong>Motivo:</strong> ${motivo_investigacao}</p>` : ''}
              ${observacoes ? `<p><strong>Observações:</strong> ${observacoes}</p>` : ''}
              <hr>
              <p><small>ID: ${id}</small></p>
            `
          })
        })
      }
    } catch (emailErr) {
      console.error('[INVESTIGATIONS] Email notification error:', emailErr)
    }

    return c.json({ success: true, id, message: 'Investigacao criada com sucesso' })
  } catch (err) {
    console.error('[INVESTIGATIONS] Create error:', err)
    return c.json({ error: true, message: 'Erro ao criar investigacao' }, 500)
  }
})

/**
 * PUT /api/investigations/:id
 * Atualizar investigação
 */
app.put('/:id', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  const id = c.req.param('id')

  try {
    // Verificar se investigação existe e pertence ao usuário
    const exists = await c.env.DB.prepare(
      'SELECT id FROM user_investigacoes WHERE id = ? AND user_id = ?'
    ).bind(id, user.id).first()

    if (!exists) {
      return c.json({ error: true, message: 'Investigacao nao encontrada' }, 404)
    }

    const body = await c.req.json()
    const {
      nome,
      documento,
      categoria,
      nivel_urgencia,
      email,
      telefones,
      endereco,
      motivo_investigacao,
      observacoes
    } = body

    await c.env.DB.prepare(`
      UPDATE user_investigacoes SET
        nome = COALESCE(?, nome),
        documento = COALESCE(?, documento),
        categoria = COALESCE(?, categoria),
        nivel_urgencia = COALESCE(?, nivel_urgencia),
        email = COALESCE(?, email),
        telefones = COALESCE(?, telefones),
        endereco = COALESCE(?, endereco),
        motivo_investigacao = COALESCE(?, motivo_investigacao),
        observacoes = COALESCE(?, observacoes),
        updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).bind(
      nome || null, documento || null, categoria || null, nivel_urgencia || null,
      email || null,
      telefones ? JSON.stringify(telefones) : null,
      endereco || null,
      motivo_investigacao || null, observacoes || null,
      id, user.id
    ).run()

    return c.json({ success: true, message: 'Investigacao atualizada' })
  } catch (err) {
    console.error('[INVESTIGATIONS] Update error:', err)
    return c.json({ error: true, message: 'Erro ao atualizar investigacao' }, 500)
  }
})

/**
 * DELETE /api/investigations/:id
 * Excluir investigação (apenas se ainda não iniciada)
 */
app.delete('/:id', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  const id = c.req.param('id')

  try {
    // Verificar se pode ser excluída (apenas status 'investigar')
    const inv = await c.env.DB.prepare(
      'SELECT status FROM user_investigacoes WHERE id = ? AND user_id = ?'
    ).bind(id, user.id).first() as { status: string } | null

    if (!inv) {
      return c.json({ error: true, message: 'Investigacao nao encontrada' }, 404)
    }

    if (inv.status !== 'investigar') {
      return c.json({ error: true, message: 'Investigacao ja iniciada nao pode ser excluida' }, 400)
    }

    await c.env.DB.prepare(
      'DELETE FROM user_investigacoes WHERE id = ? AND user_id = ?'
    ).bind(id, user.id).run()

    return c.json({ success: true, message: 'Investigacao excluida' })
  } catch (err) {
    console.error('[INVESTIGATIONS] Delete error:', err)
    return c.json({ error: true, message: 'Erro ao excluir investigacao' }, 500)
  }
})

/**
 * POST /api/investigations/import
 * Importar múltiplas investigações (lote)
 */
app.post('/import', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const body = await c.req.json()
    const { items, grupo_nome, categoria = 'funcionarios', nivel_urgencia = 'media', motivo_investigacao } = body

    if (!Array.isArray(items) || items.length === 0) {
      return c.json({ error: true, message: 'Lista de itens vazia' }, 400)
    }

    // Criar registro de grupo
    const grupoId = crypto.randomUUID()
    const nomeGrupo = grupo_nome || `Lote ${new Date().toLocaleDateString('pt-BR')}`

    let imported = 0
    for (const item of items) {
      if (!item.nome || !item.documento) continue

      const id = crypto.randomUUID()
      await c.env.DB.prepare(`
        INSERT INTO user_investigacoes (
          id, user_id, nome, documento, tipo_pessoa, is_grupo, grupo_nome, grupo_total_documentos,
          categoria, status, nivel_urgencia, motivo_investigacao,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, 'investigar', ?, ?, datetime('now'), datetime('now'))
      `).bind(
        id, user.id, item.nome, item.documento,
        item.tipo_pessoa || 'fisica',
        nomeGrupo, items.length,
        categoria, nivel_urgencia, motivo_investigacao || null
      ).run()
      imported++
    }

    // Notificar admin
    try {
      if (c.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'investigaree <noreply@investigaree.com.br>',
            to: ['investigaree@gmail.com', 'ibsenmaciel@gmail.com'],
            subject: `Nova Análise em Lote - ${imported} registros`,
            html: `
              <h2>Nova Análise em Lote</h2>
              <p><strong>Cliente:</strong> ${user.email}</p>
              <p><strong>Grupo:</strong> ${nomeGrupo}</p>
              <p><strong>Total de registros:</strong> ${imported}</p>
              <p><strong>Categoria:</strong> ${categoria}</p>
              <p><strong>Urgência:</strong> ${nivel_urgencia}</p>
              ${motivo_investigacao ? `<p><strong>Motivo:</strong> ${motivo_investigacao}</p>` : ''}
            `
          })
        })
      }
    } catch (emailErr) {
      console.error('[INVESTIGATIONS] Email notification error:', emailErr)
    }

    return c.json({ success: true, imported, grupo: nomeGrupo, message: `${imported} investigacoes importadas` })
  } catch (err) {
    console.error('[INVESTIGATIONS] Import error:', err)
    return c.json({ error: true, message: 'Erro ao importar investigacoes' }, 500)
  }
})

// ============================================
// MENSAGENS
// ============================================

/**
 * POST /api/investigations/mensagem
 * Enviar mensagem/solicitação
 */
app.post('/mensagem', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const body = await c.req.json()
    const { assunto, mensagem, tipo = 'geral', investigacao_id } = body

    if (!assunto || !mensagem) {
      return c.json({ error: true, message: 'Assunto e mensagem sao obrigatorios' }, 400)
    }

    const id = crypto.randomUUID()

    await c.env.DB.prepare(`
      INSERT INTO user_mensagens (id, user_id, investigacao_id, assunto, mensagem, tipo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(id, user.id, investigacao_id || null, assunto, mensagem, tipo).run()

    // Enviar email de notificação
    try {
      if (c.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'investigaree <noreply@investigaree.com.br>',
            to: ['investigaree@gmail.com', 'ibsenmaciel@gmail.com'],
            replyTo: user.email,
            subject: `[${tipo.toUpperCase()}] ${assunto}`,
            html: `
              <h2>Nova Mensagem</h2>
              <p><strong>De:</strong> ${user.email}</p>
              <p><strong>Assunto:</strong> ${assunto}</p>
              <p><strong>Tipo:</strong> ${tipo}</p>
              ${investigacao_id ? `<p><strong>Investigação ID:</strong> ${investigacao_id}</p>` : ''}
              <hr>
              <p>${mensagem.replace(/\n/g, '<br>')}</p>
            `
          })
        })
      }
    } catch (emailErr) {
      console.error('[INVESTIGATIONS] Message email error:', emailErr)
    }

    return c.json({ success: true, id, message: 'Mensagem enviada com sucesso' })
  } catch (err) {
    console.error('[INVESTIGATIONS] Message error:', err)
    return c.json({ error: true, message: 'Erro ao enviar mensagem' }, 500)
  }
})

/**
 * GET /api/investigations/mensagens
 * Listar mensagens do usuário
 */
app.get('/mensagens', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const mensagens = await c.env.DB.prepare(`
      SELECT m.*, i.nome as investigacao_nome
      FROM user_mensagens m
      LEFT JOIN user_investigacoes i ON m.investigacao_id = i.id
      WHERE m.user_id = ?
      ORDER BY m.created_at DESC
      LIMIT 50
    `).bind(user.id).all()

    return c.json({ mensagens: mensagens.results })
  } catch (err) {
    console.error('[INVESTIGATIONS] List messages error:', err)
    return c.json({ error: true, message: 'Erro ao buscar mensagens' }, 500)
  }
})

export default app
