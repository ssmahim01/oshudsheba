/** Shared class strings so every auth control looks and behaves the same. */

export const authLabelClass =
  "text-sm font-medium text-slate-800 dark:text-slate-200";

export const authFieldClass = [
  "h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white/80 px-3.5 text-sm text-slate-900 shadow-xs",
  "placeholder:text-slate-500 dark:placeholder:text-slate-400",
  "transition-[color,box-shadow,border-color] duration-200 motion-reduce:transition-none",
  "hover:border-slate-300 focus-visible:border-blue-600 focus-visible:ring-[3px] focus-visible:ring-blue-500",
  "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 aria-invalid:focus-visible:ring-red-500/25",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:border-slate-600",
  "dark:focus-visible:border-sky-400 dark:focus-visible:ring-sky-400/30",
].join(" ");

export const authLinkClass = [
  "cursor-pointer rounded-sm font-semibold text-indigo-700",
  "transition-colors duration-200 hover:underline motion-reduce:transition-none",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700",
  "dark:text-sky-400",
].join(" ");

export const authErrorClass =
  "text-xs font-medium text-red-600 dark:text-red-400";
