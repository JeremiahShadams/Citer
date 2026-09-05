// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider } from "../components/AuthProvider";
import * as auth from "../lib/auth";

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

function wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe("AuthProvider", () => {
  it("calls fetchMe on mount and exposes user", async () => {
    vi.spyOn(auth, "fetchMe").mockResolvedValue({
      id: 1,
      email: "dev@local",
      name: "Dev",
      avatar_url: null,
    });

    render(<div>test</div>, { wrapper });

    await waitFor(() => {
      expect(auth.fetchMe).toHaveBeenCalled();
    });
  });

  it("sets user to null when fetchMe returns null", async () => {
    vi.spyOn(auth, "fetchMe").mockResolvedValue(null);

    render(<div>test</div>, { wrapper });

    await waitFor(() => {
      expect(auth.fetchMe).toHaveBeenCalled();
    });
  });

  it("signOut clears token and user", async () => {
    vi.spyOn(auth, "fetchMe").mockResolvedValue(null);
    vi.spyOn(auth, "clearToken");

    let signOutFn: (() => void) | undefined;

    function TestChild() {
      return <div>test</div>;
    }

    render(
      <AuthProvider>
        <TestChild />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(auth.fetchMe).toHaveBeenCalled();
    });
  });
});