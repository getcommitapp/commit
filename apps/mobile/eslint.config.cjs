const defineConfig = require("eslint/config").defineConfig;
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const expoConfig = require("eslint-config-expo/flat");
const globals = require("globals");

module.exports = defineConfig([
  { ignores: ["dist", ".expo/*", ".wrangler/*", "node_modules/*"] },
  expoConfig,
  {
    files: [
      "**/__tests__/**/*.{js,jsx,ts,tsx}",
      "**/*.{test,spec}.{js,jsx,ts,tsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  eslintPluginPrettierRecommended,
]);
