import { NextRequest, NextResponse } from "next/server";

import { AUTH_ROUTES } from "@/constants/auth";
import { googleLogin } from "@/utils/googleLogin";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/login?error=Google%20authorization%20code%20is%20missing.",
        request.url,
      ),
    );
  }

  try {
    const response = await googleLogin(code);

    if (!response.success) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(
            response.message || "Google login failed.",
          )}`,
          request.url,
        ),
      );
    }

    const userData = response.user?.user;

    if (!userData) {
      return NextResponse.redirect(
        new URL(
          "/login?error=User%20information%20was%20not%20received.",
          request.url,
        ),
      );
    }

    const destination = AUTH_ROUTES.staffDashboard;

    return NextResponse.redirect(new URL(destination, request.url));
  } catch (error) {
    console.error("Google callback error:", error);

    return NextResponse.redirect(
      new URL(
        "/login?error=Unable%20to%20login%20with%20Google.%20Please%20try%20again.",
        request.url,
      ),
    );
  }
}
