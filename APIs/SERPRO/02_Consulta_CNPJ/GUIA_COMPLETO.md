# API Consulta CNPJ v2 - Guia Completo de Uso

## 📋 Informações do Contrato

**Número do Contrato:** 260009
**API:** Consulta CNPJ v2 - Mercado Privado
**Status:** ✅ ATIVO
**Recursos Incluídos:**
- Consulta Básica CNPJ
- Consulta QSA (Quadro de Sócios e Administradores - CPF mascarado)
- Consulta Empresa (Dados completos com CPF dos sócios)
- Check Time Stamp (Carimbo de Tempo)

---

## 🔑 Credenciais

**Consumer Key:** `3q4kLDgTu__vUqPfaXQ07MUMOPIa`
**Consumer Secret:** `D_G99Fg5wHO10PNGYP49IYo2EaAa`
**Base64 (Key:Secret):** `M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh`

---

## 🌐 Endpoints

**Autenticação:** `https://gateway.apiserpro.serpro.gov.br/token`
**Produção (V2):** `https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2`
**Trial (V2):** `https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df-trial/v2`

### Tipos de Consulta Disponíveis

1. **`/basica/{ni}`** - Dados cadastrais básicos (R$ 0,659 - Faixa 1)
2. **`/qsa/{ni}`** - Básico + QSA com CPF mascarado (R$ 0,868 - Faixa 1)
3. **`/empresa/{ni}`** - Básico + Sócios com CPF completo (R$ 1,172 - Faixa 1)

---

## 💰 Tabelas de Preços Completas

### Modelo de Cobrança: ESCALONADO/PROGRESSIVO

---

## 📊 Tabela 1: Consulta Básica CNPJ

| Faixa | De | Até | Preço Unit. | Total Faixa | Acumulado |
|-------|------------|------------|-------------|-------------|-----------|
| 1 | 1 | 999 | R$ 0,659 | R$ 658,21 | R$ 658,21 |
| 2 | 1.000 | 9.999 | R$ 0,565 | R$ 5.085,00 | R$ 5.743,21 |
| 3 | 10.000 | 49.999 | R$ 0,356 | R$ 14.240,00 | R$ 19.983,21 |
| 4 | 50.000 | 99.999 | R$ 0,262 | R$ 13.100,00 | R$ 33.083,21 |
| 5 | 100.000 | 249.999 | R$ 0,178 | R$ 26.700,00 | R$ 59.783,21 |
| 6 | 250.000 | 499.999 | R$ 0,157 | R$ 39.250,00 | R$ 99.033,21 |
| 7 | 500.000 | 999.999 | R$ 0,146 | R$ 73.000,00 | R$ 172.033,21 |
| 8 | 1.000.000 | 1.499.999 | R$ 0,136 | R$ 68.000,00 | R$ 240.033,21 |
| 9 | 1.500.000 | 2.999.999 | R$ 0,115 | R$ 172.500,00 | R$ 412.533,21 |
| 10 | 3.000.000 | 4.999.999 | R$ 0,0700 | R$ 140.000,00 | R$ 552.533,21 |
| 11 | 5.000.000 | 6.999.999 | R$ 0,06 | R$ 120.000,00 | R$ 672.533,21 |
| 12 | 7.000.000 | 9.999.999 | R$ 0,0500 | R$ 150.000,00 | R$ 822.533,21 |
| 13 | 10.000.000 | 19.999.999 | R$ 0,0400 | R$ 400.000,00 | R$ 1.222.533,21 |
| 14 | 20.000.000 | 24.999.999 | R$ 0,0350 | R$ 175.000,00 | R$ 1.397.533,21 |
| 15 | 25.000.000 | 29.999.999 | R$ 0,0300 | R$ 150.000,00 | R$ 1.547.533,21 |
| 16 | 30.000.000+ | ∞ | R$ 0,0250 | - | - |

### 📈 Exemplos de Custo - Consulta Básica

