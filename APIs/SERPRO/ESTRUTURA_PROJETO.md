# Estrutura do Projeto - APIs SERPRO

## Visão Geral

Este diretório contém toda a documentação e configuração para integração com as APIs do SERPRO.

---

## Estrutura de Arquivos

```
SERPRO/
├── .env                          # Configuração das APIs CONTRATADAS
├── .gitignore                    # Proteção de arquivos sensíveis
├── COMO_OBTER_TOKENS.md         # Guia para obter tokens
├── RESUMO_APIS_SERPRO.md        # Resumo de todas as APIs disponíveis
├── ESTRUTURA_PROJETO.md         # Este arquivo
│
├── APIs_Nao_Contratadas/        # APIs disponíveis mas não contratadas
│   ├── README.md
│   ├── .env.apis_nao_contratadas
│   ├── API_CONSULTA_CND.md
│   ├── API_CONSULTA_RESTITUICAO.md
│   ├── API_CONSULTA_NFE.md
│   ├── API_CONSULTA_SENATRAN.md
│   ├── API_BIOVALID.md
│   ├── API_CARTORIO_DATA.md
│   ├── API_CONSULTA_DUE.md
│   ├── API_INTEGRA_COMEX.md
│   ├── API_CONSULTA_CCIR.md
│   ├── API_CARIMBO_TEMPO.md
│   ├── API_INTEGRA_SIAFI.md
│   ├── API_CONECTA_GOVBR.md
│   ├── API_ANTECIPAGOV.md
│   ├── API_INTEGRA_LOJA_FRANCA.md
│   └── API_SERPRO_LGPD_PDC.md
│
└── Documentação APIs Contratadas/
    ├── API_CONSULTA_CPF.md
    ├── api-consulta-cpf-v2.md
    ├── API_CONSULTA_CNPJ.md
    ├── API_CONSULTA_DIVIDA_ATIVA.md
    ├── API_CONSULTA_FATURAMENTO.md
    ├── API_CONSULTA_RENDA.md
    ├── API_DATAVALID.md
    └── API_INTEGRA_CONTADOR.md
```

---

## APIs Contratadas (8 contratos)

### 1. Consulta CPF (Contrato 260005)
- **Arquivo**: `API_CONSULTA_CPF.md`, `api-consulta-cpf-v2.md`
- **Variável**: `SERPRO_CPF_TOKEN`
- **Versão**: V2
- **Recursos**: Direto na faixa + Check Time Stamp

### 2. Consulta CNPJ (Contrato 260009)
- **Arquivo**: `API_CONSULTA_CNPJ.md`
- **Variável**: `SERPRO_CNPJ_TOKEN`
- **Versão**: V2
- **Recursos**: Mercado Privado + Check Time Stamp

### 3. Consulta Dívida Ativa (Contrato 261069)
- **Arquivo**: `API_CONSULTA_DIVIDA_ATIVA.md`
- **Variável**: `SERPRO_DIVIDA_ATIVA_TOKEN`
- **Versão**: V1
- **Recursos**: Direto na faixa

### 4. Consulta Faturamento (Contrato 261073)
- **Arquivo**: `API_CONSULTA_FATURAMENTO.md`
- **Variável**: `SERPRO_FATURAMENTO_TOKEN`
- **Versão**: V1

### 5. Consulta Renda (Contratos 260008 e 261071)
- **Arquivo**: `API_CONSULTA_RENDA.md`
- **Variável**: `SERPRO_RENDA_TOKEN`
- **Versão**: V1
- **Observação**: 2 contratos

### 6. Datavalid (Contrato 261070)
- **Arquivo**: `API_DATAVALID.md`
- **Variável**: `SERPRO_DATAVALID_TOKEN`
- **Versão**: V4
- **Recursos**: Mercado Privado Individual + Carimbo de Tempo

### 7. Integra Contador (Contrato 261074)
- **Arquivo**: `API_INTEGRA_CONTADOR.md`
- **Variável**: `SERPRO_INTEGRA_CONTADOR_TOKEN`
- **Versão**: V1

### 8. Plataforma Raiz Tech - Pastagens Degradadas (Contrato 261072)
- **Arquivo**: Documentação não disponível
- **Variável**: `SERPRO_RAIZ_TECH_PASTAGENS_TOKEN`
- **Versão**: V1
- **Observação**: API especializada em agronegócio

---

## APIs Não Contratadas (15 APIs)

Todas localizadas em: `APIs_Nao_Contratadas/`

1. Consulta CND
2. Consulta Restituição
3. Consulta NFE
4. Senatran Básica
5. Senatran Indicadores
6. Senatran Detalhada
7. Senatran Com Imagem
8. Biovalid
9. Cartório Data
10. Consulta DU-E
11. Integra Comex
12. Consulta CCIR
13. Carimbo do Tempo
14. Integra SIAFI
15. Conecta Gov.br
16. AntecipaGov
17. Integra Loja Franca
18. SERPRO LGPD / PDC

---

## Próximos Passos

### 1. Configurar Tokens
1. Acesse https://loja.serpro.gov.br
2. Vá em "Gestão de Chaves"
3. Copie os tokens de cada API
4. Cole no arquivo `.env`

### 2. Testar Conexões
Após configurar os tokens, teste cada API:
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/consulta/40442820135" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 3. Desenvolver Integrações
- Criar cliente HTTP para cada API
- Implementar tratamento de erros
- Configurar rate limiting
- Implementar logging

---

## Segurança

- O arquivo `.env` está em `.gitignore`
- Nunca commite tokens no Git
- Use variáveis de ambiente em produção
- Mantenha backups seguros dos tokens
- Revogue tokens comprometidos imediatamente

---

## Suporte

- **Loja SERPRO**: https://loja.serpro.gov.br
- **Email**: css.serpro@serpro.gov.br
- **Telefone**: 0800 728 2323
- **Documentação**: https://apicenter.estaleiro.serpro.gov.br/documentacao/

---

**Última atualização**: 06/12/2025
