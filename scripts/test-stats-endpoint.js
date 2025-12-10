/**
 * Test stats endpoint
 * Usage: node test-stats-endpoint.js <FIREBASE_TOKEN>
 */

const API_URL = 'https://api.investigaree.com.br';

async function testStats(token) {
  try {
    console.log('📤 Testing stats endpoint...');

    const response = await fetch(`${API_URL}/api/investigacoes/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Stats retrieved successfully!');
      console.log('📋 Data:', JSON.stringify(data, null, 2));
      return data;
    } else {
      console.error('❌ Error:', data);
      throw new Error(data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    throw error;
  }
}

async function testList(token) {
  try {
    console.log('\n📤 Testing list endpoint...');

    const response = await fetch(`${API_URL}/api/investigacoes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    const data = await response.json();

    if (response.ok) {
      console.log('✅ List retrieved successfully!');
      console.log('📋 Data:', JSON.stringify(data, null, 2));
      return data;
    } else {
      console.error('❌ Error:', data);
      throw new Error(data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    throw error;
  }
}

// Check if token was provided
const token = process.argv[2];

if (!token) {
  console.error('❌ Token not provided!');
  console.log('\nUsage:');
  console.log('  node test-stats-endpoint.js <FIREBASE_TOKEN>');
  console.log('\nTo get the token:');
  console.log('  1. Open DevTools (F12) in https://investigaree.com.br');
  console.log('  2. Login as COMURG user');
  console.log('  3. In Console, run: await firebase.auth().currentUser.getIdToken()');
  console.log('  4. Copy the token and run this script');
  process.exit(1);
}

console.log('🔑 Using token:', token.substring(0, 20) + '...');

testStats(token)
  .then(() => testList(token))
  .then(() => {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Tests failed:', error.message);
    process.exit(1);
  });
