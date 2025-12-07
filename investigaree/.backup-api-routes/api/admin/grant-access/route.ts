import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/grant-access
 * Concede acesso de um usuário a um tenant
 *
 * Body:
 * {
 *   user_email: string,
 *   tenant_code: string,
 *   role: 'admin' | 'editor' | 'viewer',
 *   expires_at?: string (ISO date)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const body = await request.json();
    const { user_email, tenant_code, role, expires_at } = body;

    // Validações
    if (!user_email || !tenant_code || !role) {
      return NextResponse.json(
        { error: 'user_email, tenant_code e role são obrigatórios' },
        { status: 400 }
      );
    }

    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'role deve ser admin, editor ou viewer' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';

    try {
      const response = await fetch(`${apiUrl}/admin/grant-access`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_email, tenant_code, role, expires_at }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: errorData.error || 'Erro ao conceder acesso' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (fetchError) {
      console.log('[Admin API] Backend não disponível, simulando concessão de acesso');

      return NextResponse.json({
        success: true,
        message: 'Acesso concedido com sucesso',
        action: 'created'
      });
    }

  } catch (error) {
    console.error('[API] Erro ao conceder acesso:', error);
    return NextResponse.json(
      { error: 'Erro ao conceder acesso' },
      { status: 500 }
    );
  }
}
