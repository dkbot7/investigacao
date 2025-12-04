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
  UserCheck,
  Home,
  Building2,
  AlertTriangle,
  FileCheck
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
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);

  const topicRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (topicRef.current && !topicRef.current.contains(event.target as Node)) {
        setTopicDropdownOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setTypeDropdownOpen(false);
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

  const handleContentTypeClick = (contentType: ContentType) => {
    if (filters.contentType === contentType) {
      onFiltersChange({ ...filters, contentType: undefined });
    } else {
      onFiltersChange({ ...filters, contentType: contentType });
    }
    setTypeDropdownOpen(false);
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
  const selectedType = CONTENT_TYPES.find(t => t.id === filters.contentType);
  const selectedLevel = SKILL_LEVELS.find(l => l.id === filters.skillLevel);

  return (
    <div className="space-y-4">
      {/* Faceted Filters Row - Estilo Blackpanda */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Dropdown de Tópicos */}
        <div ref={topicRef} className="relative">
          <button
            onClick={() => {
              setTopicDropdownOpen(!topicDropdownOpen);
              setTypeDropdownOpen(false);
              setLevelDropdownOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedTopic
                ? "text-navy-950"
                : "text-navy-200 bg-navy-900/50 hover:bg-navy-800/80 border border-gold-500/20 hover:border-gold-500/40"
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
                className="absolute top-full left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-navy-900 border border-gold-500/20 rounded-xl shadow-2xl z-50"
              >
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-navy-500 uppercase tracking-wider border-b border-gold-500/10 mb-1">
                    Filtrar por tópico
                  </div>
                  {selectedTopic && (
                    <button
                      onClick={() => handleTopicClick(selectedTopic.slug)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gold-400 hover:bg-navy-800/50 rounded-lg transition-colors"
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
                            : "text-navy-200 hover:bg-navy-800/50"
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

        {/* Dropdown de Tipo de Conteúdo */}
        <div ref={typeRef} className="relative">
          <button
            onClick={() => {
              setTypeDropdownOpen(!typeDropdownOpen);
              setTopicDropdownOpen(false);
              setLevelDropdownOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedType
                ? "text-navy-950"
                : "text-navy-200 bg-navy-900/50 hover:bg-navy-800/80 border border-gold-500/20 hover:border-gold-500/40"
            }`}
            style={selectedType ? {
              backgroundColor: selectedType.color,
              border: `1px solid ${selectedType.color}`
            } : undefined}
          >
            {selectedType ? (
              <>
                {(() => {
                  const Icon = contentTypeIcons[selectedType.id];
                  return <Icon className="w-4 h-4" />;
                })()}
              </>
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>{selectedType?.name || "Tipo"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${typeDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {typeDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-64 bg-navy-900 border border-gold-500/20 rounded-xl shadow-2xl z-50"
              >
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-navy-500 uppercase tracking-wider border-b border-gold-500/10 mb-1">
                    Tipo de conteúdo
                  </div>
                  {selectedType && (
                    <button
                      onClick={() => handleContentTypeClick(selectedType.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gold-400 hover:bg-navy-800/50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Limpar seleção
                    </button>
                  )}
                  {CONTENT_TYPES.map((type) => {
                    const Icon = contentTypeIcons[type.id];
                    const isActive = filters.contentType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleContentTypeClick(type.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                          isActive
                            ? "text-navy-950 font-medium"
                            : "text-navy-200 hover:bg-navy-800/50"
                        }`}
                        style={isActive ? { backgroundColor: type.color } : undefined}
                      >
                        <span style={{ color: isActive ? undefined : type.color }}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 text-left">{type.name}</span>
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
              setTypeDropdownOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              selectedLevel
                ? "text-navy-950"
                : "text-navy-200 bg-navy-900/50 hover:bg-navy-800/80 border border-gold-500/20 hover:border-gold-500/40"
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
                className="absolute top-full left-0 mt-2 w-56 bg-navy-900 border border-gold-500/20 rounded-xl shadow-2xl z-50"
              >
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-navy-500 uppercase tracking-wider border-b border-gold-500/10 mb-1">
                    Nível de dificuldade
                  </div>
                  {selectedLevel && (
                    <button
                      onClick={() => handleSkillLevelClick(selectedLevel.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gold-400 hover:bg-navy-800/50 rounded-lg transition-colors"
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
                            : "text-navy-200 hover:bg-navy-800/50"
                        }`}
                        style={isActive ? { backgroundColor: level.color } : undefined}
                      >
                        <span style={{ color: isActive ? undefined : level.color }} className="mt-0.5">
                          <Icon className="w-4 h-4" />
                        </span>
                        <div className="flex-1 text-left">
                          <span className="block">{level.name}</span>
                          <span className={`text-xs ${isActive ? "text-navy-800" : "text-navy-500"}`}>
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-navy-300 hover:text-gold-400 bg-navy-900/30 hover:bg-navy-800/50 border border-navy-700 hover:border-gold-500/30 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Mais filtros
        </button>

        {/* Contador de resultados e limpar */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm text-navy-400">
            {totalResults} {totalResults === 1 ? "resultado" : "resultados"}
          </span>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gold-400 hover:text-gold-300 bg-gold-500/10 hover:bg-gold-500/20 rounded-lg border border-gold-500/20 transition-all"
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
            className="flex flex-wrap items-center gap-2 pt-3 border-t border-gold-500/10"
          >
            <span className="text-xs text-navy-500">Filtros ativos:</span>

            {selectedTopic && (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={() => handleTopicClick(selectedTopic.slug)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-navy-100 hover:opacity-80 transition-opacity"
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

            {selectedType && (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={() => handleContentTypeClick(selectedType.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-navy-100 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: `${selectedType.color}30`, borderColor: selectedType.color, border: "1px solid" }}
              >
                {(() => {
                  const Icon = contentTypeIcons[selectedType.id];
                  return <span style={{ color: selectedType.color }}><Icon className="w-3 h-3" /></span>;
                })()}
                {selectedType.name}
                <X className="w-3 h-3 ml-0.5" />
              </motion.button>
            )}

            {selectedLevel && (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={() => handleSkillLevelClick(selectedLevel.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-navy-100 hover:opacity-80 transition-opacity"
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
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-navy-100 bg-navy-700 border border-navy-600 hover:opacity-80 transition-opacity"
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
