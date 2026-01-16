/**
 * Cloudflare Cron Trigger Handler - Alertas Automáticos
 *
 * Executa diariamente às 9h UTC (6h BRT)
 */

import { Env } from './types';

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
                `INSERT INTO investigation_alerts (
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

// === CHANGE DETECTION ===

interface Change {
  type: 'ceis_entry' | 'processo_novo' | 'vinculo_mudanca' | 'cnep_entry' | 'obito';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  oldValue: any;
  newValue: any;
}

async function checkInvestigationChanges(
  env: Env,
  investigationId: string,
  tenantId: string,
  currentData: any,
  enabledAlertTypes: string[]
): Promise<Change[]> {
  const changes: Change[] = [];

  // Buscar último snapshot
  const snapshot = await env.DB.prepare(
    `SELECT snapshot_data, created_at
     FROM investigation_snapshots
     WHERE investigation_id = ?
     ORDER BY created_at DESC
     LIMIT 1`
  ).bind(investigationId).first<{ snapshot_data: string; created_at: number }>();

  // Se não há snapshot, criar um e retornar vazio
  if (!snapshot) {
    await createSnapshot(env, investigationId, tenantId, currentData);
    return changes;
  }

  const oldData = JSON.parse(snapshot.snapshot_data);

  // Verificar mudanças por tipo
  if (enabledAlertTypes.includes('ceis_entry')) {
    changes.push(...detectCEISChanges(oldData, currentData));
  }

  if (enabledAlertTypes.includes('processo_novo')) {
    changes.push(...detectProcessoChanges(oldData, currentData));
  }

  if (enabledAlertTypes.includes('vinculo_mudanca')) {
    changes.push(...detectVinculoChanges(oldData, currentData));
  }

  if (enabledAlertTypes.includes('cnep_entry')) {
    changes.push(...detectCNEPChanges(oldData, currentData));
  }

  if (enabledAlertTypes.includes('obito')) {
    const obitoChange = detectObitoChange(oldData, currentData);
    if (obitoChange) changes.push(obitoChange);
  }

  // Se houve mudanças, atualizar snapshot
  if (changes.length > 0) {
    await createSnapshot(env, investigationId, tenantId, currentData);
  }

  return changes;
}

function detectCEISChanges(oldData: any, newData: any): Change[] {
  const oldCeis = oldData.ceis || [];
  const newCeis = newData.ceis || [];

  if (newCeis.length > oldCeis.length) {
    const newEntries = newCeis.slice(oldCeis.length);
    return newEntries.map((entry: any) => ({
      type: 'ceis_entry' as const,
      severity: 'critical' as const,
      title: 'Novo Registro CEIS Detectado',
      description: `Pessoa foi incluída no Cadastro de Empresas Inidôneas e Suspensas (CEIS). Órgão: ${entry.orgao || 'N/A'}`,
      oldValue: { count: oldCeis.length },
      newValue: { count: newCeis.length, new: entry }
    }));
  }

  return [];
}

function detectProcessoChanges(oldData: any, newData: any): Change[] {
  const oldProcessos = oldData.processos || [];
  const newProcessos = newData.processos || [];

  if (newProcessos.length > oldProcessos.length) {
    const newEntries = newProcessos.slice(oldProcessos.length);
    return newEntries.map((processo: any) => ({
      type: 'processo_novo' as const,
      severity: 'high' as const,
      title: 'Novo Processo Judicial',
      description: `Novo processo identificado. Tribunal: ${processo.tribunal || 'N/A'}. Tipo: ${processo.tipo || 'N/A'}`,
      oldValue: { count: oldProcessos.length },
      newValue: { count: newProcessos.length, new: processo }
    }));
  }

  return [];
}

function detectVinculoChanges(oldData: any, newData: any): Change[] {
  const oldVinculos = oldData.vinculos || [];
  const newVinculos = newData.vinculos || [];

  if (newVinculos.length !== oldVinculos.length) {
    return [{
      type: 'vinculo_mudanca' as const,
      severity: 'medium' as const,
      title: 'Mudança em Vínculos Empresariais',
      description: `Vínculos empresariais alterados. Anterior: ${oldVinculos.length}, Atual: ${newVinculos.length}`,
      oldValue: { count: oldVinculos.length, vinculos: oldVinculos },
      newValue: { count: newVinculos.length, vinculos: newVinculos }
    }];
  }

  return [];
}

function detectCNEPChanges(oldData: any, newData: any): Change[] {
  const oldCnep = oldData.cnep || [];
  const newCnep = newData.cnep || [];

  if (newCnep.length > oldCnep.length) {
    const newEntries = newCnep.slice(oldCnep.length);
    return newEntries.map((entry: any) => ({
      type: 'cnep_entry' as const,
      severity: 'critical' as const,
      title: 'Novo Registro CNEP Detectado',
      description: `Pessoa foi incluída no Cadastro Nacional de Empresas Punidas (CNEP). Sanção: ${entry.tipo_sancao || 'N/A'}`,
      oldValue: { count: oldCnep.length },
      newValue: { count: newCnep.length, new: entry }
    }));
  }

  return [];
}

function detectObitoChange(oldData: any, newData: any): Change | null {
  const oldObito = oldData.obito || false;
  const newObito = newData.obito || false;

  if (!oldObito && newObito) {
    return {
      type: 'obito' as const,
      severity: 'critical' as const,
      title: 'Óbito Registrado',
      description: 'Foi identificado registro de óbito para a pessoa investigada.',
      oldValue: { obito: false },
      newValue: { obito: true, data: newData.data_obito }
    };
  }

  return null;
}

async function createSnapshot(
  env: Env,
  investigationId: string,
  tenantId: string,
  data: any
): Promise<void> {
  const snapshotId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);

  await env.DB.prepare(
    `INSERT INTO investigation_snapshots (id, investigation_id, tenant_id, snapshot_data, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(
    snapshotId,
    investigationId,
    tenantId,
    JSON.stringify(data),
    now
  ).run();
}

