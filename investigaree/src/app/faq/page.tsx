"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const faqs = [
  {
    categoria: "Sobre os Serviços",
    perguntas: [
      {
        pergunta: "O que é due diligence?",
        resposta: "Due diligence é um processo de investigação e análise detalhada realizado antes de tomar uma decisão importante, como investir em uma empresa, contratar um executivo ou fechar um negócio. Nosso serviço verifica antecedentes, situação financeira, processos judiciais, reputação e outros fatores de risco."
      },
      {
        pergunta: "Quanto tempo leva uma investigação?",
        resposta: "Depende do tipo de serviço. O Red Flag Express é entregue em até 48 horas. Due diligence corporativa completa leva de 5 a 7 dias úteis. Investigações mais complexas podem levar até 15 dias, dependendo da profundidade necessária."
      },
      {
        pergunta: "Vocês atuam em todo o Brasil?",
        resposta: "Sim, atuamos em todo o território nacional. Nossa metodologia combina análise de fontes abertas (OSINT), acesso a bases de dados oficiais e, quando necessário, investigação de campo através de nossa rede de parceiros em todos os estados."
      },
      {
        pergunta: "Quais tipos de investigação vocês realizam?",
        resposta: "Realizamos due diligence corporativa, verificação de antecedentes de pessoas físicas e jurídicas, investigação de fraudes, análise de risco para investimentos, checagem de funcionários domésticos, proteção digital familiar e investigações especiais sob demanda."
      }
    ]
  },
  {
    categoria: "Metodologia e Qualidade",
    perguntas: [
      {
        pergunta: "Como funciona a metodologia de vocês?",
        resposta: "Nossa metodologia foi validada por perito criminal oficial e segue padrões de perícia forense. Utilizamos análise de fontes abertas (OSINT), consulta a bases de dados oficiais, análise de redes sociais, verificação de documentos e, quando necessário, entrevistas e investigação de campo."
      },
      {
        pergunta: "As informações obtidas são legais?",
        resposta: "Absolutamente. Trabalhamos exclusivamente com fontes legais e métodos éticos. Não acessamos informações protegidas sem autorização, não realizamos grampos ou interceptações, e todas as nossas práticas estão em conformidade com a LGPD e o Marco Civil da Internet."
      },
      {
        pergunta: "Quem é o Advisory Board?",
        resposta: "Nosso Advisory Board é composto por especialistas de alto nível que validam nossa metodologia. Inclui Ibsen Rodrigues Maciel, Perito Criminal Oficial e referência nacional em Forense Computacional. Foi 1º lugar no concurso da Polícia Científica do Pará (2019) e 1º lugar como Oficial do Exército (2017/18). Atualmente é Diretor Nacional de Perícias em Computação Forense da ANPAJ e membro do Comitê do Instituto de Defesa Cibernética."
      },
      {
        pergunta: "Qual a diferença entre vocês e um detetive particular comum?",
        resposta: "Nosso diferencial é a metodologia forense validada por perito criminal oficial, o uso de tecnologia avançada de análise de dados, a expertise em investigações corporativas e digitais, e a entrega de relatórios estruturados com evidências documentadas."
      }
    ]
  },
  {
    categoria: "Contratação e Pagamento",
    perguntas: [
      {
        pergunta: "Como faço para contratar um serviço?",
        resposta: "Entre em contato conosco pelo WhatsApp. Nossa equipe irá entender sua necessidade, apresentar a melhor solução e enviar uma proposta personalizada. Após aprovação e pagamento, iniciamos o trabalho imediatamente."
      },
      {
        pergunta: "Quais são as formas de pagamento?",
        resposta: "Aceitamos PIX, transferência bancária e cartão de crédito. Para projetos maiores, podemos negociar condições especiais de pagamento."
      },
      {
        pergunta: "Vocês emitem nota fiscal?",
        resposta: "Sim, emitimos nota fiscal para todos os serviços prestados."
      },
      {
        pergunta: "Existe garantia de resultado?",
        resposta: "Garantimos a qualidade e profundidade da investigação, seguindo nossa metodologia validada. Entretanto, não podemos garantir que encontraremos informações negativas sobre alguém - a ausência de red flags também é um resultado válido e importante."
      }
    ]
  },
  {
    categoria: "Privacidade e Confidencialidade",
    perguntas: [
      {
        pergunta: "As investigações são sigilosas?",
        resposta: "Sim, mantemos sigilo absoluto sobre todas as investigações. Não revelamos a identidade de nossos clientes nem compartilhamos informações com terceiros. Nossos relatórios são entregues de forma segura e criptografada."
      },
      {
        pergunta: "O investigado fica sabendo da investigação?",
        resposta: "Não. Nossas investigações são realizadas de forma discreta, utilizando principalmente análise de fontes públicas e bases de dados. O investigado não é contatado e não fica sabendo que está sendo verificado."
      },
      {
        pergunta: "Vocês estão em conformidade com a LGPD?",
        resposta: "Sim, todos os nossos processos estão em conformidade com a Lei Geral de Proteção de Dados (LGPD). Tratamos dados pessoais apenas quando há base legal adequada e mantemos políticas rígidas de segurança da informação."
      },
      {
        pergunta: "Por quanto tempo vocês guardam os dados?",
        resposta: "Mantemos os dados pelo tempo necessário para cumprir obrigações legais e contratuais. Após esse período, os dados são eliminados de forma segura. Você pode solicitar a exclusão de seus dados a qualquer momento."
      }
    ]
  },
  {
    categoria: "Casos Específicos",
    perguntas: [
      {
        pergunta: "Vocês investigam pessoas físicas ou só empresas?",
        resposta: "Investigamos tanto pessoas físicas quanto jurídicas. Oferecemos serviços de verificação de antecedentes pessoais, checagem de funcionários, due diligence de founders e sócios, além de análise de empresas."
      },
      {
        pergunta: "Posso usar o relatório de vocês como prova judicial?",
        resposta: "Nossos relatórios são documentos técnicos detalhados que podem servir como elemento de convicção. Para uso como prova pericial em processos judiciais, recomendamos a contratação de um perito judicial que pode utilizar nossas informações como base."
      },
      {
        pergunta: "Vocês investigam infidelidade conjugal?",
        resposta: "Nosso foco principal é em investigações corporativas, due diligence e proteção patrimonial. Para casos de natureza pessoal, podemos avaliar a demanda e indicar a melhor abordagem dentro dos limites legais e éticos."
      },
      {
        pergunta: "Vocês fazem recuperação de dados de celular?",
        resposta: "Não realizamos serviços de perícia em dispositivos eletrônicos diretamente. Nosso Advisory Board inclui especialistas em forense computacional que podem orientar sobre esse tipo de necessidade através dos canais oficiais."
      }
    ]
  }
];

