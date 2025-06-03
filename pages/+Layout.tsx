import React, { useEffect, useRef } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { Link } from "@/renderer/Link";
import "@/renderer/css/index.css";
import "@/renderer/PageShell.css";
import Navbar from "@/components/ui/navigation";
import TopBar from "@/components/ui/top-bar";
import autoAnimate from "@formkit/auto-animate";
import { useUserStore } from "@/stores/store-user-login";
import axios from "axios";

// Define protected URL patterns
const PROTECTED_PATTERNS = [
  '/asset',
  '/category',
  '/dashboard',
  '/location',
  '/qr-scanner',
  '/report',
  '/user',
  '/audit',
  '/testapi',
  '/(protected)',
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const parent = useRef(null);
  const { email, name, isAuth, set_user, location, role, id } = useUserStore();
  const sessionCheckedRef = useRef(false);
  const pageContext = usePageContext();
  
  // Check if current page is public or requires auth
  const isAuthPage = pageContext.urlPathname?.includes('(auth)');
  
  // Check if URL is protected using multiple patterns
  const isProtectedPage = React.useMemo(() => {
    if (!pageContext.urlPathname) return false;
    
    return PROTECTED_PATTERNS.some(pattern => {
      // Check for exact match or subdirectory of protected pattern
      return pageContext.urlPathname === pattern || 
             pageContext.urlPathname.startsWith(`${pattern}/`) ||
             (pattern.includes('(') && pageContext.urlPathname.includes(pattern));
    });
  }, [pageContext.urlPathname]);

  // Check session on page load and navigation
  useEffect(() => {
    const checkSession = async () => {
      try {
        // If already authenticated, don't recheck unnecessarily
        if (isAuth && email) {
          console.log(`User already authenticated: ${email}`);
          return;
        }
        
        console.log("Checking session cookie...");
        
        // Get session from cookie
        const cookies = document.cookie.split(";");
        const hcmlSessionCookie = cookies.find((cookie) =>
          cookie.trim().startsWith("hcmlSession=")
        );
        const hcmlSessionValue = hcmlSessionCookie
          ? hcmlSessionCookie.split("=")[1]
          : null;
        
        if (hcmlSessionValue) {
          console.log("Session cookie found, verifying with server...");
          // Verify token on server
          const response = await fetch("/api/auth/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Important for cookies
          });
          
          if (response.ok) {
            const userData = await response.json();
            if (userData && !userData.error) {
              console.log(`Session verified for user: ${userData.email}`);
              set_user({
                email: userData.email || "",
                name: userData.name || "",
                isAuth: true,
                role: userData.role || "",
                location: userData.location || [],
                id: userData.id || "",
              });
              sessionCheckedRef.current = true;
              return;
            }
          } else {
            console.warn("Session verification failed:", response.status);
          }
        } else {
          console.log("No session cookie found");
        }
        
        if (isProtectedPage) {
          // Only redirect if we're sure there's no session
          console.log("No valid session found, redirecting to login");
          sessionCheckedRef.current = true;
          window.location.href = '/login';
        }
      } catch (error) {
        console.error("Session verification error:", error);
        // Don't redirect on error to prevent logout loops
      }
    };
    
    checkSession();
  }, [pageContext.urlPathname, isAuth, email, set_user, isProtectedPage]);
  
  // Only redirect if not authenticated and trying to access protected page
  // after we've verified the session status
  useEffect(() => {
    if (sessionCheckedRef.current && isProtectedPage && !isAuth) {
      window.location.href = '/login';
    }
  }, [isProtectedPage, isAuth]);
  
  useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current);
    }
  }, [parent]);

  useEffect(() => {
    if (email && isAuth) {
      checkUserProfile(email, name);
    }
  }, [email, isAuth]);

  const checkUserProfile = async (email: string, name?: string, retryCount = 0) => {
    if (!email) return;

    console.log(`Checking user profile for: ${email} (attempt ${retryCount + 1})`);

    try {
      // Check if user exists in our system
      const { data } = await axios.get(
        `/api/users/by-email/${email.toLowerCase()}`
      );

      if (data) {
        console.log(`User found in database: ${data.email}, role: ${data.role}`);
        const authData = {
          email: data.email.toLowerCase(),
          name: data.name,
          isAuth: true,
          location: data.userLocations,
          role: data.role,
          id: data.id,
        };
        set_user(authData);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 404) {
          console.log(`User not found in database, attempting auto-registration for: ${email}`);
          // User not found - auto register with read_only permissions
          try {
            const response = await axios.post('/api/users/register-request', {
              email: email.toLowerCase(),
              name: name || '',
            });
            
            if (response.status === 201 && response.data.user) {
              const newUser = response.data.user;
              console.log(`User auto-registered successfully: ${newUser.email}, role: ${newUser.role}`);
              // Set user data with the newly registered user
              set_user({
                email: newUser.email.toLowerCase(),
                name: newUser.name,
                isAuth: true,
                location: newUser.userLocations,
                role: newUser.role,
                id: newUser.id,
              });
              return;
            }
            
            // If registration was unsuccessful, redirect to unauthorized
            console.error("Auto-registration failed, redirecting to unauthorized");
            window.location.href = '/unauthorized';
          } catch (registerError) {
            console.error("Error during auto-registration", registerError);
            window.location.href = '/unauthorized';
          }
        } else if (status === 401 || status === 403) {
          // Only redirect to unauthorized for actual authorization errors
          console.error("User authorization error, redirecting to unauthorized");
          window.location.href = '/unauthorized';
        } else {
          // For other errors (network, server errors, etc.), retry up to 2 times
          const isRetryableError = !status || status >= 500;
          
          if (isRetryableError && retryCount < 2) {
            console.warn(`Retrying user profile check (attempt ${retryCount + 1}/3):`, err.message);
            // Retry after a short delay
            setTimeout(() => {
              checkUserProfile(email, name, retryCount + 1);
            }, 1000 * (retryCount + 1)); // Exponential backoff: 1s, 2s
            return;
          }
          
          // After max retries or for non-retryable errors, log but don't redirect
          console.error("Error checking user profile (non-critical):", err.message);
          // Keep the user authenticated with the session data we already have
          // The session verification already set basic user data
          
          // As a fallback, ensure the user has at least basic access with session data
          // This prevents registered users from being locked out due to database issues
          if (!role || !id) {
            console.warn("Applying fallback user permissions due to database lookup failure");
            set_user({
              email: email.toLowerCase(),
              name: name || email.split('@')[0],
              isAuth: true,
              location: [],
              role: "read_only", // Fallback to read-only access
              id: `fallback_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            });
          }
        }
      } else {
        console.error("Non-Axios error checking user profile:", err);
      }
    }
  };

  return (
    <div className="w-full h-[100svh] relative flex bg-gray-100">
      <Navbar />
      <div className="w-full md:w-full flex flex-col h-[100vh]">
        <div
          className="flex w-full flex-col max-h-[calc(100svh_-_0rem)] overflow-y-auto md:p-0 "
          ref={parent}
        >
          {/* Scrollable Content */}
          <div className="overflow-y-auto bg-gray-100 rounded-b-lg pb-0 lg:pb-0 ">{children}</div>
        </div>
      </div>
    </div>
  );
} 