| Volume | Custo Total | Custo Médio/Consulta |
|--------|-------------|---------------------|
| 100 | R$ 65,90 | R$ 0,659 |
| 1.000 | R$ 658,21 | R$ 0,6582 |
| 5.000 | R$ 2.918,21 | R$ 0,5836 |
| 10.000 | R$ 5.743,21 | R$ 0,5743 |
| 50.000 | R$ 19.983,21 | R$ 0,3997 |
| 100.000 | R$ 33.083,21 | R$ 0,3308 |
| 500.000 | R$ 99.033,21 | R$ 0,1981 |
| 1.000.000 | R$ 172.033,21 | R$ 0,1720 |

---

## 📊 Tabela 2: Consulta QSA (com CPF mascarado)

| Faixa | De | Até | Preço Unit. | Total Faixa | Acumulado |
|-------|------------|------------|-------------|-------------|-----------|
| 1 | 1 | 999 | R$ 0,868 | R$ 866,73 | R$ 866,73 |
| 2 | 1.000 | 9.999 | R$ 0,743 | R$ 6.687,00 | R$ 7.553,73 |
| 3 | 10.000 | 49.999 | R$ 0,596 | R$ 23.840,00 | R$ 31.393,73 |
| 4 | 50.000 | 99.999 | R$ 0,502 | R$ 25.100,00 | R$ 56.493,73 |
| 5 | 100.000 | 249.999 | R$ 0,398 | R$ 59.700,00 | R$ 116.193,73 |
| 6 | 250.000 | 499.999 | R$ 0,335 | R$ 83.750,00 | R$ 199.943,73 |
| 7 | 500.000 | 999.999 | R$ 0,272 | R$ 136.000,00 | R$ 335.943,73 |
| 8 | 1.000.000 | 1.499.999 | R$ 0,22 | R$ 110.000,00 | R$ 445.943,73 |
| 9 | 1.500.000 | 2.999.999 | R$ 0,178 | R$ 267.000,00 | R$ 712.943,73 |
| 10 | 3.000.000 | 4.999.999 | R$ 0,1300 | R$ 260.000,00 | R$ 972.943,73 |
| 11 | 5.000.000 | 6.999.999 | R$ 0,12 | R$ 240.000,00 | R$ 1.212.943,73 |
| 12 | 7.000.000 | 9.999.999 | R$ 0,11 | R$ 330.000,00 | R$ 1.542.943,73 |
| 13 | 10.000.000 | 19.999.999 | R$ 0,1000 | R$ 1.000.000,00 | R$ 2.542.943,73 |
| 14 | 20.000.000 | 24.999.999 | R$ 0,0760 | R$ 380.000,00 | R$ 2.922.943,73 |
| 15 | 25.000.000 | 29.999.999 | R$ 0,0720 | R$ 360.000,00 | R$ 3.282.943,73 |
| 16 | 30.000.000+ | ∞ | R$ 0,0670 | - | - |

### 📈 Exemplos de Custo - Consulta QSA

| Volume | Custo Total | Custo Médio/Consulta |
|--------|-------------|---------------------|
| 100 | R$ 86,80 | R$ 0,868 |
| 1.000 | R$ 866,73 | R$ 0,8667 |
| 5.000 | R$ 3.840,73 | R$ 0,7681 |
| 10.000 | R$ 7.553,73 | R$ 0,7554 |
| 50.000 | R$ 31.393,73 | R$ 0,6279 |
| 100.000 | R$ 56.493,73 | R$ 0,5649 |
| 500.000 | R$ 199.943,73 | R$ 0,3999 |
| 1.000.000 | R$ 335.943,73 | R$ 0,3359 |

---

## 📊 Tabela 3: Consulta Empresa (com CPF completo dos sócios)

