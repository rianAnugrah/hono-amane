import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { renderPage } from "vike/server";
import { serveStatic } from "@hono/node-server/serve-static";
import { compress } from "hono/compress";
import { createServer } from 'http';
import assetRoutes from "./routes/assets";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
import { env } from "../config/env";
import users from "./routes/users";
import { authMiddleware } from "./middleware/auth";

import detailsLocationRoute from "./routes/location-details";
import projectCodeRoute from "./routes/project-codes";
import locationRoute from "./routes/locations";
import statRoutes from "./routes/stats";
import assetAuditRoute from "./routes/asset-audit";
import inspectionRoutes from "./routes/inspections";
import { Readable } from 'stream';
import { initWebSocketServer, wsConnections } from './websocket';
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

// REST API endpoint to trigger real-time updates
app.post('/api/broadcast', async (c) => {
  const data = await c.req.json();
  
  // Broadcast to all connected WebSocket clients
  const message = JSON.stringify({
    type: 'broadcast',
    data: data,
    timestamp: new Date().toISOString()
  });
  
  wsConnections.forEach(ws => {
    if (ws.readyState === 1) { // WebSocket.OPEN
      try {
        ws.send(message);
      } catch (error) {
        console.error('Error sending message to WebSocket:', error);
        wsConnections.delete(ws);
      }
    } else {
      wsConnections.delete(ws);
    }
  });
  
  return c.json({
    success: true,
    message: 'Message broadcasted to all connected clients',
    connectedClients: wsConnections.size
  });
});

// Sample real-time data generator endpoint
app.get('/api/sample/start-feed', async (c) => {
  // Generate sample data every 2 seconds
  const interval = setInterval(() => {
    const sampleData = {
      type: 'sample_data',
      data: {
        id: Math.random().toString(36).substr(2, 9),
        temperature: (Math.random() * 50 + 10).toFixed(2),
        humidity: (Math.random() * 100).toFixed(2),
        pressure: (Math.random() * 50 + 950).toFixed(2),
        location: {
          lat: -6.2 + (Math.random() - 0.5) * 0.1,
          lng: 106.8 + (Math.random() - 0.5) * 0.1
        },
        status: Math.random() > 0.8 ? 'alert' : 'normal'
      },
      timestamp: new Date().toISOString()
    };
    
    const message = JSON.stringify(sampleData);
    
    wsConnections.forEach(ws => {
      if (ws.readyState === 1) { // WebSocket.OPEN
        try {
          ws.send(message);
        } catch (error) {
          console.error('Error sending sample data:', error);
          wsConnections.delete(ws);
        }
      } else {
        wsConnections.delete(ws);
      }
    });
    
    // Stop after 60 seconds (30 messages)
    if (Date.now() % 60000 < 2000) {
      clearInterval(interval);
    }
  }, 2000);
  
  return c.json({
    success: true,
    message: 'Sample data feed started',
    connectedClients: wsConnections.size
  });
});

// Get WebSocket connection status
app.get('/api/ws/status', async (c) => {
  return c.json({
    connectedClients: wsConnections.size,
    status: 'running'
  });
});

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
protectedApi.route("/inspections", inspectionRoutes);

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

// Create HTTP server and WebSocket server
const server = createServer();
initWebSocketServer(server);

// Handle HTTP requests with Hono
server.on('request', async (req, res) => {
  // Convert Node headers to Fetch Headers
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      headers.set(key, value.join(', '));
    } else if (value !== undefined) {
      headers.set(key, value);
    }
  }

  // Only use body for non-GET/HEAD requests
  let body: ReadableStream<Uint8Array> | undefined = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (typeof Readable !== 'undefined' && typeof Readable.toWeb === 'function') {
      // @ts-expect-error Node.js Readable.toWeb is not in types for all Node versions
      body = Readable.toWeb(req);
    } else {
      body = undefined;
    }
  }

  const request = new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method,
    headers,
    body,
  });

  const honoResponse = await app.fetch(request);

  res.statusCode = honoResponse.status;
  honoResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const arrayBuffer = await honoResponse.arrayBuffer();
  res.end(Buffer.from(arrayBuffer));
});

server.listen(port, () => {
  console.log(`Server with WebSocket listening on http://localhost:${port}`);
});


export default app;