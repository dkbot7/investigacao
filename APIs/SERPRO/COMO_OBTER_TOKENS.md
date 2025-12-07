# Como Obter os Tokens das APIs SERPRO

## Passo a Passo

### 1. Acesse a Loja SERPRO
- URL: https://loja.serpro.gov.br
- Faça login com seu **certificado digital e-CNPJ**

### 2. Acesse "Gestão de Chaves"
- No menu superior, clique em **"Gestão de Chaves"**
- Você verá a lista de todos os seus contratos ativos

### 3. Visualize as Chaves
Para cada API contratada, clique em **"Visualizar chaves"**

### 4. Copie o Token
- Você verá informações como:
  - **Consumer Key** (Client ID)
  - **Consumer Secret** (Token)
- Copie o **Consumer Secret** - este é o token que você precisa

### 5. Cole no arquivo .env
- Abra o arquivo `.env` na pasta do projeto
- Encontre a variável correspondente à API
- Cole o token

## APIs Contratadas e Onde Colar o Token

### ✅ CONTRATO 260005 - Consulta CPF V2
```env
SERPRO_CPF_TOKEN=COLE_SEU_TOKEN_AQUI
```

### ✅ CONTRATO 260008 e 261071 - Consulta Renda
```env
SERPRO_RENDA_TOKEN=COLE_SEU_TOKEN_AQUI
```

### ✅ CONTRATO 260009 - Consulta CNPJ V2
```env
SERPRO_CNPJ_TOKEN=COLE_SEU_TOKEN_AQUI
```

### ✅ CONTRATO 261069 - Consulta Dívida Ativa
```env
SERPRO_DIVIDA_ATIVA_TOKEN=COLE_SEU_TOKEN_AQUI
```

### ✅ CONTRATO 261070 - DATAVALID V4
```env
SERPRO_DATAVALID_TOKEN=COLE_SEU_TOKEN_AQUI
```

### ✅ CONTRATO 261073 - Consulta Faturamento
```env
SERPRO_FATURAMENTO_TOKEN=COLE_SEU_TOKEN_AQUI
```

### ✅ CONTRATO 261074 - Integra Contador
```env
SERPRO_INTEGRA_CONTADOR_TOKEN=COLE_SEU_TOKEN_AQUI
```

## Informações Importantes

### Consumer Key vs Consumer Secret
- **Consumer Key**: Identificador público do seu aplicativo
- **Consumer Secret**: Senha/token secreto (é este que você precisa)

### Segurança
- **NUNCA** compartilhe seus tokens
- **NUNCA** commite o arquivo `.env` no Git
- Use `.env.example` para documentar quais variáveis são necessárias
- Mantenha backups seguros dos tokens

### Renovação de Tokens
- Tokens do SERPRO geralmente **não expiram**
- Mas podem ser revogados por você na Loja SERPRO
- Se renovar um token, lembre-se de atualizar o `.env`

### Ambientes (Trial vs Production)
- **Trial**: Dados fictícios, gratuito, para testes
- **Production**: Dados reais, pago por consulta
- Você precisa de tokens diferentes para cada ambiente
- Seus contratos são de **PRODUCTION** (dados reais)

### URLs dos Endpoints

Cada API tem 2 URLs possíveis:
- **Trial**: https://gateway.apiserpro.serpro.gov.br/[api]-trial/v[X]
- **Production**: https://gateway.apiserpro.serpro.gov.br/[api]/v[X]

O arquivo `.env` já está configurado com as URLs corretas.

## Verificação de Contrato

Para verificar se um contrato está ativo:

1. Acesse https://loja.serpro.gov.br
2. Vá em "Meus Contratos"
3. Verifique se o status é "Ativo"
4. Veja o número do contrato
5. Clique em "Gestão de Chaves" para obter o token

## Suporte SERPRO

Se tiver problemas para obter tokens:

- **Email**: css.serpro@serpro.gov.br
- **Telefone**: 0800 728 2323
- **Horário**: Segunda a sexta, 8h às 18h (horário de Brasília)

## Testando a Conexão

Após configurar os tokens, você pode testar com:

```bash
# Exemplo de teste com curl (substitua SEU_TOKEN)
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/consulta/40442820135" \
  -H "Authorization: Bearer SEU_TOKEN"
```

Se retornar dados, o token está funcionando!

---

**Última atualização**: 06/12/2025
