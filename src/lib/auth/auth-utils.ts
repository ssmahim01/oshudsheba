import type { UserRole } from "@/lib/permissions";

export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "ADMIN":
      return "/staff/dashboard";

    case "MANAGER":
      return "/staff/dashboard/orders-management";

    case "MODERATOR":
    case "TELESALES":
    case "GENERALSTAFF":
      return "/staff/dashboard/my-orders";

    case "VENDOR":
      return "/staff/dashboard";

    case "PHARMACIST":
      return "/staff/dashboard";

    case "CUSTOMER":
      return "/dashboard";

    default:
      return "/login";
  }
};
