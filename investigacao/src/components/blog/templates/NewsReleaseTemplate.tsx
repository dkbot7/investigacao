"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Building2, ArrowRight, Download } from "lucide-react";
import { BlogPost } from "@/types/blog";
import ArticleHeader from "./components/ArticleHeader";
import FeatureList from "./components/FeatureList";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import { Button } from "@/components/ui/button";

/**
 * NewsReleaseTemplate - Template para Notícias e Press Releases
 *
 * Estrutura baseada no padrão Forensic Focus:
 * 1. Título, data e autor (empresa/vendor)
 * 2. Parágrafo resumo/introdução
 * 3. Listas de novidades divididas por categoria
 * 4. CTAs (trial, download, etc)
 * 5. Seção "Sobre" a empresa/produto
 *
 * Exemplo de uso:
 *
 * <NewsReleaseTemplate
 *   post={post}
 *   vendor={{
 *     name: "Investigaree",
 *     description: "Plataforma de investigação digital...",
 *     website: "https://investigaree.com.br",
 *     logo: "/logo.png"
 *   }}
 *   features={[
 *     { name: "Novas Consultas", features: [...] },
 *     { name: "Melhorias de UX", features: [...] }
 *   ]}
 *   ctas={[
 *     { text: "Solicitar Demo", href: "/demo", variant: "primary" },
 *     { text: "Download Trial", href: "/download", variant: "secondary" }
 *   ]}
 * >
 *   {/* Conteúdo adicional *\/}
 * </NewsReleaseTemplate>
 */

interface Feature {
  title: string;
  description?: string;
  isNew?: boolean;
  isHighlight?: boolean;
}

interface FeatureCategory {
  name: string;
  features: Feature[];
}

interface CTA {
  text: string;
  href: string;
  variant?: "primary" | "secondary" | "download";
  icon?: "external" | "download" | "arrow";
}

interface VendorInfo {
  name: string;
  description: string;
  website?: string;
  logo?: string;
}

interface NewsReleaseTemplateProps {
  post: BlogPost;
  children?: ReactNode;

  // Informações do vendor/empresa
  vendor?: VendorInfo;

  // Lista de features por categoria
  features?: FeatureCategory[];

  // CTAs
  ctas?: CTA[];

  // Mostrar badge de conteúdo patrocinado
  isSponsored?: boolean;
}

export default function NewsReleaseTemplate({
  post,
  children,
  vendor,
  features,
  ctas,
  isSponsored = false
}: NewsReleaseTemplateProps) {
  const getCtaIcon = (iconType?: string) => {
    switch (iconType) {
      case "download":
        return <Download className="w-4 h-4" />;
      case "external":
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950">
        {/* Header do artigo */}
        <ArticleHeader post={post} />

        {/* Badge de conteúdo patrocinado */}
        {isSponsored && (
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <div className="max-w-3xl mx-auto -mt-4 mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
                <Building2 className="w-3 h-3" />
                Conteúdo patrocinado por {vendor?.name || post.author.name}
              </span>
            </div>
          </div>
        )}

        {/* Conteúdo principal */}
        <div className="container mx-auto px-4 sm:px-8 lg:px-12 py-8">
          <article className="max-w-3xl mx-auto">

            {/* Introdução (children) */}
            {children && (
              <div className="prose prose-invert prose-gold max-w-none mb-8">
                {children}
              </div>
            )}

            {/* Lista de Features */}
            {features && features.length > 0 && (
              <FeatureList
                title="Novidades e Melhorias"
                categories={features}
                showBadges
              />
            )}

            {/* CTAs */}
            {ctas && ctas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-10 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Experimente agora
                </h3>
                <div className="flex flex-wrap gap-3">
                  {ctas.map((cta, index) => (
                    <Button
                      key={index}
                      asChild
                      variant={cta.variant === "primary" ? "default" : "outline"}
                      className={
                        cta.variant === "primary"
                          ? "bg-blue-500 hover:bg-blue-600 text-navy-950"
                          : cta.variant === "download"
                          ? "border-green-500/50 text-green-400 hover:bg-green-500/10"
                          : "border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      }
                    >
                      <a href={cta.href} target="_blank" rel="noopener noreferrer">
                        {cta.text}
                        {getCtaIcon(cta.icon)}
                      </a>
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Seção Sobre o Vendor */}
            {vendor && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 p-6 rounded-xl bg-white dark:bg-white/50 dark:bg-navy-900/50 border border-blue-500/10"
              >
                <div className="flex items-start gap-4">
                  {vendor.logo ? (
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      className="w-16 h-16 rounded-lg object-contain bg-white p-2"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-blue-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                      Sobre {vendor.name}
                    </h4>
                    <p className="text-slate-600 dark:text-navy-300 text-sm mb-3">
                      {vendor.description}
                    </p>
                    {vendor.website && (
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm font-medium"
                      >
                        Visitar site
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-blue-500/10">
                <p className="text-sm text-slate-900 dark:text-navy-500 mb-3">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-white dark:bg-white/50 dark:bg-navy-900/50 text-slate-600 dark:text-navy-300 rounded-lg hover:bg-slate-100 dark:bg-navy-800 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        <Footer />
      </main>
    </>
  );
}
