/**
 * SERPRO Credentials Management Routes
 *
 * Permite que tenants (admin) configurem suas credenciais SERPRO
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth';
import type { Env, AuthenticatedUser } from '../types/api.types';
import { logger } from '../utils/logger';
import { encrypt, decrypt } from '../utils/encryption';

const router = new Hono<{ Bindings: Env }>();

/**
 * GET /api/admin/serpro-credentials/:tenant_id
 *
 * Lista todas as credenciais SERPRO configuradas para um tenant
 * (Não retorna secrets, apenas status)
 */
router.get('/:tenant_id', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const tenantId = c.req.param('tenant_id');

    // Buscar tenant e modo
    const tenant = await c.env.DB.prepare(
      'SELECT serpro_mode, serpro_notes FROM tenants WHERE id = ?'
    ).bind(tenantId).first();

    if (!tenant) {
      return c.json({ success: false, error: 'Tenant não encontrado' }, 404);
    }

    // Buscar credenciais (sem secrets!)
    const { results: credentials } = await c.env.DB.prepare(`
      SELECT
        id, api_name, consumer_key,
        environment, is_active,
        last_validated_at, validation_error,
        created_at, updated_at
      FROM tenant_serpro_credentials
      WHERE tenant_id = ?
      ORDER BY api_name
    `).bind(tenantId).all();

    return c.json({
      success: true,
      tenant_id: tenantId,
      mode: tenant.serpro_mode,
      notes: tenant.serpro_notes,
      credentials: credentials,
      apis_available: [
        'cpf', 'cnpj', 'divida-ativa', 'renda',
        'faturamento', 'datavalid', 'cnd',
        'integra-contador', 'raiz-tech'
      ]
    });
  } catch (error: any) {
    logger.error('Error listing SERPRO credentials', error);
    return c.json({
      success: false,
      error: 'Erro ao listar credenciais',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/admin/serpro-credentials/:tenant_id
 *
 * Configura/atualiza credenciais SERPRO para um tenant
 *
 * Body: {
 *   api_name: 'cpf' | 'cnpj' | ...,
 *   consumer_key: string,
 *   consumer_secret: string,
 *   environment: 'trial' | 'production'
 * }
 */
router.post('/:tenant_id', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const tenantId = c.req.param('tenant_id');
    const { api_name, consumer_key, consumer_secret, environment } = await c.req.json();

    // Validações
    if (!api_name || !consumer_key || !consumer_secret) {
      return c.json({
        success: false,
        error: 'Campos obrigatórios: api_name, consumer_key, consumer_secret'
      }, 400);
    }

    const validApis = ['cpf', 'cnpj', 'divida-ativa', 'renda', 'faturamento',
                       'datavalid', 'cnd', 'integra-contador', 'raiz-tech'];
    if (!validApis.includes(api_name)) {
      return c.json({
        success: false,
        error: `API inválida. Válidas: ${validApis.join(', ')}`
      }, 400);
    }

    // Criptografar secret
    const masterKey = c.env.ENCRYPTION_MASTER_KEY;
    if (!masterKey) {
      return c.json({
        success: false,
        error: 'Sistema de criptografia não configurado'
      }, 500);
    }

    const encryptedSecret = await encrypt(consumer_secret, masterKey);

    // Verificar se já existe
    const existing = await c.env.DB.prepare(
      'SELECT id FROM tenant_serpro_credentials WHERE tenant_id = ? AND api_name = ?'
    ).bind(tenantId, api_name).first();

    if (existing) {
      // Update
      await c.env.DB.prepare(`
        UPDATE tenant_serpro_credentials
        SET consumer_key = ?, consumer_secret_encrypted = ?,
            environment = ?, updated_at = datetime('now'),
            validation_error = NULL
        WHERE tenant_id = ? AND api_name = ?
      `).bind(consumer_key, encryptedSecret, environment || 'production', tenantId, api_name).run();

      logger.info('SERPRO credentials updated', { tenant_id: tenantId, api_name });
    } else {
      // Insert
      const id = crypto.randomUUID();
      await c.env.DB.prepare(`
        INSERT INTO tenant_serpro_credentials
        (id, tenant_id, api_name, consumer_key, consumer_secret_encrypted, environment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(id, tenantId, api_name, consumer_key, encryptedSecret, environment || 'production').run();

      logger.info('SERPRO credentials created', { tenant_id: tenantId, api_name });
    }

    // Audit log
    const user = c.get('user') as AuthenticatedUser;
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (userRecord) {
      await c.env.DB.prepare(`
        INSERT INTO serpro_credentials_audit
        (id, tenant_id, api_name, action, performed_by, new_value, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        crypto.randomUUID(),
        tenantId,
        api_name,
        existing ? 'updated' : 'created',
        userRecord.id,
        JSON.stringify({ consumer_key, environment })
      ).run();
    }

    return c.json({
      success: true,
      message: 'Credenciais SERPRO salvas com sucesso',
      api_name
    }, existing ? 200 : 201);

  } catch (error: any) {
    logger.error('Error saving SERPRO credentials', error);
    return c.json({
      success: false,
      error: 'Erro ao salvar credenciais',
      details: error.message
    }, 500);
  }
});

/**
 * PUT /api/admin/serpro-credentials/:tenant_id/mode
 *
 * Alterna o modo do tenant entre 'managed' e 'byo'
 *
 * Body: { mode: 'managed' | 'byo' }
 */
router.put('/:tenant_id/mode', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const tenantId = c.req.param('tenant_id');
    const { mode } = await c.req.json();

    if (!['managed', 'byo'].includes(mode)) {
      return c.json({
        success: false,
        error: 'Modo inválido. Use: managed ou byo'
      }, 400);
    }

    await c.env.DB.prepare(`
      UPDATE tenants
      SET serpro_mode = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(mode, tenantId).run();

    logger.info('Tenant SERPRO mode changed', { tenant_id: tenantId, mode });

    return c.json({
      success: true,
      message: `Modo alterado para: ${mode}`,
      mode
    });

  } catch (error: any) {
    logger.error('Error changing SERPRO mode', error);
    return c.json({
      success: false,
      error: 'Erro ao alterar modo',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/admin/serpro-credentials/:tenant_id/:api_name/validate
 *
 * Valida se as credenciais SERPRO estão funcionando
 * (Faz uma requisição de teste para obter token)
 */
router.post('/:tenant_id/:api_name/validate', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const tenantId = c.req.param('tenant_id');
    const apiName = c.req.param('api_name');

    // Buscar credenciais
    const creds = await c.env.DB.prepare(`
      SELECT consumer_key, consumer_secret_encrypted
      FROM tenant_serpro_credentials
      WHERE tenant_id = ? AND api_name = ?
    `).bind(tenantId, apiName).first();

    if (!creds) {
      return c.json({
        success: false,
        error: 'Credenciais não encontradas'
      }, 404);
    }

    // Descriptografar
    const masterKey = c.env.ENCRYPTION_MASTER_KEY;
    const consumerSecret = await decrypt(creds.consumer_secret_encrypted as string, masterKey);

    // Testar OAuth2
    const baseUrl = apiName === 'cpf' ? 'https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v1' :
                    apiName === 'cnpj' ? 'https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2' :
                    'https://gateway.apiserpro.serpro.gov.br';

    const tokenUrl = `${baseUrl}/token`;
    const credentials = btoa(`${creds.consumer_key}:${consumerSecret}`);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (response.ok) {
      // Sucesso: atualizar timestamp
      await c.env.DB.prepare(`
        UPDATE tenant_serpro_credentials
        SET last_validated_at = datetime('now'), validation_error = NULL
        WHERE tenant_id = ? AND api_name = ?
      `).bind(tenantId, apiName).run();

      return c.json({
        success: true,
        message: 'Credenciais válidas! Token obtido com sucesso.',
        validated_at: new Date().toISOString()
      });
    } else {
      const errorText = await response.text();

      // Falha: registrar erro
      await c.env.DB.prepare(`
        UPDATE tenant_serpro_credentials
        SET last_validated_at = datetime('now'),
            validation_error = ?
        WHERE tenant_id = ? AND api_name = ?
      `).bind(`Status ${response.status}: ${errorText}`, tenantId, apiName).run();

      return c.json({
        success: false,
        error: 'Credenciais inválidas',
        details: `${response.status} ${response.statusText}: ${errorText}`
      }, 400);
    }

  } catch (error: any) {
    logger.error('Error validating SERPRO credentials', error);
    return c.json({
      success: false,
      error: 'Erro ao validar credenciais',
      details: error.message
    }, 500);
  }
});

/**
 * DELETE /api/admin/serpro-credentials/:tenant_id/:api_name
 *
 * Remove credenciais SERPRO de um tenant
 */
router.delete('/:tenant_id/:api_name', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const tenantId = c.req.param('tenant_id');
    const apiName = c.req.param('api_name');

    await c.env.DB.prepare(`
      DELETE FROM tenant_serpro_credentials
      WHERE tenant_id = ? AND api_name = ?
    `).bind(tenantId, apiName).run();

    logger.info('SERPRO credentials deleted', { tenant_id: tenantId, api_name: apiName });

    return c.json({
      success: true,
      message: 'Credenciais removidas com sucesso'
    });

  } catch (error: any) {
    logger.error('Error deleting SERPRO credentials', error);
    return c.json({
      success: false,
      error: 'Erro ao remover credenciais',
      details: error.message
    }, 500);
  }
});

export default router;
