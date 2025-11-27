/**
 * Consultas Infosimples API
 * API paga para consultas avançadas de dados públicos
 *
 * Documentação: https://infosimples.com/consultas/
 *
 * Consultas disponíveis:
 * - Receita Federal / CPF (validação + situação + óbito)
 * - Receita Federal / CNPJ (dados empresa + QSA)
 * - TSE / Doadores e Fornecedores (doações de campanha)
 * - CNJ / SEEU / Processos (processos criminais)
 * - Portal Transparência / Bolsa Família
 * - Portal Transparência / BPC
 * - Portal Transparência / Auxílio Emergencial
 */

import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../index'

const infosimplesRoutes = new Hono<{ Bindings: Env }>()

// ============================================
// CONFIGURAÇÃO DA API INFOSIMPLES
// ============================================

// URL base da API Infosimples
// Formato: https://api.infosimples.com/api/v2/consultas/{provedor}/{servico}
// Exemplo: receita-federal/cpf, tse/doadores-fornecedores
const INFOSIMPLES_API_BASE = 'https://api.infosimples.com/api/v2/consultas'

// Helper para fazer requests à API Infosimples
async function infosimplesRequest(
  endpoint: string,
  params: Record<string, string>,
  token: string
): Promise<{ success: boolean; data?: unknown; error?: string; code?: number }> {
  try {
    const url = new URL(`${INFOSIMPLES_API_BASE}/${endpoint}`)

    // Adiciona o token e os parâmetros
    url.searchParams.append('token', token)
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.append(key, value)
      }
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    const responseData = await response.json() as {
      code: number
      code_message: string
      data: unknown[]
      data_count: number
      errors?: string[]
    }

    // Códigos de sucesso: 200 (resultado único), 201 (múltiplos resultados)
    if (responseData.code === 200 || responseData.code === 201) {
      // Retorna o primeiro item do array data se existir
      const firstItem = responseData.data && responseData.data.length > 0 ? responseData.data[0] : null
      return {
        success: true,
        data: firstItem,
        dataArray: responseData.data,
        code: responseData.code,
      }
    }

    // Códigos de erro
    return {
      success: false,
      error: responseData.code_message || 'Erro na consulta',
      errors: responseData.errors,
      code: responseData.code,
    }
  } catch (error) {
    console.error('Erro na requisição Infosimples:', error)
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
// RECEITA FEDERAL - CPF
// Valida CPF, retorna situação cadastral e ano de óbito
// ============================================

// GET /api/infosimples/cpf/:cpf/:dataNascimento
// dataNascimento no formato YYYY-MM-DD (ISO) ou DD-MM-YYYY
infosimplesRoutes.get('/cpf/:cpf/:dataNascimento', async (c) => {
  try {
    const cpf = c.req.param('cpf').replace(/\D/g, '')
    let dataNascimento = c.req.param('dataNascimento')

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    // Converter formato DD-MM-YYYY para YYYY-MM-DD se necessário
    if (/^\d{2}-\d{2}-\d{4}$/.test(dataNascimento)) {
      const [dia, mes, ano] = dataNascimento.split('-')
      dataNascimento = `${ano}-${mes}-${dia}`
    }

    // Validar formato da data (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
      return c.json({ error: 'Data de nascimento deve estar no formato YYYY-MM-DD ou DD-MM-YYYY' }, 400)
    }

    const token = c.env.INFOSIMPLES_API_TOKEN
    if (!token) {
      return c.json({ error: 'Token Infosimples não configurado' }, 500)
    }

    const result = await infosimplesRequest('receita-federal/cpf', {
      cpf,
      birthdate: dataNascimento,
    }, token)

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error,
        code: result.code,
      }, result.code === 600 ? 404 : 500)
    }

    const data = result.data as Record<string, unknown>

    return c.json({
      success: true,
      source: 'infosimples',
      consulta: 'receita-federal/cpf',
      data: {
        cpf: data.cpf,
        cpf_valido: true,
        nome: data.nome,
        nome_civil: data.nome_civil,
        nome_social: data.nome_social,
        data_nascimento: data.data_nascimento,
        data_inscricao: data.data_inscricao,
        situacao_cadastral: data.situacao_cadastral,
        ano_obito: data.ano_obito,
        esta_vivo: !data.ano_obito,
        esta_morto: !!data.ano_obito,
        consulta_datahora: data.consulta_datahora,
      },
    })
  } catch (error) {
    console.error('Erro na consulta CPF Infosimples:', error)
    return c.json({ error: 'Erro ao consultar CPF' }, 500)
  }
})

