# GOOGLE ANALYTICS MCP - INSTALAÇÃO WINDOWS COMPLETA

**Data:** 2025-12-20
**Sistema:** Windows (C:\Users\Vaio)
**Status:** ✅ **INSTALADO E CONFIGURADO**

**Organização Claude Code:**
- Nome: `investigaree`
- Código da organização: `ewc9D4qMQmO2IuDUohIwPA`

---

## 📦 O QUE FOI INSTALADO NO SEU WINDOWS

### 1. Python e Dependências

**Python instalado:**
- Versão: `Python 3.13.7`
- Localização: `C:\Users\Vaio\AppData\Local\Programs\Python\Python313\`
- Comando: `python --version`

**pipx instalado:**
- Versão: `1.8.0`
- Instalado via: `python -m pip install --user pipx`
- Localização: `C:\Users\Vaio\AppData\Roaming\Python\Python313\Scripts\pipx.exe`
- Comando: `python -m pipx --version`

### 2. Google Cloud CLI

**Google Cloud SDK instalado:**
- Instalado manualmente via instalador `.exe`
- Localização padrão: `C:\Users\Vaio\AppData\Local\Google\Cloud SDK\`
- Comando: `gcloud --version`

**Configuração ativa:**
- Projeto: `investigaree-481820`
- Número do projeto: `781185307720`
- Conta autenticada: `kaloidani@gmail.com`
- Region/Zone: Padrão (configurado via `gcloud init`)

**Organização Claude Code:**
- Nome da organização: `investigaree`
- Código da organização: `ewc9D4qMQmO2IuDUohIwPA`
- Uso: Configurações enterprise, managed settings, billing

**APIs habilitadas:**
```bash
# Executados com sucesso:
gcloud services enable analyticsadmin.googleapis.com
gcloud services enable analyticsdata.googleapis.com
```

**Credenciais configuradas:**
```bash
# Application Default Credentials (ADC):
gcloud auth application-default login
# Status: ✅ Autenticado
```

### 3. Google Analytics MCP Server

**Pacote instalado:**
- Nome: `google-analytics-mcp`
- Versão: `2.0.0`
- Instalado via: `python -m pipx install google-analytics-mcp`
- Ambiente virtual: `C:\Users\Vaio\.local\pipx\venvs\google-analytics-mcp\`

**Executável:**
- Nome: `ga4-mcp-server.exe`
- Localização: `C:\Users\Vaio\AppData\Roaming\Python\Python313\Scripts\ga4-mcp-server.exe`
- Teste: `ga4-mcp-server --help` (pode não funcionar sem argumentos corretos)

---

## 📁 ARQUIVOS DE CONFIGURAÇÃO NO PROJETO

### 1. `.mcp.json` (Raiz do Projeto)

**Localização:** `C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\.mcp.json`

**Conteúdo:**
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

**O que faz:**
- Define o servidor MCP `google-analytics`
- Aponta para o executável `ga4-mcp-server`
- Claude Code lê este arquivo para carregar MCP servers do projeto

### 2. `.claude/settings.local.json`

**Localização:** `C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\.claude\settings.local.json`

**Configuração MCP adicionada:**
```json
{
  "permissions": { ... },
  "enableAllProjectMcpServers": true
}
```

**O que faz:**
- `enableAllProjectMcpServers: true` → Habilita automaticamente todos MCP servers definidos em `.mcp.json`
- Sem essa flag, você precisaria aprovar manualmente cada MCP

---

## 🔧 VARIÁVEIS DE AMBIENTE

### Variáveis do Sistema (já configuradas automaticamente)

**PATH atualizado com:**
```
C:\Users\Vaio\AppData\Roaming\Python\Python313\Scripts
C:\Users\Vaio\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin
```

**Verificar PATH (PowerShell):**
```powershell
$env:PATH -split ';' | Select-String "Python|Cloud"
```

### Credenciais Google Cloud

**Arquivo de credenciais ADC:**
- Localização: `C:\Users\Vaio\AppData\Roaming\gcloud\application_default_credentials.json`
- Criado por: `gcloud auth application-default login`
- Contém: Token OAuth 2.0 para acessar APIs Google

**Verificar credenciais:**
```bash
gcloud auth application-default print-access-token
```

---

## 🚀 COMO USAR O MCP (APÓS REINICIAR CLAUDE CODE)

### 1. Verificar MCP Instalado

**Via CLI:**
```bash
claude mcp list
```

**Dentro do Claude Code:**
```
/mcp
```
Isso mostra:
- Status de conexão do `google-analytics`
- Opções de autenticação (se necessário)
- Ferramentas disponíveis

### 2. Usar Ferramentas do Google Analytics

**Perguntas naturais (Claude detecta automaticamente):**
```
> Mostre os dados de tráfego dos últimos 7 dias
> Quantos usuários ativos temos agora?
> Quais as páginas mais visitadas do site?
```

**Referências com @ (quando disponível):**
```
> Analise @google-analytics:property://GA_PROPERTY_ID
```

**Slash commands:**
```
/mcp__google-analytics__run_report
/mcp__google-analytics__get_account_summaries
```

### 3. Ferramentas Disponíveis no MCP

O Google Analytics MCP oferece 6 ferramentas:

#### **Informações de Conta e Propriedade:**
1. `get_account_summaries` - Lista todas contas e propriedades GA4
2. `get_property_details` - Detalhes específicos de uma propriedade
3. `list_google_ads_links` - Links para contas Google Ads

#### **Relatórios Principais:**
4. `run_report` - Executa relatórios via Data API
   - Tráfego por página, origem de usuários, conversões
   - Filtragem por data, dimensões, métricas

#### **Relatórios em Tempo Real:**
5. `run_realtime_report` - Dados em tempo real
   - Usuários ativos agora
   - Páginas visitadas nos últimos 30 minutos

#### **Dimensões e Métricas Customizadas:**
6. `get_custom_dimensions_and_metrics` - Lista dimensões/métricas customizadas

---

## 🔐 SEGURANÇA E CREDENCIAIS

### Arquivos Sensíveis (NUNCA compartilhar)

**1. Application Default Credentials:**
```
C:\Users\Vaio\AppData\Roaming\gcloud\application_default_credentials.json
```
- Contém token de acesso OAuth 2.0
- Dá acesso às APIs Google Analytics com sua conta

**2. Configuração gcloud:**
```
C:\Users\Vaio\AppData\Roaming\gcloud\configurations\
```
- Configurações de projetos e contas

### Revogar Acesso (se necessário)

**Revogar Application Default Credentials:**
```bash
gcloud auth application-default revoke
```

**Revogar autenticação geral:**
```bash
gcloud auth revoke kaloidani@gmail.com
```

**Reautenticar:**
```bash
gcloud auth application-default login
```

---

## ⚠️ PENDÊNCIAS E PRÓXIMOS PASSOS

### ❌ Ainda Não Feito (aguardando Google Analytics voltar)

**1. Criar Propriedade GA4:**
- Acessar https://analytics.google.com/
- Criar propriedade `Investigaree`
- Obter Measurement ID (formato: `G-XXXXXXXXXX`)

**2. Configurar Measurement ID no Projeto:**
```bash
# Adicionar ao .env.local:
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

