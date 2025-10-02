import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import sonarjsPlugin from "eslint-plugin-sonarjs";

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
      // Desativa a regra do react-hooks sobre dependências de efeitos para permitir flexibilidade em hooks
      "react-hooks/exhaustive-deps": "off",
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
];

export default eslintConfig;
