import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quem Somos | investigaree",
  description: "Conheça a equipe da investigaree. Expertise em investigação particular e due diligence digital com metodologia validada por Perito Criminal Oficial.",
  openGraph: {
    title: "Quem Somos | investigaree",
    description: "Equipe especializada em investigação particular e due diligence digital. Advisory Board com Perito Criminal Oficial da ANPAJ.",
  },
};

export default function QuemSomosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
