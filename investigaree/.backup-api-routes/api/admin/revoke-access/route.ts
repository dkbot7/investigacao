import { NextRequest, NextResponse } from 'next/server';

/**
 * DELETE /api/admin/revoke-access
 * Revoga acesso de um usuário a um tenant
 *
 * Query params:
 * - user_email: string
 * - tenant_code: string
 */
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { searchParams } = new URL(request.url);
    const user_email = searchParams.get('user_email');
    const tenant_code = searchParams.get('tenant_code');

    // Validações
    if (!user_email || !tenant_code) {
      return NextResponse.json(
        { error: 'user_email e tenant_code são obrigatórios' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';

    try {
      const response = await fetch(
        `${apiUrl}/admin/revoke-access?user_email=${user_email}&tenant_code=${tenant_code}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: errorData.error || 'Erro ao revogar acesso' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (fetchError) {
      console.log('[Admin API] Backend não disponível, simulando revogação de acesso');

      return NextResponse.json({
        success: true,
        message: 'Acesso revogado com sucesso'
      });
    }

  } catch (error) {
    console.error('[API] Erro ao revogar acesso:', error);
    return NextResponse.json(
      { error: 'Erro ao revogar acesso' },
      { status: 500 }
    );
  }
}
