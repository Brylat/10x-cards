import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function TopMenu() {
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleLogout = async () => {
    // Placeholder for actual logout functionality
    // This will be implemented later
    console.log("Logout clicked");
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
              className="text-base text-red-400 hover:text-red-300 hover:bg-red-950/40"
            >
              Wyloguj
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
