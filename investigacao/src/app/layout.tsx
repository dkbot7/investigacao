import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import ClientWidgets from "@/components/ClientWidgets";
import Providers from "@/components/Providers";
import { LGPDConsentBanner } from "@/components/lgpd/ConsentBanner";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://investigacaodigital.com.br'),
  title: "investigação digital - Due Diligence Digital com Rigor Profissional",
  description: "Investigação particular e due diligence digital com metodologia profissional validada. Proteja seu patrimônio com análise completa de startups, founders e parceiros. Entrega em 48h.",
  keywords: ["due diligence", "investigação particular", "investigação digital", "background check", "OSINT", "proteção patrimonial", "verificação de antecedentes"],
  authors: [{ name: "investigação digital" }],
  creator: "investigação digital",
  publisher: "investigação digital",

  // Favicons e ícones
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
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
    url: "https://investigacaodigital.com.br",
    siteName: "investigação digital",
    title: "investigação digital - Due Diligence Digital com Rigor Profissional",
    description: "Investigação particular com metodologia profissional validada. Resultados confiáveis em 48h.",
    images: [
      {
        url: "/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "investigação digital - Due Diligence Profissional",
      },
      {
        url: "/web-app-manifest-192x192.png",
        width: 192,
        height: 192,
        alt: "investigação digital Logo",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@investigação digital",
    creator: "@investigação digital",
    title: "investigação digital - Due Diligence Profissional",
    description: "Proteja seu patrimônio com investigação profissional em 48h. Metodologia validada e confiável",
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

  // Dados estruturados (Schema.org)
  other: {
    "application-name": "investigação digital",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "investigação digital",
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Providers>
              {children}
              <ClientWidgets />
              <LGPDConsentBanner />
            </Providers>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
