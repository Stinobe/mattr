import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    compilerOptions: {
      ignoreDeprecations: "6.0", // TODO: Remove when `tsup` released fix
    },
  },
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: true,
  target: "es2022",
  external: ["zod"],
});
