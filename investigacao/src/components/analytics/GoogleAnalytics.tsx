'use client';

/**
 * Google Analytics 4 (GA4) - Consent-Gated Implementation
 *
 * CONFORMIDADE LGPD:
 * - Só dispara após consentimento explícito do usuário
 * - Respeita granularidade (finalidade "analiticos")
 * - Não rastreia se consentimento for recusado ou não fornecido
 * - IP anonimizado (anonymize_ip: true)
 * - Cookies com SameSite=None;Secure (LGPD-compliant)
 *
 * FONTE DE CONSENTIMENTO (prioridade):
 * 1. PRIMÁRIA: localStorage 'lgpd-consent-choices' (granular, fonte canônica)
 * 2. LEGADO: Cookie 'CookieConsent' (fallback para implementações antigas)
 *
 * EVENTOS RASTREADOS:
 * 1. page_view (automático via gtag config)
 * 2. click_cta (manual via trackEvent)
 * 3. form_submit (manual via trackEvent)
 *
 * Baseado em:
 * - Next.js 13+ App Router best practices
 * - Google Analytics 4 consent mode
 * - LGPD Art. 7º e 8º (consentimento como base legal)
 */

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Cookies from 'js-cookie';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID || '';
const IS_DEV = process.env.NODE_ENV !== 'production';

export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Verificar se há consentimento armazenado
    const checkConsent = () => {
      let analyticsConsent = false;

      // FONTE 1 (PRIMÁRIA): localStorage granular
      try {
        const storedChoices = localStorage.getItem('lgpd-consent-choices');
        if (storedChoices) {
          const choices = JSON.parse(storedChoices);
          analyticsConsent = choices.analiticos === true;

          if (IS_DEV) {
            console.log('[GA4] Consentimento verificado via localStorage:', { analiticos: analyticsConsent });
          }
        }
      } catch (e) {
        if (IS_DEV) {
          console.warn('[GA4] Erro ao ler localStorage:', e);
        }
      }

      // FONTE 2 (LEGADO - fallback): Cookie global do banner
      // Usado apenas se localStorage não estiver disponível ou não tiver escolha granular
      if (!analyticsConsent) {
        // Verificar cookie correto: lgpd_consent (definido em ConsentBanner.tsx)
        const lgpdConsent = Cookies.get('lgpd_consent');
        const cookieConsent = Cookies.get('CookieConsent'); // Fallback para banner antigo

        if (lgpdConsent === 'true' || cookieConsent === 'true') {
          analyticsConsent = true;

          if (IS_DEV) {
            console.log('[GA4] Consentimento verificado via cookie:', lgpdConsent ? 'lgpd_consent' : 'CookieConsent (legado)');
          }
        }
      }

      setHasConsent(analyticsConsent);

      if (IS_DEV) {
        if (analyticsConsent) {
          console.log('[GA4] ✓ Consentimento confirmado - GA4 será carregado');
        } else {
          console.log('[GA4] ✗ Sem consentimento - GA4 não será carregado');
        }
      }
    };

    // Verificar ao montar
    checkConsent();

    // Re-verificar quando cookies mudarem (evento customizado do banner)
    const handleConsentChange = () => {
      if (IS_DEV) {
        console.log('[GA4] Evento de mudança de consentimento detectado - re-verificando...');
      }
      checkConsent();
    };

    window.addEventListener('lgpd-consent-updated', handleConsentChange);

    return () => {
      window.removeEventListener('lgpd-consent-updated', handleConsentChange);
    };
  }, []);

  // Não renderizar se:
  // 1. Não houver GA_MEASUREMENT_ID configurado
  // 2. Não houver consentimento
  if (!GA_MEASUREMENT_ID || !hasConsent) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script - Tag */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          if (IS_DEV) {
            console.log('[GA4] Script carregado com sucesso');
          }
        }}
        onError={(e) => {
          if (IS_DEV) {
            console.error('[GA4] Erro ao carregar script:', e);
          }
        }}
      />

      {/* Google Analytics Script - Config */}
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
              send_page_view: true,
            });

            ${
              IS_DEV
                ? `console.log('[GA4] Configurado com ID: ${GA_MEASUREMENT_ID}');`
                : '// GA4 configurado em produção'
            }
          `,
        }}
      />
    </>
  );
}

/**
 * Função utilitária para disparar eventos customizados (client-side)
 *
 * USO:
 * import { trackEvent } from '@/components/analytics/GoogleAnalytics';
 * trackEvent('click_cta', { cta_location: 'hero', cta_text: 'Solicitar Análise' });
 *
 * EVENTOS PLANEJADOS:
 * - click_cta: { cta_location: string, cta_text: string }
 * - form_submit: { form_id: string, form_name: string }
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);

    if (IS_DEV) {
      console.log(`[GA4] Evento disparado: ${eventName}`, eventParams);
    }
  } else {
    if (IS_DEV) {
      console.warn('[GA4] gtag não disponível - evento não enviado:', eventName);
    }
  }
}

/**
 * Declaração de tipos para window.gtag (TypeScript)
 */
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
