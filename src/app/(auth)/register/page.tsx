import type { Metadata } from "next";

import RegisterPage from "@/components/auth/RegisterPage";

export const metadata: Metadata = {
  title: "Create your account | OshudSheba",
  description:
    "Join the OshudSheba family and get easy access to trusted medicines and care.",
  openGraph: {
    title: "Create your account | OshudSheba",
    description:
      "Join the OshudSheba family and get easy access to trusted medicines and care.",
    type: "website",
  },
};

export default function Page() {
  return <RegisterPage />;
}
