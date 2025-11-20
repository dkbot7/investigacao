#!/usr/bin/env node

/**
 * investigaree - Script de Automação Completa
 * Configura automaticamente Cloudflare e GitHub via APIs
 *
 * Uso:
 *   node scripts/setup-automation.js
 *
 * Variáveis de ambiente necessárias:
 *   GITHUB_TOKEN - Personal Access Token do GitHub
 *   CLOUDFLARE_API_TOKEN - API Token do Cloudflare
 *   CLOUDFLARE_ACCOUNT_ID - Account ID do Cloudflare
 *   DOMAIN - Domínio (ex: investigaree.com.br)
 */

const https = require('https')
const fs = require('fs')
const { execSync } = require('child_process')

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
  github: {
    token: process.env.GITHUB_TOKEN,
    owner: 'dkbot7',
    repo: 'investigaree',
  },
  cloudflare: {
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  },
  domain: process.env.DOMAIN || 'investigaree.com.br',
}

// ============================================
// UTILS
// ============================================

function apiRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => {
        try {
          const response = JSON.parse(body)
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response)
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`))
          }
        } catch (error) {
          reject(error)
        }
      })
    })

    req.on('error', reject)

    if (data) {
      req.write(JSON.stringify(data))
    }

    req.end()
  })
}

function log(emoji, message) {
  console.log(`${emoji} ${message}`)
}

function success(message) {
  log('✅', message)
}

function error(message) {
  log('❌', message)
}

function info(message) {
  log('ℹ️', message)
}

function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

// ============================================
// VALIDAÇÃO
// ============================================

function validateConfig() {
  info('Validando configuração...')

  if (!CONFIG.github.token) {
    error('GITHUB_TOKEN não definido!')
    process.exit(1)
  }

  if (!CONFIG.cloudflare.apiToken) {
    error('CLOUDFLARE_API_TOKEN não definido!')
    process.exit(1)
  }

  if (!CONFIG.cloudflare.accountId) {
    error('CLOUDFLARE_ACCOUNT_ID não definido!')
    process.exit(1)
  }

  success('Configuração validada!')
}

// ============================================
// GITHUB ACTIONS
// ============================================

async function createGitHubRepo() {
  info('Criando repositório no GitHub...')

  try {
    const response = await apiRequest(
      {
        hostname: 'api.github.com',
        path: '/user/repos',
        method: 'POST',
        headers: {
          Authorization: `token ${CONFIG.github.token}`,
          'User-Agent': 'investigaree-Setup',
          'Content-Type': 'application/json',
        },
      },
      {
        name: CONFIG.github.repo,
        description: 'investigaree - Investigação Digital e Due Diligence',
        private: false,
        auto_init: true,
        gitignore_template: 'Node',
        license_template: 'mit',
      }
    )

    success(`Repositório criado: ${response.html_url}`)
    return response
  } catch (err) {
    if (err.message.includes('422')) {
      info('Repositório já existe, continuando...')
      return { exists: true }
    }
    throw err
  }
}

async function addGitHubSecrets(secrets) {
  info('Adicionando secrets ao GitHub...')

  // 1. Obter public key
  const publicKeyResponse = await apiRequest({
    hostname: 'api.github.com',
    path: `/repos/${CONFIG.github.owner}/${CONFIG.github.repo}/actions/secrets/public-key`,
    method: 'GET',
    headers: {
      Authorization: `token ${CONFIG.github.token}`,
      'User-Agent': 'investigaree-Setup',
    },
  })

  const publicKey = publicKeyResponse.key
  const keyId = publicKeyResponse.key_id

  success(`Public key obtida: ${keyId}`)

  // 2. Encriptar e adicionar cada secret
  // Nota: Encriptação com libsodium seria necessária aqui
  // Por simplicidade, vou apenas logar o que precisa ser feito

  info('Secrets que precisam ser adicionados manualmente:')
  for (const [name, value] of Object.entries(secrets)) {
    console.log(`  - ${name}`)
  }

  info('Use: gh secret set NOME_DO_SECRET --body "valor"')
}

async function createGitHubWorkflow() {
  info('Criando workflow de deploy...')

  const workflow = `name: Deploy to Cloudflare
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
`

  fs.mkdirSync('.github/workflows', { recursive: true })
  fs.writeFileSync('.github/workflows/deploy.yml', workflow)

  success('Workflow criado em .github/workflows/deploy.yml')
}

// ============================================
// CLOUDFLARE ACTIONS
// ============================================

async function createCloudflareZone() {
  info(`Criando zona para ${CONFIG.domain}...`)

  try {
    const response = await apiRequest(
      {
        hostname: 'api.cloudflare.com',
        path: '/client/v4/zones',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CONFIG.cloudflare.apiToken}`,
          'Content-Type': 'application/json',
        },
      },
      {
        name: CONFIG.domain,
        account: {
          id: CONFIG.cloudflare.accountId,
        },
        jump_start: true,
        type: 'full',
      }
    )

    success(`Zona criada: ${response.result.id}`)
    info(`Nameservers: ${response.result.name_servers.join(', ')}`)
    info('⚠️  AÇÃO MANUAL: Atualize os nameservers no seu registrador de domínio')

    return response.result
  } catch (err) {
    if (err.message.includes('already exists')) {
      info('Zona já existe, buscando ID...')
      const zones = await apiRequest({
        hostname: 'api.cloudflare.com',
        path: `/client/v4/zones?name=${CONFIG.domain}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${CONFIG.cloudflare.apiToken}`,
        },
      })

      if (zones.result.length > 0) {
        success(`Zona encontrada: ${zones.result[0].id}`)
        return zones.result[0]
      }
    }
    throw err
  }
}

