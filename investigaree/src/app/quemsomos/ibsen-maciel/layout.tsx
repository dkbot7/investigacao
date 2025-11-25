import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ibsen Rodrigues Maciel - Advisory Board | investigaree",
  description: "Perito Criminal Oficial em Forense Computacional da Polícia Científica do Pará. Diretor Nacional de Perícias em Computação Forense da ANPAJ. Membro do Advisory Board da investigaree.",
  openGraph: {
    title: "Ibsen Rodrigues Maciel - Advisory Board | investigaree",
    description: "Perito Criminal Oficial, Diretor Nacional ANPAJ, especialista em Forense Computacional. Certificações: CELLEBRITE UFED, XRY MSAB, Magnet AXIOM.",
  },
};

export default function IbsenMacielLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
