import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect method with jest-dom matchers
expect.extend(matchers);

// Clean up after each test (automatically unmounts React components)
afterEach(() => {
  cleanup();
});

// Set up global mocks if needed
// Example: vi.mock('@/lib/api', () => ({ ... }))

// Add any global setup needed for all tests here
