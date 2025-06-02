// @ts-nocheck

import eslint from "@eslint/js";
import react from "eslint-plugin-react/configs/recommended.js";
// Alternative: Define globals manually if package issues persist
// import globals from "globals/index.js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/*",
      // Temporary compiled files
      "**/*.ts.build-*.mjs",

      // JS files at the root of the project
      "*.js",
      "*.cjs",
      "*.mjs",
      
      // Generated Prisma files
      "generated/**/*",
      "prisma/generated/**/*",
      "prisma/seed.js",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        1,
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-namespace": 0,
    },
  },

  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...react,
    languageOptions: {
      ...react.languageOptions,
      globals: {
        // Manual globals definition as alternative
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        // Service Worker globals
        self: "readonly",
        caches: "readonly",
        clients: "readonly",
        registration: "readonly",
        skipWaiting: "readonly",
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },
    
    rules: {
      // Disable react-in-jsx-scope since we're using the new JSX Transform
      "react/react-in-jsx-scope": "off",
      // Disable prop-types since we're using TypeScript
      "react/prop-types": "off",
    },
  },
);