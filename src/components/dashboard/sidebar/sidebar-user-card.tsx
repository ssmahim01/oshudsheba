"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials } from "./sidebar-utils";

interface SidebarUserCardProps {
  name: string;
  role: string;
  email?: string;
  imageUrl?: string;
  collapsed: boolean;
}

export const SidebarUserCard = React.memo(function SidebarUserCard({
  name,
  role,
  email,
  imageUrl,
  collapsed,
}: SidebarUserCardProps) {
  const avatar = (
    <div className="relative shrink-0">
      <Avatar
        className={cn(
          "ring-2 ring-emerald-500/30 transition-transform duration-200 group-hover/user:scale-105",
          collapsed ? "size-8" : "size-11",
        )}
      >
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          "absolute -right-0.5 -bottom-0.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#08171d]",
          collapsed ? "size-2.5" : "size-3.5",
        )}
      >
        <span className="sr-only">Online</span>
      </span>
    </div>
  );

  if (collapsed) {
    return (
      <div className="group/user flex justify-center" title={`${name} · ${role}`}>
        {avatar}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group/user flex items-center gap-3 rounded-2xl border p-3 transition-colors duration-200",
        "border-emerald-100 bg-white/80 shadow-sm hover:border-emerald-200",
        "dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-emerald-400/30",
      )}
    >
      {avatar}
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {name}
        </p>
        <p className="mt-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
          {role}
        </p>
        {email && (
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {email}
          </p>
        )}
      </div>
    </div>
  );
});