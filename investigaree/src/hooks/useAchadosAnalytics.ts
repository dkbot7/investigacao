import { useMemo } from 'react';
import { format, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FuncionarioCompleto {
  cadastro: string;
  nome: string;
  cpf: string;
  nascimento: string;
  admissao: string;
  sexo: string;
  grupo: string;
  vinculo: string;
  situacao: string;
  cargo: string;
  salario: number;
  diretoria: string;
  local: string;
  posto: string;
  cpf_valido: string;
  esta_vivo: string;
  esta_morto: string;
  telefones: string;
  emails: string;
  recebe_beneficio: string;
  qual_beneficio: string;
  e_socio_empresa: string;
  qtd_empresas: number;
  empresas_ativas: number;
  vinculos_empresariais: string;
  foi_candidato: string;
  foi_doador_eleitoral: string;
  possui_sancao_cgu: string;
  alerta_ofac: string;
  classificacao_risco: string;
  achados_contabeis: string;
  tipo_irregularidade: string;
  valor_dano_erario: string;
  necessita_acao_corretiva: string;
  necessita_comunicacao_ci: string;
  necessita_comunicacao_tcm: string;
  beneficio_possivelmente_indevido: string;
  possui_vinculo_empregaticio: string;
  indicio_duplo_vinculo: string;
  patrimonio_2022: string;
  patrimonio_2024: string;
  total_doacoes: string;
  detalhes_candidatura: string;
}

// Converter data serial do Excel para JS Date
function excelDateToJSDate(serial: number | string): Date {
  if (typeof serial === 'string') {
    serial = parseFloat(serial);
  }
  if (isNaN(serial) || serial <= 0) {
    return new Date();
  }
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info;
}

// Classificar cargo em categorias
function classifyCargo(cargo: string): string {
  if (!cargo) return 'Outros';
  const cargoLower = cargo.toLowerCase();
  if (cargoLower.includes('diretor') || cargoLower.includes('presidente')) return 'Diretor';
  if (cargoLower.includes('gerente') || cargoLower.includes('coordenador') || cargoLower.includes('supervisor')) return 'Gerente';
  if (cargoLower.includes('analista') || cargoLower.includes('assistente') || cargoLower.includes('tecnico')) return 'Analista';
  if (cargoLower.includes('operacional') || cargoLower.includes('auxiliar') || cargoLower.includes('servente') || cargoLower.includes('trab')) return 'Operacional';
  return 'Outros';
}

export function useAchadosAnalytics(achados: FuncionarioCompleto[]) {
  // 1. TREND DATA - Tendências temporais
  const trendData = useMemo(() => {
    const monthlyData: Record<string, { criticos: number; empresas: number; obitos: number }> = {};

    // Gerar últimos 12 meses
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const month = format(subMonths(now, i), 'MMM/yy', { locale: ptBR });
      monthlyData[month] = { criticos: 0, empresas: 0, obitos: 0 };
    }

    // Agrupar achados por mês de admissão
    achados.forEach(achado => {
      try {
        const admissaoDate = excelDateToJSDate(achado.admissao);
        const month = format(admissaoDate, 'MMM/yy', { locale: ptBR });

        if (monthlyData[month]) {
          if (achado.classificacao_risco === 'Critico') monthlyData[month].criticos++;
          if (achado.empresas_ativas && parseInt(String(achado.empresas_ativas)) > 0) monthlyData[month].empresas++;
          if (achado.esta_morto && String(achado.esta_morto).toUpperCase().includes('SIM')) monthlyData[month].obitos++;
        }
      } catch (e) {
        // Ignorar datas inválidas
      }
    });

    return Object.entries(monthlyData).map(([month, counts]) => ({
      month,
      ...counts,
      total: counts.criticos + counts.empresas + counts.obitos
    }));
  }, [achados]);

  // 2. DISTRIBUTION DATA - Distribuição por tipo de irregularidade
  const distributionData = useMemo(() => {
    const types: Record<string, number> = {
      'Empresa Ativa': 0,
      'Duplo Vínculo': 0,
      'Benefício Indevido': 0,
      'Óbito não atualizado': 0,
      'Sanção CGU/OFAC': 0,
      'Outros': 0
    };

    achados.forEach(achado => {
      if (achado.empresas_ativas && parseInt(String(achado.empresas_ativas)) > 0) {
        types['Empresa Ativa']++;
      } else if (achado.indicio_duplo_vinculo && String(achado.indicio_duplo_vinculo).toUpperCase().includes('SIM')) {
        types['Duplo Vínculo']++;
      } else if (achado.beneficio_possivelmente_indevido && String(achado.beneficio_possivelmente_indevido).toUpperCase().includes('SIM')) {
        types['Benefício Indevido']++;
      } else if (achado.esta_morto && String(achado.esta_morto).toUpperCase().includes('SIM')) {
        types['Óbito não atualizado']++;
      } else if ((achado.possui_sancao_cgu && String(achado.possui_sancao_cgu).toUpperCase().includes('SIM')) ||
                 (achado.alerta_ofac && String(achado.alerta_ofac).toUpperCase().includes('SIM'))) {
        types['Sanção CGU/OFAC']++;
      } else {
        types['Outros']++;
      }
    });

    const total = Object.values(types).reduce((sum, count) => sum + count, 0);

    return Object.entries(types)
      .map(([tipo, count]) => ({
        tipo,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [achados]);

  // 3. SEVERITY DATA - Distribuição por severidade
  const severityData = useMemo(() => {
    const severity: Record<string, number> = {
      'Crítico': 0,
      'Alto': 0,
      'Médio': 0,
      'Baixo': 0
    };

    achados.forEach(achado => {
      const risco = achado.classificacao_risco || 'Médio';
      if (severity[risco] !== undefined) {
        severity[risco]++;
      } else {
        severity['Médio']++;
      }
    });

    return Object.entries(severity)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [achados]);

  // 4. IMPACT DATA - Impacto financeiro por diretoria
  const impactData = useMemo(() => {
    const directorias: Record<string, { salarios: number; dano: number; count: number }> = {};

    achados.forEach(achado => {
      const dir = achado.diretoria || 'OUTROS';
      if (!directorias[dir]) {
        directorias[dir] = { salarios: 0, dano: 0, count: 0 };
      }

      directorias[dir].salarios += parseFloat(String(achado.salario || 0)) || 0;
      directorias[dir].dano += parseFloat(String(achado.valor_dano_erario || 0)) || 0;
      directorias[dir].count++;
    });

    return Object.entries(directorias)
      .map(([diretoria, values]) => ({
        diretoria: diretoria.substring(0, 30), // Truncar nome longo
        salarios: Math.round(values.salarios),
        dano: Math.round(values.dano),
        potencial: Math.round(values.salarios * 12), // Estimativa anual
        count: values.count
      }))
      .sort((a, b) => (b.salarios + b.dano) - (a.salarios + a.dano))
      .slice(0, 10); // Top 10 diretorias
  }, [achados]);

  // 5. CORRELATION DATA - Scatter plot risco vs salário
  const correlationData = useMemo(() => {
    const riskMap: Record<string, number> = {
      'Baixo': 1,
      'Regular': 1,
      'Médio': 2,
      'Alto': 3,
      'Atencao': 3,
      'Crítico': 4,
      'Critico': 4
    };

    const colorMap: Record<string, string> = {
      'Baixo': '#84cc16',
      'Regular': '#84cc16',
      'Médio': '#f59e0b',
      'Alto': '#f97316',
      'Atencao': '#f97316',
      'Crítico': '#ef4444',
      'Critico': '#ef4444'
    };

    return achados
      .map(achado => ({
        nome: achado.nome,
        risco: riskMap[achado.classificacao_risco] || 2,
        riscoLabel: achado.classificacao_risco || 'Médio',
        salario: parseFloat(String(achado.salario || 0)) || 0,
        empresas: parseInt(String(achado.empresas_ativas || 0)) || 0,
        cor: colorMap[achado.classificacao_risco] || '#f59e0b'
      }))
      .filter(item => item.salario > 0)
      .slice(0, 100); // Limitar para performance
  }, [achados]);

  // Insight para correlation
  const correlationInsight = useMemo(() => {
    const highSalaryHighRisk = correlationData.filter(d => d.salario > 5000 && d.risco >= 3).length;
    const totalHighRisk = correlationData.filter(d => d.risco >= 3).length;
    const percentage = totalHighRisk > 0 ? Math.round((highSalaryHighRisk / totalHighRisk) * 100) : 0;

    return `${highSalaryHighRisk} funcionários com salário >R$5k e risco alto/crítico (${percentage}% dos casos críticos)`;
  }, [correlationData]);

  // 6. HEATMAP DATA - Concentração por diretoria e cargo
  const heatmapData = useMemo(() => {
    const diretorias = [...new Set(achados.map(a => a.diretoria || 'OUTROS'))]
      .slice(0, 8); // Top 8 diretorias
    const cargos = ['Diretor', 'Gerente', 'Analista', 'Operacional', 'Outros'];

    const xLabels = cargos;
    const yLabels = diretorias.map(d => d.substring(0, 25)); // Truncar para caber

    const data = diretorias.map(diretoria => {
      return cargos.map(cargo => {
        return achados.filter(a =>
          (a.diretoria || 'OUTROS') === diretoria &&
          classifyCargo(a.cargo) === cargo
        ).length;
      });
    });

    return { xLabels, yLabels, data };
  }, [achados]);

  // 7. RANKING DATA - Top 10 casos mais críticos
  const rankingData = useMemo(() => {
    return achados
      .map(achado => {
        // Calcular score composto
        let score = 0;

        // Risco (0-40 pontos)
        const riskScores: Record<string, number> = {
          'Crítico': 40, 'Critico': 40,
          'Alto': 30, 'Atencao': 30,
          'Médio': 20,
          'Baixo': 10, 'Regular': 10
        };
        score += riskScores[achado.classificacao_risco] || 20;

        // Empresas ativas (0-20 pontos)
        const empresas = parseInt(String(achado.empresas_ativas || 0)) || 0;
        score += Math.min(empresas * 5, 20);

        // Óbito (20 pontos)
        if (achado.esta_morto && String(achado.esta_morto).toUpperCase().includes('SIM')) {
          score += 20;
        }

        // Sanções (15 pontos)
        if ((achado.possui_sancao_cgu && String(achado.possui_sancao_cgu).toUpperCase().includes('SIM')) ||
            (achado.alerta_ofac && String(achado.alerta_ofac).toUpperCase().includes('SIM'))) {
          score += 15;
        }

        // Dano ao erário (0-5 pontos)
        const dano = parseFloat(String(achado.valor_dano_erario || 0)) || 0;
        if (dano > 0) score += 5;

        return {
          nome: achado.nome,
          cpf: achado.cpf,
          cargo: achado.cargo,
          diretoria: achado.diretoria,
          score,
          empresas: empresas,
          obito: !!(achado.esta_morto && String(achado.esta_morto).toUpperCase().includes('SIM')),
          sancao: !!((achado.possui_sancao_cgu && String(achado.possui_sancao_cgu).toUpperCase().includes('SIM')) ||
                  (achado.alerta_ofac && String(achado.alerta_ofac).toUpperCase().includes('SIM'))),
          dano: dano,
          achados: achado.achados_contabeis || 'N/A'
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [achados]);

  // 8. ACTIONS DATA - Ações corretivas necessárias
  const actionsData = useMemo(() => {
    const actions = [
      { prioridade: 'Imediatas', count: 0 },
      { prioridade: '30 dias', count: 0 },
      { prioridade: '60 dias', count: 0 },
      { prioridade: 'Monitoramento', count: 0 }
    ];

    achados.forEach(achado => {
      if (achado.classificacao_risco === 'Critico' || achado.classificacao_risco === 'Crítico') {
        actions[0].count++; // Imediatas
      } else if (achado.classificacao_risco === 'Alto' || achado.classificacao_risco === 'Atencao') {
        actions[1].count++; // 30 dias
      } else if (achado.classificacao_risco === 'Médio') {
        actions[2].count++; // 60 dias
      } else {
        actions[3].count++; // Monitoramento
      }
    });

    return actions;
  }, [achados]);

  // 9. COMMUNICATIONS DATA - Comunicações necessárias
  const communicationsData = useMemo(() => {
    let ci = 0;
    let tcm = 0;
    let ambos = 0;
    let nenhum = 0;

    achados.forEach(achado => {
      const needsCI = achado.necessita_comunicacao_ci && String(achado.necessita_comunicacao_ci).toUpperCase().includes('SIM');
      const needsTCM = achado.necessita_comunicacao_tcm && String(achado.necessita_comunicacao_tcm).toUpperCase().includes('SIM');

      if (needsCI && needsTCM) {
        ambos++;
      } else if (needsCI) {
        ci++;
      } else if (needsTCM) {
        tcm++;
      } else {
        nenhum++;
      }
    });

    return [
      { name: 'CI (Controle Interno)', value: ci },
      { name: 'TCM (Tribunal de Contas)', value: tcm },
      { name: 'Ambos', value: ambos },
      { name: 'Nenhum', value: nenhum }
    ].filter(item => item.value > 0);
  }, [achados]);

  return {
    trendData,
    distributionData,
    severityData,
    impactData,
    correlationData,
    correlationInsight,
    heatmapData,
    rankingData,
    actionsData,
    communicationsData
  };
}
