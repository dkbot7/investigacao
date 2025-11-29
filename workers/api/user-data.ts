/**
 * User Data API Routes
 * API para dados individuais de cada usuario
 * TODOS OS DADOS SAO ISOLADOS POR USER_ID
 */

import { Hono } from 'hono'
import { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// ============================================
// HELPERS
// ============================================

/**
 * Obter user_id do contexto (definido pelo middleware de auth)
 */
function getUserId(c: any): string | null {
  return c.get('userId') as string | null
}

/**
 * Obter firebase_uid do contexto
 */
function getFirebaseUid(c: any): string | null {
  return c.get('firebaseUid') as string | null
}

/**
 * Buscar ou criar usuario no D1 baseado no firebase_uid
 */
async function ensureUser(c: any): Promise<{ id: string; email: string } | null> {
  const firebaseUid = getFirebaseUid(c)
  const userEmail = c.get('userEmail') as string

  if (!firebaseUid) return null

  // Buscar usuario existente
  let user = await c.env.DB.prepare(
    'SELECT id, email FROM users WHERE firebase_uid = ? LIMIT 1'
  ).bind(firebaseUid).first() as { id: string; email: string } | null

  // Se nao existe, criar
  if (!user && userEmail) {
    const userId = crypto.randomUUID()
    await c.env.DB.prepare(`
      INSERT INTO users (id, firebase_uid, email, created_at, updated_at)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `).bind(userId, firebaseUid, userEmail).run()

    // Criar settings padrao
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
 * GET /api/user/info
 * Informacoes do usuario logado
 * Sempre retorna hasAccess: true para usuarios autenticados
 */
app.get('/info', async (c) => {
  const user = await ensureUser(c)

  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado', code: 'AUTH_REQUIRED' }, 401)
  }

  // Buscar settings do usuario
  const settings = await c.env.DB.prepare(
    'SELECT * FROM user_settings WHERE user_id = ? LIMIT 1'
  ).bind(user.id).first()

  // Contar funcionarios
  const count = await c.env.DB.prepare(
    'SELECT COUNT(*) as total FROM user_funcionarios WHERE user_id = ?'
  ).bind(user.id).first() as { total: number }

  return c.json({
    hasAccess: true,
    user: {
      id: user.id,
      email: user.email
    },
    settings: settings || { plano: 'free', limite_funcionarios: 100 },
    stats: {
      total_funcionarios: count?.total || 0
    }
  })
})

/**
 * GET /api/user/dashboard
 * Dados consolidados para o dashboard do usuario
 */
app.get('/dashboard', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    // Buscar estatisticas consolidadas
    const stats = await c.env.DB.prepare(`
      SELECT
        COUNT(*) as total_funcionarios,
        SUM(CASE WHEN esta_morto LIKE 'SIM%' THEN 1 ELSE 0 END) as total_obitos,
        SUM(CASE WHEN recebe_beneficio = 1 THEN 1 ELSE 0 END) as total_beneficiarios,
        SUM(CASE WHEN sancionado_ceis = 1 THEN 1 ELSE 0 END) as total_sancionados,
        SUM(CASE WHEN doador_campanha = 1 THEN 1 ELSE 0 END) as total_doadores,
        SUM(CASE WHEN candidato = 1 THEN 1 ELSE 0 END) as total_candidatos,
        SUM(CASE WHEN socio_empresa = 1 THEN 1 ELSE 0 END) as total_socios
      FROM user_funcionarios
      WHERE user_id = ?
    `).bind(user.id).first()

    // Buscar estatisticas por grupo
    const grupos = await c.env.DB.prepare(`
      SELECT
        grupo,
        COUNT(*) as registros,
        SUM(CASE WHEN esta_morto LIKE 'SIM%' THEN 1 ELSE 0 END) as obitos,
        SUM(CASE WHEN recebe_beneficio = 1 THEN 1 ELSE 0 END) as beneficiarios,
        SUM(CASE WHEN sancionado_ceis = 1 THEN 1 ELSE 0 END) as sancionados,
        SUM(CASE WHEN doador_campanha = 1 THEN 1 ELSE 0 END) as doadores,
        SUM(CASE WHEN candidato = 1 THEN 1 ELSE 0 END) as candidatos,
        SUM(CASE WHEN socio_empresa = 1 THEN 1 ELSE 0 END) as socios
      FROM user_funcionarios
      WHERE user_id = ?
      GROUP BY grupo
    `).bind(user.id).all()

    // Total de vinculos empresariais
    const vinculos = await c.env.DB.prepare(`
      SELECT COUNT(*) as total, COUNT(DISTINCT cnpj) as cnpjs
      FROM user_vinculos WHERE user_id = ?
    `).bind(user.id).first()

    // Total de doacoes
    const doacoesTotal = await c.env.DB.prepare(`
      SELECT SUM(valor) as total_valor, COUNT(*) as total_doacoes
      FROM user_doacoes WHERE user_id = ?
    `).bind(user.id).first()

    // Settings do usuario
    const settings = await c.env.DB.prepare(
      'SELECT empresa_nome, plano FROM user_settings WHERE user_id = ?'
    ).bind(user.id).first()

    return c.json({
      user: {
        email: user.email,
        empresa: settings?.empresa_nome || null,
        plano: settings?.plano || 'free'
      },
      stats,
      grupos: grupos.results,
      vinculos,
      doacoes: doacoesTotal,
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('[USER-DATA] Dashboard error:', err)
    return c.json({ error: true, message: 'Erro ao buscar dados do dashboard' }, 500)
  }
})

/**
 * GET /api/user/funcionarios
 * Lista de funcionarios do usuario
 */
app.get('/funcionarios', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  const { grupo, busca, alerta, page = '1', limit = '50' } = c.req.query()
  const offset = (parseInt(page) - 1) * parseInt(limit)

  try {
    let whereClause = 'WHERE user_id = ?'
    const params: any[] = [user.id]

    if (grupo) {
      whereClause += ' AND grupo = ?'
      params.push(grupo)
    }

    if (busca) {
      whereClause += ' AND (nome LIKE ? OR cpf LIKE ?)'
      params.push(`%${busca}%`, `%${busca}%`)
    }

    if (alerta === 'obito') {
      whereClause += " AND esta_morto LIKE 'SIM%'"
    } else if (alerta === 'beneficio') {
      whereClause += ' AND recebe_beneficio = 1'
    } else if (alerta === 'sancionado') {
      whereClause += ' AND sancionado_ceis = 1'
    } else if (alerta === 'doador') {
      whereClause += ' AND doador_campanha = 1'
    } else if (alerta === 'candidato') {
      whereClause += ' AND candidato = 1'
    } else if (alerta === 'socio') {
      whereClause += ' AND socio_empresa = 1'
    }

    // Count total
    const countResult = await c.env.DB.prepare(
      `SELECT COUNT(*) as total FROM user_funcionarios ${whereClause}`
    ).bind(...params).first()

    // Get data
    const query = `
      SELECT
        id, cadastro, nome, cpf, grupo, cargo, salario,
        esta_vivo, esta_morto, ano_obito,
        recebe_beneficio, qual_beneficio,
        socio_empresa, qtd_empresas,
        doador_campanha, valor_doacoes,
        candidato, sancionado_ceis, sancionado_ofac
      FROM user_funcionarios
      ${whereClause}
      ORDER BY nome ASC
      LIMIT ? OFFSET ?
    `
    params.push(parseInt(limit), offset)

    const funcionarios = await c.env.DB.prepare(query).bind(...params).all()

    return c.json({
      funcionarios: funcionarios.results,
      pagination: {
        total: (countResult as any)?.total || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(((countResult as any)?.total || 0) / parseInt(limit))
      }
    })
  } catch (err) {
    console.error('[USER-DATA] Funcionarios error:', err)
    return c.json({ error: true, message: 'Erro ao buscar funcionarios' }, 500)
  }
})

/**
 * POST /api/user/funcionarios
 * Adicionar funcionario
 */
app.post('/funcionarios', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const body = await c.req.json()
    const { nome, cpf, grupo, cargo, salario } = body

    if (!nome || !cpf) {
      return c.json({ error: true, message: 'Nome e CPF sao obrigatorios' }, 400)
    }

    const id = crypto.randomUUID()
    await c.env.DB.prepare(`
      INSERT INTO user_funcionarios (id, user_id, nome, cpf, grupo, cargo, salario)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, user.id, nome, cpf, grupo || null, cargo || null, salario || null).run()

    return c.json({ success: true, id, message: 'Funcionario adicionado' })
  } catch (err) {
    console.error('[USER-DATA] Add funcionario error:', err)
    return c.json({ error: true, message: 'Erro ao adicionar funcionario' }, 500)
  }
})

/**
 * POST /api/user/funcionarios/import
 * Importar funcionarios em lote (CSV/JSON)
 */
app.post('/funcionarios/import', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const body = await c.req.json()
    const { funcionarios } = body

    if (!Array.isArray(funcionarios) || funcionarios.length === 0) {
      return c.json({ error: true, message: 'Lista de funcionarios vazia' }, 400)
    }

    // Verificar limite do plano
    const settings = await c.env.DB.prepare(
      'SELECT limite_funcionarios FROM user_settings WHERE user_id = ?'
    ).bind(user.id).first() as { limite_funcionarios: number } | null

    const currentCount = await c.env.DB.prepare(
      'SELECT COUNT(*) as total FROM user_funcionarios WHERE user_id = ?'
    ).bind(user.id).first() as { total: number }

    const limite = settings?.limite_funcionarios || 100
    if ((currentCount?.total || 0) + funcionarios.length > limite) {
      return c.json({
        error: true,
        message: `Limite de ${limite} funcionarios excedido. Atual: ${currentCount?.total || 0}`
      }, 400)
    }

    let imported = 0
    for (const f of funcionarios) {
      if (!f.nome || !f.cpf) continue

      const id = crypto.randomUUID()
      await c.env.DB.prepare(`
        INSERT INTO user_funcionarios (
          id, user_id, cadastro, nome, cpf, grupo, cargo, salario,
          esta_vivo, esta_morto, ano_obito,
          recebe_beneficio, qual_beneficio,
          socio_empresa, qtd_empresas,
          doador_campanha, valor_doacoes,
          candidato, sancionado_ceis, sancionado_ofac
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id, user.id,
        f.cadastro || null,
        f.nome,
        f.cpf,
        f.grupo || null,
        f.cargo || null,
        f.salario || null,
        f.esta_vivo || 'SIM',
        f.esta_morto || 'NAO',
        f.ano_obito || null,
        f.recebe_beneficio || 0,
        f.qual_beneficio || null,
        f.socio_empresa || 0,
        f.qtd_empresas || 0,
        f.doador_campanha || 0,
        f.valor_doacoes || 0,
        f.candidato || 0,
        f.sancionado_ceis || 0,
        f.sancionado_ofac || 0
      ).run()
      imported++
    }

    return c.json({ success: true, imported, message: `${imported} funcionarios importados` })
  } catch (err) {
    console.error('[USER-DATA] Import error:', err)
    return c.json({ error: true, message: 'Erro ao importar funcionarios' }, 500)
  }
})

