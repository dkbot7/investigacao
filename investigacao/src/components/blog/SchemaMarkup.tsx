/**
 * Schema Markup Component for Blog Posts
 * Implements BlogPosting and FAQPage schemas using JSON-LD
 * Based on Google's 2025 best practices for rich results
 *
 * References:
 * - https://nextjs.org/docs/app/guides/json-ld
 * - https://developers.google.com/search/docs/appearance/structured-data/article
 * - https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */

import { ReactElement } from 'react'

interface BlogPostingSchemaProps {
  title: string
  excerpt: string
  authorName: string
  authorBio?: string
  authorImage?: string
  publishedAt: string
  updatedAt?: string
  coverImage: string
  tags: string[]
  url: string
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

/**
 * BlogPosting Schema - For article rich results
 * Helps Google understand the article structure and display rich snippets
 */
export function BlogPostingSchema({
  title,
  excerpt,
  authorName,
  authorBio,
  authorImage,
  publishedAt,
  updatedAt,
  coverImage,
  tags,
  url,
}: BlogPostingSchemaProps): ReactElement {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    image: coverImage,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorBio && { description: authorBio }),
      ...(authorImage && { image: authorImage }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Investigaree',
      logo: {
        '@type': 'ImageObject',
        url: 'https://investigaree.com.br/logo.png',
      },
    },
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags.join(', '),
    inLanguage: 'pt-BR',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * FAQPage Schema - For FAQ rich results
 * Note: As of 2023, FAQ rich results only available for authoritative government/health sites
 * However, FAQ schema still helps with featured snippets and voice search in 2025
 */
export function FAQPageSchema({ faqs }: FAQSchemaProps): ReactElement | null {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * HowTo Schema - For tutorial/guide articles
 * Enables rich results with step-by-step instructions
 */
interface HowToStep {
  name: string
  text: string
  image?: string
}

interface HowToSchemaProps {
  name: string
  description: string
  steps: HowToStep[]
  totalTime?: string // ISO 8601 format (e.g., "PT20M" for 20 minutes)
  image?: string
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  image,
}: HowToSchemaProps): ReactElement {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(image && { image }),
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * BreadcrumbList Schema - For breadcrumb navigation
 * Improves search result display with navigation hierarchy
 */
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps): ReactElement {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Combined Schema Component - Use this for blog posts with multiple schemas
 * Renders BlogPosting + optional FAQ/HowTo + Breadcrumb schemas
 */
interface CombinedSchemaProps {
  blogPosting: BlogPostingSchemaProps
  faqs?: FAQItem[]
  howTo?: Omit<HowToSchemaProps, 'name' | 'description'> & { name?: string; description?: string }
  breadcrumbs?: BreadcrumbItem[]
}

export function CombinedBlogSchema({
  blogPosting,
  faqs,
  howTo,
  breadcrumbs,
}: CombinedSchemaProps): ReactElement {
  return (
    <>
      <BlogPostingSchema {...blogPosting} />
      {faqs && faqs.length > 0 && <FAQPageSchema faqs={faqs} />}
      {howTo && (
        <HowToSchema
          name={howTo.name || blogPosting.title}
          description={howTo.description || blogPosting.excerpt}
          steps={howTo.steps}
          totalTime={howTo.totalTime}
          image={howTo.image || blogPosting.coverImage}
        />
      )}
      {breadcrumbs && breadcrumbs.length > 0 && <BreadcrumbSchema items={breadcrumbs} />}
    </>
  )
}
