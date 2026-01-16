import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ibsen Rodrigues Maciel - Advisory Board | investigaree",
  description: "Referência nacional em Perícia Forense Computacional. Diretor Nacional de Perícias em Computação Forense da ANPAJ. 1º lugar Concurso Polícia Científica (PCE-PA) 2019. LABCEDF - Polícia Civil do Estado do Pará.",
  openGraph: {
    title: "Ibsen Rodrigues Maciel - Advisory Board | investigaree",
    description: "Perito Criminal Oficial, Diretor Nacional ANPAJ, 1º lugar PCE-PA 2019, 1º lugar Exército 2017/18. LABCEDF - Laboratório de Computação e Extração de Dados Forenses (PC-PA). Certificações CELLEBRITE UFED, XRY MSAB, Magnet AXIOM.",
  },
};

export default function IbsenMacielLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
