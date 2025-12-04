"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  FileText,
  Newspaper,
  GraduationCap,
  Briefcase,
  Star,
  Mic,
  BookOpen,
  Play,
  Headphones,
  BookMarked,
  FlaskConical,
  ShieldAlert,
  Smartphone,
  Zap,
  Scale,
  Wrench,
  TrendingUp,
  Sprout,
  Flame,
  Rocket,
  LayoutGrid,
  Layers,
  BarChart3,
  Shield,
  UserCheck,
  Home,
  Building2,
  AlertTriangle,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BlogFilters as FilterType,
  BlogTopic,
  ContentType,
  SkillLevel,
  BLOG_TOPICS,
  CONTENT_TYPES,
  SKILL_LEVELS,
  ContentTypeInfo,
  SkillLevelInfo
} from "@/types/blog";

// Mapeamento de ícones
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Newspaper,
  GraduationCap,
  Briefcase,
  Star,
  Mic,
  BookOpen,
  Play,
  Headphones,
  BookMarked,
  FlaskConical,
  ShieldAlert,
  Search,
  Smartphone,
  Zap,
  Scale,
  Wrench,
  TrendingUp,
  Sprout,
  Flame,
  Rocket
};

interface BlogFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  topics?: BlogTopic[];
  contentTypes?: ContentTypeInfo[];
  skillLevels?: SkillLevelInfo[];
}

