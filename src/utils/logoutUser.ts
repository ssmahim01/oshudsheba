"use server";

import config from "@/config";
import { deleteCookie } from "./tokenHandlers";

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    const response = await fetch(`${config.baseUrl}/auth/logout`, {
      method: "POST",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Backend logout failed:", response.status);
    }
  } catch (error) {
    console.error("Backend logout request failed:", error);
  } finally {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
  }

  return {
    success: true,
    message: "Logged out successfully.",
  };
};