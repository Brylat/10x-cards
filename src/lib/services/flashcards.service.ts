import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CreateFlashcardCommandDTO,
  CreateFlashcardsResponseDTO,
  FlashcardListItemDTO,
  PaginationDTO,
} from "../../types";

export class FlashcardsService {
  constructor(private readonly supabase: SupabaseClient) {}

  async createFlashcards(
    flashcards: CreateFlashcardCommandDTO[],
    userId: string
  ): Promise<CreateFlashcardsResponseDTO> {
    try {
      // Prepare flashcards for bulk insert with user_id
      const flashcardsToInsert = flashcards.map((flashcard) => ({
        ...flashcard,
        user_id: userId,
      }));

      // Perform bulk insert
      const { data: createdFlashcards, error } = await this.supabase
        .from("flashcards")
        .insert(flashcardsToInsert)
        .select("id, front, back, source, generation_id, created_at");

      if (error) {
        throw new Error(`Failed to create flashcards: ${error.message}`);
      }

      // Map database results to DTO
      const created: FlashcardListItemDTO[] = createdFlashcards.map((flashcard) => ({
        id: flashcard.id,
        front: flashcard.front,
        back: flashcard.back,
        source: flashcard.source,
        generation_id: flashcard.generation_id,
        created_at: flashcard.created_at,
      }));

      return {
        created,
      };
    } catch (error) {
      console.error("Error in createFlashcards:", error);
      throw error;
    }
  }

  async getFlashcards(
    userId: string,
    page = 1,
    limit = 12,
    sortBy = "created_at",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<{ flashcards: FlashcardListItemDTO[]; pagination: PaginationDTO }> {
    try {
      // Calculate offset
      const offset = (page - 1) * limit;
      // Get total count for pagination
      const { count, error: countError } = await this.supabase
        .from("flashcards")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      if (countError) {
        throw new Error(`Failed to count flashcards: ${countError.message}`);
      }

      // Fetch paginated flashcards
      const { data: flashcards, error } = await this.supabase
        .from("flashcards")
        .select("id, front, back, source, generation_id, created_at")
        .eq("user_id", userId)
        .order(sortBy, { ascending: sortOrder === "asc" })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to fetch flashcards: ${error.message}`);
      }

      // Map database results to DTO
      const flashcardDTOs: FlashcardListItemDTO[] = flashcards.map((flashcard) => ({
        id: flashcard.id,
        front: flashcard.front,
        back: flashcard.back,
        source: flashcard.source,
        generation_id: flashcard.generation_id,
        created_at: flashcard.created_at,
      }));

      return {
        flashcards: flashcardDTOs,
        pagination: {
          page,
          limit,
          total: count || 0,
        },
      };
    } catch (error) {
      console.error("Error in getFlashcards:", error);
      throw error;
    }
  }
}
