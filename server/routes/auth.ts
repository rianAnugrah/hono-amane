import { Hono } from "hono";
import { crypto, urlCrypto } from "../utils/crypto";
import { env } from "@/config/env";
import {
  getCookie,
  deleteCookie,
} from "hono/cookie";
import { PrismaClient } from "@prisma/client";

const authRoutes = new Hono();
const prisma = new PrismaClient();

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
    console.error("Error during token verification" , error);
    return c.json({ 
      error: "Invalid token",
      status: "unauthorized" 
    }, 401);
  }
});

// Verify session token from cookie
authRoutes.post("/verify", async (c) => {
  try {
    // Get session cookie
    const sessionToken = getCookie(c, "hcmlSession");
    
    if (!sessionToken) {
      return c.json({ error: "No active session" }, 401);
    }
    
    try {
      // Decrypt the token
      const decrypted = crypto.decrypt(sessionToken);
      const sessionData = JSON.parse(decrypted);
      
      // Check token expiration if timestamp exists
      if (sessionData.exp && new Date(sessionData.exp) < new Date()) {
        // Clear invalid cookie
        deleteCookie(c, "hcmlSession", {
          path: "/",
          secure: true,
          domain: env.APP_DOMAIN,
          httpOnly: true,
        });
        return c.json({ error: "Session expired" }, 401);
      }
      
      // Fetch complete user profile from database if we have an email
      if (sessionData.email) {
        try {
          const userProfile = await prisma.users.findUnique({
            where: { email: sessionData.email.toLowerCase() },
            include: {
              userLocations: {
                include: { location: true }
              }
            }
          });
          
          if (userProfile) {
            // Merge session data with complete user profile
            const completeUserData = {
              ...sessionData,
              id: userProfile.id,
              email: userProfile.email,
              name: userProfile.name || sessionData.name,
              role: userProfile.role,
              location: userProfile.userLocations?.map(ul => ul.location) || [],
              lastVerified: new Date().toISOString(),
            };
            
            return c.json(completeUserData, 200);
          } else {
            // User not found in database, return session data with default role
            const userData = {
              ...sessionData,
              role: sessionData.role || 'read_only',
              location: sessionData.location || [],
              lastVerified: new Date().toISOString(),
            };
            
            return c.json(userData, 200);
          }
        } catch (dbError) {
          console.warn('Database lookup failed during session verification:', dbError);
          // Fallback to session data with default role
          const userData = {
            ...sessionData,
            role: sessionData.role || 'read_only',
            location: sessionData.location || [],
            lastVerified: new Date().toISOString(),
          };
          
          return c.json(userData, 200);
        }
      } else {
        // No email in session data, return what we have
        const userData = {
          ...sessionData,
          lastVerified: new Date().toISOString(),
        };
        
        return c.json(userData, 200);
      }
    } catch (error) {
      // Clear invalid cookie
      deleteCookie(c, "hcmlSession", {
        path: "/",
        secure: true,
        domain: env.APP_DOMAIN,
        httpOnly: true,
      });
      return c.json({ error: "Invalid session" , errorMessage: error }, 401);
    }
  } catch (error) {
    return c.json({ error: "Session verification failed" , errorMessage: error }, 500);
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
