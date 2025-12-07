# API Consulta Renda - Guia Completo de Uso

## 📋 Informações do Contrato

**Números dos Contratos:** 260008 e 261071
**API:** Consulta Renda
**Status:** ✅ ATIVO
**Recursos Incluídos:**
- Consulta de renda de Pessoas Físicas
- Dados dos últimos 5 anos fiscais
- 5 primeiras consultas GRATUITAS por mês

---

## 🔑 Credenciais

**Consumer Key:** `3q4kLDgTu__vUqPfaXQ07MUMOPIa`
**Consumer Secret:** `D_G99Fg5wHO10PNGYP49IYo2EaAa`
**Base64 (Key:Secret):** `M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh`

---

## 🌐 Endpoints

**Autenticação:** `https://gateway.apiserpro.serpro.gov.br/token`
**Produção (V1):** `https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1`
**Trial (V1):** `https://gateway.apiserpro.serpro.gov.br/consulta-renda-trial/v1`

---

## 💰 Tabela de Preços Completa

### ⚠️ Modelo de Cobrança: POR FAIXA DE VOLUME TOTAL

**ATENÇÃO:** Esta API **NÃO usa modelo progressivo**. O preço unitário depende do volume total mensal.

| Faixa | De | Até | Preço Unitário | Total Faixa (Máximo) |
|-------|------------|------------|----------------|----------------------|
| 1 | 1 | 5 | **R$ 0,00 (GRÁTIS)** | R$ 0,00 |
| 2 | 6 | 1.000.000 | R$ 1,569 | R$ 1.569.000,00 |
| 3 | 1.000.001 | 2.000.000 | R$ 1,517 | R$ 3.034.000,00 |
| 4 | 2.000.001 | 3.000.000 | R$ 1,465 | R$ 4.395.000,00 |
| 5 | 3.000.001 | 4.000.000 | R$ 1,412 | R$ 5.648.000,00 |
| 6 | 4.000.001 | 5.000.000 | R$ 1,36 | R$ 6.800.000,00 |
| 7 | 5.000.001 | 6.000.000 | R$ 1,308 | R$ 7.848.000,00 |
| 8 | 6.000.001 | 7.000.000 | R$ 1,255 | R$ 8.785.000,00 |
| 9 | 7.000.001 | 8.000.000 | R$ 1,203 | R$ 9.624.000,00 |
| 10 | 8.000.000+ | ∞ | R$ 1,151 | - |

**Unidade:** Requisição
**Observação:** Primeiras 5 consultas GRATUITAS

---

### 📊 Exemplos de Custo Total por Volume

| Volume | Faixa | Preço Unit. | Grátis | Cobradas | Custo Total | Custo Médio |
|--------|-------|-------------|--------|----------|-------------|-------------|
| 5 | 1 | R$ 0,00 | 5 | 0 | **R$ 0,00** | R$ 0,00 |
| 10 | 2 | R$ 1,569 | 5 | 5 | **R$ 7,85** | R$ 0,78 |
| 100 | 2 | R$ 1,569 | 5 | 95 | **R$ 149,06** | R$ 1,49 |
| 1.000 | 2 | R$ 1,569 | 5 | 995 | **R$ 1.561,16** | R$ 1,56 |
| 10.000 | 2 | R$ 1,569 | 5 | 9.995 | **R$ 15.679,26** | R$ 1,57 |
| 100.000 | 2 | R$ 1,569 | 5 | 99.995 | **R$ 156.892,16** | R$ 1,57 |
| 500.000 | 2 | R$ 1,569 | 5 | 499.995 | **R$ 784.492,16** | R$ 1,57 |
| 1.000.000 | 2 | R$ 1,569 | 5 | 999.995 | **R$ 1.568.992,16** | R$ 1,57 |
| 1.500.000 | 3 | R$ 1,517 | 5 | 1.499.995 | **R$ 2.275.492,42** | R$ 1,52 |
| 2.000.000 | 3 | R$ 1,517 | 5 | 1.999.995 | **R$ 3.033.992,42** | R$ 1,52 |

---

### 💡 Como Funciona a Cobrança?

#### Exemplo 1: 100 consultas no mês

