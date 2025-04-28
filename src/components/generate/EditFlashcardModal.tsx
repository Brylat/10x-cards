import { useEffect, useState } from "react";
import type { FlashcardProposalDTO } from "../../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

interface EditFlashcardModalProps {
  flashcard: FlashcardProposalDTO | null;
  onSave: (editedFlashcard: FlashcardProposalDTO) => void;
  onClose: () => void;
}

const MAX_FRONT_LENGTH = 200;
const MAX_BACK_LENGTH = 500;

export function EditFlashcardModal({ flashcard, onSave, onClose }: EditFlashcardModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [errors, setErrors] = useState<{ front?: string; back?: string }>({});

  // Update form when flashcard changes
  useEffect(() => {
    if (flashcard) {
      setFront(flashcard.front);
      setBack(flashcard.back);
      setErrors({});
    }
  }, [flashcard]);

  const validateForm = (): boolean => {
    const newErrors: { front?: string; back?: string } = {};

    if (!front.trim()) {
      newErrors.front = "Front text cannot be empty";
    } else if (front.length > MAX_FRONT_LENGTH) {
      newErrors.front = `Front text must not exceed ${MAX_FRONT_LENGTH} characters`;
    }

    if (!back.trim()) {
      newErrors.back = "Back text cannot be empty";
    } else if (back.length > MAX_BACK_LENGTH) {
      newErrors.back = `Back text must not exceed ${MAX_BACK_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm() && flashcard) {
      onSave({
        ...flashcard,
        front,
        back,
        source: "ai-edited",
      });
    }
  };

  if (!flashcard) {
    return null;
  }

  return (
    <Dialog open={!!flashcard} onOpenChange={onClose} data-test-id="edit-flashcard-dialog">
      <DialogContent
        className="sm:max-w-[550px] bg-card border border-primary/30 shadow-lg"
        data-test-id="edit-flashcard-content"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-200 text-transparent bg-clip-text">
            Edit Flashcard
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="front" className="font-semibold text-sm text-muted-foreground">
              Front
            </Label>
            <Textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className={cn(
                "resize-none bg-background border border-blue-700/20 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary",
                errors.front && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive"
              )}
              rows={3}
              placeholder="Question or term"
              data-test-id="edit-front-textarea"
            />
            {errors.front && (
              <p className="text-sm text-destructive" data-test-id="front-error">
                {errors.front}
              </p>
            )}
            <p className="text-xs text-muted-foreground" data-test-id="front-char-count">
              {MAX_FRONT_LENGTH - front.length} characters remaining
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="back" className="font-semibold text-sm text-muted-foreground">
              Back
            </Label>
            <Textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className={cn(
                "resize-none bg-background border border-blue-700/20 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary",
                errors.back && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive"
              )}
              rows={5}
              placeholder="Answer or definition"
              data-test-id="edit-back-textarea"
            />
            {errors.back && (
              <p className="text-sm text-destructive" data-test-id="back-error">
                {errors.back}
              </p>
            )}
            <p className="text-xs text-muted-foreground" data-test-id="back-char-count">
              {MAX_BACK_LENGTH - back.length} characters remaining
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose} data-test-id="cancel-edit-button">
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="bg-blue-900 hover:bg-blue-800 text-white"
            data-test-id="save-edit-button"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
