# API Consulta CND

## 📋 Visão Geral

Certidão Negativa de Débitos - Consulta de CND de PF, PJ e Imóveis Rurais.

**Contrato:** 261075
**Status:** ✅ ATIVO
**Versão:** V1

---

## 📁 Arquivos nesta pasta

- **`PRECOS.csv`** - Tabela de preços (abre no Excel)
- **`README.md`** - Este arquivo

## 📄 Contrato Oficial

**Contrato 261075**
📎 `../contratos/29814517000104-pedido-476008-contrato-261075.pdf`

**Inclui:**
- ✅ Consulta CND - CONTRATO 261075
- ✅ Consulta CND Check Time Stamp - CONTRATO 261075

---

## 🔑 Token

Configure o token no arquivo `.env` da raiz:
```env
SERPRO_CND_TOKEN=seu_token_aqui
```

---

## 🚀 Quick Start

### Endpoint
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cnd/v1/certidao/{ni}
```

### Exemplo cURL
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cnd/v1/certidao/40442820135" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Parâmetro:**
- `{ni}`: CPF (11 dígitos), CNPJ (14 dígitos) ou NIRF (Número Imóvel Rural)

---

## 📊 Dados Retornados

- ✅ Código de controle da certidão
- ✅ Tipo de certidão (Negativa ou Positiva com Efeitos de Negativa)
- ✅ Validade da certidão
- ✅ Nome/Razão Social
- ✅ Situação fiscal federal
- ✅ Carimbo de tempo

---

## 💰 Preços

**Faixa 1:** R$ 0,8788 por consulta (até 5.000)

Consulte `PRECOS.csv` para tabela completa.

---

## 📚 Recursos Incluídos

- ✅ Consulta CND para Pessoas Físicas
- ✅ Consulta CND para Pessoas Jurídicas
- ✅ Consulta CND para Imóveis Rurais (NIRF)
- ✅ Check Time Stamp (Carimbo de Tempo)
- ✅ Emissão automática de nova certidão se necessário

---

## 🎯 Casos de Uso

- Verificação de regularidade fiscal
- Due diligence
- Análise de crédito
- Licitações e contratos públicos
- Transações imobiliárias
- Habilitação de fornecedores

---

## 🔗 Links Úteis

- [Documentação Oficial](https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cnd/)
- [Loja SERPRO](https://loja.serpro.gov.br/consultacnd)
- [Suporte](mailto:css.serpro@serpro.gov.br)
