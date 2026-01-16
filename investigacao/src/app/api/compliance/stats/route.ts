import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';

/**
 * GET /api/compliance/stats
 * Retorna estatísticas de compliance do backend
 *
 * Este endpoint delega para o backend API worker que:
 * - Valida JWT Firebase
 * - Busca dados do D1 com Row Level Security
 * - Retorna stats agregadas (PEP, CEIS, CNEP, OFAC, etc)
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

    logger.info('Buscando compliance stats do backend', {}, 'Compliance API');

    // Delegar para o backend API worker
    const response = await fetch(`${BACKEND_API_URL}/api/compliance/stats`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Sempre buscar dados frescos
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      logger.error('Erro ao buscar compliance stats do backend', undefined, {
        status: response.status,
        error: errorData
      }, 'Compliance API');

      return NextResponse.json(errorData, { status: response.status });
    }

    const stats = await response.json();

    logger.info('Compliance stats retornadas com sucesso', {
      totalAlertas: stats.totalAlertas
    }, 'Compliance API');

    return NextResponse.json(stats);

  } catch (error: any) {
    logger.error('Erro ao buscar compliance stats', error instanceof Error ? error : undefined, {}, 'Compliance API');

    return NextResponse.json(
      {
        error: 'Erro ao buscar estatísticas de compliance',
        message: error.message
      },
      { status: 500 }
    );
  }
}
