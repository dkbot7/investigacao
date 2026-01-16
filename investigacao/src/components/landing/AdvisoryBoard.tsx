"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, UserCheck } from "lucide-react";

export default function AdvisoryBoard() {
  return (
    <section className="py-24 bg-gradient-hero text-slate-900 dark:text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.1),transparent_50%)]" />

      <div className="container max-w-7xl px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <Badge
            variant="outline"
            className="mb-4 bg-blue-500/20 border-blue-500/50 text-blue-400 px-6 py-2 text-sm font-semibold"
          >
            <Shield className="w-4 h-4 mr-2 inline" />
            Nosso Time
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold">
            Expertise em Investigação Digital
          </h2>
          <p className="text-xl text-slate-800 dark:text-navy-100 max-w-3xl mx-auto">
            Equipe especializada em <span className="text-blue-400">automação de dados</span> e <span className="text-blue-400">investigação digital</span>
          </p>
        </div>

        {/* Expertise Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1: Automação */}
          <Card className="bg-white/5 backdrop-blur-lg border-2 border-blue-500/30 shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-5 text-center">
                <Database className="w-16 h-16 mx-auto text-blue-400" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Automação
                </h3>
                <p className="text-slate-700 dark:text-navy-200 text-sm">
                  Processamento automatizado de <span className="text-blue-400 font-semibold">100k+ registros</span> simultâneos em múltiplas bases de dados públicas.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["APIs Públicas", "Web Scraping", "OSINT"].map((tech, i) => (
                    <Badge key={i} className="bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Análise */}
          <Card className="bg-white/5 backdrop-blur-lg border-2 border-blue-500/30 shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-5 text-center">
                <UserCheck className="w-16 h-16 mx-auto text-blue-400" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Análise de Dados
                </h3>
                <p className="text-slate-700 dark:text-navy-200 text-sm">
                  Cruzamento inteligente de dados de <span className="text-blue-400 font-semibold">múltiplas fontes públicas</span> para investigações completas.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Due Diligence", "Compliance", "LGPD"].map((area, i) => (
                    <Badge key={i} className="bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Tecnologia */}
          <Card className="bg-white/5 backdrop-blur-lg border-2 border-blue-500/30 shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-5 text-center">
                <Shield className="w-16 h-16 mx-auto text-blue-400" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Segurança
                </h3>
                <p className="text-slate-700 dark:text-navy-200 text-sm">
                  Proteção de dados e <span className="text-blue-400 font-semibold">conformidade LGPD</span> em todas as etapas da investigação.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Criptografia", "Auditoria", "Privacidade"].map((feat, i) => (
                    <Badge key={i} className="bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white text-xs">
                      {feat}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
}
