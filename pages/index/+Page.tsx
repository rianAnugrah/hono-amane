import React, { useEffect } from "react";
import { navigate } from "vike/client/router";
import { useAuth } from "@/hooks/useAuth";
import { AuthLoader } from "@/components/ui/AuthLoader";

export function Page() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuth();

  useEffect(() => {
    const handleRedirect = async () => {
      // Initialize auth first
      await initializeAuth();
      
      // Redirect based on authentication status
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    };

    handleRedirect();
  }, [isAuthenticated, initializeAuth]);

  // Show loading screen while determining authentication status
  if (isLoading) {
    return <AuthLoader message="Checking authentication status..." />;
  }

  return <AuthLoader message="Redirecting..." />;
} 