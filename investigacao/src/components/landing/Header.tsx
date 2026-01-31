"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Menu, X, ChevronDown, BookOpen, Layers, Wrench, FileText, Scale, Briefcase, Shield, Users, TrendingUp, Heart, Building2, ShieldAlert, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState<"pt" | "en">("pt");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isConteudoOpen, setIsConteudoOpen] = useState(false);
  const [isSolucoesOpen, setIsSolucoesOpen] = useState(false);
  const conteudoRef = useRef<HTMLDivElement>(null);
  const solucoesRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (conteudoRef.current && !conteudoRef.current.contains(event.target as Node)) {
        setIsConteudoOpen(false);
      }
      if (solucoesRef.current && !solucoesRef.current.contains(event.target as Node)) {
        setIsSolucoesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll for sticky header with blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "pt" ? "en" : "pt");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const menuItems = {
    pt: {
      home: "Home",
      solutions: "Soluções",
      services: "Serviços",
      about: "Quem Somos",
      content: "Conteúdo",
      resources: "Recursos",
      blog: "Blog",
      series: "Séries",
      glossary: "Glossário",
      metodologia: "Metodologias",
      cases: "Cases",
      contact: "Contato",
      theme: "Tema",
      language: "Idioma",
      login: "Entrar",
      signup: "Criar Investigação"
    },
    en: {
      home: "Home",
      solutions: "Solutions",
      services: "Services",
      about: "About",
      content: "Content",
      resources: "Resources",
      blog: "Blog",
      series: "Series",
      glossary: "Glossary",
      metodologia: "Methodologies",
      cases: "Cases",
      contact: "Contact",
      theme: "Theme",
      language: "Language",
      login: "Login",
      signup: "Create Investigation"
    }
  };

  const t = menuItems[language];

  // Submenu items for Soluções dropdown (mega menu with 3 columns)
  const solucoesItems = {
    empresas: [
      {
        label: language === "pt" ? "RH & Compliance" : "HR & Compliance",
        href: "/solucoes/rh-compliance",
        icon: Users,
        description: language === "pt" ? "Background check profissional" : "Professional background check"
      },
      {
        label: language === "pt" ? "Due Diligence" : "Due Diligence",
        href: "/solucoes/due-diligence",
        icon: TrendingUp,
        description: language === "pt" ? "M&A e investimentos" : "M&A and investments"
      },
      {
        label: language === "pt" ? "Advogados" : "Lawyers",
        href: "/solucoes/coleta-provas-digitais",
        icon: Scale,
        description: language === "pt" ? "Provas digitais forenses" : "Forensic digital evidence"
      },
    ],
    pessoas: [
      {
        label: language === "pt" ? "Proteção & Remoção" : "Protection & Removal",
        href: "/solucoes/protecao-remocao",
        icon: ShieldAlert,
        description: language === "pt" ? "Privacidade LGPD" : "LGPD Privacy"
      },
      {
        label: language === "pt" ? "Divórcio & Família" : "Divorce & Family",
        href: "/solucoes/due-diligence-divorcios",
        icon: Heart,
        description: language === "pt" ? "Patrimônio oculto" : "Hidden assets"
      },
    ],
    governo: [
      {
        label: language === "pt" ? "Auditoria Licitações" : "Tender Auditing",
        href: "/solucoes/auditoria-licitacoes",
        icon: Building2,
        description: language === "pt" ? "Compliance governamental" : "Government compliance"
      },
    ]
  };

  // Submenu items for Conteúdo dropdown
  const conteudoItems = [
    { label: t.series, href: "/series", icon: Layers, description: language === "pt" ? "Conteúdo em série" : "Serial content" },
    { label: t.glossary, href: "/glossario", icon: BookOpen, description: language === "pt" ? "Termos técnicos" : "Technical terms" },
    { label: t.resources, href: "/recursos", icon: Wrench, description: language === "pt" ? "Ferramentas e cursos" : "Tools and courses" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-50 dark:bg-navy-950/80 backdrop-blur-lg shadow-lg border-b border-green-500/10"
          : "bg-transparent"
      }`}
      style={{ height: "72px" }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 h-full">
        <nav className="flex items-center justify-between h-full">
          {/* Logo com animação e glow effect */}
          <motion.div
            className="flex-shrink-0 relative group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="flex items-center gap-3 relative">
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-green-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />

              {/* Logo icon */}
              <motion.div
                className="relative z-10"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/favicon.svg"
                  alt="investigaree logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </motion.div>

              {/* Text logo */}
              <motion.span
                className="text-2xl font-bold text-slate-900 dark:text-white relative z-10"
                whileHover={{ scale: 1.02 }}
              >
                investigaree
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Menu Items */}
          <motion.div
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Home */}
            <motion.div>
              <Link
                href="/"
                className="relative text-slate-900 dark:text-white/90 hover:text-green-600 dark:hover:text-white font-medium text-[15px] transition-all duration-200 group inline-block"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                  className="relative block"
                >
                  {t.home}
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] bg-green-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.span>
              </Link>
            </motion.div>

            {/* Soluções Dropdown (Mega Menu) */}
            <div ref={solucoesRef} className="relative">
              <motion.button
                onClick={() => setIsSolucoesOpen(!isSolucoesOpen)}
                className="relative text-slate-900 dark:text-white/90 hover:text-green-600 dark:hover:text-white font-medium text-[15px] transition-all duration-200 group inline-flex items-center gap-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <span>{t.solutions}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSolucoesOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {isSolucoesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[700px] bg-white dark:bg-navy-900/95 backdrop-blur-lg border border-green-500/20 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="p-6">
                      {/* 3-Column Mega Menu */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Column 1: EMPRESAS */}
                        <div>
                          <h3 className="text-green-500 text-xs font-bold uppercase tracking-wider mb-3">
                            {language === "pt" ? "EMPRESAS" : "BUSINESS"}
                          </h3>
                          <div className="space-y-1">
                            {solucoesItems.empresas.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsSolucoesOpen(false)}
                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                                >
                                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-colors flex-shrink-0">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-slate-900 dark:text-white font-medium text-sm">{item.label}</div>
                                    <div className="text-slate-500 dark:text-navy-300 text-xs">{item.description}</div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Column 2: PESSOAS FÍSICAS */}
                        <div>
                          <h3 className="text-green-500 text-xs font-bold uppercase tracking-wider mb-3">
                            {language === "pt" ? "PESSOAS FÍSICAS" : "INDIVIDUALS"}
                          </h3>
                          <div className="space-y-1">
                            {solucoesItems.pessoas.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsSolucoesOpen(false)}
                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                                >
                                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-colors flex-shrink-0">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-slate-900 dark:text-white font-medium text-sm">{item.label}</div>
                                    <div className="text-slate-500 dark:text-navy-300 text-xs">{item.description}</div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Column 3: GOVERNO */}
                        <div>
                          <h3 className="text-green-500 text-xs font-bold uppercase tracking-wider mb-3">
                            {language === "pt" ? "GOVERNO" : "GOVERNMENT"}
                          </h3>
                          <div className="space-y-1">
                            {solucoesItems.governo.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsSolucoesOpen(false)}
                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                                >
                                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-colors flex-shrink-0">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-slate-900 dark:text-white font-medium text-sm">{item.label}</div>
                                    <div className="text-slate-500 dark:text-navy-300 text-xs">{item.description}</div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Footer Link - Ver Todas */}
                      <div className="mt-4 pt-4 border-t border-green-500/20">
                        <Link
                          href="/solucoes"
                          onClick={() => setIsSolucoesOpen(false)}
                          className="block text-center text-green-600 dark:text-green-400 font-medium text-sm hover:text-green-700 dark:hover:text-green-300 transition-colors"
                        >
                          {language === "pt" ? "Ver Todas as Soluções →" : "View All Solutions →"}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Services, Blog & About */}
            {[
              { label: t.services, href: "/servicos" },
              { label: t.blog, href: "/blog" },
              { label: t.about, href: "/quemsomos" },
            ].map((item, index) => (
              <motion.div key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-slate-900 dark:text-white/90 hover:text-green-600 dark:hover:text-white font-medium text-[15px] transition-all duration-200 group inline-block"
                >
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    whileHover={{ y: -2 }}
                    className="relative block"
                  >
                    {item.label}
                    <motion.span
                      className="absolute bottom-0 left-0 h-[2px] bg-green-500"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.span>
                </Link>
              </motion.div>
            ))}

            {/* Recursos Dropdown */}
            <div ref={conteudoRef} className="relative">
              <motion.button
                onClick={() => setIsConteudoOpen(!isConteudoOpen)}
                className="relative text-slate-900 dark:text-white/90 hover:text-green-600 dark:hover:text-white font-medium text-[15px] transition-all duration-200 group inline-flex items-center gap-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                <span>{t.resources}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isConteudoOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {isConteudoOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white dark:bg-navy-900/95 backdrop-blur-lg border border-green-500/20 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="p-2">
                      {conteudoItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsConteudoOpen(false)}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                          >
                            <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-slate-900 dark:text-white font-medium text-sm">{item.label}</div>
                              <div className="text-slate-500 dark:text-navy-300 text-xs">{item.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contato */}
            <motion.div>
              <Link
                href="/contato"
                className="relative text-slate-900 dark:text-white/90 hover:text-green-600 dark:hover:text-white font-medium text-[15px] transition-all duration-200 group inline-block"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                  className="relative block"
                >
                  {t.contact}
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] bg-green-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Theme, Language & Auth Buttons - Desktop */}
          <motion.div
            className="hidden md:flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ModeToggle />
            </motion.div>

            {/* Language Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-slate-900 dark:text-white/80 hover:text-green-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                title={language === "pt" ? "Change language" : "Mudar idioma"}
              >
                <Globe className="w-4 h-4" />
                <span className="ml-2 text-sm font-medium">
                  {language === "pt" ? "PT 🇧🇷" : "EN 🇺🇸"}
                </span>
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="h-6 w-px bg-white/20" />

            {/* Login Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-900 dark:text-white/90 hover:text-green-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-medium"
                onClick={() => setIsLoginModalOpen(true)}
              >
                {t.login}
              </Button>
            </motion.div>

            {/* Sign Up Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-navy-950 font-semibold transition-all"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                {t.signup}
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile Hamburger Menu Button */}
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-900 dark:text-white/80 hover:text-green-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              aria-label="Menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-slate-50 dark:bg-navy-950/95 backdrop-blur-lg z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Content */}
            <motion.div
              className="fixed top-[72px] left-0 right-0 bottom-0 z-50 md:hidden overflow-y-auto"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="container mx-auto px-4 py-8">
                {/* Navigation Links */}
                <nav className="space-y-2 mb-8">
                  {/* Home */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0, duration: 0.3 }}
                  >
                    <Link
                      href="/"
                      onClick={closeMobileMenu}
                      className="block text-slate-900 dark:text-white text-2xl font-semibold py-4 px-6 rounded-lg hover:bg-white/5 transition-all border-b border-green-500/10"
                    >
                      {t.home}
                    </Link>
                  </motion.div>

                  {/* Soluções Section - Mobile */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="pt-2"
                  >
                    <div className="text-green-500 text-sm font-medium uppercase tracking-wider px-6 py-2">
                      {t.solutions}
                    </div>

                    {/* Empresas */}
                    <div className="px-4 mb-2">
                      <div className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase px-2 py-1">
                        {language === "pt" ? "Empresas" : "Business"}
                      </div>
                      <div className="space-y-1">
                        {solucoesItems.empresas.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="flex items-center gap-3 text-slate-900 dark:text-white text-lg font-medium py-2 px-2 rounded-lg hover:bg-white/5 transition-all"
                            >
                              <Icon className="w-5 h-5 text-green-500" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pessoas */}
                    <div className="px-4 mb-2">
                      <div className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase px-2 py-1">
                        {language === "pt" ? "Pessoas Físicas" : "Individuals"}
                      </div>
                      <div className="space-y-1">
                        {solucoesItems.pessoas.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="flex items-center gap-3 text-slate-900 dark:text-white text-lg font-medium py-2 px-2 rounded-lg hover:bg-white/5 transition-all"
                            >
                              <Icon className="w-5 h-5 text-green-500" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Governo */}
                    <div className="px-4">
                      <div className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase px-2 py-1">
                        {language === "pt" ? "Governo" : "Government"}
                      </div>
                      <div className="space-y-1">
                        {solucoesItems.governo.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="flex items-center gap-3 text-slate-900 dark:text-white text-lg font-medium py-2 px-2 rounded-lg hover:bg-white/5 transition-all"
                            >
                              <Icon className="w-5 h-5 text-green-500" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* Services, Blog & About */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Link
                      href="/servicos"
                      onClick={closeMobileMenu}
                      className="block text-slate-900 dark:text-white text-2xl font-semibold py-4 px-6 rounded-lg hover:bg-white/5 transition-all border-b border-green-500/10"
                    >
                      {t.services}
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.22, duration: 0.3 }}
                  >
                    <Link
                      href="/blog"
                      onClick={closeMobileMenu}
                      className="block text-slate-900 dark:text-white text-2xl font-semibold py-4 px-6 rounded-lg hover:bg-white/5 transition-all border-b border-green-500/10"
                    >
                      {t.blog}
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                  >
                    <Link
                      href="/quemsomos"
                      onClick={closeMobileMenu}
                      className="block text-slate-900 dark:text-white text-2xl font-semibold py-4 px-6 rounded-lg hover:bg-white/5 transition-all border-b border-green-500/10"
                    >
                      {t.about}
                    </Link>
                  </motion.div>

                  {/* Recursos Section - Mobile */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="pt-2"
                  >
                    <div className="text-green-500 text-sm font-medium uppercase tracking-wider px-6 py-2">
                      {t.resources}
                    </div>
                    <div className="space-y-1">
                      {conteudoItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 text-slate-900 dark:text-white text-xl font-medium py-3 px-6 rounded-lg hover:bg-white/5 transition-all"
                          >
                            <Icon className="w-5 h-5 text-green-500" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Contato */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="pt-2"
                  >
                    <Link
                      href="/contato"
                      onClick={closeMobileMenu}
                      className="block text-slate-900 dark:text-white text-2xl font-semibold py-4 px-6 rounded-lg hover:bg-white/5 transition-all border-t border-green-500/10"
                    >
                      {t.contact}
                    </Link>
                  </motion.div>
                </nav>

                {/* Auth Buttons - Mobile */}
                <motion.div
                  className="flex flex-col gap-3 px-6 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Button
                    variant="outline"
                    className="w-full text-slate-900 dark:text-white border-green-500/50 hover:bg-green-500/10 hover:border-green-500 font-medium py-6 text-lg"
                    onClick={() => {
                      closeMobileMenu();
                      setIsLoginModalOpen(true);
                    }}
                  >
                    {t.login}
                  </Button>
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-navy-950 font-semibold py-6 text-lg"
                    onClick={() => {
                      closeMobileMenu();
                      setIsRegisterModalOpen(true);
                    }}
                  >
                    {t.signup}
                  </Button>
                </motion.div>

                {/* Theme & Language Control */}
                <motion.div
                  className="space-y-4 px-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between py-4 border-b border-green-500/10">
                    <span className="text-slate-900 dark:text-white/80 font-medium">{t.theme}</span>
                    <ModeToggle />
                  </div>

                  {/* Language Toggle */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-slate-900 dark:text-white/80 font-medium">{t.language}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLanguage}
                      className="text-slate-900 dark:text-white/80 hover:text-green-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <Globe className="w-5 h-5 mr-2" />
                      <span className="font-medium">
                        {language === "pt" ? "PT 🇧🇷" : "EN 🇺🇸"}
                      </span>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </motion.header>
  );
}
