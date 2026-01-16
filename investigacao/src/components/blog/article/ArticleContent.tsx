"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  Lightbulb,
  Terminal,
  FileCode,
  Quote,
  ExternalLink
} from "lucide-react";

// Componente para blocos de código
interface CodeBlockProps {
  language?: string;
  filename?: string;
  children: string;
}

export function CodeBlock({ language = "bash", filename, children }: CodeBlockProps) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-blue-500/10">
      {/* Header do código */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-navy-800 border-b border-blue-500/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-500" />
          {filename ? (
            <span className="text-xs text-slate-600 dark:text-navy-300 font-mono">{filename}</span>
          ) : (
            <span className="text-xs text-slate-500 dark:text-navy-400">{language}</span>
          )}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(children)}
          className="text-xs text-slate-500 dark:text-navy-400 hover:text-blue-400 transition-colors"
        >
          Copiar
        </button>
      </div>
      {/* Código */}
      <pre className="p-4 bg-white dark:bg-navy-900 overflow-x-auto">
        <code className="text-sm text-slate-700 dark:text-navy-200 font-mono whitespace-pre">{children}</code>
      </pre>
    </div>
  );
}

// Componente para callouts/alertas
interface CalloutProps {
  type: "info" | "warning" | "success" | "tip";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type, title, children }: CalloutProps) {
  const styles = {
    info: {
      icon: Info,
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      iconColor: "text-blue-400",
      titleColor: "text-blue-300"
    },
    warning: {
      icon: AlertTriangle,
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      iconColor: "text-amber-400",
      titleColor: "text-amber-300"
    },
    success: {
      icon: CheckCircle2,
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      iconColor: "text-green-400",
      titleColor: "text-green-300"
    },
    tip: {
      icon: Lightbulb,
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      iconColor: "text-blue-400",
      titleColor: "text-blue-300"
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`my-6 p-4 rounded-xl ${style.bg} border ${style.border}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          {title && (
            <p className={`font-semibold ${style.titleColor} mb-1`}>{title}</p>
          )}
          <div className="text-slate-700 dark:text-navy-200 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Componente para citações/estatísticas destacadas
interface KeyStatProps {
  value: string;
  description: string;
  source?: string;
}

export function KeyStat({ value, description, source }: KeyStatProps) {
  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-500/10 to-navy-900/50 rounded-xl border border-blue-500/20">
      <div className="flex items-start gap-4">
        <Quote className="w-8 h-8 text-blue-500/50 flex-shrink-0" />
        <div>
          <p className="text-3xl font-bold text-blue-400 mb-2">{value}</p>
          <p className="text-slate-700 dark:text-navy-200">{description}</p>
          {source && (
            <p className="text-xs text-slate-900 dark:text-navy-500 mt-2">Fonte: {source}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para imagens com legenda
interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function ArticleImage({ src, alt, caption, width = 800, height = 450 }: ArticleImageProps) {
  return (
    <figure className="my-8">
      <div className="rounded-xl overflow-hidden border border-blue-500/10">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-slate-500 dark:text-navy-400 mt-3 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Componente para lista de artefatos (estilo Forensafe)
interface ArtifactListProps {
  title: string;
  items: Array<{
    name: string;
    description: string;
    path?: string;
  }>;
}

export function ArtifactList({ title, items }: ArtifactListProps) {
  return (
    <div className="my-6 bg-white dark:bg-white/50 dark:bg-navy-900/50 rounded-xl border border-blue-500/10 overflow-hidden">
      <div className="px-4 py-3 bg-slate-100 dark:bg-navy-800 border-b border-blue-500/10">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-500" />
          <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
        </div>
      </div>
      <div className="divide-y divide-blue-500/5">
        {items.map((item, index) => (
          <div key={index} className="px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-navy-100">{item.name}</p>
                <p className="text-sm text-slate-500 dark:text-navy-400 mt-0.5">{item.description}</p>
              </div>
              {item.path && (
                <code className="text-xs bg-slate-100 dark:bg-navy-800 px-2 py-1 rounded text-blue-400 font-mono flex-shrink-0">
                  {item.path}
                </code>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente principal de conteúdo do artigo
interface ArticleContentProps {
  children: React.ReactNode;
}

export default function ArticleContent({ children }: ArticleContentProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="prose prose-invert prose-gold max-w-none"
    >
      {/* Estilos customizados para o conteúdo */}
      <style jsx global>{`
        .prose-gold {
          --tw-prose-headings: #fff;
          --tw-prose-body: #94a3b8;
          --tw-prose-links: #D4AF37;
          --tw-prose-bold: #fff;
          --tw-prose-quotes: #D4AF37;
          --tw-prose-quote-borders: #D4AF37;
        }

        .prose h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: #D4AF37;
        }

        .prose h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .prose p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
        }

        .prose ul, .prose ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }

        .prose li {
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
        }

        .prose li::marker {
          color: #D4AF37;
        }

        .prose a {
          color: #D4AF37;
          text-decoration: none;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          transition: all 0.2s;
        }

        .prose a:hover {
          border-bottom-color: #D4AF37;
        }

        .prose blockquote {
          border-left: 3px solid #D4AF37;
          padding-left: 1rem;
          font-style: italic;
          color: #cbd5e1;
          margin: 1.5rem 0;
        }

        .prose code:not(pre code) {
          background: rgba(212, 175, 55, 0.1);
          color: #D4AF37;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .prose th {
          background: rgba(212, 175, 55, 0.1);
          color: #fff;
          font-weight: 600;
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .prose td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .prose strong {
          color: #fff;
        }
      `}</style>
      {children}
    </motion.article>
  );
}
