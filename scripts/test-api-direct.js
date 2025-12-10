/**
 * Test API endpoint directly without auth to see structure
 */

const API_URL = 'https://api.investigaree.com.br';

async function testHealth() {
  try {
    console.log('📤 Testing health endpoint...');
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ Health:', data);
  } catch (error) {
    console.error('❌ Health failed:', error.message);
  }
}

async function testRoot() {
  try {
    console.log('\n📤 Testing root endpoint...');
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    console.log('✅ Root:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Root failed:', error.message);
  }
}

async function checkDatabase() {
  console.log('\n📊 Checking database for investigation...');
  const { execSync } = require('child_process');

  try {
    const result = execSync(
      'npx wrangler d1 execute investigaree-db --remote --command="SELECT id, nome, documento, status, user_id FROM user_investigacoes WHERE id = \'comurg-empresa-001\';"',
      { cwd: 'C:/Users/Vaio/Documents/TRABALHO/INVESTIGA', encoding: 'utf8' }
    );
    console.log('✅ Database result:', result);
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
}

testHealth()
  .then(() => testRoot())
  .then(() => checkDatabase())
  .then(() => {
    console.log('\n✅ Tests complete!');
    console.log('\n📝 To test with authentication:');
    console.log('  node test-stats-endpoint.js <FIREBASE_TOKEN>');
  })
  .catch((error) => {
    console.error('\n❌ Tests failed:', error.message);
  });
