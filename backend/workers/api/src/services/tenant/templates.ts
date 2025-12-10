/**
 * Tenant Configuration Templates
 *
 * Define os templates padrão para diferentes planos de tenant
 */

export type TenantPlan = 'free' | 'basic' | 'pro' | 'enterprise';
export type TenantType = 'personal' | 'corporate';
export type SerproMode = 'managed' | 'custom' | 'disabled';

export interface TenantFeatures {
  bulk_queries: boolean;
  api_access: boolean;
  advanced_analytics: boolean;
  custom_reports: boolean;
  data_export: boolean;
  webhook_notifications: boolean;
}

export interface TenantLimits {
  max_users: number;
  max_queries_month: number;
  data_retention_days: number;
  max_storage_mb: number;
}

export interface TenantIntegrations {
  serpro: boolean;
  receita_federal: boolean;
  tse: boolean;
  tse_doacoes: boolean;
  consulta_cnpj: boolean;
}

export interface TenantBilling {
  plan: TenantPlan;
  billing_email?: string;
  contract_start?: string;
  contract_end?: string;
}

export interface TenantBranding {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
}

export interface TenantConfig {
  type: TenantType;
  auto_created?: boolean;
  features: TenantFeatures;
  limits: TenantLimits;
  integrations: TenantIntegrations;
  billing: TenantBilling;
  branding?: TenantBranding;
}

export interface TenantPreferences {
  default_view: string;
  results_per_page: number;
  export_format: string;
  timezone: string;
}

export interface TenantNotifications {
  email_enabled: boolean;
  email_frequency: 'realtime' | 'daily' | 'weekly';
  alert_on_critical_findings: boolean;
  alert_on_quota_limit: boolean;
}

export interface TenantInitialData {
  welcome_message: string;
  onboarding_completed: boolean;
  setup_steps: {
    profile_completed: boolean;
    first_query_done: boolean;
    data_imported: boolean;
    team_invited: boolean;
  };
  notifications: TenantNotifications;
  preferences: TenantPreferences;
}

/**
 * Template FREE - Para tenants pessoais
 */
export const FREE_TEMPLATE: TenantConfig = {
  type: 'personal',
  auto_created: true,
  features: {
    bulk_queries: false,
    api_access: false,
    advanced_analytics: false,
    custom_reports: false,
    data_export: true,
    webhook_notifications: false,
  },
  limits: {
    max_users: 1,
    max_queries_month: 100,
    data_retention_days: 90,
    max_storage_mb: 100,
  },
  integrations: {
    serpro: false,
    receita_federal: true,
    tse: true,
    tse_doacoes: true,
    consulta_cnpj: true,
  },
  billing: {
    plan: 'free',
  },
};

/**
 * Template BASIC - Para pequenas empresas
 */
export const BASIC_TEMPLATE: TenantConfig = {
  type: 'corporate',
  features: {
    bulk_queries: true,
    api_access: false,
    advanced_analytics: true,
    custom_reports: false,
    data_export: true,
    webhook_notifications: false,
  },
  limits: {
    max_users: 5,
    max_queries_month: 1000,
    data_retention_days: 180,
    max_storage_mb: 500,
  },
  integrations: {
    serpro: true,
    receita_federal: true,
    tse: true,
    tse_doacoes: true,
    consulta_cnpj: true,
  },
  billing: {
    plan: 'basic',
  },
};

/**
 * Template PRO - Para médias empresas
 */
export const PRO_TEMPLATE: TenantConfig = {
  type: 'corporate',
  features: {
    bulk_queries: true,
    api_access: true,
    advanced_analytics: true,
    custom_reports: true,
    data_export: true,
    webhook_notifications: true,
  },
  limits: {
    max_users: 20,
    max_queries_month: 5000,
    data_retention_days: 365,
    max_storage_mb: 2000,
  },
  integrations: {
    serpro: true,
    receita_federal: true,
    tse: true,
    tse_doacoes: true,
    consulta_cnpj: true,
  },
  billing: {
    plan: 'pro',
  },
};

/**
 * Template ENTERPRISE - Para grandes organizações
 */
export const ENTERPRISE_TEMPLATE: TenantConfig = {
  type: 'corporate',
  features: {
    bulk_queries: true,
    api_access: true,
    advanced_analytics: true,
    custom_reports: true,
    data_export: true,
    webhook_notifications: true,
  },
  limits: {
    max_users: 100,
    max_queries_month: 50000,
    data_retention_days: 730,
    max_storage_mb: 10000,
  },
  integrations: {
    serpro: true,
    receita_federal: true,
    tse: true,
    tse_doacoes: true,
    consulta_cnpj: true,
  },
  billing: {
    plan: 'enterprise',
  },
  branding: {
    logo_url: '',
    primary_color: '#1976d2',
    secondary_color: '#424242',
  },
};

/**
 * Mapa de templates por plano
 */
export const TENANT_TEMPLATES: Record<TenantPlan, TenantConfig> = {
  free: FREE_TEMPLATE,
  basic: BASIC_TEMPLATE,
  pro: PRO_TEMPLATE,
  enterprise: ENTERPRISE_TEMPLATE,
};

/**
 * Dados iniciais padrão para novo tenant
 */
export const INITIAL_TENANT_DATA: TenantInitialData = {
  welcome_message: 'Bem-vindo ao Investigaree! Comece importando seus dados.',
  onboarding_completed: false,
  setup_steps: {
    profile_completed: false,
    first_query_done: false,
    data_imported: false,
    team_invited: false,
  },
  notifications: {
    email_enabled: true,
    email_frequency: 'daily',
    alert_on_critical_findings: true,
    alert_on_quota_limit: true,
  },
  preferences: {
    default_view: 'dashboard',
    results_per_page: 50,
    export_format: 'xlsx',
    timezone: 'America/Sao_Paulo',
  },
};

/**
 * Retorna o template apropriado para um plano
 */
export function getTemplateForPlan(plan: TenantPlan): TenantConfig {
  return TENANT_TEMPLATES[plan];
}

/**
 * Retorna o template apropriado para um tipo de tenant
 */
export function getTemplateForType(type: TenantType): TenantConfig {
  return type === 'personal' ? FREE_TEMPLATE : BASIC_TEMPLATE;
}

/**
 * Mescla configurações customizadas com template base
 */
export function mergeWithTemplate(
  plan: TenantPlan,
  customConfig?: Partial<TenantConfig>
): TenantConfig {
  const template = getTemplateForPlan(plan);

  if (!customConfig) {
    return template;
  }

  return {
    ...template,
    ...customConfig,
    features: {
      ...template.features,
      ...(customConfig.features || {}),
    },
    limits: {
      ...template.limits,
      ...(customConfig.limits || {}),
    },
    integrations: {
      ...template.integrations,
      ...(customConfig.integrations || {}),
    },
    billing: {
      ...template.billing,
      ...(customConfig.billing || {}),
    },
    branding: customConfig.branding || template.branding,
  };
}
