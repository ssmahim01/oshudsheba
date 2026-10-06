/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
  useGetAllOrdersQuery,
  useConfirmOrderMutation,
  useCompleteOrderMutation,
  useGetAllScheduledOrdersQuery,
  useDeleteOrderMutation,
  useGetAllholdOrdersQuery,
  usePartialUpdateOrderMutation,
  useExchangeOrderMutation,
  useMarkDamageMutation,
  useGetAllDamagedProductsQuery,
  useCancelOrderMutation,
  useUpdateManualDeliveryStatusMutation,
  useGetAllNoResponseOrdersQuery,
  useGetAllWaitingStockOrdersQuery,
} from "@/features/orders";
import { useCreateCourierMutation } from "@/lib/hooks";
import { OrderStats } from "./OrderStats";
import { OrderFilters, type DateFilter, type DateType } from "./OrderFilters";
import { OrderTable } from "./OrderTable";
import { ConfirmOrderModal } from "./ConfirmOrderModal";
import { CompleteOrderModal } from "./CompleteOrderModal";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { AssignCourierModal } from "./AssignCourierModal";
import type { Order, OrderStatus } from "@/types/orders";
import { toast } from "sonner";
import { ModernPagination } from "./ModernPagination";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShoppingBag, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { DamagedProductsSection } from "./DamagedProductsSection";
import { ExchangeOrderModal } from "./ExchangeOrderModal";
import { PartialUpdateOrderModal } from "./PartialUpdateOrderModal";
import { DamageOrderModal } from "./DamageOrderModal";
import { useUser } from "@/context/UserContext";
import { InvoiceDialog } from "../shared/InvoiceDialog";
import { CourierProvider } from "@/types";

// const LIMIT = 10;
type ActiveTab =
  | "instant"
  | "scheduled"
  | "hold"
  | "waiting-stock"
  | "no-response"
  | "damaged";

// Active background per tab, applied through Radix's data-state attribute
const TAB_ACTIVE_STYLES: Record<ActiveTab, string> = {
  instant:
    "data-[state=active]:bg-[#007BFF] dark:data-[state=active]:bg-[#007BFF]",
  scheduled:
    "data-[state=active]:bg-blue-500 dark:data-[state=active]:bg-blue-500",
  hold: "data-[state=active]:bg-[#007BFF] dark:data-[state=active]:bg-[#007BFF]",
  "waiting-stock":
    "data-[state=active]:bg-[#007BFF] dark:data-[state=active]:bg-[#007BFF]",
  "no-response":
    "data-[state=active]:bg-rose-500 dark:data-[state=active]:bg-rose-500",
  damaged:
    "data-[state=active]:bg-[#007BFF] dark:data-[state=active]:bg-[#007BFF]",
};

const TAB_PANEL_CLASS = "mt-2 w-full max-w-full overflow-x-auto";

