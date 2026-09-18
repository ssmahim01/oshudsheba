import { LeafCluster } from "./AuthIllustrations";

/** Soft gradient blobs and leaf accents behind the auth screens. Purely decorative. */
export default function AuthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-32 top-1/4 size-96 rounded-full bg-oshud-blue/10 blur-3xl dark:bg-oshud-blue/15" />
      <div className="absolute -bottom-32 right-0 size-[28rem] rounded-full bg-oshud-teal/10 blur-3xl" />

      <LeafCluster
        gradientId="auth-leaf-top"
        className="absolute -right-12 -top-16 w-44 rotate-180 opacity-60 sm:w-64 lg:w-80 dark:opacity-20"
      />
      <LeafCluster
        gradientId="auth-leaf-bottom"
        className="absolute -bottom-16 -left-10 w-44 rotate-12 opacity-50 sm:w-64 lg:w-80 dark:opacity-15"
      />
    </div>
  );
}
