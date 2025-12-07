/**
 * Google Analytics 4 Component for Next.js 14
 * Uses @next/third-parties/google for optimal performance
 *
 * References:
 * - https://nextjs.org/docs/messages/next-script-for-ga
 * - https://developers.google.com/analytics/devguides/collection/ga4/events
 *
 * Setup Instructions:
 * 1. Install: npm install @next/third-parties
 * 2. Get GA4 Measurement ID from https://analytics.google.com/
 * 3. Add to .env.local: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 4. Import and use in root layout.tsx
 */

'use client'

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'
import { useEffect } from 'react'

/**
 * Custom event tracking for GA4
 * Use this to track specific user interactions
 */
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

/**
 * Predefined event trackers for common interactions
 */
export const GAEvents = {
  // Content engagement
  viewBlogPost: (title: string, category: string) => {
    trackEvent('view_blog_post', {
      post_title: title,
      post_category: category,
    })
  },

  shareBlogPost: (title: string, method: 'native' | 'clipboard') => {
    trackEvent('share', {
      content_type: 'blog_post',
      item_id: title,
      method,
    })
  },

  downloadContent: (contentName: string, contentType: string) => {
    trackEvent('download_content', {
      content_name: contentName,
      content_type: contentType,
    })
  },

  // Lead generation
  submitLeadForm: (formName: string, formLocation: string) => {
    trackEvent('generate_lead', {
      form_name: formName,
      form_location: formLocation,
    })
  },

  clickCTA: (ctaText: string, ctaLocation: string) => {
    trackEvent('click_cta', {
      cta_text: ctaText,
      cta_location: ctaLocation,
    })
  },

  // User engagement
  scrollDepth: (percentage: number, pageTitle: string) => {
    trackEvent('scroll', {
      percent_scrolled: percentage,
      page_title: pageTitle,
    })
  },

  timeOnPage: (seconds: number, pageTitle: string) => {
    trackEvent('time_on_page', {
      value: seconds,
      page_title: pageTitle,
    })
  },

  // Navigation
  clickNavigation: (linkText: string, destination: string) => {
    trackEvent('click_navigation', {
      link_text: linkText,
      link_destination: destination,
    })
  },

  searchQuery: (query: string, resultsCount: number) => {
    trackEvent('search', {
      search_term: query,
      results_count: resultsCount,
    })
  },

  // Video engagement
  playVideo: (videoTitle: string, videoUrl: string) => {
    trackEvent('video_start', {
      video_title: videoTitle,
      video_url: videoUrl,
    })
  },

  completeVideo: (videoTitle: string, duration: number) => {
    trackEvent('video_complete', {
      video_title: videoTitle,
      video_duration: duration,
    })
  },
}

/**
 * Hook for automatic scroll depth tracking
 * Add to pages where you want to track scroll engagement
 */
export function useScrollTracking(pageTitle: string) {
  useEffect(() => {
    let maxScroll = 0
    const checkpoints = [25, 50, 75, 100]
    const tracked = new Set<number>()

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      )

      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage

        checkpoints.forEach((checkpoint) => {
          if (scrollPercentage >= checkpoint && !tracked.has(checkpoint)) {
            GAEvents.scrollDepth(checkpoint, pageTitle)
            tracked.add(checkpoint)
          }
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pageTitle])
}

/**
 * Hook for automatic time on page tracking
 * Tracks when user leaves the page
 */
export function useTimeTracking(pageTitle: string) {
  useEffect(() => {
    const startTime = Date.now()

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      GAEvents.timeOnPage(timeSpent, pageTitle)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [pageTitle])
}

/**
 * Main Google Analytics Component
 * Add this to your root layout.tsx
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!measurementId) {
    console.warn('GA4 Measurement ID not found. Analytics disabled.')
    return null
  }

  return <NextGoogleAnalytics gaId={measurementId} />
}

/**
 * TypeScript declaration for gtag
 */
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}
