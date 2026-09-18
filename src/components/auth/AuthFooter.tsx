import Link from "next/link";

import { AUTH_ROUTES } from "@/constants/auth";

import { authLinkClass } from "./auth-styles";

export default function AuthFooter() {
  return (
    <footer className="space-y-1.5 text-center text-xs text-slate-600 dark:text-slate-400">
      <p>© {new Date().getFullYear()} OshudSheba. All rights reserved.</p>
      <nav aria-label="Legal" className="flex items-center justify-center gap-3">
        <Link href={AUTH_ROUTES.privacy} className={authLinkClass}>
          Privacy Policy
        </Link>
        <span aria-hidden="true" className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
        <Link href={AUTH_ROUTES.terms} className={authLinkClass}>
          Terms of Service
        </Link>
      </nav>
    </footer>
  );
}
