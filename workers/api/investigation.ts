/**
 * Investigation Request API
 * Handles sending investigation requests via email
 */

import { Hono } from 'hono'
import { z } from 'zod'
import type { Env } from '../index'

const investigationRoutes = new Hono<{ Bindings: Env }>()

// Validation schema
const investigationRequestSchema = z.object({
  userEmail: z.string().email('Email inválido'),
  subject: z.string().min(1, 'Assunto é obrigatório').max(200),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').max(5000),
})

// POST /api/investigation/request
investigationRoutes.post('/request', async (c) => {
  try {
    const body = await c.req.json()

    // Validate input
    const validationResult = investigationRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return c.json(
        {
          error: 'Dados inválidos',
          details: validationResult.error.errors
        },
        400
      )
    }

    const { userEmail, subject, description } = validationResult.data

    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    })

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0A1628 0%, #1a2744 100%); padding: 30px; border-radius: 12px;">
          <h1 style="color: #C7A76B; margin: 0 0 20px 0; font-size: 24px;">
            Nova Solicitação de Investigação
          </h1>

          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #9FB3C8; margin: 0 0 10px 0; font-size: 14px;">
              <strong style="color: #C7A76B;">Cliente:</strong> ${userEmail}
            </p>
            <p style="color: #9FB3C8; margin: 0 0 10px 0; font-size: 14px;">
              <strong style="color: #C7A76B;">Data/Hora:</strong> ${timestamp}
            </p>
          </div>

          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #C7A76B; margin: 0 0 10px 0; font-size: 18px;">
              Assunto
            </h2>
            <p style="color: #ffffff; margin: 0; font-size: 16px;">
              ${subject}
            </p>
          </div>

          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
            <h2 style="color: #C7A76B; margin: 0 0 10px 0; font-size: 18px;">
              Descrição da Investigação
            </h2>
            <p style="color: #ffffff; margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
              ${description}
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #9FB3C8; margin: 0; font-size: 12px; text-align: center;">
              Este email foi enviado automaticamente pelo sistema investigaree
            </p>
          </div>
        </div>
      </div>
    `

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'investigaree <noreply@investigaree.com.br>',
        to: ['investigaree@gmail.com', 'ibsenmaciel@gmail.com'],
        reply_to: userEmail,
        subject: `Nova Solicitação: ${subject}`,
        html: emailHtml,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error('Resend API error:', errorData)
      return c.json(
        { error: 'Erro ao enviar email' },
        500
      )
    }

    const responseData = await resendResponse.json()
    console.log('Email enviado com sucesso:', responseData)

    return c.json({
      success: true,
      message: 'Solicitação enviada com sucesso',
    })
  } catch (error) {
    console.error('Erro na API investigation/request:', error)
    return c.json(
      { error: 'Erro interno do servidor' },
      500
    )
  }
})

export default investigationRoutes
