/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { ReturnRowActions } from "./ReturnRowActions";
import { ReturnTableSkeleton } from "./ReturnTableSkeleton";
import { ReturnEmptyState } from "./ReturnEmptyState";
import {
  getReturnStatusColor,
  getRefundStatusColor,
  getReturnStatusLabel,
  getRefundStatusLabel,
} from "@/lib/return-status-colors";

interface ReturnTableProps {
  returns: any[];
  isLoading: boolean;
  onView: (returnItem: any) => void;
  onStatusChange: (returnItem: any) => void;
  onDelete: (returnItem: any) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const ReturnTable: React.FC<ReturnTableProps> = ({
  returns,
  isLoading,
  onView,
  onStatusChange,
  onDelete,
}) => {
  if (isLoading) {
    return <ReturnTableSkeleton />;
  }

  if (!returns || returns.length === 0) {
    return <ReturnEmptyState />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200/60 bg-white shadow-sm dark:border-gray-800/60 dark:bg-slate-900/50">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-linear-to-r from-[#007BFF] to-[#0853a3] dark:from-[#007BFF] dark:to-blue-950/10">
            <th className="px-6 py-4 text-left text-xs font-semibold text-white">
              Return ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white">
              Order ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white">
              Customer Info
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-white">
              Products
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-white">
              Qty
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-white">
              Refund Amt
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-white">
              Refund Status
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-white">
              Return Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white">
              Created By
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white">
              Created Date
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {returns.map((returnItem, index) => {
            const totalQty =
              returnItem.returnedProducts?.reduce(
                (sum: number, p: any) => sum + (p.quantity || 0),
                0,
              ) || 0;
            const createdByName = returnItem.processedBy?.name || "Unknown";

            return (
              <tr
                key={returnItem._id || index}
                className="border-b border-gray-200/60 transition-all duration-300 hover:bg-gray-50/60 dark:border-gray-800/60 dark:hover:bg-slate-800/30"
              >
                {/* Return ID */}
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                    {returnItem._id?.slice(-8).toUpperCase()}
                  </span>
                </td>

                {/* Order ID */}
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    {returnItem.order?.customOrderId}
                  </span>
                </td>

                {/* Customer Info */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {returnItem.customerInfo?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {returnItem.customerInfo?.phone || "N/A"}
                    </p>
                  </div>
                </td>

                {/* Products Count */}
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#007BFF] text-sm font-semibold text-white dark:bg-[#007BFF] dark:text-white/90">
                    {returnItem.returnedProducts?.length || 0}
                  </span>
                </td>

                {/* Total Quantity */}
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {totalQty}
                  </span>
                </td>

                {/* Refund Amount */}
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ৳{(returnItem.refundAmount || 0).toFixed(2)}
                  </span>
                </td>

                {/* Refund Status */}
                <td className="px-6 py-4 text-center">
                  <Badge
                    variant="outline"
                    className={`${getRefundStatusColor(
                      returnItem.refundStatus,
                    )} whitespace-nowrap`}
                  >
                    {getRefundStatusLabel(returnItem.refundStatus)}
                  </Badge>
                </td>

                {/* Return Status */}
                <td className="px-6 py-4 text-center">
                  <Badge
                    variant="outline"
                    className={`${getReturnStatusColor(
                      returnItem.returnStatus,
                    )} whitespace-nowrap`}
                  >
                    {getReturnStatusLabel(returnItem.returnStatus)}
                  </Badge>
                </td>

                {/* Created By */}
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {createdByName}
                  </span>
                </td>

                {/* Created Date */}
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(returnItem?.createdAt)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-center">
                  <ReturnRowActions
                    returnItem={returnItem}
                    onView={() => onView(returnItem)}
                    onStatusChange={() => onStatusChange(returnItem)}
                    onDelete={() => onDelete(returnItem)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
