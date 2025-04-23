/// <reference types="vitest" />
import "@testing-library/jest-dom";

interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toHaveClass(className: string): R;
  toBeVisible(): R;
  toHaveTextContent(text: string): R;
  toHaveAttribute(attr: string, value?: string): R;
}

declare module "vitest" {
  // These interfaces are needed for module augmentation even though they don't add members
  // @ts-expect-error - Interface is needed for declaration merging
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  // @ts-expect-error - Interface is needed for declaration merging
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
