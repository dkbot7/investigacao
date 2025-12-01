/**
 * Consultas Públicas API
 * APIs gratuitas para consulta de dados públicos brasileiros
 * - Brasil API (CEP, CNPJ, Bancos, FIPE, etc)
 * - TSE DivulgaCandContas (Doações de campanha)
 * - Receita Federal CNPJ Aberto (via CNPJa Open API)
 */

import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../index'

const consultasPublicasRoutes = new Hono<{ Bindings: Env }>()

// ============================================
// VALIDATION SCHEMAS
// ============================================

const cpfSchema = z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos')
const cnpjSchema = z.string().regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos')
const cepSchema = z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos')

// ============================================
// BRASIL API - https://brasilapi.com.br
// ============================================

const BRASIL_API_BASE = 'https://brasilapi.com.br/api'

// GET /api/consultas/cep/:cep - Consulta CEP
consultasPublicasRoutes.get('/cep/:cep', async (c) => {
  try {
    const cep = c.req.param('cep').replace(/\D/g, '')

    const validation = cepSchema.safeParse(cep)
    if (!validation.success) {
      return c.json({ error: 'CEP inválido', details: validation.error.errors }, 400)
    }

    const response = await fetch(`${BRASIL_API_BASE}/cep/v2/${cep}`)

    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'CEP não encontrado' }, 404)
      }
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data: {
        cep: data.cep,
        logradouro: data.street,
        bairro: data.neighborhood,
        cidade: data.city,
        estado: data.state,
        latitude: data.location?.coordinates?.latitude,
        longitude: data.location?.coordinates?.longitude,
      }
    })
  } catch (error) {
    console.error('Erro na consulta CEP:', error)
    return c.json({ error: 'Erro ao consultar CEP' }, 500)
  }
})

// GET /api/consultas/cnpj/:cnpj - Consulta CNPJ (Brasil API)
consultasPublicasRoutes.get('/cnpj/:cnpj', async (c) => {
  try {
    const cnpj = c.req.param('cnpj').replace(/\D/g, '')

    const validation = cnpjSchema.safeParse(cnpj)
    if (!validation.success) {
      return c.json({ error: 'CNPJ inválido', details: validation.error.errors }, 400)
    }

    const response = await fetch(`${BRASIL_API_BASE}/cnpj/v1/${cnpj}`)

    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'CNPJ não encontrado' }, 404)
      }
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json() as Record<string, unknown>

    return c.json({
      success: true,
      source: 'brasil_api',
      data: {
        cnpj: data.cnpj,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        situacao_cadastral: data.descricao_situacao_cadastral,
        data_situacao_cadastral: data.data_situacao_cadastral,
        data_inicio_atividade: data.data_inicio_atividade,
        cnae_fiscal: data.cnae_fiscal,
        cnae_fiscal_descricao: data.cnae_fiscal_descricao,
        natureza_juridica: data.natureza_juridica,
        porte: data.porte,
        capital_social: data.capital_social,
        endereco: {
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cep: data.cep,
          municipio: data.municipio,
          uf: data.uf,
        },
        telefone: data.ddd_telefone_1,
        email: data.email,
        qsa: data.qsa, // Quadro societário
        cnaes_secundarios: data.cnaes_secundarios,
        simples: {
          optante: data.opcao_pelo_simples,
          data_opcao: data.data_opcao_pelo_simples,
        },
        mei: {
          optante: data.opcao_pelo_mei,
          data_opcao: data.data_opcao_pelo_mei,
        },
      }
    })
  } catch (error) {
    console.error('Erro na consulta CNPJ:', error)
    return c.json({ error: 'Erro ao consultar CNPJ' }, 500)
  }
})

// GET /api/consultas/bancos - Lista todos os bancos
consultasPublicasRoutes.get('/bancos', async (c) => {
  try {
    const response = await fetch(`${BRASIL_API_BASE}/banks/v1`)

    if (!response.ok) {
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta bancos:', error)
    return c.json({ error: 'Erro ao consultar bancos' }, 500)
  }
})

// GET /api/consultas/banco/:codigo - Consulta banco por código
consultasPublicasRoutes.get('/banco/:codigo', async (c) => {
  try {
    const codigo = c.req.param('codigo')

    const response = await fetch(`${BRASIL_API_BASE}/banks/v1/${codigo}`)

    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'Banco não encontrado' }, 404)
      }
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta banco:', error)
    return c.json({ error: 'Erro ao consultar banco' }, 500)
  }
})

