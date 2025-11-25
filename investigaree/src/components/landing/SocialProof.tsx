import { Building2, Briefcase, Users, Home, Shield } from "lucide-react";

const CLIENTS = [
  { name: "Investidores", icon: Briefcase, desc: "Angel investors e VCs" },
  { name: "Family Offices", icon: Building2, desc: "Gestão patrimonial" },
  { name: "Empresas", icon: Shield, desc: "Due diligence corporativa" },
  { name: "Famílias", icon: Home, desc: "Proteção pessoal" },
  { name: "Startups", icon: Users, desc: "Verificação de sócios" }
];

export default function SocialProof() {
  return (
    <section className="py-16 bg-white dark:bg-navy-950 border-y border-navy-200 dark:border-navy-800">
      <div className="container max-w-7xl px-4">
        {/* Quem Atendemos */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-navy-600 dark:text-navy-300 mb-8">
            Quem protegemos
          </h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {CLIENTS.map((client, i) => {
              const Icon = client.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-2 text-navy-500 dark:text-navy-400">
                  <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gold-500" />
                  </div>
                  <span className="font-medium text-navy-700 dark:text-navy-200">{client.name}</span>
                  <span className="text-xs text-navy-400 dark:text-navy-500">{client.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
