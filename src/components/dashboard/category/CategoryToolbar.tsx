"use client";

import { SearchForm } from "@/components/shared/search-form";
import CreateCategoryModal from "./CreateCategoryModal";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import CategorySort from "@/components/dashboard/category/CategorySort";
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
    <div className="my-5 flex w-full flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <SearchForm onSearchChange={onSearchChange} />

        {/* Sort */}
          <div className={"grid grid-cols-2 gap-4 items-center"}>
              <CategorySort onChange={onSortChange} />
              <DateFilter onChange={onDateChange} />
          </div>
      </div>

      {/* Create Category Modal */}
        <div className="grid w-full grid-cols-2 items-center gap-2 sm:w-auto">
            <Button
                type="button"
                variant="destructive"
                className="flex h-10 items-center justify-center gap-2 rounded-xl cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => router.push("/staff/dashboard/admin/category-management/trash")}
            >
                <Trash2 className="h-4 w-4" />
                Trash
            </Button>
            <CreateCategoryModal />
        </div>
    </div>
  );
}
