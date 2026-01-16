"use client";

import { useState } from "react";
import { Folder, Copy, Check, Monitor, Smartphone, Apple, Globe } from "lucide-react";

type Platform = "windows" | "macos" | "linux" | "ios" | "android" | "web";

interface FilePath {
  platform: Platform;
  path: string;
  description?: string;
}

interface FileLocationProps {
  title: string;
  paths: FilePath[];
  forensicValue?: string;
}

const platformConfig: Record<Platform, { icon: typeof Monitor; label: string; color: string }> = {
  windows: { icon: Monitor, label: "Windows", color: "text-blue-400" },
  macos: { icon: Apple, label: "macOS", color: "text-slate-500 dark:text-gray-400" },
  linux: { icon: Monitor, label: "Linux", color: "text-orange-400" },
  ios: { icon: Smartphone, label: "iOS", color: "text-slate-500 dark:text-gray-400" },
  android: { icon: Smartphone, label: "Android", color: "text-green-400" },
  web: { icon: Globe, label: "Web/Cloud", color: "text-purple-400" },
};

export default function FileLocation({ title, paths, forensicValue }: FileLocationProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (path: string, index: number) => {
    await navigator.clipboard.writeText(path);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="my-6 rounded-xl border border-blue-500/10 bg-white dark:bg-white/50 dark:bg-navy-900/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-navy-900 border-b border-blue-500/10">
        <Folder className="w-5 h-5 text-blue-500" />
        <h4 className="font-medium text-slate-900 dark:text-white">{title}</h4>
      </div>

      {/* Paths */}
      <div className="divide-y divide-blue-500/5">
        {paths.map((item, index) => {
          const config = platformConfig[item.platform] || platformConfig.web;
          const Icon = config.icon;

          return (
            <div key={index} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-1.5 rounded bg-slate-100 dark:bg-navy-800 ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-600 dark:text-navy-300">
                        {config.label}
                      </span>
                    </div>
                    <code className="block text-sm text-blue-400 font-mono break-all bg-white dark:bg-white/50 dark:bg-navy-900/50 px-2 py-1 rounded select-all cursor-text pointer-events-auto [&_a]:pointer-events-none [&_a]:no-underline [&_a]:text-blue-400">
                      <span className="select-all">{item.path}</span>
                    </code>
                    {item.description && (
                      <p className="text-xs text-slate-900 dark:text-navy-500 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(item.path, index)}
                  className="flex-shrink-0 p-1.5 text-slate-500 dark:text-navy-400 hover:text-slate-900 dark:text-white transition-colors rounded hover:bg-slate-100 dark:bg-navy-800"
                  title="Copiar caminho"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Forensic Value */}
      {forensicValue && (
        <div className="px-4 py-3 bg-blue-500/5 border-t border-blue-500/10">
          <p className="text-sm text-blue-400">
            <strong>Valor Forense:</strong>{" "}
            <span className="text-slate-600 dark:text-navy-300">{forensicValue}</span>
          </p>
        </div>
      )}
    </div>
  );
}
