"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Newspaper,
  GraduationCap,
  Briefcase,
  Star,
  Mic,
  BookOpen,
  Play,
  Headphones,
  Sprout,
  Flame,
  Rocket,
  X,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  FlaskConical,
  ShieldAlert,
  Search,
  Smartphone,
  Zap,
  Scale,
  Wrench,
  TrendingUp,
  Shield,
  Home,
  Building2,
  AlertTriangle,
  FileCheck,
  LayoutList
} from "lucide-react";
import {
  BlogFilters as FilterType,
  ContentType,
  SkillLevel,
  CONTENT_TYPES,
  SKILL_LEVELS,
  BLOG_TOPICS,
  BlogTopic
} from "@/types/blog";

// Mapeamento de ícones para tipos de conteúdo
const contentTypeIcons: Record<ContentType, React.ComponentType<{ className?: string }>> = {
  artigo: FileText,
  noticia: Newspaper,
  tutorial: GraduationCap,
  "case-study": Briefcase,
  review: Star,
  entrevista: Mic,
  whitepaper: BookOpen,
  video: Play,
  podcast: Headphones
};

// Mapeamento de ícones para níveis
const skillLevelIcons: Record<SkillLevel, React.ComponentType<{ className?: string }>> = {
  iniciante: Sprout,
  intermediario: Flame,
  avancado: Rocket
};

// Mapeamento de ícones para tópicos
const topicIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FlaskConical,
  ShieldAlert,
  Search,
  FileCheck,
  Home,
  Building2,
  TrendingUp,
  Scale,
  Briefcase,
  AlertTriangle,
  Shield,
  Wrench,
  FileText,
  BookOpen,
  GraduationCap,
  Zap,
  Smartphone,
  Star
};

interface QuickFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onOpenFullFilters: () => void;
  totalResults: number;
  topics?: BlogTopic[];
}

