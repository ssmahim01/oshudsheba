"use client"

import { VerificationStatus } from "@/types/productVerification";
import { Check, Clock } from "lucide-react";

interface ProductVerificationStatusBadgeProps {
  status: VerificationStatus;
}

export function ProductVerificationStatusBadge({ status }: ProductVerificationStatusBadgeProps) {
  const statusConfig = {
    PUBLISHED: {
      label: "Published",
      icon: Check,
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    DRAFT: {
      label: "Draft",
      icon: Clock,
      className: "bg-[#007BFF] text-amber-800 dark:bg-[#007BFF] dark:text-[#007BFF]",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}
