import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br'

/**
 * GET /api/tenants/info
 * Retorna informações do tenant do usuário
 *
 * Este endpoint agora delega para o backend API worker que tem:
 * - Validação completa de assinatura JWT
 * - Acesso ao D1 database
 * - Auto-provisioning de usuários
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorização ausente' },
        { status: 401 }
      )
    }

    // Delegar para o backend API worker
    const response = await fetch(`${BACKEND_API_URL}/api/user/tenant-info`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
      return NextResponse.json(errorData, { status: response.status })
    }

    const tenantInfo = await response.json()

    return NextResponse.json(tenantInfo)
  } catch (error: any) {
    console.error('[API /tenants/info] Erro ao buscar do backend:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar informações do tenant', message: error.message },
      { status: 500 }
    )
  }
}
