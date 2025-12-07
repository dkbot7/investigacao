"use client";

import { motion } from "framer-motion";
import {
  X,
  User,
  CreditCard,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  Vote,
  Heart,
  AlertTriangle,
  Shield,
  Globe,
  HeartPulse,
  UserCheck,
  UserX,
  FileText,
  Hash,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  Award,
  TrendingUp,
  Clock,
  BadgeCheck,
  BadgeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Funcionario {
  id: string;
  cadastro?: string;
  nome: string;
  cpf: string;
  grupo: string;
  cargo?: string;
  salario?: number;
  data_admissao?: string;
  data_nascimento?: string;
  sexo?: string;
  vinculo?: string;
  local_trabalho?: string;
  centro_custo?: string;
  esta_vivo?: string;
  esta_morto?: string;
  ano_obito?: number;
  recebe_beneficio?: number;
  qual_beneficio?: string;
  socio_empresa?: number;
  qtd_empresas?: number;
  doador_campanha?: number;
  valor_doacoes?: number;
  candidato?: number;
  sancionado_ceis?: number;
  sancionado_ofac?: number;
}

interface Candidatura {
  cargo: string;
  partido: string;
  uf: string;
  municipio?: string;
  ano: number;
  situacao: string;
  votos?: number;
}

interface Doacao {
  valor: number;
  candidato: string;
  partido: string;
  cargo?: string;
  ano: number;
}

interface Vinculo {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  qualificacao: string;
  situacao_cadastral: string;
  capital_social?: number;
}

interface Sancao {
  tipo: string;
  orgao: string;
  motivo: string;
  data_inicio: string;
  data_fim: string;
}

interface Beneficio {
  tipo: string;
  valor: number;
  ano: number;
}

interface FichaCompleta {
  funcionario: Funcionario;
  candidaturas?: Candidatura[];
  doacoes?: Doacao[];
  vinculos?: Vinculo[];
  sancoes?: Sancao[];
  beneficios?: Beneficio[];
}

interface FichaFuncionarioProps {
  funcionario: Funcionario;
  candidaturas?: Candidatura[];
  doacoes?: Doacao[];
  vinculos?: Vinculo[];
  sancoes?: Sancao[];
  beneficios?: Beneficio[];
  onClose: () => void;
}

export function FichaFuncionario({
  funcionario,
  candidaturas = [],
  doacoes = [],
  vinculos = [],
  sancoes = [],
  beneficios = [],
  onClose,
}: FichaFuncionarioProps) {
  const isFalecido = funcionario.esta_morto?.includes("SIM");
  const totalDoacoes = doacoes.reduce((sum, d) => sum + (d.valor || 0), 0);
  const temAlertas = isFalecido || funcionario.sancionado_ceis === 1 || sancoes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl my-8 bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-400 dark:border-navy-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com status */}
        <div className={`p-6 border-b ${
          isFalecido
            ? "border-red-500/30 bg-red-500/10"
            : temAlertas
            ? "border-amber-500/30 bg-amber-500/10"
            : "border-slate-400 dark:border-navy-700 bg-slate-100 dark:bg-navy-800/50"
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                isFalecido
                  ? "bg-red-500/20"
                  : temAlertas
                  ? "bg-amber-500/20"
                  : "bg-navy-700"
              }`}>
                <User className={`w-8 h-8 ${
                  isFalecido ? "text-red-400" : temAlertas ? "text-amber-400" : "text-blue-400"
                }`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{funcionario.nome}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-slate-700 dark:text-white/70 text-sm">
                    <CreditCard className="w-3.5 h-3.5" />
                    {formatCPF(funcionario.cpf)}
                  </span>
                  {funcionario.cadastro && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-slate-700 dark:text-white/70 text-sm">
                      <Hash className="w-3.5 h-3.5" />
                      {funcionario.cadastro}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${
                    isFalecido
                      ? "bg-red-500/20 text-red-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {isFalecido ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    {isFalecido ? `Falecido (${funcionario.ano_obito})` : "Vivo"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* Alertas Criticos */}
          {temAlertas && (
            <div className="space-y-3">
              {isFalecido && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <HeartPulse className="w-6 h-6 text-red-400" />
                    <div>
                      <h4 className="font-semibold text-red-400">ALERTA: Funcionario Falecido</h4>
                      <p className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70 mt-1">
                        Obito registrado em <strong className="text-slate-900 dark:text-white">{funcionario.ano_obito}</strong>.
                        Verificar situacao na folha de pagamento e regularizar cadastro.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(funcionario.sancionado_ceis === 1 || sancoes.length > 0) && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <div>
                      <h4 className="font-semibold text-red-400">ALERTA: Sancionado (CEIS/CNEP)</h4>
                      <p className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70 mt-1">
                        Funcionario possui sancoes ativas. Verificar compatibilidade com o cargo.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dados Pessoais */}
          <Section title="Dados Pessoais" icon={User}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoCard label="Nome Completo" value={funcionario.nome} />
              <InfoCard label="CPF" value={formatCPF(funcionario.cpf)} mono />
              <InfoCard label="Cadastro" value={funcionario.cadastro || "N/I"} mono />
              <InfoCard label="Data Nascimento" value={funcionario.data_nascimento || "N/I"} />
              <InfoCard label="Sexo" value={funcionario.sexo || "N/I"} />
              <InfoCard label="Grupo" value={funcionario.grupo} highlight />
            </div>
          </Section>

          {/* Dados Funcionais */}
          <Section title="Dados Funcionais" icon={Briefcase}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoCard label="Cargo" value={funcionario.cargo || "N/I"} />
              <InfoCard
                label="Salario"
                value={funcionario.salario
                  ? `R$ ${funcionario.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : "N/I"
                }
                highlight={!!funcionario.salario}
              />
              <InfoCard label="Data Admissao" value={funcionario.data_admissao || "N/I"} />
              <InfoCard label="Vinculo" value={funcionario.vinculo || "N/I"} />
              <InfoCard label="Local de Trabalho" value={funcionario.local_trabalho || "N/I"} />
              <InfoCard label="Centro de Custo" value={funcionario.centro_custo || "N/I"} />
            </div>
          </Section>

          {/* Status de Vida */}
          <Section title="Verificacao de Vida" icon={HeartPulse}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard
                label="Esta Vivo?"
                value={funcionario.esta_vivo || "N/I"}
                status={funcionario.esta_vivo === "SIM" ? "success" : funcionario.esta_vivo === "NAO" ? "error" : undefined}
              />
              <InfoCard
                label="Esta Morto?"
                value={funcionario.esta_morto || "N/I"}
                status={funcionario.esta_morto?.includes("SIM") ? "error" : "success"}
              />
              <InfoCard
                label="Ano do Obito"
                value={funcionario.ano_obito?.toString() || "-"}
                status={funcionario.ano_obito ? "error" : undefined}
              />
              <InfoCard
                label="Fonte"
                value="Receita Federal"
              />
            </div>
          </Section>

          {/* Candidaturas */}
          {(funcionario.candidato === 1 || candidaturas.length > 0) && (
            <Section title="Candidaturas em Eleicoes" icon={Vote} color="purple" count={candidaturas.length}>
              {candidaturas.length > 0 ? (
                <div className="space-y-3">
                  {candidaturas.map((c, i) => (
                    <div key={i} className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-slate-900 dark:text-white">{c.cargo}</h5>
                          <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
                            {c.partido} - {c.uf} {c.municipio && `/ ${c.municipio}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-purple-400 font-bold">{c.ano}</span>
                          <p className={`text-xs mt-1 ${
                            c.situacao === "Eleito" ? "text-emerald-400" : "text-slate-500 dark:text-white/50"
                          }`}>{c.situacao}</p>
                        </div>
                      </div>
                      {c.votos !== undefined && c.votos > 0 && (
                        <p className="text-sm text-slate-900 dark:text-slate-500 dark:text-white/50 mt-2">
                          Votos: {c.votos.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm">Funcionario foi candidato, mas detalhes nao disponiveis.</p>
              )}
            </Section>
          )}

          {/* Doacoes */}
          {(funcionario.doador_campanha === 1 || doacoes.length > 0) && (
            <Section
              title="Doacoes de Campanha"
              icon={Heart}
              color="emerald"
              count={doacoes.length}
              extra={totalDoacoes > 0 ? `Total: R$ ${totalDoacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : undefined}
            >
              {doacoes.length > 0 ? (
                <div className="space-y-3">
                  {doacoes.map((d, i) => (
                    <div key={i} className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-slate-900 dark:text-white">{d.candidato}</h5>
                          <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
                            {d.partido} {d.cargo && `- ${d.cargo}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-400 font-bold">
                            R$ {d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 mt-1">{d.ano}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm">
                  Total doado: R$ {(funcionario.valor_doacoes || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              )}
            </Section>
          )}

          {/* Vinculos Empresariais */}
          {(funcionario.socio_empresa === 1 || vinculos.length > 0) && (
            <Section
              title="Vinculos Empresariais"
              icon={Building2}
              color="amber"
              count={vinculos.length || funcionario.qtd_empresas}
            >
              {vinculos.length > 0 ? (
                <div className="space-y-3">
                  {vinculos.map((v, i) => (
                    <div key={i} className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-slate-900 dark:text-white">{v.razao_social}</h5>
                          {v.nome_fantasia && (
                            <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">{v.nome_fantasia}</p>
                          )}
                          <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 mt-1 font-mono">{formatCNPJ(v.cnpj)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          v.situacao_cadastral === "ATIVA"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {v.situacao_cadastral}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-3 pt-3 border-t border-amber-500/10 text-sm">
                        <span className="text-slate-900 dark:text-slate-600 dark:text-white/60">
                          Qualificacao: <span className="text-slate-900 dark:text-white">{v.qualificacao}</span>
                        </span>
                        {v.capital_social && (
                          <span className="text-slate-900 dark:text-slate-600 dark:text-white/60">
                            Capital: <span className="text-slate-900 dark:text-white">R$ {v.capital_social.toLocaleString('pt-BR')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm">
                  Socio de {funcionario.qtd_empresas || "N/I"} empresa(s).
                </p>
              )}
            </Section>
          )}

          {/* Sancoes */}
          {(funcionario.sancionado_ceis === 1 || sancoes.length > 0) && (
            <Section title="Sancoes CEIS/CNEP" icon={AlertTriangle} color="red" count={sancoes.length}>
              {sancoes.length > 0 ? (
                <div className="space-y-3">
                  {sancoes.map((s, i) => (
                    <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400">
                            {s.tipo}
                          </span>
                          <p className="text-slate-900 dark:text-white font-medium mt-2">{s.motivo}</p>
                          <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">Orgao: {s.orgao}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-3 pt-3 border-t border-red-500/10 text-sm">
                        <span className="text-slate-900 dark:text-slate-600 dark:text-white/60">
                          Inicio: <span className="text-slate-900 dark:text-white">{s.data_inicio}</span>
                        </span>
                        <span className="text-slate-900 dark:text-slate-600 dark:text-white/60">
                          Fim: <span className="text-red-400 font-medium">{s.data_fim}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm">Detalhes da sancao nao disponiveis.</p>
              )}
            </Section>
          )}

          {/* Beneficios Sociais */}
          {(funcionario.recebe_beneficio === 1 || beneficios.length > 0) && (
            <Section title="Beneficios Sociais Recebidos" icon={DollarSign} color="cyan" count={beneficios.length}>
              {beneficios.length > 0 ? (
                <div className="space-y-3">
                  {beneficios.map((b, i) => (
                    <div key={i} className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-slate-900 dark:text-white">{formatBeneficio(b.tipo)}</h5>
                          <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">Ano: {b.ano}</p>
                        </div>
                        <span className="text-blue-400 font-bold">
                          R$ {b.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm">
                  Beneficio: {funcionario.qual_beneficio || "N/I"}
                </p>
              )}
            </Section>
          )}

          {/* OFAC */}
          {funcionario.sancionado_ofac === 1 && (
            <Section title="OFAC/PEP - Lista de Sancoes Internacionais" icon={Globe} color="orange">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-400 font-medium">Match identificado na lista OFAC</p>
                <p className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70 mt-2">
                  Este funcionario possui nome similar a entradas na lista SDN (Specially Designated Nationals) do Tesouro dos EUA.
                  Recomenda-se verificacao manual adicional.
                </p>
              </div>
            </Section>
          )}

          {/* Sem Alertas */}
          {!temAlertas &&
           !funcionario.candidato &&
           !funcionario.doador_campanha &&
           !funcionario.socio_empresa &&
           !funcionario.recebe_beneficio && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
              <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-emerald-400 font-semibold text-lg">Sem Alertas ou Apontamentos</h4>
              <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm mt-2">
                Nenhuma irregularidade ou apontamento identificado nas verificacoes realizadas.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-400 dark:border-navy-700 bg-slate-100 dark:bg-navy-800/50 flex justify-between items-center">
          <p className="text-xs text-slate-900 dark:text-white/40">
            Dados verificados em fontes publicas oficiais
          </p>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white border border-navy-600"
          >
            Fechar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Componentes auxiliares
function Section({
  title,
  icon: Icon,
  children,
  color = "gold",
  count,
  extra
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  color?: string;
  count?: number;
  extra?: string;
}) {
  const colorClasses: Record<string, string> = {
    gold: "text-blue-400",
    purple: "text-purple-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
    cyan: "text-blue-400",
    orange: "text-orange-400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${colorClasses[color]} flex items-center gap-2`}>
          <Icon className="w-4 h-4" />
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-white/10 text-xs">
              {count}
            </span>
          )}
        </h3>
        {extra && (
          <span className={`text-sm font-medium ${colorClasses[color]}`}>{extra}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function InfoCard({
  label,
  value,
  mono = false,
  highlight = false,
  status
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  status?: "success" | "error";
}) {
  return (
    <div className="bg-slate-100 dark:bg-navy-800/50 rounded-lg p-3">
      <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 mb-1">{label}</p>
      <p className={`text-sm ${mono ? "font-mono" : ""} ${
        status === "success" ? "text-emerald-400" :
        status === "error" ? "text-red-400" :
        highlight ? "text-blue-400 font-medium" : "text-white"
      }`}>
        {value}
      </p>
    </div>
  );
}

// Utilitarios
function formatCPF(cpf: string): string {
  const nums = cpf.replace(/\D/g, '');
  if (nums.length !== 11) return cpf;
  return `${nums.slice(0,3)}.${nums.slice(3,6)}.${nums.slice(6,9)}-${nums.slice(9)}`;
}

function formatCNPJ(cnpj: string): string {
  const nums = cnpj.replace(/\D/g, '');
  if (nums.length !== 14) return cnpj;
  return `${nums.slice(0,2)}.${nums.slice(2,5)}.${nums.slice(5,8)}/${nums.slice(8,12)}-${nums.slice(12)}`;
}

function formatBeneficio(tipo: string): string {
  const tipos: Record<string, string> = {
    'AUXILIO_EMERGENCIAL': 'Auxilio Emergencial',
    'BOLSA_FAMILIA': 'Bolsa Familia',
    'BPC': 'BPC - Beneficio de Prestacao Continuada',
    'SEGURO_DEFESO': 'Seguro Defeso',
  };
  return tipos[tipo] || tipo;
}
