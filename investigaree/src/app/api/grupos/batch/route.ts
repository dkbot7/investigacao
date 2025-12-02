import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { grupoName, documentos } = await request.json();

    // Validate input
    if (!grupoName || typeof grupoName !== "string") {
      return NextResponse.json(
        { error: true, message: "Nome do grupo é obrigatório" },
        { status: 400 }
      );
    }

    if (!Array.isArray(documentos) || documentos.length === 0) {
      return NextResponse.json(
        { error: true, message: "Lista de documentos é obrigatória" },
        { status: 400 }
      );
    }

    // Get Firebase token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: true, message: "Token de autenticação não fornecido" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Create ONE single group record
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funcionarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: grupoName,
          cpf: "00000000000", // Placeholder for group (will be identified by is_grupo=1)
          tipo_pessoa: "fisica",
          categorias: JSON.stringify(["funcionarios"]),
          status_investigacao: "investigar",
          grupo: grupoName,
          motivo_investigacao: "Análise em lote via planilha",
          nivel_urgencia: "media",
          is_grupo: 1,
          grupo_documentos: JSON.stringify(documentos),
          grupo_total_documentos: documentos.length,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar grupo");
      }

      const data = await response.json();

      return NextResponse.json({
        success: true,
        message: `Grupo "${grupoName}" criado com ${documentos.length} documento(s).`,
        grupo: data.pessoa,
      });

    } catch (err) {
      console.error("Erro ao criar grupo:", err);
      throw err;
    }

  } catch (error) {
    console.error("Erro ao processar análise em lote:", error);
    return NextResponse.json(
      { error: true, message: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
