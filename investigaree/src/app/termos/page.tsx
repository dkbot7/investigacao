import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso | investigaree",
  description: "Termos de Uso da plataforma investigaree. Leia atentamente antes de utilizar nossos serviços.",
};

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="bg-navy-900 border-b border-navy-800">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition mb-4">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-400" />
            <h1 className="text-2xl font-bold text-white">Termos de Uso</h1>
          </div>
          <p className="text-white/60 mt-2">Última atualização: 25 de novembro de 2025</p>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert prose-lg max-w-none">

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
            <p className="text-white/80 leading-relaxed">
              Ao acessar e utilizar o site e os serviços da <strong>investigaree</strong> (&quot;Plataforma&quot;), você concorda
              com estes Termos de Uso, nossa <Link href="/privacidade" className="text-primary-400 hover:underline">Política de Privacidade</Link> e
              nossa <Link href="/cookies" className="text-primary-400 hover:underline">Política de Cookies</Link>.
              Se você não concordar com qualquer parte destes termos, não utilize nossos serviços.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              Estes Termos de Uso estão em conformidade com o Marco Civil da Internet (Lei nº 12.965/2014),
              o Código de Defesa do Consumidor (Lei nº 8.078/1990) e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">2. Definições</h2>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li><strong>Plataforma:</strong> O site investigaree.com.br e todos os serviços oferecidos</li>
              <li><strong>Usuário:</strong> Qualquer pessoa que acesse ou utilize a Plataforma</li>
              <li><strong>Cliente:</strong> Usuário que contrata serviços da investigaree</li>
              <li><strong>Serviços:</strong> Due diligence, investigações digitais e demais serviços oferecidos</li>
              <li><strong>Conta:</strong> Cadastro pessoal do usuário na Plataforma</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">3. Descrição dos Serviços</h2>
            <p className="text-white/80 mb-4">
              A investigaree oferece serviços de investigação particular e due diligence digital, incluindo, mas não limitado a:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li>Verificação de antecedentes e histórico</li>
              <li>Due diligence corporativa e de investimentos</li>
              <li>Análise de riscos e red flags</li>
              <li>Investigações digitais e forenses</li>
              <li>Relatórios de inteligência</li>
            </ul>
            <p className="text-white/80 mt-4">
              <strong>Importante:</strong> Todos os nossos serviços são realizados de forma ética e legal, respeitando a
              legislação brasileira e os direitos fundamentais das pessoas investigadas.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">4. Cadastro e Conta</h2>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">4.1 Criação de Conta</h3>
            <p className="text-white/80">
              Para acessar determinados serviços, você deverá criar uma conta fornecendo informações verdadeiras,
              completas e atualizadas. Você é responsável por manter a confidencialidade de sua senha e por todas
              as atividades realizadas em sua conta.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">4.2 Requisitos</h3>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Fornecer informações verdadeiras e completas</li>
              <li>Manter suas credenciais de acesso seguras</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">4.3 Encerramento</h3>
            <p className="text-white/80">
              Você pode encerrar sua conta a qualquer momento. Reservamo-nos o direito de suspender ou encerrar
              contas que violem estes Termos de Uso.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">5. Uso Aceitável</h2>
            <p className="text-white/80 mb-4">Ao utilizar nossa Plataforma, você concorda em:</p>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li>Utilizar os serviços apenas para fins lícitos</li>
              <li>Não violar direitos de terceiros</li>
              <li>Não utilizar os serviços para assédio, perseguição ou vigilância ilegal</li>
              <li>Não tentar acessar sistemas ou dados sem autorização</li>
              <li>Não interferir no funcionamento da Plataforma</li>
              <li>Fornecer informações verdadeiras sobre os casos apresentados</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">6. Propriedade Intelectual</h2>
            <p className="text-white/80 mb-4">
              Todo o conteúdo da Plataforma, incluindo textos, gráficos, logos, ícones, imagens, clipes de áudio,
              downloads digitais, compilações de dados e software, é de propriedade da investigaree ou de seus
              licenciadores e está protegido pelas leis de propriedade intelectual.
            </p>
            <p className="text-white/80">
              Os relatórios e documentos entregues aos clientes são de uso exclusivo do contratante, sendo
              vedada sua reprodução, distribuição ou compartilhamento com terceiros sem autorização expressa.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">7. Pagamentos e Contratação</h2>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">7.1 Preços</h3>
            <p className="text-white/80">
              Os preços dos serviços são informados antes da contratação. Reservamo-nos o direito de alterar
              preços a qualquer momento, sem afetar contratos já firmados.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">7.2 Forma de Pagamento</h3>
            <p className="text-white/80">
              Aceitamos pagamentos via cartão de crédito, PIX e transferência bancária. O início dos trabalhos
              está condicionado à confirmação do pagamento.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">7.3 Cancelamento e Reembolso</h3>
            <p className="text-white/80">
              Solicitações de cancelamento devem ser feitas antes do início dos trabalhos. Após o início,
              o reembolso será proporcional aos serviços não executados, conforme nossa política de
              cancelamento disponível no momento da contratação.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">8. Confidencialidade</h2>
            <p className="text-white/80">
              Comprometemo-nos a manter sigilo absoluto sobre todas as informações fornecidas pelos clientes
              e sobre os resultados das investigações. Esta obrigação de confidencialidade permanece mesmo
              após o término do relacionamento comercial, exceto quando houver determinação legal ou judicial
              para divulgação.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">9. Limitação de Responsabilidade</h2>
            <p className="text-white/80 mb-4">
              A investigaree não será responsável por:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li>Decisões tomadas com base nos relatórios fornecidos</li>
              <li>Uso indevido das informações pelo cliente</li>
              <li>Danos indiretos, incidentais ou consequentes</li>
              <li>Falhas decorrentes de caso fortuito ou força maior</li>
              <li>Interrupções temporárias da Plataforma para manutenção</li>
            </ul>
            <p className="text-white/80 mt-4">
              Nossa responsabilidade total está limitada ao valor pago pelo serviço específico que deu
              origem à reclamação.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">10. Garantias e Isenções</h2>
            <p className="text-white/80 mb-4">
              Nossos serviços são prestados com base nas informações disponíveis publicamente e nas técnicas
              de investigação legalmente permitidas. Não garantimos:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li>A completude absoluta das informações obtidas</li>
              <li>Resultados específicos ou favoráveis</li>
              <li>Que as informações permanecerão inalteradas após a entrega do relatório</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">11. Comunicações</h2>
            <p className="text-white/80">
              Ao criar uma conta, você concorda em receber comunicações eletrônicas relacionadas aos serviços
              contratados. Para comunicações de marketing, solicitaremos seu consentimento específico,
              que pode ser revogado a qualquer momento.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">12. Alterações nos Termos</h2>
            <p className="text-white/80">
              Podemos atualizar estes Termos de Uso periodicamente. Alterações significativas serão comunicadas
              por e-mail ou aviso na Plataforma. O uso continuado dos serviços após as alterações constitui
              aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">13. Legislação Aplicável e Foro</h2>
            <p className="text-white/80">
              Estes Termos de Uso são regidos pela legislação brasileira. Fica eleito o foro da Comarca de
              São Paulo/SP para dirimir quaisquer controvérsias, renunciando as partes a qualquer outro,
              por mais privilegiado que seja.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">14. Disposições Gerais</h2>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li>A nulidade de qualquer cláusula não afeta as demais disposições</li>
              <li>A tolerância quanto ao descumprimento não implica renúncia</li>
              <li>Este documento representa o acordo integral entre as partes</li>
              <li>A versão em português prevalece sobre eventuais traduções</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">15. Contato</h2>
            <p className="text-white/80 mb-4">
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <div className="bg-navy-900 p-6 rounded-lg border border-navy-800">
              <p className="text-white/80 mb-2"><strong>E-mail:</strong> contato@investigaree.com.br</p>
              <p className="text-white/80 mb-2"><strong>WhatsApp:</strong> (11) 99999-9999</p>
              <p className="text-white/80"><strong>Site:</strong> www.investigaree.com.br</p>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-900 border-t border-navy-800 py-8">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/60 text-sm">
            © 2025 investigaree. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/privacidade" className="text-white/60 hover:text-primary-400 transition">Política de Privacidade</Link>
            <Link href="/cookies" className="text-white/60 hover:text-primary-400 transition">Política de Cookies</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
