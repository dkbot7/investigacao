/**
 * Email Sender - Envia alertas via Resend API
 *
 * @see https://resend.com/docs/send-with-nextjs
 */

import { Env } from '../types';
import { Change } from './change-detector';

/**
 * Envia email de alerta para usuário
 */
export async function sendAlertEmail(
  env: Env,
  userId: string,
  overrideEmail: string | null,
  change: Change
): Promise<void> {
  // 1. Buscar email do usuário (assumindo tabela users existe)
  const user = await env.DB.prepare(
    `SELECT email, name FROM users WHERE id = ?`
  ).bind(userId).first<{ email: string; name: string }>();

  if (!user) {
    console.warn(`[Email] Usuário ${userId} não encontrado`);
    return;
  }

  const toEmail = overrideEmail || user.email;

  // 2. Preparar conteúdo do email baseado no tipo de alerta
  const emailContent = buildEmailContent(user.name, change);

  // 3. Enviar via Resend API
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

  // 4. Marcar alerta como enviado
  // (será feito no handler principal após sucesso)
}

/**
 * Constrói conteúdo do email baseado no tipo de mudança
 */
function buildEmailContent(userName: string, change: Change): { html: string; text: string } {
  const severityColor = {
    critical: '#DC2626',
    high: '#EA580C',
    medium: '#F59E0B',
    low: '#6B7280'
  }[change.severity];

  const severityLabel = {
    critical: 'CRÍTICO',
    high: 'ALTO',
    medium: 'MÉDIO',
    low: 'BAIXO'
  }[change.severity];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1E3A5F 0%, #0A1628 100%); padding: 30px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Investigaree</h1>
        <p style="color: #93C5FD; margin: 8px 0 0 0; font-size: 14px;">Sistema de Alertas Automáticos</p>
      </div>

      <div style="background: white; padding: 30px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="margin-top: 0; font-size: 16px;">Olá <strong>${userName}</strong>,</p>

        <div style="background: #FEF2F2; border-left: 4px solid ${severityColor}; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span style="background: ${severityColor}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-right: 12px;">
              ${severityLabel}
            </span>
            <h2 style="margin: 0; font-size: 18px; color: #1F2937;">${change.title}</h2>
          </div>

          <p style="margin: 0; color: #4B5563; font-size: 14px;">
            ${change.description}
          </p>
        </div>

        ${buildChangeDetails(change)}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
          <a href="https://investigaree.com.br/dashboard/investigacoes"
             style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Ver no Dashboard →
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #6B7280;">
          Este é um email automático do sistema Investigaree. Você está recebendo porque possui alertas habilitados para suas investigações.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9CA3AF; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Investigaree - Due Diligence Digital</p>
        <p style="margin: 8px 0 0 0;">
          <a href="https://investigaree.com.br/privacidade" style="color: #6B7280; text-decoration: none;">Política de Privacidade</a> |
          <a href="https://investigaree.com.br/dashboard/configuracoes" style="color: #6B7280; text-decoration: none;">Gerenciar Alertas</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Investigaree - Alerta Automático

Olá ${userName},

${change.title}
Severidade: ${severityLabel}

${change.description}

Acesse o dashboard para mais detalhes:
https://investigaree.com.br/dashboard/investigacoes

---
Este é um email automático do sistema Investigaree.
Para gerenciar seus alertas, acesse: https://investigaree.com.br/dashboard/configuracoes
  `.trim();

  return { html, text };
}

/**
 * Constrói detalhes da mudança para exibir no email
 */
function buildChangeDetails(change: Change): string {
  const details: string[] = [];

  if (change.type === 'ceis_entry') {
    details.push(`<p style="margin: 16px 0 0 0; font-size: 14px;"><strong>Novos registros CEIS:</strong> ${change.newValue.count - change.oldValue.count}</p>`);
  }

  if (change.type === 'processo_novo') {
    details.push(`<p style="margin: 16px 0 0 0; font-size: 14px;"><strong>Novos processos:</strong> ${change.newValue.count - change.oldValue.count}</p>`);
  }

  if (change.type === 'vinculo_mudanca') {
    details.push(`
      <p style="margin: 16px 0 0 0; font-size: 14px;">
        <strong>Vínculos anteriores:</strong> ${change.oldValue.count}<br>
        <strong>Vínculos atuais:</strong> ${change.newValue.count}
      </p>
    `);
  }

  if (change.type === 'cnep_entry') {
    details.push(`<p style="margin: 16px 0 0 0; font-size: 14px;"><strong>Novos registros CNEP:</strong> ${change.newValue.count - change.oldValue.count}</p>`);
  }

  if (change.type === 'obito') {
    details.push(`<p style="margin: 16px 0 0 0; font-size: 14px; color: #DC2626;"><strong>Data do óbito:</strong> ${change.newValue.data || 'Não informada'}</p>`);
  }

  return details.join('');
}
