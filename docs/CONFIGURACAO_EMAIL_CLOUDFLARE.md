# Configuração de Email - Cloudflare Email Routing

**Data:** 02/12/2025
**Método:** Cloudflare Email Routing (GRATUITO e SIMPLES)

---

## ✨ **O QUE É CLOUDFLARE EMAIL ROUTING?**

É um serviço **100% GRATUITO** do Cloudflare que permite:
- ✅ Criar emails personalizados: `contato@investigaree.com.br`, `privacidade@investigaree.com.br`
- ✅ Redirecionar para seu Gmail, Outlook ou qualquer email existente
- ✅ Configuração automática de DNS (sem complicação)
- ✅ 100% privado (Cloudflare não armazena o conteúdo dos emails)
- ✅ Sem limite de endereços

**Vantagem:** Você NÃO precisa criar contas no Proton Mail ou pagar por serviço de email!

---

## 🚀 **PASSO A PASSO COMPLETO**

### **PASSO 1: Acessar o Cloudflare Dashboard**

1. Acesse: https://dash.cloudflare.com/
2. Faça login na sua conta
3. Clique no domínio: `investigaree.com.br`

### **PASSO 2: Habilitar Email Routing**

1. No menu lateral esquerdo, clique em **Email**
2. Clique em **Email Routing**
3. Você verá uma tela explicando o serviço
4. Clique no botão **"Get started"** ou **"Enable Email Routing"**

### **PASSO 3: Adicionar Registros DNS (AUTOMÁTICO)**

O Cloudflare mostrará os registros DNS que serão adicionados automaticamente:

```
Registros que o Cloudflare vai adicionar:
- MX records (para roteamento de email)
- TXT records (para SPF/DKIM)
```

⚠️ **IMPORTANTE:** Se você já tem registros MX configurados (de outro serviço de email), o Cloudflare vai perguntar se quer removê-los.

**Ação:** Clique em **"Add records and enable"**

✅ Pronto! O Cloudflare configurou tudo automaticamente.

### **PASSO 4: Criar Endereço Personalizado - `contato@investigaree.com.br`**

1. Ainda na tela de Email Routing, clique na aba **"Routes"**
2. Clique em **"Create address"** ou **"Create email route"**

**Preencha:**
- **Custom address:** Digite `contato` (o Cloudflare adiciona @investigaree.com.br automaticamente)
- **Action:** Selecione **"Send to an email"**
- **Destination address:** Digite seu email pessoal (ex: `kaloidani@gmail.com` ou `ibsenmaciel@gmail.com`)

3. Clique em **"Save"**

### **PASSO 5: Verificar o Email de Destino**

1. O Cloudflare enviará um email para o endereço de destino que você configurou (ex: kaloidani@gmail.com)
2. Abra o email e clique no link de verificação: **"Verify email address"**
3. Você será redirecionado para o Cloudflare
4. O status mudará para **"Verified"** ✅

### **PASSO 6: Criar Endereço Personalizado - `privacidade@investigaree.com.br`**

Repita o PASSO 4:

1. Clique em **"Create address"** novamente
2. **Custom address:** Digite `privacidade`
3. **Destination address:** Digite o mesmo email ou outro (ex: `kaloidani@gmail.com`)
4. Clique em **"Save"**

Se for o mesmo email de destino, ele já estará verificado. Se for outro, repita o PASSO 5.

---

## ✅ **PRONTO! SEUS EMAILS ESTÃO FUNCIONANDO**

Agora você tem:
- ✉️ `contato@investigaree.com.br` → redireciona para seu Gmail
- ✉️ `privacidade@investigaree.com.br` → redireciona para seu Gmail

**Como funciona:**
- Alguém envia email para `contato@investigaree.com.br`
- O Cloudflare recebe o email
- O Cloudflare encaminha para `kaloidani@gmail.com`
- Você recebe no seu Gmail normalmente

---

## 📧 **COMO RESPONDER EMAILS?**

### **Opção 1: Responder do Gmail (simples)**
Você pode responder direto do Gmail, mas o remetente verá que veio do seu Gmail pessoal.

### **Opção 2: Configurar "Send As" no Gmail (RECOMENDADO)**

Para responder **COMO** `contato@investigaree.com.br`:

1. Abra o Gmail → **Configurações** (engrenagem) → **Ver todas as configurações**
2. Vá na aba **"Contas e Importação"**
3. Em **"Enviar e-mail como"**, clique em **"Adicionar outro endereço de e-mail"**
4. Preencha:
   - **Nome:** investigaree
   - **Endereço de e-mail:** contato@investigaree.com.br
   - **Tratar como alias:** Marque esta opção
5. Clique em **"Próxima etapa"**
6. **Servidor SMTP:** Use o SMTP do Gmail mesmo (smtp.gmail.com)
   - Porta: 587
   - Nome de usuário: seu-email@gmail.com
   - Senha: sua senha do Gmail (ou senha de app se tiver 2FA)
7. O Gmail enviará um código de verificação para `contato@investigaree.com.br`
8. Você receberá esse email no seu Gmail (porque o Cloudflare redireciona!)
9. Copie o código e cole para verificar

✅ Agora você pode **enviar emails** como `contato@investigaree.com.br` direto do Gmail!

