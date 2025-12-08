/**
 * Script para criar tenant pessoal para usuário existente
 *
 * Uso: node scripts/create-personal-tenant.js <user_email> [revoke_existing]
 *
 * Exemplo:
 * node scripts/create-personal-tenant.js ibsenmaciel@gmail.com true
 */

const API_URL = process.env.API_URL || 'https://api.investigaree.com.br';

async function createPersonalTenant(userEmail, revokeExisting = false) {
  try {
    console.log(`\n🚀 Criando tenant pessoal para: ${userEmail}`);
    console.log(`   Revogar acessos existentes: ${revokeExisting ? 'SIM' : 'NÃO'}\n`);

    const response = await fetch(`${API_URL}/api/tenants/create-personal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Nota: Em produção, seria necessário um token de autenticação admin
        // Para este script de teste, assumimos que o endpoint aceita chamadas diretas
      },
      body: JSON.stringify({
        user_email: userEmail,
        revoke_existing_access: revokeExisting
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro:', data.error);
      if (data.details) {
        console.error('   Detalhes:', data.details);
      }
      process.exit(1);
    }

    console.log('✅ Sucesso!');
    console.log('\n📋 Detalhes do tenant criado:');
    console.log(`   ID: ${data.tenant.id}`);
    console.log(`   Code: ${data.tenant.code}`);
    console.log(`   Name: ${data.tenant.name}`);

    if (data.revoked_count > 0) {
      console.log(`\n🔒 Acessos revogados: ${data.revoked_count} tenant(s)`);
    }

    console.log(`\n💬 ${data.message}\n`);

  } catch (error) {
    console.error('❌ Erro ao criar tenant pessoal:', error.message);
    process.exit(1);
  }
}

// Parse argumentos
const userEmail = process.argv[2];
const revokeExisting = process.argv[3] === 'true';

if (!userEmail) {
  console.error('❌ Uso: node scripts/create-personal-tenant.js <user_email> [revoke_existing]');
  console.error('   Exemplo: node scripts/create-personal-tenant.js ibsenmaciel@gmail.com true');
  process.exit(1);
}

createPersonalTenant(userEmail, revokeExisting);
