import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/alerts/[alertId]/read
 * Marca um alerta como lido
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { alertId } = await params;

    if (!alertId) {
      return NextResponse.json(
        { error: 'alertId é obrigatório' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';

    try {
      const response = await fetch(`${apiUrl}/admin/alerts/${alertId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: errorData.error || 'Erro ao marcar alerta como lido' },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (fetchError) {
      console.log('[Admin API] Backend não disponível, simulando marcação de alerta');

      return NextResponse.json({
        success: true
      });
    }

  } catch (error) {
    console.error('[API] Erro ao marcar alerta como lido:', error);
    return NextResponse.json(
      { error: 'Erro ao marcar alerta como lido' },
      { status: 500 }
    );
  }
}
