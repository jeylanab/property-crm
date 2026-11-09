import { Building2 } from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md rounded-shell bg-shell p-8 md:p-10">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Building2 className="size-6" /> Propy
        </div>
        <h1 className="mt-8 text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-ink-soft">Log in to manage your properties.</p>
        <LoginForm />
      </div>
    </main>
  );
}