```
Volume total: 100 consultas
Faixa aplicável: Faixa 2 (6 a 1.000.000)
Preço unitário: R$ 1,569

Cálculo:
- Consultas grátis: 5
- Consultas cobradas: 100 - 5 = 95
- Total: 95 × R$ 1,569 = R$ 149,06
```

#### Exemplo 2: 1.500.000 consultas no mês

```
Volume total: 1.500.000 consultas
Faixa aplicável: Faixa 3 (1.000.001 a 2.000.000)
Preço unitário: R$ 1,517

Cálculo:
- Consultas grátis: 5
- Consultas cobradas: 1.500.000 - 5 = 1.499.995
- Total: 1.499.995 × R$ 1,517 = R$ 2.275.492,42
```

---

### ⚠️ DIFERENÇA vs APIs CPF/CNPJ

**Consulta Renda (Por Faixa Total):**
```
100.000 consultas = 100.000 × R$ 1,569 = R$ 156.900,00
```

**Consulta CPF (Progressivo):**
```
Faixa 1:     999 × R$ 0,659 = R$ 658,36
Faixa 2:   9.000 × R$ 0,565 = R$ 5.085,00
Faixa 3:  90.001 × R$ 0,356 = R$ 32.040,36
TOTAL: R$ 37.783,72
```

✅ **O modelo progressivo é mais econômico para alto volume!**

---

## 🚀 Scripts Prontos para Uso

### Script 1: Consulta Renda com Token Automático (Bash)

```bash
#!/bin/bash

# ========================================
# Script de Consulta Renda com Token Automático
# ========================================

# Configurações
CONSUMER_KEY="3q4kLDgTu__vUqPfaXQ07MUMOPIa"
CONSUMER_SECRET="D_G99Fg5wHO10PNGYP49IYo2EaAa"
AUTH_BASE64="M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh"
TOKEN_URL="https://gateway.apiserpro.serpro.gov.br/token"
API_URL="https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1"

# Parâmetros (CPF e ano-base)
CPF=${1:-"40442820135"}
ANO_BASE=${2:-"2023"}

echo "========================================="
echo "Consulta Renda SERPRO"
echo "========================================="
echo "CPF: $CPF"
echo "Ano-Base: $ANO_BASE"
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

# Passo 2: Consultar Renda
echo "[2/2] Consultando renda..."
RESPONSE=$(curl -s -X GET "$API_URL/renda/$CPF/$ANO_BASE" \
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
chmod +x consulta_renda.sh

# Consultar ano 2023
./consulta_renda.sh 40442820135 2023

# Consultar ano 2022
./consulta_renda.sh 40442820135 2022

# Consultar múltiplos anos (histórico)
for ano in 2024 2023 2022 2021 2020; do
  ./consulta_renda.sh 40442820135 $ano
  sleep 1
done
```

---

### Script 2: Consulta Múltiplos Anos (Bash)

```bash
#!/bin/bash

# ========================================
# Script de Consulta Renda - Múltiplos Anos
# ========================================

CONSUMER_KEY="3q4kLDgTu__vUqPfaXQ07MUMOPIa"
CONSUMER_SECRET="D_G99Fg5wHO10PNGYP49IYo2EaAa"
AUTH_BASE64="M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh"
TOKEN_URL="https://gateway.apiserpro.serpro.gov.br/token"
API_URL="https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1"

CPF=${1:-"40442820135"}

echo "========================================="
echo "Consulta Renda - Histórico Completo"
echo "========================================="
echo "CPF: $CPF"
echo ""

# Obter Token
echo "[1/2] Obtendo token..."
TOKEN_RESPONSE=$(curl -k -H "Authorization: Basic $AUTH_BASE64" -d "grant_type=client_credentials" $TOKEN_URL)

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Erro ao obter token!"
    exit 1
fi

echo "✅ Token obtido!"
echo ""

# Consultar últimos 5 anos
echo "[2/2] Consultando últimos 5 anos..."
echo ""

for ano in 2024 2023 2022 2021 2020; do
    echo "----------------------------------------"
    echo "📅 Ano-Base: $ano"
    echo "----------------------------------------"

    RESPONSE=$(curl -s -X GET "$API_URL/renda/$CPF/$ano" \
      -H "Accept: application/json" \
      -H "Authorization: Bearer $ACCESS_TOKEN")

    # Verificar se encontrou dados
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/renda/$CPF/$ano" \
      -H "Authorization: Bearer $ACCESS_TOKEN")

    if [ "$HTTP_CODE" == "200" ]; then
        echo "✅ Dados encontrados"

        # Extrair campos principais
        TOTAL=$(echo $RESPONSE | jq -r '.totalRendimentos // "N/A"')
        TRIBUTAVEL=$(echo $RESPONSE | jq -r '.rendimentoTributavel // "N/A"')
        SITUACAO=$(echo $RESPONSE | jq -r '.situacao // "N/A"')

        echo "   Total Rendimentos: R$ $TOTAL"
        echo "   Rendimento Tributável: R$ $TRIBUTAVEL"
        echo "   Situação: $SITUACAO"
    elif [ "$HTTP_CODE" == "404" ]; then
        echo "⚠️  Sem declaração para este ano"
    else
        echo "❌ Erro HTTP $HTTP_CODE"
    fi

    echo ""
    sleep 1  # Evitar sobrecarga
done

echo "========================================="
```

