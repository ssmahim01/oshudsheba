"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";

import { AppSidebar } from "./app-sidebar";
import DashboardSkeleton from "./DashboardSkeleton";
import { DashboardHeader } from "./DashboardHeader";

type UserShape = { name?: string; role?: string };

export const DashboardContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isLoading } = useUserInfoQuery(undefined);
  const pathname = usePathname();
  const { setOpen } = useSidebar();

  const autoClosedRef = useRef(false);

  useEffect(() => {
    if (pathname === "/staff/dashboard/pos") {
      if (!autoClosedRef.current) {
        setOpen(false);
        autoClosedRef.current = true;
      }
    } else {
      autoClosedRef.current = false;
    }
  }, [pathname, setOpen]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const payload = data as unknown as (UserShape & { data?: UserShape }) | undefined;
  const user = payload?.data ?? payload;

  return (
    <>
      <AppSidebar />

      <SidebarInset>
        <DashboardHeader userName={user?.name} userRole={user?.role} />

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </>
  );
};