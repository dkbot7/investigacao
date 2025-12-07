// ============================================================================
// SERPRO CNPJ SERVICE
// Agent 2 - Backend Engineer
// API: Consulta CNPJ DF v2
// Endpoints:
// - /basica/{cnpj} - Dados básicos (CPF mascarado no QSA) - R$ 0.6591
// - /qsa/{cnpj} - Com Quadro Societário (CPF mascarado) - R$ 0.8788
// - /empresa/{cnpj} - Dados completos (CPF DESMASCARADO) - R$ 1.1722
// ============================================================================

import { SerproBaseService } from './base.service';
import type { CnpjResponse } from '../../types/serpro.types';
import type { Env } from '../../types/api.types';

/**
 * SERPRO CNPJ Consultation Service
 *
 * Provides three endpoints with different data levels:
 * - Básica: Basic company data (masked CPF in QSA)
 * - QSA: Includes shareholder registry (masked CPF)
 * - Empresa: Full data with UNMASKED CPF (ideal for investigations)
 */
export class CnpjService extends SerproBaseService {
  // Pricing per query (tier 1: 1-10,000 queries/month)
  private static readonly BASICA_COST = 0.6591; // Basic data
  private static readonly QSA_COST = 0.8788; // With shareholder registry
  private static readonly EMPRESA_COST = 1.1722; // Full data (unmasked CPF)

  constructor(env: Env) {
    super(env, 'cnpj', 'https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2');
  }

  /**
   * Query basic CNPJ data
   * CPF in QSA (Quadro de Sócios e Administradores) is MASKED
   *
   * @param cnpj - CNPJ number (with or without formatting)
   * @param userId - Firebase UID of requesting user
   * @param tenantCode - Tenant code for cost allocation
   * @returns Basic company data
   * @throws Error if CNPJ is invalid or API request fails
   */
  async consultarCnpjBasica(
    cnpj: string,
    userId: string,
    tenantCode: string
  ): Promise<CnpjResponse> {
    const startTime = Date.now();

    // Validate and clean CNPJ
    if (!this.validateCnpj(cnpj)) {
      throw new Error(`Invalid CNPJ format: ${cnpj}`);
    }

    const cnpjClean = this.cleanDocument(cnpj);

    try {
      const response = await this.makeRequest<CnpjResponse>(`/basica/${cnpjClean}`);
      const responseTime = Date.now() - startTime;

      await this.logUsage(
        userId,
        tenantCode,
        cnpjClean,
        CnpjService.BASICA_COST,
        200,
        responseTime
      );

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      await this.logUsage(userId, tenantCode, cnpjClean, 0, 500, responseTime);
      throw error;
    }
  }

  /**
   * Query CNPJ data with Quadro de Sócios e Administradores (QSA)
   * CPF in QSA is MASKED (***123456**)
   *
   * @param cnpj - CNPJ number
   * @param userId - Firebase UID
   * @param tenantCode - Tenant code
   * @returns Company data with shareholder registry (masked CPF)
   */
  async consultarCnpjQsa(
    cnpj: string,
    userId: string,
    tenantCode: string
  ): Promise<CnpjResponse> {
    const startTime = Date.now();

    if (!this.validateCnpj(cnpj)) {
      throw new Error(`Invalid CNPJ format: ${cnpj}`);
    }

    const cnpjClean = this.cleanDocument(cnpj);

    try {
      const response = await this.makeRequest<CnpjResponse>(`/qsa/${cnpjClean}`);
      const responseTime = Date.now() - startTime;

      await this.logUsage(
        userId,
        tenantCode,
        cnpjClean,
        CnpjService.QSA_COST,
        200,
        responseTime
      );

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      await this.logUsage(userId, tenantCode, cnpjClean, 0, 500, responseTime);
      throw error;
    }
  }

  /**
   * Query full CNPJ data (Empresa endpoint)
   * CPF in QSA is UNMASKED - IDEAL FOR INVESTIGATIONS
   *
   * ⚠️ IMPORTANT: This is the most expensive endpoint but provides
   * the most valuable data for investigations (unmasked CPF)
   *
   * @param cnpj - CNPJ number
   * @param userId - Firebase UID
   * @param tenantCode - Tenant code
   * @returns Full company data with UNMASKED CPF in QSA
   */
  async consultarCnpjEmpresa(
    cnpj: string,
    userId: string,
    tenantCode: string
  ): Promise<CnpjResponse> {
    const startTime = Date.now();

    if (!this.validateCnpj(cnpj)) {
      throw new Error(`Invalid CNPJ format: ${cnpj}`);
    }

    const cnpjClean = this.cleanDocument(cnpj);

    try {
      const response = await this.makeRequest<CnpjResponse>(`/empresa/${cnpjClean}`);
      const responseTime = Date.now() - startTime;

      await this.logUsage(
        userId,
        tenantCode,
        cnpjClean,
        CnpjService.EMPRESA_COST,
        200,
        responseTime
      );

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      await this.logUsage(userId, tenantCode, cnpjClean, 0, 500, responseTime);
      throw error;
    }
  }

  /**
   * Smart CNPJ query - automatically selects the best endpoint based on use case
   * Default: Uses /empresa (unmasked CPF) for investigation purposes
   *
   * @param cnpj - CNPJ number
   * @param userId - Firebase UID
   * @param tenantCode - Tenant code
   * @param level - Data level: 'basica' | 'qsa' | 'empresa' (default: 'empresa')
   * @returns Company data
   */
  async consultarCnpj(
    cnpj: string,
    userId: string,
    tenantCode: string,
    level: 'basica' | 'qsa' | 'empresa' = 'empresa'
  ): Promise<CnpjResponse> {
    switch (level) {
      case 'basica':
        return this.consultarCnpjBasica(cnpj, userId, tenantCode);
      case 'qsa':
        return this.consultarCnpjQsa(cnpj, userId, tenantCode);
      case 'empresa':
      default:
        return this.consultarCnpjEmpresa(cnpj, userId, tenantCode);
    }
  }

  /**
   * Batch query multiple CNPJs
   * Uses the specified level for all queries
   */
  async consultarCnpjBatch(
    cnpjs: string[],
    userId: string,
    tenantCode: string,
    level: 'basica' | 'qsa' | 'empresa' = 'empresa'
  ): Promise<CnpjResponse[]> {
    const results: CnpjResponse[] = [];

    for (const cnpj of cnpjs) {
      try {
        const result = await this.consultarCnpj(cnpj, userId, tenantCode, level);
        results.push(result);
      } catch (error) {
        console.error(`Failed to query CNPJ ${cnpj}:`, error);
        // Continue with other CNPJs
      }
    }

    return results;
  }

  /**
   * Get pricing information for all endpoints
   */
  static getPricing(): {
    basica: number;
    qsa: number;
    empresa: number;
  } {
    return {
      basica: CnpjService.BASICA_COST,
      qsa: CnpjService.QSA_COST,
      empresa: CnpjService.EMPRESA_COST,
    };
  }
}
