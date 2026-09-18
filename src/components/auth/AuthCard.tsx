import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export default function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-md sm:p-8",
        "dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/30",
        className,
      )}
    >
      {children}
    </div>
  );
}
