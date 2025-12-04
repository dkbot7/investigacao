import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

// Custom MDX components for blog posts
// These override the default HTML elements rendered by MDX

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings with anchor links
    h1: ({ children, ...props }) => (
      <h1
        className="text-3xl md:text-4xl font-bold text-white mt-12 mb-6 scroll-mt-24"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, id, ...props }) => (
      <h2
        id={id}
        className="text-2xl font-bold text-white mt-10 mb-4 pb-2 border-b border-gold-500/10 scroll-mt-24 group"
        {...props}
      >
        <a href={`#${id}`} className="no-underline hover:text-gold-400 transition-colors">
          {children}
          <span className="ml-2 opacity-0 group-hover:opacity-100 text-gold-500 transition-opacity">
            #
          </span>
        </a>
      </h2>
    ),
    h3: ({ children, id, ...props }) => (
      <h3
        id={id}
        className="text-xl font-semibold text-gold-400 mt-8 mb-3 scroll-mt-24"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="text-lg font-medium text-white mt-6 mb-2"
        {...props}
      >
        {children}
      </h4>
    ),

    // Paragraphs
    p: ({ children, ...props }) => (
      <p className="text-navy-300 leading-relaxed mb-4" {...props}>
        {children}
      </p>
    ),

    // Links
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith("http");
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-400 hover:text-gold-300 underline decoration-gold-500/30 hover:decoration-gold-500 transition-colors"
            {...props}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href || "#"}
          className="text-gold-400 hover:text-gold-300 underline decoration-gold-500/30 hover:decoration-gold-500 transition-colors"
          {...props}
        >
          {children}
        </Link>
      );
    },

    // Lists
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside text-navy-300 mb-4 space-y-2 pl-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside text-navy-300 mb-4 space-y-2 pl-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-navy-300 marker:text-gold-500" {...props}>
        {children}
      </li>
    ),

    // Blockquote
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-gold-500 bg-gold-500/5 px-6 py-4 my-6 rounded-r-lg text-navy-200 italic"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Code blocks
    pre: ({ children, ...props }) => (
      <pre
        className="bg-navy-900/70 border border-gold-500/10 rounded-xl p-4 overflow-x-auto my-6 text-sm"
        {...props}
      >
        {children}
      </pre>
    ),
    code: ({ children, className, ...props }) => {
      // Inline code vs code blocks
      const isCodeBlock = className?.includes("language-");
      if (isCodeBlock) {
        return (
          <code className={`${className} text-sm`} {...props}>
            {children}
          </code>
        );
      }
      return (
        <code
          className="text-purple-400 bg-navy-900/50 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Table
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="bg-gold-500/10 text-white font-semibold p-3 text-left border border-gold-500/20"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="p-3 border border-gold-500/10 text-navy-300" {...props}>
        {children}
      </td>
    ),

    // Horizontal rule
    hr: (props) => (
      <hr className="border-gold-500/10 my-8" {...props} />
    ),

    // Strong and emphasis
    strong: ({ children, ...props }) => (
      <strong className="text-white font-semibold" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="text-navy-200 italic" {...props}>
        {children}
      </em>
    ),

    // Images with Next.js optimization
    img: ({ src, alt, ...props }) => (
      <figure className="my-6">
        <div className="relative w-full h-auto rounded-xl overflow-hidden border border-gold-500/10">
          <Image
            src={src || ""}
            alt={alt || ""}
            width={800}
            height={450}
            className="w-full h-auto"
            {...props}
          />
        </div>
        {alt && (
          <figcaption className="text-center text-sm text-navy-500 mt-2">
            {alt}
          </figcaption>
        )}
      </figure>
    ),

    // Override with any custom components passed in
    ...components,
  };
}
