import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenerateFlashcardsView } from "../GenerateFlashcardsView";
import { toast } from "sonner";
import type { FlashcardProposalDTO } from "../../../types";

// Define the FlashcardWithAcceptance type for testing
type FlashcardWithAcceptance = FlashcardProposalDTO & {
  accepted?: boolean;
  isEdited?: boolean;
  generation_id?: string | number | null;
};

// Mock all child components
vi.mock("../TextInputForm", () => ({
  TextInputForm: vi.fn(({ value, onChange, onGenerate, isLoading }) => (
    <div data-testid="text-input-form">
      <textarea data-testid="text-input" value={value} onChange={(e) => onChange(e.target.value)} />
      <button data-testid="generate-button" onClick={onGenerate} disabled={isLoading}>
        Generate
      </button>
    </div>
  )),
}));

vi.mock("../FlashcardReviewList", () => ({
  FlashcardReviewList: vi.fn(({ flashcards, onAccept, onEdit, isLoading }) => (
    <div data-testid="flashcard-review-list" data-loading={isLoading}>
      {flashcards.map((card: FlashcardWithAcceptance, index: number) => (
        <div key={index} data-testid={`flashcard-${index}`}>
          <span>Front: {card.front}</span>
          <span>Back: {card.back}</span>
          <button data-testid={`accept-button-${index}`} onClick={() => onAccept(card)}>
            {card.accepted ? "Unaccept" : "Accept"}
          </button>
          <button data-testid={`edit-button-${index}`} onClick={() => onEdit(card)}>
            Edit
          </button>
        </div>
      ))}
    </div>
  )),
}));

