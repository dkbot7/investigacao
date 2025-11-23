/**
 * Email Service (Gmail API)
 * Envio de emails transacionais e marketing
 */

import { Env } from '../index'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: string // base64
    contentType: string
  }>
}

/**
 * Enviar email via Gmail API
 * PLACEHOLDER: Implementar integração real
 *
 * @param options - Opções do email
 * @param env - Environment variables
 * @returns Success status
 *
 * Docs: https://developers.google.com/gmail/api/guides/sending
 * Custo: Gratuito (Gmail API tem limite de 10.000 emails/dia por projeto)
 *
 * Alternativas:
 * - SendGrid: $19.95/mês (50k emails)
 * - Mailgun: $15/mês (50k emails)
 * - AWS SES: $0.10/1000 emails
 */
export async function sendEmail(
  options: EmailOptions,
  env: Env
): Promise<boolean> {
  try {
    // TODO: Implementar integração real com Gmail API
    /*
    // 1. Obter access token via OAuth2 ou Service Account
    const accessToken = await getGmailAccessToken(env)

    // 2. Criar mensagem no formato RFC 2822
    const message = createEmailMessage(options)

    // 3. Enviar via Gmail API
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: btoa(message).replace(/\+/g, '-').replace(/\//g, '_'),
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('[EMAIL] Gmail API Error:', error)
      return false
    }

    return true
    */

    // PLACEHOLDER: Log email em vez de enviar
    console.log('[EMAIL] PLACEHOLDER - Sending email:', {
      to: options.to,
      subject: options.subject,
      from: options.from || 'noreply@investigaree.com.br',
    })

    return true
  } catch (error) {
    console.error('[EMAIL] Error:', error)
    return false
  }
}

/**
 * Templates de email
 */

export function getWelcomeEmailTemplate(userName: string): {
  subject: string
  html: string
  text: string
} {
  return {
    subject: 'Bem-vindo à investigaree!',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0A4D8C 0%, #052340 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">investigaree</h1>
        </div>

        <div style="padding: 40px; background: #ffffff;">
          <h2 style="color: #052340; margin-top: 0;">Olá, ${userName}!</h2>

          <p style="color: #333; line-height: 1.6;">
            É um prazer tê-lo conosco. A investigaree é sua plataforma de investigação digital
            e due diligence para investimentos inteligentes.
          </p>

          <h3 style="color: #0A4D8C;">Próximos passos:</h3>
          <ul style="color: #333; line-height: 1.8;">
            <li>Complete seu perfil de investidor</li>
            <li>Solicite seu primeiro relatório de due diligence</li>
            <li>Explore nosso dashboard de análises</li>
          </ul>

          <a href="https://investigaree.com.br/dashboard"
             style="display: inline-block; background: #0A4D8C; color: white;
                    padding: 12px 30px; text-decoration: none; border-radius: 6px;
                    margin-top: 20px;">
            Acessar Dashboard
          </a>
        </div>

        <div style="padding: 20px; background: #f5f5f5; text-align: center; color: #666; font-size: 12px;">
          <p>investigaree - Investigação Digital e Forensics</p>
          <p>contato@investigaree.com.br</p>
        </div>
      </div>
    `,
    text: `Olá, ${userName}!\n\nÉ um prazer tê-lo conosco. A investigaree é sua plataforma de investigação digital e due diligence para investimentos inteligentes.\n\nPróximos passos:\n- Complete seu perfil de investidor\n- Solicite seu primeiro relatório de due diligence\n- Explore nosso dashboard de análises\n\nAcesse: https://investigaree.com.br/dashboard`,
  }
}

export function getReportReadyEmailTemplate(
  userName: string,
  companyName: string,
  reportId: string,
  downloadUrl: string
): {
  subject: string
  html: string
  text: string
} {
  return {
    subject: `Relatório de Due Diligence - ${companyName}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0A4D8C 0%, #052340 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Relatório Pronto</h1>
        </div>

        <div style="padding: 40px; background: #ffffff;">
          <h2 style="color: #052340; margin-top: 0;">Olá, ${userName}!</h2>

          <p style="color: #333; line-height: 1.6;">
            Seu relatório de due diligence da empresa <strong>${companyName}</strong>
            está pronto para download.
          </p>

          <div style="background: #f0f8ff; border-left: 4px solid #0A4D8C; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #333;">
              <strong>ID do Relatório:</strong> ${reportId}
            </p>
          </div>

          <a href="${downloadUrl}"
             style="display: inline-block; background: #0A4D8C; color: white;
                    padding: 12px 30px; text-decoration: none; border-radius: 6px;
                    margin-top: 20px;">
            Download do Relatório (PDF)
          </a>

          <p style="color: #666; font-size: 13px; margin-top: 30px;">
            Este link é válido por 7 dias. Após esse período, você pode gerar um novo
            link no dashboard.
          </p>
        </div>

        <div style="padding: 20px; background: #f5f5f5; text-align: center; color: #666; font-size: 12px;">
          <p>investigaree - Investigação Digital e Forensics</p>
        </div>
      </div>
    `,
    text: `Olá, ${userName}!\n\nSeu relatório de due diligence da empresa ${companyName} está pronto.\n\nID: ${reportId}\nDownload: ${downloadUrl}\n\nEste link é válido por 7 dias.`,
  }
}

