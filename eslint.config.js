import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      semi: "error",
      "prefer-const": "error",
    },
    files: ["*.js"],
    indent: ["error", "tab"],
  },
  pluginJs.configs.recommended,
];
