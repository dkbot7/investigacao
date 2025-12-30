/**
 * Cloudflare Worker - API Backend Investigaree
 *
 * Endpoints:
 * Public REST API (v1) - API Key Authentication:
 * - POST /v1/investigations/cpf
 * - POST /v1/investigations/cnpj
 * - GET  /v1/investigations/:id
 *
 * Alerts:
 * - GET  /api/alerts
 * - POST /api/alerts/:id/read
 * - POST /api/alerts/mark-all-read
 * - GET  /api/alerts/unread-count
 * - GET  /api/alerts/config
 * - PUT  /api/alerts/config
 *
 * Audit Logs:
 * - POST   /api/audit-logs
 * - GET    /api/audit-logs
 * - GET    /api/audit-logs/stats
 * - DELETE /api/audit-logs/cleanup
 *
 * Plan Limits:
 * - GET  /api/plan-limits/check?action=<action>
 * - POST /api/plan-limits/track
 * - GET  /api/plan-limits/plans
 * - GET  /api/plan-limits/usage/history?months=<n>
 *
 * Batch Investigations:
 * - POST   /api/batch/upload
 * - GET    /api/batch
 * - GET    /api/batch/:id
 * - POST   /api/batch/:id/process
 * - DELETE /api/batch/:id
 *
 * API Key Management:
 * - POST   /api/api-keys
 * - GET    /api/api-keys
 * - GET    /api/api-keys/:id/stats
 * - DELETE /api/api-keys/:id
 *
 * Two-Factor Authentication:
 * - POST /api/2fa/setup
 * - POST /api/2fa/verify
 * - POST /api/2fa/disable
 * - GET  /api/2fa/status
 * - POST /api/2fa/regenerate-recovery
 *
 * Trial Management:
 * - GET  /api/trial/status
 * - POST /api/trial/extend-request
 * - POST /api/trial/track-engagement
 * - GET  /api/trial/notifications
 * - POST /api/trial/dismiss-notification
 *
 * Contextual Upsell:
 * - GET  /api/upsell/check
 * - POST /api/upsell/track
 * - GET  /api/upsell/triggers
 * - POST /api/upsell/triggers
 * - PUT  /api/upsell/triggers/:id
 * - GET  /api/upsell/analytics
 *
 * Product Analytics:
 * - POST /api/analytics/track
 * - POST /api/analytics/session/start
 * - POST /api/analytics/feature-usage
 * - GET  /api/analytics/dashboard
 * - GET  /api/analytics/feature-adoption
 * - GET  /api/analytics/retention
 *
 * Customer Health Score:
 * - POST /api/health-score/calculate
 * - GET  /api/health-score/current
 * - GET  /api/health-score/history
 *
 * Self-Service Billing:
 * - GET  /api/billing/subscription
 * - POST /api/billing/subscription/change
 * - POST /api/billing/subscription/cancel
 * - GET  /api/billing/invoices
 * - GET  /api/billing/invoices/:id
 * - GET  /api/billing/payment-methods
 * - GET  /api/billing/usage
 * - GET  /api/billing/preferences
 * - PUT  /api/billing/preferences
 *
 * Scheduled: Cron trigger diário às 9h UTC
 */

