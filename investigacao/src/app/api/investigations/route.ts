export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server'

// Sempre usar Worker deployado na Cloudflare (banco de dados de produção)
const WORKER_URL = 'https://api.investigaree.com.br'

/**
 * Proxy para o Cloudflare Worker com D1
 * Repassa a requisição para o Worker que tem acesso ao banco de dados D1
 */
async function proxyToWorker(request: NextRequest, endpoint: string, options: RequestInit = {}) {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Token de autorização ausente' },
      { status: 401 }
    )
  }

  try {
    // Construir URL com query params se houver
    const url = new URL(request.url)
    const workerUrl = `${WORKER_URL}${endpoint}${url.search}`


    const response = await fetch(workerUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        ...options.headers,
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[API Proxy] Error:', error)
    return NextResponse.json(
      { error: 'Erro ao comunicar com o servidor', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/investigacoes
 * Lista investigações do usuário
 */
export async function GET(request: NextRequest) {
  return proxyToWorker(request, '/api/investigacoes', { method: 'GET' })
}

/**
 * POST /api/investigacoes
 * Cria uma nova investigação
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  return proxyToWorker(request, '/api/investigacoes', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
