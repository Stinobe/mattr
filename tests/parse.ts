import { beforeEach, describe, expect, it, vi } from "vitest";
import { parse } from "@lib/parse";
import {
  firstParagraph,
  invalidMarkdown,
  invalidYamlMarkdown,
  markdown,
  noFrontmatterMarkdown,
} from "@mocks/markdown";
import { parseFrontmatter } from "@lib/frontmatter";
import { validateSchema } from "@lib/helpers";
import { z } from "zod";
import { extractExcerpt } from "@lib/excerpt";

vi.mock("@lib/frontmatter", { spy: true });
vi.mock("@lib/helpers", { spy: true });
vi.mock("@lib/excerpt", { spy: true });

describe("with valid markdown", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return expected output", () => {
    const parsed = parse(markdown);
    expect(parsed).toEqual({
      data: { title: "Hello World" },
      content: noFrontmatterMarkdown.trim(),
      excerpt: firstParagraph,
      raw: markdown,
    });
  });

  it("should call the `parseFrontmatter` function", () => {
    parse(markdown);
    expect(parseFrontmatter).toHaveBeenCalledWith(markdown);
  });

  it("should call the `extractExcerpt`", () => {
    parse(markdown);
    expect(extractExcerpt).toHaveBeenCalledWith(
      noFrontmatterMarkdown.trim(),
      {},
    );
  });

  it("should not call `extractExcerpt` when set to false", () => {
    parse(markdown, { excerpt: false });
    expect(extractExcerpt).not.toHaveBeenCalled();
  });

  it("should not call `validateSchema`", () => {
    parse(markdown);
    expect(validateSchema).not.toHaveBeenCalled();
  });
});

describe("with Zod validation", () => {
  it("should have called `validateSchema`", () => {
    const schema = z.object({ title: z.string() });
    parse(markdown, { schema });
    expect(validateSchema).toHaveBeenCalledWith(schema, {
      title: "Hello World",
    });
  });
});

describe("with invalid input", () => {
  it("throw error when no invald frontmatter", () => {
    expect(() => parse(invalidMarkdown)).toThrow(
      "Unclosed YAML frontmatter block",
    );
  });

  it("throws error with invalid yaml", () => {
    expect(() => parse(invalidYamlMarkdown)).toThrow(
      "Failed to parse frontmatter",
    );
  });

  it("throws errors when schema validation fails", () => {
    const schema = z.object({ title: z.string() });
    expect(() => parse(noFrontmatterMarkdown, { schema })).toThrow(
      "Frontmatter schema validation failed",
    );
  });

  it("throws an error with invalid `excerptLength` option", () => {
    expect(() => parse(markdown, { excerptLength: -1 })).toThrow(
      "`excerptLength` must be greater than 0",
    );
  });
});
