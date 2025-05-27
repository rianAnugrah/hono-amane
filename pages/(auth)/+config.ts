import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
// https://vike.dev/config
export default {
  // https://vike.dev/clientRouting
  extends: vikeReact,
  clientRouting: true,
  // https://vike.dev/meta
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: true, client: true },
    },
    // Define new setting 'description'
    description: {
      env: { server: true, client: true },
    },
    Layout: {
      env: { server: true, client: true },
    },
  },
  hydrationCanBeAborted: true,
} satisfies Config;
