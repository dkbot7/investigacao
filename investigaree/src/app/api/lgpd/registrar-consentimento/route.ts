import { NextRequest, NextResponse } from 'next/server';

/**
 * API Endpoint - Registro de Consentimento LGPD
 *
 * CONFORMIDADE:
 * - LGPD Art. 7º - Base legal para tratamento de dados
 * - LGPD Art. 37 - Controlador deve manter registro das operações
 * - LGPD Art. 8º - Consentimento deve ser fornecido por escrito ou meio que demonstre manifestação de vontade
 *
 * REGISTRO OBRIGATÓRIO:
 * - Timestamp do consentimento
 * - IP do titular (ou hash para privacidade)
 * - User-agent (navegador/dispositivo)
 * - Finalidades consentidas
 * - Versão do texto de consentimento
 *
 * RETENÇÃO:
 * - Mínimo: Durante vigência do tratamento
 * - Recomendado: 5 anos (Art. 16 - termo de tratamento)
 *
 * IMPLEMENTAÇÃO ATUAL:
 * - Console.log estruturado (MVP)
 * - TODO: Persistir em banco de dados (produção)
 */

interface ConsentRequest {
  consentimento: boolean;
  finalidades: string[];
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  granular?: boolean;
  versao_texto?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConsentRequest = await request.json();

    // Extrair dados da requisição
    const {
      consentimento,
      finalidades,
      timestamp,
      ip_address,
      user_agent,
      granular = false,
      versao_texto = '1.0.0', // Versão do texto do banner LGPD
    } = body;

    // Validação básica
    if (typeof consentimento !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Campo "consentimento" é obrigatório (boolean)' },
        { status: 400 }
      );
    }

    if (!Array.isArray(finalidades) || finalidades.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Campo "finalidades" é obrigatório (array não vazio)' },
        { status: 400 }
      );
    }

    // Extrair IP real (considerando proxies como Cloudflare)
    const clientIP =
      request.headers.get('cf-connecting-ip') || // Cloudflare
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      ip_address ||
      'unknown';

    // Extrair User-Agent real
    const clientUserAgent = request.headers.get('user-agent') || user_agent || 'unknown';

    // Registro estruturado para auditoria LGPD
    const consentLog = {
      timestamp: timestamp || new Date().toISOString(),
      consentimento,
      finalidades,
      ip_hash: hashIP(clientIP), // Hash do IP para privacidade
      user_agent: clientUserAgent,
      granular,
      versao_texto,
      source: 'consent_banner',
    };

    // Log em console (MVP - substituir por banco em produção)
    console.log('[LGPD Consent Registered]', JSON.stringify(consentLog, null, 2));

    // TODO (PRODUÇÃO): Persistir em banco de dados
    // Exemplo de estrutura SQL:
    /*
    INSERT INTO lgpd_consent_logs (
      timestamp,
      consentimento,
      finalidades,
      ip_hash,
      user_agent,
      granular,
      versao_texto
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    );
    */

    // Resposta de sucesso
    return NextResponse.json(
      {
        success: true,
        message: 'Consentimento registrado com sucesso',
        registro: {
          timestamp: consentLog.timestamp,
          finalidades: consentLog.finalidades,
          versao_texto: consentLog.versao_texto,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[LGPD Consent Error]', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno ao processar consentimento',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Hash simples de IP para privacidade
 * LGPD Art. 13 - Anonimização pode remover dados da LGPD
 *
 * Em produção, usar hash robusto (SHA-256 com salt)
 */
function hashIP(ip: string): string {
  if (ip === 'unknown') return 'unknown';

  // Hash simples para MVP (substituir por crypto em produção)
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `ip_${Math.abs(hash).toString(16)}`;
}

/**
 * Endpoint GET para verificar health
 */
export async function GET() {
  return NextResponse.json(
    {
      service: 'LGPD Consent API',
      status: 'operational',
      version: '1.0.0',
      endpoints: {
        POST: '/api/lgpd/registrar-consentimento',
      },
    },
    { status: 200 }
  );
}
