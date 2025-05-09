import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
// https://vike.dev/config
export default {
  // https://vike.dev/clientRouting
  extends: vikeReact,
  clientRouting: false,
  // https://vike.dev/meta
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: false, client: true },
    },
    // Define new setting 'description'
    description: {
      env: { server: true },
    },
    Layout: {
      env: { server: true, client: true },
    },
  },
  hydrationCanBeAborted: true,
} satisfies Config;
