import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { crypto } from "../utils/crypto";

/**
 * Authentication middleware that verifies the user's session token
 * before allowing access to protected routes.
 */
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    // Get session cookie
    const sessionToken = getCookie(c, "hcmlSession");
    
    if (!sessionToken) {
      return c.json({ 
        error: "Authentication required", 
        status: "unauthorized" 
      }, 401);
    }
    
    try {
      // Decrypt and parse token
      const decrypted = crypto.decrypt(sessionToken);
      const userData = JSON.parse(decrypted);
      
      // Check token expiration
      if (userData.exp && new Date(userData.exp) < new Date()) {
        return c.json({ 
          error: "Session expired", 
          status: "unauthorized" 
        }, 401);
      }
      
      // Store user data in context for route handlers to use
      c.set("user", userData);
      
      // Continue to next middleware or route handler
      await next();
    } catch (error) {
      console.error("Error during token verification" , error);
      return c.json({ 
        error: "Invalid session", 
        status: "unauthorized" 
      }, 401);
    }
  } catch (error) {
    console.error("Error during token verification" , error);
    return c.json({ 
      error: "Internal server error", 
      status: "error" 
    }, 500);
  }
};

/**
 * Role-based authorization middleware
 * @param allowedRoles - Array of roles allowed to access the route
 */
export const roleMiddleware = (allowedRoles: string[]): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get("user");
    
    if (!user || !user.role) {
      return c.json({ 
        error: "Unauthorized access", 
        status: "forbidden" 
      }, 403);
    }
    
    if (!allowedRoles.includes(user.role)) {
      return c.json({ 
        error: "Insufficient permissions", 
        status: "forbidden" 
      }, 403);
    }
    
    await next();
  };
};

// Export combined middleware for admin-only routes
export const adminOnly = [
  authMiddleware,
  roleMiddleware(["admin"])
];

// Export combined middleware for routes that allow both admin and regular users
export const authenticatedUser = [
  authMiddleware,
  roleMiddleware(["admin", "user", "read_only"])
]; 