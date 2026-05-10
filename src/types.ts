import type { output, ZodType } from "zod";

export type MattrAllowedTypes = ZodType | Record<string, unknown>;

export interface ExcerptContext {
  readonly raw: string;
  readonly content: string;
}

export interface ExcerptFunctionOptions {
  readonly length?: ParseOptions["excerptLength"];
  readonly separator?: ParseOptions["excerptSeparator"];
  readonly removeMarkup?: ParseOptions["removeExcerptMarkup"];
}

export type ExcerptFunction = (
  context: ExcerptContext,
  options: ExcerptFunctionOptions,
) => string;

export interface ParseOptionsBase {
  readonly excerptSeparator?: string;
  readonly excerptLength?: number;
  readonly excerpt?: ExcerptFunction | boolean;
  readonly removeExcerptMarkup?: boolean;
}

export interface ParseOptionsWithSchema<
  TSchema extends ZodType,
> extends ParseOptionsBase {
  readonly schema?: TSchema;
}

export type ParseOptions<
  TSchema extends MattrAllowedTypes = Record<string, unknown>,
> = TSchema extends ZodType
  ? ParseOptionsWithSchema<TSchema>
  : ParseOptionsBase;

export type MattrExpectedType<
  T extends MattrAllowedTypes = Record<string, unknown>,
> = T;

export type MattrData<T extends MattrAllowedTypes = Record<string, unknown>> =
  T extends ZodType ? output<T> : T;

export interface ParsedFile<
  TData extends MattrAllowedTypes = Record<string, unknown>,
> {
  readonly data: Readonly<MattrData<TData>>;
  readonly content: string;
  readonly excerpt: string | null;
  readonly raw: string;
}
