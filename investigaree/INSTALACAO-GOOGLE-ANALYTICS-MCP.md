# INSTALAÇÃO GOOGLE ANALYTICS MCP SERVER - EM ANDAMENTO

**Data:** 2025-12-20
**Status:** ⏸️ **PAUSADO** (Google Analytics temporariamente fora do ar)

---

## ✅ ETAPAS CONCLUÍDAS

### 1. Pré-requisitos Instalados
- ✅ **Python 3.13.7** (requisito: 3.10+)
- ✅ **pipx 1.8.0** instalado via `python -m pip install --user pipx`
- ✅ **Google Cloud CLI** instalado manualmente
- ✅ **Google Cloud CLI configurado** com projeto `investigaree-481820`

### 2. Configuração Google Cloud
- ✅ **Projeto:** `investigaree-481820`
- ✅ **Número do projeto:** `781185307720`
- ✅ **Email autenticado:** `kaloidani@gmail.com`

### 3. APIs Habilitadas
- ✅ **Google Analytics Admin API** (`analyticsadmin.googleapis.com`)
- ✅ **Google Analytics Data API** (`analyticsdata.googleapis.com`)

**Comandos executados:**
```bash
gcloud services enable analyticsadmin.googleapis.com
gcloud services enable analyticsdata.googleapis.com
gcloud auth application-default login
```

### 4. MCP Server Instalado
- ✅ **Pacote:** `google-analytics-mcp 2.0.0`
- ✅ **Executável:** `ga4-mcp-server.exe`
- ✅ **Instalação via:** `python -m pipx install google-analytics-mcp`

### 5. Configuração Claude Code
- ✅ **Arquivo criado:** `.mcp.json`
- ✅ **Configuração habilitada:** `.claude/settings.local.json`

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

**Alteração em `.claude/settings.local.json`:**
```json
{
  "permissions": { ... },
  "enableAllProjectMcpServers": true
}
```

---

## ⏸️ ETAPA PENDENTE: CRIAR PROPRIEDADE GA4

**AÇÃO NECESSÁRIA (Manual - quando Google Analytics voltar):**

### Passo a Passo:

1. **Acessar Google Analytics:**
   - URL: https://analytics.google.com/
   - Login: `kaloidani@gmail.com`

2. **Criar Nova Propriedade:**
   - Ir em **"Administrador"** (engrenagem no canto inferior esquerdo)
   - Clicar em **"+ Criar propriedade"**

3. **Configuração da Propriedade:**
   ```
   Nome: Investigaree
   Fuso horário: (GMT-03:00) Brasília
   Moeda: Real brasileiro (BRL)
   ```
   - Clicar em **"Avançar"**

4. **Detalhes da Empresa:**
   ```
   Categoria: Serviços jurídicos / Serviços profissionais
   Tamanho: Pequena (1-10 funcionários)
   ```
   - Clicar em **"Avançar"**

5. **Objetivos de Negócio:**
   - Marcar: `Gerar leads`
   - Clicar em **"Criar"**

6. **Criar Fluxo de Dados (Web):**
   ```
   Tipo: Web
   URL do site: https://investigaree.com.br
   Nome do stream: Website Investigaree
   ```
   - ✅ **COPIAR o Measurement ID** (formato: `G-XXXXXXXXXX`)
   - Clicar em **"Criar stream"**

---

## 📋 PRÓXIMOS PASSOS (DEPOIS DE CRIAR GA4)

### 1. Adicionar Measurement ID ao Projeto

**Editar `.env.local`:**
```bash
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```
(Substituir `G-XXXXXXXXXX` pelo ID real copiado do Google Analytics)

### 2. Configurar no Cloudflare Pages

**Cloudflare Pages → Settings → Environment Variables:**
```
Nome: NEXT_PUBLIC_GA4_ID
Valor: G-XXXXXXXXXX
Ambiente: Production (e Preview)
```

### 3. Fazer Deploy das Alterações

**Arquivos modificados que precisam de commit:**
- `.mcp.json` (novo)
- `.claude/settings.local.json` (modificado)
- `.env.local` (precisa adicionar `NEXT_PUBLIC_GA4_ID`)

**Comandos de deploy:**
```bash
git add .mcp.json .claude/settings.local.json
git commit -m "feat: Configurar Google Analytics MCP Server"
git push origin main
```

**Após push, Cloudflare Pages fará deploy automático.**

### 4. Reiniciar Claude Code

**IMPORTANTE:** Após criar a propriedade GA4 e fazer deploy, você precisa:
1. Fechar completamente o Claude Code (`exit` ou Ctrl+C)
2. Reabrir no diretório do projeto

Isso carregará o MCP Server configurado.

### 5. Testar Ferramentas MCP

**Quando Claude Code reiniciar, você poderá:**
- Buscar por ferramentas MCP: `MCPSearch` com query `google analytics`
- Usar ferramentas como:
  - `get_account_summaries` - Listar contas GA4
  - `get_property_details` - Detalhes da propriedade
  - `run_report` - Executar relatórios de tráfego
  - `run_realtime_report` - Ver usuários ativos em tempo real

---

## 🔐 SEGURANÇA - AVISOS IMPORTANTES

### ⚠️ API Key Exposta (RESOLVIDA)
**API Key que foi exposta publicamente:**
```
AIzaSyB10sXypXmUr48EINnc_t_BB04Wkomb_MY
```

