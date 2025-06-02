import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Basic configuration with client-side routing
export default {
  extends: vikeReact,
  clientRouting: true,
  meta: {
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },
    guard: {
      env: { server: true, client: true },
    },
    Layout: {
      env: { server: true, client: true },
    },
  },
  hydrationCanBeAborted: true,
} satisfies Config;