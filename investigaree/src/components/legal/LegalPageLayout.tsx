"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Calendar, FileText } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  lastUpdated,
  children
}: LegalPageLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy-950 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-navy-400 hover:text-gold-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar ao início
            </Link>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 pb-8 border-b border-gold-500/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gold-500/10">
                  <FileText className="w-6 h-6 text-gold-500" />
                </div>
                <span className="text-sm text-gold-500 font-medium">Documento Legal</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-navy-400">
                <Calendar className="w-4 h-4" />
                <span>Última atualização: {lastUpdated}</span>
              </div>
            </motion.header>

            {/* Conteúdo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-invert prose-gold max-w-none"
            >
              <style jsx global>{`
                .prose-gold {
                  --tw-prose-headings: #fff;
                  --tw-prose-body: #94a3b8;
                  --tw-prose-links: #D4AF37;
                  --tw-prose-bold: #fff;
                }

                .prose h2 {
                  font-size: 1.5rem;
                  font-weight: 700;
                  margin-top: 2.5rem;
                  margin-bottom: 1rem;
                  padding-bottom: 0.5rem;
                  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
                  color: #fff;
                }

                .prose h3 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                  color: #D4AF37;
                }

                .prose p {
                  margin-bottom: 1rem;
                  line-height: 1.7;
                  color: #94a3b8;
                }

                .prose ul, .prose ol {
                  margin-bottom: 1rem;
                  padding-left: 1.5rem;
                  color: #94a3b8;
                }

                .prose li {
                  margin-bottom: 0.5rem;
                }

                .prose li::marker {
                  color: #D4AF37;
                }

                .prose a {
                  color: #D4AF37;
                  text-decoration: none;
                  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
                  transition: all 0.2s;
                }

                .prose a:hover {
                  border-bottom-color: #D4AF37;
                }

                .prose strong {
                  color: #fff;
                }

                .prose table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1.5rem 0;
                }

                .prose th {
                  background: rgba(212, 175, 55, 0.1);
                  color: #fff;
                  font-weight: 600;
                  padding: 0.75rem 1rem;
                  text-align: left;
                  border: 1px solid rgba(212, 175, 55, 0.2);
                }

                .prose td {
                  padding: 0.75rem 1rem;
                  border: 1px solid rgba(212, 175, 55, 0.1);
                  color: #94a3b8;
                }

                .prose blockquote {
                  border-left: 3px solid #D4AF37;
                  padding-left: 1rem;
                  margin: 1.5rem 0;
                  color: #cbd5e1;
                  font-style: italic;
                }
              `}</style>
              {children}
            </motion.div>

            {/* Navegação entre documentos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-16 pt-8 border-t border-gold-500/10"
            >
              <h3 className="text-sm font-medium text-navy-400 mb-4">
                Outros documentos legais
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/privacidade"
                  className="px-4 py-2 rounded-lg bg-navy-900/50 border border-gold-500/10 text-navy-300 hover:text-gold-400 hover:border-gold-500/30 transition-colors text-sm"
                >
                  Política de Privacidade
                </Link>
                <Link
                  href="/termos"
                  className="px-4 py-2 rounded-lg bg-navy-900/50 border border-gold-500/10 text-navy-300 hover:text-gold-400 hover:border-gold-500/30 transition-colors text-sm"
                >
                  Termos de Uso
                </Link>
                <Link
                  href="/cookies"
                  className="px-4 py-2 rounded-lg bg-navy-900/50 border border-gold-500/10 text-navy-300 hover:text-gold-400 hover:border-gold-500/30 transition-colors text-sm"
                >
                  Política de Cookies
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
