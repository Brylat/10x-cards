import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// This is just a sample component for the test
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p data-testid="count">{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

describe("Counter Component", () => {
  it("renders with initial count of 0", () => {
    render(<Counter />);
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("increments count when button is clicked", async () => {
    render(<Counter />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Increment" }));

    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  it("demonstrates vi.mock usage", () => {
    // Example of mocking a module
    vi.mock("@/lib/utils", () => ({
      formatCount: vi.fn().mockReturnValue("Formatted Count"),
    }));

    // This is just a demonstration, not actual test logic
    expect(vi.fn().mockReturnValue("test")).toBeTypeOf("function");
  });
});
