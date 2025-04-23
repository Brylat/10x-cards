# Unit Testing Guide

This directory contains the unit tests for the 10x Cards application using Vitest.

## Key Points

- Tests are written using Vitest and React Testing Library
- The setup file configures the test environment and extends matchers
- Tests follow a structured pattern for maintainability
- Test files should be placed next to the files they test with `.test.ts` or `.spec.ts` extensions

## Best Practices

- Use `vi.fn()` for function mocks, `vi.spyOn()` to monitor existing functions
- Place mock factory functions at the top level of test files
- Use `describe` blocks to group related tests
- Follow the Arrange-Act-Assert pattern in tests
- Implement early returns for error conditions
- Use TypeScript for type checking in tests

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Example Structure

```typescript
// Example unit test structure
import { describe, it, expect, vi } from "vitest";

describe("Component or Function Name", () => {
  // Setup - runs before each test in this describe block
  beforeEach(() => {
    // Setup code
  });

  it("should do something specific", () => {
    // Arrange
    const input = "test";

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe("expected output");
  });
});
```
