/**
 * Webhooks API Routes
 * Recebe eventos de serviços externos (Stripe principalmente)
 */

import { Hono } from 'hono'
import { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

/**
 * POST /api/webhooks/stripe
 * Webhook do Stripe para eventos de pagamento
 */
app.post('/stripe', async (c) => {
  try {
    const signature = c.req.header('stripe-signature')
    const body = await c.req.text()

    if (!signature) {
      return c.json({ error: 'Missing signature' }, 400)
    }

    let event

    if (c.env.STRIPE_WEBHOOK_SECRET && c.env.STRIPE_SECRET_KEY) {
      // Validar signature do Stripe (implementação manual para Workers)
      try {
        event = await verifyStripeWebhook(body, signature, c.env.STRIPE_WEBHOOK_SECRET)
      } catch (err) {
        console.error('[WEBHOOK] Signature verification failed:', err)
        return c.json({ error: 'Invalid signature' }, 400)
      }
    } else {
      // Desenvolvimento: aceitar sem validação
      console.warn('[WEBHOOK] Stripe webhook secret not configured, skipping validation')
      event = JSON.parse(body)
    }

    // Processar evento
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object, c.env)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object, c.env)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, c.env)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object, c.env)
        break

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`)
    }

    return c.json({ received: true })
  } catch (error) {
    console.error('[WEBHOOK] Error:', error)
    return c.json({ error: 'Webhook error' }, 400)
  }
})

// Handlers para cada tipo de evento
async function handlePaymentSucceeded(paymentIntent: any, env: Env) {
  console.log('[WEBHOOK] Payment succeeded:', paymentIntent.id)

  // Atualizar status do pagamento
  await fetch(
    `${env.SUPABASE_URL}/rest/v1/payments?stripe_payment_intent_id=eq.${paymentIntent.id}`,
    {
      method: 'PATCH',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'succeeded',
        paid_at: new Date().toISOString(),
      }),
    }
  )

  // TODO: Trigger geração de relatório
  // TODO: Enviar email de confirmação
}

async function handlePaymentFailed(paymentIntent: any, env: Env) {
  console.log('[WEBHOOK] Payment failed:', paymentIntent.id)

  await fetch(
    `${env.SUPABASE_URL}/rest/v1/payments?stripe_payment_intent_id=eq.${paymentIntent.id}`,
    {
      method: 'PATCH',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'failed',
      }),
    }
  )

  // TODO: Notificar usuário sobre falha
}

async function handleSubscriptionUpdated(subscription: any, env: Env) {
  console.log('[WEBHOOK] Subscription updated:', subscription.id)
  // TODO: Atualizar status da assinatura do usuário
}

async function handleSubscriptionCancelled(subscription: any, env: Env) {
  console.log('[WEBHOOK] Subscription cancelled:', subscription.id)
  // TODO: Cancelar acesso do usuário
}

/**
 * Verificar signature do webhook do Stripe
 * Implementação baseada em HMAC-SHA256
 */
async function verifyStripeWebhook(
  payload: string,
  signature: string,
  secret: string
): Promise<any> {
  try {
    // Parse signature header (formato: t=timestamp,v1=signature)
    const signatureParts: Record<string, string> = {}
    signature.split(',').forEach((part) => {
      const [key, value] = part.split('=')
      signatureParts[key] = value
    })

    const timestamp = signatureParts['t']
    const signatureValue = signatureParts['v1']

    if (!timestamp || !signatureValue) {
      throw new Error('Invalid signature format')
    }

    // Verificar timestamp (5 minutos de tolerância)
    const timestampMs = parseInt(timestamp) * 1000
    const now = Date.now()
    const tolerance = 5 * 60 * 1000 // 5 minutos

    if (Math.abs(now - timestampMs) > tolerance) {
      throw new Error('Timestamp outside tolerance')
    }

    // Criar string assinada
    const signedPayload = `${timestamp}.${payload}`

    // Calcular HMAC-SHA256
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signatureBytes = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(signedPayload)
    )

    // Converter para hex
    const computedSignature = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // Comparar signatures de forma segura (timing-safe)
    if (computedSignature !== signatureValue) {
      throw new Error('Signature mismatch')
    }

    // Parse e retornar evento
    return JSON.parse(payload)
  } catch (error) {
    console.error('[WEBHOOK] Signature verification error:', error)
    throw error
  }
}

export default app
