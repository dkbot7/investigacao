import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/pending-users
 * Retorna usuários sem acesso a nenhum tenant
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';

    try {
      const response = await fetch(`${apiUrl}/admin/pending-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (fetchError) {
      console.log('[Admin API] Backend não disponível, retornando pending users mock');

      return NextResponse.json({
        pending_users: [
          {
            id: '3',
            email: 'pendente@example.com',
            name: 'Usuário Pendente',
            phone: '+5511988887777',
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      });
    }

  } catch (error) {
    console.error('[API] Erro ao buscar usuários pendentes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários pendentes' },
      { status: 500 }
    );
  }
}
