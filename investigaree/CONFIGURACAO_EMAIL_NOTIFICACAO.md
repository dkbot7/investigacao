# Configuração de Notificação por Email

## 📧 Sistema Implementado

Quando um novo usuário se cadastra na plataforma, um email automático é enviado para:
- **dkbotdani@gmail.com**
- **ibsenmaciel@gmail.com**

## 🔧 Variáveis de Ambiente Necessárias

Adicione no **Cloudflare Pages** (Environment Variables):

```
GMAIL_USER=seu-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

## 📝 Como Obter a Senha de App do Gmail

### Passo 1: Habilitar Verificação em 2 Etapas
1. Acesse https://myaccount.google.com
2. Vá em **Segurança**
3. Ative **Verificação em duas etapas** (se ainda não estiver ativa)

### Passo 2: Criar Senha de App
1. Na mesma página de Segurança, role até **Senhas de app**
2. Clique em **Senhas de app**
3. Selecione:
   - **App**: Email
   - **Dispositivo**: Outro (nome personalizado) → "investigaree"
4. Clique em **Gerar**
5. Copie a senha de 16 caracteres (formato: xxxx-xxxx-xxxx-xxxx)

### Passo 3: Adicionar no Cloudflare
1. Acesse o dashboard do Cloudflare Pages
2. Vá no projeto **investigaree**
3. Settings → Environment Variables
4. Adicione:
   - `GMAIL_USER` = seu-email@gmail.com
   - `GMAIL_APP_PASSWORD` = a senha de 16 caracteres (sem espaços)

## ✉️ Template do Email

O email enviado contém:
- Nome do novo usuário
- Email cadastrado
- WhatsApp
- Data/hora do cadastro
- Alerta de ação necessária (contato em 24h)

## 🔒 Segurança

- A senha de app é diferente da senha da conta Gmail
- Mesmo se a senha de app for comprometida, sua conta Gmail permanece segura
- Você pode revogar senhas de app a qualquer momento

## 🚨 Importante

O sistema está configurado para **não bloquear o cadastro** mesmo se o envio do email falhar. Isso garante que problemas técnicos não impeçam o usuário de criar a conta.

## 🧪 Testar o Sistema

1. Acesse http://localhost:3006
2. Clique em "Solicitar Investigação Particular"
3. Preencha os dados
4. Crie uma senha
5. Verifique se os emails chegaram em dkbotdani@gmail.com e ibsenmaciel@gmail.com