**3. Configurar no Cloudflare Pages:**
- Settings → Environment Variables
- Adicionar `NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX`

**4. Deploy Final:**
```bash
npm run build:worker
npm run deploy
```

**5. Testar MCP com Dados Reais:**
- Após GA4 começar a coletar dados
- Usar MCP para consultar relatórios

### ✅ Já Configurado e Pronto

- [x] Python 3.13.7 instalado
- [x] pipx instalado
- [x] Google Cloud CLI instalado e configurado
- [x] Projeto `investigaree-481820` selecionado
- [x] APIs do Google Analytics habilitadas
- [x] Application Default Credentials configuradas
- [x] google-analytics-mcp 2.0.0 instalado
- [x] `.mcp.json` criado no projeto
- [x] `enableAllProjectMcpServers: true` habilitado
- [x] Documentação completa criada

---

## 🔄 MANUTENÇÃO E ATUALIZAÇÕES

### Atualizar Google Analytics MCP

**Verificar versão atual:**
```bash
python -m pipx list
```

**Atualizar para última versão:**
```bash
python -m pipx upgrade google-analytics-mcp
```

**Reinstalar (se houver problemas):**
```bash
python -m pipx uninstall google-analytics-mcp
python -m pipx install google-analytics-mcp
```

### Atualizar Google Cloud CLI

**Verificar atualizações:**
```bash
gcloud components update
```

### Verificar Status das APIs

**Listar APIs habilitadas:**
```bash
gcloud services list --enabled --project=investigaree-481820
```

**Desabilitar API (se necessário):**
```bash
gcloud services disable analyticsadmin.googleapis.com
```

---

## 🐛 TROUBLESHOOTING

### Problema: MCP não aparece após reiniciar

**Solução 1 - Verificar arquivo .mcp.json:**
```bash
cat .mcp.json
# Deve mostrar configuração do google-analytics
```

