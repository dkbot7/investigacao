"use client";

interface HeatmapData {
  xLabels: string[];
  yLabels: string[];
  data: number[][];
}

interface DepartmentHeatmapProps extends HeatmapData {}

export function DepartmentHeatmap({ xLabels, yLabels, data }: DepartmentHeatmapProps) {
  if (!data || data.length === 0 || !xLabels || !yLabels) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-400">
        Sem dados para exibir
      </div>
    );
  }

  // Encontrar valor máximo para normalizar cores
  const maxValue = Math.max(...data.flat());
  const minValue = Math.min(...data.flat());

  // Função para gerar cor baseada no valor
  const getColor = (value: number) => {
    if (value === 0) return '#1e293b'; // Navy-800 para zero

    const normalized = (value - minValue) / (maxValue - minValue || 1);

    if (normalized > 0.75) return '#ef4444'; // Vermelho - Alto
    if (normalized > 0.5) return '#f97316'; // Laranja - Médio-Alto
    if (normalized > 0.25) return '#f59e0b'; // Amarelo - Médio
    return '#84cc16'; // Verde - Baixo
  };

  // Função para cor do texto
  const getTextColor = (value: number) => {
    if (value === 0) return '#64748b'; // Cinza escuro
    const normalized = (value - minValue) / (maxValue - minValue || 1);
    return normalized > 0.5 ? '#ffffff' : '#1e293b';
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-xs text-slate-400 border border-navy-700 bg-navy-800 sticky left-0 z-10">
                {/* Célula vazia no canto */}
              </th>
              {xLabels.map((label, index) => (
                <th
                  key={index}
                  className="p-2 text-xs font-semibold text-slate-300 border border-navy-700 bg-navy-800 whitespace-nowrap"
                  style={{ minWidth: '80px' }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yLabels.map((yLabel, yIndex) => (
              <tr key={yIndex}>
                <td className="p-2 text-xs font-semibold text-slate-300 border border-navy-700 bg-navy-800 sticky left-0 z-10 whitespace-nowrap">
                  {yLabel}
                </td>
                {xLabels.map((_, xIndex) => {
                  const value = data[yIndex]?.[xIndex] ?? 0;
                  return (
                    <td
                      key={xIndex}
                      className="p-3 text-center text-sm font-bold border border-navy-700 transition-all hover:scale-105 cursor-pointer"
                      style={{
                        backgroundColor: getColor(value),
                        color: getTextColor(value)
                      }}
                      title={`${yLabel} - ${xLabels[xIndex]}: ${value} casos`}
                    >
                      {value > 0 ? value : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legenda */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }}></div>
            <span className="text-slate-400">Baixo (1-{Math.ceil(maxValue * 0.25)})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-slate-400">Médio ({Math.ceil(maxValue * 0.25)}-{Math.ceil(maxValue * 0.5)})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
            <span className="text-slate-400">Alto ({Math.ceil(maxValue * 0.5)}-{Math.ceil(maxValue * 0.75)})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-slate-400">Crítico (>{Math.ceil(maxValue * 0.75)})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
