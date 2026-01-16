import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danielle Kaloi - Fundadora | investigaree",
  description: "Fundadora da investigaree. Investigadora Particular especializada em Due Diligence, OSINT e Inteligência Empresarial. Graduanda em Criminologia.",
  openGraph: {
    title: "Danielle Kaloi - Fundadora | investigaree",
    description: "Investigadora Particular especializada em Due Diligence e OSINT. Fundadora da investigaree.",
  },
};

export default function DaniKaloiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
