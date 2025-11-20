/**
 * Payments API Routes
 * Integração com Stripe para pagamentos
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createPaymentSchema = z.object({
  produto: z.enum(['relatorio-startup', 'assinatura-pro', 'assinatura-enterprise']),
  startup_nome: z.string().optional(),
  startup_cnpj: z.string().optional(),
  amount: z.number().positive().optional(), // Será calculado se não fornecido
})

// Preços dos produtos (em centavos BRL)
const PRODUCT_PRICES: Record<string, number> = {
  'relatorio-startup': 1000000, // R$ 10.000,00
  'assinatura-pro': 250000, // R$ 2.500,00/mês
  'assinatura-enterprise': 500000, // R$ 5.000,00/mês
}

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/payments/create-intent
 * Criar intenção de pagamento (Stripe Payment Intent)
 */
app.post('/create-intent', async (c) => {
  try {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const validated = createPaymentSchema.parse(body)

    // Calcular amount baseado no produto
    const amount = validated.amount || PRODUCT_PRICES[validated.produto]

    if (!amount) {
      return c.json(
        {
          error: true,
          message: 'Produto inválido ou preço não definido',
        },
        400
      )
    }

    // Obter ou criar Stripe Customer
    const customerId = await getOrCreateStripeCustomer(userId, c.env)

    // Criar Payment Intent via Stripe API
    let paymentIntent

    if (c.env.STRIPE_SECRET_KEY && !c.env.STRIPE_SECRET_KEY.startsWith('sk_test_mock')) {
      // Integração real com Stripe
      const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: amount.toString(),
          currency: 'brl',
          customer: customerId,
          'automatic_payment_methods[enabled]': 'true',
          'metadata[user_id]': userId,
          'metadata[produto]': validated.produto,
          'metadata[startup_nome]': validated.startup_nome || '',
          'metadata[startup_cnpj]': validated.startup_cnpj || '',
          description: `Pagamento de ${validated.produto}`,
        }),
      })

      if (!stripeResponse.ok) {
        const error = await stripeResponse.json()
        console.error('[PAYMENTS] Stripe error:', error)
        throw new Error('Erro ao criar intenção de pagamento no Stripe')
      }

      paymentIntent = await stripeResponse.json()
    } else {
      // Mock response para desenvolvimento
      console.warn('[PAYMENTS] Stripe not configured, using mock payment intent')
      paymentIntent = {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret_mock`,
        amount: amount,
        currency: 'brl',
        customer: customerId,
        metadata: {
          user_id: userId,
          produto: validated.produto,
          startup_nome: validated.startup_nome || '',
          startup_cnpj: validated.startup_cnpj || '',
        },
      }
    }

    // Salvar payment como pendente
    await createPaymentRecord(
      {
        user_id: userId,
        stripe_payment_intent_id: paymentIntent.id,
        amount: amount / 100, // converter para reais
        currency: 'BRL',
        status: 'pending',
        produto: validated.produto,
        descricao: `Pagamento de ${validated.produto}`,
        metadata: paymentIntent.metadata,
      },
      c.env
    )

    return c.json({
      success: true,
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount: amount,
      currency: 'brl',
    })
  } catch (error) {
    console.error('[PAYMENTS] Error creating intent:', error)

    if (error instanceof z.ZodError) {
      return c.json(
        {
          error: true,
          message: 'Dados inválidos',
          details: error.errors,
        },
        400
      )
    }

    return c.json(
      {
        error: true,
        message: 'Erro ao criar intenção de pagamento',
      },
      500
    )
  }
})

/**
 * GET /api/payments
 * Listar pagamentos do usuário
 */
app.get('/', async (c) => {
  try {
    const userId = c.get('userId') as string

    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/payments?user_id=eq.${userId}&select=id,amount,currency,status,produto,created_at,paid_at&order=created_at.desc`,
      {
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar pagamentos')
    }

    const payments = await response.json()

    return c.json({
      payments,
      total: payments.length,
    })
  } catch (error) {
    console.error('[PAYMENTS] Error listing:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao listar pagamentos',
      },
      500
    )
  }
})

/**
 * GET /api/payments/:id
 * Obter detalhes de um pagamento
 */
app.get('/:id', async (c) => {
  try {
    const paymentId = c.req.param('id')
    const userId = c.get('userId') as string

    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/payments?id=eq.${paymentId}&user_id=eq.${userId}&select=*`,
      {
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar pagamento')
    }

    const payments = await response.json()
    const payment = payments[0]

    if (!payment) {
      return c.json(
        {
          error: true,
          message: 'Pagamento não encontrado',
        },
        404
      )
    }

    return c.json(payment)
  } catch (error) {
    console.error('[PAYMENTS] Error fetching:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao buscar pagamento',
      },
      500
    )
  }
})

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obter ou criar Stripe Customer
 * Implementação real com Stripe API
 */
async function getOrCreateStripeCustomer(userId: string, env: Env): Promise<string> {
  try {
    // Verificar se usuário já tem customer_id
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=stripe_customer_id,email,nome_completo`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    const users = await response.json()
    const user = users[0]

    if (user?.stripe_customer_id) {
      return user.stripe_customer_id
    }

    let customerId: string

    if (env.STRIPE_SECRET_KEY && !env.STRIPE_SECRET_KEY.startsWith('sk_test_mock')) {
      // Criar customer no Stripe (integração real)
      const customerResponse = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: user.email || '',
          name: user.nome_completo || '',
          'metadata[user_id]': userId,
        }),
      })

      if (!customerResponse.ok) {
        const error = await customerResponse.json()
        console.error('[PAYMENTS] Stripe customer creation error:', error)
        throw new Error('Erro ao criar customer no Stripe')
      }

      const customer = await customerResponse.json()
      customerId = customer.id
    } else {
      // Mock customer ID para desenvolvimento
      console.warn('[PAYMENTS] Stripe not configured, using mock customer ID')
      customerId = `cus_mock_${userId.substring(0, 8)}`
    }

    // Salvar customer_id no user
    await fetch(`${env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stripe_customer_id: customerId,
      }),
    })

    return customerId
  } catch (error) {
    console.error('[PAYMENTS] Error creating customer:', error)
    throw error
  }
}

/**
 * Criar registro de pagamento no banco
 */
async function createPaymentRecord(data: any, env: Env) {
  try {
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/payments`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Erro ao criar registro de pagamento')
    }

    const payments = await response.json()
    return payments[0]
  } catch (error) {
    console.error('[PAYMENTS] Error creating record:', error)
    throw error
  }
}

export default app