---

## ⚙️ **CONFIGURAÇÕES ADICIONAIS (OPCIONAL)**

### **1. Catch-All (Capturar Tudo)**

Se alguém enviar para `suporte@investigaree.com.br` ou qualquer outro email que você não criou, você quer receber?

1. Na tela de Email Routing, clique em **"Settings"**
2. Ative **"Catch-all address"**
3. Configure para onde enviar emails não especificados

### **2. Plus Addressing (Subaddressing)**

Permite usar emails como `contato+vendas@investigaree.com.br`, `contato+suporte@investigaree.com.br`

1. Em **Settings**, ative **"Plus addressing"**
2. Útil para rastrear de onde vieram os emails

---

## 🔍 **TESTAR SE ESTÁ FUNCIONANDO**

### **Teste 1: Enviar email**
1. De outro email (Gmail pessoal, Outlook, etc.)
2. Envie para `contato@investigaree.com.br`
3. Verifique se recebeu no seu Gmail

### **Teste 2: Verificar DNS**

No Windows (CMD ou PowerShell):
```bash
nslookup -type=MX investigaree.com.br
```

Você deve ver algo como:
```
investigaree.com.br    MX preference = 1, mail exchanger = route1.mx.cloudflare.net
investigaree.com.br    MX preference = 2, mail exchanger = route2.mx.cloudflare.net
investigaree.com.br    MX preference = 3, mail exchanger = route3.mx.cloudflare.net
```

---

## 📊 **RESUMO DO QUE O CLOUDFLARE CONFIGUROU**

O Cloudflare adicionou automaticamente esses registros DNS:

### **Registros MX** (Roteamento de Email)
```
Tipo: MX
Nome: @
Valor: route1.mx.cloudflare.net
Prioridade: 1

Tipo: MX
Nome: @
Valor: route2.mx.cloudflare.net
Prioridade: 2

Tipo: MX
Nome: @
Valor: route3.mx.cloudflare.net
Prioridade: 3
```

### **Registro SPF** (TXT)
```
Tipo: TXT
Nome: @
Valor: v=spf1 include:_spf.mx.cloudflare.net ~all
```

### **Registro DKIM** (TXT)
O Cloudflare adiciona automaticamente os registros DKIM necessários.

---

## ❓ **PERGUNTAS FREQUENTES**

### **1. Posso criar quantos emails?**
Sim, sem limite! Crie quantos quiser gratuitamente.

### **2. Posso usar vários emails de destino?**
Sim, mas cada endereço personalizado só pode ter 1 destino. Se configurar 2 destinos para o mesmo endereço, só o último funcionará.

### **3. Posso ENVIAR emails de contato@investigaree.com.br?**
Sim! Configure "Send As" no Gmail (veja seção acima) ou use um serviço SMTP.

### **4. O Cloudflare lê meus emails?**
Não! O serviço é 100% privado. Eles não armazenam nem acessam o conteúdo.

### **5. Funciona com Google Workspace?**
Não. Email Routing só funciona se o Cloudflare for o único serviço de email no domínio. Você precisará remover registros MX do Google.

### **6. Posso desativar depois?**
Sim! Basta desabilitar o Email Routing no Cloudflare e os registros MX serão removidos.

---

## 🎯 **CHECKLIST FINAL**

- [ ] Acessar Cloudflare Dashboard
- [ ] Habilitar Email Routing (Add records and enable)
- [ ] Criar endereço `contato@investigaree.com.br`
- [ ] Configurar destino (seu Gmail)
- [ ] Verificar email de confirmação
- [ ] Criar endereço `privacidade@investigaree.com.br`
- [ ] Testar enviando email para `contato@investigaree.com.br`
- [ ] Testar enviando email para `privacidade@investigaree.com.br`
- [ ] (Opcional) Configurar "Send As" no Gmail
- [ ] (Opcional) Ativar Catch-all
- [ ] ✅ Pronto! Emails funcionando

---

## 🔗 **DOCUMENTAÇÃO OFICIAL**

- [Cloudflare Email Routing - Get Started](https://developers.cloudflare.com/email-routing/get-started/)
- [Cloudflare Email Routing - Overview](https://developers.cloudflare.com/email-routing/)
- [Configure Email Addresses](https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/)

---

## 📝 **OBSERVAÇÕES**

### **Vantagens sobre Proton Mail:**
- ✅ Configuração em 5 minutos (vs 30+ minutos no Proton)
- ✅ 100% automático (sem copiar/colar registros DNS)
- ✅ Gratuito e sem limite
- ✅ Integra com seu Gmail existente
- ✅ Não precisa criar contas novas

### **Desvantagens:**
- ❌ Não é uma "caixa de entrada real" (só redireciona)
- ❌ Para ENVIAR emails, precisa configurar "Send As" no Gmail
- ❌ Se o Gmail cair, você não recebe emails

### **Recomendação:**
Use o Cloudflare Email Routing para começar rapidamente. Se futuramente precisar de uma solução mais robusta (múltiplos usuários, controle total, aliases ilimitados), aí sim considere Proton Mail ou Google Workspace.

---

**Criado em:** 02/12/2025
**Alternativa ao:** Proton Mail (mais simples e rápido)
**Status:** ✅ Pronto para usar
