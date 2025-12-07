# API SERPRO - Consulta Restituição

**Dados de Restituição do Imposto de Renda**

---

## VISÃO GERAL

A Consulta Restituição é um serviço de informação que permite a realização de consultas de dados, através de API, sobre o direito à restituição do imposto de renda, apurado na última Declaração de Imposto de Renda transmitida à Receita Federal.

### Integração com Compartilha Receita

O serviço está integrado à plataforma **Compartilha Receita**, que é o sistema de gestão de autorizações de compartilhamento de dados da Receita Federal. Com essa ferramenta:

- O contribuinte pessoa física pode **autorizar** o compartilhamento dos dados da sua restituição
- Pessoas jurídicas contratantes (ex: instituições financeiras) podem consultar os dados autorizados
- O cidadão mantém **controle total** sobre suas autorizações

---

## COMO FUNCIONA

### Modelo de Consentimento

> "Não será o Estado entregando dados do cidadão, mas o próprio cidadão, em seu interesse pessoal, que acessará a base de dados do Estado."

1. **Cidadão autoriza** o compartilhamento via e-CAC
2. **Gera TokenCompartilhamento** com assinatura digital
3. **Define vigência** da autorização
4. **Empresa consulta** usando o token autorizado
5. **Dados criptografados** são transmitidos

### Endpoints Disponíveis

| Método | Descrição |
|--------|-----------|
| `/Consultar` | Consulta dados de restituição |
| `/Autorizacoes` | Gerenciamento de autorizações |
| `/Status` | Verificação de status do serviço |

---

## DADOS RETORNADOS

Informações sobre a restituição do IRPF:
- Direito à restituição
- Valor da restituição
- Status do processamento
- Lote de restituição
- Data prevista/efetivada

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 + TokenCompartilhamento |
| **Versão** | v1.0 |
| **Protocolo TLS** | 1.3 (obrigatório desde Out/2024) |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/api-restituicao/ |
| **Loja** | https://loja.serpro.gov.br/consultarestituicao |

### Segurança

- Transmissão de arquivos criptografados
- Chaves públicas padrão ICP-Brasil
- Protocolo TLS 1.3 obrigatório
- Versões TLS 1.0 e 1.1 desabilitadas desde 31/10/2024

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Quanto maior o volume, menor o preço unitário
- **Demonstração gratuita** disponível para testar antes de contratar

### Tabela de Preços

> **NOTA:** A tabela de preços específica deve ser consultada diretamente na [Loja SERPRO](https://loja.serpro.gov.br/consultarestituicao).

---

## CASOS DE USO

### 1. Instituições Financeiras
Validação de renda/restituição para concessão de crédito.

### 2. Antecipação de Restituição
Bancos que oferecem antecipação da restituição do IR.

### 3. Análise de Crédito
Complemento de informações para análise de crédito.

### 4. Financiamentos
Comprovação de renda para financiamentos.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta Restituição
SERPRO_RESTITUICAO_CONSUMER_KEY=sua_consumer_key
SERPRO_RESTITUICAO_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante (padrão ICP-Brasil)
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/consultarestituicao
2. Testar na área "Demonstração" (opcional)
3. Clicar em "Quero contratar"
4. Autenticar com certificado digital e-CNPJ
5. Aceitar termos e condições
6. Configurar credenciais de API

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
