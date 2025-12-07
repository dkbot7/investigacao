# APIs Não Contratadas

Esta pasta contém informações sobre APIs SERPRO disponíveis mas que **não foram contratadas ainda**.

## APIs Disponíveis (Não Contratadas)

### 1. Consultas Fiscais/Financeiras
- **Consulta Restituição** - Restituição do IRPF
- **Consulta NFE** - Notas Fiscais Eletrônicas

### 2. Consultas de Trânsito (SENATRAN)
- **Senatran Básica** - Dados básicos
- **Senatran Indicadores** - Com indicadores
- **Senatran Detalhada** - Informações completas
- **Senatran Com Imagem** - Com foto/imagem

### 3. Validação de Identidade
- **Biovalid** - Prova de vida
- **Cartório Data** - Dados para cartórios

### 4. Comércio Exterior
- **Consulta DU-E** - Declaração Única de Exportação
- **Integra Comex** - Sistema Siscomex

### 5. Imóveis Rurais
- **Consulta CCIR** - Certificado de Imóveis Rurais

### 6. Documentos Digitais
- **Carimbo do Tempo** - Selo temporal (standalone)

### 7. Integração Governamental
- **Integra SIAFI** - Sistema financeiro federal
- **Conecta Gov.br** - Interoperabilidade governamental
- **AntecipaGov** - Crédito para fornecedores

### 8. Setor Específico
- **Integra Loja Franca** - Lojas francas de fronteira

### 9. Privacidade e LGPD
- **SERPRO LGPD / PDC** - Gestão de privacidade

## Como contratar uma dessas APIs

1. Acesse https://loja.serpro.gov.br
2. Faça login com certificado digital e-CNPJ
3. Navegue pelo catálogo e escolha a API desejada
4. Contrate (trial ou produção)
5. Vá em "Gestão de Chaves" e copie o token
6. Cole no arquivo `.env` principal (pasta raiz)
7. Adicione o token obtido

## Mais informações

Consulte a documentação oficial:
- https://apicenter.estaleiro.serpro.gov.br/documentacao/
- RESUMO_APIS_SERPRO.md (pasta raiz)
