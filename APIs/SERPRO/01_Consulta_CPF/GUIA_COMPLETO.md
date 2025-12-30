# API Consulta CPF - Guia Completo de Uso

## 📋 Informações do Contrato

**Número do Contrato:** 260005
**API:** Consulta CPF - direto na faixa V2
**Status:** ✅ ATIVO
**Recursos Incluídos:**
- Consulta CPF direto na faixa V2
- Check Time Stamp V2 (Carimbo de Tempo)

---

## 🔑 Credenciais

**Consumer Key:** `sua_consumer_key_aqui` (obtenha em https://loja.serpro.gov.br/)
**Consumer Secret:** `seu_consumer_secret_aqui` (obtenha em https://loja.serpro.gov.br/)
**Base64 (Key:Secret):** `base64_de_key_secret` (gerado automaticamente a partir das credenciais acima)

---

## 🌐 Endpoints

**Autenticação:** `https://gateway.apiserpro.serpro.gov.br/token`
**Produção (V2):** `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2`
**Trial (V2):** `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df-trial/v2`

---

## 💰 Tabela de Preços Completa

### Modelo de Cobrança: ESCALONADO/PROGRESSIVO

| Faixa | De | Até | Preço Unit. | Total Faixa | Acumulado |
|-------|------------|------------|-------------|-------------|-----------|
| 1 | 1 | 999 | R$ 0,6591 | R$ 658,36 | R$ 658,36 |
| 2 | 1.000 | 9.999 | R$ 0,5649 | R$ 5.084,10 | R$ 5.742,46 |
| 3 | 10.000 | 49.999 | R$ 0,3557 | R$ 14.228,00 | R$ 19.970,46 |
| 4 | 50.000 | 99.999 | R$ 0,2616 | R$ 13.080,00 | R$ 33.050,46 |
| 5 | 100.000 | 249.999 | R$ 0,1775 | R$ 26.625,00 | R$ 59.675,46 |
| 6 | 250.000 | 499.999 | R$ 0,1569 | R$ 39.225,00 | R$ 98.900,46 |
| 7 | 500.000 | 999.999 | R$ 0,1465 | R$ 73.250,00 | R$ 172.150,46 |
| 8 | 1.000.000 | 1.499.999 | R$ 0,136 | R$ 68.000,00 | R$ 240.150,46 |
| 9 | 1.500.000 | 2.999.999 | R$ 0,1151 | R$ 172.650,00 | R$ 412.800,46 |
| 10 | 3.000.000 | 4.499.999 | R$ 0,0732 | R$ 109.800,00 | R$ 522.600,46 |
| 11 | 4.500.000 | 9.999.999 | R$ 0,0523 | R$ 287.650,00 | R$ 810.250,46 |
| 12 | 10.000.000 | 16.999.999 | R$ 0,0314 | R$ 219.800,00 | R$ 1.030.050,46 |
| 13 | 17.000.000 | 19.999.999 | R$ 0,026 | R$ 78.000,00 | R$ 1.108.050,46 |
| 14 | 20.000.000 | 24.999.999 | R$ 0,023 | R$ 115.000,00 | R$ 1.223.050,46 |
| 15 | 25.000.000 | 29.999.999 | R$ 0,02 | R$ 100.000,00 | R$ 1.323.050,46 |
| 16 | 30.000.000+ | ∞ | R$ 0,017 | - | - |

### 📊 Exemplos de Custo Total por Volume

| Volume | Custo Total | Custo Médio/Consulta |
|--------|-------------|---------------------|
| 100 | R$ 65,91 | R$ 0,6591 |
| 1.000 | R$ 658,36 | R$ 0,6584 |
| 5.000 | R$ 2.917,62 | R$ 0,5835 |
| 10.000 | R$ 5.742,46 | R$ 0,5742 |
| 50.000 | R$ 19.970,46 | R$ 0,3994 |
| 100.000 | R$ 33.050,46 | R$ 0,3305 |
| 500.000 | R$ 98.900,46 | R$ 0,1978 |
| 1.000.000 | R$ 172.150,46 | R$ 0,1722 |

### 💡 Cálculo de Exemplo: 15.000 consultas

```
Faixa 1: 999 × R$ 0,6591 = R$ 658,36
Faixa 2: 9.000 × R$ 0,5649 = R$ 5.084,10
Faixa 3: 5.001 × R$ 0,3557 = R$ 1.778,91
─────────────────────────────────────────
TOTAL: R$ 7.521,37
Custo Médio: R$ 0,5014 por consulta
```

---

## 🚀 Scripts Prontos para Uso

### Script 1: Consulta Completa com Token Automático (Bash)

```bash
#!/bin/bash

# ========================================
# Script de Consulta CPF com Token Automático
# ========================================

# Configurações
# IMPORTANTE: Substitua pelos seus próprios valores obtidos em https://loja.serpro.gov.br/
CONSUMER_KEY="sua_consumer_key_aqui"
CONSUMER_SECRET="seu_consumer_secret_aqui"
# Gerar AUTH_BASE64 automaticamente a partir das credenciais acima
AUTH_BASE64=$(echo -n "${CONSUMER_KEY}:${CONSUMER_SECRET}" | base64)
TOKEN_URL="https://gateway.apiserpro.serpro.gov.br/token"
API_URL="https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2"

# CPF a consultar (passar como argumento ou definir aqui)
CPF=${1:-"40442820135"}

echo "========================================="
echo "Consulta CPF SERPRO"
echo "========================================="
echo "CPF: $CPF"
echo ""

# Passo 1: Obter Token
echo "[1/2] Obtendo token de acesso..."
TOKEN_RESPONSE=$(curl -k -H "Authorization: Basic $AUTH_BASE64" -d "grant_type=client_credentials" $TOKEN_URL)

# Extrair access_token
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Erro ao obter token!"
    echo "Resposta: $TOKEN_RESPONSE"
    exit 1
fi

echo "✅ Token obtido com sucesso!"
echo "Token: ${ACCESS_TOKEN:0:20}..."
echo ""

# Passo 2: Consultar CPF
echo "[2/2] Consultando CPF..."
RESPONSE=$(curl -s -X GET "$API_URL/cpf/$CPF" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "✅ Resposta recebida:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""
echo "========================================="
```

**Como usar:**
```bash
# Dar permissão de execução
chmod +x consulta_cpf.sh

# Executar
./consulta_cpf.sh 40442820135
```

---

### Script 2: Consulta com Carimbo de Tempo (Bash)

```bash
#!/bin/bash

# ========================================
# Script de Consulta CPF COM Carimbo de Tempo
# ========================================

# IMPORTANTE: Substitua pelos seus próprios valores obtidos em https://loja.serpro.gov.br/
CONSUMER_KEY="sua_consumer_key_aqui"
CONSUMER_SECRET="seu_consumer_secret_aqui"
# Gerar AUTH_BASE64 automaticamente a partir das credenciais acima
AUTH_BASE64=$(echo -n "${CONSUMER_KEY}:${CONSUMER_SECRET}" | base64)
TOKEN_URL="https://gateway.apiserpro.serpro.gov.br/token"
API_URL="https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2"

CPF=${1:-"40442820135"}

echo "========================================="
echo "Consulta CPF com Carimbo de Tempo"
echo "========================================="
echo "CPF: $CPF"
echo ""

# Obter Token
echo "[1/3] Obtendo token..."
TOKEN_RESPONSE=$(curl -k -H "Authorization: Basic $AUTH_BASE64" -d "grant_type=client_credentials" $TOKEN_URL)

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Erro ao obter token!"
    exit 1
fi

echo "✅ Token obtido!"
echo ""

# Consultar CPF COM Carimbo de Tempo
echo "[2/3] Consultando CPF com carimbo de tempo..."
RESPONSE=$(curl -s -D headers.txt -X GET "$API_URL/cpf/$CPF" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "x-signature: 1")

echo "✅ Dados retornados:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Extrair carimbo do header
echo "[3/3] Carimbo de tempo:"
STAMP=$(grep -i "stamp:" headers.txt | cut -d' ' -f2-)
if [ -z "$STAMP" ]; then
    echo "⚠️  Carimbo não encontrado no header"
else
    echo "✅ Carimbo: ${STAMP:0:50}..."
    echo "   (Salvo em: timestamp.txt)"
    echo "$STAMP" > timestamp.txt
fi

rm -f headers.txt
echo ""
echo "========================================="
```

**Como usar:**
```bash
chmod +x consulta_cpf_timestamp.sh
./consulta_cpf_timestamp.sh 40442820135
```

---

### Script 3: Python - Consulta com Token Automático

```python
#!/usr/bin/env python3
"""
Script de Consulta CPF SERPRO com Token Automático
"""

import requests
import json
import base64
import os
from datetime import datetime
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Configurações - obter do arquivo .env
CONSUMER_KEY = os.getenv("SERPRO_CPF_CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("SERPRO_CPF_CONSUMER_SECRET")

if not CONSUMER_KEY or not CONSUMER_SECRET:
    raise ValueError("❌ ERRO: SERPRO_CPF_CONSUMER_KEY e SERPRO_CPF_CONSUMER_SECRET devem estar configurados no arquivo .env")
TOKEN_URL = "https://gateway.apiserpro.serpro.gov.br/token"
API_URL = "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2"

class ConsultaCPF:
    def __init__(self):
        self.token = None
        self.token_expires_at = None

    def obter_token(self):
        """Obtém novo token de acesso"""
        print("[1/2] Obtendo token de acesso...")

        # Criar base64 auth
        credentials = f"{CONSUMER_KEY}:{CONSUMER_SECRET}"
        auth_base64 = base64.b64encode(credentials.encode()).decode()

        headers = {
            "Authorization": f"Basic {auth_base64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        data = {"grant_type": "client_credentials"}

        response = requests.post(TOKEN_URL, headers=headers, data=data)
        response.raise_for_status()

        result = response.json()
        self.token = result["access_token"]

        print(f"✅ Token obtido: {self.token[:20]}...")
        return self.token

    def consultar_cpf(self, cpf, com_timestamp=False):
        """Consulta CPF na API"""
        # Sempre obter novo token para evitar expiração
        self.obter_token()

        print(f"\n[2/2] Consultando CPF: {cpf}")

        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {self.token}"
        }

        # Adicionar header para carimbo de tempo se solicitado
        if com_timestamp:
            headers["x-signature"] = "1"
            print("⏰ Solicitando carimbo de tempo...")

        url = f"{API_URL}/cpf/{cpf}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        dados = response.json()

        # Verificar carimbo de tempo
        stamp = response.headers.get('stamp')

        return {
            "dados": dados,
            "timestamp": stamp,
            "status_code": response.status_code
        }

    def exibir_resultado(self, resultado):
        """Exibe resultado formatado"""
        print("\n" + "="*50)
        print("RESULTADO DA CONSULTA")
        print("="*50)

        dados = resultado["dados"]

        print(f"\n📋 CPF: {dados.get('ni')}")
        print(f"👤 Nome: {dados.get('nome')}")

        situacao = dados.get('situacao', {})
        print(f"📊 Situação: [{situacao.get('codigo')}] {situacao.get('descricao')}")

        nascimento = dados.get('nascimento')
        if nascimento:
            # Formatar data de DDMMAAAA para DD/MM/AAAA
            data_fmt = f"{nascimento[:2]}/{nascimento[2:4]}/{nascimento[4:]}"
            print(f"🎂 Nascimento: {data_fmt}")

        data_inscricao = dados.get('dataInscricao')
        if data_inscricao:
            data_fmt = f"{data_inscricao[:2]}/{data_inscricao[2:4]}/{data_inscricao[4:]}"
            print(f"📅 Inscrição: {data_fmt}")

        if dados.get('obito'):
            print(f"⚰️  Óbito: {dados.get('obito')}")

        if dados.get('nomeSocial'):
            print(f"🏳️‍🌈 Nome Social: {dados.get('nomeSocial')}")

        # Exibir timestamp se houver
        if resultado.get("timestamp"):
            print(f"\n⏰ Carimbo de Tempo:")
            print(f"   {resultado['timestamp'][:80]}...")

        print("\n" + "="*50)

if __name__ == "__main__":
    import sys

    # CPF do argumento ou padrão
    cpf = sys.argv[1] if len(sys.argv) > 1 else "40442820135"

    # Verificar se quer timestamp
    com_timestamp = "--timestamp" in sys.argv or "-t" in sys.argv

    try:
        consulta = ConsultaCPF()
        resultado = consulta.consultar_cpf(cpf, com_timestamp=com_timestamp)
        consulta.exibir_resultado(resultado)

    except requests.exceptions.HTTPError as e:
        print(f"\n❌ Erro HTTP: {e}")
        print(f"Resposta: {e.response.text}")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
```

**Como usar:**
```bash
# Instalar dependências
pip install requests

# Consulta simples
python3 consulta_cpf.py 40442820135

# Consulta com timestamp
python3 consulta_cpf.py 40442820135 --timestamp
```

---

### Script 4: Node.js - Consulta com Token Automático

```javascript
#!/usr/bin/env node

/**
 * Script de Consulta CPF SERPRO com Token Automático
 */

const https = require('https');
require('dotenv').config();

// Configurações - obter do arquivo .env
const CONFIG = {
  consumerKey: process.env.SERPRO_CPF_CONSUMER_KEY,
  consumerSecret: process.env.SERPRO_CPF_CONSUMER_SECRET,
  tokenUrl: 'https://gateway.apiserpro.serpro.gov.br/token',
  apiUrl: 'https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2'
};

// Validar credenciais
if (!CONFIG.consumerKey || !CONFIG.consumerSecret) {
  console.error('❌ ERRO: SERPRO_CPF_CONSUMER_KEY e SERPRO_CPF_CONSUMER_SECRET devem estar configurados no arquivo .env');
  process.exit(1);
}

class ConsultaCPF {
  constructor() {
    this.token = null;
  }

  /**
   * Faz requisição HTTPS
   */
  request(url, options, body = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ data: JSON.parse(data), headers: res.headers });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(body);
      req.end();
    });
  }

  /**
   * Obtém token de acesso
   */
  async obterToken() {
    console.log('[1/2] Obtendo token de acesso...');

    const auth = Buffer.from(
      `${CONFIG.consumerKey}:${CONFIG.consumerSecret}`
    ).toString('base64');

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const body = 'grant_type=client_credentials';

    const { data } = await this.request(CONFIG.tokenUrl, options, body);
    this.token = data.access_token;

    console.log(`✅ Token obtido: ${this.token.substring(0, 20)}...`);
    return this.token;
  }

  /**
   * Consulta CPF
   */
  async consultarCPF(cpf, comTimestamp = false) {
    // Sempre obter novo token
    await this.obterToken();

    console.log(`\n[2/2] Consultando CPF: ${cpf}`);

    const url = new URL(`${CONFIG.apiUrl}/cpf/${cpf}`);
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };

    if (comTimestamp) {
      headers['x-signature'] = '1';
      console.log('⏰ Solicitando carimbo de tempo...');
    }

    const options = {
      method: 'GET',
      headers
    };

    const { data, headers: respHeaders } = await this.request(url, options);

    return {
      dados: data,
      timestamp: respHeaders.stamp,
      statusCode: 200
    };
  }

  /**
   * Exibe resultado formatado
   */
  exibirResultado(resultado) {
    console.log('\n' + '='.repeat(50));
    console.log('RESULTADO DA CONSULTA');
    console.log('='.repeat(50));

    const { dados } = resultado;

    console.log(`\n📋 CPF: ${dados.ni}`);
    console.log(`👤 Nome: ${dados.nome}`);
    console.log(`📊 Situação: [${dados.situacao.codigo}] ${dados.situacao.descricao}`);

    if (dados.nascimento) {
      const nasc = dados.nascimento;
      console.log(`🎂 Nascimento: ${nasc.substr(0,2)}/${nasc.substr(2,2)}/${nasc.substr(4)}`);
    }

    if (dados.dataInscricao) {
      const insc = dados.dataInscricao;
      console.log(`📅 Inscrição: ${insc.substr(0,2)}/${insc.substr(2,2)}/${insc.substr(4)}`);
    }

    if (dados.obito) {
      console.log(`⚰️  Óbito: ${dados.obito}`);
    }

    if (dados.nomeSocial) {
      console.log(`🏳️‍🌈 Nome Social: ${dados.nomeSocial}`);
    }

    if (resultado.timestamp) {
      console.log(`\n⏰ Carimbo de Tempo:`);
      console.log(`   ${resultado.timestamp.substring(0, 80)}...`);
    }

    console.log('\n' + '='.repeat(50));
  }
}

// Executar
(async () => {
  const cpf = process.argv[2] || '40442820135';
  const comTimestamp = process.argv.includes('--timestamp') || process.argv.includes('-t');

  try {
    const consulta = new ConsultaCPF();
    const resultado = await consulta.consultarCPF(cpf, comTimestamp);
    consulta.exibirResultado(resultado);
  } catch (error) {
    console.error(`\n❌ Erro: ${error.message}`);
    process.exit(1);
  }
})();
```

**Como usar:**
```bash
# Consulta simples
node consulta_cpf.js 40442820135

# Consulta com timestamp
node consulta_cpf.js 40442820135 --timestamp
```

---

## 📝 CPFs para Teste (Ambiente Trial)

Use com a URL Trial: `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df-trial/v2`

| CPF | Código | Situação |
|-----|--------|----------|
| 40442820135 | 0 | Regular |
| 63017285995 | 0 | Regular |
| 40532176871 | 2 | Suspensa |
| 07691852312 | 4 | Pendente de Regularização |
| 01648527949 | 5 | Cancelada por Multiplicidade |
| 98302514705 | 8 | Nula |
| 64913872591 | 9 | Cancelada de Ofício |
| 05137518743 | 3 | Titular Falecido |

---

## ⚠️ Observações Importantes

1. **Token:** Sempre gera novo token antes da consulta para evitar expiração
2. **Timeout:** Token válido por 1 hora (3600 segundos)
3. **Bilhetagem:** Códigos 200, 206, 404 e 422 são bilhetados
4. **LGPD:** Menores de 18 anos retornam erro 422 (bilhetado!)
5. **Rate Limit:** Consulte seu contrato para limites
6. **Formato CPF:** Apenas números, sem pontos ou traços

---

**Última atualização:** 06/12/2025
**Versão:** 2.0
**Contrato:** 260005
