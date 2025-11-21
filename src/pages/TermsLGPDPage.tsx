import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Logo from '../components/Logo'

export default function TermsLGPDPage() {
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
            Termos de Uso e Conformidade LGPD
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            Última atualização: 21 de novembro de 2025
          </p>

          <div className="prose prose-blue max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma <strong>investigaree</strong>, você concorda em cumprir e estar
                vinculado aos seguintes Termos de Uso. Se você não concorda com qualquer parte destes termos,
                não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p>
                A investigaree é uma plataforma de investigação digital que oferece serviços de análise e
                geração de relatórios baseados em dados públicos e fontes abertas (OSINT). Nossos serviços incluem:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Análise de redes sociais e presença digital</li>
                <li>Validação de documentos (CPF, RG, CNH)</li>
                <li>Busca em registros públicos</li>
                <li>Análise de data breaches e vazamentos</li>
                <li>Geração de relatórios compilados com análise de IA</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Uso Permitido</h2>
              <p>Você concorda em usar a investigaree apenas para fins legítimos, incluindo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Due diligence em processos de contratação</li>
                <li>Verificação de antecedentes pré-contratuais</li>
                <li>Investigações corporativas autorizadas</li>
                <li>Conformidade regulatória (KYC, AML)</li>
                <li>Prevenção de fraudes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uso Proibido</h2>
              <p>É expressamente proibido utilizar a investigaree para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Discriminação com base em raça, gênero, orientação sexual, religião ou origem</li>
                <li>Violação de direitos de privacidade de terceiros</li>
                <li>Perseguição, assédio ou stalking</li>
                <li>Chantagem, extorsão ou atividades ilegais</li>
                <li>Obtenção de informações para fins não autorizados pela LGPD</li>
                <li>Revenda ou redistribuição dos relatórios sem autorização</li>
              </ul>
              <p className="mt-4 font-semibold text-red-600">
                O uso inadequado da plataforma pode resultar na suspensão imediata da conta e notificação às
                autoridades competentes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Conformidade com a LGPD</h2>
              <p>
                A investigaree está totalmente comprometida com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                Ao usar nossos serviços, você concorda que:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Base Legal:</strong> Você possui base legal adequada para solicitar investigações sobre terceiros
                  (consentimento do titular, legítimo interesse, cumprimento de obrigação legal ou regulatória)
                </li>
                <li>
                  <strong>Finalidade Legítima:</strong> O uso dos dados será exclusivamente para a finalidade declarada
                  no momento da solicitação
                </li>
                <li>
                  <strong>Minimização:</strong> Você solicitará apenas os dados estritamente necessários para a finalidade
                </li>
                <li>
                  <strong>Transparência:</strong> Você informará aos titulares de dados sobre o tratamento, quando aplicável
                </li>
                <li>
                  <strong>Direitos dos Titulares:</strong> Você respeitará os direitos dos titulares de dados conforme a LGPD
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Responsabilidades do Usuário</h2>
              <p>Como usuário da investigaree, você é responsável por:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Usar os relatórios de forma ética e legal</li>
                <li>Não compartilhar relatórios com terceiros não autorizados</li>
                <li>Verificar a exatidão das informações fornecidas na solicitação</li>
                <li>Armazenar os relatórios de forma segura e conformidade com a LGPD</li>
                <li>Excluir os dados quando não forem mais necessários para a finalidade</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitações de Responsabilidade</h2>
              <p>
                A investigaree fornece informações baseadas em dados públicos e fontes abertas. Embora nos esforcemos
                para fornecer informações precisas e atualizadas:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Não garantimos a completude ou precisão absoluta dos dados</li>
                <li>Não nos responsabilizamos por decisões tomadas com base nos relatórios</li>
                <li>Não nos responsabilizamos por informações desatualizadas ou incorretas nas fontes públicas</li>
                <li>Recomendamos sempre verificar informações críticas através de fontes adicionais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da plataforma investigaree, incluindo textos, gráficos, logotipos, ícones, código-fonte
                e software, é de propriedade da investigaree ou de seus licenciadores e está protegido por leis de
                propriedade intelectual. Os relatórios gerados são licenciados a você para uso conforme estes Termos,
                mas a propriedade intelectual permanece com a investigaree.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Consentimento para Tratamento de Dados</h2>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
                <p className="font-semibold mb-2">Ao aceitar estes Termos, você consente expressamente que:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    Seus dados pessoais (nome, e-mail, telefone/WhatsApp) sejam coletados, armazenados e processados
                    pela investigaree para criação e gestão da sua conta
                  </li>
                  <li>
                    Seus dados sejam utilizados para processar suas solicitações de relatórios e fornecer suporte
                  </li>
                  <li>
                    Seus dados sejam armazenados em servidores na nuvem (Firebase, Supabase, Cloudflare) com
                    criptografia e medidas de segurança adequadas
                  </li>
                  <li>
                    Você pode revogar este consentimento a qualquer momento entrando em contato conosco
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Consentimento para Comunicações</h2>
              <div className="bg-green-50 border-l-4 border-green-600 p-4 my-4">
                <p className="font-semibold mb-2">Ao marcar o checkbox de comunicações, você consente que:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    A investigaree pode enviar e-mails e mensagens WhatsApp sobre o status dos seus relatórios
                  </li>
                  <li>
                    Você pode receber comunicações de marketing sobre novos recursos e ofertas (pode cancelar a
                    qualquer momento)
                  </li>
                  <li>
                    Você pode receber notificações importantes sobre sua conta e alterações nos Termos
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Política de Reembolso</h2>
              <p>
                Devido à natureza digital e personalizada dos nossos relatórios, não oferecemos reembolsos após o
                início do processamento. Antes de solicitar um relatório:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Certifique-se de que possui os dados corretos da pessoa investigada</li>
                <li>Verifique se selecionou o plano adequado às suas necessidades</li>
                <li>Entre em contato com nosso suporte em caso de dúvidas</li>
              </ul>
              <p className="mt-4">
                Exceções podem ser feitas em casos de falhas técnicas comprovadas ou impossibilidade de gerar
                o relatório por motivos internos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Suspensão e Encerramento</h2>
              <p>
                Reservamos o direito de suspender ou encerrar sua conta imediatamente, sem aviso prévio, se:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Você violar qualquer disposição destes Termos</li>
                <li>Houver suspeita de uso fraudulento ou ilegal da plataforma</li>
                <li>Você fornecer informações falsas ou enganosas</li>
                <li>Houver risco à segurança ou integridade da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Modificações nos Termos</h2>
              <p>
                Podemos modificar estes Termos de Uso a qualquer momento. Notificaremos você sobre alterações
                significativas por e-mail ou através de um aviso na plataforma. O uso continuado da plataforma
                após as alterações constitui sua aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Lei Aplicável e Foro</h2>
              <p>
                Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, incluindo a LGPD.
                Qualquer disputa decorrente destes Termos será resolvida no foro da comarca de [Cidade], com
                exclusão de qualquer outro, por mais privilegiado que seja.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contato e Encarregado de Dados</h2>
              <p>
                Para questões sobre estes Termos ou sobre tratamento de dados pessoais:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4 space-y-2">
                <p><strong>investigaree</strong></p>
                <p><strong>E-mail Geral:</strong> contato@investigaree.com.br</p>
                <p><strong>Encarregado de Dados (DPO):</strong> dpo@investigaree.com.br</p>
                <p><strong>Privacidade:</strong> privacidade@investigaree.com.br</p>
                <p><strong>Website:</strong> https://investigaree.com.br</p>
              </div>
            </section>

            <section className="bg-yellow-50 border-l-4 border-yellow-600 p-6 my-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ⚖️ Declaração de Conformidade LGPD
              </h2>
              <p className="mb-4">
                A <strong>investigaree</strong> declara que todos os processos de tratamento de dados pessoais
                são realizados em total conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
              <p>
                Implementamos medidas técnicas e organizacionais adequadas para garantir a segurança, privacidade
                e proteção dos dados pessoais de nossos usuários e dos titulares de dados investigados, em conformidade
                com os princípios de:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Finalidade, adequação e necessidade</li>
                <li>Livre acesso, qualidade dos dados e transparência</li>
                <li>Segurança, prevenção e responsabilização</li>
              </ul>
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
