import type { FlashcardProposalDTO } from "../../types";
import { Button } from "../ui/button";
import { Check, Edit, X, History } from "lucide-react";

type FlashcardWithAcceptance = FlashcardProposalDTO & {
  accepted?: boolean;
  isEdited?: boolean;
  generation_id?: string | number | null;
};

interface FlashcardReviewListProps {
  flashcards: FlashcardWithAcceptance[];
  onAccept: (flashcard: FlashcardWithAcceptance) => void;
  onEdit: (flashcard: FlashcardWithAcceptance) => void;
  isLoading?: boolean;
}

export function FlashcardReviewList({ flashcards, onAccept, onEdit, isLoading = false }: FlashcardReviewListProps) {
  if (isLoading) {
    return <div className="text-center">Loading flashcards...</div>;
  }

  if (flashcards.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {flashcards.map((flashcard, index) => (
        <div
          key={`${flashcard.front}-${flashcard.back}-${index}`}
          className={`p-4 border rounded-lg ${flashcard.accepted ? "border-green-500 bg-green-50" : "border-gray-200"}`}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Front</h3>
                {flashcard.isEdited && (
                  <span className="inline-flex items-center text-xs text-gray-500">
                    <History className="h-3 w-3 mr-1" />
                    Edited
                  </span>
                )}
              </div>
              <p className="text-gray-700">{flashcard.front}</p>
              <h3 className="font-medium">Back</h3>
              <p className="text-gray-700">{flashcard.back}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant={flashcard.accepted ? "destructive" : "default"}
                size="icon"
                onClick={() => onAccept(flashcard)}
                title={flashcard.accepted ? "Unaccept" : "Accept"}
              >
                {flashcard.accepted ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => onEdit(flashcard)} title="Edit">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
