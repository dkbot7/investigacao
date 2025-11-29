/**
 * Tenant Data API Routes
 * API para servir dados específicos de cada tenant (cliente)
 *
 * SEGURANÇA: Todos os dados são filtrados por tenant_id
 * Acesso é verificado via tabela user_tenants
 */

import { Hono } from 'hono'
import { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// ============================================
// TYPES
// ============================================

interface TenantInfo {
  id: string
  code: string
  name: string
  role: string
}

// ============================================
// HELPERS
// ============================================

/**
 * Obter tenant(s) que o usuário tem acesso via user_tenants
 * Usa firebase_uid para buscar o user_id e depois os tenants associados
 */
async function getTenantsByFirebaseUid(
  firebaseUid: string,
  db: D1Database
): Promise<TenantInfo[]> {
  // Buscar usuário pelo firebase_uid
  const user = await db.prepare(
    'SELECT id FROM users WHERE firebase_uid = ? LIMIT 1'
  ).bind(firebaseUid).first() as { id: string } | null

  if (!user) {
    return []
  }

  // Buscar tenants associados ao usuário
  const result = await db.prepare(`
    SELECT t.id, t.code, t.name, ut.role
    FROM user_tenants ut
    JOIN tenants t ON ut.tenant_id = t.id
    WHERE ut.user_id = ?
      AND ut.is_active = 1
      AND t.status = 'active'
      AND (ut.expires_at IS NULL OR ut.expires_at > datetime('now'))
    ORDER BY ut.created_at ASC
  `).bind(user.id).all()

  return (result.results || []) as TenantInfo[]
}

/**
 * Verificar se usuário tem acesso a algum tenant
 * Retorna o primeiro tenant disponível ou null
 */
async function verifyTenantAccess(c: any): Promise<{ tenant: TenantInfo | null; tenants: TenantInfo[]; error?: Response }> {
  const firebaseUid = c.get('firebaseUid') as string

  if (!firebaseUid) {
    return {
      tenant: null,
      tenants: [],
      error: c.json({ error: true, message: 'Autenticação necessária', code: 'AUTH_REQUIRED' }, 401)
    }
  }

  const tenants = await getTenantsByFirebaseUid(firebaseUid, c.env.DB)

  if (tenants.length === 0) {
    // Usuário autenticado mas sem acesso a nenhum tenant
    return {
      tenant: null,
      tenants: [],
      error: c.json({
        error: true,
        message: 'Você ainda não tem acesso a nenhum cliente. Aguarde a liberação pelo administrador.',
        code: 'NO_TENANT_ACCESS'
      }, 403)
    }
  }

  // Retorna o primeiro tenant (no futuro pode haver seleção)
  return { tenant: tenants[0], tenants }
}

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/tenant/info
 * Informações do tenant do usuário logado
 * Retorna null se usuário não tem acesso a nenhum tenant
 */
app.get('/info', async (c) => {
  const firebaseUid = c.get('firebaseUid') as string

  if (!firebaseUid) {
    return c.json({ error: true, message: 'Autenticação necessária', code: 'AUTH_REQUIRED' }, 401)
  }

  const tenants = await getTenantsByFirebaseUid(firebaseUid, c.env.DB)

  if (tenants.length === 0) {
    // Usuário sem acesso - retorna status especial para frontend
    return c.json({
      hasAccess: false,
      tenant: null,
      tenants: [],
      message: 'Aguardando liberação de acesso'
    })
  }

  return c.json({
    hasAccess: true,
    tenant: tenants[0],
    tenants: tenants, // Para futura seleção de tenant
    role: tenants[0].role
  })
})

/**
 * GET /api/tenant/dashboard
 * Dados consolidados para o dashboard
 */
app.get('/dashboard', async (c) => {
  const { tenant, error } = await verifyTenantAccess(c)
  if (error) return error

  try {
    // Buscar estatísticas consolidadas
    const stats = await c.env.DB.prepare(`
      SELECT
        COUNT(*) as total_funcionarios,
        SUM(CASE WHEN esta_morto LIKE 'SIM%' THEN 1 ELSE 0 END) as total_obitos,
        SUM(CASE WHEN recebe_beneficio = 1 THEN 1 ELSE 0 END) as total_beneficiarios,
        SUM(CASE WHEN sancionado_ceis = 1 THEN 1 ELSE 0 END) as total_sancionados,
        SUM(CASE WHEN doador_campanha = 1 THEN 1 ELSE 0 END) as total_doadores,
        SUM(CASE WHEN candidato = 1 THEN 1 ELSE 0 END) as total_candidatos,
        SUM(CASE WHEN socio_empresa = 1 THEN 1 ELSE 0 END) as total_socios
      FROM tenant_funcionarios
      WHERE tenant_id = ?
    `).bind(tenant.id).first()

    // Buscar estatísticas por grupo
    const grupos = await c.env.DB.prepare(`
      SELECT
        grupo,
        COUNT(*) as registros,
        SUM(CASE WHEN esta_morto LIKE 'SIM%' THEN 1 ELSE 0 END) as obitos,
        SUM(CASE WHEN recebe_beneficio = 1 THEN 1 ELSE 0 END) as beneficiarios,
        SUM(CASE WHEN sancionado_ceis = 1 THEN 1 ELSE 0 END) as sancionados,
        SUM(CASE WHEN doador_campanha = 1 THEN 1 ELSE 0 END) as doadores,
        SUM(CASE WHEN candidato = 1 THEN 1 ELSE 0 END) as candidatos,
        SUM(CASE WHEN socio_empresa = 1 THEN 1 ELSE 0 END) as socios,
        COUNT(DISTINCT CASE WHEN socio_empresa = 1 THEN cpf END) as func_socios
      FROM tenant_funcionarios
      WHERE tenant_id = ?
      GROUP BY grupo
    `).bind(tenant.id).all()

    // Total de vínculos empresariais
    const vinculos = await c.env.DB.prepare(`
      SELECT COUNT(*) as total, COUNT(DISTINCT cnpj) as cnpjs
      FROM tenant_vinculos WHERE tenant_id = ?
    `).bind(tenant.id).first()

    // Total de doações
    const doacoesTotal = await c.env.DB.prepare(`
      SELECT SUM(valor) as total_valor, COUNT(*) as total_doacoes
      FROM tenant_doacoes WHERE tenant_id = ?
    `).bind(tenant.id).first()

    return c.json({
      tenant: {
        code: tenant.code,
        name: tenant.name
      },
      stats,
      grupos: grupos.results,
      vinculos,
      doacoes: doacoesTotal,
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('[TENANT-DATA] Dashboard error:', err)
    return c.json({ error: true, message: 'Erro ao buscar dados do dashboard' }, 500)
  }
})

/**
 * GET /api/tenant/funcionarios
 * Lista de funcionários com filtros
 */
app.get('/funcionarios', async (c) => {
  const { tenant, error } = await verifyTenantAccess(c)
  if (error) return error

  const { grupo, busca, alerta, page = '1', limit = '50' } = c.req.query()
  const offset = (parseInt(page) - 1) * parseInt(limit)

  try {
    let whereClause = 'WHERE tenant_id = ?'
    const params: any[] = [tenant.id]

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
      `SELECT COUNT(*) as total FROM tenant_funcionarios ${whereClause}`
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
      FROM tenant_funcionarios
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
    console.error('[TENANT-DATA] Funcionarios error:', err)
    return c.json({ error: true, message: 'Erro ao buscar funcionários' }, 500)
  }
})

/**
 * GET /api/tenant/funcionario/:id
 * Detalhes completos de um funcionário (ficha)
 */
app.get('/funcionario/:id', async (c) => {
  const { tenant, error } = await verifyTenantAccess(c)
  if (error) return error

  const funcionarioId = c.req.param('id')

  try {
    // Dados do funcionário
    const funcionario = await c.env.DB.prepare(`
      SELECT * FROM tenant_funcionarios
      WHERE id = ? AND tenant_id = ?
    `).bind(funcionarioId, tenant.id).first()

    if (!funcionario) {
      return c.json({ error: true, message: 'Funcionário não encontrado' }, 404)
    }

    // Candidaturas
    const candidaturas = await c.env.DB.prepare(`
      SELECT * FROM tenant_candidaturas
      WHERE funcionario_id = ? AND tenant_id = ?
      ORDER BY ano DESC
    `).bind(funcionarioId, tenant.id).all()

    // Doações
    const doacoes = await c.env.DB.prepare(`
      SELECT * FROM tenant_doacoes
      WHERE funcionario_id = ? AND tenant_id = ?
      ORDER BY ano DESC, valor DESC
    `).bind(funcionarioId, tenant.id).all()

    // Vínculos empresariais
    const vinculos = await c.env.DB.prepare(`
      SELECT * FROM tenant_vinculos
      WHERE funcionario_id = ? AND tenant_id = ?
    `).bind(funcionarioId, tenant.id).all()

    // Sanções
    const sancoes = await c.env.DB.prepare(`
      SELECT * FROM tenant_sancoes
      WHERE funcionario_id = ? AND tenant_id = ?
    `).bind(funcionarioId, tenant.id).all()

    // Benefícios
    const beneficios = await c.env.DB.prepare(`
      SELECT * FROM tenant_beneficios
      WHERE funcionario_id = ? AND tenant_id = ?
    `).bind(funcionarioId, tenant.id).all()

    return c.json({
      funcionario,
      candidaturas: candidaturas.results,
      doacoes: doacoes.results,
      vinculos: vinculos.results,
      sancoes: sancoes.results,
      beneficios: beneficios.results
    })
  } catch (err) {
    console.error('[TENANT-DATA] Funcionario detail error:', err)
    return c.json({ error: true, message: 'Erro ao buscar dados do funcionário' }, 500)
  }
})

/**
 * GET /api/tenant/obitos
 * Lista de óbitos identificados
 */
app.get('/obitos', async (c) => {
  const { tenant, error } = await verifyTenantAccess(c)
  if (error) return error

  try {
    const obitos = await c.env.DB.prepare(`
      SELECT
        f.id, f.cadastro, f.nome, f.cpf, f.grupo, f.cargo,
        f.data_admissao, f.salario, f.ano_obito,
        o.data_obito, o.fonte
      FROM tenant_funcionarios f
      LEFT JOIN tenant_obitos o ON f.id = o.funcionario_id
      WHERE f.tenant_id = ? AND f.esta_morto LIKE 'SIM%'
      ORDER BY f.ano_obito DESC, f.nome
    `).bind(tenant.id).all()

    return c.json({
      obitos: obitos.results,
      total: obitos.results.length
    })
  } catch (err) {
    console.error('[TENANT-DATA] Obitos error:', err)
    return c.json({ error: true, message: 'Erro ao buscar óbitos' }, 500)
  }
})

/**
 * GET /api/tenant/candidatos
 * Lista de funcionários que foram candidatos
 */
app.get('/candidatos', async (c) => {
  const { tenant, error } = await verifyTenantAccess(c)
  if (error) return error

  try {
    const candidatos = await c.env.DB.prepare(`
      SELECT
        f.id as funcionario_id, f.nome, f.cpf, f.grupo,
        c.cargo, c.partido, c.uf, c.ano, c.situacao, c.votos
      FROM tenant_candidaturas c
      JOIN tenant_funcionarios f ON c.funcionario_id = f.id
      WHERE c.tenant_id = ?
      ORDER BY c.ano DESC, f.nome
    `).bind(tenant.id).all()

    return c.json({
      candidatos: candidatos.results,
      total: candidatos.results.length
    })
  } catch (err) {
    console.error('[TENANT-DATA] Candidatos error:', err)
    return c.json({ error: true, message: 'Erro ao buscar candidatos' }, 500)
  }
})

/**
 * GET /api/tenant/doadores
 * Lista de funcionários que doaram para campanhas
 */
app.get('/doadores', async (c) => {
  const { tenant, error } = await verifyTenantAccess(c)
  if (error) return error

  try {
    const doadores = await c.env.DB.prepare(`
      SELECT
        f.id as funcionario_id, f.nome as nome_doador, f.cpf as cpf_doador, f.grupo,
        d.nome_candidato, d.partido, d.cargo, d.ano, d.valor
      FROM tenant_doacoes d
      JOIN tenant_funcionarios f ON d.funcionario_id = f.id
      WHERE d.tenant_id = ?
      ORDER BY d.valor DESC, d.ano DESC
    `).bind(tenant.id).all()

    const totalValor = doadores.results.reduce((sum: number, d: any) => sum + (d.valor || 0), 0)

    return c.json({
      doadores: doadores.results,
      total: doadores.results.length,
      valor_total: totalValor
    })
  } catch (err) {
    console.error('[TENANT-DATA] Doadores error:', err)
    return c.json({ error: true, message: 'Erro ao buscar doadores' }, 500)
  }
})

/**
 * GET /api/tenant/sancionados
 * Lista de funcionários sancionados
 */
app.get('/sancionados', async (c) => {
  const { tenant, error } = await verifyTenantAccess(c)
  if (error) return error

  try {
    const sancionados = await c.env.DB.prepare(`
      SELECT
        f.id as funcionario_id, f.nome, f.cpf, f.grupo,
        s.tipo_sancao, s.orgao_sancionador, s.fundamentacao,
        s.data_inicio, s.data_fim
      FROM tenant_sancoes s
      JOIN tenant_funcionarios f ON s.funcionario_id = f.id
      WHERE s.tenant_id = ?
      ORDER BY s.data_inicio DESC
    `).bind(tenant.id).all()

    return c.json({
      sancionados: sancionados.results,
      total: sancionados.results.length
    })
  } catch (err) {
    console.error('[TENANT-DATA] Sancionados error:', err)
    return c.json({ error: true, message: 'Erro ao buscar sancionados' }, 500)
  }
})

/**
 * GET /api/tenant/vinculos
 * Lista de vínculos empresariais
 */
app.get('/vinculos', async (c) => {
  const { tenant, error } = await verifyTenantAccess(c)
  if (error) return error

  try {
    const vinculos = await c.env.DB.prepare(`
      SELECT
        f.id as funcionario_id, f.nome as nome_socio, f.cpf as cpf_socio, f.grupo,
        v.cnpj, v.razao_social, v.nome_fantasia, v.qualificacao,
        v.situacao_cadastral, v.capital_social
      FROM tenant_vinculos v
      JOIN tenant_funcionarios f ON v.funcionario_id = f.id
      WHERE v.tenant_id = ?
      ORDER BY v.capital_social DESC NULLS LAST, f.nome
    `).bind(tenant.id).all()

    // Contar CNPJs únicos
    const cnpjsUnicos = new Set(vinculos.results.map((v: any) => v.cnpj)).size

    return c.json({
      vinculos: vinculos.results,
      total: vinculos.results.length,
      cnpjs_unicos: cnpjsUnicos
    })
  } catch (err) {
    console.error('[TENANT-DATA] Vinculos error:', err)
    return c.json({ error: true, message: 'Erro ao buscar vínculos' }, 500)
  }
})

/**
 * GET /api/tenant/beneficios
 * Lista de funcionários que recebem benefícios
 */
app.get('/beneficios', async (c) => {
  const { tenant, error } = await verifyTenantAccess(c)
  if (error) return error

  try {
    const beneficios = await c.env.DB.prepare(`
      SELECT
        f.id as funcionario_id, f.nome, f.cpf, f.grupo, f.cargo, f.salario,
        b.tipo_beneficio, b.valor, b.ano_referencia
      FROM tenant_beneficios b
      JOIN tenant_funcionarios f ON b.funcionario_id = f.id
      WHERE b.tenant_id = ?
      ORDER BY b.valor DESC, f.nome
    `).bind(tenant.id).all()

    return c.json({
      beneficios: beneficios.results,
      total: beneficios.results.length
    })
  } catch (err) {
    console.error('[TENANT-DATA] Beneficios error:', err)
    return c.json({ error: true, message: 'Erro ao buscar benefícios' }, 500)
  }
})

/**
 * GET /api/tenant/export/:type
 * Exportar dados em formato CSV
 */
app.get('/export/:type', async (c) => {
  const { tenant, error } = await verifyTenantAccess(c)
  if (error) return error

  const exportType = c.req.param('type')
  const { grupo, alerta } = c.req.query()

  try {
    let data: any[] = []
    let filename = ''

    switch (exportType) {
      case 'funcionarios':
        let whereClause = 'WHERE tenant_id = ?'
        const params: any[] = [tenant.id]

        if (grupo) {
          whereClause += ' AND grupo = ?'
          params.push(grupo)
        }

        if (alerta === 'obito') whereClause += " AND esta_morto LIKE 'SIM%'"
        else if (alerta === 'beneficio') whereClause += ' AND recebe_beneficio = 1'
        else if (alerta === 'sancionado') whereClause += ' AND sancionado_ceis = 1'

        const result = await c.env.DB.prepare(`
          SELECT cadastro, nome, cpf, grupo, cargo, salario,
                 esta_vivo, esta_morto, ano_obito,
                 recebe_beneficio, qual_beneficio,
                 socio_empresa, doador_campanha, candidato, sancionado_ceis
          FROM tenant_funcionarios ${whereClause} ORDER BY nome
        `).bind(...params).all()

        data = result.results
        filename = `funcionarios_${grupo || 'todos'}_${alerta || 'todos'}.csv`
        break

      case 'obitos':
        const obitosResult = await c.env.DB.prepare(`
          SELECT f.cadastro, f.nome, f.cpf, f.grupo, f.cargo, f.salario,
                 f.data_admissao, f.ano_obito
          FROM tenant_funcionarios f
          WHERE f.tenant_id = ? AND f.esta_morto LIKE 'SIM%'
          ORDER BY f.ano_obito DESC
        `).bind(tenant.id).all()
        data = obitosResult.results
        filename = 'obitos.csv'
        break

      case 'candidatos':
        const candResult = await c.env.DB.prepare(`
          SELECT f.nome, f.cpf, f.grupo, c.cargo, c.partido, c.uf, c.ano, c.situacao, c.votos
          FROM tenant_candidaturas c
          JOIN tenant_funcionarios f ON c.funcionario_id = f.id
          WHERE c.tenant_id = ?
        `).bind(tenant.id).all()
        data = candResult.results
        filename = 'candidatos.csv'
        break

      case 'doadores':
        const doadoresResult = await c.env.DB.prepare(`
          SELECT f.nome as doador, f.cpf, f.grupo, d.nome_candidato, d.partido, d.ano, d.valor
          FROM tenant_doacoes d
          JOIN tenant_funcionarios f ON d.funcionario_id = f.id
          WHERE d.tenant_id = ?
          ORDER BY d.valor DESC
        `).bind(tenant.id).all()
        data = doadoresResult.results
        filename = 'doadores.csv'
        break

      case 'vinculos':
        const vincResult = await c.env.DB.prepare(`
          SELECT f.nome, f.cpf, f.grupo, v.cnpj, v.razao_social, v.qualificacao, v.situacao_cadastral
          FROM tenant_vinculos v
          JOIN tenant_funcionarios f ON v.funcionario_id = f.id
          WHERE v.tenant_id = ?
        `).bind(tenant.id).all()
        data = vincResult.results
        filename = 'vinculos_empresariais.csv'
        break

      default:
        return c.json({ error: true, message: 'Tipo de exportação inválido' }, 400)
    }

    // Converter para CSV
    if (data.length === 0) {
      return c.json({ error: true, message: 'Nenhum dado para exportar' }, 404)
    }

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(';'),
      ...data.map(row => headers.map(h => {
        const val = row[h]
        if (val === null || val === undefined) return ''
        if (typeof val === 'string' && val.includes(';')) return `"${val}"`
        return String(val)
      }).join(';'))
    ].join('\n')

    // Adicionar BOM para Excel reconhecer UTF-8
    const bom = '\uFEFF'

    return new Response(bom + csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      }
    })
  } catch (err) {
    console.error('[TENANT-DATA] Export error:', err)
    return c.json({ error: true, message: 'Erro ao exportar dados' }, 500)
  }
})

export default app
