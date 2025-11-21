import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="text-2xl font-bold text-gray-900">investigaree</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Política de Privacidade
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            Última atualização: 21 de novembro de 2025
          </p>

          <div className="prose prose-blue max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introdução</h2>
              <p>
                A <strong>investigaree</strong> ("nós", "nosso" ou "nossa") está comprometida em proteger
                a privacidade e a segurança dos dados pessoais de nossos usuários. Esta Política de
                Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações
                pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Dados Coletados</h2>
              <p>Coletamos os seguintes tipos de dados pessoais:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dados de Identificação:</strong> Nome completo, e-mail, telefone/WhatsApp</li>
                <li><strong>Dados de Acesso:</strong> Endereço IP, tipo de navegador, páginas visitadas</li>
                <li><strong>Dados de Uso:</strong> Interações com a plataforma, preferências, histórico de consultas</li>
                <li><strong>Dados de Pagamento:</strong> Informações de transações (processadas por terceiros como Stripe)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalidade do Tratamento</h2>
              <p>Utilizamos seus dados pessoais para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criar e gerenciar sua conta na plataforma</li>
                <li>Processar suas solicitações de relatórios de investigação</li>
                <li>Enviar comunicações sobre o status dos seus relatórios</li>
                <li>Melhorar nossos serviços e experiência do usuário</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Enviar comunicações de marketing (apenas com seu consentimento)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Legal</h2>
              <p>O tratamento de dados pessoais pela investigaree se fundamenta nas seguintes bases legais:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consentimento:</strong> Para comunicações de marketing e newsletters</li>
                <li><strong>Execução de contrato:</strong> Para prestação dos serviços contratados</li>
                <li><strong>Legítimo interesse:</strong> Para melhoria dos serviços e segurança da plataforma</li>
                <li><strong>Obrigação legal:</strong> Para cumprimento de obrigações fiscais e regulatórias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compartilhamento de Dados</h2>
              <p>
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Prestadores de Serviço:</strong> Firebase (autenticação), Supabase (banco de dados), Stripe (pagamentos)</li>
                <li><strong>Autoridades Competentes:</strong> Quando exigido por lei ou ordem judicial</li>
                <li><strong>Proteção de Direitos:</strong> Para proteger nossos direitos, privacidade, segurança ou propriedade</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Armazenamento e Segurança</h2>
              <p>
                Seus dados são armazenados em servidores seguros localizados na nuvem (Cloudflare, Firebase, Supabase).
                Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados contra acesso não
                autorizado, alteração, divulgação ou destruição, incluindo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
                <li>Criptografia de dados em repouso</li>
                <li>Controle de acesso baseado em função</li>
                <li>Monitoramento e logs de segurança</li>
                <li>Auditorias regulares de segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retenção de Dados</h2>
              <p>
                Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas
                nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
                Após esse período, os dados serão anonimizados ou excluídos de forma segura.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Seus Direitos (LGPD)</h2>
              <p>De acordo com a LGPD, você tem os seguintes direitos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Confirmação e Acesso:</strong> Confirmar se tratamos seus dados e solicitar acesso</li>
                <li><strong>Correção:</strong> Solicitar correção de dados incompletos, inexatos ou desatualizados</li>
                <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Solicitar anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li><strong>Portabilidade:</strong> Solicitar a portabilidade de dados a outro fornecedor</li>
                <li><strong>Eliminação:</strong> Solicitar eliminação de dados tratados com base no consentimento</li>
                <li><strong>Revogação do Consentimento:</strong> Revogar o consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento realizado em desconformidade com a LGPD</li>
              </ul>
              <p className="mt-4">
                Para exercer seus direitos, entre em contato conosco através do e-mail:{' '}
                <a href="mailto:privacidade@investigaree.com.br" className="text-blue-600 hover:underline">
                  privacidade@investigaree.com.br
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
              <p>
                Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência em nossa plataforma.
                Cookies são pequenos arquivos de texto armazenados em seu dispositivo. Você pode configurar seu
                navegador para recusar cookies, mas isso pode afetar a funcionalidade da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Menores de Idade</h2>
              <p>
                Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente dados
                pessoais de menores. Se você é pai/mãe ou responsável e acredita que seu filho forneceu dados
                pessoais, entre em contato conosco para que possamos tomar as medidas apropriadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações
                significativas por e-mail ou através de um aviso em nossa plataforma. Recomendamos que você revise
                esta política regularmente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Encarregado de Dados (DPO)</h2>
              <p>
                Para questões relacionadas à proteção de dados, você pode entrar em contato com nosso Encarregado
                de Dados:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p><strong>E-mail:</strong> dpo@investigaree.com.br</p>
                <p><strong>Endereço:</strong> [Endereço da empresa]</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais,
                entre em contato:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p><strong>investigaree</strong></p>
                <p><strong>E-mail:</strong> contato@investigaree.com.br</p>
                <p><strong>Website:</strong> https://investigaree.com.br</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
