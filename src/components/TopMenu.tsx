import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TopMenu() {
  const [currentPath, setCurrentPath] = useState("/");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Błąd podczas wylogowywania");
      }

      toast.success("Wylogowano pomyślnie");
      // Przekieruj do strony logowania
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Nie udało się wylogować. Spróbuj ponownie.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full border-b border-gray-800 bg-gradient-to-r from-gray-900 to-blue-950 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-2 mr-6">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 text-transparent bg-clip-text">
                10x Cards
              </span>
            </a>
            <Button
              variant={currentPath === "/generate" ? "secondary" : "ghost"}
              asChild
              className="text-base text-blue-100 hover:text-white hover:bg-blue-900/40"
            >
              <a href="/generate">Generate Flashcards</a>
            </Button>
          </div>

          <div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-base text-red-400 hover:text-red-300 hover:bg-red-950/40"
            >
              {isLoggingOut ? "Wylogowywanie..." : "Wyloguj"}
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
