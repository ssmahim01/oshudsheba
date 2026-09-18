import AuthLayout from "./AuthLayout";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout variant="register" cardWidth="lg">
      <RegisterForm />
    </AuthLayout>
  );
}
