export { PageShell };

import React, { useEffect, useRef } from "react";
import logoUrl from "./logo.svg";
import { PageContextProvider } from "./usePageContext";
import { Link } from "./Link";
import type { PageContext } from "vike/types";
import "./css/index.css";
import "./PageShell.css";
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

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  const parent = useRef(null);
  const { email, name, isAuth, set_user, location, role } = useUserStore();
  const sessionCheckedRef = useRef(false);
  
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
          return;
        }
        
        // Get session from cookie
        const cookies = document.cookie.split(";");
        const hcmlSessionCookie = cookies.find((cookie) =>
          cookie.trim().startsWith("hcmlSession=")
        );
        const hcmlSessionValue = hcmlSessionCookie
          ? hcmlSessionCookie.split("=")[1]
          : null;
        
        if (hcmlSessionValue) {
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
              set_user({
                email: userData.email || "",
                name: userData.name || "",
                isAuth: true,
                role: userData.role || "",
                location: userData.location || []
              });
              sessionCheckedRef.current = true;
              return;
            }
          }
        }
        
        if (isProtectedPage) {
          // Only redirect if we're sure there's no session
          sessionCheckedRef.current = true;
          window.location.href = '/login';
        }
      } catch (error) {
        console.error("Session verification error");
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
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    if (email && isAuth) {
      checkUserProfile(email, name);
    }
  }, [email, isAuth]);

  const checkUserProfile = async (email: string, name?: string) => {
    if (!email) return;

    try {
      // Check if user exists in our system
      const { data } = await axios.get(
        `/api/users/by-email/${email.toLowerCase()}`
      );

      if (data) {
        const authData = {
          email: data.email,
          name: data.name,
          isAuth: true,
          location: data.userLocations,
          role: data.role,
        };
        set_user(authData);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        // User not found - auto register with read_only permissions
        try {
          const response = await axios.post('/api/users/register-request', {
            email: email.toLowerCase(),
            name: name || '',
          });
          
          if (response.status === 201 && response.data.user) {
            const newUser = response.data.user;
            // Set user data with the newly registered user
            set_user({
              email: newUser.email,
              name: newUser.name,
              isAuth: true,
              location: newUser.userLocations,
              role: newUser.role,
            });
            return;
          }
          
          // If registration was unsuccessful, redirect to unauthorized
          window.location.href = '/unauthorized';
        } catch (registerError) {
          console.error("Error during auto-registration", registerError);
          window.location.href = '/unauthorized';
        }
      } else {
        console.error("Error checking user profile");
        window.location.href = '/unauthorized';
      }
    }
  };

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>
          <Navbar />
          <div className="w-full md:w-[calc(100%_-_10rem)] flex flex-col h-full">
            <div
              className="flex w-full flex-col max-h-[calc(100svh_-_0rem)] overflow-y-auto md:p-4 "
              ref={parent}
            >
              {/* Fixed TopBar */}
              <div className="sticky top-0 z-10 bg-gray-100 rounded-t-lg">
                <TopBar />
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto  bg-gray-100 rounded-b-lg pb-10">{children}</div>
            </div>
          </div>
        </Layout>
      </PageContextProvider>
    </React.StrictMode>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-[100svh] relative flex bg-gradient-to-br from-cyan-950 to-blue-950">
      {children}
    </div>
  );
}
