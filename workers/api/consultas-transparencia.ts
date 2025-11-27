/**
 * Consultas Portal da Transparência API
 * API gratuita do Governo Federal para dados públicos
 *
 * Documentação: https://api.portaldatransparencia.gov.br/
 *
 * Consultas disponíveis:
 * - Servidores Federais (por CPF ou nome)
 * - Beneficiários de programas sociais
 * - CEIS (Empresas Inidôneas e Suspensas)
 * - CNEP (Empresas Punidas)
 * - CEAF (Expulsões da Administração Federal)
 */

import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../index'

const transparenciaRoutes = new Hono<{ Bindings: Env }>()

// ============================================
// CONFIGURAÇÃO DA API PORTAL DA TRANSPARÊNCIA
// ============================================

const TRANSPARENCIA_API_BASE = 'https://api.portaldatransparencia.gov.br/api-de-dados'

// Nota: A URL base pode ser /api-de-dados ou /v3 dependendo do endpoint
// Documentação: https://api.portaldatransparencia.gov.br/swagger-ui/index.html

// Helper para fazer requests à API do Portal da Transparência
async function transparenciaRequest(
  endpoint: string,
  params: Record<string, string>,
  apiKey: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const url = new URL(`${TRANSPARENCIA_API_BASE}/${endpoint}`)

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.append(key, value)
      }
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'chave-api-dados': apiKey,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { success: true, data: [] }
      }
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('Erro na requisição Portal da Transparência:', error)
    return {
      success: false,
      error: 'Erro de conexão com a API',
    }
  }
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

const cpfSchema = z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos')
const cnpjSchema = z.string().regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos')

// ============================================
// SERVIDORES FEDERAIS
// Verifica se CPF é servidor federal
// ============================================

// GET /api/transparencia/servidor/:cpf
transparenciaRoutes.get('/servidor/:cpf', async (c) => {
  try {
    const cpf = c.req.param('cpf').replace(/\D/g, '')

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    const apiKey = c.env.PORTAL_TRANSPARENCIA_API_KEY
    if (!apiKey) {
      return c.json({ error: 'API Key do Portal da Transparência não configurada' }, 500)
    }

    const result = await transparenciaRequest('servidores', {
      cpf,
    }, apiKey)

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error,
      }, 500)
    }

    const servidores = result.data as Array<Record<string, unknown>>

    if (!servidores || servidores.length === 0) {
      return c.json({
        success: true,
        source: 'portal_transparencia',
        consulta: 'servidores',
        data: {
          cpf,
          eh_servidor_federal: false,
          servidor: null,
        },
      })
    }

    return c.json({
      success: true,
      source: 'portal_transparencia',
      consulta: 'servidores',
      data: {
        cpf,
        eh_servidor_federal: true,
        servidores: servidores.map((s) => ({
          nome: s.nome,
          cpf: s.cpf,
          matricula: s.matricula,
          descricao_cargo: s.descricaoCargo,
          orgao_lotacao: s.orgaoLotacao,
          orgao_exercicio: s.orgaoExercicio,
          tipo_vinculo: s.tipoVinculo,
          situacao_vinculo: s.situacaoVinculo,
          data_ingresso_cargo: s.dataIngressoCargo,
          data_ingresso_orgao: s.dataIngressoOrgao,
        })),
      },
    })
  } catch (error) {
    console.error('Erro na consulta servidor:', error)
    return c.json({ error: 'Erro ao consultar servidor' }, 500)
  }
})

// ============================================
// CEIS - EMPRESAS INIDÔNEAS E SUSPENSAS
// Verifica se CNPJ está no cadastro de empresas inidôneas
// ============================================

// GET /api/transparencia/ceis/:cnpj
transparenciaRoutes.get('/ceis/:cnpj', async (c) => {
  try {
    const cnpj = c.req.param('cnpj').replace(/\D/g, '')

    const validation = cnpjSchema.safeParse(cnpj)
    if (!validation.success) {
      return c.json({ error: 'CNPJ inválido', details: validation.error.errors }, 400)
    }

    const apiKey = c.env.PORTAL_TRANSPARENCIA_API_KEY
    if (!apiKey) {
      return c.json({ error: 'API Key do Portal da Transparência não configurada' }, 500)
    }

    const result = await transparenciaRequest('ceis', {
      cnpjSancionado: cnpj,
    }, apiKey)

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error,
      }, 500)
    }

    const registros = result.data as Array<Record<string, unknown>>

    if (!registros || registros.length === 0) {
      return c.json({
        success: true,
        source: 'portal_transparencia',
        consulta: 'ceis',
        data: {
          cnpj,
          esta_no_ceis: false,
          sancoes: [],
        },
      })
    }

    return c.json({
      success: true,
      source: 'portal_transparencia',
      consulta: 'ceis',
      data: {
        cnpj,
        esta_no_ceis: true,
        total_sancoes: registros.length,
        sancoes: registros.map((r) => ({
          tipo_sancao: r.tipoSancao,
          data_inicio: r.dataInicioSancao,
          data_fim: r.dataFimSancao,
          orgao_sancionador: r.orgaoSancionador,
          fundamentacao: r.fundamentacaoLegal,
        })),
      },
    })
  } catch (error) {
    console.error('Erro na consulta CEIS:', error)
    return c.json({ error: 'Erro ao consultar CEIS' }, 500)
  }
})