**Como usar:**
```bash
chmod +x consulta_renda_historico.sh
./consulta_renda_historico.sh 40442820135
```

---

### Script 3: Python - Consulta com Token Automático

```python
#!/usr/bin/env python3
"""
Script de Consulta Renda SERPRO com Token Automático
"""

import requests
import json
import base64
from datetime import datetime

# Configurações
CONSUMER_KEY = "3q4kLDgTu__vUqPfaXQ07MUMOPIa"
CONSUMER_SECRET = "D_G99Fg5wHO10PNGYP49IYo2EaAa"
TOKEN_URL = "https://gateway.apiserpro.serpro.gov.br/token"
API_URL = "https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1"

class ConsultaRenda:
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

    def consultar_renda(self, cpf, ano_base, request_tag=None):
        """
        Consulta renda de um CPF para um ano-base

        Args:
            cpf (str): CPF a consultar (apenas números)
            ano_base (int ou str): Ano-base (ex: 2023)
            request_tag (str): Tag opcional para agrupamento de faturamento
        """
        # Sempre obter novo token para evitar expiração
        self.obter_token()

        print(f"\n[2/2] Consultando renda: CPF {cpf} - Ano {ano_base}")

        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {self.token}"
        }

        # Adicionar request tag se fornecida
        if request_tag:
            headers["X-Request-Tag"] = request_tag[:32]
            print(f"🏷️  Request Tag: {request_tag[:32]}")

        url = f"{API_URL}/renda/{cpf}/{ano_base}"
        response = requests.get(url, headers=headers)

        # Tratar 404 (sem declaração)
        if response.status_code == 404:
            return {
                "encontrado": False,
                "cpf": cpf,
                "anoBase": str(ano_base),
                "mensagem": "CPF não possui declaração para este ano-base"
            }

        response.raise_for_status()
        dados = response.json()

        return {
            "encontrado": True,
            "dados": dados,
            "status_code": response.status_code
        }

    def consultar_historico(self, cpf, anos=None):
        """
        Consulta renda de múltiplos anos

        Args:
            cpf (str): CPF a consultar
            anos (list): Lista de anos (default: últimos 5 anos)
        """
        if anos is None:
            ano_atual = datetime.now().year
            anos = list(range(ano_atual - 4, ano_atual + 1))

        self.obter_token()

        print(f"\n📊 Consultando histórico de renda")
        print(f"CPF: {cpf}")
        print(f"Anos: {', '.join(map(str, anos))}\n")

        resultados = []

        for ano in anos:
            resultado = self.consultar_renda(cpf, ano)
            resultados.append(resultado)

        return resultados

    def exibir_resultado(self, resultado):
        """Exibe resultado formatado"""
        print("\n" + "="*60)
        print("RESULTADO DA CONSULTA - RENDA")
        print("="*60)

        if not resultado.get("encontrado"):
            print(f"\n⚠️  {resultado.get('mensagem')}")
            print(f"CPF: {resultado.get('cpf')}")
            print(f"Ano-Base: {resultado.get('anoBase')}")
            print("\n" + "="*60)
            return

        dados = resultado["dados"]

        print(f"\n📋 CPF: {dados.get('cpf')}")
        print(f"📅 Ano-Base: {dados.get('anoBase')}")
        print(f"📊 Situação: {dados.get('situacao')}")

        print(f"\n💰 Rendimentos:")
        print(f"   Total: R$ {dados.get('totalRendimentos', 0):,.2f}")
        print(f"   Tributável: R$ {dados.get('rendimentoTributavel', 0):,.2f}")
        print(f"   Isento: R$ {dados.get('rendimentoIsentoNaoTributavel', 0):,.2f}")

        print(f"\n🏢 Origem dos Rendimentos:")
        print(f"   De PJ: R$ {dados.get('rendimentoTributavelRecebidoDeJuridica', 0):,.2f}")
        print(f"   De PF: R$ {dados.get('rendimentoTributavelRecebidoDeFisica', 0):,.2f}")

        rend_exterior = dados.get('rendimentoExterior', 0)
        if rend_exterior > 0:
            print(f"   Exterior: R$ {rend_exterior:,.2f}")

        print(f"\n💳 Deduções e Pagamentos:")
        print(f"   Prev. Oficial: R$ {dados.get('contribuicaoPrevidenciariaOficial', 0):,.2f}")
        print(f"   Dependentes: R$ {dados.get('deducoesDependentes', 0):,.2f}")

        pensao = dados.get('pensaoAlimenticia', 0)
        if pensao > 0:
            print(f"   Pensão: R$ {pensao:,.2f}")

        print(f"   Imposto Pago: R$ {dados.get('impostoPago', 0):,.2f}")

        print("\n" + "="*60)

    def exibir_historico(self, resultados):
        """Exibe histórico formatado"""
        print("\n" + "="*60)
        print("HISTÓRICO DE RENDA")
        print("="*60)

        for resultado in resultados:
            ano = resultado.get('dados', {}).get('anoBase') or resultado.get('anoBase')

            if resultado.get("encontrado"):
                dados = resultado["dados"]
                total = dados.get('totalRendimentos', 0)
                situacao = dados.get('situacao', 'N/A')
                print(f"\n📅 {ano}: R$ {total:,.2f} - {situacao}")
            else:
                print(f"\n📅 {ano}: ⚠️  Sem declaração")

        print("\n" + "="*60)

if __name__ == "__main__":
    import sys

    # Parse argumentos
    if len(sys.argv) < 2:
        print("Uso: python3 consulta_renda.py <CPF> [ano-base]")
        print("Exemplo: python3 consulta_renda.py 40442820135 2023")
        print("Histórico: python3 consulta_renda.py 40442820135 --historico")
        sys.exit(1)

    cpf = sys.argv[1]

    # Request tag (opcional)
    request_tag = None
    for arg in sys.argv:
        if arg.startswith("--tag="):
            request_tag = arg.split("=", 1)[1]

    try:
        consulta = ConsultaRenda()

        if "--historico" in sys.argv:
            # Consultar histórico (últimos 5 anos)
            resultados = consulta.consultar_historico(cpf)
            consulta.exibir_historico(resultados)
        else:
            # Consulta simples
            ano_base = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("--") else 2023
            resultado = consulta.consultar_renda(cpf, ano_base, request_tag=request_tag)
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
python3 consulta_renda.py 40442820135 2023

# Consulta histórico
python3 consulta_renda.py 40442820135 --historico

# Consulta com Request Tag
python3 consulta_renda.py 40442820135 2023 --tag=ANALISE_CREDITO
```

