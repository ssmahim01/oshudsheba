import HomePage from "@/components/public-view/home/homePage";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <Suspense fallback={null}>
        <p>Coming Soon.....</p>
        {/* <HomePage /> */}
      </Suspense>
    </div>
  );
}