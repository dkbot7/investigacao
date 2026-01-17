"use client";

import { motion } from "framer-motion";
import { FolderTree, Copy, Check, Apple, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";

type Platform = "ios" | "android" | "windows" | "macos" | "linux";

interface Artifact {
  name: string;
  path: string;
  description?: string;
  platform: Platform;
}

interface ArtifactLocationProps {
  title?: string;
  description?: string;
  artifacts: Artifact[];
  className?: string;
}

const platformConfig: Record<Platform, { icon: typeof Monitor; label: string; color: string }> = {
  ios: { icon: Apple, label: "iOS", color: "text-slate-500 dark:text-gray-400" },
  android: { icon: Smartphone, label: "Android", color: "text-green-500" },
  windows: { icon: Monitor, label: "Windows", color: "text-green-500" },
  macos: { icon: Apple, label: "macOS", color: "text-slate-500 dark:text-gray-400" },
  linux: { icon: Monitor, label: "Linux", color: "text-orange-500" }
};

/**
 * Componente ArtifactLocation - Localização de Artefatos no Sistema
 * Inspirado no template da Forensafe "Location and Structure of Artifacts"
 *
 * Exemplo de uso:
 * <ArtifactLocation
 *   title="Localização dos Artefatos do WhatsApp no iOS"
 *   artifacts={[
 *     {
 *       name: "Banco de dados principal",
 *       path: "/private/var/mobile/Containers/Shared/AppGroup/.../ChatStorage.sqlite",
 *       description: "Contém mensagens, contatos e metadados",
 *       platform: "ios"
 *     },
 *     {
 *       name: "Mídia",
 *       path: "/private/var/mobile/Containers/Shared/AppGroup/.../Media/",
 *       platform: "ios"
 *     }
 *   ]}
 * />
 */
export default function ArtifactLocation({
  title = "Localização dos Artefatos",
  description,
  artifacts,
  className = ""
}: ArtifactLocationProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (path: string, index: number) => {
    await navigator.clipboard.writeText(path);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Agrupar por plataforma
  const groupedArtifacts = artifacts.reduce((acc, artifact) => {
    if (!acc[artifact.platform]) {
      acc[artifact.platform] = [];
    }
    acc[artifact.platform].push(artifact);
    return acc;
  }, {} as Record<Platform, Artifact[]>);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`py-8 ${className}`}
    >
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <FolderTree className="w-5 h-5 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>

      {description && (
        <p className="text-slate-600 dark:text-navy-300 mb-6 text-lg leading-relaxed">
          {description}
        </p>
      )}

      {/* Lista de artefatos por plataforma */}
      <div className="space-y-6">
        {Object.entries(groupedArtifacts).map(([platform, platformArtifacts]) => {
          const config = platformConfig[platform as Platform];
          const PlatformIcon = config.icon;

          return (
            <div key={platform}>
              {/* Badge da plataforma */}
              <div className="flex items-center gap-2 mb-3">
                <PlatformIcon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm font-medium text-slate-500 dark:text-navy-400">{config.label}</span>
              </div>

              {/* Lista de paths */}
              <div className="space-y-3">
                {platformArtifacts.map((artifact, index) => {
                  const globalIndex = artifacts.indexOf(artifact);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative"
                    >
                      <div className="p-4 rounded-lg bg-white dark:bg-white/70 dark:bg-navy-900/70 border border-green-500/10 hover:border-purple-500/30 transition-colors">
                        {/* Nome do artefato */}
                        <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                          {artifact.name}
                        </p>

                        {/* Path com botão de copiar */}
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs sm:text-sm font-mono text-purple-400 bg-slate-50 dark:bg-navy-950/50 px-3 py-2 rounded overflow-x-auto">
                            {artifact.path}
                          </code>
                          <button
                            onClick={() => handleCopy(artifact.path, globalIndex)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-navy-700 text-slate-500 dark:text-navy-400 hover:text-slate-900 dark:text-white transition-colors flex-shrink-0"
                            title="Copiar caminho"
                          >
                            {copiedIndex === globalIndex ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Descrição opcional */}
                        {artifact.description && (
                          <p className="mt-2 text-xs text-slate-900 dark:text-navy-500">
                            {artifact.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

