"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronsLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarBrandProps {
  href: string;
  collapsed: boolean;
  isMobile: boolean;
  onNavigate: () => void;
  onToggle: () => void;
}

const LOGO_SRC = "/assets/oshudsheba.png";
const FAVICON = "/assets/small-logo.png";

export const SidebarBrand = React.memo(function SidebarBrand({
  href,
  collapsed,
  isMobile,
  onNavigate,
  onToggle,
}: SidebarBrandProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        collapsed ? "justify-center" : "gap-2",
      )}
    >
     <Link
          href={href}
          onClick={onNavigate}
          aria-label="OshudSheba dashboard home"
          className={cn(
            "group relative min-w-0 cursor-pointer",
            "rounded-xl outline-none",
            "transition-transform duration-200",
            "hover:scale-[1.02]",
            "focus-visible:ring-2 focus-visible:ring-emerald-500/60",
            collapsed
              ? "flex size-10 shrink-0 items-center justify-center overflow-hidden"
              : "flex h-14 min-w-0 flex-1 items-center",
          )}
        >
          {collapsed ? (
            <div className="relative size-9 overflow-hidden rounded-lg">
              <Image
                src={FAVICON}
                alt="OshudSheba"
                fill
                sizes="36px"
                priority
                quality={100}
                className="object-cover object-left"
              />
            </div>
          ) : (
            <Image
              src={LOGO_SRC}
              alt="OshudSheba Logo"
              width={2048}
              height={1024}
              priority
              quality={100}
              sizes="(max-width: 768px) 180px, 220px"
              className={cn(
                "h-auto w-full max-w-[220px]",
                "object-contain object-left",
                "dark:brightness-105",
              )}
            />
          )}
        </Link>


      {!collapsed && (
        <button
          type="button"
          onClick={onToggle}
          aria-label={isMobile ? "Close menu" : "Collapse sidebar"}
          className={cn(
            "grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg",
            "text-slate-500 transition-all duration-200 hover:scale-105 hover:bg-emerald-50 hover:text-emerald-700",
            "focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:outline-none active:scale-95",
            "dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-emerald-300",
          )}
        >
          {isMobile ? (
            <X className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </button>
      )}
    </div>
  );
});
