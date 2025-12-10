"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ImpactData {
  diretoria: string;
  salarios: number;
  dano: number;
  potencial: number;
  count: number;
}

interface ImpactStackedBarProps {
  data: ImpactData[];
}

export function ImpactStackedBar({ data }: ImpactStackedBarProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-400">
        Sem dados para exibir
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return `R$ ${value.toFixed(0)}`;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="diretoria"
          stroke="#94a3b8"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          style={{ fontSize: '10px' }}
        />
        <YAxis
          stroke="#94a3b8"
          tickFormatter={formatCurrency}
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value: any) => formatCurrency(Number(value))}
          labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
        />
        <Legend
          wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
        />
        <Bar
          dataKey="salarios"
          stackId="a"
          fill="#3b82f6"
          name="Salários Mensais"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="dano"
          stackId="a"
          fill="#ef4444"
          name="Dano ao Erário"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="potencial"
          stackId="a"
          fill="#f59e0b"
          name="Potencial Anual"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
