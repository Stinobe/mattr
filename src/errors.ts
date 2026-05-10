export class MattrParseError extends Error {
  override name = "MattrParseError";

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class MattrSchemaError extends Error {
  override name = "MattrSchemaError";

  readonly issues: unknown;

  constructor(message: string, issues: unknown) {
    super(message);
    this.issues = issues;
  }
}

export class MattrExcerptError extends Error {
  override name = "MattrExcerptError";

  constructor(message: string) {
    super(message);
  }
}
