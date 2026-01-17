"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, ArrowUpRight } from "lucide-react";

interface Feature {
  title: string;
  description?: string;
  isNew?: boolean;
  isHighlight?: boolean;
}

interface FeatureCategory {
  name: string;
  features: Feature[];
}

interface FeatureListProps {
  title?: string;
  categories: FeatureCategory[];
  showBadges?: boolean;
  className?: string;
}

/**
 * Componente FeatureList - Lista de Funcionalidades por Categoria
 * Inspirado no template de notícias do Forensic Focus para releases de produtos
 *
 * Exemplo de uso:
 * <FeatureList
 *   title="Novidades da versão 2.0"
 *   categories={[
 *     {
 *       name: "Mobile Forensics",
 *       features: [
 *         { title: "Suporte a iOS 18", description: "Extração completa...", isNew: true },
 *         { title: "Parser de WhatsApp atualizado", isHighlight: true }
 *       ]
 *     },
 *     {
 *       name: "Computer Artifacts",
 *       features: [
 *         { title: "Novo parser para Chrome v120+" }
 *       ]
 *     }
 *   ]}
 * />
 */
export default function FeatureList({
  title = "Funcionalidades",
  categories,
  showBadges = true,
  className = ""
}: FeatureListProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`py-8 ${className}`}
    >
      {title && (
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{title}</h2>
      )}

      <div className="space-y-8">
        {categories.map((category, catIndex) => (
          <motion.div
            key={catIndex}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIndex * 0.1 }}
          >
            {/* Nome da categoria */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-green-500 rounded-full" />
              <h3 className="text-lg font-semibold text-green-400">
                {category.name}
              </h3>
            </div>

            {/* Lista de features */}
            <ul className="space-y-3 pl-4">
              {category.features.map((feature, featIndex) => (
                <motion.li
                  key={featIndex}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: featIndex * 0.05 }}
                  className="group"
                >
                  <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    feature.isHighlight
                      ? "bg-green-500/10 border border-green-500/20"
                      : "hover:bg-white dark:bg-white/50 dark:bg-navy-900/50"
                  }`}>
                    {/* Ícone */}
                    <div className={`flex-shrink-0 mt-0.5 ${
                      feature.isHighlight ? "text-green-500" : "text-green-500"
                    }`}>
                      {feature.isHighlight ? (
                        <Star className="w-4 h-4 fill-current" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium ${
                          feature.isHighlight ? "text-green-400" : "text-white"
                        }`}>
                          {feature.title}
                        </span>

                        {/* Badges */}
                        {showBadges && feature.isNew && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 rounded-full">
                            <Zap className="w-2.5 h-2.5" />
                            Novo
                          </span>
                        )}
                      </div>

                      {feature.description && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-navy-400">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

