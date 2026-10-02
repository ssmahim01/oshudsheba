"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialAuthButtonsProps {
  disabled?: boolean;
}

const socialButtonClass = cn(
  "h-11 min-w-0 flex-1 w-full cursor-pointer gap-2 rounded-xl border-slate-200 bg-white/80 px-2.5 text-[13px] font-medium text-slate-800 shadow-xs",
  "transition-all duration-200 hover:border-slate-300 hover:bg-white",
  "motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]",
  "focus-visible:ring-[3px] focus-visible:ring-oshud-blue/30",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100",
  "dark:hover:border-slate-600 dark:hover:bg-slate-800",
);

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default function SocialAuthButtons({
  disabled = false,
}: SocialAuthButtonsProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = () => {
    if (disabled || isGoogleLoading) return;

    setIsGoogleLoading(true);

    window.location.assign("/api/backend/auth/google");
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || isGoogleLoading}
      onClick={handleGoogleLogin}
      className={socialButtonClass}
    >
      {isGoogleLoading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
      ) : (
        <GoogleIcon />
      )}

      {isGoogleLoading ? "Connecting…" : "Continue with Google"}
    </Button>
  );
}
