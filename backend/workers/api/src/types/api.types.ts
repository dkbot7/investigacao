// ============================================================================
// API TYPES - Environment & Context
// Agent 2 - Backend Engineer
// ============================================================================

/**
 * Cloudflare Workers Environment Bindings
 */
export interface Env {
  // D1 Database
  DB: D1Database;

  // KV Cache (será configurado depois)
  // CACHE?: KVNamespace;

  // SERPRO API Credentials - CPF
  SERPRO_CPF_CONSUMER_KEY: string;
  SERPRO_CPF_CONSUMER_SECRET: string;

  // SERPRO API Credentials - CNPJ
  SERPRO_CNPJ_CONSUMER_KEY: string;
  SERPRO_CNPJ_CONSUMER_SECRET: string;

  // SERPRO API Credentials - Dívida Ativa
  SERPRO_DIVIDA_ATIVA_CONSUMER_KEY: string;
  SERPRO_DIVIDA_ATIVA_CONSUMER_SECRET: string;

  // SERPRO API Credentials - Renda
  SERPRO_RENDA_CONSUMER_KEY: string;
  SERPRO_RENDA_CONSUMER_SECRET: string;

  // SERPRO API Credentials - Faturamento
  SERPRO_FATURAMENTO_CONSUMER_KEY: string;
  SERPRO_FATURAMENTO_CONSUMER_SECRET: string;

  // SERPRO API Credentials - DataValid
  SERPRO_DATAVALID_CONSUMER_KEY: string;
  SERPRO_DATAVALID_CONSUMER_SECRET: string;

  // SERPRO API Credentials - CND
  SERPRO_CND_CONSUMER_KEY: string;
  SERPRO_CND_CONSUMER_SECRET: string;

  // SERPRO API Credentials - Integra Contador
  SERPRO_INTEGRA_CONTADOR_CONSUMER_KEY: string;
  SERPRO_INTEGRA_CONTADOR_CONSUMER_SECRET: string;

  // SERPRO API Credentials - Raiz Tech
  SERPRO_RAIZ_TECH_CONSUMER_KEY: string;
  SERPRO_RAIZ_TECH_CONSUMER_SECRET: string;

  // Master key para criptografia de credenciais SERPRO (BYO system)
  ENCRYPTION_MASTER_KEY: string;

  // Environment
  ENVIRONMENT?: string;
}

/**
 * Authenticated user from Firebase token
 */
export interface AuthenticatedUser {
  uid: string;
  email: string;
  role?: string;
}

/**
 * Standard API Response
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    timestamp: string;
    duration_ms: number;
  };
}

/**
 * Error codes
 */
export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERPRO_ERROR = 'SERPRO_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
