export { parse as mattr } from "@lib/parse";

export {
  MattrParseError,
  MattrSchemaError,
  MattrExcerptError,
} from "@lib/errors";

export type {
  ParsedFile as MattrFile,
  ExcerptFunction as MattrExcerptFn,
  ParseOptions as MattrOptions,
  MattrData,
  MattrAllowedTypes,
} from "@lib/types";
