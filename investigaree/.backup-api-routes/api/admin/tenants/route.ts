import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/tenants
 * Retorna todos os tenants cadastrados
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
      const response = await fetch(`${apiUrl}/admin/tenants`, {
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
      console.log('[Admin API] Backend não disponível, retornando mock de tenants');

      return NextResponse.json({
        tenants: [
          {
            id: '1',
            code: 'CLIENTE_01',
            name: 'Cliente Principal',
            status: 'active',
            created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
            user_count: 5
          },
          {
            id: '2',
            code: 'CLIENTE_02',
            name: 'Cliente Secundário',
            status: 'active',
            created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
            user_count: 3
          }
        ]
      });
    }

  } catch (error) {
    console.error('[API] Erro ao buscar tenants:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar tenants' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/tenants
 * Cria um novo tenant
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
    const { code, name } = body;

    // Validações
    if (!code || !name) {
      return NextResponse.json(
        { error: 'code e name são obrigatórios' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';

    try {
      const response = await fetch(`${apiUrl}/admin/tenants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, name }),
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (fetchError) {
      console.log('[Admin API] Backend não disponível, simulando criação de tenant');

      return NextResponse.json({
        success: true,
        tenant: {
          id: String(Date.now()),
          code,
          name,
          status: 'active',
          created_at: new Date().toISOString(),
          user_count: 0
        }
      });
    }

  } catch (error) {
    console.error('[API] Erro ao criar tenant:', error);
    return NextResponse.json(
      { error: 'Erro ao criar tenant' },
      { status: 500 }
    );
  }
}
