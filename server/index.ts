import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { renderPage } from "vike/server";
import { serveStatic } from "@hono/node-server/serve-static";
import { compress } from "hono/compress";
import assetRoutes from "./routes/assets";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import { env } from "../config/env";
import users from "./routes/users";
import { authMiddleware, roleMiddleware } from "./middleware/auth";

import detailsLocationRoute from "./routes/location-details";
import projectCodeRoute from "./routes/project-codes";
import locationRoute from "./routes/locations";
import statRoutes from "./routes/stats";
import assetAuditRoute from "./routes/asset-audit";

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

// Public API routes (no authentication required)
app.route("/api/auth", authRoutes);

// Create API group with authentication middleware
const protectedApi = new Hono()
  .use("*", authMiddleware);
  // .use("*", roleMiddleware(["admin", "user", "read_only"]));

// Protected API routes
protectedApi.route("/assets", assetRoutes);
protectedApi.route("/upload", uploadRoutes);
protectedApi.route("/users", users);
protectedApi.route("/locations", locationRoute);
protectedApi.route("/locations-details", detailsLocationRoute);
protectedApi.route("/project-codes", projectCodeRoute);
protectedApi.route("/stats", statRoutes);
protectedApi.route("/asset-audit", assetAuditRoute);

// Mount the protected API group
app.route("/api", protectedApi);

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