// Import types from the database, ensuring that DTOs reference the database models
import type { Database } from "./db/database.types";

/* --- Begin Flashcard database model aliases documentation --- */
// Replacing existing aliases comment with JSDoc comments
/**
 * Represents a flashcard record from the database.
 */
export type FlashcardRow = Database["public"]["Tables"]["flashcards"]["Row"];

/**
 * Represents a flashcard insertion object for the database.
 */
export type FlashcardInsert = Database["public"]["Tables"]["flashcards"]["Insert"];

/**
 * Represents a flashcard update object for the database.
 */
export type FlashcardUpdate = Database["public"]["Tables"]["flashcards"]["Update"];
/* --- End Flashcard database model aliases documentation --- */

/* --- Begin Generation database model aliases documentation --- */
/**
 * Represents a generation record from the database.
 */
export type GenerationRow = Database["public"]["Tables"]["generations"]["Row"];

/**
 * Represents a generation error log record from the database.
 */
export type GenerationErrorLogRow = Database["public"]["Tables"]["generations_error_logs"]["Row"];
/* --- End Generation database model aliases documentation --- */

/* --- Begin FlashcardSource documentation --- */
/**
 * Allowed flashcard source values.
 */
export type FlashcardSource = "manual" | "ai_full" | "ai_edited";
/* --- End FlashcardSource documentation --- */

/* --- Begin PaginationDTO documentation --- */
/**
 * DTO for pagination.
 *
 * Fields:
 * - page: the current page number.
 * - limit: the number of items per page.
 * - total: the total number of items.
 */
export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
}
/* --- End PaginationDTO documentation --- */

/* --- Begin FlashcardListItemDTO documentation --- */
/**
 * DTO for flashcard list item.
 * Contains a subset of fields from FlashcardRow.
 */
export type FlashcardListItemDTO = Pick<
  FlashcardRow,
  "id" | "front" | "back" | "source" | "generation_id" | "created_at"
>;
/* --- End FlashcardListItemDTO documentation --- */

/* --- Begin FlashcardDetailsDTO documentation --- */
/**
 * DTO for flashcard details.
 * Extends FlashcardListItemDTO with an updated_at field.
 */
export interface FlashcardDetailsDTO extends FlashcardListItemDTO {
  updated_at: FlashcardRow["updated_at"];
}
/* --- End FlashcardDetailsDTO documentation --- */

/* --- Begin CreateFlashcardCommandDTO documentation --- */
/**
 * Command model for creating a single flashcard.
 *
 * Validation Rules:
 * - front: must be a string with a maximum length of 200 characters.
 * - back: must be a string with a maximum length of 500 characters.
 * - source: must be one of "manual", "ai_full", or "ai_edited".
 * - generation_id: optional, can be a number or null.
 */
export interface CreateFlashcardCommandDTO {
  front: string;
  back: string;
  source: FlashcardSource;
  generation_id?: number | null;
}
/* --- End CreateFlashcardCommandDTO documentation --- */

/* --- Begin CreateFlashcardsDTO documentation --- */
/**
 * DTO for creating flashcards request.
 * Contains an array of CreateFlashcardCommandDTO.
 */
export interface CreateFlashcardsDTO {
  flashcards: CreateFlashcardCommandDTO[];
}
/* --- End CreateFlashcardsDTO documentation --- */

/* --- Begin CreateFlashcardsResponseDTO documentation --- */
/**
 * DTO for create flashcards response.
 * Contains an array of flashcard list items that were created.
 */
export interface CreateFlashcardsResponseDTO {
  created: FlashcardListItemDTO[];
}
/* --- End CreateFlashcardsResponseDTO documentation --- */

/* --- Begin UpdateFlashcardDTO documentation --- */
/**
 * Command model for updating a flashcard.
 *
 * Fields:
 * - id: the flashcard ID.
 * - front: the updated front text.
 * - back: the updated back text.
 * - source: must be one of the allowed flashcard sources.
 */
export interface UpdateFlashcardDTO {
  id: number;
  front: string;
  back: string;
  source: FlashcardSource;
}
/* --- End UpdateFlashcardDTO documentation --- */

/* --- Begin RequestGenerationCommandDTO documentation --- */
/**
 * Command model for requesting AI generated flashcards.
 *
 * Validation Rules:
 * - source_text: must be a string with length between 1000 and 10000 characters.
 */
export interface RequestGenerationCommandDTO {
  source_text: string;
}
/* --- End RequestGenerationCommandDTO documentation --- */

