import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://investigaree.com.br'),
  title: "investigaree - Due Diligence Forense para Investidores Anjo",
  description: "Investigação digital e perícia forense em 48 horas. Proteja seu patrimônio com análise completa de startups e founders. R$ 47M protegidos | 2.847 investigações realizadas.",
  keywords: ["due diligence", "investigação digital", "investidor anjo", "background check", "perícia forense", "startup verification", "red flags"],
  authors: [{ name: "investigaree" }],
  creator: "investigaree",
  publisher: "investigaree",

  // Favicons e ícones
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://investigaree.com.br",
    siteName: "investigaree",
    title: "investigaree - Due Diligence Empresarial com Rigor Forense",
    description: "Valide founders antes de transferir um único centavo. Análises forenses que evitaram R$ 47M em perdas em 2024. Entrega em 48h-7 dias.",
    images: [
      {
        url: "/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "investigaree - Due Diligence Forense",
      },
      {
        url: "/web-app-manifest-192x192.png",
        width: 192,
        height: 192,
        alt: "investigaree Logo",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@investigaree",
    creator: "@investigaree",
    title: "investigaree - Due Diligence Forense",
    description: "Proteja seu patrimônio com investigação profissional em 48h. R$ 47M protegidos | Metodologia ANPAJ",
    images: ["/web-app-manifest-512x512.png"],
  },

  // Robots e indexação
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verificação e SEO
  verification: {
    google: "google-site-verification-code", // Adicionar após criar Google Search Console
    // yandex: "yandex-verification-code",
    // bing: "bing-verification-code",
  },

  // Dados estruturados (Schema.org)
  other: {
    "application-name": "investigaree",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "investigaree",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#0A1628",
    "msapplication-tap-highlight": "no",
    "theme-color": "#0A1628",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <WhatsAppWidget />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
