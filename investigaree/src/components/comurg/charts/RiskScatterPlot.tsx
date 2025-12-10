"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';

interface ScatterData {
  nome: string;
  risco: number;
  riscoLabel: string;
  salario: number;
  empresas: number;
  cor: string;
}

interface RiskScatterPlotProps {
  data: ScatterData[];
}

export function RiskScatterPlot({ data }: RiskScatterPlotProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-slate-400">
        Sem dados para exibir
      </div>
    );
  }

  const riskLabels = ['', 'Baixo', 'Médio', 'Alto', 'Crítico'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          type="number"
          dataKey="risco"
          name="Risco"
          domain={[0, 5]}
          ticks={[1, 2, 3, 4]}
          tickFormatter={(tick) => riskLabels[tick] || ''}
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          type="number"
          dataKey="salario"
          name="Salário"
          tickFormatter={(value) => `R$ ${(value / 1000).toFixed(1)}k`}
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
        />
        <ZAxis
          type="number"
          dataKey="empresas"
          range={[50, 400]}
          name="Empresas"
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload as ScatterData;
              return (
                <div className="bg-navy-800 border border-navy-600 p-3 rounded-lg shadow-lg">
                  <p className="font-bold text-white mb-1">{data.nome}</p>
                  <p className="text-sm text-slate-300">
                    Risco: <span className="font-semibold">{data.riscoLabel}</span>
                  </p>
                  <p className="text-sm text-slate-300">
                    Salário: <span className="font-semibold">R$ {data.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </p>
                  <p className="text-sm text-slate-300">
                    Empresas: <span className="font-semibold">{data.empresas}</span>
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter
          name="Funcionários"
          data={data}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.cor} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
