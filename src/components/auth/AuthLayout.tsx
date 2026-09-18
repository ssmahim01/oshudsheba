import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import AuthBackground from "./AuthBackground";
import AuthBranding, { type AuthBrandingVariant } from "./AuthBranding";
import AuthFooter from "./AuthFooter";

interface AuthLayoutProps {
  children: ReactNode;
  /** Which brand panel copy to show next to the form. */
  variant?: AuthBrandingVariant;
  /** `lg` gives the wider card the Register form needs. */
  cardWidth?: "md" | "lg";
}

export default function AuthLayout({
  children,
  variant = "login",
  cardWidth = "md",
}: AuthLayoutProps) {
  return (
    <main className="relative isolate min-h-dvh overflow-x-hidden bg-linear-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950">
      <AuthBackground />

      <div className="mx-auto grid min-h-dvh w-full max-w-7xl grid-cols-1 gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-10">
        <AuthBranding variant={variant} />

        <div className="flex flex-col items-center justify-center gap-6">
          <div
            className={cn(
              "w-full",
              cardWidth === "lg" ? "max-w-xl" : "max-w-md",
            )}
          >
            {children}
          </div>

          <AuthFooter />
        </div>
      </div>
    </main>
  );
}
