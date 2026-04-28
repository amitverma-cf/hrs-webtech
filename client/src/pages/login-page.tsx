import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { LoginForm } from "../components/forms/login-form";

export function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const user = await login(data);
      // Redirect based on role
      switch (user.role) {
        case "doctor": navigate("/doctor"); break;
        case "nurse": navigate("/nurse"); break;
        case "pharmacist": navigate("/pharmacist"); break;
        case "admin": navigate("/admin"); break;
        default: navigate("/");
      }
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <LoginForm 
      onSubmit={handleSubmit} 
      isLoading={isLoading} 
      error={error} 
    />
  );
}
