// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as repos from "../lib/repositories";

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

function mockFetch(data: unknown) {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => data,
  } as Response);
}

describe("listRepositories", () => {
  it("returns array of repos", async () => {
    mockFetch([{ id: 1, name: "demo", url: "https://github.com/x/demo", status: "ready" }]);
    const result = await repos.listRepositories();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("demo");
  });
});

describe("createRepository", () => {
  it("returns repo and task_id", async () => {
    mockFetch({ repo: { id: 2, name: "test" }, task_id: "abc" });
    const result = await repos.createRepository("https://github.com/x/test");
    expect(result.task_id).toBe("abc");
    expect(result.repo.id).toBe(2);
  });
});

describe("getRepository", () => {
  it("returns repo detail with stats", async () => {
    mockFetch({ id: 3, name: "repo3", stats: { files: 10, chunks: 50 } });
    const result = await repos.getRepository(3);
    expect(result.stats?.files).toBe(10);
  });
});

describe("listFiles", () => {
  it("returns tree structure", async () => {
    mockFetch({ repo_id: 1, tree: [{ name: "src", type: "dir", children: [] }] });
    const result = await repos.listFiles(1);
    expect(result.tree).toHaveLength(1);
    expect(result.tree[0].type).toBe("dir");
  });
});

describe("getFileContent", () => {
  it("returns file content", async () => {
    mockFetch({ repo_id: 1, path: "src/a.py", language: "py", content: "print()" });
    const result = await repos.getFileContent(1, "src/a.py");
    expect(result.content).toBe("print()");
    expect(result.language).toBe("py");
  });
});