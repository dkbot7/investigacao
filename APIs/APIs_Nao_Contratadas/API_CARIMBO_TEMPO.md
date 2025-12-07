# API SERPRO - Carimbo do Tempo

**Validação e Emissão de Carimbo de Tempo para Documentos Digitais**

---

## VISÃO GERAL

O Carimbo do Tempo do SERPRO é um serviço que garante a existência de um documento digital em determinado momento, fornecendo prova legal de que o documento existia na data e hora especificadas.

### O que é Carimbo do Tempo?

O carimbo do tempo (timestamp) é um selo digital que:
- Comprova a existência de um documento em determinada data/hora
- Garante que o conteúdo não foi alterado desde então
- Tem validade jurídica conforme ICP-Brasil
- É utilizado em contratos, documentos fiscais e processos judiciais

---

## FUNCIONALIDADES

### 1. Emissão de Carimbo do Tempo

- Geração de selo temporal para documentos digitais
- Vinculação de data/hora confiável (fonte oficial)
- Formato padrão ICP-Brasil

### 2. Validação de Carimbo do Tempo

- Verificação de autenticidade de carimbos emitidos
- Confirmação de integridade do documento
- Validação da cadeia de certificação

### 3. API Integrável

- Integração com sistemas próprios do cliente
- Automação de processos de assinatura digital
- Volume escalável conforme necessidade

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Padrão** | ICP-Brasil |
| **Documentação** | https://centraldeajuda.serpro.gov.br/duvidas/pt/documentacoes/doc_apicarimbo/ |
| **Loja** | https://loja.serpro.gov.br |

### Contratação Online

O serviço pode ser adquirido de forma online na Loja do SERPRO e também utilizado como API integrável a qualquer aplicação.

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Contratação online** - sem necessidade de contato comercial
- **API integrável** - para automação de processos

### Tabela de Preços

> **NOTA:** A tabela de preços específica do Carimbo do Tempo deve ser consultada diretamente na [Loja SERPRO](https://loja.serpro.gov.br).

---

## CASOS DE USO

### 1. Contratos Digitais
Prova de existência de contratos em determinada data.

### 2. Documentos Fiscais
Validação temporal de notas fiscais e documentos contábeis.

### 3. Processos Judiciais
Prova de existência de documentos em processos legais.

### 4. Propriedade Intelectual
Comprovação de autoria e data de criação.

### 5. Compliance
Atendimento a requisitos regulatórios de temporalidade.

### 6. Assinatura Digital
Complemento para assinaturas digitais com prova temporal.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Carimbo do Tempo
SERPRO_CARIMBO_CONSUMER_KEY=sua_consumer_key
SERPRO_CARIMBO_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar a Loja SERPRO
2. Buscar por "Carimbo do Tempo"
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
**Última atualização da documentação técnica:** 30/01/2024
