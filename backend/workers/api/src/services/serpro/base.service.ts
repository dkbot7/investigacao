// ============================================================================
// SERPRO BASE SERVICE
// Agent 2 - Backend Engineer
// Base class for all SERPRO API integrations
// ============================================================================

import type { Env } from '../../types/api.types';
import type { OAuth2TokenResponse } from '../../types/serpro.types';

/**
 * Abstract base class for SERPRO API services
 * Handles:
 * - OAuth2 token management
 * - HTTP requests with authentication
 * - Usage and cost logging to D1
 * - Error handling
 */
export abstract class SerproBaseService {
  protected env: Env;
  protected apiName: string;
  protected baseUrl: string;

  // Token cache (in-memory, per worker instance)
  private tokenCache: {
    token: string;
    expiresAt: number;
  } | null = null;

  constructor(env: Env, apiName: string, baseUrl: string) {
    this.env = env;
    this.apiName = apiName;
    this.baseUrl = baseUrl;
  }

  /**
   * Get OAuth2 access token
   * Implements token caching to avoid unnecessary requests
   */
  protected async getToken(): Promise<string> {
    // Check cache first
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now()) {
      return this.tokenCache.token;
    }

    // Get credentials from environment
    const apiNameUpper = this.apiName.toUpperCase().replace(/-/g, '_');
    const consumerKey = this.env[`SERPRO_${apiNameUpper}_CONSUMER_KEY` as keyof Env];
    const consumerSecret = this.env[`SERPRO_${apiNameUpper}_CONSUMER_SECRET` as keyof Env];

    if (!consumerKey || !consumerSecret) {
      throw new Error(
        `SERPRO ${this.apiName} credentials not configured. ` +
        `Missing: SERPRO_${apiNameUpper}_CONSUMER_KEY or SERPRO_${apiNameUpper}_CONSUMER_SECRET`
      );
    }

    // Request new token
    const tokenUrl = `${this.baseUrl}/token`;
    const credentials = btoa(`${consumerKey}:${consumerSecret}`);

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to get SERPRO token for ${this.apiName}: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = (await response.json()) as OAuth2TokenResponse;

      // Cache token (with 5 minute safety margin)
      this.tokenCache = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in - 300) * 1000,
      };

      return data.access_token;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`OAuth2 token request failed for ${this.apiName}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Make authenticated request to SERPRO API
   */
  protected async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken();
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `SERPRO API error [${this.apiName}]: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Request to ${this.apiName} failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Log API usage to database for cost tracking
   */
  protected async logUsage(
    userId: string,
    tenantCode: string,
    document: string,
    cost: number,
    status: number,
    responseTime: number
  ): Promise<void> {
    try {
      await this.env.DB.prepare(
        `INSERT INTO serpro_usage
         (user_id, tenant_code, api_name, document, cost, response_status, response_time_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(userId, tenantCode, this.apiName, document, cost, status, responseTime)
        .run();
    } catch (error) {
      // Log error but don't throw - we don't want to fail the request if logging fails
      console.error(`Failed to log usage for ${this.apiName}:`, error);
    }
  }

  /**
   * Validate CPF format
   */
  protected validateCpf(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11) {
      return false;
    }

    // Check if all digits are the same (invalid CPF)
    if (/^(\d)\1{10}$/.test(cleaned)) {
      return false;
    }

    // Validate check digits
    let sum = 0;
    let remainder: number;

    // First digit
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleaned.substring(9, 10))) {
      return false;
    }

    // Second digit
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cleaned.substring(10, 11))) {
      return false;
    }

    return true;
  }

  /**
   * Validate CNPJ format
   */
  protected validateCnpj(cnpj: string): boolean {
    const cleaned = cnpj.replace(/\D/g, '');

    if (cleaned.length !== 14) {
      return false;
    }

    // Check if all digits are the same (invalid CNPJ)
    if (/^(\d)\1{13}$/.test(cleaned)) {
      return false;
    }

    // Validate check digits
    let length = cleaned.length - 2;
    let numbers = cleaned.substring(0, length);
    const digits = cleaned.substring(length);
    let sum = 0;
    let pos = length - 7;

    // First digit
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) {
      return false;
    }

    // Second digit
    length = length + 1;
    numbers = cleaned.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) {
      return false;
    }

    return true;
  }

  /**
   * Clean CPF/CNPJ (remove formatting)
   */
  protected cleanDocument(document: string): string {
    return document.replace(/\D/g, '');
  }
}
