# CREDENCIAIS E CONFIGURAÇÕES - INVESTIGAREE

**Data de criação:** 2025-12-20
**Última atualização:** 2025-12-20

---

## 🔐 INFORMAÇÕES ORGANIZACIONAIS

### Claude Code / Anthropic

**Organização:**
- Nome: `investigaree`
- Código da organização: `ewc9D4qMQmO2IuDUohIwPA`

**Conta:**
- Email: `kaloidani@gmail.com`

**Uso:**
- Configurações enterprise do Claude Code
- Managed settings
- Billing e faturamento
- Controle de acesso a MCP servers

---

## ☁️ GOOGLE CLOUD PLATFORM

### Projeto Principal

**Informações do Projeto:**
- Nome do projeto: `investigaree`
- ID do projeto: `investigaree-481820`
- Número do projeto: `781185307720`

**Conta Autenticada:**
- Email: `kaloidani@gmail.com`

**Região/Zona:**
- Padrão (configurado via `gcloud init`)

### APIs Habilitadas

**Google Analytics:**
- ✅ Google Analytics Admin API (`analyticsadmin.googleapis.com`)
- ✅ Google Analytics Data API (`analyticsdata.googleapis.com`)

**Verificar APIs habilitadas:**
```bash
gcloud services list --enabled --project=investigaree-481820
```

### Credenciais

**Application Default Credentials (ADC):**
- Arquivo: `C:\Users\Vaio\AppData\Roaming\gcloud\application_default_credentials.json`
- Tipo: OAuth 2.0
- Escopo: `https://www.googleapis.com/auth/analytics.readonly`
- Criado via: `gcloud auth application-default login`

**Conta autenticada:**
```bash
gcloud auth list
# ACTIVE  ACCOUNT
# *       kaloidani@gmail.com
```

---

## 🌐 CLOUDFLARE PAGES

### Projeto

**Nome:** `investigaree-api`

**URLs de Produção:**
- https://investigaree.com.br
- https://www.investigaree.com.br

**Último Deploy:**
- Version ID: `7f3b1592-020c-4f3d-94cb-a55f2b6cfdd9`
- Data: 2025-12-20
- Commit: `d2081b2`

### Environment Variables (Produção)

**Configuradas:**
- (Nenhuma variável GA4 ainda)

**Pendente:**
- `NEXT_PUBLIC_GA4_ID` = `G-XXXXXXXXXX` (aguardando criar propriedade GA4)

**Como adicionar:**
1. Acessar Cloudflare Pages Dashboard
2. Projeto `investigaree-api` → Settings → Environment Variables
3. Adicionar variável para Production e Preview
4. Redeploy necessário após adicionar

---

## 📊 GOOGLE ANALYTICS 4

### Propriedade GA4

**Status:** ❌ **NÃO CRIADO** (aguardando Google Analytics voltar ao ar)

**Quando criar:**
- Nome da propriedade: `Investigaree`
- Fuso horário: `(GMT-03:00) Brasília`
- Moeda: `Real brasileiro (BRL)`
- Categoria: `Serviços jurídicos / Serviços profissionais`
- Tamanho: `Pequena (1-10 funcionários)`
- Objetivo: `Gerar leads`

**Stream de Dados (Web):**
- URL: `https://investigaree.com.br`
- Nome: `Website Investigaree`
- **Measurement ID:** `G-XXXXXXXXXX` (obter após criação)

**Acesso:**
- URL: https://analytics.google.com/
- Login: `kaloidani@gmail.com`

---

## 🔑 GITHUB

### Repositório

**Nome:** `investigaree`
**Owner:** `dkbot7` (assumindo baseado no push anterior)
**URL:** `https://github.com/dkbot7/investigaree`

**Branch principal:** `main`

**Último commit local:**
- Hash: `d2081b2`
- Mensagem: "fix: Corrigir sintaxe no arquivo de serviços"
- Data: 2025-12-20

---

## 🛠️ MCP SERVERS INSTALADOS

### Google Analytics MCP

**Configuração:**
- Nome do servidor: `google-analytics`
- Comando: `ga4-mcp-server`
- Versão: `2.0.0`
- Arquivo de config: `.mcp.json`

**Arquivo `.mcp.json`:**
```json
{
  "mcpServers": {
    "google-analytics": {
      "command": "ga4-mcp-server",
      "args": []
    }
  }
}
```

**Autenticação:**
- Usa Application Default Credentials (ADC) do Google Cloud
- Arquivo: `C:\Users\Vaio\AppData\Roaming\gcloud\application_default_credentials.json`

---

## 📁 ESTRUTURA DE ARQUIVOS IMPORTANTES

### Projeto Local