function FAQItem({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-navy-800 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:text-primary-400 transition-colors"
      >
        <span className="text-white font-medium pr-4">{pergunta}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-primary-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/60 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-white/70 leading-relaxed">
          {resposta}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy-950 pt-20">
        {/* Header */}
        <section className="bg-navy-900 border-b border-navy-800">
          <div className="container max-w-4xl mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition mb-4">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>
            <div className="flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-primary-400" />
              <h1 className="text-2xl font-bold text-white">Perguntas Frequentes</h1>
            </div>
            <p className="text-white/60 mt-2">Tire suas dúvidas sobre nossos serviços</p>
          </div>
        </section>

        {/* Content */}
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-12">
            {faqs.map((categoria, index) => (
              <div key={index}>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-bold">
                    {index + 1}
                  </span>
                  {categoria.categoria}
                </h2>
                <div className="bg-navy-900 rounded-xl border border-navy-800 px-6">
                  {categoria.perguntas.map((item, i) => (
                    <FAQItem key={i} pergunta={item.pergunta} resposta={item.resposta} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-white/70 mb-4">Não encontrou o que procurava?</p>
            <WhatsAppButton
              message="Olá! Tenho uma dúvida sobre os serviços da investigaree."
              source="faq"
              className="font-bold"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Fale conosco pelo WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
