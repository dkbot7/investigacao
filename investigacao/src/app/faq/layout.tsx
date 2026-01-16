import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perguntas Frequentes | investigaree",
  description: "Dúvidas sobre investigação particular e due diligence digital? Encontre respostas sobre nossos serviços, metodologia, prazos e confidencialidade.",
  openGraph: {
    title: "FAQ - Perguntas Frequentes | investigaree",
    description: "Tire suas dúvidas sobre investigação particular, due diligence e proteção patrimonial.",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
