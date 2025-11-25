import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { name, email, whatsapp, timestamp } = await request.json();

    // Log para debug (aparece nos logs do Cloudflare Workers)
    console.log("Novo cadastro:", { name, email, whatsapp, timestamp });

    // Opção 1: Usar um serviço de email externo via API REST
    // Por enquanto, vamos apenas logar e retornar sucesso
    // TODO: Integrar com Resend, SendGrid, ou outro serviço de email

    // Template do email para referência futura
    const emailData = {
      to: ["dkbotdani@gmail.com", "ibsenmaciel@gmail.com"],
      subject: `🔔 Novo Cadastro: ${name}`,
      body: {
        name,
        email,
        whatsapp,
        timestamp: new Date(timestamp).toLocaleString("pt-BR"),
      }
    };

    // Por enquanto, logamos os dados
    console.log("Email notification data:", JSON.stringify(emailData));

    // Retornar sucesso - não bloquear o cadastro
    return NextResponse.json({
      success: true,
      message: "Cadastro registrado com sucesso"
    });
  } catch (error: any) {
    console.error("Erro na API notify-new-user:", error);

    // Mesmo se falhar, retornar sucesso para não bloquear o cadastro
    return NextResponse.json({
      success: true,
      warning: "Cadastro realizado, mas houve um erro interno"
    });
  }
}
