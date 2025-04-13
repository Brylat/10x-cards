import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenerationResponseDTO, GenerationStatus } from "../../types";
import crypto from "crypto";
import type { AIService } from "./ai.service";
import { MockAIService } from "./ai.service";

export class GenerationService {
  private aiService: AIService;

  constructor(
    private readonly supabase: SupabaseClient,
    aiService?: AIService
  ) {
    this.aiService = aiService || new MockAIService();
  }

  async createGeneration(sourceText: string, userId: string): Promise<GenerationResponseDTO> {
    try {
      const startTime = Date.now();

      // 1. Create generation record
      const { data: generation, error: generationError } = await this.supabase
        .from("generations")
        .insert({
          user_id: userId,
          source_text_length: sourceText.length,
          source_text_hash: this.generateHash(sourceText),
          model: "gpt-4-mock", // Using mock model name
          generated_count: 0,
          generation_duration: 0, // Initial duration
        })
        .select()
        .single();

      if (generationError || !generation) {
        throw new Error("Failed to create generation record" + JSON.stringify(generationError));
      }

      try {
        // 2. Generate flashcards using AI service
        const flashcards = await this.aiService.generateFlashcards(sourceText);

        const generationDuration = Date.now() - startTime;

        // 3. Update generation record with success
        const { error: updateError } = await this.supabase
          .from("generations")
          .update({
            generated_count: flashcards.length,
            generation_duration: generationDuration,
          })
          .eq("id", generation.id);

        if (updateError) {
          throw new Error("Failed to update generation status");
        }

        // 4. Return successful response
        return {
          generation_id: generation.id,
          status: "completed" as GenerationStatus,
          generated_count: flashcards.length,
          generation_duration: generationDuration,
          flashcards_proposals: flashcards,
        };
      } catch (aiError) {
        const generationDuration = Date.now() - startTime;

        // Log error and update generation status
        await this.logGenerationError(generation.id, aiError);
        await this.supabase
          .from("generations")
          .update({
            status: "failed",
            generation_duration: generationDuration,
          })
          .eq("id", generation.id);

        throw aiError;
      }
    } catch (error) {
      console.error("Error in createGeneration:", error);
      throw error;
    }
  }

  private generateHash(text: string): string {
    return crypto.createHash("md5").update(text).digest("hex");
  }

  private async logGenerationError(generationId: number, error: unknown): Promise<void> {
    try {
      await this.supabase.from("generations_error_logs").insert({
        generation_id: generationId,
        error_code: "AI_GENERATION_FAILED",
        error_message: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } catch (logError) {
      console.error("Failed to log generation error:", logError);
    }
  }
}
