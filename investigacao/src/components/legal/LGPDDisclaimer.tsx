import { Shield, CheckCircle2, Lock, AlertTriangle } from 'lucide-react'

interface LGPDDisclaimerProps {
  variant?: 'rh' | 'due-diligence' | 'patrimonial' | 'licitacoes' | 'executives'
}

export function LGPDDisclaimer({ variant = 'rh' }: LGPDDisclaimerProps) {
  const getContent = () => {
    switch (variant) {
      case 'rh':
        return {
          title: 'Conformidade Legal e LGPD',
          description: 'Background check profissional em conformidade total com a Lei Geral de Proteção de Dados',
          sources: [
            'Receita Federal (CPF/CNPJ - dados públicos)',
            'Portal da Transparência (CEIS/CNEP - sanções públicas)',
            'TSE (Tribunal Superior Eleitoral - candidaturas e doações)',
            'Tribunais (processos judiciais não sigilosos)',
            'Diários Oficiais (DOU, DOE, DOM - publicações legais)',
          ],
          sensitiveData: [
            {
              title: 'CNIS/INSS (Histórico Empregatício)',
              requirement: 'Requer autorização por escrito do candidato ou ordem judicial',
            },
          ],
        }
      case 'due-diligence':
        return {
          title: 'Conformidade Legal e Transparência',
          description: 'Due diligence empresarial utilizando exclusivamente fontes públicas governamentais',
          sources: [
            'Receita Federal (CNPJ - situação cadastral pública)',
            'Portal da Transparência (CEIS/CNEP - empresas sancionadas)',
            'Juntas Comerciais (contratos sociais e quadro societário)',
            'Tribunais (processos judiciais públicos)',
            'Cartórios de Protesto (dívidas protestadas)',
            'Diários Oficiais (contratos, licitações, publicações)',
          ],
          sensitiveData: [
            {
              title: 'Dados Bancários e Financeiros',
              requirement: 'NÃO acessamos. Informamos ao cliente como solicitar judicialmente via CCS/Bacen.',
            },
          ],
        }
      case 'patrimonial':
        return {
          title: '⚖️ Conformidade Legal Estrita',
          description: 'Investigação patrimonial forense em estrita conformidade com LGPD, Constituição Federal (Art. 5º) e CPC',
          sources: [
            'Registro de Imóveis (CNJ - dados públicos)',
            'Juntas Comerciais (vínculos empresariais)',
            'DETRAN (veículos - 27 estados + ANAC + Marinha)',
            'Cartórios de Protesto (dívidas)',
            'Tribunais (processos e execuções)',
            'Diários Oficiais (contratos públicos)',
            'Blockchain (Bitcoin, Ethereum - ledgers públicos)',
            'ICIJ Database (Panama Papers, Paradise Papers - vazamentos publicados)',
            'Perfis PÚBLICOS em redes sociais (sem login)',
          ],
          sensitiveData: [
            {
              title: 'Contas Bancárias (CCS/Bacen)',
              requirement: '🔒 SOMENTE com requisição judicial específica',
            },
            {
              title: 'Declarações de IR (DIRPF)',
              requirement: '🔒 SOMENTE com ordem judicial',
            },
            {
              title: 'Mensagens Privadas e E-mails',
              requirement: '🔒 NÃO ACESSAMOS - protegidos por sigilo',
            },
          ],
        }
      case 'licitacoes':
        return {
          title: 'Conformidade Legal - Dados Públicos de Sanções',
          description: 'Auditoria de licitações baseada exclusivamente em fontes oficiais governamentais',
          sources: [
            'Portal da Transparência (CEIS/CNEP - empresas inidôneas)',
            'Receita Federal (CNPJ - situação cadastral)',
            'TCU (Tribunal de Contas da União - decisões)',
            'CGU (Controladoria-Geral da União - auditorias)',
            'Diários Oficiais (DOU, DOE, DOM)',
            'Tribunais (processos de improbidade administrativa)',
            'Painéis de Preços (Gov - SINAPI, SICRO, BEC)',
          ],
          sensitiveData: [],
        }
      case 'executives':
        return {
          title: 'Conformidade Legal e Proteção de Dados',
          description: 'Verificação C-Level premium respeitando limites legais da LGPD e privacidade',
          sources: [
            'Receita Federal (CPF/CNPJ públicos)',
            'TSE (candidaturas e doações eleitorais)',
            'Tribunais (processos judiciais não sigilosos)',
            'CEIS/CNEP (sanções administrativas)',
            'Perfis PÚBLICOS em redes sociais profissionais',
            'OFAC/EUA, Interpol (listas públicas internacionais)',
            'ICIJ Panama Papers, Paradise Papers (vazamentos publicados)',
          ],
          sensitiveData: [
            {
              title: 'Validação de Diplomas',
              requirement: 'Requer autorização por escrito do candidato',
            },
            {
              title: 'Contato com Ex-Empregadores',
              requirement: 'Requer autorização prévia do candidato',
            },
            {
              title: 'CNIS/INSS (Histórico Empregatício)',
              requirement: 'Requer consentimento expresso',
            },
          ],
        }
      default:
        return getContent() // fallback to 'rh'
    }
  }

  const content = getContent()

  return (
    <section className="py-20 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              <Shield className="w-4 h-4" />
              <span>100% Legal • LGPD Compliant</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {content.title}
            </h2>
            <p className="text-lg text-slate-600">
              {content.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Fontes Públicas */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Fontes Públicas Consultadas
                </h3>
              </div>
              <ul className="space-y-3">
                {content.sources.map((source, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dados Sensíveis / Proteções */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {content.sensitiveData.length > 0 ? 'Dados Sensíveis - Requerem Autorização' : 'Não Acessamos'}
                </h3>
              </div>
              {content.sensitiveData.length > 0 ? (
                <ul className="space-y-4">
                  {content.sensitiveData.map((item, idx) => (
                    <li key={idx} className="space-y-1">
                      <div className="font-semibold text-slate-900 text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-600 ml-6">
                        {item.requirement}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Lock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>E-mails privados</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Lock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Mensagens (WhatsApp, Telegram, SMS)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Lock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Dados de saúde (protegidos por sigilo médico)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Lock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Contas bancárias (protegidas por sigilo bancário)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-700">
                    <Lock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>Perfis privados em redes sociais (requerem login)</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Base Legal */}
          <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl">
            <h4 className="font-bold text-blue-900 mb-2">Base Legal:</h4>
            <p className="text-sm text-blue-800">
              <strong>Lei nº 13.709/2018 (LGPD)</strong> - Artigos 7º (bases legais), 11 (dados sensíveis), §4º (dados manifestamente públicos).
              <br />
              <strong>Lei nº 12.527/2011</strong> - Lei de Acesso à Informação (LAI).
              <br />
              <strong>Constituição Federal</strong> - Art. 5º, X e XII (privacidade e sigilo de correspondências).
              {variant === 'patrimonial' && (
                <>
                  <br />
                  <strong>Código de Processo Civil</strong> - Art. 369-484 (provas judiciais).
                </>
              )}
              {variant === 'licitacoes' && (
                <>
                  <br />
                  <strong>Lei nº 14.133/2021</strong> - Nova Lei de Licitações e Contratos Administrativos.
                </>
              )}
            </p>
          </div>

          {/* Privacy Statement */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              <Lock className="w-4 h-4 inline mr-1 text-slate-500" />
              <strong>Privacidade:</strong> Não vendemos, compartilhamos ou armazenamos dados pessoais além do estritamente necessário para a prestação do serviço contratado.
              Todos os relatórios são confidenciais e entregues apenas ao contratante.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
