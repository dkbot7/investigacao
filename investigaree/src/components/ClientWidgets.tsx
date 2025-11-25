"use client";

import dynamic from "next/dynamic";

const CookieBanner = dynamic(() => import("@/components/CookieBanner"), {
  ssr: false,
});
const WhatsAppWidget = dynamic(() => import("@/components/WhatsAppWidget"), {
  ssr: false,
});

export default function ClientWidgets() {
  return (
    <>
      <WhatsAppWidget />
      <CookieBanner />
    </>
  );
}
