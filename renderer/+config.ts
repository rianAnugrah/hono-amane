import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

export default {
  extends: vikeReact, // Uncomment this line!
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
    // Layout is already defined in vike-react, so you don't need to redefine it
  },
  hydrationCanBeAborted: true,
} satisfies Config;