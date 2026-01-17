"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export default function CodeBlock({
  code,
  language = "bash",
  filename,
  showLineNumbers = true,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-green-500/10 bg-white dark:bg-navy-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-navy-900 border-b border-green-500/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-500 dark:text-navy-400" />
          {filename ? (
            <span className="text-sm text-slate-600 dark:text-navy-300 font-mono">{filename}</span>
          ) : (
            <span className="text-sm text-slate-500 dark:text-navy-400">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 dark:text-navy-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded hover:bg-slate-100 dark:hover:bg-navy-800"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightLines.includes(lineNumber);

            return (
              <div
                key={index}
                className={`${
                  isHighlighted
                    ? "bg-green-500/10 -mx-4 px-4 border-l-2 border-green-500"
                    : ""
                }`}
              >
                {showLineNumbers && (
                  <span className="inline-block w-8 text-right mr-4 text-navy-600 select-none">
                    {lineNumber}
                  </span>
                )}
                <span className="text-slate-700 dark:text-navy-200">{line || " "}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

