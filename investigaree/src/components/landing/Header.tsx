"use client";

import { useState, useEffect } from "react";
import { Globe, Menu, X } from "lucide-react";
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
      contact: "Contact",
      theme: "Theme",
      language: "Language",
      login: "Login",
      signup: "Sign Up"
    }
  };

  const t = menuItems[language];

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
              { label: t.contact, href: "/contato" }
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
                    { label: t.contact, href: "/contato" }
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
