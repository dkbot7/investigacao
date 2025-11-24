import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import AdvisoryBoard from "@/components/landing/AdvisoryBoard";
import SocialProof from "@/components/landing/SocialProof";
import ProtectionAreas from "@/components/landing/ProtectionAreas";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <AdvisoryBoard />
        <SocialProof />
        <ProtectionAreas />
        <Footer />
      </main>
    </>
  );
}
