# 🔥 FIREBASE EMULATOR - GUIA DE USO

## ⚠️ IMPORTANTE
O Firebase Emulator permite testar autenticação localmente sem consumir recursos do Firebase em produção.

---

## 📋 PRÉ-REQUISITOS

1. Firebase CLI instalado (✅ já instalado - versão 14.27.0)
2. Arquivo `firebase.json` configurado (✅ já configurado)
3. Variável de ambiente `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`

---

## 🚀 COMO USAR

### 1️⃣ Iniciar o Emulator

**Opção 1: Script Windows**
```bash
cd investigaree
firebase-emulator.bat
```

**Opção 2: Comando direto**
```bash
cd investigaree
npx firebase emulators:start --only auth
```

### 2️⃣ Verificar Emulator está rodando

Você deverá ver:
```
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! It is now safe to connect your app. │
│ i  View Emulator UI at http://127.0.0.1:4000                │
└─────────────────────────────────────────────────────────────┘

┌────────────┬────────────────┬─────────────────────────────────┐
│ Emulator   │ Host:Port      │ View in Emulator UI             │
├────────────┼────────────────┼─────────────────────────────────┤
│ Auth       │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth      │
└────────────┴────────────────┴─────────────────────────────────┘
```

### 3️⃣ Configurar variável de ambiente

**Adicionar ao `.env.local`:**
```env
# Firebase Emulator (desenvolvimento)
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

### 4️⃣ Iniciar aplicação

Em outro terminal:
```bash
cd investigaree
npm run dev
```

### 5️⃣ Verificar conexão

Abra o console do navegador em http://localhost:3000 e procure por:
```
🔥 Firebase Auth Emulator connected at http://127.0.0.1:9099
```

---

## 🎯 ENDPOINTS DISPONÍVEIS

- **Auth Emulator:** http://127.0.0.1:9099
- **Emulator UI:** http://127.0.0.1:4000
- **Auth UI:** http://127.0.0.1:4000/auth

---

## 🧪 TESTANDO AUTENTICAÇÃO

### Criar usuário de teste via Emulator UI:

1. Acesse http://127.0.0.1:4000/auth
2. Clique em "Add user"
3. Preencha:
   - Email: `test@investigaree.com`
   - Password: `Test123456`
4. Clique em "Save"

### Fazer login na aplicação:

1. Acesse http://localhost:3000/loginadmin
2. Use as credenciais criadas
3. Verifique se o login funciona

---

## 🔴 DESATIVAR EMULATOR (PRODUÇÃO)

Para usar Firebase em produção:

**1. Remover do `.env.local`:**
```env
# NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true  # <- comentar ou remover
```

**2. Parar o emulator:**
```
Ctrl+C no terminal do emulator
```

---

## 📊 CONFIGURAÇÃO ATUAL

### `firebase.json`
```json
{
  "emulators": {
    "auth": {
      "port": 9099,
      "host": "127.0.0.1"
    },
    "ui": {
      "enabled": true,
      "port": 4000,
      "host": "127.0.0.1"
    }
  }
}
```

### `firebase.ts` (conexão automática)
```typescript
// Connect to Firebase Emulator in development mode
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    console.log('🔥 Firebase Auth Emulator connected at http://127.0.0.1:9099');
  } catch (error) {
    console.error('Error connecting to Firebase Auth Emulator:', error);
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Port 9099 already in use"

**Causa:** Emulator já está rodando ou outra aplicação usa a porta

**Solução:**
```bash
# Parar processo na porta 9099
npx kill-port 9099

# Ou mudar porta em firebase.json
```

### Erro: "Failed to connect to emulator"

**Causa:** Emulator não está rodando

**Solução:**
1. Verificar se `firebase-emulator.bat` está executando
2. Verificar se a porta 9099 está acessível
3. Verificar firewall/antivírus

### Aviso: "Cannot reach emulator UI"

**Causa:** Normal se a UI não for acessada

**Solução:** Ignorar ou acessar http://127.0.0.1:4000

---

## 🔒 DADOS DO EMULATOR

**IMPORTANTE:**
- Dados do emulator são **temporários**
- Ao parar o emulator, todos os usuários/dados são perdidos
- Use apenas para testes locais
- **NUNCA** use em produção

---

## ✅ CHECKLIST

- [x] Firebase CLI instalado
- [x] `firebase.json` configurado
- [x] `firebase.ts` com `connectAuthEmulator`
- [x] Script `firebase-emulator.bat` criado
- [ ] Variável `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` adicionada
- [ ] Emulator testado e funcionando
- [ ] Login via emulator testado

---

Última atualização: 2025-12-07
