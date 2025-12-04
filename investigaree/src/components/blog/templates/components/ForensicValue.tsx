"use client";

import { motion } from "framer-motion";
import { Shield, FileSearch, MapPin, CreditCard, Users, Clock, Database, Key } from "lucide-react";

type EvidenceIcon = "location" | "payment" | "users" | "time" | "data" | "auth" | "search" | "shield";

interface Evidence {
  icon: EvidenceIcon;
  title: string;
  description: string;
}

interface ForensicValueProps {
  title?: string;
  description?: string;
  evidences: Evidence[];
  className?: string;
}

const iconMap: Record<EvidenceIcon, typeof Shield> = {
  location: MapPin,
  payment: CreditCard,
  users: Users,
  time: Clock,
  data: Database,
  auth: Key,
  search: FileSearch,
  shield: Shield
};

/**
 * Componente ForensicValue - Seção "Valor Forense" para tutoriais
 * Inspirado no template da Forensafe "Digital Forensics Value"
 *
 * Exemplo de uso:
 * <ForensicValue
 *   title="Valor Forense do WhatsApp"
 *   description="O WhatsApp armazena dados valiosos para investigações..."
 *   evidences={[
 *     { icon: "users", title: "Contatos", description: "Lista completa de contatos..." },
 *     { icon: "time", title: "Histórico de Mensagens", description: "Mensagens com timestamps..." },
 *     { icon: "location", title: "Localização", description: "Dados de geolocalização compartilhados..." }
 *   ]}
 * />
 */
export default function ForensicValue({
  title = "Valor Forense",
  description,
  evidences,
  className = ""
}: ForensicValueProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`py-8 ${className}`}
    >
      {/* Cabeçalho da seção */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-emerald-500/20">
          <Shield className="w-5 h-5 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>

      {description && (
        <p className="text-navy-300 mb-6 text-lg leading-relaxed">
          {description}
        </p>
      )}

      {/* Grid de evidências */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidences.map((evidence, index) => {
          const Icon = iconMap[evidence.icon];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-xl bg-navy-900/50 border border-gold-500/10 hover:border-emerald-500/30 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {evidence.title}
                  </h3>
                  <p className="text-sm text-navy-400 leading-relaxed">
                    {evidence.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