/**
 * GET /api/user/funcionario/:id
 * Detalhes de um funcionario
 */
app.get('/funcionario/:id', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  const funcionarioId = c.req.param('id')

  try {
    // Dados do funcionario (APENAS DO USUARIO LOGADO)
    const funcionario = await c.env.DB.prepare(`
      SELECT * FROM user_funcionarios
      WHERE id = ? AND user_id = ?
    `).bind(funcionarioId, user.id).first()

    if (!funcionario) {
      return c.json({ error: true, message: 'Funcionario nao encontrado' }, 404)
    }

    // Candidaturas
    const candidaturas = await c.env.DB.prepare(`
      SELECT * FROM user_candidaturas
      WHERE funcionario_id = ? AND user_id = ?
      ORDER BY ano DESC
    `).bind(funcionarioId, user.id).all()

    // Doacoes
    const doacoes = await c.env.DB.prepare(`
      SELECT * FROM user_doacoes
      WHERE funcionario_id = ? AND user_id = ?
      ORDER BY ano DESC, valor DESC
    `).bind(funcionarioId, user.id).all()

    // Vinculos empresariais
    const vinculos = await c.env.DB.prepare(`
      SELECT * FROM user_vinculos
      WHERE funcionario_id = ? AND user_id = ?
    `).bind(funcionarioId, user.id).all()

    // Sancoes
    const sancoes = await c.env.DB.prepare(`
      SELECT * FROM user_sancoes
      WHERE funcionario_id = ? AND user_id = ?
    `).bind(funcionarioId, user.id).all()

    // Beneficios
    const beneficios = await c.env.DB.prepare(`
      SELECT * FROM user_beneficios
      WHERE funcionario_id = ? AND user_id = ?
    `).bind(funcionarioId, user.id).all()

    return c.json({
      funcionario,
      candidaturas: candidaturas.results,
      doacoes: doacoes.results,
      vinculos: vinculos.results,
      sancoes: sancoes.results,
      beneficios: beneficios.results
    })
  } catch (err) {
    console.error('[USER-DATA] Funcionario detail error:', err)
    return c.json({ error: true, message: 'Erro ao buscar dados do funcionario' }, 500)
  }
})

