"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Shield, Zap } from "lucide-react";

const ACTIVITIES = [
  { name: "Roberto A.", action: "validou founder antes de investir R$ 2M", time: "agora" },
  { name: "Family Office XYZ", action: "evitou fraude em M&A de R$ 8M", time: "4 min" },
  { name: "VC ABC Partners", action: "recebeu due diligence completo", time: "8 min" },
  { name: "Corporate DEF", action: "validou C-level para contratação", time: "13 min" },
  { name: "Angel Investor GHI", action: "identificou red flags em startup", time: "18 min" }
];

const METRICS = [
  { label: "Investigações", value: 2847, suffix: "", icon: Shield },
  { label: "R$ Protegidos", value: 47, suffix: "M", icon: TrendingUp },
  { label: "Precisão", value: 98, suffix: "%", icon: Zap },
  { label: "Entrega", value: 48, suffix: "h", icon: Users }
];

export default function SocialProof() {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [counters, setCounters] = useState(METRICS.map(() => 0));

  // Rotate activities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % ACTIVITIES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate counters on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters(
        METRICS.map((metric) => Math.floor(metric.value * Math.min(progress, 1)))
      );

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(METRICS.map((m) => m.value));
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-navy-950 border-y border-navy-200 dark:border-navy-800">
      <div className="container max-w-7xl px-4">
        {/* Validation Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500/10 border border-gold-500/30 rounded-full">
            <Shield className="w-5 h-5 text-gold-500" />
            <span className="text-sm font-semibold text-navy-900 dark:text-gold-400">
              Metodologia Validada por Ibsen Maciel - Perito Criminal ANPAJ
            </span>
          </div>
        </div>

        {/* Logo Parade */}
        <div className="mb-16 overflow-hidden">
          <div className="flex items-center gap-12 animate-marquee">
            {["VCs", "Family Offices", "Angel Investors", "Corporate M&A", "Private Equity", "Startups"].map(
              (client, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 text-navy-400 dark:text-navy-600 font-semibold text-lg uppercase tracking-wider"
                >
                  {client}
                </div>
              )
            )}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="mb-16">
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

        {/* Metrics Counter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 dark:bg-gold-500/20 rounded-2xl mb-4 border-2 border-gold-500/30">
                  <Icon className="w-8 h-8 text-gold-600 dark:text-gold-400" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white mb-2">
                  {counters[i]}
                  {metric.suffix}
                </div>
                <div className="text-navy-600 dark:text-navy-300 font-medium">
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
