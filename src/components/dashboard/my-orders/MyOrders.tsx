/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
} from "date-fns";
import { toast } from "sonner";
import {
  Search,
  X,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
  RotateCcw,
  CalendarDays,
  CalendarRange,
  ChevronDown,
  PackageSearch,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { DateRange } from "react-day-picker";
import {
  useGetMyHoldOrdersQuery,
  useGetMyOrdersQuery,
  useGetMyScheduledOrdersQuery,
  useGetMyWaitingForStockOrdersQuery,
} from "@/redux/features/orders/myOrdersApi";
import { useGetMeQuery } from "@/redux/features/user/user.api";
import { useCreateCourierMutation, useDeleteOrderMutation } from "@/lib/hooks";
import { AssignCourierModal } from "@/components/dashboard/orders/AssignCourierModal";
import { MyOrdersTable, type UserRole } from "./MyOrdersTable";
import { MyOrderDetailModal } from "./MyOrderDetailModal";
import { MyOrderEditModal } from "./MyOrderEditModal";
import type { Order, OrderStatus } from "@/types/orders";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OrderModeChangeModal } from "@/components/shared/OrderModeChangeModal";
import { CourierProvider } from "@/types";

const LIMIT = 10;

const BRAND_CHIP =
  "bg-[#007BFF]/10 text-[#007BFF] border-[#007BFF]/30 dark:bg-[#007BFF]/20 dark:text-[#4DA3FF] dark:border-[#007BFF]/40";

const PRESETS = [
  {
    label: "Today",
    get: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }),
  },
  {
    label: "Yesterday",
    get: () => {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      return { from: startOfDay(y), to: endOfDay(y) };
    },
  },
  {
    label: "This week",
    get: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "This month",
    get: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last 30 days",
    get: () => {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      return { from: startOfDay(d), to: endOfDay(new Date()) };
    },
  },
];

