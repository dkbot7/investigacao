/**
 * Leads Handler - Backend API Worker
 *
 * Gerencia captura de leads do blog e landing pages:
 * - Salva lead no D1 (tabela leads)
 * - Envia email de boas-vindas via Resend
 * - Opcionalmente adiciona a lista de email marketing
 */

import { Env } from '../types';
import { logger } from '../logger';

interface LeadSubscribeRequest {
  email: string;
  name?: string;
  source: string;
  resource?: string;
  resourceType?: string;
  source_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

/**
 * POST /api/leads/subscribe
 * Registra novo lead e envia email de boas-vindas
 */
export async function handleLeadSubscribe(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body: LeadSubscribeRequest = await request.json();

    // Validação
    if (!body.email || !body.email.includes('@')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!body.source) {
      return new Response(
        JSON.stringify({ success: false, error: 'Source é obrigatório' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const leadId = crypto.randomUUID();
    const now = new Date().toISOString();

    // 1. Verificar se lead já existe
    const existingLead = await env.DB.prepare(
      'SELECT id, email, subscribed FROM leads WHERE email = ?'
    ).bind(body.email).first();

    if (existingLead) {
      // Lead já existe - apenas atualizar
      await env.DB.prepare(`
        UPDATE leads SET
          nome = COALESCE(?, nome),
          source = ?,
          source_url = ?,
          utm_source = ?,
          utm_medium = ?,
          utm_campaign = ?,
          subscribed = 1,
          updated_at = ?
        WHERE email = ?
      `).bind(
        body.name || null,
        body.source,
        body.source_url || null,
        body.utm_source || null,
        body.utm_medium || null,
        body.utm_campaign || null,
        now,
        body.email
      ).run();

      logger.info('Lead atualizado', { email: body.email, source: body.source }, 'Leads');

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Lead atualizado com sucesso',
          leadId: existingLead.id,
          isNew: false
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Salvar novo lead no D1
    await env.DB.prepare(`
      INSERT INTO leads (
        id, email, nome, source, source_url,
        utm_source, utm_medium, utm_campaign,
        status, subscribed, score, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      leadId,
      body.email,
      body.name || null,
      body.source,
      body.source_url || null,
      body.utm_source || null,
      body.utm_medium || null,
      body.utm_campaign || null,
      'novo', // status
      1, // subscribed
      0, // score inicial
      now,
      now
    ).run();

    logger.info('Novo lead cadastrado', {
      leadId,
      email: body.email,
      source: body.source
    }, 'Leads');

    // 3. Enviar email de boas-vindas via Resend
    try {
      await sendWelcomeEmail(env, body.email, body.name || 'Cliente');
    } catch (emailError) {
      // Log erro mas não falha a requisição
      logger.error('Erro ao enviar email de boas-vindas',
        emailError instanceof Error ? emailError : undefined,
        { email: body.email },
        'Leads'
      );
    }

    // 4. Retornar sucesso
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lead cadastrado com sucesso',
        leadId,
        isNew: true
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    logger.error('Erro ao processar lead',
      error instanceof Error ? error : undefined,
      {},
      'Leads'
    );

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro interno ao processar lead',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Envia email de boas-vindas via Resend
 */
async function sendWelcomeEmail(
  env: Env,
  email: string,
  name: string
): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Investigaree <contato@investigaree.com.br>',
      to: [email],
      subject: 'Bem-vindo à Investigaree - Material em Anexo',
      html: buildWelcomeEmailHTML(name),
      text: buildWelcomeEmailText(name)
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  logger.info('Email de boas-vindas enviado', {
    email,
    emailId: result.id
  }, 'Leads');
}

/**
 * Template HTML do email de boas-vindas
 */
function buildWelcomeEmailHTML(name: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo à Investigaree</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Investigaree</h1>
    <p style="color: #e0e7ff; margin: 10px 0 0 0;">Inteligência Investigativa de Ponta</p>
  </div>

  <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1e3a8a; margin-top: 0;">Olá, ${name}!</h2>

    <p style="font-size: 16px; color: #475569;">
      Obrigado por se interessar pelos nossos materiais. Nossa equipe entrará em contato em breve para:
    </p>

    <ul style="font-size: 15px; color: #64748b; line-height: 1.8;">
      <li>Enviar o material solicitado</li>
      <li>Conhecer suas necessidades específicas</li>
      <li>Apresentar como a Investigaree pode ajudar sua organização</li>
    </ul>

    <div style="background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 25px 0; border-radius: 4px;">
      <p style="margin: 0; color: #64748b; font-size: 14px;">
        <strong style="color: #1e3a8a;">💡 Dica:</strong>
        Enquanto isso, conheça mais sobre nossos serviços em
        <a href="https://investigaree.com.br/servicos" style="color: #3b82f6; text-decoration: none;">investigaree.com.br/servicos</a>
      </p>
    </div>

    <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">
      Atenciosamente,<br>
      <strong style="color: #475569;">Equipe Investigaree</strong>
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
    <p style="margin: 5px 0;">
      Investigaree - Inteligência Investigativa<br>
      <a href="https://investigaree.com.br" style="color: #3b82f6; text-decoration: none;">investigaree.com.br</a>
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * Template de texto puro do email
 */
function buildWelcomeEmailText(name: string): string {
  return `
Olá, ${name}!

Obrigado por se interessar pelos nossos materiais. Nossa equipe entrará em contato em breve para:

- Enviar o material solicitado
- Conhecer suas necessidades específicas
- Apresentar como a Investigaree pode ajudar sua organização

Enquanto isso, conheça mais sobre nossos serviços em https://investigaree.com.br/servicos

Atenciosamente,
Equipe Investigaree

---
Investigaree - Inteligência Investigativa
investigaree.com.br
  `;
}
