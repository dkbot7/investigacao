"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Building2, AlertTriangle, Shield, DollarSign } from 'lucide-react';

interface RankingItem {
  nome: string;
  cpf: string;
  cargo: string;
  diretoria: string;
  score: number;
  empresas: number;
  obito: boolean;
  sancao: boolean;
  dano: number;
  achados: string;
}

interface TopCasesRankingProps {
  data: RankingItem[];
}

export function TopCasesRanking({ data }: TopCasesRankingProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-slate-400">
        Sem dados para exibir
      </div>
    );
  }

  // Preparar dados para o gráfico
  const chartData = data.map((item, index) => ({
    rank: `#${index + 1}`,
    nome: item.nome.substring(0, 25) + (item.nome.length > 25 ? '...' : ''),
    score: item.score
  }));

  return (
    <div className="space-y-4">
      {/* Gráfico de barras */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            type="number"
            domain={[0, 100]}
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            dataKey="nome"
            type="category"
            stroke="#94a3b8"
            width={200}
            style={{ fontSize: '11px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: any) => [`${value} pontos`, 'Score']}
          />
          <Bar dataKey="score" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index < 3 ? '#ef4444' : index < 6 ? '#f97316' : '#f59e0b'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Lista detalhada dos top 5 */}
      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="bg-navy-800/50 border border-navy-700 rounded-lg p-4 hover:bg-navy-800 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                    ${index === 0 ? 'bg-red-500 text-white' :
                      index === 1 ? 'bg-orange-500 text-white' :
                      index === 2 ? 'bg-yellow-500 text-white' :
                      'bg-slate-600 text-white'}
                  `}
                >
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">{item.nome}</h4>
                  <p className="text-sm text-slate-400 font-mono">{item.cpf}</p>
                  <p className="text-sm text-slate-300 mt-1">{item.cargo}</p>
                  <p className="text-xs text-slate-400">{item.diretoria}</p>

                  {/* Badges de irregularidades */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.empresas > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
                        <Building2 className="w-3 h-3" />
                        {item.empresas} empresa{item.empresas > 1 ? 's' : ''}
                      </span>
                    )}
                    {item.obito && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        Óbito
                      </span>
                    )}
                    {item.sancao && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        Sanção
                      </span>
                    )}
                    {item.dano > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                        <DollarSign className="w-3 h-3" />
                        Dano ao erário
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{item.score}</div>
                <div className="text-xs text-slate-400">pontos</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
