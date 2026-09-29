"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusBreakdownItem {
  key: string;
  label: string;
  icon: LucideIcon;
  cls: string;
  val: string;
  count: number;
}

interface StatusBreakdownGridProps {
  items: StatusBreakdownItem[];
  total: number;
  onSelect?: (key: string) => void;
}

export function StatusBreakdownGrid({ items, total, onSelect }: StatusBreakdownGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
      {items.map(({ key, label, icon: Icon, cls, val, count }) => (
        <button
          type="button"
          key={key}
          onClick={() => onSelect?.(key)}
          className={cn(
            "rounded-2xl border p-4 transition-all duration-200 hover:shadow-sm",
            cls,
            "text-left transition-transform hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {label}
            </p>
            <Icon className={cn("h-4 w-4", val)} />
          </div>
          <p className={cn("text-2xl font-bold tabular-nums", val)}>{count}</p>
          <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
            {total > 0 ? `${Math.round((count / total) * 100)}% of total` : "0%"}
          </p>
        </button>
      ))}
    </div>
  );
}
