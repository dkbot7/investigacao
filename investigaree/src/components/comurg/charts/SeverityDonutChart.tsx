"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SeverityData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface SeverityDonutChartProps {
  data: SeverityData[];
}

const SEVERITY_COLORS: Record<string, string> = {
  'Crítico': '#ef4444',
  'Critico': '#ef4444',
  'Alto': '#f97316',
  'Atencao': '#f97316',
  'Médio': '#f59e0b',
  'Baixo': '#84cc16',
  'Regular': '#84cc16',
};

export function SeverityDonutChart({ data }: SeverityDonutChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-400">
        Sem dados para exibir
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            labelLine={{ stroke: '#94a3b8' }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={SEVERITY_COLORS[entry.name] || '#94a3b8'}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: any) => [`${value} casos`, 'Total']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Centro do donut com total */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="text-3xl font-bold text-white">{total}</div>
        <div className="text-sm text-slate-400">Total</div>
      </div>
    </div>
  );
}
