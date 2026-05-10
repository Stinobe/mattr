import type { ZodType } from "zod";
import { MattrSchemaError } from "@lib/errors";
import type { MattrAllowedTypes, MattrData } from "./types";

export function validateSchema<TData extends MattrAllowedTypes>(
  schema: ZodType,
  data: MattrData<TData>,
) {
  const result = schema.safeParse(data);

  if (!result.success)
    throw new MattrSchemaError(
      "Frontmatter schema validation failed",
      result.error.issues,
    );

  return result.data as MattrData<TData>;
}
