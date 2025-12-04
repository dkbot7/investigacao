import { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade | investigaree",
  description: "Política de Privacidade e Proteção de Dados Pessoais da investigaree, em conformidade com a LGPD.",
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-navy-950">
      {/* Header - Compacto (UX: Padrão F) */}
      <header className="bg-gradient-to-br from-navy-900 to-navy-950 border-b border-navy-800">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Lado esquerdo - Padrão F */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Política de Privacidade</h1>
                <p className="text-sm text-navy-300">Atualizado em 01/12/2025</p>
              </div>
            </div>
            {/* Lado direito - Link voltar */}
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition text-sm">
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
            <h2 className="text-xl font-bold text-white mb-4">1. Introdução</h2>
            <p className="text-white/80 leading-relaxed">
              A <strong>investigaree</strong> (&quot;nós&quot;, &quot;nosso&quot; ou &quot;empresa&quot;) está comprometida com a proteção
              da privacidade e dos dados pessoais de nossos usuários, clientes e visitantes. Esta Política de
              Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais,
              em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD) e demais
              legislações aplicáveis.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">2. Controlador de Dados</h2>
            <div className="bg-navy-900 p-6 rounded-lg border border-navy-800">
              <p className="text-white/80 mb-2"><strong>Razão Social:</strong> investigaree Serviços de Investigação Digital LTDA</p>
              <p className="text-white/80 mb-2"><strong>E-mail do Encarregado (DPO):</strong> privacidade@investigaree.com.br</p>
              <p className="text-white/80"><strong>Localização:</strong> Brasil</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">3. Dados Pessoais Coletados</h2>
            <p className="text-white/80 mb-4">Podemos coletar os seguintes tipos de dados pessoais:</p>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">3.1 Dados de Identificação</h3>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li>Nome completo</li>
              <li>E-mail</li>
              <li>Telefone/WhatsApp</li>
              <li>CPF/CNPJ (quando necessário para prestação de serviços)</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">3.2 Dados de Navegação</h3>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li>Endereço IP</li>
              <li>Tipo de navegador e dispositivo</li>
              <li>Páginas visitadas e tempo de permanência</li>
              <li>Cookies e tecnologias similares (veja nossa <Link href="/cookies" className="text-primary-400 hover:underline">Política de Cookies</Link>)</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6 mb-3">3.3 Dados Fornecidos Voluntariamente</h3>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li>Informações enviadas via formulários de contato</li>
              <li>Documentos e informações relacionados às investigações contratadas</li>
              <li>Comunicações por e-mail ou chat</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">4. Finalidades do Tratamento</h2>
            <p className="text-white/80 mb-4">Utilizamos seus dados pessoais para as seguintes finalidades:</p>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li><strong>Prestação de serviços:</strong> Execução dos serviços de investigação e due diligence contratados</li>
              <li><strong>Comunicação:</strong> Responder solicitações, enviar atualizações sobre serviços e novidades</li>
              <li><strong>Cadastro:</strong> Criar e gerenciar sua conta na plataforma</li>
              <li><strong>Segurança:</strong> Prevenir fraudes e garantir a segurança da plataforma</li>
              <li><strong>Melhorias:</strong> Aprimorar nossos serviços e experiência do usuário</li>
              <li><strong>Obrigações legais:</strong> Cumprir obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">5. Base Legal para o Tratamento</h2>
            <p className="text-white/80 mb-4">O tratamento de dados pessoais é realizado com base nas seguintes hipóteses legais (Art. 7º da LGPD):</p>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li><strong>Consentimento:</strong> Para envio de comunicações de marketing e uso de cookies não essenciais</li>
              <li><strong>Execução de contrato:</strong> Para prestação dos serviços contratados</li>
              <li><strong>Legítimo interesse:</strong> Para melhorias na plataforma e segurança</li>
              <li><strong>Cumprimento de obrigação legal:</strong> Para atender exigências legais e regulatórias</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">6. Compartilhamento de Dados</h2>
            <p className="text-white/80 mb-4">Seus dados pessoais podem ser compartilhados com:</p>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li><strong>Prestadores de serviços:</strong> Empresas que nos auxiliam na operação (hospedagem, processamento de pagamentos)</li>
              <li><strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial</li>
              <li><strong>Parceiros:</strong> Com seu consentimento expresso</li>
            </ul>
            <p className="text-white/80 mt-4">
              <strong>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing sem seu consentimento expresso.</strong>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">7. Seus Direitos (Art. 18 da LGPD)</h2>
            <p className="text-white/80 mb-4">Você possui os seguintes direitos em relação aos seus dados pessoais:</p>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li><strong>Confirmação e acesso:</strong> Confirmar a existência de tratamento e acessar seus dados</li>
              <li><strong>Correção:</strong> Solicitar a correção de dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Anonimização, bloqueio ou eliminação:</strong> De dados desnecessários ou tratados em desconformidade</li>
              <li><strong>Portabilidade:</strong> Solicitar a portabilidade dos dados a outro fornecedor</li>
              <li><strong>Eliminação:</strong> Solicitar a eliminação dos dados tratados com base no consentimento</li>
              <li><strong>Informação:</strong> Saber com quem seus dados foram compartilhados</li>
              <li><strong>Revogação:</strong> Revogar o consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento em caso de descumprimento da LGPD</li>
            </ul>
            <p className="text-white/80 mt-4">
              Para exercer seus direitos, entre em contato pelo e-mail: <strong>privacidade@investigaree.com.br</strong>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">8. Segurança dos Dados</h2>
            <p className="text-white/80 mb-4">
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado,
              perda, destruição ou alteração, incluindo:
            </p>
            <ul className="list-disc list-inside text-white/80 space-y-2">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controle de acesso baseado em funções</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Treinamento de colaboradores em proteção de dados</li>
              <li>Políticas de backup e recuperação de dados</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">9. Retenção de Dados</h2>
            <p className="text-white/80">
              Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades para as quais foram coletados,
              incluindo obrigações legais, contratuais, de prestação de contas ou requisição de autoridades competentes.
              Após o término do tratamento, os dados serão eliminados ou anonimizados, salvo quando houver necessidade de
              conservação para cumprimento de obrigação legal.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">10. Transferência Internacional de Dados</h2>
            <p className="text-white/80">
              Alguns de nossos prestadores de serviços podem estar localizados fora do Brasil. Nesses casos, garantimos que
              as transferências internacionais de dados sejam realizadas em conformidade com a LGPD, mediante a adoção de
              salvaguardas adequadas, como cláusulas contratuais padrão aprovadas pela ANPD.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">11. Alterações nesta Política</h2>
            <p className="text-white/80">
              Esta Política de Privacidade pode ser atualizada periodicamente. Quaisquer alterações significativas serão
              comunicadas por meio de aviso em nosso site ou por e-mail. Recomendamos que você revise esta política
              regularmente para se manter informado sobre como protegemos seus dados.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">12. Contato</h2>
            <p className="text-white/80 mb-4">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais,
              entre em contato conosco:
            </p>
            <div className="bg-navy-900 p-6 rounded-lg border border-navy-800">
              <p className="text-white/80 mb-2"><strong>E-mail:</strong> privacidade@investigaree.com.br</p>
              <p className="text-white/80 mb-2"><strong>Encarregado de Dados (DPO):</strong> dpo@investigaree.com.br</p>
              <p className="text-white/80"><strong>Site:</strong> www.investigaree.com.br</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">13. Autoridade Nacional de Proteção de Dados</h2>
            <p className="text-white/80">
              Caso entenda que o tratamento de seus dados pessoais viola a legislação de proteção de dados, você tem o
              direito de apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD):
              <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline ml-1">
                www.gov.br/anpd
              </a>
            </p>
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
            <Link href="/termos" className="text-white/60 hover:text-primary-400 transition">Termos de Uso</Link>
            <Link href="/cookies" className="text-white/60 hover:text-primary-400 transition">Política de Cookies</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
