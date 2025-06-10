import React, { useEffect, useRef, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import "@/renderer/css/index.css";
import "@/renderer/PageShell.css";
import Navbar from "@/components/ui/navigation";
import autoAnimate from "@formkit/auto-animate";
import { useAuth } from "@/hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const parent = useRef(null);
  const pageContext = usePageContext();
  const { initializeAuth, isAuthRoute } = useAuth();
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Check if current page is an auth page
  const isCurrentlyAuthPage = isAuthRoute(pageContext.urlPathname || '');

  // Initialize authentication state on mount and route changes
  useEffect(() => {
    // Only initialize auth for non-auth pages
    if (!isCurrentlyAuthPage) {
      initializeAuth().then(() => {
        setAuthInitialized(true);
      }).catch((error) => {
        console.error('Layout - Auth initialization failed:', error);
        setAuthInitialized(true); // Still set to true to prevent infinite loading
      });
    } else {
      setAuthInitialized(true);
    }
  }, [pageContext.urlPathname, initializeAuth, isCurrentlyAuthPage]);
  
  useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current);
    }
  }, [parent]);

  // For auth pages, render without navigation
  if (isCurrentlyAuthPage) {
    return <>{children}</>;
  }

  // Show loading state while auth is initializing
  if (!authInitialized) {
    return (
      <div className="w-full h-[100svh] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // For protected pages, render with navigation
  return (
    <div className="w-full h-[100svh] relative flex bg-gray-100 ">
      <Navbar />
      <div className="w-full md:w-full flex flex-col h-[100vh]">
        <div
          className="flex w-full flex-col max-h-[calc(100svh_-_0rem)] overflow-y-auto md:p-0 "
          ref={parent}
        >
          {/* Scrollable Content */}
          <div className="overflow-y-auto bg-gray-100 rounded-b-lg pb-20 lg:pb-0 ">{children}</div>
        </div>
      </div>
    </div>
  );
} 