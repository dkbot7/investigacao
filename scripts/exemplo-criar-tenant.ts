/**
 * Script de Exemplo - Criar Tenant
 *
 * Demonstra como usar o TenantService para criar tenants
 *
 * NOTA: Este é um arquivo de exemplo. Para executar em produção,
 * adapte para o contexto da sua API/worker.
 */

import type { D1Database } from '@cloudflare/workers-types';
import {
  TenantService,
  type CreatePersonalTenantParams,
  type CreateCorporateTenantParams,
} from '../backend/workers/api/src/services/tenant';

/**
 * Exemplo 1: Criar Tenant Pessoal
 *
 * Usado quando um novo usuário se registra no sistema
 */
async function exemploCreatePersonalTenant(db: D1Database) {
  console.log('=== Criando Tenant Pessoal ===');

  const params: CreatePersonalTenantParams = {
    userId: 'user_abc123def456',
    userName: 'João Silva',
    userEmail: 'joao.silva@email.com',
    firebaseUid: 'firebase_xyz789',
  };

  try {
    const tenant = await TenantService.createPersonalTenant(db, params);

    console.log('✅ Tenant pessoal criado com sucesso!');
    console.log('ID:', tenant.id);
    console.log('Código:', tenant.code);
    console.log('Nome:', tenant.name);
    console.log('Status:', tenant.status);
    console.log('Config:', JSON.parse(tenant.config));

    return tenant;
  } catch (error: any) {
    console.error('❌ Erro ao criar tenant pessoal:', error.message);
    if (error.errors) {
      console.error('Erros de validação:', error.errors);
    }
    throw error;
  }
}

/**
 * Exemplo 2: Criar Tenant Corporativo - Plano Basic
 */
async function exemploCreateCorporateBasic(db: D1Database) {
  console.log('=== Criando Tenant Corporativo (Basic) ===');

  const params: CreateCorporateTenantParams = {
    code: 'EMPRESA_EXEMPLO',
    name: 'Empresa Exemplo Ltda',
    email: 'contato@empresaexemplo.com.br',
    plan: 'basic',
    adminUserId: 'user_admin123',
    serproMode: 'managed',
    serproNotes: 'Aguardando ativação de consultas SERPRO',
  };

  try {
    const tenant = await TenantService.createCorporateTenant(db, params);

    console.log('✅ Tenant corporativo criado com sucesso!');
    console.log('ID:', tenant.id);
    console.log('Código:', tenant.code);
    console.log('Nome:', tenant.name);
    console.log('Plano:', JSON.parse(tenant.config).billing.plan);

    return tenant;
  } catch (error: any) {
    console.error('❌ Erro ao criar tenant corporativo:', error.message);
    if (error.errors) {
      console.error('Erros de validação:', error.errors);
    }
    throw error;
  }
}

/**
 * Exemplo 3: Criar Tenant Corporativo - Plano Enterprise com Customizações
 */
async function exemploCreateCorporateEnterprise(db: D1Database) {
  console.log('=== Criando Tenant Corporativo (Enterprise + Custom) ===');

  const params: CreateCorporateTenantParams = {
    code: 'GRANDE_CORP',
    name: 'Grande Corporação S.A.',
    email: 'ti@grandecorp.com.br',
    plan: 'enterprise',
    adminUserId: 'user_admin_corp',
    customConfig: {
      // Customizar limites além do template enterprise
      limits: {
        max_users: 200, // Mais que os 100 do template
        max_queries_month: 100000,
        data_retention_days: 1095, // 3 anos
        max_storage_mb: 50000, // 50GB
      },
      // Customizar branding
      branding: {
        logo_url: 'https://grandecorp.com.br/logo.png',
        primary_color: '#0066CC',
        secondary_color: '#333333',
      },
    },
    serproMode: 'custom',
    serproNotes: 'Credenciais próprias configuradas. Ambiente produção.',
  };

  try {
    const tenant = await TenantService.createCorporateTenant(db, params);

    console.log('✅ Tenant enterprise criado com sucesso!');
    console.log('ID:', tenant.id);
    console.log('Código:', tenant.code);
    console.log('Nome:', tenant.name);

    const config = JSON.parse(tenant.config);
    console.log('Plano:', config.billing.plan);
    console.log('Limites customizados:', config.limits);
    console.log('Branding:', config.branding);

    return tenant;
  } catch (error: any) {
    console.error('❌ Erro ao criar tenant enterprise:', error.message);
    if (error.errors) {
      console.error('Erros de validação:', error.errors);
    }
    throw error;
  }
}

