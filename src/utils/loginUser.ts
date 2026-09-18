"use server";

import { setCookie } from "./tokenHandlers";

export interface LoginCredentials {
  identifier: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    email?: string;
    phone?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: {
      _id: string;
      role: string;
      [key: string]: unknown;
    };
  };
}

interface LoginActionResponse {
  success: boolean;
  message?: string;
  user?: LoginResponse["data"];
}

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export const loginUser = async (
  data: LoginCredentials,
): Promise<LoginActionResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = (await response.json()) as LoginResponse;

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Invalid email/phone or password.",
      };
    }

    const setCookieHeaders = response.headers.getSetCookie();

    if (!setCookieHeaders.length) {
      return {
        success: false,
        message: "Authentication cookies were not received.",
      };
    }

    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    for (const cookieHeader of setCookieHeaders) {
      const [cookiePair] = cookieHeader.split(";");

      const separatorIndex = cookiePair.indexOf("=");

      if (separatorIndex === -1) continue;

      const cookieName = cookiePair.slice(0, separatorIndex).trim();

      const cookieValue = cookiePair.slice(separatorIndex + 1).trim();

      if (cookieName === "accessToken") {
        accessToken = cookieValue;
      }

      if (cookieName === "refreshToken") {
        refreshToken = cookieValue;
      }
    }

    if (!accessToken || !refreshToken) {
      return {
        success: false,
        message: "Authentication tokens were not received.",
      };
    }

    const isProduction = process.env.NODE_ENV === "production";

    await setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: "/",
    });

    await setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: "/",
    });

    return {
      success: true,
      user: result.data,
      message: result.message || "Login successful.",
    };
  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      message: "Unable to log in. Please try again.",
    };
  }
};
