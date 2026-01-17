"use client";

import { Users, Building2, ArrowLeftRight } from "lucide-react";

export type GroupFilter = "todos" | "comurg" | "cedidos";

interface GroupTabsProps {
  activeTab: GroupFilter;
  onTabChange: (tab: GroupFilter) => void;
  counts?: {
    todos: number;
    comurg: number;
    cedidos: number;
  };
}

export function GroupTabs({ activeTab, onTabChange, counts }: GroupTabsProps) {
  const tabs: Array<{ id: GroupFilter; label: string; icon: React.ElementType }> = [
    { id: "todos", label: "Todos", icon: Users },
    { id: "comurg", label: "COMURG", icon: Building2 },
    { id: "cedidos", label: "Cedidos", icon: ArrowLeftRight },
  ];

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const count = counts?.[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-green-500 text-white shadow-md"
                : "bg-navy-800 border border-navy-700 text-white/70 hover:bg-navy-700 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {count !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-navy-700 text-white/60"
                }`}
              >
                {count.toLocaleString("pt-BR")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Função auxiliar para filtrar dados por grupo
 */
export function filterByGroup<T extends { grupo?: string }>(
  data: T[],
  activeTab: GroupFilter
): T[] {
  if (activeTab === "todos") return data;

  return data.filter((item) => {
    const grupo = String(item.grupo || "").toUpperCase();

    if (activeTab === "comurg") {
      return grupo === "COMURG" || grupo.includes("COMURG");
    }

    if (activeTab === "cedidos") {
      return (
        grupo === "DISPOSICAO" ||
        grupo.includes("DISPOSICAO") ||
        grupo.includes("CEDIDOS")
      );
    }

    return true;
  });
}

/**
 * Função auxiliar para calcular contadores por grupo
 */
export function getGroupCounts<T extends { grupo?: string }>(data: T[]): {
  todos: number;
  comurg: number;
  cedidos: number;
} {
  const comurg = data.filter((item) => {
    const grupo = String(item.grupo || "").toUpperCase();
    return grupo === "COMURG" || grupo.includes("COMURG");
  }).length;

  const cedidos = data.filter((item) => {
    const grupo = String(item.grupo || "").toUpperCase();
    return (
      grupo === "DISPOSICAO" ||
      grupo.includes("DISPOSICAO") ||
      grupo.includes("CEDIDOS")
    );
  }).length;

  return {
    todos: data.length,
    comurg,
    cedidos,
  };
}