/**
 * GET /api/user/obitos
 * Lista de obitos
 */
app.get('/obitos', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const obitos = await c.env.DB.prepare(`
      SELECT
        f.id, f.cadastro, f.nome, f.cpf, f.grupo, f.cargo,
        f.data_admissao, f.salario, f.ano_obito,
        o.data_obito, o.fonte
      FROM user_funcionarios f
      LEFT JOIN user_obitos o ON f.id = o.funcionario_id AND o.user_id = ?
      WHERE f.user_id = ? AND f.esta_morto LIKE 'SIM%'
      ORDER BY f.ano_obito DESC, f.nome
    `).bind(user.id, user.id).all()

    return c.json({
      obitos: obitos.results,
      total: obitos.results.length
    })
  } catch (err) {
    console.error('[USER-DATA] Obitos error:', err)
    return c.json({ error: true, message: 'Erro ao buscar obitos' }, 500)
  }
})

/**
 * GET /api/user/candidatos
 */
app.get('/candidatos', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const candidatos = await c.env.DB.prepare(`
      SELECT
        f.id as funcionario_id, f.nome, f.cpf, f.grupo,
        ca.cargo, ca.partido, ca.uf, ca.ano, ca.situacao, ca.votos
      FROM user_candidaturas ca
      JOIN user_funcionarios f ON ca.funcionario_id = f.id AND f.user_id = ?
      WHERE ca.user_id = ?
      ORDER BY ca.ano DESC, f.nome
    `).bind(user.id, user.id).all()

    return c.json({
      candidatos: candidatos.results,
      total: candidatos.results.length
    })
  } catch (err) {
    console.error('[USER-DATA] Candidatos error:', err)
    return c.json({ error: true, message: 'Erro ao buscar candidatos' }, 500)
  }
})

