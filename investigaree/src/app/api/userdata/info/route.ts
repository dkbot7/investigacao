import { NextRequest, NextResponse } from 'next/server'

/**
 * Decodifica JWT Firebase (apenas payload, sem validação de assinatura)
 * ATENÇÃO: Isso é INSEGURO! Apenas para desenvolvimento local.
 * Em produção, usar Firebase Admin SDK para validar o token.
 */
function decodeFirebaseToken(token: string): { email?: string } {
  try {
    // JWT tem 3 partes separadas por ponto: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      return {}
    }

    // Decodificar payload (segunda parte)
    const payload = parts[1]
    const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8')
    return JSON.parse(decodedPayload)
  } catch (error) {
    console.error('[decodeFirebaseToken] Erro ao decodificar:', error)
    return {}
  }
}

/**
 * GET /api/userdata/info
 * Retorna informações do usuário incluindo tenant
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

    // Extrair token
    const token = authHeader.replace('Bearer ', '')

    // Decodificar token para pegar email
    const decoded = decodeFirebaseToken(token)
    const userEmail = decoded.email || 'unknown@example.com'

    console.log('[API /userdata/info] Email do usuário:', userEmail)

    // Verificar se usuário é do tenant COMURG
    const isCOMURG = userEmail === 'cliente01@investigaree.com.br'

    // Mock de dados para desenvolvimento local
    const userInfo = {
      hasAccess: true,
      user: {
        id: userEmail.split('@')[0] + '-id',
        email: userEmail,
      },
      // Só adiciona tenant se for COMURG
      ...(isCOMURG && {
        tenant: {
          id: "comurg-tenant-id",
          code: "COMURG",
          name: "COMURG - Companhia Urbanizadora da Região do Goiânia",
          email: "contato@comurg.go.gov.br"
        }
      }),
      settings: {
        plano: isCOMURG ? "enterprise" : "free",
        limite_funcionarios: isCOMURG ? 10000 : 100,
        empresa_nome: isCOMURG ? "COMURG" : undefined
      },
      stats: {
        total_funcionarios: isCOMURG ? 1250 : 0
      }
    }

    return NextResponse.json(userInfo)
  } catch (error: any) {
    console.error('[API /userdata/info] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar informações do usuário', message: error.message },
      { status: 500 }
    )
  }
}
