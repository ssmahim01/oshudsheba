"use client";

import { memo, useMemo, useSyncExternalStore } from "react";
import { Clock, Moon, Sun, SunMedium, Sunrise, Sunset } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProfileDropdown } from "./ProfileDropdown";

function createSubscribe(intervalMs: number) {
  return (onChange: () => void) => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(
        () => {
          onChange();
          schedule();
        },
        intervalMs - (Date.now() % intervalMs),
      );
    };
    const onVisible = () => {
      if (!document.hidden) onChange();
    };
    schedule();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  };
}

const subscribeSecond = createSubscribe(1000);
const subscribeMinute = createSubscribe(60_000);
const getSecond = () => Math.floor(Date.now() / 1000) * 1000;
const getMinute = () => Math.floor(Date.now() / 60_000) * 60_000;
const getServer = () => null;

function HeaderClock() {
  const tick = useSyncExternalStore(subscribeSecond, getSecond, getServer);

  const fmt = useMemo(
    () => ({
      time: new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      longDate: new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      shortDate: new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      zone: new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }),
    }),
    [],
  );

  const now = tick === null ? null : new Date(tick);
  const zone = now
    ? fmt.zone.formatToParts(now).find((p) => p.type === "timeZoneName")?.value
    : undefined;

  return (
    <div
      role="timer"
      className="flex items-center gap-2.5 rounded-xl border border-[#007BFF]/20 bg-[#007BFF]/5 px-2.5 py-1 dark:border-[#007BFF]/30 dark:bg-[#007BFF]/10 sm:px-3"
    >
      <div
        className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#007BFF] sm:flex"
        aria-hidden="true"
      >
        <Clock className="h-4 w-4 text-white" />
      </div>

      <div className="min-w-[5.5rem] leading-tight">
        <p className="flex items-baseline gap-1.5 text-sm font-bold tabular-nums text-gray-900 dark:text-gray-50">
          <span className={now ? undefined : "invisible"}>
            {now ? fmt.time.format(now) : "00:00:00 AM"}
          </span>
          {zone && (
            <span className="hidden text-[10px] font-semibold text-[#007BFF] xl:inline dark:text-[#4DA3FF]">
              {zone}
            </span>
          )}
        </p>
        <p className="truncate text-[10px] text-gray-500 dark:text-gray-400 sm:text-[11px]">
          {now ? (
            <>
              <span className="md:hidden">{fmt.shortDate.format(now)}</span>
              <span className="hidden md:inline">
                {fmt.longDate.format(now)}
              </span>
            </>
          ) : (
            <span className="invisible">Wednesday, September 30, 2026</span>
          )}
        </p>
      </div>
    </div>
  );
}

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) {
    return {
      text: "Good morning",
      Icon: Sunrise,
    };
  }

  if (hour >= 12 && hour < 13) {
    return {
      text: "Good noon",
      Icon: Sun,
    };
  }

  if (hour >= 13 && hour < 17) {
    return {
      text: "Good afternoon",
      Icon: SunMedium,
    };
  }

  if (hour >= 17 && hour < 21) {
    return {
      text: "Good evening",
      Icon: Sunset,
    };
  }

  return {
    text: "Good night",
    Icon: Moon,
  };
}

function HeaderGreeting({ name, role }: { name?: string; role?: string }) {
  const tick = useSyncExternalStore(subscribeMinute, getMinute, getServer);
  const greeting =
    tick === null ? null : getGreeting(new Date(tick).getHours());
  const firstName = name?.trim().split(/\s+/)[0];
  const roleLabel = role
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : undefined;

  return (
    <div className="min-w-0 items-center gap-3 flex">
      <div className="min-w-0 leading-tight">
        <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
          {greeting && (
            <greeting.Icon
              className="h-4 w-4 shrink-0 text-[#007BFF]"
              aria-hidden="true"
            />
          )}
          <span className="truncate">
            {greeting ? greeting.text : "Welcome back"}
            {firstName ? `, ${firstName}` : ""}
          </span>
        </p>
        <p className="hidden truncate text-xs text-gray-500 dark:text-gray-400 lg:block">
          Here&apos;s what&apos;s happening in your store today
        </p>
      </div>
      {roleLabel && (
        <span className="hidden shrink-0 rounded-full border border-[#007BFF]/30 bg-[#007BFF]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#007BFF] dark:text-[#4DA3FF] md:inline-flex">
          {roleLabel}
        </span>
      )}
    </div>
  );
}

type DashboardHeaderProps = { userName?: string; userRole?: string };

export const DashboardHeader = memo(function DashboardHeader({
  userName,
  userRole,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <div
          className="hidden h-6 w-px shrink-0 bg-border sm:block"
          aria-hidden="true"
        />
        <HeaderGreeting name={userName} role={userRole} />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <HeaderClock />
        <ProfileDropdown />
      </div>
    </header>
  );
});
