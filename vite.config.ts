import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import devServer from "@hono/vite-dev-server"
import { UserConfig } from 'vite'
import fs from 'fs'

const config: UserConfig = {
  plugins: [
    react(),
    vike(),
    devServer({
      entry: "./server/index.ts",
      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/
      ],
      injectClientScript: false,
    }),
  ],
  server: {
    host: '0.0.0.0', // This allows access from any hostname that points to your machine
    port: 3000,      // Sets the port to 3000
    https: {
      key: fs.readFileSync('server/server.key'),
      cert: fs.readFileSync('server/server.crt')
    }
  }
}

export default config