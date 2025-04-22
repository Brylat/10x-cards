import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Jeśli są szczegółowe błędy walidacji
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
          // Ogólny błąd
          setErrors({
            general: data.error || "Nie udało się zalogować. Sprawdź dane logowania i spróbuj ponownie.",
          });
        }
        toast.error("Błąd logowania");
        return;
      }

      toast.success("Pomyślnie zalogowano");
      // Przekierowanie po udanym logowaniu
      window.location.href = "/generate";
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: "Nie udało się zalogować. Sprawdź połączenie z internetem i spróbuj ponownie.",
      });
      toast.error("Błąd logowania");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
            {errors.general}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email
          </Label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 bg-gray-50 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400`}
            placeholder="twój@email.com"
            disabled={isLoading}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1 font-medium">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Hasło
          </Label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 bg-gray-50 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400`}
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.password && <p className="text-red-600 text-sm mt-1 font-medium">{errors.password}</p>}
        </div>

        <div className="flex justify-end">
          <a href="/reset-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">
            Zapomniałeś hasła?
          </a>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2"
          disabled={isLoading}
        >
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </Button>

        <p className="text-center text-gray-600 text-sm">
          Nie masz konta?{" "}
          <a href="/register" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
            Zarejestruj się
          </a>
        </p>
      </CardFooter>
    </form>
  );
}
