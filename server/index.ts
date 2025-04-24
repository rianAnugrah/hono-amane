import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { renderPage } from "vike/server";
import { serveStatic } from "@hono/node-server/serve-static";
import { compress } from "hono/compress";
import assetRoutes from "./routes/assets";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload"; // Import route upload
import { env } from "../config/env";
import users from "./routes/users";

import detailsLocationRoute from "./routes/location-details";
import projectCodeRoute from "./routes/project-codes";
import locationRoute from "./routes/locations";

const isProduction = process.env.NODE_ENV === "production";
const port = Number(env.APP_PORT);
const app = new Hono();

app.use(compress());

if (isProduction) {
  app.use(
    "/*", 
    serveStatic({
      root: `./dist/client/`,
    })
  );
}

// API routes
app.route("/api/assets", assetRoutes);
app.route("/api/auth", authRoutes);
app.route("/api/upload", uploadRoutes); // Tambahkan route upload
app.route("/api/users", users); // Tambahkan route upload
app.route("/api/locations", locationRoute); // Tambahkan route upload
app.route("/api/locations-details", detailsLocationRoute); // Tambahkan route upload
app.route("/api/project-codes", projectCodeRoute); // Tambahkan route upload

// Serve uploaded files statically
app.use('/uploads/*', serveStatic({ root: './' }));

app.get("*", async (c, next) => {
  const pageContextInit = {
    urlOriginal: c.req.url,
  };
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;
  
  if (!httpResponse) {
    return next();
  } else {
    const { body, statusCode, headers } = httpResponse;
    headers.forEach(([name, value]) => c.header(name, value));
    c.status(statusCode);
    return c.body(body);
  }
});

if (isProduction) {
  console.log(`Server listening on http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port: port,
  });
}

export default app;