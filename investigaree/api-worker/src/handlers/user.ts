/**
 * User Management Handlers
 *
 * Endpoints para informações e gerenciamento de usuários
 */

import { Env, AuthContext } from '../types';

/**
 * GET /api/user/tenant-info
 *
 * Retorna informações do tenant do usuário autenticado
 * Inclui dados do tenant, lista de tenants (se multi-tenant), e permissões
 */
export async function handleGetTenantInfo(
  request: Request,
  env: Env,
  authContext: AuthContext
): Promise<Response> {
  try {
    // Buscar dados do tenant no D1
    const tenantResult = await env.DB.prepare(`
      SELECT id, code, name, status, created_at
      FROM tenants
      WHERE id = ?
      LIMIT 1
    `).bind(authContext.tenantId).first();

    if (!tenantResult) {
      return new Response(JSON.stringify({
        error: 'Tenant not found',
        message: 'O tenant associado ao usuário não foi encontrado'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Buscar todos os tenants do usuário (caso seja multi-tenant)
    // Por enquanto, retorna apenas o tenant atual
    const userTenants = [
      {
        id: tenantResult.id as string,
        code: tenantResult.code as string,
        name: tenantResult.name as string,
        status: tenantResult.status as string
      }
    ];

    // Montar resposta
    const tenantInfo = {
      hasAccess: true,
      tenant: {
        id: tenantResult.id as string,
        code: tenantResult.code as string,
        name: tenantResult.name as string,
        status: tenantResult.status as string,
        email: authContext.email
      },
      tenants: userTenants,
      user: {
        uid: authContext.uid,
        email: authContext.email,
        role: authContext.role,
        userId: authContext.userId
      }
    };

    return new Response(JSON.stringify(tenantInfo), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[User] Erro ao buscar tenant info:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/user/profile
 *
 * Retorna perfil completo do usuário
 */
export async function handleGetProfile(
  request: Request,
  env: Env,
  authContext: AuthContext
): Promise<Response> {
  try {
    const userResult = await env.DB.prepare(`
      SELECT id, firebase_uid, email, nome, avatar_url, tenant_id, role, created_at, updated_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `).bind(authContext.userId).first();

    if (!userResult) {
      return new Response(JSON.stringify({
        error: 'User not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(userResult), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[User] Erro ao buscar profile:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * PUT /api/user/profile
 *
 * Atualiza perfil do usuário
 */
export async function handleUpdateProfile(
  request: Request,
  env: Env,
  authContext: AuthContext
): Promise<Response> {
  try {
    const body = await request.json();
    const { nome, avatar_url } = body;

    // Validar campos
    const updates: string[] = [];
    const params: any[] = [];

    if (nome !== undefined) {
      updates.push('nome = ?');
      params.push(nome);
    }

    if (avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      params.push(avatar_url);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({
        error: 'No fields to update'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Adicionar updated_at
    updates.push("updated_at = datetime('now')");

    // Adicionar user ID
    params.push(authContext.userId);

    // Executar update
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await env.DB.prepare(sql).bind(...params).run();

    // Buscar usuário atualizado
    const updatedUser = await env.DB.prepare(`
      SELECT id, firebase_uid, email, nome, avatar_url, tenant_id, role, created_at, updated_at
      FROM users
      WHERE id = ?
    `).bind(authContext.userId).first();

    return new Response(JSON.stringify(updatedUser), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[User] Erro ao atualizar profile:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
