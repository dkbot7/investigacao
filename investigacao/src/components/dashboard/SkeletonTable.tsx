interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 5 }: SkeletonTableProps) {
  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl overflow-hidden">
      {/* Header skeleton */}
      <div className="bg-slate-100 dark:bg-navy-800/50 border-b border-slate-400 dark:border-navy-700 p-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-slate-200 dark:bg-navy-700 rounded flex-1 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Rows skeleton */}
      <div className="divide-y divide-slate-300 dark:divide-navy-800">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-slate-200 dark:bg-navy-800 rounded flex-1 animate-pulse"
                  style={{ animationDelay: `${(rowIndex * columns + colIndex) * 50}ms` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
