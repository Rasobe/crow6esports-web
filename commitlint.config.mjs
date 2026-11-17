export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      1,
      "always",
      ["seo", "news", "team", "coaching", "i18n", "ui", "deps", "ci", "config"],
    ],
    "header-max-length": [2, "always", 100],
  },
};