| Faixa | De | Até | Preço Unit. | Total Faixa | Acumulado |
|-------|------------|------------|-------------|-------------|-----------|
| 1 | 1 | 999 | R$ 1,172 | R$ 1.170,83 | R$ 1.170,83 |
| 2 | 1.000 | 9.999 | R$ 1,015 | R$ 9.135,00 | R$ 10.305,83 |
| 3 | 10.000 | 49.999 | R$ 0,826 | R$ 33.040,00 | R$ 43.345,83 |
| 4 | 50.000 | 99.999 | R$ 0,701 | R$ 35.050,00 | R$ 78.395,83 |
| 5 | 100.000 | 249.999 | R$ 0,565 | R$ 84.750,00 | R$ 163.145,83 |
| 6 | 250.000 | 499.999 | R$ 0,471 | R$ 117.750,00 | R$ 280.895,83 |
| 7 | 500.000 | 999.999 | R$ 0,398 | R$ 199.000,00 | R$ 479.895,83 |
| 8 | 1.000.000 | 1.499.999 | R$ 0,324 | R$ 162.000,00 | R$ 641.895,83 |
| 9 | 1.500.000 | 2.999.999 | R$ 0,251 | R$ 376.500,00 | R$ 1.018.395,83 |
| 10 | 3.000.000 | 4.999.999 | R$ 0,19 | R$ 380.000,00 | R$ 1.398.395,83 |
| 11 | 5.000.000 | 6.999.999 | R$ 0,18 | R$ 360.000,00 | R$ 1.758.395,83 |
| 12 | 7.000.000 | 9.999.999 | R$ 0,17 | R$ 510.000,00 | R$ 2.268.395,83 |
| 13 | 10.000.000 | 19.999.999 | R$ 0,15 | R$ 1.500.000,00 | R$ 3.768.395,83 |
| 14 | 20.000.000 | 24.999.999 | R$ 0,138 | R$ 690.000,00 | R$ 4.458.395,83 |
| 15 | 25.000.000 | 29.999.999 | R$ 0,122 | R$ 610.000,00 | R$ 5.068.395,83 |
| 16 | 30.000.000+ | ∞ | R$ 0,108 | - | - |

### 📈 Exemplos de Custo - Consulta Empresa

| Volume | Custo Total | Custo Médio/Consulta |
|--------|-------------|---------------------|
| 100 | R$ 117,20 | R$ 1,172 |
| 1.000 | R$ 1.170,83 | R$ 1,1708 |
| 5.000 | R$ 5.231,83 | R$ 1,0464 |
| 10.000 | R$ 10.305,83 | R$ 1,0306 |
| 50.000 | R$ 43.345,83 | R$ 0,8669 |
| 100.000 | R$ 78.395,83 | R$ 0,7840 |
| 500.000 | R$ 280.895,83 | R$ 0,5618 |
| 1.000.000 | R$ 479.895,83 | R$ 0,4799 |

---

## 🔄 Comparativo Entre os 3 Tipos de Consulta

### Comparação de Preços (Faixa 1)

| Tipo | Endpoint | CPF Sócios | Preço Unitário | Diferença vs Básica |
|------|----------|------------|----------------|---------------------|
| **Básica** | `/basica/{ni}` | ❌ Não inclui | R$ 0,659 | - |
| **QSA** | `/qsa/{ni}` | ⚠️ Mascarado (`***000002**`) | R$ 0,868 | +31,7% |
| **Empresa** | `/empresa/{ni}` | ✅ Completo | R$ 1,172 | +77,8% |

### Quando Usar Cada Tipo?

| Necessidade | Consulta Recomendada | Motivo |
|-------------|---------------------|--------|
| Validar se empresa existe | Básica | Menor custo, dados suficientes |
| Verificar situação cadastral | Básica | Não precisa de QSA |
| Confirmar endereço/contato | Básica | Dados básicos inclusos |
| Ver estrutura societária | QSA | QSA com CPF mascarado |
| Compliance sem LGPD rigorosa | QSA | CPF parcial é suficiente |
| Due diligence completa | Empresa | CPF completo para cruzamento |
| Background check aprofundado | Empresa | Investigação de vínculos |
| KYC (Know Your Customer) | Empresa | Identificação completa dos sócios |

---

## 💡 Cálculo de Exemplo: 15.000 consultas de cada tipo

### Consulta Básica (15.000 consultas)
```
Faixa 1:    999 × R$ 0,659 = R$ 658,21
Faixa 2:  9.000 × R$ 0,565 = R$ 5.085,00
Faixa 3:  5.001 × R$ 0,356 = R$ 1.780,36
─────────────────────────────────────────
TOTAL: R$ 7.523,57
Custo Médio: R$ 0,5016 por consulta
```

