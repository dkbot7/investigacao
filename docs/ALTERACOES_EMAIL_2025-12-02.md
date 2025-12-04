# Alterações - Configuração de Email Cloudflare Email Routing

**Data:** 02/12/2025
**Responsável:** Dani Kaloi
**Método:** Cloudflare Email Routing (GRATUITO - mais simples que Proton Mail)

---

## 🔄 **MUDANÇA DE MÉTODO: Proton Mail → Cloudflare Email Routing**

**Por que a mudança?**
- ✅ Cloudflare Email Routing é **100% gratuito**
- ✅ Configuração **automática de DNS** (sem copiar/colar valores)
- ✅ Configuração em **5 minutos** (vs 30+ minutos no Proton)
- ✅ Redireciona para Gmail existente (sem criar contas novas)
- ✅ Sem limite de endereços de email

**Como funciona:**
- Emails enviados para `contato@investigaree.com.br` são **redirecionados** para seu Gmail pessoal
- Cloudflare **não armazena** o conteúdo (100% privado)
- Você pode configurar o Gmail para **enviar como** `contato@investigaree.com.br`

---

## 📧 Emails Institucionais a Criar

- ✉️ `contato@investigaree.com.br` → Redireciona para seu Gmail
- ✉️ `privacidade@investigaree.com.br` → Redireciona para seu Gmail

---

## 📝 Alterações no Frontend

### 1. Footer (`investigaree/src/components/landing/Footer.tsx`)
**Alteração:** Adicionado link de email institucional na seção Legal

```tsx
<li className="pt-2">
  <a href="mailto:contato@investigaree.com.br" className="hover:text-primary-400 transition">
    contato@investigaree.com.br
  </a>
</li>
```

### 2. Página de Contato (`investigaree/src/app/contato/page.tsx`)
**Alterações:**
- Adicionada constante `EMAIL_CONTATO = "contato@investigaree.com.br"`
- Grid alterada de 3 para 4 colunas (`grid-cols-4`)
- Novo card "Email Institucional" adicionado entre WhatsApp e Ibsen

**Layout atualizado:**
1. WhatsApp
2. Email Institucional (contato@investigaree.com.br) ⭐ NOVO
3. Ibsen Maciel (ibsenmaciel@gmail.com)
4. Dani Kaloi (kaloidani@gmail.com)

### 3. Página de Privacidade (`investigaree/src/app/privacidade/page.tsx`)
**Status:** ✅ Já estava configurado corretamente
- Email DPO: `privacidade@investigaree.com.br` (linha 47, 131, 185)
- Também menciona: `dpo@investigaree.com.br` (linha 186)

### 4. Página de Termos (`investigaree/src/app/termos/page.tsx`)
**Status:** ✅ Já estava configurado corretamente
- Email de contato: `contato@investigaree.com.br` (linha 233)

---

## ✅ CHECKLIST SIMPLIFICADO - CLOUDFLARE EMAIL ROUTING

### No Cloudflare Dashboard:
- [ ] Acessar https://dash.cloudflare.com/
- [ ] Selecionar domínio `investigaree.com.br`
- [ ] Clicar em **Email** → **Email Routing**
- [ ] Clicar em **"Get started"** ou **"Enable Email Routing"**
- [ ] Revisar registros DNS que serão adicionados
- [ ] Clicar em **"Add records and enable"**
- [ ] ✅ Cloudflare adiciona MX, SPF, DKIM automaticamente!

### Criar Emails:
- [ ] Clicar na aba **"Routes"**
- [ ] Clicar em **"Create address"**
- [ ] **Custom address:** `contato`
- [ ] **Destination:** Seu Gmail (ex: kaloidani@gmail.com)
- [ ] Clicar em **"Save"**
- [ ] Verificar email de confirmação no Gmail
- [ ] Clicar no link de verificação
- [ ] Repetir para criar `privacidade@investigaree.com.br`

### Testar:
- [ ] Enviar email de outro endereço para `contato@investigaree.com.br`
- [ ] Verificar se recebeu no Gmail
- [ ] Enviar email para `privacidade@investigaree.com.br`
- [ ] Verificar se recebeu no Gmail
- [ ] Testar links no site (Footer e Página de Contato)

