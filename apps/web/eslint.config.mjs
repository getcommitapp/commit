import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  { ignores: [".astro/*", ".wrangler/*", "node_modules/*"] },
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"], // In CommonJS, the `flat/` prefix is required.
  eslintPluginPrettierRecommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
]);
