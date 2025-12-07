"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { BlogPost } from "@/types/blog";
import ArticleHeader from "./components/ArticleHeader";
import TableOfContents from "./components/TableOfContents";
import ForensicValue from "./components/ForensicValue";
import ArtifactLocation from "./components/ArtifactLocation";
import TakeawayBox from "./components/TakeawayBox";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";

/**
 * ForensicTutorialTemplate - Template para Tutoriais Forenses
 *
 * Estrutura baseada no padrão Forensafe:
 * 1. Introdução contextualizando o tema
 * 2. Valor Forense (Digital Forensics Value)
 * 3. Localização de Artefatos (Location and Structure)
 * 4. Passo a passo de Análise
 * 5. Resultados e Campos de Dados
 * 6. Conclusões
 *
 * Exemplo de uso:
 *
 * <ForensicTutorialTemplate
 *   post={post}
 *   toc={[
 *     { id: "introducao", title: "Introdução", level: 2 },
 *     { id: "valor-forense", title: "Valor Forense", level: 2 },
 *     ...
 *   ]}
 *   forensicValue={{
 *     description: "O WhatsApp armazena...",
 *     evidences: [...]
 *   }}
 *   artifacts={[...]}
 *   takeaways={["Ponto 1", "Ponto 2"]}
 * >
 *   {/* Conteúdo do artigo (seções de análise) *\/}
 * </ForensicTutorialTemplate>
 */

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface Evidence {
  icon: "location" | "payment" | "users" | "time" | "data" | "auth" | "search" | "shield";
  title: string;
  description: string;
}

interface Artifact {
  name: string;
  path: string;
  description?: string;
  platform: "ios" | "android" | "windows" | "macos" | "linux";
}

interface ForensicTutorialTemplateProps {
  post: BlogPost;
  children: ReactNode;

  // Índice
  toc?: TOCItem[];
  autoGenerateTOC?: boolean;

  // Seção "Valor Forense"
  forensicValue?: {
    title?: string;
    description?: string;
    evidences: Evidence[];
  };

  // Seção "Localização de Artefatos"
  artifacts?: {
    title?: string;
    description?: string;
    items: Artifact[];
  };

  // Seção "Conclusões"
  takeaways?: string[];
  takeawaysCta?: {
    text: string;
    href: string;
  };
}

export default function ForensicTutorialTemplate({
  post,
  children,
  toc = [],
  autoGenerateTOC = false,
  forensicValue,
  artifacts,
  takeaways,
  takeawaysCta
}: ForensicTutorialTemplateProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950">
        {/* Header do artigo */}
        <ArticleHeader post={post} />

        {/* Conteúdo principal */}
        <div className="container mx-auto px-4 sm:px-8 lg:px-12 py-12">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">

            {/* Sidebar com TOC (desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <TableOfContents
                items={toc}
                autoGenerate={autoGenerateTOC}
                containerSelector="#article-content"
                sticky
              />
            </aside>

            {/* Conteúdo do artigo */}
            <article id="article-content" className="flex-1 min-w-0 max-w-3xl">
              {/* Seção: Valor Forense */}
              {forensicValue && (
                <ForensicValue
                  title={forensicValue.title}
                  description={forensicValue.description}
                  evidences={forensicValue.evidences}
                />
              )}

              {/* Seção: Localização de Artefatos */}
              {artifacts && (
                <ArtifactLocation
                  title={artifacts.title}
                  description={artifacts.description}
                  artifacts={artifacts.items}
                />
              )}

              {/* Conteúdo customizado (seções de análise) */}
              <div className="prose prose-invert prose-gold max-w-none">
                {children}
              </div>

              {/* Seção: Conclusões */}
              {takeaways && takeaways.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-12"
                >
                  <TakeawayBox
                    title="Principais conclusões"
                    points={takeaways}
                    cta={takeawaysCta}
                  />
                </motion.div>
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

              {/* Autor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 p-6 rounded-xl bg-white dark:bg-white/50 dark:bg-navy-900/50 border border-blue-500/10"
              >
                <div className="flex items-start gap-4">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl font-bold text-blue-500">
                      {post.author.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-lg">{post.author.name}</p>
                    {post.author.role && (
                      <p className="text-blue-500 text-sm mb-2">{post.author.role}</p>
                    )}
                    {post.author.bio && (
                      <p className="text-slate-500 dark:text-navy-400 text-sm">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </article>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
