export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';

/**
 * GET /api/lgpd/stats
 * Retorna estatísticas de compliance LGPD do backend
 *
 * Este endpoint delega para o backend API worker que:
 * - Valida JWT Firebase
 * - Busca dados do D1 (consentimentos, solicitações)
 * - Retorna stats agregadas (consentimentos, solicitações acesso/exclusão/portabilidade)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorização ausente' },
        { status: 401 }
      );
    }

    logger.info('Buscando LGPD stats do backend', {}, 'LGPD API');

    // Delegar para o backend API worker
    const response = await fetch(`${BACKEND_API_URL}/api/lgpd/stats`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Sempre buscar dados frescos
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      logger.error('Erro ao buscar LGPD stats do backend', undefined, {
        status: response.status,
        error: errorData
      }, 'LGPD API');

      return NextResponse.json(errorData, { status: response.status });
    }

    const stats = await response.json();

    logger.info('LGPD stats retornadas com sucesso', {
      totalConsentimentos: stats.totalConsentimentos,
      totalSolicitacoes: stats.totalSolicitacoes
    }, 'LGPD API');

    return NextResponse.json(stats);

  } catch (error: any) {
    logger.error('Erro ao buscar LGPD stats', error instanceof Error ? error : undefined, {}, 'LGPD API');

    return NextResponse.json(
      {
        error: 'Erro ao buscar estatísticas LGPD',
        message: error.message
      },
      { status: 500 }
    );
  }
}
