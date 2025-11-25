"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Settings, Check } from "lucide-react";
import Link from "next/link";

type CookiePreferences = {
  essential: boolean;
  analytics: boolean;
  functionality: boolean;
};

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_PREFERENCES_KEY = "cookie_preferences";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Sempre ativo
    analytics: false,
    functionality: false,
  });

  useEffect(() => {
    // Verificar se já existe consentimento
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Mostrar banner após 1 segundo
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Carregar preferências salvas
      const saved = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, new Date().toISOString());
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);
  };

  const acceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      functionality: true,
    });
  };

  const rejectNonEssential = () => {
    saveConsent({
      essential: true,
      analytics: false,
      functionality: false,
    });
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
      >
        <div className="max-w-4xl mx-auto bg-navy-900 rounded-2xl shadow-2xl border border-navy-700 overflow-hidden">
          {/* Header */}
          <div className="p-4 md:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 id="cookie-banner-title" className="text-lg font-semibold text-white mb-2">
                  Utilizamos cookies
                </h3>
                <p id="cookie-banner-description" className="text-sm text-white/70 leading-relaxed">
                  Usamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo.
                  Ao clicar em &quot;Aceitar todos&quot;, você concorda com o uso de cookies conforme descrito em nossa{" "}
                  <Link href="/cookies" className="text-primary-400 hover:underline">
                    Política de Cookies
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-navy-700"
                >
                  <div className="space-y-4">
                    {/* Essential Cookies */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Cookies Essenciais</p>
                        <p className="text-xs text-white/60">Necessários para o funcionamento do site</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40">Sempre ativo</span>
                        <div className="w-10 h-6 bg-primary-500 rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Cookies de Desempenho</p>
                        <p className="text-xs text-white/60">Ajudam a entender como você usa o site</p>
                      </div>
                      <button
                        onClick={() => setPreferences((p) => ({ ...p, analytics: !p.analytics }))}
                        role="switch"
                        aria-checked={preferences.analytics}
                        aria-label="Cookies de Desempenho"
                        className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.analytics ? "bg-primary-500 justify-end" : "bg-navy-700 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>

                    {/* Functionality Cookies */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Cookies de Funcionalidade</p>
                        <p className="text-xs text-white/60">Lembram suas preferências e personalização</p>
                      </div>
                      <button
                        onClick={() => setPreferences((p) => ({ ...p, functionality: !p.functionality }))}
                        role="switch"
                        aria-checked={preferences.functionality}
                        aria-label="Cookies de Funcionalidade"
                        className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                          preferences.functionality ? "bg-primary-500 justify-end" : "bg-navy-700 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="p-4 md:px-6 md:pb-6 bg-navy-800/50 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {showSettings ? "Ocultar opções" : "Personalizar"}
            </button>

            <div className="flex-1" />

            <button
              onClick={rejectNonEssential}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white border border-navy-600 rounded-lg transition-colors"
            >
              Rejeitar não essenciais
            </button>

            {showSettings ? (
              <button
                onClick={saveCustomPreferences}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Salvar preferências
              </button>
            ) : (
              <button
                onClick={acceptAll}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Aceitar todos
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
