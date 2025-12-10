/**
 * Tenant Service
 *
 * Serviço principal para gerenciamento de tenants
 */

import type { D1Database } from '@cloudflare/workers-types';
import { nanoid } from 'nanoid';
import {
  getTemplateForPlan,
  mergeWithTemplate,
  INITIAL_TENANT_DATA,
  type TenantConfig,
  type TenantPlan,
} from './templates';
import {
  validateTenantCreation,
  validateUserRole,
  validateUserLimit,
  throwIfErrors,
  type ValidationError,
} from './validation';

/**
 * Interface para criação de tenant pessoal
 */
export interface CreatePersonalTenantParams {
  userId: string;
  userName: string;
  userEmail: string;
  firebaseUid: string;
}

/**
 * Interface para criação de tenant corporativo
 */
export interface CreateCorporateTenantParams {
  code: string;
  name: string;
  email: string;
  plan?: TenantPlan;
  adminUserId?: string;
  customConfig?: Partial<TenantConfig>;
  serproMode?: 'managed' | 'custom' | 'disabled';
  serproNotes?: string;
}

/**
 * Interface para adicionar usuário ao tenant
 */
export interface GrantTenantAccessParams {
  tenantId: string;
  userId: string;
  role: 'admin' | 'editor' | 'viewer';
  grantedBy: string;
  expiresAt?: string;
}

/**
 * Interface para tenant criado
 */