// GET /api/transparencia/ceis-cpf/:cpf
// Verifica se CPF está no CEIS (pessoa física sancionada)
transparenciaRoutes.get('/ceis-cpf/:cpf', async (c) => {
  try {
    const cpf = c.req.param('cpf').replace(/\D/g, '')

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    const apiKey = c.env.PORTAL_TRANSPARENCIA_API_KEY
    if (!apiKey) {
      return c.json({ error: 'API Key do Portal da Transparência não configurada' }, 500)
    }

    const result = await transparenciaRequest('ceis', {
      cpfSancionado: cpf,
    }, apiKey)

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error,
      }, 500)
    }

    const registros = result.data as Array<Record<string, unknown>>

    if (!registros || registros.length === 0) {
      return c.json({
        success: true,
        source: 'portal_transparencia',
        consulta: 'ceis',
        data: {
          cpf,
          esta_no_ceis: false,
          sancoes: [],
        },
      })
    }

    return c.json({
      success: true,
      source: 'portal_transparencia',
      consulta: 'ceis',
      data: {
        cpf,
        esta_no_ceis: true,
        total_sancoes: registros.length,
        sancoes: registros.map((r) => ({
          tipo_sancao: r.tipoSancao,
          data_inicio: r.dataInicioSancao,
          data_fim: r.dataFimSancao,
          orgao_sancionador: r.orgaoSancionador,
          fundamentacao: r.fundamentacaoLegal,
        })),
      },
    })
  } catch (error) {
    console.error('Erro na consulta CEIS CPF:', error)
    return c.json({ error: 'Erro ao consultar CEIS' }, 500)
  }
})

// ============================================
// CNEP - EMPRESAS PUNIDAS
// Verifica se CNPJ está no cadastro de empresas punidas
// ============================================

// GET /api/transparencia/cnep/:cnpj
transparenciaRoutes.get('/cnep/:cnpj', async (c) => {
  try {
    const cnpj = c.req.param('cnpj').replace(/\D/g, '')

    const validation = cnpjSchema.safeParse(cnpj)
    if (!validation.success) {
      return c.json({ error: 'CNPJ inválido', details: validation.error.errors }, 400)
    }

    const apiKey = c.env.PORTAL_TRANSPARENCIA_API_KEY
    if (!apiKey) {
      return c.json({ error: 'API Key do Portal da Transparência não configurada' }, 500)
    }

    const result = await transparenciaRequest('cnep', {
      cnpjSancionado: cnpj,
    }, apiKey)

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error,
      }, 500)
    }

    const registros = result.data as Array<Record<string, unknown>>

    if (!registros || registros.length === 0) {
      return c.json({
        success: true,
        source: 'portal_transparencia',
        consulta: 'cnep',
        data: {
          cnpj,
          esta_no_cnep: false,
          punicoes: [],
        },
      })
    }

    return c.json({
      success: true,
      source: 'portal_transparencia',
      consulta: 'cnep',
      data: {
        cnpj,
        esta_no_cnep: true,
        total_punicoes: registros.length,
        punicoes: registros.map((r) => ({
          tipo_sancao: r.tipoSancao,
          valor_multa: r.valorMulta,
          data_inicio: r.dataInicioSancao,
          data_fim: r.dataFimSancao,
          orgao_sancionador: r.orgaoSancionador,
          fundamentacao: r.fundamentacaoLegal,
        })),
      },
    })
  } catch (error) {
    console.error('Erro na consulta CNEP:', error)
    return c.json({ error: 'Erro ao consultar CNEP' }, 500)
  }
})

// ============================================
// CEAF - EXPULSÕES DA ADMINISTRAÇÃO FEDERAL
// Verifica se CPF foi expulso da administração pública
// ============================================

