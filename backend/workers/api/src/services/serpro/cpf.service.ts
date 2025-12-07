// ============================================================================
// SERPRO CPF SERVICE
// Agent 2 - Backend Engineer
// API: Consulta CPF DF v2
// Endpoint: /consulta-cpf-df/v2/cpf/{ni}
// Cost: R$ 0.6591 per query (tier 1: 1-10,000 queries/month)
// ============================================================================

import { SerproBaseService } from './base.service';
import type { CpfResponse } from '../../types/serpro.types';
import type { Env } from '../../types/api.types';

/**
 * SERPRO CPF Consultation Service
 *
 * Provides methods to query CPF data from SERPRO API
 * Includes automatic cost tracking and validation
 */
export class CpfService extends SerproBaseService {
  // Pricing tiers (R$ per query)
  private static readonly TIER_1_COST = 0.6591; // 1-10,000 queries/month
  private static readonly TIER_2_COST = 0.5893; // 10,001-50,000
  private static readonly TIER_3_COST = 0.5274; // 50,001-100,000
  private static readonly TIER_4_COST = 0.4719; // 100,001+

  constructor(env: Env) {
    super(env, 'cpf', 'https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2');
  }

  /**
   * Query CPF data from SERPRO
   *
   * @param cpf - CPF number (with or without formatting)
   * @param userId - Firebase UID of requesting user
   * @param tenantCode - Tenant code for cost allocation
   * @returns CPF data including name, status, and birth date
   * @throws Error if CPF is invalid or API request fails
   */
  async consultarCpf(cpf: string, userId: string, tenantCode: string): Promise<CpfResponse> {
    const startTime = Date.now();

    // Validate and clean CPF
    if (!this.validateCpf(cpf)) {
      throw new Error(`Invalid CPF format: ${cpf}`);
    }

    const cpfClean = this.cleanDocument(cpf);

    try {
      // Make request to SERPRO API
      const response = await this.makeRequest<CpfResponse>(`/cpf/${cpfClean}`);
      const responseTime = Date.now() - startTime;

      // Log successful usage (using tier 1 pricing for now)
      // TODO: Implement dynamic tier calculation based on monthly usage
      await this.logUsage(userId, tenantCode, cpfClean, CpfService.TIER_1_COST, 200, responseTime);

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // Log failed attempt (no cost)
      await this.logUsage(userId, tenantCode, cpfClean, 0, 500, responseTime);

      throw error;
    }
  }

  /**
   * Get current pricing tier based on monthly usage
   * TODO: Implement this when usage analytics are ready
   */
  private async getCurrentTierCost(tenantCode: string): Promise<number> {
    // Query monthly usage from serpro_usage table
    const result = await this.env.DB.prepare(
      `SELECT COUNT(*) as count
       FROM serpro_usage
       WHERE tenant_code = ?
         AND api_name = 'cpf'
         AND created_at >= date('now', 'start of month')`
    )
      .bind(tenantCode)
      .first<{ count: number }>();

    const monthlyUsage = result?.count || 0;

    // Return appropriate tier cost
    if (monthlyUsage > 100000) return CpfService.TIER_4_COST;
    if (monthlyUsage > 50000) return CpfService.TIER_3_COST;
    if (monthlyUsage > 10000) return CpfService.TIER_2_COST;
    return CpfService.TIER_1_COST;
  }

  /**
   * Batch query multiple CPFs
   * TODO: Implement if SERPRO supports batch operations
   */
  async consultarCpfBatch(
    cpfs: string[],
    userId: string,
    tenantCode: string
  ): Promise<CpfResponse[]> {
    // For now, sequential queries (SERPRO doesn't have batch endpoint)
    const results: CpfResponse[] = [];

    for (const cpf of cpfs) {
      try {
        const result = await this.consultarCpf(cpf, userId, tenantCode);
        results.push(result);
      } catch (error) {
        console.error(`Failed to query CPF ${cpf}:`, error);
        // Continue with other CPFs
      }
    }

    return results;
  }
}
