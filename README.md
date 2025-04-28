# 10xCards

## Table of Contents

1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Getting Started Locally](#getting-started-locally)
4. [Available Scripts](#available-scripts)
5. [Project Scope](#project-scope)
6. [Project Status](#project-status)
7. [License](#license)

## Project Description

10xCards is a web application designed for creating educational flashcards. The app supports both AI-generated flashcards and manual creation. The AI module processes an input text (ranging from 1,000 to 10,000 characters) and produces flashcards with a limited "front" (up to 200 characters) and "back" (up to 500 characters). Users can review, accept, or discard these flashcards, while also having the option to create and manage their own flashcards. Additionally, the app integrates with a spaced repetition algorithm to help users optimize their learning process.

## Tech Stack

- **Frontend:** Astro 5, React 19, TypeScript 5, Tailwind CSS 4, Shadcn/ui
- **Backend:** Supabase (PostgreSQL, authentication, and backend-as-a-service)
- **AI Integration:** Openrouter.ai for connecting to various AI models
- **Testing:**
  - **Unit Testing:** Vitest, React Testing Library, Supabase Test Helpers
  - **E2E Testing:** Playwright, Postman, SuperTest
- **Additional Tools:** ESLint, Prettier, GitHub Actions for CI/CD

## Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Brylat/10x-cards.git
   cd 10x-cards
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
   or if using yarn:
   ```bash
   yarn install
   ```
3. **Ensure correct Node version:**
   The project requires Node version as specified in the `.nvmrc` file:
   ```bash
   22.14.0
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` in your browser to see the project in action.

## Available Scripts

- `npm run dev` - Starts the Astro development server.
- `npm run build` - Builds the project for production.
- `npm run preview` - Serves the built project locally.
- `npm run astro` - Provides access to Astro CLI commands.
- `npm run lint` - Runs ESLint to analyze the codebase for potential errors.
- `npm run lint:fix` - Automatically fixes ESLint issues.
- `npm run format` - Formats the codebase using Prettier.

## Project Scope

- **Flashcard Generation:**
  - AI-generated flashcards by processing input text ranging from 1,000 to 10,000 characters.
  - Manual creation and management of flashcards.
- **Flashcard Characteristics:**
  - AI flashcards are structured with a "front" (up to 200 characters) and a "back" (up to 500 characters).
- **User Management:**
  - User authentication and authorization for individualized access.
- **Learning Sessions:**
  - Integration with a spaced repetition algorithm to enhance learning efficiency.
- **Metrics Tracking:**
  - Tracking the number of flashcards generated and accepted by users.

## Project Status

The project is in the early stages of development with a focus on creating a Minimum Viable Product (MVP).

## License

This project is licensed under the MIT License.
