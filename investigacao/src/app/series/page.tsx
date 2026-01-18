"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  BookOpen,
  Clock,
  ArrowRight,
  Play,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Shield,
  Search,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { BLOG_SERIES, BLOG_TOPICS } from "@/types/blog";

// Dados expandidos das séries com posts mock
const SERIES_DATA = [
  {
    ...BLOG_SERIES[0], // Fontes Públicas Brasil
    topic: BLOG_TOPICS.find(t => t.id === "osint-brasil"),
    icon: Search,
    posts: [
      { id: "1", title: "Receita Federal: CPF e CNPJ", status: "published", slug: "receita-federal-cpf-cnpj" },
      { id: "2", title: "TSE: Candidaturas e Doações", status: "published", slug: "tse-candidaturas-doacoes" },
      { id: "3", title: "Portal da Transparência: CEIS e CNEP", status: "published", slug: "portal-transparencia-ceis-cnep" },
      { id: "4", title: "Tribunais: Processos Judiciais", status: "draft", slug: "tribunais-processos-judiciais" },
      { id: "5", title: "INSS e Dataprev: Benefícios", status: "draft", slug: "inss-dataprev-beneficios" },
      { id: "6", title: "Juntas Comerciais: Empresas", status: "upcoming", slug: "juntas-comerciais-empresas" },
      { id: "7", title: "Cartórios: Imóveis e Protestos", status: "upcoming", slug: "cartorios-imoveis-protestos" },
      { id: "8", title: "DETRAN: Veículos", status: "upcoming", slug: "detran-veiculos" },
      { id: "9", title: "Diários Oficiais", status: "upcoming", slug: "diarios-oficiais" },
      { id: "10", title: "Redes Sociais como Fonte", status: "upcoming", slug: "redes-sociais-fonte" },
    ]
  },
  {
    ...BLOG_SERIES[1], // Red Flags por Persona
    topic: BLOG_TOPICS.find(t => t.id === "red-flags"),
    icon: AlertTriangle,
    posts: [
      { id: "1", title: "Red Flags em Babás e Cuidadores", status: "published", slug: "red-flags-babas-cuidadores" },
      { id: "2", title: "Red Flags em Motoristas Particulares", status: "published", slug: "red-flags-motoristas" },
      { id: "3", title: "Red Flags em Sócios e Parceiros", status: "draft", slug: "red-flags-socios-parceiros" },
      { id: "4", title: "Red Flags em Fornecedores", status: "upcoming", slug: "red-flags-fornecedores" },
      { id: "5", title: "Red Flags em Relacionamentos", status: "upcoming", slug: "red-flags-relacionamentos" },
      { id: "6", title: "Red Flags em Fundadores de Startups", status: "upcoming", slug: "red-flags-fundadores" },
    ]
  },
  {
    ...BLOG_SERIES[2], // Casos Reais Anonimizados
    topic: BLOG_TOPICS.find(t => t.id === "casos-praticos"),
    icon: Briefcase,
    posts: [
      { id: "1", title: "Case: Investidor evitou prejuízo de R$2M", status: "published", slug: "case-investidor-2m" },
      { id: "2", title: "Case: Patrimônio oculto em divórcio", status: "published", slug: "case-patrimonio-divorcio" },
      { id: "3", title: "Case: Babá com antecedentes criminais", status: "published", slug: "case-baba-antecedentes" },
      { id: "4", title: "Case: Sócio com empresas laranjas", status: "draft", slug: "case-socio-laranjas" },
      { id: "5", title: "Case: Fornecedor na lista CEIS", status: "upcoming", slug: "case-fornecedor-ceis" },
      { id: "6", title: "Case: Golpe do Tinder identificado", status: "upcoming", slug: "case-golpe-tinder" },
      { id: "7", title: "Case: Candidato político com doações suspeitas", status: "upcoming", slug: "case-candidato-doacoes" },
      { id: "8", title: "Case: Herança desviada por procurador", status: "upcoming", slug: "case-heranca-procurador" },
      { id: "9", title: "Case: Funcionário com duplo emprego", status: "upcoming", slug: "case-funcionario-duplo" },
      { id: "10", title: "Case: Empresa fantasma em licitação", status: "upcoming", slug: "case-empresa-fantasma" },
      { id: "11", title: "Case: Cônjuge com contas offshore", status: "upcoming", slug: "case-conjuge-offshore" },
      { id: "12", title: "Case: Startup com fundador fraudador", status: "upcoming", slug: "case-startup-fundador" },
    ]
  },
  {
    ...BLOG_SERIES[3], // Na Visão do Perito
    topic: BLOG_TOPICS.find(t => t.id === "metodologia-profissional"),
    icon: Shield,
    posts: [
      { id: "1", title: "O que é Cadeia de Custódia Digital", status: "published", slug: "cadeia-custodia-digital" },
      { id: "2", title: "Como um Laudo Pericial é Produzido", status: "published", slug: "laudo-pericial-producao" },
      { id: "3", title: "Evidências que Valem em Juízo", status: "draft", slug: "evidencias-valem-juizo" },
      { id: "4", title: "Diferença entre Perícia Oficial e Privada", status: "upcoming", slug: "pericia-oficial-privada" },
      { id: "5", title: "Ferramentas Usadas por Peritos", status: "upcoming", slug: "ferramentas-peritos" },
      { id: "6", title: "Certificações em Profissional Digital", status: "upcoming", slug: "certificacoes-profissional" },
      { id: "7", title: "Ética na Investigação Digital", status: "upcoming", slug: "etica-investigacao" },
      { id: "8", title: "Tendências em Perícia para 2025", status: "upcoming", slug: "tendencias-pericia-2025" },
    ]
  },
];

