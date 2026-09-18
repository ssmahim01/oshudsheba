import type { RegisterFormValues } from "@/lib/validations/auth";

export function buildRegisterFormData(
  values: RegisterFormValues,
): FormData {
  const formData = new FormData();

  formData.append("name", values.name.trim());
  formData.append("email", values.email.trim().toLowerCase());
  formData.append("phone", values.phone.trim());
  formData.append("address", values.address.trim());
  formData.append("password", values.password);

  

  return formData;
}
