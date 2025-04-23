import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Hasło jest wymagane";
    } else if (password.length < 8) {
      newErrors.password = "Hasło musi mieć co najmniej 8 znaków";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Potwierdzenie hasła jest wymagane";
    } else if (password !== confirmPassword) {
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
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Jeśli są szczegółowe błędy walidacji
          const newErrors: typeof errors = {};

          data.details.forEach((error: { path: string[]; message: string }) => {
            if (error.path[0] === "password") {
              newErrors.password = error.message;
            }
          });

          setErrors(newErrors);
        } else {
          // Ogólny błąd
          setErrors({
            general: data.error || "Nie udało się zaktualizować hasła. Spróbuj ponownie później.",
          });
        }
        toast.error("Błąd aktualizacji hasła");
        return;
      }

      setSuccess(true);
      toast.success("Hasło zostało pomyślnie zmienione");
    } catch (error) {
      console.error("Update password error:", error);
      setErrors({
        general: "Nie udało się zaktualizować hasła. Spróbuj ponownie później.",
      });
      toast.error("Błąd aktualizacji hasła");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="bg-green-950/20 border border-green-500/50 text-green-300 px-4 py-4 rounded-md">
          <p className="text-lg font-medium mb-2">Hasło zostało zmienione!</p>
          <p className="text-sm">Możesz teraz zalogować się używając nowego hasła.</p>
        </div>

        <div className="mt-4">
          <a href="/login" className="text-blue-300 hover:text-blue-200 transition-colors text-sm font-medium">
            Przejdź do logowania
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6 p-6">
        <div className="text-center mb-2">
          <p className="text-gray-300">Wprowadź i potwierdź nowe hasło.</p>
        </div>

        {errors.general && (
          <div className="bg-red-950/20 border border-red-500/50 text-red-300 px-4 py-2 rounded-md text-sm">
            {errors.general}
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="password" className="text-gray-100 font-medium">
            Nowe hasło
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
            Potwierdź nowe hasło
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
              Aktualizowanie...
            </>
          ) : (
            "Ustaw nowe hasło"
          )}
        </Button>

        <p className="text-center text-gray-300 text-sm">
          <a href="/login" className="text-blue-300 hover:text-blue-200 transition-colors font-medium">
            Wróć do logowania
          </a>
        </p>
      </CardFooter>
    </form>
  );
}
