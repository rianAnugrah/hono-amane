import { Hono } from "hono";
import { crypto, urlCrypto } from "../utils/crypto";
import { env } from "@/config/env";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";

const authRoutes = new Hono();

// Authentication route for login
authRoutes.get("/login", async (c) => {
  const api_data_host = env.API_HOST;
  const endpoint = "api/azure/auth?redirect=";
  const redirect_url = `${env.VITE_URL}:${env.APP_PORT}`;
  
  try {
    const url = urlCrypto.encrypt(`${api_data_host}${endpoint}${redirect_url}`);
    
    // Clear any existing session
    deleteCookie(c, "hcmlSession", {
      path: "/",
      secure: true,
      domain: env.APP_DOMAIN,
      httpOnly: true, // Add httpOnly flag for security
    });

    return c.redirect(url, 302);
  } catch (error) {
    return c.json(
      {
        error: "Authentication failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// Token decryption endpoint with validation
authRoutes.post("/decrypt", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.token) {
      return c.json({ error: "Missing token" }, 400);
    }

    const decrypted = crypto.decrypt(body.token);
    
    // Parse and validate the decrypted data
    const userData = JSON.parse(decrypted);
    
    // Check token expiration if timestamp exists
    if (userData.exp && new Date(userData.exp) < new Date()) {
      return c.json({ error: "Token expired" }, 401);
    }
    
    // Add timestamp for when this token was used
    userData.lastVerified = new Date().toISOString();

    return c.json(userData, 200);
  } catch (error) {
    console.error("Error during token verification");
    return c.json({ 
      error: "Invalid token",
      status: "unauthorized" 
    }, 401);
  }
});

// Logout endpoint
authRoutes.get("/logout", async (c) => {
  deleteCookie(c, "hcmlSession", {
    path: "/",
    secure: true,
    domain: env.APP_DOMAIN,
    httpOnly: true,
  });
  
  return c.json({ success: true, message: "Logged out successfully" });
});

export default authRoutes;
