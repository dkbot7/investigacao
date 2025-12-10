/**
 * Script para criar investigação COMURG
 */

const API_URL = 'https://api.investigaree.com.br';

// Dados da investigação
const investigacao = {
  nome: "comurg - empresa",
  documento: "11.111.111/1111-11",
  tipo_pessoa: "juridica",
  categoria: "empresas",
  status: "investigar",
  nivel_urgencia: "media",
  motivo_investigacao: "Verificação de empresa relacionada à COMURG",
  observacoes: "Investigação criada para tenant COMURG"
};

async function criarInvestigacao(token) {
  try {
    console.log('📤 Criando investigação...', investigacao);

    const response = await fetch(`${API_URL}/api/investigacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(investigacao)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Investigação criada com sucesso!');
      console.log('📋 Dados:', JSON.stringify(data, null, 2));
      return data;
    } else {
      console.error('❌ Erro ao criar investigação:', data);
      throw new Error(data.error || 'Erro desconhecido');
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    throw error;
  }
}

// Verificar se token foi fornecido
const token = process.argv[2];

if (!token) {
  console.error('❌ Token não fornecido!');
  console.log('\nUso:');
  console.log('  node criar-investigacao-comurg.js <FIREBASE_TOKEN>');
  console.log('\nPara obter o token:');
  console.log('  1. Abra o DevTools (F12) em https://investigaree.com.br');
  console.log('  2. Faça login como usuário COMURG');
  console.log('  3. Execute no Console: firebase.auth().currentUser.getIdToken().then(t => console.log(t))');
  console.log('  4. Copie o token e execute este script');
  process.exit(1);
}

criarInvestigacao(token)
  .then(() => {
    console.log('\n✅ Processo concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Falha:', error.message);
    process.exit(1);
  });
