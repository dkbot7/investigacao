# API SERPRO - Integra Comex

**Integração com Sistemas de Comércio Exterior (Siscomex)**

---

## VISÃO GERAL

O Integra Comex é um produto baseado em um conjunto de serviços vinculados aos sistemas da família **Siscomex**, que capacita profissionais de comércio exterior a acessarem bases de dados críticas para suas operações.

### O que é o Siscomex?

O Sistema Integrado de Comércio Exterior (Siscomex) é o sistema informatizado do governo federal que integra as atividades de registro, acompanhamento e controle das operações de comércio exterior.

---

## FUNCIONALIDADES

### Consultas Disponíveis

| Funcionalidade | Descrição |
|----------------|-----------|
| **Consulta de Habilitações** | Verificar habilitações de um CNPJ para operar no comércio exterior |
| **Consulta Avulsa da DI** | Consulta de Declaração de Importação |
| **Consulta LPCO** | Licenças, Permissões, Certificados e Outros documentos |
| **Consulta DUIMP** | Dados da Declaração Única de Importação |
| **Gestão de Cargas** | Informações sobre gestão de cargas |
| **Exportação** | Dados de operações de exportação |
| **Importação** | Dados de operações de importação |

### Níveis de Visibilidade

A API oferece dois grupos de serviços:

| Tipo | Descrição |
|------|-----------|
| **Visibilidade Pública** | Serviços abertos para consulta |
| **Visibilidade Restrita** | Acesso limitado por perfil (Terceiros ou Operador) |

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/integra-comex/ |
| **Loja** | https://loja.serpro.gov.br/integracomex |

### Disponibilidade

Os serviços operam de acordo com o nível de serviço dos sistemas da família Siscomex, com manutenção programada entre 1h e 3h.

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Modelo ESCALONADO**: Quanto maior o volume, menor o preço unitário

### Tabela de Preços

> **NOTA:** A tabela de preços específica do Integra Comex deve ser consultada diretamente na [Loja SERPRO](https://loja.serpro.gov.br/integracomex).

---

## CASOS DE USO

### 1. Despachantes Aduaneiros
Consulta e acompanhamento de processos de importação/exportação.

### 2. Trading Companies
Gestão de operações de comércio exterior.

### 3. Importadores/Exportadores
Acompanhamento de suas próprias operações.

### 4. Transportadoras
Gestão de cargas internacionais.

### 5. Bancos de Câmbio
Validação de operações para fechamento de câmbio.

### 6. Consultoria em Comércio Exterior
Prestação de serviços para clientes.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Integra Comex
SERPRO_COMEX_CONSUMER_KEY=sua_consumer_key
SERPRO_COMEX_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO
3. Habilitação no Siscomex (para alguns serviços)

### Passos

1. Acessar https://loja.serpro.gov.br/integracomex
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