// === EMAIL SENDER ===

async function sendAlertEmail(
  env: Env,
  userId: string,
  overrideEmail: string | null,
  change: Change
): Promise<void> {
  // Buscar email do usuário
  const user = await env.DB.prepare(
    `SELECT email, name FROM users WHERE id = ?`
  ).bind(userId).first<{ email: string; name: string }>();

  if (!user) {
    console.warn(`[Email] Usuário ${userId} não encontrado`);
    return;
  }

  const toEmail = overrideEmail || user.email;
  const emailContent = buildEmailContent(user.name, change);

  // Enviar via Resend API
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Investigaree Alertas <alertas@investigaree.com.br>',
      to: [toEmail],
      subject: `⚠️ ${change.title} - Investigaree`,
      html: emailContent.html,
      text: emailContent.text
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  console.log(`[Email] Alerta enviado para ${toEmail}. ID: ${result.id}`);
}

function buildEmailContent(userName: string, change: Change): { html: string; text: string } {
  const severityColors = {
    critical: '#DC2626',
    high: '#EA580C',
    medium: '#F59E0B',
    low: '#6B7280'
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1E3A5F;">Investigaree</h1>
      <div style="background: #FEF2F2; border-left: 4px solid ${severityColors[change.severity]}; padding: 16px; margin: 20px 0;">
        <h2>${change.title}</h2>
        <p>${change.description}</p>
      </div>
      <a href="https://investigaree.com.br/dashboard/investigacoes" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
        Ver no Dashboard →
      </a>
    </body>
    </html>
  `;

  const text = `
Investigaree - Alerta Automático

${change.title}

${change.description}

Acesse: https://investigaree.com.br/dashboard/investigacoes
  `.trim();

  return { html, text };
}
