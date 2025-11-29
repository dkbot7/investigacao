/**
 * Notification Service
 * Envia emails e cria alertas para admins
 */

import { Env } from '../index'

// Lista de emails admin que recebem notificações
export const ADMIN_EMAILS = [
  'dkbotdani@gmail.com',
  'ibsenmaciel@gmail.com',
  'contato@investigaree.com.br'
]

// Email principal do sistema
export const SYSTEM_EMAIL = 'contato@investigaree.com.br'

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

interface CreateAlertParams {
  type: 'new_user' | 'new_lead' | 'access_request' | 'error' | 'info'
  title: string
  message: string
  data?: Record<string, any>
  severity?: 'info' | 'warning' | 'error' | 'success'
}

/**
 * Envia email usando Resend API
 */
export async function sendEmail(env: Env, params: SendEmailParams): Promise<boolean> {
  try {
    const recipients = Array.isArray(params.to) ? params.to : [params.to]

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: params.from || 'investigaree <noreply@investigaree.com.br>',
        to: recipients,
        subject: params.subject,
        html: params.html
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[NOTIFICATIONS] Email send failed:', error)
      return false
    }

    console.log('[NOTIFICATIONS] Email sent to:', recipients.join(', '))
    return true
  } catch (error) {
    console.error('[NOTIFICATIONS] Email error:', error)
    return false
  }
}

/**
 * Cria alerta no banco para exibir no admin dashboard
 */
export async function createAdminAlert(env: Env, params: CreateAlertParams): Promise<boolean> {
  try {
    await env.DB.prepare(`
      INSERT INTO admin_alerts (id, type, title, message, data, severity)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      params.type,
      params.title,
      params.message,
      params.data ? JSON.stringify(params.data) : null,
      params.severity || 'info'
    ).run()

    console.log('[NOTIFICATIONS] Alert created:', params.type, params.title)
    return true
  } catch (error) {
    console.error('[NOTIFICATIONS] Alert creation error:', error)
    return false
  }
}

/**
 * Notifica admins sobre novo usuário cadastrado
 */
export async function notifyNewUser(env: Env, user: {
  email: string
  name?: string
  phone?: string
  created_at: string
}): Promise<void> {
  const userInfo = `
    <strong>Email:</strong> ${user.email}<br>
    <strong>Nome:</strong> ${user.name || 'Não informado'}<br>
    <strong>Telefone:</strong> ${user.phone || 'Não informado'}<br>
    <strong>Data:</strong> ${new Date(user.created_at).toLocaleString('pt-BR')}
  `

  // 1. Enviar email para admins
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .info-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #c9a227; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🆕 Novo Usuário Cadastrado</h1>
        </div>
        <div class="content">
          <p>Um novo usuário se cadastrou na plataforma investigaree:</p>
          <div class="info-box">
            ${userInfo}
          </div>
          <p>Este usuário ainda não tem acesso a nenhum tenant. Acesse o painel admin para liberar acesso.</p>
          <a href="https://investigaree.com.br/dashboard/admin" class="button">Acessar Painel Admin</a>
        </div>
        <div class="footer">
          <p>investigaree - Due Diligence Digital</p>
          <p>Este é um email automático, não responda.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail(env, {
    to: ADMIN_EMAILS,
    subject: `[investigaree] 🆕 Novo usuário: ${user.email}`,
    html: emailHtml
  })

  // 2. Criar alerta no admin dashboard
  await createAdminAlert(env, {
    type: 'new_user',
    title: 'Novo usuário cadastrado',
    message: `${user.email} se cadastrou na plataforma`,
    data: {
      email: user.email,
      name: user.name,
      phone: user.phone,
      created_at: user.created_at
    },
    severity: 'info'
  })
}

/**
 * Notifica admins sobre novo lead (WhatsApp/Contato)
 */
export async function notifyNewLead(env: Env, lead: {
  name: string
  email?: string
  phone: string
  message?: string
  source: string
}): Promise<void> {
  const leadInfo = `
    <strong>Nome:</strong> ${lead.name}<br>
    <strong>Email:</strong> ${lead.email || 'Não informado'}<br>
    <strong>Telefone:</strong> ${lead.phone}<br>
    <strong>Origem:</strong> ${lead.source}<br>
    ${lead.message ? `<strong>Mensagem:</strong> ${lead.message}` : ''}
  `

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #25d366; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .info-box { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📱 Novo Lead Recebido</h1>
        </div>
        <div class="content">
          <p>Um novo contato foi recebido via ${lead.source}:</p>
          <div class="info-box">
            ${leadInfo}
          </div>
          <a href="https://wa.me/55${lead.phone.replace(/\D/g, '')}" class="button">Responder no WhatsApp</a>
        </div>
        <div class="footer">
          <p>investigaree - Due Diligence Digital</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendEmail(env, {
    to: ADMIN_EMAILS,
    subject: `[investigaree] 📱 Novo lead: ${lead.name}`,
    html: emailHtml
  })

  await createAdminAlert(env, {
    type: 'new_lead',
    title: 'Novo lead recebido',
    message: `${lead.name} entrou em contato via ${lead.source}`,
    data: lead,
    severity: 'success'
  })
}

/**
 * Notifica admins sobre erro crítico
 */
export async function notifyError(env: Env, error: {
  message: string
  stack?: string
  context?: string
}): Promise<void> {
  await createAdminAlert(env, {
    type: 'error',
    title: 'Erro no sistema',
    message: error.message,
    data: {
      stack: error.stack,
      context: error.context,
      timestamp: new Date().toISOString()
    },
    severity: 'error'
  })

  // Só envia email para erros críticos
  if (error.context?.includes('CRITICAL')) {
    await sendEmail(env, {
      to: ADMIN_EMAILS,
      subject: `[investigaree] ⚠️ ERRO CRÍTICO: ${error.message.slice(0, 50)}`,
      html: `
        <h2>Erro Crítico no Sistema</h2>
        <p><strong>Mensagem:</strong> ${error.message}</p>
        <p><strong>Contexto:</strong> ${error.context || 'N/A'}</p>
        <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error.stack || 'N/A'}</pre>
        <p><small>Timestamp: ${new Date().toISOString()}</small></p>
      `
    })
  }
}