```
C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\
├── .mcp.json (MCP servers)
├── .claude/settings.local.json (configurações Claude Code)
├── .env.local (variáveis de ambiente)
├── MCP-GOOGLE-ANALYTICS-WINDOWS-INSTALADO.md (documentação MCP)
├── INSTALACAO-GOOGLE-ANALYTICS-MCP.md (guia instalação)
└── CREDENCIAIS-INVESTIGAREE.md (este arquivo)
```

### Sistema Windows

```
C:\Users\Vaio\
├── AppData\Local\Programs\Python\Python313\ (Python 3.13.7)
├── AppData\Roaming\Python\Python313\Scripts\ (pipx, ga4-mcp-server)
├── AppData\Local\Google\Cloud SDK\ (gcloud CLI)
├── AppData\Roaming\gcloud\ (configurações e credenciais GCP)
└── .local\pipx\venvs\google-analytics-mcp\ (ambiente virtual MCP)
```

---

## 🔒 SEGURANÇA - ARQUIVOS SENSÍVEIS

### ⚠️ NUNCA COMPARTILHAR PUBLICAMENTE:

**1. Credenciais Google Cloud:**
```
C:\Users\Vaio\AppData\Roaming\gcloud\application_default_credentials.json
C:\Users\Vaio\AppData\Roaming\gcloud\credentials.db
```

**2. Variáveis de ambiente:**
```
.env.local (nunca commitar no git)
```

**3. Settings do Claude Code:**
```
.claude/settings.local.json (pode conter tokens)
```

**4. Códigos de organização:**
- Código da organização Claude Code: `ewc9D4qMQmO2IuDUohIwPA`

### ✅ SEGUROS PARA COMPARTILHAR:

**1. Informações públicas:**
- URLs do site (investigaree.com.br)
- Nome do projeto Google Cloud (`investigaree-481820`)
- IDs de propriedade GA4 (quando criado) - Measurement ID é público

**2. Configurações de código:**
- `.mcp.json` (apenas configuração, sem credenciais)
- Documentações .md

---

## 🔄 COMANDOS ÚTEIS

### Verificar Configurações Atuais

**Claude Code:**
```bash
claude mcp list
```

**Google Cloud:**
```bash
gcloud config list
gcloud auth list
gcloud services list --enabled
```

**Python/pipx:**
```bash
python --version
python -m pipx list
```

### Renovar Autenticação

**Application Default Credentials:**
```bash
gcloud auth application-default login
```

**Conta principal:**
```bash
gcloud auth login
```

### Revogar Acesso (se necessário)

**ADC:**
```bash
gcloud auth application-default revoke
```

**Conta:**
```bash
gcloud auth revoke kaloidani@gmail.com
```

---

## 📋 CHECKLIST DE ACESSO

### Serviços Configurados

- [x] Claude Code (organização: `investigaree`)
- [x] Google Cloud Platform (projeto: `investigaree-481820`)
- [x] GitHub (repositório: `investigaree`)
- [x] Cloudflare Pages (site: `investigaree.com.br`)
- [ ] Google Analytics 4 (aguardando criação da propriedade)

### Credenciais Ativas

- [x] Google Cloud ADC (`kaloidani@gmail.com`)
- [x] gcloud CLI autenticado
- [ ] Google Analytics propriedade criada

### Próximas Ações

1. [ ] Aguardar Google Analytics voltar ao ar
2. [ ] Criar propriedade GA4
3. [ ] Obter Measurement ID
4. [ ] Adicionar `NEXT_PUBLIC_GA4_ID` ao projeto
5. [ ] Adicionar variável no Cloudflare Pages
6. [ ] Reiniciar Claude Code para ativar MCP
7. [ ] Testar MCP com dados reais do GA4

---

## 📞 SUPORTE E RECURSOS

### Documentação Oficial

**Claude Code:**
- Docs: https://docs.anthropic.com/claude-code
- MCP Guide: https://docs.anthropic.com/claude-code/mcp

**Google Cloud:**
- Console: https://console.cloud.google.com/
- Projeto direto: https://console.cloud.google.com/home/dashboard?project=investigaree-481820

**Google Analytics:**
- Console: https://analytics.google.com/
- Data API: https://developers.google.com/analytics/devguides/reporting/data/v1

**Cloudflare Pages:**
- Dashboard: https://dash.cloudflare.com/

### Repositórios

**Google Analytics MCP:**
- GitHub: https://github.com/googleanalytics/google-analytics-mcp
- Issues: https://github.com/googleanalytics/google-analytics-mcp/issues

**Projeto Investigaree:**
- GitHub: https://github.com/dkbot7/investigaree

---

**ÚLTIMA ATUALIZAÇÃO:** 2025-12-20
**MANTIDO POR:** Claude Code
**ARQUIVO CONFIDENCIAL** - Não compartilhar publicamente
