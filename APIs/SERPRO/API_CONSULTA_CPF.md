# API SERPRO - Consulta CPF

**Dados de Pessoas Físicas Direto da Receita Federal**

---

## VISÃO GERAL

A Consulta CPF é a solução oficial que conecta sua empresa diretamente à base da Receita Federal do Brasil, oferecendo dados sempre atualizados para validação cadastral, automatização de formulários, além de informações essenciais como data de nascimento e verificação de óbito.

### Por que usar?

- Fortalece seus processos de cadastro
- Reduz riscos de fraude
- Protege sua operação contra golpes
- Garante mais segurança e confiabilidade para o seu negócio

### Como a Consulta CPF pode ajudar sua empresa

| Benefício | Descrição |
|-----------|-----------|
| **Decisões financeiras mais seguras** | Reduza a inadimplência e fortaleça a adimplência com base em dados oficiais que apoiam decisões de crédito confiáveis |
| **Dados oficiais e confiáveis** | Consulte restrições cadastrais diretamente na Receita Federal, garantindo análises com base em informações atualizadas e oficiais |
| **Crédito mais seguro** | Aprimore a análise de crédito e a gestão de carteiras, otimizando processos e reduzindo riscos financeiros |
| **Prevenção a fraudes** | Minimize fraudes com acesso a bases da RFB, protegendo seus negócios com dados de alta confiabilidade |
| **Agilidade para novos negócios** | Automatize consultas ao CPF e acelere a prospecção, conquistando clientes com mais rapidez e eficiência |

---

## BENEFÍCIOS

- Acesso a informações diretamente do Governo, sem intermediários
- Confiabilidade das informações
- Informações sempre atualizadas
- Melhora a qualidade da avaliação de crédito
- Minimiza o risco de fraudes
- Possibilita checagem automática de informações
- Segurança da informação

---

## INFORMAÇÕES RETORNADAS

Ao fazer uma requisição, você insere um número de CPF e obtém os seguintes dados:

| Campo | Valor de Retorno |
|-------|------------------|
| **NI** | Número de Inscrição no Cadastro de Pessoa Física, no formato 99999999999 |
| **Nome** | Nome da Pessoa Física |
| **Situação** | Situação Cadastral da Pessoa Física, formada por dois campos: Código e Descrição |
| **Situação/Código** | Código da Situação Cadastral da Pessoa Física |
| **Situação/Descrição** | Descrição da Situação Cadastral da Pessoa Física |
| **Data de Nascimento** | Data de Nascimento da Pessoa Física, no formato DDMMAAAA |
| **Ano de Óbito** | Ano de Óbito da Pessoa Física, no formato AAAA |
| **Data de Inscrição** | Data de Inscrição da Pessoa Física, no formato DDMMAAAA |
| **Nome Social** | Nome Social da Pessoa Física |

### Situações Cadastrais Possíveis

| Código | Descrição |
|--------|-----------|
| 0 | Regular |
| 2 | Suspensa |
| 3 | Titular Falecido |
| 4 | Pendente de Regularização |
| 5 | Cancelada por Multiplicidade |
| 8 | Nula |
| 9 | Cancelada de Ofício |

---

## INFORMAÇÕES TÉCNICAS

| Item | Valor |
|------|-------|
| **Tipo** | API HTTP REST |
| **Formato** | JSON |
| **Autenticação** | OAuth 2.0 (Bearer Token) |
| **Documentação** | https://apicenter.estaleiro.serpro.gov.br/documentacao/consulta-cpf/ |
| **Loja** | https://loja.serpro.gov.br/consultacpf |

### Implementação

A implementação é simples: ao contratar o serviço, sua equipe de TI ou consultoria técnica pode integrar rapidamente a funcionalidade aos seus sistemas, permitindo que sua empresa passe a contar com consultas diretas e automáticas ao Cadastro de Pessoas Físicas (CPF).

---

## MODELO DE COBRANÇA

### Características

- **Pague conforme seu consumo** - sem franquia mínima
- **Apuração mensal** - Volume de consultas determina a faixa de preço
- **Cálculo:** Total = Quantidade × Preço unitário da faixa

### Tabela de Preços (Novembro/2025)