const STATUS_OPTIONS: {
  value: OrderStatus | "";
  label: string;
  dot: string;
  chip: string;
}[] = [
  { value: "", label: "All Statuses", dot: "", chip: "" },
  {
    value: "PENDING",
    label: "Pending",
    dot: "bg-[#007BFF]",
    chip: BRAND_CHIP,
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    dot: "bg-teal-500",
    chip: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
  },
  {
    value: "WAITING_FOR_STOCK",
    label: "Waiting For Stock",
    dot: "bg-rose-500",
    chip: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    dot: "bg-red-500",
    chip: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
];

const DELIVERY_STATUSES = [
  {
    value: "PENDING",
    label: "Pending",
    dot: "bg-[#007BFF]",
    chip: BRAND_CHIP,
  },
  {
    value: "NOT_SHIPPED",
    label: "Not Shipped",
    dot: "bg-slate-500",
    chip: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800",
  },
  {
    value: "IN_REVIEW",
    label: "In Review",
    dot: "bg-purple-500",
    chip: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  },
  {
    value: "COURIERASSIGNED",
    label: "Courier Assigned",
    dot: "bg-violet-500",
    chip: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
  },
  {
    value: "IN_TRANSIT",
    label: "In Transit",
    dot: "bg-blue-500",
    chip: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  {
    value: "PICKED_UP",
    label: "Picked Up",
    dot: "bg-cyan-500",
    chip: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  {
    value: "PARTIAL",
    label: "Partial Delivered",
    dot: "bg-violet-500",
    chip: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    dot: "bg-red-500",
    chip: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
  {
    value: "HOLD",
    label: "On Hold",
    dot: "bg-orange-500",
    chip: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  },
];

const TABS = [
  {
    value: "instant",
    label: "Instant Orders",
    active: "bg-[#007BFF] text-white",
  },
  {
    value: "waitingForStock",
    label: "Waiting For Stock",
    active: "bg-rose-500 text-white",
  },
  {
    value: "scheduled",
    label: "Scheduled Orders",
    active: "bg-blue-500 text-white",
  },
  { value: "hold", label: "Hold Orders", active: "bg-[#007BFF] text-white" },
] as const;

type ActiveTab = (typeof TABS)[number]["value"];

const FIELD_CLASS =
  "h-11 w-full rounded-lg border-gray-200 bg-gray-50/60 text-sm transition-colors focus:border-[#007BFF] dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-[#007BFF] sm:h-10 xl:w-44";

function formatDateLabel(from: Date | undefined, to: Date | undefined): string {
  if (!from) return "Filter by date";
  if (!to || isSameDay(from, to)) return format(from, "MMM d, yyyy");
  return `${format(from, "MMM d")} – ${format(to, "MMM d, yyyy")}`;
}

function getPresetLabel(
  from: Date | undefined,
  to: Date | undefined,
): string | null {
  if (!from || !to) return null;
  for (const p of PRESETS) {
    const r = p.get();
    if (isSameDay(r.from, from) && isSameDay(r.to, to)) return p.label;
  }
  return null;
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
  className,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-xl border border-gray-200/70 bg-white px-3 py-3 transition-colors hover:border-[#007BFF]/40 dark:border-gray-700/60 dark:bg-gray-900 sm:px-4 sm:py-3.5",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent,
        )}
      >
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-50">
          {value}
        </p>
        {sub && (
          <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function MyOrders() {
  const [localSearch, setLocalSearch] = useState("");
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [calRange, setCalRange] = useState<DateRange | undefined>(undefined);
  const [calOpen, setCalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [courierOrder, setCourierOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [timingOrder, setTimingOrder] = useState<Order | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [orderTimingOpen, setOrderTimingOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [courierOpen, setCourierOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("instant");
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabStripRef = useRef<HTMLDivElement | null>(null);

  const { data: me } = useGetMeQuery(undefined);
  const userRole = (me?.data?.role?.toUpperCase() ?? "CUSTOMER") as UserRole;

  // Keep the active tab visible when the tab strip scrolls horizontally
  useEffect(() => {
    const el = tabStripRef.current?.querySelector<HTMLElement>(
      '[aria-selected="true"]',
    );
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeTab]);

  const {
    data: instantOrdersData,
    isLoading: instantLoading,
    error: instantError,
    refetch: refetchInstant,
  } = useGetMyOrdersQuery({
    page,
    limit: LIMIT,
    ...(search.trim() && { searchTerm: search.trim() }),
    ...(orderStatus && { orderStatus }),
    ...(deliveryStatus && { deliveryStatus }),
    ...(dateFrom && {
      "updatedAt[gte]": new Date(dateFrom).toISOString(),
    }),
    ...(dateTo && {
      "updatedAt[lte]": new Date(dateTo).toISOString(),
    }),
  });

  const {
    data: waitingForStockData,
    isLoading: waitingLoading,
    error: waitingError,
    refetch: refetchWaiting,
  } = useGetMyWaitingForStockOrdersQuery({
    page,
    limit: LIMIT,
    ...(search.trim() && { searchTerm: search.trim() }),
    ...(deliveryStatus && { deliveryStatus }),
    ...(dateFrom && {
      "updatedAt[gte]": dateFrom.toISOString(),
    }),
    ...(dateTo && {
      "updatedAt[lte]": dateTo.toISOString(),
    }),
  });

  const {
    data: scheduledOrdersData,
    isLoading: scheduledLoading,
    error: scheduledError,
    refetch: refetchScheduled,
  } = useGetMyScheduledOrdersQuery({
    page,
    limit: LIMIT,
  });

  const {
    data: holdOrdersData,
    isLoading: holdLoading,
    error: holdError,
    refetch: refetchHold,
  } = useGetMyHoldOrdersQuery({
    page,
    limit: LIMIT,
  });

  const [createCourier] = useCreateCourierMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const orders: Order[] =
    activeTab === "instant"
      ? (instantOrdersData?.data as Order[]) || []
      : activeTab === "waitingForStock"
        ? waitingForStockData?.data || []
        : activeTab === "scheduled"
          ? (scheduledOrdersData?.data as Order[]) || []
          : (holdOrdersData?.data as Order[]) || [];

  const meta =
    activeTab === "instant"
      ? instantOrdersData?.meta
      : activeTab === "waitingForStock"
        ? waitingForStockData?.meta
        : activeTab === "scheduled"
          ? scheduledOrdersData?.meta
          : holdOrdersData?.meta;

  const isLoading =
    activeTab === "instant"
      ? instantLoading
      : activeTab === "waitingForStock"
        ? waitingLoading
        : activeTab === "scheduled"
          ? scheduledLoading
          : holdLoading;

  const error =
    activeTab === "instant"
      ? instantError
      : activeTab === "waitingForStock"
        ? waitingError
        : activeTab === "scheduled"
          ? scheduledError
          : holdError;

  const refetch =
    activeTab === "instant"
      ? refetchInstant
      : activeTab === "waitingForStock"
        ? refetchWaiting
        : activeTab === "scheduled"
          ? refetchScheduled
          : refetchHold;

  const stats = instantOrdersData?.stats;

  const totalCount = meta?.total ?? 0;
  const totalPages = meta?.totalPage ?? Math.ceil(totalCount / LIMIT);
  const pendingCount = stats?.PENDING ?? 0;
  const confirmedCount = stats?.CONFIRMED ?? 0;
  const completedCount = stats?.COMPLETED ?? 0;

  const waitingForStockCount = waitingForStockData?.meta?.total ?? 0;

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  const clearSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLocalSearch("");
    setSearch("");
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setOrderStatus(val === "all" ? "" : (val as OrderStatus));
    setPage(1);
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    const { from, to } = preset.get();
    setCalRange({ from, to });
    setDateFrom(from);
    setDateTo(to);
    setPage(1);
    setCalOpen(false);
  };

  const handleDeleteOrder = async () => {
    if (!deleteTarget) return;

    try {
      await deleteOrder(deleteTarget._id as string).unwrap();
      toast.success("Order deleted successfully");
      setDeleteOpen(false);
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const handleDeliveryStatusChange = (val: string) => {
    setDeliveryStatus(val);
    setPage(1);
  };

  const handleCalSelect = (range: DateRange | undefined) => {
    setCalRange(range);
    if (range?.from && range?.to) {
      setDateFrom(startOfDay(range.from));
      setDateTo(endOfDay(range.to));
      setPage(1);
    } else if (range?.from && !range?.to) {
      // single day
      setDateFrom(startOfDay(range.from));
      setDateTo(endOfDay(range.from));
      setPage(1);
    } else {
      setDateFrom(undefined);
      setDateTo(undefined);
    }
  };

  const clearDate = () => {
    setCalRange(undefined);
    setDateFrom(undefined);
    setDateTo(undefined);
    setPage(1);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLocalSearch("");
    setSearch("");
    setOrderStatus("");
    setDeliveryStatus("");
    setCalRange(undefined);
    setDateFrom(undefined);
    setDateTo(undefined);
    setPage(1);
  };

  const handleView = (order: Order) => {
    setViewOrder(order);
    setDetailOpen(true);
  };
  const handleEdit = (order: Order) => {
    setEditOrder(order);
    setEditOpen(true);
  };

  const handleOrderTiming = (order: Order) => {
    setTimingOrder(order);
    setOrderTimingOpen(true);
  };

  const handleAssignCourier = (order: Order) => {
    setCourierOrder(order);
    setCourierOpen(true);
  };

  const handleCourierSubmit = async () => {
    if (!courierOrder) return;
    try {
      await createCourier({
        courierName: courierOrder.courierName as CourierProvider,
        orderId: courierOrder._id,
      }).unwrap();
      toast.success("Courier assigned successfully");
      setCourierOpen(false);
      setCourierOrder(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to assign courier");
    }
  };

  const selectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  // Roving keyboard support for the tab strip (Arrow keys / Home / End)
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = TABS.findIndex((t) => t.value === activeTab);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft")
      next = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    selectTab(TABS[next].value);
    tabStripRef.current
      ?.querySelector<HTMLElement>(`#my-orders-tab-${TABS[next].value}`)
      ?.focus();
  };

  const hasFilters =
    !!search || !!orderStatus || !!dateFrom || !!deliveryStatus;
  const activeStatus = STATUS_OPTIONS.find((s) => s.value === orderStatus);
  const activeDeliveryStatus = DELIVERY_STATUSES.find(
    (s) => s.value === deliveryStatus,
  );
  const activeDateLabel = getPresetLabel(dateFrom, dateTo);
  const dateChipLabel = dateFrom
    ? (activeDateLabel ?? formatDateLabel(dateFrom, dateTo))
    : null;

  return (
    <div className="min-h-screen w-full max-w-full space-y-4 overflow-x-clip bg-background p-3 sm:space-y-6 sm:p-4 md:p-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-2xl md:text-3xl">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Orders assigned to you — view, edit billing, and manage delivery
          </p>
        </div>
        <div
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#007BFF] dark:bg-[#007BFF]/20 sm:flex"
          aria-hidden="true"
        >
          <ShoppingBag className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        <StatCard
          label="Total"
          value={stats?.total ?? 0}
          icon={ShoppingBag}
          accent="bg-[#007BFF] text-white dark:bg-[#007BFF]/20"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          icon={Clock}
          accent="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
          sub="awaiting confirmation"
        />
        <StatCard
          label="Confirmed"
          value={confirmedCount}
          icon={TrendingUp}
          accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          icon={CheckCircle2}
          accent="bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
        />
        <StatCard
          label="Waiting Stock"
          value={waitingForStockCount}
          icon={PackageSearch}
          accent="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
          sub="stock pending"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* ── Filters ── */}
      <div className="space-y-3 rounded-xl border border-gray-200/80 bg-white p-3 dark:border-gray-700/60 dark:bg-gray-900 sm:p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
          {/* Search */}
          <div className="relative sm:col-span-2 xl:min-w-64 xl:flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label="Search orders"
              placeholder="Search by order ID, customer name or email…"
              value={localSearch}
              onChange={handleSearchInput}
              className="h-11 w-full rounded-lg border-gray-200 bg-gray-50/60 pl-9 pr-9 text-sm transition-colors focus:border-[#007BFF] dark:border-gray-700 dark:bg-gray-800/60 dark:focus:border-[#007BFF] sm:h-10 [&::-webkit-search-cancel-button]:hidden"
            />
            {localSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BFF] dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Order status */}
          <Select
            value={orderStatus || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className={FIELD_CLASS} aria-label="Order status">
              <SlidersHorizontal
                className="h-4 w-4 shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="cursor-pointer text-sm">
                All Statuses
              </SelectItem>
              {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
                <SelectItem
                  key={s.value}
                  value={s.value}
                  className="cursor-pointer text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", s.dot)} />
                    {s.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Delivery status */}
          <Select
            value={deliveryStatus || "all"}
            onValueChange={(val) =>
              handleDeliveryStatusChange(val === "all" ? "" : val)
            }
          >
            <SelectTrigger className={FIELD_CLASS} aria-label="Delivery status">
              <SelectValue placeholder="Delivery Status" />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="cursor-pointer text-sm">
                All Deliveries
              </SelectItem>

              {DELIVERY_STATUSES.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className="cursor-pointer text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", status.dot)} />
                    {status.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ── Date picker ── */}
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Filter by date"
                className={cn(
                  "group inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg border px-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BFF] focus-visible:ring-offset-2 sm:h-10 xl:w-auto",
                  dateFrom
                    ? "border-[#007BFF] bg-[#007BFF] text-white dark:bg-[#007BFF]/20"
                    : "border-gray-200 bg-gray-50/60 text-gray-600 hover:border-[#007BFF]/40 hover:bg-[#007BFF]/10 hover:text-[#007BFF] dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400 dark:hover:text-[#4DA3FF]",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {dateFrom ? (
                    <CalendarRange
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <CalendarDays
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate xl:max-w-40">
                    {dateFrom
                      ? formatDateLabel(dateFrom, dateTo)
                      : "Filter by date"}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                    calOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              side="bottom"
              collisionPadding={12}
              className="max-h-[80vh] w-[calc(100vw-1.5rem)] max-w-sm overflow-y-auto rounded-2xl border-[#007BFF]/20 p-0 shadow-xl sm:w-auto sm:max-w-none"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Presets */}
                <div className="border-b border-gray-200 p-3 dark:border-gray-700 sm:w-36 sm:border-b-0 sm:border-r">
                  <p className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#007BFF]/70">
                    Quick select
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:block sm:space-y-0.5">
                    {PRESETS.map((preset) => {
                      const r = preset.get();
                      const isActive =
                        dateFrom &&
                        dateTo &&
                        isSameDay(r.from, dateFrom) &&
                        isSameDay(r.to, dateTo);

                      return (
                        <button
                          type="button"
                          key={preset.label}
                          onClick={() => applyPreset(preset)}
                          aria-pressed={!!isActive}
                          className={cn(
                            "rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BFF] sm:w-full sm:py-1.5",
                            isActive
                              ? "bg-[#007BFF] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-[#007BFF] hover:text-white dark:bg-gray-800 dark:text-gray-300 sm:bg-transparent sm:text-gray-600 sm:dark:bg-transparent sm:dark:text-gray-400",
                          )}
                        >
                          {preset.label}
                        </button>
                      );
                    })}

                    {dateFrom && (
                      <button
                        type="button"
                        onClick={() => {
                          clearDate();
                          setCalOpen(false);
                        }}
                        className="rounded-lg px-2.5 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:text-red-400 dark:hover:bg-red-900/20 sm:mt-1.5 sm:w-full sm:py-1.5"
                      >
                        Clear date
                      </button>
                    )}
                  </div>
                </div>

                {/* Calendar */}
                <div className="p-3">
                  <p className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#007BFF]/70">
                    Custom range
                  </p>
                  <div className="flex justify-center">
                    <Calendar
                      mode="range"
                      selected={calRange}
                      onSelect={handleCalSelect}
                      numberOfMonths={1}
                      disabled={{ after: new Date() }}
                      initialFocus
                      className="rounded-xl"
                      classNames={{
                        day_selected:
                          "bg-[#007BFF] text-white hover:bg-[#007BFF] focus:bg-[#007BFF] dark:bg-[#007BFF]",
                        day_range_middle:
                          "bg-[#007BFF]/15 text-[#007BFF] dark:bg-[#007BFF]/25 dark:text-[#4DA3FF]",
                        day_range_start:
                          "bg-[#007BFF] text-white rounded-l-full dark:bg-[#007BFF]",
                        day_range_end:
                          "bg-[#007BFF] text-white rounded-r-full dark:bg-[#007BFF]",
                        day_today:
                          "border border-[#007BFF] text-[#007BFF] font-bold dark:text-[#4DA3FF]",
                      }}
                    />
                  </div>
                  {calRange?.from && !calRange?.to && (
                    <p className="mt-2 px-1 text-[11px] text-gray-500 dark:text-gray-400">
                      Click another date to complete the range.
                    </p>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Reset */}
          {hasFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-11 w-full gap-1.5 rounded-lg border-gray-200 text-gray-600 transition-colors hover:border-[#007BFF]/50 hover:text-[#007BFF] dark:border-gray-700 dark:text-gray-400 dark:hover:border-[#007BFF] dark:hover:text-[#4DA3FF] sm:h-10 xl:w-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset all
            </Button>
          )}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {totalCount} result{totalCount !== 1 ? "s" : ""} matching filters
            </span>

            {/* Search chip */}
            {search && (
              <Badge
                variant="outline"
                className="flex max-w-full items-center gap-1 rounded-full border-[#007BFF] bg-[#007BFF] px-2.5 py-0.5 text-xs font-medium text-white dark:bg-[#007BFF]/30"
              >
                <Search className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">&quot;{search}&quot;</span>
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Remove search filter"
                  className="ml-0.5 shrink-0 rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Status chip */}
            {activeStatus?.value && (
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  activeStatus.chip,
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", activeStatus.dot)}
                />
                {activeStatus.label}
                <button
                  type="button"
                  onClick={() => handleStatusChange("all")}
                  aria-label="Remove order status filter"
                  className="ml-0.5 rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BFF]"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {activeDeliveryStatus && (
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  activeDeliveryStatus.chip,
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    activeDeliveryStatus.dot,
                  )}
                />
                {activeDeliveryStatus.label}
                <button
                  type="button"
                  onClick={() => handleDeliveryStatusChange("")}
                  aria-label="Remove delivery status filter"
                  className="ml-0.5 rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BFF]"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Date chip */}
            {dateChipLabel && (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 rounded-full border-[#007BFF] bg-[#007BFF] px-2.5 py-0.5 text-xs font-semibold text-white dark:bg-[#007BFF]/30"
              >
                <CalendarDays className="h-3 w-3" aria-hidden="true" />
                {dateChipLabel}
                <button
                  type="button"
                  onClick={clearDate}
                  aria-label="Remove date filter"
                  className="ml-0.5 rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* ── Tabs (scrollable on small screens, wraps on md+) ── */}
      <div className="-mx-3 border-b border-gray-200 dark:border-gray-700 sm:-mx-4 md:mx-0">
        <div
          ref={tabStripRef}
          role="tablist"
          aria-label="Order categories"
          onKeyDown={handleTabKeyDown}
          className="flex snap-x gap-2 overflow-x-auto px-3 pb-2 [scrollbar-width:none] sm:px-4 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                id={`my-orders-tab-${tab.value}`}
                aria-selected={isActive}
                aria-controls="my-orders-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(tab.value)}
                className={cn(
                  "shrink-0 snap-start whitespace-nowrap rounded-md px-3.5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BFF] focus-visible:ring-offset-2 sm:py-2",
                  isActive
                    ? tab.active
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table ── */}
      <div
        id="my-orders-panel"
        role="tabpanel"
        aria-labelledby={`my-orders-tab-${activeTab}`}
        className="w-full max-w-full overflow-x-auto"
      >
        <MyOrdersTable
          orders={orders}
          loading={isLoading}
          error={error ? "Failed to load orders" : null}
          userRole={userRole}
          onView={handleView}
          onEdit={handleEdit}
          onOrderTiming={handleOrderTiming}
          onAssignCourier={handleAssignCourier}
          refetch={refetch}
          setDeleteTarget={setDeleteTarget}
          setDeleteOpen={setDeleteOpen}
        />
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <nav aria-label="Orders pagination" className="flex justify-center">
          <Pagination>
            <PaginationContent className="flex-wrap justify-center gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                  aria-disabled={page === 1}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:text-[#007BFF]"
                  }
                />
              </PaginationItem>

              {/* Compact indicator on phones */}
              <PaginationItem className="sm:hidden">
                <span
                  className="px-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  aria-live="polite"
                >
                  {page} / {totalPages}
                </span>
              </PaginationItem>

              {/* Numbered pages from sm up */}
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;
                return (
                  <PaginationItem key={pageNum} className="hidden sm:block">
                    <PaginationLink
                      onClick={() => setPage(pageNum)}
                      isActive={page === pageNum}
                      className={cn(
                        "cursor-pointer",
                        page === pageNum &&
                          "border-[#007BFF] bg-[#007BFF] text-white dark:border-[#007BFF] dark:bg-[#007BFF]/20",
                      )}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage(page + 1)}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer hover:text-[#007BFF]"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </nav>
      )}

      {/* ── Modals ── */}
      <MyOrderDetailModal
        open={detailOpen}
        order={viewOrder}
        userRole={userRole}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setViewOrder(null);
        }}
        onEdit={() => {
          if (viewOrder) {
            setEditOrder(viewOrder);
            setEditOpen(true);
          }
        }}
      />

      {/* order time change */}
      <OrderModeChangeModal
        open={orderTimingOpen}
        order={timingOrder}
        onOpenChange={setOrderTimingOpen}
        onSuccess={refetch}
      />

      <MyOrderEditModal
        open={editOpen}
        order={editOrder}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditOrder(null);
        }}
        onSuccess={refetch}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-[calc(100%-1.5rem)] rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              className="bg-red-600 hover:cursor-pointer hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AssignCourierModal
        open={courierOpen}
        onClose={() => {
          setCourierOpen(false);
          setCourierOrder(null);
        }}
        onSubmit={handleCourierSubmit}
      />
    </div>
  );
}
