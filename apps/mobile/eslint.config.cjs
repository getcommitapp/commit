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
  {
    plugins: {
      ts: require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "ts/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
]);
