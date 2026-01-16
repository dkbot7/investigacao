export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3">
        {/* Icon skeleton */}
        <div className="w-8 h-8 bg-slate-200 dark:bg-navy-800 rounded" />

        <div className="flex-1">
          {/* Value skeleton */}
          <div className="h-8 bg-slate-200 dark:bg-navy-800 rounded w-16 mb-2" />

          {/* Title skeleton */}
          <div className="h-4 bg-slate-200 dark:bg-navy-800 rounded w-24" />
        </div>
      </div>
    </div>
  );
}