async function configureDNS(zoneId) {
  info('Configurando registros DNS...')

  const records = [
    {
      type: 'A',
      name: '@',
      content: '192.0.2.1', // Placeholder - será substituído pelo Workers
      proxied: true,
      comment: 'Root domain',
    },
    {
      type: 'CNAME',
      name: 'www',
      content: CONFIG.domain,
      proxied: true,
      comment: 'WWW subdomain',
    },
    {
      type: 'TXT',
      name: '@',
      content: 'v=spf1 include:_spf.google.com ~all',
      proxied: false,
      comment: 'SPF record for email',
    },
  ]

  for (const record of records) {
    try {
      await apiRequest(
        {
          hostname: 'api.cloudflare.com',
          path: `/client/v4/zones/${zoneId}/dns_records`,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${CONFIG.cloudflare.apiToken}`,
            'Content-Type': 'application/json',
          },
        },
        record
      )

      success(`DNS: ${record.type} ${record.name} → ${record.content}`)
    } catch (err) {
      if (err.message.includes('already exists')) {
        info(`DNS: ${record.type} ${record.name} já existe`)
      } else {
        error(`Erro ao criar ${record.type} ${record.name}: ${err.message}`)
      }
    }
  }
}

async function configureSSL(zoneId) {
  info('Configurando SSL/TLS...')

  const settings = [
    {
      id: 'ssl',
      value: 'strict',
      description: 'SSL mode: Full (Strict)',
    },
    {
      id: 'always_use_https',
      value: 'on',
      description: 'Always Use HTTPS',
    },
    {
      id: 'tls_1_3',
      value: 'on',
      description: 'TLS 1.3',
    },
    {
      id: 'automatic_https_rewrites',
      value: 'on',
      description: 'Automatic HTTPS Rewrites',
    },
  ]

  for (const setting of settings) {
    try {
      await apiRequest(
        {
          hostname: 'api.cloudflare.com',
          path: `/client/v4/zones/${zoneId}/settings/${setting.id}`,
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${CONFIG.cloudflare.apiToken}`,
            'Content-Type': 'application/json',
          },
        },
        { value: setting.value }
      )

      success(`SSL: ${setting.description}`)
    } catch (err) {
      error(`Erro ao configurar ${setting.description}: ${err.message}`)
    }
  }
}

