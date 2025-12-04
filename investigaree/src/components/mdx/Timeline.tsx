"use client";

import { ReactNode } from "react";
import { Clock, CheckCircle, Circle } from "lucide-react";

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  completed?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
}

export default function Timeline({ items, title }: TimelineProps) {
  return (
    <div className="my-6">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gold-500" />
          <h4 className="font-medium text-white">{title}</h4>
        </div>
      )}

      <div className="relative pl-8 border-l-2 border-gold-500/20 space-y-6">
        {items.map((item, index) => (
          <div key={index} className="relative">
            {/* Dot */}
            <div className="absolute -left-[25px] p-1 bg-navy-950 rounded-full">
              {item.completed ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Circle className="w-4 h-4 text-gold-500" />
              )}
            </div>

            {/* Content */}
            <div className="pb-2">
              <div className="text-xs text-gold-400 font-medium mb-1">
                {item.date}
              </div>
              <div className="font-medium text-white">{item.title}</div>
              {item.description && (
                <p className="text-sm text-navy-400 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
