// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CodeInspector from "../components/workspace/CodeInspector";

describe("CodeInspector", () => {
  it("renders empty state when file is null", () => {
    render(<CodeInspector file={null} highlightRange={null} />);
    expect(screen.getByText("No file selected")).toBeTruthy();
  });

  it("renders code lines and highlights target range", () => {
    const file = {
      path: "src/auth.ts",
      language: "typescript",
      content: "line 1\nline 2\nline 3\nline 4\nline 5",
    };

    render(
      <CodeInspector
        file={file}
        highlightRange={{ start: 2, end: 4 }}
      />
    );

    expect(screen.getByText("src/auth.ts")).toBeTruthy();
    expect(screen.getByText("Lines 2–4 illuminated")).toBeTruthy();
    expect(screen.getByText("line 1")).toBeTruthy();
    expect(screen.getByText("line 3")).toBeTruthy();
  });
});
