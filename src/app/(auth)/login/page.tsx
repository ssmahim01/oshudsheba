import type { Metadata } from "next";

import LoginPage from "@/components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Log in | OshudSheba",
  description:
    "Log in to OshudSheba to manage your orders, medicines and account.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Log in | OshudSheba",
    description:
      "Log in to OshudSheba to manage your orders, medicines and account.",
    type: "website",
  },
};

export default function Page() {
  return <LoginPage />;
}
