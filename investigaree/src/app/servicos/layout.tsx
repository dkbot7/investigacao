import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços | investigaree",
  description: "Serviços de investigação particular e due diligence digital. Proteção para investidores, empresas e famílias com metodologia forense validada.",
  openGraph: {
    title: "Serviços de Investigação | investigaree",
    description: "Due diligence digital, verificação de antecedentes, OSINT e proteção patrimonial. Entrega em 48h.",
  },
};

export default function ServicosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