### Consulta QSA (15.000 consultas)
```
Faixa 1:    999 × R$ 0,868 = R$ 866,73
Faixa 2:  9.000 × R$ 0,743 = R$ 6.687,00
Faixa 3:  5.001 × R$ 0,596 = R$ 2.980,60
─────────────────────────────────────────
TOTAL: R$ 10.534,33
Custo Médio: R$ 0,7023 por consulta
```

### Consulta Empresa (15.000 consultas)
```
Faixa 1:    999 × R$ 1,172 = R$ 1.170,83
Faixa 2:  9.000 × R$ 1,015 = R$ 9.135,00
Faixa 3:  5.001 × R$ 0,826 = R$ 4.130,83
─────────────────────────────────────────
TOTAL: R$ 14.436,66
Custo Médio: R$ 0,9624 por consulta
```

---

## 🚀 Scripts Prontos para Uso

### Script 1: Consulta Básica com Token Automático (Bash)

```bash
#!/bin/bash

# ========================================
# Script de Consulta CNPJ Básica com Token Automático
# ========================================

# Configurações
CONSUMER_KEY="3q4kLDgTu__vUqPfaXQ07MUMOPIa"
CONSUMER_SECRET="D_G99Fg5wHO10PNGYP49IYo2EaAa"
AUTH_BASE64="M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh"
TOKEN_URL="https://gateway.apiserpro.serpro.gov.br/token"
API_URL="https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2"

# CNPJ a consultar (passar como argumento ou definir aqui)
CNPJ=${1:-"34238864000168"}

# Tipo de consulta: basica, qsa, empresa
TIPO=${2:-"basica"}

echo "========================================="
echo "Consulta CNPJ SERPRO - $TIPO"
echo "========================================="
echo "CNPJ: $CNPJ"
echo "Tipo: $TIPO"
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

# Passo 2: Consultar CNPJ
echo "[2/2] Consultando CNPJ ($TIPO)..."
RESPONSE=$(curl -s -X GET "$API_URL/$TIPO/$CNPJ" \
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
chmod +x consulta_cnpj.sh

# Consulta Básica
./consulta_cnpj.sh 34238864000168 basica

# Consulta QSA
./consulta_cnpj.sh 34238864000168 qsa

# Consulta Empresa
./consulta_cnpj.sh 34238864000168 empresa
```

---

### Script 2: Consulta com Carimbo de Tempo (Bash)

```bash
#!/bin/bash

# ========================================
# Script de Consulta CNPJ COM Carimbo de Tempo
# ========================================

CONSUMER_KEY="3q4kLDgTu__vUqPfaXQ07MUMOPIa"
CONSUMER_SECRET="D_G99Fg5wHO10PNGYP49IYo2EaAa"
AUTH_BASE64="M3E0a0xEZ1R1X192VXFQZmFYUTA3TVVNT1BJYTpEX0c5OUZnNXdITzEwUE5HWVA0OUlZbzJFYUFh"
TOKEN_URL="https://gateway.apiserpro.serpro.gov.br/token"
API_URL="https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2"

CNPJ=${1:-"34238864000168"}
TIPO=${2:-"empresa"}

echo "========================================="
echo "Consulta CNPJ com Carimbo de Tempo"
echo "========================================="
echo "CNPJ: $CNPJ"
echo "Tipo: $TIPO"
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

# Consultar CNPJ COM Carimbo de Tempo
echo "[2/3] Consultando CNPJ com carimbo de tempo..."
RESPONSE=$(curl -s -D headers.txt -X GET "$API_URL/$TIPO/$CNPJ" \
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
    echo ""
    echo "🔗 Validar em: https://aplicacao.estaleiro.serpro.gov.br/check-time-stamp/"
fi

rm -f headers.txt
echo ""
echo "========================================="
```

**Como usar:**
```bash
chmod +x consulta_cnpj_timestamp.sh

# Consulta Empresa com timestamp
./consulta_cnpj_timestamp.sh 34238864000168 empresa

# Consulta QSA com timestamp
./consulta_cnpj_timestamp.sh 34238864000168 qsa
```

