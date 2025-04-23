import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Niepoprawny format adresu email";
    }

    if (!password) {
      newErrors.password = "Hasło jest wymagane";
    } else if (password.length < 8) {
      newErrors.password = "Hasło musi zawierać co najmniej 8 znaków";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Hasło musi zawierać małą literę, wielką literę i cyfrę";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Potwierdź hasło";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Hasła nie są identyczne";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Handle detailed validation errors
          const newErrors: typeof errors = {};

          data.details.forEach((error: { path: string[]; message: string }) => {
            if (error.path[0] === "email") {
              newErrors.email = error.message;
            } else if (error.path[0] === "password") {
              newErrors.password = error.message;
            }
          });

          setErrors(newErrors);
        } else {
          // General error
          setErrors({
            general: data.error || "Nie udało się utworzyć konta. Spróbuj ponownie lub użyj innego adresu email.",
          });
        }
        toast.error("Błąd rejestracji");
        return;
      }

      toast.success("Konto zostało utworzone");

      // Add delay before redirect to allow toast to be visible
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // 2 seconds delay
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general: "Nie udało się utworzyć konta. Sprawdź połączenie z internetem i spróbuj ponownie.",
      });
      toast.error("Błąd rejestracji");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6 p-6">
        {errors.general && (
          <div className="bg-red-950/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-md text-sm">
            {errors.general}
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="email" className="text-gray-100 font-medium">
            Email
          </Label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 bg-white/10 border ${
              errors.email ? "border-red-500/50" : "border-gray-700"
            } rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500/20 text-gray-100 placeholder-gray-400`}
            placeholder="twój@email.com"
            disabled={isLoading}
          />
          {errors.email && <p className="text-red-300 text-sm mt-1 font-medium">{errors.email}</p>}
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-gray-100 font-medium">
            Hasło
          </Label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 bg-white/10 border ${
              errors.password ? "border-red-500/50" : "border-gray-700"
            } rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500/20 text-gray-100 placeholder-gray-400`}
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.password && <p className="text-red-300 text-sm mt-1 font-medium">{errors.password}</p>}
        </div>

        <div className="space-y-3">
          <Label htmlFor="confirmPassword" className="text-gray-100 font-medium">
            Potwierdź hasło
          </Label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-3 py-2 bg-white/10 border ${
              errors.confirmPassword ? "border-red-500/50" : "border-gray-700"
            } rounded-md focus:outline-none focus:border-blue-500 focus:ring-blue-500/20 text-gray-100 placeholder-gray-400`}
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.confirmPassword && <p className="text-red-300 text-sm mt-1 font-medium">{errors.confirmPassword}</p>}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Rejestracja...
            </>
          ) : (
            "Zarejestruj się"
          )}
        </Button>

        <p className="text-center text-gray-300 text-sm">
          Masz już konto?{" "}
          <a href="/login" className="text-blue-300 hover:text-blue-200 transition-colors font-medium">
            Zaloguj się
          </a>
        </p>
      </CardFooter>
    </form>
  );
}
