import { describe, expect, it, vi } from "vitest";
import { extractExcerpt } from "@lib/excerpt";
import { excerptSeparator, noFrontmatterMarkdown } from "@mocks/markdown";

describe("default excerpt", () => {
  it("should extract the first paragraph", () => {
    const excerpt = extractExcerpt(noFrontmatterMarkdown, {});
    expect(excerpt).toEqual("This is the first paragraph");
  });
});

describe("configured excerpt", () => {
  it("should extract until the separator", () => {
    const excerpt = extractExcerpt(noFrontmatterMarkdown, {
      excerptSeparator,
    });

    expect(excerpt).toEqual(
      `This is the first paragraph\n\nThis is the second paragraph`,
    );
  });

  it("should extract fist 20 characters", () => {
    const excerpt = extractExcerpt(noFrontmatterMarkdown, {
      excerptLength: 20,
    });
    expect(excerpt).toEqual(`This is the first pa`);
  });

  it("should limit size of excerpt with separator", () => {
    const excerpt = extractExcerpt(noFrontmatterMarkdown, {
      excerptLength: 20,
      excerptSeparator,
    });
    expect(excerpt).toEqual(`This is the first pa`);
  });

  it("should not overflow excerpt seperator", () => {
    const excerpt = extractExcerpt(noFrontmatterMarkdown, {
      excerptLength: 90,
      excerptSeparator,
    });
    expect(excerpt).toEqual(
      `This is the first paragraph\n\nThis is the second paragraph`,
    );
  });

  it("returns `null` when no content", () => {
    const excerpt = extractExcerpt("  ", {});
    expect(excerpt).toBeNull();
  });

  it("returns content when `separator` is not found", () => {
    const excerpt = extractExcerpt("some content", { excerptSeparator });
    expect(excerpt).toEqual("some content");
  });
});

describe("custom function", () => {
  it("should call custom function", () => {
    const customExcerpt = vi.fn();
    extractExcerpt(noFrontmatterMarkdown, { excerpt: customExcerpt });
    expect(customExcerpt).toHaveBeenCalled();
  });

  it("should pass properties to custom function", () => {
    const customExcerpt = vi.fn();
    extractExcerpt(noFrontmatterMarkdown, {
      excerpt: customExcerpt,
      excerptLength: 20,
      excerptSeparator: "sep",
    });

    expect(customExcerpt).toHaveBeenCalledWith(
      { content: noFrontmatterMarkdown, raw: noFrontmatterMarkdown },
      { length: 20, separator: "sep" },
    );
  });
});

describe("Erorr handeling", () => {
  it("should throw an error when `excerptLength` <= 0", () => {
    expect(() =>
      extractExcerpt(noFrontmatterMarkdown, { excerptLength: 0 }),
    ).toThrow("`excerptLength` must be greater than 0");
  });
});
