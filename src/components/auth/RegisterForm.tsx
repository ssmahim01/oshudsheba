"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, MapPin, Phone, User } from "lucide-react";

import { AUTH_ROUTES } from "@/constants/auth";
import { useRegister } from "@/hooks/useRegister";
import {
  createRegisterSchema,
  registerDefaultValues,
  type RegisterFormValues,
} from "@/lib/validations/auth";

import AuthButton from "./AuthButton";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import { authLinkClass } from "./auth-styles";

interface RegisterFormProps {
  /** Show role, salary and commission (as in the reference design). */
  showStaffFields?: boolean;
  /** Where to send the user after a successful sign-up. */
  redirectTo?: string;
}

export default function RegisterForm({

  redirectTo,
}: RegisterFormProps) {
  const schema = useMemo(
    () => createRegisterSchema(),
    [],
  );

  const { submit, isLoading } = useRegister({
    redirectTo,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: registerDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const succeeded = await submit(values);

    if (succeeded) reset();
  };

  return (
    <AuthCard>
      <p className="mb-4 text-right text-xs text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link href={AUTH_ROUTES.login} className={authLinkClass}>
          Log in
        </Link>
      </p>

      <header className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-oshud-navy sm:text-3xl dark:text-white">
          Create your account
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Join OshudSheba today
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <AuthInput
            id="name"
            label="Full name"
            icon={User}
            autoComplete="name"
            placeholder="Enter your full name"
            disabled={isLoading}
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        <AuthInput
          id="email"
          label="Email address"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isLoading}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthInput
          id="phone"
          label="Mobile number"
          icon={Phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+8801XXXXXXXXX"
          disabled={isLoading}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <div className="sm:col-span-2">
          <AuthInput
            id="address"
            label="Address"
            icon={MapPin}
            autoComplete="street-address"
            placeholder="House no., Road, Area, City"
            disabled={isLoading}
            error={errors.address?.message}
            {...register("address")}
          />
        </div>

        <AuthInput
          id="password"
          label="Password"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          disabled={isLoading}
          error={errors.password?.message}
          {...register("password")}
        />

        <AuthInput
          id="confirmPassword"
          label="Confirm password"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          disabled={isLoading}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="mt-2 sm:col-span-2">
          <AuthButton
            type="submit"
            isLoading={isLoading}
            loadingText="Creating account…"
          >
            Create account
          </AuthButton>
        </div>

        <p className="text-center text-xs leading-relaxed text-slate-600 sm:col-span-2 dark:text-slate-400">
          By creating an account, you agree to our{" "}
          <Link href={AUTH_ROUTES.terms} className={authLinkClass}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href={AUTH_ROUTES.privacy} className={authLinkClass}>
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthCard>
  );
}
