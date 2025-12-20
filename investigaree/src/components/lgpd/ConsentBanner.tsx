'use client'

/**
 * LGPD Consent Banner
 *
 * Implementa conformidade com LGPD (Lei Geral de Proteção de Dados)
 * - Consentimento livre, informado e inequívoco
 * - Linguagem simples e clara
 * - Possibilidade de recusa
 * - Granularidade de consentimento
 * - Registro de consentimento no backend
 *
 * Baseado em:
 * - LGPD Compliance Checklist 2025
 * - Best practices consent management
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

import { useState } from 'react'
import CookieConsent from 'react-cookie-consent'
import { Shield, ChevronDown, ChevronUp } from 'lucide-react'

export function LGPDConsentBanner() {
  const [showDetails, setShowDetails] = useState(false)
  const [consentChoices, setConsentChoices] = useState({
    essenciais: true, // Sempre true (não pode ser desabilitado)
    analiticos: true,
    marketing: false,
  })

  /**
   * Registrar consentimento no backend
   * LGPD Art. 7 - Base legal para tratamento
   */
  const handleAccept = async () => {
    try {
      // "Aceitar Todos" = essenciais + analíticos + marketing
      const allConsent = {
        essenciais: true,
        analiticos: true,
        marketing: true,
      }

      // Salvar no localStorage para o GoogleAnalytics detectar
      localStorage.setItem('lgpd-consent-choices', JSON.stringify(allConsent))

      // Disparar evento customizado para o GoogleAnalytics re-verificar
      window.dispatchEvent(new Event('lgpd-consent-updated'))

      await fetch('/api/lgpd/registrar-consentimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentimento: true,
          finalidades: ['essenciais', 'analiticos', 'marketing'],
          timestamp: new Date().toISOString(),
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error('Erro ao registrar consentimento:', error)
    }
  }

  /**
   * Registrar recusa de consentimento
   * LGPD Art. 18, § 5º - Direito de revogar
   */
  const handleDecline = async () => {
    try {
      // "Apenas Essenciais" = somente essenciais
      const essentialOnlyConsent = {
        essenciais: true,
        analiticos: false,
        marketing: false,
      }

      // Salvar no localStorage
      localStorage.setItem('lgpd-consent-choices', JSON.stringify(essentialOnlyConsent))

      // Disparar evento customizado
      window.dispatchEvent(new Event('lgpd-consent-updated'))

      await fetch('/api/lgpd/registrar-consentimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentimento: false,
          finalidades: ['essenciais'], // Apenas essenciais
          timestamp: new Date().toISOString(),
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error('Erro ao registrar recusa:', error)
    }
  }

  /**
   * Aceitar apenas escolhas personalizadas
   */
  const handleCustomAccept = async () => {
    try {
      // Salvar no localStorage para o GoogleAnalytics detectar
      localStorage.setItem('lgpd-consent-choices', JSON.stringify(consentChoices))

      // Disparar evento customizado para o GoogleAnalytics re-verificar
      window.dispatchEvent(new Event('lgpd-consent-updated'))

      await fetch('/api/lgpd/registrar-consentimento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentimento: true,
          finalidades: Object.entries(consentChoices)
            .filter(([_, value]) => value)
            .map(([key]) => key),
          timestamp: new Date().toISOString(),
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent,
          granular: true,
        }),
      })
    } catch (error) {
      console.error('Erro ao registrar consentimento personalizado:', error)
    }
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText="Aceitar Todos"
      declineButtonText="Apenas Essenciais"
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      cookieName="lgpd_consent"
      expires={365}
      overlay
      overlayStyle={{
        background: 'rgba(0, 0, 0, 0.5)',
      }}
      style={{
        background: 'rgba(15, 23, 42, 0.98)', // slate-900
        backdropFilter: 'blur(10px)',
        padding: '24px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        display: 'flex',
        alignItems: 'start',
        gap: '16px',
        maxWidth: '100%',
      }}
      buttonStyle={{
        background: '#22c55e',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        borderRadius: '8px',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#94a3b8',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '8px',
        padding: '10px 20px',
        border: '1px solid #475569',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      containerClasses="lgpd-consent-container"
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Icon */}
        <div className="flex-shrink-0 p-2 bg-blue-500/10 rounded-lg">
          <Shield className="w-6 h-6 text-blue-400" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-2">
            Privacidade e Proteção de Dados (LGPD)
          </h3>
          <p className="text-slate-300 text-sm mb-3">
            Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para
            melhorar sua experiência. Você pode escolher quais tipos de cookies deseja aceitar.
          </p>

          {/* Toggle Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mb-3"
          >
            {showDetails ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Ocultar detalhes
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Ver detalhes e gerenciar preferências
              </>
            )}
          </button>

          {/* Detailed Options */}
          {showDetails && (
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-4 mb-4">
              {/* Essenciais */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={consentChoices.essenciais}
                  disabled
                  className="mt-1 w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50"
                />
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-1">
                    Cookies Essenciais (Obrigatórios)
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Necessários para autenticação, segurança e funcionamento básico do site.
                    Não podem ser desabilitados.
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Exemplos: sessão de login, preferências de idioma, proteção CSRF
                  </p>
                </div>
              </div>

              {/* Analíticos */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={consentChoices.analiticos}
                  onChange={(e) =>
                    setConsentChoices({ ...consentChoices, analiticos: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-1">
                    Cookies Analíticos (Opcional)
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Nos ajudam a entender como você usa o site para melhorar a experiência.
                    Dados anonimizados.
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Exemplos: Google Analytics, tempo de permanência, páginas visitadas
                  </p>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={consentChoices.marketing}
                  onChange={(e) =>
                    setConsentChoices({ ...consentChoices, marketing: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-1">
                    Cookies de Marketing (Opcional)
                  </h4>
                  <p className="text-slate-400 text-xs">
                    Utilizados para personalizar anúncios e medir eficácia de campanhas.
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Exemplos: Google Ads, Facebook Pixel, remarketing
                  </p>
                </div>
              </div>

              {/* LGPD Rights */}
              <div className="border-t border-slate-700 pt-3 mt-3">
                <h4 className="text-white font-semibold text-xs mb-2">
                  Seus Direitos (LGPD - Lei 13.709/2018)
                </h4>
                <ul className="text-slate-400 text-xs space-y-1">
                  <li>
                    • <strong className="text-slate-300">Acesso:</strong> Consultar seus dados a qualquer momento
                  </li>
                  <li>
                    • <strong className="text-slate-300">Correção:</strong> Solicitar retificação de dados incorretos
                  </li>
                  <li>
                    • <strong className="text-slate-300">Exclusão:</strong> Solicitar eliminação de dados pessoais
                  </li>
                  <li>
                    • <strong className="text-slate-300">Portabilidade:</strong> Exportar seus dados em formato estruturado
                  </li>
                  <li>
                    • <strong className="text-slate-300">Revogação:</strong> Retirar consentimento a qualquer momento
                  </li>
                </ul>
                <a
                  href="/dashboard/lgpd"
                  className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  Gerenciar meus dados (LGPD) →
                </a>
              </div>

              {/* Custom Accept Button */}
              <div className="pt-3">
                <button
                  onClick={() => {
                    handleCustomAccept()
                    // Force cookie consent library to close
                    const acceptBtn = document.querySelector('[id="rcc-confirm-button"]') as HTMLElement
                    acceptBtn?.click()
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4 rounded-lg transition-colors"
                >
                  Salvar Minhas Preferências
                </button>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3 text-xs">
            <a
              href="/privacidade"
              className="text-slate-400 hover:text-slate-300 underline transition-colors"
            >
              Política de Privacidade
            </a>
            <a
              href="/cookies"
              className="text-slate-400 hover:text-slate-300 underline transition-colors"
            >
              Política de Cookies
            </a>
            <a
              href="/termos"
              className="text-slate-400 hover:text-slate-300 underline transition-colors"
            >
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </CookieConsent>
  )
}

/**
 * Helper para obter IP do cliente (aproximado)
 */
async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch {
    return 'unknown'
  }
}
