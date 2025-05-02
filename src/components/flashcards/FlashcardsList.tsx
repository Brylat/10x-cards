import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { FlashcardListItemDTO, PaginationDTO } from "../../types";
import { Loader2, Pencil, Trash2 } from "lucide-react";

interface FlashcardsResponse {
  flashcards: FlashcardListItemDTO[];
  pagination: PaginationDTO;
}

// Custom component for displaying flashcards in the list view
function ListFlashcardItem({
  flashcard,
  onEdit,
  onDelete,
}: {
  flashcard: FlashcardListItemDTO;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="h-full flex flex-col">
      <div className="p-6 flex-grow">
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
              Source:{" "}
              {flashcard.source === "ai-edited" ? "AI (Edited)" : flashcard.source === "ai-full" ? "AI" : "Manual"}
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6 mt-auto flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );
}

export function FlashcardsList() {
  const [flashcards, setFlashcards] = useState<FlashcardListItemDTO[]>([]);
  const [pagination, setPagination] = useState<PaginationDTO>({ page: 1, limit: 12, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchFlashcards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/flashcards?page=${pagination.page}&limit=${pagination.limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flashcards");
      }

      const data: FlashcardsResponse = await response.json();
      setFlashcards(data.flashcards);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      toast.error("Could not load flashcards. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [pagination.page, pagination.limit, sortBy, sortOrder]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/flashcards?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete flashcard");
      }

      // Remove the deleted flashcard from the list
      setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
      toast.success("Flashcard deleted successfully");
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      toast.error("Could not delete flashcard. Please try again.");
    }
  };

  const handleEdit = () => {
    // This would open a modal to edit the flashcard
    toast.info("Edit functionality will be implemented soon");
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    // Format is field:order
    const [field, order] = value.split(":");
    setSortBy(field);
    setSortOrder(order as "asc" | "desc");
  };

  if (isLoading && flashcards.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading flashcards...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {flashcards.length} of {pagination.total} flashcards
        </div>

        <div className="flex gap-2">
          <select
            className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={`${sortBy}:${sortOrder}`}
            onChange={handleSortChange}
          >
            <option value="created_at:desc">Newest first</option>
            <option value="created_at:asc">Oldest first</option>
            <option value="front:asc">Front (A-Z)</option>
            <option value="front:desc">Front (Z-A)</option>
          </select>
        </div>
      </div>

      {flashcards.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">You don&apos;t have any flashcards yet.</p>
          <Button asChild>
            <a href="/generate">Generate Flashcards</a>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-test-id="flashcards-list">
          {flashcards.map((flashcard) => (
            <ListFlashcardItem
              key={flashcard.id}
              flashcard={flashcard}
              onEdit={() => handleEdit()}
              onDelete={() => handleDelete(flashcard.id)}
            />
          ))}
        </div>
      )}

      {pagination.total > pagination.limit && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>

            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