export interface CreatedTenant {
  id: string;
  code: string;
  name: string;
  email: string;
  firebase_uid: string | null;
  status: string;
  config: string;
  serpro_mode: string;
  serpro_notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Gera um ID único para tenant
 */
function generateTenantId(code: string): string {
  const timestamp = Date.now().toString(36);
  const random = nanoid(6).toLowerCase();
  const cleanCode = code.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `tenant_${cleanCode}_${timestamp}_${random}`;
}

/**
 * Gera um código para tenant pessoal
 */
function generatePersonalTenantCode(userId: string): string {
  const shortId = userId.substring(0, 8).toUpperCase();
  return `USER_${shortId}`;
}

/**
 * Gera um ID para associação user-tenant
 */
function generateUserTenantId(): string {
  return `ut_${nanoid(16)}`;
}

/**
 * Cria um tenant pessoal automaticamente
 */
export async function createPersonalTenant(
  db: D1Database,
  params: CreatePersonalTenantParams
): Promise<CreatedTenant> {
  // Validação
  validateTenantCreation(params, 'personal');

  // Gerar código e ID
  const code = generatePersonalTenantCode(params.userId);
  const tenantId = generateTenantId(code);

  // Aplicar template FREE
  const config = getTemplateForPlan('free');
  config.auto_created = true;

  // Preparar dados do tenant
  const tenantData = {
    id: tenantId,
    code: code,
    name: `${params.userName} (Conta Pessoal)`,
    email: params.userEmail,
    firebase_uid: params.firebaseUid,
    status: 'active',
    config: JSON.stringify(config),
    serpro_mode: 'managed',
    serpro_notes: 'Tenant pessoal criado automaticamente. Entre em contato para ativar consultas.',
  };

  // Inserir tenant
  await db
    .prepare(
      `INSERT INTO tenants (
        id, code, name, email, firebase_uid, status, config, serpro_mode, serpro_notes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    )
    .bind(
      tenantData.id,
      tenantData.code,
      tenantData.name,
      tenantData.email,
      tenantData.firebase_uid,
      tenantData.status,
      tenantData.config,
      tenantData.serpro_mode,
      tenantData.serpro_notes
    )
    .run();

  // Associar usuário como admin
  const userTenantId = generateUserTenantId();
  await db
    .prepare(
      `INSERT INTO user_tenants (
        id, user_id, tenant_id, role, granted_by, is_active,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    )
    .bind(
      userTenantId,
      params.userId,
      tenantData.id,
      'admin',
      'system',
      1
    )
    .run();

  // Buscar tenant criado
  const tenant = await db
    .prepare('SELECT * FROM tenants WHERE id = ?')
    .bind(tenantData.id)
    .first<CreatedTenant>();

  if (!tenant) {
    throw new Error('Falha ao criar tenant pessoal');
  }

  return tenant;
}

/**
 * Cria um tenant corporativo
 */
export async function createCorporateTenant(
  db: D1Database,
  params: CreateCorporateTenantParams
): Promise<CreatedTenant> {
  // Validação
  validateTenantCreation(params, 'corporate');

  // Verificar se código já existe
  const existingTenant = await db
    .prepare('SELECT id FROM tenants WHERE code = ?')
    .bind(params.code)
    .first();

  if (existingTenant) {
    const errors: ValidationError[] = [
      {
        field: 'code',
        message: `Código ${params.code} já está em uso`,
      },
    ];
    throwIfErrors(errors);
  }

  // Verificar se email já existe
  const existingEmail = await db
    .prepare('SELECT id FROM tenants WHERE email = ?')
    .bind(params.email)
    .first();

  if (existingEmail) {
    const errors: ValidationError[] = [
      {
        field: 'email',
        message: `Email ${params.email} já está em uso`,
      },
    ];
    throwIfErrors(errors);
  }

  // Gerar ID
  const tenantId = generateTenantId(params.code);

  // Aplicar template do plano
  const plan = params.plan || 'basic';
  const config = mergeWithTemplate(plan, params.customConfig);

  // Preparar dados do tenant
  const tenantData = {
    id: tenantId,
    code: params.code,
    name: params.name,
    email: params.email,
    firebase_uid: null,
    status: 'active',
    config: JSON.stringify(config),
    serpro_mode: params.serproMode || 'managed',
    serpro_notes: params.serproNotes || 'Aguardando configuração',
  };

  // Inserir tenant
  await db
    .prepare(
      `INSERT INTO tenants (
        id, code, name, email, firebase_uid, status, config, serpro_mode, serpro_notes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    )
    .bind(
      tenantData.id,
      tenantData.code,
      tenantData.name,
      tenantData.email,
      tenantData.firebase_uid,
      tenantData.status,
      tenantData.config,
      tenantData.serpro_mode,
      tenantData.serpro_notes
    )
    .run();

  // Se foi fornecido um admin, associar
  if (params.adminUserId) {
    await grantTenantAccess(db, {
      tenantId: tenantData.id,
      userId: params.adminUserId,
      role: 'admin',
      grantedBy: 'system',
    });
  }

  // Buscar tenant criado
  const tenant = await db
    .prepare('SELECT * FROM tenants WHERE id = ?')
    .bind(tenantData.id)
    .first<CreatedTenant>();

  if (!tenant) {
    throw new Error('Falha ao criar tenant corporativo');
  }

  return tenant;
}

/**
 * Concede acesso de usuário a um tenant
 */
export async function grantTenantAccess(
  db: D1Database,
  params: GrantTenantAccessParams
): Promise<void> {
  // Validar role
  const roleErrors = validateUserRole(params.role);
  throwIfErrors(roleErrors);

  // Verificar se tenant existe
  const tenant = await db
    .prepare('SELECT id, config FROM tenants WHERE id = ?')
    .bind(params.tenantId)
    .first<{ id: string; config: string }>();

  if (!tenant) {
    const errors: ValidationError[] = [
      {
        field: 'tenantId',
        message: 'Tenant não encontrado',
      },
    ];
    throwIfErrors(errors);
  }

  // Verificar limite de usuários
  const config: TenantConfig = JSON.parse(tenant.config);
  const currentUsers = await db
    .prepare(
      'SELECT COUNT(*) as count FROM user_tenants WHERE tenant_id = ? AND is_active = 1'
    )
    .bind(params.tenantId)
    .first<{ count: number }>();

  const userLimitErrors = validateUserLimit(
    currentUsers?.count || 0,
    config.limits.max_users
  );
  throwIfErrors(userLimitErrors);

  // Verificar se associação já existe
  const existingAssoc = await db
    .prepare(
      'SELECT id, is_active FROM user_tenants WHERE user_id = ? AND tenant_id = ?'
    )
    .bind(params.userId, params.tenantId)
    .first<{ id: string; is_active: number }>();

  if (existingAssoc) {
    // Atualizar associação existente
    await db
      .prepare(
        `UPDATE user_tenants
         SET role = ?, is_active = 1, expires_at = ?, updated_at = datetime('now')
         WHERE id = ?`
      )
      .bind(params.role, params.expiresAt || null, existingAssoc.id)
      .run();
  } else {
    // Criar nova associação
    const userTenantId = generateUserTenantId();
    await db
      .prepare(
        `INSERT INTO user_tenants (
          id, user_id, tenant_id, role, granted_by, expires_at, is_active,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`
      )
      .bind(
        userTenantId,
        params.userId,
        params.tenantId,
        params.role,
        params.grantedBy,
        params.expiresAt || null
      )
      .run();
  }
}

/**
 * Revoga acesso de usuário a um tenant
 */
export async function revokeTenantAccess(
  db: D1Database,
  userId: string,
  tenantId: string
): Promise<void> {
  await db
    .prepare(
      `UPDATE user_tenants
       SET is_active = 0, updated_at = datetime('now')
       WHERE user_id = ? AND tenant_id = ?`
    )
    .bind(userId, tenantId)
    .run();
}

/**
 * Atualiza o plano de um tenant
 */
export async function updateTenantPlan(
  db: D1Database,
  tenantId: string,
  newPlan: TenantPlan,
  customConfig?: Partial<TenantConfig>
): Promise<void> {
  // Buscar tenant atual
  const tenant = await db
    .prepare('SELECT config FROM tenants WHERE id = ?')
    .bind(tenantId)
    .first<{ config: string }>();

  if (!tenant) {
    const errors: ValidationError[] = [
      {
        field: 'tenantId',
        message: 'Tenant não encontrado',
      },
    ];
    throwIfErrors(errors);
  }

  // Gerar nova configuração
  const currentConfig: TenantConfig = JSON.parse(tenant.config);
  const newConfig = mergeWithTemplate(newPlan, {
    ...customConfig,
    type: currentConfig.type,
    auto_created: currentConfig.auto_created,
  });

  // Atualizar tenant
  await db
    .prepare(
      `UPDATE tenants
       SET config = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
    .bind(JSON.stringify(newConfig), tenantId)
    .run();
}

/**
 * Lista todos os tenants de um usuário
 */
export async function getUserTenants(
  db: D1Database,
  userId: string
): Promise<any[]> {
  const result = await db
    .prepare(
      `SELECT
        t.*,
        ut.role,
        ut.is_active,
        ut.expires_at
      FROM tenants t
      INNER JOIN user_tenants ut ON t.id = ut.tenant_id
      WHERE ut.user_id = ? AND ut.is_active = 1
      ORDER BY
        CASE WHEN t.firebase_uid = (SELECT firebase_uid FROM users WHERE id = ?) THEN 0 ELSE 1 END,
        t.created_at DESC`
    )
    .bind(userId, userId)
    .all();

  return result.results || [];
}

/**
 * Busca um tenant por ID
 */
export async function getTenantById(
  db: D1Database,
  tenantId: string
): Promise<CreatedTenant | null> {
  const tenant = await db
    .prepare('SELECT * FROM tenants WHERE id = ?')
    .bind(tenantId)
    .first<CreatedTenant>();

  return tenant;
}

/**
 * Busca um tenant por código
 */
export async function getTenantByCode(
  db: D1Database,
  code: string
): Promise<CreatedTenant | null> {
  const tenant = await db
    .prepare('SELECT * FROM tenants WHERE code = ?')
    .bind(code)
    .first<CreatedTenant>();

  return tenant;
}

/**
 * Verifica se usuário tem acesso a um tenant
 */
export async function userHasAccessToTenant(
  db: D1Database,
  userId: string,
  tenantId: string
): Promise<boolean> {
  const access = await db
    .prepare(
      `SELECT id FROM user_tenants
       WHERE user_id = ? AND tenant_id = ? AND is_active = 1`
    )
    .bind(userId, tenantId)
    .first();

  return !!access;
}

/**
 * Obtém a role do usuário em um tenant
 */
export async function getUserRoleInTenant(
  db: D1Database,
  userId: string,
  tenantId: string
): Promise<string | null> {
  const access = await db
    .prepare(
      `SELECT role FROM user_tenants
       WHERE user_id = ? AND tenant_id = ? AND is_active = 1`
    )
    .bind(userId, tenantId)
    .first<{ role: string }>();

  return access?.role || null;
}

/**
 * Exporta todas as funções do serviço
 */
export const TenantService = {
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
};
