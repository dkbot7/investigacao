export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server'

// Sempre usar Worker deployado na Cloudflare (banco de dados de produção)
const WORKER_URL = 'https://api.investigaree.com.br'

/**
 * GET /api/investigacoes/stats
 * Retorna estatísticas das investigações (proxy para Worker com D1)
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Token de autorização ausente' },
      { status: 401 }
    )
  }

  try {
    const workerUrl = `${WORKER_URL}/api/investigacoes/stats`


    const response = await fetch(workerUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[API Proxy Stats] Error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas', message: error.message },
      { status: 500 }
    )
  }
}