**Solução 2 - Verificar settings.local.json:**
```bash
cat .claude/settings.local.json
# Deve ter "enableAllProjectMcpServers": true
```

**Solução 3 - Verificar se executável existe:**
```bash
where ga4-mcp-server
# Deve mostrar: C:\Users\Vaio\AppData\Roaming\Python\Python313\Scripts\ga4-mcp-server.exe
```

**Solução 4 - Reinstalar MCP:**
```bash
python -m pipx reinstall google-analytics-mcp
```

### Problema: Erro de autenticação ao usar MCP

**Solução - Reautenticar ADC:**
```bash
gcloud auth application-default login
```

### Problema: ga4-mcp-server não encontrado

**Solução - Adicionar ao PATH manualmente:**
```powershell
# PowerShell (Administrador)
$oldPath = [Environment]::GetEnvironmentVariable("Path", "User")
$newPath = "$oldPath;C:\Users\Vaio\AppData\Roaming\Python\Python313\Scripts"
[Environment]::SetEnvironmentVariable("Path", $newPath, "User")
```

**Ou usar caminho completo no .mcp.json:**
```json
{
  "mcpServers": {
    "google-analytics": {
      "command": "C:\\Users\\Vaio\\AppData\\Roaming\\Python\\Python313\\Scripts\\ga4-mcp-server.exe",
      "args": []
    }
  }
}
```

---

## 📚 REFERÊNCIAS E DOCUMENTAÇÃO

### Documentação Oficial

**Google Analytics MCP:**
- Repositório: https://github.com/googleanalytics/google-analytics-mcp
- Issues: https://github.com/googleanalytics/google-analytics-mcp/issues

**Google Analytics Data API:**
- Documentação: https://developers.google.com/analytics/devguides/reporting/data/v1
- Referência: https://developers.google.com/analytics/devguides/reporting/data/v1/rest

**Claude Code MCP:**
- Guia de MCP Servers: https://docs.anthropic.com/claude-code/mcp
- Instalação: https://docs.anthropic.com/claude-code/mcp/installation

**Google Cloud CLI:**
- Instalação: https://cloud.google.com/sdk/docs/install
- Comandos: https://cloud.google.com/sdk/gcloud/reference

### Arquivos de Configuração Importantes

```
Projeto Investigaree:
├── .mcp.json (MCP servers do projeto)
├── .claude/settings.local.json (configurações Claude Code)
├── .env.local (variáveis de ambiente - ADICIONAR GA4_ID)
└── INSTALACAO-GOOGLE-ANALYTICS-MCP.md (guia de instalação)

Sistema Windows:
├── C:\Users\Vaio\AppData\Local\Programs\Python\Python313\ (Python)
├── C:\Users\Vaio\AppData\Roaming\Python\Python313\Scripts\ (pipx, ga4-mcp-server)
├── C:\Users\Vaio\AppData\Local\Google\Cloud SDK\ (gcloud CLI)
├── C:\Users\Vaio\AppData\Roaming\gcloud\ (configurações e credenciais)
└── C:\Users\Vaio\.local\pipx\venvs\google-analytics-mcp\ (ambiente virtual MCP)
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### Antes de Usar o MCP

- [x] Python 3.13.7 instalado (`python --version`)
- [x] pipx instalado (`python -m pipx --version`)
- [x] gcloud CLI instalado (`gcloud --version`)
- [x] Projeto configurado (`gcloud config get-value project`)
- [x] APIs habilitadas (analyticsadmin + analyticsdata)
- [x] ADC autenticado (`gcloud auth application-default print-access-token`)
- [x] google-analytics-mcp instalado (`python -m pipx list`)
- [x] `.mcp.json` criado na raiz do projeto
- [x] `enableAllProjectMcpServers: true` em settings.local.json
- [ ] **Claude Code reiniciado** (PRÓXIMO PASSO OBRIGATÓRIO)
- [ ] Propriedade GA4 criada (aguardando Google Analytics voltar)
- [ ] `NEXT_PUBLIC_GA4_ID` configurado (após criar propriedade)

### Após Reiniciar Claude Code

- [ ] Executar `claude mcp list` (deve listar google-analytics)
- [ ] Executar `/mcp` dentro do Claude Code (verificar status)
- [ ] Testar consulta: "Mostre dados do Google Analytics"
- [ ] Verificar se MCP responde com dados ou erro de configuração

---

**TUDO SALVO E DOCUMENTADO NO SEU WINDOWS!** ✅

**Próxima ação:** Reiniciar Claude Code para ativar o MCP instalado.