/**
 * Exemplo 4: Adicionar Usuários ao Tenant
 */
async function exemploAdicionarUsuarios(db: D1Database, tenantId: string) {
  console.log('=== Adicionando Usuários ao Tenant ===');

  // Adicionar editor
  try {
    await TenantService.grantTenantAccess(db, {
      tenantId: tenantId,
      userId: 'user_editor_001',
      role: 'editor',
      grantedBy: 'user_admin123',
    });
    console.log('✅ Editor adicionado');
  } catch (error: any) {
    console.error('❌ Erro ao adicionar editor:', error.message);
  }

  // Adicionar viewer
  try {
    await TenantService.grantTenantAccess(db, {
      tenantId: tenantId,
      userId: 'user_viewer_001',
      role: 'viewer',
      grantedBy: 'user_admin123',
    });
    console.log('✅ Viewer adicionado');
  } catch (error: any) {
    console.error('❌ Erro ao adicionar viewer:', error.message);
  }

  // Adicionar viewer temporário (expira em 30 dias)
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    await TenantService.grantTenantAccess(db, {
      tenantId: tenantId,
      userId: 'user_temp_001',
      role: 'viewer',
      grantedBy: 'user_admin123',
      expiresAt: expirationDate.toISOString(),
    });
    console.log('✅ Viewer temporário adicionado (expira em 30 dias)');
  } catch (error: any) {
    console.error('❌ Erro ao adicionar viewer temporário:', error.message);
  }
}

/**
 * Exemplo 5: Listar Tenants do Usuário
 */
async function exemploListarTenantsUsuario(db: D1Database, userId: string) {
  console.log('=== Listando Tenants do Usuário ===');

  try {
    const tenants = await TenantService.getUserTenants(db, userId);

    console.log(`✅ Encontrados ${tenants.length} tenant(s)`);

    tenants.forEach((tenant, index) => {
      console.log(`\n--- Tenant ${index + 1} ---`);
      console.log('Código:', tenant.code);
      console.log('Nome:', tenant.name);
      console.log('Role:', tenant.role);
      console.log('Status:', tenant.status);

      const config = JSON.parse(tenant.config);
      console.log('Plano:', config.billing.plan);
      console.log('Tipo:', config.type);
    });

    return tenants;
  } catch (error: any) {
    console.error('❌ Erro ao listar tenants:', error.message);
    throw error;
  }
}

/**
 * Exemplo 6: Atualizar Plano do Tenant (Upgrade)
 */
async function exemploUpgradeTenant(db: D1Database, tenantId: string) {
  console.log('=== Fazendo Upgrade do Tenant ===');

  try {
    // Buscar tenant atual
    const tenant = await TenantService.getTenantById(db, tenantId);
    if (!tenant) {
      throw new Error('Tenant não encontrado');
    }

    const configAtual = JSON.parse(tenant.config);
    console.log('Plano atual:', configAtual.billing.plan);

    // Fazer upgrade para PRO
    await TenantService.updateTenantPlan(db, tenantId, 'pro');

    // Verificar atualização
    const tenantAtualizado = await TenantService.getTenantById(db, tenantId);
    if (tenantAtualizado) {
      const novoConfig = JSON.parse(tenantAtualizado.config);
      console.log('✅ Upgrade realizado!');
      console.log('Novo plano:', novoConfig.billing.plan);
      console.log('Novos limites:', novoConfig.limits);
    }
  } catch (error: any) {
    console.error('❌ Erro ao fazer upgrade:', error.message);
    throw error;
  }
}

