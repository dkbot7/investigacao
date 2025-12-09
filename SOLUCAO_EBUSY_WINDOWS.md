# Solução para Erro EBUSY no Windows com OpenNext

## Problema Identificado

Erro: `EBUSY: resource busy or locked, rmdir 'C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\.open-next\assets'`

Este erro ocorre ao tentar fazer build do OpenNext no Windows devido a arquivos bloqueados.

## Causa Raiz

- **OpenNext não tem suporte completo para Windows**: A ferramenta OpenNext foi projetada principalmente para ambientes Linux/macOS
- **Arquivos bloqueados**: O Windows mantém locks em arquivos/diretórios que o OpenNext tenta remover durante o build
- **Processo dev em background**: O servidor de desenvolvimento (npm run dev) pode manter arquivos bloqueados

## Soluções Recomendadas (em ordem de prioridade)

### 1. **Usar WSL2 (Windows Subsystem for Linux) - RECOMENDADO ✅**

Esta é a solução oficial e mais confiável para desenvolver com OpenNext no Windows.

**Como configurar:**
```bash
# 1. Instalar WSL2 no Windows
wsl --install

# 2. Navegar para o projeto no WSL
cd /mnt/c/Users/Vaio/Documents/TRABALHO/INVESTIGA/investigaree

# 3. Executar o build normalmente
npm run build:worker
npx @opennextjs/cloudflare deploy
```

**Vantagens:**
- Ambiente Linux nativo dentro do Windows
- 100% de compatibilidade com OpenNext
- Performance próxima do Linux nativo

### 2. **Usar GitHub Actions para Deploy (CI/CD)**

Configurar um workflow do GitHub Actions que roda em ambiente Linux:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build:worker
      - run: npx @opennextjs/cloudflare deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### 3. **Workarounds no Windows (temporários)**

Se não puder usar WSL2 imediatamente:

#### A. Fechar todos os processos que bloqueiam arquivos

```bash
# 1. Matar o servidor dev se estiver rodando
taskkill /F /IM node.exe

# 2. Fechar todos os terminais do VS Code

# 3. Usar Resource Monitor para identificar processos
# - Abrir Resource Monitor
# - Aba CPU > Associated Handles
# - Buscar por ".open-next" e matar processos
```

#### B. Remover diretório manualmente

```powershell
# No PowerShell com privilégios de administrador
Remove-Item -Path "investigaree\.open-next" -Recurse -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
npm run build:worker
```

#### C. Limpar cache e reinstalar

```bash
npm cache clear --force
rm -rf node_modules
rm package-lock.json
npm install
npm run build:worker
```

### 4. **Desabilitar Antivírus Temporariamente**

Programas antivírus podem bloquear arquivos durante operações de build:
- Adicionar exceção para a pasta do projeto
- Desabilitar temporariamente durante o build

### 5. **Atualizar Wrangler**

Se estiver usando Wrangler 3.13.0, atualizar para 3.13.1+:

```bash
npm install -D wrangler@latest
```

## Solução Implementada no Projeto

✅ **Deploy do Workers API**: Já funcionando via `wrangler deploy` no backend/workers/api

⚠️ **Deploy do Pages**: Requer WSL2 ou CI/CD para build do OpenNext

## Próximos Passos Recomendados

1. **Imediato**: Configurar WSL2 para desenvolvimento local
2. **Médio prazo**: Implementar GitHub Actions para deploy automatizado
3. **Alternativa**: Desenvolver em Windows, fazer deploy de outra máquina Linux

## Referências

- [OpenNext Cloudflare Troubleshooting](https://opennext.js.org/cloudflare/troubleshooting)
- [GitHub Issue #494 - Windows Build Failures](https://github.com/opennextjs/opennextjs-cloudflare/issues/494)
- [Cloudflare Workers SDK Issue #4167](https://github.com/cloudflare/workers-sdk/issues/4167)
- [EBUSY Error Solutions](https://bobbyhadz.com/blog/error-ebusy-resource-busy-or-locked)
- [Troubleshooting Cloudflare Next.js Deployment](https://magazine.ediary.site/blog/troubleshooting-cloudflare-next-js-deployment)

## Status Atual

- ✅ Workers API deployado com sucesso
- ✅ Frontend build local funciona (npm run build)
- ⚠️ OpenNext build bloqueado no Windows (requer WSL2)
- ✅ Commits realizados com sucesso