async function createKVNamespace() {
  info('Criando KV namespace...')

  try {
    const response = await apiRequest(
      {
        hostname: 'api.cloudflare.com',
        path: `/client/v4/accounts/${CONFIG.cloudflare.accountId}/storage/kv/namespaces`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CONFIG.cloudflare.apiToken}`,
          'Content-Type': 'application/json',
        },
      },
      {
        title: 'investigaree-rate-limits',
      }
    )

    success(`KV namespace criado: ${response.result.id}`)
    info(`⚠️  AÇÃO MANUAL: Adicione ao wrangler.toml:`)
    console.log(`
[[kv_namespaces]]
binding = "KV"
id = "${response.result.id}"
    `)

    return response.result
  } catch (err) {
    if (err.message.includes('already exists')) {
      info('KV namespace já existe')
    } else {
      throw err
    }
  }
}

async function createR2Bucket() {
  info('Criando R2 bucket...')

  try {
    const response = await apiRequest(
      {
        hostname: 'api.cloudflare.com',
        path: `/client/v4/accounts/${CONFIG.cloudflare.accountId}/r2/buckets`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CONFIG.cloudflare.apiToken}`,
          'Content-Type': 'application/json',
        },
      },
      {
        name: 'investigaree-reports',
      }
    )

    success('R2 bucket criado: investigaree-reports')
    info(`⚠️  AÇÃO MANUAL: Adicione ao wrangler.toml:`)
    console.log(`
[[r2_buckets]]
binding = "R2"
bucket_name = "investigaree-reports"
    `)

    return response.result
  } catch (err) {
    if (err.message.includes('already exists')) {
      info('R2 bucket já existe')
    } else {
      throw err
    }
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           investigaree - Setup Automático                    ║
║                                                            ║
║   Configura automaticamente GitHub e Cloudflare via API   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`)

  try {
    // Validação
    validateConfig()
    await wait(1)

    // GitHub
    console.log('\n📦 CONFIGURANDO GITHUB\n')
    await createGitHubRepo()
    await wait(1)

    await createGitHubWorkflow()
    await wait(1)

    const secrets = {
      CLOUDFLARE_API_TOKEN: CONFIG.cloudflare.apiToken,
      CLOUDFLARE_ACCOUNT_ID: CONFIG.cloudflare.accountId,
      FIREBASE_WEB_API_KEY: 'SEU_FIREBASE_API_KEY',
      STRIPE_SECRET_KEY: 'SEU_STRIPE_SECRET_KEY',
      // ... outros secrets
    }
    await addGitHubSecrets(secrets)
    await wait(1)

    // Cloudflare
    console.log('\n☁️  CONFIGURANDO CLOUDFLARE\n')

    const zone = await createCloudflareZone()
    await wait(2)

    await configureDNS(zone.id)
    await wait(2)

    await configureSSL(zone.id)
    await wait(2)

    await createKVNamespace()
    await wait(1)

    await createR2Bucket()
    await wait(1)

    // Conclusão
    console.log('\n\n')
    console.log('═══════════════════════════════════════════════════════════')
    console.log('✅ AUTOMAÇÃO CONCLUÍDA!')
    console.log('═══════════════════════════════════════════════════════════')
    console.log('\n📋 PRÓXIMOS PASSOS MANUAIS:\n')
    console.log('1. Atualize os nameservers do domínio no seu registrador')
    console.log(`   Nameservers: ${zone.name_servers?.join(', ')}`)
    console.log('')
    console.log('2. Ative o Browser Rendering no dashboard Cloudflare')
    console.log('   https://dash.cloudflare.com/')
    console.log('')
    console.log('3. Adicione os IDs de KV e R2 ao wrangler.toml')
    console.log('')
    console.log('4. Configure os secrets do Cloudflare Workers:')
    console.log('   wrangler secret put FIREBASE_WEB_API_KEY')
    console.log('   wrangler secret put STRIPE_SECRET_KEY')
    console.log('   wrangler secret put OPENAI_API_KEY')
    console.log('   ...')
    console.log('')
    console.log('5. Faça o deploy:')
    console.log('   npm run build')
    console.log('   wrangler deploy')
    console.log('')
    console.log('═══════════════════════════════════════════════════════════')
    console.log('🚀 investigaree pronto para produção!')
    console.log('═══════════════════════════════════════════════════════════\n')
  } catch (err) {
    console.error('\n\n❌ ERRO NA AUTOMAÇÃO:\n')
    console.error(err.message)
    console.error('\nStack trace:')
    console.error(err.stack)
    process.exit(1)
  }
}

// Executar
if (require.main === module) {
  main()
}

module.exports = { main }
