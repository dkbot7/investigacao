"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import ArticleHeader from "./components/ArticleHeader";
import TableOfContents from "./components/TableOfContents";
import KeyStat from "./components/KeyStat";
import TakeawayBox from "./components/TakeawayBox";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";

/**
 * EducationalArticleTemplate - Template para Artigos Educativos
 *
 * Estrutura baseada no padrão Binalyze:
 * 1. Lead explicativo com subtítulo
 * 2. Parágrafos curtos e diretos
 * 3. Cabeçalhos de nível 4 para seções temáticas
 * 4. Listas enumeradas para pontos-chave
 * 5. Blocos de citação com estatísticas (KeyStat)
 * 6. Imagens/screenshots ilustrativos
 * 7. Seção "Takeaway" no final
 *
 * Exemplo de uso:
 *
 * <EducationalArticleTemplate
 *   post={post}
 *   keyStat={{
 *     value: "70%",
 *     label: "dos divórcios envolvem ocultação patrimonial",
 *     source: "IBDFAM, 2023",
 *     type: "warning"
 *   }}
 *   takeaways={[
 *     "Due diligence patrimonial é essencial antes do divórcio",
 *     "Investigação preventiva reduz litígios",
 *     "Documentação adequada fortalece o processo"
 *   ]}
 * >
 *   {/* Conteúdo do artigo com seções, listas, imagens *\/}
 * </EducationalArticleTemplate>
 */

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface KeyStatData {
  value: string;
  label: string;
  source?: string;
  type?: "info" | "warning" | "success" | "trend";
}

interface EducationalArticleTemplateProps {
  post: BlogPost;
  children: ReactNode;

  // Índice
  toc?: TOCItem[];
  autoGenerateTOC?: boolean;

  // Estatística em destaque (opcional)
  keyStat?: KeyStatData;

  // Segunda estatística (opcional)
  secondaryStat?: KeyStatData;

  // Seção "Takeaway"
  takeaways?: string[];
  takeawaysCta?: {
    text: string;
    href: string;
  };

  // Layout
  showSidebar?: boolean;
  sidebarContent?: ReactNode;
}

export default function EducationalArticleTemplate({
  post,
  children,
  toc = [],
  autoGenerateTOC = false,
  keyStat,
  secondaryStat,
  takeaways,
  takeawaysCta,
  showSidebar = true,
  sidebarContent
}: EducationalArticleTemplateProps) {
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
            {showSidebar && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="space-y-6">
                  <TableOfContents
                    items={toc}
                    autoGenerate={autoGenerateTOC}
                    containerSelector="#article-content"
                    sticky
                  />

                  {/* Conteúdo adicional da sidebar */}
                  {sidebarContent}
                </div>
              </aside>
            )}

            {/* Conteúdo do artigo */}
            <article
              id="article-content"
              className={`flex-1 min-w-0 ${showSidebar ? "max-w-3xl" : "max-w-4xl mx-auto"}`}
            >
              {/* Estatística em destaque no início */}
              {keyStat && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <KeyStat
                    value={keyStat.value}
                    label={keyStat.label}
                    source={keyStat.source}
                    type={keyStat.type}
                  />
                </motion.div>
              )}

              {/* Conteúdo do artigo */}
              <div className="prose prose-invert prose-gold max-w-none prose-headings:scroll-mt-24 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-900 dark:text-white prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:text-white prose-h3:mt-8 prose-h3:mb-3 prose-h4:text-lg prose-h4:font-medium prose-h4:text-blue-400 prose-h4:mt-6 prose-h4:mb-2 prose-p:text-slate-600 dark:text-navy-300 prose-p:leading-relaxed prose-p:mb-4 prose-li:text-slate-600 dark:text-navy-300 prose-strong:text-white prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:text-slate-700 dark:text-navy-200 prose-blockquote:not-italic prose-code:text-purple-400 prose-code:bg-white dark:bg-white/50 dark:bg-navy-900/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-white dark:bg-white/70 dark:bg-navy-900/70 prose-pre:border prose-pre:border-blue-500/10 prose-img:rounded-xl prose-img:border prose-img:border-blue-500/10">
                {children}
              </div>

              {/* Segunda estatística (opcional, após o conteúdo) */}
              {secondaryStat && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="my-8"
                >
                  <KeyStat
                    value={secondaryStat.value}
                    label={secondaryStat.label}
                    source={secondaryStat.source}
                    type={secondaryStat.type}
                  />
                </motion.div>
              )}

              {/* Seção: Takeaway / Conclusões */}
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
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={64}
                      height={64}
                      className="rounded-full"
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

              {/* Artigos relacionados (placeholder) */}
              <section className="mt-12">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                  Artigos relacionados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Placeholder para artigos relacionados */}
                  <div className="p-4 rounded-xl bg-white dark:bg-white/30 dark:bg-navy-900/30 border border-blue-500/10 hover:border-blue-500/30 transition-colors">
                    <p className="text-sm text-slate-900 dark:text-navy-500 mb-1">Em breve</p>
                    <p className="text-slate-900 dark:text-white font-medium">Artigos relacionados serão exibidos aqui</p>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
