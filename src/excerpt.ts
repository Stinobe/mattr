import type { ZodType } from "zod";
import { MattrExcerptError } from "@lib/errors";
import type { MattrAllowedTypes, ParseOptions } from "./types";

function extractFirstParagraph(content: string) {
  const normalized = content.trim();

  let fp = null;

  if (normalized) {
    const separator = normalized.indexOf("\n\n");
    fp = separator === -1 ? normalized : normalized.slice(0, separator);
  }

  return fp;
}

export function extractExcerpt<T extends Record<string, unknown>>(
  content: string,
  options: ParseOptions<T>,
): string | null;

export function extractExcerpt<TSchema extends ZodType>(
  content: string,
  options: ParseOptions<TSchema>,
): string | null;

export function extractExcerpt<T extends MattrAllowedTypes>(
  content: string,
  options: ParseOptions<T>,
): string | null {
  // If the user passed a custom function invoke it
  if (typeof options.excerpt === "function")
    return options.excerpt(
      { raw: content, content },
      {
        length: options.excerptLength,
        separator: options.excerptSeparator,
      },
    );

  // Create a placeholder for the excerpt
  let excerpt: string | null = null;

  // If an excerpt separator was defined, split the string
  if (options.excerptSeparator) {
    const separatorIndex = content.trim().indexOf(options.excerptSeparator);

    if (separatorIndex > -1)
      excerpt = content.trim().slice(0, separatorIndex).trim();
  }

  // In case an excerpt length was defined, make sure the length of the excerpt doesn't exceed that
  if (typeof options.excerptLength === "number") {
    if (options.excerptLength <= 0)
      throw new MattrExcerptError("`excerptLength` must be greater than 0");

    excerpt = (excerpt ?? content)
      .trim()
      .slice(0, options.excerptLength)
      .trim();
  }

  // If no excerpt has been created because no separator or length were set
  // extract the first paragraph of the content
  if (!excerpt) excerpt = extractFirstParagraph(content);

  return excerpt;
}
