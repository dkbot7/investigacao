/**
 * Tenant Validation Functions
 *
 * Funções de validação para criação e atualização de tenants
 */

import type { TenantPlan, TenantType } from './templates';

export interface ValidationError {
  field: string;
  message: string;
}

export class TenantValidationError extends Error {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Tenant validation failed');
    this.name = 'TenantValidationError';
    this.errors = errors;
  }
}

/**
 * Valida o código do tenant
 */
export function validateTenantCode(code: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!code) {
    errors.push({ field: 'code', message: 'Código é obrigatório' });
    return errors;
  }

  if (code.length < 3 || code.length > 20) {
    errors.push({
      field: 'code',
      message: 'Código deve ter entre 3 e 20 caracteres',
    });
  }

  if (!/^[A-Z][A-Z0-9_]*$/.test(code)) {
    errors.push({
      field: 'code',
      message:
        'Código deve começar com letra maiúscula e conter apenas letras maiúsculas, números e underscore',
    });
  }

  return errors;
}

/**
 * Valida o nome do tenant
 */
export function validateTenantName(name: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!name) {
    errors.push({ field: 'name', message: 'Nome é obrigatório' });
    return errors;
  }

  if (name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Nome deve ter no mínimo 3 caracteres',
    });
  }

  if (name.length > 100) {
    errors.push({
      field: 'name',
      message: 'Nome deve ter no máximo 100 caracteres',
    });
  }

  return errors;
}

/**
 * Valida o email do tenant
 */
export function validateTenantEmail(email: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!email) {
    errors.push({ field: 'email', message: 'Email é obrigatório' });
    return errors;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Email inválido' });
  }

  return errors;
}

/**
 * Valida o plano do tenant
 */
export function validateTenantPlan(plan: string): ValidationError[] {
  const errors: ValidationError[] = [];

  const validPlans: TenantPlan[] = ['free', 'basic', 'pro', 'enterprise'];

  if (!validPlans.includes(plan as TenantPlan)) {
    errors.push({
      field: 'plan',
      message: `Plano inválido. Valores permitidos: ${validPlans.join(', ')}`,
    });
  }

  return errors;
}

/**
 * Valida o tipo do tenant
 */
export function validateTenantType(type: string): ValidationError[] {
  const errors: ValidationError[] = [];

  const validTypes: TenantType[] = ['personal', 'corporate'];

  if (!validTypes.includes(type as TenantType)) {
    errors.push({
      field: 'type',
      message: `Tipo inválido. Valores permitidos: ${validTypes.join(', ')}`,
    });
  }

  return errors;
}

/**
 * Valida o status do tenant
 */
export function validateTenantStatus(status: string): ValidationError[] {
  const errors: ValidationError[] = [];

  const validStatuses = ['active', 'inactive', 'suspended', 'trial'];

  if (!validStatuses.includes(status)) {
    errors.push({
      field: 'status',
      message: `Status inválido. Valores permitidos: ${validStatuses.join(', ')}`,
    });
  }

  return errors;
}

/**
 * Valida dados completos para criação de tenant pessoal
 */
export function validatePersonalTenantData(data: {
  userId: string;
  userName: string;
  userEmail: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.userId) {
    errors.push({ field: 'userId', message: 'ID do usuário é obrigatório' });
  }

  if (!data.userName) {
    errors.push({ field: 'userName', message: 'Nome do usuário é obrigatório' });
  }

  errors.push(...validateTenantEmail(data.userEmail));

  return errors;
}

/**
 * Valida dados completos para criação de tenant corporativo
 */
export function validateCorporateTenantData(data: {
  code: string;
  name: string;
  email: string;
  plan?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  errors.push(...validateTenantCode(data.code));
  errors.push(...validateTenantName(data.name));
  errors.push(...validateTenantEmail(data.email));

  if (data.plan) {
    errors.push(...validateTenantPlan(data.plan));
  }

  return errors;
}

/**
 * Valida se usuário pode ter acesso ao tenant
 */
export function validateUserRole(role: string): ValidationError[] {
  const errors: ValidationError[] = [];

  const validRoles = ['admin', 'editor', 'viewer'];

  if (!validRoles.includes(role)) {
    errors.push({
      field: 'role',
      message: `Role inválida. Valores permitidos: ${validRoles.join(', ')}`,
    });
  }

  return errors;
}

/**
 * Valida limite de usuários no tenant
 */
export function validateUserLimit(
  currentUsers: number,
  maxUsers: number,
  newUsers: number = 1
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (currentUsers + newUsers > maxUsers) {
    errors.push({
      field: 'users',
      message: `Limite de usuários excedido. Máximo: ${maxUsers}, Atual: ${currentUsers}, Tentando adicionar: ${newUsers}`,
    });
  }

  return errors;
}

/**
 * Valida limite de consultas no tenant
 */
export function validateQueryLimit(
  currentQueries: number,
  maxQueries: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (currentQueries >= maxQueries) {
    errors.push({
      field: 'queries',
      message: `Limite de consultas mensais excedido. Máximo: ${maxQueries}, Atual: ${currentQueries}`,
    });
  }

  return errors;
}

/**
 * Valida limite de storage no tenant
 */
export function validateStorageLimit(
  currentStorageMb: number,
  maxStorageMb: number,
  additionalMb: number = 0
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (currentStorageMb + additionalMb > maxStorageMb) {
    errors.push({
      field: 'storage',
      message: `Limite de armazenamento excedido. Máximo: ${maxStorageMb}MB, Atual: ${currentStorageMb}MB, Adicional: ${additionalMb}MB`,
    });
  }

  return errors;
}

/**
 * Função utilitária para lançar exceção se houver erros
 */
export function throwIfErrors(errors: ValidationError[]): void {
  if (errors.length > 0) {
    throw new TenantValidationError(errors);
  }
}

/**
 * Valida todos os dados de criação de tenant
 */
export function validateTenantCreation(
  data: any,
  type: 'personal' | 'corporate'
): void {
  const errors: ValidationError[] = [];

  if (type === 'personal') {
    errors.push(...validatePersonalTenantData(data));
  } else {
    errors.push(...validateCorporateTenantData(data));
  }

  throwIfErrors(errors);
}
