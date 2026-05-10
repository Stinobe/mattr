import { z } from "zod";
import { validateSchema } from "@lib/helpers";
import { describe, expect, it } from "vitest";

const schema = z.object({ title: z.string() });
const data = { title: "Hello World" };

describe("validate schema", () => {
  it("should return valid data", () => {
    const validated = validateSchema(schema, data);

    expect(validated).toEqual(data);
  });

  it("should throw an error for invalid schema", () => {
    expect(() => validateSchema(schema, {})).toThrow(
      "Frontmatter schema validation failed",
    );
  });
});
