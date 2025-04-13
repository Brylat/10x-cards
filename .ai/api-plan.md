# REST API Plan

## 1. Resources

- **Flashcards**: Corresponds to the `flashcards` table in the database. Contains fields such as `id`, `front`, `back`, `source`, `generation_id`, `user_id`, `created_at`, and `updated_at`. The `source` field is validated to only allow values ('ai-full', 'ai-edited', 'manual').

- **Generations**: Maps to the `generations` table and tracks AI generation requests. Key fields include `id`, `hash`, `source_text_length`, `source_text_hash`, `model`, `generated_count`, `accepted_count_without_edit`, `accepted_count_with_edit`, `generation_duration`, `created_at`, `updated_at`, and `user_id`. This resource logs details about the AI generation process.

- **Generation Error Logs**: Corresponds to the `generations_error_logs` table. Stores error messages, error codes, and related metadata for flashcard generation failures. Key fields include `id`, `error_message`, `error_code`, `created_at`, `source_text_length`, `source_text_hash`, `model`, and `user_id`.

- **User Authentication**: While user records are managed by Supabase Auth, API endpoints will be defined to support registration, login, and profile retrieval. The database uses user IDs to link records and enforce Row-Level Security (RLS).

- **Study Session**: Represents the study session functionality that implements spaced repetition logic. It enables users to review flashcards based on their performance feedback.

## 2. Endpoints

### Flashcards Endpoints

