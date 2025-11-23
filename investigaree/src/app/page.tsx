import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import AdvisoryBoard from "@/components/landing/AdvisoryBoard";
import SocialProof from "@/components/landing/SocialProof";
import ServicePortals from "@/components/landing/ServicePortals";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <AdvisoryBoard />
        <SocialProof />
        <ServicePortals />
        <Pricing />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
