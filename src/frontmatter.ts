import { load as parseYaml } from "js-yaml";
import { MattrParseError } from "@lib/errors";
import { EMPTY_OBJECT, FRONTMATTER_DELIMITTER } from "@lib/constants";
import type { MattrAllowedTypes, MattrData } from "./types";

export interface FrontmatterResult<TData extends MattrAllowedTypes> {
  readonly data: MattrData<TData>;
  readonly content: string;
}

/**
 * Parse frontmatter
 **/
export function parseFrontmatter<TData extends MattrAllowedTypes>(
  input: string,
): FrontmatterResult<TData> {
  const lines = input.split("\n");
  // If the input doesn't start with the delimitter just return empty data with content
  if (lines[0]?.trim() !== FRONTMATTER_DELIMITTER)
    return {
      data: EMPTY_OBJECT as MattrData<TData>,
      content: input.trim(),
    };

  const endIndex = lines.findIndex(
    (line, index) => index > 0 && line.trim() === FRONTMATTER_DELIMITTER,
  );

  // If no end delimitter was found throw an error
  if (endIndex === -1)
    throw new MattrParseError("Unclosed YAML frontmatter block");

  // Get the start of the actual frontmatter, after delimtter
  const start = FRONTMATTER_DELIMITTER.length;

  // Find the end of the frontmatter based on the delimitter
  const end = input.indexOf(`\n${FRONTMATTER_DELIMITTER}`, start);

  // Get start and end index of frontmatter
  const yamlStart = start + 1;
  const yamlEnd = end;

  // Get the YAML itself
  const yamlContent = input.slice(yamlStart, yamlEnd);

  // Get the start index of the content
  const contentStart = end + `\n${FRONTMATTER_DELIMITTER}`.length;

  // Cut out the content
  const content = input.slice(contentStart).replace(/^\s+/, "").trim();

  try {
    // Parse YAML to JSON
    const parsed = parseYaml(yamlContent);

    // When successfully parsed, return data
    return {
      data: (parsed ?? EMPTY_OBJECT) as MattrData<TData>,
      content,
    };
  } catch (error) {
    // If not successfully parsed, throw an error to let the user know
    throw new MattrParseError("Failed to parse frontmatter", {
      cause: error,
    });
  }
}
