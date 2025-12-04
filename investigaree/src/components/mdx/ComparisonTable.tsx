"use client";

import { Check, X, Minus } from "lucide-react";

interface ComparisonItem {
  feature: string;
  values: (boolean | string | null)[];
}

interface ComparisonTableProps {
  headers: string[];
  items: ComparisonItem[];
  title?: string;
}

export default function ComparisonTable({ headers, items, title }: ComparisonTableProps) {
  const renderValue = (value: boolean | string | null) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-green-400 mx-auto" />;
    }
    if (value === false) {
      return <X className="w-5 h-5 text-red-400 mx-auto" />;
    }
    if (value === null) {
      return <Minus className="w-5 h-5 text-navy-500 mx-auto" />;
    }
    return <span className="text-navy-300">{value}</span>;
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-gold-500/10">
      {title && (
        <div className="px-4 py-3 bg-navy-900 border-b border-gold-500/10">
          <h4 className="font-medium text-white">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-navy-900/70">
              <th className="px-4 py-3 text-left text-sm font-medium text-navy-300 border-b border-gold-500/10">
                Característica
              </th>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-center text-sm font-medium text-gold-400 border-b border-gold-500/10"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gold-500/5 hover:bg-navy-900/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-white">{item.feature}</td>
                {item.values.map((value, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-center">
                    {renderValue(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
