"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie, X, Settings, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = "investigaree_cookie_consent";
const COOKIE_PREFERENCES_KEY = "investigaree_cookie_preferences";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Sempre ativo
    functional: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Verificar se já existe consentimento
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Pequeno delay para não aparecer imediatamente
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Carregar preferências salvas
      const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    }
  }, []);

  const saveConsent = (accepted: boolean, prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? "accepted" : "rejected");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setIsVisible(false);

    // Aqui você pode inicializar scripts de analytics/marketing baseado nas preferências
    if (prefs.analytics) {
      // Inicializar Google Analytics, etc.
    }
    if (prefs.marketing) {
      // Inicializar pixels de marketing, etc.
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setPreferences(allAccepted);
    saveConsent(true, allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setPreferences(onlyNecessary);
    saveConsent(false, onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(true, preferences);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Não pode desativar cookies necessários
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieCategories = [
    {
      id: "necessary" as const,
      name: "Estritamente Necessários",
      description: "Essenciais para o funcionamento do site. Não podem ser desativados.",
      required: true
    },
    {
      id: "functional" as const,
      name: "Funcionais",
      description: "Permitem funcionalidades como preferências de idioma e tema, login persistente e personalização."
    },
    {
      id: "analytics" as const,
      name: "Estatísticos",
      description: "Nos ajudam a entender como os visitantes interagem com o site, permitindo melhorias contínuas."
    },
    {
      id: "marketing" as const,
      name: "Marketing",
      description: "Usados para rastrear visitantes em websites e exibir anúncios relevantes."
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white dark:bg-navy-900 border border-green-500/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-green-500/10">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-green-500/10 flex-shrink-0">
                  <Cookie className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Gerenciar Consentimento de Cookies
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-navy-300 leading-relaxed">
                    Utilizamos cookies e tecnologias similares para melhorar sua experiência,
                    analisar o tráfego e personalizar conteúdo. Em conformidade com a{" "}
                    <strong className="text-slate-900 dark:text-white">LGPD (Lei Geral de Proteção de Dados)</strong>,
                    você pode gerenciar suas preferências abaixo.
                  </p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 text-slate-500 dark:text-navy-400 hover:text-slate-900 dark:text-white transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Detalhes das categorias (expandível) */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 md:p-6 border-b border-green-500/10 bg-slate-50 dark:bg-navy-950/50">
                    <div className="space-y-4">
                      {cookieCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-white/50 dark:bg-navy-900/50 border border-green-500/5"
                        >
                          {/* Toggle */}
                          <button
                            onClick={() => togglePreference(category.id)}
                            disabled={category.required}
                            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${
                              preferences[category.id]
                                ? "bg-green-500"
                                : "bg-navy-700"
                            } ${category.required ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                preferences[category.id] ? "left-7" : "left-1"
                              }`}
                            />
                          </button>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-slate-900 dark:text-white">{category.name}</h4>
                              {category.required && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-700 text-slate-600 dark:text-navy-300">
                                  Sempre ativo
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-navy-400">{category.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Links para políticas */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-green-500/10 text-sm">
                      <Link
                        href="/privacidade"
                        className="text-green-500 hover:text-green-400 transition-colors"
                      >
                        Política de Privacidade
                      </Link>
                      <Link
                        href="/cookies"
                        className="text-green-500 hover:text-green-400 transition-colors"
                      >
                        Política de Cookies
                      </Link>
                      <Link
                        href="/termos"
                        className="text-green-500 hover:text-green-400 transition-colors"
                      >
                        Termos de Uso
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ações */}
            <div className="p-5 md:p-6 bg-slate-50 dark:bg-navy-950/30">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Botão de configurações */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-navy-300 hover:text-slate-900 dark:text-white transition-colors order-2 sm:order-1"
                >
                  <Settings className="w-4 h-4" />
                  {showDetails ? "Ocultar configurações" : "Configurar preferências"}
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Botões de ação */}
                <div className="flex gap-3 ml-auto order-1 sm:order-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleRejectAll}
                    className="flex-1 sm:flex-none border-navy-600 text-slate-600 dark:text-navy-300 hover:bg-slate-100 dark:bg-navy-800 hover:text-slate-900 dark:text-white"
                  >
                    Rejeitar todos
                  </Button>

                  {showDetails ? (
                    <Button
                      onClick={handleSavePreferences}
                      className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-navy-950"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Salvar preferências
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAcceptAll}
                      className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-navy-950"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Aceitar todos
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

