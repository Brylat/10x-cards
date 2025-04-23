import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Niepoprawny format adresu email";
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
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Jeśli są szczegółowe błędy walidacji
          const newErrors: typeof errors = {};

          data.details.forEach((error: { path: string[]; message: string }) => {
            if (error.path[0] === "email") {
              newErrors.email = error.message;
            }
          });

          setErrors(newErrors);
        } else {
          // Ogólny błąd
          setErrors({
            general: data.error || "Nie udało się wysłać linku do resetowania hasła. Spróbuj ponownie później.",
          });
        }
        toast.error("Błąd resetowania hasła");
        return;
      }

      setSuccess(true);
      toast.success("Link do resetowania hasła został wysłany");
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({
        general: "Nie udało się wysłać linku do resetowania hasła. Spróbuj ponownie później.",
      });
      toast.error("Błąd resetowania hasła");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="bg-green-950/20 border border-green-500/50 text-green-300 px-4 py-4 rounded-md">
          <p className="text-lg font-medium mb-2">Email został wysłany!</p>
          <p className="text-sm">
            Na adres <span className="font-medium">{email}</span> wysłaliśmy link do resetowania hasła. Sprawdź swoją
            skrzynkę odbiorczą i folder spam.
          </p>
        </div>

        <div className="mt-6 text-gray-300 text-sm">
          <p>Nie otrzymałeś maila?</p>
          <Button
            onClick={() => setSuccess(false)}
            variant="link"
            className="text-blue-300 hover:text-blue-200 transition-colors font-medium"
          >
            Spróbuj ponownie
          </Button>
        </div>

        <div className="mt-4">
          <a href="/login" className="text-blue-300 hover:text-blue-200 transition-colors text-sm font-medium">
            Wróć do logowania
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6 p-6">
        <div className="text-center mb-2">
          <p className="text-gray-300">
            Wprowadź adres email powiązany z Twoim kontem, a my wyślemy Ci link do resetowania hasła.
          </p>
        </div>

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
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Wysyłanie...
            </>
          ) : (
            "Wyślij link resetujący"
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