### (Opcional) Configurar "Send As" no Gmail:
- [ ] Gmail → Configurações → Contas e Importação
- [ ] Adicionar outro endereço de email: `contato@investigaree.com.br`
- [ ] Configurar SMTP do Gmail (smtp.gmail.com:587)
- [ ] Verificar código que chegará via Cloudflare Email Routing
- [ ] ✅ Agora pode enviar emails COMO contato@investigaree.com.br!

---

## 🔍 Verificação de Propagação DNS

### Comandos (Windows CMD/PowerShell):
```bash
# Verificar registros MX
nslookup -type=MX investigaree.com.br

# Verificar SPF
nslookup -type=TXT investigaree.com.br

# Verificar DKIM
nslookup -type=TXT protonmail._domainkey.investigaree.com.br
nslookup -type=TXT protonmail2._domainkey.investigaree.com.br
nslookup -type=TXT protonmail3._domainkey.investigaree.com.br

# Verificar DMARC
nslookup -type=TXT _dmarc.investigaree.com.br
```

### Ferramentas Online:
- **MX Toolbox:** https://mxtoolbox.com/SuperTool.aspx
- **DNS Checker:** https://dnschecker.org/
- **Google Admin Toolbox:** https://toolbox.googleapps.com/apps/checkmx/

---

## 📚 Documentação Adicional

- **✨ Guia Cloudflare Email Routing:** `docs/CONFIGURACAO_EMAIL_CLOUDFLARE.md` ⭐ **USE ESTE**
- **⚠️ Guia Proton Mail (método antigo):** `docs/CONFIGURACAO_EMAIL_PROTON.md` (não use)
- **Cloudflare Email Routing Docs:** https://developers.cloudflare.com/email-routing/
- **Cloudflare DNS Docs:** https://developers.cloudflare.com/dns/

---

## ⚠️ Observações Importantes

1. **Cloudflare Email Routing vs Proton Mail:**
   - ✅ Cloudflare é mais simples (configuração automática)
   - ✅ Cloudflare é gratuito e sem limite de endereços
   - ✅ Não precisa criar contas novas (redireciona para Gmail)
   - ⚠️ Cloudflare não é uma "caixa de entrada real" (só redireciona)
   - ⚠️ Para ENVIAR emails como contato@, precisa configurar "Send As" no Gmail

2. **Registros DNS Antigos:**
   - ⚠️ Você tinha `v=spf1 include:_spf.google.com ~all` configurado
   - Se você ainda usa Google Workspace, NÃO habilite o Cloudflare Email Routing
   - Email Routing só funciona se for o ÚNICO serviço de email no domínio

3. **DPO (Data Protection Officer):**
   - Email `dpo@investigaree.com.br` está mencionado na política de privacidade
   - Considere criar esse email também no Cloudflare Email Routing

4. **Tempo de Ativação:**
   - Cloudflare Email Routing é instantâneo (não precisa aguardar propagação DNS)
   - Os registros MX são adicionados automaticamente pelo Cloudflare

5. **Emails Pessoais:**
   - Os emails pessoais (ibsenmaciel@gmail.com, kaloidani@gmail.com) continuam na página de contato
   - O email institucional foi adicionado como opção adicional

6. **Envio de Emails:**
   - Para RESPONDER emails como `contato@investigaree.com.br`, configure "Send As" no Gmail
   - Veja instruções completas em `docs/CONFIGURACAO_EMAIL_CLOUDFLARE.md`

---

## 🚀 Próximos Passos (Após Configuração)

1. **Configurar assinaturas de email profissionais**
   - Incluir logo da investigaree
   - Links para redes sociais
   - Disclaimer de confidencialidade

2. **Configurar respostas automáticas (opcional)**
   - "Fora do escritório" para ausências
   - Confirmação de recebimento para contato@

3. **Integrar com backend (futuro)**
   - Conectar formulário de contato com API de email
   - Usar Resend ou SendGrid para emails transacionais

4. **Monitoramento**
   - Configurar alertas para emails não entregues
   - Monitorar reputação do domínio (sender score)

---

**Arquivos modificados:**
- ✅ `investigaree/src/components/landing/Footer.tsx`
- ✅ `investigaree/src/app/contato/page.tsx`
- ✅ `docs/CONFIGURACAO_EMAIL_PROTON.md` (criado)
- ✅ `docs/ALTERACOES_EMAIL_2025-12-02.md` (este arquivo)
