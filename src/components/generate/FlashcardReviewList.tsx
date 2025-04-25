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
    return (
      <div className="text-center" data-test-id="flashcards-loading">
        Loading flashcards...
      </div>
    );
  }

  if (flashcards.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4" data-test-id="flashcards-list">
      {flashcards.map((flashcard, index) => (
        <div
          key={`${flashcard.front}-${flashcard.back}-${index}`}
          className={`p-6 border rounded-lg shadow-md ${
            flashcard.accepted ? "border-green-500/50 bg-green-950/20" : "border-gray-700 bg-white/5"
          }`}
          data-test-id={`flashcard-item-${index}`}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-grow space-y-4 w-full">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-md bg-blue-950/50 text-blue-200 border border-blue-800/30">
                    Front
                  </span>
                  {flashcard.isEdited && (
                    <span className="inline-flex items-center text-xs text-gray-400">
                      <History className="h-3 w-3 mr-1" />
                      Edited
                    </span>
                  )}
                </div>
                <div
                  className="p-3 bg-white/10 rounded-md break-words text-gray-100"
                  data-test-id={`flashcard-front-${index}`}
                >
                  {flashcard.front}
                </div>
              </div>
              <div className="space-y-2">
                <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-md bg-blue-950/50 text-blue-200 border border-blue-800/30">
                  Back
                </span>
                <div
                  className="p-3 bg-white/10 rounded-md break-words text-gray-100"
                  data-test-id={`flashcard-back-${index}`}
                >
                  {flashcard.back}
                </div>
              </div>
            </div>
            <div className="flex md:flex-col gap-2 mt-2 md:mt-0 self-start">
              <Button
                variant={flashcard.accepted ? "destructive" : "secondary"}
                size="sm"
                className={`${flashcard.accepted ? "bg-red-800/50 hover:bg-red-800/70 text-white border-red-700/50" : "bg-blue-800/30 hover:bg-blue-800/50 text-blue-100 border border-blue-700/30"}`}
                onClick={() => onAccept(flashcard)}
                title={flashcard.accepted ? "Unaccept" : "Accept"}
                data-test-id={`accept-button-${index}`}
              >
                {flashcard.accepted ? <X className="h-4 w-4 mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                <span>{flashcard.accepted ? "Unaccept" : "Accept"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-700 hover:bg-gray-800/50 text-gray-300"
                onClick={() => onEdit(flashcard)}
                title="Edit"
                data-test-id={`edit-button-${index}`}
              >
                <Edit className="h-4 w-4 mr-1" />
                <span>Edit</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