export default function OrdersManagement() {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    from: undefined,
    to: undefined,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmingOrder, setConfirmingOrder] = useState<Order | null>(null);
  const [completingOrder, setCompletingOrder] = useState<Order | null>(null);
  const [partialUpdateOrder, setPartialUpdateOrder] = useState<Order | null>(
    null,
  );

  const [partialUpdateOpen, setPartialUpdateOpen] = useState(false);
  const [exchangeOrder, setExchangeOrder] = useState<Order | null>(null);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [damageOrder, setDamageOrder] = useState<Order | null>(null);
  const { user } = useUser();
  const userRole = user?.role;
  const [damageModalOpen, setDamageModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>("instant");
  const tabStripRef = useRef<HTMLDivElement | null>(null);

  const [doPartialUpdate] = usePartialUpdateOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [doExchange] = useExchangeOrderMutation();
  const [doDamage] = useMarkDamageMutation();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [courierModalOpen, setCourierModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [dateType, setDateType] = useState<DateType>("created");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const queryArgs = {
    page,
    limit,
    dateType,
    ...(debouncedSearch && { searchTerm: debouncedSearch }),
    ...(status && { orderStatus: status }),
    ...(deliveryStatus && { deliveryStatus }),
    ...(dateFilter.from && {
      "updatedAt[gte]": format(dateFilter.from, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    }),
    ...(dateFilter.to && {
      "updatedAt[lte]": format(dateFilter.to, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    }),
  };

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useGetAllOrdersQuery(queryArgs, { pollingInterval: 10000 });
  const { data: scheduledOrdersData, isLoading: isScheduledLoading } =
    useGetAllScheduledOrdersQuery(queryArgs, {
      skip: activeTab !== "scheduled",
    });

  const { data: waitingStockOrdersData, isLoading: isWaitingLoading } =
    useGetAllWaitingStockOrdersQuery({});

  const { data: noResponseOrdersData, isLoading: isNoResponseLoading } =
    useGetAllNoResponseOrdersQuery({});

  const { data: HoldOrdersData, isLoading: isHoldLoading } =
    useGetAllholdOrdersQuery(queryArgs, {
      skip: activeTab !== "hold",
    });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Keep the active tab visible when the tab strip scrolls horizontally
  useEffect(() => {
    const el = tabStripRef.current?.querySelector<HTMLElement>(
      '[data-state="active"]',
    );
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeTab]);

  const [confirmOrder, { isLoading: isConfirming, error: confirmError }] =
    useConfirmOrderMutation();
  const [updateManualDeliveryStatus] = useUpdateManualDeliveryStatusMutation();

  const [completeOrder, { isLoading: isCompleting, error: completeError }] =
    useCompleteOrderMutation();
  const [createCourier] = useCreateCourierMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const { data: damagedData, isLoading: damagedLoading } =
    useGetAllDamagedProductsQuery(undefined, {
      skip: activeTab !== "damaged",
    });

  const handleReset = () => {
    setStatus("");
    setDeliveryStatus("");
    setDateFilter({ from: undefined, to: undefined });
    setDateType("created");
    setPage(1);
  };

  const handleViewInvoice = (order: Order) => {
    setInvoiceOrder(order);
    setInvoiceModalOpen(true);
  };

  const handlePartialUpdate = (order: Order) => {
    setPartialUpdateOrder(order);
    setPartialUpdateOpen(true);
  };

  const handlePartialUpdateSubmit = async (data: any) => {
    try {
      await doPartialUpdate(data).unwrap();
      toast.success("Order updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update order");
      throw error;
    }
  };

  const handleExchange = (order: Order) => {
    setExchangeOrder(order);
    setExchangeModalOpen(true);
  };

  const handleCancelOrder = async (order: Order) => {
    try {
      await cancelOrder({
        _id: order._id,
        orderStatus: "CANCELLED",
        deliveryStatus: "CANCELLED",
      }).unwrap();

      toast.success("Order cancelled successfully");

      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel order");
    }
  };

  const handleManualDeliveryUpdate = async (order: Order) => {
    try {
      const res = await updateManualDeliveryStatus({
        id: order._id,
        deliveryStatus: "PICKED_UP",
      }).unwrap();

      if (res) {
        toast.success("Order delivered successfully");
        refetch();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  const handleExchangeSubmit = async () => {
    try {
      refetch();
      toast.success("Exchange processed successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to process exchange");
      throw error;
    }
  };

  const handleMarkDamage = (order: Order) => {
    setDamageOrder(order);
    setDamageModalOpen(true);
  };

  const handleDamageSubmit = async (data: any) => {
    try {
      await doDamage(data).unwrap();
      toast.success("Order marked as damaged");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to mark as damaged");
      throw error;
    }
  };

  const handleStatusChange = (val: OrderStatus | "") => {
    setStatus(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleDateChange = (date: DateFilter) => {
    setDateFilter(date);
    setPage(1);
  };

  const handleConfirmClick = (order: Order) => {
    setConfirmingOrder(order);
    setConfirmModalOpen(true);
  };

  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleDeliveryStatusChange = (val: string) => {
    setDeliveryStatus(val);
    setPage(1);
  };

  const handleCompleteClick = (order: Order) => {
    setCompletingOrder(order);
    setCompleteModalOpen(true);
  };

  const handleOpenCourierModal = (order: Order) => {
    setSelectedOrder(order);
    setCourierModalOpen(true);
  };

  const handleCourierSubmit = async (courierName: CourierProvider) => {
    if (!selectedOrder) return;

    try {
      const res = await createCourier({
        orderId: selectedOrder._id,
        courierName,
      }).unwrap();

      if (res.success) {
        toast.success("Courier assignment started");

        setCourierModalOpen(false);
        setSelectedOrder(null);
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          err?.error ||
          "Failed to start courier assignment",
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteOrder(deleteTarget?._id as string).unwrap();
      if (res.success) {
        toast.success(`"${deleteTarget.customOrderId}" has been deleted`);
        setDeleteOpen(false);
        setDeleteTarget(null);
        refetch();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to move to trash");
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    if (!confirmingOrder) return;
    try {
      const res = await confirmOrder({
        _id: orderId,
        orderStatus: "CONFIRMED",
      }).unwrap();
      if (res.success) {
        await refetch();
        toast.success("Order confirmed", {
          description: `Order ${confirmingOrder.customOrderId || confirmingOrder._id} has been confirmed.`,
        });
        setConfirmModalOpen(false);
        setConfirmingOrder(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to confirm order");
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    if (!completingOrder) return;
    try {
      const res = await completeOrder({
        _id: orderId,
        orderStatus: "COMPLETED",
      }).unwrap();
      if (res.success) {
        await refetch();
        toast.success("Order completed", {
          description: `Order ${completingOrder.customOrderId || completingOrder._id?.slice(0, 10)} marked as completed.`,
        });
        setCompleteModalOpen(false);
        setCompletingOrder(null);
      }
    } catch (err: any) {
      toast.error("Failed to complete order", {
        description: err?.data?.message || "Please try again.",
      });
    }
  };

  const orders =
    activeTab === "instant"
      ? (ordersData?.data as Order[]) || []
      : activeTab === "scheduled"
        ? (scheduledOrdersData?.data as Order[]) || []
        : (HoldOrdersData?.data as Order[]) || [];

  const isLoadingFinal =
    activeTab === "instant"
      ? isLoading
      : activeTab === "scheduled"
        ? isScheduledLoading
        : activeTab === "waiting-stock"
          ? isWaitingLoading
          : activeTab === "no-response"
            ? isNoResponseLoading
            : isHoldLoading;

  const meta: any =
    activeTab === "instant"
      ? ordersData?.meta
      : activeTab === "scheduled"
        ? scheduledOrdersData?.meta
        : activeTab === "waiting-stock"
          ? waitingStockOrdersData?.meta
          : activeTab === "no-response"
            ? noResponseOrdersData?.meta
            : HoldOrdersData?.meta;
  const totalCount = meta?.total ?? 0;
  const totalPages = meta?.totalPage ?? Math.ceil(totalCount / limit);

  const tabs: { value: ActiveTab; label: string; adminOnly?: boolean }[] = [
    { value: "instant", label: "Instant Orders" },
    { value: "scheduled", label: "Scheduled Orders" },
    { value: "hold", label: "Hold Orders" },
    {
      value: "waiting-stock",
      label: "Out of Stock Orders",
    },
    { value: "no-response", label: "No Response" },
    { value: "damaged", label: "Damaged Products", adminOnly: true },
  ];

  return (
    <div className="min-h-screen w-full max-w-full space-y-4 overflow-x-clip bg-background p-3 sm:space-y-6 sm:p-4 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-2xl md:text-3xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and track all customer orders and shipments
          </p>
        </div>
        <div
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#007BFF] dark:bg-[#007BFF]/20 sm:flex"
          aria-hidden="true"
        >
          <ShoppingBag className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Stats */}
      <div className="w-full max-w-full">
        <OrderStats
          stats={
            activeTab === "instant"
              ? (ordersData?.stats as any)
              : waitingStockOrdersData?.data
          }
        />
      </div>

      <OrderFilters
        statusFilter={status}
        searchFilter={searchTerm}
        dateFilter={dateFilter}
        dateType={dateType}
        deliveryStatusFilter={deliveryStatus}
        onStatusChange={handleStatusChange}
        onDateTypeChange={(t) => {
          setDateType(t);
          setPage(1);
        }}
        onDeliveryStatusChange={handleDeliveryStatusChange}
        onSearchChange={handleSearchChange}
        onDateChange={handleDateChange}
        onReset={handleReset}
        totalResults={totalCount}
      />

      <Tabs
        value={activeTab}
        onValueChange={(v: any) => {
          setActiveTab(v);
          setPage(1);
        }}
      >
        {/* Tabs header: horizontal scroll on phones/tablets, wraps on lg+ */}
        <div className="-mx-3 border-b border-gray-200 dark:border-gray-700 sm:-mx-4 md:mx-0">
          <div ref={tabStripRef}>
            <TabsList
              aria-label="Order categories"
              className="flex h-auto w-full snap-x justify-start gap-2 overflow-x-auto rounded-none bg-transparent px-3 pb-2 pt-0 [scrollbar-width:none] sm:px-4 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((tab) => {
                if (tab.adminOnly && userRole !== "ADMIN") return null;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "md:h-auto h-5 flex-none shrink-0 snap-start whitespace-nowrap rounded-md border-0 px-3.5 py-2.5 text-sm font-semibold shadow-none transition sm:py-2",
                      "text-gray-600 dark:text-gray-400",
                      "data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 dark:data-[state=inactive]:hover:bg-gray-800 dark:data-[state=inactive]:hover:text-white",
                      "data-[state=active]:text-white data-[state=active]:shadow-none dark:data-[state=active]:text-white",
                      "focus-visible:ring-2 focus-visible:ring-[#007BFF] focus-visible:ring-offset-2",
                      TAB_ACTIVE_STYLES[tab.value],
                    )}
                  >
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>

        {/* Instant Orders */}
        <TabsContent value="instant" className={TAB_PANEL_CLASS}>
          <OrderTable
            orders={(ordersData?.data as Order[]) || []}
            loading={isLoadingFinal}
            error={error ? "Failed to load orders" : null}
            onConfirmOrder={handleConfirmClick}
            refetch={refetch}
            onPartialUpdate={handlePartialUpdate}
            onViewInvoice={handleViewInvoice}
            onExchange={handleExchange}
            onCancelOrder={handleCancelOrder}
            onManualDeliveryUpdate={handleManualDeliveryUpdate}
            onMarkDamage={handleMarkDamage}
            onViewOrder={handleViewClick}
            onAssignCourier={handleOpenCourierModal}
            setDeleteTarget={setDeleteTarget}
            setDeleteOpen={setDeleteOpen}
            onCompleteOrder={handleCompleteClick}
          />
        </TabsContent>

        {/* Scheduled Orders */}
        <TabsContent value="scheduled" className={TAB_PANEL_CLASS}>
          <OrderTable
            orders={(scheduledOrdersData?.data as Order[]) || []}
            loading={isScheduledLoading}
            error={null}
            onConfirmOrder={handleConfirmClick}
            refetch={refetch}
            onViewInvoice={handleViewInvoice}
            onPartialUpdate={handlePartialUpdate}
            onExchange={handleExchange}
            onCancelOrder={handleCancelOrder}
            onMarkDamage={handleMarkDamage}
            onViewOrder={handleViewClick}
            setDeleteTarget={setDeleteTarget}
            setDeleteOpen={setDeleteOpen}
            onAssignCourier={handleOpenCourierModal}
            onCompleteOrder={handleCompleteClick}
          />
        </TabsContent>

        {/* Hold Orders */}
        <TabsContent value="hold" className={TAB_PANEL_CLASS}>
          <OrderTable
            orders={(HoldOrdersData?.data as Order[]) || []}
            loading={isHoldLoading}
            error={null}
            onConfirmOrder={handleConfirmClick}
            onViewInvoice={handleViewInvoice}
            refetch={refetch}
            onViewOrder={handleViewClick}
            onCancelOrder={handleCancelOrder}
            setDeleteTarget={setDeleteTarget}
            setDeleteOpen={setDeleteOpen}
            onAssignCourier={handleOpenCourierModal}
            onCompleteOrder={handleCompleteClick}
          />
        </TabsContent>

        <TabsContent value="waiting-stock" className={TAB_PANEL_CLASS}>
          <OrderTable
            orders={(waitingStockOrdersData?.data as Order[]) || []}
            loading={isWaitingLoading}
            error={null}
            refetch={refetch}
            onViewOrder={handleViewClick}
            onViewInvoice={handleViewInvoice}
            setDeleteTarget={setDeleteTarget}
            setDeleteOpen={setDeleteOpen}
          />
        </TabsContent>

        {/* No response section */}
        <TabsContent value="no-response" className={TAB_PANEL_CLASS}>
          <OrderTable
            orders={(noResponseOrdersData?.data as Order[]) || []}
            loading={isNoResponseLoading}
            error={null}
            onConfirmOrder={handleConfirmClick}
            onViewInvoice={handleViewInvoice}
            refetch={refetch}
            onViewOrder={handleViewClick}
            onCancelOrder={handleCancelOrder}
            setDeleteTarget={setDeleteTarget}
            setDeleteOpen={setDeleteOpen}
            onAssignCourier={handleOpenCourierModal}
            onCompleteOrder={handleCompleteClick}
          />
        </TabsContent>

        {userRole === "ADMIN" && (
          <TabsContent
            value="damaged"
            className={cn(TAB_PANEL_CLASS, "space-y-6")}
          >
            <DamagedProductsSection
              damagedProducts={damagedData?.data || []}
              isLoading={damagedLoading}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Pagination */}
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
                          "border-[#007BFF] bg-[#007BFF] text-white/95 dark:border-[#007BFF] dark:bg-[#007BFF]/20 dark:text-white/95",
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

      {/* Modals */}
      <AssignCourierModal
        open={courierModalOpen}
        onClose={() => setCourierModalOpen(false)}
        onSubmit={handleCourierSubmit}
      />

      {/* Invoice Dialog */}
      {invoiceOrder && (
        <InvoiceDialog
          open={invoiceModalOpen}
          onOpenChange={setInvoiceModalOpen}
          order={invoiceOrder}
        />
      )}

      <ConfirmOrderModal
        open={confirmModalOpen}
        order={confirmingOrder}
        loading={isConfirming}
        error={
          confirmError ? "Failed to confirm order. Please try again." : null
        }
        onConfirm={handleConfirmOrder}
        onOpenChange={(open) => {
          setConfirmModalOpen(open);
          if (!open) setConfirmingOrder(null);
        }}
      />

      <CompleteOrderModal
        open={completeModalOpen}
        order={completingOrder}
        loading={isCompleting}
        error={
          completeError ? "Failed to complete order. Please try again." : null
        }
        onComplete={handleCompleteOrder}
        onOpenChange={(open) => {
          setCompleteModalOpen(open);
          if (!open) setCompletingOrder(null);
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-[calc(100%-1.5rem)] rounded-2xl border-gray-200/80 dark:border-gray-700/60 sm:max-w-md">
          <div className="-mt-5 mb-4 h-1 w-full rounded-t-2xl bg-linear-to-r from-red-500 via-orange-400 to-red-500" />
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base font-bold">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
                <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
              </div>
              Are you delete this order?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              <span className="break-all font-semibold text-gray-700 dark:text-gray-300">
                &quot;{deleteTarget?.customOrderId}&quot;
              </span>{" "}
              will be delete. You cannot restore it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl transition-transform duration-500 ease-in-out hover:scale-105 hover:cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={confirmDelete}
              className="gap-1.5 rounded-xl bg-red-500 text-white transition-transform duration-500 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-red-600"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Deleting...
                </span>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete Order
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Partial Update Modal */}
      <PartialUpdateOrderModal
        open={partialUpdateOpen}
        onOpenChange={setPartialUpdateOpen}
        order={partialUpdateOrder}
        onSubmit={handlePartialUpdateSubmit}
      />

      {/* Exchange Modal */}
      <ExchangeOrderModal
        open={exchangeModalOpen}
        onOpenChange={setExchangeModalOpen}
        order={exchangeOrder}
        onSuccess={handleExchangeSubmit}
      />

      {/* Damage Modal */}
      {damageOrder && (
        <DamageOrderModal
          onOpenChange={setDamageModalOpen}
          open={damageModalOpen}
          order={damageOrder}
          onSubmit={handleDamageSubmit}
        />
      )}

      <OrderDetailsModal
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setSelectedOrder(null);
        }}
      />
    </div>
  );
}
