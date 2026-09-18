import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MODERATOR = "MODERATOR",
  VENDOR = "VENDOR",
  PHARMACIST = "PHARMACIST",
  GENERALSTAFF = "GENERALSTAFF",
  TELESALES = "TELESALES",
  CUSTOMER = "CUSTOMER",
}

const AUTH_ROUTES = ["/login", "/register"];

const PROTECTED_PREFIX = "/staff/dashboard";

const roleRoutes: Record<string, UserRole[]> = {
  "/staff/dashboard/admin": [UserRole.ADMIN],

  "/staff/dashboard/admin/users-management": [
    UserRole.ADMIN,
  ],

  "/staff/dashboard/admin/courier-settings": [
    UserRole.ADMIN,
  ],

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

const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "/staff/dashboard";

    case UserRole.MANAGER:
      return "/staff/dashboard/orders-management";

    case UserRole.MODERATOR:
      return "/staff/dashboard/my-orders";

    case UserRole.TELESALES:
      return "/staff/dashboard/my-orders";

    case UserRole.GENERALSTAFF:
      return "/staff/dashboard/my-orders";

    case UserRole.VENDOR:
      return "/vendor/dashboard";

    case UserRole.PHARMACIST:
      return "/pharmacist/dashboard";

    case UserRole.CUSTOMER:
      return "/dashboard";

    default:
      return "/login";
  }
};

type JwtPayload = {
  role?: UserRole | string;
  user?: {
    role?: UserRole | string;
  };
};

const verifyToken = async (
  token: string,
): Promise<JwtPayload | null> => {
  try {
    const secretValue = process.env.JWT_ACCESS_SECRET;

    if (!secretValue) {
      console.error(
        "JWT_ACCESS_SECRET is not configured.",
      );

      return null;
    }

    const secret = new TextEncoder().encode(
      secretValue,
    );

    const { payload } = await jwtVerify(
      token,
      secret,
    );

    return payload as JwtPayload;
  } catch {
    return null;
  }
};

const getUserRole = (
  payload: JwtPayload,
): UserRole | null => {
  const role = payload.role ?? payload.user?.role;

  if (!role) {
    return null;
  }

  const isValidRole = Object.values(
    UserRole,
  ).includes(role as UserRole);

  return isValidRole ? (role as UserRole) : null;
};

const isAuthRoute = (pathname: string) => {
  return AUTH_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );
};

const isProtectedRoute = (pathname: string) => {
  return (
    pathname === PROTECTED_PREFIX ||
    pathname.startsWith(`${PROTECTED_PREFIX}/`)
  );
};

const isRouteMatch = (
  pathname: string,
  route: string,
) => {
  return (
    pathname === route ||
    pathname.startsWith(`${route}/`)
  );
};

const getUnauthorizedRedirect = (
  request: NextRequest,
  role: UserRole,
) => {
  return NextResponse.redirect(
    new URL(getDashboardRoute(role), request.url),
  );
};

export async function middleware(
  request: NextRequest,
) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(
    "accessToken",
  )?.value;

  const isRootRoute = pathname === "/";
  const authRoute = isAuthRoute(pathname);
  const protectedRoute = isProtectedRoute(pathname);

  let role: UserRole | null = null;

  if (accessToken) {
    const payload = await verifyToken(accessToken);

    if (payload) {
      role = getUserRole(payload);
    }
  }

  if (isRootRoute) {
    if (!role) {
      return NextResponse.redirect(
        new URL("/login", request.url),
      );
    }

    return NextResponse.redirect(
      new URL(getDashboardRoute(role), request.url),
    );
  }

  if (authRoute) {
    if (role) {
      return NextResponse.redirect(
        new URL(getDashboardRoute(role), request.url),
      );
    }

    return NextResponse.next();
  }

  if (protectedRoute) {
    if (!accessToken || !role) {
      const loginUrl = new URL(
        "/login",
        request.url,
      );

      loginUrl.searchParams.set(
        "callbackUrl",
        `${pathname}${request.nextUrl.search}`,
      );

      return NextResponse.redirect(loginUrl);
    }

    if (pathname === PROTECTED_PREFIX) {
      const expectedDashboard = getDashboardRoute(role);

      if (expectedDashboard !== pathname) {
        return NextResponse.redirect(
          new URL(expectedDashboard, request.url),
        );
      }
    }

    // Match specific routes from the longest route first.
    const sortedRoutes = Object.keys(roleRoutes).sort(
      (a, b) => b.length - a.length,
    );

    for (const route of sortedRoutes) {
      if (!isRouteMatch(pathname, route)) {
        continue;
      }

      const allowedRoles = roleRoutes[route];

      if (!allowedRoles.includes(role)) {
        return getUnauthorizedRedirect(
          request,
          role,
        );
      }

      break;
    }

    return NextResponse.next();
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/staff/dashboard/:path*",
  ],
};