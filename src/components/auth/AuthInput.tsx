"use client";

import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { authErrorClass, authFieldClass, authLabelClass } from "./auth-styles";

export interface AuthInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "id"> {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  /** Adds an "(optional)" hint after the label. */
  optional?: boolean;
}

/**
 * Labelled input with a leading icon, inline error and (for type="password")
 * a built-in show/hide toggle. Works with react-hook-form's `register()`.
 */
const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput(
    {
      id,
      label,
      icon: Icon,
      error,
      optional,
      type = "text",
      className,
      disabled,
      ...props
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);

    const isPassword = type === "password";
    const errorId = `${id}-error`;

    return (
      <div className="space-y-1.5">
        <Label htmlFor={id} className={authLabelClass}>
          {label}
          {optional && (
            <span className="font-normal text-slate-500 dark:text-slate-400">
              (optional)
            </span>
          )}
        </Label>

        <div className="relative">
          {Icon && (
            <Icon
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
          )}

          <Input
            {...props}
            ref={ref}
            id={id}
            type={isPassword && visible ? "text" : type}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              authFieldClass,
              Icon && "pl-10",
              isPassword && "pr-11",
              className,
            )}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((previous) => !previous)}
              disabled={disabled}
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              aria-controls={id}
              className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-slate-500 transition-colors duration-200 hover:text-oshud-blue-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oshud-blue/40 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none dark:text-slate-400 dark:hover:text-sky-400"
            >
              {visible ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          )}
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

export default AuthInput;
