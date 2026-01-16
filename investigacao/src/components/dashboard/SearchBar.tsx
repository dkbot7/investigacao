import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  loading?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  debounceMs = 300,
  loading = false,
  className = "",
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value);

  // Sync internal value with external value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onChange, value]);

  const handleClear = () => {
    setInternalValue("");
    onChange("");
  };

  const isLoading = loading && internalValue !== value;

  return (
    <div className={`relative ${className}`}>
      {isLoading ? (
        <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      )}
      <input
        type="search"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      {internalValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Limpar busca"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
