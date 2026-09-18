import type { ComponentPropsWithoutRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthButtonProps
  extends Omit<ComponentPropsWithoutRef<typeof Button>, "variant"> {
  isLoading?: boolean;
  loadingText?: string;
  showArrow?: boolean;
}

/** Primary call-to-action used by both auth forms. */
export default function AuthButton({
  isLoading = false,
  loadingText = "Please wait…",
  showArrow = true,
  disabled,
  className,
  children,
  ...props
}: AuthButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        "group h-11 w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 to-blue-700 text-sm font-semibold text-white shadow-lg shadow-indigo-700",
        "transition-all duration-200 hover:shadow-xl hover:shadow-oshud-blue/30",
        "motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] motion-reduce:transition-none",
        "focus-visible:ring-[3px] focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:scale-100",
        className,
      )}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2
            className="size-4 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          {loadingText}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {children}
          {showArrow && (
            <ArrowRight
              className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          )}
        </span>
      )}
    </Button>
  );
}