/**
 * GET /api/user/doadores
 */
app.get('/doadores', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const doadores = await c.env.DB.prepare(`
      SELECT
        f.id as funcionario_id, f.nome as nome_doador, f.cpf as cpf_doador, f.grupo,
        d.nome_candidato, d.partido, d.cargo, d.ano, d.valor
      FROM user_doacoes d
      JOIN user_funcionarios f ON d.funcionario_id = f.id AND f.user_id = ?
      WHERE d.user_id = ?
      ORDER BY d.valor DESC, d.ano DESC
    `).bind(user.id, user.id).all()

    const totalValor = doadores.results.reduce((sum: number, d: any) => sum + (d.valor || 0), 0)

    return c.json({
      doadores: doadores.results,
      total: doadores.results.length,
      valor_total: totalValor
    })
  } catch (err) {
    console.error('[USER-DATA] Doadores error:', err)
    return c.json({ error: true, message: 'Erro ao buscar doadores' }, 500)
  }
})

/**
 * GET /api/user/sancionados
 */
app.get('/sancionados', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const sancionados = await c.env.DB.prepare(`
      SELECT
        f.id as funcionario_id, f.nome, f.cpf, f.grupo,
        s.tipo_sancao, s.orgao_sancionador, s.fundamentacao,
        s.data_inicio, s.data_fim
      FROM user_sancoes s
      JOIN user_funcionarios f ON s.funcionario_id = f.id AND f.user_id = ?
      WHERE s.user_id = ?
      ORDER BY s.data_inicio DESC
    `).bind(user.id, user.id).all()

    return c.json({
      sancionados: sancionados.results,
      total: sancionados.results.length
    })
  } catch (err) {
    console.error('[USER-DATA] Sancionados error:', err)
    return c.json({ error: true, message: 'Erro ao buscar sancionados' }, 500)
  }
})

