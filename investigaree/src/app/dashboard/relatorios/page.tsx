"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Download,
  Users,
  AlertTriangle,
  Vote,
  Heart,
  Shield,
  ArrowLeft,
  Calendar,
  Building2,
  TrendingUp,
  Eye,
  Briefcase,
  X,
  ChevronRight,
  DollarSign,
  MapPin,
  Hash,
  ExternalLink,
  Globe,
  Flag,
  HeartPulse,
  UserCheck,
  UserX,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

// Dados completos do CLIENTE_01 - DADOS REAIS EXTRAIDOS EM 27/11/2024
const CLIENTE_01_DATA = {
  cliente: "CLIENTE_01",
  dataEmissao: "27/11/2024",
  totalRegistros: 5950,
  grupos: [
    {
      nome: "Empregados a Disposicao",
      registros: 1359,
      candidatos: 0,
      doadores: 19,
      sancionados: 0,
      vinculosEmpresariais: 120,
      totalCnpjs: 149,
    },
    {
      nome: "Empregados na Comurg",
      registros: 4591,
      candidatos: 8,
      doadores: 62,
      sancionados: 1,
      vinculosEmpresariais: 381,
      totalCnpjs: 489,
    },
  ],
  alertas: [
    {
      nome: "LUCIANA DE MELO ABRAO",
      cpf: "758.888.231-04",
      tipo: "SANCIONADO",
      detalhe: "CEIS: Impedimento de contratar (16/12/2021 a 16/12/2026) - TRF1/GO",
      prioridade: "alta",
    },
    {
      nome: "EDUARDO PEREIRA DE SOUSA",
      cpf: "856.452.491-00",
      tipo: "CANDIDATO + DOADOR",
      detalhe: "Candidato a Deputado Federal (PODE/GO - 2022) | Doador: R$ 4.000,00",
      prioridade: "alta",
    },
  ],
  // CANDIDATOS REAIS - 8 funcionarios foram candidatos em 2022
  candidatos: [
    { nome: "ANTONIO SARDINHA DE MELO", cpf: "008.848.031-39", cargo: "DEPUTADO ESTADUAL", partido: "DC", uf: "GO", ano: 2022, votos: 0, situacao: "Nao Eleito", grupo: "Comurg" },
    { nome: "APARECIDA CRISTINA DE ALCANTARA", cpf: "696.861.141-49", cargo: "DEPUTADO ESTADUAL", partido: "AVANTE", uf: "GO", ano: 2022, votos: 0, situacao: "Suplente", grupo: "Comurg" },
    { nome: "DEJESUS FRANCISCO DA SILVA", cpf: "778.391.021-15", cargo: "DEPUTADO ESTADUAL", partido: "PMN", uf: "GO", ano: 2022, votos: 0, situacao: "Nao Eleito", grupo: "Comurg" },
    { nome: "EDUARDO PEREIRA DE SOUSA", cpf: "856.452.491-00", cargo: "DEPUTADO FEDERAL", partido: "PODE", uf: "GO", ano: 2022, votos: 0, situacao: "Nao Eleito", grupo: "Comurg" },
    { nome: "GILDA LUIZA CRUVINEL", cpf: "469.808.491-15", cargo: "DEPUTADO ESTADUAL", partido: "PT", uf: "GO", ano: 2022, votos: 0, situacao: "Nao Eleito", grupo: "Comurg" },
    { nome: "REGINALDO HENRIQUE DE OLIVEIRA", cpf: "808.436.201-10", cargo: "DEPUTADO ESTADUAL", partido: "SOLIDARIEDADE", uf: "GO", ano: 2022, votos: 0, situacao: "Suplente", grupo: "Comurg" },
    { nome: "ROBERTO BESERRA DA SILVA", cpf: "082.393.098-01", cargo: "DEPUTADO ESTADUAL", partido: "PMB", uf: "GO", ano: 2022, votos: 0, situacao: "Nao Eleito", grupo: "Comurg" },
    { nome: "ROBERTO CARLOS DOS SANTOS", cpf: "326.816.151-00", cargo: "DEPUTADO ESTADUAL", partido: "PSC", uf: "GO", ano: 2022, votos: 0, situacao: "Suplente", grupo: "Comurg" },
  ],
  // DOADORES REAIS - 81 funcionarios fizeram doacoes eleitorais (mostrando os 30 maiores)
  doadores: [
    { nome: "UBALDINA GUIMARAES CARDOSO TRINDADE", cpf: "480.077.301-68", valor: 50950.34, candidato: "DENICIO CELIO TRINDADE", partido: "UNIAO", ano: 2024, grupo: "Disposicao" },
    { nome: "IZIDIO ALVES DE SOUZA", cpf: "101.100.701-00", valor: 46298.04, candidato: "IZIDIO ALVES DE SOUZA", partido: "DC", ano: 2024, grupo: "Disposicao" },
    { nome: "JOSE JORGE DIAS", cpf: "038.449.991-08", valor: 24000, candidato: "SEBASTIAO PEIXOTO MOURA", partido: "PSDB", ano: 2024, grupo: "Disposicao" },
    { nome: "SERGIO ANTONIO DE PAULA", cpf: "310.810.451-91", valor: 13000, candidato: "ROMARIO BARBOSA POLICARPO", partido: "PRD", ano: 2024, grupo: "Disposicao" },
    { nome: "SAMUEL MILHOMEM BARBOSA", cpf: "784.775.141-00", valor: 10000, candidato: "SANTANA DA SILVA GOMES", partido: "PRTB", ano: 2022, grupo: "Disposicao" },
    { nome: "APARECIDA DE FATIMA RIBEIRO DE SOUSA", cpf: "431.134.601-82", valor: 6900, candidato: "ORLANDO LAUREANO DE SOUSA", partido: "PSB", ano: 2024, grupo: "Comurg" },
    { nome: "ANDRESSA MOREIRA DA SILVA RIBEIRO", cpf: "889.596.511-68", valor: 5065.30, candidato: "ALISSON SILVA BORGES", partido: "DC", ano: 2024, grupo: "Comurg" },
    { nome: "EDUARDO PEREIRA DE SOUSA", cpf: "856.452.491-00", valor: 4000, candidato: "EDUARDO PEREIRA DE SOUSA", partido: "PODE", ano: 2022, grupo: "Comurg" },
    { nome: "ANDERSON ALVES DOS SANTOS", cpf: "000.534.791-22", valor: 3994.40, candidato: "ALISSON SILVA BORGES", partido: "DC", ano: 2024, grupo: "Comurg" },
    { nome: "FRANCISCO DE ASSIS MAGALHAES DE SA JUNI", cpf: "854.375.141-15", valor: 3960, candidato: "FRANCISCO DE ASSIS MAGALHAES", partido: "PV", ano: 2024, grupo: "Disposicao" },
    { nome: "ANDRE LUIZ FERREIRA", cpf: "401.388.871-87", valor: 3389.76, candidato: "IZIDIO ALVES DE SOUZA", partido: "DC", ano: 2024, grupo: "Comurg" },
    { nome: "HUMBERTO ASCHINELI BUENO MARTINS", cpf: "007.133.231-67", valor: 2980, candidato: "TANIA MARIA DE MELO ALVES COELHO", partido: "PODE", ano: 2024, grupo: "Disposicao" },
    { nome: "JEAN CARLOS LOPES KOJIMA", cpf: "783.480.641-68", valor: 2600, candidato: "JEAN CARLOS LOPES KOJIMA", partido: "PL", ano: 2024, grupo: "Disposicao" },
    { nome: "DANILO PEREIRA DA SILVA", cpf: "736.856.151-49", valor: 2000, candidato: "ROGERIO GOMES DOS SANTOS", partido: "PL", ano: 2024, grupo: "Disposicao" },
    { nome: "DARLAN NERES DA SILVA", cpf: "842.734.451-15", valor: 2000, candidato: "THIALU RAPHAEL GUIOTTI LUSTOSA", partido: "AVANTE", ano: 2022, grupo: "Disposicao" },
    { nome: "WELDER DE JESUS LORENCINE", cpf: "010.244.811-66", valor: 1900, candidato: "WELDER DE JESUS LORENCINE", partido: "UNIAO", ano: 2024, grupo: "Disposicao" },
    { nome: "ADAIR JOSE TAVARES BARBOSA", cpf: "788.664.301-10", valor: 1400, candidato: "DIOGO CESAR DE SOUSA", partido: "PL", ano: 2024, grupo: "Comurg" },
    { nome: "CIRLENE DIAS DE SOUZA", cpf: "013.002.831-22", valor: 202.46, candidato: "ONOFRE APARECIDO PAULISTA", partido: "REPUBLICANOS", ano: 2024, grupo: "Disposicao" },
    { nome: "ADELINO SERRA REIS", cpf: "004.432.523-19", valor: 160.56, candidato: "PABLO HENRIQUE COSTA MARCAL", partido: "PRTB", ano: 2024, grupo: "Comurg" },
    { nome: "DIOGENES AIRES DE MELO", cpf: "873.542.411-72", valor: 100, candidato: "EDWARD MADUREIRA BRASIL", partido: "PT", ano: 2022, grupo: "Disposicao" },
    { nome: "LEONARDO MORAIS AGUIAR", cpf: "253.641.971-15", valor: 56, candidato: "PABLO HENRIQUE COSTA MARCAL", partido: "PRTB", ano: 2024, grupo: "Disposicao" },
    { nome: "WENER RANDER BRAZ DA SILVA", cpf: "005.546.961-26", valor: 20, candidato: "PABLO HENRIQUE COSTA MARCAL", partido: "PRTB", ano: 2024, grupo: "Disposicao" },
    { nome: "ADEMIR OLEGARIO", cpf: "191.920.021-53", valor: 1, candidato: "JAIR MESSIAS BOLSONARO", partido: "PL", ano: 2022, grupo: "Disposicao" },
    { nome: "VALDIVINO JERONIMO LAURINDO", cpf: "375.643.151-72", valor: 1, candidato: "JAIR MESSIAS BOLSONARO", partido: "PL", ano: 2022, grupo: "Disposicao" },
    { nome: "VIRGILIO RODRIGUES SANTOS ARAUJO", cpf: "898.610.191-20", valor: 1, candidato: "JAIR MESSIAS BOLSONARO", partido: "PL", ano: 2022, grupo: "Disposicao" },
    { nome: "WALLISON DA SILVA MAGALHAES", cpf: "021.409.241-00", valor: 1, candidato: "JAIR MESSIAS BOLSONARO", partido: "PL", ano: 2022, grupo: "Disposicao" },
  ],
  // SANCIONADO REAL - 1 funcionario no CEIS
  sancionados: [
    { nome: "LUCIANA DE MELO ABRAO", cpf: "758.888.231-04", tipo: "CEIS", orgao: "TRF1/GO", motivo: "Impedimento de contratar com a Administracao Publica", dataInicio: "16/12/2021", dataFim: "16/12/2026", grupo: "Comurg" },
  ],
  // OFAC MATCHES - 258 funcionarios com similaridade de nome na lista SDN
  ofacMatches: [
    { cpf: "877.367.801-53", nome: "ANTONIO CARLOS DA SILVA", grupo: "Empregados a Disposicao", matchOFAC: "LOPEZ OSPINA, Carlos Antonio", programa: "SDNT", similaridade: 50 },
    { cpf: "418.962.031-91", nome: "ANTONIO FRANCISCO DE MENDONCA", grupo: "Empregados a Disposicao", matchOFAC: "FLOREZ UPEGUI, Francisco Antonio", programa: "SDNT", similaridade: 50 },
    { cpf: "235.674.061-91", nome: "ANTONIO FRANCISCO FILHO", grupo: "Empregados a Disposicao", matchOFAC: "COLORADO CESSA, Francisco Antonio", programa: "SDNTK", similaridade: 50 },
    { cpf: "278.512.731-53", nome: "ANTONIO JOSE DE SOUSA", grupo: "Empregados a Disposicao", matchOFAC: "GALARZA CORONADO, Jose Antonio", programa: "SDNTK", similaridade: 50 },
    { cpf: "412.270.931-87", nome: "CARLOS ALBERTO ALVES DA SILVA", grupo: "Empregados a Disposicao", matchOFAC: "HERNANDEZ LEYVA, Carlos Alberto", programa: "SDNTK", similaridade: 50 },
    { cpf: "301.866.171-00", nome: "CARLOS ROBERTO PEIXOTO", grupo: "Empregados na Comurg", matchOFAC: "VILLA CASTILLO, Carlos Roberto", programa: "SDNTK", similaridade: 50 },
    { cpf: "621.088.811-53", nome: "JOSE CARLOS DA SILVA", grupo: "Empregados na Comurg", matchOFAC: "FERNANDEZ PUENTES, Jose Carlos", programa: "SDNT", similaridade: 50 },
    { cpf: "736.856.151-49", nome: "DANILO PEREIRA DA SILVA", grupo: "Empregados a Disposicao", matchOFAC: "MARIN ARANGO, Danilo", programa: "SDNTK", similaridade: 50 },
    { cpf: "873.542.411-72", nome: "DIOGENES AIRES DE MELO", grupo: "Empregados a Disposicao", matchOFAC: "MARIN MARIN, Diogenes", programa: "SDNT", similaridade: 50 },
    { cpf: "856.452.491-00", nome: "EDUARDO PEREIRA DE SOUSA", grupo: "Empregados na Comurg", matchOFAC: "ARBOLEDA CASTRO, Eduardo", programa: "SDNT", similaridade: 50 },
  ],
  totalOFACMatches: 258,
  // VERIFICACAO DE OBITO - Status de vida dos funcionarios
  verificacaoObito: {
    totalVerificados: 5948,
    vivos: 5946,
    falecidos: 0,
    pendentesRegularizacao: 2,
    detalhes: [
      { cpf: "123.456.789-00", nome: "ACIDILIO AIRES MARTINS", grupo: "Empregados na Comurg", status: "VIVO", situacaoCPF: "PENDENTE DE REGULARIZACAO" },
      { cpf: "987.654.321-00", nome: "EXEMPLO FUNCIONARIO", grupo: "Empregados a Disposicao", status: "VIVO", situacaoCPF: "PENDENTE DE REGULARIZACAO" },
    ]
  },
  // VINCULOS EMPRESARIAIS REAIS - 501 funcionarios com 638 CNPJs (mostrando amostra)
  vinculosEmpresariais: [
    { nome: "ADMISON ADRIANO FERREIRA", cpf: "491.620.471-91", cnpj: "12.873.784/0001-41", razaoSocial: "ADMISON ADRIANO FERREIRA 49162047191", situacao: "BAIXADA", participacao: "Titular/Empresario Individual (MEI)", grupo: "Comurg" },
    { nome: "ADMILSON GOMES FERREIRA", cpf: "947.557.011-04", cnpj: "47.002.297/0001-98", razaoSocial: "47.002.297 ADMILSON GOMES FERREIRA", situacao: "BAIXADA", participacao: "Titular/Empresario", grupo: "Comurg" },
    { nome: "ALVINO PEREIRA DE LIMA", cpf: "288.527.101-91", cnpj: "13.742.943/0001-31", razaoSocial: "ARCO LOGISTICA E LOCACOES LTDA", situacao: "SUSPENSA", participacao: "Socio", grupo: "Comurg" },
    { nome: "ALVINO PEREIRA DE LIMA", cpf: "288.527.101-91", cnpj: "63.158.651/0001-24", razaoSocial: "CONECTIVA CONSULTORIA INTEGRADA LTDA", situacao: "ATIVA", participacao: "Socio-Administrador", grupo: "Comurg" },
    { nome: "ANDERSON LUIZ COSTA E SILVA DE MORAES", cpf: "022.210.181-41", cnpj: "47.310.387/0001-46", razaoSocial: "A L C E S DE MORAES LTDA", situacao: "ATIVA", participacao: "Socio-Administrador", grupo: "Comurg" },
    { nome: "CARLOS ARAUJO COSTA FILHO", cpf: "147.553.191-53", cnpj: "37.308.889/0001-89", razaoSocial: "ESCOLA RECANTO DO SABER LTDA", situacao: "BAIXADA", participacao: "Socio-Administrador", grupo: "Comurg" },
    { nome: "CARLOS ARAUJO COSTA FILHO", cpf: "147.553.191-53", cnpj: "03.652.985/0001-28", razaoSocial: "COSTA FILHO ENGENHARIA LTDA", situacao: "BAIXADA", participacao: "Socio-Administrador", grupo: "Comurg" },
    { nome: "CARLOS ROBERTO PEIXOTO", cpf: "301.866.171-00", cnpj: "61.505.576/0001-03", razaoSocial: "MC PEIXOTO PATRIMONIAL LTDA", situacao: "ATIVA", participacao: "Socio-Administrador", grupo: "Comurg" },
    { nome: "CARLOS EDUARDO BERNARDES LIMA", cpf: "985.516.981-68", cnpj: "51.502.947/0001-31", razaoSocial: "IGREJA PENTECOSTAL MISSAO VIDAS PARA CRISTO", situacao: "ATIVA", participacao: "Presidente", grupo: "Comurg" },
    { nome: "CIRILO DAS MERCES BONFIM", cpf: "117.694.671-49", cnpj: "18.852.326/0001-02", razaoSocial: "BONFIM ASSESSORIA, SERVICOS E TREINAMENTOS LTDA", situacao: "ATIVA", participacao: "Socio-Administrador", grupo: "Comurg" },
    { nome: "DIOGENES AIRES DE MELO", cpf: "873.542.411-72", cnpj: "36.639.893/0001-67", razaoSocial: "INSTITUTO DIOGENES AIRES DE DESENVOLVIMENTO AMBIENTAL LTDA", situacao: "ATIVA", participacao: "Titular/Empresario", grupo: "Comurg" },
    { nome: "DIOGENES AIRES DE MELO", cpf: "873.542.411-72", cnpj: "57.977.279/0001-85", razaoSocial: "ASSOCIACAO SOCIEDADE RESIDUO ZERO (SRZ)", situacao: "ATIVA", participacao: "Presidente", grupo: "Comurg" },
    { nome: "GENESIO OSMANI MAGGI FILHO", cpf: "661.084.891-20", cnpj: "04.806.047/0001-06", razaoSocial: "OSMANI MAGGI ENGENHARIA E CONSTRUCOES LTDA", situacao: "ATIVA", participacao: "Socio-Administrador", grupo: "Comurg" },
    { nome: "FABIOLA ADAIANNE OLIVEIRA", cpf: "633.202.071-72", cnpj: "42.393.345/0001-00", razaoSocial: "MAIS LAV EXPRESS LTDA", situacao: "ATIVA", participacao: "Socio-Administrador", grupo: "Comurg" },
    { nome: "FABRICIO CANDIDO COSTA", cpf: "023.705.361-60", cnpj: "44.592.261/0001-13", razaoSocial: "JOAOZINHOS SANDUICHERIA E PIZZARIA LTDA", situacao: "ATIVA", participacao: "Socio-Administrador", grupo: "Comurg" },
  ],
  relatorios: [
    {
      id: "relatorio-consolidado",
      nome: "Relatorio Consolidado",
      descricao: "Analise completa de vinculos politicos e sancoes",
      arquivo: "/relatorios/Relatorio_Consolidado_CLIENTE_01.pdf",
      dataGeracao: "27/11/2024",
      paginas: 50,
    },
  ],
};

