import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, whatsapp, timestamp } = await request.json();

    // Configuração do transporter (usando variáveis de ambiente do Cloudflare)
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Será configurado no Cloudflare
        pass: process.env.GMAIL_APP_PASSWORD, // Será configurado no Cloudflare
      },
    });

    // Template do email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; border-left: 4px solid #D4AF37; padding: 15px; margin: 15px 0; }
            .label { font-weight: bold; color: #1E3A5F; }
            .value { color: #333; margin-left: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🔔 Novo Cadastro - investigaree</h1>
            </div>
            <div class="content">
              <p>Um novo usuário se cadastrou na plataforma:</p>

              <div class="info-box">
                <p><span class="label">Nome:</span><span class="value">${name}</span></p>
                <p><span class="label">Email:</span><span class="value">${email}</span></p>
                <p><span class="label">WhatsApp:</span><span class="value">${whatsapp}</span></p>
                <p><span class="label">Data/Hora:</span><span class="value">${new Date(timestamp).toLocaleString("pt-BR")}</span></p>
              </div>

              <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <strong>⏰ Ação necessária:</strong> Entre em contato com o cliente em até 24 horas.
              </p>
            </div>
            <div class="footer">
              <p>investigaree - Investigação Particular com Rigor Forense</p>
              <p>Este é um email automático. Não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Enviar para ambos os emails
    const recipients = ["dkbotdani@gmail.com", "ibsenmaciel@gmail.com"];

    await transporter.sendMail({
      from: `"investigaree" <${process.env.GMAIL_USER}>`,
      to: recipients.join(", "),
      subject: `🔔 Novo Cadastro: ${name}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);

    // Mesmo se falhar o email, retornar sucesso para não bloquear o cadastro
    return NextResponse.json({
      success: true,
      warning: "Cadastro realizado, mas falha ao enviar notificação por email"
    });
  }
}