/**
 * GET /api/user/vinculos
 */
app.get('/vinculos', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const vinculos = await c.env.DB.prepare(`
      SELECT
        f.id as funcionario_id, f.nome as nome_socio, f.cpf as cpf_socio, f.grupo,
        v.cnpj, v.razao_social, v.nome_fantasia, v.qualificacao,
        v.situacao_cadastral, v.capital_social
      FROM user_vinculos v
      JOIN user_funcionarios f ON v.funcionario_id = f.id AND f.user_id = ?
      WHERE v.user_id = ?
      ORDER BY v.capital_social DESC NULLS LAST, f.nome
    `).bind(user.id, user.id).all()

    const cnpjsUnicos = new Set(vinculos.results.map((v: any) => v.cnpj)).size

    return c.json({
      vinculos: vinculos.results,
      total: vinculos.results.length,
      cnpjs_unicos: cnpjsUnicos
    })
  } catch (err) {
    console.error('[USER-DATA] Vinculos error:', err)
    return c.json({ error: true, message: 'Erro ao buscar vinculos' }, 500)
  }
})

/**
 * GET /api/user/beneficios
 */
app.get('/beneficios', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const beneficios = await c.env.DB.prepare(`
      SELECT
        f.id as funcionario_id, f.nome, f.cpf, f.grupo, f.cargo, f.salario,
        b.tipo_beneficio, b.valor, b.ano_referencia
      FROM user_beneficios b
      JOIN user_funcionarios f ON b.funcionario_id = f.id AND f.user_id = ?
      WHERE b.user_id = ?
      ORDER BY b.valor DESC, f.nome
    `).bind(user.id, user.id).all()

    return c.json({
      beneficios: beneficios.results,
      total: beneficios.results.length
    })
  } catch (err) {
    console.error('[USER-DATA] Beneficios error:', err)
    return c.json({ error: true, message: 'Erro ao buscar beneficios' }, 500)
  }
})

/**
 * PUT /api/user/settings
 * Atualizar configuracoes do usuario
 */
app.put('/settings', async (c) => {
  const user = await ensureUser(c)
  if (!user) {
    return c.json({ error: true, message: 'Usuario nao autenticado' }, 401)
  }

  try {
    const body = await c.req.json()
    const { empresa_nome, empresa_cnpj } = body

    await c.env.DB.prepare(`
      UPDATE user_settings
      SET empresa_nome = ?, empresa_cnpj = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).bind(empresa_nome || null, empresa_cnpj || null, user.id).run()

    return c.json({ success: true, message: 'Configuracoes atualizadas' })
  } catch (err) {
    console.error('[USER-DATA] Settings error:', err)
    return c.json({ error: true, message: 'Erro ao atualizar configuracoes' }, 500)
  }
})

export default app
