/**
 * Job Processor - Cron Handler
 *
 * Processador de jobs em background
 * Executado via Cloudflare Cron Triggers (a cada 1 hora)
 *
 * Tipos de jobs suportados:
 * - consultar_cpf_batch: Consulta múltiplos CPFs no SERPRO
 * - refresh_cache_cpf: Atualiza CPFs expirados
 */

import type { Env } from '../types/api.types';

/**
 * Processador principal de jobs
 * Chamado pelo cron trigger ou manualmente via /api/admin/process-jobs
 */
export async function processJobs(env: Env): Promise<void> {
  console.log('[Cron] Iniciando processamento de jobs...');

  try {
    // 1. Buscar próximo job pendente (prioridade + mais antigo)
    const job = await env.DB.prepare(`
      SELECT * FROM jobs_queue
      WHERE status = 'pending'
        AND (next_retry_at IS NULL OR next_retry_at <= datetime('now'))
      ORDER BY priority ASC, created_at ASC
      LIMIT 1
    `).first<any>();

    if (!job) {
      console.log('[Cron] Nenhum job pendente');
      return;
    }

    console.log(`[Cron] Processando job #${job.id} (${job.type})`);

    // 2. Marcar como processando
    await env.DB.prepare(`
      UPDATE jobs_queue
      SET status = 'processing',
          started_at = datetime('now'),
          retry_count = retry_count + 1
      WHERE id = ?
    `).bind(job.id).run();

    // 3. Processar conforme tipo
    try {
      if (job.type === 'consultar_cpf_batch') {
        await processConsultarCpfBatch(job, env);
      } else if (job.type === 'refresh_cache_cpf') {
        await processRefreshCacheCpf(job, env);
      } else {
        console.error(`[Cron] Tipo de job desconhecido: ${job.type}`);
        await markJobAsFailed(job.id, `Tipo desconhecido: ${job.type}`, env);
      }
    } catch (error: any) {
      console.error(`[Cron] Erro ao processar job #${job.id}:`, error);
      await markJobAsFailed(job.id, error.message, env);
    }

  } catch (error: any) {
    console.error('[Cron] Erro crítico ao processar jobs:', error);
  }
}

/**
 * Processar job: consultar_cpf_batch
 * Consulta múltiplos CPFs no SERPRO e salva no cache
 */
