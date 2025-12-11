interface SkeletonChartProps {
  type?: 'pie' | 'bar' | 'line';
  title?: string;
}

export function SkeletonChart({ type = 'bar', title }: SkeletonChartProps) {
  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 sm:p-6">
      {/* Title skeleton */}
      {title && (
        <div className="h-6 bg-slate-200 dark:bg-navy-800 rounded w-48 mb-4 animate-pulse" />
      )}

      {/* Chart skeleton */}
      <div className="h-[250px] sm:h-[300px] flex items-end justify-around gap-2 animate-pulse">
        {type === 'pie' ? (
          <div className="w-40 h-40 bg-slate-200 dark:bg-navy-800 rounded-full mx-auto mt-auto" />
        ) : type === 'line' ? (
          <>
            {Array.from({ length: 8 }).map((_, i) => {
              const height = Math.random() * 80 + 20;
              return (
                <div
                  key={i}
                  className="flex-1 bg-slate-200 dark:bg-navy-800 rounded-t"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              );
            })}
          </>
        ) : (
          <>
            {Array.from({ length: 6 }).map((_, i) => {
              const height = Math.random() * 80 + 20;
              return (
                <div
                  key={i}
                  className="flex-1 bg-slate-200 dark:bg-navy-800 rounded-t"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Legend skeleton */}
      <div className="flex gap-4 mt-4 justify-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-slate-200 dark:bg-navy-800 rounded w-16 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
