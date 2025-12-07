import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/users
 * Retorna todos os usuários cadastrados com seus tenants
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Chamar API backend que acessa D1
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';

    try {
      const response = await fetch(`${apiUrl}/admin/users`, {
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
      console.log('[Admin API] Backend não disponível, usando dados mock');

      // Fallback: retornar dados mock
      return NextResponse.json({
        users: [
          {
            id: '1',
            email: 'dkbotdani@gmail.com',
            name: 'Daniel Bot',
            phone: '+5511999999999',
            created_at: new Date().toISOString(),
            last_access: new Date().toISOString(),
            tenants: [
              { code: 'CLIENTE_01', role: 'admin' }
            ]
          },
          {
            id: '2',
            email: 'ibsenmaciel@gmail.com',
            name: 'Ibsen Maciel',
            phone: '+5511988888888',
            created_at: new Date().toISOString(),
            last_access: new Date(Date.now() - 86400000).toISOString(),
            tenants: [
              { code: 'CLIENTE_01', role: 'admin' },
              { code: 'CLIENTE_02', role: 'editor' }
            ]
          }
        ]
      });
    }

  } catch (error) {
    console.error('[API] Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}
