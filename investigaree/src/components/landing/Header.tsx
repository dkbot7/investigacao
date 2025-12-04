"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Menu, X, ChevronDown, BookOpen, Layers, Wrench, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState<"pt" | "en">("pt");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isConteudoOpen, setIsConteudoOpen] = useState(false);
  const conteudoRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (conteudoRef.current && !conteudoRef.current.contains(event.target as Node)) {
        setIsConteudoOpen(false);
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
      services: "Serviços",
      about: "Quem Somos",
      content: "Conteúdo",
      blog: "Blog",
      series: "Séries",
      glossary: "Glossário",
      resources: "Recursos",
      contact: "Contato",
      theme: "Tema",
      language: "Idioma",
      login: "Entrar",
      signup: "Criar Conta"
    },
    en: {
      home: "Home",
      services: "Services",
      about: "About",
      content: "Content",
      blog: "Blog",
      series: "Series",
      glossary: "Glossary",
      resources: "Resources",
      contact: "Contact",
      theme: "Theme",
      language: "Language",
      login: "Login",
      signup: "Sign Up"
    }
  };

  const t = menuItems[language];

  // Submenu items for Conteúdo dropdown
  const conteudoItems = [
    { label: t.blog, href: "/blog", icon: FileText, description: language === "pt" ? "Artigos e tutoriais" : "Articles and tutorials" },
    { label: t.series, href: "/series", icon: Layers, description: language === "pt" ? "Conteúdo em série" : "Serial content" },
    { label: t.glossary, href: "/glossario", icon: BookOpen, description: language === "pt" ? "Termos técnicos" : "Technical terms" },
    { label: t.resources, href: "/recursos", icon: Wrench, description: language === "pt" ? "Ferramentas e cursos" : "Tools and courses" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-navy-950/80 backdrop-blur-lg shadow-lg border-b border-gold-500/10"
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
                className="absolute inset-0 bg-gold-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />

              {/* Logo image */}
              <motion.div
                className="relative z-10"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/favicon.svg"
                  alt="investigaree logo"
                  width={36}
                  height={36}
                  className="w-9 h-9"
                  priority
                />
              </motion.div>

              {/* Text logo */}
              <motion.span
                className="text-2xl font-bold relative z-10"
                style={{
                  background: "linear-gradient(135deg, #FFFFFF 0%, #9FB3C8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
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
            {[
              { label: t.home, href: "/" },
              { label: t.services, href: "/servicos" },
              { label: t.about, href: "/quemsomos" },
            ].map((item, index) => (
              <motion.div key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-white/90 hover:text-white font-medium text-[15px] transition-all duration-200 group inline-block"
                >
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    whileHover={{ y: -2 }}
                    className="relative block"
                  >
                    {item.label}
                    <motion.span
                      className="absolute bottom-0 left-0 h-[2px] bg-gold-500"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.span>
                </Link>
              </motion.div>
            ))}

            {/* Conteúdo Dropdown */}
            <div ref={conteudoRef} className="relative">
              <motion.button
                onClick={() => setIsConteudoOpen(!isConteudoOpen)}
                className="relative text-white/90 hover:text-white font-medium text-[15px] transition-all duration-200 group inline-flex items-center gap-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <span>{t.content}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isConteudoOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {isConteudoOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-navy-900/95 backdrop-blur-lg border border-gold-500/20 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="p-2">
                      {conteudoItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsConteudoOpen(false)}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                          >
                            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-500 group-hover:bg-gold-500/20 transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-white font-medium text-sm">{item.label}</div>
                              <div className="text-navy-400 text-xs">{item.description}</div>
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
                className="relative text-white/90 hover:text-white font-medium text-[15px] transition-all duration-200 group inline-block"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                  className="relative block"
                >
                  {t.contact}
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] bg-gold-500"
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
                className="text-white/80 hover:text-white hover:bg-white/5 transition-all"
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
                className="text-white/90 hover:text-white hover:bg-white/10 transition-all font-medium"
                onClick={() => setIsLoginModalOpen(true)}
              >
                {t.login}
              </Button>
            </motion.div>

            {/* Sign Up Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold transition-all"
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
              className="text-white/80 hover:text-white hover:bg-white/5 transition-all"
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
              className="fixed inset-0 bg-navy-950/95 backdrop-blur-lg z-40 md:hidden"
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
                  {[
                    { label: t.home, href: "/" },
                    { label: t.services, href: "/servicos" },
                    { label: t.about, href: "/quemsomos" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="block text-white text-2xl font-semibold py-4 px-6 rounded-lg hover:bg-white/5 transition-all border-b border-gold-500/10"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Conteúdo Section - Mobile */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="pt-2"
                  >
                    <div className="text-gold-500 text-sm font-medium uppercase tracking-wider px-6 py-2">
                      {t.content}
                    </div>
                    <div className="space-y-1">
                      {conteudoItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 text-white text-xl font-medium py-3 px-6 rounded-lg hover:bg-white/5 transition-all"
                          >
                            <Icon className="w-5 h-5 text-gold-500" />
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
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="pt-2"
                  >
                    <Link
                      href="/contato"
                      onClick={closeMobileMenu}
                      className="block text-white text-2xl font-semibold py-4 px-6 rounded-lg hover:bg-white/5 transition-all border-t border-gold-500/10"
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
                  transition={{ delay: 0.35, duration: 0.3 }}
                >
                  <Button
                    variant="outline"
                    className="w-full text-white border-gold-500/50 hover:bg-gold-500/10 hover:border-gold-500 font-medium py-6 text-lg"
                    onClick={() => {
                      closeMobileMenu();
                      setIsLoginModalOpen(true);
                    }}
                  >
                    {t.login}
                  </Button>
                  <Button
                    className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold py-6 text-lg"
                    onClick={() => {
                      closeMobileMenu();
                      setIsRegisterModalOpen(true);
                    }}
                  >
                    {t.signup}
                  </Button>
                </motion.div>

                {/* Theme & Language Controls */}
                <motion.div
                  className="space-y-4 px-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between py-4 border-b border-gold-500/10">
                    <span className="text-white/80 font-medium">{t.theme}</span>
                    <ModeToggle />
                  </div>

                  {/* Language Toggle */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-white/80 font-medium">{t.language}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLanguage}
                      className="text-white/80 hover:text-white hover:bg-white/5"
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
