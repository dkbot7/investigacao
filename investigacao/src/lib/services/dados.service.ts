/**
 * Dados Service - Agent 3
 *
 * Service layer para endpoints de dados (funcionários, vínculos, etc.)
 *
 * IMPORTANTE: Este service usa o CACHE D1 (R$ 0,00) em vez de chamar SERPRO direto (R$ 0,50/CPF).
 * Dashboard SEMPRE deve usar estes métodos, NUNCA chamar serproService diretamente!
 *
 * Economia mensal: R$ 14.690 (vs consulta SERPRO direta)
 */

import { apiClient } from '../api-client'
import type {
  Funcionario,
  Job,
  ImportFuncionariosRequest,
  ImportFuncionariosResponse,
  ListFuncionariosResponse,
  ListJobsResponse,
} from '../types/dados.types'

// ============================================================================
// FUNCIONÁRIOS
// ============================================================================

/**
 * Lista funcionários com cache SERPRO (FREE - R$ 0,00)
 *
 * Endpoint: GET /api/admin/tenants/:code/funcionarios
 *
 * Este endpoint retorna dados do cache D1, não consulta SERPRO diretamente.
 * Cache válido: 90 dias (CPF)
 *
 * @param tenantCode Código do tenant (ex: "CLIENTE_01")
 * @returns Lista de funcionários + estatísticas de cache
 *
 * @example
 * const result = await listarFuncionarios('CLIENTE_01');
 * console.log(result.total); // 2948 funcionários
 * console.log(result.cache_stats.percentage); // 85% cached
 * console.log(result.funcionarios[0].esta_morto); // 0 ou 1 (flag enriquecido)
 */
export async function listarFuncionarios(
  tenantCode: string
): Promise<ListFuncionariosResponse> {
  const response = await apiClient.get<ListFuncionariosResponse>(
    `/api/admin/tenants/${tenantCode}/funcionarios`
  )

  return response
}

/**
 * Importa CSV de funcionários + cria job em background
 *
 * Endpoint: POST /api/admin/import-funcionarios
 *
 * Fluxo:
 * 1. Insere funcionários na tabela D1 `funcionarios`
 * 2. Cria job na fila `jobs_queue`
 * 3. Background worker processa job (1 req/s para evitar custo excessivo)
 * 4. Dados SERPRO salvos em `serpro_cpf_cache` (válido 90 dias)
 *
 * @param tenantCode Código do tenant
 * @param funcionarios Array de funcionários (CPF obrigatório)
 * @returns Job criado + quantidade importada
 *
 * @example
 * const funcionarios = [
 *   { cpf: '12345678900', grupo: 'COMURG', cargo: 'Auxiliar', salario: 2500 },
 *   { cpf: '98765432100', grupo: 'SAUDE', cargo: 'Enfermeiro', salario: 4200 }
 * ];
 *
 * const result = await importarFuncionarios('CLIENTE_01', funcionarios);
 * console.log(result.job_id); // 1 (use listarJobs para monitorar)
 * console.log(result.funcionarios_imported); // 2
 */
export async function importarFuncionarios(
  tenantCode: string,
  funcionarios: Array<{
    cpf: string
    grupo?: string
    cargo?: string
    salario?: number
  }>
): Promise<ImportFuncionariosResponse> {
  const response = await apiClient.post<ImportFuncionariosResponse>(
    '/api/admin/import-funcionarios',
    {
      tenant_code: tenantCode,
      funcionarios,
    }
  )

  return response
}

/**
 * Cria funcionário a partir de consulta SERPRO (Integração Kanban)
 *
 * Endpoint: POST /api/admin/tenants/:code/funcionarios/from-serpro
 *
 * Este método é usado após consultas SERPRO para auto-criar cards no Kanban.
 * Status padrão: 'investigando'
 *
 * @param tenantCode Código do tenant
 * @param data Dados da consulta SERPRO
 * @returns Funcionário criado/atualizado
 *
 * @example
 * // Após consultar CPF no SERPRO:
 * const resultado = await serproService.consultarCpf('12345678900');
 *
 * // Auto-criar card no Kanban:
 * await criarFuncionarioDeSerpro('CLIENTE_01', {
 *   cpf: '12345678900',
 *   tipo: 'consulta_cpf',
 *   metadata: {
 *     api: 'cpf',
 *     nome: resultado.nome,
 *     nascimento: resultado.nascimento,
 *     situacao: resultado.situacao
 *   },
 *   custo: 0.50,
 *   status_investigacao: 'investigando'
 * });
 */
export async function criarFuncionarioDeSerpro(
  tenantCode: string,
  data: {
    cpf?: string
    cnpj?: string
    tipo: string
    metadata: Record<string, any>
    custo: number
    status_investigacao?: 'investigar' | 'investigando' | 'relatorio' | 'monitoramento' | 'aprovado' | 'bloqueado'
  }
): Promise<{ success: boolean; funcionario: Funcionario; created: boolean }> {
  const response = await apiClient.post<{
    success: boolean
    funcionario: Funcionario
    created: boolean
  }>(
    `/api/admin/tenants/${tenantCode}/funcionarios/from-serpro`,
    data
  )

  return response
}

/**
 * Atualiza status do funcionário (Kanban drag & drop)
 *
 * Endpoint: PATCH /api/admin/tenants/:code/funcionarios/:id
 *
 * @param tenantCode Código do tenant
 * @param funcionarioId ID do funcionário
 * @param updates Campos a atualizar
 * @returns Funcionário atualizado
 *
 * @example
 * // Drag & drop no Kanban:
 * await atualizarFuncionario('CLIENTE_01', 123, {
 *   status_investigacao: 'aprovado'
 * });
 *
 * // Adicionar observação:
 * await atualizarFuncionario('CLIENTE_01', 123, {
 *   observacoes: 'Verificado em 08/12/2025. Tudo OK.'
 * });
 */
