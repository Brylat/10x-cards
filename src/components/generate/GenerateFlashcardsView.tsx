import { useState } from "react";
import type { FlashcardProposalDTO, GenerationResponseDTO, RequestGenerationCommandDTO } from "../../types";
import { TextInputForm } from "./TextInputForm";
import { FlashcardReviewList } from "./FlashcardReviewList";
import { EditFlashcardModal } from "./EditFlashcardModal";
import { Button } from "../ui/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

type FlashcardWithAcceptance = FlashcardProposalDTO & {
  accepted?: boolean;
  isEdited?: boolean;
  generation_id?: string | number | null;
};

export function GenerateFlashcardsView() {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [flashcardsList, setFlashcardsList] = useState<FlashcardWithAcceptance[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<FlashcardWithAcceptance | null>(null);

  const handleTextChange = (text: string) => {
    setInputText(text);
  };

  const handleGenerateFlashcards = async () => {
    try {
      setIsGenerating(true);

      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_text: inputText,
        } as RequestGenerationCommandDTO),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate flashcards");
      }

      const data = (await response.json()) as GenerationResponseDTO;
      setFlashcardsList(
        data.flashcards_proposals.map((flashcard) => ({
          ...flashcard,
          accepted: false,
          isEdited: false,
          source: "ai-full" as const,
          generation_id: data.generation_id,
        }))
      );
      toast.success(`Generated ${data.flashcards_proposals.length} flashcards successfully`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptFlashcard = (flashcard: FlashcardWithAcceptance) => {
    setFlashcardsList((current) =>
      current.map((f) => {
        if (f.front === flashcard.front && f.back === flashcard.back) {
          const newState = { ...f, accepted: !f.accepted };
          toast.success(newState.accepted ? "Flashcard accepted" : "Flashcard unaccepted");
          return newState;
        }
        return f;
      })
    );
  };

  const handleEditFlashcard = (flashcard: FlashcardWithAcceptance) => {
    setEditingFlashcard(flashcard);
  };

  const handleSaveEdit = (editedFlashcard: FlashcardProposalDTO) => {
    setFlashcardsList((current) =>
      current.map((f) => {
        if (f.front === editingFlashcard?.front && f.back === editingFlashcard?.back) {
          return {
            ...editedFlashcard,
            source: "ai-edited" as const,
            accepted: true,
            isEdited: true,
            generation_id: f.generation_id,
          };
        }
        return f;
      })
    );
    setEditingFlashcard(null);
    toast.success("Flashcard edited and accepted");
  };

  const handleSaveAccepted = async () => {
    const acceptedFlashcards = flashcardsList.filter((f) => f.accepted);
    if (acceptedFlashcards.length === 0) {
      toast.error("Please accept at least one flashcard before saving");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          flashcards: acceptedFlashcards.map(({ accepted, isEdited, ...flashcard }) => flashcard),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save flashcards");
      }

      toast.success(`Saved ${acceptedFlashcards.length} flashcards successfully`);
      setFlashcardsList([]);
      setInputText("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save flashcards";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <TextInputForm
        value={inputText}
        onChange={handleTextChange}
        onGenerate={handleGenerateFlashcards}
        isLoading={isGenerating}
      />

      <FlashcardReviewList
        flashcards={flashcardsList}
        onAccept={handleAcceptFlashcard}
        onEdit={handleEditFlashcard}
        isLoading={isGenerating}
      />

      {flashcardsList.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleSaveAccepted} disabled={!flashcardsList.some((f) => f.accepted) || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isSaving ? "Saving..." : "Save Accepted Flashcards"}
          </Button>
        </div>
      )}

      <EditFlashcardModal
        flashcard={editingFlashcard}
        onSave={handleSaveEdit}
        onClose={() => setEditingFlashcard(null)}
      />
    </div>
  );
}
