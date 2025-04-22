import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
      // Placeholder for actual API call
      // In real implementation, this would call the password reset endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-4 rounded-md">
          <p className="text-lg font-medium mb-2">Email został wysłany!</p>
          <p className="text-sm">
            Na adres <span className="font-medium">{email}</span> wysłaliśmy link do resetowania hasła. Sprawdź swoją
            skrzynkę odbiorczą i folder spam.
          </p>
        </div>

        <div className="mt-6 text-gray-600 text-sm">
          <p>Nie otrzymałeś maila?</p>
          <Button
            onClick={() => setSuccess(false)}
            variant="link"
            className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Spróbuj ponownie
          </Button>
        </div>

        <div className="mt-4">
          <a href="/login" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
            Wróć do logowania
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="text-center mb-2">
          <p className="text-gray-600">
            Wprowadź adres email powiązany z Twoim kontem, a my wyślemy Ci link do resetowania hasła.
          </p>
        </div>

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
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2"
          disabled={isLoading}
        >
          {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
        </Button>

        <p className="text-center text-gray-600 text-sm">
          <a href="/login" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
            Wróć do logowania
          </a>
        </p>
      </CardFooter>
    </form>
  );
}
