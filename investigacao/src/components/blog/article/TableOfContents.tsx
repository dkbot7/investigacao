"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { List, ChevronRight } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className="bg-white dark:bg-white/30 dark:bg-navy-900/30 border border-green-500/10 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/10">
        <div className="p-1.5 rounded-lg bg-green-500/10">
          <List className="w-4 h-4 text-green-500" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Neste Artigo</h3>
      </div>

      {/* Lista de seções */}
      <ul className="space-y-1">
        {items.map((item, index) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                activeId === item.id
                  ? "bg-green-500/10 text-green-400 font-medium"
                  : "text-slate-600 dark:text-navy-300 hover:text-white hover:bg-slate-100 dark:bg-navy-800/50"
              }`}
              style={{ paddingLeft: `${(item.level - 2) * 12 + 12}px` }}
            >
              <ChevronRight
                className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-transform ${
                  activeId === item.id ? "rotate-90 text-green-500" : ""
                }`}
              />
              <span className="line-clamp-2">{item.text}</span>
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}

