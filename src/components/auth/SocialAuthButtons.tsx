"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SocialProvider = "Google" | "Apple";

interface SocialAuthButtonsProps {
  disabled?: boolean;
  /** Wire real OAuth here later. Until then each button shows a "coming soon" toast. */
  onSelect?: (provider: SocialProvider) => void;
}

const socialButtonClass = cn(
  "h-11 min-w-0 flex-1 cursor-pointer gap-2 rounded-xl border-slate-200 bg-white/80 px-2.5 text-[13px] font-medium text-slate-800 shadow-xs",
  "transition-all duration-200 hover:border-slate-300 hover:bg-white",
  "motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] motion-reduce:transition-none",
  "focus-visible:ring-[3px] focus-visible:ring-oshud-blue/30",
  "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
  "dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800",
);

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" focusable="false">
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

function AppleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 fill-current"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export default function SocialAuthButtons({
  disabled,
  onSelect,
}: SocialAuthButtonsProps) {
  const handleSelect = (provider: SocialProvider) => {
    if (onSelect) {
      onSelect(provider);
      return;
    }

    toast.info(`${provider} sign-in is coming soon.`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => handleSelect("Google")}
        className={socialButtonClass}
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => handleSelect("Apple")}
        className={socialButtonClass}
      >
        <AppleIcon />
        Continue with Apple
      </Button>
    </div>
  );
}
