import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MODERATOR = "MODERATOR",
  GENERALSTAFF = "GENERALSTAFF",
  TELESALES = "TELESALES",
  CUSTOMER = "CUSTOMER",
}

const roleRoutes: Record<string, UserRole[]> = {
  "/staff/dashboard/admin": [UserRole.ADMIN],

  "/staff/dashboard/admin/users-management": [UserRole.ADMIN],

  "/staff/dashboard/admin/courier-settings": [UserRole.ADMIN],

  "/staff/dashboard/admin/product-management": [
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.MODERATOR,
    UserRole.TELESALES,
  ],

  "/staff/dashboard/admin/category-management": [
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.MODERATOR,
    UserRole.TELESALES,
  ],

  "/staff/dashboard/admin/brand-management": [
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.MODERATOR,
    UserRole.TELESALES,
  ],

  "/staff/dashboard/orders-management": [
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.MODERATOR,
    UserRole.TELESALES,
  ],

  "/staff/dashboard/pos": [
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.MODERATOR,
    UserRole.GENERALSTAFF,
    UserRole.TELESALES,
  ],

  "/staff/dashboard/my-orders": [
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.MODERATOR,
    UserRole.GENERALSTAFF,
    UserRole.TELESALES,
  ],
};

function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "/staff/dashboard";

    case UserRole.MANAGER:
      return "/staff/dashboard/orders-management";

    case UserRole.MODERATOR:
    case UserRole.TELESALES:
    case UserRole.GENERALSTAFF:
      return "/staff/dashboard/my-orders";

    default:
      return "/";
  }
}

function isRouteMatch(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secretValue = process.env.JWT_ACCESS_SECRET;

    if (!secretValue) {
      console.error("JWT_ACCESS_SECRET is not configured.");

      return null;
    }

    const secret = new TextEncoder().encode(secretValue);

    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch (error) {
    console.error(
      "Middleware token verification failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return null;
  }
}

function getUserRole(payload: JWTPayload): UserRole | null {
  const role =
    payload.role ?? (payload.user as { role?: string } | undefined)?.role;

  if (
    typeof role !== "string" ||
    !Object.values(UserRole).includes(role as UserRole)
  ) {
    return null;
  }

  return role as UserRole;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isRouteMatch(pathname, "/staff/dashboard")) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/?auth=login", req.url));
  }

  const payload = await verifyToken(accessToken);

  if (!payload) {
    return NextResponse.redirect(new URL("/?auth=login", req.url));
  }

  const role = getUserRole(payload);

  if (!role) {
    return NextResponse.redirect(new URL("/?auth=login", req.url));
  }

  const sortedRoutes = Object.keys(roleRoutes).sort(
    (a, b) => b.length - a.length,
  );

  for (const route of sortedRoutes) {
    if (!isRouteMatch(pathname, route)) {
      continue;
    }

    const allowedRoles = roleRoutes[route];

    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(getDashboardRoute(role), req.url));
    }

    break;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/dashboard", "/staff/dashboard/:path*"],
};
