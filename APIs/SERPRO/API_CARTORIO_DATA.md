# API SERPRO - Cartório Data

**Informações Oficiais da Receita Federal para Cartórios**

---

## VISÃO GERAL

O Cartório Data possibilita aos Cartórios de todo o Brasil consumirem informações oficiais da Receita Federal do Brasil, necessárias ao cumprimento das obrigações estabelecidas no **Provimento CNJ nº 88/2019**.

### Provimento CNJ nº 88/2019

Este provimento do Conselho Nacional de Justiça estabelece obrigações para cartórios quanto à verificação de dados cadastrais de pessoas físicas e jurídicas em atos notariais e de registro.

---

## FUNCIONALIDADES

### 1. Consulta de Dados de Pessoas Físicas

- Validação de CPF
- Verificação de situação cadastral
- Dados cadastrais básicos

### 2. Consulta de Dados de Pessoas Jurídicas

- Validação de CNPJ
- Situação cadastral da empresa
- Dados cadastrais básicos

### 3. Conformidade Regulatória

- Atendimento ao Provimento CNJ nº 88/2019
- Registros auditáveis de consultas
- Integração com sistemas cartoriais

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Público-Alvo** | Exclusivo para Cartórios |
| **Base Legal** | Provimento CNJ nº 88/2019 |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/cartorio-data/ |
| **Loja** | https://loja.serpro.gov.br/cartoriodata |

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Quanto maior o volume, menor o preço unitário
- **Exclusivo para Cartórios** - não disponível para outros tipos de empresa

### Tabela de Preços

> **NOTA:** A tabela de preços específica do Cartório Data deve ser consultada diretamente na [Loja SERPRO](https://loja.serpro.gov.br/cartoriodata).

---

## CASOS DE USO

### 1. Escrituras Públicas
Verificação de CPF/CNPJ das partes em escrituras.

### 2. Registros de Imóveis
Validação cadastral em transferências de propriedade.

### 3. Reconhecimento de Firma
Confirmação de identidade para autenticações.

### 4. Procurações
Validação de dados em procurações públicas.

### 5. Registro de Contratos
Verificação de partes em contratos registrados.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Cartório Data
SERPRO_CARTORIO_CONSUMER_KEY=sua_consumer_key
SERPRO_CARTORIO_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Ser Cartório** registrado no CNJ
2. **Certificado Digital e-CNPJ** do cartório
3. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/cartoriodata
2. Clicar em "Quero contratar"
3. Autenticar com certificado digital e-CNPJ
4. Aceitar termos e condições
5. Configurar credenciais de API

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
**Base Legal:** Provimento CNJ nº 88/2019
