"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { authErrorClass, authFieldClass, authLabelClass } from "./auth-styles";

export interface AuthSelectOption {
  value: string;
  label: string;
}

export interface AuthSelectProps
  extends Omit<ComponentPropsWithoutRef<"select">, "id"> {
  id: string;
  label: string;
  options: readonly AuthSelectOption[];
  placeholder: string;
  icon?: LucideIcon;
  error?: string;
  /** True while nothing is selected, so the placeholder can be styled as such. */
  isPlaceholder?: boolean;
}

/** Native <select> styled like AuthInput: accessible and mobile-friendly out of the box. */
const AuthSelect = forwardRef<HTMLSelectElement, AuthSelectProps>(
  function AuthSelect(
    {
      id,
      label,
      options,
      placeholder,
      icon: Icon,
      error,
      isPlaceholder,
      className,
      ...props
    },
    ref,
  ) {
    const errorId = `${id}-error`;

    return (
      <div className="space-y-1.5">
        <Label htmlFor={id} className={authLabelClass}>
          {label}
        </Label>

        <div className="relative">
          {Icon && (
            <Icon
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
          )}

          <select
            {...props}
            ref={ref}
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              authFieldClass,
              "cursor-pointer appearance-none pr-10 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-slate-100",
              Icon && "pl-10",
              isPlaceholder && "text-slate-500 dark:text-slate-400",
              className,
            )}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500 dark:text-slate-400"
          />
        </div>

        {error && (
          <p id={errorId} role="alert" className={authErrorClass}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

export default AuthSelect;
