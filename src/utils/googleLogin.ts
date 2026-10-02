"use server";

import { setCookie } from "./tokenHandlers";

interface GoogleLoginResponse {
  success: boolean;
  message?: string;
  data?: {
    email?: string;
    phone?: string | null;
    accessToken?: string;
    refreshToken?: string;
    user?: {
      _id: string;
      role: string;
      [key: string]: unknown;
    };
  };
}

interface GoogleLoginActionResponse {
  success: boolean;
  message?: string;
  user?: GoogleLoginResponse["data"];
}

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export const googleLogin = async (
  code: string,
): Promise<GoogleLoginActionResponse> => {
  try {
    if (!code?.trim()) {
      return {
        success: false,
        message: "Google authorization code is missing.",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback?code=${encodeURIComponent(code)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const result = (await response.json()) as GoogleLoginResponse;

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Google login failed.",
      };
    }

    const { accessToken, refreshToken } = result.data ?? {};

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
      message: result.message || "Google login successful.",
    };
  } catch (error) {
    console.error("Google login error:", error);

    return {
      success: false,
      message: "Unable to login with Google. Please try again.",
    };
  }
};