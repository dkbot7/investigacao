import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import AdvisoryBoard from "@/components/landing/AdvisoryBoard";
import SocialProof from "@/components/landing/SocialProof";
import Footer from "@/components/landing/Footer";

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
