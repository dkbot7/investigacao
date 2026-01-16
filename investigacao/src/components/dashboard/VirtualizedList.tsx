import { Virtuoso } from 'react-virtuoso';

interface VirtualizedListProps<T> {
  data: T[];
  itemContent: (index: number, item: T) => React.ReactNode;
  height?: number | string;
  overscan?: number;
  className?: string;
}

export function VirtualizedList<T>({
  data,
  itemContent,
  height = 600,
  overscan = 5,
  className = '',
}: VirtualizedListProps<T>) {
  return (
    <Virtuoso
      data={data}
      itemContent={itemContent}
      style={{ height }}
      overscan={overscan}
      className={className}
    />
  );
}
