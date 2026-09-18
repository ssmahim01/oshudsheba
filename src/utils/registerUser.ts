"use server";

interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export const registerUser = async (
  formData: FormData,
): Promise<RegisterResponse> => {
  try {
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = (await response.json()) as RegisterResponse;

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Registration failed.",
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Registration successful.",
    };
  } catch (error) {
    console.error("Registration error:", error);

    return {
      success: false,
      message: "Unable to register. Please try again.",
    };
  }
};
