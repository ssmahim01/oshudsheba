"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Leaf, Lock, User } from "lucide-react";

import { AUTH_ROUTES } from "@/constants/auth";
import { useLogin } from "@/hooks/useLogin";
import {
  loginDefaultValues,
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";

import AuthButton from "./AuthButton";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";
import SocialAuthButtons from "./SocialAuthButtons";
import { authLinkClass } from "./auth-styles";

interface LoginFormProps {
  forgotPasswordHref?: string;
  registerHref?: string;
}

export default function LoginForm({
  forgotPasswordHref = AUTH_ROUTES.forgotPassword,
  registerHref = AUTH_ROUTES.register,
}: LoginFormProps) {
  const { submit, isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const onSubmit = async (data: LoginFormValues) => {
    const succeeded = await submit(data);

    if (succeeded) reset();
  };

  return (
    <AuthCard>
      <header className="mb-6 space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-oshud-navy sm:text-3xl dark:text-white">
          Welcome back
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Log in to continue to OshudSheba
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <AuthInput
          id="identifier"
          label="Email or mobile number"
          icon={User}
          type="text"
          autoComplete="username"
          placeholder="Enter your email or mobile number"
          disabled={isLoading}
          error={errors.identifier?.message}
          {...register("identifier")}
        />

        <AuthInput
          id="password"
          label="Password"
          icon={Lock}
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          disabled={isLoading}
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-end">
          <Link
            href={forgotPasswordHref}
            className={`${authLinkClass} text-xs`}
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton type="submit" isLoading={isLoading} loadingText="Logging in…">
          Log in
        </AuthButton>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        or
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <SocialAuthButtons disabled={isLoading} />

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href={registerHref} className={authLinkClass}>
          Sign up
        </Link>
      </p>

      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-sky-50 p-4 dark:bg-white/5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-oshud-green shadow-sm dark:bg-slate-800 dark:text-emerald-400">
          <Leaf className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-oshud-navy dark:text-slate-100">
            Your health is our priority
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Safe. Genuine. Reliable.
          </p>
        </div>
      </div>
    </AuthCard>
  );
}
