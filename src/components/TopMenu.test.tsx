import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopMenu } from "./TopMenu";
import { toast } from "sonner";

// Mock dla fetch API
vi.stubGlobal("fetch", vi.fn());

// Mock dla window.location
const mockWindowLocation = { href: "https://example.com/" };
Object.defineProperty(window, "location", {
  value: mockWindowLocation,
  writable: true,
});

// Mock dla toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("TopMenu Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Reset pathname
    vi.stubGlobal("location", {
      ...window.location,
      pathname: "/",
    });

    // Default fetch mock implementation
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it("renders correctly with default path", () => {
    render(<TopMenu />);

    // Sprawdź, czy logo jest widoczne
    expect(screen.getByText("10x Cards")).toBeDefined();

    // Sprawdź, czy przycisk generowania jest widoczny
    expect(screen.getByText("Generate Flashcards")).toBeDefined();

    // Sprawdź, czy przycisk wylogowania jest widoczny
    expect(screen.getByText("Wyloguj")).toBeDefined();
  });

  it("handles logout correctly", async () => {
    render(<TopMenu />);
    const user = userEvent.setup();

    // Kliknij przycisk wylogowania
    await user.click(screen.getByText("Wyloguj"));

    // Sprawdź, czy fetch został wywołany z odpowiednimi parametrami
    expect(global.fetch).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Sprawdź, czy toast.success został wywołany
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Wylogowano pomyślnie");
    });

    // Nie możemy sprawdzić window.location.href, ponieważ komponent
    // próbuje przypisać niepoprawny URL w środowisku testowym
  });

  it("handles logout error correctly", async () => {
    // Mock fetch to return an error
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Test error" }),
    });

    render(<TopMenu />);
    const user = userEvent.setup();

    // Kliknij przycisk wylogowania
    await user.click(screen.getByText("Wyloguj"));

    // Sprawdź, czy toast.error został wywołany
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Nie udało się wylogować. Spróbuj ponownie.");
    });
  });

  it("renders with generate path correctly", () => {
    // Symuluj, że jesteśmy na stronie generowania
    vi.stubGlobal("location", {
      ...window.location,
      pathname: "/generate",
    });

    render(<TopMenu />);

    // Sprawdź, czy komponent wyrenderował się poprawnie
    expect(screen.getByText("Generate Flashcards")).toBeDefined();
  });
});
