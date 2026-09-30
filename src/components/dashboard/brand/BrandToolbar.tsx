"use client";

import { SearchForm } from "@/components/shared/search-form";
import Sort from "@/components/shared/Sort";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {useRouter} from "next/navigation";
import CreateBrandModal from "./CreateBrandModal";
import DateFilter from "@/components/shared/DateFilter";

type CategoryToolbarProps = {
  onSearchChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
    onDateChange?: (value: { startDate?: string; endDate?: string }) => void;
};

export default function CategoryToolbar({
  onSearchChange,
  onSortChange,onDateChange

}: CategoryToolbarProps) {
    const router = useRouter();
  return (
    <div className="mb-6 flex w-full flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <SearchForm onSearchChange={onSearchChange} />

        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
            {/* Sort */}
            <Sort onChange={onSortChange} />

            <DateFilter onChange={onDateChange} />
        </div>
      </div>

      {/* Create Category Modal */}
        <div className="flex items-center gap-3">
            <Button
                type="button"
                variant="destructive"
                className="h-10 rounded-xl border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10"
                onClick={() => router.push("/staff/dashboard/admin/brand-management/trash")}
            >
                <Trash2 className="h-4 w-4" />
                Trash
            </Button>

            <CreateBrandModal />
        </div>
    </div>
  );
}