**AÇÃO OBRIGATÓRIA (se ainda não fez):**
1. Acessar: https://console.cloud.google.com/apis/credentials?project=investigaree-481820
2. Encontrar a chave `AIzaSyB10sXypXmUr48EINnc_t_BB04Wkomb_MY`
3. Clicar nos 3 pontos → **"Delete"** (Excluir)

**Nunca compartilhe publicamente:**
- API Keys
- Measurement IDs (ok compartilhar em .env.local, mas não em screenshots)
- Tokens de autenticação
- Credenciais de qualquer tipo

---

## 📊 STATUS DO PROJETO GA4

### Arquivos Existentes (PRE-GO-LIVE-COMPLETO.md)

**Já implementado no código:**
- ✅ `src/components/analytics/GoogleAnalytics.tsx` - Componente GA4 consent-gated
- ✅ `src/app/layout.tsx` - GoogleAnalytics importado
- ✅ `src/app/api/lgpd/registrar-consentimento/route.ts` - API LGPD
- ✅ `src/components/lgpd/ConsentBanner.tsx` - Banner de consentimento
- ✅ `src/app/cookies/page.tsx` - Política de cookies atualizada

**Conformidade LGPD:** 100% (6/6 requisitos atendidos)

### O Que Falta

**BLOQUEADOR ÚNICO:** Criar propriedade GA4 e obter `NEXT_PUBLIC_GA4_ID`

Assim que obtiver o Measurement ID:
1. Adicionar ao `.env.local`
2. Adicionar no Cloudflare Pages (Environment Variables)
3. Deploy → GA4 estará ativo e funcional

---

## 🎯 FERRAMENTAS MCP DISPONÍVEIS (APÓS REINICIAR)

Quando o Google Analytics MCP estiver ativo, você terá acesso a:

### 1. Informações de Conta e Propriedade
- `get_account_summaries` - Lista todas contas e propriedades GA4
- `get_property_details` - Detalhes específicos de uma propriedade
- `list_google_ads_links` - Links para contas Google Ads

### 2. Relatórios Principais
- `run_report` - Executa relatórios via Data API
  - Exemplos: tráfego por página, origem de usuários, conversões
- `get_custom_dimensions_and_metrics` - Dimensões e métricas customizadas

### 3. Relatórios em Tempo Real
- `run_realtime_report` - Dados em tempo real
  - Exemplos: usuários ativos agora, páginas visitadas nos últimos 30 minutos

### Exemplo de Uso (após configuração completa)

```typescript
// Você poderá pedir ao Claude Code:
"Use o MCP do Google Analytics para mostrar os usuários ativos agora no site"

// Claude Code vai chamar:
MCPSearch("select:mcp__google-analytics__run_realtime_report")
// E executar o relatório em tempo real
```

---

## 📝 CHECKLIST COMPLETO

### Pré-requisitos ✅
- [x] Python 3.10+ instalado
- [x] pipx instalado
- [x] Google Cloud CLI instalado
- [x] gcloud init configurado
- [x] Projeto `investigaree-481820` selecionado
- [x] Autenticação com `kaloidani@gmail.com`

### APIs e Permissões ✅
- [x] Google Analytics Admin API habilitada
- [x] Google Analytics Data API habilitada
- [x] Application Default Credentials configuradas

### MCP Server ✅
- [x] google-analytics-mcp 2.0.0 instalado
- [x] `.mcp.json` criado
- [x] `.claude/settings.local.json` atualizado

### GA4 Property ⏸️ PAUSADO
- [ ] Propriedade GA4 criada no Google Analytics
- [ ] Measurement ID obtido (G-XXXXXXXXXX)
- [ ] Variável `NEXT_PUBLIC_GA4_ID` adicionada em `.env.local`
- [ ] Variável `NEXT_PUBLIC_GA4_ID` adicionada no Cloudflare Pages

### Finalização PENDENTE
- [ ] Commit e push das alterações (.mcp.json, settings)
- [ ] Deploy no Cloudflare Pages
- [ ] Claude Code reiniciado
- [ ] MCP Server testado
- [ ] Relatórios GA4 acessíveis via MCP

---

## 🔄 RETOMANDO O TRABALHO

**Quando o Google Analytics voltar ao ar:**

1. **Abra este documento:** `INSTALACAO-GOOGLE-ANALYTICS-MCP.md`
2. **Siga "ETAPA PENDENTE: CRIAR PROPRIEDADE GA4"**
3. **Copie o Measurement ID** (G-XXXXXXXXXX)
4. **Execute "PRÓXIMOS PASSOS":**
   - Adicionar ao `.env.local`
   - Adicionar no Cloudflare Pages
   - Commit e deploy
   - Reiniciar Claude Code
   - Testar MCP

---

## 📚 REFERÊNCIAS

- **Repositório MCP:** https://github.com/googleanalytics/google-analytics-mcp
- **Documentação GA4 Data API:** https://developers.google.com/analytics/devguides/reporting/data/v1
- **Google Cloud Console:** https://console.cloud.google.com/
- **Google Analytics:** https://analytics.google.com/

---

**ARQUIVO CRIADO EM:** 2025-12-20
**STATUS:** ⏸️ Aguardando Google Analytics voltar ao ar
**PRÓXIMA AÇÃO:** Criar propriedade GA4 e obter Measurement ID