// ============================================
// RECEITA FEDERAL - CNPJ
// Dados completos da empresa + Quadro Societário (QSA)
// ============================================

// GET /api/infosimples/cnpj/:cnpj
infosimplesRoutes.get('/cnpj/:cnpj', async (c) => {
  try {
    const cnpj = c.req.param('cnpj').replace(/\D/g, '')

    const validation = cnpjSchema.safeParse(cnpj)
    if (!validation.success) {
      return c.json({ error: 'CNPJ inválido', details: validation.error.errors }, 400)
    }

    const token = c.env.INFOSIMPLES_API_TOKEN
    if (!token) {
      return c.json({ error: 'Token Infosimples não configurado' }, 500)
    }

    const result = await infosimplesRequest('receita-federal/cnpj', {
      cnpj,
    }, token)

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error,
        code: result.code,
      }, result.code === 600 ? 404 : 500)
    }

    const data = result.data as Record<string, unknown>

    return c.json({
      success: true,
      source: 'infosimples',
      consulta: 'receita-federal/cnpj',
      data: {
        cnpj: data.cnpj,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        situacao_cadastral: data.situacao_cadastral,
        data_situacao_cadastral: data.situacao_cadastral_data,
        data_abertura: data.abertura_data,
        natureza_juridica: data.natureza_juridica,
        porte: data.porte,
        capital_social: data.capital_social,
        atividade_economica: data.atividade_economica,
        atividade_economica_secundaria: data.atividade_economica_secundaria_lista,
        endereco: {
          logradouro: data.endereco_logradouro,
          numero: data.endereco_numero,
          complemento: data.endereco_complemento,
          bairro: data.endereco_bairro,
          municipio: data.endereco_municipio,
          uf: data.endereco_uf,
          cep: data.endereco_cep,
        },
        telefone: data.telefone,
        email: data.email,
        qsa: data.qsa, // Quadro societário
      },
    })
  } catch (error) {
    console.error('Erro na consulta CNPJ Infosimples:', error)
    return c.json({ error: 'Erro ao consultar CNPJ' }, 500)
  }
})

// ============================================
// TSE - DOADORES E FORNECEDORES
// Verifica se CPF/CNPJ fez doações de campanha
// ============================================

