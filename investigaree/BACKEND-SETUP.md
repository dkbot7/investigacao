# 🔧 Configuração do Backend - API Investigaree

## 📋 Status Atual

✅ **Backend ATIVO e Operacional**

- **API de Produção:** `https://api.investigaree.com.br`
- **Status:** Deployed e funcionando
- **Versão:** Latest (Cloudflare Workers)
- **Banco de Dados:** D1 (SQLite)

---

## ⚙️ Configuração de Ambiente

### ✅ Configuração PADRÃO (Desenvolvimento + Produção)

**Esta é a configuração que DEVE estar no `.env.local`:**

```env
# Backend API - SEMPRE usar produção
NEXT_PUBLIC_API_URL=https://api.investigaree.com.br

# Modo DEV - SEMPRE false (usa API real)
NEXT_PUBLIC_DEV_MODE=false

# Firebase - SEMPRE produção
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
```

**Por quê usar produção em desenvolvimento?**
- ✅ Testa com dados reais
- ✅ Valida autenticação real
- ✅ Detecta problemas antes do deploy
- ✅ Consistência entre dev e prod
- ✅ Backend já está no ar e estável

---

## 🚨 Modo DEV (NÃO USAR EM DESENVOLVIMENTO NORMAL)

### ⚠️ Quando usar `NEXT_PUBLIC_DEV_MODE=true`?

**APENAS em casos extremos:**
- 🔧 Backend completamente fora do ar
- 🐛 Debug de UI sem precisar de dados reais
- 🧪 Testar validações de formulário isoladamente

### Como ativar (NÃO recomendado):

```env
NEXT_PUBLIC_DEV_MODE=true
```

**Consequências:**
- ❌ Formulários simulam sucesso (não salvam nada)
- ❌ Dados mock exibidos no console
- ❌ Não valida integração real
- ⚠️ **NÃO usar para desenvolvimento normal!**

---

## 🏠 Backend Local (Opcional)

### Quando rodar backend localmente?

- 🔧 Desenvolvendo novas features de backend
- 🐛 Debug de endpoints específicos
- 🧪 Testes de integração

### Como configurar:

1. **Terminal 1 - Backend Local:**
   ```bash
   cd backend/workers/api
   npx wrangler dev
   ```

2. **Editar `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8787
   NEXT_PUBLIC_DEV_MODE=false
   ```

3. **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

4. **⚠️ IMPORTANTE:** Voltar para produção depois:
   ```env
   NEXT_PUBLIC_API_URL=https://api.investigaree.com.br
   ```

---

## 🔐 Persistência de Login

A persistência de login **já foi corrigida**:
- Adicionado `browserLocalPersistence` no Firebase Auth
- Login agora persiste mesmo fechando o navegador
- Token é renovado automaticamente antes de expirar

**Arquivo modificado:** `src/lib/firebase.ts`

---

## 📱 Menu de Topo

O menu de topo **já foi adicionado**:
- Aparece apenas em desktop (telas grandes)
- Links para: Investigações, Analítico, Relatórios, Exportar, Admin
- Dropdown de notificações (sino)
- Dropdown do usuário (avatar)

**Arquivos criados/modificados:**
- `src/components/dashboard/TopNavBar.tsx` (criado)
- `src/app/dashboard/layout.tsx` (modificado)

---

## 🧪 Como Testar com API Real

### Passo 1: Verificar configuração
```bash
# Verificar .env.local
NEXT_PUBLIC_API_URL=https://api.investigaree.com.br
NEXT_PUBLIC_DEV_MODE=false
```

### Passo 2: Iniciar servidor
```bash
npm run dev
```

### Passo 3: Testar funcionalidades
1. **Login:** Acesse http://localhost:3000/loginadmin
   - Use credenciais Firebase válidas
   - Verifique persistência após fechar navegador

2. **Dashboard:** http://localhost:3000/dashboard
   - Dados carregam da API real
   - Validar autenticação funcionando

3. **Criar Investigação:**
   - Acesse http://localhost:3000/dashboard/funcionarios
   - Clique em "Adicionar"
   - Escolha "Pessoa Física" > "Cadastro Rápido"
   - Preencha Nome, CPF e categoria
   - Clique em "Revisar" e depois "Solicitar Investigação"
   - ✅ Dados são salvos na API real
   - ✅ Aparece na lista após reload

4. **Admin Panel:** http://localhost:3000/dashboard/admin
   - Gerenciar usuários e tenants
   - Ver logs de auditoria
   - Exportar relatórios

---

## 🆘 Problemas Comuns

### Erro: "Sessão expirada" ou 401 Unauthorized
**Causas:**
- Token Firebase expirado
- Usuário não autenticado

**Solução:**
1. Fazer logout e login novamente
2. Verificar console (F12) para erros de auth
3. Limpar cache e cookies (Ctrl+Shift+Delete)
4. Verificar se `.env.local` tem credenciais Firebase corretas

### Erro: "Failed to fetch" ou API não responde
**Causas:**
- Backend fora do ar (raro)
- Problema de rede/firewall

**Solução:**
1. Verificar se `https://api.investigaree.com.br` está acessível
2. Testar em navegador anônimo
3. Verificar console de erros (F12 > Network)
4. Contactar suporte se persistir

### Login não persiste
**Solução:**
- Persistência já está implementada com `browserLocalPersistence`
- Verificar se cookies estão habilitados no navegador
- Verificar se não está em modo anônimo
- Limpar storage: F12 > Application > Clear site data

### Dados não aparecem no dashboard
**Causas:**
- Usuário sem acesso ao tenant
- Filtros ativos

**Solução:**
1. Verificar no Admin Panel se usuário tem acesso concedido
2. Limpar filtros de busca
3. Fazer hard refresh (Ctrl+F5)

### Menu do topo não aparece
**Comportamento esperado:**
- Desktop (>= 1024px): menu horizontal no topo
- Mobile/Tablet (< 1024px): sidebar com hamburger menu
- Fazer zoom out ou usar F12 > Toggle device toolbar

---

## 📊 Verificar Status do Sistema

### API Health Check
```bash
# Testar se API está online
curl https://api.investigaree.com.br/health
```

### Frontend Build
```bash
# Verificar erros de TypeScript
npm run build

# Se build passar, ambiente está OK
```

---

## 📞 Suporte

**Problemas técnicos:**
1. Verificar console do navegador (F12 > Console)
2. Verificar tab Network (F12 > Network) para erros de API
3. Tirar screenshot do erro completo
4. Verificar arquivo `.env.local`
5. Contactar: contato@investigaree.com.br

**Contatos:**
- **Email:** contato@investigaree.com.br
- **Admin:** dkbotdani@gmail.com
- **Tech Lead:** ibsenmaciel@gmail.com

---

## 📝 Changelog

**Última atualização:** 11/12/2025

**Mudanças:**
- ✅ Backend em produção ativo e estável
- ✅ Modo DEV desabilitado por padrão
- ✅ Documentação atualizada para refletir uso de API real
- ✅ Instruções de troubleshooting modernizadas
