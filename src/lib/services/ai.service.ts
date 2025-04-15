import type { FlashcardProposalDTO } from "../../types";

export interface AIService {
  generateFlashcards(sourceText: string): Promise<FlashcardProposalDTO[]>;
}

export class MockAIService implements AIService {
  async generateFlashcards(sourceText: string): Promise<FlashcardProposalDTO[]> {
    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock flashcards based on text length
    const cardCount = Math.min(5, Math.floor(sourceText.length / 1000));

    return Array.from({ length: cardCount }, (_, index) => ({
      front: `Mock Question ${index + 1}`,
      back: `Mock Answer ${index + 1}`,
      source: "ai-full",
    }));
  }
}
