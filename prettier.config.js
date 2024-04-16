/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import ('@ianvs/prettier-plugin-sort-imports').PrettierConfig} */
const config = {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  importOrder: [
    "<TYPES>^(node:)",
    "<TYPES>",
    "<TYPES>^[.]",
    "",
    "^react$",
    "",
    "<BUILT_IN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^~/.*$",
    "",
    "^[.]",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
};

export default config;