// GET /api/infosimples/tse/doador/:cpfCnpj/:ano
infosimplesRoutes.get('/tse/doador/:cpfCnpj/:ano', async (c) => {
  try {
    const cpfCnpj = c.req.param('cpfCnpj').replace(/\D/g, '')
    const ano = c.req.param('ano')

    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      return c.json({ error: 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos' }, 400)
    }

    const token = c.env.INFOSIMPLES_API_TOKEN
    if (!token) {
      return c.json({ error: 'Token Infosimples não configurado' }, 500)
    }

    const params: Record<string, string> = { ano }
    if (cpfCnpj.length === 11) {
      params.cpf = cpfCnpj
    } else {
      params.cnpj = cpfCnpj
    }

    const result = await infosimplesRequest('tse/doadores-fornecedores', params, token)

    if (!result.success) {
      // Se não encontrou, não é erro - apenas não doou
      if (result.code === 600) {
        return c.json({
          success: true,
          source: 'infosimples',
          consulta: 'tse/doadores-fornecedores',
          data: {
            cpf_cnpj: cpfCnpj,
            ano,
            foi_doador: false,
            doacoes: [],
            total_doacoes: 0,
            valor_total: 0,
          },
        })
      }

      return c.json({
        success: false,
        error: result.error,
        code: result.code,
      }, 500)
    }

    const data = result.data as Record<string, unknown>

    return c.json({
      success: true,
      source: 'infosimples',
      consulta: 'tse/doadores-fornecedores',
      data: {
        cpf_cnpj: cpfCnpj,
        ano,
        foi_doador: true,
        nome: data.nome,
        tipo: data.tipo,
        doacoes: data.doacoes,
        fornecimentos: data.fornecimentos,
      },
    })
  } catch (error) {
    console.error('Erro na consulta TSE Infosimples:', error)
    return c.json({ error: 'Erro ao consultar doações TSE' }, 500)
  }
})

// GET /api/infosimples/tse/doador-completo/:cpfCnpj
// Consulta doações em 2022 e 2024
infosimplesRoutes.get('/tse/doador-completo/:cpfCnpj', async (c) => {
  try {
    const cpfCnpj = c.req.param('cpfCnpj').replace(/\D/g, '')

    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      return c.json({ error: 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos' }, 400)
    }

    const token = c.env.INFOSIMPLES_API_TOKEN
    if (!token) {
      return c.json({ error: 'Token Infosimples não configurado' }, 500)
    }

    // Consulta 2022 e 2024 em paralelo
    const params = cpfCnpj.length === 11 ? { cpf: cpfCnpj } : { cnpj: cpfCnpj }

    const [result2022, result2024] = await Promise.all([
      infosimplesRequest('tse/doadores-fornecedores', { ...params, ano: '2022' }, token),
      infosimplesRequest('tse/doadores-fornecedores', { ...params, ano: '2024' }, token),
    ])

    const doacoes2022 = result2022.success ? result2022.data : null
    const doacoes2024 = result2024.success ? result2024.data : null

    return c.json({
      success: true,
      source: 'infosimples',
      consulta: 'tse/doadores-fornecedores',
      data: {
        cpf_cnpj: cpfCnpj,
        foi_doador_2022: !!doacoes2022,
        foi_doador_2024: !!doacoes2024,
        foi_doador: !!doacoes2022 || !!doacoes2024,
        eleicoes_2022: doacoes2022,
        eleicoes_2024: doacoes2024,
      },
    })
  } catch (error) {
    console.error('Erro na consulta TSE completa Infosimples:', error)
    return c.json({ error: 'Erro ao consultar doações TSE' }, 500)
  }
})

// ============================================
// CNJ / SEEU - PROCESSOS
// Verifica processos criminais/judiciais
// ============================================

// GET /api/infosimples/processos/:cpf
infosimplesRoutes.get('/processos/:cpf', async (c) => {
  try {
    const cpf = c.req.param('cpf').replace(/\D/g, '')

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    const token = c.env.INFOSIMPLES_API_TOKEN
    if (!token) {
      return c.json({ error: 'Token Infosimples não configurado' }, 500)
    }

    const result = await infosimplesRequest('cnj/seeu-processos', {
      cpf,
    }, token)

    if (!result.success) {
      // Se não encontrou, não há processos
      if (result.code === 600) {
        return c.json({
          success: true,
          source: 'infosimples',
          consulta: 'cnj/seeu-processos',
          data: {
            cpf,
            tem_processos: false,
            total_processos: 0,
            processos: [],
          },
        })
      }

      return c.json({
        success: false,
        error: result.error,
        code: result.code,
      }, 500)
    }

    const data = result.data as Record<string, unknown>

    return c.json({
      success: true,
      source: 'infosimples',
      consulta: 'cnj/seeu-processos',
      data: {
        cpf,
        tem_processos: true,
        primeiro_processo: data.primeiro_processo,
        processos_encontrados: data.processos_encontrados,
        total_processos: Array.isArray(data.processos_encontrados)
          ? (data.processos_encontrados as unknown[]).length
          : 0,
      },
    })
  } catch (error) {
    console.error('Erro na consulta processos Infosimples:', error)
    return c.json({ error: 'Erro ao consultar processos' }, 500)
  }
})

// ============================================
// PORTAL DA TRANSPARÊNCIA - BOLSA FAMÍLIA
// Verifica se recebe Bolsa Família
// ============================================

// GET /api/infosimples/bolsa-familia/:cpf
infosimplesRoutes.get('/bolsa-familia/:cpf', async (c) => {
  try {
    const cpf = c.req.param('cpf').replace(/\D/g, '')

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    const token = c.env.INFOSIMPLES_API_TOKEN
    if (!token) {
      return c.json({ error: 'Token Infosimples não configurado' }, 500)
    }

    const result = await infosimplesRequest('portal-transparencia/bolsa-familia', {
      cpf,
    }, token)

    if (!result.success) {
      // Se não encontrou, não recebe o benefício
      if (result.code === 600) {
        return c.json({
          success: true,
          source: 'infosimples',
          consulta: 'portal-transparencia/bolsa-familia',
          data: {
            cpf,
            recebe_bolsa_familia: false,
            beneficiario: null,
          },
        })
      }

      return c.json({
        success: false,
        error: result.error,
        code: result.code,
      }, 500)
    }

    const data = result.data as Record<string, unknown>

    return c.json({
      success: true,
      source: 'infosimples',
      consulta: 'portal-transparencia/bolsa-familia',
      data: {
        cpf,
        recebe_bolsa_familia: true,
        beneficiario: data.beneficiario,
        nis: data.nis,
        municipio: data.municipio,
        uf: data.uf,
        valor: data.valor,
        parcelas_recebidas: data.recebidos,
        parcelas_sacadas: data.sacados,
      },
    })
  } catch (error) {
    console.error('Erro na consulta Bolsa Família Infosimples:', error)
    return c.json({ error: 'Erro ao consultar Bolsa Família' }, 500)
  }
})

// ============================================
// PORTAL DA TRANSPARÊNCIA - BPC
// Verifica se recebe BPC (Benefício de Prestação Continuada)
// ============================================

// GET /api/infosimples/bpc/:cpf
infosimplesRoutes.get('/bpc/:cpf', async (c) => {
  try {
    const cpf = c.req.param('cpf').replace(/\D/g, '')

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    const token = c.env.INFOSIMPLES_API_TOKEN
    if (!token) {
      return c.json({ error: 'Token Infosimples não configurado' }, 500)
    }

    const result = await infosimplesRequest('portal-transparencia/bpc', {
      cpf,
    }, token)

    if (!result.success) {
      if (result.code === 600) {
        return c.json({
          success: true,
          source: 'infosimples',
          consulta: 'portal-transparencia/bpc',
          data: {
            cpf,
            recebe_bpc: false,
            beneficiario: null,
          },
        })
      }

      return c.json({
        success: false,
        error: result.error,
        code: result.code,
      }, 500)
    }

    const data = result.data as Record<string, unknown>

    return c.json({
      success: true,
      source: 'infosimples',
      consulta: 'portal-transparencia/bpc',
      data: {
        cpf,
        recebe_bpc: true,
        beneficiario: data.beneficiario,
        nis: data.nis,
        municipio: data.municipio,
        uf: data.uf,
        valor: data.valor,
      },
    })
  } catch (error) {
    console.error('Erro na consulta BPC Infosimples:', error)
    return c.json({ error: 'Erro ao consultar BPC' }, 500)
  }
})

// ============================================
// CONSULTA COMPLETA - PESSOA FÍSICA
// Faz todas as consultas necessárias para investigação
// ============================================

// POST /api/infosimples/pessoa-completa
// Body: { cpf: string, data_nascimento: string }
infosimplesRoutes.post('/pessoa-completa', async (c) => {
  try {
    const body = await c.req.json() as { cpf: string; data_nascimento: string }
    const cpf = body.cpf?.replace(/\D/g, '')
    const dataNascimento = body.data_nascimento

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    if (!dataNascimento || !/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento)) {
      return c.json({ error: 'Data de nascimento deve estar no formato DD/MM/AAAA' }, 400)
    }

    const token = c.env.INFOSIMPLES_API_TOKEN
    if (!token) {
      return c.json({ error: 'Token Infosimples não configurado' }, 500)
    }

    // Executa todas as consultas em paralelo
    const [
      cpfResult,
      processosResult,
      bolsaFamiliaResult,
      bpcResult,
      doador2022Result,
      doador2024Result,
    ] = await Promise.all([
      // 1. Validação CPF + situação + óbito
      infosimplesRequest('receita-federal/cpf', { cpf, birthdate: dataNascimento }, token),
      // 2. Processos criminais
      infosimplesRequest('cnj/seeu-processos', { cpf }, token),
      // 3. Bolsa Família
      infosimplesRequest('portal-transparencia/bolsa-familia', { cpf }, token),
      // 4. BPC
      infosimplesRequest('portal-transparencia/bpc', { cpf }, token),
      // 5. Doações 2022
      infosimplesRequest('tse/doadores-fornecedores', { cpf, ano: '2022' }, token),
      // 6. Doações 2024
      infosimplesRequest('tse/doadores-fornecedores', { cpf, ano: '2024' }, token),
    ])

    // Processa resultados
    const cpfData = cpfResult.success ? cpfResult.data as Record<string, unknown> : null
    const processosData = processosResult.success ? processosResult.data as Record<string, unknown> : null
    const bolsaFamiliaData = bolsaFamiliaResult.success ? bolsaFamiliaResult.data as Record<string, unknown> : null
    const bpcData = bpcResult.success ? bpcResult.data as Record<string, unknown> : null
    const doador2022Data = doador2022Result.success ? doador2022Result.data as Record<string, unknown> : null
    const doador2024Data = doador2024Result.success ? doador2024Result.data as Record<string, unknown> : null

    return c.json({
      success: true,
      source: 'infosimples',
      consulta: 'pessoa-completa',
      data: {
        cpf,

        // Validação do CPF
        cpf_valido: cpfResult.success,
        nome: cpfData?.nome || null,
        situacao_cadastral: cpfData?.situacao_cadastral || null,

        // Óbito
        esta_vivo: cpfData ? !cpfData.ano_obito : null,
        esta_morto: cpfData ? !!cpfData.ano_obito : null,
        ano_obito: cpfData?.ano_obito || null,

        // Benefícios do Governo
        recebe_beneficio_governo: !!(bolsaFamiliaResult.success || bpcResult.success),
        beneficios: {
          bolsa_familia: bolsaFamiliaResult.success ? {
            recebe: true,
            valor: bolsaFamiliaData?.valor,
            municipio: bolsaFamiliaData?.municipio,
          } : { recebe: false },
          bpc: bpcResult.success ? {
            recebe: true,
            valor: bpcData?.valor,
            municipio: bpcData?.municipio,
          } : { recebe: false },
        },

        // Doações de Campanha
        foi_doador_campanha: !!(doador2022Result.success || doador2024Result.success),
        doacoes_campanha: {
          eleicoes_2022: doador2022Result.success ? doador2022Data : null,
          eleicoes_2024: doador2024Result.success ? doador2024Data : null,
        },

        // Processos Criminais
        tem_processos: processosResult.success,
        processos: processosData ? {
          primeiro_processo: processosData.primeiro_processo,
          processos_encontrados: processosData.processos_encontrados,
        } : null,
      },
    })
  } catch (error) {
    console.error('Erro na consulta pessoa completa Infosimples:', error)
    return c.json({ error: 'Erro ao consultar pessoa' }, 500)
  }
})

// ============================================
// VERIFICAR SE CPF É SÓCIO DE EMPRESA
// Busca empresas onde o CPF é sócio
// ============================================

// GET /api/infosimples/socio/:cpf
// Nota: Esta consulta usa a Brasil API que já configuramos
// pois a Infosimples não tem endpoint direto para isso
infosimplesRoutes.get('/socio/:cpf', async (c) => {
  try {
    const cpf = c.req.param('cpf').replace(/\D/g, '')

    const validation = cpfSchema.safeParse(cpf)
    if (!validation.success) {
      return c.json({ error: 'CPF inválido', details: validation.error.errors }, 400)
    }

    // A Infosimples não tem consulta direta de "empresas por sócio"
    // Vamos retornar instrução para usar outras fontes
    return c.json({
      success: true,
      source: 'infosimples',
      message: 'Para verificar se um CPF é sócio de empresas, use a Junta Comercial do estado ou serviços especializados como CNPJá',
      alternativas: [
        'Junta Comercial (JUCESP, JUCEG, etc)',
        'CNPJá (cnpja.com)',
        'Receita Federal - busca reversa',
      ],
    })
  } catch (error) {
    console.error('Erro na consulta sócio:', error)
    return c.json({ error: 'Erro ao consultar sócio' }, 500)
  }
})

export default infosimplesRoutes
