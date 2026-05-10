import { type ZodType } from "zod";
import type { ParsedFile, ParseOptions, MattrAllowedTypes } from "./types";
import { parseFrontmatter } from "@lib/frontmatter";
import { validateSchema } from "@lib/helpers";
import { extractExcerpt } from "@lib/excerpt";

export function parse<
  TData extends Record<string, unknown> = Record<string, unknown>,
>(input: string, options?: ParseOptions<TData>): ParsedFile<TData>;

export function parse<TSchema extends ZodType = ZodType>(
  input: string,
  options?: ParseOptions<TSchema>,
): ParsedFile<TSchema>;

export function parse<T extends MattrAllowedTypes = Record<string, unknown>>(
  input: string,
  options?: ParseOptions<T>,
): ParsedFile<T> {
  const opts = (options ?? {}) as ParseOptions<T>;

  // Get frontmatter data & content from file
  const { data, content } = parseFrontmatter<T>(input);

  // Validate data agains schema
  const validatedData =
    "schema" in opts ? validateSchema<T>(opts.schema, data) : data;

  // Create a placeholder object we can spread later on
  // Return an empty object if the user explicitly disabled excerpt
  const excerpt = opts.excerpt === false ? null : extractExcerpt(content, opts);

  // Return everything
  return Object.freeze({
    data: Object.freeze(validatedData),
    content,
    excerpt,
    raw: input,
  });
}
