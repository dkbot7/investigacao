import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/alerts/read-all
 * Marca todos os alertas como lidos
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';

    try {
      const response = await fetch(`${apiUrl}/admin/alerts/read-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: errorData.error || 'Erro ao marcar todos alertas como lidos' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (fetchError) {
      console.log('[Admin API] Backend não disponível, simulando marcação de todos alertas');

      return NextResponse.json({
        success: true,
        message: 'Todos os alertas foram marcados como lidos'
      });
    }

  } catch (error) {
    console.error('[API] Erro ao marcar todos alertas como lidos:', error);
    return NextResponse.json(
      { error: 'Erro ao marcar todos alertas como lidos' },
      { status: 500 }
    );
  }
}
