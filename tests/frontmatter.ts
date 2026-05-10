import { afterEach, describe, expect, it, vi } from "vitest";
import {
  markdown,
  noFrontmatterMarkdown,
  invalidMarkdown,
  invalidYamlMarkdown,
} from "@mocks/markdown";

describe("default usage", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("should properly handle the input", async () => {
    const { parseFrontmatter } = await import("@lib/frontmatter");
    const parsed = parseFrontmatter(markdown);
    expect(parsed).toEqual({
      content: noFrontmatterMarkdown.trim(),
      data: {
        title: "Hello World",
      },
    });
  });

  it("should return empty data object when no frontmatter is found", async () => {
    const { parseFrontmatter } = await import("@lib/frontmatter");
    const parsed = parseFrontmatter(noFrontmatterMarkdown);
    expect(parsed).toEqual({
      content: noFrontmatterMarkdown.trim(),
      data: {},
    });
  });

  it("returns empty object when `parseYaml` returns null", async () => {
    vi.doMock("yaml", () => ({ parse: vi.fn(() => null) }));
    const { parseFrontmatter } = await import("@lib/frontmatter");
    const parsed = parseFrontmatter(markdown);
    expect(parsed).toEqual({
      content: noFrontmatterMarkdown.trim(),
      data: {},
    });
  });
});

describe("error handeling", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("should throw an error with invalid frontmatter", async () => {
    const { parseFrontmatter } = await import("@lib/frontmatter");
    expect(() => parseFrontmatter(invalidMarkdown)).toThrow(
      "Unclosed YAML frontmatter block",
    );
  });

  it("should throw an error when Yaml is invalid", async () => {
    vi.doMock("yaml", () => ({
      parse: vi.fn(() => {
        throw new Error("Failde from Yaml");
      }),
    }));
    const { parseFrontmatter } = await import("@lib/frontmatter");
    expect(() => parseFrontmatter(invalidYamlMarkdown)).toThrow(
      "Failed to parse frontmatter",
    );
  });
});
