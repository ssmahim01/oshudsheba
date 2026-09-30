/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarDays, CheckCircle2, CircleX, MoreHorizontal, Package, Tag, Trash2 } from "lucide-react";
import { useGetAllBrandsQuery, useTrashUpdateBrandMutation } from "@/redux/features/brand/brand.api";
import DashboardManagementPageSkeleton from "@/components/dashboard/DashboardManagePageSkeleton";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import TablePagination from "@/components/shared/TablePagination";
import BrandToolbar from "@/components/dashboard/brand/BrandToolbar";
import BrandDetailsModal from "@/components/dashboard/brand/BrandDetailsModal";
import UpdateBrandModal from "@/components/dashboard/brand/UpdateBrandModal";
import CreateBrandModal from "@/components/dashboard/brand/CreateBrandModal";
import { IBrand } from "@/types";

const BrandManagementPage = () => {
  const [trashBrand] = useTrashUpdateBrandMutation();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sort, setSort] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [dateRange, setDateRange] = React.useState<{ startDate?: string; endDate?: string }>({});
  const { data, isLoading, isError } = useGetAllBrandsQuery({ ...(searchTerm && { searchTerm }), ...(sort && { sort }), ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }), ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }), page, limit: 10 });
  const [selectedBrand, setSelectedBrand] = React.useState<IBrand | null>(null);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [brandToUpdate, setBrandToUpdate] = React.useState<IBrand | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const [brandToDelete, setBrandToDelete] = React.useState<IBrand | null>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  const handleDelete = async (brand: IBrand) => {
    try { const res = await trashBrand({ _id: brand._id }).unwrap(); if (res.success) toast.success("Moved to trash"); }
    catch (error: any) { toast.error(error?.data?.message || "Failed to trash brand"); }
  };

  const actions = [
    { label: "View", onClick: (brand: IBrand) => { setSelectedBrand(brand); setOpenViewModal(true); } },
    { label: "Edit", onClick: (brand: IBrand) => { setBrandToUpdate(brand); setOpenUpdateModal(true); } },
    { label: "Delete", onClick: (brand: IBrand) => { setBrandToDelete(brand); setOpenDeleteAlert(true); } },
  ];
  const brands = data?.data ?? [];
  const totalBrands = data?.meta?.total ?? brands.length;
  const activeBrands = brands.filter((brand) => brand.status === "ACTIVE").length;
  const inactiveBrands = brands.filter((brand) => brand.status !== "ACTIVE").length;
  const totalProducts = brands.reduce((sum, brand) => sum + (brand.productCount ?? 0), 0);
  const initials = (title: string) => title.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const formatDate = (brand: IBrand) => { const value = (brand as IBrand & { createdAt?: string }).createdAt; return value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"; };

  if (isLoading) return <DashboardManagementPageSkeleton />;
  if (isError) return <p className="m-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">Unable to load brands. Please try again.</p>;

  const stats = [
    { label: "Total Brands", value: totalBrands, note: "Across all products", icon: Package, card: "border-blue-100 bg-blue-50/50", iconBox: "bg-blue-100 text-blue-600" },
    { label: "Active Brands", value: activeBrands, note: `${totalBrands ? Math.round((activeBrands / totalBrands) * 100) : 0}% of total`, icon: CheckCircle2, card: "border-emerald-100 bg-emerald-50/50", iconBox: "bg-emerald-100 text-emerald-600" },
    { label: "Inactive Brands", value: inactiveBrands, note: `${totalBrands ? Math.round((inactiveBrands / totalBrands) * 100) : 0}% of total`, icon: CircleX, card: "border-red-100 bg-red-50/50", iconBox: "bg-red-100 text-red-600" },
    { label: "Total Products", value: totalProducts, note: "Under these brands", icon: Package, card: "border-violet-100 bg-violet-50/50", iconBox: "bg-violet-100 text-violet-600" },
  ];

  const renderActions = (brand: IBrand) => <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label={`Actions for ${brand.title}`}><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">{actions.map((action) => <DropdownMenuItem key={action.label} onClick={() => action.onClick(brand)}>{action.label}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>;
  const statusBadge = (brand: IBrand) => <Badge className={brand.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "bg-red-50 text-red-700 hover:bg-red-50"}>{brand.status === "ACTIVE" ? "Active" : "Inactive"}</Badge>;

  return <main className="min-h-full bg-slate-50/60 p-3 sm:p-6 lg:p-8 dark:bg-slate-950/40"><div className="mx-auto max-w-[1500px]">
    <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-4"><div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Tag /></div><div><h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">Brand Management</h1><p className="mt-1 text-sm text-muted-foreground sm:text-base">Manage product brands and organize your catalog</p></div></div><div className="flex gap-3"><Button variant="outline" className="border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10" onClick={() => window.location.assign("/staff/dashboard/admin/brand-management/trash")}><Trash2 data-icon="inline-start" /> Trash</Button><CreateBrandModal /></div></div>
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <Card key={stat.label} className={`${stat.card} shadow-none`}><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm font-medium text-muted-foreground">{stat.label}</p><p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{stat.value}</p><p className="mt-1 text-xs text-muted-foreground">{stat.note}</p></div><div className={`flex size-12 items-center justify-center rounded-xl ${stat.iconBox}`}><Icon /></div></CardContent></Card>; })}</div>
    <BrandToolbar onSearchChange={setSearchTerm} onSortChange={setSort} onDateChange={setDateRange} />
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="hidden overflow-x-auto md:block"><Table><TableHeader><TableRow className="bg-primary hover:bg-primary"><TableHead className="w-12 text-primary-foreground"><Checkbox /></TableHead><TableHead className="text-primary-foreground">Brand</TableHead><TableHead className="text-primary-foreground">Product Count</TableHead><TableHead className="text-primary-foreground">Status</TableHead><TableHead className="text-primary-foreground">Created Date</TableHead><TableHead className="text-right text-primary-foreground">Actions</TableHead></TableRow></TableHeader><TableBody>{brands.length ? brands.map((brand) => <TableRow key={brand._id} className="hover:bg-muted/40"><TableCell><Checkbox /></TableCell><TableCell><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{initials(brand.title)}</div><div><p className="font-semibold">{brand.title}</p><p className="text-xs text-muted-foreground">{brand.description || `${brand.title} brand`}</p></div></div></TableCell><TableCell><span className="font-semibold">{brand.productCount ?? 0}</span><Badge variant="secondary" className="ml-2 rounded-full bg-primary/10 text-primary">product{brand.productCount === 1 ? "" : "s"}</Badge></TableCell><TableCell>{statusBadge(brand)}</TableCell><TableCell className="text-sm text-muted-foreground"><div className="flex items-center gap-2"><CalendarDays className="size-4" />{formatDate(brand)}</div></TableCell><TableCell className="text-right">{renderActions(brand)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No brands found.</TableCell></TableRow>}</TableBody></Table></div>
      <div className="flex flex-col gap-3 p-3 md:hidden">{brands.length ? brands.map((brand) => <div key={brand._id} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{initials(brand.title)}</div><div><p className="font-semibold">{brand.title}</p><p className="text-xs text-muted-foreground">{brand.description || `${brand.title} brand`}</p></div></div>{renderActions(brand)}</div><div className="mt-4 flex items-center justify-between border-t pt-3 text-sm"><span>{brand.productCount ?? 0} products</span>{statusBadge(brand)}</div></div>) : <p className="py-10 text-center text-sm text-muted-foreground">No brands found.</p>}</div>
    </div>
    <TablePagination currentPage={page} totalPages={data?.meta?.totalPage ?? 1} onPageChange={setPage} />
    {selectedBrand && <BrandDetailsModal open={openViewModal} onOpenChange={setOpenViewModal} brand={selectedBrand} />}
    {brandToUpdate && <UpdateBrandModal open={openUpdateModal} onOpenChange={setOpenUpdateModal} brand={brandToUpdate} />}
    {brandToDelete && <DeleteAlert open={openDeleteAlert} onOpenChange={setOpenDeleteAlert} description={`Are you sure you want to delete "${brandToDelete.title}"? This action is permanent and cannot be undone.`} onConfirm={async () => { await handleDelete(brandToDelete); setOpenDeleteAlert(false); setBrandToDelete(null); }} actionType="delete" />}
  </div></main>;
};

export default BrandManagementPage;
