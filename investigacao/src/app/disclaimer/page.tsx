import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Scale, FileWarning, ShieldAlert } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Disclaimer - Isenção de Responsabilidade | investigaree",
  description: "Aviso legal e isenção de responsabilidade sobre os serviços de investigação digital e due diligence da investigaree.",
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950">
      {/* Header */}
      <header className="bg-white dark:bg-navy-900 border-b border-slate-300 dark:border-navy-800">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white transition mb-4">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-primary-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Disclaimer</h1>
          </div>
          <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mt-1">Isenção de Responsabilidade e Aviso Legal</p>
          <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mt-2 text-sm">Última atualização: 04 de dezembro de 2025</p>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert prose-lg max-w-none">

          {/* Aviso Importante */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <FileWarning className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-2">Aviso Importante</h3>
                <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 text-sm">
                  Ao utilizar os serviços ou acessar o conteúdo do site da investigaree, você declara ter lido,
                  compreendido e concordado integralmente com este Disclaimer e com nossos{" "}
                  <Link href="/termos" className="text-primary-400 hover:underline">Termos de Uso</Link>.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary-400" />
              1. Natureza dos Serviços
            </h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 leading-relaxed">
              A <strong>investigaree</strong> presta serviços de investigação particular e due diligence digital,
              atuando estritamente dentro dos limites da legislação brasileira. Nossos serviços incluem a coleta,
              análise e compilação de informações disponíveis em fontes públicas, registros oficiais e outras
              fontes legalmente acessíveis.
            </p>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 leading-relaxed mt-4">
              <strong>Não somos:</strong>
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2 mt-2">
              <li>Órgão de polícia ou instituição estatal de investigação</li>
              <li>Escritório de advocacia ou prestadores de assessoria jurídica</li>
              <li>Agência de detetives com poderes de polícia</li>
              <li>Empresa de recuperação de crédito ou cobrança</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Limites Legais e Éticos</h2>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">2.1 Conformidade Legal</h3>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              Todos os nossos serviços são realizados em conformidade com:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2 mt-2">
              <li>Constituição Federal (Art. 5º - direitos fundamentais)</li>
              <li>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</li>
              <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
              <li>Código Civil e Código Penal Brasileiro</li>
              <li>Estatuto do Investigador Particular (onde aplicável)</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">2.2 Práticas Proibidas</h3>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              <strong>A investigaree NÃO realiza e NÃO oferece serviços que envolvam:</strong>
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2">
              <li>Invasão de privacidade ou violação de comunicações privadas</li>
              <li>Acesso não autorizado a sistemas, contas ou dispositivos</li>
              <li>Interceptação de comunicações telefônicas ou telemáticas</li>
              <li>Obtenção de dados bancários, fiscais ou médicos por meios ilícitos</li>
              <li>Perseguição (stalking), assédio ou monitoramento ilegal</li>
              <li>Qualquer atividade que constitua crime ou contravenção penal</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary-400" />
              3. Limitações de Responsabilidade
            </h2>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">3.1 Informações Fornecidas</h3>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              As informações contidas em nossos relatórios são baseadas em dados disponíveis no momento da
              investigação. Não garantimos:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2 mt-2">
              <li>A completude absoluta das informações obtidas</li>
              <li>Que todas as informações relevantes estejam disponíveis em fontes acessíveis</li>
              <li>A permanência ou inalterabilidade das informações após a entrega</li>
              <li>Resultados favoráveis ou específicos decorrentes do uso das informações</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">3.2 Decisões do Cliente</h3>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              <strong>A investigaree não se responsabiliza por:</strong>
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2 mt-2">
              <li>Decisões tomadas pelo cliente com base nos relatórios fornecidos</li>
              <li>Prejuízos decorrentes de ações ou omissões do cliente</li>
              <li>Uso indevido das informações para fins ilícitos</li>
              <li>Consequências de compartilhamento não autorizado dos relatórios</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">3.3 Fontes de Informação</h3>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              Utilizamos diversas fontes públicas e legalmente acessíveis. Não nos responsabilizamos por
              eventuais erros, desatualizações ou imprecisões nas fontes originais consultadas, incluindo
              registros públicos, bases de dados governamentais e outras fontes de terceiros.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. Uso Apropriado dos Serviços</h2>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">4.1 Finalidades Legítimas</h3>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Nossos serviços são destinados exclusivamente para finalidades legítimas, incluindo:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2">
              <li>Due diligence em transações comerciais e investimentos</li>
              <li>Verificação de antecedentes para contratações</li>
              <li>Proteção patrimonial em processos familiares</li>
              <li>Investigações para instrução de processos judiciais</li>
              <li>Análise de riscos em parcerias empresariais</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">4.2 Compromisso do Cliente</h3>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              Ao contratar nossos serviços, o cliente declara e garante que:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2 mt-2">
              <li>Possui interesse legítimo na investigação solicitada</li>
              <li>Utilizará as informações apenas para fins lícitos</li>
              <li>Não utilizará os serviços para perseguir, assediar ou prejudicar terceiros</li>
              <li>Assume total responsabilidade pelo uso das informações obtidas</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">5. Conteúdo do Blog e Materiais Educativos</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Os artigos, tutoriais e materiais educativos publicados em nosso blog têm caráter meramente
              informativo e educacional. Eles:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2">
              <li>Não constituem assessoria jurídica, financeira ou profissional</li>
              <li>Podem refletir opiniões pessoais dos autores</li>
              <li>Não substituem consulta a profissionais especializados</li>
              <li>Podem ficar desatualizados com alterações legislativas</li>
            </ul>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mt-4">
              Para questões específicas, recomendamos sempre consultar advogados, contadores ou outros
              profissionais habilitados.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">6. Links e Conteúdo de Terceiros</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              Nosso site pode conter links para sites de terceiros. Não controlamos, endossamos ou nos
              responsabilizamos pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites ou
              serviços de terceiros. A inclusão de qualquer link não implica afiliação, endosso ou adoção
              por nossa parte do site ou de qualquer informação nele contida.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">7. Propriedade Intelectual</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Todo o conteúdo deste site, incluindo textos, gráficos, logos, ícones, imagens e software,
              é de propriedade da investigaree ou de seus licenciadores e está protegido por leis de
              propriedade intelectual.
            </p>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              É proibida a reprodução, distribuição, modificação ou uso comercial do conteúdo sem
              autorização prévia e expressa.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">8. Isenção de Garantias</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Nossos serviços são fornecidos &quot;como estão&quot; e &quot;conforme disponíveis&quot;. Na máxima extensão
              permitida pela lei aplicável, a investigaree isenta-se de todas as garantias, expressas ou
              implícitas, incluindo, mas não se limitando a:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2">
              <li>Garantias de comerciabilidade</li>
              <li>Adequação a um propósito específico</li>
              <li>Não violação de direitos de terceiros</li>
              <li>Precisão, confiabilidade ou integridade das informações</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">9. Limitação de Danos</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              Em nenhuma circunstância a investigaree, seus diretores, funcionários, parceiros ou agentes
              serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou
              punitivos, incluindo, sem limitação, perda de lucros, dados, uso, goodwill ou outras perdas
              intangíveis, resultantes de:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2 mt-2">
              <li>Uso ou incapacidade de usar nossos serviços</li>
              <li>Qualquer acesso não autorizado aos nossos servidores</li>
              <li>Interrupção ou cessação de transmissão de ou para nosso serviço</li>
              <li>Quaisquer bugs, vírus ou similar transmitidos por terceiros</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">10. Jurisdição e Lei Aplicável</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              Este Disclaimer é regido e interpretado de acordo com as leis da República Federativa do Brasil.
              Qualquer disputa decorrente deste Disclaimer ou relacionada a ele será submetida à jurisdição
              exclusiva dos tribunais da Comarca de Itajaí, Estado de Santa Catarina, Brasil.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">11. Alterações</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              Reservamo-nos o direito de modificar este Disclaimer a qualquer momento. Alterações entrarão
              em vigor imediatamente após a publicação. O uso continuado de nossos serviços após tais
              alterações constitui sua aceitação do Disclaimer revisado.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">12. Contato</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Se você tiver dúvidas sobre este Disclaimer, entre em contato:
            </p>
            <div className="bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-300 dark:border-navy-800">
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-2"><strong>E-mail:</strong> contato@investigaree.com.br</p>
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-2"><strong>Jurídico:</strong> juridico@investigaree.com.br</p>
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80"><strong>Site:</strong> www.investigaree.com.br</p>
            </div>
          </section>

          {/* Documentos Relacionados */}
          <section className="mb-8 p-6 bg-white dark:bg-navy-900/50 rounded-xl border border-slate-300 dark:border-navy-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Documentos Relacionados</h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/termos" className="text-primary-400 hover:underline">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-primary-400 hover:underline">
                Política de Privacidade
              </Link>
              <Link href="/cookies" className="text-primary-400 hover:underline">
                Política de Cookies
              </Link>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-navy-900 border-t border-slate-300 dark:border-navy-800 py-8">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm">
            © 2025 investigaree. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/termos" className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-primary-400 transition">Termos de Uso</Link>
            <Link href="/privacidade" className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-primary-400 transition">Política de Privacidade</Link>
            <Link href="/cookies" className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-primary-400 transition">Política de Cookies</Link>
          </div>
        </div>
      </footer>
    </main>
    <Footer />
    </>
  );
}
