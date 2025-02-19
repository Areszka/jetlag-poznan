import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "@/app/(auth)/login/page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
    })),
    useSearchParams: vi.fn(() => ({
      get: vi.fn(),
    })),
    usePathname: vi.fn(),
  };
});

test("Render Login Page", () => {
  render(<Page />);

  expect(screen.getByRole("heading", { level: 2, name: "Login" })).toBeDefined();
  expect(screen.getByRole("button", { name: "Login" })).toBeDefined();
});
