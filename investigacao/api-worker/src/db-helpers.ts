/**
 * Database Helpers com Tenant Isolation
 *
 * Funções auxiliares para queries que respeitam multi-tenancy
 */

import { Env, AuthContext } from './types';

/**
 * Wrapper para queries SELECT com filtro de tenant automático
 *
 * Exemplo:
 * const investigations = await queryWithTenant(
 *   env,
 *   authContext,
 *   'SELECT * FROM investigations WHERE status = ?',
 *   ['active']
 * );
 */
export async function queryWithTenant<T = any>(
  env: Env,
  authContext: AuthContext,
  sql: string,
  params: any[] = []
): Promise<T[]> {
  // Adicionar filtro de tenant_id automaticamente se a query não tiver
  const hasTenantFilter = sql.toLowerCase().includes('tenant_id');

  let finalSql = sql;
  let finalParams = params;

  if (!hasTenantFilter && !sql.toLowerCase().includes('users') && !sql.toLowerCase().includes('tenants')) {
    // Adicionar WHERE ou AND dependendo se já existe WHERE
    if (sql.toLowerCase().includes('where')) {
      finalSql = sql.replace(/where/i, `WHERE tenant_id = ? AND`);
    } else {
      // Adicionar WHERE antes de GROUP BY, ORDER BY, ou LIMIT
      const insertPosition = sql.search(/\s+(group by|order by|limit)/i);
      if (insertPosition > 0) {
        finalSql = sql.slice(0, insertPosition) + ` WHERE tenant_id = ?` + sql.slice(insertPosition);
      } else {
        finalSql = sql + ` WHERE tenant_id = ?`;
      }
    }

    // Adicionar tenant_id como primeiro parâmetro
    finalParams = [authContext.tenantId, ...params];
  }

  const result = await env.DB.prepare(finalSql).bind(...finalParams).all();
  return result.results as T[];
}

/**
 * Wrapper para queries INSERT que automaticamente adiciona tenant_id
 */
export async function insertWithTenant(
  env: Env,
  authContext: AuthContext,
  table: string,
  data: Record<string, any>
): Promise<string> {
  // Adicionar tenant_id aos dados
  const dataWithTenant = {
    ...data,
    tenant_id: authContext.tenantId
  };

  // Gerar colunas e placeholders
  const columns = Object.keys(dataWithTenant);
  const placeholders = columns.map(() => '?').join(', ');

  const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
  const params = Object.values(dataWithTenant);

  const result = await env.DB.prepare(sql).bind(...params).run();

  // Retornar ID inserido (se houver)
  return result.meta?.last_row_id?.toString() || '';
}

/**
 * Wrapper para queries UPDATE com validação de tenant
 */
export async function updateWithTenant(
  env: Env,
  authContext: AuthContext,
  table: string,
  id: string,
  data: Record<string, any>
): Promise<boolean> {
  // Gerar SET clause
  const setClauses = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const params = [...Object.values(data), authContext.tenantId, id];

  const sql = `UPDATE ${table} SET ${setClauses} WHERE tenant_id = ? AND id = ?`;

  const result = await env.DB.prepare(sql).bind(...params).run();

  return result.meta?.changes ? result.meta.changes > 0 : false;
}

/**
 * Wrapper para queries DELETE com validação de tenant
 */
export async function deleteWithTenant(
  env: Env,
  authContext: AuthContext,
  table: string,
  id: string
): Promise<boolean> {
  const sql = `DELETE FROM ${table} WHERE tenant_id = ? AND id = ?`;

  const result = await env.DB.prepare(sql).bind(authContext.tenantId, id).run();

  return result.meta?.changes ? result.meta.changes > 0 : false;
}

/**
 * Verifica se o usuário tem permissão para ação (baseado em role)
 */
export function hasPermission(authContext: AuthContext, requiredRole: 'admin' | 'editor' | 'viewer'): boolean {
  const roleHierarchy = { admin: 3, editor: 2, viewer: 1 };

  const userLevel = roleHierarchy[authContext.role];
  const requiredLevel = roleHierarchy[requiredRole];

  return userLevel >= requiredLevel;
}

/**
 * Middleware para verificar permissão e retornar erro se não autorizado
 */
export function requirePermission(authContext: AuthContext, requiredRole: 'admin' | 'editor' | 'viewer'): Response | null {
  if (!hasPermission(authContext, requiredRole)) {
    return new Response(JSON.stringify({
      error: 'Forbidden',
      message: `This action requires ${requiredRole} role or higher`
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return null;
}
