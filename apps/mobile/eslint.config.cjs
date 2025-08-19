const defineConfig = require("eslint/config").defineConfig;
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  { ignores: ["dist", ".expo/*", ".wrangler/*", "node_modules/*"] },
  expoConfig,
  eslintPluginPrettierRecommended,
]);
