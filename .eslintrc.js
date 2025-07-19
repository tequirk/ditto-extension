module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  globals: {
    defineProps: "readonly",
  },
  plugins: ["vue", "html", "simple-import-sort", "sort-keys-fix"],
  rules: {
    "no-undef": "off", // dom types don't work with this on
    "no-use-before-define": "error",
    "require-await": "error",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
    "sort-keys-fix/sort-keys-fix": "error",
    "vue/multi-word-component-names": "off",
  },
};
