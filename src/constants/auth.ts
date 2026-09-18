export const BANGLADESH_PHONE_REGEX = /^(?:\+8801|01)[3-9]\d{8}$/;

export const AUTH_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  staffDashboard: "/staff/dashboard",
  terms: "/terms-of-service",
  privacy: "/privacy-policy",
} as const;

/** Roles that land on the staff dashboard after login (unchanged from the previous LoginForm). */
export const STAFF_ROLES: ReadonlySet<string> = new Set([
  "GENERALSTAFF",
  "MANAGER",
  "MODERATOR",
  "ADMIN",
  "PHARMACIST",
  "VENDOR",
  "TELESALES",
]);

/** Options for the Register role select. Trim this list to whatever the backend accepts. */
export const REGISTER_ROLE_OPTIONS = [
  { value: "GENERALSTAFF", label: "General staff" },
  { value: "MANAGER", label: "Manager" },
  { value: "MODERATOR", label: "Moderator" },
  { value: "ADMIN", label: "Admin" },
  { value: "PHARMACIST", label: "Pharmacist" },
  { value: "VENDOR", label: "Vendor" },
  { value: "TELESALES", label: "Telesales" },
] as const;

/**
 * FormData keys used for the role / salary / commission fields.
 * The previous register modal never sent these, so confirm the key names
 * against the backend and change them here (single place) if they differ.
 */
export const STAFF_FIELD_KEYS = {
  role: "role",
  salary: "salary",
  commission: "commission",
} as const;
