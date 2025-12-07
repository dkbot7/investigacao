// ============================================================================
// SERPRO DÍVIDA ATIVA SERVICE
// Agent 2 - Backend Engineer
// API: Consulta Dívida Ativa v1
// Endpoint: /consulta-divida-ativa/v1/divida/{ni}
// Cost: R$ 0.6591 per query (tier 1: 1-10,000 queries/month)
// ============================================================================

import { SerproBaseService } from './base.service';
import type { DividaAtivaResponse } from '../../types/serpro.types';
import type { Env } from '../../types/api.types';

/**
 * SERPRO Dívida Ativa Consultation Service
 *
 * Queries federal tax debts from PGFN (Procuradoria-Geral da Fazenda Nacional)
 * Accepts both CPF and CNPJ
 */
export class DividaAtivaService extends SerproBaseService {
  // Pricing per query (tier 1: 1-10,000 queries/month)
  private static readonly QUERY_COST = 0.6591;

  constructor(env: Env) {
    super(env, 'divida-ativa', 'https://gateway.apiserpro.serpro.gov.br/consulta-divida-ativa/v1');
  }

  /**
   * Query federal tax debts (Dívida Ativa da União)
   * Accepts both CPF and CNPJ
   *
   * Returns debts registered at PGFN including:
   * - Debt number and type
   * - Registration date
   * - Debt value
   * - Current status
   * - Responsible agency
   *
   * @param ni - CPF or CNPJ (NI = Número de Inscrição)
   * @param userId - Firebase UID of requesting user
   * @param tenantCode - Tenant code for cost allocation
   * @returns List of federal debts
   * @throws Error if NI is invalid or API request fails
   */
  async consultarDivida(
    ni: string,
    userId: string,
    tenantCode: string
  ): Promise<DividaAtivaResponse> {
    const startTime = Date.now();

    // Validate document (CPF or CNPJ)
    const niClean = this.cleanDocument(ni);
    const isCpf = niClean.length === 11;
    const isCnpj = niClean.length === 14;

    if (!isCpf && !isCnpj) {
      throw new Error(`Invalid document format: ${ni}. Must be CPF (11 digits) or CNPJ (14 digits)`);
    }

    // Validate CPF or CNPJ
    if (isCpf && !this.validateCpf(ni)) {
      throw new Error(`Invalid CPF: ${ni}`);
    }

    if (isCnpj && !this.validateCnpj(ni)) {
      throw new Error(`Invalid CNPJ: ${ni}`);
    }

    try {
      const response = await this.makeRequest<DividaAtivaResponse>(`/divida/${niClean}`);
      const responseTime = Date.now() - startTime;

      await this.logUsage(
        userId,
        tenantCode,
        niClean,
        DividaAtivaService.QUERY_COST,
        200,
        responseTime
      );

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      await this.logUsage(userId, tenantCode, niClean, 0, 500, responseTime);
      throw error;
    }
  }

  /**
   * Check if document has any federal debts
   * Returns true if debts exist, false otherwise
   */
  async hasDebts(ni: string, userId: string, tenantCode: string): Promise<boolean> {
    try {
      const result = await this.consultarDivida(ni, userId, tenantCode);
      return result.dividas && result.dividas.length > 0;
    } catch (error) {
      // If query fails, we can't determine debt status
      console.error(`Failed to check debts for ${ni}:`, error);
      throw error;
    }
  }

  /**
   * Calculate total debt amount
   * Sums all debt values for the given document
   */
  async getTotalDebt(ni: string, userId: string, tenantCode: string): Promise<number> {
    const result = await this.consultarDivida(ni, userId, tenantCode);

    if (!result.dividas || result.dividas.length === 0) {
      return 0;
    }

    return result.dividas.reduce((total, divida) => total + divida.valor, 0);
  }

  /**
   * Batch query multiple documents
   * Returns array of results with debt information
   */
  async consultarDividaBatch(
    documentos: string[],
    userId: string,
    tenantCode: string
  ): Promise<DividaAtivaResponse[]> {
    const results: DividaAtivaResponse[] = [];

    for (const ni of documentos) {
      try {
        const result = await this.consultarDivida(ni, userId, tenantCode);
        results.push(result);
      } catch (error) {
        console.error(`Failed to query debt for ${ni}:`, error);
        // Continue with other documents
      }
    }

    return results;
  }

  /**
   * Get pricing information
   */
  static getPricing(): number {
    return DividaAtivaService.QUERY_COST;
  }
}
