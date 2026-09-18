import type * as React from "react";

export interface SidebarNavItemData {
  title: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  onClick?: () => void;
}

export interface SidebarNavGroupData {
  id: string;
  label: string;
  items: SidebarNavItemData[];
}

export interface SidebarStructure {
  overview: SidebarNavItemData[];
  groups: SidebarNavGroupData[];
  support: SidebarNavItemData[];
  logout: SidebarNavItemData | null;
}

const LOGOUT_HREF = "#logout";
const OVERVIEW_TITLE = /^(dashboard|overview|home)$/i;
const SUPPORT_TITLE = /^help\b/i;

const GROUP_RULES: ReadonlyArray<{ id: string; label: string; test: RegExp }> =
  [
    {
      id: "sales",
      label: "Sales & Orders",
      test: /\bpos\b|order|sale|invoice/i,
    },
    {
      id: "catalog",
      label: "Products",
      test: /product|categor|brand|inventor|stock|medicine/i,
    },
    { id: "people", label: "Users & Staff", test: /user|staff|role|customer/i },
    { id: "settings", label: "Settings", test: /setting|courier/i },
  ];

const FALLBACK_GROUP = { id: "other", label: "Menu" } as const;

export const isLogoutItem = (item: SidebarNavItemData) =>
  item.href === LOGOUT_HREF;

export function buildSidebarStructure(
  items: readonly SidebarNavItemData[],
): SidebarStructure {
  const overview: SidebarNavItemData[] = [];
  const support: SidebarNavItemData[] = [];
  const buckets = new Map<string, SidebarNavGroupData>();
  let logout: SidebarNavItemData | null = null;

  for (const item of items) {
    if (isLogoutItem(item)) {
      logout = item;
      continue;
    }
    if (OVERVIEW_TITLE.test(item.title)) {
      overview.push(item);
      continue;
    }
    if (SUPPORT_TITLE.test(item.title)) {
      support.push(item);
      continue;
    }

    const rule = GROUP_RULES.find((r) => r.test.test(item.title));
    const { id, label } = rule ?? FALLBACK_GROUP;
    const bucket = buckets.get(id);
    if (bucket) bucket.items.push(item);
    else buckets.set(id, { id, label, items: [item] });
  }

  const orderedIds = [...GROUP_RULES.map((r) => r.id), FALLBACK_GROUP.id];
  const groups = orderedIds
    .map((id) => buckets.get(id))
    .filter((g): g is SidebarNavGroupData => Boolean(g));

  return { overview, groups, support, logout };
}

export function getActiveHref(
  items: readonly SidebarNavItemData[],
  pathname: string,
): string | null {
  let best: string | null = null;

  for (const { href } of items) {
    if (!href || href.startsWith("#")) continue;
    const prefix = href.endsWith("/") ? href : `${href}/`;
    const matches = pathname === href || pathname.startsWith(prefix);
    if (matches && (best === null || href.length > best.length)) best = href;
  }

  return best;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}
