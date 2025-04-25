import { useState } from "react";
import type { FlashcardProposalDTO } from "../../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface EditFlashcardModalProps {
  flashcard: FlashcardProposalDTO | null;
  onSave: (editedFlashcard: FlashcardProposalDTO) => void;
  onClose: () => void;
}

const MAX_FRONT_LENGTH = 200;
const MAX_BACK_LENGTH = 500;

export function EditFlashcardModal({ flashcard, onSave, onClose }: EditFlashcardModalProps) {
  const [front, setFront] = useState(flashcard?.front ?? "");
  const [back, setBack] = useState(flashcard?.back ?? "");
  const [errors, setErrors] = useState<{ front?: string; back?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { front?: string; back?: string } = {};

    if (front.length > MAX_FRONT_LENGTH) {
      newErrors.front = `Front text must not exceed ${MAX_FRONT_LENGTH} characters`;
    }

    if (back.length > MAX_BACK_LENGTH) {
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
      <DialogContent className="sm:max-w-[425px]" data-test-id="edit-flashcard-content">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="front">Front</Label>
            <Textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="resize-none"
              rows={3}
              data-test-id="edit-front-textarea"
            />
            {errors.front && (
              <p className="text-sm text-destructive" data-test-id="front-error">
                {errors.front}
              </p>
            )}
            <p className="text-sm text-muted-foreground" data-test-id="front-char-count">
              {MAX_FRONT_LENGTH - front.length} characters remaining
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="back">Back</Label>
            <Textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="resize-none"
              rows={5}
              data-test-id="edit-back-textarea"
            />
            {errors.back && (
              <p className="text-sm text-destructive" data-test-id="back-error">
                {errors.back}
              </p>
            )}
            <p className="text-sm text-muted-foreground" data-test-id="back-char-count">
              {MAX_BACK_LENGTH - back.length} characters remaining
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-test-id="cancel-edit-button">
            Cancel
          </Button>
          <Button onClick={handleSave} data-test-id="save-edit-button">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