---

### Script 3: Python - Consulta com Token Automático

```python
#!/usr/bin/env python3
"""
Script de Consulta CNPJ SERPRO com Token Automático
"""

import requests
import json
import base64
from datetime import datetime

# Configurações
CONSUMER_KEY = "3q4kLDgTu__vUqPfaXQ07MUMOPIa"
CONSUMER_SECRET = "D_G99Fg5wHO10PNGYP49IYo2EaAa"
TOKEN_URL = "https://gateway.apiserpro.serpro.gov.br/token"
API_URL = "https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2"

class ConsultaCNPJ:
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

    def consultar_cnpj(self, cnpj, tipo="basica", com_timestamp=False, request_tag=None):
        """
        Consulta CNPJ na API

        Args:
            cnpj (str): CNPJ a consultar (apenas números)
            tipo (str): Tipo de consulta - "basica", "qsa" ou "empresa"
            com_timestamp (bool): Se True, solicita carimbo de tempo
            request_tag (str): Tag opcional para agrupamento de faturamento (máx 32 chars)
        """
        # Sempre obter novo token para evitar expiração
        self.obter_token()

        print(f"\n[2/2] Consultando CNPJ: {cnpj} (tipo: {tipo})")

        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {self.token}"
        }

        # Adicionar header para carimbo de tempo se solicitado
        if com_timestamp:
            headers["x-signature"] = "1"
            print("⏰ Solicitando carimbo de tempo...")

        # Adicionar request tag se fornecida
        if request_tag:
            headers["X-Request-Tag"] = request_tag[:32]  # Limitar a 32 chars
            print(f"🏷️  Request Tag: {request_tag[:32]}")

        url = f"{API_URL}/{tipo}/{cnpj}"
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        dados = response.json()

        # Verificar carimbo de tempo
        stamp = response.headers.get('stamp')

        return {
            "dados": dados,
            "timestamp": stamp,
            "status_code": response.status_code,
            "tipo_consulta": tipo
        }

    def exibir_resultado(self, resultado):
        """Exibe resultado formatado"""
        print("\n" + "="*60)
        print(f"RESULTADO DA CONSULTA - {resultado['tipo_consulta'].upper()}")
        print("="*60)

        dados = resultado["dados"]

        print(f"\n📋 CNPJ: {dados.get('ni')}")
        print(f"🏢 Razão Social: {dados.get('nome_empresarial')}")

        nome_fantasia = dados.get('nome_fantasia')
        if nome_fantasia:
            print(f"✨ Nome Fantasia: {nome_fantasia}")

        # Situação cadastral
        situacao = dados.get('situacao_cadastral', {})
        codigo = situacao.get('codigo')
        situacao_map = {
            "1": "NULA",
            "2": "ATIVA",
            "3": "SUSPENSA",
            "4": "INAPTA",
            "8": "BAIXADA"
        }
        situacao_desc = situacao_map.get(codigo, "DESCONHECIDA")
        print(f"📊 Situação: [{codigo}] {situacao_desc}")

        # Data abertura
        data_abertura = dados.get('data_abertura')
        if data_abertura:
            print(f"📅 Abertura: {data_abertura}")

        # Endereço
        endereco = dados.get('endereco', {})
        print(f"\n📍 Endereço:")
        print(f"   {endereco.get('logradouro')}, {endereco.get('numero')}")
        if endereco.get('complemento'):
            print(f"   {endereco.get('complemento')}")
        print(f"   {endereco.get('bairro')} - {endereco.get('municipio')}/{endereco.get('uf')}")
        print(f"   CEP: {endereco.get('cep')}")

        # CNAE
        cnae = dados.get('cnae_principal', {})
        print(f"\n🏭 CNAE Principal: {cnae.get('codigo')} - {cnae.get('descricao')}")

        # Natureza Jurídica
        natureza = dados.get('natureza_juridica', {})
        print(f"⚖️  Natureza Jurídica: [{natureza.get('codigo')}] {natureza.get('descricao')}")

        # Porte
        porte = dados.get('porte')
        porte_map = {
            "00": "Não informado",
            "01": "Micro Empresa",
            "03": "Empresa de Pequeno Porte",
            "05": "Demais"
        }
        print(f"📏 Porte: {porte_map.get(porte, 'Desconhecido')}")

        # E-mail e telefone
        email = dados.get('correio_eletronico')
        if email:
            print(f"📧 E-mail: {email}")

        telefones = dados.get('telefones', [])
        if telefones:
            print(f"📞 Telefones:")
            for tel in telefones:
                print(f"   ({tel.get('ddd')}) {tel.get('numero')}")

        # QSA (se disponível)
        qsa = dados.get('qsa', [])
        if qsa:
            print(f"\n👥 QSA (Quadro de Sócios e Administradores):")
            for socio in qsa:
                print(f"\n   • {socio.get('nome_socio')}")
                print(f"     Qualificação: {socio.get('qualificacao_socio')}")
                print(f"     CPF/CNPJ: {socio.get('cpf_cnpj_socio')}")
                print(f"     Entrada: {socio.get('data_entrada_sociedade')}")

        # Sócios (se disponível - consulta empresa)
        socios = dados.get('socios', [])
        if socios:
            print(f"\n👥 Sócios e Administradores (CPF Completo):")
            for socio in socios:
                print(f"\n   • {socio.get('nome_socio')}")
                print(f"     Qualificação: {socio.get('qualificacao_socio')}")
                print(f"     CPF/CNPJ: {socio.get('cpf_cnpj_socio')}")
                print(f"     Entrada: {socio.get('data_entrada_sociedade')}")

        # Exibir timestamp se houver
        if resultado.get("timestamp"):
            print(f"\n⏰ Carimbo de Tempo:")
            print(f"   {resultado['timestamp'][:80]}...")
            print(f"\n🔗 Validar em: https://aplicacao.estaleiro.serpro.gov.br/check-time-stamp/")

        print("\n" + "="*60)

if __name__ == "__main__":
    import sys

    # CNPJ do argumento ou padrão
    cnpj = sys.argv[1] if len(sys.argv) > 1 else "34238864000168"

    # Tipo de consulta
    tipo = "basica"
    if "--qsa" in sys.argv:
        tipo = "qsa"
    elif "--empresa" in sys.argv:
        tipo = "empresa"

    # Verificar se quer timestamp
    com_timestamp = "--timestamp" in sys.argv or "-t" in sys.argv

    # Request tag (opcional)
    request_tag = None
    for arg in sys.argv:
        if arg.startswith("--tag="):
            request_tag = arg.split("=", 1)[1]

    try:
        consulta = ConsultaCNPJ()
        resultado = consulta.consultar_cnpj(
            cnpj,
            tipo=tipo,
            com_timestamp=com_timestamp,
            request_tag=request_tag
        )
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

# Consulta Básica
python3 consulta_cnpj.py 34238864000168

# Consulta QSA
python3 consulta_cnpj.py 34238864000168 --qsa

# Consulta Empresa (com CPF completo)
python3 consulta_cnpj.py 34238864000168 --empresa

# Consulta com timestamp
python3 consulta_cnpj.py 34238864000168 --empresa --timestamp

# Consulta com Request Tag
python3 consulta_cnpj.py 34238864000168 --empresa --tag=DEPTO_FINANCEIRO
```

