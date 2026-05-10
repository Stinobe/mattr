import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    name: "@stinobe/mattr",
    exclude: [...configDefaults.exclude, "./dist", "./mocks"],
    include: ["tests/**/*"],
  },
});