// GET /api/consultas/fipe/marcas/:tipo - Lista marcas FIPE (carros, motos, caminhoes)
consultasPublicasRoutes.get('/fipe/marcas/:tipo', async (c) => {
  try {
    const tipo = c.req.param('tipo')

    if (!['carros', 'motos', 'caminhoes'].includes(tipo)) {
      return c.json({ error: 'Tipo deve ser: carros, motos ou caminhoes' }, 400)
    }

    const response = await fetch(`${BRASIL_API_BASE}/fipe/marcas/v1/${tipo}`)

    if (!response.ok) {
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta FIPE marcas:', error)
    return c.json({ error: 'Erro ao consultar marcas FIPE' }, 500)
  }
})

// GET /api/consultas/fipe/preco/:codigoFipe - Consulta preço FIPE
consultasPublicasRoutes.get('/fipe/preco/:codigoFipe', async (c) => {
  try {
    const codigoFipe = c.req.param('codigoFipe')

    const response = await fetch(`${BRASIL_API_BASE}/fipe/preco/v1/${codigoFipe}`)

    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'Código FIPE não encontrado' }, 404)
      }
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta FIPE preço:', error)
    return c.json({ error: 'Erro ao consultar preço FIPE' }, 500)
  }
})

// GET /api/consultas/ddd/:ddd - Consulta estado e cidades por DDD
consultasPublicasRoutes.get('/ddd/:ddd', async (c) => {
  try {
    const ddd = c.req.param('ddd')

    const response = await fetch(`${BRASIL_API_BASE}/ddd/v1/${ddd}`)

    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'DDD não encontrado' }, 404)
      }
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta DDD:', error)
    return c.json({ error: 'Erro ao consultar DDD' }, 500)
  }
})

// GET /api/consultas/ibge/estados - Lista todos os estados
consultasPublicasRoutes.get('/ibge/estados', async (c) => {
  try {
    const response = await fetch(`${BRASIL_API_BASE}/ibge/uf/v1`)

    if (!response.ok) {
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta estados:', error)
    return c.json({ error: 'Erro ao consultar estados' }, 500)
  }
})

// GET /api/consultas/ibge/municipios/:uf - Lista municípios de um estado
consultasPublicasRoutes.get('/ibge/municipios/:uf', async (c) => {
  try {
    const uf = c.req.param('uf').toUpperCase()

    const response = await fetch(`${BRASIL_API_BASE}/ibge/municipios/v1/${uf}`)

    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'UF não encontrada' }, 404)
      }
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta municípios:', error)
    return c.json({ error: 'Erro ao consultar municípios' }, 500)
  }
})

