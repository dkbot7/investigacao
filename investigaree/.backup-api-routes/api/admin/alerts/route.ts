import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/alerts
 * Retorna alertas do sistema
 * Query params: show_read (boolean)
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

    const { searchParams } = new URL(request.url);
    const showRead = searchParams.get('show_read') === 'true';

    try {
      const response = await fetch(
        `${apiUrl}/admin/alerts?show_read=${showRead}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);

    } catch (fetchError) {
      console.log('[Admin API] Backend não disponível, retornando alerts mock');

      const alerts = [
        {
          id: '1',
          type: 'new_user',
          title: 'Novo usuário cadastrado',
          message: 'Um novo usuário se registrou e aguarda liberação de acesso.',
          data: { email: 'pendente@example.com' },
          severity: 'info',
          is_read: 0,
          read_by: null,
          read_at: null,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          type: 'tenant_created',
          title: 'Novo tenant criado',
          message: 'Tenant "CLIENTE_03" foi criado com sucesso.',
          data: { tenant_code: 'CLIENTE_03' },
          severity: 'success',
          is_read: 1,
          read_by: 'dkbotdani@gmail.com',
          read_at: new Date(Date.now() - 1800000).toISOString(),
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      const filteredAlerts = showRead ? alerts : alerts.filter(a => a.is_read === 0);
      const unreadCount = alerts.filter(a => a.is_read === 0).length;

      return NextResponse.json({
        alerts: filteredAlerts,
        unread_count: unreadCount
      });
    }

  } catch (error) {
    console.error('[API] Erro ao buscar alertas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar alertas' },
      { status: 500 }
    );
  }
}
