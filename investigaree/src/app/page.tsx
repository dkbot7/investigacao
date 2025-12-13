import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import AdvisoryBoard from "@/components/landing/AdvisoryBoard";
import SocialProof from "@/components/landing/SocialProof";
import Footer from "@/components/landing/Footer";

// Partial Prerendering disabled (requires Next.js canary)
// export const experimental_ppr = true;

// Static metadata
export const metadata = {
  title: 'Investigaree - Inteligência em Investigação Digital',
  description: 'Plataforma avançada de investigação digital com dados públicos do governo brasileiro. CPF, CNPJ, processos judiciais e muito mais.',
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <AdvisoryBoard />
        <SocialProof />
        <Footer />
      </main>
    </>
  );
}