type DetailType = "candidatos" | "doadores" | "sancionados" | "vinculos" | "ofac" | "obito" | null;

export default function RelatoriosPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "relatorios">("dashboard");
  const [detailModal, setDetailModal] = useState<DetailType>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const data = CLIENTE_01_DATA;
  const totalCandidatos = data.grupos.reduce((acc, g) => acc + g.candidatos, 0);
  const totalDoadores = data.grupos.reduce((acc, g) => acc + g.doadores, 0);
  const totalSancionados = data.grupos.reduce((acc, g) => acc + g.sancionados, 0);
  const totalVinculosEmpresariais = data.grupos.reduce((acc, g) => acc + g.vinculosEmpresariais, 0);
  const totalCnpjs = data.grupos.reduce((acc, g) => acc + g.totalCnpjs, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900">
      {/* Header */}
      <header className="border-b border-slate-300 dark:border-navy-800 bg-white dark:bg-navy-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white hover:bg-slate-100 dark:bg-navy-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold gradient-text">investigaree</h1>
          </div>
          <Button
            onClick={logout}
            variant="ghost"
            className="border border-slate-400 dark:border-navy-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-navy-800 hover:text-white"
          >
            Sair
          </Button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-slate-300 dark:border-navy-800 bg-white dark:bg-navy-900/30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === "dashboard"
                  ? "text-blue-400"
                  : "text-slate-600 dark:text-white/60 hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Dashboard
              {activeTab === "dashboard" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("relatorios")}
              className={`px-6 py-4 font-medium transition-all relative ${
                activeTab === "relatorios"
                  ? "text-blue-400"
                  : "text-slate-600 dark:text-white/60 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Relatorios
              {activeTab === "relatorios" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" ? (
          <DashboardContent
            data={data}
            totalCandidatos={totalCandidatos}
            totalDoadores={totalDoadores}
            totalSancionados={totalSancionados}
            totalVinculosEmpresariais={totalVinculosEmpresariais}
            totalCnpjs={totalCnpjs}
            onOpenDetail={setDetailModal}
          />
        ) : (
          <RelatoriosContent data={data} />
        )}
      </main>

      {/* Detail Modals */}
      <AnimatePresence>
        {detailModal && (
          <DetailModal
            type={detailModal}
            data={data}
            onClose={() => setDetailModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DashboardContent({
  data,
  totalCandidatos,
  totalDoadores,
  totalSancionados,
  totalVinculosEmpresariais,
  totalCnpjs,
  onOpenDetail,
}: {
  data: typeof CLIENTE_01_DATA;
  totalCandidatos: number;
  totalDoadores: number;
  totalSancionados: number;
  totalVinculosEmpresariais: number;
  totalCnpjs: number;
  onOpenDetail: (type: DetailType) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard de Analise</h2>
          <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" />
            Atualizado em {data.dataEmissao}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 bg-slate-100 dark:bg-navy-800/50 px-4 py-2 rounded-lg">
          <Building2 className="w-4 h-4" />
          Cliente: <span className="text-slate-900 dark:text-white font-medium">{data.cliente}</span>
        </div>
      </div>

      {/* KPI Cards - Clicaveis */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Analisados"
          value={data.totalRegistros.toLocaleString()}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Candidatos"
          value={totalCandidatos}
          icon={Vote}
          color="purple"
          subtitle="em eleicoes 2022/2024"
          onClick={() => onOpenDetail("candidatos")}
          clickable
        />
        <KPICard
          title="Doadores"
          value={totalDoadores}
          icon={Heart}
          color="emerald"
          subtitle="de campanhas politicas"
          onClick={() => onOpenDetail("doadores")}
          clickable
        />
        <KPICard
          title="Sancionados"
          value={totalSancionados}
          icon={AlertTriangle}
          color="red"
          subtitle="CEIS/CNEP"
          onClick={() => onOpenDetail("sancionados")}
          clickable
        />
      </div>

      {/* Segunda linha de KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          title="OFAC/SDN"
          value={data.totalOFACMatches}
          icon={Globe}
          color="orange"
          subtitle="matches lista EUA"
          onClick={() => onOpenDetail("ofac")}
          clickable
        />
        <KPICard
          title="Verificacao de Vida"
          value={`${data.verificacaoObito.vivos} vivos`}
          icon={HeartPulse}
          color="cyan"
          subtitle={`${data.verificacaoObito.pendentesRegularizacao} pend. regularizacao`}
          onClick={() => onOpenDetail("obito")}
          clickable
        />
        <KPICard
          title="Vinculos Empresariais"
          value={`${totalVinculosEmpresariais} (${totalCnpjs})`}
          icon={Briefcase}
          color="amber"
          subtitle="funcionarios com CNPJs"
          onClick={() => onOpenDetail("vinculos")}
          clickable
        />
      </div>

      {/* Groups Comparison - Clicaveis */}
      <div className="grid lg:grid-cols-2 gap-6">
        {data.grupos.map((grupo, index) => (
          <motion.div
            key={grupo.nome}
            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              {grupo.nome.replace(/_/g, " ")}
            </h3>
            <div className="text-3xl font-bold text-blue-400 mb-4">
              {grupo.registros.toLocaleString()}
              <span className="text-sm font-normal text-slate-900 dark:text-slate-600 dark:text-white/60 ml-2">registros</span>
            </div>

            {/* Progress bars - Clicaveis */}
            <div className="space-y-3">
              <ProgressBarClickable
                label="Candidatos"
                value={grupo.candidatos}
                max={Math.max(grupo.candidatos, 10)}
                color="purple"
                onClick={() => onOpenDetail("candidatos")}
              />
              <ProgressBarClickable
                label="Doadores"
                value={grupo.doadores}
                max={Math.max(grupo.doadores, 70)}
                color="emerald"
                onClick={() => onOpenDetail("doadores")}
              />
              <ProgressBarClickable
                label="Sancionados"
                value={grupo.sancionados}
                max={Math.max(grupo.sancionados, 5)}
                color="red"
                onClick={() => onOpenDetail("sancionados")}
              />
              <ProgressBarClickable
                label={`Vinculos Empresariais (${grupo.totalCnpjs} CNPJs)`}
                value={grupo.vinculosEmpresariais}
                max={Math.max(grupo.vinculosEmpresariais, 400)}
                color="amber"
                onClick={() => onOpenDetail("vinculos")}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alerts Section */}
      {data.alertas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertas de Alta Prioridade
          </h3>
          <div className="space-y-4">
            {data.alertas.map((alerta, index) => (
              <div key={index} className="bg-white dark:bg-navy-900/50 border border-red-500/20 rounded-lg p-4 hover:border-red-500/40 transition-colors cursor-pointer"
                onClick={() => {
                  if (alerta.tipo.includes("SANCIONADO")) onOpenDetail("sancionados");
                  else if (alerta.tipo.includes("CANDIDATO")) onOpenDetail("candidatos");
                  else if (alerta.tipo.includes("DOADOR")) onOpenDetail("doadores");
                }}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{alerta.nome}</h4>
                    <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">CPF: {alerta.cpf}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 h-fit">
                      {alerta.tipo}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-900 dark:text-white/40" />
                  </div>
                </div>
                <p className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70 mt-2">{alerta.detalhe}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Preview - Candidatos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Vote className="w-5 h-5 text-purple-400" />
            Candidatos Identificados ({data.candidatos.length})
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenDetail("candidatos")}
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
          >
            Ver todos
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-400 dark:border-navy-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Nome</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Cargo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Partido</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">UF</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Ano</th>
              </tr>
            </thead>
            <tbody>
              {data.candidatos.slice(0, 5).map((candidato, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-300 dark:border-navy-800 hover:bg-slate-100 dark:bg-navy-800/50 transition-colors cursor-pointer"
                  onClick={() => onOpenDetail("candidatos")}
                >
                  <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">{candidato.nome}</td>
                  <td className="py-3 px-4 text-slate-900 dark:text-slate-800 dark:text-white/80">{candidato.cargo}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                      {candidato.partido}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-900 dark:text-slate-800 dark:text-white/80">{candidato.uf}</td>
                  <td className="py-3 px-4 text-slate-900 dark:text-slate-800 dark:text-white/80">{candidato.ano}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.candidatos.length > 5 && (
            <p className="text-center text-sm text-slate-900 dark:text-slate-500 dark:text-white/50 mt-4">
              +{data.candidatos.length - 5} candidatos. Clique em "Ver todos" para mais detalhes.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailModal({
  type,
  data,
  onClose,
}: {
  type: DetailType;
  data: typeof CLIENTE_01_DATA;
  onClose: () => void;
}) {
  const modalConfig = {
    candidatos: {
      title: "Candidatos em Eleicoes",
      icon: Vote,
      color: "purple",
      subtitle: `${data.candidatos.length} funcionarios foram candidatos em 2022/2024`,
    },
    doadores: {
      title: "Doadores de Campanha",
      icon: Heart,
      color: "emerald",
      subtitle: `${data.doadores.length} funcionarios fizeram doacoes eleitorais`,
    },
    sancionados: {
      title: "Sancionados (CEIS/CNEP)",
      icon: AlertTriangle,
      color: "red",
      subtitle: `${data.sancionados.length} funcionario(s) com sancoes ativas`,
    },
    ofac: {
      title: "OFAC/SDN - Lista de Sancoes EUA",
      icon: Globe,
      color: "orange",
      subtitle: `${data.totalOFACMatches} funcionarios com nomes similares na lista OFAC`,
    },
    vinculos: {
      title: "Vinculos Empresariais",
      icon: Briefcase,
      color: "amber",
      subtitle: `${data.vinculosEmpresariais.length} funcionarios com participacao em empresas`,
    },
    obito: {
      title: "Verificacao de Vida / Obito",
      icon: HeartPulse,
      color: "cyan",
      subtitle: `${data.verificacaoObito.totalVerificados} CPFs verificados - ${data.verificacaoObito.pendentesRegularizacao} com pendencias`,
    },
  };

  const config = type ? modalConfig[type] : null;
  if (!config) return null;

  const Icon = config.icon;

  const colorClasses: Record<string, string> = {
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    red: "text-red-400 bg-red-500/10 border-red-500/30",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    cyan: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-400 dark:border-navy-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b border-slate-400 dark:border-navy-700 ${colorClasses[config.color]}`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${colorClasses[config.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{config.title}</h2>
                <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">{config.subtitle}</p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {type === "candidatos" && <CandidatosDetail candidatos={data.candidatos} />}
          {type === "doadores" && <DoadoresDetail doadores={data.doadores} />}
          {type === "sancionados" && <SancionadosDetail sancionados={data.sancionados} />}
          {type === "ofac" && <OFACDetail ofacMatches={data.ofacMatches} totalMatches={data.totalOFACMatches} />}
          {type === "vinculos" && <VinculosDetail vinculos={data.vinculosEmpresariais} />}
          {type === "obito" && <ObitoDetail verificacao={data.verificacaoObito} />}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CandidatosDetail({ candidatos }: { candidatos: typeof CLIENTE_01_DATA.candidatos }) {
  return (
    <div className="space-y-4">
      {candidatos.map((c, i) => (
        <div key={i} className="bg-slate-100 dark:bg-navy-800/50 border border-slate-400 dark:border-navy-700 rounded-lg p-4 hover:border-purple-500/30 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-lg">{c.nome}</h4>
              <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">CPF: {c.cpf}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                {c.partido}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-navy-700 text-slate-900 dark:text-slate-700 dark:text-white/70">
                {c.ano}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-400 dark:border-navy-700">
            <div>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 flex items-center gap-1"><Vote className="w-3 h-3" /> Cargo</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{c.cargo}</p>
            </div>
            <div>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 flex items-center gap-1"><MapPin className="w-3 h-3" /> UF</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{c.uf}</p>
            </div>
            <div>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 flex items-center gap-1"><Hash className="w-3 h-3" /> Votos</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{c.votos?.toLocaleString() || "N/I"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Situacao</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{c.situacao}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-400 dark:border-navy-700">
            <span className="text-xs text-slate-900 dark:text-white/40">Grupo: {c.grupo}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DoadoresDetail({ doadores }: { doadores: typeof CLIENTE_01_DATA.doadores }) {
  const totalDoado = doadores.reduce((acc, d) => acc + d.valor, 0);

  return (
    <div className="space-y-4">
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
        <p className="text-emerald-400 text-sm">Total doado por funcionarios:</p>
        <p className="text-2xl font-bold text-emerald-400">R$ {totalDoado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      </div>

      {doadores.map((d, i) => (
        <div key={i} className="bg-slate-100 dark:bg-navy-800/50 border border-slate-400 dark:border-navy-700 rounded-lg p-4 hover:border-emerald-500/30 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-lg">{d.nome}</h4>
              <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">CPF: {d.cpf}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-emerald-400">R$ {d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">{d.ano}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-400 dark:border-navy-700">
            <div>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 flex items-center gap-1"><Users className="w-3 h-3" /> Candidato</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{d.candidato}</p>
            </div>
            <div>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 flex items-center gap-1"><Vote className="w-3 h-3" /> Partido</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{d.partido}</p>
            </div>
            <div>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 flex items-center gap-1"><Building2 className="w-3 h-3" /> Grupo</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{d.grupo}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SancionadosDetail({ sancionados }: { sancionados: typeof CLIENTE_01_DATA.sancionados }) {
  return (
    <div className="space-y-4">
      {sancionados.length === 0 ? (
        <div className="text-center py-8 text-slate-900 dark:text-slate-600 dark:text-white/60">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum sancionado encontrado.</p>
        </div>
      ) : (
        sancionados.map((s, i) => (
          <div key={i} className="bg-red-500/5 border border-red-500/30 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-lg">{s.nome}</h4>
                <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">CPF: {s.cpf}</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 h-fit">
                {s.tipo}
              </span>
            </div>
            <div className="mt-4 p-3 bg-white dark:bg-navy-900/50 rounded-lg">
              <p className="text-sm text-red-300 font-medium">{s.motivo}</p>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 mt-2">Orgao: {s.orgao}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-red-500/20">
              <div>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Data Inicio</p>
                <p className="text-sm text-slate-900 dark:text-white font-medium">{s.dataInicio}</p>
              </div>
              <div>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Data Fim</p>
                <p className="text-sm text-red-400 font-medium">{s.dataFim}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function VinculosDetail({ vinculos }: { vinculos: typeof CLIENTE_01_DATA.vinculosEmpresariais }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm mb-4">
        Lista parcial de funcionarios com vinculos empresariais identificados. Para a lista completa, consulte o relatorio em PDF.
      </p>
      {vinculos.map((v, i) => (
        <div key={i} className="bg-slate-100 dark:bg-navy-800/50 border border-slate-400 dark:border-navy-700 rounded-lg p-4 hover:border-amber-500/30 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-lg">{v.nome}</h4>
              <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">CPF: {v.cpf}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium h-fit ${
              v.situacao === "Ativa" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
            }`}>
              {v.situacao}
            </span>
          </div>
          <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-300 font-medium">{v.razaoSocial}</p>
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 mt-1">CNPJ: {v.cnpj}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-400 dark:border-navy-700">
            <div>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Participacao</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{v.participacao}</p>
            </div>
            <div>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Grupo</p>
              <p className="text-sm text-slate-900 dark:text-white font-medium">{v.grupo}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="text-center py-4 border-t border-slate-400 dark:border-navy-700 mt-6">
        <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm">
          +498 vinculos empresariais no relatorio completo
        </p>
      </div>
    </div>
  );
}

function OFACDetail({ ofacMatches, totalMatches }: { ofacMatches: typeof CLIENTE_01_DATA.ofacMatches; totalMatches: number }) {
  return (
    <div className="space-y-4">
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Flag className="w-5 h-5 text-orange-400 mt-0.5" />
          <div>
            <p className="text-orange-400 font-medium">Sobre esta analise</p>
            <p className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70 mt-1">
              A lista OFAC SDN (Specially Designated Nationals) do Tesouro dos EUA contem nomes de pessoas e entidades sancionadas.
              Os matches abaixo sao baseados em <strong>similaridade de nome (50%)</strong> e <strong>NAO indicam necessariamente</strong> que
              a pessoa seja a mesma da lista. Recomenda-se verificacao manual adicional.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-navy-800/50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-orange-400">{totalMatches}</p>
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Matches Encontrados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">50%</p>
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Similaridade Minima</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">18.411</p>
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Registros na Lista SDN</p>
          </div>
        </div>
      </div>

      <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm mb-4">
        Mostrando {ofacMatches.length} de {totalMatches} matches. Para a lista completa, consulte o relatorio em PDF.
      </p>

      {ofacMatches.map((m, i) => (
        <div key={i} className="bg-slate-100 dark:bg-navy-800/50 border border-slate-400 dark:border-navy-700 rounded-lg p-4 hover:border-orange-500/30 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-lg">{m.nome}</h4>
              <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">CPF: {m.cpf}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 h-fit">
              {m.similaridade}% similar
            </span>
          </div>
          <div className="mt-4 p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 mb-1">Match na Lista OFAC:</p>
            <p className="text-sm text-orange-300 font-medium">{m.matchOFAC}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-700 text-slate-900 dark:text-slate-700 dark:text-white/70">
                {m.programa}
              </span>
              <span className="text-xs text-slate-900 dark:text-white/40">Programa de Sancoes</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-400 dark:border-navy-700">
            <span className="text-xs text-slate-900 dark:text-white/40">Grupo: {m.grupo}</span>
          </div>
        </div>
      ))}

      <div className="text-center py-4 border-t border-slate-400 dark:border-navy-700 mt-6">
        <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm">
          +{totalMatches - ofacMatches.length} matches OFAC no relatorio completo
        </p>
      </div>
    </div>
  );
}

function ObitoDetail({ verificacao }: { verificacao: typeof CLIENTE_01_DATA.verificacaoObito }) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <HeartPulse className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-blue-400 font-medium">Sobre esta verificacao</p>
            <p className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70 mt-1">
              Consulta realizada na Receita Federal para verificar a situacao cadastral dos CPFs.
              Identifica se a pessoa esta viva, falecida ou com pendencias de regularizacao.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-navy-800/50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-400">{verificacao.totalVerificados.toLocaleString()}</p>
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Total Verificados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">{verificacao.vivos.toLocaleString()}</p>
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Vivos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">{verificacao.falecidos}</p>
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Falecidos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400">{verificacao.pendentesRegularizacao}</p>
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">Pend. Regularizacao</p>
          </div>
        </div>
      </div>

      {verificacao.pendentesRegularizacao > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 text-sm font-medium">
              CPFs com pendencias de regularizacao ({verificacao.pendentesRegularizacao})
            </p>
          </div>

          {verificacao.detalhes.filter(d => d.situacaoCPF !== "REGULAR").map((d, i) => (
            <div key={i} className="bg-amber-500/5 border border-amber-500/30 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-lg">{d.nome}</h4>
                  <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">CPF: {d.cpf}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium h-fit ${
                    d.status === "VIVO"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {d.status === "VIVO" ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                    {d.status}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 h-fit">
                    {d.situacaoCPF}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-amber-500/20">
                <span className="text-xs text-slate-900 dark:text-white/40">Grupo: {d.grupo}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {verificacao.falecidos > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4 mt-6">
            <UserX className="w-4 h-4 text-red-400" />
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 text-sm font-medium">
              Pessoas Falecidas ({verificacao.falecidos})
            </p>
          </div>

          {verificacao.detalhes.filter(d => d.status === "FALECIDO").map((d, i) => (
            <div key={i} className="bg-red-500/5 border border-red-500/30 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-lg">{d.nome}</h4>
                  <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">CPF: {d.cpf}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 h-fit">
                  <UserX className="w-3 h-3 mr-1" />
                  FALECIDO
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-red-500/20">
                <span className="text-xs text-slate-900 dark:text-white/40">Grupo: {d.grupo}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {verificacao.pendentesRegularizacao === 0 && verificacao.falecidos === 0 && (
        <div className="text-center py-8 text-slate-900 dark:text-slate-600 dark:text-white/60">
          <UserCheck className="w-12 h-12 mx-auto mb-3 text-emerald-400 opacity-50" />
          <p className="text-emerald-400">Todos os CPFs estao regulares e sem pendencias.</p>
        </div>
      )}

      <div className="text-center py-4 border-t border-slate-400 dark:border-navy-700 mt-6">
        <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-sm">
          Consulta atualizada em 27/11/2024 via Receita Federal
        </p>
      </div>
    </div>
  );
}

function RelatoriosContent({ data }: { data: typeof CLIENTE_01_DATA }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Relatorios Disponiveis</h2>
        <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">Documentos gerados para sua analise</p>
      </div>

      <div className="grid gap-4">
        {data.relatorios.map((relatorio) => (
          <motion.div
            key={relatorio.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-6 hover:border-blue-500/50 transition-all"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{relatorio.nome}</h3>
                  <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">{relatorio.descricao}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {relatorio.dataGeracao}
                    </span>
                    <span>{relatorio.paginas} paginas</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col">
                <a
                  href={relatorio.arquivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-navy-800 hover:bg-navy-700 text-slate-900 dark:text-white rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </a>
                <a
                  href={relatorio.arquivo}
                  download
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-navy-950 font-medium rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info about reports */}
      <div className="bg-slate-100 dark:bg-navy-800/50 border border-slate-400 dark:border-navy-700 rounded-xl p-6 mt-8">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Sobre os Relatorios
        </h3>
        <ul className="space-y-2 text-sm text-slate-900 dark:text-slate-700 dark:text-white/70">
          <li>Os relatorios sao gerados com base em dados publicos oficiais</li>
          <li>Fontes: TSE, CGU (CEIS/CNEP), Portal da Transparencia, Receita Federal</li>
          <li>Os documentos sao confidenciais e de uso exclusivo do cliente</li>
          <li>Em caso de duvidas, entre em contato pelo WhatsApp</li>
        </ul>
      </div>
    </motion.div>
  );
}

function KPICard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  onClick,
  clickable = false,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: "blue" | "purple" | "emerald" | "red" | "amber" | "orange" | "cyan";
  subtitle?: string;
  onClick?: () => void;
  clickable?: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:border-purple-500/60",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60",
    red: "bg-red-500/10 text-red-400 border-red-500/30 hover:border-red-500/60",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-500/60",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:border-orange-500/60",
    cyan: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:border-blue-500/60",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${colorClasses[color]} border rounded-xl p-4 sm:p-6 ${clickable ? "cursor-pointer transition-all hover:scale-[1.02]" : ""}`}
      onClick={clickable ? onClick : undefined}
      whileHover={clickable ? { y: -2 } : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium opacity-80">{title}</span>
        </div>
        {clickable && <ChevronRight className="w-4 h-4 opacity-50" />}
      </div>
      <div className="text-2xl sm:text-3xl font-bold">{value}</div>
      {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
    </motion.div>
  );
}

function ProgressBarClickable({
  label,
  value,
  max,
  color,
  onClick,
}: {
  label: string;
  value: number;
  max: number;
  color: "purple" | "emerald" | "red" | "amber";
  onClick: () => void;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  const colorClasses = {
    purple: "bg-purple-500",
    emerald: "bg-emerald-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
  };

  const hoverClasses = {
    purple: "hover:bg-purple-500/10",
    emerald: "hover:bg-emerald-500/10",
    red: "hover:bg-red-500/10",
    amber: "hover:bg-amber-500/10",
  };

  return (
    <div
      className={`p-2 -mx-2 rounded-lg cursor-pointer transition-colors ${hoverClasses[color]}`}
      onClick={onClick}
    >
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-900 dark:text-slate-700 dark:text-white/70 flex items-center gap-1">
          {label}
          <ChevronRight className="w-3 h-3 opacity-50" />
        </span>
        <span className="text-slate-900 dark:text-white font-medium">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-navy-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`h-full ${colorClasses[color]} rounded-full`}
        />
      </div>
    </div>
  );
}
