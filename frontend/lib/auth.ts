export type AuthUser = {
  id: number;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

let _token: string | null = null;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  if (_token) return _token;
  _token = localStorage.getItem("auth_token");
  return _token;
}

export function setToken(token: string) {
  _token = token;
  if (typeof window !== "undefined") localStorage.setItem("auth_token", token);
}

export function clearToken() {
  _token = null;
  if (typeof window !== "undefined") localStorage.removeItem("auth_token");
}

export async function devLogin(): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/dev-login`, { method: "POST" });
  if (!res.ok) throw new Error(`dev-login failed: ${res.status}`);
  const body = await res.json();
  setToken(body.token);
  return body;
}

export async function fetchMe(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    clearToken();
    return null;
  }
  if (!res.ok) throw new Error(`fetchMe failed: ${res.status}`);
  return res.json();
}

export async function logout(): Promise<void> {
  const token = getToken();
  if (token) {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  clearToken();
}

export function githubLoginUrl(): string {
  return `${API_URL}/auth/github/login`;
}

export function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...init, headers });
}