// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as auth from "../lib/auth";

beforeEach(() => {
  vi.restoreAllMocks();
  auth.clearToken();
  localStorage.clear();
});

describe("setToken / clearToken", () => {
  it("stores and removes token from localStorage", () => {
    auth.setToken("abc-123");
    expect(localStorage.getItem("auth_token")).toBe("abc-123");
    auth.clearToken();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});

describe("devLogin", () => {
  it("POSTs to /auth/dev-login and stores the token", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ token: "tok-xyz", user: { id: 1, email: "dev@local" } }),
    } as Response);

    const res = await auth.devLogin();
    expect(res.token).toBe("tok-xyz");
    expect(localStorage.getItem("auth_token")).toBe("tok-xyz");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/dev-login"),
      expect.objectContaining({ method: "POST" }),
    );
  });
});

describe("fetchMe", () => {
  it("returns user when token is valid", async () => {
    localStorage.setItem("auth_token", "valid-tok");
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, email: "dev@local" }),
    } as Response);

    const user = await auth.fetchMe();
    expect(user?.email).toBe("dev@local");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/me"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer valid-tok" }),
      }),
    );
  });

  it("clears token and returns null on 401", async () => {
    localStorage.setItem("auth_token", "bad-tok");
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    const user = await auth.fetchMe();
    expect(user).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});

describe("logout", () => {
  it("POSTs to /auth/logout and clears token", async () => {
    localStorage.setItem("auth_token", "tok-to-clear");
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);

    await auth.logout();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/logout"),
      expect.objectContaining({ method: "POST" }),
    );
  });
});

describe("authFetch", () => {
  it("attaches Authorization header when token exists", async () => {
    localStorage.setItem("auth_token", "my-tok");
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true } as Response);

    await auth.authFetch("/some/path");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/some/path"),
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );
  });
});