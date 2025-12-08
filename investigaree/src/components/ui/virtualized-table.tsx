import { memo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

/**
 * VirtualizedTable Component
 *
 * Tabela virtualizada para renderizar grandes quantidades de dados
 * sem impacto de performance.
 *
 * Usa react-window para renderizar apenas os itens visíveis no viewport.
 *
 * @example
 * ```tsx
 * const columns = [
 *   { key: 'name', label: 'Nome', width: 200 },
 *   { key: 'email', label: 'Email', width: 250 },
 * ];
 *
 * <VirtualizedTable
 *   data={users}
 *   columns={columns}
 *   rowHeight={60}
 *   height={600}
 * />
 * ```
 */

export interface Column<T> {
  key: keyof T;
  label: string;
  width?: number | string;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  className?: string;
}

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  height?: number;
  onRowClick?: (item: T, index: number) => void;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  emptyMessage?: string;
}

function VirtualizedTableInner<T extends Record<string, any>>({
  data,
  columns,
  rowHeight = 60,
  height = 600,
  onRowClick,
  className = '',
  headerClassName = '',
  rowClassName = '',
  emptyMessage = 'Nenhum registro encontrado'
}: VirtualizedTableProps<T>) {
  // Renderizar linha
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = data[index];
      const rowClass = typeof rowClassName === 'function'
        ? rowClassName(item, index)
        : rowClassName;

      return (
        <div
          style={style}
          className={`flex items-center border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${rowClass} ${
            onRowClick ? 'cursor-pointer' : ''
          }`}
          onClick={() => onRowClick?.(item, index)}
        >
          {columns.map((col) => {
            const value = item[col.key];
            const content = col.render ? col.render(value, item, index) : value;

            return (
              <div
                key={String(col.key)}
                className={`px-4 py-3 ${col.className || ''}`}
                style={{
                  width: col.width || `${100 / columns.length}%`,
                  flex: col.width ? 'none' : 1
                }}
              >
                {content}
              </div>
            );
          })}
        </div>
      );
    },
    [data, columns, rowClassName, onRowClick]
  );

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={`border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
        {/* Header */}
        <div className={`flex items-center bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-medium text-sm ${headerClassName}`}>
          {columns.map((col) => (
            <div
              key={String(col.key)}
              className={`px-4 py-3 ${col.className || ''}`}
              style={{
                width: col.width || `${100 / columns.length}%`,
                flex: col.width ? 'none' : 1
              }}
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Empty message */}
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`flex items-center bg-gray-50 dark:border-gray-900 border-b border-gray-200 dark:border-gray-700 font-medium text-sm ${headerClassName}`}>
        {columns.map((col) => (
          <div
            key={String(col.key)}
            className={`px-4 py-3 ${col.className || ''}`}
            style={{
              width: col.width || `${100 / columns.length}%`,
              flex: col.width ? 'none' : 1
            }}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Virtual list */}
      <List
        height={height}
        itemCount={data.length}
        itemSize={rowHeight}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
}

// Memoize para evitar re-renders desnecessários
export const VirtualizedTable = memo(VirtualizedTableInner) as typeof VirtualizedTableInner;
