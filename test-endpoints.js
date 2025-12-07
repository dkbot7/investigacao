// Script para testar endpoints admin
const endpoints = [
  '/api/admin/stats',
  '/api/admin/users',
  '/api/admin/tenants',
  '/api/admin/pending-users',
  '/api/admin/alerts',
];

async function testEndpoint(url) {
  try {
    const response = await fetch(`http://localhost:3000${url}`, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });

    const data = await response.json();
    console.log(`\n✅ ${url}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Data:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');

    return { url, status: response.status, success: response.ok };
  } catch (error) {
    console.log(`\n❌ ${url}`);
    console.log(`   Error:`, error.message);
    return { url, success: false, error: error.message };
  }
}

async function main() {
  console.log('🧪 Testando endpoints do Admin Panel...\n');
  console.log('='.repeat(50));

  const results = [];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay entre requests
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Resumo:');
  const successful = results.filter(r => r.success).length;
  console.log(`   ${successful}/${results.length} endpoints funcionando`);

  if (successful === results.length) {
    console.log('\n✅ Todos os endpoints estão respondendo com dados mock!');
    console.log('\nPróximo passo: Conectar ao backend D1 real em Cloudflare Workers');
  }
}

main();
