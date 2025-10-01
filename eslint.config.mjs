import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:jsx-a11y/recommended"),

  // Adicione manualmente o plugin sonarjs
  {
    plugins: {
      sonarjs: sonarjsPlugin,
    },
    rules: {
      // Regras principais para detectar duplicação
      "sonarjs/no-identical-functions": "error",

      // Regras adicionais recomendadas
      "sonarjs/cognitive-complexity": ["warn", 15],
      "sonarjs/no-collapsible-if": "warn",
      "sonarjs/no-collection-size-mischeck": "error",
      "sonarjs/no-element-overwrite": "error",
      "sonarjs/no-identical-conditions": "error",
      "sonarjs/no-inverted-boolean-check": "error",
      "sonarjs/no-redundant-boolean": "warn",
      "sonarjs/no-small-switch": "warn",
      "sonarjs/no-useless-catch": "warn",
      "sonarjs/prefer-immediate-return": "warn",
      "sonarjs/prefer-object-literal": "warn",
      "sonarjs/prefer-single-boolean-return": "warn",
      "sonarjs/prefer-while": "warn",
    },
  },

  // Configuração para detectar código não utilizado
  {
    plugins: {
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      // Remove imports não utilizados automaticamente
      "unused-imports/no-unused-imports": "error",

      // Detecta variáveis não utilizadas (incluindo componentes)
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_", // Ignora variáveis que começam com _
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Regras nativas do ESLint para código não utilizado
      "no-unused-vars": "off", // Desativa a regra nativa para usar a do plugin
      "react/no-unused-state": "error",
      "react/no-unused-prop-types": "warn",

      // Detecta componentes não utilizados especificamente
      "@typescript-eslint/no-unused-vars": "off", // Desativa para usar a do plugin
    },
  },

  // Configuração específica para arquivos React
  {
    files: ["**/*.jsx", "**/*.tsx"],
    rules: {
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];

export default eslintConfig;
