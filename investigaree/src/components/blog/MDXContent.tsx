"use client";

import { ReactNode } from "react";

interface MDXContentProps {
  children: ReactNode;
}

// Wrapper component for MDX content with proper styling
export default function MDXContent({ children }: MDXContentProps) {
  return (
    <div className="mdx-content prose prose-invert prose-gold max-w-none
      prose-headings:scroll-mt-24
      prose-h1:text-5xl
      prose-h1:font-bold
      prose-h1:mb-8
      prose-h1:mt-12
      prose-h1:text-blue-400
      prose-h2:text-4xl
      prose-h2:font-bold
      prose-h2:mt-12
      prose-h2:mb-6
      prose-h2:text-blue-400
      prose-h2:border-b
      prose-h2:border-blue-500/30
      prose-h2:pb-3
      prose-h3:text-3xl
      prose-h3:font-semibold
      prose-h3:mt-10
      prose-h3:mb-4
      prose-h3:text-blue-300
      prose-h4:text-2xl
      prose-h4:font-semibold
      prose-h4:mt-8
      prose-h4:mb-3
      prose-h4:text-blue-200
      prose-p:text-slate-600 dark:text-navy-300
      prose-p:leading-relaxed
      prose-p:mb-4
      prose-a:text-blue-400
      hover:prose-a:text-blue-300
      prose-a:no-underline
      prose-a:transition-colors
      prose-strong:text-blue-400
      prose-strong:font-semibold
      prose-em:text-slate-700 dark:text-navy-200
      prose-em:italic
      prose-code:text-purple-400
      prose-code:bg-white dark:bg-white/50 dark:bg-navy-900/50
      prose-code:px-1.5
      prose-code:py-0.5
      prose-code:rounded
      prose-code:font-mono
      prose-code:before:content-none
      prose-code:after:content-none
      prose-pre:bg-white dark:bg-navy-900
      prose-pre:border
      prose-pre:border-blue-500/10
      prose-pre:rounded-xl
      prose-ul:text-slate-600 dark:text-navy-300
      prose-ul:my-4
      prose-li:my-1
      prose-ol:text-slate-600 dark:text-navy-300
      prose-ol:my-4
      prose-blockquote:border-l-blue-500
      prose-blockquote:bg-white dark:bg-white/30 dark:bg-navy-900/30
      prose-blockquote:rounded-r-lg
      prose-blockquote:py-2
      prose-blockquote:px-4
      prose-blockquote:text-slate-700 dark:text-navy-200
      prose-blockquote:not-italic
      prose-hr:border-blue-500/10
      prose-hr:my-8
      prose-table:border-collapse
      prose-th:bg-white dark:bg-navy-900
      prose-th:text-slate-900 dark:text-white
      prose-th:font-medium
      prose-th:p-3
      prose-th:border
      prose-th:border-blue-500/10
      prose-td:p-3
      prose-td:border
      prose-td:border-blue-500/10
      prose-td:text-slate-600 dark:text-navy-300
      prose-img:rounded-xl
      prose-img:border
      prose-img:border-blue-500/10
    ">
      {children}
    </div>
  );
}
