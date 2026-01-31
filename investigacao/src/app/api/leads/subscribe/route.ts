export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br';

/**
 * POST /api/leads/subscribe
 * Registra lead de captura (blog, landing pages, etc)
 *
 * Este endpoint delega para o backend API worker que:
 * - Salva lead no D1 database (tabela leads)
 * - Envia email de boas-vindas via Resend
 * - Rastreia source, UTM params, etc
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação básica
    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    if (!body.source) {
      return NextResponse.json(
        { success: false, error: 'Source é obrigatório' },
        { status: 400 }
      );
    }

    // Extrair URL de origem e UTM params do request
    const referer = request.headers.get('referer') || '';
    const url = new URL(referer || request.url);

    const leadData = {
      email: body.email,
      name: body.name || null,
      source: body.source,
      resource: body.resource || null,
      resourceType: body.resourceType || null,
      source_url: referer || url.pathname,
      utm_source: url.searchParams.get('utm_source') || null,
      utm_medium: url.searchParams.get('utm_medium') || null,
      utm_campaign: url.searchParams.get('utm_campaign') || null,
    };

    logger.info('Processando lead', {
      email: body.email,
      source: body.source
    }, 'Leads');

    // Delegar para o backend API worker
    const response = await fetch(`${BACKEND_API_URL}/api/leads/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      logger.error('Erro ao processar lead no backend', undefined, {
        status: response.status,
        error: errorData
      }, 'Leads');

      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();

    logger.info('Lead processado com sucesso', {
      leadId: result.leadId,
      isNew: result.isNew
    }, 'Leads');

    return NextResponse.json(result);

  } catch (error: any) {
    logger.error('Erro ao processar lead', error instanceof Error ? error : undefined, {}, 'Leads');

    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar lead',
        message: error.message
      },
      { status: 500 }
    );
  }
}