vi.mock("../EditFlashcardModal", () => ({
  EditFlashcardModal: vi.fn(
    ({ flashcard, onSave, onClose }) =>
      flashcard && (
        <div data-testid="edit-modal">
          <input data-testid="edit-front" defaultValue={flashcard.front} />
          <input data-testid="edit-back" defaultValue={flashcard.back} />
          <button
            data-testid="save-edit-button"
            onClick={() =>
              onSave({
                front: "Edited Front",
                back: "Edited Back",
                source: flashcard.source,
              })
            }
          >
            Save
          </button>
          <button data-testid="close-edit-button" onClick={onClose}>
            Close
          </button>
        </div>
      )
  ),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("GenerateFlashcardsView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Text Input and Generation", () => {
    it("should update input text on change", async () => {
      render(<GenerateFlashcardsView />);
      const inputElement = screen.getByTestId("text-input");

      await userEvent.type(inputElement, "Test input text");

      expect(inputElement).toHaveValue("Test input text");
    });

    it("should call the generation API when generate button is clicked", async () => {
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            generation_id: "123",
            flashcards_proposals: [
              { front: "Test front 1", back: "Test back 1", source: "ai-full" },
              { front: "Test front 2", back: "Test back 2", source: "ai-full" },
            ],
          }),
      });

      render(<GenerateFlashcardsView />);

      // Type some text
      await userEvent.type(screen.getByTestId("text-input"), "Sample text to generate flashcards");

      // Click generate button
      fireEvent.click(screen.getByTestId("generate-button"));

      // Check if fetch was called with correct parameters
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_text: "Sample text to generate flashcards",
          }),
        });
      });

      // Check if toast was called on success
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Generated 2 flashcards successfully");
      });

      // Check if flashcards are displayed
      await waitFor(() => {
        expect(screen.getByTestId("flashcard-0")).toBeInTheDocument();
        expect(screen.getByTestId("flashcard-1")).toBeInTheDocument();
      });
    });

    it("should show error toast when generation API fails", async () => {
      // Mock failed API response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            message: "API error occurred",
          }),
      });

      render(<GenerateFlashcardsView />);

      // Click generate button
      fireEvent.click(screen.getByTestId("generate-button"));

      // Check if toast error was called
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("API error occurred");
      });
    });
  });

  describe("Flashcard Acceptance and Editing", () => {
    beforeEach(async () => {
      // Mock successful API response for all tests in this block
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            generation_id: "123",
            flashcards_proposals: [
              { front: "Test front 1", back: "Test back 1", source: "ai-full" },
              { front: "Test front 2", back: "Test back 2", source: "ai-full" },
            ],
          }),
      });

      render(<GenerateFlashcardsView />);

      // Generate flashcards
      fireEvent.click(screen.getByTestId("generate-button"));

      // Wait for flashcards to be displayed
      await waitFor(() => {
        expect(screen.getByTestId("flashcard-0")).toBeInTheDocument();
      });
    });

    it("should toggle acceptance status when accept button is clicked", async () => {
      // Click accept button for the first flashcard
      fireEvent.click(screen.getByTestId("accept-button-0"));

      // Check if toast success was called
      expect(toast.success).toHaveBeenCalledWith("Flashcard accepted");

      // Click accept button again to unaccept
      fireEvent.click(screen.getByTestId("accept-button-0"));

      // Check if toast success was called again
      expect(toast.success).toHaveBeenCalledWith("Flashcard unaccepted");
    });

    it("should open edit modal when edit button is clicked", async () => {
      // Click edit button for the first flashcard
      fireEvent.click(screen.getByTestId("edit-button-0"));

      // Check if edit modal is displayed
      expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    });

    it("should update flashcard when edit is saved", async () => {
      // Click edit button for the first flashcard
      fireEvent.click(screen.getByTestId("edit-button-0"));

      // Click save button in edit modal
      fireEvent.click(screen.getByTestId("save-edit-button"));

      // Check if toast success was called
      expect(toast.success).toHaveBeenCalledWith("Flashcard edited and accepted");

      // Check if edit modal is closed
      expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    });

    it("should close edit modal without saving when close button is clicked", async () => {
      // Click edit button for the first flashcard
      fireEvent.click(screen.getByTestId("edit-button-0"));

      // Click close button in edit modal
      fireEvent.click(screen.getByTestId("close-edit-button"));

      // Check if edit modal is closed
      expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    });
  });

  describe("Saving Flashcards", () => {
    beforeEach(async () => {
      // Mock successful API response for flashcard generation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            generation_id: "123",
            flashcards_proposals: [
              { front: "Test front 1", back: "Test back 1", source: "ai-full" },
              { front: "Test front 2", back: "Test back 2", source: "ai-full" },
            ],
          }),
      });

      render(<GenerateFlashcardsView />);

      // Generate flashcards
      fireEvent.click(screen.getByTestId("generate-button"));

      // Wait for flashcards to be displayed
      await waitFor(() => {
        expect(screen.getByTestId("flashcard-0")).toBeInTheDocument();
      });

      // Reset mock to prepare for save API calls
      mockFetch.mockReset();
    });

    it("should show error when trying to save with no accepted flashcards", async () => {
      // W tym teście nie możemy kliknąć przycisku "Save Accepted" ponieważ jest on wyłączony
      // gdy nie ma zaakceptowanych fiszek. Zamiast tego musimy bezpośrednio sprawdzić, czy
      // przycisk jest wyłączony, co jest właściwym zachowaniem.

      // Czyścimy mocki
      vi.clearAllMocks();

      // Sprawdzamy, czy przycisk Save Accepted jest wyłączony (disabled)
      const saveButton = screen.getByText("Save Accepted Flashcards");
      expect(saveButton).toBeDisabled();

      // Sprawdzamy, że API nie zostało wywołane
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should save only accepted flashcards when save accepted button is clicked", async () => {
      // Setup API response for saving
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      // Accept the first flashcard
      fireEvent.click(screen.getByTestId("accept-button-0"));

      // Click Save Accepted button
      fireEvent.click(screen.getByText("Save Accepted Flashcards"));

      // Check if API was called with correct data
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: expect.stringContaining("Test front 1"),
        });
      });

      // Check that the request only includes the accepted flashcard
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.flashcards.length).toBe(1);
      expect(requestBody.flashcards[0].front).toBe("Test front 1");

      // Check if toast success was called
      expect(toast.success).toHaveBeenCalledWith("Saved 1 flashcards successfully");
    });

    it("should save all flashcards when save all button is clicked", async () => {
      // Setup API response for saving
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      // Click Save All button
      fireEvent.click(screen.getByText("Save All Flashcards"));

      // Check if API was called with correct data
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: expect.stringContaining("Test front 1"),
        });
      });

      // Check that the request includes all flashcards
      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.flashcards.length).toBe(2);

      // Check if toast success was called
      expect(toast.success).toHaveBeenCalledWith("Saved all 2 flashcards successfully");
    });

    it("should show error toast when saving fails", async () => {
      // Setup API response for failed saving
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            message: "Failed to save flashcards",
          }),
      });

      // Accept the first flashcard
      fireEvent.click(screen.getByTestId("accept-button-0"));

      // Click Save Accepted button
      fireEvent.click(screen.getByText("Save Accepted Flashcards"));

      // Check if toast error was called
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Failed to save flashcards");
      });
    });
  });

  describe("Edge Cases and Business Rules", () => {
    it("should disable buttons during generation process", async () => {
      // Mock a delayed API response to test loading state
      mockFetch.mockImplementationOnce(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  generation_id: "123",
                  flashcards_proposals: [],
                }),
            });
          }, 100);
        });
      });

      render(<GenerateFlashcardsView />);

      // Click generate button
      fireEvent.click(screen.getByTestId("generate-button"));

      // Check if flashcard review list has loading state
      expect(screen.getByTestId("flashcard-review-list")).toHaveAttribute("data-loading", "true");

      // Wait for generation to complete
      await waitFor(
        () => {
          expect(mockFetch).toHaveBeenCalled();
        },
        { timeout: 200 }
      );
    });

    it("should not show save buttons when flashcard list is empty", () => {
      render(<GenerateFlashcardsView />);

      // Check that save buttons are not displayed
      expect(screen.queryByText("Save Accepted Flashcards")).not.toBeInTheDocument();
      expect(screen.queryByText("Save All Flashcards")).not.toBeInTheDocument();
    });

    it("should reset input and flashcards after successful save", async () => {
      // Mock API responses
      mockFetch
        // First call for generation
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              generation_id: "123",
              flashcards_proposals: [{ front: "Test front", back: "Test back", source: "ai-full" }],
            }),
        })
        // Second call for saving
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });

      render(<GenerateFlashcardsView />);

      // Type some text
      await userEvent.type(screen.getByTestId("text-input"), "Test input");

      // Generate flashcards
      fireEvent.click(screen.getByTestId("generate-button"));

      // Wait for flashcard to be displayed
      await waitFor(() => {
        expect(screen.getByTestId("flashcard-0")).toBeInTheDocument();
      });

      // Accept flashcard
      fireEvent.click(screen.getByTestId("accept-button-0"));

      // Save accepted flashcards
      fireEvent.click(screen.getByText("Save Accepted Flashcards"));

      // Wait for save to complete
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Saved 1 flashcards successfully");
      });

      // Check that input is reset
      expect(screen.getByTestId("text-input")).toHaveValue("");

      // Check that flashcards are no longer displayed
      expect(screen.queryByTestId("flashcard-0")).not.toBeInTheDocument();
    });
  });
});
