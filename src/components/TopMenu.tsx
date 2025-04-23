import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

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
              variant={currentPath === "/generate" ? "default" : "ghost"}
              asChild
              className={`text-base hover:text-white hover:bg-blue-900/40 focus-visible:bg-blue-900/40 focus-visible:text-white ${
                currentPath === "/generate" ? "bg-blue-800 text-white" : "text-blue-100"
              }`}
            >
              <a href="/generate">Generate Flashcards</a>
            </Button>
          </div>

          <div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-sm text-blue-200/80 hover:text-blue-100 hover:bg-blue-900/30 focus-visible:ring-blue-500/20"
            >
              <LogOut className="size-4 mr-1 opacity-70" />
              {isLoggingOut ? "Wylogowywanie..." : "Wyloguj"}
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
