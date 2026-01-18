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
        pergunta: "Quais tipos de investigação vocês realizam?",
        resposta: "Atendemos 6 públicos principais: (1) RH & Compliance - background check de candidatos; (2) Investidores - due diligence M&A e análise de empresas; (3) Advogados - coleta de provas digitais profissionais; (4) Divórcio & Família - investigação patrimonial; (5) Auditores Públicos - compliance em licitações; (6) Vítimas de Exposição - remoção de conteúdo LGPD. Cada serviço é adaptado à necessidade específica."
      },
      {
        pergunta: "Vocês atendem empresas e pessoas físicas?",
        resposta: "Sim! Atendemos tanto empresas (RH, investidores, auditores) quanto pessoas físicas (divórcios, vítimas de exposição digital). Nossos serviços B2B incluem background check profissional e due diligence. Serviços B2C incluem investigação patrimonial, remoção de conteúdo e proteção de privacidade. Também atendemos advogados com perícia profissional."
      },
      {
        pergunta: "Quanto tempo leva uma investigação?",
        resposta: "Varia por serviço: Background check de pessoas (24-48h), Background check de empresas (48-72h), Due diligence M&A completa (7-15 dias), Remoção emergencial de conteúdo (24-72h), Investigação profissional profissional (10-15 dias), Investigação patrimonial (7-10 dias), Auditoria de licitações (3-5 dias). Casos urgentes podem ter prioridade."
      },
      {
        pergunta: "Quanto custa uma investigação?",
        resposta: "Varia por complexidade: Background check de pessoas (a partir de R$ 500), Background check de empresas (a partir de R$ 1.500), Due diligence M&A (sob consulta), Remoção emergencial (a partir de R$ 800), Remoção direcionada (a partir de R$ 1.500), Perícia profissional (sob consulta). Entre em contato para orçamento personalizado."
      },
      {
        pergunta: "O que é due diligence?",
        resposta: "Due diligence é uma investigação profunda antes de decisões importantes: contratar executivos, investir em startups, comprar empresas, aceitar sócios ou firmar parcerias. Verificamos antecedentes criminais em 27 tribunais, processos judiciais, sanções governamentais (CEIS/CNEP), situação fiscal, participações societárias e red flags. Ideal para RH, investidores e M&A."
      },
      {
        pergunta: "Vocês atuam em todo o Brasil?",
        resposta: "Sim, atuamos em todo o território nacional. Nossa metodologia digital nos permite investigar em qualquer estado através de fontes oficiais do governo: 27 Tribunais de Justiça, Receita Federal, TSE, CNJ, TCU, CGU, CEIS, CNEP e centenas de outras bases públicas. Para casos especiais, temos rede de parceiros em campo."
      }
    ]
  },
  {
    categoria: "Metodologia e Qualidade",
    perguntas: [
      {
        pergunta: "Como funciona a conformidade com a LGPD?",
        resposta: "100% conformes com a LGPD. Utilizamos exclusivamente dados de fontes públicas (OSINT) - tribunais, Receita Federal, órgãos governamentais - base legal: Art. 7º, VI (exercício regular de direitos). Interesse legítimo para prevenção de fraudes e proteção de crédito (Art. 7º, IX). Quando necessário consentimento (perícia de dispositivos próprios), é obtido de forma livre e informada. Consulte nossa página /lgpd."
      },
      {
        pergunta: "Quais fontes de dados vocês usam?",
        resposta: "Apenas fontes oficiais do governo brasileiro: 27 Tribunais de Justiça estaduais, CNJ (Conselho Nacional de Justiça), TSE (Tribunal Superior Eleitoral), Receita Federal (CPF/CNPJ), CEIS (Cadastro de Empresas Inidôneas), CNEP (Cadastro de Entidades Punidas), TCU (Tribunal de Contas da União), CGU (Controladoria-Geral da União), OFAC (sanções internacionais), Juntas Comerciais, Detran, INSS e outras bases públicas."
      },
      {
        pergunta: "Os relatórios têm validade judicial?",
        resposta: "Sim! Nossos relatórios seguem metodologia profissional profissional com cadeia de custódia documentada, fontes rastreáveis e evidências verificáveis. São admissíveis como prova em processos judiciais (trabalhistas, cíveis, criminais, família). Advogados usam nossos relatórios para fundamentar petições, investigação patrimonial em divórcios e execuções. Para perícia oficial, recomendamos nomear perito pelo juízo."
      },
      {
        pergunta: "Como funciona a metodologia de vocês?",
        resposta: "3 passos: (1) Você informa CPF ou CNPJ do alvo; (2) Vasculhamos 27 tribunais, TSE, CNJ, Receita Federal, CEIS/CNEP e 100+ fontes oficiais com metodologia profissional profissional; (3) Entregamos relatório completo em 24-48h com processos, sanções, dívidas, participações societárias, patrimônio e red flags identificadas. Tudo em conformidade LGPD."
      },
      {
        pergunta: "As informações obtidas são legais?",
        resposta: "Absolutamente. Trabalhamos exclusivamente com fontes públicas oficiais do governo (OSINT). NÃO acessamos: dados bancários, conversas privadas, e-mails, localização em tempo real, grampos telefônicos ou qualquer informação protegida. Todas as práticas em conformidade com LGPD, Marco Civil da Internet e legislação de investigação privada."
      },
      {
        pergunta: "Como garantem sigilo absoluto?",
        resposta: "Sigilo total garantido: (1) O investigado NÃO fica sabendo da investigação; (2) Não revelamos identidade de clientes; (3) Relatórios entregues via link criptografado e senha; (4) Servidores seguros com criptografia; (5) Equipe treinada em confidencialidade; (6) Políticas internas rígidas de proteção de dados. Para RH, investidores, divórcios e vítimas de exposição, sigilo é crítico."
      },
      {
        pergunta: "Qual a diferença entre vocês e um detetive particular comum?",
        resposta: "Diferencial: (1) Metodologia profissional profissional validada (não empírica); (2) Análise digital avançada em 100+ fontes governamentais; (3) Relatórios estruturados com evidências documentadas e validade judicial; (4) Conformidade LGPD certificada; (5) Atendimento multi-segmento (B2B, B2C, Legal, Governo); (6) Tecnologia proprietária de análise de dados; (7) Equipe especializada em investigação corporativa e profissional digital."
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
    categoria: "Casos Específicos por Público",
    perguntas: [
      {
        pergunta: "[RH] Posso fazer background check de candidatos antes de contratar?",
        resposta: "Sim! Background check é legal e essencial para contratações seguras. Verificamos CPF, antecedentes criminais em 27 tribunais, processos trabalhistas, sanções CEIS/CNEP e vínculos empregatícios. Prazo: 24-48h. A partir de R$ 500. Conformidade LGPD total. Ideal para cargos de confiança, executivos e posições críticas. Evite contratar pessoas com passivo oculto."
      },
      {
        pergunta: "[Investidores] Como funciona due diligence antes de investir em startups?",
        resposta: "Investigamos a fundo a empresa e founders: (1) CNPJ - situação cadastral, débitos fiscais, processos; (2) Sócios - antecedentes criminais, passivos trabalhistas, sanções; (3) Participações societárias ocultas; (4) Red flags empresariais. Prazo: 7-15 dias. Evite prejuízos milionários por fraudes, empresas fantasmas ou sócios com impedimentos. Análise em 12 camadas."
      },
      {
        pergunta: "[Advogados] Vocês fazem perícia profissional para processos judiciais?",
        resposta: "Sim! Perícia profissional digital com: (1) Extração profissional de celular (Avilla Forensics + IPED); (2) Cadeia de custódia certificada; (3) Coleta e preservação de provas digitais; (4) Relatórios periciais admissíveis em juízo; (5) Metodologia profissional validada. Ideal para processos trabalhistas, cíveis, criminais e família. Validade judicial garantida."
      },
      {
        pergunta: "[Divórcio] Como rastrear patrimônio oculto do cônjuge?",
        resposta: "Investigação patrimonial completa: (1) Imóveis em todo Brasil; (2) Veículos registrados; (3) Participações societárias (empresas em nome do cônjuge ou laranjas); (4) Análise de incompatibilidade patrimonial (renda declarada vs. patrimônio real); (5) Rastreamento de criptomoedas. Prazo: 7-10 dias. 100% confidencial. Evite partilha injusta. Advogados usam para fundamentar ações."
      },
      {
        pergunta: "[Auditores] Como auditar licitações para detectar fraudes?",
        resposta: "Auditoria profissional em 12 camadas: (1) Verificação CEIS/CNEP de fornecedores; (2) Detecção de cartel (empresas coligadas); (3) Análise de superfaturamento; (4) Empresas fantasmas; (5) Impedimentos legais; (6) Sócios com sanções. Prazo: 3-5 dias. Conformidade TCU/CGU. Ideal para órgãos públicos, controladorias e auditorias internas. Previna fraudes antes da homologação."
      },
      {
        pergunta: "[Vítimas] Como remover fotos íntimas vazadas do Google?",
        resposta: "Remoção emergencial em 24-72h: (1) Desindexação Google (fundamentação LGPD Art. 18); (2) Remoção em redes sociais (Facebook, Instagram, Twitter); (3) Remoção Jusbrasil e Escavador; (4) Contenção rápida da circulação. A partir de R$ 800. 85% de taxa de sucesso. Atendimento emergencial 24h. Proteção de privacidade com base na LGPD. Sigilo absoluto."
      },
      {
        pergunta: "Posso usar o relatório como prova judicial?",
        resposta: "Sim! Relatórios com metodologia profissional profissional, cadeia de custódia documentada, fontes rastreáveis e evidências verificáveis são admissíveis em processos judiciais. Advogados usam para: petições iniciais, investigação patrimonial em divórcios, ações trabalhistas, processos criminais e execuções. Tribunais aceitam como elemento de convicção. Para perícia oficial, recomendamos nomear perito pelo juízo."
      },
      {
        pergunta: "Vocês fazem extração profissional de celular com WhatsApp deletado?",
        resposta: "Sim! Perícia profissional digital com Avilla Forensics e IPED: (1) Extração de mensagens deletadas (WhatsApp, SMS, Telegram); (2) Recuperação de fotos e vídeos apagados; (3) Histórico de navegação; (4) Cadeia de custódia oficial; (5) Relatório técnico pericial. Dispositivo próprio ou com consentimento. Validade judicial garantida. Ideal para advogados em processos trabalhistas, criminais e família."
      }
    ]
  }
];

function FAQItem({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-300 dark:border-navy-800 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left hover:text-primary-400 transition-colors"
      >
        <span className="text-slate-900 dark:text-white font-medium pr-4">{pergunta}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-primary-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-900 dark:text-slate-600 dark:text-white/60 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-slate-900 dark:text-slate-700 dark:text-white/70 leading-relaxed">
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
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950 pt-20">
        {/* Header - Compacto (UX: Padrão F) */}
        <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-900 dark:to-navy-950 border-b border-slate-300 dark:border-navy-800">
          <div className="container max-w-4xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Lado esquerdo - Padrão F */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
                  <HelpCircle className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Perguntas Frequentes</h1>
                  <p className="text-sm text-slate-600 dark:text-navy-300">Tire suas dúvidas sobre nossos serviços</p>
                </div>
              </div>
              {/* Lado direito - Link voltar */}
              <Link href="/" className="inline-flex items-center gap-2 text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white transition text-sm">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao início
              </Link>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-12">
            {faqs.map((categoria, index) => (
              <div key={index}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-bold">
                    {index + 1}
                  </span>
                  {categoria.categoria}
                </h2>
                <div className="bg-white dark:bg-navy-900 rounded-xl border border-slate-300 dark:border-navy-800 px-6">
                  {categoria.perguntas.map((item, i) => (
                    <FAQItem key={i} pergunta={item.pergunta} resposta={item.resposta} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-slate-900 dark:text-slate-700 dark:text-white/70 mb-4">Não encontrou o que procurava?</p>
            <WhatsAppButton
              message="Olá! Tenho uma dúvida sobre os serviços de investigação digital."
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
