import { Metadata } from "next";
import { ReviewsPageClient } from "@/components/dashboard/reviews/ReviewsPageClient";

export const metadata: Metadata = {
  title: "Review Management | OshudSheba",
  description: "Manage customer reviews and ratings for your products",
  keywords: "reviews, ratings, customer feedback, management",
};

export default function ReviewsPage() {
  return (
    <main className="space-y-6 py-5">
      <ReviewsPageClient />
    </main>
  );
}
