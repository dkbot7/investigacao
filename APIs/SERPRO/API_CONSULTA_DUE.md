# API SERPRO - Consulta DU-E

**Declaração Única de Exportação - Dados de Comércio Exterior**

---

## VISÃO GERAL

A Consulta DU-E é uma ferramenta que automatiza a integração aos dados da Declaração Única de Exportação, facilitando para quem precisa garantir a segurança, a legalidade e a conformidade das operações de câmbio relacionadas a pagamentos internacionais.

### O que é a DU-E?

A Declaração Única de Exportação (DU-E) contém informações essenciais que fornecem transparência e garantem que as transações de exportação sejam processadas corretamente. Contém informações de natureza administrativa, comercial, financeira, fiscal e logística que caracterizam a operação de exportação de bens.

---

## FUNCIONALIDADES

| Funcionalidade | Descrição |
|----------------|-----------|
| **Comprovação da exportação** | Valide que uma exportação foi realizada |
| **Validação da operação** | Confirme dados da operação de câmbio |
| **Controle e conformidade** | Garanta conformidade regulatória |
| **Processamento de pagamentos** | Automatize operações de câmbio |
| **Redução de riscos** | Minimize fraudes em operações internacionais |

---

## DADOS RETORNADOS

### Informações Disponíveis

| Categoria | Dados |
|-----------|-------|
| **Identificação** | Informações básicas de identificação da operação de exportação |
| **Situação** | Situação atual da DU-E em relação aos controles aduaneiros, administrativos e controle de carga |
| **Locais** | Locais de Despacho e Embarque |
| **Itens** | Itens da DU-E (produtos exportados) |
| **Histórico** | Histórico de movimentações |
| **Partes** | Identificação do vendedor e comprador |

### Fonte dos Dados

- Receita Federal do Brasil
- Secretaria de Comércio Exterior (SECEX)

---

## BENEFÍCIOS

- Melhora a qualidade da avaliação de crédito ao exportador
- Minimiza o risco de fraudes em operações de câmbio
- Informações sempre atualizadas
- Segurança da informação
- Confiabilidade das informações (fonte oficial)
- Possibilita checagem automática de informações
- Acesso a dados do governo em tempo real

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-due/ |
| **Loja** | https://loja.serpro.gov.br/consultadue |

---

## MODELO DE COBRANÇA

### Características

- **Contratação 100% online** com liberação imediata
- **Cancele a qualquer momento**, sem taxas ou multas
- **Preço PROGRESSIVO/ESCALONADO**: quanto mais consultas fizer, menor o custo por requisição
- **Valor fixo inicial** + consultas excedentes por faixa

### ⚠️ IMPORTANTE: Modelo de Cobrança Escalonado

O SERPRO usa um modelo **progressivo**, onde você paga cada faixa até esgotar:

1. **Faixa 1**: Paga valor fixo de R$ 2.789,07 para até 999 consultas
2. **Faixa 2**: Após esgotar Faixa 1, paga R$ 2,7829/consulta até 9.999
3. **Faixa 3**: Após esgotar Faixa 2, paga R$ 1,6844/consulta até 49.999
4. E assim por diante...

### Tabela de Preços (Novembro/2025)

| Faixa | Quantidade de Consultas | Valor |
|-------|-------------------------|-------|
| **Faixa 1 (Valor Fixo)** | De 0 a 999 | **R$ 2.789,07** (fixo) |
| Faixa 2 | De 1.000 a 9.999 | R$ 2,7829 / consulta |
| Faixa 3 | De 10.000 a 49.999 | R$ 1,6844 / consulta |
| Faixa 4 | De 50.000 a 99.999 | R$ 1,0985 / consulta |
| Faixa 5 | De 100.000 a 499.999 | R$ 0,837 / consulta |
| Faixa 6 | De 500.000 a 1.499.999 | R$ 0,5440 / consulta |
| Faixa 7 | De 1.500.000 a 4.499.999 | R$ 0,2720 / consulta |
| Faixa 8 | De 4.500.000 a 13.499.999 | R$ 0,1360 / consulta |
| Faixa 9 | A partir de 13.500.000 | R$ 0,0732 / consulta |

**Obs:** Esta tabela se aplica ao mercado privado (submetidos à Lei nº 10.406/02) e Estatais (Empresas Públicas e Sociedades de Economia Mista submetidas à Lei nº 13.303/16.0)

### Simulação de Custos (Modelo Escalonado)

| Consultas/Mês | Cálculo | Custo Total |
|---------------|---------|-------------|
| 500 | Faixa 1 (fixo) | R$ 2.789,07 |
| 999 | Faixa 1 (fixo) | R$ 2.789,07 |
| 1.000 | Faixa 1 + 1 × R$ 2,7829 | R$ 2.791,85 |
| 5.000 | Faixa 1 + 4.001 × R$ 2,7829 | R$ 13.922,12 |
| 10.000 | Faixa 1 + 9.000 × R$ 2,7829 + 1 × R$ 1,6844 | R$ 27.837,94 |
| 50.000 | Faixas 1-3 + excedente | ~R$ 95.000,00 |

---

## CASOS DE USO

### 1. Bancos e Instituições Financeiras
Validação de operações de câmbio vinculadas a exportações.

### 2. Empresas de Comércio Exterior
Automação de processos de exportação e compliance.

### 3. Tradings
Verificação de declarações de exportação de clientes.

### 4. Auditoria e Compliance
Verificação de conformidade de operações de câmbio.

### 5. Due Diligence
Análise de histórico de exportações de empresas.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta DU-E
SERPRO_DUE_CONSUMER_KEY=sua_consumer_key
SERPRO_DUE_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/consultadue
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

**Documento atualizado em:** 29/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