export default function BlogFiltersComponent({
  filters,
  onFiltersChange,
  topics = BLOG_TOPICS,
  contentTypes = CONTENT_TYPES,
  skillLevels = SKILL_LEVELS
}: BlogFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [activeTab, setActiveTab] = useState<"topic" | "type" | "level">("topic");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchValue });
  };

  const handleTopicClick = (topicSlug: string) => {
    if (filters.topic === topicSlug) {
      onFiltersChange({ ...filters, topic: undefined });
    } else {
      onFiltersChange({ ...filters, topic: topicSlug });
    }
  };

  const handleContentTypeClick = (contentType: ContentType) => {
    if (filters.contentType === contentType) {
      onFiltersChange({ ...filters, contentType: undefined });
    } else {
      onFiltersChange({ ...filters, contentType: contentType });
    }
  };

  const handleSkillLevelClick = (level: SkillLevel) => {
    if (filters.skillLevel === level) {
      onFiltersChange({ ...filters, skillLevel: undefined });
    } else {
      onFiltersChange({ ...filters, skillLevel: level });
    }
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({});
  };

  const activeFiltersCount = [
    filters.topic,
    filters.contentType,
    filters.skillLevel,
    filters.search
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent || FileText;
  };

  return (
    <div className="space-y-4">
      {/* Barra de busca e toggle de filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Busca */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
            <Input
              type="text"
              placeholder="Buscar artigos, tutoriais, cases..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 bg-navy-900/50 border-gold-500/20 text-white placeholder:text-navy-400 focus:border-gold-500/50"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  onFiltersChange({ ...filters, search: undefined });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Botão de filtros */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`border-gold-500/30 text-navy-200 hover:bg-gold-500/10 hover:text-gold-400 ${
            isExpanded || hasActiveFilters ? "border-gold-500/50 bg-gold-500/5" : ""
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <Badge className="ml-2 bg-gold-500 text-navy-950 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </Button>

        {/* Limpar filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-navy-400 hover:text-white hover:bg-navy-800"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Painel de filtros expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-navy-900/30 rounded-xl border border-gold-500/10">
              {/* Tabs de filtros */}
              <div className="flex flex-wrap gap-2 mb-5 pb-4 border-b border-gold-500/10">
                <button
                  onClick={() => setActiveTab("topic")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "topic"
                      ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                      : "text-navy-300 hover:bg-navy-800/50 border border-transparent"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Tópicos
                  {filters.topic && (
                    <span className="w-2 h-2 rounded-full bg-gold-500" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("type")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "type"
                      ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                      : "text-navy-300 hover:bg-navy-800/50 border border-transparent"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Tipo de Conteúdo
                  {filters.contentType && (
                    <span className="w-2 h-2 rounded-full bg-gold-500" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("level")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "level"
                      ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                      : "text-navy-300 hover:bg-navy-800/50 border border-transparent"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Nível
                  {filters.skillLevel && (
                    <span className="w-2 h-2 rounded-full bg-gold-500" />
                  )}
                </button>
              </div>

              {/* Conteúdo das tabs */}
              <AnimatePresence mode="wait">
                {/* Tópicos */}
                {activeTab === "topic" && (
                  <motion.div
                    key="topic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs text-navy-500 mb-3">
                      Filtre por área de conhecimento
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                      {topics.sort((a, b) => a.order - b.order).map((topic) => {
                        const Icon = getIcon(topic.icon);
                        const isActive = filters.topic === topic.slug;
                        return (
                          <motion.button
                            key={topic.id}
                            onClick={() => handleTopicClick(topic.slug)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                              isActive
                                ? "text-navy-950"
                                : "text-navy-200 hover:text-white bg-navy-800/30 hover:bg-navy-800/50"
                            }`}
                            style={{
                              backgroundColor: isActive ? topic.color : undefined,
                              borderColor: topic.color,
                              border: `1px solid ${isActive ? topic.color : `${topic.color}30`}`
                            }}
                          >
                            <span className="flex-shrink-0" style={{ color: isActive ? undefined : topic.color }}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="truncate">{topic.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    {filters.topic && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-navy-400 mt-3 bg-navy-800/30 rounded-lg p-3"
                      >
                        {topics.find((t) => t.slug === filters.topic)?.description}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* Tipos de conteúdo */}
                {activeTab === "type" && (
                  <motion.div
                    key="type"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs text-navy-500 mb-3">
                      Filtre por formato de conteúdo
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                      {contentTypes.map((type) => {
                        const Icon = getIcon(type.icon);
                        const isActive = filters.contentType === type.id;
                        return (
                          <motion.button
                            key={type.id}
                            onClick={() => handleContentTypeClick(type.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                              isActive
                                ? "text-navy-950"
                                : "text-navy-200 hover:text-white bg-navy-800/30 hover:bg-navy-800/50"
                            }`}
                            style={{
                              backgroundColor: isActive ? type.color : undefined,
                              borderColor: type.color,
                              border: `1px solid ${isActive ? type.color : `${type.color}30`}`
                            }}
                          >
                            <span className="flex-shrink-0" style={{ color: isActive ? undefined : type.color }}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="truncate">{type.namePlural}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                    {filters.contentType && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-navy-400 mt-3 bg-navy-800/30 rounded-lg p-3"
                      >
                        {contentTypes.find((t) => t.id === filters.contentType)?.description}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* Níveis */}
                {activeTab === "level" && (
                  <motion.div
                    key="level"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs text-navy-500 mb-3">
                      Filtre por nível de complexidade
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {skillLevels.map((level) => {
                        const Icon = getIcon(level.icon);
                        const isActive = filters.skillLevel === level.id;
                        return (
                          <motion.button
                            key={level.id}
                            onClick={() => handleSkillLevelClick(level.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all ${
                              isActive
                                ? "text-navy-950"
                                : "text-navy-200 hover:text-white bg-navy-800/30 hover:bg-navy-800/50"
                            }`}
                            style={{
                              backgroundColor: isActive ? level.color : undefined,
                              borderColor: level.color,
                              border: `1px solid ${isActive ? level.color : `${level.color}30`}`
                            }}
                          >
                            <div
                              className={`p-2 rounded-lg ${isActive ? "bg-white/20" : ""}`}
                              style={{
                                backgroundColor: isActive ? undefined : `${level.color}20`,
                                color: isActive ? undefined : level.color
                              }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold">{level.name}</p>
                              <p className={`text-xs ${isActive ? "text-navy-800" : "text-navy-400"}`}>
                                {level.description}
                              </p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tags de filtros ativos (modo compacto) */}
      {!isExpanded && hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2"
        >
          {filters.topic && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: `${topics.find((t) => t.slug === filters.topic)?.color}20`,
                color: topics.find((t) => t.slug === filters.topic)?.color,
                borderColor: topics.find((t) => t.slug === filters.topic)?.color
              }}
              onClick={() => handleTopicClick(filters.topic!)}
            >
              {topics.find((t) => t.slug === filters.topic)?.name}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filters.contentType && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: `${contentTypes.find((t) => t.id === filters.contentType)?.color}20`,
                color: contentTypes.find((t) => t.id === filters.contentType)?.color
              }}
              onClick={() => handleContentTypeClick(filters.contentType!)}
            >
              {contentTypes.find((t) => t.id === filters.contentType)?.name}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filters.skillLevel && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: `${skillLevels.find((l) => l.id === filters.skillLevel)?.color}20`,
                color: skillLevels.find((l) => l.id === filters.skillLevel)?.color
              }}
              onClick={() => handleSkillLevelClick(filters.skillLevel!)}
            >
              {skillLevels.find((l) => l.id === filters.skillLevel)?.name}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filters.search && (
            <Badge
              variant="secondary"
              className="bg-navy-700 text-navy-200 cursor-pointer hover:bg-navy-600"
              onClick={() => {
                setSearchValue("");
                onFiltersChange({ ...filters, search: undefined });
              }}
            >
              &ldquo;{filters.search}&rdquo;
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  );
}
