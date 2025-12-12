/**
 * Cloudflare Cron Trigger Handler - Alertas Automáticos
 *
 * Executa diariamente às 9h UTC para detectar mudanças em investigações ativas
 *
 * @see https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/
 */

import { Env } from '../types';
import { checkInvestigationChanges } from './change-detector';
import { sendAlertEmail } from './email-sender';

/**
 * Handler do Cloudflare Cron Trigger
 *
 * Adicionar ao Worker principal (index.ts):
 *
 * export default {
 *   async fetch(request, env, ctx) { ... },
 *   async scheduled(controller, env, ctx) {
 *     return handleScheduled(controller, env, ctx);
 *   }
 * }
 */
export async function handleScheduled(
  controller: ScheduledController,
  env: Env,
  ctx: ExecutionContext
): Promise<void> {
  console.log(`[Cron] Iniciando verificação de alertas às ${new Date().toISOString()}`);

  try {
    // 1. Buscar todos os tenants com alertas habilitados
    const { results: configs } = await env.DB.prepare(
      `SELECT tenant_id, alert_types, email_enabled, notification_email
       FROM alert_config
       WHERE enabled = 1`
    ).all<{ tenant_id: string; alert_types: string; email_enabled: number; notification_email: string | null }>();

    console.log(`[Cron] ${configs.length} tenants com alertas habilitados`);

    // 2. Para cada tenant, buscar investigações ativas
    for (const config of configs) {
      try {
        const { results: investigations } = await env.DB.prepare(
          `SELECT id, user_id, status, data
           FROM investigations
           WHERE tenant_id = ? AND status IN ('ativa', 'em_analise')
           LIMIT 100`
        ).bind(config.tenant_id).all<{ id: string; user_id: string; status: string; data: string }>();

        console.log(`[Cron] Tenant ${config.tenant_id}: ${investigations.length} investigações ativas`);

        // 3. Verificar mudanças para cada investigação
        for (const investigation of investigations) {
          const alertTypes = JSON.parse(config.alert_types) as string[];

          const changes = await checkInvestigationChanges(
            env,
            investigation.id,
            config.tenant_id,
            JSON.parse(investigation.data),
            alertTypes
          );

          // 4. Criar alertas para mudanças detectadas
          if (changes.length > 0) {
            console.log(`[Cron] ${changes.length} mudanças detectadas para investigação ${investigation.id}`);

            for (const change of changes) {
              const alertId = crypto.randomUUID();
              const now = Math.floor(Date.now() / 1000);

              // Insert alert
              await env.DB.prepare(
                `INSERT INTO alerts (
                  id, investigation_id, tenant_id, user_id,
                  alert_type, severity, title, description,
                  old_value, new_value, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
              ).bind(
                alertId,
                investigation.id,
                config.tenant_id,
                investigation.user_id,
                change.type,
                change.severity,
                change.title,
                change.description,
                JSON.stringify(change.oldValue),
                JSON.stringify(change.newValue),
                now
              ).run();

              // 5. Enviar email se habilitado
              if (config.email_enabled === 1) {
                ctx.waitUntil(
                  sendAlertEmail(
                    env,
                    investigation.user_id,
                    config.notification_email,
                    change
                  ).catch(err => {
                    console.error(`[Cron] Erro ao enviar email para user ${investigation.user_id}:`, err);
                  })
                );
              }
            }
          }
        }
      } catch (tenantError) {
        console.error(`[Cron] Erro ao processar tenant ${config.tenant_id}:`, tenantError);
        // Continua para próximo tenant
      }
    }

    console.log(`[Cron] Verificação concluída com sucesso`);
  } catch (error) {
    console.error('[Cron] Erro fatal na verificação de alertas:', error);
    throw error; // Cloudflare registra falha
  }
}

/**
 * Configuração do wrangler.toml:
 *
 * [triggers]
 * crons = ["0 9 * * *"]  # Diário às 9h UTC (6h BRT)
 */
