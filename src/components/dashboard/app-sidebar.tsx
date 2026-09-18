"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { UserRole } from "@/lib/permissions";
import { getDashboardRoute } from "@/lib/auth/auth-utils";
import { ScrollArea } from "../ui/scroll-area";
import { buildSidebarItems } from "./user/buildSidebar";
import { SidebarBrand } from "./sidebar/sidebar-brand";
import { SidebarUserCard } from "./sidebar/sidebar-user-card";
import { SidebarNavGroup, SidebarNavLink } from "./sidebar/sidebar-nav";
import {
  buildSidebarStructure,
  getActiveHref,
  type SidebarNavItemData,
} from "./sidebar/sidebar-utils";

type SidebarPermissions = Parameters<typeof buildSidebarItems>[1];

interface SidebarUserInfo {
  role?: string;
  name?: string;
  fullName?: string;
  email?: string;
  image?: string;
  avatar?: string;
  profilePicture?: string;
  permissions?: SidebarPermissions;
}

const SHELL_CLASS =
  "flex h-full min-h-0 w-full flex-col bg-[linear-gradient(180deg,#ffffff_0%,#f3fbf8_100%)] " +
  "dark:bg-[linear-gradient(180deg,#0a1d24_0%,#071419_100%)]";

function SidebarShell({ children }: { children: React.ReactNode }) {
  return <div className={SHELL_CLASS}>{children}</div>;
}

function SidebarLoading() {
  return (
    <SidebarShell>
      <div
        className="space-y-3 p-4"
        role="status"
        aria-label="Loading navigation"
      >
        <div className="h-12 animate-pulse rounded-xl bg-slate-200/70 dark:bg-white/10" />
        <div className="h-16 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-white/10" />
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className="h-9 animate-pulse rounded-xl bg-slate-200/60 dark:bg-white/5"
          />
        ))}
      </div>
    </SidebarShell>
  );
}

function SidebarTagline() {
  return (
    <div
      className={
        "relative hidden overflow-hidden rounded-2xl p-3 text-sm font-medium [@media(min-height:800px)]:block " +
        "bg-[linear-gradient(135deg,#ecfdf5,#ccfbf1)] text-emerald-900 " +
        "dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(13,148,136,0.06))] dark:text-emerald-100"
      }
    >
      <p className="max-w-38 leading-snug">
        Better Health for a Brighter Tomorrow
      </p>
      <Leaf
        aria-hidden
        className="absolute -right-1 -bottom-2 size-14 rotate-12 text-emerald-500/30"
      />
    </div>
  );
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data, isLoading, isError } = useUserInfoQuery(undefined);
  const { isMobile, state, setOpenMobile, toggleSidebar } = useSidebar();

  const user = data?.data as SidebarUserInfo | undefined;
  const userRole = (user?.role as UserRole) || "MODERATOR";
  const permissions = user?.permissions;
  const hasRole = Boolean(user?.role);

  const collapsed = state === "collapsed" && !isMobile;

  const items = React.useMemo<SidebarNavItemData[]>(
    () => (hasRole ? buildSidebarItems(userRole, permissions) : []),
    [hasRole, userRole, permissions],
  );
  const structure = React.useMemo(() => buildSidebarStructure(items), [items]);
  const activeHref = React.useMemo(
    () => getActiveHref(items, pathname),
    [items, pathname],
  );

  const handleNavigate = React.useCallback(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, setOpenMobile]);

  const handleToggle = React.useCallback(() => {
    if (isMobile) setOpenMobile(false);
    else toggleSidebar();
  }, [isMobile, setOpenMobile, toggleSidebar]);

  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarLoading />
      </Sidebar>
    );
  }

  if (isError || !hasRole) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarShell>
          <p
            role="alert"
            className="m-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400"
          >
            Failed to load user info
          </p>
        </SidebarShell>
      </Sidebar>
    );
  }

  const displayName =
    user?.name ?? user?.fullName ?? user?.email?.split("@")[0] ?? userRole;
  const imageUrl = user?.image ?? user?.avatar ?? user?.profilePicture;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarShell>
        <SidebarHeader className="gap-3 p-2">
          <SidebarBrand
            href={getDashboardRoute(userRole)}
            collapsed={collapsed}
            isMobile={isMobile}
            onNavigate={handleNavigate}
            onToggle={handleToggle}
          />
          <SidebarUserCard
            name={displayName}
            role={userRole}
            email={user?.email}
            imageUrl={imageUrl}
            collapsed={collapsed}
          />
        </SidebarHeader>

        <SidebarContent className="gap-0 overflow-hidden">
          <ScrollArea className="min-h-0 flex-1">
            <SidebarNavGroup
              items={structure.overview}
              activeHref={activeHref}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
            {structure.groups.map((group, index) => (
              <SidebarNavGroup
                key={group.id}
                label={group.label}
                items={group.items}
                activeHref={activeHref}
                collapsed={collapsed}
                onNavigate={handleNavigate}
                showDivider={index > 0 || structure.overview.length > 0}
              />
            ))}
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="gap-2 border-t border-slate-200/80 p-2 dark:border-white/10">
          <SidebarMenu className="gap-1">
            {structure.support.map((item) => (
              <SidebarNavLink
                key={`${item.href}-${item.title}`}
                item={item}
                isActive={item.href === activeHref}
                collapsed={collapsed}
                onNavigate={handleNavigate}
              />
            ))}
            {structure.logout && (
              <SidebarNavLink
                item={structure.logout}
                collapsed={collapsed}
                onNavigate={handleNavigate}
                tone="danger"
                asButton
              />
            )}
          </SidebarMenu>
          {!collapsed && <SidebarTagline />}
        </SidebarFooter>
      </SidebarShell>

      <SidebarRail />
    </Sidebar>
  );
}