1. **List Flashcards**

   - **Method**: GET
   - **URL**: `/api/flashcards`
   - **Description**: Retrieve a paginated list of flashcards for the authenticated user.
   - **Query Parameters**: `page`, `limit`, and optional filters/sorting (e.g., sort by `created_at`)
   - **Response Payload**:
     ```json
     {
       "flashcards": [
         {
           "id": 1,
           "front": "Example front text",
           "back": "Example back text",
           "source": "manual",
           "generation_id": null,
           "created_at": "2023-10-01T00:00:00Z"
         }
       ],
       "pagination": {
         "page": 1,
         "limit": 10,
         "total": 50
       }
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 500 Internal Server Error

2. **Get Flashcard Details**

   - **Method**: GET
   - **URL**: `/api/flashcards/{id}`
   - **Description**: Retrieve details of a specific flashcard.
   - **Response Payload**:
     ```json
     {
       "id": 1,
       "front": "Example front text",
       "back": "Example back text",
       "source": "manual",
       "generation_id": null,
       "created_at": "2023-10-01T00:00:00Z",
       "updated_at": "2023-10-02T00:00:00Z"
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 404 Not Found

3. **Create Flashcards**

   - **Method**: POST
   - **URL**: `/api/flashcards`
   - **Description**: Create one or more flashcards, either manually or from AI generation.
   - **Request Payload**:
     ```json
     {
       "flashcards": [
         {
           "front": "Example front text (max 200 characters)",
           "back": "Example back text (max 500 characters)",
           "source": "manual | ai_full | ai_edited",
           "generation_id": null
         }
       ]
     }
     ```
   - **Response Payload**:
     ```json
     {
       "created": [
         {
           "id": 1,
           "front": "Example front text",
           "back": "Example back text",
           "source": "manual",
           "generation_id": null,
           "created_at": "2023-10-01T00:00:00Z"
         }
       ],
       "failed": []
     }
     ```
   - **Success Codes**: 201 Created
   - **Error Codes**: 400 Bad Request (validation errors), 401 Unauthorized

4. **Update Flashcard**

   - **Method**: PUT
   - **URL**: `/api/flashcards/{id}`
   - **Description**: Update an existing flashcard's content.
   - **Request Payload**:
     ```json
     {
       "front": "Updated front text",
       "back": "Updated back text"
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 400 Bad Request, 401 Unauthorized, 404 Not Found

5. **Delete Flashcard**
   - **Method**: DELETE
   - **URL**: `/api/flashcards/{id}`
   - **Description**: Delete the specified flashcard.
   - **Success Codes**: 200 OK or 204 No Content
   - **Error Codes**: 401 Unauthorized, 404 Not Found

### Generations Endpoints

1. **Request Flashcard Generation via AI**

   - **Method**: POST
   - **URL**: `/api/generations`
   - **Description**: Generate flashcards proposals using AI based on input text. Returns generated flashcards proposals immediately.
   - **Request Payload**:
     ```json
     {
       "source_text": "Input text between 1000 and 10000 characters"
     }
     ```
   - **Response Payload**:
     ```json
     {
       "generation_id": 10,
       "status": "completed",
       "generated_count": 5,
       "flashcards_proposals": [
         {
           "id": 1,
           "front": "Generated front text",
           "back": "Generated back text",
           "source": "ai_full",
           "generation_id": 10
         }
       ]
     }
     ```
   - **Success Codes**: 201 Created
   - **Error Codes**: 400 Bad Request (e.g., text length out of bounds), 401 Unauthorized, 500 Internal Server Error (generation failed)
   - **Error Handling**: If generation fails, the error details are logged in the `generations_error_logs` table

2. **List Generation History**

   - **Method**: GET
   - **URL**: `/api/generations`
   - **Description**: Retrieve a paginated list of generation records for the authenticated user.
   - **Query Parameters**: `page`, `limit`, and sorting options (e.g., by `created_at`)
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 500 Internal Server Error

3. **Get Generation Details**
   - **Method**: GET
   - **URL**: `/api/generations/{id}`
   - **Description**: Retrieve detailed information about a specific generation request, including associated flashcards.
   - **Response Payload**:
     ```json
     {
       "id": 10,
       "hash": "somehashvalue",
       "source_text_length": 1500,
       "model": "desired-model-identifier",
       "generated_count": 5,
       "flashcards": [
         {
           "id": 1,
           "front": "Generated front text",
           "back": "Generated back text",
           "source": "ai_full",
           "generation_id": 10
         }
       ],
       "error_logs": [
         {
           "id": 1,
           "timestamp": "2023-10-01T00:00:00Z",
           "error_message": "Error details if generation partially failed",
           "error_type": "validation_error"
         }
       ]
     }
     ```
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 404 Not Found

### Generation Error Logs Endpoints

1. **List Generation Error Logs**
   - **Method**: GET
   - **URL**: `/api/generations-error-logs`
   - **Description**: Retrieve a paginated list of error logs from generation requests for the authenticated user.
   - **Query Parameters**: `page`, `limit`, and optional filters (e.g., date range)
   - **Success Codes**: 200 OK
   - **Error Codes**: 401 Unauthorized, 500 Internal Server Error

## 3. Authentication and Authorization

- **Mechanism**: The API utilizes token-based authentication (e.g., JWT) managed through Supabase Auth. Endpoints that require user context will enforce token validation via middleware.
- **Authorization**: Access to all resources is restricted to the authenticated user only. Database Row-Level Security (RLS) ensures that users can only operate on records where `user_id` matches their own ID.
- **Security Measures**:
  - Rate limiting on critical endpoints (especially for AI generation) to prevent abuse.
  - All endpoints must use HTTPS.
  - Input validation and sanitization are performed on all incoming data.

## 4. Validation and Business Logic

- **Input Validation**:

  - For Flashcards: Ensure that the `front` field does not exceed 200 characters and the `back` field does not exceed 500 characters.
  - For Generation Requests: `source_text` must be between 1000 and 10000 characters (i.e., a minimum of 1000 characters and a maximum of 10000 characters) to ensure sufficient context for AI flashcard generation; additionally, the `model` field must be provided.
  - The `source` field for flashcards is validated to only allow values `ai-full`, `ai-edited`, or `manual`.

- **Business Logic**:

  - **AI Flashcard Generation**: Upon valid input, the request creates a generation record in the `generations` table and triggers an AI process. Flashcards generated by the AI are stored in the `flashcards` table and linked via `generation_id`.
  - **Flashcard Management**: Users can manually create, update, and delete flashcards. All data operations enforce strict validation to ensure consistency with database constraints.
  - **Study Sessions**: The study session endpoints implement spaced repetition logic. This includes dynamically selecting the next flashcard based on previous feedback and updating review schedules accordingly.

- **Performance Considerations**:

  - Pagination, filtering, and sorting are integrated into list endpoints to efficiently handle large datasets.
  - Database indexes (e.g., on `user_id` and `created_at`) optimize data retrieval operations.

- **Error Handling**:
  - Detailed error messages and appropriate HTTP status codes (400, 401, 404, 500) inform the client of issues.
  - Validation errors return clear messages indicating which fields failed and why.
