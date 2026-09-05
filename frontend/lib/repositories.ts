import { authFetch } from "./auth";

export type Repo = {
  id: number;
  name: string;
  owner: string | null;
  description: string | null;
  url: string;
  visibility: string;
  status: string;
  default_branch: string | null;
  created_at: string | null;
};

export type RepoDetail = Repo & {
  stats?: { files: number; chunks: number };
};

export type FileEntry = {
  name: string;
  type: "file" | "dir";
  children?: FileEntry[];
};

export type FileContent = {
  repo_id: number;
  path: string;
  language: string | null;
  content: string;
};

export async function listRepositories(): Promise<Repo[]> {
  const res = await authFetch("/repositories");
  if (!res.ok) throw new Error(`listRepositories failed: ${res.status}`);
  return res.json();
}

export async function createRepository(repoUrl: string): Promise<{ repo: Repo; task_id: string | null }> {
  const res = await authFetch("/repositories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  if (!res.ok) throw new Error(`createRepository failed: ${res.status}`);
  return res.json();
}

export async function getRepository(repoId: number): Promise<RepoDetail> {
  const res = await authFetch(`/repositories/${repoId}`);
  if (!res.ok) throw new Error(`getRepository failed: ${res.status}`);
  return res.json();
}

export async function listFiles(repoId: number): Promise<{ repo_id: number; tree: FileEntry[] }> {
  const res = await authFetch(`/repositories/${repoId}/files`);
  if (!res.ok) throw new Error(`listFiles failed: ${res.status}`);
  return res.json();
}

export async function getFileContent(repoId: number, path: string): Promise<FileContent> {
  const res = await authFetch(`/repositories/${repoId}/files/content?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error(`getFileContent failed: ${res.status}`);
  return res.json();
}
