"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Vote, AlertCircle, TrendingUp, Users, DollarSign } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";
import { useComurgData } from "@/contexts/ComurgDataContext";
import { FichaFuncionarioModal } from "@/components/FichaFuncionarioModal";

export default function ComurgAtividadePolitica() {
  const { userInfo, loading: authLoading } = useUserAccess();
  const { funcionarios, loading: dataLoading, error } = useComurgData();
  const router = useRouter();
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<any>(null);
  const [modalAberto, setModalAberto] = useState(false);

  // Proteção: apenas usuários do tenant COMURG podem acessar
  useEffect(() => {
    if (!authLoading && userInfo?.tenant?.code !== 'COMURG') {
      router.push('/dashboard');
    }
  }, [userInfo, authLoading, router]);

  // Filtrar candidatos
  const candidatos = useMemo(() => {
    return funcionarios.filter((f) =>
      f.foi_candidato && String(f.foi_candidato).toUpperCase() === 'SIM'
    );
  }, [funcionarios]);

  // Filtrar doadores
  const doadores = useMemo(() => {
    return funcionarios.filter((f) =>
      f.foi_doador_eleitoral && String(f.foi_doador_eleitoral).toUpperCase() === 'SIM'
    );
  }, [funcionarios]);

  // Calcular total de doações
  const totalDoacoes = useMemo(() => {
    return doadores.reduce((sum, d) => {
      const valor = String(d.total_doacoes || "0")
        .replace(/[^\d,.-]/g, "")
        .replace(",", ".");
      return sum + (parseFloat(valor) || 0);
    }, 0);
  }, [doadores]);

  // Distribuição por grupo (candidatos)
  const statsCandidatos = useMemo(() => {
    const comurg = candidatos.filter(c =>
      c.grupo?.toLowerCase() === "comurg"
    ).length;
    const disposicao = candidatos.filter(c =>
      c.grupo?.toLowerCase() === "disposicao"
    ).length;
    return { total: candidatos.length, comurg, disposicao };
  }, [candidatos]);

  // Distribuição por grupo (doadores)
  const statsDoadores = useMemo(() => {
    const comurg = doadores.filter(d =>
      d.grupo?.toLowerCase() === "comurg"
    ).length;
    const disposicao = doadores.filter(d =>
      d.grupo?.toLowerCase() === "disposicao"
    ).length;
    return { total: doadores.length, comurg, disposicao };
  }, [doadores]);

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px] bg-white dark:bg-navy-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-white/60">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Bloquear renderização se não for COMURG
  if (userInfo?.tenant?.code !== 'COMURG') {
    return null;
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 lg:p-8 bg-white dark:bg-navy-950">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 text-center">
            Erro ao carregar dados
          </h3>
          <p className="text-red-700 dark:text-red-300 text-center mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 bg-white dark:bg-navy-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Vote className="w-8 h-8 text-purple-400" />
            Atividade Política
          </h1>
          <p className="text-slate-600 dark:text-white/60 mt-2">
            Monitoramento de envolvimento político - {statsCandidatos.total} candidatos e {statsDoadores.total} doadores identificados
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Candidatos */}
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-400 font-medium">CANDIDATOS</p>
                <p className="text-4xl font-bold text-purple-500">
                  {statsCandidatos.total}
                </p>
                <p className="text-sm text-purple-400 mt-2">
                  COMURG: {statsCandidatos.comurg} | Cedidos: {statsCandidatos.disposicao}
                </p>
              </div>
              <Users className="w-16 h-16 text-purple-500" />
            </div>
          </div>

          {/* Card 2: Doadores */}
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400 font-medium">DOADORES</p>
                <p className="text-4xl font-bold text-blue-500">
                  {statsDoadores.total}
                </p>
                <p className="text-sm text-blue-400 mt-2">
                  COMURG: {statsDoadores.comurg} | Cedidos: {statsDoadores.disposicao}
                </p>
              </div>
              <TrendingUp className="w-16 h-16 text-blue-500" />
            </div>
          </div>

          {/* Card 3: Total Doado */}
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400 font-medium">TOTAL DOADO</p>
                <p className="text-3xl font-bold text-green-500">
                  R$ {totalDoacoes.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <p className="text-sm text-green-400 mt-2">Soma declarada ao TSE</p>
              </div>
              <DollarSign className="w-16 h-16 text-green-500" />
            </div>
          </div>
        </div>

        {/* Alerta Informativo */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <Vote className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-purple-800 dark:text-purple-400">
                ATENÇÃO - ATIVIDADE POLÍTICA
              </p>
              <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">
                Funcionários com histórico de candidaturas eleitorais e/ou doações para campanhas.
                Verificar compatibilidade com legislação eleitoral, licenças concedidas e
                declarações de patrimônio. Doações incompatíveis com a renda podem indicar
                necessidade de análise adicional.
              </p>
            </div>
          </div>
        </div>

        {/* Grid de Seções - Candidaturas e Doações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SEÇÃO A - CANDIDATURAS */}
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Candidaturas ({statsCandidatos.total})
            </h2>

            {/* Lista de Candidatos com Scroll */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {candidatos.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  Nenhum candidato encontrado
                </div>
              ) : (
                candidatos.map((candidato, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-purple-500 pl-4 py-2 bg-navy-800/50 rounded-r-lg hover:bg-navy-800 transition-colors"
                  >
                    {/* Nome (clicável) */}
                    <button
                      onClick={() => {
                        setFuncionarioSelecionado(candidato);
                        setModalAberto(true);
                      }}
                      className="font-bold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer text-left text-lg"
                    >
                      {candidato.nome}
                    </button>

                    {/* Informações da Candidatura */}
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-white">Ano:</span>{" "}
                        {candidato.ano_candidatura || "N/A"}
                      </p>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-white">Cargo:</span>{" "}
                        {candidato.cargo_disputado || "N/A"}
                      </p>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-white">Partido:</span>{" "}
                        {candidato.partido || "N/A"}
                      </p>
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-white">Resultado:</span>{" "}
                        <span className={`font-bold ${
                          candidato.situacao_candidatura?.toLowerCase().includes('eleito')
                            ? 'text-green-400'
                            : 'text-orange-400'
                        }`}>
                          {candidato.situacao_candidatura || "N/A"}
                        </span>
                      </p>

                      {/* Badge de Grupo */}
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            candidato.grupo?.toLowerCase() === "comurg"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {candidato.grupo?.toUpperCase()}
                        </span>
                      </div>

                      {/* Detalhes adicionais */}
                      {candidato.detalhes_candidatura && (
                        <p className="text-xs text-slate-400 mt-2 italic">
                          {candidato.detalhes_candidatura}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Rodapé */}
            <div className="mt-4 pt-4 border-t border-navy-700">
              <p className="text-sm text-white/50">
                Total de {statsCandidatos.total} candidatura(s) identificada(s)
              </p>
            </div>
          </div>

          {/* SEÇÃO B - DOAÇÕES ELEITORAIS */}
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-400" />
              Doações Eleitorais ({statsDoadores.total})
            </h2>

            {/* Lista de Doadores com Scroll */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {doadores.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  Nenhum doador encontrado
                </div>
              ) : (
                doadores.map((doador, index) => {
                  // Extrair valor numérico da doação
                  const valor = String(doador.total_doacoes || "0")
                    .replace(/[^\d,.-]/g, "")
                    .replace(",", ".");
                  const valorNum = parseFloat(valor) || 0;

                  return (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-2 bg-navy-800/50 rounded-r-lg hover:bg-navy-800 transition-colors"
                    >
                      {/* Nome (clicável) */}
                      <button
                        onClick={() => {
                          setFuncionarioSelecionado(doador);
                          setModalAberto(true);
                        }}
                        className="font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer text-left text-lg"
                      >
                        {doador.nome}
                      </button>

                      {/* Informações da Doação */}
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-slate-300">
                          <span className="font-semibold text-white">Ano:</span>{" "}
                          {doador.ano_doacao || "N/A"}
                        </p>
                        <p className="text-sm text-slate-300">
                          <span className="font-semibold text-white">Valor Total:</span>{" "}
                          <span className="text-emerald-400 font-bold">
                            R$ {valorNum.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </p>
                        <p className="text-sm text-slate-300">
                          <span className="font-semibold text-white">Beneficiário:</span>{" "}
                          {doador.beneficiario_doacao || "N/A"}
                        </p>
                        <p className="text-sm text-slate-300">
                          <span className="font-semibold text-white">Partido:</span>{" "}
                          {doador.partido_beneficiario || "N/A"}
                        </p>

                        {/* Badge de Grupo */}
                        <div className="mt-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              doador.grupo?.toLowerCase() === "comurg"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-purple-500/20 text-purple-400"
                            }`}
                          >
                            {doador.grupo?.toUpperCase()}
                          </span>

                          {/* Badge de incompatibilidade (se houver) */}
                          {doador.doacao_incompativel_renda?.toUpperCase() === "SIM" && (
                            <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400">
                              VERIFICAR RENDA
                            </span>
                          )}
                        </div>

                        {/* Detalhes adicionais */}
                        {doador.detalhes_doacoes && (
                          <p className="text-xs text-slate-400 mt-2 italic">
                            {doador.detalhes_doacoes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Rodapé */}
            <div className="mt-4 pt-4 border-t border-navy-700">
              <p className="text-sm text-white/50">
                Total de {statsDoadores.total} doador(es) identificado(s)
              </p>
            </div>
          </div>
        </div>

        {/* Modal de Ficha do Funcionário */}
        <FichaFuncionarioModal
          funcionario={funcionarioSelecionado}
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
        />
      </motion.div>
    </div>
  );
}
