/**
 * Chatbot API Routes
 * Integração com OpenAI Assistants para vendas
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

const messageSchema = z.object({
  lead_id: z.string().uuid().optional(),
  message: z.string().min(1).max(2000),
  thread_id: z.string().optional(),
})

/**
 * POST /api/chatbot/message
 * Enviar mensagem ao chatbot
 */
app.post('/message', async (c) => {
  try {
    const body = await c.req.json()
    const validated = messageSchema.parse(body)

    // TODO: Integração real com OpenAI Assistants API
    // const openai = new OpenAI({ apiKey: c.env.OPENAI_API_KEY })
    // const thread = validated.thread_id
    //   ? await openai.beta.threads.retrieve(validated.thread_id)
    //   : await openai.beta.threads.create()

    // PLACEHOLDER: Resposta mock
    const response = {
      message: `Olá! Sou o assistente da investigaree. Entendi sua mensagem: "${validated.message}". Como posso ajudar com due diligence?`,
      thread_id: validated.thread_id || `thread_mock_${Date.now()}`,
      intencao_detectada: 'interesse',
      lead_score: 65,
    }

    // Salvar mensagem no banco
    if (validated.lead_id) {
      await saveConversationMessage(
        validated.lead_id,
        validated.message,
        response.message,
        response.thread_id,
        c.env
      )
    }

    return c.json(response)
  } catch (error) {
    console.error('[CHATBOT] Error:', error)
    if (error instanceof z.ZodError) {
      return c.json({ error: true, message: 'Dados inválidos', details: error.errors }, 400)
    }
    return c.json({ error: true, message: 'Erro ao processar mensagem' }, 500)
  }
})

async function saveConversationMessage(
  leadId: string,
  userMessage: string,
  botMessage: string,
  threadId: string,
  env: Env
) {
  try {
    // Buscar ou criar conversa
    let conversation = await getConversationByThread(threadId, env)

    if (!conversation) {
      // Criar nova conversa
      const response = await fetch(`${env.SUPABASE_URL}/rest/v1/chatbot_conversations`, {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          lead_id: leadId,
          openai_thread_id: threadId,
          messages: [],
        }),
      })

      const conversations = await response.json()
      conversation = conversations[0]
    }

    // Adicionar mensagens
    const messages = [
      ...(conversation.messages || []),
      { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
      { role: 'assistant', content: botMessage, timestamp: new Date().toISOString() },
    ]

    await fetch(
      `${env.SUPABASE_URL}/rest/v1/chatbot_conversations?id=eq.${conversation.id}`,
      {
        method: 'PATCH',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          message_count: messages.length,
          ultima_mensagem_em: new Date().toISOString(),
        }),
      }
    )
  } catch (error) {
    console.error('[CHATBOT] Error saving conversation:', error)
  }
}

async function getConversationByThread(threadId: string, env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/chatbot_conversations?openai_thread_id=eq.${threadId}&select=*`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )

  const conversations = await response.json()
  return conversations[0] || null
}

export default app
