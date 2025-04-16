import type { FlashcardProposalDTO } from "../../types";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface FlashcardItemProps {
  flashcard: FlashcardProposalDTO & { accepted?: boolean };
  onAccept: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function FlashcardItem({ flashcard, onAccept, onEdit, onDelete }: FlashcardItemProps) {
  return (
    <Card className={cn(flashcard.accepted && "border-primary")}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">Front</h3>
            <p className="text-sm">{flashcard.front}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-1">Back</h3>
            <p className="text-sm">{flashcard.back}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Source: {flashcard.source === "ai-edited" ? "AI (Edited)" : "AI"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant={flashcard.accepted ? "default" : "outline"} size="sm" className="flex-1" onClick={onAccept}>
          {flashcard.accepted ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Remove
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" />
              Accept
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