export default function QuickFilters({
  filters,
  onFiltersChange,
  onOpenFullFilters,
  totalResults,
  topics = BLOG_TOPICS
}: QuickFiltersProps) {
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);

  const topicRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (topicRef.current && !topicRef.current.contains(event.target as Node)) {
        setTopicDropdownOpen(false);
      }
      if (levelRef.current && !levelRef.current.contains(event.target as Node)) {
        setLevelDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTopicClick = (topicSlug: string) => {
    if (filters.topic === topicSlug) {
      onFiltersChange({ ...filters, topic: undefined });
    } else {
      onFiltersChange({ ...filters, topic: topicSlug });
    }
    setTopicDropdownOpen(false);
  };

  const handleContentTypeClick = (contentType: ContentType | undefined) => {
    onFiltersChange({ ...filters, contentType: contentType });
  };

  const handleSkillLevelClick = (level: SkillLevel) => {
    if (filters.skillLevel === level) {
      onFiltersChange({ ...filters, skillLevel: undefined });
    } else {
      onFiltersChange({ ...filters, skillLevel: level });
    }
    setLevelDropdownOpen(false);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.contentType || filters.skillLevel || filters.topic || filters.search;
  const activeFiltersCount = [filters.contentType, filters.skillLevel, filters.topic, filters.search].filter(Boolean).length;

  const getTopicIcon = (iconName: string) => {
    return topicIconMap[iconName] || FileText;
  };

  const selectedTopic = topics.find(t => t.slug === filters.topic);
  const selectedLevel = SKILL_LEVELS.find(l => l.id === filters.skillLevel);

  return (
    <div className="space-y-4">
      {/* Abas de Tipo de Conteúdo */}
      <div className="flex items-center gap-1 p-1 bg-white dark:bg-navy-900/50 rounded-xl border border-blue-500/10 overflow-x-auto">
        {/* Aba "Todos" */}
        <button
          onClick={() => handleContentTypeClick(undefined)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            !filters.contentType
              ? "bg-blue-500 text-white"
              : "text-slate-600 dark:text-navy-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800/80"
          }`}
        >
          <LayoutList className="w-4 h-4" />
          <span>Todos</span>
        </button>

        {/* Abas para cada tipo de conteúdo */}
        {CONTENT_TYPES.map((type) => {
          const Icon = contentTypeIcons[type.id];
          const isActive = filters.contentType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => handleContentTypeClick(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "text-navy-950"
                  : "text-slate-600 dark:text-navy-100 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800/80"
              }`}
              style={isActive ? { backgroundColor: type.color } : undefined}
            >
              <Icon className="w-4 h-4" />
              <span>{type.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filtros secundários */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Dropdown de Tópicos */}
        <div ref={topicRef} className="relative">
          <button
            onClick={() => {
              setTopicDropdownOpen(!topicDropdownOpen);
              setLevelDropdownOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedTopic
                ? "text-navy-950"
                : "text-slate-700 dark:text-navy-100 bg-white dark:bg-navy-900/50 hover:bg-slate-100 dark:hover:bg-navy-800/80 border border-blue-500/20 hover:border-blue-500/40"
            }`}
            style={selectedTopic ? {
              backgroundColor: selectedTopic.color,
              border: `1px solid ${selectedTopic.color}`
            } : undefined}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{selectedTopic?.name || "Tópico"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${topicDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {topicDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white dark:bg-navy-900 border border-blue-500/20 rounded-xl shadow-2xl z-50"
              >
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-slate-900 dark:text-navy-200 uppercase tracking-wider border-b border-blue-500/10 mb-1">
                    Filtrar por tópico
                  </div>
                  {selectedTopic && (
                    <button
                      onClick={() => handleTopicClick(selectedTopic.slug)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-500 dark:text-blue-300 hover:bg-slate-100 dark:hover:bg-navy-800/50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Limpar seleção
                    </button>
                  )}
                  {topics.sort((a, b) => a.order - b.order).map((topic) => {
                    const Icon = getTopicIcon(topic.icon);
                    const isActive = filters.topic === topic.slug;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicClick(topic.slug)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                          isActive
                            ? "text-navy-950 font-medium"
                            : "text-slate-700 dark:text-navy-100 hover:bg-slate-100 dark:hover:bg-navy-800/50"
                        }`}
                        style={isActive ? { backgroundColor: topic.color } : undefined}
                      >
                        <span style={{ color: isActive ? undefined : topic.color }}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 text-left">{topic.name}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-white/80" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown de Nível */}
        <div ref={levelRef} className="relative">
          <button
            onClick={() => {
              setLevelDropdownOpen(!levelDropdownOpen);
              setTopicDropdownOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedLevel
                ? "text-navy-950"
                : "text-slate-700 dark:text-navy-100 bg-white dark:bg-navy-900/50 hover:bg-slate-100 dark:hover:bg-navy-800/80 border border-blue-500/20 hover:border-blue-500/40"
            }`}
            style={selectedLevel ? {
              backgroundColor: selectedLevel.color,
              border: `1px solid ${selectedLevel.color}`
            } : undefined}
          >
            {selectedLevel ? (
              <>
                {(() => {
                  const Icon = skillLevelIcons[selectedLevel.id];
                  return <Icon className="w-4 h-4" />;
                })()}
              </>
            ) : (
              <Flame className="w-4 h-4" />
            )}
            <span>{selectedLevel?.name || "Nível"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${levelDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {levelDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-navy-900 border border-blue-500/20 rounded-xl shadow-2xl z-50"
              >
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-slate-900 dark:text-navy-200 uppercase tracking-wider border-b border-blue-500/10 mb-1">
                    Nível de dificuldade
                  </div>
                  {selectedLevel && (
                    <button
                      onClick={() => handleSkillLevelClick(selectedLevel.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-500 dark:text-blue-300 hover:bg-slate-100 dark:hover:bg-navy-800/50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Limpar seleção
                    </button>
                  )}
                  {SKILL_LEVELS.map((level) => {
                    const Icon = skillLevelIcons[level.id];
                    const isActive = filters.skillLevel === level.id;
                    return (
                      <button
                        key={level.id}
                        onClick={() => handleSkillLevelClick(level.id)}
                        className={`w-full flex items-start gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                          isActive
                            ? "text-navy-950 font-medium"
                            : "text-slate-700 dark:text-navy-100 hover:bg-slate-100 dark:hover:bg-navy-800/50"
                        }`}
                        style={isActive ? { backgroundColor: level.color } : undefined}
                      >
                        <span style={{ color: isActive ? undefined : level.color }} className="mt-0.5">
                          <Icon className="w-4 h-4" />
                        </span>
                        <div className="flex-1 text-left">
                          <span className="block">{level.name}</span>
                          <span className={`text-xs ${isActive ? "text-navy-800" : "text-slate-500 dark:text-navy-300"}`}>
                            {level.description}
                          </span>
                        </div>
                        {isActive && <span className="w-2 h-2 rounded-full bg-white/80 mt-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botão de filtros avançados */}
        <button
          onClick={onOpenFullFilters}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-navy-100 hover:text-blue-500 dark:hover:text-blue-300 bg-white dark:bg-navy-900/50 hover:bg-slate-100 dark:hover:bg-navy-800/80 border border-slate-200 dark:border-navy-600 hover:border-blue-500/30 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Mais filtros
        </button>

        {/* Contador de resultados e limpar */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm text-slate-500 dark:text-navy-200">
            {totalResults} {totalResults === 1 ? "resultado" : "resultados"}
          </span>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-500 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200 bg-blue-500/10 dark:bg-blue-500/20 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 rounded-lg border border-blue-500/20 dark:border-blue-500/30 transition-all"
            >
              <X className="w-4 h-4" />
              Limpar ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Tags de filtros ativos */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 pt-3 border-t border-blue-500/10"
          >
            <span className="text-xs text-slate-500 dark:text-navy-300">Filtros ativos:</span>

            {selectedTopic && (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={() => handleTopicClick(selectedTopic.slug)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-800 dark:text-navy-100 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${selectedTopic.color}30`, borderColor: selectedTopic.color, border: "1px solid" }}
              >
                {(() => {
                  const Icon = getTopicIcon(selectedTopic.icon);
                  return <span style={{ color: selectedTopic.color }}><Icon className="w-3 h-3" /></span>;
                })()}
                {selectedTopic.name}
                <X className="w-3 h-3 ml-0.5" />
              </motion.button>
            )}

            {selectedLevel && (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={() => handleSkillLevelClick(selectedLevel.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-800 dark:text-navy-100 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${selectedLevel.color}30`, borderColor: selectedLevel.color, border: "1px solid" }}
              >
                {(() => {
                  const Icon = skillLevelIcons[selectedLevel.id];
                  return <span style={{ color: selectedLevel.color }}><Icon className="w-3 h-3" /></span>;
                })()}
                {selectedLevel.name}
                <X className="w-3 h-3 ml-0.5" />
              </motion.button>
            )}

            {filters.search && (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={() => onFiltersChange({ ...filters, search: undefined })}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-800 dark:text-navy-100 bg-slate-200 dark:bg-navy-800/80 border border-slate-300 dark:border-navy-600 hover:opacity-80 transition-opacity"
              >
                <Search className="w-3 h-3" />
                &ldquo;{filters.search}&rdquo;
                <X className="w-3 h-3 ml-0.5" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
