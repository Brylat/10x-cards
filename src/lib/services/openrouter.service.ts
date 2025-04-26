import { z } from "zod";

// Types
export interface ModelParams {
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
  maxRequestsPerMinute?: number;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface APIResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}

// Input validation schemas
const modelParamsSchema = z.object({
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
});

const messageSchema = z.object({
  content: z.string().min(1000).max(10000),
});

// Custom error types
export class OpenRouterError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

export class APIAuthenticationError extends OpenRouterError {
  constructor(message: string) {
    super(message, "AUTH_ERROR");
  }
}

export class APITimeoutError extends OpenRouterError {
  constructor(message: string) {
    super(message, "TIMEOUT_ERROR");
  }
}

export class APIResponseError extends OpenRouterError {
  constructor(message: string) {
    super(message, "RESPONSE_ERROR");
  }
}

export class RateLimitError extends OpenRouterError {
  constructor(message: string) {
    super(message, "RATE_LIMIT_ERROR");
  }
}

export class ValidationError extends OpenRouterError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}

// Response format schema validation
interface SchemaType {
  type: string;
  properties: Record<string, SchemaProperty>;
  required: string[];
  additionalProperties?: boolean;
}

interface SchemaProperty {
  type: string;
  items?: SchemaType;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: SchemaType;
  };
}

export class OpenRouterService {
  private apiClient: typeof fetch = fetch;
  private config: OpenRouterConfig;
  private modelParams: ModelParams;
  private responseFormat?: ResponseFormat;
  private systemMessage = "";
  private readonly maxRetries = 3;
  private readonly timeout = 30000; // 30 seconds
  private requestTimestamps: number[] = [];

  constructor(model?: string) {
    // Initialize with environment variables
    this.config = {
      apiKey: process.env.OPENROUTER_API_KEY || import.meta.env.OPENROUTER_API_KEY,
      baseUrl: process.env.OPENROUTER_API_URL || import.meta.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1",
      defaultModel:
        model || process.env.OPENROUTER_DEFAULT_MODEL || import.meta.env.OPENROUTER_DEFAULT_MODEL || "gpt-4",
      maxRequestsPerMinute:
        Number(process.env.OPENROUTER_MAX_REQUESTS_PER_MINUTE || import.meta.env.OPENROUTER_MAX_REQUESTS_PER_MINUTE) ||
        60,
    };

    if (!this.config.apiKey) {
      this.logError("Missing API key");
      throw new APIAuthenticationError("OpenRouter API key is required");
    }

    this.modelParams = {
      temperature: 1.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    this.initializeClient();
  }

  private initializeClient(): void {
    this.apiClient = async (input: RequestInfo | URL, init?: RequestInit) => {
      await this.checkRateLimit();

      const headers = {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.PUBLIC_SITE_URL || import.meta.env.PUBLIC_SITE_URL || "http://localhost:3000",
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        this.log("Sending request to OpenRouter API", { url: input.toString() });
        const response = await fetch(input, {
          ...init,
          headers: {
            ...headers,
            ...(init?.headers || {}),
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new APIAuthenticationError("Invalid API key");
          }
          if (response.status === 429) {
            throw new RateLimitError("Rate limit exceeded");
          }
          throw new APIResponseError(`API request failed: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new APITimeoutError("Request timed out");
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    };
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Clean up old timestamps
    this.requestTimestamps = this.requestTimestamps.filter((timestamp) => timestamp > oneMinuteAgo);

    if (this.requestTimestamps.length >= (this.config.maxRequestsPerMinute || 60)) {
      this.logError("Rate limit exceeded");
      throw new RateLimitError("Too many requests. Please try again later.");
    }

    this.requestTimestamps.push(now);
  }

  private validateModelParams(params: ModelParams): void {
    try {
      modelParamsSchema.parse(params);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid model parameters: ${error.errors.map((e) => e.message).join(", ")}`);
      }
      throw error;
    }
  }

  private validateMessage(message: string): void {
    try {
      messageSchema.shape.content.parse(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid message: ${error.errors.map((e) => e.message).join(", ")}`);
      }
      throw error;
    }
  }

  private log(message: string, data?: Record<string, unknown>): void {
    console.log(`[OpenRouter] ${message}`, data ? JSON.stringify(data) : "");
  }

  private logError(message: string, error?: unknown): void {
    console.error(`[OpenRouter] Error: ${message}`, error instanceof Error ? error.stack : "");
  }

  private async parseAPIResponse(response: Response): Promise<string> {
    try {
      const data = (await response.json()) as APIResponse;
      console.log("API Response:", data);
      if (!data.choices?.[0]?.message?.content) {
        throw new APIResponseError("Invalid response format from API");
      }
      return data.choices[0].message.content;
    } catch (error) {
      this.logError("Failed to parse API response", error);
      throw new APIResponseError(
        `Failed to parse API response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  public setSystemMessage(message: string): void {
    this.systemMessage = message;
  }

  private buildMessagePayload(userMessage: string): Message[] {
    const messages: Message[] = [];

    if (this.systemMessage) {
      messages.push({
        role: "system",
        content: this.systemMessage,
      });
    }

    messages.push({
      role: "user",
      content: userMessage,
    });

    return messages;
  }

  public setResponseFormat(format: { name: string; schema: SchemaType }): void {
    this.responseFormat = {
      type: "json_schema",
      json_schema: {
        name: format.name,
        strict: true,
        schema: format.schema,
      },
    };
  }

  public setModelParameters(params: ModelParams): void {
    this.validateModelParams(params);
    this.modelParams = {
      ...this.modelParams,
      ...params,
    };
  }

  public async sendChatMessage(userMessage: string): Promise<string> {
    this.validateMessage(userMessage);
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const messages = this.buildMessagePayload(userMessage);
        const payload = {
          model: this.config.defaultModel,
          messages,
          ...this.modelParams,
          ...(this.responseFormat && { response_format: this.responseFormat }),
        };

        this.log("Sending chat message", { attempt: attempt + 1, model: this.config.defaultModel });
        const response = await this.apiClient(`${this.config.baseUrl}/chat/completions`, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        return await this.parseAPIResponse(response);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error");
        this.logError(`Attempt ${attempt + 1} failed`, error);

        if (error instanceof APIAuthenticationError || error instanceof ValidationError) {
          throw error;
        }

        if (attempt < this.maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          this.log(`Retrying in ${delay}ms`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("Failed to send message after all retries");
  }
}
