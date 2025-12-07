# API Consulta CPF

## 📋 Visão Geral

Consulta de dados cadastrais de CPF diretamente da base da Receita Federal do Brasil.

**Contrato:** 260005
**Status:** ✅ ATIVO
**Versão:** V2

---

## 📁 Arquivos nesta pasta

- **`DOCUMENTACAO_TECNICA.md`** - ⭐ Documentação técnica completa (schemas, endpoints, exemplos)
- **`API_CONSULTA_CPF.md`** - Documentação técnica da API
- **`api-consulta-cpf-v2.md`** - Documentação adicional V2
- **`PRECOS.csv`** - Tabela de preços (abre no Excel)
- **`README.md`** - Este arquivo

## 📄 Contrato Oficial

**Contrato 260005**
📎 `../contratos/29814517000104-pedido-473450-contrato-260005.pdf`

---

## 🔑 Token

Configure o token no arquivo `.env` da raiz:
```env
SERPRO_CPF_TOKEN=seu_token_aqui
```

---

## 🚀 Quick Start

### Endpoint
```
GET https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/consulta/{cpf}
```

### Exemplo cURL
```bash
curl -X GET "https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v2/consulta/40442820135" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📊 Dados Retornados

- Nome completo
- Situação cadastral
- Data de nascimento
- Data de óbito (se aplicável)
- Carimbo de tempo

---

## 💰 Preços

**Faixa 1:** R$ 0,6591 por consulta (até 999)

Consulte `PRECOS.csv` para tabela completa.

---

## 📚 Recursos Incluídos

- ✅ Consulta CPF direto na faixa V2
- ✅ Check Time Stamp (Carimbo de Tempo)

---

## 🔗 Links Úteis

- [Documentação Oficial - Geral](https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cpf/)
- [Documentação Detalhada - Chamadas API](https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cpf/pt/chamadas/consulta-cpf-df/)
- [Loja SERPRO](https://loja.serpro.gov.br/consultacpf)
- [Suporte](mailto:css.serpro@serpro.gov.br)
