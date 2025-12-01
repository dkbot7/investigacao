# API Consulta CPF v2 - SERPRO

## Informações Gerais

| Item | Valor |
|------|-------|
| **Nome** | Consulta CPF - direto na faixa V2 |
| **Contrato** | 260005 |
| **Base URL** | `https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2` |
| **Autenticação** | Bearer Token (OAuth2 Client Credentials) |

## Endpoints

### 1. Consultar CPF

```
GET /cpf/{ni}
```

**Parâmetros:**

| Parâmetro | Tipo | Local | Obrigatório | Descrição |
|-----------|------|-------|-------------|-----------|
| `ni` | string | path | Sim | Número de inscrição do CPF (11 dígitos, apenas números) |

**Headers:**

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer {access_token}` |
| `Accept` | `application/json` |

**Resposta de Sucesso (200):**

```json
{
  "ni": "12345678901",
  "nome": "NOME DO CONTRIBUINTE",
  "situacao": {
    "codigo": "0",
    "descricao": "Regular"
  },
  "nascimento": "01011990",
  "obito": null,
  "dataInscricao": "anterior a 10/11/1990",
  "nomeSocial": null
}
```

**Campos da Resposta:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `ni` | string | Número de inscrição (CPF) |
| `nome` | string | Nome do contribuinte |
| `situacao.codigo` | string | Código da situação cadastral |
| `situacao.descricao` | string | Descrição da situação (Regular, Suspensa, etc.) |
| `nascimento` | string | Data de nascimento (formato DDMMAAAA) |
| `obito` | string/null | Data do óbito, se houver |
| `dataInscricao` | string | Data de inscrição no CPF |
| `nomeSocial` | string/null | Nome social, se cadastrado |

**Códigos de Situação:**

| Código | Descrição |
|--------|-----------|
| 0 | Regular |
| 2 | Suspensa |
| 3 | Titular Falecido |
| 4 | Pendente de Regularização |
| 5 | Cancelada por Multiplicidade |
| 8 | Nula |
| 9 | Cancelada de Ofício |

### 2. Verificar Status da API

```
GET /status
```

**Headers:**

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer {access_token}` |

**Resposta de Sucesso (200):**

```json
{
  "status": "online"
}
```

## Códigos de Erro

| Código HTTP | Descrição |
|-------------|-----------|
| 400 | Requisição inválida (CPF mal formatado) |
| 401 | Token inválido ou expirado |
| 403 | Acesso negado (API não contratada ou sem permissão) |
| 404 | CPF não encontrado na base |
| 500 | Erro interno do servidor |

## Exemplo de Uso

### cURL

```bash
# 1. Obter token
curl -X POST "https://gateway.apiserpro.serpro.gov.br/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
  -d "grant_type=client_credentials"

# 2. Consultar CPF
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/cpf/12345678901" \
  -H "Authorization: Bearer {access_token}" \
  -H "Accept: application/json"
```

### Node.js/TypeScript

```typescript
import https from 'https';

async function consultarCPF(cpf: string, token: string) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'gateway.apiserpro.serpro.gov.br',
      port: 443,
      path: `/consulta-cpf-df/v2/cpf/${cpf}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}
```

## Observações

- O token expira em aproximadamente 60 minutos (3600 segundos)
- O CPF deve ser informado apenas com números (sem pontos ou traço)
- A API retorna dados atualizados da base da Receita Federal
- Consultas são tarifadas conforme contrato
