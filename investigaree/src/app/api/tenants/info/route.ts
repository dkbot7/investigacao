import { NextRequest, NextResponse } from 'next/server'

/**
 * Decodifica JWT Firebase (apenas payload, sem validação de assinatura)
 * ATENÇÃO: Isso é INSEGURO! Apenas para desenvolvimento local.
 */
function decodeFirebaseToken(token: string): { email?: string } {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return {}
    const payload = parts[1]
    const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8')
    return JSON.parse(decodedPayload)
  } catch (error) {
    return {}
  }
}

/**
 * GET /api/tenants/info
 * Retorna informações do tenant do usuário
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

    // Extrair e decodificar token
    const token = authHeader.replace('Bearer ', '')
    const decoded = decodeFirebaseToken(token)
    const userEmail = decoded.email || 'unknown@example.com'

    // Verificar se usuário é do tenant COMURG
    const isCOMURG = userEmail === 'cliente01@investigaree.com.br'

    // Mock de dados para desenvolvimento local
    const tenantInfo = {
      hasAccess: isCOMURG,
      ...(isCOMURG && {
        tenant: {
          id: "comurg-tenant-id",
          code: "COMURG",
          name: "COMURG - Companhia Urbanizadora da Região do Goiânia",
          email: "contato@comurg.go.gov.br"
        },
        tenants: [
          {
            id: "comurg-tenant-id",
            code: "COMURG",
            name: "COMURG - Companhia Urbanizadora da Região do Goiânia",
            email: "contato@comurg.go.gov.br"
          }
        ]
      })
    }

    return NextResponse.json(tenantInfo)
  } catch (error: any) {
    console.error('[API /tenants/info] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar informações do tenant', message: error.message },
      { status: 500 }
    )
  }
}