/* --- Begin FlashcardProposalDTO documentation --- */
/**
 * DTO for an AI-generated flashcard proposal.
 * Note: This proposal is not saved in the database; it does not include id, created_at, updated_at, etc.
 *
 * Fields:
 * - front: the front text.
 * - back: the back text.
 * - source: must be one of the allowed flashcard sources.
 * - generation_id: optional, can be a number or null.
 */
export interface FlashcardProposalDTO {
  front: string;
  back: string;
  source: FlashcardSource;
  generation_id?: number | null;
}
/* --- End FlashcardProposalDTO documentation --- */

/* --- Begin GenerationStatus documentation --- */
/**
 * Status of the flashcard generation.
 */
export type GenerationStatus = "completed" | "failed";
/* --- End GenerationStatus documentation --- */

/* --- Begin GenerationResponseDTO documentation --- */
/**
 * DTO for flashcard generation response.
 *
 * Fields:
 * - generation_id: the ID of the generation.
 * - status: the status of generation, either 'completed' or 'failed'.
 * - generated_count: number of generated flashcards.
 * - generation_duration: duration of the generation.
 * - flashcards_proposals: an array of FlashcardProposalDTO.
 */
export interface GenerationResponseDTO {
  generation_id: number;
  status: GenerationStatus;
  generated_count: number;
  generation_duration: number;
  flashcards_proposals: FlashcardProposalDTO[];
}
/* --- End GenerationResponseDTO documentation --- */

/* --- Begin GenerationListItemDTO documentation --- */
/**
 * DTO for generation record list item.
 *
 * Fields:
 * - id: the generation ID.
 * - hash: a string reflecting the source_text_hash.
 * - model: the generation model used.
 * - generated_count: count of flashcards generated.
 * - generation_duration: duration of the generation.
 * - created_at: creation timestamp.
 * - updated_at: last update timestamp.
 */
export interface GenerationListItemDTO {
  id: GenerationRow["id"];
  hash: string; // reflects source_text_hash
  model: GenerationRow["model"];
  generated_count: GenerationRow["generated_count"];
  generation_duration: GenerationRow["generation_duration"];
  created_at: GenerationRow["created_at"];
  updated_at: GenerationRow["updated_at"];
}
/* --- End GenerationListItemDTO documentation --- */

/* --- Begin GenerationHistoryResponseDTO documentation --- */
/**
 * DTO for generation history response.
 *
 * Contains:
 * - generations: array of GenerationListItemDTO.
 * - pagination: pagination details.
 */
export interface GenerationHistoryResponseDTO {
  generations: GenerationListItemDTO[];
  pagination: PaginationDTO;
}
/* --- End GenerationHistoryResponseDTO documentation --- */

/* --- Begin GenerationDetailsDTO documentation --- */
/**
 * DTO for generation details.
 *
 * Fields:
 * - id: the generation ID.
 * - hash: retrieved from source_text_hash.
 * - source_text_length: length of the source text.
 * - model: the generation model used.
 * - generated_count: count of flashcards generated.
 * - generation_duration: duration of the generation.
 * - flashcards: array of flashcard list items.
 * - error_logs: array of generation error logs.
 */
export interface GenerationDetailsDTO {
  id: GenerationRow["id"];
  hash: string; // retrieved from source_text_hash
  source_text_length: GenerationRow["source_text_length"];
  model: GenerationRow["model"];
  generated_count: GenerationRow["generated_count"];
  generation_duration: GenerationRow["generation_duration"];
  flashcards: FlashcardListItemDTO[];
  error_logs: GenerationErrorLogDTO[];
}
/* --- End GenerationDetailsDTO documentation --- */

/* --- Begin GenerationErrorLogDTO documentation --- */
/**
 * DTO for a single generation error log.
 *
 * Fields:
 * - id: the error log ID.
 * - timestamp: timestamp when the error was created.
 * - error_message: the error message.
 * - error_type: error code mapped from error_code.
 */
export interface GenerationErrorLogDTO {
  id: GenerationErrorLogRow["id"];
  timestamp: GenerationErrorLogRow["created_at"];
  error_message: GenerationErrorLogRow["error_message"];
  error_type: GenerationErrorLogRow["error_code"];
}
/* --- End GenerationErrorLogDTO documentation --- */

/* --- Begin GenerationErrorLogsResponseDTO documentation --- */
/**
 * DTO for generation error logs response.
 *
 * Contains:
 * - error_logs: array of GenerationErrorLogDTO.
 * - pagination: pagination details.
 */
export interface GenerationErrorLogsResponseDTO {
  error_logs: GenerationErrorLogDTO[];
  pagination: PaginationDTO;
}
/* --- End GenerationErrorLogsResponseDTO documentation --- */
