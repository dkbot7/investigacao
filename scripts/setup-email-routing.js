#!/usr/bin/env node

/**
 * investigaree - Script de Configuração de Email Routing
 * Configura automaticamente Email Routing no Cloudflare via API
 *
 * Uso:
 *   node scripts/setup-email-routing.js
 */

const https = require('https');
require('dotenv').config({ path: '.env.automation' });

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
  cloudflare: {
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
  },
  domain: process.env.DOMAIN || 'investigaree.com.br',
  emails: [
    {
      custom: 'contato',
      destination: 'kaloidani@gmail.com', // ALTERE AQUI para seu email
    },
    {
      custom: 'privacidade',
      destination: 'kaloidani@gmail.com', // ALTERE AQUI para seu email
    },
  ],
};

// ============================================
// UTILS
// ============================================

function apiRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (err) {
          reject(new Error(`Parse error: ${err.message}, Body: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // cyan
    success: '\x1b[32m', // green
    error: '\x1b[31m',   // red
    warning: '\x1b[33m', // yellow
  };
  const reset = '\x1b[0m';
  const prefix = {
    info: 'ℹ',
    success: '✓',
    error: '✗',
    warning: '⚠',
  };

  console.log(`${colors[type]}${prefix[type]} ${message}${reset}`);
}

// ============================================
// CLOUDFLARE API FUNCTIONS
// ============================================

async function enableEmailRouting() {
  log('Habilitando Email Routing...', 'info');

  try {
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/zones/${CONFIG.cloudflare.zoneId}/email/routing/enable`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.cloudflare.apiToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await apiRequest(options);

    if (response.success) {
      log('Email Routing habilitado com sucesso!', 'success');
      log(`DNS records foram adicionados automaticamente`, 'info');
      return true;
    } else {
      // Pode ser que já esteja habilitado
      log('Email Routing pode já estar habilitado', 'warning');
      return true;
    }
  } catch (err) {
    if (err.message.includes('already enabled') || err.message.includes('10106')) {
      log('Email Routing já está habilitado!', 'success');
      return true;
    }
    log(`Erro ao habilitar Email Routing: ${err.message}`, 'error');
    throw err;
  }
}

async function createDestinationAddress(email) {
  log(`Criando endereço de destino: ${email}...`, 'info');

  try {
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/zones/${CONFIG.cloudflare.zoneId}/email/routing/addresses`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.cloudflare.apiToken}`,
        'Content-Type': 'application/json',
      },
    };

    const data = {
      email: email,
    };

    const response = await apiRequest(options, data);

    if (response.success) {
      log(`Endereço de destino criado: ${email}`, 'success');
      log(`⚠ IMPORTANTE: Verifique o email enviado para ${email} e clique no link de verificação!`, 'warning');
      return response.result;
    }
  } catch (err) {
    if (err.message.includes('already exists') || err.message.includes('10109')) {
      log(`Endereço de destino já existe: ${email}`, 'info');
      return { email };
    }
    log(`Erro ao criar endereço de destino ${email}: ${err.message}`, 'error');
    throw err;
  }
}

async function createEmailRoute(custom, destinationEmail) {
  log(`Criando rota de email: ${custom}@${CONFIG.domain} → ${destinationEmail}...`, 'info');

  try {
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/zones/${CONFIG.cloudflare.zoneId}/email/routing/rules`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.cloudflare.apiToken}`,
        'Content-Type': 'application/json',
      },
    };

    const data = {
      name: `Route for ${custom}@${CONFIG.domain}`,
      enabled: true,
      matchers: [
        {
          type: 'literal',
          field: 'to',
          value: `${custom}@${CONFIG.domain}`,
        },
      ],
      actions: [
        {
          type: 'forward',
          value: [destinationEmail],
        },
      ],
    };

    const response = await apiRequest(options, data);

    if (response.success) {
      log(`Rota criada com sucesso: ${custom}@${CONFIG.domain} → ${destinationEmail}`, 'success');
      return response.result;
    }
  } catch (err) {
    if (err.message.includes('already exists')) {
      log(`Rota já existe: ${custom}@${CONFIG.domain}`, 'info');
      return null;
    }
    log(`Erro ao criar rota de email: ${err.message}`, 'error');
    throw err;
  }
}

async function getEmailRoutingStatus() {
  log('Verificando status do Email Routing...', 'info');

  try {
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4/zones/${CONFIG.cloudflare.zoneId}/email/routing`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.cloudflare.apiToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await apiRequest(options);

    if (response.success) {
      log(`Status: ${response.result.enabled ? 'Habilitado' : 'Desabilitado'}`, 'info');
      log(`Tag: ${response.result.tag || 'N/A'}`, 'info');
      return response.result;
    }
  } catch (err) {
    log(`Erro ao verificar status: ${err.message}`, 'error');
    return null;
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n');
  log('='.repeat(60), 'info');
  log('SETUP DE EMAIL ROUTING - CLOUDFLARE', 'info');
  log('='.repeat(60), 'info');
  console.log('\n');

  // Validar configuração
  if (!CONFIG.cloudflare.apiToken) {
    log('Erro: CLOUDFLARE_API_TOKEN não configurado!', 'error');
    process.exit(1);
  }

  if (!CONFIG.cloudflare.zoneId) {
    log('Erro: CLOUDFLARE_ZONE_ID não configurado!', 'error');
    process.exit(1);
  }

  try {
    // 1. Verificar status atual
    await getEmailRoutingStatus();
    console.log('\n');

    // 2. Habilitar Email Routing
    await enableEmailRouting();
    console.log('\n');

    // 3. Criar endereços de destino únicos
    const uniqueDestinations = [...new Set(CONFIG.emails.map(e => e.destination))];

    for (const destination of uniqueDestinations) {
      await createDestinationAddress(destination);
      console.log('\n');
    }

    // Aguardar um pouco para os endereços serem criados
    log('Aguardando 2 segundos...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('\n');

    // 4. Criar rotas de email
    for (const emailConfig of CONFIG.emails) {
      await createEmailRoute(emailConfig.custom, emailConfig.destination);
      console.log('\n');
    }

    // 5. Status final
    log('='.repeat(60), 'success');
    log('CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!', 'success');
    log('='.repeat(60), 'success');
    console.log('\n');

    log('📧 Emails criados:', 'info');
    for (const emailConfig of CONFIG.emails) {
      log(`  ✉️  ${emailConfig.custom}@${CONFIG.domain} → ${emailConfig.destination}`, 'success');
    }
    console.log('\n');

    log('⚠️  PRÓXIMOS PASSOS:', 'warning');
    log(`  1. Verifique o email enviado para: ${uniqueDestinations.join(', ')}`, 'warning');
    log(`  2. Clique no link de verificação no email`, 'warning');
    log(`  3. Teste enviando um email para: contato@${CONFIG.domain}`, 'warning');
    console.log('\n');

    log('📚 Para ver as rotas criadas:', 'info');
    log(`  https://dash.cloudflare.com/${CONFIG.cloudflare.accountId}/${CONFIG.domain}/email/routing/overview`, 'info');
    console.log('\n');

  } catch (err) {
    console.log('\n');
    log('='.repeat(60), 'error');
    log('ERRO NA CONFIGURAÇÃO', 'error');
    log('='.repeat(60), 'error');
    log(err.message, 'error');
    console.log('\n');
    process.exit(1);
  }
}

// Executar
main();
