"use client";

import { X, User, Briefcase, Building2, AlertTriangle, Gift, Vote, Shield, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FuncionarioData {
  Cadastro: number;
  Nome: string;
  CPF: string;
  Nascimento: number;
  "Admissão": number;
  Sexo: string;
  "Vínculo": string;
  "Situação": string;
  Cargo: string;
  "Salário": number;
  Diretoria: string;
  Local: string;
  Posto: string;
  "CPF Válido?": string;
  "Está Vivo?": string;
  "Está Morto?": string;
  Telefones: string;
  Emails: string;
  "Recebe Benefício (BPC)?": string;
  "Qual Benefício?": string;
  "É Sócio de Empresa?": string;
  "Qtd Empresas": number;
  "Empresas Ativas": number;
  "Vínculos Empresariais (CNPJ)": string;
  "Foi Candidato?": string;
  "Foi Doador Eleitoral?": string;
  "Possui Sanção CGU?": string;
  "Alerta OFAC?": string;
  "Classificacao Risco": string;
  "Achados Contabeis": string;
  grupo: string;
}

interface FichaFuncionarioModalProps {
  funcionario: FuncionarioData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FichaFuncionarioModal({ funcionario, isOpen, onClose }: FichaFuncionarioModalProps) {
  if (!funcionario) return null;

  // Converter data serial do Excel para data legível
  const excelDateToJSDate = (serial: number) => {
    if (!serial || typeof serial !== 'number') return 'N/A';
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info.toLocaleDateString('pt-BR');
  };

  const isFalecido = funcionario["Está Morto?"]?.includes("SIM");
  const temEmpresa = funcionario["Empresas Ativas"] && funcionario["Empresas Ativas"] > 0;
  const recebeBeneficio = funcionario["Recebe Benefício (BPC)?"] === "SIM";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white dark:bg-navy-900 rounded-2xl shadow-2xl"
              >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-6 py-4 rounded-t-2xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-6 h-6 text-white" />
                        <h2 className="text-2xl font-bold text-white">{funcionario.Nome}</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                          {funcionario.grupo}
                        </span>
                        <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                          Cadastro: {funcionario.Cadastro}
                        </span>
                        {isFalecido && (
                          <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full font-bold">
                            ⚠️ ÓBITO CONFIRMADO
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-6">
                    {/* Informações Pessoais */}
                    <Section icon={User} title="Informações Pessoais">
                      <InfoRow label="CPF" value={funcionario.CPF} />
                      <InfoRow label="CPF Válido?" value={funcionario["CPF Válido?"]} />
                      <InfoRow label="Nascimento" value={excelDateToJSDate(funcionario.Nascimento)} />
                      <InfoRow label="Sexo" value={funcionario.Sexo} />
                      <InfoRow label="Está Vivo?" value={funcionario["Está Vivo?"]} />
                      <InfoRow label="Está Morto?" value={funcionario["Está Morto?"]} highlight={isFalecido} />
                    </Section>

                    {/* Vínculo Funcional */}
                    <Section icon={Briefcase} title="Vínculo Funcional">
                      <InfoRow label="Vínculo" value={funcionario["Vínculo"]} />
                      <InfoRow label="Situação" value={funcionario["Situação"]} />
                      <InfoRow label="Cargo" value={funcionario.Cargo} />
                      <InfoRow
                        label="Salário"
                        value={`R$ ${funcionario["Salário"]?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      />
                      <InfoRow label="Admissão" value={excelDateToJSDate(funcionario["Admissão"])} />
                      <InfoRow label="Diretoria" value={funcionario.Diretoria} />
                      <InfoRow label="Local" value={funcionario.Local} />
                      <InfoRow label="Posto" value={funcionario.Posto} />
                    </Section>

                    {/* Contato */}
                    <Section icon={Phone} title="Contato">
                      <InfoRow
                        label="Telefones"
                        value={funcionario.Telefones?.split(',').join(', ') || 'N/A'}
                      />
                      <InfoRow label="Emails" value={funcionario.Emails || 'N/A'} />
                    </Section>

                    {/* Vínculos Empresariais */}
                    {temEmpresa && (
                      <Section icon={Building2} title="Vínculos Empresariais" highlight>
                        <InfoRow label="É Sócio de Empresa?" value={funcionario["É Sócio de Empresa?"]} />
                        <InfoRow label="Qtd Empresas" value={funcionario["Qtd Empresas"]?.toString()} />
                        <InfoRow label="Empresas Ativas" value={funcionario["Empresas Ativas"]?.toString()} highlight />
                        <InfoRow
                          label="Detalhes"
                          value={funcionario["Vínculos Empresariais (CNPJ)"] || 'N/A'}
                          fullWidth
                        />
                      </Section>
                    )}

                    {/* Benefícios Sociais */}
                    {recebeBeneficio && (
                      <Section icon={Gift} title="Benefícios Sociais" highlight>
                        <InfoRow label="Recebe Benefício?" value={funcionario["Recebe Benefício (BPC)?"]} />
                        <InfoRow label="Qual Benefício?" value={funcionario["Qual Benefício?"]} fullWidth />
                      </Section>
                    )}

                    {/* Atividade Política */}
                    <Section icon={Vote} title="Atividade Política">
                      <InfoRow label="Foi Candidato?" value={funcionario["Foi Candidato?"]} />
                      <InfoRow label="Foi Doador Eleitoral?" value={funcionario["Foi Doador Eleitoral?"]} />
                    </Section>

                    {/* Sanções e Alertas */}
                    <Section icon={AlertTriangle} title="Sanções e Alertas">
                      <InfoRow label="Possui Sanção CGU?" value={funcionario["Possui Sanção CGU?"]} />
                      <InfoRow label="Alerta OFAC?" value={funcionario["Alerta OFAC?"]} />
                    </Section>

                    {/* Análise de Risco */}
                    <Section icon={Shield} title="Análise de Risco">
                      <InfoRow
                        label="Classificação de Risco"
                        value={funcionario["Classificacao Risco"]}
                        highlight={funcionario["Classificacao Risco"] === "Critico"}
                      />
                      <InfoRow
                        label="Achados Contábeis"
                        value={funcionario["Achados Contabeis"] || 'Nenhum'}
                        fullWidth
                      />
                    </Section>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-50 dark:bg-navy-800 px-6 py-4 rounded-b-2xl border-t border-slate-200 dark:border-navy-700">
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Fechar
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Componentes auxiliares
function Section({
  icon: Icon,
  title,
  children,
  highlight = false
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`${highlight ? 'bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800' : 'bg-slate-50 dark:bg-navy-800'} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-5 h-5 ${highlight ? 'text-orange-600' : 'text-green-600 dark:text-green-400'}`} />
        <h3 className={`font-semibold ${highlight ? 'text-orange-900 dark:text-orange-400' : 'text-slate-900 dark:text-white'}`}>
          {title}
        </h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight = false,
  fullWidth = false
}: {
  label: string;
  value: string | undefined;
  highlight?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div className={`${fullWidth ? '' : 'grid grid-cols-3 gap-4'}`}>
      <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}:</dt>
      <dd className={`${fullWidth ? 'mt-1' : 'col-span-2'} text-sm ${highlight ? 'font-bold text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
        {value || 'N/A'}
      </dd>
    </div>
  );
}

