import { NextRequest, NextResponse } from 'next/server'

/**
 * Decodifica JWT Firebase (apenas payload, sem validação de assinatura)
 * ATENÇÃO: Isso é INSEGURO! Apenas para desenvolvimento local.
 * TODO: Implementar validação real do token Firebase no backend
 */
function decodeFirebaseToken(token: string): { email?: string; uid?: string } {
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
 *
 * TODO: Substituir mock por consulta real ao D1 database
 * TODO: Implementar validação JWT com Firebase Admin SDK
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

    // TODO: Buscar tenant do usuário no D1 database
    // const user = await db.prepare('SELECT tenant_id FROM users WHERE email = ?').bind(userEmail).first()
    // const tenant = await db.prepare('SELECT * FROM tenants WHERE id = ?').bind(user.tenant_id).first()

    // Mock de dados para desenvolvimento local
    // Em produção, isso deve vir do banco de dados
    const tenantInfo = {
      hasAccess: true, // TODO: Verificar no banco se usuário tem acesso
      tenant: {
        id: "default-tenant-id",
        code: "CLIENTE_01",
        name: "Cliente Padrão",
        email: userEmail,
        status: "active"
      },
      tenants: [
        {
          id: "default-tenant-id",
          code: "CLIENTE_01",
          name: "Cliente Padrão",
          email: userEmail
        }
      ]
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
