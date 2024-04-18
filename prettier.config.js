/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import ('@ianvs/prettier-plugin-sort-imports').PrettierConfig} */
const config = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    /**
     * prettier-plugin-tailwindcss must be imported last
     * due to conflicts with shared api usage
     */
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "<TYPES>^react$",
    "<TYPES>^(node:)",
    "<TYPES>",
    "<TYPES>^[.]",
    "",
    "<BUILT_IN_MODULES>",
    "",
    "^react$",
    "<THIRD_PARTY_MODULES>",
    "",
    "^~/.*$",
    "",
    "^[.]",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  tailwindFunctions: ["cva", "clsx", "cn", "twmerge"],
};

export default config;
