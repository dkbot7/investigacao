# API SERPRO - Integra Contador

**Plataforma de Serviços para o Mercado Contábil e Fiscal**

---

## VISÃO GERAL

O Integra Contador é uma plataforma que disponibiliza serviços voltados ao mercado contábil e fiscal, atendendo escritórios de contabilidade e empresas relacionadas. Oferece **84 funcionalidades** distribuídas em diversos módulos.

### Requisitos de Acesso

- Credenciais digitais obtidas na Loja SERPRO
- Certificado digital e-CNPJ para autenticação
- Procuração digital do contribuinte (para serviços que requerem autorização)

---

## MÓDULOS E FUNCIONALIDADES

### 1. Integra-SN (Simples Nacional)

| Serviço | Descrição |
|---------|-----------|
| **DEFIS** | Declarações fiscais do Simples Nacional |
| **PGDAS-D** | Programa Gerador do Documento de Arrecadação |
| **REGIMEAPURACAO** | Opções de regime de apuração |

### 2. Integra-MEI (Microempreendedor Individual)

| Serviço | Descrição |
|---------|-----------|
| **PGMEI** | Programa Gerador de DAS do MEI |
| **CCMEI** | Certificado da Condição de MEI |

### 3. Integra-DCTFWeb (Débitos e Créditos Tributários)

| Serviço | Descrição |
|---------|-----------|
| **DCTFWEB** | Declaração de Débitos e Créditos Tributários |
| **MIT** | Módulo de Inclusão de Tributos |

### 4. Integra-Parcelamento

| Serviço | Tipo |
|---------|------|
| **PARCSN / PERTSN / RELPSN** | Parcelamentos Simples Nacional |
| **PARCMEI / PERTMEI / RELPMEI** | Parcelamentos MEI |

### 5. Serviços Adicionais

| Serviço | Descrição |
|---------|-----------|
| **PROCURACOES** | Gestão de procurações digitais |
| **SICALC** | Cálculos tributários e geração de DARF |
| **CAIXAPOSTAL** | Caixa postal/mensagens da RFB |
| **PGTOWEB** | Consulta de pagamentos |
| **SITFIS** | Relatórios de situação fiscal |
| **PNRCONTADOR** | Vinculação de cadastro de empresas |
| **E-PROCESSO** | Acompanhamento de processos digitais |
| **AUTENTICAPROCURADOR** | Autenticação de procurador |
| **EVENTOSATUALIZACAO** | Monitoramento de eventos |

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 + Certificado Digital |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/api-integra-contador/ |
| **Loja** | https://loja.serpro.gov.br/integracontador |
| **Catálogo** | 84 funcionalidades disponíveis |

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Quanto maior o volume, menor o preço unitário

### Tabela de Preços

> **NOTA:** A tabela de preços específica do Integra Contador deve ser consultada diretamente na [Loja SERPRO](https://loja.serpro.gov.br/integracontador).
>
> O catálogo de serviços exibe a situação de todos os serviços, contendo o "roadmap" de todos os serviços do produto.

---

## CASOS DE USO

### 1. Escritórios de Contabilidade
Automação de obrigações fiscais de clientes.

### 2. Empresas de Software Contábil
Integração de funcionalidades da RFB em sistemas próprios.

### 3. Departamentos Fiscais
Gestão interna de obrigações tributárias.

### 4. Consultorias Tributárias
Prestação de serviços especializados.

### 5. ERPs e Sistemas Empresariais
Integração de módulos fiscais.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Integra Contador
SERPRO_CONTADOR_CONSUMER_KEY=sua_consumer_key
SERPRO_CONTADOR_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO
3. Procuração digital dos contribuintes (para serviços que requerem)

### Passos

1. Acessar https://loja.serpro.gov.br/integracontador
2. Clicar em "Quero contratar"
3. Autenticar com certificado digital e-CNPJ
4. Aceitar termos e condições
5. Configurar credenciais de API
6. Configurar procurações digitais conforme necessário

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |

---

**Documento atualizado em:** 30/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