export function getPaymentConfirmationEmailTemplate(
  userName: string,
  amount: number,
  productName: string,
  invoiceUrl?: string
): {
  subject: string
  html: string
  text: string
} {
  return {
    subject: 'Pagamento Confirmado - investigaree',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0A4D8C 0%, #052340 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Pagamento Confirmado</h1>
        </div>

        <div style="padding: 40px; background: #ffffff;">
          <h2 style="color: #052340; margin-top: 0;">Obrigado, ${userName}!</h2>

          <p style="color: #333; line-height: 1.6;">
            Seu pagamento foi confirmado com sucesso.
          </p>

          <div style="background: #f0f8ff; border: 2px solid #0A4D8C; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; color: #333;">
              <tr>
                <td><strong>Produto:</strong></td>
                <td style="text-align: right;">${productName}</td>
              </tr>
              <tr>
                <td style="padding-top: 10px;"><strong>Valor:</strong></td>
                <td style="text-align: right; padding-top: 10px;">R$ ${(amount / 100).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          ${invoiceUrl ? `<a href="${invoiceUrl}" style="display: inline-block; color: #0A4D8C; text-decoration: none; margin-top: 10px;">Ver Nota Fiscal</a>` : ''}

          <p style="color: #666; margin-top: 30px;">
            Você receberá um email separado assim que seu relatório estiver pronto
            (prazo: até 72 horas).
          </p>
        </div>

        <div style="padding: 20px; background: #f5f5f5; text-align: center; color: #666; font-size: 12px;">
          <p>investigaree - Investigação Digital e Forensics</p>
        </div>
      </div>
    `,
    text: `Obrigado, ${userName}!\n\nSeu pagamento foi confirmado.\n\nProduto: ${productName}\nValor: R$ ${(amount / 100).toFixed(2)}\n\nVocê receberá um email quando o relatório estiver pronto (até 72h).`,
  }
}

export function getLGPDDataExportEmailTemplate(
  userName: string,
  downloadUrl: string
): {
  subject: string
  html: string
  text: string
} {
  return {
    subject: 'Seus Dados Pessoais - investigaree (LGPD)',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0A4D8C 0%, #052340 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Exportação de Dados</h1>
        </div>

        <div style="padding: 40px; background: #ffffff;">
          <h2 style="color: #052340; margin-top: 0;">Olá, ${userName}!</h2>

          <p style="color: #333; line-height: 1.6;">
            Conforme solicitado, preparamos uma exportação completa de todos os seus
            dados armazenados em nossa plataforma, de acordo com a Lei Geral de
            Proteção de Dados (LGPD).
          </p>

          <a href="${downloadUrl}"
             style="display: inline-block; background: #0A4D8C; color: white;
                    padding: 12px 30px; text-decoration: none; border-radius: 6px;
                    margin: 20px 0;">
            Download dos Seus Dados (JSON)
          </a>

          <p style="color: #666; font-size: 13px;">
            Este link é válido por 48 horas. Os dados estão em formato JSON estruturado.
          </p>

          <p style="color: #666; font-size: 13px; margin-top: 20px;">
            Caso tenha dúvidas sobre seus direitos ou sobre os dados exportados,
            entre em contato conosco.
          </p>
        </div>

        <div style="padding: 20px; background: #f5f5f5; text-align: center; color: #666; font-size: 12px;">
          <p>investigaree - Investigação Digital e Forensics</p>
          <p>DPO: dpo@investigaree.com.br</p>
        </div>
      </div>
    `,
    text: `Olá, ${userName}!\n\nSeus dados estão prontos para download: ${downloadUrl}\n\nEste link é válido por 48 horas.\n\nDúvidas? Entre em contato: dpo@investigaree.com.br`,
  }
}

/**
 * Funções auxiliares para envio de emails específicos
 */

export async function sendWelcomeEmail(
  userEmail: string,
  userName: string,
  env: Env
): Promise<boolean> {
  const template = getWelcomeEmailTemplate(userName)
  return sendEmail(
    {
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    },
    env
  )
}

export async function sendReportReadyEmail(
  userEmail: string,
  userName: string,
  companyName: string,
  reportId: string,
  downloadUrl: string,
  env: Env
): Promise<boolean> {
  const template = getReportReadyEmailTemplate(userName, companyName, reportId, downloadUrl)
  return sendEmail(
    {
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    },
    env
  )
}

export async function sendPaymentConfirmationEmail(
  userEmail: string,
  userName: string,
  amount: number,
  productName: string,
  env: Env
): Promise<boolean> {
  const template = getPaymentConfirmationEmailTemplate(userName, amount, productName)
  return sendEmail(
    {
      to: userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    },
    env
  )
}