// GET /api/consultas/taxas - Lista taxas e índices econômicos
consultasPublicasRoutes.get('/taxas', async (c) => {
  try {
    const response = await fetch(`${BRASIL_API_BASE}/taxas/v1`)

    if (!response.ok) {
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta taxas:', error)
    return c.json({ error: 'Erro ao consultar taxas' }, 500)
  }
})

// GET /api/consultas/pix/participantes - Lista participantes do PIX
consultasPublicasRoutes.get('/pix/participantes', async (c) => {
  try {
    const response = await fetch(`${BRASIL_API_BASE}/pix/v1/participants`)

    if (!response.ok) {
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta PIX:', error)
    return c.json({ error: 'Erro ao consultar participantes PIX' }, 500)
  }
})

// ============================================
// TSE DIVULGACAND - Doações de Campanha
// https://divulgacandcontas.tse.jus.br
// ============================================

const TSE_API_BASE = 'https://divulgacandcontas.tse.jus.br/divulga/rest/v1'

// GET /api/consultas/tse/eleicoes - Lista eleições disponíveis
consultasPublicasRoutes.get('/tse/eleicoes', async (c) => {
  try {
    const response = await fetch(`${TSE_API_BASE}/eleicao/ordinarias`)

    if (!response.ok) {
      throw new Error(`TSE API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'tse_divulgacand',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta TSE eleições:', error)
    return c.json({ error: 'Erro ao consultar eleições' }, 500)
  }
})

// GET /api/consultas/tse/candidato/:ano/:uf/:cargo/:nome - Busca candidato
consultasPublicasRoutes.get('/tse/candidato/:ano/:uf/:cargo/:nome', async (c) => {
  try {
    const { ano, uf, cargo, nome } = c.req.param()

    // Primeiro busca o ID da eleição
    const eleicoesResponse = await fetch(`${TSE_API_BASE}/eleicao/ordinarias`)
    if (!eleicoesResponse.ok) {
      throw new Error('Erro ao buscar eleições')
    }

    const eleicoes = await eleicoesResponse.json() as Array<{ id: number; ano: number }>
    const eleicao = eleicoes.find((e) => e.ano === parseInt(ano))

    if (!eleicao) {
      return c.json({ error: `Eleição do ano ${ano} não encontrada` }, 404)
    }

    // Busca candidatos
    const url = `${TSE_API_BASE}/candidatura/listar/${ano}/${uf.toUpperCase()}/${eleicao.id}/${cargo}/candidatos`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`TSE API error: ${response.status}`)
    }

    const data = await response.json() as { candidatos: Array<{ nomeUrna: string; nomeCompleto: string }> }

    // Filtra por nome
    const nomeNormalizado = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const candidatosFiltrados = data.candidatos?.filter((cand) => {
      const nomeUrna = (cand.nomeUrna || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      const nomeCompleto = (cand.nomeCompleto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      return nomeUrna.includes(nomeNormalizado) || nomeCompleto.includes(nomeNormalizado)
    }) || []

    return c.json({
      success: true,
      source: 'tse_divulgacand',
      eleicao: {
        id: eleicao.id,
        ano: eleicao.ano,
      },
      total: candidatosFiltrados.length,
      candidatos: candidatosFiltrados,
    })
  } catch (error) {
    console.error('Erro na consulta TSE candidato:', error)
    return c.json({ error: 'Erro ao consultar candidato' }, 500)
  }
})

// GET /api/consultas/tse/doadores/:ano/:uf - Ranking de doadores
consultasPublicasRoutes.get('/tse/doadores/:ano/:uf', async (c) => {
  try {
    const { ano, uf } = c.req.param()

    // Busca eleição
    const eleicoesResponse = await fetch(`${TSE_API_BASE}/eleicao/ordinarias`)
    if (!eleicoesResponse.ok) {
      throw new Error('Erro ao buscar eleições')
    }

    const eleicoes = await eleicoesResponse.json() as Array<{ id: number; ano: number }>
    const eleicao = eleicoes.find((e) => e.ano === parseInt(ano))

    if (!eleicao) {
      return c.json({ error: `Eleição do ano ${ano} não encontrada` }, 404)
    }

    // Busca ranking de doadores
    const url = `${TSE_API_BASE}/prestador/consulta/doadores/ranking/${eleicao.id}/${uf.toUpperCase()}/1/30`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`TSE API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'tse_divulgacand',
      eleicao: {
        id: eleicao.id,
        ano: eleicao.ano,
      },
      uf,
      doadores: data,
    })
  } catch (error) {
    console.error('Erro na consulta TSE doadores:', error)
    return c.json({ error: 'Erro ao consultar doadores' }, 500)
  }
})

// GET /api/consultas/tse/doador/:cpfCnpj/:ano - Consulta doações por CPF/CNPJ
consultasPublicasRoutes.get('/tse/doador/:cpfCnpj/:ano', async (c) => {
  try {
    const { cpfCnpj, ano } = c.req.param()
    const documento = cpfCnpj.replace(/\D/g, '')

    // Busca eleição
    const eleicoesResponse = await fetch(`${TSE_API_BASE}/eleicao/ordinarias`)
    if (!eleicoesResponse.ok) {
      throw new Error('Erro ao buscar eleições')
    }

    const eleicoes = await eleicoesResponse.json() as Array<{ id: number; ano: number }>
    const eleicao = eleicoes.find((e) => e.ano === parseInt(ano))

    if (!eleicao) {
      return c.json({ error: `Eleição do ano ${ano} não encontrada` }, 404)
    }

    // Busca doações do CPF/CNPJ
    const url = `${TSE_API_BASE}/prestador/consulta/doador/${eleicao.id}/${documento}`
    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        return c.json({
          success: true,
          source: 'tse_divulgacand',
          message: 'Nenhuma doação encontrada para este CPF/CNPJ nesta eleição',
          doacoes: []
        })
      }
      throw new Error(`TSE API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'tse_divulgacand',
      eleicao: {
        id: eleicao.id,
        ano: eleicao.ano,
      },
      cpf_cnpj: documento,
      doacoes: data,
    })
  } catch (error) {
    console.error('Erro na consulta TSE doador:', error)
    return c.json({ error: 'Erro ao consultar doações' }, 500)
  }
})

// ============================================
// RECEITA FEDERAL CNPJ ABERTO (via CNPJa Open API)
// https://cnpja.com/api/open
// ============================================

const CNPJA_OPEN_API = 'https://open.cnpja.com'

// GET /api/consultas/receita/cnpj/:cnpj - Consulta CNPJ via CNPJa Open (gratuito)
consultasPublicasRoutes.get('/receita/cnpj/:cnpj', async (c) => {
  try {
    const cnpj = c.req.param('cnpj').replace(/\D/g, '')

    const validation = cnpjSchema.safeParse(cnpj)
    if (!validation.success) {
      return c.json({ error: 'CNPJ inválido', details: validation.error.errors }, 400)
    }

    const response = await fetch(`${CNPJA_OPEN_API}/office/${cnpj}`, {
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'CNPJ não encontrado' }, 404)
      }
      if (response.status === 429) {
        // Fallback para Brasil API se rate limited
        return c.redirect(`/api/consultas/cnpj/${cnpj}`)
      }
      throw new Error(`CNPJa API error: ${response.status}`)
    }

    const data = await response.json() as Record<string, unknown>

    return c.json({
      success: true,
      source: 'cnpja_open',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta Receita CNPJ:', error)
    return c.json({ error: 'Erro ao consultar CNPJ' }, 500)
  }
})

// ============================================
// CORRETORAS CVM
// ============================================

// GET /api/consultas/corretoras - Lista todas as corretoras
consultasPublicasRoutes.get('/corretoras', async (c) => {
  try {
    const response = await fetch(`${BRASIL_API_BASE}/cvm/corretoras/v1`)

    if (!response.ok) {
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta corretoras:', error)
    return c.json({ error: 'Erro ao consultar corretoras' }, 500)
  }
})

// GET /api/consultas/corretora/:cnpj - Consulta corretora por CNPJ
consultasPublicasRoutes.get('/corretora/:cnpj', async (c) => {
  try {
    const cnpj = c.req.param('cnpj').replace(/\D/g, '')

    const response = await fetch(`${BRASIL_API_BASE}/cvm/corretoras/v1/${cnpj}`)

    if (!response.ok) {
      if (response.status === 404) {
        return c.json({ error: 'Corretora não encontrada' }, 404)
      }
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta corretora:', error)
    return c.json({ error: 'Erro ao consultar corretora' }, 500)
  }
})

// ============================================
// DOMÍNIOS .BR
// ============================================

// GET /api/consultas/dominio/:domain - Verifica disponibilidade de domínio .br
consultasPublicasRoutes.get('/dominio/:domain', async (c) => {
  try {
    const domain = c.req.param('domain')

    const response = await fetch(`${BRASIL_API_BASE}/registrobr/v1/${domain}`)

    if (!response.ok) {
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta domínio:', error)
    return c.json({ error: 'Erro ao consultar domínio' }, 500)
  }
})

// ============================================
// FERIADOS
// ============================================

// GET /api/consultas/feriados/:ano - Lista feriados nacionais
consultasPublicasRoutes.get('/feriados/:ano', async (c) => {
  try {
    const ano = c.req.param('ano')

    const response = await fetch(`${BRASIL_API_BASE}/feriados/v1/${ano}`)

    if (!response.ok) {
      throw new Error(`Brasil API error: ${response.status}`)
    }

    const data = await response.json()

    return c.json({
      success: true,
      source: 'brasil_api',
      data,
    })
  } catch (error) {
    console.error('Erro na consulta feriados:', error)
    return c.json({ error: 'Erro ao consultar feriados' }, 500)
  }
})

export default consultasPublicasRoutes
