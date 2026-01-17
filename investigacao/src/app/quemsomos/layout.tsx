import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quem Somos | investigação digital",
  description: "Conheça a equipe da investigação digital. Expertise em investigação particular e due diligence digital com metodologia profissional validada.",
  openGraph: {
    title: "Quem Somos | investigação digital",
    description: "Equipe especializada em investigação particular e due diligence digital. Metodologia profissional validada.",
  },
};

export default function QuemSomosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
