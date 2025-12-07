// ============================================================================
// ERROR UTILITIES
// Agent 2 - Backend Engineer
// Custom error classes and error handling utilities
// ============================================================================

import { ApiErrorCode } from '../types/api.types';

/**
 * Base API Error class
 */
export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(ApiErrorCode.UNAUTHORIZED, message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden Error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(ApiErrorCode.FORBIDDEN, message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Not found') {
    super(ApiErrorCode.NOT_FOUND, message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Validation Error (400)
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(ApiErrorCode.VALIDATION_ERROR, message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Rate Limit Error (429)
 */
export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(ApiErrorCode.RATE_LIMIT_EXCEEDED, message, 429);
    this.name = 'RateLimitError';
  }
}

/**
 * SERPRO API Error (502)
 */
export class SerproError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(ApiErrorCode.SERPRO_ERROR, message, 502, details);
    this.name = 'SerproError';
  }
}

/**
 * Database Error (500)
 */
export class DatabaseError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(ApiErrorCode.DATABASE_ERROR, message, 500, details);
    this.name = 'DatabaseError';
  }
}
