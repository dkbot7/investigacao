"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<"pt" | "en">("pt");

  // Handle scroll for sticky header with blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "pt" ? "en" : "pt");
  };

  const menuItems = {
    pt: {
      home: "Home",
      services: "Serviços",
      about: "Quem Somos",
      contact: "Contato",
      theme: "Tema",
      language: "Idioma"
    },
    en: {
      home: "Home",
      services: "Services",
      about: "About",
      contact: "Contact",
      theme: "Theme",
      language: "Language"
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
              { label: t.home, href: "#home" },
              { label: t.services, href: "#servicos" },
              { label: t.about, href: "#quem-somos" },
              { label: t.contact, href: "#contato" }
            ].map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="relative text-white/90 hover:text-white font-medium text-[15px] transition-all duration-200 group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -2 }}
              >
                {item.label}
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] bg-gold-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </motion.div>

          {/* Theme & Language Toggles */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-white/80 hover:text-white hover:bg-white/5 transition-all"
                title={theme === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"}
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="ml-2 hidden sm:inline text-sm">{t.theme}</span>
              </Button>
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
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
}
