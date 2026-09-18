import Stores from "@/components/public-view/stores/Stores";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Stores | Oshud Sheba",
  description:
    "Explore all available stores at Oshud Sheba. Discover premium products from trusted brands and categories.",
  keywords: ["stores", "brands", "Oshud Sheba", "shopping", "cosmetics"],
  openGraph: {
    title: "All Stores | Oshud Sheba",
    description:
      "Browse all stores and explore collections from trusted brands.",
    type: "website",
  },
};

export default function StoresPage() {
  return <Stores />;
}
