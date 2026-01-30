module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-tailwindcss"],
  ignoreFiles: ["dist/**", "node_modules/**"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["tailwind", "apply", "layer", "config"],
      },
    ],

    /* Preferências do projeto (mantemos legibilidade) */
    "at-rule-empty-line-before": null,
    "custom-property-empty-line-before": null,

    /* Mantém @media min-width tradicional */
    "media-feature-range-notation": null,
  },
};
