/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    useDeleteProductMutation,
    useGetAllTrashProductsQuery,
    useTrashUpdateProductMutation
} from "@/features/product";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import BreadCrumbPage from "@/components/shared/BreadCrumbPage";
import DeleteAlert from "@/components/dashboard/DeleteAlert";
import {SearchForm} from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import TablePagination from "@/components/shared/TablePagination";
import DateFilter from "@/components/shared/DateFilter";

const TrashProductsPage = () => {
    // Search + sort + pagination
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sort, setSort] = React.useState("");
    const [page, setPage] = React.useState(1);
    const limit = 10;

    const [dateRange, setDateRange] = React.useState<{
        startDate?: string;
        endDate?: string;
    }>({});



    const { data, isLoading } = useGetAllTrashProductsQuery({
        ...(searchTerm && { searchTerm }),
        ...(sort && { sort }),
        ...(dateRange.startDate && { "createdAt[gte]": dateRange.startDate }),
        ...(dateRange.endDate && { "createdAt[lte]": dateRange.endDate }),
        page,
        limit,
    });

    const trashProducts = data?.data || [];

    const [restoreProduct] = useTrashUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    // ✅ Alert states
    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"restore" | "delete">("delete");

    const openAlert = (id: string, type: "restore" | "delete") => {
        setSelectedId(id);
        setActionType(type);
        setAlertOpen(true);
    };

    const handleRestore = async () => {
        if (!selectedId) return;

        try {
            const res = await restoreProduct({ _id: selectedId }).unwrap();
            if (res.success) {
                toast.success("Product restored successfully");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Restore failed");
        } finally {
            setAlertOpen(false);
        }
    };

    // ❌ Permanent Delete
    const handleHardDelete = async () => {
        if (!selectedId) return;

        try {
            const res = await deleteProduct(selectedId).unwrap();
            if (res.success) {
                toast.success("Product permanently deleted");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Delete failed");
        } finally {
            setAlertOpen(false);
        }
    };

    return (
        <div className="min-h-full space-y-5 bg-slate-50/60 p-3 sm:p-6 dark:bg-slate-950/40">
            {/* Breadcrumb */}
            <BreadCrumbPage
                BreadcrumbTitle={"Product Management"}
                BreadCrumbLink={"/staff/dashboard/admin/product-management"}
                BreadCrumbPage={"Product Trash"}
            />

            {/* Filters */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:flex-row sm:flex-wrap sm:items-center dark:border-slate-800 dark:bg-slate-950">
                <SearchForm onSearchChange={setSearchTerm} />
                <Sort onChange={setSort} />
                <DateFilter onChange={setDateRange} />
            </div>


            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Selling Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : trashProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    No Trash Products Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            trashProducts.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell className="font-medium">
                                        {product.title}
                                    </TableCell>
                                    <TableCell>৳ {product.price}</TableCell>
                                    <TableCell>{product.availableStock && product?.availableStock>0 ? product?.availableStock : "Out of Stock"}</TableCell>
                                    <TableCell className="text-red-500">
                                        Deleted
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className={"cursor-pointer"} variant="ghost" size="icon">
                                                    <MoreHorizontal />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" className="w-44">

                                                {/* Restore */}
                                                <DropdownMenuItem
                                                    className={"cursor-pointer"}
                                                    onClick={() => openAlert(product._id as string, "restore")}
                                                >
                                                    <RotateCcw className="w-4 h-4 mr-2 text-green-500" />
                                                    Restore
                                                </DropdownMenuItem>

                                                {/* Hard Delete */}
                                                <DropdownMenuItem
                                                    className="text-red-500 focus:text-red-600 cursor-pointer"
                                                    onClick={() => openAlert(product._id as string, "delete")}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Forever
                                                </DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>


            {/*pagination*/}
            <TablePagination
                currentPage={page}
                totalPages={data?.meta?.totalPage ?? 1}
                onPageChange={setPage}
            />

            {/* ✅ Delete Alert */}
            <DeleteAlert
                open={alertOpen}
                onOpenChange={setAlertOpen}
                description={
                    actionType === "delete"
                        ? "This action will permanently delete the product. Are you sure?"
                        : "Are you sure you want to restore this product?"
                }
                onConfirm={
                    actionType === "delete" ? handleHardDelete : handleRestore
                }
                actionType={actionType}
            />
        </div>
    );
};

export default TrashProductsPage;
