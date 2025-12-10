/**
 * Tenant Service - Index
 *
 * Exporta todos os serviços, tipos e utilitários relacionados a tenants
 */

// Exportar templates
export {
  FREE_TEMPLATE,
  BASIC_TEMPLATE,
  PRO_TEMPLATE,
  ENTERPRISE_TEMPLATE,
  TENANT_TEMPLATES,
  INITIAL_TENANT_DATA,
  getTemplateForPlan,
  getTemplateForType,
  mergeWithTemplate,
  type TenantPlan,
  type TenantType,
  type SerproMode,
  type TenantFeatures,
  type TenantLimits,
  type TenantIntegrations,
  type TenantBilling,
  type TenantBranding,
  type TenantConfig,
  type TenantPreferences,
  type TenantNotifications,
  type TenantInitialData,
} from './templates';

// Exportar validações
export {
  validateTenantCode,
  validateTenantName,
  validateTenantEmail,
  validateTenantPlan,
  validateTenantType,
  validateTenantStatus,
  validatePersonalTenantData,
  validateCorporateTenantData,
  validateUserRole,
  validateUserLimit,
  validateQueryLimit,
  validateStorageLimit,
  validateTenantCreation,
  throwIfErrors,
  TenantValidationError,
  type ValidationError,
} from './validation';

// Exportar serviço
export {
  TenantService,
  createPersonalTenant,
  createCorporateTenant,
  grantTenantAccess,
  revokeTenantAccess,
  updateTenantPlan,
  getUserTenants,
  getTenantById,
  getTenantByCode,
  userHasAccessToTenant,
  getUserRoleInTenant,
  type CreatePersonalTenantParams,
  type CreateCorporateTenantParams,
  type GrantTenantAccessParams,
  type CreatedTenant,
} from './tenant.service';
