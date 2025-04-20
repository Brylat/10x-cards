import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function TopMenu() {
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <div className="w-full border-b bg-background">
      <div className="container mx-auto px-4 py-2">
        <nav className="flex items-center space-x-4">
          <Button variant={currentPath === "/generate" ? "secondary" : "ghost"} asChild className="text-base">
            <a href="/generate">Generate Flashcards</a>
          </Button>
        </nav>
      </div>
    </div>
  );
}
