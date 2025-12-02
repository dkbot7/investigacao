/**
 * ARQUIVO DESABILITADO POR QUESTÕES DE SEGURANÇA
 *
 * Dados mockados foram removidos para evitar que usuários vejam dados de outros clientes.
 * Todas as páginas do dashboard devem usar o hook useDashboardData() que busca da API.
 *
 * NUNCA exporte dados mockados neste arquivo.
 */

// Types
interface StatsType {
  tenant: { code: string; name: string };
  totalFuncionarios: number;
  totais: {
    obitos: number;
    candidatos: number;
    doadores: number;
    sancionados: number;
    beneficiarios: number;
    socios: number;
    cnpjs: number;
    ofacMatches: number;
  };
  grupos: Array<{ nome: string; total: number; registros: number }>;
}

// Arrays vazios - NUNCA retornar dados mockados
export const CLIENTE_01_STATS: StatsType | null = null;
export const CLIENTE_01_OBITOS: any[] = [];
export const CLIENTE_01_CANDIDATOS: any[] = [];
export const CLIENTE_01_DOADORES: any[] = [];
export const CLIENTE_01_SANCIONADOS: any[] = [];
export const CLIENTE_01_BENEFICIOS: any[] = [];
export const CLIENTE_01_FUNCIONARIOS: any[] = [];
export const CLIENTE_01_VINCULOS: any[] = [];
export const CLIENTE_01_OFAC: any[] = [];

// Funções que retornam arrays vazios - NUNCA retornar dados mockados
export const getCandidaturasByCPF = (cpf: string) => [];
export const getDoacoesByCPF = (cpf: string) => [];
export const getVinculosByCPF = (cpf: string) => [];
export const getSancoesByCPF = (cpf: string) => [];
export const getBeneficiosByCPF = (cpf: string) => [];
