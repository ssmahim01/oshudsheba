import AuthLayout from "./AuthLayout";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout variant="login">
      <LoginForm />
    </AuthLayout>
  );
}