import { Env, AuthContext } from './types';
import { authenticate } from './auth';
import { logger } from './logger';
import {
  determineCacheStrategy,
  getFromCache,
  putInCache,
  addCacheHeaders,
  isCacheable,
} from './cache';
import {
  checkRateLimit,
  addRateLimitHeaders,
  createRateLimitResponse,
  getUserPlanTier,
} from './rate-limit';
import {
  handleGetAlerts,
  handleMarkAlertAsRead,
  handleMarkAllAlertsAsRead,
  handleGetUnreadCount,
  handleGetAlertConfig,
  handleUpdateAlertConfig
} from './handlers/alerts';
import {
  handleCreateAuditLog,
  handleGetAuditLogs,
  handleGetAuditLogStats,
  handleCleanupAuditLogs
} from './handlers/audit-logs';
import {
  handleCheckLimits,
  handleTrackUsage,
  handleGetPlans,
  handleGetUsageHistory
} from './handlers/plan-limits';
import {
  handleBatchUpload,
  handleListBatches,
  handleGetBatch,
  handleProcessBatch,
  handleDeleteBatch
} from './handlers/batch';
import {
  authenticateAPIKey,
  handlePublicInvestigateCPF,
  handlePublicInvestigateCNPJ,
  handlePublicGetInvestigation,
  handleCreateAPIKey,
  handleListAPIKeys,
  handleRevokeAPIKey,
  handleGetAPIKeyStats
} from './handlers/public-api';
import {
  handleSetup2FA,
  handleVerify2FA,
  handleDisable2FA,
  handleGet2FAStatus,
  handleRegenerateRecoveryCodes
} from './handlers/two-factor';
import {
  handleGetTrialStatus,
  handleRequestTrialExtension,
  handleTrackTrialEngagement,
  handleGetTrialNotifications,
  handleDismissTrialNotification
} from './handlers/trial';
import {
  handlePurgeCache,
  handleWarmCache,
  handleGetCacheStrategies,
  handleGetCacheStats
} from './handlers/cache-management';
import {
  handleCheckUpsell,
  handleTrackUpsell,
  handleListTriggers,
  handleCreateTrigger,
  handleUpdateTrigger,
  handleGetUpsellAnalytics
} from './handlers/upsell';
import {
  handleTrackEvent,
  handleStartSession,
  handleTrackFeatureUsage,
  handleGetDashboard,
  handleGetFeatureAdoption,
  handleGetRetention
} from './handlers/analytics';
import {
  handleCalculateHealthScore,
  handleGetHealthScore,
  handleGetHealthScoreHistory
} from './handlers/health-score';
import {
  handleGetSubscription,
  handleChangeSubscription,
  handleCancelSubscription,
  handleListInvoices,
  handleGetInvoice,
  handleListPaymentMethods,
  handleGetUsage,
  handleGetBillingPreferences,
  handleUpdateBillingPreferences
} from './handlers/billing';
import {
  handleGetTenantInfo,
  handleGetProfile,
  handleUpdateProfile
} from './handlers/user';
import { handleLeadSubscribe } from './handlers/leads';
import { handleScheduled } from './scheduled';