/**
 * Exemplo 7: Verificar Acesso do Usuário
 */
async function exemploVerificarAcesso(
  db: D1Database,
  userId: string,
  tenantId: string
) {
  console.log('=== Verificando Acesso do Usuário ===');

  try {
    const hasAccess = await TenantService.userHasAccessToTenant(
      db,
      userId,
      tenantId
    );

    if (hasAccess) {
      const role = await TenantService.getUserRoleInTenant(db, userId, tenantId);
      console.log('✅ Usuário tem acesso');
      console.log('Role:', role);
    } else {
      console.log('❌ Usuário NÃO tem acesso');
    }

    return hasAccess;
  } catch (error: any) {
    console.error('❌ Erro ao verificar acesso:', error.message);
    throw error;
  }
}

/**
 * Exemplo 8: Revogar Acesso
 */
async function exemploRevogarAcesso(
  db: D1Database,
  userId: string,
  tenantId: string
) {
  console.log('=== Revogando Acesso do Usuário ===');

  try {
    await TenantService.revokeTenantAccess(db, userId, tenantId);
    console.log('✅ Acesso revogado com sucesso');
  } catch (error: any) {
    console.error('❌ Erro ao revogar acesso:', error.message);
    throw error;
  }
}

/**
 * Função principal de demonstração
 */
async function main(db: D1Database) {
  console.log('================================================');
  console.log('  DEMONSTRAÇÃO - TENANT SERVICE');
  console.log('================================================\n');

  try {
    // 1. Criar tenant pessoal
    const tenantPessoal = await exemploCreatePersonalTenant(db);
    console.log('\n');

    // 2. Criar tenant corporativo basic
    const tenantBasic = await exemploCreateCorporateBasic(db);
    console.log('\n');

    // 3. Criar tenant enterprise customizado
    const tenantEnterprise = await exemploCreateCorporateEnterprise(db);
    console.log('\n');

    // 4. Adicionar usuários ao tenant basic
    await exemploAdicionarUsuarios(db, tenantBasic.id);
    console.log('\n');

    // 5. Listar tenants de um usuário
    await exemploListarTenantsUsuario(db, 'user_admin123');
    console.log('\n');

    // 6. Fazer upgrade de tenant
    await exemploUpgradeTenant(db, tenantBasic.id);
    console.log('\n');

    // 7. Verificar acesso
    await exemploVerificarAcesso(db, 'user_editor_001', tenantBasic.id);
    console.log('\n');

    // 8. Revogar acesso
    await exemploRevogarAcesso(db, 'user_temp_001', tenantBasic.id);
    console.log('\n');

    console.log('================================================');
    console.log('  ✅ TODAS AS DEMONSTRAÇÕES CONCLUÍDAS!');
    console.log('================================================');
  } catch (error) {
    console.error('\n❌ Erro durante demonstração:', error);
  }
}

// Exportar para uso em outros scripts
export {
  exemploCreatePersonalTenant,
  exemploCreateCorporateBasic,
  exemploCreateCorporateEnterprise,
  exemploAdicionarUsuarios,
  exemploListarTenantsUsuario,
  exemploUpgradeTenant,
  exemploVerificarAcesso,
  exemploRevogarAcesso,
  main,
};

/**
 * USO:
 *
 * Em uma rota Hono (por exemplo):
 *
 * app.post('/api/admin/tenants/create', async (c) => {
 *   const db = c.env.DB;
 *   const { type, ...params } = await c.req.json();
 *
 *   if (type === 'personal') {
 *     const tenant = await TenantService.createPersonalTenant(db, params);
 *     return c.json(tenant);
 *   } else {
 *     const tenant = await TenantService.createCorporateTenant(db, params);
 *     return c.json(tenant);
 *   }
 * });
 */
