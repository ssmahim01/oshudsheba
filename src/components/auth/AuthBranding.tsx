import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

import { AUTH_ROUTES } from "@/constants/auth";

import { CapsuleIllustration } from "./AuthIllustrations";

export type AuthBrandingVariant = "login" | "register";

interface BrandingContent {
  headline: { plain: string; accent: string };
  description: string;
  features: { icon: LucideIcon; title: string }[];
}

const BRANDING_CONTENT: Record<AuthBrandingVariant, BrandingContent> = {
  login: {
    headline: { plain: "Better Health", accent: "Brighter Tomorrow" },
    description:
      "Quality medicines, trusted care, healthier lives for a brighter tomorrow.",
    features: [
      { icon: ShieldCheck, title: "Trusted products" },
      { icon: Users, title: "Expert support" },
      { icon: Heart, title: "Your health, our priority" },
    ],
  },
  register: {
    headline: { plain: "Join", accent: "OshudSheba Family" },
    description:
      "Create your account and be a part of a healthier community.",
    features: [
      { icon: ShoppingCart, title: "Easy access to medicines" },
      { icon: ShieldCheck, title: "Trusted platform" },
      { icon: Users, title: "Better health for everyone" },
    ],
  },
};

function ScriptTagline() {
  return (
    <p
      aria-hidden="true"
      className="-rotate-6 text-4xl leading-tight text-oshud-teal dark:text-teal-300"
      style={{
        fontFamily:
          '"Segoe Script", "Snell Roundhand", "Brush Script MT", cursive',
      }}
    >
      <span className="block">Health</span>
      <span className="block pl-4">First</span>
      <span className="flex items-center gap-2 pl-8">
        Always
        <Heart className="size-6 fill-current" />
      </span>
    </p>
  );
}

interface AuthBrandingProps {
  variant: AuthBrandingVariant;
}

/**
 * Left-hand brand panel. On phones and tablets it collapses to just the logo
 * so the form stays above the fold; the full story shows from `lg` up.
 */
export default function AuthBranding({ variant }: AuthBrandingProps) {
  const { headline, description, features } = BRANDING_CONTENT[variant];

  return (
    <section className="flex flex-col gap-10 lg:justify-between lg:py-2">
      <Link
        href={AUTH_ROUTES.home}
        aria-label="OshudSheba home"
        className="inline-flex w-fit rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oshud-blue/50 dark:bg-white/95 dark:px-3 dark:py-2"
      >
        <Image
          src="/assets/oshudsheba.png"
          alt="OshudSheba"
          width={200}
          height={60}
          priority
          className="h-auto w-36 object-contain sm:w-44"
        />
      </Link>

      <div className="hidden space-y-8 lg:block">
        <div className="space-y-4">
          <p className="text-4xl font-extrabold leading-[1.1] tracking-tight text-oshud-navy xl:text-5xl dark:text-white">
            <span className="block">{headline.plain}</span>
            <span className="block bg-linear-to-r from-oshud-blue to-oshud-teal bg-clip-text text-transparent dark:from-sky-400 dark:to-teal-300">
              {headline.accent}
            </span>
          </p>
          <p className="max-w-sm text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        <ul className="space-y-4">
          {features.map(({ icon: Icon, title }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-oshud-green shadow-md ring-1 ring-sky-100 dark:bg-slate-800 dark:text-emerald-400 dark:ring-white/10">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="font-medium text-oshud-navy dark:text-slate-100">
                {title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden lg:block">
        {variant === "login" ? (
          <div className="flex items-end gap-4">
            <CapsuleIllustration className="w-40 shrink-0" />
            <p className="max-w-40 pb-4 text-sm font-medium leading-snug text-slate-600 dark:text-slate-300">
              Caring today for a healthier tomorrow
            </p>
          </div>
        ) : (
          <ScriptTagline />
        )}
      </div>
    </section>
  );
}
