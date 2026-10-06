export const AUTH_ENDPOINTS = {
  register: "/user/register",
  login: "/auth/login",
  logout: "/auth/logout",
  me: "/user/me",
  changePassword: "/auth/change-password",
  adminChangePassword: "/auth/admin/change-password",
} as const;

export const authKeys = {
  all: ["auth"] as const,
  userInfo: () => [...authKeys.all, "user-info"] as const,
};