export default function SeriesPage() {
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "published":
        return { icon: CheckCircle2, label: "Publicado", color: "text-green-500" };
      case "draft":
        return { icon: Clock, label: "Em breve", color: "text-yellow-500" };
      case "upcoming":
        return { icon: Circle, label: "Previsto", color: "text-slate-900 dark:text-navy-500" };
      default:
        return { icon: Circle, label: status, color: "text-slate-900 dark:text-navy-500" };
    }
  };

  const getProgress = (posts: { status: string }[]) => {
    const published = posts.filter(p => p.status === "published").length;
    return Math.round((published / posts.length) * 100);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950">
        {/* Hero Section - Compacto (UX: Padrão F) */}
        <section className="relative pt-24 pb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-navy-900 dark:to-navy-950" />

          <div className="container relative mx-auto px-4 sm:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto">
              {/* Layout em linha - Padrão F */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Lado esquerdo - Título e badge */}
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                    <Layers className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                      Séries de{" "}
                      <span className="text-green-500">Conteúdo</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-navy-400">
                      Aprendizado progressivo do básico ao avançado
                    </p>
                  </div>
                </div>

                {/* Lado direito - Stats */}
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-navy-400">
                  <span>{SERIES_DATA.length} séries</span>
                  <span className="w-1 h-1 rounded-full bg-navy-600" />
                  <span>{SERIES_DATA.reduce((acc, s) => acc + s.posts.length, 0)} episódios</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Séries */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {SERIES_DATA.map((series, index) => {
                const Icon = series.icon;
                const progress = getProgress(series.posts);
                const publishedCount = series.posts.filter(p => p.status === "published").length;
                const isExpanded = selectedSeries === series.id;

                return (
                  <motion.div
                    key={series.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white dark:bg-navy-900/50 border rounded-2xl overflow-hidden transition-all ${
                      isExpanded ? "border-green-500/50 lg:col-span-2" : "border-green-500/10 hover:border-green-500/30"
                    }`}
                  >
                    {/* Header da série */}
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="p-3 rounded-xl flex-shrink-0"
                          style={{ backgroundColor: `${series.topic?.color}20` }}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{ color: series.topic?.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {series.topic && (
                              <span
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: `${series.topic.color}20`,
                                  color: series.topic.color
                                }}
                              >
                                {series.topic.name}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              series.status === "completa"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {series.status === "completa" ? "Completa" : "Em andamento"}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {series.name}
                          </h3>
                          <p className="text-slate-600 dark:text-navy-300 text-sm mb-4">
                            {series.description}
                          </p>

                          {/* Progress bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-slate-500 dark:text-navy-400">
                                {publishedCount} de {series.totalParts} partes publicadas
                              </span>
                              <span className="text-green-500 font-medium">{progress}%</span>
                            </div>
                            <div className="h-2 bg-navy-100 dark:bg-navy-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${progress}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedSeries(isExpanded ? null : series.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-navy-100 dark:bg-navy-800 hover:bg-navy-700 text-slate-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <BookOpen className="w-4 h-4" />
                              {isExpanded ? "Ocultar episódios" : "Ver episódios"}
                            </button>
                            {publishedCount > 0 && (
                              <Link
                                href={`/blog/${series.posts.find(p => p.status === "published")?.slug}`}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-navy-950 rounded-lg text-sm font-medium transition-colors"
                              >
                                <Play className="w-4 h-4" />
                                Começar série
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lista de episódios expandida */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-green-500/10"
                      >
                        <div className="p-6">
                          <h4 className="text-sm font-medium text-slate-500 dark:text-navy-400 mb-4">
                            Todos os episódios
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {series.posts.map((post, postIndex) => {
                              const statusInfo = getStatusInfo(post.status);
                              const StatusIcon = statusInfo.icon;

                              return (
                                <div
                                  key={post.id}
                                  className={`flex items-center gap-3 p-3 rounded-lg ${
                                    post.status === "published"
                                      ? "bg-navy-100 dark:bg-navy-800/50 hover:bg-navy-200 dark:hover:bg-navy-800"
                                      : "bg-navy-50 dark:bg-navy-900/50"
                                  } transition-colors`}
                                >
                                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-navy-200 dark:bg-navy-800 text-slate-500 dark:text-navy-400 text-sm font-medium flex-shrink-0">
                                    {postIndex + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    {post.status === "published" ? (
                                      <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-slate-900 dark:text-white hover:text-green-400 font-medium text-sm line-clamp-1 transition-colors"
                                      >
                                        {post.title}
                                      </Link>
                                    ) : (
                                      <span className="text-slate-500 dark:text-navy-400 text-sm line-clamp-1">
                                        {post.title}
                                      </span>
                                    )}
                                  </div>
                                  <StatusIcon className={`w-4 h-4 flex-shrink-0 ${statusInfo.color}`} />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Newsletter */}
        <section className="py-16 border-t border-green-500/10">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Receba novos episódios por email
              </h3>
              <p className="text-slate-600 dark:text-navy-300 mb-6">
                Seja notificado quando novos episódios forem publicados.
                Não perca nenhum conteúdo da sua série favorita.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Seu email profissional"
                  className="flex-1 px-5 py-3 rounded-xl bg-navy-100 dark:bg-navy-800/50 border border-green-500/20 text-slate-900 dark:text-white placeholder:text-navy-600 dark:placeholder:text-navy-400 focus:outline-none focus:border-green-500/50 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-navy-950 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Inscrever-se
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

