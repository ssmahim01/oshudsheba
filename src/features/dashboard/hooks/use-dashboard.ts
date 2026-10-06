"use client";

import { createQueryHook } from "@/lib/query";

import { dashboardServices } from "../services/dashboard.service";

export const useGetDashboardOverviewQuery = createQueryHook(dashboardServices.getOverview);
