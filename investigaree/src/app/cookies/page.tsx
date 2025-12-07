import { Metadata } from "next";
import Link from "next/link";
import { Cookie, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Cookies | investigaree",
  description: "Política de Cookies da investigaree. Saiba como utilizamos cookies e tecnologias similares.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-navy-950">
      {/* Header - Compacto (UX: Padrão F) */}
      <header className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-900 dark:to-navy-950 border-b border-slate-300 dark:border-navy-800">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Lado esquerdo - Padrão F */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
                <Cookie className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Política de Cookies</h1>
                <p className="text-sm text-slate-600 dark:text-navy-300">Atualizado em 01/12/2025</p>
              </div>
            </div>
            {/* Lado direito - Link voltar */}
            <Link href="/" className="inline-flex items-center gap-2 text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white transition text-sm">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert prose-lg max-w-none">

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. O que são Cookies?</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 leading-relaxed">
              Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou celular)
              quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de
              maneira mais eficiente, bem como para fornecer informações aos proprietários do site.
            </p>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 leading-relaxed mt-4">
              Esta Política de Cookies está em conformidade com o Guia Orientativo sobre Cookies e Proteção
              de Dados Pessoais publicado pela Autoridade Nacional de Proteção de Dados (ANPD) e com a
              Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Tipos de Cookies que Utilizamos</h2>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">2.1 Cookies Essenciais (Necessários)</h3>
            <div className="bg-white dark:bg-navy-900 p-4 rounded-lg border border-slate-300 dark:border-navy-800 mb-4">
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-2">
                <strong>Base Legal:</strong> Legítimo interesse / Necessidade para execução do contrato
              </p>
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
                Estes cookies são indispensáveis para o funcionamento do site. Eles permitem que você navegue
                e utilize recursos essenciais, como áreas seguras e formulários. Sem estes cookies, os serviços
                solicitados não podem ser fornecidos.
              </p>
            </div>
            <table className="w-full text-slate-900 dark:text-slate-800 dark:text-white/80 text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-400 dark:border-navy-700">
                  <th className="text-left py-2 px-3">Cookie</th>
                  <th className="text-left py-2 px-3">Finalidade</th>
                  <th className="text-left py-2 px-3">Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-300 dark:border-navy-800">
                  <td className="py-2 px-3">session_id</td>
                  <td className="py-2 px-3">Manter sessão do usuário autenticado</td>
                  <td className="py-2 px-3">Sessão</td>
                </tr>
                <tr className="border-b border-slate-300 dark:border-navy-800">
                  <td className="py-2 px-3">csrf_token</td>
                  <td className="py-2 px-3">Segurança contra ataques CSRF</td>
                  <td className="py-2 px-3">Sessão</td>
                </tr>
                <tr className="border-b border-slate-300 dark:border-navy-800">
                  <td className="py-2 px-3">cookie_consent</td>
                  <td className="py-2 px-3">Armazenar preferências de cookies</td>
                  <td className="py-2 px-3">1 ano</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-8 mb-3">2.2 Cookies de Desempenho (Analíticos)</h3>
            <div className="bg-white dark:bg-navy-900 p-4 rounded-lg border border-slate-300 dark:border-navy-800 mb-4">
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-2">
                <strong>Base Legal:</strong> Consentimento
              </p>
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
                Estes cookies coletam informações sobre como os visitantes utilizam o site, como quais páginas
                são mais visitadas. Todas as informações são agregadas e anônimas. Utilizamos essas informações
                para melhorar o funcionamento do site.
              </p>
            </div>
            <table className="w-full text-slate-900 dark:text-slate-800 dark:text-white/80 text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-400 dark:border-navy-700">
                  <th className="text-left py-2 px-3">Cookie</th>
                  <th className="text-left py-2 px-3">Finalidade</th>
                  <th className="text-left py-2 px-3">Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-300 dark:border-navy-800">
                  <td className="py-2 px-3">_ga</td>
                  <td className="py-2 px-3">Google Analytics - Identificador único</td>
                  <td className="py-2 px-3">2 anos</td>
                </tr>
                <tr className="border-b border-slate-300 dark:border-navy-800">
                  <td className="py-2 px-3">_gid</td>
                  <td className="py-2 px-3">Google Analytics - Identificador de sessão</td>
                  <td className="py-2 px-3">24 horas</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-8 mb-3">2.3 Cookies de Funcionalidade</h3>
            <div className="bg-white dark:bg-navy-900 p-4 rounded-lg border border-slate-300 dark:border-navy-800 mb-4">
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-2">
                <strong>Base Legal:</strong> Consentimento / Legítimo interesse
              </p>
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
                Estes cookies permitem que o site lembre de escolhas que você faz (como idioma, região ou
                preferências de tema) para proporcionar uma experiência mais personalizada.
              </p>
            </div>
            <table className="w-full text-slate-900 dark:text-slate-800 dark:text-white/80 text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-400 dark:border-navy-700">
                  <th className="text-left py-2 px-3">Cookie</th>
                  <th className="text-left py-2 px-3">Finalidade</th>
                  <th className="text-left py-2 px-3">Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-300 dark:border-navy-800">
                  <td className="py-2 px-3">theme</td>
                  <td className="py-2 px-3">Preferência de tema (claro/escuro)</td>
                  <td className="py-2 px-3">1 ano</td>
                </tr>
                <tr className="border-b border-slate-300 dark:border-navy-800">
                  <td className="py-2 px-3">language</td>
                  <td className="py-2 px-3">Preferência de idioma</td>
                  <td className="py-2 px-3">1 ano</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-8 mb-3">2.4 Cookies de Marketing</h3>
            <div className="bg-white dark:bg-navy-900 p-4 rounded-lg border border-slate-300 dark:border-navy-800 mb-4">
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-2">
                <strong>Base Legal:</strong> Consentimento
              </p>
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
                Estes cookies são utilizados para exibir anúncios mais relevantes para você. Eles também são
                usados para limitar o número de vezes que você vê um anúncio e ajudar a medir a eficácia de
                campanhas publicitárias.
              </p>
            </div>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              <strong>Nota:</strong> Atualmente, não utilizamos cookies de marketing em nossa plataforma.
              Caso isso mude, atualizaremos esta política e solicitaremos seu consentimento.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. Gestão de Cookies</h2>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">3.1 Banner de Consentimento</h3>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Ao acessar nosso site pela primeira vez, você verá um banner de cookies que permite:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2">
              <li>Aceitar todos os cookies</li>
              <li>Rejeitar cookies não essenciais</li>
              <li>Personalizar suas preferências por categoria</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">3.2 Alterar Preferências</h3>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              Você pode alterar suas preferências de cookies a qualquer momento clicando no link
              &quot;Configurar Cookies&quot; no rodapé do site ou acessando as configurações do seu navegador.
            </p>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">3.3 Configurações do Navegador</h3>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              A maioria dos navegadores permite controlar cookies através das configurações. Veja como:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2">
              <li><strong>Chrome:</strong> Configurações &gt; Privacidade e segurança &gt; Cookies</li>
              <li><strong>Firefox:</strong> Opções &gt; Privacidade e Segurança &gt; Cookies</li>
              <li><strong>Safari:</strong> Preferências &gt; Privacidade &gt; Cookies</li>
              <li><strong>Edge:</strong> Configurações &gt; Cookies e permissões do site</li>
            </ul>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mt-4">
              <strong>Atenção:</strong> Desativar cookies essenciais pode afetar o funcionamento do site.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. Cookies de Terceiros</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Alguns cookies são definidos por serviços de terceiros que aparecem em nossas páginas.
              Não controlamos os cookies de terceiros. Você pode verificar o site do terceiro para mais
              informações sobre esses cookies.
            </p>
            <div className="bg-white dark:bg-navy-900 p-4 rounded-lg border border-slate-300 dark:border-navy-800">
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-2"><strong>Google Analytics</strong></p>
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 text-sm">
                Utilizamos o Google Analytics para entender como os visitantes interagem com nosso site.
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline ml-1">
                  Política de Privacidade do Google
                </a>
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">5. Outras Tecnologias de Rastreamento</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Além de cookies, podemos utilizar outras tecnologias similares:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2">
              <li><strong>Local Storage:</strong> Armazenamento local no navegador para preferências do usuário</li>
              <li><strong>Session Storage:</strong> Armazenamento temporário para dados de sessão</li>
            </ul>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mt-4">
              <strong>Não utilizamos:</strong> Web beacons, pixels de rastreamento ou fingerprinting de dispositivos.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">6. Seus Direitos</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Em conformidade com a LGPD, você tem os seguintes direitos em relação aos dados coletados por cookies:
            </p>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2">
              <li>Direito de ser informado sobre o uso de cookies</li>
              <li>Direito de aceitar ou recusar cookies não essenciais</li>
              <li>Direito de alterar suas preferências a qualquer momento</li>
              <li>Direito de solicitar a exclusão de dados coletados por cookies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">7. Atualizações desta Política</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80">
              Esta Política de Cookies pode ser atualizada periodicamente para refletir mudanças em nossas
              práticas ou por exigências legais. Recomendamos que você revise esta página regularmente.
              A data da última atualização está indicada no topo desta página.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">8. Contato</h2>
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato:
            </p>
            <div className="bg-white dark:bg-navy-900 p-6 rounded-lg border border-slate-300 dark:border-navy-800">
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-2"><strong>E-mail:</strong> privacidade@investigaree.com.br</p>
              <p className="text-slate-900 dark:text-slate-800 dark:text-white/80"><strong>Site:</strong> www.investigaree.com.br</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">9. Referências Legais</h2>
            <ul className="list-disc list-inside text-slate-900 dark:text-slate-800 dark:text-white/80 space-y-2">
              <li>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</li>
              <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
              <li>
                <a href="https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf"
                   target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                  Guia Orientativo da ANPD sobre Cookies
                </a>
              </li>
            </ul>
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
            <Link href="/privacidade" className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-primary-400 transition">Política de Privacidade</Link>
            <Link href="/termos" className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-primary-400 transition">Termos de Uso</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