export async function atualizarFuncionario(
  tenantCode: string,
  funcionarioId: number,
  updates: {
    status_investigacao?: 'investigar' | 'investigando' | 'relatorio' | 'monitoramento' | 'aprovado' | 'bloqueado'
    observacoes?: string
    arquivado?: 0 | 1
  }
): Promise<{ success: boolean; funcionario: Funcionario }> {
  const response = await apiClient.patch<{
    success: boolean
    funcionario: Funcionario
  }>(
    `/api/admin/tenants/${tenantCode}/funcionarios/${funcionarioId}`,
    updates
  )

  return response
}

// ============================================================================
// JOBS (Background Processing)
// ============================================================================

/**
 * Lista jobs da fila (monitoramento em tempo real)
 *
 * Endpoint: GET /api/admin/jobs
 *
 * Use com useAsyncPolling para progresso em tempo real.
 *
 * @param status Filtrar por status (opcional)
 * @returns Lista de jobs + total
 *
 * @example
 * // Sem polling (uma vez)
 * const result = await listarJobs();
 * console.log(result.jobs[0].progress); // 45%
 *
 * @example
 * // Com polling (tempo real)
 * const { data } = useAsyncPolling(() => listarJobs('processing'), {
 *   interval: 2000, // A cada 2 segundos
 *   stopWhen: (data) => data?.jobs.every(j => j.status === 'completed')
 * });
 *
 * const job = data?.jobs[0];
 * console.log(`Progresso: ${job.progress}% (${job.items_processed}/${job.items_total})`);
 */
export async function listarJobs(
  status?: 'pending' | 'processing' | 'completed' | 'failed'
): Promise<ListJobsResponse> {
  const params = status ? `?status=${status}` : ''
  const response = await apiClient.get<ListJobsResponse>(
    `/api/admin/jobs${params}`
  )

  return response
}

/**
 * Processa jobs manualmente (para dev/admin)
 *
 * Endpoint: POST /api/admin/process-jobs
 *
 * ⚠️ ATENÇÃO: Esta ação consome créditos SERPRO!
 * Cada CPF não cacheado = R$ 0,50
 *
 * Normalmente, jobs são processados automaticamente pelo cron.
 * Use este método apenas para:
 * - Desenvolvimento/testes
 * - Admin forçar processamento imediato
 * - Resolver fila travada
 *
 * @returns Quantidade de jobs encontrados + mensagem
 *
 * @example
 * const result = await processarJobs();
 * console.log(result.jobs_found); // 5 jobs
 * console.log(result.message); // "Processing started for 5 jobs"
 */
export async function processarJobs(): Promise<{
  success: boolean
  jobs_found: number
  message: string
}> {
  const response = await apiClient.post<{
    success: boolean
    jobs_found: number
    message: string
  }>('/api/admin/process-jobs', {})

  return response
}

// ============================================================================
// VÍNCULOS (Futuro)
// ============================================================================

/**
 * Lista vínculos empregatícios com cache SERPRO
 *
 * TODO: Implementar quando backend criar endpoint similar
 *
 * Endpoint futuro: GET /api/admin/tenants/:code/vinculos
 *
 * @param tenantCode Código do tenant
 * @throws Error - Endpoint ainda não implementado
 */
export async function listarVinculos(tenantCode: string): Promise<any> {
  // Placeholder - implementar quando backend criar endpoint
  throw new Error('Endpoint /vinculos ainda não implementado no backend')
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Busca um job específico por ID
 *
 * @param jobId ID do job
 * @returns Job encontrado ou null
 *
 * @example
 * const job = await buscarJobPorId(1);
 * if (job && job.status === 'completed') {
 *   console.log('Job finalizado!');
 * }
 */
export async function buscarJobPorId(jobId: number): Promise<Job | null> {
  const result = await listarJobs()
  return result.jobs.find((j) => j.id === jobId) || null
}

/**
 * Aguarda job completar (pooling)
 *
 * @param jobId ID do job
 * @param options Opções de pooling
 * @returns Job completado
 *
 * @example
 * const job = await aguardarJobCompletar(1, {
 *   interval: 2000,
 *   timeout: 300000, // 5 minutos
 *   onProgress: (progress) => console.log(`${progress}%`)
 * });
 *
 * console.log('Job finalizado!', job);
 */
export async function aguardarJobCompletar(
  jobId: number,
  options: {
    interval?: number
    timeout?: number
    onProgress?: (progress: number) => void
  } = {}
): Promise<Job> {
  const { interval = 2000, timeout = 300000, onProgress } = options

  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    const checkJob = async () => {
      try {
        const job = await buscarJobPorId(jobId)

        if (!job) {
          reject(new Error(`Job ${jobId} not found`))
          return
        }

        if (onProgress) {
          onProgress(job.progress)
        }

        if (job.status === 'completed') {
          resolve(job)
          return
        }

        if (job.status === 'failed') {
          reject(
            new Error(
              `Job ${jobId} failed: ${job.error_message || 'Unknown error'}`
            )
          )
          return
        }

        // Check timeout
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Job ${jobId} timeout after ${timeout}ms`))
          return
        }

        // Continue polling
        setTimeout(checkJob, interval)
      } catch (error) {
        reject(error)
      }
    }

    checkJob()
  })
}