| Faixa | Quantidade de Consultas | Preço por Consulta (R$) |
|-------|-------------------------|-------------------------|
| 1 | Até 999 | R$ 0,6591 |
| 2 | 1.000 até 9.999 | R$ 0,5649 |
| 3 | 10.000 até 49.999 | R$ 0,3557 |
| 4 | 50.000 até 99.999 | R$ 0,2616 |
| 5 | 100.000 a 249.999 | R$ 0,1775 |
| 6 | 250.000 a 499.999 | R$ 0,1569 |
| 7 | 500.000 a 999.999 | R$ 0,1465 |
| 8 | 1.000.000 a 1.499.999 | R$ 0,1360 |
| 9 | 1.500.000 a 2.999.999 | R$ 0,1151 |
| 10 | 3.000.000 a 4.499.999 | R$ 0,0732 |
| 11 | 4.500.000 a 9.999.999 | R$ 0,0523 |
| 12 | 10.000.000 a 16.999.999 | R$ 0,0314 |
| 13 | 17.000.000 a 19.999.999 | R$ 0,026 |
| 14 | 20.000.000 a 24.999.999 | R$ 0,023 |
| 15 | 25.000.000 a 29.999.999 | R$ 0,02 |
| 16 | Acima de 30.000.000 | R$ 0,017 |

### Simulação de Custos

| Consultas/Mês | Faixa | Preço Unit. | Custo Total |
|---------------|-------|-------------|-------------|
| 100 | 1 | R$ 0,6591 | R$ 65,91 |
| 500 | 1 | R$ 0,6591 | R$ 329,55 |
| 1.000 | 2 | R$ 0,5649 | R$ 564,90 |
| 5.000 | 2 | R$ 0,5649 | R$ 2.824,50 |
| 10.000 | 3 | R$ 0,3557 | R$ 3.557,00 |
| 50.000 | 4 | R$ 0,2616 | R$ 13.080,00 |
| 100.000 | 5 | R$ 0,1775 | R$ 17.750,00 |

---

## CASOS DE USO

### 1. Onboarding de Clientes
Valide automaticamente os dados cadastrais de novos clientes durante o cadastro.

### 2. Análise de Crédito
Verifique a situação cadastral do CPF antes de aprovar crédito.

### 3. Prevenção a Fraudes
Detecte CPFs irregulares, cancelados ou de pessoas falecidas.

### 4. Atualização Cadastral
Mantenha sua base de dados atualizada com informações oficiais.

### 5. Due Diligence
Verifique a situação cadastral de pessoas em processos de investigação.

---

## VARIÁVEIS DE AMBIENTE

```env
# SERPRO - Consulta CPF
SERPRO_CPF_CONSUMER_KEY=sua_consumer_key
SERPRO_CPF_CONSUMER_SECRET=seu_consumer_secret
```

---

## COMO CONTRATAR

### Requisitos

1. **Certificado Digital e-CNPJ** da empresa contratante
2. Cadastro na Loja SERPRO

### Passos

1. Acessar https://loja.serpro.gov.br/consultacpf
2. Clicar em "Quero contratar"
3. Autenticar com certificado digital e-CNPJ
4. Aceitar termos e condições
5. Configurar credenciais de API

### Contato

| Canal | Informação |
|-------|------------|
| **Email** | css.serpro@serpro.gov.br |
| **Telefone** | 0800 728 2323 |
| **Formulário** | Disponível na Loja SERPRO |

---

## COMPARATIVO: SERPRO vs INFOSIMPLES

| Característica | SERPRO Consulta CPF | Infosimples CPF |
|----------------|---------------------|-----------------|
| Fonte | Receita Federal (oficial) | Receita Federal (scraping) |
| Preço (baixo volume) | R$ 0,6591 | R$ 0,24 |
| Preço (alto volume) | R$ 0,017 | R$ 0,05 |
| Dados de Óbito | Ano de óbito | Indicação de óbito |
| Nome Social | Sim | Não |
| Data de Inscrição | Sim | Não |
| Confiabilidade | Máxima (oficial) | Alta |
| Disponibilidade | Alta | Depende do site RFB |

**Recomendação:**
- Para **alto volume** (>10.000/mês): SERPRO é mais barato
- Para **baixo volume** (<1.000/mês): Infosimples é mais barato
- Para **máxima confiabilidade**: SERPRO (fonte oficial)

---

**Documento atualizado em:** 29/11/2025
**Fonte:** SERPRO - https://loja.serpro.gov.br
