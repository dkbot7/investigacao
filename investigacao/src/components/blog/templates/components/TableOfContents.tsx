"use client";

import { motion } from "framer-motion";
import { List, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items?: TOCItem[];
  autoGenerate?: boolean;
  containerSelector?: string;
  className?: string;
  sticky?: boolean;
}

/**
 * Componente TableOfContents - Índice de conteúdo
 * Pode ser preenchido manualmente ou gerar automaticamente a partir de headings
 *
 * Exemplo de uso manual:
 * <TableOfContents
 *   items={[
 *     { id: "introducao", title: "Introdução", level: 2 },
 *     { id: "valor-forense", title: "Valor Forense", level: 2 },
 *     { id: "localizacao", title: "Localização dos Artefatos", level: 2 },
 *     { id: "analise", title: "Análise Prática", level: 2 },
 *     { id: "conclusao", title: "Conclusão", level: 2 }
 *   ]}
 * />
 *
 * Exemplo de uso automático:
 * <TableOfContents autoGenerate containerSelector="#article-content" />
 */
export default function TableOfContents({
  items = [],
  autoGenerate = false,
  containerSelector = "#article-content",
  className = "",
  sticky = true
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>(items);
  const [activeId, setActiveId] = useState<string>("");

  // Gerar automaticamente a partir de headings
  useEffect(() => {
    if (!autoGenerate) {
      setTocItems(items);
      return;
    }

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const headings = container.querySelectorAll("h2, h3, h4");
    const generatedItems: TOCItem[] = [];

    headings.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      if (!heading.id) heading.id = id;

      generatedItems.push({
        id,
        title: heading.textContent || "",
        level: parseInt(heading.tagName[1])
      });
    });

    setTocItems(generatedItems);
  }, [autoGenerate, containerSelector, items]);

  // Observar scroll para destacar item ativo
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px"
      }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${sticky ? "lg:sticky lg:top-24" : ""} ${className}`}
    >
      <div className="p-5 rounded-xl bg-white dark:bg-white/50 dark:bg-navy-900/50 border border-green-500/10">
        {/* Cabeçalho */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/10">
          <List className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">Neste artigo</span>
        </div>

        {/* Lista de itens */}
        <ul className="space-y-1">
          {tocItems.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => handleClick(item.id)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  activeId === item.id
                    ? "bg-green-500/10 text-green-400 font-medium"
                    : "text-slate-500 dark:text-navy-400 hover:text-white hover:bg-slate-100 dark:bg-navy-800/50"
                }`}
                style={{
                  paddingLeft: `${(item.level - 2) * 12 + 12}px`
                }}
              >
                <ChevronRight
                  className={`w-3 h-3 flex-shrink-0 transition-transform ${
                    activeId === item.id ? "text-green-500" : ""
                  }`}
                />
                <span className="line-clamp-2">{item.title}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}

