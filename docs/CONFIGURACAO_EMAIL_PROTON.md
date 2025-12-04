# Configuração de Email - Proton Mail

## 📧 Emails a criar no Proton Mail

- `contato@investigaree.com.br`
- `privacidade@investigaree.com.br`

---

## 🔧 O QUE VOCÊ PRECISA FAZER NO PROTON MAIL

### **PASSO 1: Adicionar o domínio customizado**

1. Acesse **Proton Mail** → Faça login
2. Vá em **Settings** (ícone de engrenagem) → **All settings**
3. No menu lateral, clique em **Domains**
4. Clique em **Add domain**
5. Digite: `investigaree.com.br`
6. Clique em **Continue**

### **PASSO 2: Copiar os registros DNS**

O Proton Mail mostrará uma tela com os registros DNS que você precisa adicionar. **NÃO FECHE ESSA ABA!**

Você verá algo como:

#### **Registros DKIM** (3 registros - COPIE OS VALORES EXATOS)
```
Hostname: protonmail._domainkey.investigaree.com.br
Value: protonmail.domainkey.XXXXX...XXXXX [valor longo]

Hostname: protonmail2._domainkey.investigaree.com.br
Value: protonmail2.domainkey.XXXXX...XXXXX [valor longo]

Hostname: protonmail3._domainkey.investigaree.com.br
Value: protonmail3.domainkey.XXXXX...XXXXX [valor longo]
```

#### **Registro de Verificação** (TXT)
```
Hostname: investigaree.com.br ou @
Value: protonmail-verification=XXXXX...XXXXX
```

**⚠️ IMPORTANTE**: Mantenha essa aba do Proton Mail aberta. Você precisará desses valores para configurar no Cloudflare.

---

### **PASSO 3: Configurar DNS no Cloudflare** ⬅️ **EU VOU FAZER ISSO PRA VOCÊ**

Não se preocupe, vou adicionar os registros no Cloudflare para você. Mas você precisará me passar os **3 valores DKIM** e o **código de verificação** que aparecerem no Proton Mail.

---

### **PASSO 4: Verificar o domínio no Proton Mail**

1. Depois que eu adicionar os registros DNS, aguarde **15-30 minutos**
2. Volte na tela do Proton Mail (onde estão os registros DNS)
3. Clique em **Verify domain**
4. Se aparecer ✅ **Domain verified**, está pronto!

Se não verificar de primeira, aguarde mais um pouco (propagação DNS pode levar até 48h, mas geralmente é rápido).

---

### **PASSO 5: Criar os endereços de email**

Depois que o domínio for verificado:

1. Vá em **Settings** → **Addresses**
2. Clique em **Add address**
3. Digite: `contato` (o @investigaree.com.br já estará selecionado)
4. Clique em **Create**
5. Repita para criar: `privacidade`

**Pronto!** Você terá:
- ✉️ contato@investigaree.com.br
- ✉️ privacidade@investigaree.com.br

---

## 📋 Registros DNS que EU VOU ADICIONAR no Cloudflare

### **1. Registros MX** (roteamento de emails)
```
Tipo: MX
Nome: @
Valor: mail.protonmail.ch
Prioridade: 10
Proxy: Desativado (DNS only)

Tipo: MX
Nome: @
Valor: mailsec.protonmail.ch
Prioridade: 20
Proxy: Desativado (DNS only)
```

### **2. Registro SPF** (atualizado para incluir Proton Mail)
```
Tipo: TXT
Nome: @
Valor atual: v=spf1 include:_spf.google.com ~all
Valor NOVO:  v=spf1 include:_spf.google.com include:_spf.protonmail.ch ~all
```
⚠️ **Atenção**: Você já tem email configurado com Google. Vou manter ambos (Google + Proton).

### **3. Registros DKIM** (autenticação de emails)
```
Tipo: TXT
Nome: protonmail._domainkey
Valor: [VOCÊ ME PASSA DEPOIS DE VER NO PROTON MAIL]

Tipo: TXT
Nome: protonmail2._domainkey
Valor: [VOCÊ ME PASSA DEPOIS DE VER NO PROTON MAIL]

Tipo: TXT
Nome: protonmail3._domainkey
Valor: [VOCÊ ME PASSA DEPOIS DE VER NO PROTON MAIL]
```

### **4. Registro DMARC** (política de segurança)
```
Tipo: TXT
Nome: _dmarc
Valor: v=DMARC1; p=quarantine; rua=mailto:contato@investigaree.com.br
```

### **5. Registro de Verificação** (TXT)
```
Tipo: TXT
Nome: @
Valor: [VOCÊ ME PASSA DEPOIS DE VER NO PROTON MAIL]
```

---

## ✅ CHECKLIST PARA VOCÊ

- [ ] Fazer login no Proton Mail
- [ ] Adicionar domínio `investigaree.com.br` em Settings → Domains
- [ ] Copiar os 3 valores DKIM que aparecerem na tela
- [ ] Copiar o código de verificação (protonmail-verification=...)
- [ ] Me passar esses 4 valores aqui no chat
- [ ] Aguardar 15-30 minutos após eu configurar o DNS
- [ ] Clicar em "Verify domain" no Proton Mail
- [ ] Criar os endereços: contato@ e privacidade@
- [ ] Testar enviando um email de teste

---

## 🔍 Verificação de Propagação DNS

Depois que eu configurar tudo, você pode verificar se propagou:

**No Windows (PowerShell ou CMD):**
```bash
# Verificar MX
nslookup -type=MX investigaree.com.br

# Verificar SPF
nslookup -type=TXT investigaree.com.br

# Verificar DKIM
nslookup -type=TXT protonmail._domainkey.investigaree.com.br
```

**Online (mais fácil):**
- https://mxtoolbox.com/SuperTool.aspx
- Digite: `investigaree.com.br`
- Selecione "MX Lookup" ou "SPF Record Lookup"

---

## 📞 Próximos passos após configurar

1. Testar envio/recebimento de emails
2. Atualizar os emails no site (Footer, Contato, Privacidade)
3. Configurar assinatura de email profissional
4. Configurar respostas automáticas (se necessário)

---

**Data de criação:** 2025-12-02
**Status:** Aguardando valores DKIM e código de verificação do Proton Mail
