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
  metadataBase: new URL('https://investigaree.com.br'),
  title: "investigaree - Due Diligence Digital com Rigor Forense",
  description: "Investigação particular e due diligence digital com metodologia validada por Perito Criminal Oficial",
  keywords: ["due diligence", "investigação particular", "investigação digital", "background check", "perícia forense", "OSINT"],
  authors: [{ name: "investigaree" }],
  creator: "investigaree",
  publisher: "investigaree",

  // Favicons e ícones
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // Web App Manifest
  manifest: "/site.webmanifest",

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://investigaree.com.br",
    siteName: "investigaree",
    title: "investigaree - Due Diligence Digital com Rigor Forense",
    description: "Investigação particular com metodologia validada por Perito Criminal Oficial",
    images: [
      {
        url: "https://investigaree.com.br/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "investigaree logo",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@investigaree",
    creator: "@investigaree",
    title: "investigaree - Due Diligence Digital com Rigor Forense",
    description: "Investigação particular com metodologia validada por Perito Criminal Oficial",
    images: ["https://investigaree.com.br/web-app-manifest-512x512.png"],
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