---

### Script 4: Node.js - Consulta com Token Automático

```javascript
#!/usr/bin/env node

/**
 * Script de Consulta CNPJ SERPRO com Token Automático
 */

const https = require('https');
const { Buffer } = require('buffer');

// Configurações
const CONFIG = {
  consumerKey: '3q4kLDgTu__vUqPfaXQ07MUMOPIa',
  consumerSecret: 'D_G99Fg5wHO10PNGYP49IYo2EaAa',
  tokenUrl: 'https://gateway.apiserpro.serpro.gov.br/token',
  apiUrl: 'https://gateway.apiserpro.serpro.gov.br/consulta-cnpj-df/v2'
};

class ConsultaCNPJ {
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
   * Consulta CNPJ na API
   */
  async consultarCNPJ(cnpj, tipo = 'basica', comTimestamp = false, requestTag = null) {
    // Sempre obter novo token
    await this.obterToken();

    console.log(`\n[2/2] Consultando CNPJ: ${cnpj} (tipo: ${tipo})`);

    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };

    // Adicionar header para carimbo de tempo
    if (comTimestamp) {
      headers['x-signature'] = '1';
      console.log('⏰ Solicitando carimbo de tempo...');
    }

    // Adicionar request tag
    if (requestTag) {
      headers['X-Request-Tag'] = requestTag.substring(0, 32);
      console.log(`🏷️  Request Tag: ${requestTag.substring(0, 32)}`);
    }

    const url = `${CONFIG.apiUrl}/${tipo}/${cnpj}`;
    const options = {
      method: 'GET',
      headers: headers
    };

    try {
      const response = await this.request(url, options);
      const dados = JSON.parse(response.data);

      return {
        dados: dados,
        timestamp: response.headers['stamp'],
        statusCode: response.statusCode,
        tipoConsulta: tipo
      };
    } catch (error) {
      throw new Error(`Erro na consulta: ${error.message}`);
    }
  }

  /**
   * Exibe resultado formatado
   */
  exibirResultado(resultado) {
    console.log('\n' + '='.repeat(60));
    console.log(`RESULTADO DA CONSULTA - ${resultado.tipoConsulta.toUpperCase()}`);
    console.log('='.repeat(60));

    const dados = resultado.dados;

    console.log(`\n📋 CNPJ: ${dados.ni}`);
    console.log(`🏢 Razão Social: ${dados.nome_empresarial}`);

    if (dados.nome_fantasia) {
      console.log(`✨ Nome Fantasia: ${dados.nome_fantasia}`);
    }

    // Situação cadastral
    const situacaoMap = {
      '1': 'NULA',
      '2': 'ATIVA',
      '3': 'SUSPENSA',
      '4': 'INAPTA',
      '8': 'BAIXADA'
    };
    const situacao = dados.situacao_cadastral || {};
    const situacaoDesc = situacaoMap[situacao.codigo] || 'DESCONHECIDA';
    console.log(`📊 Situação: [${situacao.codigo}] ${situacaoDesc}`);

    if (dados.data_abertura) {
      console.log(`📅 Abertura: ${dados.data_abertura}`);
    }

    // Endereço
    const endereco = dados.endereco || {};
    console.log('\n📍 Endereço:');
    console.log(`   ${endereco.logradouro}, ${endereco.numero}`);
    if (endereco.complemento) {
      console.log(`   ${endereco.complemento}`);
    }
    console.log(`   ${endereco.bairro} - ${endereco.municipio}/${endereco.uf}`);
    console.log(`   CEP: ${endereco.cep}`);

    // CNAE
    const cnae = dados.cnae_principal || {};
    console.log(`\n🏭 CNAE Principal: ${cnae.codigo} - ${cnae.descricao}`);

    // Natureza Jurídica
    const natureza = dados.natureza_juridica || {};
    console.log(`⚖️  Natureza Jurídica: [${natureza.codigo}] ${natureza.descricao}`);

    // Porte
    const porteMap = {
      '00': 'Não informado',
      '01': 'Micro Empresa',
      '03': 'Empresa de Pequeno Porte',
      '05': 'Demais'
    };
    console.log(`📏 Porte: ${porteMap[dados.porte] || 'Desconhecido'}`);

    // E-mail e telefone
    if (dados.correio_eletronico) {
      console.log(`📧 E-mail: ${dados.correio_eletronico}`);
    }

    const telefones = dados.telefones || [];
    if (telefones.length > 0) {
      console.log('📞 Telefones:');
      telefones.forEach(tel => {
        console.log(`   (${tel.ddd}) ${tel.numero}`);
      });
    }

    // QSA (se disponível)
    const qsa = dados.qsa || [];
    if (qsa.length > 0) {
      console.log('\n👥 QSA (Quadro de Sócios e Administradores):');
      qsa.forEach(socio => {
        console.log(`\n   • ${socio.nome_socio}`);
        console.log(`     Qualificação: ${socio.qualificacao_socio}`);
        console.log(`     CPF/CNPJ: ${socio.cpf_cnpj_socio}`);
        console.log(`     Entrada: ${socio.data_entrada_sociedade}`);
      });
    }

    // Sócios (se disponível - consulta empresa)
    const socios = dados.socios || [];
    if (socios.length > 0) {
      console.log('\n👥 Sócios e Administradores (CPF Completo):');
      socios.forEach(socio => {
        console.log(`\n   • ${socio.nome_socio}`);
        console.log(`     Qualificação: ${socio.qualificacao_socio}`);
        console.log(`     CPF/CNPJ: ${socio.cpf_cnpj_socio}`);
        console.log(`     Entrada: ${socio.data_entrada_sociedade}`);
      });
    }

    // Timestamp
    if (resultado.timestamp) {
      console.log('\n⏰ Carimbo de Tempo:');
      console.log(`   ${resultado.timestamp.substring(0, 80)}...`);
      console.log('\n🔗 Validar em: https://aplicacao.estaleiro.serpro.gov.br/check-time-stamp/');
    }

    console.log('\n' + '='.repeat(60));
  }
}

// Main
(async () => {
  try {
    // Parse argumentos
    const args = process.argv.slice(2);
    const cnpj = args[0] || '34238864000168';

    let tipo = 'basica';
    let comTimestamp = false;
    let requestTag = null;

    args.forEach(arg => {
      if (arg === '--qsa') tipo = 'qsa';
      if (arg === '--empresa') tipo = 'empresa';
      if (arg === '--timestamp' || arg === '-t') comTimestamp = true;
      if (arg.startsWith('--tag=')) requestTag = arg.split('=')[1];
    });

    const consulta = new ConsultaCNPJ();
    const resultado = await consulta.consultarCNPJ(cnpj, tipo, comTimestamp, requestTag);
    consulta.exibirResultado(resultado);

  } catch (error) {
    console.error(`\n❌ Erro: ${error.message}`);
    process.exit(1);
  }
})();
```

