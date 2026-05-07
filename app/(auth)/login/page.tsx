"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const user = await login(data as { username: string; password: string });
      // Redirect based on role
      switch (user.role) {
        case "doctor": router.push("/doctor"); break;
        case "nurse": router.push("/nurse"); break;
        case "pharmacist": router.push("/pharmacist"); break;
        case "admin": router.push("/admin"); break;
        case "patient": router.push("/patient"); break;
        default: router.push("/patient");
      }
    } catch {
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