// GET /api/transparencia/ceaf/:cpf
transparenciaRoutes.get('/ceaf/:cpf', async (c) => {
  try {
    const cpf = c.req.param('cpf').replace(/\D/g, '')

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    const apiKey = c.env.PORTAL_TRANSPARENCIA_API_KEY
    if (!apiKey) {
      return c.json({ error: 'API Key do Portal da Transparência não configurada' }, 500)
    }

    const result = await transparenciaRequest('ceaf', {
      cpfPunido: cpf,
    }, apiKey)

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error,
      }, 500)
    }

    const registros = result.data as Array<Record<string, unknown>>

    if (!registros || registros.length === 0) {
      return c.json({
        success: true,
        source: 'portal_transparencia',
        consulta: 'ceaf',
        data: {
          cpf,
          foi_expulso: false,
          expulsoes: [],
        },
      })
    }

    return c.json({
      success: true,
      source: 'portal_transparencia',
      consulta: 'ceaf',
      data: {
        cpf,
        foi_expulso: true,
        total_expulsoes: registros.length,
        expulsoes: registros.map((r) => ({
          tipo_punicao: r.tipoPunicao,
          data_punicao: r.dataPunicao,
          cargo: r.cargo,
          orgao: r.orgaoLotacao,
          uf: r.ufLotacao,
          fundamentacao: r.fundamentacaoLegal,
        })),
      },
    })
  } catch (error) {
    console.error('Erro na consulta CEAF:', error)
    return c.json({ error: 'Erro ao consultar CEAF' }, 500)
  }
})

// ============================================
// BOLSA FAMÍLIA
// Verifica se CPF recebe Bolsa Família
// ============================================

// GET /api/transparencia/bolsa-familia/:cpf
transparenciaRoutes.get('/bolsa-familia/:cpf', async (c) => {
  try {
    const cpf = c.req.param('cpf').replace(/\D/g, '')

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    const apiKey = c.env.PORTAL_TRANSPARENCIA_API_KEY
    if (!apiKey) {
      return c.json({ error: 'API Key do Portal da Transparência não configurada' }, 500)
    }

    // O Portal da Transparência não permite consulta direta por CPF no endpoint público
    // Precisa usar o NIS ou consultar por município
    return c.json({
      success: true,
      source: 'portal_transparencia',
      consulta: 'bolsa-familia',
      message: 'Para consulta de Bolsa Família por CPF, use a API Infosimples',
      alternativa: '/api/infosimples/bolsa-familia/' + cpf,
    })
  } catch (error) {
    console.error('Erro na consulta Bolsa Família:', error)
    return c.json({ error: 'Erro ao consultar Bolsa Família' }, 500)
  }
})

// ============================================
// CONSULTA COMPLETA - VERIFICAÇÃO DE INTEGRIDADE
// Verifica CPF em todos os cadastros de sanções
// ============================================

// GET /api/transparencia/verificacao-integridade/:cpf
transparenciaRoutes.get('/verificacao-integridade/:cpf', async (c) => {
  try {
    const cpf = c.req.param('cpf').replace(/\D/g, '')

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    const apiKey = c.env.PORTAL_TRANSPARENCIA_API_KEY
    if (!apiKey) {
      return c.json({ error: 'API Key do Portal da Transparência não configurada' }, 500)
    }

    // Executa todas as consultas em paralelo
    const [ceisResult, ceafResult, servidorResult] = await Promise.all([
      transparenciaRequest('ceis', { cpfSancionado: cpf }, apiKey),
      transparenciaRequest('ceaf', { cpfPunido: cpf }, apiKey),
      transparenciaRequest('servidores', { cpf }, apiKey),
    ])

    const ceisData = ceisResult.success ? ceisResult.data as Array<Record<string, unknown>> : []
    const ceafData = ceafResult.success ? ceafResult.data as Array<Record<string, unknown>> : []
    const servidorData = servidorResult.success ? servidorResult.data as Array<Record<string, unknown>> : []

    const temProblemas = (ceisData && ceisData.length > 0) || (ceafData && ceafData.length > 0)

    return c.json({
      success: true,
      source: 'portal_transparencia',
      consulta: 'verificacao-integridade',
      data: {
        cpf,
        tem_problemas: temProblemas,
        resumo: {
          esta_no_ceis: ceisData && ceisData.length > 0,
          foi_expulso_ceaf: ceafData && ceafData.length > 0,
          eh_servidor_federal: servidorData && servidorData.length > 0,
        },
        detalhes: {
          ceis: ceisData || [],
          ceaf: ceafData || [],
          servidor: servidorData || [],
        },
      },
    })
  } catch (error) {
    console.error('Erro na verificação de integridade:', error)
    return c.json({ error: 'Erro ao verificar integridade' }, 500)
  }
})

export default transparenciaRoutes