**Como usar:**
```bash
# Tornar executável
chmod +x consulta_cnpj.js

# Consulta Básica
node consulta_cnpj.js 34238864000168

# Consulta QSA
node consulta_cnpj.js 34238864000168 --qsa

# Consulta Empresa
node consulta_cnpj.js 34238864000168 --empresa

# Consulta com timestamp
node consulta_cnpj.js 34238864000168 --empresa --timestamp

# Consulta com Request Tag
node consulta_cnpj.js 34238864000168 --empresa --tag=COMPLIANCE
```

---

## 🧪 CNPJs para Teste (Ambiente Trial)

Use estes CNPJs no ambiente Trial:

| CNPJ | Situação Cadastral | Descrição |
|------|-------------------|-----------|
| 34238864000168 | ATIVO | SERPRO - Ideal para testes de sucesso |
| 54447820000155 | SUSPENSO | Testes com empresa suspensa |
| 46768703000165 | INAPTO | Testes com empresa inapta |
| 31151791000184 | BAIXADO | Testes com empresa baixada |
| 34428654000132 | NULO | Testes com CNPJ nulo |

---

## 📞 Suporte

**E-mail:** css.serpro@serpro.gov.br
**Telefone:** 0800 728 2323
**Horário:** Segunda a Sexta, 7h às 19h (horário de Brasília)

---

## 🔗 Links Úteis

- **Documentação Oficial:** https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnpj/pt/consulta-cnpj-df-v2/
- **Loja SERPRO:** https://loja.serpro.gov.br/consultacnpj
- **Gestão de Chaves:** https://loja.serpro.gov.br/ (acesso com e-CNPJ)
- **Validador de Carimbo de Tempo:** https://aplicacao.estaleiro.serpro.gov.br/check-time-stamp/

---

**Documento gerado em:** 06/12/2025
**Última atualização:** 06/12/2025
**Versão:** 1.0
