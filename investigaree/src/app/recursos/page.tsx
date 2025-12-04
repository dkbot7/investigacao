"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  GraduationCap,
  Code,
  BookOpen,
  ExternalLink,
  Star,
  Search,
  X,
  Loader2,
  CheckCircle,
  Mail,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { RESOURCE_TYPES } from "@/types/blog";

// Dados de recursos
const RESOURCES = [
  // ===== CURSOS E TREINAMENTOS DO INVESTIGAREE =====
  {
    id: "treinamento-cibercrimes-ibsen",
    name: "Cibercrimes e Investigação Digital",
    slug: "treinamento-cibercrimes-ibsen",
    description: "Treinamento ministrado por Ibsen Maciel, Perito Criminal Oficial, abordando técnicas de investigação de crimes cibernéticos, cadeia de custódia e análise forense.",
    type: "curso" as const,
    url: "/contato",
    price: "pago" as const,
    provider: "Ibsen Maciel - Investigaree",
    rating: 5.0,
    featured: true,
    tags: ["cibercrimes", "investigação", "forense", "perito criminal"],
    internal: true
  },
  {
    id: "treinamento-osint-dani",
    name: "OSINT e Fontes Públicas Brasileiras",
    slug: "treinamento-osint-dani",
    description: "Curso prático de inteligência em fontes abertas focado em bases de dados brasileiras: Receita Federal, TSE, CEIS, tribunais e mais. Ministrado por Dani Kaloi.",
    type: "curso" as const,
    url: "/contato",
    price: "pago" as const,
    provider: "Dani Kaloi - Investigaree",
    rating: 5.0,
    featured: true,
    tags: ["osint", "fontes públicas", "due diligence", "brasil"],
    internal: true
  },
  {
    id: "treinamento-due-diligence",
    name: "Due Diligence Digital na Prática",
    slug: "treinamento-due-diligence",
    description: "Aprenda a realizar verificações de background completas utilizando fontes públicas brasileiras. Metodologia validada por perito criminal oficial.",
    type: "curso" as const,
    url: "/contato",
    price: "pago" as const,
    provider: "Equipe Investigaree",
    rating: 5.0,
    featured: true,
    tags: ["due diligence", "background check", "verificação", "compliance"],
    internal: true
  },

  // ===== FERRAMENTAS - PRODUTOS DANI KALOI =====
  {
    id: "investigaree",
    name: "Investigaree",
    slug: "investigaree",
    description: "Plataforma de due diligence e investigação digital. Consulte fontes públicas brasileiras, identifique vínculos e gere relatórios profissionais.",
    type: "ferramenta" as const,
    url: "/servicos",
    price: "pago" as const,
    provider: "Dani Kaloi",
    rating: 5.0,
    featured: true,
    tags: ["due diligence", "investigação", "fontes públicas", "brasil"],
    internal: true
  },
  {
    id: "exposta",
    name: "Exposta",
    slug: "exposta",
    description: "Plataforma de verificação e exposição de informações públicas para proteção contra fraudes e golpes.",
    type: "ferramenta" as const,
    url: "https://www.exposta.com.br",
    price: "freemium" as const,
    provider: "Dani Kaloi",
    rating: 5.0,
    featured: true,
    tags: ["verificação", "fraudes", "proteção", "golpes"]
  },
  {
    id: "chatbot-imoveis",
    name: "Chatbot Imóveis",
    slug: "chatbot-imoveis",
    description: "Chatbot inteligente para atendimento automatizado no mercado imobiliário. Qualifica leads e agenda visitas.",
    type: "ferramenta" as const,
    url: "https://www.chatbotimoveis.com.br",
    price: "pago" as const,
    provider: "Dani Kaloi",
    rating: 5.0,
    featured: true,
    tags: ["chatbot", "imobiliário", "automação", "leads"]
  },

  // ===== APIs PERSONALIZADAS =====
  {
    id: "api-personalizada",
    name: "Desenvolva sua API Personalizada",
    slug: "api-personalizada",
    description: "Precisa de uma API sob medida para seu negócio? Nossa equipe desenvolve soluções customizadas para integração de dados, automação e consultas.",
    type: "api" as const,
    url: "#solicitar-api",
    price: "pago" as const,
    provider: "Dani Kaloi - Investigaree",
    rating: 5.0,
    featured: true,
    tags: ["api", "desenvolvimento", "personalizada", "integração"],
    internal: true,
    isForm: true
  },

  // ===== LIVROS - DANI KALOI =====
  {
    id: "livro-ia-mercado-imobiliario",
    name: "Inteligência Artificial no Mercado Imobiliário",
    slug: "livro-ia-mercado-imobiliario",
    description: "Como a IA está transformando o setor imobiliário: automação, chatbots, análise de dados e tendências. Escrito por Dani Kaloi.",
    type: "livro" as const,
    url: "https://www.amazon.com.br/Intelig%C3%AAncia-Artificial-Mercado-Imobili%C3%A1rio-Transformar-ebook/dp/B0DJWQDRM9",
    price: "pago" as const,
    provider: "Dani Kaloi",
    rating: 5.0,
    featured: true,
    tags: ["inteligência artificial", "imobiliário", "automação", "tecnologia"]
  },
];

