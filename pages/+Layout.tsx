import React, { useEffect, useRef } from "react";
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
  
  // Check if current page is an auth page
  const isCurrentlyAuthPage = isAuthRoute(pageContext.urlPathname || '');

  // Initialize authentication state on mount and route changes
  useEffect(() => {
    // Only initialize auth for non-auth pages
    // Auth pages handle their own authentication logic
    if (!isCurrentlyAuthPage) {
      initializeAuth();
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

  // For protected pages, render with navigation
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