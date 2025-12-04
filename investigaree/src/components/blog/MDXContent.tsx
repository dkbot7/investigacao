"use client";

import { ReactNode } from "react";

interface MDXContentProps {
  children: ReactNode;
}

// Wrapper component for MDX content with proper styling
export default function MDXContent({ children }: MDXContentProps) {
  return (
    <div className="mdx-content prose prose-invert prose-gold max-w-none
      prose-headings:text-white
      prose-headings:scroll-mt-24
      prose-h1:text-3xl
      prose-h1:font-bold
      prose-h1:mb-6
      prose-h2:text-2xl
      prose-h2:font-semibold
      prose-h2:mt-10
      prose-h2:mb-4
      prose-h2:border-b
      prose-h2:border-gold-500/10
      prose-h2:pb-2
      prose-h3:text-xl
      prose-h3:font-medium
      prose-h3:mt-8
      prose-h3:mb-3
      prose-h4:text-lg
      prose-h4:font-medium
      prose-h4:mt-6
      prose-h4:mb-2
      prose-p:text-navy-300
      prose-p:leading-relaxed
      prose-p:mb-4
      prose-a:text-gold-400
      hover:prose-a:text-gold-300
      prose-a:no-underline
      prose-a:transition-colors
      prose-strong:text-white
      prose-strong:font-semibold
      prose-em:text-navy-200
      prose-em:italic
      prose-code:text-purple-400
      prose-code:bg-navy-900/50
      prose-code:px-1.5
      prose-code:py-0.5
      prose-code:rounded
      prose-code:font-mono
      prose-code:before:content-none
      prose-code:after:content-none
      prose-pre:bg-navy-900
      prose-pre:border
      prose-pre:border-gold-500/10
      prose-pre:rounded-xl
      prose-ul:text-navy-300
      prose-ul:my-4
      prose-li:my-1
      prose-ol:text-navy-300
      prose-ol:my-4
      prose-blockquote:border-l-gold-500
      prose-blockquote:bg-navy-900/30
      prose-blockquote:rounded-r-lg
      prose-blockquote:py-2
      prose-blockquote:px-4
      prose-blockquote:text-navy-200
      prose-blockquote:not-italic
      prose-hr:border-gold-500/10
      prose-hr:my-8
      prose-table:border-collapse
      prose-th:bg-navy-900
      prose-th:text-white
      prose-th:font-medium
      prose-th:p-3
      prose-th:border
      prose-th:border-gold-500/10
      prose-td:p-3
      prose-td:border
      prose-td:border-gold-500/10
      prose-td:text-navy-300
      prose-img:rounded-xl
      prose-img:border
      prose-img:border-gold-500/10
    ">
      {children}
    </div>
  );
}