async function processConsultarCpfBatch(job: any, env: Env): Promise<void> {
  const { cpfs } = JSON.parse(job.data_json);
  let processed = 0;
  let failed = 0;

  console.log(`[Cron] Processando ${cpfs.length} CPFs para job #${job.id}`);

  for (const cpf of cpfs) {
    try {
      // Verificar se já está no cache (e não expirou)
      const cached = await env.DB.prepare(`
        SELECT cpf FROM serpro_cpf_cache
        WHERE cpf = ? AND expires_at > datetime('now')
      `).bind(cpf).first();

      if (cached) {
        console.log(`[Cron] CPF ${cpf} já está em cache válido`);
        processed++;

        // Atualizar progresso
        await updateJobProgress(job.id, cpfs.length, processed, failed, env);
        continue;
      }

      // Consultar SERPRO (💰 CUSTO!)
      console.log(`[Cron] Consultando CPF ${cpf} no SERPRO...`);

      // Importar service de CPF
      const { consultarCPF } = await import('../services/cpf.service');
      const response = await consultarCPF(cpf, env);

      // Salvar no cache
      await env.DB.prepare(`
        INSERT INTO serpro_cpf_cache
        (cpf, nome, nascimento, situacao_codigo, situacao_descricao, dados_json, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+90 days'))
        ON CONFLICT(cpf) DO UPDATE SET
          nome = excluded.nome,
          nascimento = excluded.nascimento,
          situacao_codigo = excluded.situacao_codigo,
          situacao_descricao = excluded.situacao_descricao,
          dados_json = excluded.dados_json,
          updated_at = datetime('now'),
          expires_at = excluded.expires_at,
          consultas_count = consultas_count + 1,
          ultimo_status_http = 200
      `).bind(
        cpf,
        response.nome,
        response.nascimento,
        response.situacao.codigo,
        response.situacao.descricao,
        JSON.stringify(response)
      ).run();

      // Log de uso (para billing)
      await env.DB.prepare(`
        INSERT INTO serpro_usage
        (user_id, tenant_code, api_name, document, cost, response_status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        'system',
        job.tenant_code || 'unknown',
        'cpf',
        cpf,
        0.50, // Custo por consulta CPF
        200
      ).run();

      processed++;
      console.log(`[Cron] CPF ${cpf} salvo no cache (${processed}/${cpfs.length})`);

      // Atualizar progresso
      await updateJobProgress(job.id, cpfs.length, processed, failed, env);

      // Rate limit: 60 req/min = 1 req/segundo
      // Aguardar 1 segundo antes do próximo
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error: any) {
      console.error(`[Cron] Erro ao consultar CPF ${cpf}:`, error);
      failed++;

      // Salvar erro no cache
      await env.DB.prepare(`
        INSERT INTO serpro_cpf_cache
        (cpf, nome, dados_json, expires_at, ultimo_erro, ultimo_status_http)
        VALUES (?, ?, ?, datetime('now', '+7 days'), ?, ?)
        ON CONFLICT(cpf) DO UPDATE SET
          ultimo_erro = excluded.ultimo_erro,
          ultimo_status_http = excluded.ultimo_status_http,
          updated_at = datetime('now')
      `).bind(
        cpf,
        'ERRO',
        JSON.stringify({ error: error.message }),
        error.message,
        error.status || 500
      ).run();

      // Atualizar progresso
      await updateJobProgress(job.id, cpfs.length, processed, failed, env);
    }
  }

  // Marcar como concluído
  await env.DB.prepare(`
    UPDATE jobs_queue
    SET status = 'completed',
        completed_at = datetime('now'),
        progress = 100,
        items_processed = ?,
        items_failed = ?
    WHERE id = ?
  `).bind(processed, failed, job.id).run();

  console.log(`[Cron] Job #${job.id} concluído: ${processed} OK, ${failed} falhas`);
}

/**
 * Processar job: refresh_cache_cpf
 * Re-consulta CPFs expirados
 */
async function processRefreshCacheCpf(job: any, env: Env): Promise<void> {
  console.log('[Cron] Processando refresh de cache CPF...');

  // Buscar CPFs expirados
  const { results } = await env.DB.prepare(`
    SELECT cpf FROM serpro_cpf_cache
    WHERE expires_at < datetime('now')
    LIMIT 100
  `).all();

  if (results.length === 0) {
    console.log('[Cron] Nenhum CPF expirado para atualizar');
    await env.DB.prepare(`
      UPDATE jobs_queue
      SET status = 'completed', completed_at = datetime('now'), progress = 100
      WHERE id = ?
    `).bind(job.id).run();
    return;
  }

  // Criar novo job para consultar em lote
  const cpfs = results.map((r: any) => r.cpf);

  await env.DB.prepare(`
    INSERT INTO jobs_queue (type, tenant_code, status, data_json, items_total)
    VALUES (?, ?, ?, ?, ?)
  `).bind(
    'consultar_cpf_batch',
    job.tenant_code,
    'pending',
    JSON.stringify({ cpfs }),
    cpfs.length
  ).run();

  // Marcar job de refresh como concluído
  await env.DB.prepare(`
    UPDATE jobs_queue
    SET status = 'completed', completed_at = datetime('now'), progress = 100
    WHERE id = ?
  `).bind(job.id).run();

  console.log(`[Cron] Job de refresh criou novo job para ${cpfs.length} CPFs`);
}

/**
 * Atualizar progresso do job
 */
async function updateJobProgress(
  jobId: number,
  total: number,
  processed: number,
  failed: number,
  env: Env
): Promise<void> {
  const progress = Math.round(((processed + failed) / total) * 100);

  await env.DB.prepare(`
    UPDATE jobs_queue
    SET progress = ?,
        items_processed = ?,
        items_failed = ?
    WHERE id = ?
  `).bind(progress, processed, failed, jobId).run();
}

/**
 * Marcar job como falho
 */
async function markJobAsFailed(
  jobId: number,
  errorMessage: string,
  env: Env
): Promise<void> {
  await env.DB.prepare(`
    UPDATE jobs_queue
    SET status = 'failed',
        error = ?,
        completed_at = datetime('now')
    WHERE id = ?
  `).bind(errorMessage, jobId).run();

  console.error(`[Cron] Job #${jobId} marcado como falho: ${errorMessage}`);
}
