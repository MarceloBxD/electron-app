import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: { globals: globals.browser },
    env: {
      commonjs: true,
      node: true,
    },
    rules: {},
    extends: ["airbnb-base"],
    globals: {
      Atomic: "readonly",
      SharedArrayBuffer: "readonly",
    },
    parserOption: {
      ecmaVersion: 2021,
    },
  },
  pluginJs.configs.recommended,
];