const ICONS: Record<string, typeof Wrench> = {
  curso: GraduationCap,
  ferramenta: Wrench,
  api: Code,
  livro: BookOpen,
};

export default function RecursosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  // Estado do formulário de API
  const [showApiForm, setShowApiForm] = useState(false);
  const [apiFormData, setApiFormData] = useState({
    nome: "",
    email: "",
    empresa: "",
    descricao: "",
    integracao: "",
    prazo: ""
  });
  const [apiFormSubmitting, setApiFormSubmitting] = useState(false);
  const [apiFormSuccess, setApiFormSuccess] = useState(false);

  // Filtrar recursos
  const filteredResources = useMemo(() => {
    let resources = [...RESOURCES];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      resources = resources.filter(
        r =>
          r.name.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search) ||
          r.tags.some(t => t.toLowerCase().includes(search))
      );
    }

    if (selectedType) {
      resources = resources.filter(r => r.type === selectedType);
    }

    if (selectedPrice) {
      resources = resources.filter(r => r.price === selectedPrice);
    }

    // Ordenar: featured primeiro, depois por rating
    return resources.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [searchTerm, selectedType, selectedPrice]);

  // Agrupar por tipo
  const groupedResources = useMemo(() => {
    if (selectedType) {
      return { [selectedType]: filteredResources };
    }
    const groups: Record<string, typeof RESOURCES> = {};
    filteredResources.forEach(resource => {
      if (!groups[resource.type]) groups[resource.type] = [];
      groups[resource.type].push(resource);
    });
    return groups;
  }, [filteredResources, selectedType]);

  const getPriceLabel = (price: string) => {
    switch (price) {
      case "gratuito": return { label: "Gratuito", color: "bg-green-500/20 text-green-400" };
      case "freemium": return { label: "Freemium", color: "bg-blue-500/20 text-blue-400" };
      case "pago": return { label: "Pago", color: "bg-gold-500/20 text-gold-400" };
      default: return { label: price, color: "bg-navy-500/20 text-navy-400" };
    }
  };

  const getTypeInfo = (type: string) => {
    return RESOURCE_TYPES.find(t => t.id === type);
  };

  // Função para submeter formulário de API
  const handleApiFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiFormSubmitting(true);

    try {
      // Simular envio (integrar com backend depois)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Salvar no localStorage para demo
      const leads = JSON.parse(localStorage.getItem("investigaree_api_requests") || "[]");
      leads.push({
        ...apiFormData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("investigaree_api_requests", JSON.stringify(leads));

      setApiFormSuccess(true);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setApiFormSubmitting(false);
    }
  };

  // Função para abrir o formulário de API
  const handleApiClick = (e: React.MouseEvent, resource: typeof RESOURCES[0]) => {
    if ('isForm' in resource && resource.isForm) {
      e.preventDefault();
      setShowApiForm(true);
      setApiFormSuccess(false);
      setApiFormData({
        nome: "",
        email: "",
        empresa: "",
        descricao: "",
        integracao: "",
        prazo: ""
      });
    }
  };

  return (
    <>
      <Header />

      {/* Modal de Formulário de API */}
      <AnimatePresence>
        {showApiForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setShowApiForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-navy-900 rounded-2xl border border-gold-500/20 overflow-hidden"
            >
              {/* Header do Modal */}
              <div className="flex items-center justify-between p-6 border-b border-gold-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Code className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Solicitar API Personalizada</h3>
                    <p className="text-sm text-navy-400">Descreva sua necessidade</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApiForm(false)}
                  className="p-2 rounded-lg hover:bg-navy-800 transition-colors"
                >
                  <X className="w-5 h-5 text-navy-400" />
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {!apiFormSuccess ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleApiFormSubmit}
                      className="space-y-4"
                    >
                      {/* Nome e Email */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-navy-300 mb-1.5">Nome *</label>
                          <input
                            type="text"
                            required
                            value={apiFormData.nome}
                            onChange={(e) => setApiFormData({ ...apiFormData, nome: e.target.value })}
                            placeholder="Seu nome"
                            className="w-full px-4 py-2.5 bg-navy-800 border border-gold-500/10 rounded-lg text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/30"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-navy-300 mb-1.5">Email *</label>
                          <input
                            type="email"
                            required
                            value={apiFormData.email}
                            onChange={(e) => setApiFormData({ ...apiFormData, email: e.target.value })}
                            placeholder="seu@email.com"
                            className="w-full px-4 py-2.5 bg-navy-800 border border-gold-500/10 rounded-lg text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/30"
                          />
                        </div>
                      </div>

                      {/* Empresa */}
                      <div>
                        <label className="block text-sm text-navy-300 mb-1.5">Empresa</label>
                        <input
                          type="text"
                          value={apiFormData.empresa}
                          onChange={(e) => setApiFormData({ ...apiFormData, empresa: e.target.value })}
                          placeholder="Nome da sua empresa"
                          className="w-full px-4 py-2.5 bg-navy-800 border border-gold-500/10 rounded-lg text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/30"
                        />
                      </div>

                      {/* Descrição da API */}
                      <div>
                        <label className="block text-sm text-navy-300 mb-1.5">Descreva a API que precisa *</label>
                        <textarea
                          required
                          rows={3}
                          value={apiFormData.descricao}
                          onChange={(e) => setApiFormData({ ...apiFormData, descricao: e.target.value })}
                          placeholder="Ex: Preciso de uma API para consultar dados de CPF em tempo real..."
                          className="w-full px-4 py-2.5 bg-navy-800 border border-gold-500/10 rounded-lg text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/30 resize-none"
                        />
                      </div>

                      {/* Integração */}
                      <div>
                        <label className="block text-sm text-navy-300 mb-1.5">Onde será integrada?</label>
                        <input
                          type="text"
                          value={apiFormData.integracao}
                          onChange={(e) => setApiFormData({ ...apiFormData, integracao: e.target.value })}
                          placeholder="Ex: Sistema interno, CRM, ERP, site..."
                          className="w-full px-4 py-2.5 bg-navy-800 border border-gold-500/10 rounded-lg text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/30"
                        />
                      </div>

                      {/* Prazo */}
                      <div>
                        <label className="block text-sm text-navy-300 mb-1.5">Prazo desejado</label>
                        <select
                          value={apiFormData.prazo}
                          onChange={(e) => setApiFormData({ ...apiFormData, prazo: e.target.value })}
                          className="w-full px-4 py-2.5 bg-navy-800 border border-gold-500/10 rounded-lg text-white focus:outline-none focus:border-gold-500/30"
                        >
                          <option value="">Selecione...</option>
                          <option value="urgente">Urgente (1-2 semanas)</option>
                          <option value="normal">Normal (1 mês)</option>
                          <option value="flexivel">Flexível (sem pressa)</option>
                        </select>
                      </div>

                      {/* Botão de enviar */}
                      <button
                        type="submit"
                        disabled={apiFormSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-navy-950 font-semibold rounded-lg transition-colors"
                      >
                        {apiFormSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4" />
                            Solicitar Proposta
                          </>
                        )}
                      </button>

                      <p className="text-xs text-navy-500 text-center">
                        Nossa equipe entrará em contato em até 24h para entender melhor sua necessidade.
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-2">
                        Solicitação Enviada!
                      </h4>
                      <p className="text-navy-300 mb-6">
                        Recebemos sua solicitação. Nossa equipe entrará em contato pelo email {apiFormData.email} em até 24 horas.
                      </p>
                      <button
                        onClick={() => setShowApiForm(false)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold rounded-lg transition-colors"
                      >
                        Fechar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-navy-950">
        {/* Hero Section - Compacto (UX: Padrão F) */}
        <section className="relative pt-24 pb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900 to-navy-950" />

          <div className="container relative mx-auto px-4 sm:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto">
              {/* Layout em linha - Padrão F */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Lado esquerdo - Título e badge */}
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
                    <Wrench className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      Recursos{" "}
                      <span className="text-gold-500">Investigação</span>
                    </h1>
                    <p className="text-sm text-navy-400">
                      Cursos, ferramentas, APIs e livros selecionados
                    </p>
                  </div>
                </div>

                {/* Lado direito - Busca */}
                <div className="w-full lg:w-auto lg:min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                    <Input
                      type="text"
                      placeholder="Buscar recursos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 bg-navy-800/50 border-gold-500/20 text-white placeholder:text-navy-400 focus:border-gold-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="py-6 border-y border-gold-500/10 bg-navy-900/30">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Filtro por tipo */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-navy-400 mr-2">Tipo:</span>
                <button
                  onClick={() => setSelectedType(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedType === null
                      ? "bg-gold-500 text-navy-950"
                      : "bg-navy-800 text-navy-300 hover:text-white hover:bg-navy-700"
                  }`}
                >
                  Todos
                </button>
                {RESOURCE_TYPES.map(type => {
                  const Icon = ICONS[type.id];
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                        selectedType === type.id
                          ? "text-navy-950"
                          : "bg-navy-800 text-navy-300 hover:text-white hover:bg-navy-700"
                      }`}
                      style={selectedType === type.id ? { backgroundColor: type.color } : {}}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {type.name}
                    </button>
                  );
                })}
              </div>

              {/* Filtro por preço */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-navy-400 mr-2">Preço:</span>
                <button
                  onClick={() => setSelectedPrice(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedPrice === null
                      ? "bg-gold-500 text-navy-950"
                      : "bg-navy-800 text-navy-300 hover:text-white hover:bg-navy-700"
                  }`}
                >
                  Todos
                </button>
                {["gratuito", "freemium", "pago"].map(price => (
                  <button
                    key={price}
                    onClick={() => setSelectedPrice(price)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedPrice === price
                        ? getPriceLabel(price).color.replace("/20", "").replace("text-", "bg-") + " text-navy-950"
                        : "bg-navy-800 text-navy-300 hover:text-white hover:bg-navy-700"
                    }`}
                  >
                    {getPriceLabel(price).label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Recursos */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            {filteredResources.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Wrench className="w-16 h-16 text-navy-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Nenhum recurso encontrado
                </h3>
                <p className="text-navy-400">
                  Tente buscar por outro termo ou limpe os filtros
                </p>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {Object.entries(groupedResources).map(([type, resources]) => {
                  const typeInfo = getTypeInfo(type);
                  const Icon = ICONS[type];

                  return (
                    <div key={type}>
                      {/* Header da seção */}
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className="p-2.5 rounded-xl"
                          style={{ backgroundColor: `${typeInfo?.color}20` }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: typeInfo?.color }}
                          />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{typeInfo?.name}</h2>
                          <p className="text-sm text-navy-400">{resources.length} recursos</p>
                        </div>
                      </div>

                      {/* Grid de recursos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource, index) => {
                          const priceInfo = getPriceLabel(resource.price);
                          const isInternal = 'internal' in resource && resource.internal;

                          const CardContent = (
                            <>
                              {/* Header */}
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {resource.featured && (
                                      <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                                    )}
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${priceInfo.color}`}>
                                      {isInternal ? "Investigaree" : priceInfo.label}
                                    </span>
                                  </div>
                                  <h3 className="text-white font-semibold group-hover:text-gold-400 transition-colors line-clamp-2">
                                    {resource.name}
                                  </h3>
                                </div>
                                {!isInternal && (
                                  <ExternalLink className="w-4 h-4 text-navy-500 group-hover:text-gold-500 flex-shrink-0 transition-colors" />
                                )}
                              </div>

                              {/* Descrição */}
                              <p className="text-navy-300 text-sm mb-4 line-clamp-2">
                                {resource.description}
                              </p>

                              {/* Footer */}
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-navy-500">
                                  {resource.provider}
                                </span>
                                {resource.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                                    <span className="text-sm text-gold-400 font-medium">
                                      {resource.rating}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gold-500/10">
                                {resource.tags.slice(0, 3).map(tag => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded bg-navy-800 text-navy-400 text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* CTA para cursos internos */}
                              {isInternal && (
                                <div className="mt-4 pt-3 border-t border-gold-500/10">
                                  <span className="inline-flex items-center gap-1.5 text-sm text-gold-400 font-medium">
                                    Solicitar informações
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </span>
                                </div>
                              )}
                            </>
                          );

                          // Se é um formulário de API, usar botão
                          const isFormResource = 'isForm' in resource && resource.isForm;

                          if (isFormResource) {
                            return (
                              <motion.button
                                key={resource.id}
                                onClick={(e) => handleApiClick(e, resource)}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`group block p-5 bg-navy-900/50 border rounded-xl transition-all hover:border-gold-500/50 h-full text-left w-full ${
                                  resource.featured ? "border-gold-500/30" : "border-gold-500/10"
                                }`}
                              >
                                {CardContent}
                              </motion.button>
                            );
                          }

                          if (isInternal) {
                            return (
                              <Link
                                key={resource.id}
                                href={resource.url}
                              >
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`group block p-5 bg-navy-900/50 border rounded-xl transition-all hover:border-gold-500/50 h-full ${
                                    resource.featured ? "border-gold-500/30" : "border-gold-500/10"
                                  }`}
                                >
                                  {CardContent}
                                </motion.div>
                              </Link>
                            );
                          }

                          return (
                            <motion.a
                              key={resource.id}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.05 }}
                              className={`group block p-5 bg-navy-900/50 border rounded-xl transition-all hover:border-gold-500/50 ${
                                resource.featured ? "border-gold-500/30" : "border-gold-500/10"
                              }`}
                            >
                              {CardContent}
                            </motion.a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-gold-500/10">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Conhece um recurso que deveria estar aqui?
              </h3>
              <p className="text-navy-300 mb-6">
                Envie sua sugestão e nossa equipe avaliará para inclusão no diretório.
                Priorizamos recursos úteis para investigação digital no Brasil.
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold rounded-xl transition-colors"
              >
                Sugerir recurso
                <ExternalLink className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
