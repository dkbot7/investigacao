import { Suspense } from 'react';
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Shield, Users, Target, Award, Clock, TrendingUp } from 'lucide-react';

// Partial Prerendering disabled (requires Next.js canary)
// export const experimental_ppr = true;

// Revalidate every hour
export const revalidate = 3600;

// Static metadata
export const metadata = {
  title: 'Sobre - Investigaree',
  description: 'Conheça a Investigaree, líder em inteligência de investigação digital no Brasil.',
};

// Static component - Pre-rendered
function StaticAboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sobre a <span className="text-green-500">Investigaree</span>
            </h1>
            <p className="text-xl text-gray-600">
              Transformando a forma como investigações digitais são conduzidas no Brasil
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 border rounded-lg">
              <Shield className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Nossa Missão</h3>
              <p className="text-gray-600">
                Democratizar o acesso à inteligência de investigação digital, fornecendo
                ferramentas profissionais baseadas em dados públicos do governo brasileiro.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <Target className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Nossa Visão</h3>
              <p className="text-gray-600">
                Ser a plataforma líder em investigação digital no Brasil, reconhecida pela
                excelência técnica e conformidade com LGPD.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <Users className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Nossos Valores</h3>
              <p className="text-gray-600">
                Transparência, ética, privacidade, inovação e compromisso com a conformidade
                legal em todas as nossas operações.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <Award className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Nossa Expertise</h3>
              <p className="text-gray-600">
                Combinamos profissional digital, análise de dados e compliance para entregar
                resultados precisos e confiáveis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Dynamic component - Streamed via Suspense
async function DynamicStatsSection() {
  // Simulate async data fetching
  // In production, this would fetch from API or database
  await new Promise(resolve => setTimeout(resolve, 100));

  const stats = [
    {
      icon: Users,
      value: '10K+',
      label: 'Usuários Ativos',
      trend: '+25% este mês',
    },
    {
      icon: TrendingUp,
      value: '500K+',
      label: 'Investigações Realizadas',
      trend: '+40% crescimento',
    },
    {
      icon: Clock,
      value: '< 2s',
      label: 'Tempo Médio de Resposta',
      trend: '99.9% uptime',
    },
    {
      icon: Shield,
      value: '100%',
      label: 'Conformidade LGPD',
      trend: 'Certificado',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossa Performance</h2>
            <p className="text-gray-600">
              Números que demonstram nosso compromisso com a excelência
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <Icon className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-600 mb-2">{stat.label}</div>
                  <div className="text-xs text-green-600">{stat.trend}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Fallback component for Suspense
function StatsFallback() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="h-8 w-8 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Static content - Pre-rendered */}
        <StaticAboutSection />

        {/* Dynamic content - Streamed via Suspense */}
        <Suspense fallback={<StatsFallback />}>
          <DynamicStatsSection />
        </Suspense>

        {/* Team section - Static */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Nossa Equipe</h2>
              <p className="text-gray-600 mb-8">
                Profissionais experientes em profissional digital, segurança da informação e compliance
              </p>
              <p className="text-gray-600">
                Nossa equipe é composta por especialistas certificados em análise profissional digital,
                com vasta experiência em investigações corporativas, compliance regulatório e
                segurança cibernética.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

