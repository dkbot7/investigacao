"use client";

import { useEffect, useState } from "react";
import { Shield, Building2, Briefcase, Users, Home } from "lucide-react";

const ACTIVITIES = [
  { name: "Investidor", action: "validou startup antes de investir", time: "agora" },
  { name: "Family Office", action: "concluiu due diligence de M&A", time: "4 min" },
  { name: "Empresa", action: "verificou candidato C-level", time: "8 min" },
  { name: "Família", action: "checou funcionário doméstico", time: "13 min" },
  { name: "Angel Investor", action: "identificou red flags em founder", time: "18 min" }
];

const CLIENTS = [
  { name: "Investidores", icon: Briefcase },
  { name: "Family Offices", icon: Building2 },
  { name: "Empresas", icon: Building2 },
  { name: "Famílias", icon: Home },
  { name: "Startups", icon: Users }
];

export default function SocialProof() {
  const [currentActivity, setCurrentActivity] = useState(0);

  // Rotate activities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % ACTIVITIES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-navy-950 border-y border-navy-200 dark:border-navy-800">
      <div className="container max-w-7xl px-4">
        {/* Quem Atendemos */}
        <div className="text-center mb-10">
          <h3 className="text-lg font-semibold text-navy-600 dark:text-navy-300 mb-6">
            Quem protegemos
          </h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {CLIENTS.map((client, i) => {
              const Icon = client.icon;
              return (
                <div key={i} className="flex items-center gap-2 text-navy-500 dark:text-navy-400">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{client.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-navy-900 border-2 border-gold-500/30 rounded-2xl p-6 shadow-lg transition-all duration-500">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 gradient-premium rounded-full flex items-center justify-center text-navy-950 font-bold">
                    {ACTIVITIES[currentActivity].name.charAt(0)}
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-success border-2 border-white dark:border-navy-900"></span>
                  </span>
                </div>

                <div className="flex-1">
                  <p className="text-navy-900 dark:text-white font-medium">
                    {ACTIVITIES[currentActivity].name}{" "}
                    <span className="text-navy-600 dark:text-navy-300 font-normal">
                      {ACTIVITIES[currentActivity].action}
                    </span>
                  </p>
                  <p className="text-sm text-navy-500 dark:text-navy-400">
                    há {ACTIVITIES[currentActivity].time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
