# Mattr

A tiny, type-safe Markdown frontmatter parser for modern TypeScript projects. Built for workflows where good typing, predictable APIs, and small utilities go a long way. This package __focuses on the essentials:__ clean ergonomics, minimal overhead, and a developer experience that integrates naturally into content-focused applications and tooling.

## Usage
### Without type safety

```typescript
import { mattr } from "@stinobe/mattr";

try {
    const parsed = mattr(fileContents);
} catch(error) {
    // ...
}
```
___
### With TypeScript

```typescript
import { mattr } from "@stinobe/mattr";

type Schema = {
    title: string;
    description?: string;
}

try {
    const parsed = mattr<Schema>(fileContents);
} catch(error) {
    // ...
}
```
> [!IMPORTANT]
> This only provides type safety during compiling, __not__ during runtime
___ 
### With Zod

```typescript
import { mattr } from "@stinobe/mattr";
import { z } from "zod";

const Schema = z.object({
    title: z.string(),
    description: z.optional(z.string())
})

try {
    // You can specify the type as well
    // but that's not really necessary
    // since it will be inferred from the schema option
    const parsed = mattr(fileContents, { schema: Schema });
} catch(error) {
    // ...
}
``` 
Visit the website for more information about [Zod](https://zod.dev/)

> [!NOTE]
> Zod is not required to use this library

## Options

### `excerpt` _(optional)_
Type: `boolean | ExcerptFunction`  
Default: `true`

Enables and configures excerpt generation.

- `false` - disabled _(ignoring `excerptLength` and `excerptSeparator`)_
- `true` - uses default extration strategy
- `ExcerptFunction` - custom extraction logic [More info](#create-a-custom-excerpt-function)

#### Default strategy
When enabled (`true`), the excerpt is resovled using following rules

1. If `excerptSeparator` is defined, takes content until seperator, otherwise passes entire content to next step
2. If `excerptLength` is defined, limits the number of charactors to the length of the excerpt
3. If none of the above is defined, take first paragraph

### `excerptSeparator` _(optional)_
Type: `string`  
Default: `undefined`

When defined with a non-empty string, takes content from input file after frontmatter untill separator

### `excerptLength` _(optional)_
Type: `number`
Default: `undefined`

Maximum character length of the excerpt. When less than or equal to `0` this will throw an `InvalidExcerptError`.

### `schema` _(optional)_
Type: `ZodType`  
Default: `undefined`

Takes a Zod-schema to validate frontmatter output against

## Customization
### Create a custom excerpt function
I've added and exported a type in case you want to create a custom excerpt function. This contains some data passed on from options by the `mattr` function. 

| `ExcerptFn` param | Description |
|---|---|
|`ctx.raw` | file contents |
|`ctx.content` | file content without frontmatter |
|`options.length` | `excerptLength` passed to `mattr` |
|`options.separator` | `excerptSeparator` passed to `mattr` |

```typescript
import type { MattrExcerptFn } from "@stinobe/mattr";

const myCustomExcerptFunction: MattrExcerptFn = (ctx, excerptOptions) => {
    // Do some magic
    return "a string";
}
```
### Use in a wrapper function
You can also create a wrapper function where one of your parameters is an options object. For example if you would have a function traversing over files

```typescript
import type { MattrOptions, MattrFile, MattrAllowedTypes } from "@stinobe/mattr";

const myGlobFunction = async <T extends MattrAllowedTypes>(globPath: string, options: MattrOptions<T>): MattrFile<T>[] => {
    const posts: MattrFile<T>[] = [];
    for await (const post of glob(globPath)) {
        try {
            const parsed = mattr<T>(post, options);
            posts.push(parsed);
        } catch {
            // Handle errors thrown
        }
    }
    return posts;
}
```
## Erorr handling
In some situations an erorr will be thrown so don't forget to do the handling correct

### MatterParseError
Thrown when:
- A Yaml block in a markdownfile is not closed
- The `parse` function from the `yaml` package has thrown an error.  
  _The error thrown by the `parse` function is passed as cause._

### MattrSchemaError
Thrown when:
- unsuccesful parse of the Zod schema, issues form `safeParse`are passed to the error.

### MattrExcerptError
Thrown when:
- `excerptLength` is smaller than or equal to `0`
