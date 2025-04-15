import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateFlashcardCommandDTO, CreateFlashcardsResponseDTO, FlashcardListItemDTO } from "../../types";

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
}
