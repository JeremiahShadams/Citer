// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommandPalette from "../components/workspace/CommandPalette";

describe("CommandPalette", () => {
  it("renders when open and triggers file selection", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();

    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        onSelectFile={onSelect}
      />
    );

    expect(screen.getByPlaceholderText(/Search symbols, files/)).toBeTruthy();

    // Type to filter
    const input = screen.getByPlaceholderText(/Search symbols, files/);
    await userEvent.type(input, "AuthService");

    expect(screen.getByText("AuthService")).toBeTruthy();

    fireEvent.click(screen.getByText("AuthService"));
    expect(onSelect).toHaveBeenCalledWith("src/services/auth.ts");
    expect(onClose).toHaveBeenCalled();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <CommandPalette isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });
});
