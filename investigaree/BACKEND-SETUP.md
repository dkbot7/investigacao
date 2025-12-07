# 🔧 Configuração do Backend - API Investigaree

## 📋 Problema Atual

O erro **"Sessão expirada"** ao submeter o formulário de investigação ocorre porque:
- O frontend está tentando se conectar à API em `https://api.investigaree.com.br`
- Essa API ainda **não está configurada ou não existe**
- Quando a API não responde, o Firebase Auth interpreta como erro 401 (não autorizado)

---

## ✅ Soluções Disponíveis

### Opção 1: Modo de Desenvolvimento (Recomendado para Testes)

**Use isto para testar o frontend sem precisar do backend:**

1. Abra o arquivo `.env.local` (crie se não existir)
2. Adicione esta linha:
   ```bash
   NEXT_PUBLIC_DEV_MODE=true
   ```
3. Reinicie o servidor de desenvolvimento (Ctrl+C e `npm run dev`)
4. Agora o formulário vai simular sucesso e mostrar os dados no console (F12)

**Vantagens:**
- ✅ Testa o formulário completo
- ✅ Valida todos os campos
- ✅ Mostra os dados que seriam enviados
- ✅ Não precisa do backend

---

### Opção 2: Backend Local (Cloudflare Workers)

**Use isto se você quiser rodar a API localmente:**

1. Configure o backend Cloudflare Workers localmente
2. No arquivo `.env.local`, adicione:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8787
   NEXT_PUBLIC_DEV_MODE=false
   ```
3. Rode o backend local: `npx wrangler dev`
4. Rode o frontend: `npm run dev`

---

### Opção 3: Backend em Produção

**Use isto quando a API estiver no ar:**

1. Deploy do backend Cloudflare Workers para produção
2. No arquivo `.env.local`, configure:
   ```bash
   NEXT_PUBLIC_API_URL=https://api.investigaree.com.br
   NEXT_PUBLIC_DEV_MODE=false
   ```
3. O formulário vai usar a API real

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

## 🧪 Como Testar Agora

### Passo 1: Habilitar Modo DEV
```bash
# Edite .env.local
NEXT_PUBLIC_DEV_MODE=true
```

### Passo 2: Reiniciar servidor
```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

### Passo 3: Testar formulário
1. Acesse http://localhost:3000/dashboard/funcionarios
2. Clique em "Adicionar"
3. Escolha "Pessoa Física" > "Cadastro Rápido"
4. Preencha Nome, CPF e selecione uma categoria
5. Clique em "Revisar"
6. Clique em "Solicitar Investigação"
7. ✅ Deve mostrar um alerta de sucesso e os dados no console (F12)

---

## 🆘 Problemas Comuns

### "Sessão expirada" ainda aparece
- Verifique se `NEXT_PUBLIC_DEV_MODE=true` está no `.env.local`
- Reinicie o servidor de desenvolvimento
- Limpe o cache do navegador (Ctrl+Shift+Delete)

### Login não persiste
- Verifique se as variáveis do Firebase estão configuradas
- Abra o Console do navegador (F12) e veja se há erros
- Verifique se o projeto Firebase está ativo

### Menu do topo não aparece
- Só aparece em desktop (telas >= 1024px)
- Em mobile usa o header existente (hamburger menu)
- Faça zoom out ou use modo responsivo do navegador (F12 > Toggle device toolbar)

---

## 📞 Suporte

Se os problemas persistirem:
1. Abra o Console do navegador (F12 > Console)
2. Tire um screenshot dos erros
3. Verifique o arquivo `.env.local`
4. Entre em contato com o desenvolvedor
