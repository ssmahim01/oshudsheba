import { z } from "zod";

import { BANGLADESH_PHONE_REGEX } from "@/constants/auth";


export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Please enter your email or mobile number.")
    .refine(
      (value) => {
        const isEmail = z.string().email().safeParse(value).success;
        const isPhone = BANGLADESH_PHONE_REGEX.test(value);

        return isEmail || isPhone;
      },
      {
        message: "Enter a valid email address or Bangladesh mobile number.",
      },
    ),

  password: z
    .string()
    .min(1, "Please enter your password.")
    .min(6, "Password must be at least 6 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormValues = {
  identifier: "",
  password: "",
};


export function createRegisterSchema() {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name cannot exceed 100 characters"),

      email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address"),

      phone: z
        .string()
        .trim()
        .regex(
          BANGLADESH_PHONE_REGEX,
          "Please enter a valid Bangladesh phone number",
        ),

      address: z
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters")
        .max(500, "Address cannot exceed 500 characters"),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(128, "Password cannot exceed 128 characters."),

      confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(128, "Password cannot exceed 128 characters."),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });
      }

     
    });
}

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;

export const registerDefaultValues: RegisterFormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",

  password: "",
  confirmPassword: "",
};