---

### Script 4: Node.js - Consulta com Token Automático

```javascript
#!/usr/bin/env node

/**
 * Script de Consulta Renda SERPRO com Token Automático
 */

const https = require('https');
const { Buffer } = require('buffer');

// Configurações
const CONFIG = {
  consumerKey: '3q4kLDgTu__vUqPfaXQ07MUMOPIa',
  consumerSecret: 'D_G99Fg5wHO10PNGYP49IYo2EaAa',
  tokenUrl: 'https://gateway.apiserpro.serpro.gov.br/token',
  apiUrl: 'https://gateway.apiserpro.serpro.gov.br/consulta-renda/v1'
};

class ConsultaRenda {
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

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              data: data,
              headers: res.headers,
              statusCode: res.statusCode
            });
          } else if (res.statusCode === 404) {
            // 404 não é erro - apenas não encontrou declaração
            resolve({
              data: data,
              headers: res.headers,
              statusCode: 404
            });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (body) {
        req.write(body);
      }

      req.end();
    });
  }

  /**
   * Obtém token de acesso
   */
  async obterToken() {
    console.log('[1/2] Obtendo token de acesso...');

    // Criar base64 auth
    const credentials = `${CONFIG.consumerKey}:${CONFIG.consumerSecret}`;
    const authBase64 = Buffer.from(credentials).toString('base64');

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authBase64}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const body = 'grant_type=client_credentials';

    try {
      const response = await this.request(CONFIG.tokenUrl, options, body);
      const result = JSON.parse(response.data);
      this.token = result.access_token;

      console.log(`✅ Token obtido: ${this.token.substring(0, 20)}...`);
      return this.token;
    } catch (error) {
      throw new Error(`Erro ao obter token: ${error.message}`);
    }
  }

  /**
   * Consulta renda
   */
  async consultarRenda(cpf, anoBase, requestTag = null) {
    // Sempre obter novo token
    await this.obterToken();

    console.log(`\n[2/2] Consultando renda: CPF ${cpf} - Ano ${anoBase}`);

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };

    // Adicionar request tag
    if (requestTag) {
      headers['X-Request-Tag'] = requestTag.substring(0, 32);
      console.log(`🏷️  Request Tag: ${requestTag.substring(0, 32)}`);
    }

    const url = `${CONFIG.apiUrl}/renda/${cpf}/${anoBase}`;
    const options = {
      method: 'GET',
      headers: headers
    };

    try {
      const response = await this.request(url, options);

      if (response.statusCode === 404) {
        return {
          encontrado: false,
          cpf: cpf,
          anoBase: anoBase.toString(),
          mensagem: 'CPF não possui declaração para este ano-base'
        };
      }

      const dados = JSON.parse(response.data);

      return {
        encontrado: true,
        dados: dados,
        statusCode: response.statusCode
      };
    } catch (error) {
      throw new Error(`Erro na consulta: ${error.message}`);
    }
  }

  /**
   * Consulta histórico
   */
  async consultarHistorico(cpf, anos = null) {
    if (!anos) {
      const anoAtual = new Date().getFullYear();
      anos = Array.from({length: 5}, (_, i) => anoAtual - 4 + i);
    }

    await this.obterToken();

    console.log('\n📊 Consultando histórico de renda');
    console.log(`CPF: ${cpf}`);
    console.log(`Anos: ${anos.join(', ')}\n`);

    const resultados = [];

    for (const ano of anos) {
      const resultado = await this.consultarRenda(cpf, ano);
      resultados.push(resultado);

      // Aguardar 500ms entre consultas
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return resultados;
  }

  /**
   * Exibe resultado formatado
   */
  exibirResultado(resultado) {
    console.log('\n' + '='.repeat(60));
    console.log('RESULTADO DA CONSULTA - RENDA');
    console.log('='.repeat(60));

    if (!resultado.encontrado) {
      console.log(`\n⚠️  ${resultado.mensagem}`);
      console.log(`CPF: ${resultado.cpf}`);
      console.log(`Ano-Base: ${resultado.anoBase}`);
      console.log('\n' + '='.repeat(60));
      return;
    }

    const dados = resultado.dados;

    console.log(`\n📋 CPF: ${dados.cpf}`);
    console.log(`📅 Ano-Base: ${dados.anoBase}`);
    console.log(`📊 Situação: ${dados.situacao}`);

    console.log('\n💰 Rendimentos:');
    console.log(`   Total: R$ ${(dados.totalRendimentos || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   Tributável: R$ ${(dados.rendimentoTributavel || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   Isento: R$ ${(dados.rendimentoIsentoNaoTributavel || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);

    console.log('\n🏢 Origem dos Rendimentos:');
    console.log(`   De PJ: R$ ${(dados.rendimentoTributavelRecebidoDeJuridica || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   De PF: R$ ${(dados.rendimentoTributavelRecebidoDeFisica || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);

    if (dados.rendimentoExterior > 0) {
      console.log(`   Exterior: R$ ${dados.rendimentoExterior.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    }

    console.log('\n💳 Deduções e Pagamentos:');
    console.log(`   Prev. Oficial: R$ ${(dados.contribuicaoPrevidenciariaOficial || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    console.log(`   Dependentes: R$ ${(dados.deducoesDependentes || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);

    if (dados.pensaoAlimenticia > 0) {
      console.log(`   Pensão: R$ ${dados.pensaoAlimenticia.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
    }

    console.log(`   Imposto Pago: R$ ${(dados.impostoPago || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);

    console.log('\n' + '='.repeat(60));
  }

  /**
   * Exibe histórico formatado
   */
  exibirHistorico(resultados) {
    console.log('\n' + '='.repeat(60));
    console.log('HISTÓRICO DE RENDA');
    console.log('='.repeat(60));

    resultados.forEach(resultado => {
      const ano = (resultado.dados && resultado.dados.anoBase) || resultado.anoBase;

      if (resultado.encontrado) {
        const total = resultado.dados.totalRendimentos || 0;
        const situacao = resultado.dados.situacao || 'N/A';
        console.log(`\n📅 ${ano}: R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})} - ${situacao}`);
      } else {
        console.log(`\n📅 ${ano}: ⚠️  Sem declaração`);
      }
    });

    console.log('\n' + '='.repeat(60));
  }
}

// Main
(async () => {
  try {
    // Parse argumentos
    const args = process.argv.slice(2);

    if (args.length < 1) {
      console.log('Uso: node consulta_renda.js <CPF> [ano-base]');
      console.log('Exemplo: node consulta_renda.js 40442820135 2023');
      console.log('Histórico: node consulta_renda.js 40442820135 --historico');
      process.exit(1);
    }

    const cpf = args[0];

    // Request tag
    let requestTag = null;
    args.forEach(arg => {
      if (arg.startsWith('--tag=')) {
        requestTag = arg.split('=')[1];
      }
    });

    const consulta = new ConsultaRenda();

    if (args.includes('--historico')) {
      // Consultar histórico
      const resultados = await consulta.consultarHistorico(cpf);
      consulta.exibirHistorico(resultados);
    } else {
      // Consulta simples
      const anoBase = (args[1] && !args[1].startsWith('--')) ? args[1] : 2023;
      const resultado = await consulta.consultarRenda(cpf, anoBase, requestTag);
      consulta.exibirResultado(resultado);
    }

  } catch (error) {
    console.error(`\n❌ Erro: ${error.message}`);
    process.exit(1);
  }
})();
```

**Como usar:**
```bash
# Tornar executável
chmod +x consulta_renda.js

# Consulta simples
node consulta_renda.js 40442820135 2023

# Consulta histórico
node consulta_renda.js 40442820135 --historico

# Consulta com Request Tag
node consulta_renda.js 40442820135 2023 --tag=ANALISE_RISCO
```

---

## 🧪 Dados para Teste (Ambiente Trial)

### CPFs e Anos-Base

| CPF | Ano-Base | Situação | Total Rendimentos |
|-----|----------|----------|-------------------|
| 40442820135 | 2023 | REGULAR | R$ 97.000,00 |
| 40442820135 | 2022 | REGULAR | R$ 85.000,00 |
| 63017285630 | 2023 | PENDENTE | R$ 45.000,00 |
| 91708635203 | 2023 | RETIFICADA | R$ 120.000,00 |

**URL Trial:**
```
https://gateway.apiserpro.serpro.gov.br/consulta-renda-trial/v1/renda/{cpf}/{anoBase}
```

---

## 📞 Suporte

**E-mail:** css.serpro@serpro.gov.br
**Telefone:** 0800 728 2323
**Horário:** Segunda a Sexta, 7h às 19h (horário de Brasília)

---

## 🔗 Links Úteis

- **Documentação Oficial:** https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-renda/
- **Loja SERPRO:** https://loja.serpro.gov.br/
- **Gestão de Chaves:** https://loja.serpro.gov.br/ (acesso com e-CNPJ)

---

**Documento gerado em:** 06/12/2025
**Última atualização:** 06/12/2025
**Versão:** 1.0
