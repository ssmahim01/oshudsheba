"use client";

import * as React from "react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { SidebarNavItemData } from "./sidebar-utils";

type Tone = "default" | "danger";

const ITEM_BASE = cn(
  "h-10 cursor-pointer rounded-xl px-3 text-sm font-medium",
  "transition-all duration-200 active:scale-[0.98]",
  "focus-visible:ring-2 focus-visible:ring-emerald-500/60",
  "[&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:scale-110",
);

const ITEM_ACTIVE = cn(
  "bg-[linear-gradient(135deg,#10b981_0%,#0d9488_100%)] text-white",
  "shadow-md shadow-emerald-600/25 hover:text-white hover:brightness-110",
  "dark:shadow-emerald-500/10 dark:ring-1 dark:ring-emerald-400/30",
);

const ITEM_IDLE = cn(
  "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700",
  "dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300",
);

const ITEM_DANGER = cn(
  "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
  "dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300",
);

interface SidebarNavLinkProps {
  item: SidebarNavItemData;
  isActive?: boolean;
  collapsed: boolean;
  onNavigate: () => void;
  tone?: Tone;
  /** Render as an action button instead of a link (logout). */
  asButton?: boolean;
}

export const SidebarNavLink = React.memo(function SidebarNavLink({
  item,
  isActive = false,
  collapsed,
  onNavigate,
  tone = "default",
  asButton = false,
}: SidebarNavLinkProps) {
  const className = cn(
    ITEM_BASE,
    tone === "danger" ? ITEM_DANGER : isActive ? ITEM_ACTIVE : ITEM_IDLE,
  );
  // The native title would double up with the tooltip shown when collapsed.
  const title = collapsed ? undefined : item.description;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} className={className}>
        {asButton ? (
          <button
            type="button"
            title={title}
            onClick={() => {
              item.onClick?.();
              onNavigate();
            }}
          >
            {item.icon}
            <span>{item.title}</span>
          </button>
        ) : (
          <Link
            href={item.href}
            title={title}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
});

interface SidebarNavGroupProps {
  label?: string;
  items: readonly SidebarNavItemData[];
  activeHref: string | null;
  collapsed: boolean;
  onNavigate: () => void;
  /** Collapsed mode swaps the section label for a hairline divider. */
  showDivider?: boolean;
}

export const SidebarNavGroup = React.memo(function SidebarNavGroup({
  label,
  items,
  activeHref,
  collapsed,
  onNavigate,
  showDivider = false,
}: SidebarNavGroupProps) {
  if (items.length === 0) return null;

  return (
    <SidebarGroup className="py-1">
      {collapsed
        ? showDivider && (
            <div
              aria-hidden
              className="mx-1 mb-2 border-t border-slate-200 dark:border-white/10"
            />
          )
        : label && (
            <SidebarGroupLabel className="h-7 px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              {label}
            </SidebarGroupLabel>
          )}

      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => (
            <SidebarNavLink
              key={`${item.href}-${item.title}`}
              item={item}
              isActive={item.href === activeHref}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
});