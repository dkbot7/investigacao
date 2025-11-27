import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ibsen Rodrigues Maciel - Advisory Board | investigaree",
  description: "Referência nacional em Perícia Forense Computacional. Diretor Nacional de Perícias em Computação Forense da ANPAJ. 1º lugar Concurso PC-PA 2019. Membro do Comitê do Instituto de Defesa Cibernética.",
  openGraph: {
    title: "Ibsen Rodrigues Maciel - Advisory Board | investigaree",
    description: "Perito Criminal Oficial, Diretor Nacional ANPAJ, 1º lugar PC-PA 2019, 1º lugar Exército 2017/18. Especialista em Forense Computacional com certificações CELLEBRITE UFED, XRY MSAB, Magnet AXIOM.",
  },
};

export default function IbsenMacielLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