export default {
  /**
   * Fetch handler - processa requests HTTP
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ============================================
    // EDGE CACHING - Try cache first for GET requests
    // ============================================
    const cacheStrategy = determineCacheStrategy(url);

    if (request.method === 'GET' && cacheStrategy !== 'NO_CACHE') {
      const cachedResponse = await getFromCache(request);
      if (cachedResponse) {
        return addCorsHeaders(cachedResponse, corsHeaders);
      }
    }

    try {
      // Health check (sem auth)
      if (url.pathname === '/health' || url.pathname === '/') {
        return new Response(JSON.stringify({
          status: 'ok',
          service: 'investigaree-api',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Cache stats (public, sem auth)
      if (url.pathname === '/api/cache/stats' && request.method === 'GET') {
        const response = await handleGetCacheStats(request, env);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      // Lead subscribe (public, sem auth)
      if (url.pathname === '/api/leads/subscribe' && request.method === 'POST') {
        const response = await handleLeadSubscribe(request, env);
        return addCorsHeaders(response, corsHeaders);
      }

      // === PUBLIC REST API ROUTES (v1) - API Key Authentication ===

      if (url.pathname === '/v1/investigations/cpf' && request.method === 'POST') {
        const authResult = await authenticateAPIKey(request, env);
        if (authResult instanceof Response) return addCorsHeaders(authResult, corsHeaders);

        // Rate limiting check
        const rateLimitResult = await checkRateLimit(env, 'investigations', authResult.apiKey.id.toString());
        if (!rateLimitResult.allowed) {
          return createRateLimitResponse(rateLimitResult, corsHeaders);
        }

        const response = await handlePublicInvestigateCPF(request, env, authResult.apiKey);
        return addCorsHeaders(addRateLimitHeaders(response, rateLimitResult.headers), corsHeaders);
      }

      if (url.pathname === '/v1/investigations/cnpj' && request.method === 'POST') {
        const authResult = await authenticateAPIKey(request, env);
        if (authResult instanceof Response) return addCorsHeaders(authResult, corsHeaders);

        // Rate limiting check
        const rateLimitResult = await checkRateLimit(env, 'investigations', authResult.apiKey.id.toString());
        if (!rateLimitResult.allowed) {
          return createRateLimitResponse(rateLimitResult, corsHeaders);
        }

        const response = await handlePublicInvestigateCNPJ(request, env, authResult.apiKey);
        return addCorsHeaders(addRateLimitHeaders(response, rateLimitResult.headers), corsHeaders);
      }

      if (url.pathname.match(/^\/v1\/investigations\/\d+$/) && request.method === 'GET') {
        const authResult = await authenticateAPIKey(request, env);
        if (authResult instanceof Response) return addCorsHeaders(authResult, corsHeaders);

        // Rate limiting check
        const rateLimitResult = await checkRateLimit(env, 'api', authResult.apiKey.id.toString());
        if (!rateLimitResult.allowed) {
          return createRateLimitResponse(rateLimitResult, corsHeaders);
        }

        const investigationId = url.pathname.split('/')[3];
        const response = await handlePublicGetInvestigation(request, env, authResult.apiKey, investigationId);
        return addCorsHeaders(addRateLimitHeaders(response, rateLimitResult.headers), corsHeaders, request, url);
      }

      // Todas as outras rotas requerem autenticação de usuário
      const authResult = await authenticate(request, env);

      if (authResult instanceof Response) {
        // Auth falhou, retornar erro
        return new Response(authResult.body, {
          status: authResult.status,
          headers: { ...authResult.headers, ...corsHeaders }
        });
      }

      const user = authResult; // AuthContext com tenantId e role

      // Global rate limiting check for all authenticated routes
      const globalRateLimitResult = await checkRateLimit(env, 'global', user.userId);
      if (!globalRateLimitResult.allowed) {
        return createRateLimitResponse(globalRateLimitResult, corsHeaders);
      }

      // === ALERTS ROUTES ===

      if (url.pathname === '/api/alerts' && request.method === 'GET') {
        const response = await handleGetAlerts(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname.match(/^\/api\/alerts\/(.+)\/read$/) && request.method === 'POST') {
        const alertId = url.pathname.split('/')[3];
        const response = await handleMarkAlertAsRead(request, env, user, alertId);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/alerts/mark-all-read' && request.method === 'POST') {
        const response = await handleMarkAllAlertsAsRead(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/alerts/unread-count' && request.method === 'GET') {
        const response = await handleGetUnreadCount(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/alerts/config' && request.method === 'GET') {
        const response = await handleGetAlertConfig(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/alerts/config' && request.method === 'PUT') {
        const response = await handleUpdateAlertConfig(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      // === AUDIT LOGS ROUTES ===

      if (url.pathname === '/api/audit-logs' && request.method === 'POST') {
        const response = await handleCreateAuditLog(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/audit-logs' && request.method === 'GET') {
        const response = await handleGetAuditLogs(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/audit-logs/stats' && request.method === 'GET') {
        const response = await handleGetAuditLogStats(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/audit-logs/cleanup' && request.method === 'DELETE') {
        const response = await handleCleanupAuditLogs(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      // === PLAN LIMITS ROUTES ===

      if (url.pathname === '/api/plan-limits/check' && request.method === 'GET') {
        const response = await handleCheckLimits(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/plan-limits/track' && request.method === 'POST') {
        const response = await handleTrackUsage(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/plan-limits/plans' && request.method === 'GET') {
        const response = await handleGetPlans(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/plan-limits/usage/history' && request.method === 'GET') {
        const response = await handleGetUsageHistory(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      // === BATCH INVESTIGATIONS ROUTES ===

      if (url.pathname === '/api/batch/upload' && request.method === 'POST') {
        // Rate limiting check for batch operations
        const rateLimitResult = await checkRateLimit(env, 'batch', user.userId);
        if (!rateLimitResult.allowed) {
          return createRateLimitResponse(rateLimitResult, corsHeaders);
        }

        const response = await handleBatchUpload(request, env, user);
        return addCorsHeaders(addRateLimitHeaders(response, rateLimitResult.headers), corsHeaders);
      }

      if (url.pathname === '/api/batch' && request.method === 'GET') {
        const response = await handleListBatches(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname.match(/^\/api\/batch\/[^\/]+$/) && request.method === 'GET') {
        const batchId = url.pathname.split('/')[3];
        const response = await handleGetBatch(request, env, user, batchId);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname.match(/^\/api\/batch\/[^\/]+\/process$/) && request.method === 'POST') {
        // Rate limiting check for batch processing
        const rateLimitResult = await checkRateLimit(env, 'batch', user.userId);
        if (!rateLimitResult.allowed) {
          return createRateLimitResponse(rateLimitResult, corsHeaders);
        }

        const batchId = url.pathname.split('/')[3];
        const response = await handleProcessBatch(request, env, user, batchId);
        return addCorsHeaders(addRateLimitHeaders(response, rateLimitResult.headers), corsHeaders);
      }

      if (url.pathname.match(/^\/api\/batch\/[^\/]+$/) && request.method === 'DELETE') {
        const batchId = url.pathname.split('/')[3];
        const response = await handleDeleteBatch(request, env, user, batchId);
        return addCorsHeaders(response, corsHeaders);
      }

      // === API KEY MANAGEMENT ROUTES ===

      if (url.pathname === '/api/api-keys' && request.method === 'POST') {
        const response = await handleCreateAPIKey(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/api-keys' && request.method === 'GET') {
        const response = await handleListAPIKeys(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname.match(/^\/api\/api-keys\/[^\/]+\/stats$/) && request.method === 'GET') {
        const keyId = url.pathname.split('/')[3];
        const response = await handleGetAPIKeyStats(request, env, user, keyId);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname.match(/^\/api\/api-keys\/[^\/]+$/) && request.method === 'DELETE') {
        const keyId = url.pathname.split('/')[3];
        const response = await handleRevokeAPIKey(request, env, user, keyId);
        return addCorsHeaders(response, corsHeaders);
      }

      // === TWO-FACTOR AUTHENTICATION ROUTES ===

      if (url.pathname === '/api/2fa/setup' && request.method === 'POST') {
        const response = await handleSetup2FA(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/2fa/verify' && request.method === 'POST') {
        const response = await handleVerify2FA(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/2fa/disable' && request.method === 'POST') {
        const response = await handleDisable2FA(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/2fa/status' && request.method === 'GET') {
        const response = await handleGet2FAStatus(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/2fa/regenerate-recovery' && request.method === 'POST') {
        const response = await handleRegenerateRecoveryCodes(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      // === TRIAL MANAGEMENT ROUTES ===

      if (url.pathname === '/api/trial/status' && request.method === 'GET') {
        const response = await handleGetTrialStatus(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/trial/extend-request' && request.method === 'POST') {
        const response = await handleRequestTrialExtension(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/trial/track-engagement' && request.method === 'POST') {
        const response = await handleTrackTrialEngagement(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/trial/notifications' && request.method === 'GET') {
        const response = await handleGetTrialNotifications(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/trial/dismiss-notification' && request.method === 'POST') {
        const response = await handleDismissTrialNotification(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      // === CACHE MANAGEMENT ROUTES ===

      if (url.pathname === '/api/admin/cache/purge' && request.method === 'POST') {
        const response = await handlePurgeCache(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/admin/cache/warm' && request.method === 'POST') {
        const response = await handleWarmCache(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/admin/cache/strategies' && request.method === 'GET') {
        const response = await handleGetCacheStrategies(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      // === UPSELL ROUTES ===

      if (url.pathname === '/api/upsell/check' && request.method === 'GET') {
        const response = await handleCheckUpsell(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/upsell/track' && request.method === 'POST') {
        const response = await handleTrackUpsell(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/upsell/triggers' && request.method === 'GET') {
        const response = await handleListTriggers(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/upsell/triggers' && request.method === 'POST') {
        const response = await handleCreateTrigger(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname.match(/^\/api\/upsell\/triggers\/[^\/]+$/) && request.method === 'PUT') {
        const triggerId = url.pathname.split('/')[4];
        const response = await handleUpdateTrigger(request, env, user, triggerId);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/upsell/analytics' && request.method === 'GET') {
        const response = await handleGetUpsellAnalytics(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      // === PRODUCT ANALYTICS ROUTES ===

      if (url.pathname === '/api/analytics/track' && request.method === 'POST') {
        const response = await handleTrackEvent(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/analytics/session/start' && request.method === 'POST') {
        const response = await handleStartSession(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/analytics/feature-usage' && request.method === 'POST') {
        const response = await handleTrackFeatureUsage(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/analytics/dashboard' && request.method === 'GET') {
        const response = await handleGetDashboard(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/analytics/feature-adoption' && request.method === 'GET') {
        const response = await handleGetFeatureAdoption(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/analytics/retention' && request.method === 'GET') {
        const response = await handleGetRetention(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      // === CUSTOMER HEALTH SCORE ROUTES ===

      if (url.pathname === '/api/health-score/calculate' && request.method === 'POST') {
        const response = await handleCalculateHealthScore(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/health-score/current' && request.method === 'GET') {
        const response = await handleGetHealthScore(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/health-score/history' && request.method === 'GET') {
        const response = await handleGetHealthScoreHistory(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      // === BILLING ROUTES ===

      if (url.pathname === '/api/billing/subscription' && request.method === 'GET') {
        const response = await handleGetSubscription(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/billing/subscription/change' && request.method === 'POST') {
        const response = await handleChangeSubscription(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/billing/subscription/cancel' && request.method === 'POST') {
        const response = await handleCancelSubscription(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      if (url.pathname === '/api/billing/invoices' && request.method === 'GET') {
        const response = await handleListInvoices(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname.match(/^\/api\/billing\/invoices\/[^\/]+$/) && request.method === 'GET') {
        const invoiceId = url.pathname.split('/')[4];
        const response = await handleGetInvoice(request, env, user, invoiceId);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/billing/payment-methods' && request.method === 'GET') {
        const response = await handleListPaymentMethods(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/billing/usage' && request.method === 'GET') {
        const response = await handleGetUsage(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/billing/preferences' && request.method === 'GET') {
        const response = await handleGetBillingPreferences(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/billing/preferences' && request.method === 'PUT') {
        const response = await handleUpdateBillingPreferences(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      // === USER ROUTES ===

      if (url.pathname === '/api/user/tenant-info' && request.method === 'GET') {
        const response = await handleGetTenantInfo(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/user/profile' && request.method === 'GET') {
        const response = await handleGetProfile(request, env, user);
        return addCorsHeaders(response, corsHeaders, request, url);
      }

      if (url.pathname === '/api/user/profile' && request.method === 'PUT') {
        const response = await handleUpdateProfile(request, env, user);
        return addCorsHeaders(response, corsHeaders);
      }

      // === 404 NOT FOUND ===

      return new Response(JSON.stringify({
        error: 'Not found',
        path: url.pathname,
        method: request.method
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      logger.error('Worker error', error instanceof Error ? error : undefined, { path: url.pathname, method: request.method }, 'Worker');

      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },

  /**
   * Scheduled handler - processa Cron Triggers
   */
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    return handleScheduled(controller, env, ctx);
  }
};

/**
 * Adiciona CORS headers à response e aplica caching se apropriado
 */
function addCorsHeaders(response: Response, corsHeaders: Record<string, string>, request?: Request, url?: URL): Response {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  // Add cache headers if request and URL are provided
  if (request && url && request.method === 'GET') {
    const strategy = determineCacheStrategy(url);
    if (strategy !== 'NO_CACHE' && isCacheable(response)) {
      const cacheResponse = addCacheHeaders(response, strategy);

      // Store in cache asynchronously (don't await)
      if (response.status < 400) {
        putInCache(request, cacheResponse.clone(), strategy);
      }

      return new Response(cacheResponse.body, {
        status: cacheResponse.status,
        statusText: cacheResponse.statusText,
        headers: { ...Object.fromEntries(cacheResponse.headers.entries()), ...corsHeaders }
      });
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
